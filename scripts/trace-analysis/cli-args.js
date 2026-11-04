// Purpose: CLI argument parsing and help text for the trace analyzer.
// Responsibilities:
// - Table-driven parse of analyzer flags into an args object
// - Print usage/help; enforce required inputs and supported formats
// Rationale: keeps the analyzer's flag surface in one small, declarative module so adding flags is a table row, not a branch.
import process from "node:process";

// Flags that consume the following argv entry. `fallback` mirrors the
// original `argv[index + 1] || fallback` behavior.
const VALUE_FLAGS = {
  "--format": { key: "format", fallback: "markdown" },
  "--top": { key: "top", fallback: "10", numeric: true },
  "--json-out": { key: "jsonOut", fallback: null },
  "--session-records-out": { key: "sessionRecordsOut", fallback: null },
  "--labels": { key: "labelsPath", fallback: null },
  "--label-queue-out": { key: "labelQueueOut", fallback: null },
};

// Boolean flags and pseudo-commands.
const SWITCH_FLAGS = {
  "--auto-detect": (args) => { args.autoDetect = true; },
  "--no-cache": (args) => { args.noCache = true; },
  "--verbose": (args) => { args.verbose = true; },
  "--help": () => { printHelp(); process.exit(0); },
  "-h": () => { printHelp(); process.exit(0); },
};

export function parseArgs(argv) {
  const args = {
    inputs: [],
    format: "markdown",
    top: 10,
    jsonOut: null,
    sessionRecordsOut: null,
    labelsPath: null,
    labelQueueOut: null,
    autoDetect: false,
    noCache: false,
    verbose: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    const valueFlag = VALUE_FLAGS[value];
    if (valueFlag) {
      const raw = argv[index + 1] || valueFlag.fallback;
      args[valueFlag.key] = valueFlag.numeric ? Number.parseInt(raw, 10) : raw;
      index += 1;
      continue;
    }
    const switchFlag = SWITCH_FLAGS[value];
    if (switchFlag) {
      switchFlag(args);
      continue;
    }
    args.inputs.push(value);
  }

  if (args.inputs.length === 0 && !args.autoDetect) {
    printHelp();
    process.exit(1);
  }

  if (!["markdown", "json", "both"].includes(args.format)) {
    throw new Error(`Unsupported format: ${args.format}`);
  }

  return args;
}

export function printHelp() {
  console.log(`Usage: node scripts/analyze-traces.js <trace-path...> [options]

Analyze trace exports from multiple agent tools and summarize usage patterns.

Options:
  --format markdown|json|both   Output format (default: markdown)
  --top N                       Top N items per ranking (default: 10)
  --json-out PATH               Write JSON report to PATH
  --session-records-out PATH    Write normalized per-session records as JSONL
  --labels PATH                 Join manual labels from JSON or JSONL
  --label-queue-out PATH        Write unlabeled session queue as JSONL
  --auto-detect                 Scan common local CLI history locations
  --no-cache                    Disable incremental per-file cache
  --verbose                     Include full source and file inventories in markdown
  --help                        Show this help

Accepted inputs:
  - Directories containing trace exports
  - Individual .json, .jsonl, .ndjson, .log, .txt, or .md files
`);
}
