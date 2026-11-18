#!/usr/bin/env python3
"""Measure real skill usage across pi/omp/codex session stores (CLI).

Purpose: persist the session-scan extractor built for incitaciones-oy1 so
skill usage is a repeatable measurement (`just skill-usage`), not ad-hoc grep.
Responsibilities:
- Report per-agent totals for ALL time and a recent window (default 90d),
  text or --json, from the scanners in scripts/lib/skill_usage_core.py.
- Guard against format drift (incitaciones-49v): the core raises
  FormatDriftError when a store mentions skill text but parses to zero
  recognized structural markers — silent zeros are refused. Markers are
  envelope-level (message/custom_message/payload); no agent/schema version
  pinning.

Rationale: terapia covers per-session pi queries; cross-agent per-skill
aggregation needs this scan. Formats verified against real stores 2026-11-18.

Usage:
    python3 scripts/skill_usage.py [--days N] [--json]
"""

from __future__ import annotations

import argparse
import json
import pathlib
import sys
import time

_LIB = pathlib.Path(__file__).resolve().parent / "lib"
sys.path.insert(0, str(_LIB))
from skill_usage_core import FormatDriftError, scan  # noqa: E402

DEFAULT_DAYS = 90
TOP_N = 12


def agent_roots() -> list[tuple[str, pathlib.Path, str]]:
    home = pathlib.Path.home()
    return [
        ("pi", home / ".pi" / "agent" / "sessions", "pi"),
        ("omp", home / ".omp" / "agent" / "sessions", "omp"),
        ("codex", home / ".codex" / "sessions", "codex"),
    ]


def _windows(days: int) -> list[tuple[str, float | None]]:
    """Reported time windows: all-time, plus a recent window when on."""
    windows: list[tuple[str, float | None]] = [("all", None)]
    if days > 0:
        windows.append((f"{days}d", time.time() - days * 24 * 3600))
    return windows


def _scan_windows(root: pathlib.Path, kind: str, windows) -> dict:
    """Per-window report rows for one agent store."""
    out: dict = {}
    for wname, cutoff in windows:
        loads, invocations, sessions = scan(root, kind, cutoff)
        out[wname] = {
            "sessions": sessions,
            "loads": dict(loads.most_common()),
            "invocations": dict(invocations.most_common()),
        }
    return out


def _scan_all(days: int) -> dict:
    """Aggregate report across all present agent stores."""
    windows = _windows(days)
    result: dict = {"agents": {}}
    for label, root, kind in agent_roots():
        if not root.exists():
            continue
        result["agents"][label] = _scan_windows(root, kind, windows)
    return result


def _top_line(counts: dict) -> str:
    return ", ".join(f"{k}:{v}" for k, v in list(counts.items())[:TOP_N]) or "-"


def _print_report(result: dict) -> None:
    for label, windows in result["agents"].items():
        for wname, data in windows.items():
            print(f"== {label.upper()} {wname} (sessions={data['sessions']}) ==")
            print(" loads       :", _top_line(data["loads"]))
            print(" invocations:", _top_line(data["invocations"]))
    print("\nNote: loads = SKILL.md reads via tool calls; invocations = explicit user")
    print("invocations (/skill:, omp skill-prompt). Context listings and pointer-banner")
    print("echoes excluded; residual echo risk remains for pasted skill text.")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--days", type=int, default=DEFAULT_DAYS,
                        help=f"recent window in days (default {DEFAULT_DAYS}; 0 disables)")
    parser.add_argument("--json", action="store_true", help="machine-readable output")
    args = parser.parse_args(argv)
    result = _scan_all(args.days)
    if args.json:
        print(json.dumps(result, indent=2, sort_keys=True))
    else:
        _print_report(result)
    return 0


if __name__ == "__main__":
    sys.exit(main())
