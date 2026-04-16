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
import re
import sys
import time
import urllib.parse
from collections import defaultdict
from dataclasses import dataclass, asdict, field
from pathlib import Path

import aiohttp


DEFAULT_UA = "Mozilla/5.0 (compatible; doc-link-verifier/1.0)"

# Conservative per-host delay so we don't hammer any single site.
PER_HOST_DELAY = 0.5  # seconds


@dataclass
class CheckResult:
    status: str                    # ok | broken | redirected | anchor-missing | unknown | skipped
    http_status: int | None = None
    final_url: str | None = None
    reason: str | None = None
    title: str | None = None       # <title> or first H1, for shallow context check
    headings: list[str] = field(default_factory=list)  # H1-H3 from target page (markdown/html)
    redirect_chain: list[str] = field(default_factory=list)
    elapsed_ms: int | None = None

    def to_dict(self) -> dict:
        return asdict(self)


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


# -------- External URL fetching --------

TITLE_RE = re.compile(r'<title[^>]*>(.*?)</title>', re.IGNORECASE | re.DOTALL)
H1_HTML_RE = re.compile(r'<h1[^>]*>(.*?)</h1>', re.IGNORECASE | re.DOTALL)
HEADING_HTML_RE = re.compile(r'<h([1-3])[^>]*>(.*?)</h\1>', re.IGNORECASE | re.DOTALL)
TAG_STRIP = re.compile(r'<[^>]+>')


def strip_html(s: str) -> str:
    return re.sub(r'\s+', ' ', TAG_STRIP.sub('', s)).strip()


def _parse_body(body: bytes) -> tuple[str | None, list[str]]:
    """Extract title and headings from an HTML body."""
    try:
        text = body.decode('utf-8', errors='replace')
    except Exception:
        return None, []
    title = None
    m = TITLE_RE.search(text)
    if m:
        title = strip_html(m.group(1))
    else:
        h1 = H1_HTML_RE.search(text)
        if h1:
            title = strip_html(h1.group(1))
    headings = [strip_html(hm.group(2)) for hm in HEADING_HTML_RE.finditer(text)]
    return title, headings[:50]


async def fetch_external(session: aiohttp.ClientSession, url: str,
                         timeout: aiohttp.ClientTimeout,
                         deep: bool = False) -> CheckResult:
    """
    Async HEAD request; fall back to GET if the server returns 403/405/501.
    When deep=True, always GET and parse title/headings.
    """
    start = time.monotonic()
    redirect_chain: list[str] = []

    async def _request(method: str) -> tuple[int, str, bytes]:
        async with session.request(method, url, timeout=timeout,
                                   allow_redirects=True,
                                   max_redirects=10) as resp:
            # Capture redirect history
            for h in resp.history:
                redirect_chain.append(str(h.url))
            body = b''
            if method == 'GET':
                body = await resp.content.read(200_000)
            return resp.status, str(resp.url), body

    try:
        method = 'GET' if deep else 'HEAD'
        status, final_url, body = await _request(method)

        # Some servers reject HEAD — fall back to GET
        if method == 'HEAD' and status in (403, 405, 501):
            redirect_chain.clear()
            status, final_url, body = await _request('GET')

        if status >= 400:
            return CheckResult(
                status='broken', http_status=status,
                reason=f"HTTP {status}",
                final_url=final_url, redirect_chain=redirect_chain,
                elapsed_ms=int((time.monotonic() - start) * 1000),
            )

        result_status = 'ok'
        if redirect_chain or final_url != url:
            result_status = 'redirected'

        title = None
        headings: list[str] = []
        if deep and body:
            title, headings = _parse_body(body)

        return CheckResult(
            status=result_status,
            http_status=status,
            final_url=final_url,
            title=title,
            headings=headings,
            redirect_chain=redirect_chain,
            elapsed_ms=int((time.monotonic() - start) * 1000),
        )
    except asyncio.TimeoutError:
        return CheckResult(
            status='unknown', reason='timeout',
            redirect_chain=redirect_chain,
            elapsed_ms=int((time.monotonic() - start) * 1000),
        )
    except aiohttp.ClientError as e:
        return CheckResult(
            status='broken', reason=f"{type(e).__name__}: {e}",
            redirect_chain=redirect_chain,
            elapsed_ms=int((time.monotonic() - start) * 1000),
        )
    except Exception as e:
        return CheckResult(
            status='unknown', reason=f"{type(e).__name__}: {e}",
            redirect_chain=redirect_chain,
            elapsed_ms=int((time.monotonic() - start) * 1000),
        )


