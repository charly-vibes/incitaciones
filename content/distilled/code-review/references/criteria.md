# Code Review Criteria

Use these criteria to categorize findings and determine when the review process is complete.

## Issue Severity Definitions

| Severity | Criteria | Examples |
| :--- | :--- | :--- |
| **CRITICAL** | Blocks merge. Severe security vulnerability, data loss risk, or fundamental logic failure. | SQL Injection, plaintext passwords, unhandled exceptions in core path. |
| **HIGH** | Should fix before merge. Significant performance issue, major regression risk, or violation of key requirements. | Missing index on hot query, non-singular requirement, missing error states. |
| **MEDIUM** | Consider addressing. Minor technical debt, sub-optimal pattern, or readability issues. | Magic strings, DRY violations, lack of docstrings, magic numbers. |
| **LOW** | Nice to have. Stylistic improvements, minor metadata gaps, or typos in non-critical comments. | Minor formatting, redundant comments, small consistency improvements. |

## Convergence Criteria

**CONVERGED** if:
- No new **CRITICAL** issues were found in the current stage AND
- The number of new issues found is less than 10% compared to the previous stage.

**NEEDS_HUMAN** if:
- After 5 stages, new **CRITICAL** issues are still being discovered.
- The false positive rate exceeds 30%.
- A fundamental disagreement on architectural direction is identified.

## Stage Focus (Original Variant)

### Stage 1: DRAFT
- Is the overall approach sound?
- Architectural alignment?
- Major structural issues?

### Stage 2: CORRECTNESS
- Logic bugs?
- Algorithm errors?
- Off-by-one?

### Stage 3: CLARITY
- Readable naming?
- Remove jargon?
- Intent clear?

### Stage 4: EDGE CASES
- Null/empty checks?
- Boundary conditions?
- External failure modes?

### Stage 5: EXCELLENCE
- Performance optimization?
- Documentation polish?
- Style consistency?
