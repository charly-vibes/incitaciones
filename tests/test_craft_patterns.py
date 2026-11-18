"""Craft-pattern correspondence tests for distilled members (incitaciones-8fv).

Backport of antithesis-skills practices into the usage-ranked top members:
session family (renew/next/close), rule-of-5-universal, issue-review, commit.

Patterns asserted per member:
- Scope boundary  — an explicit "does NOT" section.
- DO-NOT-PROCEED  — a labeled precondition gate with remediation routing.
- Tiered findings — MUST/SHOULD/CONSIDER tiers with BAD:/GOOD: contrast pairs.
- What's Working Well — mandatory section in advisory outputs.

Token budget: every edited member stays within +10% of its size at the ticket
base commit (metadata.base_commit of incitaciones-8fv). Character count is the
deterministic proxy for tokens here (same-language delta correlates ~1:1);
token-diff CI proper is incitaciones-bvv, not this gate.

Run: python3 tests/test_craft_patterns.py
"""

from __future__ import annotations

import re
import subprocess
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
BASE_COMMIT = "3e8899f560aa88ffc8c71e62185ce8a753a23ec4"
TOKEN_BUDGET_RATIO = 1.10

# Member file -> list of (compiled marker regex, description).
# Each marker must appear in the working-tree file.
CRAFT_PATTERNS: dict[str, list[tuple[str, str]]] = {
    "content/distilled/session/references/renew/SKILL.md": [
        (r"\*\*Scope boundary:\*\*", "scope-boundary section"),
        (r"DO-NOT-PROCEED", "do-not-proceed gate label"),
        (r"[Rr]emediation", "remediation routing"),
    ],
    "content/distilled/session/references/next/SKILL.md": [
        (r"\*\*Scope boundary:\*\*", "scope-boundary section"),
        (r"DO-NOT-PROCEED", "do-not-proceed gate label"),
        (r"[Rr]emediation", "remediation routing"),
    ],
    "content/distilled/session/references/close/SKILL.md": [
        (r"\*\*Scope boundary:\*\*", "scope-boundary section"),
        (r"DO-NOT-PROCEED", "do-not-proceed gate label"),
        (r"[Rr]emediation", "remediation routing"),
    ],
    "content/distilled/review/references/rule-of-5-universal/SKILL.md": [
        (r"\*\*Scope:\*\* advisory", "scope-boundary section"),
        (r"DO-NOT-PROCEED", "do-not-proceed gate label"),
        (r"UNVERIFIED", "remediation routing via UNVERIFIED marking"),
    ],
    (
        "content/distilled/review/references/rule-of-5-universal/"
        "references/templates.md"
    ): [
        (r"What's Working Well", "what's-working-well section"),
        (r"MUST/SHOULD/CONSIDER", "tiered findings"),
        (r"BAD:", "good-vs-bad example (bad side)"),
        (r"GOOD:", "good-vs-bad example (good side)"),
    ],
    "content/distilled/issues/references/issue-review/SKILL.md": [
        (r"\*\*Scope:\*\* advisory", "scope-boundary section"),
        (r"DO-NOT-PROCEED", "do-not-proceed gate label"),
        (r"[Rr]emediat", "remediation routing"),
    ],
    (
        "content/distilled/issues/references/issue-review/"
        "references/final-report.md"
    ): [
        (r"What's Working Well", "what's-working-well section"),
    ],
    (
        "content/distilled/issues/references/issue-review/"
        "references/pass-1-clarity.md"
    ): [
        (r"BAD:", "good-vs-bad example (bad side)"),
        (r"GOOD:", "good-vs-bad example (good side)"),
    ],
    "content/distilled/commit/SKILL.md": [
        (r"## Scope Boundary", "scope-boundary section"),
        (r"## DO-NOT-PROCEED", "do-not-proceed gate label"),
        (r"[Rr]emediation", "remediation routing"),
    ],
}


def base_size(rel_path: str) -> int:
    blob = subprocess.run(
        ["git", "show", f"{BASE_COMMIT}:{rel_path}"],
        cwd=REPO,
        capture_output=True,
        text=True,
        check=True,
    )
    return len(blob.stdout)


class CraftPatternPresence(unittest.TestCase):
    """Every top member carries its expected craft-pattern markers."""

    def test_patterns_present(self):
        missing = []
        for rel_path, markers in CRAFT_PATTERNS.items():
            text = (REPO / rel_path).read_text(encoding="utf-8")
            for pattern, description in markers:
                if not re.search(pattern, text):
                    missing.append(f"{rel_path}: missing {description} ({pattern!r})")
        self.assertEqual(
            missing,
            [],
            "craft patterns missing from top-used members:\n"
            + "\n".join(missing),
        )


class TokenBudget(unittest.TestCase):
    """Edited members stay within +10% of base-commit size."""

    def test_within_budget(self):
        over = []
        for rel_path in CRAFT_PATTERNS:
            budget = base_size(rel_path) * TOKEN_BUDGET_RATIO
            current = len(
                (REPO / rel_path).read_text(encoding="utf-8")
            )
            if current > budget:
                over.append(
                    f"{rel_path}: {current} chars > budget {budget:.0f} "
                    f"(base {base_size(rel_path)} x {TOKEN_BUDGET_RATIO})"
                )
        self.assertEqual(
            over,
            [],
            "members exceeding +10% token budget:\n" + "\n".join(over),
        )


if __name__ == "__main__":
    unittest.main()
