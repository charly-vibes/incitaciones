---
title: Install Prompts as Commands
type: prompt
subtype: meta
tags: [installation, setup, configuration, cli-tools, commands]
tools: [claude-code, cursor, amp, gemini-cli, windsurf, aider]
status: draft
created: 2026-01-18
updated: 2026-01-20
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

Instead of a fixed list, you will dynamically discover the available prompts to ensure the list is always up-to-date.

**Discovery Process:**

1.  **Scan the `content/` directory** for all prompt files. These are files that start with `prompt-workflow-` or `prompt-task-` and end with `.md`.
2.  **For each file, determine its command name and type:**
    *   The **type** is either `workflow` or `task`, based on the filename prefix.
    *   The **command name** is derived by removing the prefix (`prompt-workflow-` or `prompt-task-`) and the `.md` suffix.
    *   *Example*: The file `content/prompt-workflow-deliberate-commits.md` corresponds to a `workflow` command named `deliberate-commits`.
    *   Keep a mapping of `command name` -> `full file path`.
3.  **Ask the user for their selection:**
    *   Present the discovered commands, grouped by `Workflows` and `Tasks`.
    *   Also offer the following bundles. When a bundle is selected, you'll install all the corresponding commands.

**Bundles** (preset collections):
- [ ] `essentials` - A good starting set: `deliberate-commits`, `systematic-debugging`, `describe-pr`, `iterative-code-review`
- [ ] `planning` - For project planning: `create-plan`, `implement-plan`, `iterate-plan`, `plan-review`
- [ ] `reviews` - For code and design reviews: `rule-of-5-review`, `iterative-code-review`, `plan-review`, `design-review`
- [ ] `all` - Install all discovered prompts.

## Step 2: Determine Paths and Format

A key goal is to maintain a **single source of truth** for all prompts within this repository, especially for local (per-project) installations.

### Local Installation (Recommended)

When installing locally, all prompts are placed in a single, canonical directory:

- **Canonical Path**: `./.agents/commands/incitaciones/`

To ensure your specific tool can find these commands, the installation process will **create a symbolic link** from your tool's default local command directory (`.{tool}/commands`) to the *parent of the canonical path* (`../.agents/commands`). This enables namespaced invocation.

**Example**: For Claude Code, the installer will ensure that `./.claude/commands` is a symlink pointing to `../.agents/commands`.

This keeps all prompts in one place, preventing duplication and ensuring consistency across all tools.

### Global Installation

Global installations use tool-specific paths in your user home directory. Note that this may lead to conflicts if different projects use different versions of the same prompt.

---

### Tool-Specific Path Details

#### Claude Code
- **Global**: `~/.claude/commands/{command-name}.md`
- **Local**: The tool-specific directory (`./.claude/commands`) will be symlinked to the canonical path.
- **Format**: Markdown file.

#### Cursor
- **Global**: Not directly supported; use workspace settings.
- **Local**: The tool-specific directory (`./.cursor/prompts`) will be symlinked to the canonical path.
- **Format**: Markdown prompt files.

#### Amp
- **Global**: `~/.config/amp/commands/{command-name}.md`
- **Local**: The tool-specific directory (`./.amp/commands`) will be symlinked to the canonical path.
- **Format**: Markdown with YAML frontmatter.

#### Gemini CLI (or any compatible Agent CLI)
- **Global**: `~/.config/agents/commands/incitaciones/`
- **Local**: Uses `./.agents/commands/incitaciones/` directly. This is the canonical path, so no symlink is needed.
- **Format**: Text or markdown files.

#### Windsurf
- **Global**: `~/.windsurf/commands/`
- **Local**: The tool-specific directory (`./.windsurf/commands`) will be symlinked to the canonical path.
- **Format**: Markdown files.

#### Aider
- **Global**: Shell aliases in `.bashrc`/`.zshrc` or `~/.aider/`.
- **Local**: `.aider.conf.yml` or shell scripts. For local scope, it's recommended to add a command to `.aider.conf.yml` that sources or runs scripts from the canonical path (`./.agents/commands/incitaciones/`).
- **Format**: Configuration or wrapper scripts.

