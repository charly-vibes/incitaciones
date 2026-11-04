// Purpose: Text-signal extraction: prompt/skill references, stages, tools, outcomes, task types.
// Responsibilities:
// - Detect prompt mentions, slash commands, file mentions, stage and reference evidence
// - Classify events, workflow transitions, session outcomes, and task types
// Rationale: every heuristic that maps raw message text onto catalog entities lives here, so tuning signals never touches metrics shaping or I/O.
import { defaultArray, increment, normalizeText } from "./shared-helpers.js";
import { extractText, normalizeRole } from "./metrics-core.js";

export function extractPromptRefs(text, promptMatchers) {
  const matches = new Set();
  for (const matcher of promptMatchers) {
    if (matcher.aliases.some((alias) => text.includes(alias))) {
      matches.add(matcher.name);
    }
  }
  return Array.from(matches);
}

export function extractFileMentions(text) {
  return (
    text.match(/(?:content\/|references\/)?[\w./-]+\.(md|json|js|ts|tsx|jsx|py|rb|go|rs|sh)\b/g) || []
  ).map((match) => match.replace(/^['"`]+|['"`]+$/g, ""));
}

export function extractSlashCommands(text) {
  return (text.match(/(?:^|\s)(\/[a-z0-9][\w-]*)\b/gi) || []).map((match) =>
    match.trim().toLowerCase(),
  );
}

export function extractSkillRefsFromSlashCommands(slashCommands, skillCatalog) {
  const matches = new Set();
  for (const slashCommand of slashCommands) {
    const normalized = normalizeText(slashCommand).replace(/^\//, "");
    if (skillCatalog[normalized]) {
      matches.add(normalized);
    }
  }
  return Array.from(matches);
}

export function resolveActiveSkills(promptRefs, slashCommands, activeSkills, skillCatalog) {
  const matches = new Set();
  for (const promptRef of promptRefs) {
    matches.add(promptRef);
  }
  for (const skillRef of extractSkillRefsFromSlashCommands(slashCommands, skillCatalog)) {
    matches.add(skillRef);
  }
  for (const activeSkill of activeSkills) {
    matches.add(activeSkill);
  }
  return Array.from(matches);
}

function stageHintMatches(stage, text, normalizedFileMentions) {
  if (stage.hints.some((hint) => text.includes(hint))) {
    return true;
  }
  return normalizedFileMentions.some((fileMention) =>
    stage.hints.some((hint) => fileMention.includes(hint) || hint.includes(fileMention)),
  );
}

export function extractStageHints(text, activeSkills, skillCatalog, fileMentions = []) {
  const matches = [];
  const seen = new Set();
  const normalizedFileMentions = fileMentions.map(normalizeText);

  for (const skillName of activeSkills) {
    const skill = skillCatalog[skillName];
    if (!skill) {
      continue;
    }
    for (const stage of skill.stages) {
      if (!stage.name || stage.hints.length === 0) {
        continue;
      }
      if (stageHintMatches(stage, text, normalizedFileMentions)) {
        const key = `${skillName}:${stage.name}`;
        if (!seen.has(key)) {
          seen.add(key);
          matches.push({ skill: skillName, stage: stage.name });
        }
      }
    }
  }

  return matches;
}

function referenceAliasMatches(reference, text, normalizedFileMentions) {
  if (reference.aliases.some((alias) => text.includes(alias))) {
    return true;
  }
  return normalizedFileMentions.some((fileMention) =>
    reference.aliases.some((alias) => fileMention === alias || fileMention.endsWith(alias) || alias.endsWith(fileMention)),
  );
}

export function extractReferenceMentions(text, activeSkills, skillCatalog, fileMentions = []) {
  const matches = [];
  const seen = new Set();
  const normalizedFileMentions = fileMentions.map(normalizeText);

  for (const skillName of activeSkills) {
    const skill = skillCatalog[skillName];
    if (!skill) {
      continue;
    }
    for (const reference of skill.references) {
      if (!reference.id || defaultArray(reference.aliases).length === 0) {
        continue;
      }
      if (referenceAliasMatches(reference, text, normalizedFileMentions)) {
        const key = `${skillName}:${reference.id}`;
        if (!seen.has(key)) {
          seen.add(key);
          matches.push({
            skill: skillName,
            reference: reference.id,
            stage: reference.stage || null,
            optional: reference.optional !== false,
          });
        }
      }
    }
  }

  return matches;
}

export function extractToolName(object) {
  const candidateKeys = ["tool_name", "toolName", "function_name", "functionName", "name"];
  for (const key of candidateKeys) {
    const value = object[key];
    if (typeof value !== "string") {
      continue;
    }
    if (key === "name" && normalizeRole(object) !== "tool") {
      continue;
    }
    return value;
  }
  return null;
}

export function detectTestsMentioned(text) {
  return /\b(test|tests|pytest|vitest|jest|npm test|cargo test|go test)\b/.test(text);
}

export function classifyEventFromMessage(message, promptRefs, slashCommands, toolName) {
  if (promptRefs.length > 0) {
    return "prompt";
  }
  if (slashCommands.length > 0) {
    return "command";
  }
  if (toolName) {
    return "tool";
  }

  const role = normalizeRole(message);
  if (role === "assistant") {
    return "assistant";
  }
  if (role === "user") {
    return "user";
  }
  return null;
}

export function buildTransitions(events, metrics) {
  let previous = null;
  let activePrompt = null;

  for (const event of events) {
    if (previous) {
      increment(metrics.transitions, `${previous}->${event.kind}`);
    }
    previous = event.kind;

    if (event.promptRefs.length > 0) {
      activePrompt = event.promptRefs[0];
      continue;
    }

    if (event.toolName && activePrompt) {
      metrics.toolRunsAfterPrompt += 1;
      increment(metrics.promptToolPairs, `${activePrompt} -> ${event.toolName}`);
    }
  }
}

const OUTCOME_SIGNALS = [
  { pattern: /(all tests pass|tests passed|implemented|completed|done|verified|success)/, evidence: "positive completion language" },
  { pattern: /(could not|failed|error|exception|blocked|unable to|didn't work)/, evidence: "failure language" },
  { pattern: /(need user input|waiting for confirmation|how should i proceed|requires approval)/, evidence: "waiting language" },
];

const OUTCOME_VERDICTS = [
  { evidence: "failure language", outcome: "failed" },
  { evidence: "waiting language", outcome: "needs_input" },
  { evidence: "positive completion language", outcome: "succeeded" },
];

export function classifyOutcome(messages) {
  if (messages.length === 0) {
    return {
      outcome: "unknown",
      evidence: [],
    };
  }

  const assistantMessages = messages
    .filter((message) => normalizeRole(message) === "assistant")
    .map((message) => extractText(message).toLowerCase())
    .filter(Boolean);

  const sample = assistantMessages.slice(-3).join("\n");
  const evidence = OUTCOME_SIGNALS
    .filter((signal) => signal.pattern.test(sample))
    .map((signal) => signal.evidence);

  const verdict = OUTCOME_VERDICTS.find((v) => evidence.includes(v.evidence));
  return { outcome: verdict ? verdict.outcome : "unknown", evidence };
}

// Task-type rules evaluated in order; `names` match prompts_used, `pattern` matches excerpts.
const TASK_TYPE_RULES = [
  { names: ["debug"], pattern: /bug|debug|error|failing|broken/, type: "debugging" },
  { names: ["commit"], pattern: /git commit|commit/, type: "commit" },
  { names: ["tdd"], pattern: /test|pytest|jest|vitest|cargo test/, type: "testing" },
  { names: ["code-review", "parallel-review", "rule-of-5"], pattern: null, type: "review" },
  { names: [], pattern: /plan|roadmap|phase/, type: "planning" },
  { names: [], pattern: /document|docs|readme/, type: "documentation" },
];

export function inferTaskType(record) {
  const promptNames = record.prompts_used;
  const excerpt = `${record.first_user_excerpt} ${record.last_assistant_excerpt}`.toLowerCase();

  for (const rule of TASK_TYPE_RULES) {
    if (rule.names.some((name) => promptNames.includes(name))) {
      return rule.type;
    }
    if (rule.pattern && rule.pattern.test(excerpt)) {
      return rule.type;
    }
  }
  return "unknown";
}
