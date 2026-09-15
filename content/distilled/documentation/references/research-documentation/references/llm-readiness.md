# LLM & Agentic Readiness Reference

Operational excerpt for the AI-readiness gap assessment in Step 4. The canonical theory is `content/research-documentation-frameworks.md` (section "Machine Readability"); this file distills the concrete checks.

## `llms.txt` standard

An emerging convention analogous to `robots.txt`: a machine-readable index at the docs site root that tells LLMs which pages matter most, with structured summaries. Check:

- Is a `llms.txt` present at the documentation root?
- Does it list the most authoritative pages (quick start, API reference, key how-tos)?
- Are summaries concise and current with the latest version?

## RAG-friendly chunking

Documentation structured as single-topic, self-contained modules chunks cleanly for retrieval-augmented generation. Check:

- Does each page cover one well-defined topic (Diátaxis quadrant purity enables this)?
- Are pages small enough to be one RAG chunk, or do they need explicit section anchors?
- Is there redundant cross-page duplication that would pollute retrieval?

## MCP and agent manifests

For tooling/agent documentation, the description fields are documentation. Check:

- Are MCP tool manifests present with precise `name`, `description`, input/output JSON schemas?
- Are plugin/agent cards machine-readable with capability boundaries and error conditions?
- Is language precise enough for a machine (no context-dependent ambiguity a human would resolve but an agent would not)?

## Dual-audience design

Modern docs serve human readers and machine consumers. The practices that serve both: clear structure, consistent terminology, modular organization, explicit metadata. Check:

- Are headings semantic and unique (not generic "Overview" repeated across pages)?
- Is front matter present (title, description, version, category)?
- Are API references generated from or synchronized with a machine-readable spec (OpenAPI, AsyncAPI, JSDoc/TypeDoc, Sphinx autodoc)?

## Docs-as-context

Documentation is increasingly a runtime input to AI systems (system-prompt embedding, RAG retrieval, vector search). Check:

- Is clean, navigation-chrome-free text available for context-window injection?
- Are code examples complete and runnable (agents execute what they read)?
- Is terminology consistent so a model trained on the docs retrieves accurately?