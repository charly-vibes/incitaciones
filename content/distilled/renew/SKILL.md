---
name: renew
description: "Resume work on a specific project or area. Loads focused context for continuing where you left off. When no name is given, infers the project/area from the current repo and git branch. Trigger when the user says '/renew', '/renew <name>', 'pick up <project>', 'continue <project>', or 'back to <project>'."
tools: Read, Write, Edit, Glob, Bash, Grep
---

# Renew

Load focused context for a specific project or area to continue work.

Uses `$JOURNAL_PATH` (defaults to `~/dev/status`) for the daily log, and `~/.whisper/` for accumulated operational knowledge.

## Steps

1. Pull the journal repo:
   ```bash
   JOURNAL="${JOURNAL_PATH:-$HOME/dev/status}"
   cd "$JOURNAL" && git pull
   ```

2. Identify the target.

   **If a `<slug>` is provided:** The user says `/renew <slug>`.

   **If no slug is provided:** Infer from the current workspace context:
   - Get the repo name: `basename $(git rev-parse --show-toplevel 2>/dev/null)`
   - Get the branch name: `git branch --show-current 2>/dev/null`
   - Extract a candidate slug from the branch (strip prefix like `ak/`, `feature/`, etc.)
   - Use both the repo name and branch-derived slug as candidates

   **Match candidates** against:
   - `$JOURNAL/projects/*.md` — check filenames and grep for repo/branch references
   - `$JOURNAL/areas/*.md` — same
   - Try exact match, then partial/substring match
   - If multiple matches found, list them and ask the user to pick
   - If no match found, list available projects/areas and ask

3. Read the matched project or area file.

4. Read today's log (`$JOURNAL/log/YYYY/YYYY-MM/YYYY-MM-DD.md`).
   If it doesn't exist, create it with the daily log template.
   Scan for any earlier session entries related to this project/area today.

5. Search recent logs for context (last 3 days):
   ```bash
   grep -rl "<slug>" "$JOURNAL"/log/YYYY/YYYY-MM/ 2>/dev/null | tail -3
   ```
   Read any matches to understand recent session history.

6. Search inbox for related items:
   ```bash
   grep -i "<slug>" "$JOURNAL"/inbox.md
   ```

7. **Check `~/.whisper/` for accumulated knowledge.**
   If `~/.whisper/` exists, load context:
   ```bash
   repo_url=$(git remote get-url origin 2>/dev/null | sed 's|https://||;s|git@||;s|\.git$||')
   branch_slug=$(git rev-parse --abbrev-ref HEAD | sed 's|/|--|g')
   whisper_dir=~/.whisper/repos/"${repo_url}"/branches/"${branch_slug}"
   ```
   - Read `context.md` if it exists (extract beads-epic, status)
   - Read `plan.md` if it has real content
   - Read `notes.md` if it has real content
   - Read `env.md` at repo level for infra facts
   - If beads is available, fetch open issues:
     ```bash
     bd list --label branch:<branch> 2>/dev/null
     bd list --status in_progress --label branch:<branch> 2>/dev/null
     ```
     Surface any `in_progress` tickets prominently. The **Suggested next step** must only reference tickets NOT currently `in_progress`.

8. If the project/area has a worktree or repo path noted in its file, gather git context:
   - `cd <worktree-path> && git branch --show-current`
   - `git log --oneline -5`
   - `git status --short`
   - `git log --oneline origin/main..HEAD`

## Output format

```
---
**Resuming: Project/Area Name**

**Status**: brief one-line summary of where things stand

**Last session** *(from most recent log entry)*
- what was done last time

**Open tasks**
- [ ] task list from the project/area file

**Waiting**
- [~] any blocked items and who/what they're waiting on

**Related inbox items** *(if any)*
- items that mention this project

**Whisper context** *(if ~/.whisper/ exists)*
- Plan: summary of current plan
- Notes: key findings
- Beads issues: <n> open, <n> in_progress

**⚠ Active in flight** *(omit if none)*
- ◐ `<id>` — <title> [started: <date>]
- *(If your intended ticket is listed here, see **Claiming work** below.)*

**Workspace**
- Worktree: path, branch, status
- Commits ahead of main, uncommitted changes, etc.

**Suggested next step**
- what makes sense to do next — only suggest tickets NOT currently in_progress
```

Then ask: *"Ready to continue, or want to adjust the plan?"*

---

## Claiming work

Before writing any code, claim the ticket atomically and check for file conflicts.

### Steps

1. **Claim atomically:**
   ```bash
   bd update <ticket-id> --claim
   ```

2. **Check for file-level conflicts** with other in-progress tickets:
   ```bash
   bd list --status in_progress --label branch:<branch> --json 2>/dev/null \
     | python3 -c "
   import json, sys
   issues = json.loads(sys.stdin.read() or '[]')
   for i in issues:
       files = (i.get('metadata') or {}).get('files', [])
       for f in files:
           print(i['id'] + '\t' + f)
   "
   ```
   Cross-reference against the claimed ticket's own `metadata.files`.
   If overlap found, surface a warning:
   ```
   ⚠ File conflict detected:
     services/api.py is also claimed by ticket-abc (in_progress)

   Options:
     A) Gate this ticket until the blocker closes
     B) Coordinate merge order
     C) Proceed — accept the conflict (reconcile at merge time)
   ```

3. **If backing off** (chose option A):
   ```bash
   bd update <ticket-id> --assignee "" --status open
   bd gate create <ticket-id> --type bead --await-id <blocking-id>
   ```

### Metadata coverage warning

File conflict detection only works when both tickets have `metadata.files` populated (set by `create-issues` or `/w link` at ticket creation time). Tickets created before this convention was adopted have no metadata. For those tickets, **"no conflict found" means unknown, not safe**.