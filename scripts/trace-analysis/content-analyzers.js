// Purpose: Per-file trace analysis: parse raw content and produce normalized metrics.
// Responsibilities:
// - Route parsing by file extension (JSONL/JSON → structured, else text)
// - Accumulate structured-object and message signals into emptyMetrics records
// - Cache metrics per file signature (mtime + size)
// Rationale: this is where raw traces become normalized records; all heuristics are delegated to signal-extractors so this module only orchestrates.
import fs from "node:fs";
import {
  PROVIDER_HINTS,
  detectProvider,
} from "./manifest-catalog.js";
import {
  accumulateTokens,
  clipText,
  collectPotentialMessages,
  emptyMetrics,
  extractText,
  flattenObjects,
  increment,
  maybeUpdateTimestamps,
  normalizeRole,
} from "./metrics-core.js";
import {
  buildTransitions,
  classifyEventFromMessage,
  classifyOutcome,
  detectTestsMentioned,
  extractFileMentions,
  extractPromptRefs,
  extractReferenceMentions,
  extractSkillRefsFromSlashCommands,
  extractSlashCommands,
  extractStageHints,
  extractToolName,
  resolveActiveSkills,
} from "./signal-extractors.js";

const UNKNOWN_SKILL = (name) => ({
  name,
  skillFormat: "unknown",
  stages: [],
  references: [],
  eval: null,
});

function registerSkillRef(promptRef, metrics, skillCatalog) {
  increment(metrics.promptCounts, promptRef);
  metrics.skillsUsed[promptRef] = skillCatalog[promptRef] || UNKNOWN_SKILL(promptRef);
  increment(metrics.skillFormatCounts, metrics.skillsUsed[promptRef].skillFormat || "unknown");
}

function scanProviderHints(metrics, structured, provider) {
  const serialized = JSON.stringify(structured).toLowerCase();
  for (const hint of PROVIDER_HINTS[provider]?.eventKeys || []) {
    if (serialized.includes(`"${hint.toLowerCase()}"`)) {
      metrics.summary.providerHintsMatched += 1;
    }
  }
}

function firstTruthy(...values) {
  for (const value of values) {
    if (value) {
      return value;
    }
  }
  return null;
}

function scanObjectIdentity(object, metrics) {
  const eventType = firstTruthy(object.event, object.event_type, object.type);
  if (typeof eventType === "string") {
    increment(metrics.eventTypes, eventType);
  }

  const toolName = extractToolName(object);
  if (toolName) {
    increment(metrics.toolCalls, toolName);
  }

  const modelName = firstTruthy(object.model, object.model_name, object.modelName);
  if (typeof modelName === "string" && modelName) {
    increment(metrics.modelCounts, modelName);
  }

  if (typeof object.sessionId === "string" && object.sessionId) {
    metrics.sessionId = object.sessionId;
  }
}

function scanStructuredObjects(objects, metrics) {
  for (const object of objects) {
    if (!object || typeof object !== "object" || Array.isArray(object)) {
      continue;
    }

    accumulateTokens(metrics.tokenUsage, object);
    scanObjectIdentity(object, metrics);
    maybeUpdateTimestamps(metrics, object);
  }
}

function applyRoleEffects(role, text, metrics, promptRefs) {
  if (role === "user") {
    metrics.promptRefsInUserMessages += promptRefs.length;
    if (!metrics.firstUserExcerpt && text) {
      metrics.firstUserExcerpt = clipText(text);
    }
  }
  if (role === "assistant") {
    metrics.promptRefsInAssistantMessages += promptRefs.length;
    if (text) {
      metrics.lastAssistantExcerpt = clipText(text);
    }
    if (text.includes("```")) {
      metrics.outputSignals.codeBlocks += 1;
    }
    if (/\[[ x]\]/.test(text)) {
      metrics.outputSignals.checklists += 1;
    }
  }
}

function applyEvidenceMentions(metrics, stageHints, referenceMentions) {
  for (const stageHint of stageHints) {
    increment(metrics.stageCounts, `${stageHint.skill}:${stageHint.stage}`);
  }
  for (const referenceMention of referenceMentions) {
    increment(metrics.referenceCounts, `${referenceMention.skill}:${referenceMention.reference}`);
    increment(metrics.referenceCountsBySkill, referenceMention.skill);
    if (referenceMention.stage) {
      increment(metrics.referenceStageCounts, `${referenceMention.skill}:${referenceMention.stage}`);
      increment(metrics.stageCounts, `${referenceMention.skill}:${referenceMention.stage}`);
    }
  }
}

