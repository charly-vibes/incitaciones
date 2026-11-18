// Purpose: Pure measurement/report core for the skill-context token report
// (incitaciones-bvv) — manifest-driven cl100k counts, base diffs, omp inline
// skill-prompt stats, markdown rendering.
// Responsibilities:
// - Resolve a skill's installed context files (distilled SKILL.md + references/)
// - Measure partial/full token counts with an injected tokenizer
// - Map changed repo paths to owning skills; attach signed merge-base deltas
// - Render the markdown report; aggregate omp inline sizes (avg/p95)
// Rationale: kept dependency-free and pure so node --test exercises the logic
// with a stub tokenizer (no npm install needed); the CLI wires in the real one.
// Split out of scripts/skill-context.mjs to satisfy the pretender file_lines
// gate (316 > 300) — the gate is the same discipline that flattened the 8fv
// test; see .wai session notes.
import fs from "node:fs";
import path from "node:path";

// First line of every generated report — the PR-comment upsert in
// .github/workflows/skill-context.yml matches this marker to update
// its previous comment instead of posting a new one.
const REPORT_MARKER = "<!-- skill-context-report -->";

// omp skill-prompt entries announce the inlined skill with this preamble
// (same extractor convention as scripts/skill_usage.py).
const SKILL_NAME_RE = /invoked the "([a-zA-Z0-9_-]+)" skill/;

/** All files a skill installs into context: distilled + references tree. */
// references/ lives next to a SKILL.md inside its skill dir; a flat
// distilled file ({name}.md) may own content/distilled/{name}/references/
function referencesDirsFor(distilled) {
  const dir = path.posix.dirname(distilled);
  const base = path.posix.basename(distilled);
  return base === "SKILL.md"
    ? [path.posix.join(dir, "references")]
    : [path.posix.join(dir, base.replace(/\.md$/, ""), "references")];
}

function walkFiles(dir, root, files) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.posix.join(dir, e.name);
    if (e.isDirectory()) walkFiles(p, root, files);
    else if (e.isFile()) files.push(path.relative(root, p).split(path.sep).join("/"));
  }
}

/** All files a skill installs into context: distilled + references tree. */
export function fullPaths(prompt, root) {
  const files = [prompt.distilled];
  for (const refs of referencesDirsFor(prompt.distilled)) {
    const abs = path.join(root, refs);
    if (fs.existsSync(abs)) walkFiles(abs, root, files);
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

function statSummary(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = values.length;
  const sum = values.reduce((s, v) => s + v, 0);
  return { n, avg: n ? sum / n : 0, p95: percentile(sorted, 0.95) };
}

function pushSample(samples, skill, tokens) {
  samples.overall.push(tokens);
  if (!samples.perSkill.has(skill)) samples.perSkill.set(skill, []);
  samples.perSkill.get(skill).push(tokens);
}

function skillNameFromLine(line) {
  if (!line.includes('"skill-prompt"')) return null;
  let entry;
  try {
    entry = JSON.parse(line);
  } catch {
    return null;
  }
  const isPrompt = entry?.type === "custom_message" && entry?.customType === "skill-prompt";
  if (!isPrompt || typeof entry.content !== "string") return null;
  return SKILL_NAME_RE.exec(entry.content);
}

function scanOmpFile(file, samples, tokenize) {
  let raw;
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch {
    return;
  }
  for (const line of raw.split("\n")) {
    const m = skillNameFromLine(line);
    if (m) pushSample(samples, m[1], tokenize(m.input));
  }
}

function collectOmpSamples(storeRoot, tokenize) {
  const samples = { overall: [], perSkill: new Map() };
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile() && e.name.endsWith(".jsonl")) scanOmpFile(p, samples, tokenize);
    }
  };
  walk(storeRoot);
  return samples;
}

/**
 * omp inline skill-prompt sizes from a sessions JSONL store.
 * Returns {overall: {n, avg, p95}, perSkill: {name: {n, avg, p95}}}.
 */
export function ompInlineStats(storeRoot, tokenize) {
  if (!fs.existsSync(storeRoot)) {
    return { overall: { n: 0, avg: 0, p95: 0 }, perSkill: {} };
  }
  const { overall, perSkill } = collectOmpSamples(storeRoot, tokenize);
  const perSkillOut = {};
  for (const [name, values] of perSkill) perSkillOut[name] = statSummary(values);
  return { overall: statSummary(overall), perSkill: perSkillOut };
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
