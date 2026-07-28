# Decommission

Safely wind down a worktree or branch: defer open work under the branch epic, record a final note, then print the removal command.

## Steps

1. Run **check** first. Confirm slot exists before decommissioning.

2. Get repo URL and branch slug:
   ```bash
   repo_url=$(git remote get-url origin 2>/dev/null | sed 's|https://||;s|git@||;s|\.git$||')
   branch=$(git rev-parse --abbrev-ref HEAD)
   branch_slug=$(echo "$branch" | sed 's|/|--|g')
   branch_dir=~/.whisper/repos/"${repo_url}"/branches/"${branch_slug}"
   context_path="$branch_dir/context.md"
   ```

3. Read `beads-epic:` from `context.md`.

4. If beads is available, get all open work under that epic:
   ```bash
   bd children <epic-id> --json 2>/dev/null
   ```

5. If any open children found, defer them:
   ```bash
   bd defer <id>
   ```

6. Defer the epic itself:
   ```bash
   bd defer <epic-id>
   ```

7. Record the decommission as a note on the epic:
   ```bash
   bd note <epic-id> "Decommissioned: branch <branch> on <date>. State: <summary>. Resume via: /w init on branch <branch> — bd search '<branch>' will find this epic."
   ```

8. Print the removal command — do NOT run it:
   ```
   Ready to remove worktree. Run:
     git worktree remove <path>

   Deferred epic <epic-id> and <n> children. To find them later:
     bd list --status deferred --label branch:<branch>
   ```

## Rules

- Never run `git worktree remove` automatically — always print the command.
- Never close beads issues during decommission — only defer. Closing is intentional.
- Branch slots in `~/.whisper/` are not automatically removed when a branch is merged. The slot serves as an archive; the epic (found via `bd search`) can be reused if the same branch name comes back.