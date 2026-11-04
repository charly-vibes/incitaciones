// Purpose: Cross-file aggregation for the trace analyzer.
// Responsibilities:
// - Merge per-file metrics reports into totals, provider buckets, and evidence maps
// - Augment the aggregate with session-level skill/reference/stage counts
// Rationale: aggregation semantics (what gets merged and counted where) are isolated from both analysis and rendering, so report shape changes never touch metrics code.
import { increment, mergeMaps } from "./shared-helpers.js";

function emptyAggregate() {
  return {
    traces: 0,
    providers: {},
    totals: {
      messages: 0,
      traces: 0,
      tokenUsage: {
        input: 0,
        output: 0,
        total: 0,
      },
      toolRunsAfterPrompt: 0,
      testsMentioned: 0,
    },
    roleCounts: {},
    promptCounts: {},
    skillFormatCounts: {},
    skillSessionCounts: {},
    skillSessionCountsByFormat: {},
    slashCommandCounts: {},
    toolCalls: {},
    modelCounts: {},
    fileMentions: {},
    referenceCounts: {},
    referenceCountsBySkill: {},
    referenceStageCounts: {},
    stageCounts: {},
    stageSessionCounts: {},
    referenceSessionCounts: {},
    eventTypes: {},
    transitions: {},
    promptToolPairs: {},
    outcomes: {},
    outputSignals: {
      codeBlocks: 0,
      checklists: 0,
    },
  };
}

function emptyProviderBucket() {
  return {
    traces: 0,
    messages: 0,
    tokenUsage: {
      input: 0,
      output: 0,
      total: 0,
    },
    prompts: {},
    models: {},
    tools: {},
    outcomes: {},
  };
}

function addToTotals(aggregate, report) {
  aggregate.totals.messages += report.messageCount;
  aggregate.totals.tokenUsage.input += report.tokenUsage.input;
  aggregate.totals.tokenUsage.output += report.tokenUsage.output;
  aggregate.totals.tokenUsage.total += report.tokenUsage.total;
  aggregate.totals.toolRunsAfterPrompt += report.toolRunsAfterPrompt;
  aggregate.totals.testsMentioned += report.testsMentioned;
}

function addToProviderBucket(aggregate, report) {
  if (!aggregate.providers[report.provider]) {
    aggregate.providers[report.provider] = emptyProviderBucket();
  }

  const provider = aggregate.providers[report.provider];
  provider.traces += 1;
  provider.messages += report.messageCount;
  provider.tokenUsage.input += report.tokenUsage.input;
  provider.tokenUsage.output += report.tokenUsage.output;
  provider.tokenUsage.total += report.tokenUsage.total;
  mergeMaps(provider.prompts, report.promptCounts);
  mergeMaps(provider.models, report.modelCounts);
  mergeMaps(provider.tools, report.toolCalls);
  increment(provider.outcomes, report.outcome);
}

const AGGREGATE_MAPS = [
  "roleCounts",
  "promptCounts",
  "skillFormatCounts",
  "slashCommandCounts",
  "toolCalls",
  "modelCounts",
  "fileMentions",
  "referenceCounts",
  "referenceCountsBySkill",
  "referenceStageCounts",
  "stageCounts",
  "eventTypes",
  "transitions",
  "promptToolPairs",
];

function mergeReportIntoAggregate(aggregate, report) {
  for (const key of AGGREGATE_MAPS) {
    mergeMaps(aggregate[key], report[key]);
  }
  increment(aggregate.outcomes, report.outcome);
  aggregate.outputSignals.codeBlocks += report.outputSignals.codeBlocks;
  aggregate.outputSignals.checklists += report.outputSignals.checklists;
}

export function buildAggregate(fileReports) {
  const aggregate = emptyAggregate();
  aggregate.traces = fileReports.length;
  aggregate.totals.traces = fileReports.length;

  for (const report of fileReports) {
    addToTotals(aggregate, report);
    addToProviderBucket(aggregate, report);
    mergeReportIntoAggregate(aggregate, report);
  }

  return aggregate;
}

export function augmentAggregateWithSessionRecords(aggregate, sessionRecords) {
  for (const record of sessionRecords) {
    for (const promptName of record.prompts_used) {
      increment(aggregate.skillSessionCounts, promptName);
      increment(aggregate.skillSessionCountsByFormat, record.skill_formats?.[promptName] || "unknown");
    }
    for (const referenceName of record.references_used) {
      increment(aggregate.referenceSessionCounts, referenceName);
    }
    for (const stageName of record.stage_hints) {
      increment(aggregate.stageSessionCounts, stageName);
    }
  }

  return aggregate;
}
