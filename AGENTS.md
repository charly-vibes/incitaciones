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

**CRITICAL: This repository requires deliberate, reviewed commits.**

### Core Principles

1. **NEVER commit code directly without review**
2. **NEVER use `git add -A` or `git add .`**
3. **ALWAYS describe what will be committed before committing**
4. **ALWAYS review the conversation to write accurate commit messages**
5. **ALWAYS make multiple logical commits instead of one large commit**

### Pre-Commit Review Process

Before any git operation, an AI assistant (or human) MUST:

#### 1. Review What Changed

```bash
# Show all changes
git status

# Review each changed file
git diff path/to/file1.md
git diff path/to/file2.md
```

#### 2. Describe the Changes

**Template for description:**

```
I've made changes to the following files:

1. content/prompt-task-example.md
   - Added new variation for handling edge cases
   - Updated example with real usage from project X
   - Added reference to research-finding-patterns.md

2. CHANGELOG.md
   - Added entry for prompt update

These changes form a logical unit: "Improved task prompt with edge case handling"

Tool used: claude-code
Model: claude-sonnet-4.5
Status: tested
```

#### 3. Group Changes Logically

**Good grouping:**
- Commit A: Add new prompt + update CHANGELOG
- Commit B: Add related research + update CHANGELOG
- Commit C: Link the two together + update both files

**Bad grouping:**
- One commit with all 6 files changed with message "updates"

#### 4. Explicit File Staging

**ALWAYS be explicit about what's being added:**

```bash
# ✅ CORRECT - Explicit files
git add content/prompt-task-refactoring.md
git add CHANGELOG.md
git commit -m "add(prompt): incremental refactoring

Added new task prompt for safe refactoring with test checkpoints.
Includes variations for high-risk code and code without tests.

Tool: claude-code
Model: claude-sonnet-4.5
Status: tested"

# ❌ WRONG - Bulk add
git add -A  # NEVER DO THIS
git add .   # NEVER DO THIS
```

### Commit Message Requirements

Every commit message MUST follow this structure:

```
<type>(<scope>): <short description>

<detailed description explaining what and why>

Tool: <tool-name>
Model: <model-name>
Status: <draft|tested|verified>
Context: <optional additional context>
```

### Example Workflow

**Scenario: Added a new prompt and related research**

#### Step 1: Review Changes
```bash
git status
```

**Output:**
```
Modified:   content/prompt-task-debugging.md
Added:      content/research-finding-debugging-patterns.md
Modified:   CHANGELOG.md
```

#### Step 2: Describe Each Change

```
Changes made during this session:

File 1: content/prompt-task-debugging.md
- Enhanced the prompt with systematic debugging steps
- Added variation for async code debugging
- Linked to new research file

File 2: content/research-finding-debugging-patterns.md
- New research documenting debugging patterns from 10 projects
- Identified 5 common patterns that work across tools
- Includes examples from real debugging sessions

File 3: CHANGELOG.md
- Added entries for both changes above

Logical commits to make:
1. Add the research file (foundational)
2. Update the prompt that uses the research
```

#### Step 3: Create First Commit

```bash
# Add research file and its changelog entry
git add content/research-finding-debugging-patterns.md
git add CHANGELOG.md

# Review what's staged
git diff --cached

# Commit with detailed message
git commit -m "add(research): debugging patterns from real projects

Documented debugging patterns identified across 10 different projects
using various AI tools. Found 5 patterns that consistently work:

1. Binary search approach to isolate issues
2. State logging at boundaries
3. Reproduction case creation first
4. Tool-specific debugging prompts
5. Incremental fix verification

Includes concrete examples from Node.js, Python, and Rust projects.

Tool: claude-code
Model: claude-sonnet-4.5
Status: verified
Context: Analysis of debugging sessions from Nov-Dec 2025"
```

#### Step 4: Create Second Commit

