---
title: Install Prompts as Commands
type: prompt
subtype: meta
tags: [installation, setup, configuration, cli-tools, commands]
tools: [claude-code, cursor, amp, gemini-cli, windsurf, aider]
status: draft
created: 2026-01-18
updated: 2026-01-19
version: 1.0.0
source: original
---

# Meta-Prompt: Install Prompts as Commands

## When to Use

Use this prompt when you want to install prompts from this repository as reusable commands in your AI coding tool.

### Use Cases
- Setting up a new development environment
- Adding prompts to a specific project repository
- Installing prompts globally for all projects
- Updating previously installed prompts to newer versions

### When NOT to Use
- When you just want to run a prompt once (copy-paste instead)
- When your tool doesn't support custom commands

---

## The Prompt

```markdown
# Install Prompts as Commands

You are helping me install prompts from the incitaciones repository as commands in my AI coding tool.

## Step 1: Gather Configuration

Ask me the following questions (use your tool's question interface if available):

### Q1: Which tool are you using?
- **Claude Code** - Uses `.claude/commands/` for slash commands
- **Cursor** - Uses `.cursor/prompts/` or settings
- **Amp** - Uses `.amp/commands/` configuration
- **Gemini CLI** - Uses custom command configuration
- **Windsurf** - Uses `.windsurf/` configuration
- **Aider** - Uses `.aider/` or command-line aliases
- **Other** - I'll specify the format needed

### Q2: Installation scope?
- **Global** - Available in all my projects (user home directory)
- **Local** - Only for this specific repository (project directory)

### Q3: What do you want to do?
- **Fresh install** - Install new commands
- **Update existing** - Update previously installed commands to latest versions
- **List available** - Show me what prompts are available before deciding

### Q4: Which prompts to install? (if fresh install or update)

**Workflows** (multi-step processes):
- [ ] `commit` - Deliberate commit workflow with review
- [ ] `create-plan` - Create implementation plans
- [ ] `implement-plan` - Execute plans with verification
- [ ] `iterate-plan` - Refine plans based on results
- [ ] `plan-tdd` - Complete TDD workflow cycle
- [ ] `pre-mortem` - Risk analysis before implementation
- [ ] `create-handoff` - Create handoff documentation
- [ ] `resume-handoff` - Resume from handoff doc
- [ ] `rule-of-5` - Multi-agent code review
- [ ] `parallel-review` - Parallel multi-agent review
- [ ] `design-practice` - 6-phase design framework
- [ ] `extract-prompt` - Extract prompt from conversation

**Tasks** (focused single activities):
- [ ] `describe-pr` - Generate PR descriptions
- [ ] `research-codebase` - Document existing code
- [ ] `debug` - Systematic debugging (medical diagnosis approach)
- [ ] `code-review` - Iterative code review
- [ ] `plan-review` - Review implementation plans
- [ ] `research-review` - Review research documentation
- [ ] `issue-review` - Review issues/tickets
- [ ] `design-review` - Review design decisions
- [ ] `universal-review` - Universal Rule of 5 for any work product

**Bundles** (preset collections):
- [ ] `essentials` - commit, debug, describe-pr, code-review
- [ ] `planning` - create-plan, implement-plan, iterate-plan, plan-review
- [ ] `reviews` - rule-of-5, code-review, plan-review, design-review
- [ ] `all` - Install everything

## Step 2: Determine Paths and Format

Based on the tool and scope, determine the correct installation path:

### Claude Code
- **Global**: `~/.claude/commands/{command-name}.md`
- **Local**: `./.claude/commands/{command-name}.md`
- **Format**: Markdown file with prompt content, filename becomes `/command-name`

### Cursor
- **Global**: Not directly supported, use workspace settings
- **Local**: `.cursor/prompts/{command-name}.md` or add to `.cursorrules`
- **Format**: Markdown prompt files or rules integration

### Amp
- **Global**: `~/.config/amp/commands/{command-name}.md`
- **Local**: `.amp/commands/{command-name}.md`
- **Format**: Markdown with YAML frontmatter

### Gemini CLI
- **Global**: `~/.config/gemini/commands/`
- **Local**: `.gemini/commands/`
- **Format**: Text or markdown files

### Windsurf
- **Global**: `~/.windsurf/commands/`
- **Local**: `.windsurf/commands/`
- **Format**: Markdown files

### Aider
- **Global**: Shell aliases in `.bashrc`/`.zshrc` or `~/.aider/`
- **Local**: `.aider.conf.yml` or shell scripts
- **Format**: Configuration or wrapper scripts

## Step 3: Execute Installation

For each selected prompt:

### 3.1 Read the source file

Locate the source file in the incitaciones repository:
- Workflow prompts: `content/prompt-workflow-{name}.md`
- Task prompts: `content/prompt-task-{name}.md`

### 3.2 Understand the file structure

Each source file has this structure:
```
---
title: Human Readable Title
type: prompt
tags: [tag1, tag2]
tools: [claude-code, cursor, ...]  # Compatible tools
status: draft|tested|verified
version: X.Y.Z
---

# Title

## When to Use
[Documentation - DO NOT extract]

