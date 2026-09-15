---
title: File Headers (Self-Describing Source Files)
type: prompt
tags: [documentation, architecture, modularity, code-quality, system-prompt, context-engineering]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-09-15
updated: 2026-09-15
version: 1.0.0
related: [prompt-system-context-guardian.md, prompt-task-modularity-diagnostician.md, prompt-workflow-resonant-refactor.md, prompt-task-iterative-code-review.md]
source: original
---

# File Headers (Self-Describing Source Files)

## Problem

Agents (and humans) joining a codebase must reverse-engineer the intent of every file: read the implementation, follow imports, dig through issues. This is expensive, error-prone, and hides design rationale — the *why* behind a file's shape — which is exactly what prevents accidental re-fragmentation of modules. A file that cannot be described in one sentence is usually a file that should not be one file.

## When to Use

Install this as a project convention (system prompt, AGENTS.md/CLAUDE.md section, or standalone skill) so that every source file is self-describing.

**Best for:**
- Any codebase where agents write or modify code
- Projects wanting enforced modularization: header cohesion as a living diagnostic
- Teams that want design rationale recorded where the design lives — in the file

**Do NOT use when:**
- Greenfield throwaway prototypes with no maintenance intent
- Codebases with an existing, equivalent standard (e.g., mandated module docstrings) — adopt that instead of a second convention

## The Prompt

````
# AGENT SKILL: FILE_HEADERS

## ROLE

You enforce file-header documentation on source code. Every source file must be self-describing: an agent opening any file must learn what it does and why it exists without reading the implementation or hunting for context.

## HEADER FORMAT

Adapt the comment syntax to the language (`#`, `//`, `--`, `"""docstring"""`, or a top doc comment):

```
# Purpose: <one sentence — what this file does and for whom>
# Responsibilities:
# - <bullet 1 — the cohesion contract; one concern per bullet>
# - <bullet N>
# Rationale: <latest design decision and why, with issue/PR link>
#   <earlier rationale entries belong in the issue tracker / git history>
```

## RULES

1. **Complete on creation.** Every NEW source file opens with a full header before any logic is written.
2. **Update on change.** When a modification changes what a file does or why, update the header in the same change. A stale header is worse than none — it actively misleads. Behavior-preserving edits (renames, formatting, refactors that don't alter the contract) leave the header untouched.
3. **One sentence, or split.** If the Purpose cannot be stated in one sentence, the file mixes concerns. Flag it for splitting rather than writing a vague header (see modularity-diagnostician).
4. **Rationale is a ledger pointer, not a ledger.** Keep only the latest entry plus its issue/PR link. Full decision history lives in the issue tracker and git.
5. **Scope.** Source files only: modules, classes, scripts, routes, components, tests — anything containing logic or project-defined structure. Exclusions: generated files, vendored code, config, lockfiles, docs, build artifacts, one-line re-exports.

## AUDIT

To find files missing headers:

```bash
# Exclude vendored, generated, and config paths from the audit
grep -rLE "(Purpose:|@purpose)" --include=<source-extensions> .
```

Every hit is a gap. Run this in CI or as part of periodic housekeeping.

## OUTPUT FORMAT

When adding or updating headers, show: file → header block.
When a file fails Rule 3 (undescribable), report it as a modularity finding listing the offending concerns.

## VERIFICATION CHECKLIST

- [ ] New files: header present and complete before logic
- [ ] Modified files: header updated iff the contract changed
- [ ] Purpose is one sentence (no vague "Utilities and helpers" headers)
- [ ] Rationale cites an issue/PR link
- [ ] No headers on excluded file types
````

## Example

**Before** (new module, no header):

```python
def retry(fn, times=3, delay=1.0): ...
```

**After:**

```python
# Purpose: Retry flaky network calls with exponential backoff for the sync engine.
# Responsibilities:
# - Retry a callable up to N times with exponential delay
# - Raise RetryExhausted after the final attempt, preserving the last exception
# Rationale: extracted from sync.py after shotgun-surgery diagnosis (bd-142); kept
# dependency-free so it can back both the API client and the webhook sender.
def retry(fn, times=3, delay=1.0): ...
```

**Modularity finding** (Rule 3 violation):

```
utils/helpers.py — Purpose not statable in one sentence.
Concerns found: date formatting, HTTP wrappers, JSON encoding, feature flags.
Recommendation: split by concern; headers per resulting file.
```

## Integration With Other Skills

This convention is enforced at two boundaries:

| Boundary | Skills | Role |
|---|---|---|
| Creation time | `context-guardian`, `tdd`, `implement-plan`, `create-issues` | Header written when the file is written; tickets carry it as acceptance criterion |
| Review time | `issue-review` (pass 5), `code-review` (criteria), `modularity-diagnostician`, `resonant-refactor` | Header presence, accuracy, and describability checked; undescribable = cohesion violation |

Pair with `context-guardian`: it governs *how* code is written (reuse), this governs *what it says about itself* (purpose + rationale).

## Variations

**Minimal version (for AGENTS.md, CLAUDE.md, or .cursorrules):**

```
Every source file opens with: Purpose (one sentence), Responsibilities (bullets),
Rationale (latest decision + issue link; history stays in the tracker). Update the
header whenever a change alters what the file does or why. Can't describe the file
in one sentence? Split it. No headers on generated/vendored/config files.
```

**Docstring-first stacks (Python/Rust):** put the header in the module docstring; the `Rationale` field becomes a `# Design notes` section.

## Notes

Rule 2 (update-on-change) is where most header conventions die — headers rot and reviewers stop trusting them. The enforcement answer is to make header accuracy a review-time check (code-review criteria, issue-review pass 5), not a one-time writing effort.

Rule 3 is what elevates this from documentation to modularization tooling: the header is a *cohesion contract*. If the contract needs three sentences, the module is doing three jobs.

## Version History

- 1.0.0 (2026-09-15): Initial convention distilled from Rule-of-5-reviewed investigation into agent-facing file documentation, modularization enforcement, and rationale tracking
