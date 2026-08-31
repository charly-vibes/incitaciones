---
title: Hierarchical Visual Framework for Codebase Architecture and Anti-Pattern Detection
type: research
subtype: paper
tags: [architecture, visualization, code-smells, semantic-zooming, dsm, polymetric-views]
tools: [pi, claude-code, cursor]
status: draft
created: 2026-08-28
updated: 2026-08-28
version: 1.0.1
related: [research-paper-codebase-housekeeping-systematic-refactoring.md, prompt-task-research-codebase.md, prompt-task-abstraction-miner.md]
source: synthesis
---

# Hierarchical Visual Framework for Codebase Architecture and Anti-Pattern Detection

## Summary

This research synthesizes software visualization literature into a coherent multi-scale framework for mapping codebase architecture: matching visual paradigms (node-link graphs, Design Structure Matrices, spatial/code-city mappings, flow diagrams) to architectural scales, navigating them via semantic zooming, and encoding OOP and FP anti-patterns as polymetric visual signatures. A five-stage extraction-to-rendering pipeline makes the framework buildable. The framework doubles as an automated architectural diagnostic: code smells exhibit distinct geometric and topological signatures when projected through the right visual paradigm.

## Context

Source code has no inherent physical geometry, so any architecture visualization is a mapping from multi-dimensional text artifacts to lower-dimensional spatial representations. The choice of paradigm dictates whether developers can comprehend system topology, assess structural health, and trace cross-boundary dependencies without cognitive overload. This document answers: which visualization paradigm fits which architectural scale, and how can structural anti-patterns be surfaced automatically through metric-driven visual encodings?

## Hypothesis / Question

No single diagrammatic model works across all scales. Node-link diagrams degrade into "spaghetti graphs" at macro scales, while treemaps and matrices lack the sequential resolution to debug micro-level functional compositions. A layered framework — paradigm selection per scale + semantic zooming for navigation + polymetric encodings for smell detection — outperforms any one-size-fits-all approach.

## Method

Synthesis of ~30 sources (nine representative references listed below; the full works-cited list is in the original document) spanning academic papers (arXiv), practitioner references (yWorks, Graphviz, DSM suite), and tool documentation (Tree-sitter, Cytoscape.js, Three.js, React Flow). Findings were organized along three axes: visual paradigm comparison, multi-scale navigation (semantic zooming), and anti-pattern-to-visual-signature mapping.

## Results

### Key Findings

1. **Paradigm-scale fit is the core design decision.** Each visual paradigm has a distinct suitability profile:

| Paradigm | Primary Visual Primitives | Scale Suitability (Micro/Meso/Macro) | Visual Scalability Limit | Structural Semantics Captured | Edge Clutter Mitigation |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Node-Link / DAG** | Vertices, directed arcs, hyper-edges | High / Medium / Low | ~hundreds of nodes | Call graphs, inheritance, interface couplings | Hierarchical edge bundling, node aggregation |
| **Design Structure Matrix (DSM)** | Square grid cells, row/col headers | Low / High / High | ~thousands of components | Layering, cycles, change propagation, module boundaries | Complete edge elimination via grid cells |
| **Spatial (Code Cities)** | 3D prisms, urban districts | Low / High / High | ~thousands of elements | Namespace containment, LOC, complexity metrics | Spatial enclosure, 2D minimap projection |
| **Treemap / Sunburst** | Nested rectangles, concentric rings | Low / High / High | ~tens of thousands of elements | Hierarchical composition, file size distributions | Space-filling tessellation |
| **Flow / Sankey** | Weighted streams, directional pipelines | High / High / Low | ~tens of pipelines | Monadic transformations, data pipelines, side effects | Stream width encoding, linear routing |

2. **DSMs make architectural violations visually immediate.** Dependencies below the main diagonal reflect clean forward layering; marks above the diagonal instantly flag inverted dependencies or cyclic feedback loops. Space scales as O(n²) with zero edge clutter, but DSMs are poorly suited for sequential execution tracing.

3. **Semantic zooming solves the multi-scale navigation problem.** Unlike geometric zooming, semantic zooming changes the abstraction level and representation as the viewport scale `s` (which increases as the camera zooms in) crosses deterministic thresholds (s_meso, s_micro):
   - **Macro (0 < s < s_meso):** 2D spatial software map + DSM overlays; topographic elevation contours derived from KLOC-weighted Gaussian sums; module districts and bundled inter-module channels; file/class detail hidden.
   - **Meso (s_meso ≤ s < s_micro):** compound nested graphs inside semi-transparent parent hulls; typed interface ports, dataflow channels, event-bus topics.
   - **Micro (s ≥ s_micro):** polymetric class cards (height/width/color encode methods, attributes, complexity), execution flow trees, monadic transformation steps with explicit side-effect sinks.

