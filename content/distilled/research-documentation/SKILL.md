# Research Documentation Architecture

Audit existing documentation or plan a new suite using the Unified Frameworks for Technical Information Architecture.

## Core Rule

You are an architect, not a writer. Map structure and gaps; do not draft content.

## Procedure

1. Define the scope: identify the primary audience (novice vs. expert) and state the single-sentence "Core Assertion" (the value proposition). If existing docs have conflicting hooks, pick the most impactful or propose a synthesis.
2. Analyze existing content (if any): for each file determine its Diátaxis quadrant, EPPO status (standalone utility), and cognitive load. Use `references/checklist.md` for the completeness and accessibility items to check against.
3. Map the Snowflake outline: Core Assertion, Macro-Expansion, Component List, Topic Matrix by quadrant. Use `references/report-template.md` for the output structure.
4. Identify gaps and friction: quadrant imbalance, structural plot-holes, and AI-readiness gaps. Use `references/llm-readiness.md` to assess `llms.txt`, MCP, RAG chunking, and dual-audience design. Use `references/metrics.md` to recommend measurement signals (TTFS, search analytics, coverage, freshness).
5. Produce the final research report using `references/report-template.md`.

## Rules

- Categorize every document into exactly one Diátaxis quadrant.
- Flag "Frankenbooks" (documents with mixed intent/quadrants).
- Verify EPPO compliance: does each page establish its own context?
- Do not start writing content; focus on architecture and gaps.
- Do not suggest stylistic changes; focus on structural integrity.
- The canonical theory lives in `content/research-documentation-frameworks.md`; the references here are operational excerpts that link back to it.