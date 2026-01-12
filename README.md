# Incitaciones 🤖

A collection of reusable prompts and best practices for CLI LLM tools.

## Quick Start

```bash
# Browse content
ls content/

# Find prompts about a topic
just find refactoring

# Create new prompt
just new prompt "Your Task Name"

# Interactive search with fzf
just search
```

## Structure

Everything lives in `content/` with descriptive filenames:

- `prompt-*.md` - Reusable prompts
- `research-*.md` - Experiments and findings
- `example-*.md` - Real-world examples
- `template-*.md` - Templates for new content

See [AGENTS.md](AGENTS.md) for detailed structure and [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Commands

```bash
just --list              # Show all commands
just new [type] [name]   # Create new content
just find [term]         # Search content
just search              # Interactive fzf search
just validate            # Check metadata
just stats               # Show statistics
```

---

## Meta Prompt for LLMs

> **Use this prompt when asking other LLMs to help you organize prompts in your projects**

```
I want to organize prompts and AI instructions for my project. Please help me set up a system based on these principles:

STRUCTURE:
- Single flat directory (e.g., "prompts/" or ".ai/")
- Slugified filenames with type prefixes:
  - prompt-task-{name}.md for specific tasks
  - prompt-system-{name}.md for agent configurations
  - prompt-workflow-{name}.md for multi-step processes
  - instructions-{context}.md for project-specific instructions

METADATA:
Every file should have YAML frontmatter:
---
title: Human Readable Title
type: prompt|instruction|workflow
tags: [relevant, searchable, tags]
tools: [claude-code, cursor, aider]
status: draft|tested|verified
created: YYYY-MM-DD
updated: YYYY-MM-DD
version: 1.0.0
related: [other-file.md]
source: where-this-came-from
---

CONTENT STRUCTURE:
1. ## When to Use - Context for applying this prompt
2. ## The Prompt - The actual prompt text in a code block
3. ## Example - At least one concrete usage example
4. ## Expected Results - What success looks like
5. ## Variations - Alternative approaches
6. ## References - Links to sources or research
7. ## Notes - Caveats or additional context

WORKFLOW:
1. Create content from templates
2. Test with real AI tools
3. Update status: draft → tested → verified
4. Link related files in frontmatter
5. Track changes in CHANGELOG.md

AUTOMATION:
Create a justfile or Makefile with commands:
- new: Create from template
- find: Search by tag or keyword
- search: Interactive fzf browser
- validate: Check metadata completeness
- stats: Show repository statistics

Please analyze my project at [path] and:
1. Propose which existing prompts/instructions to capture
2. Suggest an appropriate directory name
3. Create initial template files
4. Set up basic automation commands
5. Draft 2-3 initial prompt files based on current usage

Focus on simplicity and discoverability over complex organization.
```

## Examples

**Creating a new task prompt:**
```bash
just new prompt "Incremental Refactoring"
# Edit content/prompt-task-incremental-refactoring.md
# Add frontmatter, prompt text, examples
# Test it with Claude Code
# Mark as tested and commit
```

**Finding related content:**
```bash
just find refactoring
# Shows all files tagged with 'refactoring'

just search
# Opens fzf to interactively browse and preview content
```

**Validating content:**
```bash
just validate
# Checks all files have required metadata
# Verifies related files exist
# Reports any issues
```

## What Goes Here?

✅ **Good candidates:**
- Prompts you use repeatedly
- Task patterns that work well
- Tool-specific configurations
- Research on what works
- Real examples of successful interactions

❌ **Don't include:**
- Project-specific code
- Sensitive information
- One-off experiments without documentation
- Incomplete drafts without context

## Philosophy

**Flat structure** - One directory, easy to find everything
**Rich metadata** - Searchable, relatable, trackable
**Tested content** - Everything should have real usage examples
**Source attribution** - Credit where ideas come from
**Version control** - Track evolution of prompts over time

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- File naming conventions
- Metadata requirements
- Quality standards
- Submission process

## Tools

This repository is designed to work with:
- **Claude Code** - Anthropic's CLI
- **Aider** - AI pair programming
- **Cursor** - AI-first editor
- **Gemini CLI** - Google's CLI
- Any other LLM CLI tool

The prompts are tool-agnostic where possible, with tool-specific variations noted.

## License

[To be determined]

## Related Projects

- [Awesome Prompts](https://github.com/f/awesome-chatgpt-prompts)
- [Anthropic Prompt Library](https://docs.anthropic.com/claude/prompt-library)
- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
