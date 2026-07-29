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
5. If setting up a new docs site or choosing tooling, use `references/tooling-comparison.md` for platform selection and `references/versioning.md` for versioning and changelog strategy. For a full Diátaxis rollout, use `references/diataxis-implementation.md`.

## Rules

- The canonical theory lives in `content/research-documentation-frameworks.md`; the references here are operational excerpts that link back to it.