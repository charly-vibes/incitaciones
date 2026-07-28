---
name: next
description: "Rapid session snapshot to ~/.whisper/ — no full close ceremony. Trigger when the user says '/next', 'snap', 'quick save', 'stash session', or 'moving on'."
tools: Read, Write, Edit, Bash
---

# Next

Snapshot the current session to `~/.whisper/` and move on. Fast — no project file updates, no inbox triage, no ticket operations. Pure stash.

## Steps

1. Get timestamp: `date +%Y-%m-%d` and `date +%H:%M`.

2. Detect repo and branch:
   ```bash
   repo_url=$(git remote get-url origin 2>/dev/null | sed 's|https://||;s|git@||;s|\.git$||')
   branch=$(git rev-parse --abbrev-ref HEAD)
   branch_slug=$(echo "$branch" | sed 's|/|--|g')
   notes_path=~/.whisper/repos/"${repo_url}"/branches/"${branch_slug}"/notes.md
   ```

3. If `~/.whisper/` doesn't exist or the branch slot doesn't exist, run `/w check` first (which will offer to init). If the user declines, skip and warn.

4. Scan the last portion of the conversation and write a 2–5 bullet snapshot:
   - What was worked on (files, topics)
   - Key decisions or changes made
   - **Next:** the most logical continuation point

5. Append the snapshot to `notes.md`:
   ```
   ### YYYY-MM-DD HH:MM — snap
   - what was worked on
   - decisions made
   - **Next:** continuation point
   ```

6. No commit, no push, no ticket operations. Just write the file.

## Output

```
✓ Snapped to ~/.whisper/repos/<repo>/branches/<slug>/notes.md

Use `/renew` later to pick this back up.
```

## Rules

- Do NOT ask questions — summarize automatically from conversation context.
- Keep it brief — 2–5 bullets, not paragraphs.
- Do NOT commit or push anything.
- Do NOT update project files, inbox, or tickets.
- Do NOT run `/clear`.