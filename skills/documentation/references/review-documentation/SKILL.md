# Review Documentation Quality

Perform a Rule of 5 review of the documentation using the Unified Frameworks for Technical Information Architecture.

## Core Rules

- You are a reviewer, not a writer. Flag issues with locations; do not rewrite content.

## Procedure

Perform 5 iterative passes. Check for convergence after each pass starting with Pass 2: report new CRITICAL issues, total new issues, the change vs. the previous pass, and status (CONVERGED or CONTINUE). Converge when no new CRITICAL issues are found and the new-issue rate drops below 10% versus the previous pass. Stop early if converged.

### Pass 1: Diátaxis & Intent

Goal: does this topic have a single, clear intent? Checks: is it a Tutorial, How-to, Reference, or Explanation? Are there leaked intents (e.g., too much theory in a Tutorial)? Issue prefix: [INTENT-001].

### Pass 2: EPPO & Standalone Utility

Goal: can a foraging reader land here and succeed? Checks: are context and prerequisites established in the first two sentences? Does it rely on "previous chapter" knowledge without links? Is domain jargon defined at first use or via a glossary? (Jargon rule: `../research-documentation/references/checklist.md` and `../implement-documentation/references/anti-patterns.md` — cross-reference, do not duplicate here.) Issue prefix: [EPPO-001].

### Pass 3: Cognitive Scannability (Info Mapping)

Goal: can the reader scan the page in under 10 seconds and find the key answer? Checks: are descriptive labels used for every 2-3 paragraphs? Are paragraphs chunked into small units? Are tables and lists used for complex data? Issue prefix: [SCAN-001].

### Pass 4: Accuracy, "Whole Game" & Fail-States

Goal: is the content technically sound and resilient? Checks: are code snippets verified? Does it show the complete result? Are common errors documented? In tutorials, is the Martini Glass pattern followed (guided context then open exploration)? If the subject is a runnable tool/API: spot-check documented claims against the artifact itself (the method statement goes in the Final Report provenance block). For entry-point pages (README / landing / quickstart): is there a quickstart reaching a first verified success in minutes (time-to-first-success; see `../research-documentation/references/metrics.md`)? Issue prefix: [ACC-001].

### Pass 5: Excellence & AI-Readiness

Goal: is it production-ready and optimized for AI agents? Checks: is there a TL;DR for LLMs? Are headers semantically unique for RAG? Is the Answer First (Pyramid Principle) in the TL;DR and first paragraph? Use `references/ai-readiness-criteria.md` for the deep AI-readiness checks (`llms.txt`, RAG chunking, dual-audience, schema sync). Are claims marked by status — documented / interpreted / proposed / unknown — with unverified claims not stated as fact? Issue prefix: [EXCL-001].

## Final Report

- Total Issues by Severity (Critical, High, Medium, Low).
- Top 3 Findings.
- Verdict: Ready, Needs Revision, or Needs Rework.
- Rationale.
- Provenance: which revision/commit of the subject was reviewed (mark UNKNOWN if unpinned — never guess) and the review method (runtime-verified vs read-only).
- Optional (entry-point pages: README / landing / quickstart): audience-barrier table (reader type × barriers × recommended approach).

## Rules

- Reference exact locations (file, section, paragraph).
- Cross-referenced criteria live in sibling mode references — do not copy them into this file; link instead.
- Validate issues exist; do not flag "potential" issues without evidence.
- The canonical theory lives in `content/research-documentation-frameworks.md`; `references/ai-readiness-criteria.md` is an operational excerpt that links back to it.

## Related Skills

- `research-documentation` — architecture-level gaps.
- `implement-documentation` — fixing what the review finds.