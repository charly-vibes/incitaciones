"""Craft-pattern correspondence tests for distilled members (incitaciones-8fv, hardened in incitaciones-lfw).

Backport of antithesis-skills practices into the usage-ranked top members:
session family (renew/next/close), rule-of-5-universal, issue-review, commit.

Patterns asserted per member:
- Scope boundary  — an explicit "does NOT" section.
- DO-NOT-PROCEED  — a labeled precondition gate with remediation routing.
- Tiered findings — MUST/SHOULD/CONSIDER tiers with BAD:/GOOD: contrast pairs.
- What's Working Well — mandatory section in advisory outputs.

Marker matching is cosmetic-reflow tolerant (lfw EDGE-002): both the file
text and the marker are run through normalize() (curly→straight apostrophes,
bold/heading/backtick markup stripped, casefolded) before substring matching,
so losing bold, changing a heading, or a curly apostrophe cannot flip a
present pattern to "missing". Markers are therefore plain substrings of the
normalized text, not regexes.

Scope label convention (lfw CLRT-001): every member that carries a scope
section uses the same label text, converging on "Scope boundary". Formatting
(bold inline vs heading) is free; the label words are not.

Token budget: every edited member stays within +10% of its size at the ticket
base commit (BASE_COMMIT, metadata.base_commit of incitaciones-8fv).
Character count is the deterministic proxy for tokens here (same-language
delta correlates ~1:1); token-diff CI proper is incitaciones-bvv, not this
gate. If a member exceeds budget: trim the addition to fit, or consciously
bump BASE_COMMIT together with the originating ticket's metadata (lfw EDGE-003).

Run: python3 tests/test_craft_patterns.py
"""

from __future__ import annotations

import subprocess
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
BASE_COMMIT = "3e8899f560aa88ffc8c71e62185ce8a753a23ec4"
TOKEN_BUDGET_RATIO = 1.10
HOUSE_WIDTH = 80  # gate lines must fit; lfw CLRT-002 (house style ~78)
TEMPLATES = (
    "content/distilled/review/references/rule-of-5-universal/"
    "references/templates.md"
)

# The one scope-boundary label convention (lfw CLRT-001).
SCOPE_MARKER = "scope boundary"


def normalize(text: str) -> str:
    """Reduce cosmetic variation so reflow cannot hide a present marker."""
    text = text.replace("\u2019", "'").replace("\u2018", "'")
    for markup in ("*", "#", "`"):
        text = text.replace(markup, "")
    return text.casefold()


# Member file -> list of (normalized marker substring, description).
# Each marker must appear in the normalized working-tree file.
CRAFT_PATTERNS: dict[str, list[tuple[str, str]]] = {
    "content/distilled/session/references/renew/SKILL.md": [
        (SCOPE_MARKER, "scope-boundary section"),
        ("do-not-proceed", "do-not-proceed gate label"),
        ("remediat", "remediation routing"),
    ],
    "content/distilled/session/references/next/SKILL.md": [
        (SCOPE_MARKER, "scope-boundary section"),
        ("do-not-proceed", "do-not-proceed gate label"),
        ("remediat", "remediation routing"),
    ],
    "content/distilled/session/references/close/SKILL.md": [
        (SCOPE_MARKER, "scope-boundary section"),
        ("do-not-proceed", "do-not-proceed gate label"),
        ("remediat", "remediation routing"),
    ],
    "content/distilled/review/references/rule-of-5-universal/SKILL.md": [
        (SCOPE_MARKER, "scope-boundary section"),
        ("do-not-proceed", "do-not-proceed gate label"),
        ("unverified", "remediation routing via UNVERIFIED marking"),
    ],
    TEMPLATES: [
        ("what's working well", "what's-working-well section"),
        ("must/should/consider", "tiered findings"),
        ("bad:", "good-vs-bad example (bad side)"),
        ("good:", "good-vs-bad example (good side)"),
    ],
    "content/distilled/issues/references/issue-review/SKILL.md": [
        (SCOPE_MARKER, "scope-boundary section"),
        ("do-not-proceed", "do-not-proceed gate label"),
        ("remediat", "remediation routing"),
    ],
    (
        "content/distilled/issues/references/issue-review/"
        "references/final-report.md"
    ): [
        ("what's working well", "what's-working-well section"),
    ],
    (
        "content/distilled/issues/references/issue-review/"
        "references/pass-1-clarity.md"
    ): [
        ("bad:", "good-vs-bad example (bad side)"),
        ("good:", "good-vs-bad example (good side)"),
    ],
    "content/distilled/commit/SKILL.md": [
        (SCOPE_MARKER, "scope-boundary section"),
        ("do-not-proceed", "do-not-proceed gate label"),
        ("remediat", "remediation routing"),
    ],
}


