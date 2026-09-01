# Check

Validate the workspace before starting work. Detects stale branch slots and worktree reuse. Called automatically by `renew` when `~/.whisper/` exists.

## Steps

1. Get repo URL and branch slug:
   ```bash
   repo_url=$(git remote get-url origin 2>/dev/null | sed 's|https://||;s|http://||;s|ssh://||;s|git@||;s|:|/|g;s|\.git$||')
   [ -z "$repo_url" ] && repo_url="local/$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")"
   branch=$(git rev-parse --abbrev-ref HEAD)
   branch_slug=$(echo "$branch" | sed 's|/|--|g')
   context_path=~/.whisper/repos/"${repo_url}"/branches/"${branch_slug}"/context.md
   ```

2. **If `~/.whisper/` doesn't exist:** offer full init:
   ```
   ⚠ ~/.whisper/ not found. Run `/w init` to create the workspace.
   ```

3. **If `context.md` exists:** output one confirmation line and return.
   ```
   ✓ Workspace active: ~/.whisper/repos/<repo>/branches/<slug>/
   ```

4. **If the branch directory doesn't exist:**
   ```
   ⚠ No workspace slot for branch: <branch>
     ~/.whisper/repos/<repo>/branches/<slug>/ does not exist yet.

   Activate new slot? [Y/n]
   ```
   - Y → run **init** for the current branch.
   - N → print "Staying without a slot. Run `/w init` when ready." and stop.