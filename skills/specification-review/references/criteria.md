# Specification Review Criteria

Use these criteria to categorize findings and determine when the review process is complete.

## Issue Severity Definitions

| Severity | Criteria | Example Findings |
| :--- | :--- | :--- |
| **CRITICAL** | Violates the **Amnesia Test**. An agent would get stuck or hallucinate due to missing context or external dependencies. | Missing file paths, "TBD", "See chat history", missing data schema. |
| **HIGH** | Significant ambiguity or missing behavioral coverage. Multiple interpretations possible. | Requirement with no BDD scenario, conflicting business logic, missing edge case handling. |
| **MEDIUM** | Non-singular requirements or minor linguistic precision issues. Subjective vibes present. | Using "etc", "should", or vague verbs like "support". Multiple capabilities in one requirement. |
| **LOW** | Minor formatting, metadata, or style improvements. | Missing version, broken internal link, typo in non-critical description. |

## Convergence Criteria

**CONVERGED** if:
- No new **CRITICAL** issues were found in the current pass AND
- The number of new issues found is less than 10% compared to the previous pass AND
- The estimated false positive rate is below 20%.

**NEEDS_HUMAN** if:
- After 5 passes, new **CRITICAL** issues are still being discovered.
- The false positive rate exceeds 30%.
- A foundational architectural contradiction is found.

## Pass Focus Checklist

### Pass 1: Standalone Integrity
- [ ] Is there a strategic "Why"?
- [ ] Are all external types path-referenced?
- [ ] Are all constants/config values explicit?

### Pass 2: Well-Formed Requirements
- [ ] Is each requirement singular?
- [ ] Is each requirement necessary?
- [ ] Is every requirement verifiable?

### Pass 3: Precision Language
- [ ] No subjective adjectives (fast, easy, robust).
- [ ] No vague quantifiers (some, many, often).
- [ ] No vague verbs (support, handle, provide).

### Pass 4: Behavioral Coverage
- [ ] Happy path GIVEN-WHEN-THEN scenarios present.
- [ ] Edge cases (N, N+1, N-1) present.
- [ ] Error states and negative paths present.

### Pass 5: Executability
- [ ] TypeScript/JSON types explicitly defined.
- [ ] Interface contracts (I/O) mapped.
- [ ] Granular enough for task conversion.
