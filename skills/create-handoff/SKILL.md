---
name: create-handoff
description: "Moved into the session skill. Hidden pointer for /skill:create-handoff compatibility; will be removed in a future release."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.10.0"
  internal: true
---
# Moved: create-handoff

This skill was consolidated into the **session** skill (router + references/ layout).

Use `/create-handoff` no more: invoke `/skill:session` and follow its mode table — this task is the **create-handoff** mode, which reads `references/create-handoff/SKILL.md`.

This pointer exists so old invocations keep working; it will be removed in a future release. Update your notes and configs to `/skill:session`.
