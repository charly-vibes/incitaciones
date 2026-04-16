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
import re
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable


# -------- File-type configuration --------

DOC_EXTS = {".md", ".mdx", ".markdown", ".rst", ".txt"}
CODE_EXTS = {
    ".py", ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs",
    ".java", ".go", ".rs", ".rb", ".c", ".cc", ".cpp", ".h", ".hpp",
    ".swift", ".kt", ".cs", ".php", ".sh",
}

DEFAULT_EXCLUDE = {
    ".git", "node_modules", "dist", "build", "target", ".next", ".nuxt",
    "__pycache__", ".venv", "venv", "env", ".tox", ".mypy_cache",
    ".pytest_cache", "vendor", "coverage", ".idea", ".vscode",
}


# -------- Link patterns --------

# Markdown inline: [text](url "optional title")
MD_INLINE = re.compile(
    r'(?<!\!)\[(?P<text>(?:[^\[\]]|\[[^\]]*\])*)\]\((?P<url><[^>]+>|[^\s\)]+)(?:\s+"[^"]*")?\)'
)

# Markdown image: ![alt](url) — separated so reports can flag images distinctly
MD_IMAGE = re.compile(
    r'!\[(?P<text>[^\]]*)\]\((?P<url><[^>]+>|[^\s\)]+)(?:\s+"[^"]*")?\)'
)

# Reference-style usage: [text][label] or [text][] — we resolve labels later
MD_REF_USE = re.compile(r'(?<!\!)\[(?P<text>(?:[^\[\]]|\[[^\]]*\])*)\]\[(?P<label>[^\]]*)\]')

# Reference-style definition: [label]: url "optional title"
MD_REF_DEF = re.compile(
    r'^\s*\[(?P<label>[^\]]+)\]:\s*<?(?P<url>\S+?)>?(?:\s+"[^"]*")?\s*$',
    re.MULTILINE,
)

# Autolink: <https://...> or <user@host>
MD_AUTOLINK = re.compile(r'<(?P<url>(?:https?|ftp|mailto):[^>\s]+)>')

# rST external link with text: `text <url>`_
RST_LINK = re.compile(r'`(?P<text>[^`<]+)\s+<(?P<url>[^>]+)>`_')

# rST target definition: .. _label: url
RST_TARGET = re.compile(r'^\s*\.\.\s+_(?P<label>[^:]+):\s*(?P<url>\S+)\s*$', re.MULTILINE)

# Bare URL — conservative, used as a fallback for plain text + code comments.
# Matches http(s) and stops at whitespace or common sentence terminators.
# Allows parentheses inside the URL (Wikipedia etc.) — clean_bare_url strips unbalanced trailing ones.
BARE_URL = re.compile(
    r'(?<![\w/\-\.])(?P<url>https?://[^\s<>"\']+?)(?=[\s<>"\'\}\,;:!?]|$)',
    re.IGNORECASE,
)

# Trailing punctuation we should strip off bare URLs (since regex includes them sometimes)
TRAILING_PUNCT = '.,;:!?\'"}'


@dataclass
class Link:
    url: str                  # the URL as written (after fence-stripping)
    raw_url: str              # the URL exactly as it appeared
    text: str                 # link text / description, may be empty
    file: str                 # path relative to repo root
    line: int                 # 1-indexed line where link starts
    col: int                  # 0-indexed column
    context: str              # surrounding text (typically the line + neighbors)
    kind: str                 # md-inline | md-image | md-ref | md-autolink | rst-link | rst-target | bare | comment-url
    link_type: str            # external | relative | anchor | mailto | other

    def to_dict(self) -> dict:
        return asdict(self)


# -------- Classification helpers --------

def classify(url: str) -> str:
    u = url.strip()
    if u.startswith('#'):
        return 'anchor'
    if u.startswith(('http://', 'https://', 'ftp://')):
        return 'external'
    if u.startswith('mailto:'):
        return 'mailto'
    if u.startswith(('/', './', '../')) or not re.match(r'^[a-z]+:', u, re.IGNORECASE):
        # No scheme — treat as a repo-relative path
        return 'relative'
    return 'other'


def strip_angle_brackets(url: str) -> str:
    if url.startswith('<') and url.endswith('>'):
        return url[1:-1]
    return url


