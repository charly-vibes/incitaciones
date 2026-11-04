#!/usr/bin/env python3
"""Link data model and classification helpers.

Shared by the extractors (markdown/rst/bare/comment scanning) and the CLI:
every discovered link becomes a Link record, classified by URL shape.
Rationale: separating the model from pattern tables keeps both extractor
modules free of dataclass/regex maintenance concerns.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, asdict


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


def offset_to_line_col(content: str, offset: int) -> tuple[int, int]:
    """Convert a byte offset into (1-indexed line, 0-indexed column)."""
    prefix = content[:offset]
    line = prefix.count('\n') + 1
    col = offset - (prefix.rfind('\n') + 1) if '\n' in prefix else offset
    return line, col


def build_link(content: str, lines: list[str], rel_path: str, offset: int,
               url: str, raw_url: str, text: str, kind: str,
               context_before: int = 1) -> Link:
    """Assemble a Link from a match offset, classifying the cleaned URL."""
    line, col = offset_to_line_col(content, offset)
    return Link(
        url=url,
        raw_url=raw_url,
        text=text,
        file=rel_path,
        line=line,
        col=col,
        context=context_window(lines, line - 1, before=context_before),
        kind=kind,
        link_type=classify(url),
    )
