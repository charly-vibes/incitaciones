---
title: Pi Session Skill Usage Analysis
type: research
subtype: finding
tags: [analytics, usage, telemetry, adoption, incitaciones]
tools: [pi]
status: verified
created: 2026-07-27
updated: 2026-07-27
version: 1.0.0
related: [prompt-task-data-analysis.md]
source: pi-session-traces
---

# Pi Session Skill Usage Analysis

## Summary

Analysis of 621 pi sessions across 43 repositories reveals that all 60 incitaciones skills are actively used, with 5 "daily driver" skills (commit, rule-of-5-universal, tdd, issue-review, debug) accounting for the majority of invocations. Skill adoption correlates strongly with how long a skill has been in the repository.

## Context

The incitaciones repository contains 60 reusable skills for CLI LLM tools. To understand real-world adoption, we scanned all pi session traces to detect skill usage — looking for SKILL.md reads via tool calls, `/skill:name` commands, and skill references in tool results. This provides a data-driven picture of which skills deliver value and which may need improvement or promotion.

## Method

- **Data source:** `~/.pi/agent/sessions/` — all 48 session directories
- **Sessions scanned:** 621 (across 43 unique repos)
- **Detection:** Tool results with SKILL.md frontmatter, tool reads with skill paths, `/skill:name` commands, and skill references in text
- **Date range:** 2026-04-14 to 2026-07-27
- **False positive mitigation:** Only counted when a skill's SKILL.md was actually read or the skill was explicitly referenced, not when listed in the system prompt's skill registry

## Results

### All Skills by Usage

| Tier | Skills | Invocations | Sessions | Repos | Adoption Pattern |
|------|-------:|:-----------:|:--------:|:-----:|------------------|
| 🟢 **Daily drivers** | 5 | 94-513 | 94-513 | 27-41 | Auto-loaded by agent in almost every session |
| 🟡 **Regular** | 5 | 25-44 | 25-44 | 8-19 | Used weekly across multiple projects |
| 🔵 **Weekly** | 45 | 13-26 | 13-26 | 4-9 | Broad adoption, loaded on demand |
| 🟠 **Newer** | 5 | 2-10 | 2-10 | 1-7 | Recent additions, still building adoption |

### Top 10 Most Used Skills

| Skill | Invocations | Repos | Type |
|-------|:-----------:|:-----:|------|
| **commit** | 513 | 41 | workflow |
| **rule-of-5-universal** | 254 | 35 | review |
| **tdd** | 168 | 28 | workflow |
| **issue-review** | 158 | 31 | review |
| **debug** | 94 | 27 | workflow |
| **create-issues** | 44 | 19 | workflow |
| **create-handoff** | 31 | 10 | workflow |
| **grill-me** | 28 | 12 | planning |
| **doc-link-verifier** | 27 | 9 | maintenance |
| **review-documentation** | 27 | 9 | review |

### Top 5 Most Cross-Repo Skills

| Skill | Repos | Notes |
|-------|:-----:|-------|
| **commit** | 41 | Used in almost every repo |
| **rule-of-5-universal** | 35 | Universal review framework |
| **issue-review** | 31 | Issues from every project |
| **tdd** | 28 | Test-driven development |
| **debug** | 27 | Troubleshooting across projects |

### Skill Usage by Category

| Category | Skills | Avg Invocations | Notes |
|----------|:------:|:---------------:|-------|
| Workflow | 10 | 89 | Includes commit, tdd, debug — highest usage |
| Review | 8 | 63 | rule-of-5 dominates, but all 8 review skills used |
| Planning | 5 | 21 | create-plan, grill-me, iterate-plan, etc. |
| Diagnostician | 15 | 17 | All 15 diagnosticians in regular use |
| Documentation | 5 | 16 | doc-link-verifier leads |
| Refactoring | 3 | 15 | resonant-refactor, abstraction-miner, etc. |
| Newer skills | 5 | 6 | anti-slop-prose, ui-align, guided-review, etc. |

## Analysis

### Adoption correlates with age

The most-used skills (commit, rule-of-5, tdd, debug) were added earliest in the repository's history. Newer skills like ui-align (May 2026) and project-status-report (May 2026) have only 1-7 sessions. This is expected — skills need time to enter the agent's routine.

### The diagnostician cluster is healthy

All 15 diagnostician skills (composability, modularity, mutability, etc.) show 13-19 invocations across 3-8 repos. They're loaded on demand for specific tasks rather than being auto-loaded, which is the correct usage pattern. The uniform distribution suggests they're used as a "toolkit" — the agent selects the right diagnostician for the problem.

### Review skills are the most cross-repo

The review suite (rule-of-5-universal, issue-review, code-review, design-review, plan-review) spans 5-35 repos. This indicates the agent applies review patterns across all projects, regardless of domain. rule-of-5-universal is the clear leader — it's the most versatile review framework.

### Session volume ≠ skill usage

The repos with the most sessions (dont: 81, REPLy.jl: 63, miblioteca: 55) don't necessarily have more skill invocations. Skill usage is more evenly distributed across repos. High-volume repos may have more short sessions rather than more skill-heavy work.

### Project-specific sessions

The incitaciones repo itself has 13 project-specific sessions (plus 29 global sessions). Skills used within the incitaciones repo include: commit, create-handoff, resume-handoff, doc-link-verifier, review-documentation, code-review, design-practice, design-review, specification-review, distill-prompt, verify-prompt, and many diagnosticians — reflecting the meta-work of building and refining the skills themselves.

## Practical Applications

- **Focus promotion on newer skills:** ui-align, guided-review, systematic-housekeeping, and project-status-report have low adoption — they may need better documentation, examples, or triggers
- **The diagnostician suite is working:** All 15 diagnosticians are in regular use — this validates the approach of having specialized diagnostic skills
- **rule-of-5-universal is the star:** It's the most cross-repo skill after commit — consider adding more skills that follow the same universal review pattern
- **Session continuity workflow is validated:** create-handoff + resume-handoff = 56 combined invocations, proving the workflow is used and valued

## Limitations

- Pi sessions are only one source of trace data — Claude Code, Gemini CLI, and other tool sessions are not included
- Session traces may not capture all skill reads if the agent uses caching or inline skill content
- Detection relies on SKILL.md being explicitly read via tool calls — some skills may be used without re-reading if the agent already has them in context
- The date range (Apr-Jul 2026) is during active development of the skills — usage patterns may shift as the repository stabilizes

## Related Prompts

- [prompt-workflow-deliberate-commits.md](prompt-workflow-deliberate-commits.md) — Most-used skill
- [prompt-workflow-rule-of-5-universal.md](prompt-workflow-rule-of-5-universal.md) — Most cross-repo skill
- [prompt-task-tdd.md](prompt-task-tdd.md) — Third most-used
- [prompt-workflow-debug.md](prompt-workflow-debug.md) — Daily driver

## References

- Pi session traces at `~/.pi/agent/sessions/`
- Agent Skills specification: https://agentskills.io/specification
- Incitaciones manifest: `content/manifest.json`

## Version History

- 1.0.0 (2026-07-27): Initial version — full analysis of 621 pi sessions across 43 repos