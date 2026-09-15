# Specification Review Templates

Use these templates to provide a structured, high-signal report for each pass and the final verdict.

## Pass Output Template

Use this format for reporting results from any of the five passes.

```markdown
### PASS [N]: [Focus Area]

#### Issues Found:
[ID] [CRITICAL|HIGH|MEDIUM|LOW] - [Section]
**Description:** [What's missing, vague, or contradictory]
**Impact:** [Why this violates the Amnesia Test or IEEE 29148]
**Recommendation:** [How to fix with specific text or path/reference]

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
# Specification Review Final Report

**Spec:** [path/to/spec.md] | **Convergence:** Pass [N]

## Summary Table
| Severity | Count | Key Focus |
| :--- | :--- | :--- |
| **CRITICAL** | [count] | Standalone Integrity / Amnesia Test |
| **HIGH** | [count] | Behavioral Gaps / Requirements |
| **MEDIUM** | [count] | Precision / Subjective Language |
| **LOW** | [count] | Metadata / Formatting |

## Top 3 Critical Findings
1. **[ID] [Description]** - [Location]
   *   **Impact:** [Why this matters for SDD]
   *   **Fix:** [Specific actionable step]

2. **[ID] ...**

## Recommended Actions
1. [Action 1 - specific and actionable]
2. [Action 2 - specific and actionable]
3. [Action 3 - specific and actionable]

## Verdict: [READY_TO_IMPLEMENT | NEEDS_REVISION | NEEDS_REWORK]
**Rationale:** [1-2 sentences explaining the verdict based on the Amnesia Test]
```
