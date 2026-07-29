# AI-Readiness Criteria (Pass 5)

Deep checks for Pass 5. The basic pass (TL;DR present, headers unique, Answer First) catches surface issues; these checks catch whether the page is actually consumable by an AI agent. The canonical theory is `content/research-documentation-frameworks.md` (section "Machine Readability").

## LLM-friendly structure

- Is there a concise TL;DR (1-2 sentences) at the top suitable for context-window injection?
- Is the page free of navigation chrome when exported (menus, footers, ads) so the body text is clean?
- Is prose minimalist and high-signal? Verbose docs cost more and retrieve worse.

## RAG-compatible chunking

- Does the page cover one well-defined topic so it chunks cleanly for retrieval?
- Are section headings stable and unique so a chunk can be addressed precisely?
- Is there redundant cross-page duplication that would pollute retrieval results?

## Semantic headers

- Are headers descriptive of content, not generic ("Overview", "Details")?
- Are headers unique across the site so a model can disambiguate?
- Is front matter present (title, description, version, category) for indexing?

## Dual-audience precision

- Is language precise enough for a machine? Natural-language ambiguity a human resolves from context is opaque to an agent.
- Are error conditions and their meanings explicit?
- Are capability boundaries stated (what the tool/API can and cannot do)?

## Schema and spec sync (reference pages)

- For API reference: is it generated from or synchronized with a machine-readable spec (OpenAPI, AsyncAPI, JSDoc/TypeDoc, Sphinx autodoc)?
- For tool/agent docs: are MCP manifests and agent cards present with precise descriptions and JSON schemas for inputs/outputs?
- Are code examples complete and runnable? Agents execute what they read; partial snippets mislead.

## Site-level (flag only if the page is the canonical entry)

- Is a `llms.txt` present at the documentation root and does it reference this page where authoritative?
- Are canonical URLs set so a model retrieves the current stable version?