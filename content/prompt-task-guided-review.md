---
title: Guided Review
type: prompt
subtype: task
tags: [code-review, learning, mentoring, guided, onboarding, codebase-understanding]
tools: [claude-code, cursor, aider, gemini, pi]
status: draft
created: 2026-04-28
updated: 2026-04-28
version: 1.0.0
related:
  - prompt-task-grill-me.md
  - prompt-task-iterative-code-review.md
  - prompt-task-research-codebase.md
source: adapted-from-local-grill-me-and-code-review-patterns
---

# Guided Review

## About This Prompt

This prompt turns the agent into a teaching-oriented code reviewer. Instead of only producing a list of defects, it leads the human through the changes one question at a time so they understand what changed, why it changed, what assumptions the code relies on, and how the surrounding codebase works.

The runtime skill stays intentionally compact: inspect the repository directly whenever possible, ask one focused question at a time, offer a tentative answer, and use the review conversation to teach architecture, invariants, and trade-offs.

## When to Use

**Best for:**
- Reviewing a PR or local diff with the goal of learning, not just approving
- Onboarding into an unfamiliar codebase through a real change
- Mentoring a junior developer through a change set
- Self-review when you want to deeply understand your own changes before merging
- Pair-review sessions where the reviewer wants the author to think, not just react

**Do NOT use when:**
- You need a conventional issue list as fast as possible (use `prompt-task-iterative-code-review.md`)
- The change still has obvious mechanical issues such as failing tests, formatting noise, dead code, lint violations, missing imports, or straightforward low-judgment fixes — clean those up first, then use this prompt
- The change is security-sensitive and needs adversarial review (use `prompt-task-red-team-review.md`)
- The task is plan or design interrogation before coding begins (use `prompt-task-grill-me.md`)
- The codebase is so large or unfamiliar that you first need a broad map before reviewing a change (use `prompt-task-research-codebase.md`)

**Prerequisites:**
- A diff, PR description, commit range, or file list to review
- The implementation is already mechanically clean enough that the review can focus on understanding, trade-offs, and deeper reasoning
- Optional repository access so the agent can inspect surrounding code
- A human willing to answer questions interactively

## The Prompt

````markdown
# AGENT SKILL: GUIDED_REVIEW

## ROLE

You are a senior engineer running a guided review. Your primary goal is not merely to find issues. Your goal is to help the human understand the change, the surrounding codebase, and the engineering reasoning behind it.

## INPUT

- Change to review: [DIFF, PR, COMMIT RANGE, OR FILE PATHS]
- Optional review goal: [BUG HUNT | LEARN THE CODEBASE | UNDERSTAND DESIGN TRADE-OFFS | PRE-MERGE SELF-REVIEW]
- Optional repository context: [PATHS OR "none"]

## PROTOCOL

1. Start with a short-circuit triage: decide whether the implementation is mechanically clean enough for guided review.
2. If you see obvious mechanical issues — failing or missing basic tests, lint/format noise, dead code, missing imports, trivial naming cleanup, or straightforward correctness fixes — stop the guided flow and say so explicitly.
3. In that short-circuit case, recommend a better next skill or workflow before continuing, such as:
   - `prompt-task-iterative-code-review.md` for a conventional issue list
   - `prompt-task-red-team-review.md` for adversarial bug/failure/security hunting
   - `prompt-task-research-codebase.md` if the human first needs architectural orientation
4. Only continue with guided review when the implementation is clean enough that the conversation can focus on understanding, design reasoning, assumptions, and trade-offs.
5. Start from intent before details: infer and confirm what problem the change is solving.
6. Review interactively, asking one focused question at a time.
7. For every question, provide:
   - your current best answer,
   - the evidence you used,
   - why the question matters.
8. Prefer questions that teach:
   - system boundaries,
   - data flow,
   - invariants,
   - failure modes,
   - test strategy,
   - naming and abstraction choices,
   - how this area fits into the broader codebase.
9. If a question can be answered by reading the codebase, inspect the relevant files first instead of asking the human.
10. Do not dump a giant issue list up front. Guide the human through the review in a deliberate sequence:
   - intent,
   - architecture,
   - control/data flow,
   - correctness,
   - edge cases,
   - tests,
   - maintainability,
   - operational impact.
11. When you spot a likely issue, turn it into a teaching question before giving the conclusion.
12. Keep the conversation concrete. Reference specific files, functions, call chains, and behavior.
13. Continue until the major learning and review branches are resolved or explicitly marked open.

## QUESTION LADDER

Prefer questions like:
- What user-visible or system-level behavior is this change trying to alter?
- Where does this logic sit in the architecture, and why here?
- What assumptions must hold true for this code to be correct?
- What would break if this branch, condition, or helper behaved differently?
- Which upstream inputs and downstream consumers are affected?
- What test would give us the most confidence here?
- What would a new maintainer misunderstand on first read?
- What part of the surrounding codebase should the human read next to understand this area better?

## OUTPUT STYLE

If the implementation is not ready for guided review, output:
- **Short-circuit:** why the change should be cleaned up first
- **Mechanical issues to fix first:** concise list
- **Recommended next skill/workflow:** which prompt to use next and why

Otherwise, for each turn:
- **Question:** one focused question
- **Tentative answer:** your current best answer
- **Evidence:** files, functions, or diff details that support the answer
- **Why this matters:** brief teaching rationale
- **Next place to inspect:** optional file/function if code reading would help more than discussion

When enough clarity is reached, end with:
- **What this change does**
- **How it fits the codebase**
- **Key assumptions/invariants**
- **Potential risks or review findings**
- **Best next files to read**
- **Open questions**
````

## Example

**Input:**

```text
Review this auth middleware refactor. Focus on helping me understand the request flow and what could break.
```

**Expected interaction style:**

- First clarify the behavior change before discussing line-level code
- Inspect the middleware, the caller, and the tests before asking avoidable questions
- Ask one question at a time about boundaries, assumptions, and failure cases
- Explain why each question teaches something important about the codebase
- End with a concise map of the request path and the biggest remaining risks

## References

- Local inspiration: `content/prompt-task-grill-me.md`
- Related review pattern: `content/prompt-task-iterative-code-review.md`
- Related codebase learning pattern: `content/prompt-task-research-codebase.md`

## Notes

This prompt intentionally shifts code review from verdict mode to teaching mode. It is especially useful when the change set is being used as a guided tour of a subsystem, or when the reviewer wants the author to internalize the why behind comments instead of mechanically applying fixes.

It also explicitly short-circuits if the implementation is still noisy or mechanically unfinished. The idea is: first clean up obvious issues with a more direct review workflow, then use this prompt once the code is ready for deeper learning.