4. **Context preservation requires three mechanisms** to prevent "desert fog" (losing spatial orientation during deep zoom): (a) stable layouts from LSI/Isomap+MDS spatial anchoring so code changes cause incremental shifts, not re-layout; (b) topographical contour fading — peripheral modules fade to low-opacity contours instead of vanishing; (c) a persistent 2D overview minimap showing the camera frustum.

5. **Anti-patterns have distinct visual signatures** when metrics map to polymetric encodings:

| Anti-Pattern | Scale | Structural / Metric Anomaly | Visual Encoding |
| :---- | :---- | :---- | :---- |
| **God Object** | Node-Link & DSM / Meso-Macro | High NOM (methods), NOA (attributes), WMC (weighted method complexity); low TCC (tight class cohesion); star-topology hub | Oversized dark-red node; full row/column crosshair in DSM |
| **Circular Dependencies** | DSM & Node-Link / Meso | Closed feedback loops; entries above DSM diagonal | Pulsating amber loops; bright orange upper-triangle DSM cells |
| **Shotgun Surgery** | Node-Link / Meso-Macro | High fan-out, high change propagation, low cohesion | High-radiance emitter; red dashed "explosion" fan across modules |
| **Deep Inheritance** | Tree layout / Micro-Meso | Deep DIT (inheritance depth), high NOC (number of children) at root | Tall narrow "totem pole"; deep nodes fade grey → magenta |
| **Feature Envy** | Force-directed / Micro-Meso | High ATFD (access to foreign data), low LAA (locality of data), high foreign out-degree | Node pulled toward foreign cluster; thick cyan cross-boundary links |
| **Shared Mutable State** | Flow / Micro-Meso | Non-zero side-effect edges from pure scopes | Jagged crimson edges puncturing blue pure-flow streams |
| **Monadic/Pipeline Bloat** | Flow / Micro | Long bind chains; unannotated I/O sinks | Elongated pipeline; flashing hazard stroke on impure steps |
| **Excessive Currying/HOF nesting** | Nested enclosure / Micro | High closure nesting depth, low traceability | Concentric rings fading into neon purple at depth |
| **Broken Composition (pure↔I/O)** | Matrix-Flow / Micro-Meso | High pure-to-impure interdependency, layer-skipping deps | I/O pipes puncturing pure-core bubbles; layer-skipping DSM marks |

6. **A five-stage extraction pipeline makes this buildable:**
   1. **Incremental AST parsing** — Tree-sitter / ts-morph over multi-language repos.
   2. **Semantic analysis** — symbol resolution for inheritance, invocations, interface implementations, type flows.
   3. **Metric calculation + IR graph extraction** — method/attribute counts (NOM/NOA), complexity (WMC), cohesion (TCC), inheritance depth (DIT), coupling, monadic chain length; multi-scale IR with vertices, directed edges, metric vectors.
   4. **Multi-scale layout** — Sugiyama (layered DAGs; cycle breaking → layer assignment → barycenter crossing minimization → Brandes-Köpf coordinates), Fruchterman-Reingold/Kamada-Kawai (force-directed), DSM triangularization/tearing (matrix clustering), squarified treemap (Bruls et al.).
   5. **Rendering by density** — SVG (React Flow/D3) at low density (order of hundreds of active elements); Canvas 2D/WebGL (Cytoscape.js, PixiJS, Three.js) at high density (thousands and up); Mermaid/PlantUML for static docs and PR impact summaries. (Exact density thresholds vary by implementation; the source document states them only in formula images that did not survive export.)

## Analysis

The framework's central insight is that visualization is a diagnostic instrument, not decoration. When metrics (coupling, cohesion, mutation factor, chain length) drive visual encodings, architectural drift becomes perceptible before lagging indicators (incident rates, change failure rates) confirm it. This complements code-review-based approaches: a DSM above-diagonal mark or a red "explosion fan" is a cheap, objective triage signal for where to focus human review.

For AI-assisted development, the anti-pattern signature catalog is directly reusable as review vocabulary: agents can be instructed to check for these structural anomalies (cycle detection via DSM, fan-out analysis, mutation leak detection) without any rendering at all — the visual encodings are downstream of the graph and metric analysis, which is the automatable part.

## Practical Applications

