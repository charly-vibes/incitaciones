# Plan Review Criteria

Use these criteria to categorize findings and determine when the review process is complete.

## Issue Severity Definitions

| Severity | Criteria | Example Findings |
| :--- | :--- | :--- |
| **CRITICAL** | Blocks implementation or will cause catastrophic system failure. Violates TDD mandate (no test planned). | Feasibility contradiction, missing test for critical path, impossible phase order, hidden complexity ("We'll just..."). |
| **HIGH** | Significantly impacts quality, security, or maintainability. High risk of regression. | Missing edge case handling, unmitigated security risk, vague success criteria, missing rollback plan. |
| **MEDIUM** | Worth addressing to improve the plan but not blocking implementation. | Sub-optimal ordering, missing parallelization opportunities, vague file paths, minor dependency issues. |
| **LOW** | Minor improvements, stylistic issues, or metadata gaps. | Typos in description, missing versioning, redundant phase commentary. |

## Convergence Criteria

**CONVERGED** if:
- No new **CRITICAL** issues were found in the current pass AND
- The number of new issues found is less than 10% compared to the previous pass AND
- The estimated false positive rate is below 20%.

**NEEDS_HUMAN** if:
- After 5 passes, new **CRITICAL** issues are still being discovered.
- The false positive rate exceeds 30%.
- A major disagreement on architectural direction is identified.

## Pass Focus Checklist

### Pass 1: Feasibility & Risk
- [ ] Is the proposed logic technically possible in the current codebase?
- [ ] Are all external API/library dependencies accounted for?
- [ ] Is there a rollback strategy for high-risk changes?

### Pass 2: Completeness & Scope
- [ ] Does the plan cover all affected files and components?
- [ ] Are the success criteria for each phase clear and verifiable?
- [ ] Is "Out of Scope" explicitly defined?

### Pass 3: Spec & TDD Alignment
- [ ] Does every implementation step have a corresponding test/verification step?
- [ ] Are tests planned *before* implementation in the phase sequence?
- [ ] Does the plan fulfill all requirements from the related specification?

### Pass 4: Ordering & Dependencies
- [ ] Are phases in a logical, executable order?
- [ ] Are dependencies between phases clearly identified?
- [ ] Is each phase independently verifiable?

### Pass 5: Clarity & Executability
- [ ] Are all file paths concrete and correct?
- [ ] Could another engineer implement this without asking for more context?
- [ ] Is it clear what "done" means for the overall plan?
