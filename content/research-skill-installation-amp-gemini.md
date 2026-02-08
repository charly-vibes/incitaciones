---
title: Skill Installation Research for Sourcegraph Amp and Gemini CLI
type: research
subtype: integration
tags: [installation, amp, gemini-cli, skills, tool-integration, cross-tool]
tools: [amp, gemini-cli]
status: draft
created: 2026-02-08
updated: 2026-02-08
version: 1.0.0
related: [meta-prompt-install-commands.md]
source: "Web research on Amp Code and Gemini CLI documentation (Feb 2026)"
---

# Skill Installation Research for Sourcegraph Amp and Gemini CLI

## 1. Purpose

This document captures findings on how Sourcegraph Amp Code and Google Gemini CLI handle custom prompts and skills, to inform updates to `install.sh` for supporting these tools alongside the existing Claude Code, Cursor, Windsurf, and Zed integrations.

## 2. Sourcegraph Amp Code

### 2.1 Overview

Amp Code (formerly Cody) is Sourcegraph's AI coding assistant available as a CLI and editor extension. It has migrated from a **custom commands** system (now deprecated) to an **Agent Skills** system that follows the [agentskills.io specification](https://agentskills.io/specification) -- the same cross-tool standard used by Claude Code.

### 2.2 Configuration Locations

| Scope | Path | Purpose |
|-------|------|---------|
| User settings | `~/.config/amp/settings.json` | General configuration |
| Workspace settings | `.amp/settings.json` | Project-level overrides |
| Enterprise managed | `/etc/ampcode/managed-settings.json` | Org-wide policies |

Settings use JSON format with `amp.`-prefixed keys:

```json
{
  "amp.permissions": [
    { "tool": "Bash", "matches": { "cmd": "*git commit*" }, "action": "ask" }
  ],
  "amp.mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  },
  "amp.skills.path": "~/my-skills:/shared/team-skills"
}
```

### 2.3 Skill Discovery Locations

Amp discovers skills from these locations (first match wins):

| Priority | Path | Notes |
|----------|------|-------|
| 1 (highest) | `~/.config/agents/skills/` | User-wide, cross-tool standard |
| 2 | `~/.config/amp/skills/` | Amp-specific user-wide (legacy) |
| 3 | `.agents/skills/` | Project-level (recommended) |
| 4 | `.claude/skills/` | Claude Code compatibility |
| 5 | `~/.claude/skills/` | Claude Code user-wide compatibility |
| 6 | Built-in skills | Shipped with Amp |
| 7 | `amp.skills.path` setting | Custom path override |

### 2.4 SKILL.md Format

Amp uses the identical `SKILL.md` format as Claude Code:

```yaml
---
name: my-skill-name
description: A clear description of what this skill does and when to use it
---

# Instructions

Step-by-step instructions for the agent...
```

**Required frontmatter fields:**

| Field | Constraints |
|-------|-------------|
| `name` | Max 64 chars, lowercase letters/numbers/hyphens, must match directory name |
| `description` | Max 1024 chars |

**Optional frontmatter fields:** `license`, `compatibility`, `metadata` (arbitrary key-value), `allowed-tools`, `disable-model-invocation`.

### 2.5 Skill Directory Structure

```
.agents/skills/
└── my-skill/
    ├── SKILL.md          # Required: frontmatter + instructions
    ├── mcp.json          # Optional: bundled MCP server config
    ├── scripts/          # Optional: executable scripts
    ├── references/       # Optional: additional docs
    └── assets/           # Optional: templates, images, data
```

### 2.6 Skill Lifecycle

Amp uses a **progressive disclosure** model:

1. **At thread start** (~100 tokens per skill): Only `name` and `description` from frontmatter are loaded.
2. **On activation**: Full `SKILL.md` body loads into context (recommended < 5000 tokens).
3. **On demand**: Files in `scripts/`, `references/`, and `assets/` load when explicitly needed.

Skills can also bundle MCP servers via `mcp.json` alongside `SKILL.md`, which enables lazy-loading of MCP tools only when the skill is activated.

