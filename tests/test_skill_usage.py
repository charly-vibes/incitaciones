"""Tests for scripts/skill_usage.py — cross-agent skill usage extractor.

Fixture sessions reproduce the three real on-disk formats:

- pi  (~/.pi/agent/sessions): message entries; loads = read toolCall on
  */skills/<name>/SKILL.md; invocations = /skill:<name> in user text.
  The system skill listing mentions every path and "invocable via /skill:x"
  and MUST NOT be counted (incitaciones-oy1).
- omp (~/.omp/agent/sessions): pi-family messages PLUS explicit invocations
  stored as custom_message/customType="skill-prompt" ("User invoked the X
  skill") with the skill inlined — no read tool call happens. Count these as
  invocations, and do NOT double-count /skill: text for omp.
- codex (~/.codex/sessions): {type,payload} envelopes; loads = tool-call
  payloads (custom_tool_call / function_call) whose input references a
  SKILL.md path via shell; the <skills_instructions> listing block MUST NOT
  be counted.

Drift guard (incitaciones-49v): if an agent renames its envelope shapes,
the extractor would silently yield zeros. scan() raises FormatDriftError
when a store mentions skill text but parses to zero recognized structural
markers (pi/omp: message entries; omp also custom_message; codex: payload
envelopes). Envelope-level markers only — no agent/schema version pinning.
"""

from __future__ import annotations

import importlib.util
import json
import sys
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "scripts" / "skill_usage.py"
spec = importlib.util.spec_from_file_location("skill_usage", SCRIPT)
skill_usage = importlib.util.module_from_spec(spec)
sys.modules["skill_usage"] = skill_usage
spec.loader.exec_module(skill_usage)


def write_session(root: Path, name: str, lines: list[dict]) -> Path:
    root.mkdir(parents=True, exist_ok=True)
    f = root / name
    f.write_text("\n".join(json.dumps(line) for line in lines) + "\n")
    return f


class ExtractorTests(unittest.TestCase):
    def setUp(self):
        self.root = Path(self.enterContext(_tmpdir()))

    def test_pi_loads_and_slashes_exclude_listing(self):
        d = self.root / "pi"
        write_session(d, "s1.jsonl", [
            {"type": "message", "message": {"role": "system", "content": [
                {"type": "text", "text":
                 "<location>/x/skills/renew/SKILL.md</location> invocable via /skill:renew"}]}},
            {"type": "message", "message": {"role": "assistant", "content": [
                {"type": "toolCall", "id": "t1", "name": "read",
                 "arguments": {"path": "/x/skills/renew/SKILL.md"}}]}},
            {"type": "message", "message": {"role": "user", "content": [
                {"type": "text", "text": "/skill:next stash this"}]}},
        ])
        loads, invocations, sessions = skill_usage.scan(d, "pi")
        self.assertEqual(sessions, 1)
        self.assertEqual(loads, {"renew": 1})
        self.assertEqual(invocations, {"next": 1})

    def test_omp_skill_prompt_custom_message_counts_once(self):
        d = self.root / "omp"
        write_session(d, "s1.jsonl", [
            {"type": "message", "message": {"role": "system", "content": [
                {"type": "text", "text":
                 "<location>/x/skills/close/SKILL.md</location>"}]}},
            {"type": "custom_message", "customType": "skill-prompt", "content":
             '[IMPORTANT: User invoked the "renew" skill; follow its instructions.]'},
            {"type": "message", "message": {"role": "assistant", "content": [
                {"type": "toolCall", "id": "t2", "name": "read",
                 "arguments": {"path": "/x/skills/session/SKILL.md"}}]}},
            {"type": "message", "message": {"role": "user", "content": [
                {"type": "text", "text": "/skill:renew"}]}},
        ])
        loads, invocations, sessions = skill_usage.scan(d, "omp")
        self.assertEqual(sessions, 1)
        self.assertEqual(loads, {"session": 1})
        # skill-prompt is authoritative; the echoed /skill: slash is not double-counted
        self.assertEqual(invocations, {"renew": 1})

    def test_codex_tool_call_loads_exclude_skills_instructions_listing(self):
        d = self.root / "codex"
        write_session(d, "s1.jsonl", [
            {"type": "response_item", "payload": {"type": "message", "role": "user",
             "content": [{"type": "input_text", "text":
                          "<skills_instructions>\n- commit: x (file: /x/skills/commit/SKILL.md)\n"
                          "</skills_instructions>"}]}},
            {"type": "response_item", "payload": {"type": "custom_tool_call",
             "name": "exec", "input": "cat /x/skills/tdd/SKILL.md"}},
            {"type": "response_item", "payload": {"type": "function_call",
             "name": "shell", "arguments": '{"command": ["sed", "-n", "1,50p", "/x/skills/review/SKILL.md"]}'}},
            {"type": "event_msg", "payload": {"type": "user_message",
             "message": "/skill:commit do it"}},
        ])
        loads, invocations, sessions = skill_usage.scan(d, "codex")
        self.assertEqual(sessions, 1)
        self.assertEqual(loads, {"tdd": 1, "review": 1})
        self.assertEqual(invocations, {"commit": 1})

    def test_codex_banner_echo_not_counted_as_invocation(self):
        d = self.root / "codex"
        write_session(d, "s2.jsonl", [
            {"type": "response_item", "payload": {"type": "message", "role": "user",
             "content": [{"type": "input_text", "text":
                          "cat out: > **Moved:** this entry is now the **next** mode of the **session** skill.\n"
                          "> Invoke via `/skill:next`, invoke `/skill:session` for the mode table."}]}},
            {"type": "event_msg", "payload": {"type": "user_message",
             "message": "please review with rule of 5"}},
        ])
        _, invocations, _ = skill_usage.scan(d, "codex")
        self.assertEqual(invocations, {})

    def test_cutoff_excludes_old_files(self):
        import os
        d = self.root / "pi"
        f = write_session(d, "old.jsonl", [
            {"type": "message", "message": {"role": "user", "content": [
                {"type": "text", "text": "/skill:next"}]}}])
        old = skill_usage.time.time() - 100 * 24 * 3600
        os.utime(f, (old, old))
        _, invocations, sessions = skill_usage.scan(d, "pi", cutoff=skill_usage.time.time() - 90 * 24 * 3600)
        self.assertEqual(sessions, 0)
        self.assertEqual(invocations, {})


