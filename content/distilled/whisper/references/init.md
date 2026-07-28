# Init

Create `~/.whisper/` and the current workspace slot.

## Steps

1. Get context:
   ```bash
   pwd
   git rev-parse --abbrev-ref HEAD
   basename $(git rev-parse --show-toplevel 2>/dev/null)   # repo name
   git rev-parse --git-common-dir 2>/dev/null              # confirms worktree vs main
   date +%Y-%m-%d
   ```

2. Create `~/.whisper/` if it doesn't exist:
   ```bash
   mkdir -p ~/.whisper/repos
   ```

3. Compute the repo path and branch slug:
   ```bash
   repo_url=$(git remote get-url origin 2>/dev/null | sed 's|https://||;s|git@||;s|\.git$||')
   branch=$(git rev-parse --abbrev-ref HEAD)
   branch_slug=$(echo "$branch" | sed 's|/|--|g')
   ```

4. Create the repo & branch directory:
   ```bash
   mkdir -p ~/.whisper/repos/"${repo_url}"/branches/"${branch_slug}"
   wk_dir=$(basename "$(git rev-parse --git-common-dir 2>/dev/null || echo '.git')" | sed 's|\.git$||')
   [ -n "$wk_dir" ] && mkdir -p ~/.whisper/repos/"${repo_url}"/worktrees/"${wk_dir}"
   ```

5. Create `~/.whisper/rules.md` if it doesn't exist:
   ```markdown
   # Global Agent Rules

   > Standing instructions for the agent, independent of any repo or branch.
   > Append here for rules that apply everywhere.
   ```

6. Create the repo `env.md` if it doesn't exist:
   ```markdown
   # Environment — <repo-name>

   > Repo-wide setup knowledge. True regardless of which branch or worktree.
   > Deploy commands, gateway limits, auth quirks that apply everywhere.
   > Worktree-specific setup (ports, venvs, local creds) goes in worktrees/<name>/env.md
   ```

7. Create the worktree `env.md` if it doesn't exist:
   ```markdown
   # Worktree — <worktree-name>

   > Worktree-specific setup. Credentials, ports, venv/docker specifics for THIS checkout only.
   ```

8. Create `context.md`:
   ```markdown
   # Workspace Context — <full-branch-name>

   repo: <repo-url>
   branch: <full-branch-name>
   worktree: <worktree-dir-name>
   path: <absolute-path>
   created: <YYYY-MM-DD>
   beads-epic:
   ```

9. Create `plan.md` stub:
   ```markdown
   # Plan — <full-branch-name>

   > No plan yet. Write a plan here, then run `/w link` to create beads issues.
   ```

10. Create `notes.md` stub:
    ```markdown
    # Notes — <full-branch-name>
    ```

11. If beads is available, find or create the branch epic:
    ```bash
    bd search "<branch>" --status all 2>/dev/null
    ```
    - If an epic already matches, reuse its ID and update `beads-epic:` in `context.md`.
    - If the work is substantial enough, create one: `bd create "<branch>" --type epic --label "branch:<branch>" --silent`
    - For a single-ticket fix, skip the epic and let the ticket ID stand in for `beads-epic:`.

12. Confirm:
    ```
    ✓ ~/.whisper/ initialized

    Repo:  <repo-url>
    Branch: <branch> → branches/<slug>/
    Epic:  <id | none — will be created by /w link>
    rules.md:     [created | exists]
    env.md:       [created | exists]
    worktree/env.md: [created | exists]

    Run `/w link` after writing a plan.
    ```