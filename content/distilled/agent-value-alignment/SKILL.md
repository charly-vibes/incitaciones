# Agent Value Alignment

Audit or establish the closed loop that anchors an AI agent's (or tool's) behavior to its intended value. Operates across four layers — Value, Governance, Runtime Prompt, Infrastructure — bound by a shared vocabulary and traceability matrix.

The core thesis: **goal drift (agent) and value drift (team) are the same failure at different scales** — the absence of structured, repeatable mechanisms to anchor behavior to intent. The governing invariant is that *every governance decision must have a corresponding prompt clause, and every prompt clause a corresponding eval test*.

## Setup

- Determine the **target**: the agent or tool being aligned.
- Determine the **mode**:
  - **AUDIT** — evaluate an existing agent/tool against the four-layer framework; produce a gap report.
  - **ESTABLISH** — stand up the artifacts for a new or un-governed agent/tool, following the one-week adoption sequence.
- If a value proposition, system prompt, eval suite, or behavioral spec already exists for the target, collect them before starting.

For **AUDIT** mode, each "Confirm" step is a check, not a gate: a missing or
failing artifact is recorded as a finding (not a blocker) — continue through
all layers before reporting. For **ESTABLISH** mode, follow the day-map below.

## Procedure

1. **Layer 1 — Value.** Confirm the target has a *falsifiable* value proposition (user segment + outcome + amount + timeframe + metric + baseline), kill criteria with a named owner, and a measurement plan distinguishing leading from lagging indicators. Read `references/layer-1-value.md`.
2. **Layer 2 — Governance.** Confirm a Behavioral Specification Document (BSD) / Agent Charter defines authorized and prohibited behavior, escalation triggers, and success metrics; confirm scope gates and review ceremonies exist. Read `references/layer-2-governance.md`.
3. **Layer 3 — Runtime Prompt.** Confirm the system prompt anchors the objective (Goal Sandwich), fences scope, encodes Minimal Footprint, includes drift-detection/self-check loops, and is verified by a value-focused eval suite (not output-correctness evals). Read `references/layer-3-runtime-prompt.md`.
4. **Layer 4 — Infrastructure.** Confirm alignment-oriented checkpointing (not just fault tolerance), a deliberate memory architecture, HITL interrupts at irreversible boundaries, and drift observability. Read `references/layer-4-infrastructure.md`.
5. **Integration.** Confirm the layers are bound: shared vocabulary document, verbatim propagation of the value proposition across system prompt + BSD + review agenda, traceability matrix linking each governance decision → prompt clause → eval test, and eval results feeding the review cadence. Read `references/integration.md`.
6. **Report.** Use `references/report-template.md`. The verdict and
   layer-status vocabulary (ALIGNED/PARTIAL/NOT_ALIGNED; 🟢/🟡/🔴) are defined
   in the report template — size findings accordingly as you go, not just at
   report time.

For **ESTABLISH** mode, the one-week sequence is distributed across the layer
references — each contains its own ESTABLISH days:

| Day | Artifact(s) | Reference |
|---|---|---|
| 1 | Falsifiable Value Proposition | `references/layer-1-value.md` |
| 2 | Kill Criteria + Agent Charter (+ BSD draft) | `references/layer-1-value.md`, `references/layer-2-governance.md` |
| 3 | Goal Sandwich system prompt | `references/layer-3-runtime-prompt.md` |
| 4 | 10 eval test cases | `references/layer-3-runtime-prompt.md` |
| 5 | Value Realization Review scheduled + decay dashboard | `references/layer-4-infrastructure.md` |

Produce the minimum viable artifact set day-by-day, then run steps 5–6 to
confirm the loop is closed.

If artifacts already exist but are incomplete or unfalsifiable (the common
partial-governance case), run **AUDIT** first to baseline the gaps, then
ESTABLISH the missing pieces — do not treat Day 1's "stop if the team cannot
agree on the VP" as blocking a retrofit of an existing vague VP.

## Rules

- Drift is the default assumption. The burden of proof is on evidence that behavior is anchored to intent — not on evidence that it has drifted.
- Never accept a value proposition that cannot be falsified. "Help users be more productive" is a wish, not an objective.
- Never accept an eval suite that measures output correctness without also measuring outcome achievement ("did this help the user accomplish their goal?").
- Never accept kill criteria without a named decision owner and a specific threshold + date. Unsigned criteria are suggestions.
- Flag any governance decision with no corresponding prompt clause (not enforced), any prompt clause with no eval test (not verified), and any eval result not reviewed in governance (not acted upon).
- Cite the specific artifact and location for every finding. Do not fabricate gaps.
- This skill is advisory — it produces a report and recommended actions; it does not itself edit prompts, evals, or governance documents.
- Where sources disagree on facts (e.g., paper dates), follow the more authoritative citation and note the discrepancy.

## Source

Derived from `content/research-synthesis-agent-value-alignment.md`, which synthesizes three source reports on value delivery verification, agentic alignment/checkpointing, and prompt engineering frameworks. Consult the synthesis for full citations, framework attributions, and worked examples.