- **Architecture onboarding**: generate macro-level spatial maps + DSMs of unfamiliar codebases to build mental models before code reading (supports `prompt-task-research-codebase.md`).
- **Refactoring triage**: use the anti-pattern signature catalog as a checklist for structural review; prioritize God Objects and above-diagonal cycles (supports `prompt-task-abstraction-miner.md` and housekeeping workflows).
- **PR impact summaries**: Mermaid/PlantUML diagrams generated from the IR schema give reviewers a structural diff, not just a textual one.
- **Monorepo health dashboards**: treemaps (volume) + DSMs (dependencies) at macro scale; node-link views only at meso/micro scale.
- **Existing tooling**: commercial products (CodeScene, NDepend, Structure101) already implement subsets of these techniques (code cities, dependency matrices, hotspot analysis); evaluate them before building bespoke tooling.
- **Agent instructions**: encode the metric anomalies (DIT depth thresholds, fan-out limits, pure-function isolation ratios) as lint-style rules an AI agent can evaluate statically.

## Limitations

- The synthesis is literature-based; no empirical validation of whether the proposed visual encodings measurably reduce comprehension time or defect rates.
- Metric thresholds (e.g., DIT depth, fan-out limits) are stated qualitatively; concrete cutoffs are project- and language-dependent.
- 3D Code Cities carry known costs (occlusion, navigation complexity) that the synthesis underweights; the cited minimap/contour techniques mitigate but do not eliminate them.
- The pipeline assumes accurate multi-language symbol resolution, which remains hard across dynamic languages and reflection-heavy code.
- FP smells (monadic bloat, currying depth) rely on conventions (bind chains, IO markers) that many codebases do not make explicit.

## Related Prompts

- [prompt-task-research-codebase.md] - Macro/meso mapping is a structured way to bootstrap codebase research
- [prompt-task-abstraction-miner.md] - Semantic duplication scanning parallels the structural anomaly catalog
- [research-paper-codebase-housekeeping-systematic-refactoring.md] - Visualization as an entropy countermeasure fits the four-layer maintenance model

## References

- [arXiv:1209.5490 — software visualization mapping](https://arxiv.org/pdf/1209.5490)
- [arXiv:1001.2386 — spatial software maps](https://arxiv.org/pdf/1001.2386)
- [Semantic Zoom and Mini-Maps for Software Cities (arXiv:2510.00003)](https://arxiv.org/html/2510.00003v1)
- [Design Structure Matrix — Wikipedia](https://en.wikipedia.org/wiki/Design_structure_matrix) and [DSM suite overview](https://dsmsuite.github.io/dsm_overview.html)
- [Polymetric Views (Lanza & Marinescu, Object-Oriented Metrics in Practice)](http://sharpmetrics.net/index.php/polymetricviews)
- [Squarified Treemaps — Bruls, Huizing & van Wijk](https://www.semanticscholar.org/paper/Squarified-Treemaps-Bruls-Huizing/c0147b41048540b8cb461da8216cbc565dca050e)
- [Layered graph drawing (Sugiyama) — Wikipedia](https://en.wikipedia.org/wiki/Layered_graph_drawing) and [yWorks layered layout](https://www.yworks.com/pages/layered-graph-layout)
- [Adding Context to Edges in Multivariate Graph Visualization](https://markjanbludau.de/publications/bludau2023unfolding.pdf)
- [Systematic Literature Review of Modern Software Visualization](https://www.researchgate.net/publication/339641846_A_Systematic_Literature_Review_of_Modern_Software_Visualization)

## Future Research

- Empirical studies measuring comprehension-speed and defect-detection deltas for DSM-vs-node-link at matched scales.
- Concrete metric thresholds per language ecosystem (calibrating the smell signature table against real repos).
- Extending the anti-pattern catalog to concurrency smells (races, channel misuse) and their flow/topology signatures.
- Accessibility of polymetric encodings: the smell signatures rely on color (amber, crimson, magenta, purple); shape-, size-, or label-based fallbacks are needed for color-blind users.
- Feasibility of LLM agents computing the IR (metrics + dependency graphs) directly, making the "rendering" stage optional and the diagnostics prompt-native.

## Version History

- 1.0.0 (2026-08-28): Initial version, synthesized from "Hierarchical Visual Framework for Codebase Architecture and Anti-Pattern Detection"
- 1.0.1 (2026-08-28): Rule-of-5 review fixes — hedged unverifiable rendering thresholds, expanded metric abbreviations, clarified provenance and zoom direction, added tooling/accessibility notes
