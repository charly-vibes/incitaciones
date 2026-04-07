#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const REPORT_DIR = path.join(REPO_ROOT, ".cache", "trace-insights");
const ANALYZER_PATH = path.join(REPO_ROOT, "scripts", "analyze-traces.js");

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
    const value = argv[index];
    if (value === "--labels") {
      args.labelsPath = argv[index + 1] || null;
      index += 1;
      continue;
    }
    if (value === "--top") {
      args.top = argv[index + 1] || "10";
      index += 1;
      continue;
    }
    if (value === "--no-cache") {
      args.noCache = true;
      continue;
    }
    if (value === "--verbose") {
      args.verbose = true;
      continue;
    }
    if (value === "--no-auto-detect") {
      args.autoDetect = false;
      continue;
    }
    if (value === "--help" || value === "-h") {
      printHelp();
      process.exit(0);
    }
    args.inputs.push(value);
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

function main() {
  const args = parseArgs(process.argv.slice(2));
  ensureDirectory(REPORT_DIR);

  const reportPath = path.join(REPORT_DIR, "latest-report.json");
  const sessionRecordsPath = path.join(REPORT_DIR, "session-records.jsonl");
  const labelQueuePath = path.join(REPORT_DIR, "label-queue.jsonl");

  const commandArgs = [ANALYZER_PATH];
  if (args.autoDetect) {
    commandArgs.push("--auto-detect");
  }
  commandArgs.push(...args.inputs);
  commandArgs.push("--format", "markdown");
  commandArgs.push("--top", String(args.top));
  commandArgs.push("--json-out", reportPath);
  commandArgs.push("--session-records-out", sessionRecordsPath);
  commandArgs.push("--label-queue-out", labelQueuePath);

  if (args.labelsPath) {
    commandArgs.push("--labels", path.resolve(args.labelsPath));
  }
  if (args.noCache) {
    commandArgs.push("--no-cache");
  }
  if (args.verbose) {
    commandArgs.push("--verbose");
  }

  const result = spawnSync(process.execPath, commandArgs, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }

  console.log("Artifacts:");
  console.log(`- Report JSON: ${reportPath}`);
  console.log(`- Session records: ${sessionRecordsPath}`);
  console.log(`- Label queue: ${labelQueuePath}`);
}

main();
