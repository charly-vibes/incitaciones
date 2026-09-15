---
title: Skill Router Architecture
type: prompt
tags: [architecture, skills, progressive-disclosure, token-efficiency]
tools: [pi, claude-code, gemini-cli, amp]
status: verified
created: 2026-09-15
updated: 2026-09-15
version: 1.0.0
related:
  - prompt-workflow-close.md
  - prompt-task-iterative-code-review.md
  - research-finding-skill-usage-analysis.md
source: original
---

# Skill Router Architecture

## Problem

Incitaciones shipped 68 individually-installed skills. Agent harnesses (pi, Claude Code) inject every visible skill's name + description + absolute path into the system prompt at session start — measured at ~5,900 tokens of always-on cost for this collection, before any skill fires. Many skills also overlapped semantically (seven review flavors, twelve diagnosticians sharing one skeleton), diluting trigger accuracy: near-duplicate descriptions compete for the same task signal.

## Solution: router + references/

Related skills merge into a single **router skill** with a **progressive-disclosure** layout:

```
content/distilled/{router}/
├── SKILL.md                  # thin: mode table + selection rules + read protocol
└── references/
    ├── {member}/SKILL.md     # former multi-file skill, content preserved
    │   └── references/…      # its nested templates move with it
    └── {member}.md           # former single-file skill
```

- The router SKILL.md is the only always-on surface: one description instead of N.
- Its mode table carries the distinguishing phrases each former description used, preserving trigger accuracy; the read protocol resolves member paths against the skill directory, which pi and Claude Code both honor.
- Member content moves verbatim (frontmatter stripped, `tools:` preserved as a plain line) — history and provenance comments (`<!-- Full version: … -->`) stay.

## Routers

| Router | Members merged |
|---|---|
| `session` | close, park, next, renew, resume-handoff, create-handoff |
| `review` | code-review, rule-of-5-universal, parallel-review, multi-agent-review, guided-review, red-team-review |
| `planning` | create-plan, implement-plan, plan-review, iterate-plan |
| `issues` | create-issues, issue-review |
| `diagnostician` | the twelve `*-diagnostician` skills |
| `prompt-meta` | extract-prompt, distill-prompt, verify-prompt |
| `documentation` | research-, implement-, review-documentation |

Companion measures (see CHANGELOG for the release that shipped them):

- **Compat pointers** — high-traffic old names (`/skill:close`, `/skill:rule-of-5-universal`, …) remain invocable via hidden pointer skills (`disable-model-invocation: true` in the manifest), so existing muscle memory and configs keep working for one release.
- **Selective description trimming** — remaining singles over ~150 chars are tightened while keeping near-duplicate pairs (anti-slop / anti-slop-prose) deliberately differentiated.
- **Installer strip** — installers strip the distilled file's own frontmatter instead of concatenating it after the generated block (installed copies previously carried double frontmatter; the second block was dead tokens on load).

## When NOT to route

Do not merge skills whose descriptions must compete for the *same* trigger phrase with different behavior (e.g., anti-slop vs anti-slop-prose), or checkers with narrow inputs (doc-link-verifier). A router earns its place when members share a task verb but differ by *object* (review code/plan/spec), not when they share an object but differ by *behavior*.