### 2.7 Context Files

Amp uses `AGENTS.md` (with fallback to `CLAUDE.md`) for contextual instructions:

- Current working directory and parent directories up to `$HOME`
- Subtree `AGENTS.md` when reading files in that subtree
- `~/.config/amp/AGENTS.md` and `~/.config/AGENTS.md`

### 2.8 Deprecated: Custom Commands

Previously stored in `.agents/commands/` or `~/.config/amp/commands/`. These are deprecated in favor of skills. Migration path: move markdown files into named subdirectories, rename to `SKILL.md`, and add YAML frontmatter.

### 2.9 Implications for install.sh

**The current default install already works for Amp.** Since install.sh writes to `.agents/skills/<name>/SKILL.md` with compatible frontmatter, Amp discovers these at priority 3. No format conversion is needed.

For the per-tool integration step (copying to tool-specific directories):
- **Local installs**: No action needed -- `.agents/skills/` is already the canonical location Amp checks.
- **Global installs**: Copy to `~/.config/amp/skills/` (or `~/.config/agents/skills/` for the cross-tool standard path).
- **Detection**: Check for `~/.config/amp/` directory to determine if Amp is installed.
- **Uninstall**: Add cleanup of `~/.config/amp/skills/` and `~/.config/agents/skills/`.

## 3. Google Gemini CLI

### 3.1 Overview

Gemini CLI is Google's terminal-based AI coding assistant. It provides **two mechanisms** for custom prompts: TOML-based slash commands (stable, primary) and Agent Skills (experimental, same cross-tool standard).

### 3.2 Configuration Locations

| Priority | Location | Scope |
|----------|----------|-------|
| 7 (highest) | Command-line arguments | Session |
| 6 | Environment variables | Shell |
| 5 | `/etc/gemini-cli/settings.json` | System override |
| 4 | `.gemini/settings.json` | Project |
| 3 | `~/.gemini/settings.json` | User |
| 2 | `/etc/gemini-cli/system-defaults.json` | System default |
| 1 (lowest) | Hardcoded defaults | Built-in |

### 3.3 The `.gemini/` Directory

```
~/.gemini/                          # User-level
├── settings.json
├── GEMINI.md                       # Global context/instructions
├── .env
├── commands/                       # Slash commands (TOML)
│   └── incitaciones/
│       └── commit.toml             # becomes /incitaciones:commit
└── skills/                         # Agent skills (experimental)
    └── code-reviewer/
        └── SKILL.md

<project-root>/
├── .gemini/
│   ├── settings.json
│   ├── commands/                   # Project-scoped commands
│   └── skills/                     # Project-scoped skills
├── .geminiignore
└── GEMINI.md                       # Project context file
```

### 3.4 Custom Slash Commands (TOML Format)

This is the **primary, stable mechanism** for custom prompts in Gemini CLI.

**Discovery locations** (project takes precedence):
1. `<project>/.gemini/commands/` -- project-scoped
2. `~/.gemini/commands/` -- user-scoped

**Naming convention**: File path relative to `commands/` determines the command name. Subdirectories create namespaced commands with `:` separators:
- `commands/commit.toml` -> `/commit`
- `commands/incitaciones/commit.toml` -> `/incitaciones:commit`

**TOML file schema:**

```toml
# Required:
prompt = """Your prompt text here.

Supports special syntax:
- {{args}} for argument injection
- !{shell command} for shell command output
- @{path/to/file} for file content injection
"""

# Optional:
description = "Brief one-line description for /help menu"
```

**Injection mechanisms:**

| Syntax | Purpose | Notes |
|--------|---------|-------|
| `{{args}}` | User-provided text after the command | Auto-escaped inside `!{...}` blocks |
| `!{command}` | Shell command stdout injection | Prompts user for confirmation |
| `@{path}` | File content injection | Supports images; directories traversed recursively |

If no `{{args}}` placeholder exists and args are provided, they are appended to the prompt separated by two newlines.

