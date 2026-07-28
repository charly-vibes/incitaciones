---
name: park
description: "Snapshot current work before switching context. Logs what was done and what's next without ending the day. Trigger when the user says '/park', 'park this', 'switching to', 'pause this', or 'context switch'."
tools: Read, Write, Edit, Bash
---

# Park

Snapshot the current session's work on a project/area before switching context. This is NOT end-of-day — just a context switch.

Uses `$JOURNAL_PATH` (defaults to `~/dev/status`) for the daily log, and `~/.whisper/` for accumulated operational knowledge.

## Steps

1. Get today's date and current time (`date +%Y-%m-%d`, `date +%H:%M`).
   ```bash
   JOURNAL="${JOURNAL_PATH:-$HOME/dev/status}"
   ```

2. Read today's log: `$JOURNAL/log/YYYY/YYYY-MM/YYYY-MM-DD.md`
   If it doesn't exist, create it with the daily log template.

3. Review the conversation history to determine:
   - What project/area was being worked on
   - What was accomplished in this session
   - What the logical next step is
   - Any new tasks, decisions, or blockers discovered

4. Append a session entry to today's log under `## Log`:
   ```
   ### Session:HH:MM (<project/area context>)
   - what was done
   - decisions made
   - **Next:** what to do when resuming
   ```

5. Update the relevant project/area file if needed:
   - Mark completed tasks `[x]`
   - Add new tasks discovered during the session
   - Add/update `[~]` waiting items with context
   - Update `## Notes` with any decisions

6. If there are uncommitted changes in the project's git worktree, note them in the log entry.

7. **Release any in-progress ticket claim if leaving mid-work.**
   Check whether a ticket was claimed for this session:
   ```bash
   BRANCH=$(git branch --show-current 2>/dev/null)
   bd list --status in_progress --label branch:$BRANCH 2>/dev/null
   ```
   For each in-progress ticket that is NOT complete:
   - **If meaningful work was committed:** keep the claim and append a progress note:
     ```bash
     bd note <id> "Session parked $(date +%H:%M). Done: <brief>. Safe to resume from: <last commit>."
     ```
   - **If nothing was committed:** release the claim so another agent can pick it up:
     ```bash
     bd update <id> --assignee "" --status open
     ```

8. **Record snapshot to `~/.whisper/`.** If `~/.whisper/` exists and a beads-epic is linked, append a note to the epic:
   ```bash
   repo_url=$(git remote get-url origin 2>/dev/null | sed 's|https://||;s|git@||;s|\.git$||')
   branch_slug=$(git rev-parse --abbrev-ref HEAD | sed 's|/|--|g')
   context_path=~/.whisper/repos/"${repo_url}"/branches/"${branch_slug}"/context.md
   beads_epic=$(grep '^beads-epic:' "$context_path" 2>/dev/null | sed 's/^beads-epic: *//')
   if [ -n "$beads_epic" ]; then
     bd note "$beads_epic" "Parked $(date +%H:%M). Done: <what was accomplished>. Next: <the logical continuation>."
   fi
   ```

9. Do NOT commit/push the journal repo yet — that happens at `/close`. Just write the files.

## Output format

```
---
**Parked: <project/area name>**

**Session summary**
- what was accomplished

**Next step** *(for when you /renew)*
- the logical continuation

**Updated**
- files modified in status repo (log, project file, etc.)

*Ready to switch context. Use `/renew <slug>` to pick up something else.*
```

## Rules

- Do NOT ask questions — summarize automatically from conversation context.
- Keep it brief — this is a quick snapshot, not a full report.
- Do NOT commit or push the journal repo.
- Do NOT run `/clear` — the user may continue working in this session.