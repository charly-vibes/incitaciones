---
name: issues
description: "Issue tracking: create trackable issues from an implementation plan, or review existing issues for completeness, dependencies, and executability. Trigger for breaking work into issues or checking issue quality."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.10.2"
---
# Issues Router

Route issue-tracking work to the right mode, then read that mode's instructions before acting. Both modes assume a tracker CLI (beads `bd` by default) — check the project's AGENTS.md for the tracker in use.

## Modes

| Task signal | Mode | Read |
|---|---|---|
| turn an implementation plan into trackable issues | create-issues | `references/create-issues/SKILL.md` |
| review existing issues for completeness, dependencies, executability | issue-review | `references/issue-review/SKILL.md` |

## Selection rules

- Plan approved and needs to become work items → **create-issues**.
- Issues exist and someone asks "are these ready/good/covered?" → **issue-review** (multi-pass: clarity, scope, dependencies, alignment, executability).
- Creating issues from a plan that has not been reviewed? Suggest a plan review first.

## Procedure

1. Identify the mode from the table above.
2. Read the referenced file (resolve paths against this skill's directory); follow its templates, pass structure, and output format.
