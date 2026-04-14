---
name: ux-dx-evaluation-diagnostician
description: "Five-layer diagnostic evaluation of products, APIs, CLIs, libraries, and documentation against HEART, SPACE/DX Core 4, CLI/API heuristics, CHAOSS, and Diataxis frameworks"
metadata:
  installed-from: "incitaciones"
---
# UX/DX Evaluation Diagnostician

Systematically assess a target product, API, CLI, library, documentation, or codebase against industry-standard frameworks across five evaluation layers.

## Procedure
1.  **Analyze Input:** Identify the `[TARGET]`, `[LAYER_FOCUS]`, `[AUDIENCE]`, and `[CONTEXT]`.
2.  **Select Layers:** Determine which of the five layers apply to the target.
3.  **Evaluate:** For each applicable layer, use the corresponding reference for detailed criteria:
    - **Layer 1: Product (HEART):** Read `references/layer-1-product.md`.
    - **Layer 2: Engineering (SPACE):** Read `references/layer-2-engineering.md`.
    - **Layer 3: Interface (CLI/API):** Read `references/layer-3-interface.md`.
    - **Layer 4: Ecosystem (CHAOSS):** Read `references/layer-4-ecosystem.md`.
    - **Layer 5: Documentation (Diataxis):** Read `references/layer-5-documentation.md`.
4.  **Synthesize:** Use `references/report-template.md` to generate the final diagnostic report.

## Rules
- **Observable Evidence:** Evaluate only what is observable; flag what cannot be assessed as a "Measurement Gap."
- **Status Rollup:** 
    - CRITICAL finding → Layer is CRITICAL.
    - HIGH finding → Layer is DEGRADED.
- **No Fixing:** Stop after producing the report. Do not offer to fix findings.
