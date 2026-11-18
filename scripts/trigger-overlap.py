#!/usr/bin/env python3
"""Purpose: Check manifest descriptions for trigger-clause coverage and mutual distinctness; report near-name collision candidates.
Responsibilities:
- Fail when a live (non-hidden) prompt description carries no trigger clause (Use when / Trigger ...).
- Fail when two live trigger clauses share >= 2 distinctive tokens without an "only when" exclusivity boundary on either side.
- With --collisions, report (advisory only) near-name collision candidates: manifest-name pairs sharing >= 5 leading chars or within edit distance 2, plus unknown /skill: tokens observed in session stores that sit within edit distance 2 (or are a >= 4-char proper prefix) of a manifest name.
Rationale: incitaciones-rbn — descriptions are the routing contract (B171); this guard keeps future description edits from reintroducing overlapping or clause-less triggers. incitaciones-of8 — near-name collisions (issues/issue-review; /skill:issu x32 observed) make typed invocations ambiguous; the audit is HITL (retire-or-fix is a human decision, incitaciones-06i pointer permanence) so collisions are opt-in output, never a gate. Exits 0 printing "OK" (default run unchanged), exits 1 listing clause problems."""
import argparse
import json
import re
import itertools
import sys
import os

MANIFEST = os.path.join(os.path.dirname(__file__), "..", "content", "manifest.json")
STOP = {"when", "only", "user", "asks", "before", "using", "through", "their", "other", "trigger", "work"}


def clauses(description: str) -> list:
    return re.findall(r"(?:Use (?:only )?when|Trigger [a-z]+|Use before|Use for)[^.]*\.", description)


def tokens(clause_list: list) -> set:
    out = set()
    for c in clause_list:
        out |= {w for w in re.findall(r"[a-z][a-z-]{3,}", c.lower()) if w not in STOP}
    return out


def levenshtein(a: str, b: str) -> int:
    """Plain DP edit distance; names/tokens are short, no early exit needed."""
    if len(a) < len(b):
        a, b = b, a
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
        prev = cur
    return prev[-1]


def _shared_prefix(a: str, b: str) -> str:
    out = []
    for ca, cb in zip(a, b):
        if ca != cb:
            break
        out.append(ca)
    return "".join(out)


PREFIX_BAR = 5      # shared-leading-chars bar: flags issue*/design-*/research-*/test-* families, spares review/renew ("re")
EDIT_BAR = 2        # edit-distance bar: likely-typo band for <= 10-char names
TOKEN_MIN = 3       # ignore 1-2 char observed tokens as noise
OBS_PREFIX_MIN = 4  # observed token counts as a truncation of a name at >= 4 chars (e.g. issu ~ issues)


def name_collisions(names: list) -> list:
    """Structural near-name pairs among manifest names (pointers included —
    they stay invocable via /skill:name). Returns deterministic tuples
    (a, b, kind, detail), kind in {"prefix", "edit-distance"}; a pair matching
    both classes is reported once, as prefix."""
    out = []
    for a, b in itertools.combinations(sorted(set(names)), 2):
        shared = _shared_prefix(a, b)
        if len(shared) >= PREFIX_BAR:
            out.append((a, b, "prefix", shared))
        elif levenshtein(a, b) <= EDIT_BAR:
            out.append((a, b, "edit-distance", levenshtein(a, b)))
    return out


def match_observed(observed: dict, names: list) -> list:
    """Match unknown /skill: tokens observed in session stores against manifest
    names. Returns deterministic tuples (token, count, name, reason). Known
    names and < TOKEN_MIN-char noise tokens are skipped."""
    name_set = set(names)
    out = []
    for token in sorted(observed):
        count = observed[token]
        if token in name_set or len(token) < TOKEN_MIN:
            continue
        best = None
        for name in sorted(name_set):
            d = levenshtein(token, name)
            if d <= EDIT_BAR:
                if best is None or d < best[1]:
                    best = (name, d)
        if best:
            out.append((token, count, best[0], f"edit distance {best[1]}"))
            continue
        for name in sorted(name_set):
            if name.startswith(token) and len(token) >= OBS_PREFIX_MIN and len(token) < len(name):
                out.append((token, count, name, f"prefix of {name}"))
                break
    return out


def add_arguments(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--collisions", action="store_true",
                        help="also report near-name collision candidates (advisory HITL audit; incitaciones-of8) — scans session stores for observed /skill: tokens")


def _collision_report(m: dict) -> list:
    names = [p["name"] for p in m["prompts"]]
    lines = []
    for a, b, kind, detail in name_collisions(names):
        lines.append(f'{kind} "{detail}": {a} ~ {b}' if kind == "prefix" else f"{kind} {detail}: {a} ~ {b}")
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import skill_usage
    observed: dict = {}
    for _label, root, kind in skill_usage.agent_roots():
        if not root.exists():
            continue
        _loads, invocations, _sessions = skill_usage.SCANNERS[kind](root, None)
        for k, v in invocations.items():
            observed[k] = observed.get(k, 0) + v
    for token, count, name, reason in match_observed(observed, names):
        lines.append(f"observed /skill:{token} x{count} ~ {name} ({reason})")
    return lines


def main(argv: list | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    add_arguments(parser)
    args = parser.parse_args(argv)
    m = json.load(open(MANIFEST))
    if args.collisions:
        lines = _collision_report(m)
        print("near-name collisions (advisory — HITL audit, not a gate; incitaciones-of8):")
        print("\n".join(f"  {l}" for l in lines) if lines else "  (none)")
    live = [p for p in m["prompts"] if not p.get("disable_model_invocation")]
    problems = []
    no_clause = [p["name"] for p in live if not clauses(p["description"])]
    if no_clause:
        problems.append("no trigger clause: " + ", ".join(no_clause))
    for a, b in itertools.combinations(live, 2):
        ca, cb = clauses(a["description"]), clauses(b["description"])
        shared = tokens(ca) & tokens(cb)
        if len(shared) >= 2 and not any("only when" in c.lower() for c in ca) \
                and not any("only when" in c.lower() for c in cb):
            problems.append(f"trigger overlap {a['name']} <-> {b['name']}: {sorted(shared)}")
    if problems:
        print("\n".join(problems))
        return 1
    print("OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
