# Incitaciones - AI Prompts Repository

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
    ├── prompt-*.md        # Prompts
    ├── research-*.md      # Research
    ├── example-*.md       # Examples
    ├── template-*.md      # Templates
    └── references-*.md    # Link collections
```

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
version: 1.0.0
related: [other-file.md]
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
```

## Workflow

1. **Create** - `just new prompt "Name"`
2. **Edit** - Add content and examples
3. **Test** - Try it with real AI tools
4. **Update status** - draft → tested → verified
5. **Link** - Add to `related` field
6. **Commit** - Update CHANGELOG.md and commit (see Git Guidelines below)

## Git Commit Guidelines

**CRITICAL: This repository requires a deliberate, reviewed, and logical commit process.**

All changes, whether made by a human or an AI assistant, must be carefully reviewed before being committed. Commits should be granular, with descriptive messages that explain the "what" and the "why" of the change.

The canonical and complete commit process is documented in the contribution guide.

**➡️ See [CONTRIBUTING.md](CONTRIBUTING.md#commit-guidelines) for the full guidelines.**

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
5. Related field connects minimum 2 files

See CONTRIBUTING.md for full guidelines.
