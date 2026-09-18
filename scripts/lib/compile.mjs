// Purpose: Shared compiler for router members and compat pointers.
// Responsibilities:
// - Resolve a manifest `pointer_for` value ("<router>/<member>") to its member file
// - Compile a skill directory into one self-contained markdown document
//   (SKILL.md + all nested references/, recursively, with path headers)
// - Compile a pointer body: provenance banner + full member content
// - Validate that every pointer_for target exists
// Rationale: compiled pointers are distribution artifacts (site, pi-package,
// skills/ catalog, flat installs) and must never be hand-written prose. This
// module is the single implementation shared by build.sh, generate-pi-resources.mjs
// and generate-skills-dir.mjs so the content cannot drift between surfaces.
import fs from "node:fs";
import path from "node:path";

export function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

// Strip a leading frontmatter block from a markdown document.
export function stripFrontmatter(raw) {
  if (!raw.startsWith("---\n")) return raw;
  const end = raw.indexOf("\n---\n", 3);
  if (end === -1) return raw;
  return raw.slice(end + 5).replace(/^\n+/, "");
}

// Resolve "<router>/<member>" to the member's entry file:
// prefers references/<member>/SKILL.md, falls back to references/<member>.md.
export function resolveMemberPath(repoRoot, pointerFor) {
  const [router, member] = pointerFor.split("/");
  const base = path.join(repoRoot, "content", "distilled", router, "references");
  const multi = path.join(base, member, "SKILL.md");
  if (fs.existsSync(multi)) return { file: multi, multiFile: true, router, member };
  const flat = path.join(base, `${member}.md`);
  if (fs.existsSync(flat)) return { file: flat, multiFile: false, router, member };
  return null;
}

// Recursively collect markdown files under references/, sorted for determinism.
function collectReferences(refDir) {
  const files = [];
  if (!fs.existsSync(refDir)) return files;
  const entries = fs.readdirSync(refDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const full = path.join(refDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectReferences(full));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(full);
    }
  }
  return files;
}

// Compile a skill directory (containing SKILL.md) into one self-contained
// document: core instructions followed by every reference file, each headed
// by its path relative to the skill directory.
export function compileSkillDoc(repoRoot, skillRelDir) {
  const skillDir = path.join(repoRoot, skillRelDir);
  const skillFile = path.join(skillDir, "SKILL.md");
  if (!fs.existsSync(skillFile)) {
    throw new Error(`No SKILL.md in ${skillRelDir}`);
  }
  const parts = [];
  parts.push(`#### Core Instructions (${path.join(skillRelDir, "SKILL.md")})\n\n`);
  parts.push(readText(skillFile).trimEnd());
  for (const ref of collectReferences(path.join(skillDir, "references"))) {
    const rel = path.relative(skillDir, ref);
    parts.push(`\n\n---\n\n#### Reference: ${rel}\n\n`);
    parts.push(readText(ref).trimEnd());
  }
  return parts.join("");
}

// Compile the body of a pointer: provenance banner + full member content.
// The pointer is a permanent compiled alias — never a prose stub, never deleted.
export function compilePointerBody(repoRoot, pointerFor) {
  const resolved = resolveMemberPath(repoRoot, pointerFor);
  if (!resolved) {
    throw new Error(`pointer_for target not found: ${pointerFor}`);
  }
  const memberRel = path.relative(repoRoot, resolved.file);
  const banner = [
    `> **Moved:** this entry is now the **${resolved.member}** mode of the **${resolved.router}** skill.`,
    `> The full method is compiled below from \`${memberRel}\`.`,
    `> Invoke via \`/skill:${resolved.member}\`, invoke \`/skill:${resolved.router}\` for the mode table,`,
    `> or use this URL directly in a chat interface.`,
    "",
    "",
  ].join("\n");

  let content;
  if (resolved.multiFile) {
    content = compileSkillDoc(repoRoot, path.dirname(memberRel));
  } else {
    content = readText(resolved.file).trimEnd();
  }
  return banner + content;
}

// List member names of a multi-file router skill: subdirectories of references/
// that contain a SKILL.md (multi-file members), plus flat references/*.md.
export function listMembers(repoRoot, skillRelDir) {
  const refDir = path.join(repoRoot, skillRelDir, "references");
  const multi = [];
  const flat = [];
  if (!fs.existsSync(refDir)) return { multi, flat };
  for (const entry of fs.readdirSync(refDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isDirectory() && fs.existsSync(path.join(refDir, entry.name, "SKILL.md"))) {
      multi.push(entry.name);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      flat.push(entry.name.replace(/\.md$/, ""));
    }
  }
  return { multi, flat };
}

// Validate every pointer_for in the manifest resolves to an existing member.
// Returns an array of error strings (empty = valid).
export function validatePointers(repoRoot, manifest) {
  const errors = [];
  for (const prompt of manifest.prompts) {
    if (!prompt.pointer_for) continue;
    if (!prompt.disable_model_invocation) {
      errors.push(`${prompt.name}: pointer_for set but disable_model_invocation is not true`);
    }
    if (!resolveMemberPath(repoRoot, prompt.pointer_for)) {
      errors.push(`${prompt.name}: pointer_for target not found: ${prompt.pointer_for}`);
    }
  }
  return errors;
}
