// Purpose: Report rendering: conclusions inference and markdown formatting.
// Responsibilities:
// - Infer human-readable conclusions from the aggregate
// - Render the markdown report section by section
// Rationale: presentation is isolated from analysis; each section is an independent formatter.
import path from "node:path";
import { defaultArray, increment, sumMapValues, topEntries, REPO_ROOT } from "./shared-helpers.js";

function collectLeaders(aggregate) {
  return {
    providerLeader: topEntries(
      Object.fromEntries(Object.entries(aggregate.providers).map(([name, metrics]) => [name, metrics.traces])),
      1,
    )[0],
    promptLeaders: topEntries(aggregate.skillSessionCounts, 3),
    toolLeaders: topEntries(aggregate.toolCalls, 3),
    referenceLeaders: topEntries(aggregate.referenceSessionCounts, 3),
    transitionLeaders: topEntries(aggregate.transitions, 3),
    outcomeLeaders: topEntries(aggregate.outcomes, 3),
  };
}

function leaderSentence(leaders, singular, prefix) {
  const list = leaders.map((item) => `${item.name} (${item.count})`).join(", ");
  return `${prefix} ${singular} ${list}.`;
}

function pushLeaderConclusions(conclusions, aggregate) {
  const leaders = collectLeaders(aggregate);
  if (leaders.providerLeader) {
    conclusions.push(
      `${leaders.providerLeader.name} produced the largest share of analyzed traces (${leaders.providerLeader.count}/${aggregate.traces}).`,
    );
  }

  if (leaders.promptLeaders.length > 0) {
    conclusions.push(leaderSentence(leaders.promptLeaders, "by session were", "The most used skills"));
  } else {
    conclusions.push("No prompt references were detected. The traces may need richer exports or additional aliases.");
  }

  if (leaders.toolLeaders.length > 0) {
    conclusions.push(leaderSentence(leaders.toolLeaders, "usage clustered around", "The heaviest tool"));
  }

  if (leaders.referenceLeaders.length > 0) {
    conclusions.push(leaderSentence(leaders.referenceLeaders, "by session were", "The most frequently used progressive-disclosure references"));
  }

  if (leaders.transitionLeaders.length > 0) {
    conclusions.push(leaderSentence(leaders.transitionLeaders, "were", "The dominant workflow transitions"));
  }

  if (leaders.outcomeLeaders.length > 0) {
    conclusions.push(leaderSentence(leaders.outcomeLeaders, "skewed toward", "Detected session outcomes"));
  }
}

function pushTotalsConclusions(conclusions, aggregate) {
  if (aggregate.totals.toolRunsAfterPrompt > 0) {
    conclusions.push(
      `Prompt references were followed by tool execution ${aggregate.totals.toolRunsAfterPrompt} times, which is a useful proxy for prompts driving actual work.`,
    );
  }

  if (aggregate.totals.tokenUsage.total > 0) {
    conclusions.push(
      `Structured token usage was available for ${aggregate.totals.tokenUsage.total} total tokens across the analyzed exports.`,
    );
  } else {
    conclusions.push("Most traces did not expose token usage fields, so the report is stronger on behavior than cost.");
  }
}

export function inferConclusions(aggregate, top) {
  const conclusions = [];
  pushLeaderConclusions(conclusions, aggregate);
  pushTotalsConclusions(conclusions, aggregate);
  return conclusions.slice(0, top);
}

function formatSourcesSection(lines, report, top, verbose) {
  lines.push("## Sources");
  lines.push("");
  if (report.detectedInputs.length === 0) {
    lines.push("- No auto-detected sources recorded");
  } else if (verbose) {
    for (const detectedInput of report.detectedInputs) {
      lines.push(`- ${detectedInput.provider}: ${detectedInput.path}`);
    }
  } else {
    const sourceCounts = {};
    for (const detectedInput of report.detectedInputs) {
      increment(sourceCounts, detectedInput.provider);
    }
    for (const entry of topEntries(sourceCounts, top)) {
      lines.push(`- ${entry.name}: ${entry.count} source paths`);
    }
    lines.push(`- Use \`--verbose\` to list all ${report.detectedInputs.length} detected sources`);
  }
  lines.push("");
}

