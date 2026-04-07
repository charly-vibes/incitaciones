# Incitaciones - AI Prompts Repository

## Installing Skills

To install prompts as skills for Claude Code, Amp, Gemini CLI, and other tools:

```bash
./install.sh --global              # Install all skills globally
./install.sh --global --bundle essentials  # Just the core set
./install.sh --list                # Show available prompts and bundles
./install.sh --help                # All options
```

Do NOT manually extract prompts or write custom install scripts. Always use `install.sh`.

## Purpose

A meta repository for collecting and organizing reusable prompts for CLI LLM tools (Claude Code, Gemini, Aider, Cursor, etc.).

**What it does:**
- Stores effective prompts with metadata
- Documents research and experiments
- Provides real-world examples
- Tracks what works and why

## Structure

```
incitaciones/
├── README.md              # Quick start + meta prompt for LLMs
├── AGENTS.md              # This file
├── CHANGELOG.md           # Version history
├── CONTRIBUTING.md        # Guidelines
├── justfile               # Commands
└── content/               # Everything goes here
    ├── manifest.json      # Prompt registry (see below)
    ├── prompt-*.md        # Prompts
    ├── research-*.md      # Research
    ├── example-*.md       # Examples
    ├── template-*.md      # Templates
    └── references-*.md    # Link collections
```

## Distilled Formats

Prompts are stored in two forms: the **source** (`content/prompt-*.md`) and the **distilled** (`content/distilled/{name}.md` or `content/distilled/{name}/SKILL.md`). The distilled form is what the agent actually sees at runtime.

### Single-File Skills
The standard format. A single Markdown file containing only instructions, templates, and rules.
- **Path:** `content/distilled/{name}.md`

### Multi-File Skills (Progressive Disclosure)
For complex skills that would exceed 500 lines or 5,000 tokens. Uses a core `SKILL.md` and a `references/` directory.
- **Structure:**
  - `content/distilled/{name}/SKILL.md` - Core procedure and rules.
  - `content/distilled/{name}/references/` - On-demand templates, examples, and criteria.
- **Trigger Protocol:** The `SKILL.md` must explicitly instruct the agent to read specific files in `references/` when needed.

## Manifest (`content/manifest.json`)

The manifest is the authoritative registry of all prompts. It is consumed by `install.sh` and the site generator.

- **`version`** — date of the last content change (`YYYY-MM-DD`). Update this whenever a prompt is added, removed, or meaningfully edited.
- **`schema_version`** — bump only when the manifest format itself changes.
- **`prompts`** — one entry per prompt with `name`, `type`, `source`, `distilled`, `tags`, and `bundles`.
- **`bundles`** — named groups of prompt names; `"all"` uses `["*"]` as a wildcard.

Both `content/manifest.json` and `_site/manifest.json` must be kept identical. Use `just sync-manifest` to validate all referenced files exist, bump the version date, and sync both copies in one step.

## File Naming

All files in `content/` use prefixed slugs:

**Prompts:**
- `prompt-task-{name}.md` - Task-specific prompts
- `prompt-system-{name}.md` - System/agent configurations
- `prompt-workflow-{name}.md` - Multi-step workflows
- `prompt-tool-{tool}-{name}.md` - Tool-specific prompts

**Research:**
- `research-paper-{title}.md` - Paper summaries
- `research-experiment-{topic}.md` - Experiments
- `research-finding-{topic}.md` - Insights

**Examples:**
- `example-{description}.md` - Real usage examples

**Templates:**
- `template-{type}.md` - Templates for new content

**References:**
- `references-{category}.md` - Link collections

## File Structure

Every file has frontmatter and standard sections:

```markdown
---
title: Short Title
type: prompt|research|example
tags: [tag1, tag2]
tools: [claude-code, aider]
status: draft|tested|verified
created: 2026-01-12
updated: 2026-01-12
version: 1.0.0
related: [other-file.md]
source: original|adapted-from-URL|research-based
---

# Content here

## Sections as needed
```

## Essential Commands

```bash
# Create new content
just new prompt "Task Name"
just new research "Topic"

# Find content
just find refactoring
just list drafts
just list verified

# Maintenance
just validate
just stats
just sync-manifest  # validate manifest files, update version, sync _site/
```

## Workflow

1. **Create** - `just new prompt "Name"`
2. **Edit** - Fill in the source prompt and the distilled runtime form (single file or multi-file directory)
3. **Register** - Add the prompt to `content/manifest.json` (pointing `distilled` to the file or `SKILL.md`)
4. **Validate** - Run `just validate-distilled` and `just sync-manifest`
5. **Test** - Try it with real AI tools
6. **Update status** - draft → tested → verified
7. **Link** - Add related files where they materially help navigation
8. **Commit** - Update CHANGELOG.md and commit (see Git Guidelines below)

## Git Commit Guidelines

**CRITICAL: This repository requires a deliberate, reviewed, and logical commit process.**

All changes, whether made by a human or an AI assistant, must be carefully reviewed before being committed. Commits should be granular, with descriptive messages that explain the "what" and the "why" of the change.

**IMPORTANT: Never use `git add -A` or `git add .`**

Always explicitly add files one by one:
```bash
git add path/to/file1.md
git add path/to/file2.md
git add CHANGELOG.md
```

This forces deliberate review of each changed file before committing.

The canonical and complete commit process is documented in the contribution guide.

**➡️ See [CONTRIBUTING.md](CONTRIBUTING.md#commit-guidelines) for the full guidelines.**

**🤖 For AI assistants:** Use the deliberate commits workflow to ensure proper review and commit structure:
**➡️ See [content/prompt-workflow-deliberate-commits.md](content/prompt-workflow-deliberate-commits.md)**

## Relating Content

Files reference each other in the `related` field:

```yaml
---
related:
  - prompt-task-testing.md
  - research-finding-refactoring.md
  - example-auth-refactoring.md
---
```

No folders needed - the flat structure and metadata make relationships clear.

## Why This Structure?

- **One folder** - Easy to find everything
- **Slugified names** - Filenames show type and topic
- **Rich metadata** - Search by any field
- **Related field** - Explicit connections
- **Simple tools** - Just a few commands

## Quality Standards

1. All files have complete metadata
2. Prompts include tested examples
3. Research cites sources
4. Examples show real usage
5. Related files are linked when they materially improve navigation

See CONTRIBUTING.md for full guidelines.