## Step 3: Execute Installation

For each selected prompt:

### 3.1 Read the Source Prompt File
Using the mapping you created in Step 1 (Q4), find the full path to the source file for each selected command. Read the content of that file.

### 3.2 Extract the Core Prompt Content
Extract ONLY the content inside the first ` ```markdown ` code block found under the `## The Prompt` section within the source file. Do not include the markdown code fences themselves. This extracted content is the core, untuned prompt that will be installed.

### 3.3 Determine Target Write Path
- For **Global** scope, the path is the tool-specific global path.
- For **Local** scope, the path is ALWAYS the canonical path: `./.agents/commands/incitaciones/{command-name}.md`.

### 3.4 Ensure Canonical Directory and Symlinks (Local Installs Only)

Before writing any files for a local install, perform these checks:

1.  **Create Canonical Directory**:
    - Ensure the directory `./.agents/commands/incitaciones` exists. If not, create it with permissions `755`.

2.  **Handle Tool-Specific Directories**:
    - For each selected tool (except Gemini CLI, which uses the canonical path directly), determine its local command directory (e.g., `./.claude/commands`, `./.cursor/prompts`).
    - Let's call this `TOOL_PATH`.

3.  **Check and Configure `TOOL_PATH`**:
    - **If `TOOL_PATH` does not exist**: Create the necessary parent directories (e.g., `./.claude`) and then create a relative symbolic link from `TOOL_PATH` to the parent of the canonical directory (to enable namespaced invocation).
      - Example: `ln -s ../.agents/commands ./.claude/commands`
    - **If `TOOL_PATH` exists and is a regular directory**: 
      - **MOVE** any existing files from `TOOL_PATH` to `./.agents/commands/incitaciones/` to consolidate them. Announce which files were moved.
      - **Remove** the now-empty `TOOL_PATH` directory.
      - **Create** the symbolic link as described above.
    - **If `TOOL_PATH` exists and is already a correct symlink**: Do nothing; the setup is correct.

### 3.5 Write the Prompt File
1.  Adapt the extracted prompt for the target tool if needed (e.g., add frontmatter for Amp).
2.  **Contextualize to Repository (if needed)**: If the prompt requires specific repository context (e.g., file paths, common patterns), use the `research-codebase` task to generate a repository-specific preamble or examples.
3.  **Distill for Execution**: Apply the `prompt-task-distill-prompt.md` to convert the developer-facing prompt into a concise, token-efficient LLM-facing prompt for execution.
4.  Write the final content to the target path determined in Step 3.3.
5.  Set file permissions to `644`.

---

### 3.6 For updates
1.  The process is the same as a fresh install.
2.  The symlinking logic in Step 3.4 will automatically handle moving any old, non-symlinked commands to the canonical directory.
3.  When writing the file to the canonical path, you can offer to show a diff or create a backup (`.backup`) of the old version before overwriting.

## Step 4: Verify and Report

After installation:

1. List all installed commands with their paths
2. Show how to invoke each command in the target tool
3. Note any prompts that couldn't be installed (with reasons)
4. Provide instructions for manual steps if any

## Tool-Specific Invocation Reference

| Tool | Invocation |
|------|------------|
| Claude Code | `/incitaciones/command-name` |
| Cursor | `@incitaciones/command-name` or via command palette |
| Amp | `/incitaciones/command-name` |
| Gemini CLI | `gemini --command incitaciones/name` or alias |
| Windsurf | Via command palette (e.g., `incitaciones/command-name`) |
| Aider | `/incitaciones/command-name` or alias |

## Example Usage

### Scenario: Installing essentials in Claude Code globally

**Input:**
- Tool: Claude Code
- Scope: Global
- Action: Fresh install
- Selection: essentials bundle

**Result:**
Creates these files:
- `~/.claude/commands/deliberate-commits.md`
- `~/.claude/commands/systematic-debugging.md`
- `~/.claude/commands/describe-pr.md`
- `~/.claude/commands/iterative-code-review.md`

Each invokable as `/deliberate-commits`, `/systematic-debugging`, `/describe-pr`, `/iterative-code-review`

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
