# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 2026-01-12

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
