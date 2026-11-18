#!/usr/bin/env python3
"""Measure real skill usage across pi/omp/codex session stores.

Purpose: persist the session-scan extractor built for incitaciones-oy1 so
skill usage is a repeatable measurement (`just skill-usage`), not ad-hoc grep.
Responsibilities:
- Scan agent session JSONL stores and count, per skill:
    loads       — the agent actually read a skills/<name>/SKILL.md (tool call)
    invocations — explicit user invocation (/skill:<name>, or omp's
                  custom_message customType="skill-prompt")
- Exclude system/context skill listings: pi system messages, omp skill lists,
  codex <skills_instructions> blocks (they mention every skill path and
  "invocable via /skill:x", inflating naive grep ~2-6x — incitaciones-oy1).
- Report per-agent totals for ALL time and a recent window (default 90d).

Rationale: terapia covers per-session pi queries; cross-agent per-skill
aggregation needs this scan. Formats verified against real stores 2026-11-18.

Usage:
    python3 scripts/skill_usage.py [--days N] [--json]
"""

from __future__ import annotations

import argparse
import collections
import json
import pathlib
import re
import sys
import time

SKILL_RE = re.compile(r"skills/([a-zA-Z0-9_-]+)/SKILL\.md")
SLASH_RE = re.compile(r"/skill:([a-zA-Z0-9_-]+)")
SKILL_PROMPT_RE = re.compile(r'invoked the "([a-zA-Z0-9_-]+)" skill')
BANNER_MARK = "Invoke via `/skill:"  # compiled pointer banner; echoed file text, not typed input

DEFAULT_DAYS = 90
TOP_N = 12


def _scan_pi(root: pathlib.Path, cutoff: float | None):
    """pi-family format: message entries with role + content."""
    loads: collections.Counter = collections.Counter()
    invocations: collections.Counter = collections.Counter()
    sessions = 0
    for f in root.rglob("*.jsonl"):
        if cutoff and f.stat().st_mtime < cutoff:
            continue
        sessions += 1
        for line in f.open(errors="replace"):
            if "SKILL.md" not in line and "/skill:" not in line:
                continue
            try:
                entry = json.loads(line)
            except json.JSONDecodeError:
                continue
            msg = entry.get("message") or {}
            role = msg.get("role")
            content = msg.get("content")
            items = content if isinstance(content, list) else [{"type": "text", "text": content}] if isinstance(content, str) else []
            for item in items:
                if not isinstance(item, dict):
                    continue
                if item.get("type") in ("toolCall", "tool_call", "toolUse", "tool_use"):
                    args = item.get("arguments") or item.get("input") or {}
                    path = str(args.get("path") or args.get("file_path") or "")
                    m = SKILL_RE.search(path)
                    if m:
                        loads[m.group(1)] += 1
                elif item.get("type") == "text" and role == "user":
                    text = item.get("text", "")
                    if BANNER_MARK in text:
                        continue
                    for m in SLASH_RE.finditer(text):
                        invocations[m.group(1)] += 1
    return loads, invocations, sessions


def _scan_omp(root: pathlib.Path, cutoff: float | None):
    """omp: pi-family messages PLUS explicit invocations stored as
    custom_message/customType="skill-prompt" with the skill inlined.
    skill-prompt is authoritative; /skill: text is not double-counted."""
    loads, _, sessions = _scan_pi(root, cutoff)
    invocations: collections.Counter = collections.Counter()
    for f in root.rglob("*.jsonl"):
        if cutoff and f.stat().st_mtime < cutoff:
            continue
        for line in f.open(errors="replace"):
            if '"skill-prompt"' not in line:
                continue
            try:
                entry = json.loads(line)
            except json.JSONDecodeError:
                continue
            if entry.get("type") == "custom_message" and entry.get("customType") == "skill-prompt":
                m = SKILL_PROMPT_RE.search(entry.get("content", ""))
                if m:
                    invocations[m.group(1)] += 1
    return loads, invocations, sessions


