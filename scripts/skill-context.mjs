#!/usr/bin/env node
// Purpose: Per-skill context-size token report (partial vs full) with a
// diff against a base ref, plus omp inline skill-prompt size measurement.
// Responsibilities:
// - Read content/manifest.json and count cl100k_base tokens per skill:
//     partial — the distilled SKILL.md a consumer's agent loads first
//     full    — SKILL.md + its references/ tree (progressive-disclosure cost)
// - Diff counts against a base ref (git show) for skills whose distilled
//   files changed since that ref (merge-base diff)
// - Measure omp skill-prompt inline sizes (avg/p95 tokens per invocation)
//   from ~/.omp/agent/sessions when present
// - Emit a markdown report; exits 0 regardless of growth (bvv v1 anti-goal:
//   report-only — failing CI on token growth is a later explicit decision)
// Rationale: the craft-pattern gate (tests/test_craft_patterns.py, 8fv) uses
// char counts as a token proxy; this tool is the real measurement (bvv).
// Pure functions are exported for node --test (tests/test_skill_context.mjs)
// with an injected tokenizer, so the suite needs no npm dependency; only
// main() loads gpt-tokenizer (cl100k_base, pure JS — no WASM).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const SKILL_NAME_RE = /invoked the "([a-zA-Z0-9_-]+)" skill/;
const REPORT_MARKER = "<!-- skill-context-report -->";

// ---------- pure functions (unit-tested, tokenizer injected) ----------

/** All files a skill installs into context: distilled + references tree. */
export function fullPaths(prompt, root) {
  const distilled = prompt.distilled;
  const files = [distilled];
  const dir = path.posix.dirname(distilled);
  const base = path.posix.basename(distilled);
  // references/ lives next to a SKILL.md inside its skill dir; a flat
  // distilled file ({name}.md) may own content/distilled/{name}/references/
  const refsDirs =
    base === "SKILL.md"
      ? [path.posix.join(dir, "references")]
      : [
          path.posix.join(
            dir,
            path.posix.basename(distilled).replace(/\.md$/, ""),
            "references",
          ),
        ];
  for (const refs of refsDirs) {
    const abs = path.join(root, refs);
    if (!fs.existsSync(abs)) continue;
    const walk = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.posix.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.isFile()) files.push(path.relative(root, p).split(path.sep).join("/"));
      }
    };
    walk(abs);
  }
  return files.sort();
}

function readTokens(root, relPath, tokenize) {
  try {
    return tokenize(fs.readFileSync(path.join(root, relPath), "utf8"));
  } catch {
    return 0;
  }
}

