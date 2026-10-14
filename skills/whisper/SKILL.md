---
name: whisper
description: "Deterministic knowledge workspace: session loop (recall all / append), scope routing, distill, bundle. Delegates to the turu CLI when installed; manual fallbacks otherwise."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.14.0"
  internal: true
---
# Whisper — knowledge workspace (pointer)

The canonical, versioned procedure lives in the **turu skill pack** —
installed with `turu skill install` and shipped with the `turu` CLI
([charly-vibes/whisper](https://github.com/charly-vibes/whisper),
`cargo install whisper-vibes`).

## Routing rule

- **If `whisper.md` sits next to this file** (the installed pack), read it and follow it as your single source of procedure. It owns everything: the session loop (`turu recall all`
at start, `turu append <scope> "..."` at capture), scope routing
  (global → group → repo → branch → worktree), the command table, and all
  modes. This pointer defers entirely and adds nothing — never reconcile
  the two by hand.
- **If the pack is absent**, `turu` is not installed: use the manual
  fallbacks in `references/` (source of truth for the shell-snippet
  procedures) and suggest `cargo install whisper-vibes`.

## Invariants (with or without the binary)

- **No secrets anywhere.** Never write tokens, keys, passwords, or PII into
  the workspace.
- **Extend, don't duplicate.** Append to or correct an existing note rather
  than creating a new one that says the same thing.
- **One repo, one key.** The canonical key is a pure function of the remote
  URL; never invent a variant.
- **Search first.** Before creating a new entry, check if one exists.