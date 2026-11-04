#!/usr/bin/env node
// Purpose: Install incitaciones skills from the manifest into agent tools (pi, Claude Code, Amp, Gemini CLI, etc.) from the command line.
// Responsibilities:
// - Route CLI commands (install/list/info/help) after table-driven argument parsing
// - Delegate install mechanics to scripts/lib/install.mjs, display to scripts/lib/display.mjs
// Rationale: standalone npm CLI (bin: scripts/cli.mjs) so installs don't require cloning the repo; manifest is the single source of truth for what ships (bd: incitaciones packaging).

/**
 * Usage:
 *   npx incitaciones               Install all skills (default)
 *   npx incitaciones install       Install all skills
 *   npx incitaciones install --bundle essentials
 *   npx incitaciones install --tool claude
 *   npx incitaciones list          List available skills
 *   npx incitaciones info <name>   Show skill details
 *   npx incitaciones --help        Show this message
 */

import process from "node:process";
import { doInstall } from "./lib/install.mjs";
import { getManifest, getPrompts } from "./lib/manifest.mjs";
import { doList, doInfo } from "./lib/display.mjs";

// ── Argument parsing ───────────────────────────────────
// Flags and sub-commands that take no value. `info` handled separately
// because its value is the skill name.
const FLAG_SPECS = {
  "--help": (args) => { args.command = "help"; },
  "-h": (args) => { args.command = "help"; },
  list: (args) => { args.command = "list"; },
  install: (args) => { args.command = "install"; },
  help: (args) => { args.command = "help"; },
  "--global": (args) => { args.global = true; },
  "--local": (args) => { args.local = true; },
  "--disable-model-invocation": (args) => { args.disableModelInvocation = true; },
};

// Options that consume the next argv entry.
const VALUE_SPECS = {
  "--bundle": (args, value) => { args.bundle = value; },
  "--tool": (args, value) => { args.tool = value; },
  "--dir": (args, value) => { args.dir = value; },
};

function parseArgs(argv) {
  const args = { command: "install", bundle: "all", global: false, local: false, tool: null, dir: null };
  let i = 2;

  while (i < argv.length) {
    const arg = argv[i];
    const applyValue = VALUE_SPECS[arg];
    if (applyValue) {
      applyValue(args, argv[i + 1]);
      i += 2;
      continue;
    }
    const applyFlag = FLAG_SPECS[arg];
    if (applyFlag) {
      applyFlag(args);
      i += 1;
      continue;
    }
    if (arg === "info") {
      args.command = "info";
      args.name = argv[i + 1];
      i += 2;
      continue;
    }
    console.error(`Unknown option: ${arg}`);
    usage();
    process.exit(1);
  }
  return args;
}

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

// ── Main ───────────────────────────────────────────────
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
