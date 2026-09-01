# Issue Creation Templates

Use these templates for proposed slice breakdowns, issue descriptions, and the final creation summary.

## Proposed Slice Review Template

```markdown
1. **[Title]**
   - **Type:** [AFK|HITL]
   - **Blocked by:** [None | Slice 1, Slice 2]
   - **User stories covered:** [Story A, Story B]
   - **Tracer-bullet rationale:** [Why this is a thin end-to-end slice]
```

## Issue Description Template

```markdown
## Parent

[Reference to parent plan/spec/issue, if applicable]

## What to build

[Describe the end-to-end behavior of this slice in domain language.]

**Context:** [Brief explanation tied to the source plan/spec]
Ref: [Link to plan/spec file and section]

**Files / Systems:**
- `path/to/file1`
- `path/to/file2`
- `[subsystem or surface area if exact files are not yet known]`

## Verifiable Value Claim

**Must (hard gate):** [Quantified threshold defining done, with unit and number — e.g. "P95 latency ≤ 250 ms at 100 req/sec"; never "fast" or "robust"]
**Meter:** [Exact runnable command that verifies the Must gate — e.g. `pytest tests/val_claims/test_issue_NNN.py -q`; exit 0 = pass]
**Baseline:** [Measured value before work starts — e.g. "P95 = 450 ms"; omit if not measurable]
**Regression suite:** [Existing tests that must keep passing — e.g. `pytest tests/core/`]

## Acceptance Criteria

- [ ] [Binary, observable criterion 1]
- [ ] [Binary, observable criterion 2]
- [ ] [Automated tests cover the slice end-to-end]

## Blocked by

- [Issue reference] 

Or: `None - can start immediately`

---
**CRITICAL: Follow Test Driven Development and Tidy First workflows.**
- Write tests *before* writing implementation code.
- Clean up related code *before* adding new functionality.

**Anti-goals (do NOT):**
- [Prohibited behavior with obvious reward-hacking payoff — e.g. "modify, disable, or delete tests in `tests/core/`"]
- [e.g. "add new dependencies or modify lockfiles"]
- [e.g. "break public API / exported interfaces"]
```

## Issue Creation Summary Template

```markdown
## Issue Creation Summary

**System:** [e.g., GitHub/Beads]
**Plan:** [path/to/plan.md]

### Approved Slice Set
1. **[Title]** — [AFK|HITL], blocked by [None|IDs]
2. **[Title]** — [AFK|HITL], blocked by [None|IDs]

### Summary
- **Total Issues Created:** [count]
- **Dependencies Defined:** [count]
- **Labels Applied:** [e.g., needs-triage]
- **Base Commit Anchored:** [git SHA recorded in `base_commit` metadata]

### Created Issues
1. **[ID] [Title]** - [Link/Reference]
2. **[ID] ...**

### Verdict: [ISSUES_CREATED | FAILED_TO_CREATE | WAITING_FOR_APPROVAL]
**Rationale:** [1-2 sentences explaining the result]
```