**Example -- commit command** (`commands/incitaciones/commit.toml`):

```toml
description = "Create deliberate, well-structured git commits"
prompt = """
Review all staged and unstaged changes in this repository.
Group related changes into logical commits.
For each commit, write a descriptive message following conventional commit format.
Wait for user approval before creating each commit.
"""
```

### 3.5 Agent Skills (Experimental)

Gemini CLI also supports the same Agent Skills standard (`SKILL.md` with YAML frontmatter), but this is behind an experimental flag.

**Discovery locations:**
1. `.gemini/skills/` -- project-level
2. `~/.gemini/skills/` -- user-level

**Enabling:** Requires `experimental.skills` in settings or via the `/settings` interactive UI.

**Management commands:**
- `/skills list` -- view discovered skills
- `/skills install` -- add from Git repos, directories, or `.skill` files
- `/skills enable/disable <name>` -- toggle availability
- `/skills reload` -- refresh discovery

The SKILL.md format is identical to the Amp/Claude Code format described in section 2.4.

### 3.6 Context Files

Gemini CLI uses `GEMINI.md` for persistent instructional context:

- `~/.gemini/GEMINI.md` -- global
- Project root and ancestor directories up to `.git` boundary
- Subdirectories below CWD (respecting `.geminiignore`)
- Supports `@./path/to/file.md` imports

The filename can be configured to also recognize other names:

```json
{
  "context": {
    "fileName": ["AGENTS.md", "CONTEXT.md", "GEMINI.md"]
  }
}
```

### 3.7 Extensions

Gemini CLI has a broader extension system via `gemini-extension.json` that can bundle commands, skills, MCP servers, and context together. This is more than we need for prompt distribution but worth noting for future reference.

### 3.8 Implications for install.sh

Gemini CLI has two viable installation paths:

**Option A: TOML Commands (Recommended)**
- Convert distilled markdown prompts to TOML format.
- Install to `~/.gemini/commands/incitaciones/<name>.toml` (global) or `.gemini/commands/incitaciones/<name>.toml` (local).
- Commands appear as `/incitaciones:commit`, `/incitaciones:debug`, etc.
- Stable, no experimental flag needed.
- Requires a markdown-to-TOML conversion step in the install script.

**Option B: SKILL.md Skills**
- Copy existing `SKILL.md` files as-is to `~/.gemini/skills/<name>/SKILL.md`.
- Same format, no conversion needed.
- Requires experimental flag to be enabled by the user.
- More future-proof if Gemini stabilizes skills support.

**Recommended approach:** Support both. Default to TOML commands for immediate usability, and also install SKILL.md files to the skills directory for users who have experimental skills enabled.

**Detection:** Check for `~/.gemini/` directory to determine if Gemini CLI is installed.

**TOML conversion function:** Needs to:
1. Read the distilled markdown content.
2. Look up the description from `manifest.json`.
3. Generate a TOML file with `description` and `prompt` fields.
4. Escape any triple-quote sequences in the prompt content.

**Uninstall:** Add cleanup of `~/.gemini/commands/incitaciones/` and `~/.gemini/skills/`.

## 4. Comparison Matrix

| Feature | Claude Code | Amp Code | Gemini CLI | Cursor/Windsurf/Zed |
|---------|------------|----------|------------|---------------------|
| Config dir | `.claude/` | `.amp/`, `.agents/` | `.gemini/` | `.cursor/`, etc. |
| Context file | `CLAUDE.md` | `AGENTS.md` | `GEMINI.md` | N/A |
| Skills format | `SKILL.md` (YAML+MD) | `SKILL.md` (YAML+MD) | `SKILL.md` (experimental) | N/A |
| Commands format | `.md` flat files | Deprecated | `.toml` files | `.md` flat files |
| Skills path (project) | `.claude/skills/` | `.agents/skills/` | `.gemini/skills/` | N/A |
| Skills path (user) | `~/.claude/skills/` | `~/.config/amp/skills/` | `~/.gemini/skills/` | N/A |
| Commands path (project) | `.claude/commands/` | Deprecated | `.gemini/commands/` | `.{tool}/commands/` |
| Commands path (user) | `~/.claude/commands/` | Deprecated | `~/.gemini/commands/` | `~/.{tool}/commands/` |
| Cross-tool standard | Yes (agentskills.io) | Yes (agentskills.io) | Partial (experimental) | No |
| Namespace convention | `/name` | `/name` | `/dir:name` | `/name` |

