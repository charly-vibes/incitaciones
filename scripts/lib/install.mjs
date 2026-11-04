// Purpose: Core install flow for the incitaciones CLI (scripts/cli.mjs).
// Responsibilities:
// - Install the selected prompts to the resolved destination root
// - Prune stale incitaciones-installed skills and wire tool integrations
// Rationale: orchestrates manifest.mjs / skill-files.mjs / tools.mjs without duplicating their mechanics; keeps scripts/cli.mjs a thin router.
import fs from "node:fs";
import path from "node:path";
import { home } from "./manifest.mjs";
import { installSkill } from "./skill-files.mjs";
import { runDetectedToolIntegrations, installForSpecificTool } from "./tools.mjs";

// ── Prune stale incitaciones-installed skills ──────────
// Any skill dir whose SKILL.md is marked installed-from: incitaciones but
// whose name is not in the just-installed set. Foreign skills are kept.
function pruneStaleSkills(dstRoot, installedNames) {
  let pruned = 0;
  for (const entry of fs.readdirSync(dstRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (installedNames.has(entry.name)) continue;
    const marker = path.join(dstRoot, entry.name, "SKILL.md");
    if (!fs.existsSync(marker)) continue;
    if (!fs.readFileSync(marker, "utf8").includes("installed-from: incitaciones")) continue;
    fs.rmSync(path.join(dstRoot, entry.name), { recursive: true, force: true });
    pruned++;
  }
  if (pruned) console.log(`Pruned: ${pruned} stale incitaciones skills\n`);
}

// ── Core install logic ─────────────────────────────────
export function doInstall(prompts, options) {
  const scope = options.global ? "global" : "local";
  const base = options.dir || (scope === "local" ? process.cwd() : home());
  const dstRoot = options.dir
    ? path.resolve(options.dir)
    : path.join(base, ".agents", "skills");

  console.log(`Installing incitaciones skills (${scope})...\n`);

  let installed = 0;
  for (const prompt of prompts) {
    if (installSkill(prompt, dstRoot, options)) installed++;
  }
  console.log(`\nInstalled: ${installed} skills to ${dstRoot}/\n`);

  const installedNames = new Set(prompts.map((p) => p.name));
  pruneStaleSkills(dstRoot, installedNames);

  if (!options.tool) {
    runDetectedToolIntegrations(prompts, base, options);
  } else {
    installForSpecificTool(prompts, options);
  }
}
