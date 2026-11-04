#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""
Extract links from documentation files in a repository.

Walks a directory, finds documentation and source files, pulls out every link
(markdown inline, reference-style, autolinks, rST, bare URLs, code-comment URLs)
along with the surrounding context, the file path, and the line number.

Output: JSON array to stdout (or --out file), one entry per link occurrence.

Usage:
    uv run extract_links.py <repo_path> [--out links.json] [--include-code]
                            [--extensions .md,.mdx,.rst] [--exclude node_modules,dist]
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Iterable

from link_model import Link, build_link, clean_bare_url, offset_to_line_col
from link_patterns import (
    BARE_URL,
    CODE_EXTS,
    DEFAULT_EXCLUDE,
    DOC_EXTS,
    RST_LINK,
    RST_TARGET,
    extract_comment_regions,
)
from extract_markdown import extract_markdown


# -------- rST extraction --------

def _rst_pattern_links(content: str, lines: list[str], rel_path: str, pattern,
                       kind: str, text_of, consumed: list[tuple[int, int]]) -> list[Link]:
    """Emit links for every match of an rST pattern, registering consumed spans."""
    links: list[Link] = []
    for m in pattern.finditer(content):
        consumed.append((m.start(), m.end()))
        url = m.group('url').strip()
        links.append(build_link(
            content, lines, rel_path, m.start(),
            url, url, text_of(m).strip(), kind,
        ))
    return links


def _rst_bare_links(content: str, lines: list[str], rel_path: str,
                    consumed: list[tuple[int, int]]) -> list[Link]:
    """Bare URLs in rST bodies not already consumed by link/target patterns."""
    links: list[Link] = []
    for m in BARE_URL.finditer(content):
        if any(s <= m.start() < e for s, e in consumed):
            continue
        raw = m.group('url')
        url = clean_bare_url(raw)
        if not url:
            continue
        links.append(build_link(content, lines, rel_path, m.start(), url, raw, '', 'bare'))
    return links


def extract_rst(content: str, rel_path: str) -> list[Link]:
    lines = content.splitlines()
    consumed: list[tuple[int, int]] = []
    links = _rst_pattern_links(content, lines, rel_path, RST_LINK, 'rst-link',
                               lambda m: m.group('text'), consumed)
    links += _rst_pattern_links(content, lines, rel_path, RST_TARGET, 'rst-target',
                                lambda m: m.group('label'), consumed)
    links += _rst_bare_links(content, lines, rel_path, consumed)
    return links


# -------- Plain-text and code-comment extraction --------

def extract_bare_urls(content: str, rel_path: str, kind: str = 'bare') -> list[Link]:
    lines = content.splitlines()
    out: list[Link] = []
    for m in BARE_URL.finditer(content):
        raw = m.group('url')
        url = clean_bare_url(raw)
        if not url:
            continue
        out.append(build_link(content, lines, rel_path, m.start(), url, raw, '', kind))
    return out


def extract_code_comments(content: str, rel_path: str, ext: str) -> list[Link]:
    """Pull bare URLs out of comment regions only."""
    regions = extract_comment_regions(content, ext)
    if not regions:
        return []
    lines = content.splitlines()
    seen: set[tuple[int, int]] = set()
    links: list[Link] = []
    for base_offset, text in regions:
        links.extend(_comment_region_links(content, lines, rel_path, base_offset, text, seen))
    return links


def _comment_region_links(content: str, lines: list[str], rel_path: str,
                          base_offset: int, text: str,
                          seen: set[tuple[int, int]]) -> list[Link]:
    links: list[Link] = []
    for m in BARE_URL.finditer(text):
        absolute_offset = base_offset + m.start()
        # Faithful to the original ledger guard (offsets vs. recorded line numbers)
        if any(absolute_offset == s for s, _ in seen):
            continue
        raw = m.group('url')
        url = clean_bare_url(raw)
        if not url:
            continue
        line, col = offset_to_line_col(content, absolute_offset)
        if (line, col) in seen:
            continue
        seen.add((line, col))
        links.append(build_link(content, lines, rel_path, absolute_offset,
                                url, raw, '', 'comment-url', context_before=2))
    return links


# -------- File walking --------

def should_skip_dir(name: str, extra_exclude: set[str]) -> bool:
    return name in DEFAULT_EXCLUDE or name in extra_exclude


def walk_files(root: Path, extensions: set[str], include_code: bool,
               extra_exclude: set[str]) -> Iterable[Path]:
    allowed = set(extensions)
    if include_code:
        allowed |= CODE_EXTS
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if not should_skip_dir(d, extra_exclude)]
        for fn in filenames:
            ext = Path(fn).suffix.lower()
            if ext in allowed:
                yield Path(dirpath) / fn


def extract_from_file(path: Path, rel_path: str, include_code: bool) -> list[Link]:
    ext = path.suffix.lower()
    try:
        content = path.read_text(encoding='utf-8', errors='replace')
    except Exception as e:
        print(f"skip {rel_path}: {e}", file=sys.stderr)
        return []

    if ext in {'.md', '.mdx', '.markdown'}:
        return extract_markdown(content, rel_path)
    if ext == '.rst':
        return extract_rst(content, rel_path)
    if ext == '.txt':
        return extract_bare_urls(content, rel_path)
    if include_code and ext in CODE_EXTS:
        return extract_code_comments(content, rel_path, ext)
    return []


# -------- CLI --------

def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('repo', help='Path to repository root')
    p.add_argument('--out', help='Write JSON here instead of stdout')
    p.add_argument('--include-code', action='store_true',
                   help='Also scan URLs inside code comments')
    p.add_argument('--extensions', default=','.join(sorted(DOC_EXTS)),
                   help='Comma-separated list of doc extensions')
    p.add_argument('--exclude', default='',
                   help='Additional comma-separated directory names to skip')
    return p.parse_args(argv)


def collect_links(root: Path, include_code: bool, extensions: set[str],
                  extra_exclude: set[str]) -> tuple[list[Link], int]:
    all_links: list[Link] = []
    file_count = 0
    for path in walk_files(root, extensions, include_code, extra_exclude):
        rel = str(path.relative_to(root))
        all_links.extend(extract_from_file(path, rel, include_code))
        file_count += 1
    return all_links, file_count


def emit_result(all_links: list[Link], file_count: int, root: Path,
                out: str | None) -> None:
    result = {
        'repo': str(root),
        'file_count': file_count,
        'link_count': len(all_links),
        'links': [l.to_dict() for l in all_links],
    }
    out_text = json.dumps(result, indent=2, ensure_ascii=False)
    if out:
        Path(out).write_text(out_text, encoding='utf-8')
        print(f"wrote {len(all_links)} links from {file_count} files to {out}",
              file=sys.stderr)
    else:
        print(out_text)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)

    root = Path(args.repo).resolve()
    if not root.is_dir():
        print(f"error: {root} is not a directory", file=sys.stderr)
        return 2

    extensions = {e if e.startswith('.') else '.' + e
                  for e in args.extensions.split(',') if e.strip()}
    extra_exclude = {e.strip() for e in args.exclude.split(',') if e.strip()}

    all_links, file_count = collect_links(root, args.include_code, extensions, extra_exclude)
    emit_result(all_links, file_count, root, args.out)
    return 0


if __name__ == '__main__':
    sys.exit(main())
