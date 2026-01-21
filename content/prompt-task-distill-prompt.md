---
title: Distill Verbose Prompt for LLM Execution
type: prompt
tags: [prompts, token-optimization, distillation]
tools: [gemini]
status: draft
created: 2026-01-20
updated: 2026-01-20
version: 1.0.0
related: [research-prompt-token-optimization-strategies.md]
source: research-based
---

# Distill Verbose Prompt for LLM Execution

## When to Use

This prompt should be used to convert a verbose, developer-facing prompt into a concise, token-efficient, LLM-facing prompt. It is a "meta-prompt" designed to implement the "Prompt Distillation" strategy outlined in `research-prompt-token-optimization-strategies.md`.

-   **Use it when:** You have a well-documented prompt with extensive comments, examples, and explanations for human developers, and you need to create a lean version for automated execution.
-   **Do NOT use it when:** The prompt is already concise or does not contain significant explanatory text to remove.

## The Prompt

```
Analyze the provided DEVELOPER-FACING PROMPT. Your task is to distill it into a concise, token-efficient, LLM-FACING PROMPT.

The distilled prompt must retain only the essential instructions, rules, and structured commands required for the LLM to perform its task.

You MUST REMOVE:
1.  All front-matter and metadata (e.g., title, tags, status, version, related, source).
2.  All explanatory sections intended for humans (e.g., "When to Use," "Notes," "Example," "References," "Philosophy").
3.  Descriptive introductions, justifications, and conversational text.
4.  Verbose examples. Summarize them only if they are essential for defining a format.

The final output should be a clean, direct set of instructions for the LLM, with no additional commentary from you.

DEVELOPER-FACING PROMPT:
---
[Paste the verbose prompt content here]
---
```

## Example

**Context:**
We have a detailed prompt for reviewing code in stages, `prompt-task-rule-of-5-universal.md`, which is filled with explanations for developers. We want to create the lean version for an automated tool.

**Input:**
```
Analyze the provided DEVELOPER-FACING PROMPT. Your task is to distill it into a concise, token-efficient, LLM-FACING PROMPT.

The distilled prompt must retain only the essential instructions, rules, and structured commands required for the LLM to perform its task.

You MUST REMOVE:
1.  All front-matter and metadata (e.g., title, tags, status, version, related, source).
2.  All explanatory sections intended for humans (e.g., "When to Use," "Notes," "Example," "References," "Philosophy").
3.  Descriptive introductions, justifications, and conversational text.
4.  Verbose examples. Summarize them only if they are essential for defining a format.

The final output should be a clean, direct set of instructions for the LLM, with no additional commentary from you.

DEVELOPER-FACING PROMPT:
---
title: The Rule of 5 - Universal Review Process
type: prompt
tags: [review, code-review, universal, iterative]
...
# The Rule of 5 - Universal Review Process

This prompt establishes a five-stage iterative review process applicable to code, design, documentation, or any other artifact. The philosophy is "breadth-first exploration, then focused editorial passes."

## The Process

### STAGE 1: DRAFT - Is the overall approach sound?
Focus on the big picture. Don't aim for perfection.
- Questions: Is the structure right? Does it solve the right problem?

### STAGE 2: CORRECTNESS - Does it work?
Focus on functionality and logical flaws.
- Questions: Are there bugs? Does it meet all requirements?
...
---
```

**Expected Output:**
```
Review the artifact below using the 5-stage process.

### STAGE 1: DRAFT - Is the overall approach sound?
- Focus: Big picture, structure, problem-solution fit.
- Output: High-level assessment of the approach.

### STAGE 2: CORRECTNESS - Does it work?
- Focus: Functionality, logical flaws, bugs, requirement satisfaction.
- Output: List of correctness issues.

...
```

## Notes

-   This meta-prompt is critical for operationalizing the token optimization strategy of distillation.
-   The quality of the distillation depends heavily on the LLM's ability to differentiate between instructional content and explanatory content. The explicit removal rules help guide it.