def base_size(rel_path: str) -> int:
    result = subprocess.run(
        ["git", "show", f"{BASE_COMMIT}:{rel_path}"],
        cwd=REPO,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(
            f"git show {BASE_COMMIT}:{rel_path} failed "
            f"({result.returncode}); shallow checkout? The CI workflow "
            "needs fetch-depth: 0 on actions/checkout"
        )
    return len(result.stdout)


def _missing_in(rel_path: str, text: str, markers: list[tuple[str, str]]) -> list[str]:
    normalized = normalize(text)
    return [
        f"{rel_path}: missing {description} (normalized marker {marker!r}; "
        "matching ignores case, quotes, and markup)"
        for marker, description in markers
        if marker not in normalized
    ]


def missing_markers() -> list[str]:
    missing: list[str] = []
    for rel_path, markers in CRAFT_PATTERNS.items():
        text = (REPO / rel_path).read_text(encoding="utf-8")
        missing.extend(_missing_in(rel_path, text, markers))
    return missing


def budget_detail(rel_path: str, current: int, base: int, ratio: float) -> str:
    """Over-budget failure line that states the two remedies (lfw EDGE-003)."""
    budget = base * ratio
    return (
        f"{rel_path}: {current} chars > budget {budget:.0f} "
        f"(base {base} x {ratio}). Trim the addition to fit, or consciously "
        f"bump BASE_COMMIT ({BASE_COMMIT[:7]}) together with the originating "
        "ticket's metadata — exact-budget members fail on any addition."
    )


def over_budget_members() -> list[str]:
    over: list[str] = []
    for rel_path in CRAFT_PATTERNS:
        base = base_size(rel_path)
        current = len((REPO / rel_path).read_text(encoding="utf-8"))
        if current > base * TOKEN_BUDGET_RATIO:
            over.append(budget_detail(rel_path, current, base, TOKEN_BUDGET_RATIO))
    return over


def wide_gate_lines() -> list[str]:
    """DO-NOT-PROCEED gate lines beyond house width (lfw CLRT-002)."""
    wide: list[str] = []
    for rel_path in CRAFT_PATTERNS:
        lines = (REPO / rel_path).read_text(encoding="utf-8").splitlines()
        for lineno, line in enumerate(lines, 1):
            if "DO-NOT-PROCEED" in line and len(line) > HOUSE_WIDTH:
                wide.append(
                    f"{rel_path}:{lineno}: gate line {len(line)} chars "
                    f"> house {HOUSE_WIDTH}; wrap the gate, keep the label "
                    "line short"
                )
    return wide


def unmarked_guidance() -> list[str]:
    """Finding-bar guidance in templates.md must be an authoring note (lfw EXCL-001)."""
    text = (REPO / TEMPLATES).read_text(encoding="utf-8")
    for lineno, line in enumerate(text.splitlines(), 1):
        stripped = normalize(line).strip()
        if stripped.startswith("finding bar") and not stripped.startswith(
            "authoring note"
        ):
            return [
                f"{TEMPLATES}:{lineno}: finding-bar guidance sits mid-template "
                "unmarked; prefix it as an authoring note"
            ]
    return []


class CraftPatternPresence(unittest.TestCase):
    """Every top member carries its expected craft-pattern markers."""

    def test_patterns_present(self):
        self.assertEqual(
            missing_markers(),
            [],
            "craft patterns missing from top-used members",
        )


class CosmeticReflow(unittest.TestCase):
    """Normalization absorbs formatting-only rewrites (lfw EDGE-002)."""

    def test_variants_still_match(self):
        cases = [
            (SCOPE_MARKER, ["**Scope Boundary:**", "## Scope Boundary", "Scope boundary:"]),
            ("do-not-proceed", ["**DO-NOT-PROCEED**", "## DO-NOT-PROCEED"]),
            ("what's working well", ["What's Working Well", "**What's Working Well**"]),
        ]
        for marker, variants in cases:
            for variant in variants:
                self.assertIn(marker, normalize(variant), f"{variant!r} → {marker!r}")


class ScopeLabelConvention(unittest.TestCase):
    """All scope-boundary markers share one label convention (lfw CLRT-001)."""

    def test_all_scope_markers_use_convention(self):
        divergent = [
            f"{rel_path}: {pattern!r} != {SCOPE_MARKER!r}"
            for rel_path, markers in CRAFT_PATTERNS.items()
            for pattern, description in markers
            if "scope-boundary" in description and pattern != SCOPE_MARKER
        ]
        self.assertEqual(divergent, [], "scope-boundary label convention must be uniform")


class TokenBudget(unittest.TestCase):
    """Edited members stay within +10% of base-commit size."""

    def test_within_budget(self):
        self.assertEqual(
            over_budget_members(),
            [],
            "members exceeding +10% token budget",
        )

    def test_over_budget_message_explains_remedies(self):
        detail = budget_detail("x.md", current=100, base=50, ratio=TOKEN_BUDGET_RATIO)
        self.assertIn("Trim", detail, "must state remedy 1 (trim)")
        self.assertIn("BASE_COMMIT", detail, "must state remedy 2 (bump base)")
        self.assertIn("55", detail, "must state the computed budget")


class GateLineWidth(unittest.TestCase):
    """DO-NOT-PROCEED gate lines fit house width (lfw CLRT-002)."""

    def test_gate_lines_within_house_width(self):
        self.assertEqual(wide_gate_lines(), [], "gate lines beyond house width")


class AuthoringNote(unittest.TestCase):
    """Mid-template guidance is marked as such (lfw EXCL-001)."""

    def test_finding_bar_guidance_marked(self):
        self.assertEqual(unmarked_guidance(), [], "unmarked mid-template guidance")


if __name__ == "__main__":
    unittest.main()
