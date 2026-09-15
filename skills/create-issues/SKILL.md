---
name: create-issues
description: "Moved into the issues skill. Hidden pointer for /skill:create-issues compatibility; will be removed in a future release."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.10.0"
  internal: true
---
# Moved: create-issues

This skill was consolidated into the **issues** skill (router + references/ layout).

Use `/create-issues` no more: invoke `/skill:issues` and follow its mode table — this task is the **create-issues** mode, which reads `references/create-issues/SKILL.md`.

This pointer exists so old invocations keep working; it will be removed in a future release. Update your notes and configs to `/skill:issues`.
