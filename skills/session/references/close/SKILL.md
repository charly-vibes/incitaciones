**Tools:** Read, Write, Edit, Glob, Bash

# Close Session

End the current session: log what was done, update tasks, route durable knowledge to the whisper workspace (turu-routed — see step 8), commit and push, clear context.

Uses `$JOURNAL_PATH` for the daily log journal, and the whisper workspace (turu-routed: repo-local `.whisper/` by default, `~/.whisper/` only as the `--global` escape hatch) for accumulated operational knowledge. Agent shells run non-interactive and never source `.bashrc`, so the environment may be missing these exports — resolve both values per step 1 (env → shell config → convention → legacy fallback).

## Steps

1. Pull the journal repo:
   ```bash
   # Non-interactive shells never source .bashrc, so $JOURNAL_PATH etc. are
   # usually unset here. Source the config in a throwaway shell — bash itself
   # handles comments, quotes, and nested vars ($JORNAL) — then fall back.
   shellval() { bash -c 'source ~/.bashrc >/dev/null 2>&1; printf "%s\n" "${'"'$1'"'}"' 2>/dev/null; }
   JOURNAL="${JOURNAL_PATH:-$(shellval JOURNAL_PATH)}"
   [ -n "$JOURNAL" ] || JOURNAL="$(shellval JORNAL)"
   [ -n "$JOURNAL" ] || JOURNAL="$HOME/para/areas/jornal"   # JORNAL convention
   [ -d "$JOURNAL/.git" ] || JOURNAL="$HOME/para/areas/jornal"     # legacy clone; flag this fallback in the reply
   LOG_SUBDIR="${JOURNAL_LOG_SUBDIR:-$(shellval JOURNAL_LOG_SUBDIR)}"
   [ -n "$LOG_SUBDIR" ] || LOG_SUBDIR="areas/log"
   cd "$JOURNAL" && git pull
   ```

2. Get today's date and time (`date +%Y-%m-%d`, `date +%H:%M`).
   Derive the log path: `$JOURNAL/$LOG_SUBDIR/YYYY/YYYY-MM/YYYY-MM-DD.md`

3. If the log file does not exist, create it with the daily log template.

4. Review the full conversation history and write a concise session summary covering:
   - What was worked on (key topics, files, repos)
   - Decisions made
   - Tasks completed or created
   - Any unresolved items or next steps

5. Append the summary to the `## Log` section of today's daily log:
   ```
   ### Session:HH:MM (<context>)
   - bullet point summary entries
   - **Next:** what to pick up next time (if applicable)
   ```

6. Update project/area files if tasks were completed or created:
   - Mark completed tasks `[x]`
   - Add new tasks as `[ ]`
   - Add/update `[~]` waiting items
   - Update `## Notes` with decisions

7. If any tasks or follow-ups came up that aren't in a project/area, add them to `inbox.md`.

8. **Route durable knowledge to the whisper workspace.** Scan the session for anything worth keeping and route by scope (skip this step entirely if nothing durable was learned). Resolve destinations via turu — never hand-derive paths or keys; the default destination is the checkout's repo-local `.whisper/`, and `~/.whisper/repos/<key>/…` is the `--global` escape hatch only:
   - **Branch-specific finding** → `bd note <beads-epic>` or `turu append branch --text "…"` (fallback: `notes.md` in the branch slot)
   - **Repo-wide infra fact** → `turu append repo --text "…"` (fallback: repo-slot `env.md`)
   - **Universal agent behavior rule** → `bd remember` or `turu append global --text "…"` (fallback: `~/.whisper/rules.md`)
   - **Worktree setup fact** → `turu append worktree --text "…"` (fallback: worktree-slot `env.md`)
   - **No secrets anywhere:** never write tokens, keys, or PII
   - **Extend, don't duplicate:** append to existing notes rather than creating new ones
   - **turu absent:** read the repo's `AGENTS.md` turu/whisper routing block first; prefer a repo-local `.whisper/` slot. When falling back to the global store, derive the canonical key with **slashes, never colons**:
     ```bash
     repo_key=$(git remote get-url origin 2>/dev/null | sed -e 's|\.git$||' -e 's|^git@|ssh://|' -e 's|^ssh://\([^:]*\):|https://\1/|' -e 's|^https://||' -e 's|^http://||' -e 's|^ssh://||')
     ```
   - **Checklist:** the destination must match `turu resolve <scope>` output when turu is available — if it doesn't, stop and warn instead of writing.

9. Commit and push. Stage only the files this session touched, explicitly by name:
   ```bash
   cd "$JOURNAL" && git add <log-file> [<files>] && git commit -m "log: YYYY-MM-DD session notes" && git push
   ```

10. As the very last step, run `/clear` to reset the conversation context.

## Rules

- Do NOT ask the user any questions. Summarize automatically from conversation context.
- Keep the summary concise — bullet points, not paragraphs.
- If today's log already has content, append to it; never overwrite existing entries.
- Always pull before reading and push after committing.