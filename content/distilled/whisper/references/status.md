# Status

Show the state of the current workspace.

## Steps

1. Get repo URL and branch slug:
   ```bash
   repo_url=$(git remote get-url origin 2>/dev/null | sed 's|https://||;s|git@||;s|\.git$||')
   branch=$(git rev-parse --abbrev-ref HEAD)
   branch_slug=$(echo "$branch" | sed 's|/|--|g')
   context_path=~/.whisper/repos/"${repo_url}"/branches/"${branch_slug}"/context.md
   ```

2. If `context.md` doesn't exist, delegate to **check** mode and stop.

3. Read `context.md` and extract: repo, branch, path, beads-epic.

4. Show `env.md` info:
   ```bash
   date -r ~/.whisper/repos/"${repo_url}"/env.md "+%Y-%m-%d %H:%M" 2>/dev/null
   ```

5. Show the branch epic's tree if beads is available:
   ```bash
   bd children <beads-epic> --pretty 2>/dev/null
   ```

6. Show plan status: is `plan.md` a stub or does it have real content?

7. Show all active branch slots for this repo (most recently modified first):
   ```bash
   ls -t ~/.whisper/repos/"${repo_url}"/branches/ 2>/dev/null
   ```

### Output format

```
── Whisper: <repo> ──
Branch:    <branch>  (branches/<slug>/)
Plan:      [exists | stub]
Epic:      <id> — <n> issues (<open> open)   [or: none linked yet]

Active branch slots:
  <ls output>

Epic tree:
  <bd children --pretty output, or "none">
```