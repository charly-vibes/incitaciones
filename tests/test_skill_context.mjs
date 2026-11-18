// Tests for scripts/skill-context.mjs (incitaciones-bvv).
// Run: node --test tests/test_skill_context.mjs
//
// The tokenizer is injected into every function under test, so these tests
// exercise the measurement/report logic with a deterministic word-count
// stub — no npm dependency is needed to run the suite. The CLI main wires
// in gpt-tokenizer (cl100k_base) at runtime.
//
// Fixtures live in temp dirs (fs.mkdtemp) and are removed on exit.

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  fullPaths,
  measureSkills,
  ownersOfChangedPaths,
  mergeBase,
  reportMarkdown,
  ompInlineStats,
} from "../scripts/lib/skill-context-core.mjs";

// Deterministic tokenizer stub: tokens = whitespace-separated words.
const stubTokenize = (text) => text.split(/\s+/).filter(Boolean).length;

function makeTree(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "skill-context-"));
  for (const [rel, content] of Object.entries(files)) {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }
  return root;
}

const MANIFEST = {
  prompts: [
    { name: "alpha", distilled: "content/distilled/alpha/SKILL.md" },
    {
      name: "router-beta",
      distilled: "content/distilled/router-beta/SKILL.md",
      sources: ["content/distilled/router-beta/references/one.md"],
    },
    { name: "gamma", distilled: "content/distilled/gamma.md" },
  ],
};

test("fullPaths: distilled plus its references tree", () => {
  const root = makeTree({
    "content/distilled/alpha/SKILL.md": "# alpha",
    "content/distilled/alpha/references/deep/a.md": "a",
    "content/distilled/alpha/references/b.md": "b",
    "content/distilled/alpha/other.txt": "not a reference",
    "content/distilled/gamma.md": "# gamma",
  });
  const rel = (p) =>
    path.isAbsolute(p) ? path.relative(root, p).split(path.sep).join("/") : p;
  const full = fullPaths(MANIFEST.prompts[0], root).map(rel);
  assert.deepEqual(full, [
    "content/distilled/alpha/SKILL.md",
    "content/distilled/alpha/references/b.md",
    "content/distilled/alpha/references/deep/a.md",
  ]);
  const gamma = fullPaths(MANIFEST.prompts[2], root).map(rel);
  assert.deepEqual(gamma, ["content/distilled/gamma.md"]);
  fs.rmSync(root, { recursive: true, force: true });
});

test("fullPaths: missing references dir is not an error", () => {
  const root = makeTree({ "content/distilled/alpha/SKILL.md": "# alpha" });
  assert.deepEqual(fullPaths(MANIFEST.prompts[0], root), [
    "content/distilled/alpha/SKILL.md",
  ]);
  fs.rmSync(root, { recursive: true, force: true });
});

test("measureSkills: partial vs full tokens with injected tokenizer", () => {
  const root = makeTree({
    "content/distilled/alpha/SKILL.md": "one two three",
    "content/distilled/alpha/references/b.md": "four five",
    "content/distilled/gamma.md": "six",
  });
  const rows = measureSkills(root, MANIFEST, stubTokenize);
  const byName = Object.fromEntries(rows.map((r) => [r.name, r]));
  assert.equal(byName.alpha.partial, 3);
  assert.equal(byName.alpha.full, 5);
  assert.equal(byName.gamma.partial, 1);
  assert.equal(byName.gamma.full, 1);
  fs.rmSync(root, { recursive: true, force: true });
});

test("ownersOfChangedPaths: maps distilled paths to skills, ignores foreign paths", () => {
  const owners = ownersOfChangedPaths(
    [
      "content/distilled/alpha/SKILL.md",
      "content/distilled/alpha/references/new.md",
      "tests/test_craft_patterns.py",
      "content/distilled/router-beta/SKILL.md",
    ],
    MANIFEST,
  );
  assert.deepEqual([...owners].sort(), ["alpha", "router-beta"]);
});

