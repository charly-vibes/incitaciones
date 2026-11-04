#!/usr/bin/env python3
"""Link pattern tables: regexes, extension sets, and comment-region extraction.

Single place where every URL-bearing pattern is defined, so extractor modules
stay logic-only. Also owns the language→comment-style map used when scanning
code files (URLs in code strings are only trusted inside comments).
Rationale: pattern tables are the most frequently tuned part of the extractor;
isolating them makes threshold/pattern changes reviewable in one diff.
"""

from __future__ import annotations

import re


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


def in_ranges(offset: int, ranges: list[tuple[int, int]]) -> bool:
    """True if offset falls inside any [start, end) range."""
    return any(s <= offset < e for s, e in ranges)
