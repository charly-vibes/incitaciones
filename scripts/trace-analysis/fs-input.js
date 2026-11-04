// Purpose: Trace input discovery, label loading, and analyzer cache I/O.
// Responsibilities:
// - Enumerate candidate trace files (explicit paths or well-known CLI history locations)
// - Load/join manual labels and write JSONL artifacts
// - Version and persist the per-file metrics cache
// Rationale: all filesystem surface of the analyzer in one module; parsing/metrics never touch discovery or persistence.
import fs from "node:fs";
import path from "node:path";
import {
  CACHE_DIR,
  CACHE_PATH,
  computeCacheVersion,
  ensureDirectory,
  expandHome,
  fileExists,
  hashText,
} from "./shared-helpers.js";
import { inferProviderForDetectedPath } from "./manifest-catalog.js";

const LABELS_PATTERN = /labels.*\.(json|jsonl|ndjson)$/i;
const TRACE_FILE_PATTERN = /\.(json|jsonl|ndjson|log|txt|md)$/i;
const AMBIGUOUS_HISTORY_PATTERN = /conversation|session|transcript|history/i;

export function listFiles(inputPath) {
  const absolute = path.resolve(inputPath);
  const stats = fs.statSync(absolute);
  if (stats.isFile()) {
    if (LABELS_PATTERN.test(path.basename(absolute))) {
      return [];
    }
    return [absolute];
  }

  const files = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const entryPath = path.join(absolute, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".cache") {
        continue;
      }
      files.push(...listFiles(entryPath));
      continue;
    }
    if (LABELS_PATTERN.test(entry.name)) {
      continue;
    }
    if (TRACE_FILE_PATTERN.test(entry.name)) {
      files.push(entryPath);
    }
  }
  return files;
}

function createDetector() {
  const detected = [];
  const seen = new Set();

  function addPath(provider, candidatePath) {
    const resolved = path.resolve(expandHome(candidatePath));
    if (!fileExists(resolved) || seen.has(resolved)) {
      return;
    }
    seen.add(resolved);
    detected.push({ provider, path: resolved });
  }

  function walk(rootPath, predicate) {
    const resolvedRoot = path.resolve(expandHome(rootPath));
    if (!fileExists(resolvedRoot)) {
      return;
    }

    const stats = fs.statSync(resolvedRoot);
    if (stats.isFile()) {
      if (predicate(resolvedRoot)) {
        addPath("unknown", resolvedRoot);
      }
      return;
    }

    for (const entry of fs.readdirSync(resolvedRoot, { withFileTypes: true })) {
      const entryPath = path.join(resolvedRoot, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath, predicate);
        continue;
      }
      if (predicate(entryPath)) {
        addPath("unknown", entryPath);
      }
    }
  }

  return { addPath, walk };
}

const HISTORY_PREDICATE = (entryPath) =>
  AMBIGUOUS_HISTORY_PATTERN.test(path.basename(entryPath)) &&
  TRACE_FILE_PATTERN.test(entryPath);

export function autoDetectInputs() {
  const { addPath, walk } = createDetector();

  walk(
    "~/.claude/projects",
    (entryPath) => /\.jsonl$/i.test(entryPath) && !/\/subagents\//i.test(entryPath),
  );

  walk("~/.gemini/tmp", (entryPath) => /\/chats\/session-.*\.json$/i.test(entryPath));

  addPath("codex", "~/.codex/history.jsonl");
  addPath("codex", "~/.codex/log/codex-tui.log");

  walk("~/.amp", HISTORY_PREDICATE);
  walk("~/.config/amp", HISTORY_PREDICATE);
  walk("~/.opencode", HISTORY_PREDICATE);
  walk("~/.config/opencode", HISTORY_PREDICATE);

  return detected.map((item) => ({
    provider: inferProviderForDetectedPath(item.path) || item.provider,
    path: item.path,
  }));
}

export function deriveSessionId(filePath) {
  const base = path.basename(filePath).replace(/\.(json|jsonl|ndjson|log|txt|md)$/i, "");
  return base || hashText(filePath).slice(0, 12);
}

export function loadCache(disabled = false) {
  const version = computeCacheVersion();
  if (disabled || !fileExists(CACHE_PATH)) {
    return {
      version,
      files: {},
    };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
    if (!parsed || typeof parsed !== "object" || !parsed.files || parsed.version !== version) {
      return { version, files: {} };
    }
    return parsed;
  } catch {
    return { version, files: {} };
  }
}

export function saveCache(cache, disabled = false) {
  if (disabled) {
    return;
  }
  ensureDirectory(CACHE_DIR);
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

export function writeJsonl(outputPath, rows) {
  ensureDirectory(path.dirname(path.resolve(outputPath)));
  const body = rows.map((row) => JSON.stringify(row)).join("\n");
  fs.writeFileSync(path.resolve(outputPath), body.length > 0 ? `${body}\n` : "");
}

export function loadLabels(labelsPath) {
  if (!labelsPath) {
    return [];
  }

  const resolved = path.resolve(labelsPath);
  if (!fileExists(resolved)) {
    throw new Error(`Labels file not found: ${resolved}`);
  }

  const content = fs.readFileSync(resolved, "utf8").trim();
  if (!content) {
    return [];
  }

  if (/\.jsonl$/i.test(resolved) || /\.ndjson$/i.test(resolved)) {
    return content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  }

  const parsed = JSON.parse(content);
  if (Array.isArray(parsed)) {
    return parsed;
  }
  return [parsed];
}

export function getFileSignature(filePath) {
  const stats = fs.statSync(filePath);
  return {
    mtimeMs: stats.mtimeMs,
    size: stats.size,
  };
}

export function readMetricsWithCache(filePath, analyzers, sourceProvider, parseFn) {
  const signature = getFileSignature(filePath);
  const cacheEntry = analyzers.cache.files[filePath];

  if (
    !analyzers.cacheDisabled &&
    cacheEntry &&
    cacheEntry.mtimeMs === signature.mtimeMs &&
    cacheEntry.size === signature.size &&
    cacheEntry.metrics
  ) {
    analyzers.cacheStats.hits += 1;
    return cacheEntry.metrics;
  }

  analyzers.cacheStats.misses += 1;
  const metrics = parseFn(filePath, analyzers, sourceProvider);
  analyzers.cache.files[filePath] = {
    mtimeMs: signature.mtimeMs,
    size: signature.size,
    metrics,
  };
  return metrics;
}

export function buildLabelIndex(labels) {
  const bySessionId = new Map();
  const byFilePath = new Map();

  for (const label of labels) {
    if (label.session_id) {
      bySessionId.set(label.session_id, label);
    }
    if (label.file_path) {
      byFilePath.set(path.resolve(label.file_path), label);
    }
  }

  return { bySessionId, byFilePath };
}