/** Rows: {name, partial, full} sorted by name. */
export function measureSkills(root, manifest, tokenize) {
  return manifest.prompts
    .map((p) => {
      const paths = fullPaths(p, root);
      const partial = readTokens(root, p.distilled, tokenize);
      const full = paths.reduce((s, f) => s + readTokens(root, f, tokenize), 0);
      return { name: p.name, partial, full };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Skill names owning any of the changed repo-relative paths. */
export function ownersOfChangedPaths(paths, manifest) {
  const owners = new Set();
  for (const p of paths) {
    for (const prompt of manifest.prompts) {
      const d = prompt.distilled;
      const dir = path.posix.dirname(d);
      const ownsFlat =
        p === d ||
        p.startsWith(
          path.posix.join(dir, path.posix.basename(d).replace(/\.md$/, "")) +
            "/",
        );
      const ownsDir =
        path.posix.basename(d) === "SKILL.md" &&
        (p === d || p.startsWith(dir + "/"));
      if (ownsFlat || ownsDir) owners.add(prompt.name);
    }
  }
  return owners;
}

/** Attach signed deltas only for changed skills that have a base row. */
export function mergeBase(rows, baseRows, changed) {
  const base = new Map(baseRows.map((r) => [r.name, r]));
  return rows.map((r) =>
    changed.has(r.name) && base.has(r.name)
      ? {
          ...r,
          dPartial: r.partial - base.get(r.name).partial,
          dFull: r.full - base.get(r.name).full,
        }
      : { ...r, dPartial: null, dFull: null },
  );
}

const signed = (d) => (d == null ? "—" : d >= 0 ? `+${d}` : `${d}`);

/** Markdown report; delta cells render only when numeric deltas exist. */
export function reportMarkdown(rows, { base }) {
  const lines = [
    REPORT_MARKER,
    `# Skill context token report (base: ${base})`,
    "",
    "cl100k_base tokens of the distilled content a skill installs into",
    "context. partial = SKILL.md; full = SKILL.md + references/.",
    "Δ columns appear only for skills changed since the base ref.",
    "**Report-only** — growth never fails CI (incitaciones-bvv v1 anti-goal).",
    "",
    "| skill | partial | full | Δpartial | Δfull |",
    "|---|---:|---:|---:|---:|",
  ];
  for (const r of rows) {
    lines.push(
      `| ${r.name} | ${r.partial} | ${r.full} | ${signed(r.dPartial)} | ${signed(r.dFull)} |`,
    );
  }
  return lines.join("\n") + "\n";
}

function percentile(sortedValues, p) {
  if (sortedValues.length === 0) return 0;
  const rank = Math.ceil(p * sortedValues.length);
  return sortedValues[Math.min(rank, sortedValues.length) - 1];
}

/**
 * omp inline skill-prompt sizes from a sessions JSONL store.
 * Returns {overall: {n, avg, p95}, perSkill: {name: {n, avg, p95}}}.
 */
export function ompInlineStats(storeRoot, tokenize) {
  const overall = [];
  const perSkill = new Map();
  if (!fs.existsSync(storeRoot)) {
    return { overall: { n: 0, avg: 0, p95: 0 }, perSkill: {} };
  }
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile() && e.name.endsWith(".jsonl")) scanFile(p);
    }
  };
  const scanFile = (file) => {
    let raw;
    try {
      raw = fs.readFileSync(file, "utf8");
    } catch {
      return;
    }
    for (const line of raw.split("\n")) {
      if (!line.includes('"skill-prompt"')) continue;
      let entry;
      try {
        entry = JSON.parse(line);
      } catch {
        continue;
      }
      if (entry?.type !== "custom_message" || entry?.customType !== "skill-prompt")
        continue;
      const content = entry.content;
      if (typeof content !== "string") continue;
      const m = SKILL_NAME_RE.exec(content);
      if (!m) continue;
      const n = tokenize(content);
      overall.push(n);
      if (!perSkill.has(m[1])) perSkill.set(m[1], []);
      perSkill.get(m[1]).push(n);
    }
  };
  walk(storeRoot);
  const finish = (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    const n = values.length;
    const sum = values.reduce((s, v) => s + v, 0);
    return { n, avg: n ? sum / n : 0, p95: percentile(sorted, 0.95) };
  };
  const perSkillOut = {};
  for (const [name, values] of perSkill) perSkillOut[name] = finish(values);
  return { overall: finish(overall), perSkill: perSkillOut };
}

export function ompSection(stats) {
  if (!stats.overall.n) {
    return "\n## omp inline skill-prompt sizes\n\nno omp session store found — skipped.\n";
  }
  const lines = [
    "",
    "## omp inline skill-prompt sizes",
    "",
    `overall: n=${stats.overall.n}, avg=${stats.overall.avg.toFixed(1)} tokens, p95=${stats.overall.p95} tokens (nearest-rank)`,
    "",
    "| skill | n | avg | p95 |",
    "|---|---:|---:|---:|",
  ];
  for (const name of Object.keys(stats.perSkill).sort()) {
    const s = stats.perSkill[name];
    lines.push(`| ${name} | ${s.n} | ${s.avg.toFixed(1)} | ${s.p95} |`);
  }
  return lines.join("\n") + "\n";
}

// ---------- CLI (loads the real tokenizer lazily) ----------

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

  let tokenize;
  // Lazy dynamic import: keeps the test suite and stdlib-only consumers
  // independent of the npm dependency.
  import("gpt-tokenizer/encoding/cl100k_base")
    .then(({ encode }) => run((text) => encode(text).length, root, base, skipOmp))
    .catch((err) => {
      console.error(
        `skill-context: tokenizer unavailable (${err.message}); ` +
          "run `npm install` (gpt-tokenizer provides cl100k_base)",
      );
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
