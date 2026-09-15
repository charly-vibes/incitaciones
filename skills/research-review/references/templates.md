# Research Review Templates

Use these templates to provide a structured, high-signal report for each pass and the final verdict.

## Pass Output Template

Use this format for reporting results from any of the five passes.

```markdown
### PASS [N]: [Focus Area]

#### Issues Found:
[ID] [CRITICAL|HIGH|MEDIUM|LOW] - [Section/Paragraph]
**Description:** [What's inaccurate, incomplete, or ambiguous]
**Evidence:** [Why this is a problem - cite source or codebase]
**Recommendation:** [How to improve with specific research or fix]

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
# Research Review Final Report

**Research:** [path/to/research.md] | **Convergence:** Pass [N]

## Summary Table
| Severity | Count | Key Focus |
| :--- | :--- | :--- |
| **CRITICAL** | [count] | Factual Accuracy / Evidence |
| **HIGH** | [count] | Analysis Gaps / Conclusions |
| **MEDIUM** | [count] | Actionability / Clarity |
| **LOW** | [count] | Metadata / Flow |

## Research Quality Assessment
- **Accuracy**: [Excellent|Good|Fair|Poor] - [brief comment]
- **Completeness**: [Excellent|Good|Fair|Poor] - [brief comment]
- **Actionability**: [Excellent|Good|Fair|Poor] - [brief comment]
- **Clarity**: [Excellent|Good|Fair|Poor] - [brief comment]

## Top 3 Critical Findings
1. **[ID] [Description]** - [Section]
   *   **Impact:** [Why this leads to bad decisions or is factually wrong]
   *   **Fix:** [Specific actionable step]

2. **[ID] ...**

## Recommended Next Actions
1. [Action 1 - specific and actionable]
2. [Action 2 - specific and actionable]
3. [Action 3 - specific and actionable]

## Verdict: [READY | NEEDS_REVISION | NEEDS_MORE_RESEARCH]
**Rationale:** [1-2 sentences explaining the verdict based on evidence quality]
```
