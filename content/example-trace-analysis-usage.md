---
title: Cross-Agent Trace Analysis Usage
type: example
tags: [trace-analysis, analytics, transcripts, agent-comparison]
tools: [claude-code, gemini, codex, ampcode, opencode]
status: tested
created: 2026-04-07
updated: 2026-04-07
version: 1.0.0
related: [example-rule-of-5-repository-review.md]
source: original
---

# Cross-Agent Trace Analysis Usage

## Context

You have exported conversation or event traces from multiple agent tools and want a quick view of:

- which prompts are actually being invoked
- which models and tools dominate usage
- whether behavior differs by provider
- whether prompt mentions appear to drive tool execution
- whether sessions look successful, blocked, or failed

## Example

```bash
node scripts/analyze-traces.js examples/trace-analysis --format markdown
```

## Expected Results

The analyzer emits a report with:

- aggregate totals
- provider breakdowns
- top prompts, slash commands, tools, models, and file mentions
- top prompt-to-tool pairs
- top workflow transitions
- heuristic session outcomes
- a short conclusions section

## Notes

The analyzer is heuristic by design. It works best with structured JSON or JSONL exports and falls back to text scanning for rough signal extraction.

Use the output for directional conclusions such as:

- which prompts are really being used
- which agents convert prompts into tool activity
- which workflows tend to end in success versus blockage
