# Standalone Specification Review (Rule of 5)

Perform thorough technical specification review using the Rule of 5 - iterative refinement until convergence.

## Setup
**If spec path provided:** Read the specification completely
**If no path:** Ask for path or list available specs from `specs/` or `openspec/`

## Process
Perform 5 passes. After each (starting with pass 2), check for convergence.

---

### PASS 1 - Standalone Integrity & Amnesia Test
**Focus:**
- **Amnesia Test:** Stateless agent execution using ONLY this file + codebase.
- **Rationale:** Strategic "Why" (problem link) present.
- **Encapsulation:** External schemas/types explicitly path-referenced.
- **Metadata:** Unique `change-id` and versioning.

**Format:**
```
[INT-001] [CRITICAL|HIGH|MEDIUM|LOW] - [Section]
Description: [What's missing/disconnected]
Impact: [Why this violates Amnesia Test]
Recommendation: [Specific path/reference fix]
```

### PASS 2 - Well-Formed Requirements (IEEE 29148)
**Focus:**
- **Singularity:** Exactly one capability per requirement.
- **Necessity:** Essential to system; no gold-plating.
- **Verifiability:** Clear proof of meeting requirement.
- **Completeness:** No "TBD" or external dependencies.

**Prefix:** SPEC-001, SPEC-002, etc.

### PASS 3 - Precision Language & Weak Words
**Focus:** Eliminate subjective language.
- **Subjective:** Fast, easy, intuitive, seamless, robust -> Use metrics.
- **Vague Quant:** Some, many, often, several, most -> Use numbers.
- **Incomplete Lists:** Etc., such as, including but not limited to -> Use exhaustive sets.
- **Vague Verbs:** Support, handle, provide, optimize, maintain -> Use "Render," "Validate," "Store."

**Prefix:** PREC-001, PREC-002, etc.

### PASS 4 - Behavioral Coverage (BDD)
**Focus:**
- **Gherkin Scenarios:** Every requirement has a GIVEN-WHEN-THEN block.
- **Happy Path:** Standard success case defined.
- **Edge Cases:** Empty states, maximum limits, boundary values (N, N+1, N-1).
- **Negative Paths:** Validation errors, network failures, permission denials.

**Prefix:** BEHV-001, BEHV-002, etc.

### PASS 5 - Executability & Interface Integrity
**Focus:**
- **Data Models:** TypeScript types/JSON schemas explicitly defined.
- **Interface Contracts:** Explicit I/O mapping for APIs/UI components.
- **Task Readiness:** Granular enough for `tasks.md` conversion.
- **Non-Goals:** Work boundaries explicitly stated.

**Prefix:** EXEC-001, EXEC-002, etc.

---

## Convergence Check
Report after each pass (starting with pass 2):
```
Convergence Check After Pass [N]:
1. New CRITICAL issues: [count]
2. Total new issues this pass: [count]
3. Total new issues previous pass: [count]
4. Estimated false positive rate: [percentage]
Status: [CONVERGED | ITERATE | NEEDS_HUMAN]
```
**CONVERGED:** No new CRITICAL, <10% new issues vs previous pass, <20% false positives.

---

## Final Report
```
## Specification Review Final Report
**Spec:** [path/to/spec.md] | **Convergence:** Pass [N]

### Summary
- CRITICAL: [count] - Blocks implementation/Amnesia Test
- HIGH: [count] - Significant ambiguity/missing scenarios
- MEDIUM: [count] - Minor precision/structural issues
- LOW: [count] - Nice to have improvements

### Top 3 Most Critical Findings
[ID] [Description] - [Location]
Impact: [Why this matters for SDD] | Fix: [Actionable step]

### Recommended Revisions
1. [Specific actionable step]
2. [Specific actionable step]
3. [Specific actionable step]

### Verdict: [READY_TO_IMPLEMENT | NEEDS_REVISION | NEEDS_REWORK]
**Rationale:** [Based on Amnesia Test]
```

## Rules
1. **Reference specific lines/sections.**
2. **Flag all vibes:** Eliminate "easy," "fast," "support," "maintain."
3. **If you can't write a test for it, it's not a spec.**
4. **Stop at convergence; don't force 5 stages.**
