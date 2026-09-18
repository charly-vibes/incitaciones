---
name: planning
description: "Implementation planning: create a phased TDD-oriented plan, implement it phase by phase, review a plan for gaps and risks, or iterate it from feedback. Trigger for planning or executing multi-phase work."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.10.2"
---
# Planning Router

Route planning work to the right mode, then read that mode's instructions before acting.

## Modes

| Task signal | Mode | Read |
|---|---|---|
| design a phased implementation plan (TDD-oriented) from a goal | create-plan | `references/create-plan/SKILL.md` |
| execute an existing plan phase by phase | implement-plan | `references/implement-plan/SKILL.md` |
| review an implementation plan for gaps, risks, sequencing | plan-review | `references/plan-review/SKILL.md` |
| refine an existing plan from feedback or new constraints | iterate-plan | `references/iterate-plan/SKILL.md` |

## Selection rules

- No plan exists yet → **create-plan**. Plan exists and work is approved → **implement-plan**.
- Plan exists but is under critique → **plan-review**; under revision → **iterate-plan**. Review first when feedback is vague, iterate when it is specific.
- These modes chain: create-plan → plan-review → iterate-plan → implement-plan.

## Procedure

1. Identify the mode from the table above.
2. Read the referenced file (resolve paths against this skill's directory); follow its templates and verification steps.
