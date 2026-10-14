# Implement Documentation Topic

Write a high-signal documentation topic using the Unified Frameworks for Technical Information Architecture.

## Core Rules

- Establish context and prerequisites in the first two sentences (EPPO).
- Lead with the answer or primary assertion in the TL;DR and first paragraph (Pyramid Principle).
- Use explicit, semantic block labels (descriptive headers) for every 2-3 paragraphs (Info Mapping).
- Provide a clear "fail-state" or troubleshooting section (Minimalism).
- Do not mix intents: no deep theory in a How-to. If theory is required, use a Note or Deep Dive sidebar to maintain quadrant purity.
- Do not use "Next" or "Previous" as the only navigational cues (EPPO).

## Procedure

1. Quadrant check: identify the Diátaxis quadrant and follow its rhetorical rules. Use `references/templates.md` for the matching template (Tutorial, How-to, Reference, or Explanation). Use `references/anti-patterns.md` to avoid common failures for that quadrant.
2. EPPO initialization: every topic must stand alone. Start with a clear task- or concept-focused title and a context block ("This topic covers [X]. You should already understand [Y] and have [Z] installed.").
3. Information mapping: chunk the body into units under 7 items; label headers by result or content (e.g., "Configuring the API" not "Configuration"); convert complex comparisons or steps into tables and lists.
4. AI-first polish: ensure headers are descriptive for RAG indexing and provide a 1-2 sentence TL;DR at the top for LLM ingestion.
5. If the topic is a tutorial, quickstart, or introduces user-facing commands, use `references/worked-examples.md`: it defines the worked-example pattern (one evolving example thread, not disconnected snippets), the quickstart rule (every command shows its expected output and exit code; every install path ends with a post-install verification block), and the example coverage matrix (map every user-facing feature to at least one example page).
6. If setting up a new docs site or choosing tooling, use `references/tooling-comparison.md` for platform selection and `references/versioning.md` for versioning and changelog strategy. For a full Diátaxis rollout, use `references/diataxis-implementation.md`.
7. If the topic shows user-facing commands or the docs ship generated artifacts, use `references/docs-accuracy.md`: it defines the docs-accuracy gate (CI re-runs documented commands and diffs normalized captured output against the docs), the stamped-artifact rule (`llms.txt`, `release.md`, README version facts are generated per release, with a freshness check that fails on hand-edits), and the live-site smoke (CI curls the deployed URL so a 404 fails in the pipeline, not at the next human visit).

## Rules

- The canonical theory lives in `content/research-documentation-frameworks.md`; the references here are operational excerpts that link back to it.

## Related Skills

- `research-documentation` — audit before writing.
- `review-documentation` — review after writing.