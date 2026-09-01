# Claude Code - Start Here

## Installing Skills

### Via npm / npx (recommended)

```bash
# Install as a pi package (native skills, best UX):
pi install npm:incitaciones

# Or install across all tools (pi, Claude Code, Amp, Gemini CLI, etc.):
npx incitaciones install

# Install only the essentials bundle:
npx incitaciones install --bundle essentials
```

### From git (install.sh)

```bash
./install.sh --global              # Install all skills globally
./install.sh --global --bundle essentials  # Just the core set
./install.sh --help                # All options
```

## Essential Reading

**Repository structure and workflow:** [AGENTS.md](AGENTS.md)

## Commit Workflow

**Never commit without following the deliberate commit workflow.**

When asked to commit:
1. Read [content/prompt-workflow-deliberate-commits.md](content/prompt-workflow-deliberate-commits.md)
2. Follow its process exactly
3. Wait for user approval before proceeding


<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:7510c1e2 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->