function formatTotalsSection(lines, aggregate, report) {
  lines.push("## Totals");
  lines.push("");
  lines.push(`- Messages: ${aggregate.totals.messages}`);
  lines.push(`- Input tokens: ${aggregate.totals.tokenUsage.input}`);
  lines.push(`- Output tokens: ${aggregate.totals.tokenUsage.output}`);
  lines.push(`- Total tokens: ${aggregate.totals.tokenUsage.total}`);
  lines.push(`- Prompt -> tool executions: ${aggregate.totals.toolRunsAfterPrompt}`);
  lines.push(`- Test mentions: ${aggregate.totals.testsMentioned}`);
  lines.push(`- Reference evidence hits: ${sumMapValues(aggregate.referenceCounts)}`);
  lines.push(`- Stage evidence hits: ${sumMapValues(aggregate.stageCounts)}`);
  lines.push(`- Assistant code blocks: ${aggregate.outputSignals.codeBlocks}`);
  lines.push(`- Assistant checklists: ${aggregate.outputSignals.checklists}`);
  lines.push(`- Cache hits: ${report.cache.hits}`);
  lines.push(`- Cache misses: ${report.cache.misses}`);
  lines.push("");
}

function formatProvidersSection(lines, aggregate) {
  lines.push("## Providers");
  lines.push("");
  for (const [provider, metrics] of Object.entries(aggregate.providers).sort((a, b) => b[1].traces - a[1].traces)) {
    const outcomes = topEntries(metrics.outcomes, 2).map((entry) => `${entry.name}=${entry.count}`).join(", ");
    lines.push(
      `- ${provider}: ${metrics.traces} traces, ${metrics.messages} messages, ${metrics.tokenUsage.total} total tokens${outcomes ? `, outcomes: ${outcomes}` : ""}`,
    );
  }
  lines.push("");
}

function formatProgressiveSection(lines, report, aggregate) {
  lines.push("## Progressive Disclosure");
  lines.push("");
  const progressiveSessions = report.session_records.filter(
    (record) => defaultArray(record.progressive_skills_used).length > 0,
  );
  lines.push(`- Sessions using progressive-disclosure skills: ${progressiveSessions.length}`);
  lines.push(`- Progressive-disclosure skill sessions: ${aggregate.skillSessionCountsByFormat["progressive-disclosure"] || 0}`);
  lines.push(`- Single-file skill sessions: ${aggregate.skillSessionCountsByFormat["single-file"] || 0}`);
  lines.push(`- Progressive-disclosure evidence hits: ${aggregate.skillFormatCounts["progressive-disclosure"] || 0}`);
  lines.push(`- Single-file evidence hits: ${aggregate.skillFormatCounts["single-file"] || 0}`);
  if (progressiveSessions.length > 0) {
    appendProgressiveAverages(lines, progressiveSessions);
  } else {
    lines.push("- No progressive-disclosure skill usage detected");
  }
  lines.push("");
}

function appendProgressiveAverages(lines, progressiveSessions) {
  const avgReferences =
    progressiveSessions.reduce((sum, record) => sum + defaultArray(record.references_used).length, 0) /
    progressiveSessions.length;
  const avgStages =
    progressiveSessions.reduce((sum, record) => sum + defaultArray(record.stage_hints).length, 0) /
    progressiveSessions.length;
  lines.push(`- Average references per progressive session: ${avgReferences.toFixed(2)}`);
  lines.push(`- Average stage hints per progressive session: ${avgStages.toFixed(2)}`);
}

function formatRankSections(lines, aggregate, top) {
  const sections = [
    ["Top Skills By Session", aggregate.skillSessionCounts],
    ["Skill Formats By Session", aggregate.skillSessionCountsByFormat],
    ["Skill Evidence Hits", aggregate.skillFormatCounts],
    ["Top Prompt Mentions", aggregate.promptCounts],
    ["Top Slash Commands", aggregate.slashCommandCounts],
    ["Top Tools", aggregate.toolCalls],
    ["Top Models", aggregate.modelCounts],
    ["Top References By Session", aggregate.referenceSessionCounts],
    ["Top Reference Evidence Hits", aggregate.referenceCounts],
    ["Reference Usage By Skill", aggregate.referenceCountsBySkill],
    ["Top Stages By Session", aggregate.stageSessionCounts],
    ["Top Stage Evidence Hits", aggregate.stageCounts],
    ["Top Prompt -> Tool Pairs", aggregate.promptToolPairs],
    ["Top Workflow Transitions", aggregate.transitions],
    ["Top File Mentions", aggregate.fileMentions],
    ["Outcomes", aggregate.outcomes],
  ];

  for (const [title, map] of sections) {
    lines.push(`## ${title}`);
    lines.push("");
    const entries = topEntries(map, top);
    if (entries.length === 0) {
      lines.push("- None detected");
    } else {
      for (const entry of entries) {
        lines.push(`- ${entry.name}: ${entry.count}`);
      }
    }
    lines.push("");
  }
}

