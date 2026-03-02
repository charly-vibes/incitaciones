# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 2026-03-01

#### Added - Test Friction as Design Diagnostic and OOP↔FP References

- **content/research-finding-test-friction-design-diagnostic.md** (v1.1.0) — Research finding synthesizing the diagnostic chain from Metz, GOOS, Norvig/Graham, Seemann, and the PBT community into a five-step pipeline: notice friction → identify smell → map to missing abstraction → refactor → verify tests simplify. Includes the full OOP↔FP/algebraic structure Rosetta Stone, Metz's message-boundary test contract, conditional testing mathematics, PBT as a second-order design signal, and OOP/FP path selection rule. Rule of 5 reviewed at v1.1.0.
- **content/references-oop-fp-pattern-equivalences.md** (v1.0.0) — Standalone lookup reference mapping all 23 GoF patterns to their FP/category-theory equivalents, with plain-language meanings, testing implications per row, Norvig's original language-feature absorption map (1996), inverse FP→OOP table with algebraic laws for PBT verification, testing impact summary, and full source links per mapping.

#### Added - Test Parameterization and PBT Pipeline Research

- **content/research-finding-test-parameterization-pbt-pipeline.md** (v1.0.0) — Research finding documenting a three-stage pipeline for extending the Abstraction Miner to test code: (1) Lazy Test cluster detection via structural isomorphism signals (same SUT, same assertion shape, only literals differ; Rule of Three threshold), (2) parameterization proposals with framework-specific syntax for Jest, pytest, Go table-driven, JUnit 5, and rstest, (3) property escalation from data table to property-based tests using a 7-type property taxonomy (Invariant, Round-trip, Idempotency, Commutativity, Monotonicity, Model-based, Metamorphic) and a decision tree for inferring generators. Includes function name priors as quick heuristics. Automatically included in site build via `content/research-*.md` glob.

### 2026-02-28

#### Added - Resonant Coding Refactoring Bundle

Three new prompt skills extracted from the "Improving LLM Code Refactoring Skills" research document and the existing `research-paper-resonant-coding-agentic-refactoring.md` synthesis, completing the integration plan defined in that research:

- **content/prompt-task-abstraction-miner.md** (v1.1.0) — Passive codebase scanner that detects semantic duplication (identical intent, different syntax) and proposes reusable abstractions without modifying files. Uses a 4-phase Fabbro Loop: Semantic Scanning → Cluster Analysis → Abstraction Proposal → Refactoring Blueprint. Advisory-only output; produces a prioritized refactoring backlog.
- **content/prompt-system-context-guardian.md** (v1.1.0) — System prompt that enforces architectural consistency during development. Requires a Pre-Generation Checklist (Inventory → Gap Analysis → Style Injection) before generating any code. Includes a Refusal Protocol that redirects architecture-violating requests toward resonant alternatives.
- **content/prompt-workflow-resonant-refactor.md** (v1.1.0) — Human-approved refactoring workflow with 5 phases: Impact Analysis → Shadow Test (baseline run) → Human Latch (APPROVE gate) → Atomic Execution (file-by-file, no commits) → Quality Gates. Uses `git reset --hard HEAD` for full rollback (working tree + index). Self-correction up to 3 attempts per file before rollback.
- **content/distilled/abstraction-miner.md** — Distilled version with zero-results handling and Needs Human Review section
- **content/distilled/context-guardian.md** — Distilled version with inventory-failure fallback
- **content/distilled/resonant-refactor.md** — Distilled version with correct rollback, baseline test run, no-commit directive

#### Changed - install.sh and manifest for refactoring bundle

- **install.sh** — Added `refactoring` bundle to `get_bundle_prompts` and `list_prompts`. Bundle installs `abstraction-miner`, `context-guardian`, `resonant-refactor`. Usage: `./install.sh --bundle refactoring`
- **content/manifest.json** — Registered 3 new prompts under `refactoring` bundle
- **content/research-paper-resonant-coding-agentic-refactoring.md** (v1.2.0) — Updated integration plan from TODO to done; extended related prompts section with links to all 3 new files

