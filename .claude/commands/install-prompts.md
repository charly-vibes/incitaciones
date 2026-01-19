# Install Prompts from Incitaciones

Install prompts from this repository as reusable commands in your AI coding tool.

## Configuration Questions

Ask me:
1. **Which tool?** (Claude Code, Cursor, Amp, Gemini CLI, Windsurf, Aider, Other)
2. **Scope?** (Global for all projects, or Local for this repo only)
3. **Action?** (Fresh install, Update existing, or List available first)
4. **Which prompts?** (show options below)

## Available Prompts

### Workflows
| Command | Description |
|---------|-------------|
| `commit` | Deliberate commit workflow with review |
| `create-plan` | Create implementation plans |
| `implement-plan` | Execute plans with verification |
| `iterate-plan` | Refine plans based on results |
| `rule-of-5` | Multi-agent code review |
| `design-practice` | 6-phase design framework |
| `create-handoff` | Create handoff documentation |
| `resume-handoff` | Resume from handoff doc |

### Tasks
| Command | Description |
|---------|-------------|
| `describe-pr` | Generate PR descriptions |
| `debug` | Systematic debugging |
| `code-review` | Iterative code review |
| `research-codebase` | Document existing code |

### Bundles
- `essentials` → commit, debug, describe-pr, code-review
- `planning` → create-plan, implement-plan, iterate-plan
- `reviews` → All review prompts
- `all` → Everything

## Installation Paths

| Tool | Global | Local |
|------|--------|-------|
| Claude Code | `~/.claude/commands/` | `.claude/commands/` |
| Cursor | workspace settings | `.cursor/prompts/` |
| Amp | `~/.config/amp/commands/` | `.amp/commands/` |
| Gemini CLI | `~/.config/gemini/commands/` | `.gemini/commands/` |

## Extraction Process

**CRITICAL: Each source file has documentation + the actual prompt. Extract ONLY the prompt.**

### Source file structure:
```
---
title: ...
type: prompt
---

# Title
## When to Use        ← DO NOT extract (documentation)
## The Prompt         ← START HERE
```markdown           ← Extract INSIDE this block
# Actual Prompt
...
```                    ← STOP here
## Example            ← DO NOT extract
```

### For each selected prompt:
1. Read source: `content/prompt-{workflow|task}-{name}.md`
2. Find `## The Prompt` section
3. Extract content INSIDE the ` ```markdown ` code block only
4. Write to target path as `{command-name}.md`

## Contextualization (Optional)

Ask: "Should I add repository-specific context?"

If yes: Read README, CONTRIBUTING, detect tech stack, add context header.

---

Source: `content/meta-prompt-install-commands.md` has full documentation.
