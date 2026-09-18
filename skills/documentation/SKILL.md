---
name: documentation
description: "Documentation suites: audit or plan docs, write with Diátaxis/Info Mapping/EPPO, review for scannability and AI-readiness. Trigger for doc planning, writing, or review. Broken links are doc-link-verifier, not this."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.10.2"
---
# Documentation Router

Route documentation work to the right mode, then read that mode's instructions before acting.

## Modes

| Task signal | Mode | Read |
|---|---|---|
| audit existing docs or plan a new documentation suite | research-documentation | `references/research-documentation/SKILL.md` |
| write documentation using Diátaxis, Info Mapping, EPPO principles | implement-documentation | `references/implement-documentation/SKILL.md` |
| review docs for cognitive scannability and AI-readiness | review-documentation | `references/review-documentation/SKILL.md` |

## Selection rules

- No docs or restructuring from scratch → **research-documentation** first; its report feeds implementation.
- Writing or rewriting content → **implement-documentation**. Judging existing content quality → **review-documentation**.
- Broken links or link-text/target mismatches are the complaint → use the `doc-link-verifier` skill instead; this router is about architecture and content quality.

## Procedure

1. Identify the mode from the table above.
2. Read the referenced file (resolve paths against this skill's directory); follow its checklists, templates, and report formats.
