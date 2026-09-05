---
name: whisper
description: "Deterministic knowledge workspace management: init, check, status, link plan, decommission, and knowledge routing. Delegates the mechanical steps to the turu CLI (whisper-vibes) when installed; manual fallbacks otherwise. Trigger when the user says '/whisper', '/w', 'init workspace', 'check workspace', 'workspace status', 'link plan', or 'decommission'."
tools: Read, Write, Edit, Bash
---

# Whisper — Deterministic Operational Knowledge

> **This skill is a thin pointer.** The canonical, versioned copy ships with
> the `turu` CLI ([charly-vibes/whisper](https://github.com/charly-vibes/whisper),
> `cargo install whisper-vibes`) — install it with `turu skill install`.
> This file stays so agents without the binary have fallbacks.

The `turu` CLI owns every mechanical step: canonical repo keys, branch slugs,
worktree slots, and scope routing. Same inputs, same outputs — no more
hand-rolled shell pipelines.

## Decision procedure

1. **Is `turu` available?** Run `turu key --json`.
2. **If yes** — everything mechanical is a turu command:

| Intent | Command |
|---|---|
| Derive repo key / branch slug / worktree slot | `turu key --json` |
| Find the write destination for a scope | `turu resolve <scope> --json` |
| Record knowledge (extend, don't duplicate) | `turu append <scope> --text "..."` |
| Create the workspace layout | `turu init --json` |
| Inspect paths and existence | `turu status --json` |
| Validate / detect legacy keys | `turu check --json` · `turu doctor --json` |
| Refresh the AGENTS.md routing block | `turu sync --json` |

   Scopes: `global` (rules.md), `repo` (env.md), `branch` (notes.md),
   `worktree` (env.md), `group` (shared workspace for a set of repos).
   If a `<!-- TURU:START -->` block exists in `AGENTS.md`, read the routing
   map from there instead of re-deriving paths.

3. **If no** — use the manual fallbacks in `references/` (they remain the
   source of truth for the shell-snippet procedures) and suggest
   `cargo install whisper-vibes`.

## Invariants (with or without the binary)

- **No secrets anywhere.** Never write tokens, keys, passwords, or PII into
  the workspace.
- **Extend, don't duplicate.** Append to or correct an existing note rather
  than creating a new one that says the same thing.
- **One repo, one key.** The canonical key is a pure function of the remote
  URL; never invent a variant.
- **Search first.** Before creating a new entry, check if one exists.

## Modes

`/w init` → `turu init` · `/w` or `/w status` → `turu status` ·
`/w check` → `turu check` · `/w link` → `subs/link-manual` (no CLI verb yet)
· `/w decommission` → `subs/decommission-manual` · `/w consolidate` →
`subs/consolidate-manual` (detection ships via `turu doctor`).

Manual procedures for each mode: `references/init.md`, `references/check.md`,
`references/status.md`, `references/link.md`, `references/decommission.md`,
`references/consolidate.md`.