def clean_bare_url(url: str) -> str:
    """Strip trailing sentence punctuation that got pulled in by the regex."""
    # First strip simple trailing punctuation
    while url and url[-1] in TRAILING_PUNCT:
        url = url[:-1]
    # Then strip unbalanced trailing brackets/parens
    bracket_pairs = {')': '(', ']': '['}
    while url and url[-1] in bracket_pairs:
        opener = bracket_pairs[url[-1]]
        if url.count(opener) >= url.count(url[-1]):
            break  # balanced — keep it
        url = url[:-1]
    # Strip any remaining trailing punctuation exposed by bracket removal
    while url and url[-1] in TRAILING_PUNCT:
        url = url[:-1]
    return url


def context_window(lines: list[str], line_idx: int, before: int = 1, after: int = 1) -> str:
    """Return a slice of lines around line_idx (0-indexed) as a single string."""
    start = max(0, line_idx - before)
    end = min(len(lines), line_idx + after + 1)
    return '\n'.join(lines[start:end]).strip()


# -------- Comment extraction --------

# For code files we don't want to match URLs in code strings indiscriminately,
# so we extract comment regions first and then scan those for bare URLs.

COMMENT_PATTERNS = {
    # line-comment prefixes per language family
    'hash': re.compile(r'#.*$', re.MULTILINE),           # py, rb, sh, etc.
    'slashes': re.compile(r'//.*$', re.MULTILINE),       # js, ts, java, go, rs, c, etc.
    'block_c': re.compile(r'/\*[\s\S]*?\*/'),            # c-style block comments
    'triple_double': re.compile(r'"""[\s\S]*?"""'),      # python docstrings
    'triple_single': re.compile(r"'''[\s\S]*?'''"),      # python docstrings (single)
}

LANG_COMMENTS = {
    '.py': ('hash', 'triple_double', 'triple_single'),
    '.rb': ('hash',),
    '.sh': ('hash',),
    '.js': ('slashes', 'block_c'),
    '.jsx': ('slashes', 'block_c'),
    '.ts': ('slashes', 'block_c'),
    '.tsx': ('slashes', 'block_c'),
    '.mjs': ('slashes', 'block_c'),
    '.cjs': ('slashes', 'block_c'),
    '.java': ('slashes', 'block_c'),
    '.go': ('slashes', 'block_c'),
    '.rs': ('slashes', 'block_c'),
    '.c': ('slashes', 'block_c'),
    '.cc': ('slashes', 'block_c'),
    '.cpp': ('slashes', 'block_c'),
    '.h': ('slashes', 'block_c'),
    '.hpp': ('slashes', 'block_c'),
    '.swift': ('slashes', 'block_c'),
    '.kt': ('slashes', 'block_c'),
    '.cs': ('slashes', 'block_c'),
    '.php': ('slashes', 'block_c', 'hash'),
}


def extract_comment_regions(content: str, ext: str) -> list[tuple[int, str]]:
    """Return list of (offset, comment_text) for all comment regions in the file."""
    patterns = LANG_COMMENTS.get(ext, ())
    regions = []
    for pkey in patterns:
        for m in COMMENT_PATTERNS[pkey].finditer(content):
            regions.append((m.start(), m.group(0)))
    regions.sort()
    return regions


def offset_to_line_col(content: str, offset: int) -> tuple[int, int]:
    """Convert a byte offset into (1-indexed line, 0-indexed column)."""
    prefix = content[:offset]
    line = prefix.count('\n') + 1
    col = offset - (prefix.rfind('\n') + 1) if '\n' in prefix else offset
    return line, col


# -------- Main extractors --------

