# Prompt-Meta Router

Route prompt-engineering work on this repository's own content to the right mode, then read that mode's instructions before acting.

## Modes

| Task signal | Mode | Read |
|---|---|---|
| a successful interaction should become a reusable prompt | extract-prompt | `references/extract-prompt.md` |
| an existing prompt is too long; produce a lean token-efficient distilled version | distill-prompt | `references/distill-prompt/SKILL.md` |
| check a distilled prompt preserved the original's essential instructions | verify-prompt | `references/verify-prompt/SKILL.md` |

## Selection rules

- Nothing exists yet → **extract-prompt**. Source exists, needs shrinking → **distill-prompt**. Distilled exists → **verify-prompt** against the source.
- The pipeline is extract → distill → verify; never skip verify when the distilled form will be installed.

## Procedure

1. Identify the mode from the table above.
2. Read the referenced file (resolve paths against this skill's directory); follow its criteria and templates.
