// Purpose: Agent-tool integration for the incitaciones CLI (pi, amp, claude, gemini).
// Responsibilities:
// - Detect installed agent-tool directories and install per-tool layouts
// - Run integrations for all detected tools, or enforce a specific --tool choice
// Rationale: tool-specific wiring (symlink handling, pi prompt templates, gemini TOML commands) is isolated here so skill-writing mechanics stay tool-agnostic.
import fs from "node:fs";
import path from "node:path";
import { escapeYaml, home, resolveDistilled } from "./manifest.mjs";
import { installSkillsTo, installPromptTemplates } from "./skill-files.mjs";

function isSymlink(targetPath) {
  return fs.existsSync(targetPath) && fs.lstatSync(targetPath)?.isSymbolicLink?.();
}

// ── Tool detection ─────────────────────────────────────
const TOOL_CONFIGS = [
  {
    id: "pi",
    detect: (base) => fs.existsSync(path.join(base, ".pi")) || fs.existsSync(path.join(home(), ".pi", "agent")),
    install: (prompts, base, options) => {
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
    install: (prompts, base, options) => {
      const skillsDir = path.join(home(), ".config", "amp", "skills");
      if (isSymlink(skillsDir)) {
        console.log(`  + amp (symlinked)`);
        return;
      }
      installSkillsTo(prompts, skillsDir, options);
      console.log(`  + amp (skills)`);
    },
  },
  {
    id: "claude",
    dir: (base) => path.join(base, ".claude"),
    detect: (base) => fs.existsSync(path.join(base, ".claude")),
    install: (prompts, base, options) => {
      const skillsDir = path.join(base, ".claude", "skills");
      if (isSymlink(skillsDir)) {
        console.log("  + claude (symlinked)");
        return;
      }
      installSkillsTo(prompts, skillsDir, options);
      console.log("  + claude (skills)");
    },
  },
  {
    id: "gemini",
    dir: (base) => path.join(base, ".gemini"),
    detect: (base) => fs.existsSync(path.join(base, ".gemini")),
    install: (prompts, base, options) => {
      installGeminiCommands(prompts, base);
      installGeminiSkills(prompts, base, options);
    },
  },
];

function installGeminiCommands(prompts, base) {
  const cmdsDir = path.join(base, ".gemini", "commands", "incitaciones");
  fs.mkdirSync(cmdsDir, { recursive: true });
  for (const p of prompts) {
    if (!resolveDistilled(p)) continue;
    writeGeminiCommand(p, cmdsDir);
  }
}

function writeGeminiCommand(prompt, cmdsDir) {
  const src = resolveDistilled(prompt);
  const desc = escapeYaml(prompt.description || `Incitaciones prompt: ${prompt.name}`);
  const content = fs.readFileSync(src, "utf8");
  const escaped = content.replace(/\\/g, "\\\\").replace(/"""/g, '\\"""');
  const toml = [
    `description = "${desc}"`,
    'prompt = """',
    escaped,
    '"""',
    "",
  ].join("\n");
  fs.writeFileSync(path.join(cmdsDir, `${prompt.name}.toml`), toml, "utf8");
}

function installGeminiSkills(prompts, base, options) {
  const skillsDir = path.join(base, ".gemini", "skills");
  if (isSymlink(skillsDir)) {
    console.log("  + gemini (commands + skills symlinked)");
    return;
  }
  installSkillsTo(prompts, skillsDir, options);
  console.log("  + gemini (commands + skills)");
}

// ── Tool integrations ──────────────────────────────────
export function runDetectedToolIntegrations(prompts, base, options) {
  console.log("Setting up tool integrations...");
  let found = 0;
  for (const tool of TOOL_CONFIGS) {
    if (tool.detect(base)) {
      try {
        tool.install(prompts, base, options);
        found++;
      } catch (e) {
        console.error(`  ⚠  ${tool.id}: ${e.message}`);
      }
    }
  }
  if (!found) {
    console.log("  (no tool directories detected — skills installed to .agents/skills/)");
  }
}

export function installForSpecificTool(prompts, options) {
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
  tool.install(prompts, base, options);
}
