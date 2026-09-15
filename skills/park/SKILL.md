---
name: park
description: "Moved into the session skill. Hidden pointer for /skill:park compatibility; will be removed in a future release."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.10.0"
  internal: true
---
# Moved: park

This skill was consolidated into the **session** skill (router + references/ layout).

Use `/park` no more: invoke `/skill:session` and follow its mode table — this task is the **park** mode, which reads `references/park/SKILL.md`.

This pointer exists so old invocations keep working; it will be removed in a future release. Update your notes and configs to `/skill:session`.