def extract_markdown(content: str, rel_path: str) -> list[Link]:
    lines = content.splitlines()
    links: list[Link] = []

    # Collect reference definitions first
    ref_defs: dict[str, str] = {}
    for m in MD_REF_DEF.finditer(content):
        ref_defs[m.group('label').lower()] = strip_angle_brackets(m.group('url'))

    # Inline links (skip those inside code fences — simple heuristic)
    fence_ranges = _code_fence_ranges(content)

    def in_fence(offset: int) -> bool:
        return any(s <= offset < e for s, e in fence_ranges)

    consumed_ranges: list[tuple[int, int]] = []

    def add_match(m: re.Match, kind: str, url: str, text: str) -> None:
        consumed_ranges.append((m.start(), m.end()))
        if in_fence(m.start()):
            return
        line, col = offset_to_line_col(content, m.start())
        url_clean = strip_angle_brackets(url).strip()
        links.append(Link(
            url=url_clean,
            raw_url=url,
            text=text.strip(),
            file=rel_path,
            line=line,
            col=col,
            context=context_window(lines, line - 1),
            kind=kind,
            link_type=classify(url_clean),
        ))

    for m in MD_INLINE.finditer(content):
        add_match(m, 'md-inline', m.group('url'), m.group('text'))

    for m in MD_IMAGE.finditer(content):
        add_match(m, 'md-image', m.group('url'), m.group('text'))

    for m in MD_AUTOLINK.finditer(content):
        add_match(m, 'md-autolink', m.group('url'), '')

    # Reference-style usage: resolve via ref_defs

    for m in MD_REF_USE.finditer(content):
        if in_fence(m.start()):
            continue
        label = (m.group('label') or m.group('text')).strip().lower()
        url = ref_defs.get(label)
        if not url:
            continue
        line, col = offset_to_line_col(content, m.start())
        links.append(Link(
            url=url,
            raw_url=url,
            text=m.group('text').strip(),
            file=rel_path,
            line=line,
            col=col,
            context=context_window(lines, line - 1),
            kind='md-ref',
            link_type=classify(url),
        ))

    # Reference definitions also contain URLs worth checking
    for m in MD_REF_DEF.finditer(content):
        consumed_ranges.append((m.start(), m.end()))
        url = strip_angle_brackets(m.group('url')).strip()
        line, col = offset_to_line_col(content, m.start())
        links.append(Link(
            url=url, raw_url=url, text=m.group('label').strip(),
            file=rel_path, line=line, col=col,
            context=context_window(lines, line - 1),
            kind='md-ref-def', link_type=classify(url),
        ))

    # Now scan for bare URLs in regions NOT already consumed (GFM auto-links these)
    def in_consumed(offset: int) -> bool:
        return any(s <= offset < e for s, e in consumed_ranges)

    for m in BARE_URL.finditer(content):
        if in_fence(m.start()) or in_consumed(m.start()):
            continue
        raw = m.group('url')
        url = clean_bare_url(raw)
        if not url:
            continue
        line, col = offset_to_line_col(content, m.start())
        links.append(Link(
            url=url, raw_url=raw, text='',
            file=rel_path, line=line, col=col,
            context=context_window(lines, line - 1),
            kind='bare', link_type=classify(url),
        ))

    return links


def _code_fence_ranges(content: str) -> list[tuple[int, int]]:
    """Find ``` ... ``` fenced code blocks so we skip links inside them."""
    ranges = []
    fence_re = re.compile(r'^( {0,3})(```+|~~~+)', re.MULTILINE)
    open_start: int | None = None
    open_char: str | None = None
    open_count: int = 0
    for m in fence_re.finditer(content):
        char = m.group(2)[0]  # '`' or '~'
        count = len(m.group(2))
        if open_start is None:
            # Opening fence
            open_start = m.start()
            open_char = char
            open_count = count
        elif char == open_char and count >= open_count:
            # Matching closing fence
            ranges.append((open_start, m.end()))
            open_start = None
            open_char = None
            open_count = 0
        # else: different fence char or shorter count inside a block — skip
    # If there's an unclosed fence, treat everything after it as fenced
    if open_start is not None:
        ranges.append((open_start, len(content)))
    return ranges


