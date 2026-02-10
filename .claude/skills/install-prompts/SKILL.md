---
name: install-prompts
description: Install prompts from Incitaciones as Claude Code skills
disable-model-invocation: true
---

# Install Prompts from Incitaciones

## Use the install script

Always use `./install.sh` from the repository root. Do NOT manually extract prompts or write custom scripts.

```bash
./install.sh --global              # Install all skills globally
./install.sh --global --bundle essentials  # Core prompts only
./install.sh --local               # Install to current project
./install.sh --list                # Show available prompts and bundles
./install.sh --uninstall           # Remove installed prompts
./install.sh --help                # All options
```

### Bundles
- `essentials` — commit, debug, describe-pr, code-review, research-codebase, create-handoff, resume-handoff
- `planning` — create-plan, implement-plan, iterate-plan, create-issues, design-practice, pre-mortem, tdd, plan-review
- `reviews` — code-review, rule-of-5, optionality-review, multi-agent-review, plan-review, design-review, research-review, issue-review, rule-of-5-universal
- `all` — Everything (default)

## Manual process (fallback only)

If `install.sh` is unavailable, see `content/meta-prompt-install-commands.md` for the full manual extraction process. The key steps: read distilled prompts from `content/distilled/{name}.md`, add YAML frontmatter, write to `~/.claude/skills/{name}/SKILL.md`.
