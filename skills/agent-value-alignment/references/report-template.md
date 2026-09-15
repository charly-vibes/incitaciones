# Agent Value Alignment — Report Template

Use this for both AUDIT and ESTABLISH modes. Replace `[ ]` placeholders.

## Severity rubric

Apply consistently to every finding so two auditors rate the same gap alike:

| Severity | Definition |
|---|---|
| **CRITICAL** | Breaks the governing invariant (an unenforced decision / unverified clause / unacted eval result) **or** leaves an irreversible-action boundary unguarded (no HITL, no rollback) |
| **HIGH** | A Layer-1 or Layer-2 artifact is missing, unfalsifiable, or unsigned (e.g., no kill criteria, no BSD, vague VP) — the loop cannot close without it |
| **MEDIUM** | An AUDIT check fails but a compensating control exists (e.g., eval suite present but golden dataset lacks failure-class examples) |
| **LOW** | Cadence or documentation gap (e.g., Value Realization Review not yet scheduled, dashboard not yet live) |

A layer is 🔴 if it has ≥1 CRITICAL finding; 🟡 if it has ≥1 HIGH/MEDIUM but no CRITICAL; 🟢 if all AUDIT checks pass.

---

## Agent Value Alignment Report

**Target:** [agent/tool name and version]
**Mode:** [AUDIT | ESTABLISH]
**Date:** [YYYY-MM-DD]
**Reviewer:** [name/role]
**Sources consulted:** [system prompt, BSD, eval suite, dashboard, etc.]

---

### Executive Summary

[2–4 sentences. State the single most important finding: is the closed loop intact, and if not, where is it broken?]

**Overall verdict:** [ALIGNED | PARTIAL | NOT_ALIGNED]

### Layer Scores

| Layer | Status | Critical gaps |
|---|---|---|
| 1 — Value | [🟢/🟡/🔴] | [count] |
| 2 — Governance | [🟢/🟡/🔴] | [count] |
| 3 — Runtime Prompt | [🟢/🟡/🔴] | [count] |
| 4 — Infrastructure | [🟢/🟡/🔴] | [count] |
| Integration | [🟢/🟡/🔴] | [count] |

Status: 🟢 all AUDIT checks pass · 🟡 ≥1 check fails, no critical · 🔴 ≥1 critical gap.

---

### Findings

#### [LAYER-N-FINDING-001] [CRITICAL|HIGH|MEDIUM|LOW] — [Location]
- **Layer:** [1 Value | 2 Governance | 3 Runtime | 4 Infra | Integration]
- **What's wrong:** [specific gap, citing the artifact and location]
- **Why it matters:** [which root cause or failure mode this enables]
- **Recommendation:** [specific action — which artifact to create/change, by whom]
- **Invariant violated:** [enforcement | verification | action] (if applicable)

[repeat for each finding]

---

### Invariant Check

The governing invariant: *every governance decision → prompt clause → eval test → governance review*.

- Decisions with no prompt clause (not enforced): [list, or "none"]
- Prompt clauses with no eval test (not verified): [list, or "none"]
- Eval results not reviewed in governance (not acted upon): [list, or "none"]

---

### Value Proposition (as currently stated)

> "[verbatim current VP, or 'NOT DEFINED']"

**Falsifiable?** [Yes/No — which slot is missing]
**Propagated verbatim across prompt + BSD + review agenda?** [Yes/No]

---

### Kill Criteria Status

[Cite each criterion, its threshold, the current value, and status: on-track / at-risk / triggered. Or "NOT DEFINED".]

---

### Recommended Actions (priority order)

1. [Action] — Owner: [role] — Layer: [N] — Due: [date]
2. [Action] — Owner: [role] — Layer: [N] — Due: [date]
3. [Action] — Owner: [role] — Layer: [N] — Due: [date]

### Next Review

**Value Realization Review scheduled:** [date, or "NOT SCHEDULED — schedule within 90 days"]
**Decay dashboard live:** [Yes/No]

---

### For ESTABLISH mode only: Minimum Viable Artifact Set

| Artifact | Status | Location |
|---|---|---|
| Falsifiable Value Proposition | [Done/In progress/Not started] | [path] |
| Kill Criteria (signed) | | |
| Agent Charter | | |
| Goal Sandwich system prompt | | |
| 10 eval test cases | | |
| Value Realization Review scheduled | | |
| Decay detection dashboard | | |

*Do not consider the loop closed until every artifact above is "Done" AND the invariant check shows zero unenforced/unverified/unacted items.*
