# Plan Review Templates

Use these templates to provide a structured, high-signal report for each pass and the final verdict.

## Pass Output Template

Use this format for reporting results from any of the five passes.

```markdown
### PASS [N]: [Focus Area]

#### Issues Found:
[ID] [CRITICAL|HIGH|MEDIUM|LOW] - [Phase/Section]
**Description:** [What's wrong or risky]
**Evidence:** [Why this is a problem - cite codebase if relevant]
**Recommendation:** [How to fix with specific technical guidance]

[ID] ...
```

## Convergence Check Template

Use this format after each pass (starting with Pass 2).

```markdown
**Convergence Check After Pass [N]:**

1. New CRITICAL issues: [count]
2. Total new issues this pass: [count]
3. Total new issues previous pass: [count]
4. Estimated false positive rate: [percentage]

**Status:** [CONVERGED | ITERATE | NEEDS_HUMAN]
```

## Final Report Template

After convergence or completing all 5 passes, provide this summary.

```markdown
# Plan Review Final Report

**Plan:** plans/[filename].md | **Convergence:** Pass [N]

## Summary Table
| Severity | Count | Key Focus |
| :--- | :--- | :--- |
| **CRITICAL** | [count] | Feasibility / TDD Mandate |
| **HIGH** | [count] | Completeness / Risks |
| **MEDIUM** | [count] | Ordering / Dependencies |
| **LOW** | [count] | Clarity / Formatting |

## Top 3 Critical Findings
1. **[ID] [Description]** - [Phase]
   *   **Impact:** [Why this blocks implementation or causes failure]
   *   **Fix:** [Specific actionable step]

2. **[ID] ...**

## Recommended Next Actions
1. [Action 1 - specific and actionable]
2. [Action 2 - specific and actionable]
3. [Action 3 - specific and actionable]

## Verdict: [READY_TO_IMPLEMENT | NEEDS_REVISION | NEEDS_MORE_RESEARCH]
**Rationale:** [1-2 sentences explaining the verdict]
```
