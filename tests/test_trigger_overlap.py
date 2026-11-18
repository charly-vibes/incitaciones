"""Tests for scripts/trigger-overlap.py near-name collision detection.

incitaciones-of8: trigger hygiene — near-name collisions make typed
/skill:<name> invocations ambiguous or silently mis-route (e.g. /skill:issu
x32 observed in pi sessions while intending issues). Detection is advisory
(HITL audit) and must NOT alter the default run's exit-code/"OK" contract
that the release gate (justfile TRIGGER_PROBLEMS = "OK") depends on.

Collision classes:
- shared-prefix: two names sharing >= 5 leading chars (issues/issue-review,
  design-practice/design-review families) — truncation/autocomplete hazard.
- edit-distance: two names within Levenshtein distance <= 2 (likely typo of
  each other).
- observed-token: an unknown /skill: token seen in real session stores that
  is within edit distance <= 2 of a manifest name or a proper prefix (>= 4
  chars) of one.
"""

from __future__ import annotations

import importlib.util
import sys
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "scripts" / "trigger-overlap.py"
spec = importlib.util.spec_from_file_location("trigger_overlap", SCRIPT)
trigger_overlap = importlib.util.module_from_spec(spec)
sys.modules["trigger_overlap"] = trigger_overlap
spec.loader.exec_module(trigger_overlap)


class NameCollisions(unittest.TestCase):
    def test_shared_prefix_flags_issues_issue_review(self):
        out = trigger_overlap.name_collisions(["issues", "issue-review"])
        self.assertEqual(len(out), 1)
        a, b, kind, detail = out[0]
        self.assertEqual({a, b}, {"issues", "issue-review"})
        self.assertEqual(kind, "prefix")
        self.assertEqual(detail, "issue")

    def test_edit_distance_flags_typo_pair(self):
        # issu/issues: ed = 2; shared prefix "issu" (4) is below the prefix bar
        out = trigger_overlap.name_collisions(["issu", "issues"])
        self.assertEqual(len(out), 1)
        self.assertEqual(out[0][2], "edit-distance")
        self.assertEqual(out[0][3], 2)

    def test_pair_matching_both_classes_reports_once_as_prefix(self):
        # session/sessionsx: shared prefix 7 >= 5 AND ed 1 <= 2
        out = trigger_overlap.name_collisions(["session", "sessionsx"])
        self.assertEqual(len(out), 1)
        self.assertEqual(out[0][2], "prefix")

    def test_below_thresholds_not_flagged(self):
        # park/next: no shared prefix, ed 4 — neither class fires
        self.assertEqual(trigger_overlap.name_collisions(["park", "next"]), [])

    def test_unrelated_names_clean(self):
        self.assertEqual(
            trigger_overlap.name_collisions(["commit", "debug", "session"]), []
        )

    def test_identical_names_ignored(self):
        self.assertEqual(trigger_overlap.name_collisions(["commit", "commit"]), [])

    def test_output_is_deterministic(self):
        names = ["issues", "issue-review", "design-practice", "design-review"]
        self.assertEqual(
            trigger_overlap.name_collisions(names),
            trigger_overlap.name_collisions(list(reversed(names))),
        )

    def test_manifest_real_names_flag_expected_families(self):
        import json
        m = json.load(open(Path(__file__).resolve().parent.parent / "content" / "manifest.json"))
        names = [p["name"] for p in m["prompts"]]
        pairs = {(a, b) for a, b, _, _ in trigger_overlap.name_collisions(names)}
        self.assertIn(("issue-review", "issues"), pairs)
        self.assertIn(("design-practice", "design-review"), pairs)
        # true positive found while testing: renew/review are ed 2, genuinely confusable
        self.assertIn(("renew", "review"), pairs)
        self.assertNotIn(("park", "next"), pairs)


class MatchObserved(unittest.TestCase):
    def test_unknown_typo_matched_by_edit_distance(self):
        out = trigger_overlap.match_observed({"issu": 32, "commit": 47}, ["issues", "commit"])
        self.assertEqual(out, [("issu", 32, "issues", "edit distance 2")])

    def test_unknown_proper_prefix_matched(self):
        # "issu" is a proper prefix (4 chars) of issues — same class as ed here
        out = trigger_overlap.match_observed({"parkx": 3}, ["park"])
        self.assertEqual(len(out), 1)
        token, count, name, reason = out[0]
        self.assertEqual((token, count, name), ("parkx", 3, "park"))
        self.assertTrue(reason.startswith("edit distance") or reason.startswith("prefix"))

    def test_known_names_and_far_tokens_not_matched(self):
        self.assertEqual(
            trigger_overlap.match_observed({"commit": 47, "zzzzzz": 5}, ["commit", "debug"]), []
        )

    def test_short_noise_tokens_ignored(self):
        self.assertEqual(trigger_overlap.match_observed({"td": 9, "pi": 4}, ["tdd", "pi"]), [])


class DefaultContract(unittest.TestCase):
    """The release gate parses stdout as exactly "OK" — collision reporting
    must be opt-in and must never leak into the default run."""

    def test_collisions_flag_exists_and_default_off(self):
        import argparse
        parser = argparse.ArgumentParser()
        trigger_overlap.add_arguments(parser)
        args = parser.parse_args([])
        self.assertFalse(args.collisions)
        args = parser.parse_args(["--collisions"])
        self.assertTrue(args.collisions)


if __name__ == "__main__":
    unittest.main()
