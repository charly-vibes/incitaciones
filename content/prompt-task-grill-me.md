---
title: Grill Me
type: prompt
subtype: task
tags: [planning, design, review, productivity, questioning, decision-making]
tools: [claude-code, cursor, aider, gemini, pi]
status: draft
created: 2026-04-28
updated: 2026-04-28
version: 1.0.0
related:
  - prompt-workflow-create-plan.md
  - prompt-task-plan-review.md
  - prompt-task-edge-case-discovery.md
source: adapted-from-https://www.youtube.com/watch?app=desktop&v=-QFHIoCo-Ko
---

# Grill Me

## About This Prompt

This prompt turns the agent into a relentless interviewer for plans and designs. Its job is to walk the user through the decision tree one branch at a time until ambiguities, hidden dependencies, and unresolved choices are surfaced.

The runtime skill is intentionally small: ask one question at a time, offer a recommended answer, and inspect the codebase directly when a question can be resolved from repository evidence.

## When to Use

**Best for:**
- Stress-testing an implementation plan before coding starts
- Pressure-testing a design for hidden assumptions and unresolved dependencies
- Forcing concrete decisions when a plan feels hand-wavy
- Interactive design review where the user wants to be challenged question-by-question

**Do NOT use when:**
- The user wants a finished plan written for them from scratch (use `prompt-workflow-create-plan.md`)
- The task is an advisory review of a completed plan artifact rather than an interactive interview (use `prompt-task-plan-review.md`)
- The goal is exhaustive edge-case discovery against a full specification (use `prompt-task-edge-case-discovery.md`)

**Prerequisites:**
- A plan, proposal, design, or rough implementation idea to interrogate
- Optional repository context if some answers can be derived from the codebase

## The Prompt

````markdown
# AGENT SKILL: GRILL_ME

## ROLE

You are an exacting design interviewer. Your goal is to interview the user relentlessly about a plan or design until you reach shared understanding.

## INPUT

- Plan or design to interrogate: [PASTE OR SUMMARIZE]
- Optional repository context: [PATHS OR "none"]

## PROTOCOL

1. Walk down each branch of the design tree.
2. Resolve dependencies between decisions one by one.
3. For each question you ask, also provide your recommended answer.
4. Ask questions one at a time.
5. If a question can be answered by exploring the codebase, explore the codebase instead of asking.
6. Continue until the major decision branches are resolved or explicitly marked as open questions.

## OUTPUT STYLE

For each turn:
- **Question:** one focused question
- **Recommended answer:** your current best recommendation
- **Why this matters:** brief rationale

When enough clarity has been reached, end with:
- **Resolved decisions**
- **Open questions**
- **Next decision to make**
````

## Example

**Input:**

```text
I want to add background job retries to our worker system.
```

**Expected interaction style:**

- Ask first about retry semantics before implementation details
- Recommend a concrete default (for example, bounded exponential backoff)
- If the repository already has a retry helper or queue abstraction, inspect it and fold that evidence into the next question
- Keep the conversation to one blocking question at a time

## References

- Source inspiration: [How to use Claude Code optimally (YouTube)](https://www.youtube.com/watch?app=desktop&v=-QFHIoCo-Ko)
- Upstream skill text: [mattpocock/skills - grill-me](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md)

## Notes

This repository version preserves the original interaction pattern but wraps it in local prompt metadata and cross-references so it can be installed through `install.sh` and discovered through `content/manifest.json`.
