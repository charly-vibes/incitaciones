---
title: Verify Distilled Prompt Integrity
type: prompt
subtype: task
tags: [prompts, verification, distillation, quality-assurance]
tools: [gemini]
status: draft
created: 2026-01-20
updated: 2026-01-20
version: 1.0.0
related: [prompt-task-distill-prompt.md, meta-prompt-install-commands.md]
source: original
---

# Verify Distilled Prompt Integrity

## When to Use

This prompt is used as a quality assurance step after a developer-facing prompt has been "distilled" into a concise, LLM-facing prompt using `prompt-task-distill-prompt.md`. Its purpose is to verify that the distillation process did not accidentally remove any essential instructions, steps, or rules.

-   **Use it when:** You need to ensure the token-efficient prompt is still functionally equivalent to the verbose original.
-   **Do NOT use it when:** You are not using a distillation process.

## The Prompt

```markdown
You are a meticulous QA assistant. Your task is to compare two versions of a prompt: the `ORIGINAL_PROMPT` (verbose, for developers) and the `DISTILLED_PROMPT` (concise, for LLMs).

Your goal is to verify that the `DISTILLED_PROMPT` is a faithful, lossless distillation of the `ORIGINAL_PROMPT`.

**Analysis Criteria:**
1.  **Completeness**: Does the `DISTILLED_PROMPT` include ALL essential executable instructions, steps, rules, and constraints from the `ORIGINAL_PROMPT`?
2.  **Accuracy**: Does the `DISTILLED_PROMPT` correctly represent the core logic and intent of the original? There should be no changes in meaning.
3.  **Conciseness**: The `DISTILLED_PROMPT` should have successfully removed non-essential content like human-facing explanations, examples, metadata, and conversational filler.

**Your Task:**
1.  Carefully analyze both prompts provided below.
2.  Compare them against the criteria above.
3.  If the `DISTILLED_PROMPT` is a perfect, lossless distillation, respond with only:
    `OK`
4.  If there are any discrepancies (e.g., a missing step, an altered instruction), provide a concise report detailing ONLY the specific, essential content that is missing or altered in the `DISTILLED_PROMPT`. Do not comment on what was correctly removed.

---
**ORIGINAL_PROMPT:**
```
[Paste the original verbose prompt content here]
```
---
**DISTILLED_PROMPT:**
```
[Paste the distilled concise prompt content here]
```
---
```

## Example

**Context:**
Imagine `prompt-task-distill-prompt.md` made a mistake and removed a crucial step from a prompt about a 5-stage review process.

**Input (to this verification prompt):**

```
You are a meticulous QA assistant...
---
**ORIGINAL_PROMPT:**
```
# The Rule of 5 - Universal Review Process

This prompt establishes a five-stage iterative review process...

### STAGE 1: DRAFT - Is the overall approach sound?
Focus on the big picture...

### STAGE 2: CORRECTNESS - Does it work?
Focus on functionality...

### STAGE 3: CLARITY - Is it easy to understand?
Focus on readability...

### STAGE 4: STYLE - Does it follow conventions?
Focus on coding standards...

### STAGE 5: FINAL POLISH - Are there any remaining nits?
Focus on typos, formatting...
```
---
**DISTILLED_PROMPT:**
```
Review the artifact using the 5-stage process.

### STAGE 1: DRAFT
- Focus: Big picture.

### STAGE 2: CORRECTNESS
- Focus: Functionality.

### STAGE 4: STYLE
- Focus: Coding standards.

### STAGE 5: FINAL POLISH
- Focus: Typos.
```
---
```

**Expected Output:**
```
Missing Core Instruction:
- STAGE 3: CLARITY - Is it easy to understand? (Focus on readability)
```

## Notes
- This prompt acts as a safeguard to ensure that automated prompt optimization does not compromise the integrity of the core instructions.
