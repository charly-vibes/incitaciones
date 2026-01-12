# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 2026-01-12

#### Added - Development Workflow Prompts

- **prompt-workflow-deliberate-commits.md** - Comprehensive git commit workflow with mandatory review, logical grouping, and contextual messages (no AI attribution)
- **prompt-workflow-create-handoff.md** - Create context handoff documents for transferring work between AI sessions with preserved learnings and priorities
- **prompt-workflow-resume-handoff.md** - Resume work from handoff documents with verification, adaptation to changes, and context restoration
- **prompt-task-research-codebase.md** - Pure documentation research without suggestions or critiques, focusing on understanding existing code
- **prompt-workflow-plan-implement-verify-tdd.md** - Test-Driven Development workflow with Red-Green-Refactor cycle and phased implementation
- **prompt-task-describe-pr.md** - Generate comprehensive pull request descriptions with context, testing guidance, and breaking changes
- **prompt-workflow-extract-prompt-from-conversation.md** - Meta prompt for extracting reusable prompts from successful AI conversations

These prompts are adapted from fabbro agent system patterns, HumanLayer workflows, and Advanced Context Engineering principles. They emphasize deliberate workflows, context preservation, and structured development practices.

#### Added - Code Review Research and Prompts

- **research-paper-rule-of-5-multi-agent-review.md** - Comprehensive framework combining Steve Yegge's Rule of 5 with multi-agent parallel architecture for code review
- **research-paper-cognitive-architectures-for-prompts.md** - Analysis of cross-disciplinary methodologies (Disney Strategy, Six Hats, Red Teaming, Pre-Mortem, Medical Diagnosis, Aviation CRM, Legal Review) adapted for prompt engineering
- **prompt-task-iterative-code-review.md** - Practical implementation of Rule of 5 for solo code review with convergence criteria
- **prompt-workflow-multi-agent-parallel-review.md** - Advanced multi-agent workflow for comprehensive code review (Wave/Gate architecture)

These prompts and research synthesize methodologies from medicine, military, aviation, law, and engineering to create structured AI-driven code review processes achieving 85-92% defect detection.

#### Earlier Today

- Initial repository setup
- Created AGENTS.md with repository structure and philosophy
- Created README.md with meta prompt for LLMs
- Added flat content structure with single directory
- Created template files for prompts, research, and examples
- Added justfile with AI-friendly commands
- Implemented fzf-based interactive search
- Added validation and statistics commands
- Set up changelog tracking

## [0.1.0] - 2026-01-12

### Added

- Repository structure and documentation
- Template system for consistent content creation
- Command automation via justfile
- Content validation tools
- Interactive search functionality

### Documentation

- AGENTS.md - Repository overview and structure
- README.md - Quick start and meta prompt for LLMs
- CONTRIBUTING.md - Content guidelines
- Template files for all content types

---

## How to Update This Changelog

Use the justfile command:

```bash
just changelog "Your change description"
```

Or manually add entries under the "Unreleased" section following this format:

```markdown
## [Unreleased]

### YYYY-MM-DD

- Change description
```

## Categories

- **Added** - New features or content
- **Changed** - Changes to existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security improvements or fixes