## 5. Proposed Changes to install.sh

### 5.1 Tool Loop Update

Expand the tool integration loop from:
```bash
for tool in claude cursor windsurf zed; do
```
to:
```bash
for tool in claude amp gemini cursor windsurf zed; do
```

### 5.2 Amp Integration

For `setup_tool_integration "amp"`:

- **Detection (local):** `.agents/skills/` already exists from the canonical install -- no additional work needed.
- **Detection (global):** Check for `~/.config/amp/` directory.
- **Global install:** Copy `SKILL.md` files to `~/.config/amp/skills/<name>/SKILL.md`.
- **Format:** Same SKILL.md format, no conversion needed.

Since the canonical install already writes to `.agents/skills/` which Amp reads at priority 3, the local integration is effectively free. The global integration only needs to copy to the Amp-specific user directory.

### 5.3 Gemini Integration

For `setup_tool_integration "gemini"`:

- **Detection:** Check for `~/.gemini/` (global) or create `.gemini/` (local).
- **Commands install:** Generate TOML files to `{base}/.gemini/commands/incitaciones/<name>.toml`.
- **Skills install:** Copy SKILL.md files to `{base}/.gemini/skills/<name>/SKILL.md`.

**TOML generation function:**

```bash
generate_toml_command() {
  local name="$1"
  local src="$2"
  local description=""

  description=$(get_prompt_description "$name")
  if [ -z "$description" ]; then
    description="Incitaciones prompt: $name"
  fi

  # Write TOML file
  {
    echo "description = \"$description\""
    echo 'prompt = """'
    cat "$src"
    echo '"""'
  }
}
```

### 5.4 Uninstall Updates

Add to `do_uninstall()`:
- Remove `~/.config/amp/skills/` entries installed by incitaciones.
- Remove `~/.gemini/commands/incitaciones/`.
- Remove `~/.gemini/skills/` entries installed by incitaciones.

### 5.5 Usage String Update

Update `usage()` and the tool list echo to mention Amp and Gemini CLI alongside Claude Code, Cursor, Windsurf, and Zed.

## 6. Sources

- [Amp Owner's Manual](https://ampcode.com/manual)
- [Amp: Slashing Custom Commands (deprecation)](https://ampcode.com/news/slashing-custom-commands)
- [Amp: Agent Skills announcement](https://ampcode.com/news/agent-skills)
- [Amp: User Invokable Skills](https://ampcode.com/news/user-invokable-skills)
- [Amp: Lazy-load MCP with Skills](https://ampcode.com/news/lazy-load-mcp-with-skills)
- [Amp: CLI Workspace Settings](https://ampcode.com/news/cli-workspace-settings)
- [Agent Skills Specification (agentskills.io)](https://agentskills.io/specification)
- [GitHub: ampcode/amp-contrib](https://github.com/ampcode/amp-contrib)
- [Gemini CLI Custom Commands](https://geminicli.com/docs/cli/custom-commands/)
- [Gemini CLI Configuration](https://geminicli.com/docs/get-started/configuration/)
- [Gemini CLI GEMINI.md](https://geminicli.com/docs/cli/gemini-md/)
- [Gemini CLI Agent Skills](https://geminicli.com/docs/cli/skills/)
- [Gemini CLI Creating Skills](https://geminicli.com/docs/cli/creating-skills/)
- [Gemini CLI Extensions Reference](https://geminicli.com/docs/extensions/reference/)
- [Gemini CLI GitHub Repository](https://github.com/google-gemini/gemini-cli)
