#!/usr/bin/env python3
"""Markdown link extraction.

Handles inline links, images, autolinks, reference-style definitions and
their usages, plus GFM-style bare-URL autolinking — skipping fenced code
blocks and already-consumed spans.
Rationale: markdown has the most overlapping link syntaxes, so extraction is
split into per-mechanism collectors that share one consumed-range ledger.
"""

from __future__ import annotations

from link_model import Link, build_link, clean_bare_url, strip_angle_brackets
from link_patterns import (
    BARE_URL,
    MD_AUTOLINK,
    MD_IMAGE,
    MD_INLINE,
    MD_REF_DEF,
    MD_REF_USE,
    _code_fence_ranges,
    in_ranges,
)


def _collect_ref_defs(content: str) -> dict[str, str]:
    """Lower-cased label → URL for every reference-style definition."""
    return {
        m.group('label').lower(): strip_angle_brackets(m.group('url'))
        for m in MD_REF_DEF.finditer(content)
    }


def _md_direct_links(content: str, lines: list[str], rel_path: str,
                     fence_ranges: list[tuple[int, int]],
                     consumed_ranges: list[tuple[int, int]]) -> list[Link]:
    """md-inline, md-image, md-autolink matches (fenced ones recorded, not emitted)."""
    links: list[Link] = []
    specs = [
        (MD_INLINE, 'md-inline'),
        (MD_IMAGE, 'md-image'),
        (MD_AUTOLINK, 'md-autolink'),
    ]
    for pattern, kind in specs:
        for m in pattern.finditer(content):
            consumed_ranges.append((m.start(), m.end()))
            if in_ranges(m.start(), fence_ranges):
                continue
            url_clean = strip_angle_brackets(m.group('url')).strip()
            links.append(build_link(
                content, lines, rel_path, m.start(),
                url_clean, m.group('url'), m.group('text').strip(), kind,
            ))
    return links


def _md_ref_links(content: str, lines: list[str], rel_path: str,
                  fence_ranges: list[tuple[int, int]], ref_defs: dict[str, str],
                  consumed_ranges: list[tuple[int, int]]) -> list[Link]:
    """Resolved reference usages plus the definitions themselves."""
    links: list[Link] = []
    for m in MD_REF_USE.finditer(content):
        if in_ranges(m.start(), fence_ranges):
            continue
        label = (m.group('label') or m.group('text')).strip().lower()
        url = ref_defs.get(label)
        if not url:
            continue
        links.append(build_link(
            content, lines, rel_path, m.start(),
            url, url, m.group('text').strip(), 'md-ref',
        ))

    # Reference definitions also contain URLs worth checking
    for m in MD_REF_DEF.finditer(content):
        consumed_ranges.append((m.start(), m.end()))
        url = strip_angle_brackets(m.group('url')).strip()
        links.append(build_link(
            content, lines, rel_path, m.start(),
            url, url, m.group('label').strip(), 'md-ref-def',
        ))
    return links


def _md_bare_links(content: str, lines: list[str], rel_path: str,
                   fence_ranges: list[tuple[int, int]],
                   consumed_ranges: list[tuple[int, int]]) -> list[Link]:
    """Bare URLs in regions not already consumed (GFM auto-links these)."""
    links: list[Link] = []
    for m in BARE_URL.finditer(content):
        if in_ranges(m.start(), fence_ranges) or in_ranges(m.start(), consumed_ranges):
            continue
        raw = m.group('url')
        url = clean_bare_url(raw)
        if not url:
            continue
        links.append(build_link(content, lines, rel_path, m.start(), url, raw, '', 'bare'))
    return links


def extract_markdown(content: str, rel_path: str) -> list[Link]:
    lines = content.splitlines()
    ref_defs = _collect_ref_defs(content)
    fence_ranges = _code_fence_ranges(content)
    consumed_ranges: list[tuple[int, int]] = []

    links = _md_direct_links(content, lines, rel_path, fence_ranges, consumed_ranges)
    links += _md_ref_links(content, lines, rel_path, fence_ranges, ref_defs, consumed_ranges)
    links += _md_bare_links(content, lines, rel_path, fence_ranges, consumed_ranges)
    return links
