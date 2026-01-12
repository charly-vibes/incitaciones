# Contributing to Incitaciones

Thank you for contributing! This guide will help you add content that's useful, well-documented, and discoverable.

## Quick Start

```bash
# Create new content
just new prompt "Your Prompt Name"
just new research "Your Research Topic"
just new example "Your Example Description"

# Validate before committing
just validate

# Update changelog
just changelog "Added prompt for X"

# Commit
git add content/ CHANGELOG.md
git commit -m "Add prompt for X"
```

## File Naming Conventions

All files use slugified names with type prefixes:

### Prompts

- `prompt-task-{name}.md` - Task-specific prompts
- `prompt-system-{name}.md` - System configurations
- `prompt-workflow-{name}.md` - Multi-step workflows
- `prompt-tool-{tool}-{name}.md` - Tool-specific prompts

**Examples:**
- `prompt-task-incremental-refactoring.md`
- `prompt-system-coding-assistant.md`
- `prompt-workflow-git-commit-process.md`
- `prompt-tool-claude-code-hooks.md`

### Research

- `research-paper-{title}.md` - Paper summaries
- `research-experiment-{topic}.md` - Experiments and tests
- `research-finding-{topic}.md` - Insights and patterns
- `research-benchmark-{topic}.md` - Performance comparisons

**Examples:**
- `research-paper-chain-of-thought.md`
- `research-experiment-prompt-length.md`
- `research-finding-temperature-settings.md`

### Examples

- `example-{description}.md` - Any type of real-world example

**Examples:**
- `example-refactoring-auth-system.md`
- `example-debugging-memory-leak.md`
- `example-conversation-complex-workflow.md`

### References

- `references-{category}.md` - Collections of links

**Examples:**
- `references-papers.md`
- `references-tools.md`
- `references-articles.md`

## Required Metadata

Every file must have YAML frontmatter with these required fields:

```yaml
---
title: Human Readable Title
type: prompt|research|example|references
tags: [at, least, three, tags]
status: draft|tested|verified
created: YYYY-MM-DD
version: 1.0.0
---
```

### Optional but Recommended

```yaml
tools: [claude-code, aider, cursor, gemini]
related: [other-file.md, another-file.md]
source: original|adapted-from-URL|research-based
author: your-name
difficulty: beginner|intermediate|advanced
```

## Content Structure Standards

### For Prompts

Must include:

1. **When to Use** - Context and situations
2. **The Prompt** - The actual prompt in a code block
3. **Example** - At least one concrete usage
4. **Expected Results** - What success looks like
5. **References** - Sources and inspiration

Optional:
- **Variations** - Alternative approaches
- **Notes** - Caveats and tips

### For Research

Must include:

1. **Summary** - 2-3 sentences
2. **Context** - Why this was investigated
3. **Method** - How you tested/studied
4. **Results** - What you found
5. **Practical Applications** - How to use this
6. **References** - Source material

### For Examples

Must include:

1. **Context** - Starting situation
2. **Goal** - What you were trying to do
3. **Process** - Step-by-step walkthrough
4. **Results** - Final outcome
5. **Lessons Learned** - Key insights

## Status Progression

Content should progress through these stages:

### draft

- Initial version
- Not yet tested in real scenarios
- May have incomplete sections
- Ready for feedback

### tested

- Successfully used at least once
- All sections completed
- Examples verified to work
- Ready for broader use

### verified

- Multiple successful uses
- Peer-reviewed or validated by others
- Well-documented edge cases
- Production-ready

Update status with:
```bash
just mark-tested content/prompt-task-example.md
just mark-verified content/prompt-task-example.md
```

## Quality Checklist

Before submitting, ensure:

- [ ] All required metadata fields present
- [ ] At least 3 relevant tags
- [ ] Clear, descriptive title
- [ ] Concrete example included
- [ ] Source attribution if adapted
- [ ] Related files linked (minimum 2 if available)
- [ ] Status reflects actual testing
- [ ] CHANGELOG.md updated
- [ ] No typos or formatting issues

Run validation:
```bash
just validate
just check-links
```

## Relating Content

Link related files in the frontmatter:

