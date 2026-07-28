---
name: close
description: "End-of-session wrap-up. Summarizes what was done, logs it to the daily journal, commits, pushes, and clears context. Trigger when the user says '/close', 'close session', or 'wrap up session'."
tools: Read, Write, Edit, Glob, Bash
---

# Close Session

End the current session: log what was done, update tasks, route durable knowledge to `~/.whisper/`, commit and push, clear context.

Uses `$JOURNAL_PATH` (defaults to `~/dev/status`) for the daily log journal, and `~/.whisper/` for accumulated operational knowledge. The log subdirectory defaults to `log/`; set `$JOURNAL_LOG_SUBDIR` to override (e.g. `areas/log` for the JORNAL layout).

## Steps

1. Pull the journal repo:
   ```bash
   JOURNAL="${JOURNAL_PATH:-$HOME/dev/status}"
   LOG_SUBDIR="${JOURNAL_LOG_SUBDIR:-log}"
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

8. **Route durable knowledge to `~/.whisper/`.** Scan the session for anything worth keeping and route by scope (skip this step entirely if nothing durable was learned):
   - **Branch-specific finding** → `bd note <beads-epic>` or `~/.whisper/repos/<repo>/branches/<slug>/notes.md`
   - **Repo-wide infra fact** → `~/.whisper/repos/<repo>/env.md`
   - **Universal agent behavior rule** → `bd remember` or `~/.whisper/rules.md`
   - **Worktree setup fact** → `~/.whisper/repos/<repo>/worktrees/<name>/env.md`
   - **No secrets anywhere:** never write tokens, keys, or PII
   - **Extend, don't duplicate:** append to existing notes rather than creating new ones

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