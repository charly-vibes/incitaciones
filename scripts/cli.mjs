#!/usr/bin/env node
/**
 * incitaciones CLI — Install LLM agent skills across tools.
 *
 * Usage:
 *   npx incitaciones               Install all skills (default)
 *   npx incitaciones install       Install all skills
 *   npx incitaciones install --bundle essentials
 *   npx incitaciones install --tool claude
 *   npx incitaciones list          List available skills
 *   npx incitaciones info <name>   Show skill details
 *   npx incitaciones --help        Show this message
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, "..");

// ── Paths ─────────────────────────────────────────────
const MANIFEST_PATH = path.join(PACKAGE_ROOT, "content", "manifest.json");
const DISTILLED_DIR = path.join(PACKAGE_ROOT, "content", "distilled");

// ── Helpers ────────────────────────────────────────────
function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function escapeYaml(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function now() {
  return new Date().toISOString().replace("Z", "000Z");
}

function shortDate() {
  return new Date().toISOString().slice(0, 10);
}

// ── Manifest ───────────────────────────────────────────
function getManifest() {
  try {
    return readJSON(MANIFEST_PATH);
  } catch {
    console.error("❌ manifest.json not found at", MANIFEST_PATH);
    process.exit(1);
  }
}

function getPrompts(manifest, bundle) {
  if (!bundle || bundle === "all") return manifest.prompts;
  const names = manifest.bundles?.[bundle]?.prompts;
  if (!names) {
    console.error(`❌ Unknown bundle: "${bundle}"`);
    const keys = Object.keys(manifest.bundles || {}).filter((k) => k !== "all");
    console.error(`   Available bundles: ${keys.join(", ")}`);
    process.exit(1);
  }
  return manifest.prompts.filter((p) => names.includes(p.name));
}

// ── Resolve distilled path ─────────────────────────────
function resolveDistilled(prompt) {
  const rel = prompt.distilled;
  const abs = path.resolve(PACKAGE_ROOT, rel);
  return fs.existsSync(abs) ? abs : null;
}

// ── Generate frontmatter ───────────────────────────────
function generateFrontmatter(prompt) {
  const desc = escapeYaml(prompt.description || `Incitaciones prompt: ${prompt.name}`);
  return [
    "---",
    `name: ${prompt.name}`,
    `description: "${desc}"`,
    'installed-from: incitaciones',
    `installed-version: "${getVersion()}"`,
    `installed-at: "${now()}"`,
    "---",
    "",
  ].join("\n");
}

function getVersion() {
  try {
    const pkg = readJSON(path.join(PACKAGE_ROOT, "package.json"));
    return `npm:${pkg.version}`;
  } catch {
    return shortDate();
  }
}

// ── Install a single skill ─────────────────────────────
function installSkill(prompt, dstRoot) {
  const src = resolveDistilled(prompt);
  if (!src) {
    console.error(`  ⚠  ${prompt.name} (distilled not found)`);
    return false;
  }

  const dstDir = path.join(dstRoot, prompt.name);
  fs.rmSync(dstDir, { recursive: true, force: true });
  fs.mkdirSync(dstDir, { recursive: true });

  // Write SKILL.md with frontmatter
  const content = generateFrontmatter(prompt) + fs.readFileSync(src, "utf8");
  fs.writeFileSync(path.join(dstDir, "SKILL.md"), content, "utf8");

  // Copy references/ directory if it's a multi-file skill
  const srcDir = path.dirname(src);
  if (src.endsWith("SKILL.md")) {
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

// ── Tool detection ─────────────────────────────────────
const TOOL_CONFIGS = [
  {
    id: "pi",
    detect: (base) => fs.existsSync(path.join(base, ".pi")) || fs.existsSync(path.join(home(), ".pi", "agent")),
    install: (prompts, base) => {
      const isLocal = fs.existsSync(path.join(base, ".pi"));
      const piDir = isLocal
        ? path.join(base, ".pi")
        : path.join(home(), ".pi", "agent");
      const promptsDir = path.join(piDir, "prompts");
      installPromptTemplates(prompts, promptsDir);
      console.log(`  ${isLocal ? "+" : "~"} pi (reads .agents/skills/ + prompt templates)`);
    },
  },
  {
    id: "amp",
    dir: () => path.join(home(), ".config", "amp"),
    detect: (base) => fs.existsSync(path.join(home(), ".config", "amp")),
    install: (prompts, base) => {
      const ampDir = path.join(home(), ".config", "amp");
      const skillsDir = path.join(ampDir, "skills");
      const link = fs.readlinkSync(skillsDir, { encoding: "utf8" }).trim();
      if (fs.existsSync(skillsDir) && fs.lstatSync(skillsDir)?.isSymbolicLink?.()) {
        console.log(`  + amp (symlinked)`);
        return;
      }
      installSkillsTo(prompts, skillsDir);
      console.log(`  + amp (skills)`);
    },
  },
  {
    id: "claude",
    dir: (base) => path.join(base, ".claude"),
    detect: (base) => fs.existsSync(path.join(base, ".claude")),
    install: (prompts, base) => {
      const skillsDir = path.join(base, ".claude", "skills");
      const isSymlink = fs.existsSync(skillsDir) && fs.lstatSync(skillsDir)?.isSymbolicLink?.();
      if (isSymlink) {
        console.log("  + claude (symlinked)");
        return;
      }
      installSkillsTo(prompts, skillsDir);
      console.log("  + claude (skills)");
    },
  },
  {
    id: "gemini",
    dir: (base) => path.join(base, ".gemini"),
    detect: (base) => fs.existsSync(path.join(base, ".gemini")),
    install: (prompts, base) => {
      const cmdsDir = path.join(base, ".gemini", "commands", "incitaciones");
      fs.mkdirSync(cmdsDir, { recursive: true });
      for (const p of prompts) {
        const src = resolveDistilled(p);
        if (!src) continue;
        const desc = escapeYaml(p.description || `Incitaciones prompt: ${p.name}`);
        const content = fs.readFileSync(src, "utf8");
        const escaped = content.replace(/\\/g, "\\\\").replace(/"""/g, '\\"""');
        const toml = [
          `description = "${desc}"`,
          'prompt = """',
          escaped,
          '"""',
          "",
        ].join("\n");
        fs.writeFileSync(path.join(cmdsDir, `${p.name}.toml`), toml, "utf8");
      }
      const skillsDir = path.join(base, ".gemini", "skills");
      const isSymlink = fs.existsSync(skillsDir) && fs.lstatSync(skillsDir)?.isSymbolicLink?.();
      if (!isSymlink) {
        installSkillsTo(prompts, skillsDir);
        console.log("  + gemini (commands + skills)");
      } else {
        console.log("  + gemini (commands + skills symlinked)");
      }
    },
  },
];

function home() {
  return process.env.HOME || process.env.USERPROFILE || "/home";
}

// ── Install skills to a directory ──────────────────────
function installSkillsTo(prompts, dir) {
  for (const p of prompts) {
    installSkill(p, dir);
  }
}

// ── Core install logic ─────────────────────────────────
function doInstall(prompts, options) {
  const scope = options.global ? "global" : "local";
  const base = options.dir || (scope === "local" ? process.cwd() : home());
  const dstRoot = options.dir
    ? path.resolve(options.dir)
    : path.join(base, ".agents", "skills");

  console.log(`Installing incitaciones skills (${scope})...\n`);

  let installed = 0;
  for (const prompt of prompts) {
    if (installSkill(prompt, dstRoot)) installed++;
  }
  console.log(`\nInstalled: ${installed} skills to ${dstRoot}/\n`);

  // Tool integrations
  if (!options.tool) {
    console.log("Setting up tool integrations...");
    let found = 0;
    for (const tool of TOOL_CONFIGS) {
      if (tool.detect(base)) {
        try {
          tool.install(prompts, base);
          found++;
        } catch (e) {
          console.error(`  ⚠  ${tool.id}: ${e.message}`);
        }
      }
    }
    if (!found) {
      console.log("  (no tool directories detected — skills installed to .agents/skills/)");
    }
  } else {
    // Install for specific tool only
    const tool = TOOL_CONFIGS.find((t) => t.id === options.tool);
    if (!tool) {
      console.error(`❌ Unknown tool: "${options.tool}"`);
      const ids = TOOL_CONFIGS.map((t) => t.id).join(", ");
      console.error(`   Supported: ${ids}`);
      process.exit(1);
    }
    const base = options.global ? home() : process.cwd();
    if (!tool.detect(base)) {
      console.error(`❌ Tool "${options.tool}" not detected at ${base}`);
      process.exit(1);
    }
    tool.install(prompts, base);
  }
}

// ── Commands ───────────────────────────────────────────
function doList(prompts) {
  console.log("Available incitaciones skills:\n");
  for (const p of prompts) {
    console.log(`  ${p.name} — ${p.description || "(no description)"}`);
  }

  try {
    const manifest = getManifest();
    const bundles = manifest.bundles || {};
    const bundleKeys = Object.keys(bundles).filter((k) => k !== "all");
    if (bundleKeys.length > 0) {
      console.log("\nBundles:");
      for (const key of bundleKeys) {
        const desc = bundles[key].description || "";
        const count = bundles[key].prompts.length;
        console.log(`  ${key} (${count} prompts) — ${desc}`);
      }
    }
  } catch {}

  console.log(`\nTotal: ${prompts.length} skills`);
}

function doInfo(name, prompts) {
  const prompt = prompts.find((p) => p.name === name);
  if (!prompt) {
    console.error(`❌ Skill not found: "${name}"`);
    const names = prompts.map((p) => p.name).sort();
    console.error(`   Available: ${names.join(", ")}`);
    process.exit(1);
  }

  const src = resolveDistilled(prompt);
  console.log(`\n  ${prompt.name}`);
  console.log(`  ${"=".repeat(prompt.name.length)}`);
  console.log(`  Description: ${prompt.description || "(none)"}`);
  console.log(`  Type:       ${prompt.type || "prompt"}`);
  console.log(`  Status:     ${prompt.status || "unknown"}`);
  console.log(`  Tags:       ${(prompt.tags || []).join(", ") || "(none)"}`);
  console.log(`  Source:     ${prompt.source || "(none)"}`);
  console.log(`  Distilled:  ${prompt.distilled}`);
  if (src) {
    const lines = fs.readFileSync(src, "utf8").split("\n").length;
    const isMulti = src.endsWith("SKILL.md");
    console.log(`  Lines:      ${lines}${isMulti ? " + references" : ""}`);
  }
  console.log("");

  // Show related prompts
  const related = prompt.related || [];
  if (related.length > 0) {
    console.log("  Related:");
    for (const r of related) {
      console.log(`    - ${r}`);
    }
    console.log("");
  }
}

// ── Main ───────────────────────────────────────────────
function usage() {
  console.log(`Usage:
  npx incitaciones [command] [options]

Commands:
  install    Install skills (default command)
  list       List available skills
  info       Show details for a skill
  help       Show this message

Options (install):
  --bundle <name>   Install only a specific bundle (default: all)
  --tool <id>       Install for a specific tool only (detected automatically otherwise)
  --dir <path>      Install to a custom directory
  --global          Install globally (~/.agents/skills/)
  --local           Install to current project (.agents/skills/) (default when in git repo)

Examples:
  npx incitaciones                    # Install all skills
  npx incitaciones install --bundle essentials
  npx incitaciones install --tool claude
  npx incitaciones list
  npx incitaciones info commit
`);
}

function parseArgs(argv) {
  const args = { command: "install", bundle: "all", global: false, local: false, tool: null, dir: null };
  let i = 2;

  while (i < argv.length) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.command = "help";
      i++;
    } else if (arg === "list") {
      args.command = "list";
      i++;
    } else if (arg === "install") {
      args.command = "install";
      i++;
    } else if (arg === "info") {
      args.command = "info";
      args.name = argv[i + 1];
      i += 2;
    } else if (arg === "help") {
      args.command = "help";
      i++;
    } else if (arg === "--bundle") {
      args.bundle = argv[i + 1];
      i += 2;
    } else if (arg === "--tool") {
      args.tool = argv[i + 1];
      i += 2;
    } else if (arg === "--dir") {
      args.dir = argv[i + 1];
      i += 2;
    } else if (arg === "--global") {
      args.global = true;
      i++;
    } else if (arg === "--local") {
      args.local = true;
      i++;
    } else {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(1);
    }
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv);
  const manifest = getManifest();
  const prompts = getPrompts(manifest, args.bundle);

  switch (args.command) {
    case "help":
      usage();
      break;
    case "list":
      doList(prompts);
      break;
    case "info":
      doInfo(args.name, prompts);
      break;
    case "install":
    default:
      doInstall(prompts, args);
      break;
  }
}

main();