```yaml
---
related:
  - prompt-task-testing.md
  - research-finding-safe-refactoring.md
  - example-auth-refactoring.md
---
```

Guidelines:
- Link at least 2 related files (if available)
- Link prompts to research that informed them
- Link examples to prompts they demonstrate
- Link research to prompts it supports

## Source Attribution

Always credit where ideas come from:

```yaml
source: original                           # Your own work
source: adapted-from-anthropic-docs        # Modified from existing
source: https://example.com/article        # Direct link to source
source: research-paper-chain-of-thought.md # Based on research in repo
```

In the content, cite sources:

```markdown
## References

- [Original Article](https://example.com) - Inspiration for this approach
- Martin Fowler's "Refactoring" - Methodology basis
- research-finding-safe-patterns.md - Supporting research
```

## Versioning

Use semantic versioning:

- **Patch** (1.0.0 → 1.0.1) - Typo fixes, minor clarifications
- **Minor** (1.0.0 → 1.1.0) - Add variations, improve examples, expand content
- **Major** (1.0.0 → 2.0.0) - Significant changes to the prompt itself, breaking changes

Update version in frontmatter:
```yaml
version: 1.1.0
updated: 2026-01-12
```

Add to version history section:
```markdown
## Version History

- 1.1.0 (2026-01-12): Added variations for high-risk code
- 1.0.0 (2026-01-10): Initial version
```

## Testing Requirements

### For Prompts

Before marking as "tested":
1. Use the prompt with at least one real AI tool
2. Verify it produces expected results
3. Document actual usage in the Example section
4. Note any surprises or edge cases in Notes

Before marking as "verified":
1. Multiple successful uses (at least 3)
2. Tested by someone other than author (if possible)
3. Edge cases documented
4. Variations tested

### For Research

Before marking as "tested":
1. Experiment completed with documented results
2. Data or examples collected
3. Analysis written

Before marking as "verified":
1. Findings replicated or confirmed
2. Practical applications identified
3. Related prompts updated to use findings

### For Examples

All examples should be "verified" by default:
1. Based on real usage
2. Outcomes accurately documented
3. Code/artifacts available if possible

## Changelog Updates

Always update CHANGELOG.md when adding or modifying content:

```bash
just changelog "Added prompt for incremental refactoring"
just changelog "Updated research on temperature settings"
just changelog "Fixed typo in debugging example"
```

Or manually add under `## [Unreleased]`:

```markdown
## [Unreleased]

### 2026-01-12

- Added prompt for incremental refactoring
- Updated research on temperature settings with new findings
- Fixed typo in debugging example
```

## Commit Guidelines

### Conventional Commit Format

We use detailed conventional commits to track not just what changed, but the context in which it was created or tested.

```
<type>(<scope>): <description>

<detailed body>

Tool: <tool-name>
Model: <model-name>
Status: <draft|tested|verified>
Context: <optional context>
```

**Types:**
- `add` - New content
- `update` - Changes to existing content
- `fix` - Corrections or bug fixes
- `docs` - Documentation changes
- `meta` - Repository maintenance
- `test` - Testing existing content
- `refactor` - Restructuring without changing meaning

**Scopes:**
- `prompt` - Prompt files
- `research` - Research files
- `example` - Example files
- `template` - Template files
- `workflow` - Workflow and automation
- `docs` - Documentation files

### Metadata in Commits

Always include in the commit body:

- **Tool:** The AI CLI tool used (claude-code, aider, cursor, gemini, etc.)
- **Model:** The specific model (claude-sonnet-4.5, gpt-4, gemini-pro, etc.)
- **Status:** The status of the content (draft, tested, verified)
- **Context:** (Optional) Additional context like project type, use case, etc.

### Examples

**Adding new prompt:**
```
add(prompt): incremental refactoring with safety checks

Added task prompt for safe refactoring with test checkpoints between
each change. Includes variations for high-risk code and code without
existing test coverage.

Tool: claude-code
Model: claude-sonnet-4.5
Status: tested
Context: Used on TypeScript refactoring project with Jest tests
```

