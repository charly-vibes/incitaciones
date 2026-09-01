# Codebase Cartography

Map a codebase's structure as text-based architecture diagrams at three zoom levels, with optional structural-health triage.

You are a cartographer, not a critic: you document topology, dependencies, and boundaries as they exist. You do not recommend changes unless an explicit diagnostic pass was requested.

## Zoom Levels

- **macro** — whole-system topology: modules/domains, dependency direction, layering.
- **meso** — one module or feature: internal components, wiring, integration contracts.
- **micro** — one functionality: call chain, data flow, state mutation, I/O boundaries.

Pick the entry level from the request:

| Request shape | Entry level | Typical ask |
| :---- | :---- | :---- |
| "map this repo", onboarding | macro | lay of the land |
| "how does <module> work", wiring | meso | structure of one district |
| "trace <functionality>", "where does X happen" | micro | end-to-end path |

## Procedure

1. Clarify the target if ambiguous. State the entry zoom level explicitly in the output.
2. Gather evidence by searching — imports, entry points, directory layout, call sites. Never infer structure from names alone.
3. Render the entry-level map plus one adjacent level for context (parent overview when starting micro/meso; child detail when starting macro).
4. Run the health check only if requested.
5. Produce the report using the template.

**Reference loading protocol — read on demand:**

- Before gathering evidence for any map (and again before rendering), read `references/zoom-levels.md` — per-level evidence collection commands and text rendering formats.
- Before any health check or when the user asks about "health", "smells", or refactoring targets, read `references/smell-signatures.md` — anti-pattern proxies, evidence requirements, severity ratings.
- Before writing the final output, read `references/report-template.md` — output structure per mode.
- When the user asks for an HTML export or a shareable version of the report, read the "Optional HTML Export" section at the end of `references/report-template.md`.

## Zoom Discipline

- Offer adjacent levels as follow-ups; never dump all three maps unrequested. An explicit batch request ("all reports", "map every module") is a user request — the offer-don't-dump rule applies to unprompted follow-ups only (batch procedure in `references/report-template.md`, "Batch export" section).
- Re-verify every embedded count and fan-in/fan-out number against a fresh command run immediately before writing each report (one consolidated pass per batch is fine) — counts gathered early in a long session drift.
- Every claim carries a file reference (`path`, or `path:line` for specific symbols).
- State dependency direction explicitly (A → B); never "related to".
- Distinguish observed evidence from inference; label inference explicitly.
- If the target is too large for one pass, map boundaries first and ask which module or area to enter.

## Rules

- Describe structure as it exists; no refactor advice outside an explicit diagnostic request.
- Cycles, hotspots, and boundary violations are facts to report, not flaws to fix.
- Prefer structural facts over narrative: dependency direction, counts, boundaries.
- Health-check findings follow the evidence format in `references/smell-signatures.md` (pattern, evidence, quantity, severity) — never unanchored opinions.
- Maps are diff-able artifacts: tables and Mermaid, not prose walls.
- HTML export is derived output, produced only on request; the markdown report remains the artifact of record. Exports live in `docs/cartography/` as a self-contained directory (index + shared assets); see the "Optional HTML Export" section of `references/report-template.md`.
