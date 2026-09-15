#!/usr/bin/env python3
"""Purpose: Check manifest descriptions for trigger-clause coverage and mutual distinctness.
Responsibilities:
- Fail when a live (non-hidden) prompt description carries no trigger clause (Use when / Trigger ...).
- Fail when two live trigger clauses share >= 2 distinctive tokens without an "only when" exclusivity boundary on either side.
Rationale: incitaciones-rbn — descriptions are the routing contract (B171); this guard keeps future description edits from reintroducing overlapping or clause-less triggers. Exits 0 printing "OK", exits 1 listing problems."""
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


def main() -> int:
    m = json.load(open(MANIFEST))
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
