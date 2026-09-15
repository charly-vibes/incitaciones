---
name: next
description: "Moved into the session skill. Hidden pointer for /skill:next compatibility; will be removed in a future release."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.9.0"
  internal: true
---
# Moved: next

This skill was consolidated into the **session** skill (router + references/ layout).

Use `/next` no more: invoke `/skill:session` and follow its mode table — this task is the **next** mode, which reads `references/next/SKILL.md`.

This pointer exists so old invocations keep working; it will be removed in a future release. Update your notes and configs to `/skill:session`.