test("reportMarkdown: table, deltas only where provided, report-only note", () => {
  const rows = [
    { name: "alpha", partial: 3, full: 5, dPartial: 2, dFull: 1 },
    { name: "gamma", partial: 1, full: 1, dPartial: null, dFull: null },
  ];
  const md = reportMarkdown(rows, { base: "origin/main" });
  assert.match(md, /Skill context token report/);
  assert.match(md, /origin\/main/);
  assert.match(md, /\| alpha \| 3 \| 5 \| \+2 \| \+1 \|/);
  assert.match(md, /\| gamma \| 1 \| 1 \| — \| — \|/);
  assert.match(md, /report-only/i); // anti-goal: growth never fails CI
});

test("reportMarkdown: renders negative and positive deltas", () => {
  const rows = [
    { name: "alpha", partial: 3, full: 5, dPartial: -2, dFull: -1 },
    { name: "gamma", partial: 1, full: 1, dPartial: 1, dFull: 0 },
  ];
  const md = reportMarkdown(rows, { base: "b", changed: ["alpha", "gamma"] });
  assert.match(md, /alpha.*-2.*-1/);
  assert.match(md, /gamma.*\+1.*\+0/);
});

test("mergeBase: deltas only for changed skills with a base row", () => {
  const rows = [
    { name: "alpha", partial: 3, full: 5 },
    { name: "gamma", partial: 1, full: 1 },
  ];
  const baseRows = [
    { name: "alpha", partial: 4, full: 7 },
    { name: "gamma", partial: 1, full: 1 },
  ];
  const merged = mergeBase(rows, baseRows, new Set(["alpha"]));
  assert.deepEqual(merged[0], { name: "alpha", partial: 3, full: 5, dPartial: -1, dFull: -2 });
  assert.equal(merged[1].dPartial, null); // unchanged skill: no delta noise
  // no base row (new skill): no delta even though changed
  const mergedNew = mergeBase([rows[0]], [], new Set(["alpha"]));
  assert.equal(mergedNew[0].dPartial, null);
});

test("ompInlineStats: avg and p95 over fixture entries, malformed lines skipped", () => {
  const root = makeTree({
    "s1.jsonl": [
      // stub tokenizer counts words: preamble 'invoked the "alpha" skill' = 4
      JSON.stringify({
        type: "custom_message",
        customType: "skill-prompt",
        content: 'invoked the "alpha" skill\n' + "word ".repeat(9), // 4+9=13
      }),
      JSON.stringify({
        type: "custom_message",
        customType: "skill-prompt",
        content: 'invoked the "alpha" skill\n' + "word ".repeat(19), // 4+19=23
      }),
      JSON.stringify({
        type: "custom_message",
        customType: "skill-prompt",
        content: 'invoked the "beta" skill\n' + "word ".repeat(4), // 4+4=8
      }),
      "{broken json",
      JSON.stringify({ type: "user", content: "noise" }),
    ].join("\n"),
  });
  const stats = ompInlineStats(root, stubTokenize);
  assert.equal(stats.overall.n, 3);
  assert.equal(stats.overall.avg, (13 + 23 + 8) / 3);
  // nearest-rank p95 of [8,13,23]: ceil(0.95*3)=3rd -> 23
  assert.equal(stats.overall.p95, 23);
  assert.deepEqual(stats.perSkill.alpha, { n: 2, avg: 18, p95: 23 });
  assert.deepEqual(stats.perSkill.beta, { n: 1, avg: 8, p95: 8 });
  fs.rmSync(root, { recursive: true, force: true });
});

test("ompInlineStats: empty store yields zeroed overall, no per-skill rows", () => {
  const root = makeTree({ "empty.jsonl": "" });
  const stats = ompInlineStats(root, stubTokenize);
  assert.equal(stats.overall.n, 0);
  assert.equal(stats.overall.avg, 0);
  assert.equal(stats.overall.p95, 0);
  assert.deepEqual(Object.keys(stats.perSkill), []);
  fs.rmSync(root, { recursive: true, force: true });
});
