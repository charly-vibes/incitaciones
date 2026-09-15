---
name: close
description: "Moved into the session skill. Hidden pointer for /skill:close compatibility; will be removed in a future release."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.10.0"
  internal: true
---
# Moved: close

This skill was consolidated into the **session** skill (router + references/ layout).

Use `/close` no more: invoke `/skill:session` and follow its mode table — this task is the **close** mode, which reads `references/close/SKILL.md`.

This pointer exists so old invocations keep working; it will be removed in a future release. Update your notes and configs to `/skill:session`.