function scanMessage(message, scanCtx) {
  const { metrics, analyzers, activeSkills, events } = scanCtx;
  const { promptMatchers, skillCatalog } = analyzers;
  const role = normalizeRole(message) || "unknown";
  const text = extractText(message).toLowerCase();
  const promptRefs = extractPromptRefs(text, promptMatchers);
  const slashCommands = extractSlashCommands(text);
  const toolName = role === "tool" ? extractToolName(message) : null;
  const fileMentions = extractFileMentions(text);
  const resolvedSkills = resolveActiveSkills(promptRefs, slashCommands, Array.from(activeSkills), skillCatalog);
  const stageHints = extractStageHints(text, resolvedSkills, skillCatalog, fileMentions);
  const referenceMentions = extractReferenceMentions(text, resolvedSkills, skillCatalog, fileMentions);

  metrics.messageCount += 1;
  increment(metrics.roleCounts, role);

  for (const promptRef of promptRefs) {
    registerSkillRef(promptRef, metrics, skillCatalog);
  }
  for (const slashCommand of slashCommands) {
    increment(metrics.slashCommandCounts, slashCommand);
  }
  for (const promptRef of extractSkillRefsFromSlashCommands(slashCommands, skillCatalog)) {
    registerSkillRef(promptRef, metrics, skillCatalog);
  }
  for (const activeSkill of resolvedSkills) {
    activeSkills.add(activeSkill);
  }
  for (const fileMention of fileMentions) {
    increment(metrics.fileMentions, fileMention);
  }

  applyRoleEffects(role, text, metrics, promptRefs);
  if (detectTestsMentioned(text)) {
    metrics.testsMentioned += 1;
  }
  applyEvidenceMentions(metrics, stageHints, referenceMentions);

  const kind = classifyEventFromMessage(message, promptRefs, slashCommands, toolName);
  if (kind) {
    events.push({ kind, promptRefs, toolName });
  }
}

function fallbackPromptScan(structured, metrics, analyzers) {
  if (metrics.messageCount !== 0) {
    return;
  }
  const fallbackText = JSON.stringify(structured).toLowerCase();
  for (const promptRef of extractPromptRefs(fallbackText, analyzers.promptMatchers)) {
    registerSkillRef(promptRef, metrics, analyzers.skillCatalog);
  }
}

export function analyzeStructuredContent(structured, filePath, analyzers, provider) {
  const metrics = emptyMetrics(provider, filePath);
  metrics.summary.structured = true;

  const objects = flattenObjects(structured);
  const messages = collectPotentialMessages(structured);
  const events = [];
  const activeSkills = new Set();
  const scanCtx = { metrics, analyzers, activeSkills, events };

  scanProviderHints(metrics, structured, provider);
  scanStructuredObjects(objects, metrics);
  for (const message of messages) {
    scanMessage(message, scanCtx);
  }
  fallbackPromptScan(structured, metrics, analyzers);

  buildTransitions(events, metrics);
  const outcome = classifyOutcome(messages);
  metrics.outcome = outcome.outcome;
  metrics.outcomeEvidence = outcome.evidence;

  return metrics;
}

export function analyzeTextContent(content, filePath, analyzers, provider) {
  const metrics = emptyMetrics(provider, filePath);
  const text = content.toLowerCase();
  metrics.firstUserExcerpt = clipText(content);
  metrics.lastAssistantExcerpt = clipText(content);

  metrics.messageCount = (text.match(/\b(user|assistant|tool|system)\b/g) || []).length;
  scanTextSignals(text, metrics, analyzers);

  const outcome = classifyOutcome([
    {
      role: "assistant",
      content,
    },
  ]);
  metrics.outcome = outcome.outcome;
  metrics.outcomeEvidence = outcome.evidence;

  return metrics;
}

function scanTextSignals(text, metrics, analyzers) {
  const { promptMatchers, skillCatalog } = analyzers;
  for (const promptRef of extractPromptRefs(text, promptMatchers)) {
    registerSkillRef(promptRef, metrics, skillCatalog);
  }
  const slashCommands = extractSlashCommands(text);
  const fileMentions = extractFileMentions(text);
  for (const slashCommand of slashCommands) {
    increment(metrics.slashCommandCounts, slashCommand);
  }
  for (const promptRef of extractSkillRefsFromSlashCommands(slashCommands, skillCatalog)) {
    registerSkillRef(promptRef, metrics, skillCatalog);
  }
  for (const fileMention of fileMentions) {
    increment(metrics.fileMentions, fileMention);
  }
  const activeSkills = Object.keys(metrics.skillsUsed);
  applyEvidenceMentions(
    metrics,
    extractStageHints(text, activeSkills, skillCatalog, fileMentions),
    extractReferenceMentions(text, activeSkills, skillCatalog, fileMentions),
  );
  if (detectTestsMentioned(text)) {
    metrics.testsMentioned += 1;
  }
  if (text.includes("```")) {
    metrics.outputSignals.codeBlocks += 1;
  }
  if (/\[[ x]\]/.test(text)) {
    metrics.outputSignals.checklists += 1;
  }
}

function parseJsonlRecords(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

export function parseContent(filePath, analyzers, sourceProvider = null) {
  const content = fs.readFileSync(filePath, "utf8");
  const provider = sourceProvider || detectProvider(filePath, content);

  try {
    if (/\.(jsonl|ndjson)$/i.test(filePath)) {
      return analyzeStructuredContent(parseJsonlRecords(content), filePath, analyzers, provider);
    }
    if (/\.json$/i.test(filePath)) {
      return analyzeStructuredContent(JSON.parse(content), filePath, analyzers, provider);
    }
  } catch (error) {
    return analyzeTextContent(content, filePath, analyzers, provider);
  }

  return analyzeTextContent(content, filePath, analyzers, provider);
}