## The Prompt        <-- START HERE

```markdown          <-- Extract content INSIDE this code block
# Actual Prompt Content
...
```                   <-- END extraction here

## Example           <-- DO NOT extract (documentation)
## Expected Results  <-- DO NOT extract
## Variations        <-- DO NOT extract (but note for reference)
## Notes             <-- DO NOT extract
```

### 3.3 Extract the prompt content

**CRITICAL: Extract ONLY the content inside the code block under "## The Prompt"**

1. Find the line `## The Prompt`
2. Find the opening fence: ` ```markdown ` or ` ``` `
3. Extract everything AFTER the opening fence
4. Stop at the closing fence ` ``` `
5. Do NOT include the fences themselves
6. Preserve all internal formatting, indentation, and nested code blocks

**Example extraction from deliberate-commits.md:**

Source file contains:
```
## The Prompt

```markdown
# Commit Changes with Review

Create git commits for changes made during this session.
...
```
```

Extract only:
```
# Commit Changes with Review

Create git commits for changes made during this session.
...
```

### 3.4 Adapt for the target tool (if needed)

Depending on the tool, you may need to:
- **Claude Code**: Use as-is, markdown works directly
- **Cursor**: May need to wrap in specific format or add to .cursorrules
- **Amp**: Add YAML frontmatter if required
- **Aider**: Convert to aider convention format
- **Gemini CLI**: Adjust for gemini's expected format

Add context variable placeholders if the tool supports them:
- `{{file}}` - current file
- `{{selection}}` - selected text
- `{{cwd}}` - current working directory

### 3.5 Write to the correct location

1. Create the target directory if it doesn't exist
2. Write the extracted content to: `{target-path}/{command-name}.md`
3. Set appropriate file permissions (644 for files, 755 for directories)

### 3.6 For updates

1. Check if command already exists at target path
2. Read the existing file
3. Compare with new content (show diff if significant changes)
4. Backup existing to `{command-name}.md.backup`
5. Write new content
6. Report what changed

## Step 4: Verify and Report

After installation:

1. List all installed commands with their paths
2. Show how to invoke each command in the target tool
3. Note any prompts that couldn't be installed (with reasons)
4. Provide instructions for manual steps if any

## Tool-Specific Invocation Reference

| Tool | Invocation |
|------|------------|
| Claude Code | `/command-name` |
| Cursor | `@command-name` or via command palette |
| Amp | `/command-name` |
| Gemini CLI | `gemini --command name` or alias |
| Windsurf | Via command palette |
| Aider | `/command-name` or alias |

## Contextualizing Prompts

When installing to a specific repository, optionally:
- Add repository-specific context (tech stack, conventions)
- Reference local files (CONTRIBUTING.md, style guides)
- Adjust examples to match the project's domain

Ask: "Do you want me to contextualize these prompts for this repository?"

If yes, I will:
1. Read key repo files (README, CONTRIBUTING, etc.)
2. Detect tech stack and conventions
3. Add a "Repository Context" section to each installed prompt
```

---

## Example Usage

### Scenario: Installing essentials in Claude Code globally

**Input:**
- Tool: Claude Code
- Scope: Global
- Action: Fresh install
- Selection: essentials bundle

**Result:**
Creates these files:
- `~/.claude/commands/commit.md`
- `~/.claude/commands/debug.md`
- `~/.claude/commands/describe-pr.md`
- `~/.claude/commands/code-review.md`

Each invokable as `/commit`, `/debug`, `/describe-pr`, `/code-review`

---

## Mapping: Prompt Files to Command Names

| Command Name | Source File |
|--------------|-------------|
| commit | prompt-workflow-deliberate-commits.md |
| create-plan | prompt-workflow-create-plan.md |
| implement-plan | prompt-workflow-implement-plan.md |
| iterate-plan | prompt-workflow-iterate-plan.md |
| plan-tdd | prompt-workflow-plan-implement-verify-tdd.md |
| pre-mortem | prompt-workflow-pre-mortem-planning.md |
| create-handoff | prompt-workflow-create-handoff.md |
| resume-handoff | prompt-workflow-resume-handoff.md |
| rule-of-5 | prompt-workflow-rule-of-5-review.md |
| parallel-review | prompt-workflow-multi-agent-parallel-review.md |
| design-practice | prompt-workflow-design-in-practice.md |
| extract-prompt | prompt-workflow-extract-prompt-from-conversation.md |
| describe-pr | prompt-task-describe-pr.md |
| research-codebase | prompt-task-research-codebase.md |
| debug | prompt-task-systematic-debugging.md |
| code-review | prompt-task-iterative-code-review.md |
| plan-review | prompt-task-plan-review.md |
| research-review | prompt-task-research-review.md |
| issue-review | prompt-task-issue-tracker-review.md |
| design-review | prompt-task-design-review.md |
| universal-review | prompt-task-rule-of-5-universal.md |

---

## Notes

- Some tools may require restart or reload to recognize new commands
- Global installs may need elevated permissions on some systems
- The `essentials` bundle is recommended for first-time setup
- Updates preserve any local customizations in a `.backup` file

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-18 | Initial version with support for major AI coding tools |
