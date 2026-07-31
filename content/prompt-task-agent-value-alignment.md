---
title: Agent Value Alignment
type: prompt
subtype: task
tags: [agents, alignment, value-delivery, prompt-engineering, governance, goal-drift, diagnostician, review]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-07-31
updated: 2026-07-31
version: 1.0.0
related:
  - research-synthesis-agent-value-alignment.md
  - prompt-task-rca-diagnostician.md
  - prompt-task-specification-review.md
source: research-synthesis-agent-value-alignment.md
---

# Agent Value Alignment

## When to Use

Use when you need to audit or establish the closed loop that anchors an AI agent's (or internal tool's) behavior to its intended value — across value definition, governance, runtime prompt, and infrastructure.

**Best for:**
- Auditing an existing agent/tool for value-delivery and alignment gaps before scaling
- Standing up governance artifacts for a new agent (falsifiable VP, kill criteria, BSD/charter, eval suite)
- Diagnosing why an agent "works" (high activity, passing evals) but delivers no measurable user value
- Checking that system-prompt constraints are actually verified by evals and reviewed in governance
- Detecting goal drift / value drift before lagging outcome metrics confirm it
- Pre-deployment review of an agent's alignment posture (scope fences, HITL interrupts, observability)

**Do NOT use when:**
- You need a root cause analysis of a specific incident (use `prompt-task-rca-diagnostician.md`)
- You need a 5-stage review of a single artifact like a spec or doc (use `prompt-task-specification-review.md` / rule-of-5)
- You need code review (use the `code-review` skill)
- The target is conventional deterministic software with no learned/agent component — the framework's AI-specific layers won't apply

## The Core Idea

Goal drift at the agent level and value drift at the team level are the same failure at different scales: the absence of structured, repeatable mechanisms to anchor behavior to intent. They are enabled by three recurring root causes — proxy–intent substitution (Goodhart/specification gaming), context/attention degradation, and rationalization under sunk cost — which together produce failure modes like the activity trap (high activity, no value) and the eval-governance disconnect.

The governing invariant: **every governance decision must have a corresponding prompt clause, and every prompt clause a corresponding eval test.** A decision with no prompt clause is not enforced; a prompt clause with no eval test is not verified; an eval result not reviewed in governance is not acted upon.

## Modes

- **AUDIT** — evaluate an existing agent/tool against the four-layer framework; produce a gap report with prioritized actions.
- **ESTABLISH** — stand up the minimum viable artifact set for a new or un-governed agent/tool, following the one-week adoption sequence, then confirm the loop is closed.

## The Four Layers

1. **Value** — falsifiable value proposition, kill criteria, leading/lagging measurement, counterfactuals, independent evaluation.
2. **Governance** — Behavioral Specification Document, Agent Charter, Behavioral ADRs, scope gates, review ceremonies.
3. **Runtime Prompt** — Goal Sandwich, Scope Fence, Minimal Footprint, drift-detection/self-check loops, value-focused evals.
4. **Infrastructure** — alignment-oriented checkpointing, memory architecture, HITL interrupts, drift observability.

Bound by **integration**: shared vocabulary, verbatim propagation of the value proposition, traceability matrix, and the eval suite as the load-bearing bridge.

## Procedure

The distilled skill (`content/distilled/agent-value-alignment/SKILL.md`) is
canonical; the summary below mirrors it for readers consulting this source
prompt in isolation:

1. **Layer 1 — Value** — confirm a falsifiable VP, signed kill criteria, and a
   leading/lagging measurement plan.
2. **Layer 2 — Governance** — confirm BSD/Agent Charter, scope gates, review
   ceremonies (incl. multi-agent checks if applicable).
3. **Layer 3 — Runtime Prompt** — confirm Goal Sandwich, Scope Fence, Minimal
   Footprint, drift-detection loops, and a value-focused eval suite.
4. **Layer 4 — Infrastructure** — confirm alignment-oriented checkpointing,
   memory architecture, HITL interrupts, and drift observability.
5. **Integration** — confirm shared vocabulary, verbatim VP propagation, and
   the traceability matrix closing the loop.
6. **Report** — produce the gap report using the report template.

Each step loads a `references/*.md` file with detailed checklists and audit
criteria.

## Rules

- Drift is the default assumption; the burden of proof is on evidence of anchoring, not on evidence of drift.
- Never accept an unfalsifiable value proposition, an eval suite measuring only output correctness, or unsigned kill criteria.
- Flag every unenforced decision, unverified clause, and unacted eval result explicitly.
- Cite the specific artifact and location for every finding. Do not fabricate gaps.
- This skill is advisory — it produces a report and recommended actions; it does not itself edit prompts, evals, or governance documents.

## Source

Derived from `research-synthesis-agent-value-alignment.md`, which synthesizes three source reports on value delivery verification, agentic alignment/checkpointing, and prompt engineering frameworks. Consult the synthesis for full citations, framework attributions, and worked examples.
