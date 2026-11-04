// Purpose: Skill file generation for the incitaciones CLI (SKILL.md + assets).
// Responsibilities:
// - Generate per-skill frontmatter and strip the distilled file's own frontmatter
// - Install a single skill (SKILL.md + references) or a list of skills into a target dir
// Rationale: pure file-mechanics layer — no CLI state, no tool detection — so install flows and tool integrations share one canonical writer.
import fs from "node:fs";
import path from "node:path";
import { escapeYaml, getVersion, now, resolveDistilled } from "./manifest.mjs";

// ── Generate frontmatter ───────────────────────────────
function generateFrontmatter(prompt, options) {
  const desc = escapeYaml(prompt.description || `Incitaciones prompt: ${prompt.name}`);
  const lines = [
    "---",
    `name: ${prompt.name}`,
    `description: "${desc}"`,
    'installed-from: incitaciones',
    `installed-version: "${getVersion()}"`,
    `installed-at: "${now()}"`,
  ];
  // Per-skill hide flag from manifest, ORed with the global --disable-model-invocation flag
  if (prompt.disable_model_invocation === true || options?.disableModelInvocation) {
    lines.push("disable-model-invocation: true");
  }
  lines.push("---", "");
  return lines.join("\n");
}

// Strip a distilled file's own frontmatter block, if present. The installed
// SKILL.md must carry exactly one frontmatter block (generated above);
// concatenating both produced invalid double frontmatter.
function distilledBody(src) {
  const raw = fs.readFileSync(src, "utf8");
  if (!raw.startsWith("---\n")) return raw;
  const end = raw.indexOf("\n---\n", 3);
  if (end === -1) return raw;
  return raw.slice(end + 5).replace(/^\n+/, "");
}

// ── Copy a skill's non-SKILL.md assets (references, scripts) ──
function copySkillAssets(srcDir, dstDir) {
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (entry.name === "SKILL.md") continue;
    const s = path.join(srcDir, entry.name);
    const d = path.join(dstDir, entry.name);
    if (entry.isDirectory()) {
      fs.cpSync(s, d, { recursive: true });
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

// ── Install a single skill ─────────────────────────────
function installSkill(prompt, dstRoot, options) {
  const src = resolveDistilled(prompt);
  if (!src) {
    console.error(`  ⚠  ${prompt.name} (distilled not found)`);
    return false;
  }

  const dstDir = path.join(dstRoot, prompt.name);
  fs.rmSync(dstDir, { recursive: true, force: true });
  fs.mkdirSync(dstDir, { recursive: true });

  // Write SKILL.md with frontmatter + distilled body (own frontmatter stripped)
  const content = generateFrontmatter(prompt, options) + distilledBody(src);
  fs.writeFileSync(path.join(dstDir, "SKILL.md"), content, "utf8");

  // Copy references/ directory if it's a multi-file skill
  if (src.endsWith("SKILL.md")) {
    copySkillAssets(path.dirname(src), dstDir);
  }

  const multi = src.endsWith("SKILL.md") ? " (multi-file)" : "";
  console.log(`  + ${prompt.name}${multi}`);
  return true;
}

// ── Install prompt templates for pi ────────────────────
function installPromptTemplates(prompts, dstDir) {
  fs.mkdirSync(dstDir, { recursive: true });
  for (const p of prompts) {
    const desc = escapeYaml(p.description || `Incitaciones prompt: ${p.name}`);
    const tmpl = [
      "---",
      `description: "Shortcut for the ${p.name} skill. ${desc}"`,
      "---",
      "<!-- installed-from: incitaciones -->",
      "",
      `Use the installed \`${p.name}\` skill for this task.`,
      "",
      `If the skill is not automatically loaded, invoke \`/skill:${p.name}\` and follow it.`,
      "",
      "User context: $@",
      "",
    ].join("\n");
    fs.writeFileSync(path.join(dstDir, `${p.name}.md`), tmpl, "utf8");
  }
}

// ── Install skills to a directory ──────────────────────
function installSkillsTo(prompts, dir, options) {
  for (const p of prompts) {
    installSkill(p, dir, options);
  }
}

export { installSkill, installSkillsTo, installPromptTemplates };
