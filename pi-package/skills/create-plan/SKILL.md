---
name: create-plan
description: "Design phased implementation plans with TDD approach"
metadata:
  installed-from: "incitaciones"
---
# Create Implementation Plan

Create a detailed implementation plan for the requested feature.

## Procedure

1. Read any provided spec or task description fully.
2. Research the codebase and existing patterns.
3. If multiple approaches are viable, present options and get alignment before finalizing.
4. Write the plan using `references/plan-template.md`.
5. If needed, use `references/scenarios.md` for example interaction patterns.

## Rules

- Be specific: include actual file paths and concrete changes.
- Plan tests before implementation for each phase.
- Keep phases independently verifiable.
- Resolve open questions with normal user clarification, not tool-specific assumptions.
- Prefer realistic plans over exhaustive but unusable plans.
