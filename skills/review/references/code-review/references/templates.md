# Code Review Templates

Use these templates to provide a structured, high-signal report for each stage and the final verdict.

## Stage Output Template (Original Variant)

```markdown
### STAGE [N]: [Focus Area]

#### Findings:
[ID] [CRITICAL|HIGH|MEDIUM|LOW] - [File:Line]
**Description:** [What's wrong or sub-optimal]
**Recommendation:** [How to fix with specific code example]

[ID] ...
```

## Stage Output Template (Domain-Focused Variant)

```markdown
### PASS [N]: [Domain Focus]

#### Issues Found:
[ID] [CRITICAL|HIGH|MEDIUM|LOW] - [File:Line]
**Description:** [What's wrong or sub-optimal]
**Attack Vector/Impact:** [Why this matters in this domain]
**Recommendation:** [How to fix with specific code example]

[ID] ...
```

## Convergence Check Template

Use this format after each stage (starting with Stage 2).

```markdown
**Convergence Check After Stage/Pass [N]:**

1. New CRITICAL issues: [count]
2. Total new issues vs previous stage: [count]
3. Estimated false positive rate: [percentage]

**Status:** [CONVERGED | CONTINUE | NEEDS_HUMAN]
```

## Final Report Template

After convergence or completing all 5 stages/passes, provide this summary.

```markdown
# Code Review Final Report

**Work Reviewed:** [Short description/path] | **Convergence:** Stage [N]

## Issue Summary
- **CRITICAL:** [count] - Blocks merge / MUST FIX
- **HIGH:** [count] - Should fix before merge
- **MEDIUM:** [count] - Consider Addressing
- **LOW:** [count] - Nice to have

## Top 3 Findings
1. **[ID] [Description]** - [File:Line]
   *   **Impact:** [Why this blocks implementation or causes failure]
   *   **Fix:** [Specific actionable step]

2. **[ID] ...**

## Recommended Next Actions
1. [Action 1 - specific and actionable]
2. [Action 2 - specific and actionable]
3. [Action 3 - specific and actionable]

## Verdict: [READY_TO_MERGE | NEEDS_FIXES | BLOCKS_MERGE]
**Rationale:** [1-2 sentences explaining the verdict based on issue severity]
```