### 2026-02-08

#### Changed - Migrate from Commands to Skills

- **install.sh** — Rewritten to install prompts as Claude Code skills (`~/.claude/skills/<name>/SKILL.md`) by default. Each skill gets YAML frontmatter (`name`, `description`, `disable-model-invocation: true`) generated from `manifest.json`. Added `--format commands` flag for legacy flat-file format. Added `--uninstall` flag to clean up old `~/.claude/commands/incitaciones/` directory. Skills are now top-level (`/commit` instead of `/incitaciones/commit`).
- **.claude/skills/install-prompts/SKILL.md** — New skill replacing `.claude/commands/install-prompts.md`. Updated to reference skills directory structure and new install options.
- **.claude/commands/** — Removed in favor of `.claude/skills/` directory structure.
- **justfile** — Updated section header to "Skills Installation". Added `generate-skill` recipe to preview SKILL.md output.
- **README.md** — Updated installation docs: paths, usage examples, and commands reflect skills format.
- **content/manifest.json** — Bumped `schema_version` to `1.1` and `version` to `2026-02-08`.
- **content/meta-prompt-install-commands.md** — Updated Claude Code paths and invocation references to include skills format.

### 2026-01-13

#### Added - Universal Rule of 5 Implementation

- **prompt-task-rule-of-5-universal.md** - Universal implementation of Steve Yegge's original Rule of 5 that works for any domain (code, plans, research, issues, specs, documentation). Uses the original 5 editorial stages: Draft → Correctness → Clarity → Edge Cases → Excellence. Includes complete examples for 4 different domains.

#### Changed - Rule of 5 Documentation Updates

**All Rule of 5 prompts updated to v1.1.0+ with consistent references:**
- **research-paper-rule-of-5-multi-agent-review.md** (v1.2.0) - Distinguished Steve Yegge's actual gastown implementation (linear 5-stage) from extended parallel multi-agent variant. Added detailed documentation of original implementation with comparison tables and guidance on when to use each approach. Updated references to recommend universal prompt.
- **prompt-task-iterative-code-review.md** (v1.1.0) - Added "Original Variant" matching Steve's actual gastown stages alongside existing domain-focused variant. Clarified this is Steve's original approach to use for 80% of reviews. Added comparison table and gastown reference.
- **prompt-workflow-rule-of-5-review.md** (v1.1.0) - Clarified as "Extended Variant" not Steve's original. Added comparison table showing cost/benefit trade-offs. Updated to recommend original for most cases.
- **prompt-workflow-multi-agent-parallel-review.md** (v1.1.0) - Updated as most comprehensive extended variant. Added guidance on when to use vs. original approach. Added gastown references.
- **prompt-task-plan-review.md** (v1.1.0) - Clarified relationship to Steve's Rule of 5 principle. Uses domain-specific passes (Feasibility → Completeness → TDD → Ordering → Executability) while maintaining core iterative refinement approach.
- **prompt-task-research-review.md** (v1.1.0) - Clarified as adaptation of Rule of 5 principle for research. Uses research-specific passes (Accuracy → Completeness → Clarity → Actionability → Integration).
- **prompt-task-issue-tracker-review.md** (v1.1.0) - Clarified as adaptation of Rule of 5 principle for issue management. Uses issue-specific passes (Completeness → Scope → Dependencies → Alignment → Executability).

**Key improvements:**
- All files now correctly reference gastown implementation: https://github.com/steveyegge/gastown/blob/main/internal/formula/formulas/rule-of-five.formula.toml
- Clear distinction between Steve's original (75-85% detection, $0.40-0.60) and extended variants (85-92% detection, $0.80-1.20)
- Consistent cross-references between all Rule of 5 prompts
- Unified recommendation: use universal prompt for 80% of reviews, extended multi-agent only for critical systems

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