# -------- Relative/anchor checking --------

MD_HEADING_RE = re.compile(r'^(#{1,6})\s+(.+?)\s*#*\s*$', re.MULTILINE)
RST_HEADING_CHARS = set('=-~^"\'`*+#<>_:.')


_MD_LINK_RE = re.compile(r'\[([^\]]*)\]\([^)]*\)')
_MD_IMAGE_RE = re.compile(r'!\[([^\]]*)\]\([^)]*\)')
_MD_INLINE_CODE_RE = re.compile(r'`([^`]+)`')


def _strip_md_inline(text: str) -> str:
    """Strip inline markdown formatting so heading text matches GitHub slugs."""
    text = _MD_IMAGE_RE.sub(r'\1', text)   # ![alt](url) → alt
    text = _MD_LINK_RE.sub(r'\1', text)    # [text](url) → text
    text = _MD_INLINE_CODE_RE.sub(r'\1', text)  # `code` → code
    text = re.sub(r'[*_]{1,3}', '', text)  # bold/italic markers
    return text


def slugify_github(heading: str) -> str:
    """
    GitHub's algorithm for turning a heading into an anchor slug:
    strip inline formatting, lowercase, strip punctuation (keep hyphens,
    underscores, spaces), replace spaces with hyphens.
    """
    s = _strip_md_inline(heading).strip().lower()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'\s+', '-', s)
    return s


def collect_headings(content: str, ext: str) -> list[str]:
    """Return heading slugs for the given file content, with GitHub-style disambiguation."""
    raw_slugs: list[str] = []
    if ext in {'.md', '.mdx', '.markdown'}:
        for m in MD_HEADING_RE.finditer(content):
            raw_slugs.append(slugify_github(m.group(2)))
    elif ext == '.rst':
        lines = content.splitlines()
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            if line and set(line) <= RST_HEADING_CHARS and len(line) >= 2:
                # Check for overline pattern: decoration, title, decoration
                if (i + 2 < len(lines)
                        and lines[i + 1].strip()
                        and lines[i + 2].strip()
                        and set(lines[i + 2].strip()) <= RST_HEADING_CHARS
                        and lines[i + 2].strip()[0] == line[0]):
                    raw_slugs.append(slugify_github(lines[i + 1].strip()))
                    i += 3
                    continue
                # Underline pattern: previous line is the title
                elif i > 0 and lines[i - 1].strip():
                    raw_slugs.append(slugify_github(lines[i - 1].strip()))
            i += 1

    # Disambiguate duplicates: GitHub appends -1, -2, etc.
    seen: dict[str, int] = {}
    slugs: list[str] = []
    for s in raw_slugs:
        if s in seen:
            slugs.append(f"{s}-{seen[s]}")
            seen[s] += 1
        else:
            slugs.append(s)
            seen[s] = 1
    return slugs


def check_relative(link: dict, repo_root: Path) -> CheckResult:
    url = link['url']
    source_file = repo_root / link['file']
    # Split off fragment
    if '#' in url:
        path_part, _, fragment = url.partition('#')
    else:
        path_part, fragment = url, ''

    # Resolve path relative to the source file's directory, or repo root if absolute
    if path_part == '':
        target = source_file  # same-file anchor
    elif path_part.startswith('/'):
        target = (repo_root / path_part.lstrip('/')).resolve()
    else:
        target = (source_file.parent / path_part).resolve()

    if not target.exists():
        return CheckResult(status='broken', reason=f"file not found: {target}")

    if fragment:
        if target.is_dir():
            return CheckResult(status='broken',
                               reason="fragment on a directory link")
        ext = target.suffix.lower()
        try:
            content = target.read_text(encoding='utf-8', errors='replace')
        except Exception as e:
            return CheckResult(status='unknown', reason=str(e))
        slugs = collect_headings(content, ext)
        frag_slug = slugify_github(urllib.parse.unquote(fragment))
        if frag_slug in slugs:
            return CheckResult(status='ok', headings=slugs[:50])
        return CheckResult(
            status='anchor-missing',
            reason=f"fragment '#{fragment}' not found in {target.name}",
            headings=slugs[:50],
        )

    return CheckResult(status='ok')


def check_anchor(link: dict, repo_root: Path) -> CheckResult:
    source_file = repo_root / link['file']
    fragment = link['url'].lstrip('#')
    ext = source_file.suffix.lower()
    try:
        content = source_file.read_text(encoding='utf-8', errors='replace')
    except Exception as e:
        return CheckResult(status='unknown', reason=str(e))
    slugs = collect_headings(content, ext)
    frag_slug = slugify_github(urllib.parse.unquote(fragment))
    if frag_slug in slugs:
        return CheckResult(status='ok', headings=slugs[:50])
    return CheckResult(
        status='anchor-missing',
        reason=f"#{fragment} not found in {source_file.name}",
        headings=slugs[:50],
    )