function formatConclusionsSection(lines, report) {
  lines.push("## Conclusions");
  lines.push("");
  for (const conclusion of report.conclusions) {
    lines.push(`- ${conclusion}`);
  }
  lines.push("");
}

function formatEffectivenessRanking(lines, entries, formatter, emptyMessage) {
  if (entries.length === 0) {
    lines.push(emptyMessage);
    return;
  }
  for (const [name, stats] of entries) {
    lines.push(formatter(name, stats));
  }
}

function outcomesSuffix(stats, limit) {
  return topEntries(stats.outcomes, limit)
    .map((entry) => `${entry.name}=${entry.count}`)
    .join(", ");
}

function formatLabelsSection(lines, report, top) {
  if (!report.effectiveness) {
    return;
  }
  lines.push("## Labels");
  lines.push("");
  lines.push(`- Labeled sessions: ${report.effectiveness.labeled_sessions}`);
  const rankedPrompts = Object.entries(report.effectiveness.prompts)
    .sort((left, right) => right[1].labeled_sessions - left[1].labeled_sessions)
    .slice(0, top);
  formatEffectivenessRanking(
    lines,
    rankedPrompts,
    (prompt, stats) =>
      `- ${prompt}: labeled=${stats.labeled_sessions}, helpful_votes=${stats.helpful_votes}, verification=${stats.verification_present}, rescue=${stats.human_rescue_needed}${outcomesSuffix(stats, 3) ? `, outcomes: ${outcomesSuffix(stats, 3)}` : ""}`,
    "- No labeled prompt effectiveness data yet",
  );
  const rankedReferences = Object.entries(report.effectiveness.references || {})
    .sort((left, right) => right[1].labeled_sessions - left[1].labeled_sessions)
    .slice(0, top);
  formatEffectivenessRanking(
    lines,
    rankedReferences,
    (referenceName, stats) =>
      `- ${referenceName}: labeled=${stats.labeled_sessions}, helpful_votes=${stats.helpful_votes}${outcomesSuffix(stats, 3) ? `, outcomes: ${outcomesSuffix(stats, 3)}` : ""}`,
    "- No labeled reference effectiveness data yet",
  );
  lines.push("");
}

function fileLine(fileReport, verbose) {
  const relativePath = path.relative(REPO_ROOT, fileReport.filePath);
  if (!verbose) {
    return `- ${relativePath}: ${fileReport.provider}, ${fileReport.messageCount} messages, outcome=${fileReport.outcome}`;
  }
  return `- ${relativePath}: ${fileReport.provider}, ${fileReport.messageCount} messages, outcome=${fileReport.outcome}, hints=${fileReport.summary.providerHintsMatched}, references=${sumMapValues(fileReport.referenceCounts || {})}, stages=${sumMapValues(fileReport.stageCounts || {})}`;
}

function formatFilesSection(lines, report, top, verbose) {
  lines.push("## Files");
  lines.push("");
  if (verbose) {
    for (const fileReport of report.files) {
      lines.push(fileLine(fileReport, true));
    }
  } else {
    const rankedFiles = [...report.files]
      .sort((left, right) => right.messageCount - left.messageCount)
      .slice(0, top);
    for (const fileReport of rankedFiles) {
      lines.push(fileLine(fileReport, false));
    }
    lines.push(`- Use \`--verbose\` to list all ${report.files.length} analyzed files`);
  }
  lines.push("");
}

export function formatMarkdown(report, top, verbose = false) {
  const lines = [];
  const aggregate = report.aggregate;

  lines.push("# Trace Usage Analysis");
  lines.push("");
  lines.push(`Analyzed ${aggregate.traces} trace files.`);
  lines.push("");

  formatSourcesSection(lines, report, top, verbose);
  formatTotalsSection(lines, aggregate, report);
  formatProvidersSection(lines, aggregate);
  formatProgressiveSection(lines, report, aggregate);
  formatRankSections(lines, aggregate, top);
  formatConclusionsSection(lines, report);
  formatLabelsSection(lines, report, top);
  formatFilesSection(lines, report, top, verbose);

  return lines.join("\n");
}
