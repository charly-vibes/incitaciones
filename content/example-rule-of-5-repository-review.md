---
title: Rule of 5 Review of the Incitaciones Repository
type: example
subtype: conversation
tags: [rule-of-5, repository-review, quality-assurance, documentation, manifest]
tools: [claude-code]
project: prompts-repository
status: tested
created: 2026-04-07
updated: 2026-04-07
version: 1.0.0
related:
  - prompt-task-rule-of-5-universal.md
  - prompt-task-research-codebase.md
  - prompt-task-review-documentation.md
source: real-project
---

# Rule of 5 Review of the Incitaciones Repository

## Context

The repository had accumulated drift between its documented workflow, its manifest-driven installation pipeline, and the files actually present on disk. A full repository review was requested to identify structural, correctness, clarity, and edge-case issues before tightening the maintenance workflow.

## Goal

Use the universal Rule of 5 process to review the repository as a complete artifact, then turn the findings into concrete fixes in the automation and documentation.

## Approach

The review combined broad repository inspection with targeted checks against the manifest, installer, and contributor docs.

### Prompts Used

- [prompt-task-rule-of-5-universal.md] - Structured the five-stage review.
- [prompt-task-research-codebase.md] - Gathered repository shape and workflow context without jumping to code changes.
- [prompt-task-review-documentation.md] - Checked whether contributor-facing docs matched actual commands and policies.

## Process

### Step 1: Review repository shape

**Prompt given:**
```text
Review this whole repo using the universal Rule of 5 workflow.
```

**AI response:**
```text
The initial pass focused on repository shape, manifest authority, install behavior, and contributor documentation.
```

**Outcome:**
The review established that the repository had a coherent structure, but the prompt creation flow did not reliably carry new prompts through the manifest and install pipeline.

### Step 2: Validate manifest and installer behavior

**Prompt given:**
```text
Check whether the manifest is actually authoritative for listing, installation, and site generation.
```

**AI response:**
```text
The installer used manifest metadata for bundles, but still derived the "all" collection from files on disk. That allowed unregistered distilled prompts to appear and install outside the manifest contract.
```

**Outcome:**
A missing manifest entry for `rigidity-diagnostician` was confirmed, and `install.sh` was identified as partially bypassing the manifest.

### Step 3: Compare docs to behavior

**Prompt given:**
```text
Find contradictions between AGENTS.md, README.md, CONTRIBUTING.md, and the automation in justfile/install.sh.
```

**AI response:**
```text
The docs promised stricter commit discipline and a more complete content workflow than the commands actually enforced.
```

**Outcome:**
The review found a direct contradiction around bulk `git add`, stale bundle counts in the README, and missing documentation for the manifest and distilled registration steps.

## Results

The review produced three high-value outcomes:

- It identified the missing manifest registration for a shipped prompt.
- It showed that the `just new prompt` workflow scaffolded source content without guaranteeing publication readiness.
- It turned documentation drift into concrete fixes across the README, contributor guide, and AGENTS instructions.

## What Worked Well

- The five-stage review structure prevented premature nitpicking and surfaced the architectural issue first.
- Verifying the repo against its own scripts was more reliable than reading docs in isolation.
- Keeping findings tied to exact files and lines made the repair pass straightforward.

## What Didn't Work

- Running `just` directly inside the sandbox was unreliable because of temp directory restrictions.
- The repository had enough documentation drift that a single-file fix would have left the system inconsistent.

## Lessons Learned

1. A manifest is only authoritative if every install and listing path goes through it.
2. Prompt repositories need scaffold-to-publish workflows, not just scaffold-to-draft workflows.
3. Documentation quality should be checked against executable commands, not only against intent.

## Improvements to Prompts

The review reinforced that repo-level review prompts work best when they explicitly check:

- source-of-truth boundaries
- installation and publication paths
- docs-versus-automation consistency

## Artifacts

- Repository review findings from the Rule of 5 pass
- Follow-up fixes to `justfile`, `install.sh`, `README.md`, `CONTRIBUTING.md`, and `AGENTS.md`

## References

- [prompt-task-rule-of-5-universal.md] - Review framework used for the initial audit
- [prompt-task-research-codebase.md] - Discovery workflow for repo inspection
- [prompt-task-review-documentation.md] - Documentation review workflow

## Version History

- 1.0.0 (2026-04-07): Initial version
