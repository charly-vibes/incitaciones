#!/usr/bin/env node
// Purpose: Process local agent traces into ready-to-use insight artifacts under .cache/trace-insights/ by delegating to analyze-traces.js.
// Responsibilities:
// - Auto-detect trace inputs and spawn scripts/analyze-traces.js with normalized arguments
// - Write latest-report.json, session-records.jsonl, and label-queue.jsonl artifacts
// Rationale: keeps the one-command digest workflow (`just trace-insights`) separate from analyze-traces' rich CLI surface; artifacts land in .cache so raw traces stay out of git.
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const REPORT_DIR = path.join(REPO_ROOT, ".cache", "trace-insights");
const ANALYZER_PATH = path.join(REPO_ROOT, "scripts", "analyze-traces.js");

// Flag parsing table: `consumes` marks flags that swallow the next argv entry.
const FLAG_SPECS = {
  "--labels": { consumes: true, apply: (args, value) => { args.labelsPath = value || null; } },
  "--top": { consumes: true, apply: (args, value) => { args.top = value || "10"; } },
  "--no-cache": { consumes: false, apply: (args) => { args.noCache = true; } },
  "--verbose": { consumes: false, apply: (args) => { args.verbose = true; } },
  "--no-auto-detect": { consumes: false, apply: (args) => { args.autoDetect = false; } },
  "--help": { consumes: false, apply: () => { printHelp(); process.exit(0); } },
};

function ensureDirectory(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

function parseArgs(argv) {
  const args = {
    inputs: [],
    autoDetect: true,
    noCache: false,
    labelsPath: null,
    top: 10,
    verbose: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const spec = FLAG_SPECS[argv[index]];
    if (!spec) {
      args.inputs.push(argv[index]);
      continue;
    }
    const value = spec.consumes ? argv[index + 1] || null : undefined;
    if (spec.consumes) {
      index += 1;
    }
    spec.apply(args, value);
  }

  if (!args.autoDetect && args.inputs.length === 0) {
    printHelp();
    process.exit(1);
  }

  return args;
}

function printHelp() {
  console.log(`Usage: node scripts/trace-insights.js [trace-path...] [options]

Process local agent traces and emit ready-to-use insight artifacts.

Options:
  --labels PATH       Join manual labels from JSON or JSONL
  --top N             Top N entries in rankings (default: 10)
  --no-cache          Disable incremental analyzer cache
  --verbose           Print full source and file inventories
  --no-auto-detect    Only use explicitly passed paths
  --help              Show this help

Outputs:
  .cache/trace-insights/latest-report.json
  .cache/trace-insights/session-records.jsonl
  .cache/trace-insights/label-queue.jsonl
`);
}

function buildCommandArgs(args) {
  const commandArgs = [ANALYZER_PATH];
  if (args.autoDetect) {
    commandArgs.push("--auto-detect");
  }
  commandArgs.push(...args.inputs);
  commandArgs.push("--format", "markdown");
  commandArgs.push("--top", String(args.top));
  commandArgs.push("--json-out", path.join(REPORT_DIR, "latest-report.json"));
  commandArgs.push("--session-records-out", path.join(REPORT_DIR, "session-records.jsonl"));
  commandArgs.push("--label-queue-out", path.join(REPORT_DIR, "label-queue.jsonl"));

  if (args.labelsPath) {
    commandArgs.push("--labels", path.resolve(args.labelsPath));
  }
  if (args.noCache) {
    commandArgs.push("--no-cache");
  }
  if (args.verbose) {
    commandArgs.push("--verbose");
  }
  return commandArgs;
}

function runAnalyzer(commandArgs) {
  const result = spawnSync(process.execPath, commandArgs, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  ensureDirectory(REPORT_DIR);
  runAnalyzer(buildCommandArgs(args));

  const reportPath = path.join(REPORT_DIR, "latest-report.json");
  const sessionRecordsPath = path.join(REPORT_DIR, "session-records.jsonl");
  const labelQueuePath = path.join(REPORT_DIR, "label-queue.jsonl");
  console.log("Artifacts:");
  console.log(`- Report JSON: ${reportPath}`);
  console.log(`- Session records: ${sessionRecordsPath}`);
  console.log(`- Label queue: ${labelQueuePath}`);
}

main();
