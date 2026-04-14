---
name: implement-plan
description: "Execute implementation plans phase by phase"
metadata:
  installed-from: "incitaciones"
---
# Implement Plan

Implement an approved plan using Red, Green, Refactor.

## Procedure

1. Read the plan completely and identify the first incomplete phase.
2. Read any related specs or documentation referenced by the plan.
3. For each phase:
   - Write failing tests first.
   - Implement the minimum code to pass.
   - Refactor while keeping tests green.
   - Run the success criteria checks.
   - Update the plan with progress.
4. Use `references/verification-template.md` when reporting phase completion.
5. Use `references/common-situations.md` when the plan and reality diverge.

## Rules

- Never skip the red phase.
- Complete one phase at a time.
- Do not blindly follow an outdated plan if the codebase contradicts it.
- Wait for user confirmation before proceeding to the next phase.
