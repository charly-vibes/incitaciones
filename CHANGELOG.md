# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 2026-04-07

#### Changed - Progressive Disclosure Analytics Schema

- **content/manifest.json** + **_site/manifest.json** — Added `skill_format` and initial `eval` metadata for representative progressive-disclosure skills so analytics can track stages, references, and success/failure signals without inflating runtime `SKILL.md` files.
- **scripts/analyze-traces.js** — Extended trace analysis to distinguish single-file vs. progressive-disclosure skill activations, emit reference and stage-hint metrics, enrich session records with `references_used` and `stage_hints`, summarize labeled reference effectiveness alongside prompt effectiveness, improve extraction precision with slash-command activation, persistent active-skill windows, and exact file-path reference matching, and split session-level adoption counts from message-level evidence-hit counts in the final report.
- **README.md** + **content/research-finding-skill-progressive-disclosure.md** — Documented the new evaluation-oriented skill design pattern and the trace fields it enables.

#### Changed - Progressive Disclosure Rollout Across Distilled Skills

- **content/distilled/** — Converted `describe-pr`, `create-plan`, `implement-plan`, `iterate-plan`, `research-codebase`, `create-handoff`, `resume-handoff`, `design-review`, and `issue-review` from unified distilled files into multi-file skills with compact `SKILL.md` entrypoints and on-demand `references/`.
- **content/manifest.json** + **_site/manifest.json** — Updated the affected prompt registrations to point at `content/distilled/<name>/SKILL.md` so installers and the site build resolve the new runtime layout correctly.
- **content/prompt-task-research-codebase.md** — Replaced `find` and `grep -r` examples with `rg`-based search guidance to match repository agent conventions.
- **content/prompt-workflow-create-plan.md** + **content/prompt-workflow-iterate-plan.md** — Removed stale references to a nonexistent `AskUserQuestion` tool and rewrote those instructions in tool-agnostic terms.
- **content/research-finding-skill-progressive-disclosure.md** — Generalized the progressive-loading guidance so it refers to runtime-appropriate file-reading tools instead of a specific API.

#### Added - Progressive Disclosure Pattern for Complex Skills

- **content/distilled/** — Refactored complex skills (`rule-of-5-universal`, `ux-dx-evaluation-diagnostician`) into a modular structure with a core `SKILL.md` and an on-demand `references/` directory.
- **install.sh** — Updated to support multi-file skills by recursively copying reference directories while preserving the core `SKILL.md` as the main entry point.
- **site/build.sh** — Updated the static site generator to merge multi-file skills into unified `.md` documents for easy web reference and inclusion in `llms-full.txt`.
- **content/research-finding-skill-progressive-disclosure.md** — Documented the pattern, its benefits for context optimization, and the implementation details.
- **AGENTS.md** + **README.md** — Updated documentation to guide developers on creating and using single-file vs. multi-file distilled prompts.

#### Added - Trace Insights and Session Labeling Workflow

- **scripts/trace-insights.js** — Added a thin wrapper that auto-detects local trace histories, runs the analyzer with cache reuse, prints a compact markdown summary, and writes reusable artifacts to `.cache/trace-insights/`.
- **scripts/analyze-traces.js** — Added normalized session-record export, manual label ingestion, unlabeled-session queue export, and labeled effectiveness summaries so trace processing can move from raw usage counts toward prompt-effectiveness analysis.
- **justfile** — Added `trace-insights` for the simple “process traces -> get insights” workflow.
- **README.md** + **content/example-trace-analysis-usage.md** — Documented the wrapper, session-record outputs, label-queue generation, and label-join workflow.
- **examples/trace-analysis/labels-sample.jsonl** — Added a sample labels file for verifying the effectiveness-analysis path end to end.

#### Added - Cross-Agent Trace Analysis

- **scripts/analyze-traces.js** — Added a local trace analysis CLI for Claude, Gemini, Codex, and other agent-tool histories. It supports direct path input and `--auto-detect`, extracts prompt/tool/model/workflow signals, and now uses an incremental cache at `.cache/trace-analysis-cache.json` keyed by file metadata with analyzer/manifest version invalidation.
- **justfile** — Added `analyze-traces` and `analyze-traces-auto` recipes for running the analyzer against explicit paths or detected local history locations.
- **README.md** — Documented trace analysis usage, auto-detection behavior, heuristic report semantics, and cache behavior.
- **content/example-trace-analysis-usage.md** — Added a usage example describing the analyzer’s outputs and intended interpretation.
- **examples/trace-analysis/** — Added sample Claude, Codex, and Gemini trace fixtures for local verification of parsing, reporting, and cache behavior.

#### Fixed - Manifest-Driven Publishing Workflow

- **justfile** — `just new prompt` now scaffolds a distilled companion file and prints the required manifest publication steps. `validate` now checks stricter frontmatter/status rules, and `sync-manifest` now fails when prompt or distilled files exist on disk without manifest registration.
- **install.sh** — `--list` and `--bundle all` now derive prompt availability from `content/manifest.json`, making the manifest the source of truth for installation and listing behavior.
- **content/manifest.json** + **_site/manifest.json** — Registered `rigidity-diagnostician` and `testability-implementability-evaluator`, keeping shipped prompts aligned with the manifest and site output.
- **README.md**, **CONTRIBUTING.md**, **AGENTS.md** — Updated contributor guidance so the documented workflow matches the actual scaffold, validation, and explicit `git add` policy.
- **content/example-rule-of-5-repository-review.md** — Added a real repository-review example showing how the Rule of 5 workflow was applied to this repository.

### 2026-03-03

#### Added - Bias Research Framework

- **content/research-paper-bias-detection-prevention-mitigation.md** (v1.0.0) — Synthesis of multidisciplinary methodologies for bias detection (Aequitas, DAGs, Red Teaming), prevention (Pre-Mortem, psychological debiasing), and mitigation (Context Engineering, Rule of 5). Establishes a taxonomy of systemic, statistical, and cognitive biases and provides actionable interventions for high-stakes sociotechnical systems.
- **content/prompt-task-systematic-bias-audit-and-mitigation.md** (v1.0.0) — Actionable prompt skill implementing the 4-phase S-BAM protocol: Taxonomy Diagnostic, Adversarial Red Teaming, Context Recalibration, and Rule of 5 Refinement.
- **content/distilled/bias-audit.md** — Token-optimized version of the S-BAM prompt with "Needs Human Review" safety gates.

#### Added - Test Quality Prompt Bundle

Two new actionable prompt skills operationalizing the test friction and test parameterization research, plus a new `testing` bundle grouping all test-quality tools:

- **content/prompt-task-test-friction-diagnostician.md** (v1.1.0) — Advisory-only diagnostic skill that runs the five-step pipeline from `research-finding-test-friction-design-diagnostic.md` on any test+production file pair: (1) Notice the Friction — GOOS-sourced friction signals, (2) Identify the Smell — friction→smell mapping table with attribution footnotes, (3) Map to Missing Abstraction — full OOP/FP column selection with mixed-paradigm tiebreaker, (4) Refactor Proposal — specific refactoring moves, Beck's constraint, (5) Success Signals — acceptance criteria for the refactoring. Includes signal-consolidation rule for multiple signals pointing to the same root smell. Rule of 5 reviewed at v1.1.0.
- **content/prompt-task-test-abstraction-miner.md** (v1.1.0) — Advisory-only test-mode extension of the Abstraction Miner. Four phases: Phase 0 (detect framework + PBT library; prose-only output if no PBT library found), Phase 1 (Lazy Test cluster detection with cross-file counting and N ≥ 3 threshold), Phase 2 (invariant/variant split), Phase 3 (parameterized test proposal in detected framework syntax — see Framework Reference section), Phase 4 (property escalation using 7-type taxonomy decision tree and function-name priors). Rule of 5 reviewed at v1.1.0.
- **content/distilled/test-friction.md** — Distilled version with GUARD block, mixed-paradigm tiebreaker, signal-consolidation rule, and Needs Human Review section
- **content/distilled/test-abstraction-miner.md** — Distilled version with GUARD block (data-variation-only collapse, prose-only PBT when no library), cross-file cluster counting, and Needs Human Review section

#### Changed - manifest, install.sh for testing bundle

- **content/manifest.json** + **_site/manifest.json** — Registered `test-friction` and `test-abstraction-miner` prompts; added new `testing` bundle (`tdd`, `test-friction`, `test-abstraction-miner`); added both prompts to `refactoring` bundle; bumped version to `2026-03-03`
- **install.sh** — Added `testing` bundle to `get_bundle_prompts`, `list_prompts`, help text, and validation error message

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