class FormatDriftTests(unittest.TestCase):
    """incitaciones-49v: skill-mentioning stores that parse to zero known
    envelope shapes must fail loudly, not silently report zeros."""

    def setUp(self):
        self.root = Path(self.enterContext(_tmpdir()))

    def test_pi_unknown_envelope_fails_loudly(self):
        # drift: pi renames its envelope; SKILL.md text still present, so the
        # old extractor would silently yield zeros.
        d = self.root / "pi"
        write_session(d, "s1.jsonl", [
            {"type": "message_v9", "envelope": {"role": "assistant", "parts": [
                {"kind": "toolCall", "arguments": {"path": "/x/skills/renew/SKILL.md"}}]}},
        ])
        with self.assertRaises(skill_usage.FormatDriftError):
            skill_usage.scan(d, "pi")

    def test_codex_unknown_envelope_fails_loudly(self):
        d = self.root / "codex"
        write_session(d, "s1.jsonl", [
            {"type": "item_v9", "body": {"kind": "tool",
             "input": "cat /x/skills/tdd/SKILL.md"}},
        ])
        with self.assertRaises(skill_usage.FormatDriftError):
            skill_usage.scan(d, "codex")

    def test_omp_custom_message_only_store_is_recognized(self):
        # omp marker includes custom_message: a store with only skill-prompt
        # entries (no message entries) must NOT trip the guard.
        d = self.root / "omp"
        write_session(d, "s1.jsonl", [
            {"type": "custom_message", "customType": "skill-prompt", "content":
             '[IMPORTANT: User invoked the "close" skill; follow its instructions.]'},
        ])
        _, invocations, sessions = skill_usage.scan(d, "omp")
        self.assertEqual(sessions, 1)
        self.assertEqual(invocations, {"close": 1})

    def test_empty_store_does_not_trip_guard(self):
        d = self.root / "pi"
        d.mkdir(parents=True)
        loads, invocations, sessions = skill_usage.scan(d, "pi")
        self.assertEqual(sessions, 0)


def _tmpdir():
    import tempfile
    return tempfile.TemporaryDirectory()


if __name__ == "__main__":
    unittest.main()
