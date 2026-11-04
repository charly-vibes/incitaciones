// Purpose: Session records, labels, effectiveness summaries, and cross-file aggregation.
// Responsibilities:
// - Convert per-file metrics into flat session records; join manual labels; build the labeling queue
// - Aggregate effectiveness statistics for labeled sessions
// - Merge per-file reports into one aggregate report object
// Rationale: the labeling/effectiveness workflow is separate from trace parsing; aggregation lives beside it because both consume finished per-file metrics.
import path from "node:path";
import { defaultArray, increment, sumMapValues, topEntries } from "./shared-helpers.js";
import { inferTaskType } from "./signal-extractors.js";

function isHelpful(helpful, key) {
  if (helpful === true || helpful === "helpful") {
    return true;
  }
  return typeof helpful === "object" && helpful[key] && ["helpful", true].includes(helpful[key]);
}

function bucketFor(buckets, name, extraFields = []) {
  if (!buckets[name]) {
    buckets[name] = {
      labeled_sessions: 0,
      outcomes: {},
      helpful_votes: 0,
      ...Object.fromEntries(extraFields.map((field) => [field, 0])),
    };
  }
  return buckets[name];
}

function recordPromptStats(byPrompt, record, outcome) {
  for (const prompt of record.prompts_used) {
    const bucket = bucketFor(byPrompt, prompt, ["human_rescue_needed", "verification_present"]);
    bucket.labeled_sessions += 1;
    increment(bucket.outcomes, outcome);
    if (record.label.human_rescue_needed === true) {
      bucket.human_rescue_needed += 1;
    }
    if (record.label.verification_present === true) {
      bucket.verification_present += 1;
    }
    const helpful = record.label.prompt_helpfulness || record.label.prompt_effectiveness || null;
    if (isHelpful(helpful, prompt)) {
      bucket.helpful_votes += 1;
    }
  }
}

function recordReferenceStats(byReference, record, outcome) {
  const helpfulReferences = record.label.reference_helpfulness || record.label.reference_effectiveness || null;
  for (const referenceName of defaultArray(record.references_used)) {
    const bucket = bucketFor(byReference, referenceName);
    bucket.labeled_sessions += 1;
    increment(bucket.outcomes, outcome);
    if (isHelpful(helpfulReferences, referenceName)) {
      bucket.helpful_votes += 1;
    }
  }
}

export function buildEffectivenessSummary(sessionRecords) {
  const labeled = sessionRecords.filter((record) => record.human_labeled && record.label);
  const byPrompt = {};
  const byReference = {};

  for (const record of labeled) {
    const outcome = record.label.outcome || "unknown";
    recordPromptStats(byPrompt, record, outcome);
    recordReferenceStats(byReference, record, outcome);
  }

  return {
    labeled_sessions: labeled.length,
    prompts: byPrompt,
    references: byReference,
  };
}

export function buildSessionRecord(fileReport) {
  const promptsUsed = topEntries(fileReport.promptCounts, 50).map((entry) => entry.name);
  const slashCommands = topEntries(fileReport.slashCommandCounts, 50).map((entry) => entry.name);
  const toolsUsed = topEntries(fileReport.toolCalls, 50).map((entry) => entry.name);
  const topModel = topEntries(fileReport.modelCounts, 1)[0]?.name || null;
  const stageHints = topEntries(fileReport.stageCounts, 50).map((entry) => entry.name);
  const referencesUsed = topEntries(fileReport.referenceCounts, 50).map((entry) => entry.name);
  const skillFormats = Object.fromEntries(
    Object.entries(fileReport.skillsUsed).map(([skillName, skill]) => [skillName, skill.skillFormat || "unknown"]),
  );

  const record = {
    session_id: fileReport.sessionId,
    file_path: fileReport.filePath,
    provider: fileReport.provider,
    model: topModel,
    task_type: "unknown",
    prompts_used: promptsUsed,
    skill_formats: skillFormats,
    progressive_skills_used: promptsUsed.filter((promptName) => skillFormats[promptName] === "progressive-disclosure"),
    references_used: referencesUsed,
    stage_hints: stageHints,
    prompt_sequence_hints: topEntries(fileReport.promptToolPairs, 20).map((entry) => entry.name),
    slash_commands: slashCommands,
    tools_used: toolsUsed,
    tool_call_count: sumMapValues(fileReport.toolCalls),
    file_mentions_count: sumMapValues(fileReport.fileMentions),
    files_mentioned_top: topEntries(fileReport.fileMentions, 10).map((entry) => entry.name),
    tests_run_or_mentioned: fileReport.testsMentioned > 0,
    verification_present:
      fileReport.testsMentioned > 0 || fileReport.outputSignals.checklists > 0,
    commit_created:
      promptsUsed.includes("commit") ||
      slashCommands.includes("/commit") ||
      /git commit|create commit|committed/.test(fileReport.lastAssistantExcerpt),
    tokens_total: fileReport.tokenUsage.total,
    turn_count: fileReport.messageCount,
    role_counts: fileReport.roleCounts,
    outcome_guess: fileReport.outcome,
    outcome_evidence: fileReport.outcomeEvidence,
    first_timestamp: fileReport.firstTimestamp,
    last_timestamp: fileReport.lastTimestamp,
    first_user_excerpt: fileReport.firstUserExcerpt,
    last_assistant_excerpt: fileReport.lastAssistantExcerpt,
    prompt_help_signals: {
      prompt_refs_in_user_messages: fileReport.promptRefsInUserMessages,
      prompt_refs_in_assistant_messages: fileReport.promptRefsInAssistantMessages,
      prompt_to_tool_runs: fileReport.toolRunsAfterPrompt,
      code_blocks: fileReport.outputSignals.codeBlocks,
      checklists: fileReport.outputSignals.checklists,
      references_loaded_or_mentioned: sumMapValues(fileReport.referenceCounts),
      stages_detected: sumMapValues(fileReport.stageCounts),
    },
    human_labeled: false,
    label: null,
  };

  record.task_type = inferTaskType(record);
  return record;
}

export function joinLabels(sessionRecords, labelIndex) {
  return sessionRecords.map((record) => {
    const label =
      labelIndex.bySessionId.get(record.session_id) ||
      labelIndex.byFilePath.get(path.resolve(record.file_path)) ||
      null;

    if (!label) {
      return record;
    }

    return {
      ...record,
      human_labeled: true,
      label,
    };
  });
}

export function buildLabelQueue(sessionRecords) {
  return sessionRecords
    .filter((record) => !record.human_labeled)
    .map((record) => ({
      session_id: record.session_id,
      file_path: record.file_path,
      provider: record.provider,
      model: record.model,
      task_type_guess: record.task_type,
      prompts_used: record.prompts_used,
      progressive_skills_used: record.progressive_skills_used,
      references_used: record.references_used,
      stage_hints: record.stage_hints,
      outcome_guess: record.outcome_guess,
      first_user_excerpt: record.first_user_excerpt,
      last_assistant_excerpt: record.lastAssistantExcerpt,
      questions: [
        "What is the task type?",
        "What was the final outcome? (succeeded|partial|failed|abandoned|needs_input)",
        "Which prompts were actually helpful?",
        "Which references were actually helpful?",
        "Was human rescue needed?",
        "Was verification present?",
      ],
    }));
}