def _scan_codex(root: pathlib.Path, cutoff: float | None):
    """codex: {type,payload} envelopes. Loads only from tool-call payloads
    (exec/shell referencing SKILL.md); <skills_instructions> listing blocks
    are user-context text and are inherently excluded."""
    loads: collections.Counter = collections.Counter()
    invocations: collections.Counter = collections.Counter()
    sessions = 0
    for f in root.rglob("*.jsonl"):
        if cutoff and f.stat().st_mtime < cutoff:
            continue
        sessions += 1
        for line in f.open(errors="replace"):
            if "SKILL.md" not in line and "/skill:" not in line:
                continue
            try:
                entry = json.loads(line)
            except json.JSONDecodeError:
                continue
            payload = entry.get("payload") or {}
            ptype = payload.get("type")
            if ptype in ("custom_tool_call", "function_call"):
                blob = str(payload.get("input") or payload.get("arguments") or "")
                m = SKILL_RE.search(blob)
                if m:
                    loads[m.group(1)] += 1
            elif ptype == "user_message":
                text = str(payload.get("message", ""))
                if BANNER_MARK in text:
                    continue
                for m in SLASH_RE.finditer(text):
                    invocations[m.group(1)] += 1
            elif ptype == "message" and payload.get("role") == "user":
                for item in payload.get("content") or []:
                    if isinstance(item, dict) and item.get("type") == "input_text":
                        text = item.get("text", "")
                        if BANNER_MARK in text:
                            continue
                        for m in SLASH_RE.finditer(text):
                            invocations[m.group(1)] += 1
    return loads, invocations, sessions


SCANNERS = {"pi": _scan_pi, "omp": _scan_omp, "codex": _scan_codex}


def scan(root: pathlib.Path, kind: str, cutoff: float | None = None):
    """Scan one session store; returns (loads, invocations, sessions).

    loads: Counter of SKILL.md reads via tool calls, by skill name.
    invocations: Counter of explicit user invocations, by skill name.
    sessions: number of session files scanned (after cutoff).
    """
    try:
        scanner = SCANNERS[kind]
    except KeyError:
        raise ValueError(f"unknown session format kind: {kind!r} (expected {sorted(SCANNERS)})") from None
    return scanner(pathlib.Path(root), cutoff)


def agent_roots() -> list[tuple[str, pathlib.Path, str]]:
    home = pathlib.Path.home()
    return [
        ("pi", home / ".pi" / "agent" / "sessions", "pi"),
        ("omp", home / ".omp" / "agent" / "sessions", "omp"),
        ("codex", home / ".codex" / "sessions", "codex"),
    ]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--days", type=int, default=DEFAULT_DAYS,
                        help=f"recent window in days (default {DEFAULT_DAYS}; 0 disables)")
    parser.add_argument("--json", action="store_true", help="machine-readable output")
    args = parser.parse_args(argv)

    windows: list[tuple[str, float | None]] = [("all", None)]
    if args.days > 0:
        windows.append((f"{args.days}d", time.time() - args.days * 24 * 3600))

    result: dict = {"agents": {}}
    for label, root, kind in agent_roots():
        if not root.exists():
            continue
        result["agents"][label] = {}
        for wname, cutoff in windows:
            loads, invocations, sessions = SCANNERS[kind](root, cutoff)
            result["agents"][label][wname] = {
                "sessions": sessions,
                "loads": dict(loads.most_common()),
                "invocations": dict(invocations.most_common()),
            }
            if not args.json:
                print(f"== {label.upper()} {wname} (sessions={sessions}) ==")
                print(" loads       :", ", ".join(f"{k}:{v}" for k, v in loads.most_common(TOP_N)) or "-")
                print(" invocations:", ", ".join(f"{k}:{v}" for k, v in invocations.most_common(TOP_N)) or "-")

    if args.json:
        print(json.dumps(result, indent=2, sort_keys=True))
    else:
        print("\nNote: loads = SKILL.md reads via tool calls; invocations = explicit user")
        print("invocations (/skill:, omp skill-prompt). Context listings and pointer-banner")
        print("echoes excluded; residual echo risk remains for pasted skill text.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
