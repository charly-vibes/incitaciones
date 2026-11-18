#!/usr/bin/env python3
"""Session-store scanners for skill usage measurement (pure core).

Purpose: keep the pi/omp/codex format knowledge out of the CLI so
scripts/skill_usage.py stays a thin reporter and this module owns parsing.
Responsibilities:
- Walk session JSONL stores and count, per skill: loads (SKILL.md reads via
  tool calls) and invocations (/skill:<name> text, omp skill-prompt).
- Exclude system/context skill listings (incitaciones-oy1) and pointer-banner
  echoes (BANNER_MARK).
- Track recognized structural markers per store for drift detection.

Rationale: formats verified against real stores 2026-11-18; drift guard and
marker conventions are described in scripts/skill_usage.py (incitaciones-49v).
"""

from __future__ import annotations

import collections
import json
import pathlib
import re

SKILL_RE = re.compile(r"skills/([a-zA-Z0-9_-]+)/SKILL\.md")
SLASH_RE = re.compile(r"/skill:([a-zA-Z0-9_-]+)")
SKILL_PROMPT_RE = re.compile(r'invoked the "([a-zA-Z0-9_-]+)" skill')
BANNER_MARK = "Invoke via `/skill:"  # compiled pointer banner; echoed file text, not typed input


class FormatDriftError(RuntimeError):
    """A session store mentions skills but parses to zero known structural
    markers: the extractor would silently report zeros, so it refuses
    instead (incitaciones-49v). Envelope-level signal, not semantic
    validation."""


def _session_files(root: pathlib.Path, cutoff: float | None):
    """Session file paths within the cutoff window."""
    for f in root.rglob("*.jsonl"):
        if cutoff and f.stat().st_mtime < cutoff:
            continue
        yield f


def _entries(f: pathlib.Path, needles: tuple[str, ...]):
    """Parsed JSON entries from one session file; skips raw lines that
    contain none of the needles (cheap pre-parse filter)."""
    for line in f.open(errors="replace"):
        if not any(n in line for n in needles):
            continue
        try:
            yield json.loads(line)
        except json.JSONDecodeError:
            continue


def _content_items(content):
    """pi-family message content as a list of item dicts."""
    if isinstance(content, list):
        return content
    if isinstance(content, str):
        return [{"type": "text", "text": content}]
    return []


def _invoked_skills(text: str) -> list[str]:
    """Skills explicitly invoked in user text; pointer-banner echoes are
    quoted file text, not typed input (incitaciones-oy1), so excluded."""
    if BANNER_MARK in text:
        return []
    return [m.group(1) for m in SLASH_RE.finditer(text)]


def _pi_read_skill(item) -> str | None:
    """Skill name read by a pi-family tool-call item on a SKILL.md path."""
    if item.get("type") not in ("toolCall", "tool_call", "toolUse", "tool_use"):
        return None
    args = item.get("arguments") or item.get("input") or {}
    path = str(args.get("path") or args.get("file_path") or "")
    m = SKILL_RE.search(path)
    return m.group(1) if m else None


def _is_pi_entry(entry) -> bool:
    """pi drift marker (49v): message envelope with a role."""
    msg = entry.get("message") or {}
    return isinstance(msg, dict) and bool(msg.get("role"))


def _pi_entry_counts(entry) -> tuple[list[str], list[str]]:
    """(loaded skills, invoked skills) for one parsed pi-family entry."""
    msg = entry.get("message") or {}
    if not isinstance(msg, dict):
        return [], []
    role = msg.get("role")
    loads: list[str] = []
    invoked: list[str] = []
    for item in _content_items(msg.get("content")):
        if not isinstance(item, dict):
            continue
        load = _pi_read_skill(item)
        if load:
            loads.append(load)
        elif item.get("type") == "text" and role == "user":
            invoked.extend(_invoked_skills(str(item.get("text", ""))))
    return loads, invoked


def _scan_pi(root: pathlib.Path, cutoff: float | None):
    """pi-family format: message entries with role + content."""
    loads: collections.Counter = collections.Counter()
    invocations: collections.Counter = collections.Counter()
    sessions = 0
    recognized = 0
    for f in _session_files(root, cutoff):
        sessions += 1
        for entry in _entries(f, ("SKILL.md", "/skill:")):
            if _is_pi_entry(entry):
                recognized += 1
            entry_loads, entry_invoked = _pi_entry_counts(entry)
            for name in entry_loads:
                loads[name] += 1
            for name in entry_invoked:
                invocations[name] += 1
    return loads, invocations, sessions, recognized


