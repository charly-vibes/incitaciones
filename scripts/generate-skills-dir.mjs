#!/usr/bin/env node
// Purpose: Regenerate the skills/ catalog (skills.sh / `npx skills add` format) from content/manifest.json.
// Responsibilities:
// - Reset and populate skills/<name>/SKILL.md (+ references trees) from the manifest's distilled entries
// - Emit metadata.internal: true for skills marked disable_model_invocation (compat pointers), so the
//   skills.sh CLI hides them from discovery per the vercel-labs/skills contract
// - skills/ is COMMITTED (unlike pi-package it is a distribution surface, not an npm payload), so this
//   runs via `just generate-skills-dir` and is freshness-checked by `just validate-skills-dir` (pre-push)
// Rationale: skills.sh discovers SKILL.md only in well-known container dirs (skills/, .agents/skills/, ...).
// Our .agents/skills/ install target is machine-local and untracked, so a committed skills/ catalog is the
// bridge that makes the collection installable via `npx skills add charly-vibes/incitaciones`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const manifestPath = path.join(repoRoot, "content", "manifest.json");
const skillsOut = path.join(repoRoot, "skills");

function escapeYamlDoubleQuoted(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function resetDir(dir) {
  if (fs.existsSync(dir)) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      fs.rmSync(path.join(dir, entry.name), { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
    }
  }
  fs.mkdirSync(dir, { recursive: true });
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function getVersion() {
  try {
    const pkg = JSON.parse(readText(path.join(repoRoot, "package.json")));
    return pkg.version;
  } catch {
    return "unknown";
  }
}

// Strip the distilled file's own frontmatter: the emitted SKILL.md must carry
// exactly one frontmatter block (generated below).
function distilledBody(raw) {
  if (!raw.startsWith("---\n")) return raw;
  const end = raw.indexOf("\n---\n", 3);
  if (end === -1) return raw;
  return raw.slice(end + 5).replace(/^\n+/, "");
}

function generateSkill(prompt) {
  const distilledPath = path.join(repoRoot, prompt.distilled);
  const skillDir = path.join(skillsOut, prompt.name);
  ensureDir(skillDir);

  const internal = prompt.disable_model_invocation === true;
  const frontmatter = [
    "---",
    `name: ${prompt.name}`,
    `description: "${escapeYamlDoubleQuoted(prompt.description || `Incitaciones prompt: ${prompt.name}`)}"`,
    "metadata:",
    '  installed-from: "incitaciones"',
    `  installed-version: "${getVersion()}"`,
  ];
  if (internal) {
    // skills.sh contract: hidden from normal discovery; installable only
    // with INSTALL_INTERNAL_SKILLS=1 or an explicit SKILL.md URL
    frontmatter.push("  internal: true");
  }
  frontmatter.push("---", "");

  const raw = readText(distilledPath);
  fs.writeFileSync(path.join(skillDir, "SKILL.md"), frontmatter.join("\n") + distilledBody(raw), "utf8");

  // Copy references/ trees (multi-file skills keep their nested structure,
  // so member documents' relative references keep resolving)
  if (prompt.distilled.endsWith(`${path.sep}SKILL.md`)) {
    const srcDir = path.dirname(prompt.distilled);
    for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
      if (entry.name === "SKILL.md") continue;
      const src = path.join(srcDir, entry.name);
      const dst = path.join(skillDir, entry.name);
      if (entry.isDirectory()) {
        fs.cpSync(src, dst, { recursive: true });
      } else {
        fs.copyFileSync(src, dst);
      }
    }
  }
}

function main() {
  const manifest = JSON.parse(readText(manifestPath));
  resetDir(skillsOut);
  let count = 0;
  let hidden = 0;
  for (const prompt of manifest.prompts) {
    generateSkill(prompt);
    count++;
    if (prompt.disable_model_invocation === true) hidden++;
  }
  console.log(`Generated ${count} skills (${hidden} internal) -> skills/`);
}

main();
