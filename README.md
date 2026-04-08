# Incitaciones 🤖

A collection of reusable prompts and best practices for CLI LLM tools.

## Install

Clone and install prompts as skills for Claude Code, Amp, Gemini CLI, and other tools:

```bash
git clone https://github.com/charly-vibes/incitaciones.git
cd incitaciones
./install.sh
```

**Install options:**

```bash
./install.sh --bundle essentials    # Core prompts only
./install.sh --bundle planning      # Planning workflows
./install.sh --bundle reviews       # Review prompts
./install.sh --bundle documentation # Documentation tools
./install.sh --format commands     # Legacy flat-file format for other tools
./install.sh --list                # Show available prompts
./install.sh --help                # Show all options
```

**After installation:**
```
/commit           # Deliberate commit workflow
/debug            # Systematic debugging
/create-plan      # Create implementation plans
/code-review      # Iterative code review
```

Skills are installed to `~/.agents/skills/` and copied to tool-specific directories (Claude Code, Amp, Gemini CLI, Cursor, Windsurf, Zed) when detected.

## Quick Start

```bash
# Browse content
ls content/

# Find prompts about a topic
just find refactoring

# Create new prompt scaffold
just new prompt "Your Task Name"

# Interactive search with fzf
just search
```

## Structure

Everything lives in `content/` with descriptive filenames:

- `prompt-*.md` - Reusable prompts (source)
- `distilled/` - Optimized prompts for agent consumption (single file or multi-file)
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

# Skills installation
just install             # Run ./install.sh with any flags you pass through
just list-distilled      # List all distilled prompts
just validate-distilled  # Validate distilled prompts
just list-bundles        # Show available bundles
just sync-manifest       # Validate manifest references and sync _site/manifest.json
just generate-skill NAME # Preview SKILL.md output for a prompt
just analyze-traces PATH # Analyze trace exports from agent tools
just analyze-traces-auto # Auto-detect local CLI history locations
just trace-insights      # Process traces and write insight artifacts
```

## Trace Analysis

You can analyze exported traces from Claude, Gemini, Codex, AmpCode, and OpenCode with:

```bash
just analyze-traces examples/trace-analysis
```

If your histories live in the default local CLI directories, use auto-detection:

```bash
just analyze-traces-auto
```

Or directly:

```bash
node scripts/analyze-traces.js --auto-detect --format markdown
```

For the simplest workflow, use the wrapper command:

```bash
just trace-insights
```

That will:

- auto-detect local trace sources
- print a readable markdown summary
- write `.cache/trace-insights/latest-report.json`
- write `.cache/trace-insights/session-records.jsonl`
- write `.cache/trace-insights/label-queue.jsonl`

The analyzer now uses an incremental cache at `.cache/trace-analysis-cache.json`.
Unchanged files are reused automatically on later runs. Use `--no-cache` if you want a full recomputation.

It can also emit normalized session records and join manual labels:

```bash
node scripts/analyze-traces.js \
  --auto-detect \
  --session-records-out /tmp/session-records.jsonl \
  --label-queue-out /tmp/label-queue.jsonl
```

To join labels back into the analysis:

```bash
node scripts/analyze-traces.js \
  --auto-detect \
  --labels examples/trace-analysis/labels-sample.jsonl \
  --format markdown
```

Or with the wrapper:

```bash
just trace-insights --labels examples/trace-analysis/labels-sample.jsonl
```

This scans JSON, JSONL, NDJSON, log, text, and markdown exports, then reports:

- provider mix
- prompt references matched against `content/manifest.json`
- skill format counts (`single-file` vs `progressive-disclosure`)
- progressive-disclosure reference mentions and stage hints
- slash commands
- tool and model usage
- prompt-to-tool pairs
- workflow transitions
- heuristic session outcomes
- rough conclusions across the analyzed traces

For raw JSON output:

```bash
node scripts/analyze-traces.js examples/trace-analysis --format json
```

The new session-level signals are heuristic, not authoritative:

- `prompt -> tool` pairs estimate when a prompt mention actually led to tool execution
- `workflow transitions` show common session shapes like `prompt -> tool` or `user -> assistant`
- `outcomes` classify sessions as `succeeded`, `failed`, `needs_input`, or `unknown` from assistant language

This is strongest for comparative usage analysis, not for hard evaluation of prompt quality.

Normalized session records include fields such as:

- `session_id`
- `provider`
- `model`
- `task_type`
- `prompts_used`
- `skill_formats`
- `progressive_skills_used`
- `references_used`
- `stage_hints`
- `tools_used`
- `tests_run_or_mentioned`
- `verification_present`
- `commit_created`
- `tokens_total`
- `turn_count`
- `outcome_guess`
- `first_user_excerpt`
- `last_assistant_excerpt`

The label queue is intended for manual annotation. Each queued record includes suggested questions so you can build a labeled evaluation set over time.

For progressive-disclosure skills, the analyzer now reads optional manifest metadata such as `skill_format`, `eval.stages`, and `eval.references`. That makes it possible to compare not just prompt usage, but also which stages and reference files were actually involved in successful sessions.

The aggregate report now separates adoption from evidence:

- `Top Skills By Session` and `Skill Formats By Session` count each skill at most once per session.
- `Top References By Session` and `Top Stages By Session` count whether a reference or stage appeared in a session.
- `Skill Evidence Hits`, `Top Reference Evidence Hits`, and `Top Stage Evidence Hits` count repeated detections across messages and tool inputs.

Use the session-level sections for effectiveness comparisons. Use the evidence-hit sections to understand how often the analyzer observed supporting signals.

Current auto-detected sources include common local paths such as:

- `~/.claude/projects`
- `~/.gemini/tmp/**/chats/session-*.json`
- `~/.codex/history.jsonl`
- `~/.codex/log/codex-tui.log`

AmpCode and OpenCode are only included when conversation-like files are found.

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
# Edit content/distilled/incremental-refactoring.md (or create a directory for multi-file)
# Add prompt text, examples, and distilled runtime form
# Register the prompt in content/manifest.json
# Run just validate-distilled && just sync-manifest
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
# Checks required metadata, status values, and related links
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


---

## A note on authorship

All the code in this repository was generated by a large language model. This is not a confession, nor an apology. It's a fact, like the one that says water boils at a hundred degrees at sea level: neutral, technical, and with consequences one discovers later.

What the human did is what tends to happen before and after things come into existence: thinking. Reviewing requirements, arguing about edge cases, understanding what needs to be built and why, deciding how the system should behave when reality —which is capricious and does not read documentation— confronts it with situations nobody anticipated. The hours of planning, of design, of reading specifications until exhaustion dissolves the boundary between understanding and hallucination.

The LLM writes. The human knows what it should say.

There is a distinction, even if looking at the commit history makes it hard to find. The distinction is that a machine can produce correct code without understanding anything, the same way a calculator can solve an integral without knowing what time is. Understanding what that integral is *for*, whether it actually solves the problem, whether the problem was the right problem to begin with — that remains human territory. For now.

*[Leer en español](https://charly-vibes.github.io/charly-vibes/)*
