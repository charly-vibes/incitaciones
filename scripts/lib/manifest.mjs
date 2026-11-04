// Purpose: Manifest access and shared environment helpers for the incitaciones CLI.
// Responsibilities:
// - Locate and parse content/manifest.json; resolve prompts and bundles
// - Resolve distilled source paths and expose environment/package metadata helpers
// Rationale: single source of truth for what ships (bd: incitaciones packaging); every install/display module reads through this layer instead of touching the filesystem ad hoc.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// This module lives at scripts/lib/, so the package root is two levels up.
const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

// ── Paths ─────────────────────────────────────────────
const MANIFEST_PATH = path.join(PACKAGE_ROOT, "content", "manifest.json");

// ── Helpers ────────────────────────────────────────────
function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function escapeYaml(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function now() {
  return new Date().toISOString().replace("Z", "000Z");
}

function shortDate() {
  return new Date().toISOString().slice(0, 10);
}

export function home() {
  return process.env.HOME || process.env.USERPROFILE || "/home";
}

// ── Manifest ───────────────────────────────────────────
export function getManifest() {
  try {
    return readJSON(MANIFEST_PATH);
  } catch {
    console.error("❌ manifest.json not found at", MANIFEST_PATH);
    process.exit(1);
  }
}

export function getPrompts(manifest, bundle) {
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
export function resolveDistilled(prompt) {
  const rel = prompt.distilled;
  const abs = path.resolve(PACKAGE_ROOT, rel);
  return fs.existsSync(abs) ? abs : null;
}

// ── Package version (for installed-from metadata) ─────
export function getVersion() {
  try {
    const pkg = readJSON(path.join(PACKAGE_ROOT, "package.json"));
    return `npm:${pkg.version}`;
  } catch {
    return shortDate();
  }
}

export { now };
