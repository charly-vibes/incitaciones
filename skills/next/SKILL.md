---
name: next
description: "Compiled alias of the quick stash mode of the session skill. Hidden from model invocation; invocable via /skill:next; serves the legacy site URL with full compiled content."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.14.0"
  internal: true
---
> **Moved:** this entry is now the **next** mode of the **session** skill.
> The full method is compiled below from `content/distilled/session/references/next/SKILL.md`.
> Invoke via `/skill:next`, invoke `/skill:session` for the mode table,
> or use this URL directly in a chat interface.

#### Core Instructions (content/distilled/session/references/next/SKILL.md)

**Tools:** Read, Write, Edit, Bash

# Next

Snapshot the current session to the whisper workspace and move on. Fast — no project file updates, no inbox triage, no ticket operations. Pure stash.

**The default destination is NOT `~/.whisper/`.** Turu-managed repos route
repo/branch notes to the checkout's own repo-local `.whisper/` (gitignored,
never pushed); the machine-global `~/.whisper/repos/<key>/…` store is the
explicit `--global` escape hatch only. Writing a private repo's snap to the
global store is a leak — the global workspace syncs to journal.git. Resolve
routing before any write (block below).

## Steps

1. Get timestamp: `date +%Y-%m-%d` and `date +%H:%M`.

2. **Resolve the whisper destination** (never hand-derive paths or keys):
   - **turu available** (`command -v turu`): get the exact path, or append
     directly:
     ```bash
     turu resolve branch --json        # exact path + exists flag
     turu append branch --text "..."   # alternative: write via the CLI
     ```
     Default scopes write to the checkout's repo-local `.whisper/`. Use
     `turu resolve <scope> --global` only when the repo's `AGENTS.md` turu
     block declares global routing. The repo key comes from
     `turu key --json` — slash-separated, never colon.
   - **turu absent:** consult the repo's `AGENTS.md` turu/whisper routing
     block first. If the repo has a repo-local `.whisper/` workspace, write
     there: `.whisper/branches/<branch-slug>/notes.md`. Only when neither
     exists, fall back to the global store, deriving the canonical key with
     **slashes, never colons**:
     ```bash
     repo_key=$(git remote get-url origin 2>/dev/null | sed -e 's|\.git$||' -e 's|^git@|ssh://|' -e 's|^ssh://\([^:]*\):|https://\1/|' -e 's|^https://||' -e 's|^http://||' -e 's|^ssh://||')
     branch_slug=$(git rev-parse --abbrev-ref HEAD | sed 's|/|--|g')
     notes_path="${WHISPER_ROOT:-~/.whisper}/repos/${repo_key}/branches/${branch_slug}/notes.md"
     ```

3. If the resolved destination's parent doesn't exist, run `/w check` first
   (which will offer to init). If the user declines, skip and warn.

4. Scan the last portion of the conversation and write a 2–5 bullet snapshot:
   - What was worked on (files, topics)
   - Key decisions or changes made
   - **Next:** the most logical continuation point

5. Append the snapshot to `notes.md` at the resolved path (or via
   `turu append branch`):
   ```
   ### YYYY-MM-DD HH:MM — snap
   - what was worked on
   - decisions made
   - **Next:** continuation point
   ```

6. No commit, no push, no ticket operations. Just write the file.

## Checklist

- Destination matches `turu resolve branch` output when turu is available —
  if it doesn't, stop and warn instead of writing (a mistyped key, e.g. a
  colon instead of a slash, writes into the wrong slot).
- Never wrote a private repo's snap into the global `~/.whisper/` store
  without the routing rule saying so.

## Output

```
✓ Snapped to <resolved notes.md path>

Use `/renew` later to pick this back up.
```

## Rules

- Do NOT ask questions — summarize automatically from conversation context.
- Keep it brief — 2–5 bullets, not paragraphs.
- Do NOT commit or push anything.
- Do NOT update project files, inbox, or tickets.
- Do NOT run `/clear`.
