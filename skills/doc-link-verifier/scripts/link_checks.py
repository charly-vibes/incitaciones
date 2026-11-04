#!/usr/bin/env python3
"""Local link checks: heading collection, relative-path and anchor verification.

Slug generation mirrors GitHub's heading-anchor algorithm (strip inline
formatting, lowercase, strip punctuation, hyphenate, disambiguate duplicates)
so fragments verified here match what renders on github.com.
Rationale: relative/anchor checks are pure-text logic with no network I/O,
kept apart from the async fetch machinery for testability and clarity.
"""

from __future__ import annotations

import re
import urllib.parse
from dataclasses import dataclass, asdict, field
from pathlib import Path

from link_model import Link  # noqa: F401  (re-exported for report consumers)


# -------- Result record --------

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


# -------- Heading collection --------

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


def _collect_markdown_slugs(content: str) -> list[str]:
    return [slugify_github(m.group(2)) for m in MD_HEADING_RE.finditer(content)]


def _is_rst_decoration(line: str) -> bool:
    return bool(line) and set(line) <= RST_HEADING_CHARS and len(line) >= 2


def _rst_overline_title(lines: list[str], i: int) -> str | None:
    """Return the title if lines[i] opens an overline (decoration, title, decoration)."""
    if i + 2 >= len(lines):
        return None
    title = lines[i + 1].strip()
    underline = lines[i + 2].strip()
    if title and underline and set(underline) <= RST_HEADING_CHARS \
            and underline[0] == lines[i].strip()[0]:
        return title
    return None


def _collect_rst_slugs(content: str) -> list[str]:
    lines = content.splitlines()
    slugs: list[str] = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if _is_rst_decoration(line):
            overline_title = _rst_overline_title(lines, i)
            if overline_title:
                slugs.append(slugify_github(overline_title))
                i += 3
                continue
            # Underline pattern: previous line is the title
            if i > 0 and lines[i - 1].strip():
                slugs.append(slugify_github(lines[i - 1].strip()))
        i += 1
    return slugs


def _disambiguate_slugs(raw_slugs: list[str]) -> list[str]:
    """GitHub appends -1, -2, etc. to duplicate heading slugs."""
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


def collect_headings(content: str, ext: str) -> list[str]:
    """Return heading slugs for the given file content, with GitHub-style disambiguation."""
    if ext in {'.md', '.mdx', '.markdown'}:
        raw_slugs = _collect_markdown_slugs(content)
    elif ext == '.rst':
        raw_slugs = _collect_rst_slugs(content)
    else:
        raw_slugs = []
    return _disambiguate_slugs(raw_slugs)


def _fragment_in_slugs(fragment: str, slugs: list[str]) -> bool:
    frag_slug = slugify_github(urllib.parse.unquote(fragment))
    return frag_slug in slugs


# -------- Relative/anchor checking --------

def _resolve_relative_target(url_path: str, source_file: Path, repo_root: Path) -> Path:
    """Resolve a link path against the source file's dir, or repo root if absolute."""
    if url_path == '':
        return source_file  # same-file anchor
    if url_path.startswith('/'):
        return (repo_root / url_path.lstrip('/')).resolve()
    return (source_file.parent / url_path).resolve()


def _check_fragment(target: Path, fragment: str) -> CheckResult:
    if target.is_dir():
        return CheckResult(status='broken',
                           reason="fragment on a directory link")
    try:
        content = target.read_text(encoding='utf-8', errors='replace')
    except Exception as e:
        return CheckResult(status='unknown', reason=str(e))
    slugs = collect_headings(content, target.suffix.lower())
    if _fragment_in_slugs(fragment, slugs):
        return CheckResult(status='ok', headings=slugs[:50])
    return CheckResult(
        status='anchor-missing',
        reason=f"fragment '#{fragment}' not found in {target.name}",
        headings=slugs[:50],
    )


def check_relative(link: dict, repo_root: Path) -> CheckResult:
    url = link['url']
    source_file = repo_root / link['file']
    # Split off fragment
    if '#' in url:
        path_part, _, fragment = url.partition('#')
    else:
        path_part, fragment = url, ''

    target = _resolve_relative_target(path_part, source_file, repo_root)

    if not target.exists():
        return CheckResult(status='broken', reason=f"file not found: {target}")

    if fragment:
        return _check_fragment(target, fragment)

    return CheckResult(status='ok')


def check_anchor(link: dict, repo_root: Path) -> CheckResult:
    source_file = repo_root / link['file']
    fragment = link['url'].lstrip('#')
    try:
        content = source_file.read_text(encoding='utf-8', errors='replace')
    except Exception as e:
        return CheckResult(status='unknown', reason=str(e))
    slugs = collect_headings(content, source_file.suffix.lower())
    if _fragment_in_slugs(fragment, slugs):
        return CheckResult(status='ok', headings=slugs[:50])
    return CheckResult(
        status='anchor-missing',
        reason=f"#{fragment} not found in {source_file.name}",
        headings=slugs[:50],
    )