```bash
# Reset CHANGELOG for second commit
git reset CHANGELOG.md

# Add prompt file and changelog
git add content/prompt-task-debugging.md
git add CHANGELOG.md

# Commit with reference to research
git commit -m "update(prompt): enhance debugging prompt with research patterns

Updated debugging prompt to incorporate findings from recent research
on debugging patterns (research-finding-debugging-patterns.md).

Changes:
- Added systematic binary search approach
- Included async/await specific variation
- Added state logging recommendations
- Linked to research file in frontmatter

Tool: claude-code
Model: claude-sonnet-4.5
Status: tested
Context: Tested on Express.js async debugging scenario"
```

### Review Conversation for Context

Before committing, the AI (or human) MUST:

1. **Read back through the conversation** to understand:
   - What was the original request?
   - What decisions were made during implementation?
   - What problems were solved?
   - What tools and models were used?

2. **Extract key information** for the commit message:
   - The "why" behind changes
   - What alternatives were considered
   - What was tested
   - What context matters for future reference

3. **Write commit message** that someone reading the history will understand without seeing the conversation

### Multi-Commit Strategy

**When you've made multiple types of changes, split them:**

Example session that created:
- 3 new prompts
- 2 template updates
- 1 justfile enhancement
- CHANGELOG updates

**Commit strategy:**
1. `add(template): improve prompt template structure` - Template changes
2. `add(prompt): task prompts for refactoring` - First set of prompts
3. `add(prompt): workflow prompts for git operations` - Second set
4. `feat(workflow): add fzf search to justfile` - Justfile enhancement

Each commit is focused, tested, and independently meaningful.

### Red Flags - NEVER Do This

❌ **Vague commit messages:**
```bash
git commit -m "updates"
git commit -m "fixes"
git commit -m "changes to prompts"
```

❌ **Bulk staging:**
```bash
git add -A
git add .
git add content/*
```

❌ **No review before commit:**
```bash
# Wrong: commit without reviewing diff
git add file.md && git commit -m "update"
```

❌ **Missing metadata:**
```bash
git commit -m "add new prompt"
# Missing: Tool, Model, Status, Context
```

❌ **One giant commit:**
```bash
# 15 files changed, 10 new prompts, 3 research files, templates...
# All in one commit
```

### Green Flags - Do This

✅ **Clear, specific commit messages:**
```bash
git commit -m "add(prompt): incremental refactoring with safety checks

Added task prompt for safe refactoring with test checkpoints.

Tool: claude-code
Model: claude-sonnet-4.5
Status: tested"
```

✅ **Explicit staging:**
```bash
git add content/prompt-task-specific.md
git add CHANGELOG.md
```

✅ **Review before commit:**
```bash
git diff content/prompt-task-specific.md
# Read the diff, verify it's correct
git add content/prompt-task-specific.md
git diff --cached
# Review staged changes
git commit -m "..."
```

✅ **Complete metadata:**
```bash
# Every commit has Tool, Model, Status fields
```

✅ **Logical groupings:**
```bash
# Commit 1: New prompt + CHANGELOG
# Commit 2: Related research + CHANGELOG
# Commit 3: Example using both + CHANGELOG
```

### Justfile Integration

The justfile should help with commits:

```bash
# Use the changelog command to update CHANGELOG.md
just changelog "Added debugging prompt"

# Then review and commit explicitly
git diff CHANGELOG.md
git add CHANGELOG.md
git commit -m "docs(changelog): update for debugging prompt"
```

### For AI Assistants

When you (an AI) are about to commit:

1. **Stop and describe** what you're about to commit
2. **List each file** and what changed in it
3. **Propose the commit message(s)** with full metadata
4. **Wait for confirmation** or proceed if authorized
5. **Use explicit `git add`** commands for each file
6. **Create focused commits** - one logical change per commit

### For Humans

When working with AI assistants:

1. **Review their commit description** before allowing them to proceed
2. **Verify the commit message** includes all metadata
3. **Check that changes are grouped logically**
4. **Ensure CHANGELOG.md is updated** appropriately
5. **Ask the AI to split commits** if they're too large

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
