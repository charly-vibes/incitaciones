# Consolidate

Merge duplicate `~/.whisper/repos/` directories for the same repo into the single canonical key. One repo, one key.

## Why

Older sessions keyed repos inconsistently — bare repo name (`genesis/`), owner dir (`charly-vibes/`), ssh-alias host with a colon (`cv:charly-vibes/`), full URL in the wrong shape. The same repo's knowledge ends up scattered across several trees, so `check` and `status` miss notes that exist. Consolidation restores the invariant; the canonical key derivation is defined in SKILL.md.

## Steps

1. **Inventory candidates** — non-canonical top-level entries. Canonical = at least 2 slashes and no colon in the first segment; also flag alias-host dirs (`<alias>:<owner>`):

   ```bash
   for d in ~/.whisper/repos/*/; do echo "${d#$HOME/.whisper/repos/}"; done
   ```
   A key is a candidate if it has 0 or 1 slashes, or contains `:`.

2. **Derive the canonical target per candidate** — check the actual repo's remote:

   ```bash
   cd <repo checkout> && git remote get-url origin | sed 's|https://||;s|http://||;s|ssh://||;s|git@||;s|:|/|g;s|\.git$||'
   ```
   If no checkout is reachable for a candidate, leave it in place and report it — never guess the mapping from the name alone.

3. **Produce a migration table and WAIT for approval** — one row per candidate: old key → canonical key, files found, merge conflicts detected. The user must explicitly approve before anything moves. If running non-interactively, output the plan and stop.

4. **Merge per file on approval:**
   - `env.md` — append the candidate's content under a `## Migrated from <old-key>` heading; merge only verbatim-identical lines.
   - `branches/<slug>/*` — if the canonical tree has the same slug, append notes with a provenance heading; otherwise `mv` the whole branch slot into `branches/`.
   - `worktrees/<name>/*` — same rule as branch slots.
   - Never overwrite an existing file silently. Never delete a file.

5. **Clean up** — remove candidate directories only if they are now empty (`rmdir -p --ignore-fail-on-non-empty`). Anything left behind is reported, not deleted.

6. **Verify** — re-run the candidate scan (step 1): nothing non-canonical remains, or every remaining entry is accounted for with a reason. Run the `check` flow for the current repo and confirm it resolves to the canonical tree.

## Rules

- Provenance headings are mandatory — the user must be able to trace every merged block back to its original location.
- `git mv` nothing: `~/.whisper/` is not a git repository. Plain `mv`/append only.
- If two candidates map to the same canonical key (e.g. `charly-vibes/genesis` and `genesis/`), consolidate them sequentially and re-scan between rounds.
