---
title: Standalone Specification Review (Rule of 5 Principle)
type: prompt
subtype: task
tags: [review, specification, rule-of-5, quality-assurance, ieee-29148, openspec, bdd]
tools: [claude-code, cursor, any-cli-llm]
status: testing
created: 2026-03-16
version: 1.0.0
related: [research-standalone-specification-standards.md, prompt-task-plan-review.md, prompt-task-design-review.md]
source: research-based
---

# Standalone Specification Review (Rule of 5 Principle)

## About This Prompt

This prompt applies the **Rule of 5 principle** (iterative refinement until convergence) to technical specification review. It uses a single-agent, 5-pass approach with domain-focused passes adapted for ensuring **Specification Autonomy** and **AI-Readiness**:

- **Approach:** Single agent, sequential passes
- **Passes:** Standalone Integrity → Well-Formed Requirements → Precision Language → Behavioral Coverage → Executability
- **Philosophy:** Iterative refinement with convergence checking based on IEEE 29148 and OpenSpec standards.

## When to Use

Use this prompt to perform thorough review of technical specifications before implementation begins.

**Critical for:**
- Validating specs before handing them to an AI for implementation
- Ensuring specs survive the "Amnesia Test" (standalone completeness)
- Eliminating "vibe coding" by removing subjective language
- Quality gate for Spec-Driven Development (SDD)

## The Prompt

````
# Standalone Specification Review (Rule of 5)

Perform thorough technical specification review using the Rule of 5 - iterative refinement until convergence.

## Setup

**If spec path provided:** Read the specification completely. If the input is not text-based or Markdown, ask for a text version for analysis.

**If no path:** Ask for the specification path or list available specs from `specs/` or `openspec/`

## Process

Perform 5 passes, each focusing on different aspects. After each pass (starting with pass 2), check for convergence.

---

### PASS 1 - Standalone Integrity & The Amnesia Test

**Focus on:**
- Can a stateless agent execute this implementation using *only* this file and the codebase?
- Strategic Rationale: Is the "Why" (link to Problem Statement, Proposal, or Issue) present?
- Context Encapsulation: Are all external schemas/types explicitly path-referenced?
- Metadata: Is there a unique `change-id` or versioning?

**Output format:**
```
PASS 1: Standalone Integrity

Issues Found:

[INT-001] [CRITICAL|HIGH|MEDIUM|LOW] - [Section]
Description: [What's missing or disconnected]
Impact: [Why this violates the Amnesia Test]
Recommendation: [How to fix with specific path/reference]

[INT-002] ...
```

---

### PASS 2 - Well-Formed Requirements (IEEE 29148)

**Focus on:**
- **Singularity:** Does each requirement state exactly one capability? (Check for "and/or").
- **Necessity:** Is this requirement essential or gold-plating?
- **Verifiability:** Is there a clear way to prove the requirement is met?
- **Completeness:** Does it provide all context without "TBD" or "See chat"?

**Prefix:** SPEC-001, SPEC-002, etc.

---

### PASS 3 - Precision Language & Weak Word Removal

**Focus on:**
- **Subjective Adjectives:** Fast, easy, intuitive, seamless, robust. (Replace with metrics).
- **Vague Quantifiers:** Some, many, often, several, most. (Replace with numbers).
- **Incomplete Lists:** Etc., such as, including but not limited to. (Replace with exhaustive lists).
- **Vague Verbs:** Support, handle, provide, optimize, maintain. (Replace with specific actions: "Render," "Validate," "Store").

**Prefix:** PREC-001, PREC-002, etc.

---

### PASS 4 - Behavioral Coverage (BDD Scenarios)

**Focus on:**
- **Gherkin Scenarios:** Does every requirement have a GIVEN-WHEN-THEN block?
- **Happy Path:** Is the standard success case defined?
- **Edge Cases:** Empty states, maximum limits, boundary values (N, N+1, N-1).
- **Negative Paths:** Validation errors, network failures, permission denials.

**Prefix:** BEHV-001, BEHV-002, etc.

---

### PASS 5 - Executability & Interface Integrity

**Focus on:**
- **Data Models:** Are TypeScript types or JSON schemas explicitly defined?
- **Interface Contracts:** Are I/O types for APIs/UI components mapped out?
- **Task Readiness:** Is this granular enough to be converted directly into a `tasks.md`?
- **Non-Goals:** Are the boundaries of the work explicitly stated?

**Prefix:** EXEC-001, EXEC-002, etc.

---

## Convergence Check

After each pass (starting with pass 2), report:

```
Convergence Check After Pass [N]:

1. New CRITICAL issues: [count]
2. Total new issues this pass: [count]
3. Total new issues previous pass: [count]
4. Estimated false positive rate: [percentage]

Status: [CONVERGED | ITERATE | NEEDS_HUMAN]
```

**Convergence criteria:**
- **CONVERGED**: No new CRITICAL, <10% new issues vs previous pass, <20% false positives
- **ITERATE**: Continue to next pass
- **NEEDS_HUMAN**: Found blocking issues requiring human judgment

**If CONVERGED before Pass 5:** Stop and report final findings.

---

## Final Report Template

After convergence or completing all passes:

```
## Specification Review Final Report

**Spec:** [path/to/spec.md]
**Convergence:** Pass [N]

### Summary

Total Issues by Severity:
- CRITICAL: [count] - Blocks implementation/Amnesia Test
- HIGH: [count] - Significant ambiguity or missing scenarios
- MEDIUM: [count] - Minor precision or structural issues
- LOW: [count] - Nice to have improvements

### Top 3 Most Critical Findings

1. [ID] [Description] - [Location]
   Impact: [Why this matters for SDD]
   Fix: [Specific actionable step]

2. [ID] [Description] - [Location]
   Impact: [Why this matters for SDD]
   Fix: [Specific actionable step]

3. [ID] [Description] - [Location]
   Impact: [Why this matters for SDD]
   Fix: [Specific actionable step]

### Recommended Revisions

1. [Action 1 - specific and actionable]
2. [Action 2 - specific and actionable]
3. [Action 3 - specific and actionable]

### Verdict

[READY_TO_IMPLEMENT | NEEDS_REVISION | NEEDS_REWORK]

**Rationale:** [1-2 sentences explaining the verdict based on the Amnesia Test]
```

## Rules

1. **Be specific** - Reference sections/lines, provide file:line if relevant
2. **Eliminate "Vibes"** - Flag every instance of "easy," "fast," or "support"
3. **Validate actionability** - If you can't write a test for it, it's not a spec
4. **Prioritize correctly**:
   - CRITICAL: Violates Amnesia Test (agent will get stuck)
   - HIGH: High ambiguity or missing critical scenarios
   - MEDIUM: Non-singular or vague language
   - LOW: Minor formatting or metadata
5. **If converged before pass 5** - Stop and report, don't continue needlessly
````
