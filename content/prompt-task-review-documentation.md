---
title: "Review Documentation Quality (Rule of 5)"
type: prompt
subtype: task
tags: [review, documentation, technical-writing, rule-of-5, diataxis, eppo, info-mapping]
tools: [claude-code, gemini, any-llm]
status: tested
created: 2026-03-11
updated: 2026-07-29
version: 1.1.0
related: [research-documentation-frameworks.md, research-finding-library-docs-best-practices.md, prompt-task-iterative-code-review.md, research-finding-skill-progressive-disclosure.md]
source: project-internal
---

# Review Documentation Quality (Rule of 5)

## When to Use

Use this prompt to **critically evaluate a documentation draft or existing page** using a five-stage iterative process focused on the Unified Frameworks for Technical Information Architecture.

**Critical for:**
- Eliminating "Frankenbooks" (mixed intent).
- Reducing cognitive friction in complex topics.
- Ensuring AI-readiness and semantic clarity.
- Verifying EPPO standalone utility.

## The Prompt

````
# Review Documentation Quality

Perform a Rule of 5 review of the documentation using the Unified Frameworks for Technical Information Architecture.

## REVIEW PROCESS

Perform 5 iterative passes, checking for convergence after each pass (starting with pass 2).

### PASS 1: Diátaxis & Intent
- **Goal:** Does this topic have a single, clear intent?
- **Checks:** Is it a Tutorial, How-to, Reference, or Explanation? Are there "leaked" intents? (e.g., too much theory in a Tutorial).
- **Issue Prefix:** [INTENT-001]

### PASS 2: EPPO & Standalone Utility
- **Goal:** Can a "foraging" reader land here and succeed?
- **Checks:** Are context and prerequisites established in the first two sentences? Does it rely on "previous chapter" knowledge without links?
- **Issue Prefix:** [EPPO-001]

### PASS 3: Cognitive Scannability (Info Mapping)
- **Goal:** Can the reader scan the page in <10 seconds and find the key answer?
- **Checks:** Are **labels** (descriptive headers) used for every 2-3 paragraphs? Are paragraphs chunked into small units? Are there tables/lists for complex data?
- **Issue Prefix:** [SCAN-001]

### PASS 4: Accuracy, "Whole Game" & Fail-States
- **Goal:** Is the content technically sound and resilient?
- **Checks:** Are the code snippets/math verified? Does it show the "Whole Game" (complete result)? Are common errors (fail-states) documented? In tutorials, is the **Martini Glass** pattern followed (context → exploration)?
- **Issue Prefix:** [ACC-001]

### PASS 5: Excellence & AI-Readiness
- **Goal:** Is it production-ready and optimized for AI agents?
- **Checks:** Is there a TL;DR for LLMs? Are headers semantically unique for RAG? Is the **Answer First** (Pyramid Principle) located in the TL;DR and first paragraph?
- **Issue Prefix:** [EXCL-001]

## Convergence Check
After each pass (starting with pass 2), report:
- Total new issues found.
- Estimated "Signal-to-Noise" ratio.
- Convergence status: (CONVERGED | CONTINUE).

## Final Report Format
- **Total Issues by Severity** (Critical | High | Medium | Low).
- **Top 3 Findings.**
- **Verdict:** (Ready | Needs Revision | Needs Rework).
- **Rationale.**
````

## Expected Results

- Documentation that is strictly categorized and free of mixed intent.
- Improved "Time to Information" (TTI) through better scannability.
- Resilient content that handles common user errors.
- Highly optimized artifacts for RAG systems.

## Distilled Structure (Progressive Disclosure)

The runtime skill is split into a lean core and one on-demand reference (`content/distilled/review-documentation/`):

- `SKILL.md` — the five-pass review procedure.
- `references/ai-readiness-criteria.md` — deep AI-readiness checks for Pass 5 (`llms.txt`, RAG chunking, dual-audience, schema sync).

The canonical theory remains `research-documentation-frameworks.md`; the reference is an operational excerpt that links back to it. The deep AI-readiness checks draw from `research-finding-library-docs-best-practices.md` (Section 4).

## References

- `research-documentation-frameworks.md` (Theory).
- `research-finding-skill-progressive-disclosure.md` (Progressive disclosure pattern).
- Rule of 5 (Steve Yegge).
- Information Mapping (Robert Horn).
