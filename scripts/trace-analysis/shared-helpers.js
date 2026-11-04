// Purpose: Shared low-level helpers for the trace analyzer (fs access, hashing, counting).
// Responsibilities:
// - Path constants (repo root, manifest, cache) and small pure utilities (increment, topEntries, clipText)
// - File existence/directory helpers and hash-based identity
// Rationale: every analyzer module needs these primitives; keeping them in one dependency-free module avoids import cycles.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

export const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(MODULE_DIR, "..", "..");
export const MANIFEST_PATH = path.join(REPO_ROOT, "content", "manifest.json");
export const CACHE_DIR = path.join(REPO_ROOT, ".cache");
export const CACHE_PATH = path.join(CACHE_DIR, "trace-analysis-cache.json");

export function defaultArray(value) {
  return Array.isArray(value) ? value : [];
}

export function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function hashText(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function increment(map, key, amount = 1) {
  if (!key) {
    return;
  }
  map[key] = (map[key] || 0) + amount;
}

export function numeric(value) {
  return Number.isFinite(value) ? value : 0;
}

export function clipText(text, maxLength = 240) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 1)}…`;
}

export function sumMapValues(map) {
  return Object.values(map).reduce((sum, value) => sum + value, 0);
}

export function mergeMaps(target, source) {
  for (const [key, value] of Object.entries(source)) {
    target[key] = (target[key] || 0) + value;
  }
}

export function topEntries(map, limit) {
  return Object.entries(map)
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }
      return left[0].localeCompare(right[0]);
    })
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

export function fileExists(targetPath) {
  try {
    fs.accessSync(targetPath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

export function ensureDirectory(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

export function expandHome(targetPath) {
  if (!targetPath.startsWith("~/")) {
    return targetPath;
  }
  return path.join(process.env.HOME || "", targetPath.slice(2));
}

export function loadManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
}

export function computeCacheVersion() {
  // Invalidate the cache whenever any analyzer module (or the manifest) changes.
  const moduleSources = fs
    .readdirSync(MODULE_DIR)
    .filter((name) => name.endsWith(".js"))
    .sort()
    .map((name) => fs.readFileSync(path.join(MODULE_DIR, name), "utf8"))
    .join("\n");
  const scriptHash = hashText(moduleSources);
  const manifestHash = hashText(fs.readFileSync(MANIFEST_PATH, "utf8"));
  return `v2:${scriptHash}:${manifestHash}`;
}
