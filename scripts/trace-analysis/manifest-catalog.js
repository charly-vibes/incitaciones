// Purpose: Provider detection and manifest-derived catalogs for the trace analyzer.
// Responsibilities:
// - Detect the originating agent tool for a trace file (claude, gemini, codex, …)
// - Build prompt matchers and the skill catalog (stages, references, formats) from the manifest
// Rationale: the manifest is the single source of truth for what counts as a prompt/skill reference; detection rules and catalog derivation live together so they stay consistent.
import fs from "node:fs";
import path from "node:path";
import { defaultArray, fileExists, normalizeText, REPO_ROOT } from "./shared-helpers.js";

export const PROVIDER_DETECTION_RULES = [
  ["claude", ["claude", "anthropic"]],
  ["gemini", ["gemini", "google"]],
  ["codex", ["codex", "openai"]],
  ["ampcode", ["ampcode", "amp code", ".amp"]],
  ["opencode", ["opencode", "open-code", ".opencode"]],
];

export const PROVIDER_HINTS = {
  claude: {
    eventKeys: ["messages", "content", "usage"],
    roles: ["user", "assistant", "tool_result"],
  },
  gemini: {
    eventKeys: ["contents", "parts", "usageMetadata"],
    roles: ["user", "model"],
  },
  codex: {
    eventKeys: ["items", "tool_name", "model"],
    roles: ["user", "assistant", "tool"],
  },
  ampcode: {
    eventKeys: ["conversation", "events", "tools"],
    roles: ["user", "assistant"],
  },
  opencode: {
    eventKeys: ["trace", "steps", "messages"],
    roles: ["user", "assistant", "tool"],
  },
  unknown: {
    eventKeys: [],
    roles: [],
  },
};

export function inferProviderForDetectedPath(targetPath) {
  const sample = targetPath.toLowerCase();
  for (const [provider, needles] of PROVIDER_DETECTION_RULES) {
    if (needles.some((needle) => sample.includes(needle))) {
      return provider;
    }
  }
  return null;
}

export function detectProvider(filePath, content) {
  const sample = `${filePath}\n${content.slice(0, 4000)}`.toLowerCase();
  for (const [provider, needles] of PROVIDER_DETECTION_RULES) {
    if (needles.some((needle) => sample.includes(needle))) {
      return provider;
    }
  }
  return "unknown";
}

export function buildPromptMatchers(manifest) {
  return manifest.prompts.map((prompt) => {
    const aliases = new Set();
    aliases.add(prompt.name.toLowerCase());
    aliases.add(`/${prompt.name.toLowerCase()}`);
    aliases.add(prompt.title.toLowerCase());
    if (prompt.name.includes("-")) {
      aliases.add(prompt.name.replace(/-/g, " ").toLowerCase());
    }
    return {
      name: prompt.name,
      aliases: Array.from(aliases),
    };
  });
}

export function deriveSkillFormat(prompt) {
  if (prompt.skill_format) {
    return prompt.skill_format;
  }
  return /\/SKILL\.md$/i.test(prompt.distilled) ? "progressive-disclosure" : "single-file";
}

export function deriveEvalReferences(prompt) {
  const configured = defaultArray(prompt.eval?.references).map((reference) => ({
    ...reference,
    aliases: defaultArray(reference.aliases).map(normalizeText),
  }));
  if (configured.length > 0) {
    return configured;
  }

  if (deriveSkillFormat(prompt) !== "progressive-disclosure") {
    return [];
  }

  const referenceDir = path.join(path.dirname(prompt.distilled), "references");
  const absoluteReferenceDir = path.join(REPO_ROOT, referenceDir);
  if (!fileExists(absoluteReferenceDir)) {
    return [];
  }

  return fs
    .readdirSync(absoluteReferenceDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.md$/i.test(entry.name))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((entry) => ({
      id: entry.name.replace(/\.md$/i, ""),
      path: path.join(referenceDir, entry.name),
      purpose: "reference",
      stage: null,
      optional: true,
      aliases: [
        normalizeText(`references/${entry.name}`),
        normalizeText(entry.name),
        normalizeText(entry.name.replace(/\.md$/i, "").replace(/-/g, " ")),
      ],
    }));
}

function deriveStages(prompt) {
  return defaultArray(prompt.eval?.stages).map((stage) => ({
    name: stage.name,
    hints: Array.from(
      new Set([
        normalizeText(stage.name).replace(/-/g, " "),
        ...defaultArray(stage.hints).map(normalizeText),
      ]),
    ),
  }));
}

function deriveCatalogReferences(prompt) {
  return deriveEvalReferences(prompt).map((reference) => {
    const normalizedPath = normalizeText(reference.path);
    const relativeToSkill = normalizeText(
      path.relative(path.dirname(prompt.distilled), reference.path).replace(/\\/g, "/"),
    );
    return {
      ...reference,
      aliases: Array.from(
        new Set([
          normalizedPath,
          relativeToSkill,
          ...defaultArray(reference.aliases).map(normalizeText),
        ]),
      ),
    };
  });
}

export function buildSkillCatalog(manifest) {
  const byName = {};

  for (const prompt of manifest.prompts) {
    byName[prompt.name] = {
      name: prompt.name,
      title: prompt.title,
      distilled: prompt.distilled,
      skillFormat: deriveSkillFormat(prompt),
      stages: deriveStages(prompt),
      references: deriveCatalogReferences(prompt),
      eval: prompt.eval || null,
    };
  }

  return byName;
}