# -------- Async main driver --------

async def check_external_urls(
    to_fetch: dict[str, list[int]],
    links: list[dict],
    results: list[dict | None],
    cache: dict[str, dict],
    cache_key_suffix: str,
    concurrency: int,
    timeout_s: int,
    user_agent: str,
    deep: bool,
) -> None:
    """Fetch all external URLs concurrently with per-host rate limiting."""
    semaphore = asyncio.Semaphore(concurrency)
    # Per-host lock + last-hit time for polite rate limiting
    host_locks: dict[str, asyncio.Lock] = defaultdict(asyncio.Lock)
    host_last_hit: dict[str, float] = {}
    timeout = aiohttp.ClientTimeout(total=timeout_s)

    async with aiohttp.ClientSession(
        headers={'User-Agent': user_agent,
                 'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8'},
    ) as session:

        async def _fetch_one(url: str) -> tuple[str, dict]:
            cache_key = url + cache_key_suffix
            if cache_key in cache:
                return url, cache[cache_key]

            host = urllib.parse.urlparse(url).netloc
            # Host lock serializes requests per host (delay + fetch together).
            # Semaphore only wraps the fetch so delays don't waste slots.
            async with host_locks[host]:
                now = time.monotonic()
                wait = PER_HOST_DELAY - (now - host_last_hit.get(host, 0))
                if wait > 0:
                    await asyncio.sleep(wait)
                async with semaphore:
                    host_last_hit[host] = time.monotonic()
                    r = await fetch_external(session, url, timeout, deep=deep)
                d = r.to_dict()
                cache[cache_key] = d
                return url, d

        tasks = [_fetch_one(url) for url in to_fetch]
        for coro in asyncio.as_completed(tasks):
            url, check = await coro
            for idx in to_fetch[url]:
                results[idx] = {**links[idx], 'check': check}


def main() -> int:
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
    args = p.parse_args()

    data = json.loads(Path(args.links_json).read_text(encoding='utf-8'))
    links: list[dict] = data['links']
    repo_root = Path(args.repo_root or data['repo']).resolve()

    cache_path = Path(args.cache)
    cache = {} if args.no_cache else load_cache(cache_path)
    cache_key_suffix = ':deep' if args.deep else ':shallow'

    results: list[dict | None] = [None] * len(links)

    # Relative, anchor, mailto — fast, no I/O, done synchronously
    external_indices = [i for i, l in enumerate(links) if l.get('link_type') == 'external']
    other_indices = [i for i, l in enumerate(links) if l.get('link_type') != 'external']

    for i in other_indices:
        link = links[i]
        lt = link.get('link_type', '')
        if lt == 'relative':
            result = check_relative(link, repo_root)
        elif lt == 'anchor':
            result = check_anchor(link, repo_root)
        elif lt == 'mailto':
            result = CheckResult(status='skipped', reason='mailto link')
        else:
            result = CheckResult(status='skipped', reason=f'unhandled link type: {lt}')
        results[i] = {**link, 'check': result.to_dict()}

    # External: dedupe by URL so we don't hit the same URL multiple times
    to_fetch: dict[str, list[int]] = {}
    for i in external_indices:
        url = links[i]['url']
        to_fetch.setdefault(url, []).append(i)

    print(f"checking {len(to_fetch)} unique external URLs "
          f"(across {len(external_indices)} occurrences)...", file=sys.stderr)

    asyncio.run(check_external_urls(
        to_fetch, links, results, cache, cache_key_suffix,
        args.concurrency, args.timeout, args.user_agent, args.deep,
    ))

    if not args.no_cache:
        save_cache(cache_path, cache)

    # Summary counts
    summary: dict[str, int] = {}
    for r in results:
        s = r['check']['status']  # type: ignore[index]
        summary[s] = summary.get(s, 0) + 1

    report = {
        'repo': str(repo_root),
        'link_count': len(results),
        'summary': summary,
        'links': results,
    }

    out_text = json.dumps(report, indent=2, ensure_ascii=False)
    if args.out:
        Path(args.out).write_text(out_text, encoding='utf-8')
        print(f"wrote report to {args.out}", file=sys.stderr)
        print(f"summary: {summary}", file=sys.stderr)
    else:
        print(out_text)
    return 0


if __name__ == '__main__':
    sys.exit(main())
