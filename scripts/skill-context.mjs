#!/usr/bin/env node
// Purpose: CLI for the per-skill context-size token report (incitaciones-bvv).
// Responsibilities:
// - Parse --base/--no-omp flags; lazily load gpt-tokenizer (cl100k_base, pure JS)
// - Diff changed distilled files vs the base ref (merge-base), re-measure base
//   blobs in a scratch tree, merge deltas, print the markdown report
// - Report-only: exits 0 regardless of token growth (bvv v1 anti-goal)
// Rationale: measurement logic lives in scripts/lib/skill-context-core.mjs
// (pure, unit-tested with injected tokenizer); this file is CLI concerns only.
// Split to satisfy the pretender file_lines gate (316 > 300).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import {
  measureSkills,
  ownersOfChangedPaths,
  mergeBase,
  reportMarkdown,
  ompInlineStats,
  ompSection,
} from "./lib/skill-context-core.mjs";

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8" });
}

function main(argv) {
  const root = path.resolve(import.meta.dirname, "..");
  const get = (flag) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const base = get("--base") ?? "origin/main";
  const skipOmp = argv.includes("--no-omp");

  // Lazy dynamic import: keeps the test suite and stdlib-only consumers
  // independent of the npm dependency. Only the import failure maps to the
  // install hint; run() errors propagate (exit non-zero via unhandled path).
  import("gpt-tokenizer/encoding/cl100k_base")
    .then(async ({ encode }) => {
      await run((text) => encode(text).length, root, base, skipOmp);
    })
    .catch((err) => {
      if (String(err.message).includes("gpt-tokenizer")) {
        console.error(
          `skill-context: tokenizer unavailable (${err.message}); ` +
            "run `npm install` (gpt-tokenizer provides cl100k_base)",
        );
      } else {
        console.error(`skill-context: ${err.stack ?? err.message}`);
      }
      process.exit(1);
    });
}

function run(tokenize, root, base, skipOmp) {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(root, "content/manifest.json"), "utf8"),
  );
  const rows = measureSkills(root, manifest, tokenize);

  let changedPaths = [];
  try {
    changedPaths = git(
      ["diff", "--name-only", `${base}...HEAD`, "--", "content/distilled"],
      root,
    )
      .split("\n")
      .filter(Boolean);
  } catch {
    console.error(
      `skill-context: cannot diff against base "${base}" — report has no Δ columns`,
    );
  }
  const changed = ownersOfChangedPaths(changedPaths, manifest);

  let baseRows = [];
  if (changed.size) {
    baseRows = measureSkillsLikeBase(root, manifest, base, tokenize);
  }
  const merged = mergeBase(rows, baseRows, changed);

  let out = reportMarkdown(merged, { base });
  if (!skipOmp) {
    const store = path.join(
      process.env.HOME ?? "",
      ".omp/agent/sessions",
    );
    out += ompSection(ompInlineStats(store, tokenize));
  }
  process.stdout.write(out);
}

/** Measure skills against base-ref blobs (git show) instead of the worktree. */
function measureSkillsLikeBase(root, manifest, base, tokenize) {  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "skill-context-base-"));
  try {
    for (const p of manifest.prompts) {
      for (const f of fullPaths(p, root)) {
        try {
          const blob = git(["show", `${base}:${f}`], root);
          const abs = path.join(scratch, f);
          fs.mkdirSync(path.dirname(abs), { recursive: true });
          fs.writeFileSync(abs, blob);
        } catch {
          /* file did not exist at base — counts as 0 */
        }
      }
    }
    return measureSkills(scratch, manifest, tokenize);
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

const isMain =
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url;
if (isMain) main(process.argv.slice(2));
