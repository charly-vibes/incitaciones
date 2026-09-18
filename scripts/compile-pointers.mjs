#!/usr/bin/env node
// Purpose: CLI entry point for the pointer/member compiler (scripts/lib/compile.mjs).
// Responsibilities:
// - --skill <rel-dir>      print the unified self-contained doc for a multi-file skill
// - --pointer <name>       print the compiled pointer body for a manifest pointer entry
// - --members <rel-dir>    print member names of a router skill (tab-separated: multi<TAB>flat)
// - --validate             check all pointer_for targets resolve; exit 1 on failure
// Rationale: build.sh and node generators share one compilation path so site,
// npm package, and skills catalog cannot drift apart.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compilePointerBody, compileSkillDoc, listMembers, readText, validatePointers } from "./lib/compile.mjs";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");
const manifestPath = path.join(repoRoot, "content", "manifest.json");

function usage() {
  console.error("Usage: compile-pointers.mjs --skill <rel-dir> | --pointer <name> | --members <rel-dir> | --validate");
  process.exit(2);
}

const args = process.argv.slice(2);
const mode = args[0];
const value = args[1];

if (mode === "--validate") {
  const manifest = JSON.parse(readText(manifestPath));
  const errors = validatePointers(repoRoot, manifest);
  if (errors.length > 0) {
    for (const err of errors) console.error(`❌ ${err}`);
    process.exit(1);
  }
  console.log(`✓ all pointer_for targets resolve (${manifest.prompts.filter((p) => p.pointer_for).length} pointers)`);
  process.exit(0);
}

if (mode === "--skill" && value) {
  process.stdout.write(compileSkillDoc(repoRoot, value) + "\n");
  process.exit(0);
}

if (mode === "--pointer" && value) {
  const manifest = JSON.parse(readText(manifestPath));
  const prompt = manifest.prompts.find((p) => p.name === value);
  if (!prompt) {
    console.error(`❌ no such prompt in manifest: ${value}`);
    process.exit(1);
  }
  if (!prompt.pointer_for) {
    console.error(`❌ ${value} has no pointer_for field`);
    process.exit(1);
  }
  process.stdout.write(compilePointerBody(repoRoot, prompt.pointer_for) + "\n");
  process.exit(0);
}

if (mode === "--members" && value) {
  const { multi, flat } = listMembers(repoRoot, value);
  console.log(`${multi.join(",")}\t${flat.join(",")}`);
  process.exit(0);
}

usage();
