#!/usr/bin/env python3
# /// script
# requires-python = ">=3.12"
# dependencies = ["aiohttp>=3.9"]
# ///
"""
Check links extracted by extract_links.py.

For each link:
  - external: async HEAD request (fall back to GET), follow redirects, capture final URL
  - relative: resolve against the file that contains it, confirm the target exists.
             If a fragment is present, verify it matches a heading in the target.
  - anchor:   verify the fragment matches a heading in the same file.
  - mailto:   pass through (no verification).

Reads the JSON output of extract_links.py. Writes a JSON report that augments
each link entry with status info. Designed to be re-run safely — results are
cached on disk, keyed by URL.

Usage:
    uv run check_links.py <links.json> [--out report.json]
                          [--concurrency 8] [--cache .link_cache.json]
                          [--repo-root <path>] [--timeout 15]
                          [--user-agent "..."] [--no-cache]
"""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path

from external_fetch import DEFAULT_UA, check_external_urls
from link_checks import CheckResult, check_anchor, check_relative


# -------- Caching --------

def load_cache(path: Path) -> dict[str, dict]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except Exception:
        return {}


def save_cache(path: Path, cache: dict[str, dict]) -> None:
    path.write_text(json.dumps(cache, indent=2, ensure_ascii=False), encoding='utf-8')


# -------- Link dispatch --------

def check_local_link(link: dict, repo_root: Path) -> CheckResult:
    """Relative, anchor, mailto — fast, no network, done synchronously."""
    lt = link.get('link_type', '')
    if lt == 'relative':
        return check_relative(link, repo_root)
    if lt == 'anchor':
        return check_anchor(link, repo_root)
    if lt == 'mailto':
        return CheckResult(status='skipped', reason='mailto link')
    return CheckResult(status='skipped', reason=f'unhandled link type: {lt}')


def check_local_links(links: list[dict], repo_root: Path,
                      results: list[dict | None]) -> list[int]:
    """Fill in results for non-external links; return external indices."""
    external_indices: list[int] = []
    for i, link in enumerate(links):
        if link.get('link_type') == 'external':
            external_indices.append(i)
        else:
            results[i] = {**link, 'check': check_local_link(link, repo_root).to_dict()}
    return external_indices


def external_fetch_plan(links: list[dict], external_indices: list[int]) -> dict[str, list[int]]:
    """Dedupe external URLs so we don't hit the same URL multiple times."""
    to_fetch: dict[str, list[int]] = {}
    for i in external_indices:
        to_fetch.setdefault(links[i]['url'], []).append(i)
    return to_fetch


# -------- Report assembly --------

def summarize(results: list[dict | None]) -> dict[str, int]:
    summary: dict[str, int] = {}
    for r in results:
        s = r['check']['status']  # type: ignore[index]
        summary[s] = summary.get(s, 0) + 1
    return summary


def emit_report(results: list[dict | None], repo_root: Path, out: str | None) -> None:
    report = {
        'repo': str(repo_root),
        'link_count': len(results),
        'summary': summarize(results),
        'links': results,
    }
    out_text = json.dumps(report, indent=2, ensure_ascii=False)
    if out:
        Path(out).write_text(out_text, encoding='utf-8')
        print(f"wrote report to {out}", file=sys.stderr)
        print(f"summary: {report['summary']}", file=sys.stderr)
    else:
        print(out_text)


# -------- CLI --------

def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('links_json', help='Output of extract_links.py')
    p.add_argument('--out', help='Write report JSON here (default: stdout)')
    p.add_argument('--repo-root', help='Repository root (default: from links_json)')
    p.add_argument('--concurrency', type=int, default=8)
    p.add_argument('--timeout', type=int, default=15)
    p.add_argument('--cache', default='.link_cache.json',
                   help='Cache file for external URL results')
    p.add_argument('--no-cache', action='store_true', help='Disable cache')
    p.add_argument('--deep', action='store_true',
                   help='Fetch full page bodies (enables title/heading extraction)')
    p.add_argument('--user-agent', default=DEFAULT_UA)
    return p.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)

    data = json.loads(Path(args.links_json).read_text(encoding='utf-8'))
    links: list[dict] = data['links']
    repo_root = Path(args.repo_root or data['repo']).resolve()

    cache_path = Path(args.cache)
    cache = {} if args.no_cache else load_cache(cache_path)
    cache_key_suffix = ':deep' if args.deep else ':shallow'

    results: list[dict | None] = [None] * len(links)

    external_indices = check_local_links(links, repo_root, results)
    to_fetch = external_fetch_plan(links, external_indices)

    print(f"checking {len(to_fetch)} unique external URLs "
          f"(across {len(external_indices)} occurrences)...", file=sys.stderr)

    asyncio.run(check_external_urls(
        to_fetch, links, results, cache, cache_key_suffix,
        args.concurrency, args.timeout, args.user_agent, args.deep,
    ))

    if not args.no_cache:
        save_cache(cache_path, cache)

    emit_report(results, repo_root, args.out)
    return 0


if __name__ == '__main__':
    sys.exit(main())