def _is_omp_marker(entry) -> bool:
    """omp drift marker (49v): custom_message entries."""
    return entry.get("type") == "custom_message"


def _omp_invoked_skill(entry) -> str | None:
    """Skill name from an omp skill-prompt custom_message; skill-prompt is
    authoritative, so echoed /skill: text is not double-counted."""
    if entry.get("customType") != "skill-prompt":
        return None
    m = SKILL_PROMPT_RE.search(str(entry.get("content", "")))
    return m.group(1) if m else None


def _scan_omp(root: pathlib.Path, cutoff: float | None):
    """omp: pi-family messages PLUS explicit invocations stored as
    custom_message/customType="skill-prompt" with the skill inlined.
    skill-prompt is authoritative; /skill: text is not double-counted."""
    loads, _, sessions, recognized = _scan_pi(root, cutoff)
    invocations: collections.Counter = collections.Counter()
    for f in _session_files(root, cutoff):
        for entry in _entries(f, ('"skill-prompt"', '"custom_message"')):
            if not _is_omp_marker(entry):
                continue
            recognized += 1
            skill = _omp_invoked_skill(entry)
            if skill:
                invocations[skill] += 1
    return loads, invocations, sessions, recognized


def _codex_load(payload) -> str | None:
    """Skill name from a codex tool-call payload referencing a SKILL.md
    path via shell input; None for other payload types."""
    if payload.get("type") not in ("custom_tool_call", "function_call"):
        return None
    blob = str(payload.get("input") or payload.get("arguments") or "")
    m = SKILL_RE.search(blob)
    return m.group(1) if m else None


def _codex_content_invocations(items) -> list[str]:
    """Invoked skills from codex message-content input_text items."""
    out: list[str] = []
    for item in items:
        if isinstance(item, dict) and item.get("type") == "input_text":
            out.extend(_invoked_skills(str(item.get("text", ""))))
    return out


def _codex_text_invocations(payload) -> list[str]:
    """Invoked skills from codex user-text payloads; empty for others."""
    if payload.get("type") == "user_message":
        return _invoked_skills(str(payload.get("message", "")))
    if payload.get("type") == "message" and payload.get("role") == "user":
        return _codex_content_invocations(payload.get("content") or [])
    return []


def _scan_codex(root: pathlib.Path, cutoff: float | None):
    """codex: {type,payload} envelopes. Loads only from tool-call payloads
    (exec/shell referencing SKILL.md); <skills_instructions> listing blocks
    are user-context text and are inherently excluded."""
    loads: collections.Counter = collections.Counter()
    invocations: collections.Counter = collections.Counter()
    sessions = 0
    recognized = 0
    for f in _session_files(root, cutoff):
        sessions += 1
        for entry in _entries(f, ("SKILL.md", "/skill:")):
            payload = entry.get("payload")
            if not isinstance(payload, dict) or not payload:
                continue
            recognized += 1  # codex drift marker (49v): payload envelope
            load = _codex_load(payload)
            if load:
                loads[load] += 1
            for name in _codex_text_invocations(payload):
                invocations[name] += 1
    return loads, invocations, sessions, recognized


SCANNERS = {"pi": _scan_pi, "omp": _scan_omp, "codex": _scan_codex}

# Human-readable drift-guard marker descriptions (49v), keyed by scanner.
MARKERS = {
    "pi": "message entries with a role",
    "omp": "message entries with a role, or custom_message entries",
    "codex": "entries with a payload object",
}


def scan(root: pathlib.Path, kind: str, cutoff: float | None = None):
    """Scan one session store; returns (loads, invocations, sessions).

    loads: Counter of SKILL.md reads via tool calls, by skill name.
    invocations: Counter of explicit user invocations, by skill name.
    sessions: number of session files scanned (after cutoff).
    Raises FormatDriftError when skill-mentioning files parse to zero known
    structural markers (49v) — silent zeros would be untrustworthy.
    """
    try:
        scanner = SCANNERS[kind]
    except KeyError:
        raise ValueError(f"unknown session format kind: {kind!r} (expected {sorted(SCANNERS)})") from None
    loads, invocations, sessions, recognized = scanner(pathlib.Path(root), cutoff)
    if sessions and not recognized:
        raise FormatDriftError(
            f"{kind}: {sessions} session file(s) matched skill text but 0 entries matched known"
            f" format markers ({MARKERS[kind]}); format drift suspected — refusing to"
            f" emit silent zeros (incitaciones-49v)")
    return loads, invocations, sessions