def extract_rst(content: str, rel_path: str) -> list[Link]:
    lines = content.splitlines()
    links: list[Link] = []
    consumed_ranges: list[tuple[int, int]] = []
    for m in RST_LINK.finditer(content):
        consumed_ranges.append((m.start(), m.end()))
        line, col = offset_to_line_col(content, m.start())
        url = m.group('url').strip()
        links.append(Link(
            url=url, raw_url=url, text=m.group('text').strip(),
            file=rel_path, line=line, col=col,
            context=context_window(lines, line - 1),
            kind='rst-link', link_type=classify(url),
        ))
    for m in RST_TARGET.finditer(content):
        consumed_ranges.append((m.start(), m.end()))
        line, col = offset_to_line_col(content, m.start())
        url = m.group('url').strip()
        links.append(Link(
            url=url, raw_url=url, text=m.group('label').strip(),
            file=rel_path, line=line, col=col,
            context=context_window(lines, line - 1),
            kind='rst-target', link_type=classify(url),
        ))
    # Also pick up bare URLs in rST bodies NOT already consumed by link/target patterns
    def in_consumed(offset: int) -> bool:
        return any(s <= offset < e for s, e in consumed_ranges)

    for m in BARE_URL.finditer(content):
        if in_consumed(m.start()):
            continue
        raw = m.group('url')
        url = clean_bare_url(raw)
        if not url:
            continue
        line, col = offset_to_line_col(content, m.start())
        links.append(Link(
            url=url, raw_url=raw, text='',
            file=rel_path, line=line, col=col,
            context=context_window(lines, line - 1),
            kind='bare', link_type=classify(url),
        ))
    return links


def extract_bare_urls(content: str, rel_path: str, kind: str = 'bare') -> list[Link]:
    lines = content.splitlines()
    out: list[Link] = []
    for m in BARE_URL.finditer(content):
        raw = m.group('url')
        url = clean_bare_url(raw)
        if not url:
            continue
        line, col = offset_to_line_col(content, m.start())
        out.append(Link(
            url=url, raw_url=raw, text='',
            file=rel_path, line=line, col=col,
            context=context_window(lines, line - 1),
            kind=kind, link_type=classify(url),
        ))
    return out


def extract_code_comments(content: str, rel_path: str, ext: str) -> list[Link]:
    """Pull bare URLs out of comment regions only."""
    regions = extract_comment_regions(content, ext)
    if not regions:
        return []
    lines = content.splitlines()
    out: list[Link] = []
    seen: set[tuple[int, int]] = set()
    for base_offset, text in regions:
        for m in BARE_URL.finditer(text):
            absolute_offset = base_offset + m.start()
            if absolute_offset in {s for s, _ in seen}:
                continue
            raw = m.group('url')
            url = clean_bare_url(raw)
            if not url:
                continue
            line, col = offset_to_line_col(content, absolute_offset)
            key = (line, col)
            if key in seen:
                continue
            seen.add(key)
            out.append(Link(
                url=url, raw_url=raw, text='',
                file=rel_path, line=line, col=col,
                context=context_window(lines, line - 1, before=2, after=1),
                kind='comment-url', link_type=classify(url),
            ))
    return out


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

def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('repo', help='Path to repository root')
    p.add_argument('--out', help='Write JSON here instead of stdout')
    p.add_argument('--include-code', action='store_true',
                   help='Also scan URLs inside code comments')
    p.add_argument('--extensions', default=','.join(sorted(DOC_EXTS)),
                   help='Comma-separated list of doc extensions')
    p.add_argument('--exclude', default='',
                   help='Additional comma-separated directory names to skip')
    args = p.parse_args()

    root = Path(args.repo).resolve()
    if not root.is_dir():
        print(f"error: {root} is not a directory", file=sys.stderr)
        return 2

    extensions = {e if e.startswith('.') else '.' + e
                  for e in args.extensions.split(',') if e.strip()}
    extra_exclude = {e.strip() for e in args.exclude.split(',') if e.strip()}

    all_links: list[Link] = []
    file_count = 0
    for path in walk_files(root, extensions, args.include_code, extra_exclude):
        rel = str(path.relative_to(root))
        all_links.extend(extract_from_file(path, rel, args.include_code))
        file_count += 1

    result = {
        'repo': str(root),
        'file_count': file_count,
        'link_count': len(all_links),
        'links': [l.to_dict() for l in all_links],
    }

    out_text = json.dumps(result, indent=2, ensure_ascii=False)
    if args.out:
        Path(args.out).write_text(out_text, encoding='utf-8')
        print(f"wrote {len(all_links)} links from {file_count} files to {args.out}",
              file=sys.stderr)
    else:
        print(out_text)
    return 0


if __name__ == '__main__':
    sys.exit(main())
