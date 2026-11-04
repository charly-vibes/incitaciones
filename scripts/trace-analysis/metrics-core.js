// Purpose: Normalized per-trace metrics records and primitive extraction helpers.
// Responsibilities:
// - Shape the emptyMetrics record every analyzer starts from
// - Message/role normalization, text extraction, timestamp and token accumulation
// Rationale: provider-specific traces differ wildly in shape; these primitives define the normalized vocabulary every other module consumes.
import { clipText, increment, numeric } from "./shared-helpers.js";
import { deriveSessionId } from "./fs-input.js";

// Keys checked, in order, for the first truthy timestamp on an object.
const TIMESTAMP_KEYS = ["timestamp", "created", "modified", "updated_at"];

// Object keys that qualify an object as a potential chat message.
const CONTENT_KEYS = ["content", "text", "message", "prompt", "input", "output", "parts"];

// Canonical role per substring found in a raw role field.
const ROLE_RULES = [
  { needles: ["assistant", "model"], role: "assistant" },
  { needles: ["user", "human"], role: "user" },
  { needles: ["tool", "function"], role: "tool" },
  { needles: ["system", "developer"], role: "system" },
];

export function emptyMetrics(provider, filePath) {
  return {
    provider,
    filePath,
    sessionId: deriveSessionId(filePath),
    traceCount: 1,
    messageCount: 0,
    firstTimestamp: null,
    lastTimestamp: null,
    firstUserExcerpt: "",
    lastAssistantExcerpt: "",
    roleCounts: {},
    toolCalls: {},
    modelCounts: {},
    promptCounts: {},
    skillFormatCounts: {},
    slashCommandCounts: {},
    fileMentions: {},
    referenceCounts: {},
    referenceCountsBySkill: {},
    referenceStageCounts: {},
    stageCounts: {},
    skillsUsed: {},
    tokenUsage: {
      input: 0,
      output: 0,
      total: 0,
    },
    eventTypes: {},
    promptToolPairs: {},
    transitions: {},
    toolRunsAfterPrompt: 0,
    testsMentioned: 0,
    outputSignals: {
      codeBlocks: 0,
      checklists: 0,
    },
    promptRefsInUserMessages: 0,
    promptRefsInAssistantMessages: 0,
    outcome: "unknown",
    outcomeEvidence: [],
    summary: {
      providerHintsMatched: 0,
      structured: false,
    },
  };
}

export function normalizeRole(object) {
  const role = object.role || object.sender || object.author || object.type || object.kind || null;
  if (!role) {
    return null;
  }

  const normalized = String(role).toLowerCase();
  for (const rule of ROLE_RULES) {
    if (rule.needles.some((needle) => normalized.includes(needle))) {
      return rule.role;
    }
  }
  return normalized;
}

export function hasMessageContent(object) {
  return CONTENT_KEYS.some((key) => key in object);
}

export function flattenObjects(root) {
  const objects = [];

  function walk(node) {
    if (!node || typeof node !== "object") {
      return;
    }
    objects.push(node);
    if (Array.isArray(node)) {
      for (const item of node) {
        walk(item);
      }
      return;
    }
    for (const value of Object.values(node)) {
      walk(value);
    }
  }

  walk(root);
  return objects;
}

export function collectPotentialMessages(root) {
  const seen = new Set();
  const messages = [];

  for (const object of flattenObjects(root)) {
    if (!object || typeof object !== "object" || Array.isArray(object)) {
      continue;
    }
    if (!normalizeRole(object) || !hasMessageContent(object)) {
      continue;
    }
    if (seen.has(object)) {
      continue;
    }

    seen.add(object);
    messages.push(object);
  }

  return messages;
}

function firstTimestampValue(object) {
  for (const key of TIMESTAMP_KEYS) {
    if (object[key]) {
      return object[key];
    }
  }
  return null;
}

export function maybeUpdateTimestamps(metrics, object) {
  const candidate = firstTimestampValue(object);
  if (typeof candidate !== "string" || !candidate) {
    return;
  }
  if (!metrics.firstTimestamp || candidate < metrics.firstTimestamp) {
    metrics.firstTimestamp = candidate;
  }
  if (!metrics.lastTimestamp || candidate > metrics.lastTimestamp) {
    metrics.lastTimestamp = candidate;
  }
}

export function extractText(value) {
  if (value == null) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(extractText).filter(Boolean).join("\n");
  }
  if (typeof value === "object") {
    return extractTextFromObject(value);
  }
  return String(value);
}

function extractTextFromObject(value) {
  const preferredKeys = [
    "text",
    "content",
    "message",
    "body",
    "input",
    "output",
    "prompt",
    "completion",
    "value",
    "parts",
  ];
  for (const key of preferredKeys) {
    if (key in value) {
      const extracted = extractText(value[key]);
      if (extracted) {
        return extracted;
      }
    }
  }
  return Object.values(value).map(extractText).filter(Boolean).join("\n");
}

function maxCandidate(candidates) {
  return candidates.length > 0 ? Math.max(...candidates) : 0;
}

export function accumulateTokens(tokenUsage, candidate) {
  if (!candidate || typeof candidate !== "object") {
    return;
  }

  const input = maxCandidate([
    numeric(candidate.input_tokens),
    numeric(candidate.inputTokens),
    numeric(candidate.prompt_tokens),
    numeric(candidate.promptTokens),
    numeric(candidate.inputTokenCount),
  ].filter(Boolean));
  const output = maxCandidate([
    numeric(candidate.output_tokens),
    numeric(candidate.outputTokens),
    numeric(candidate.completion_tokens),
    numeric(candidate.completionTokens),
    numeric(candidate.candidatesTokenCount),
  ].filter(Boolean));
  const totalCandidates = [
    numeric(candidate.total_tokens),
    numeric(candidate.totalTokens),
    numeric(candidate.totalTokenCount),
  ].filter(Boolean);
  const total = totalCandidates.length > 0 ? Math.max(...totalCandidates) : input + output;

  tokenUsage.input += input;
  tokenUsage.output += output;
  tokenUsage.total += total;
}

export { clipText, increment };
