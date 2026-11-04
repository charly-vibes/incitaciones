#!/usr/bin/env node
// Purpose: Analyze agent-trace exports from multiple tools and summarize cross-tool usage patterns (provider, tokens, sessions) for the skill-usage research line.
// Responsibilities:
// - Orchestrate input collection, per-file analysis, and report assembly
// - Emit markdown/JSON rankings, session-records JSONL and label queue artifacts
// Rationale: feeds research-finding-skill-usage-analysis.md; evidence for which distilled prompts agents actually run, so the manifest's bundles stay usage-driven. Implementation lives in scripts/trace-analysis/.
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { parseArgs } from "./trace-analysis/cli-args.js";
import { loadManifest } from "./trace-analysis/shared-helpers.js";
import { buildPromptMatchers, buildSkillCatalog } from "./trace-analysis/manifest-catalog.js";
import {
  autoDetectInputs,
  buildLabelIndex,
  listFiles,
  loadCache,
  loadLabels,
  readMetricsWithCache,
  saveCache,
  writeJsonl,
} from "./trace-analysis/fs-input.js";
import { parseContent } from "./trace-analysis/content-analyzers.js";
import {
  buildEffectivenessSummary,
  buildLabelQueue,
  buildSessionRecord,
  joinLabels,
} from "./trace-analysis/session-records.js";
import {
  augmentAggregateWithSessionRecords,
  buildAggregate,
} from "./trace-analysis/aggregate.js";
import { formatMarkdown, inferConclusions } from "./trace-analysis/report-output.js";

function collectInputs(args) {
  const detectedInputs = args.autoDetect ? autoDetectInputs() : [];
  const explicitInputs = args.inputs.map((input) => ({
    provider: "explicit",
    path: path.resolve(input),
  }));
  const allInputs = [...explicitInputs, ...detectedInputs];

  if (allInputs.length === 0) {
    throw new Error("No inputs found. Use --auto-detect or pass one or more paths.");
  }
  return allInputs;
}

function collectFileEntries(allInputs) {
  const fileEntries = allInputs.flatMap((input) =>
    listFiles(input.path).map((filePath) => ({ filePath, provider: input.provider })),
  );

  if (fileEntries.length === 0) {
    throw new Error("No trace files found in the provided paths.");
  }
  return fileEntries;
}

function explicitOrDetected(providerByFile, filePath) {
  const provider = providerByFile.get(filePath);
  return provider === "explicit" ? null : provider || null;
}

function analyzeFiles(fileEntries, analyzers, args) {
  const cache = loadCache(args.noCache);
  const cacheStats = {
    hits: 0,
    misses: 0,
  };
  const fileAnalyzers = { ...analyzers, cache, cacheStats, cacheDisabled: args.noCache };
  const providerByFile = new Map(fileEntries.map((entry) => [entry.filePath, entry.provider]));
  const fileReports = fileEntries.map((entry) =>
    readMetricsWithCache(
      entry.filePath,
      fileAnalyzers,
      explicitOrDetected(providerByFile, entry.filePath),
      parseContent,
    ),
  );
  saveCache(cache, args.noCache);
  return { fileReports, cacheStats };
}

function reportFile(fileReport) {
  return {
    provider: fileReport.provider,
    sessionId: fileReport.sessionId,
    filePath: fileReport.filePath,
    messageCount: fileReport.messageCount,
    roleCounts: fileReport.roleCounts,
    promptCounts: fileReport.promptCounts,
    skillFormatCounts: fileReport.skillFormatCounts,
    slashCommandCounts: fileReport.slashCommandCounts,
    toolCalls: fileReport.toolCalls,
    modelCounts: fileReport.modelCounts,
    referenceCounts: fileReport.referenceCounts,
    referenceCountsBySkill: fileReport.referenceCountsBySkill,
    referenceStageCounts: fileReport.referenceStageCounts,
    stageCounts: fileReport.stageCounts,
    tokenUsage: fileReport.tokenUsage,
    promptToolPairs: fileReport.promptToolPairs,
    transitions: fileReport.transitions,
    testsMentioned: fileReport.testsMentioned,
    outputSignals: fileReport.outputSignals,
    outcome: fileReport.outcome,
    outcomeEvidence: fileReport.outcomeEvidence,
    summary: fileReport.summary,
    firstTimestamp: fileReport.firstTimestamp,
    lastTimestamp: fileReport.lastTimestamp,
    firstUserExcerpt: fileReport.firstUserExcerpt,
    lastAssistantExcerpt: fileReport.lastAssistantExcerpt,
  };
}

function buildReport(args, analysis) {
  const { allInputs, cacheStats, fileReports, rawSessionRecords, labeledSessionRecords, labelQueue, effectiveness } = analysis;
  const aggregate = augmentAggregateWithSessionRecords(buildAggregate(fileReports), rawSessionRecords);
  return {
    generated_at: new Date().toISOString(),
    inputs: allInputs.map((input) => input.path),
    detectedInputs: allInputs,
    cache: cacheStats,
    aggregate,
    effectiveness,
    files: fileReports.map(reportFile),
    session_records: labeledSessionRecords,
    label_queue_size: labelQueue.length,
    conclusions: inferConclusions(aggregate, args.top),
  };
}

function writeArtifacts(args, labeledSessionRecords, labelQueue, report) {
  if (args.sessionRecordsOut) {
    writeJsonl(args.sessionRecordsOut, labeledSessionRecords);
  }
  if (args.labelQueueOut) {
    writeJsonl(args.labelQueueOut, labelQueue);
  }
  if (args.jsonOut) {
    fs.writeFileSync(path.resolve(args.jsonOut), JSON.stringify(report, null, 2));
  }
}

function emitOutput(args, report) {
  if (args.format === "json") {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  if (args.format === "both") {
    console.log(formatMarkdown(report, args.top, args.verbose));
    console.log("\n---\n");
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log(formatMarkdown(report, args.top, args.verbose));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifest = loadManifest();
  const analyzers = {
    promptMatchers: buildPromptMatchers(manifest),
    skillCatalog: buildSkillCatalog(manifest),
  };

  const allInputs = collectInputs(args);
  const fileEntries = collectFileEntries(allInputs);
  const { fileReports, cacheStats } = analyzeFiles(fileEntries, analyzers, args);

  const rawSessionRecords = fileReports.map((fileReport) => buildSessionRecord(fileReport));
  const labels = loadLabels(args.labelsPath);
  const labeledSessionRecords = joinLabels(rawSessionRecords, buildLabelIndex(labels));
  const effectiveness = labels.length > 0 ? buildEffectivenessSummary(labeledSessionRecords) : null;
  const labelQueue = buildLabelQueue(labeledSessionRecords);

  const report = buildReport(args, {
    allInputs,
    cacheStats,
    fileReports,
    rawSessionRecords,
    labeledSessionRecords,
    labelQueue,
    effectiveness,
  });

  writeArtifacts(args, labeledSessionRecords, labelQueue, report);
  emitOutput(args, report);
}

main();
