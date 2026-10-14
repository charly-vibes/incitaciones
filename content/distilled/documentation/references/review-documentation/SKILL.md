# Review Documentation Quality

Perform a Rule of 5 review of the documentation using the Unified Frameworks for Technical Information Architecture.

## Core Rules

- You are a reviewer, not a writer. Flag issues with locations; do not rewrite content.

## Procedure

Perform 5 iterative passes — 6 when the subject spans multiple surfaces (README, docs index, installation page): Pass 6 is the cross-surface consistency pass — 7 when the subject is user-facing documentation (for README, quickstart, and tool docs that is effectively always): Pass 7 is the cold-reader & positioning pass. Check for convergence after each pass starting with Pass 2: report new CRITICAL issues, total new issues, the change vs. the previous pass, and status (CONVERGED or CONTINUE). Converge when no new CRITICAL issues are found and the new-issue rate drops below 10% versus the previous pass. Stop early if converged.

### Pass 1: Diátaxis & Intent

Goal: does this topic have a single, clear intent? Checks: is it a Tutorial, How-to, Reference, or Explanation? Are there leaked intents (e.g., too much theory in a Tutorial)? Issue prefix: [INTENT-001].

### Pass 2: EPPO & Standalone Utility

Goal: can a foraging reader land here and succeed? Checks: are context and prerequisites established in the first two sentences? Does it rely on "previous chapter" knowledge without links? Is domain jargon defined at first use or via a glossary? (Jargon rule: `../research-documentation/references/checklist.md` and `../implement-documentation/references/anti-patterns.md` — cross-reference, do not duplicate here.) Issue prefix: [EPPO-001].

### Pass 3: Cognitive Scannability (Info Mapping)

Goal: can the reader scan the page in under 10 seconds and find the key answer? Checks: are descriptive labels used for every 2-3 paragraphs? Are paragraphs chunked into small units? Are tables and lists used for complex data? Issue prefix: [SCAN-001].

### Pass 4: Accuracy, "Whole Game" & Fail-States

Goal: is the content technically sound and resilient? Checks: are code snippets verified? Does it show the complete result? Are common errors documented? In tutorials, is the Martini Glass pattern followed (guided context then open exploration)? If the subject is a runnable tool/API: spot-check documented claims against the artifact itself (the method statement goes in the Final Report provenance block). For entry-point pages (README / landing / quickstart): is there a quickstart reaching a first verified success in minutes (time-to-first-success; see `../research-documentation/references/metrics.md`)? For repos with executable docs: does CI re-run the documented commands and diff their captured output against the docs (accuracy gate), are stamped artifacts (`llms.txt`, `release.md`, README version facts) generated rather than hand-edited (freshness check), and does CI smoke the live deployed URL? Flag the absence of any of these as an [ACC-] finding — the methodology lives in `../implement-documentation/references/docs-accuracy.md`; cross-reference it, do not duplicate it here. Issue prefix: [ACC-001].

### Pass 5: Excellence & AI-Readiness

Goal: is it production-ready and optimized for AI agents? Checks: is there a TL;DR for LLMs? Are headers semantically unique for RAG? Is the Answer First (Pyramid Principle) in the TL;DR and first paragraph? Use `references/ai-readiness-criteria.md` for the deep AI-readiness checks (`llms.txt`, RAG chunking, dual-audience, schema sync). Are claims marked by status — documented / interpreted / proposed / unknown — with unverified claims not stated as fact? Issue prefix: [EXCL-001].

### Pass 6: Cross-Surface Consistency (multi-surface subjects only)

Goal: do all user-facing surfaces tell one story with one set of facts? Applies when the subject spans multiple surfaces (README, docs index, installation page — any fact published in more than one place). Checks: run the drift audit — enumerate the facts repeated across surfaces (pack/module counts, command names, install steps, links, version claims) and verify every copy agrees; flag copies that should be generated/stamped instead of hand-written. Then check topic alignment: README, docs index, and installation page must tell one consistent story (same audience, same promise, same next step), not drift into different framings. The methodology lives in `references/drift-audit.md`; cross-reference it, do not duplicate it here. Issue prefix: [DRIFT-001].

### Pass 7: Cold-Reader & Positioning

Goal: would a confused first-time human succeed — not just an AI agent scoring structure (`references/ai-readiness-criteria.md` scores ingestion; it never asks the human question)? Applies when the subject is user-facing documentation. Checks: (1) cold-reader question mining — collect real user questions from support conversations, session logs, and issue titles, and verify each has a doc answer; unanswered ones become FAQ entries or tickets; (2) first-run funnel — can a cold reader reach first success in under 10 minutes (time-to-first-success; see `../research-documentation/references/metrics.md`)? (3) positioning — does every tool/format doc carry an explicit "when NOT to use this" section, and is there a decision guide where entry points overlap? The methodology lives in `references/cold-reader.md`; cross-reference it, do not duplicate it here. Issue prefix: [COLD-001].

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