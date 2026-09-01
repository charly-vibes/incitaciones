---
title: Codebase Cartography
type: prompt
tags: [architecture, visualization, navigation, dependency-analysis, code-smells, onboarding]
tools: [claude-code, pi, cursor, aider, gemini]
status: draft
created: 2026-08-28
updated: 2026-09-02
version: 1.2.0
related: [prompt-task-research-codebase.md, research-paper-codebase-architecture-visualization.md]
source: research-based
---

# Codebase Cartography

Navigate and understand a codebase's structure by having the agent produce text-based architecture maps at three zoom levels (macro/meso/micro), with optional structural-health triage based on anti-pattern signatures.

## When to Use

- Onboarding to an unfamiliar repository: you want the lay of the land before reading code.
- Before a refactor or feature: you need to know which modules a change will touch.
- Tracing a specific functionality end-to-end (entry point → data flow → side effects).
- Structural health checks: cycles, god objects, shotgun surgery, broken pure/IO composition.
- Understanding a module's internal wiring and its integration contracts.

**When NOT to use:**

- When you need prose documentation of *how* something works — use `prompt-task-research-codebase.md` instead (documentarian mode).
- When the question is about runtime behavior, performance, or bugs — cartography maps static structure, not dynamics.
- When you need an interactive visualization — this produces text maps (tables, Mermaid, ASCII); a human tool (CodeScene, Structure101) is better for persistent interactive views.

**Prerequisites:** a reachable codebase (local clone), and a target: repo, module, or functionality.

## The Prompt

> **Note:** Use 4 backticks for the outer code fence when the prompt contains nested code blocks.

````
You are a codebase cartographer. Map the structure of [TARGET: repo | module path | functionality description] as text-based architecture maps. You document topology, not opinions.

## Zoom Level

Start at this level (offer adjacent levels as follow-ups, never dump all three at once):

- **macro** — whole-system topology: modules/domains, dependency direction, layering. Render: module inventory table + text dependency matrix + Mermaid module graph.
- **meso** — one module or feature: internal components, wiring, integration points. Render: component table + Mermaid component/sequence graph + interface ports.
- **micro** — one functionality: call chain, data flow, state mutation, I/O boundaries. Render: ordered call chain with file:line refs + data transformation list + side-effect markers.

## Procedure

1. Clarify the target if ambiguous; state the entry zoom level explicitly.
2. Gather evidence by searching (imports, entry points, directory layout, call sites). Never assume structure from names alone.
3. Render the map for the entry level, plus one adjacent level for context (parent overview when going deep, child detail when starting macro).
4. Every claim carries a file reference (path, or path:line for specific symbols).
5. State dependency direction explicitly (A → B), never "related to".
6. Label anything not directly observed as inference.
7. If the target is too large for one pass, map the boundaries first and ask which area to enter.

## Health Check (only if requested)

Scan for structural anti-patterns using computable proxies and report evidence, not fixes:

- Circular dependencies (closed loops in the module graph)
- God objects (huge files/classes with extreme fan-in and fan-out)
- Shotgun surgery (one concept scattered across many modules)
- Feature envy (module importing another module far more than its own internals)
- Deep inheritance chains
- Pure/impure entanglement (business logic directly interleaved with I/O)
- Broken composition (dependencies that skip the architectural interface layer)

For each hit: name the pattern, cite file:line evidence, quantify (loop members, fan-out count, depth), and rate severity (high/medium/low) by blast radius. Do NOT propose refactors unless explicitly asked.

## Output

- One map per level, rendered as markdown tables and/or Mermaid diagrams.
- A "Key Relationships" list (top 3-5 dependencies that explain the structure).
- A "Structural Observations" list (cycles, hotspots, boundary violations — facts only).
- Open questions for human follow-up.
````

## Example

**Context:**
Joining a team with a large TypeScript monorepo; you need to understand where payment processing lives before adding a refund feature.

**Input:**
```
Map payment processing in this repo at meso level, then trace the refund entry point at micro level.
```

**Expected Output:**
- Meso map: payments module table (billing/, gateway/, ledger/, webhooks/) with a Mermaid wiring diagram and external ports (Stripe API, DB, queue)
- Micro trace: `refundInvoice()` call chain with file:line for each hop, marking where money movement (impure I/O) happens
- Structural observations: webhooks → ledger edge creates a cycle with billing; gateway has 14 importers (fan-in hotspot)

## Expected Results

- Maps you can diff and paste into PRs/docs — tables and Mermaid, not prose walls
- Dependency directions stated explicitly, so layering violations are visible
- A functionality trace with file:line anchors for every hop
- Structural facts (cycles, hotspots) separated from any interpretation

## Variations

**For a quick overview:**
```
Macro map only: module inventory + dependency matrix + top 3 structural observations.
```

**For refactor planning:**
```
Meso map of [module], plus health check. After the observations, list which structural facts a refactor must address, ranked by blast radius.
```

**For onboarding docs:**
```
Macro + meso maps of [domain], rendered as Mermaid, saved as docs/architecture.md.
```

**For a shareable snapshot:**
```
Meso map of [module], plus an HTML export to docs/cartography/ (index page, cross-navigation, vendored Mermaid rendering). The markdown report stays the source of truth.
```

## References

- [research-paper-codebase-architecture-visualization.md](research-paper-codebase-architecture-visualization.md) — the visual framework this skill operationalizes (paradigm-scale fit, semantic zooming, anti-pattern signatures)
- [prompt-task-research-codebase.md](prompt-task-research-codebase.md) — companion documentarian prompt for "how does it work" prose reports

## Notes

- The three zoom levels mirror the semantic zooming framework: macro ≈ DSM/code-city scale, meso ≈ component wiring, micro ≈ polymetric/flow detail. Text renderings replace graphics because agents work in text.
- The health check is the anti-pattern signature catalog stripped of color encoding: signatures become grep-able proxies and counts.
- Cartography (structure) and research-codebase (behavior/prose) compose well: map first, then document the interesting districts.

## Version History

- 1.2.0 (2026-09-02): Reworked HTML export — standard output directory `docs/cartography/`, generated index.html listing HTML + markdown reports, per-page cross-navigation, Mermaid rendered via vendored local v9.4.3 IIFE asset with `<pre>` source fallback (replaces single-file/JS-free export)
- 1.1.0 (2026-09-01): Added optional single-file HTML export (static, self-contained, JS-free; markdown remains the source of truth)
- 1.0.0 (2026-08-28): Initial version, derived from research-paper-codebase-architecture-visualization.md
