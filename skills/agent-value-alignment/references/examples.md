# Agent Value Alignment — Worked Examples

Optional reference. Use these to calibrate severity ratings and report format. Two examples: a sample finding showing the severity rubric applied, and a sample completed layer-score table.

## Example 1: A sample finding with severity rationale

A team is auditing "PRBot," an AI agent that reviews pull requests. They have a system prompt and an eval suite but no kill criteria and no BSD.

#### [L1-FINDING-002] [HIGH] — Kill Criteria Document: not present
- **Layer:** 1 — Value
- **What's wrong:** No kill criteria exist. The team has a falsifiable VP ("PRBot will reduce PR time-to-merge by 30% within 90 days, measured by median GitHub PR open→merge vs. the 90-day pre-deployment baseline") but no pre-committed stopping conditions.
- **Why it matters:** Without signed kill criteria, sunk-cost rationalization will keep the tool alive past its evidence threshold — the #1 value-level failure mode (root cause: rationalization under sunk cost). The VP is falsifiable but cannot be honestly *falsified* in practice.
- **Recommendation:** Author ≥3 kill criteria (metric + threshold + date + named owner + consequence) and have them signed by Product and Engineering leads before the next deployment. Owner: Product Manager. Due: 2026-08-14.
- **Invariant violated:** none directly (this is a Layer-1 gap, not an invariant break).
- **Severity rationale:** HIGH, not CRITICAL — a Layer-1 artifact is missing and the loop cannot close without it, but no irreversible-action boundary is unguarded and the invariant is not yet broken.

## Example 2: A CRITICAL finding (invariant break)

#### [INT-FINDING-001] [CRITICAL] — Traceability gap: 3 BSD decisions have no prompt clause
- **Layer:** Integration
- **What's wrong:** The BSD prohibits storing PII (§3.2), requires confirmation before any external communication (§4.1), and limits file access to `/workspace/data/` (§3.1). The system prompt encodes the file-access limit (Scope Fence) but contains **no clause** for the PII prohibition or the external-communication confirmation requirement.
- **Why it matters:** Two governance decisions are unenforced at runtime. The agent could store PII or send external communications with no prompt-level constraint — a direct break of the governing invariant ("every governance decision must have a corresponding prompt clause"). One unguarded boundary (external communication) is irreversible.
- **Recommendation:** Add a Minimal Footprint clause and an explicit prohibition to the system prompt's Scope Fence for both behaviors; add eval cases that verify refusal/escalation on PII-storage and external-comm triggers. Owner: Agent Engineer. Due: immediately (blocks deployment).
- **Invariant violated:** enforcement (decision exists, no prompt clause).

## Example 3: A completed layer-score table

For the same PRBot audit, after all layers reviewed:

| Layer | Status | Critical gaps |
|---|---|---|
| 1 — Value | 🟡 | 0 |
| 2 — Governance | 🔴 | 1 |
| 3 — Runtime Prompt | 🟢 | 0 |
| 4 — Infrastructure | 🟡 | 0 |
| Integration | 🔴 | 1 |

**Overall verdict:** NOT_ALIGNED

Rationale: Layer 2 is 🔴 because the BSD is missing entirely (a HIGH finding, but it escalates the layer to 🔴 since the loop cannot close without it — per the rubric, treat a missing foundational Layer-1/2 artifact as 🔴 for the layer). Integration is 🔴 due to the CRITICAL invariant break in Example 2. Layers 1 and 4 are 🟡 (failures with compensating controls: Layer 1 has no kill criteria but the VP is falsifiable; Layer 4 has observability but no decay dashboard yet). Layer 3 passes all checks.

## Inter-rater calibration notes

- A missing BSD is HIGH as a finding but 🔴 as a layer status — the severity describes the finding; the layer status follows the rubric (≥1 CRITICAL → 🔴; any HIGH/MEDIUM → 🟡). Reconcile by treating a missing foundational Layer-1/2 artifact as 🔴 for the layer even when the finding itself is HIGH, because the loop cannot close without it.
- An unfalsifiable VP is always HIGH (never MEDIUM) — the rubric's "Layer-1 artifact missing/unfalsifiable" clause.
- A missing eval test for a prompt clause is CRITICAL only if the clause guards an irreversible action; otherwise MEDIUM (check fails, compensating control = the prompt clause itself exists and may be manually reviewed).
