---
name: design-review
description: "Review problem statements and decision matrices"
metadata:
  installed-from: "incitaciones"
---
# Design Artifact Review

Review design artifacts for rigor, completeness, and adherence to Design in Practice principles.

## Setup

- If an artifact path is provided, read it completely.
- If no path is provided, ask which artifact to review or list available design documents.

## Procedure

1. Identify the artifact type:
   - Problem statement
   - Decision matrix
   - Scope document
   - Full design package
2. Run the appropriate review:
   - For problem statements, use `references/problem-statement.md`.
   - For decision matrices, use `references/decision-matrix.md`.
   - For scope documents, use `references/scope-document.md`.
   - For full design packages, use `references/combined-review.md`.
3. Generate the final output using `references/report-template.md`.

## Rules

- Reference exact evidence from the artifact.
- Use the artifact-specific output format from the reference file.
- Prefer the most critical issue over exhaustive nitpicks.
- If multiple artifacts are supplied, review each individually before synthesizing.