**Updating research:**
```
update(research): temperature settings for different tasks

Extended temperature experiment with new findings from creative vs
structured tasks. Found that 0.7 works better for brainstorming while
0.3 is optimal for code generation.

Tool: claude-code, aider
Model: claude-sonnet-4.5, gpt-4
Status: verified
Context: Tested across 15 different task types
```

**Fixing issues:**
```
fix(prompt): correct git workflow example commands

Fixed broken git commands in workflow example that were using wrong
branch names. Updated to use 'main' instead of 'master'.

Tool: claude-code
Model: claude-sonnet-4.5
Status: verified
```

**Adding examples:**
```
add(example): debugging memory leak in Node.js app

Real-world example of using debugging prompts to identify and fix
memory leak. Shows full interaction including false starts and
eventual solution.

Tool: cursor
Model: claude-sonnet-4.5
Status: verified
Context: Express.js app with 100k+ requests/day
```

**Documentation updates:**
```
docs(contributing): add conventional commit guidelines

Extended commit guidelines to include metadata about tools and models
used. This helps track which tools work best for different types of
prompts.

Tool: claude-code
Model: claude-sonnet-4.5
Status: n/a
```

### Why Detailed Commits?

Including tool and model information helps us:

1. **Track effectiveness** - See which models excel at different tasks
2. **Version compatibility** - Know if prompts need updates for new models
3. **Tool optimization** - Identify tool-specific patterns and best practices
4. **Research value** - Build a dataset of what works across different tools
5. **Reproducibility** - Others can replicate with same setup

### Quick Commit Template

Create a git commit template:

```bash
# ~/.gitmessage
<type>(<scope>): <description>

# Detailed description of changes

Tool:
Model:
Status:
Context:
```

Enable it:
```bash
git config --local commit.template ~/.gitmessage
```

### What to Commit Together

Group related changes:

```bash
# Adding new prompt
git add content/prompt-task-new-feature.md CHANGELOG.md
git commit -m "add: new feature implementation prompt"

# Updating prompt and related research
git add content/prompt-task-refactoring.md content/research-finding-patterns.md CHANGELOG.md
git commit -m "update: refactoring prompt with new research findings"
```

## Style Guidelines

### Writing Style

- **Clear and concise** - Get to the point quickly
- **Active voice** - "Use this prompt when..." not "This prompt can be used when..."
- **Specific examples** - Concrete is better than abstract
- **Actionable** - Tell users exactly what to do

### Formatting

- Use code blocks for prompts and examples
- Use bullet lists for multiple points
- Use **bold** for emphasis (sparingly)
- Use `code` for commands, filenames, and technical terms
- Use > blockquotes for important notes

### Technical Terms

- Be consistent with terminology
- Define specialized terms on first use
- Use standard industry terms when available
- Link to definitions or documentation when helpful

## Common Mistakes to Avoid

❌ **Don't:**
- Create files without testing them
- Use vague or generic titles
- Skip source attribution
- Forget to link related content
- Leave metadata fields empty
- Add files without updating CHANGELOG

✅ **Do:**
- Test prompts before submitting
- Use descriptive, searchable titles
- Credit sources and inspirations
- Link to 2+ related files
- Fill all required metadata
- Update CHANGELOG with every change

## Getting Help

If you're unsure about:

- **Structure** - Check existing files as examples
- **Naming** - Use `just find` to see similar content
- **Metadata** - Run `just validate` to check requirements
- **Quality** - Review AGENTS.md for philosophy

## Review Process

1. **Self-review** - Check against this guide
2. **Validate** - Run `just validate` and `just check-links`
3. **Test** - Actually use the content with real tools
4. **Submit** - Create PR or commit directly (if authorized)
5. **Update** - Address feedback and mark as tested/verified

## Philosophy Reminder

Remember the repository goals:

- **Quality over quantity** - One great prompt beats ten mediocre ones
- **Evidence-based** - Every claim should have supporting examples
- **Discoverable** - Rich metadata makes content findable
- **Evolving** - Update based on real usage and feedback
- **Shared learning** - Document both successes and failures

---

Thank you for contributing! Your shared knowledge helps the entire community build better AI workflows.
