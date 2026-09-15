# Multi-Agent Code Review Templates

Use these templates to structure the waves and final reporting of the multi-agent code review.

## Wave 1 Output Template

```markdown
### WAVE 1: Parallel Analysis Findings

#### 1. Security Reviewer
- [Severity] [Description] - [File:Line]
- [Severity] ...

#### 2. Performance Reviewer
- [Severity] [Description] - [File:Line]

... [Remaining Reviewers]
```

## Wave 2 & 3 Convergence Check Template

```markdown
### WAVE 3: Convergence Check

**Status:** [CONVERGED | ITERATE | NEEDS_HUMAN]
**Confidence Score:** [0-100%]
**Rationale:** [1-2 sentences explaining why the review is complete or requires more focus]
```

## Final Report Template

```markdown
# Multi-Agent Code Review Final Report

**Code:** [Short description/path] | **Convergence:** Wave [N]

## Synthesized Issue Summary
| Severity | Count | Primary Focus |
| :--- | :--- | :--- |
| **CRITICAL** | [count] | Security / Logic Failures |
| **HIGH** | [count] | Performance / Reliability |
| **MEDIUM** | [count] | Maintainability / Tech Debt |
| **LOW** | [count] | Clarity / Style |

## Top 3 Critical Findings (Verified)
1. **[ID] [Description]** - [File:Line]
   *   **Impact:** [Why this blocks implementation or causes failure]
   *   **Fix:** [Specific actionable step]

2. **[ID] ...**

## Final Actionable List
1. [Verified Action 1 - specific and actionable]
2. [Verified Action 2 - specific and actionable]
3. [Verified Action 3 - specific and actionable]

## Verdict: [READY_TO_MERGE | NEEDS_FIXES | BLOCKS_MERGE]
**Rationale:** [Final summary of system-wide health and prioritized fixes]
```
