// Purpose: Display commands (list, info) for the incitaciones CLI (scripts/cli.mjs).
// Responsibilities:
// - Render the available-skills listing with bundle summaries
// - Render per-skill details including distilled source stats and related prompts
// Rationale: kept out of cli.mjs and install.mjs so presentation stays separable from install mechanics; no install state is touched here.
import fs from "node:fs";
import { getManifest, resolveDistilled } from "./manifest.mjs";

// ── list ───────────────────────────────────────────────
export function doList(prompts) {
  console.log("Available incitaciones skills:\n");
  for (const p of prompts) {
    console.log(`  ${p.name} — ${p.description || "(no description)"}`);
  }

  try {
    printBundleSummary();
  } catch {}

  console.log(`\nTotal: ${prompts.length} skills`);
}

function printBundleSummary() {
  const manifest = getManifest();
  const bundles = manifest.bundles || {};
  const bundleKeys = Object.keys(bundles).filter((k) => k !== "all");
  if (bundleKeys.length === 0) return;
  console.log("\nBundles:");
  for (const key of bundleKeys) {
    const desc = bundles[key].description || "";
    const count = bundles[key].prompts.length;
    console.log(`  ${key} (${count} prompts) — ${desc}`);
  }
}

// ── info ───────────────────────────────────────────────
function infoField(label, value) {
  console.log(`  ${label.padEnd(12)} ${value}`);
}

function printInfoSummary(prompt) {
  const src = resolveDistilled(prompt);
  console.log(`\n  ${prompt.name}`);
  console.log(`  ${"=".repeat(prompt.name.length)}`);
  infoField("Description:", prompt.description || "(none)");
  infoField("Type:", prompt.type || "prompt");
  infoField("Status:", prompt.status || "unknown");
  infoField("Tags:", (prompt.tags || []).join(", ") || "(none)");
  infoField("Source:", prompt.source || "(none)");
  infoField("Distilled:", prompt.distilled);
  if (src) {
    const lines = fs.readFileSync(src, "utf8").split("\n").length;
    const isMulti = src.endsWith("SKILL.md");
    infoField("Lines:", `${lines}${isMulti ? " + references" : ""}`);
  }
  console.log("");
}

function printRelatedPrompts(prompt) {
  const related = prompt.related || [];
  if (related.length === 0) return;
  console.log("  Related:");
  for (const r of related) {
    console.log(`    - ${r}`);
  }
  console.log("");
}

export function doInfo(name, prompts) {
  const prompt = prompts.find((p) => p.name === name);
  if (!prompt) {
    console.error(`❌ Skill not found: "${name}"`);
    const names = prompts.map((p) => p.name).sort();
    console.error(`   Available: ${names.join(", ")}`);
    process.exit(1);
  }

  printInfoSummary(prompt);
  printRelatedPrompts(prompt);
}
