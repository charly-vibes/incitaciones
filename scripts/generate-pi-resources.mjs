#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import process from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const manifestPath = path.join(repoRoot, "content", "manifest.json");
const outRoot = path.join(repoRoot, "pi-package");
const skillsOut = path.join(outRoot, "skills");
const promptsOut = path.join(outRoot, "prompts");

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

function getPackageVersion() {
  try {
    const pkg = JSON.parse(readText(path.join(repoRoot, "package.json")));
    return `npm:${pkg.version}`;
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function generateSkill(prompt) {
  const distilledPath = path.join(repoRoot, prompt.distilled);
  const skillDir = path.join(skillsOut, prompt.name);
  ensureDir(skillDir);

  const frontmatter = [
    "---",
    `name: ${prompt.name}`,
    `description: \"${escapeYamlDoubleQuoted(prompt.description || `Incitaciones prompt: ${prompt.name}`)}\"`,
    "metadata:",
    '  installed-from: "incitaciones"',
    "---",
    "",
  ].join("\n");

  fs.writeFileSync(path.join(skillDir, "SKILL.md"), frontmatter + readText(distilledPath), "utf8");

  if (distilledPath.endsWith(`${path.sep}SKILL.md`)) {
    const srcDir = path.dirname(distilledPath);
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

function generatePromptTemplate(prompt) {
  const description = prompt.description || `Incitaciones prompt: ${prompt.name}`;
  const template = [
    "---",
    `description: \"${escapeYamlDoubleQuoted(`Shortcut for the ${prompt.name} skill. ${description}`)}\"`,
    "---",
    "<!-- installed-from: incitaciones -->",
    "",
    `Use the installed \`${prompt.name}\` skill for this task.`,
    "",
    `If the skill is not automatically loaded, invoke \`/skill:${prompt.name}\` and follow it.`,
    "",
    "User context: $@",
    "",
  ].join("\n");

  fs.writeFileSync(path.join(promptsOut, `${prompt.name}.md`), template, "utf8");
}

/**
 * Detect flat-skills directories that already have incitaciones skills installed,
 * and re-sync them with the latest pi-package content. This ensures that
 * pi update / npm version bumps keep flat-install locations current.
 *
 * Flat installs (e.g. ~/.agents/skills/) are created by install.sh and
 * npx incitaciones install, but are NOT managed by pi's package reader
 * (which reads directly from pi-package/skills/). Without this re-sync,
 * a version bump leaves those directories stale.
 */
function reSyncFlatInstallSkills(manifest) {
  const version = getPackageVersion();
  const now = new Date().toISOString().replace("Z", "000Z");
  const home = homedir();

  // Candidate directories to check for incitaciones flat installs
  const candidates = [
    path.join(home, ".agents", "skills"),
    path.join(home, ".config", "agents", "skills"),
  ];

  // Also check .agents/skills in cwd for project-local installs
  try {
    candidates.push(path.join(process.cwd(), ".agents", "skills"));
  } catch {}

  // Deduplicate
  const checked = new Set();
  const dirs = candidates.filter((d) => {
    if (checked.has(d)) return false;
    checked.add(d);
    return fs.existsSync(d);
  });

  let synced = 0;
  for (const dir of dirs) {
    // Check if this directory has incitaciones-installed skills
    // by reading the first SKILL.md we find and checking its frontmatter
    let hasIncitaciones = false;
    try {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const skillFile = path.join(dir, entry.name, "SKILL.md");
        if (!fs.existsSync(skillFile)) continue;
        const content = fs.readFileSync(skillFile, "utf8");
        if (content.includes("installed-from: incitaciones") || content.includes("installed-from: \"incitaciones\"")) {
          hasIncitaciones = true;
          break;
        }
      }
    } catch {
      // Permission issues, etc. — skip
      continue;
    }

    if (!hasIncitaciones) continue;

    // Re-sync: for each prompt in manifest, copy from pi-package/skills/ to flat dir
    for (const prompt of manifest.prompts) {
      const srcDir = path.join(skillsOut, prompt.name);
      if (!fs.existsSync(srcDir)) continue;

      const dstDir = path.join(dir, prompt.name);
      fs.rmSync(dstDir, { recursive: true, force: true });
      fs.mkdirSync(dstDir, { recursive: true });

      // Generate flat-format frontmatter for SKILL.md
      const distilledPath = path.join(repoRoot, prompt.distilled);
      if (!fs.existsSync(distilledPath)) continue;

      const description = escapeYamlDoubleQuoted(prompt.description || `Incitaciones prompt: ${prompt.name}`);
      const frontmatter = [
        "---",
        `name: ${prompt.name}`,
        `description: "${description}"`,
        "installed-from: incitaciones",
        `installed-version: "${version}"`,
        `installed-at: "${now}"`,
        "---",
        "",
      ].join("\n");

      fs.writeFileSync(path.join(dstDir, "SKILL.md"), frontmatter + readText(distilledPath), "utf8");

      // Copy references/ from the source skill directory
      if (distilledPath.endsWith(`${path.sep}SKILL.md`)) {
        const srcRefDir = path.dirname(distilledPath);
        for (const entry of fs.readdirSync(srcRefDir, { withFileTypes: true })) {
          if (entry.name === "SKILL.md") continue;
          const s = path.join(srcRefDir, entry.name);
          const d = path.join(dstDir, entry.name);
          if (entry.isDirectory()) {
            fs.cpSync(s, d, { recursive: true });
          } else {
            fs.copyFileSync(s, d);
          }
        }
      }
    }
    synced++;
  }

  if (synced > 0) {
    console.log(`Re-synced incitaciones skills in ${synced} flat-install director(ies)`);
  }
}

function main() {
  const manifest = JSON.parse(readText(manifestPath));
  resetDir(outRoot);
  ensureDir(skillsOut);
  ensureDir(promptsOut);

  for (const prompt of manifest.prompts) {
    generateSkill(prompt);
    generatePromptTemplate(prompt);
  }

  const readme = [
    "# Generated pi package resources",
    "",
    "This directory is generated by `node scripts/generate-pi-resources.mjs`.",
    "The generated files are committed so `pi install .` works from a clean checkout.",
    "Refresh them with `just generate-pi-resources` after changing distilled content or manifest entries.",
    "Do not edit files here by hand.",
    "",
    "- `skills/` contains pi-compatible Agent Skills",
    "- `prompts/` contains pi prompt templates",
    "",
    "## Install from npm",
    "",
    "```bash",
    "pi install npm:incitaciones",
    "```",
    "",
    "This package is published as [`incitaciones` on npm](https://www.npmjs.com/package/incitaciones).",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(outRoot, "README.md"), readme, "utf8");

  console.log(`Generated pi resources for ${manifest.prompts.length} prompts in ${path.relative(repoRoot, outRoot)}/`);

  // Re-sync any existing flat-install skill directories (e.g. ~/.agents/skills/)
  reSyncFlatInstallSkills(manifest);
}

main();