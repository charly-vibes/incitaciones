---
title: Extract Reusable Prompt from Conversation
type: prompt
tags: [meta, prompt-engineering, extraction, documentation, workflow]
tools: [claude-code, aider, cursor, any-cli-llm]
status: tested
created: 2026-01-12
updated: 2026-01-12
version: 1.0.0
related: [template-prompt.md]
source: original
---

# Extract Reusable Prompt from Conversation

## When to Use

Use this prompt when you've had a successful AI interaction that you want to capture as a reusable prompt.

**Critical for:**
- Building a library of effective prompts
- Capturing successful interaction patterns
- Documenting what works for future use
- Sharing effective prompts with team
- Continuous improvement of AI workflows

**Do NOT use when:**
- Interaction was unsuccessful or produced poor results
- Pattern is too specific to one situation
- Result was achieved through trial and error without clear pattern
- Interaction was trivial and not worth capturing

## The Prompt

````
# Extract Reusable Prompt from Conversation

Analyze this conversation and extract a reusable prompt that captures the successful pattern.

## Process

### Step 1: Analyze the Conversation

Review the entire conversation and identify:

**What was the goal?**
- What were we trying to accomplish?
- What problem were we solving?

**What made it successful?**
- What specific instructions led to good results?
- What constraints or guidelines were important?
- What structure or process did we follow?

**What was the key pattern?**
- Can this be generalized beyond this specific case?
- What made this approach effective?
- What would need to change for different contexts?

### Step 2: Extract the Pattern

Identify the core pattern:

**The problem it solves:**
[General class of problems this addresses]

**The approach:**
[The method or structure that worked]

**Critical elements:**
- [Key instruction 1 that made it work]
- [Key instruction 2]
- [Key constraint or guideline]

**Optional elements:**
- [Things that helped but aren't essential]

### Step 3: Generalize the Instructions

Convert the specific conversation into general instructions:

**From specific:**
"Read src/auth/oauth.ts and explain how it works"

**To general:**
"Read [FILE] and explain how it works"

**From specific:**
"Don't suggest improvements to the authentication system"

**To general:**
"Document what exists without suggesting improvements"

### Step 4: Structure the Prompt

Create a structured prompt document following the template:

```markdown
---
title: [Descriptive Title]
type: prompt
tags: [tag1, tag2, tag3]
tools: [applicable-tools]
status: draft
created: [YYYY-MM-DD]
version: 1.0.0
related: []
source: extracted-from-conversation
---

# [Title]

## When to Use

[When is this prompt appropriate? What problems does it solve?]

**Critical for:**
- [Use case 1]
- [Use case 2]

**Do NOT use when:**
- [Anti-pattern 1]
- [Anti-pattern 2]

## The Prompt

\```
[The actual prompt text, generalized and structured]

[Include key sections like:]

## Critical Rules

[Non-negotiable guidelines]

## Process

[Step-by-step workflow if applicable]

### Step 1: [Name]
[Instructions]

### Step 2: [Name]
[Instructions]

## Guidelines

[Best practices and recommendations]
\```

## Example

**Context:**
[Describe a concrete scenario]

**Input:**
\```
[What you would actually say to the AI]
\```

**Expected Output:**
\```
[What the AI should produce]
\```

## Expected Results

[What success looks like]
- [Expected outcome 1]
- [Expected outcome 2]

## Variations

[Different versions for different contexts]

## References

[Links to sources or related information]

## Notes

[Additional context, caveats, or tips]

## Version History

- 1.0.0 ([YYYY-MM-DD]): Initial extraction from conversation
```

### Step 5: Provide Context from This Conversation

Include specific details:

**What we did:**
[Summary of this specific conversation]

**What worked well:**
[Specific things that led to success]

**What could be generalized:**
[Parts that apply to similar situations]

**Example from this conversation:**
[Use this conversation as the example in the prompt]

### Step 6: Determine Filename

Following naming conventions:

**For workflows (multi-step):**
`prompt-workflow-[descriptive-slug].md`

**For tasks (single focused task):**
`prompt-task-[descriptive-slug].md`

**For system prompts:**
`prompt-system-[descriptive-slug].md`

### Step 7: Classify and Tag

**Type:** prompt
**Status:** draft (needs testing)
**Tags:** [Extract 3-5 relevant tags]
**Tools:** [Which tools would this work with?]

### Step 8: Present Draft

```
I've extracted a reusable prompt from our conversation.

**Pattern identified:** [Name of pattern]

**Key insight:** [What made this work]

**Proposed filename:** content/prompt-[type]-[slug].md

**Draft prompt:**
[Show the structured prompt document]

This prompt could be useful for [use cases].

Shall I:
1. Save this prompt to the content/ directory
2. Make adjustments first
3. Test it in a new conversation
```

## Guidelines

1. **Generalize without losing specificity** - Keep concrete examples but make instructions general
2. **Capture the "why"** - Don't just transcribe, explain what made it work
3. **Include anti-patterns** - Document when NOT to use it
4. **Provide examples** - Use this conversation as a concrete example
5. **Start with "draft" status** - Needs testing before "tested" or "verified"
6. **Cross-reference** - Link to related prompts
7. **Iterate** - First version doesn't have to be perfect
````

## Example

**Context:**
Had a successful conversation where Claude helped document existing authentication code without suggesting improvements. This "pure documentation" approach was very effective.

**Input:**
```
Extract a reusable prompt from our conversation about documenting the auth system.
```

**AI Response (following this prompt):**

```
I've analyzed our conversation about documenting the authentication system.

## Pattern Identified: Pure Documentation Research

**Key insight:** By explicitly prohibiting suggestions and improvements, the AI focused
entirely on understanding and documenting what exists. This is valuable when you need
to understand before modifying.

**What made it work:**
1. Clear rule: "DO NOT suggest improvements"
2. Structured research process (search → read → document)
3. Requirement for file:line references
4. Focus on patterns, not just code listings
5. Explicit separation of documentation from evaluation

**Use cases:**
- Understanding unfamiliar codebases
- Creating onboarding documentation
- Preparing for refactoring (understand first)
- Knowledge transfer between developers

## Proposed Prompt

**Filename:** `content/prompt-task-research-codebase.md`

---
title: Research Codebase Without Suggestions
type: prompt
tags: [research, documentation, codebase, analysis, discovery]
tools: [claude-code, aider, cursor, any-cli-llm]
status: draft
created: 2026-01-12
version: 1.0.0
related: []
source: extracted-from-conversation
---

# Research Codebase Without Suggestions

## When to Use

Use this prompt when you need an AI to **document and explain existing code**
without suggesting improvements, refactoring, or changes.

**Critical for:**
- Understanding unfamiliar codebases
- Documenting current architecture
- Onboarding to existing projects
- Creating knowledge base articles

**Do NOT use when:**
- You want suggestions for improvements
- You're actively developing new features

## The Prompt

\```
# Research Codebase

Document and explain the codebase as it exists today.

## CRITICAL RULES

**You are a documentarian, not an evaluator:**

1. ✅ DO: Describe what exists, where it exists, and how it works
2. ✅ DO: Explain patterns, conventions, and architecture
3. ✅ DO: Provide file:line references for everything
4. ❌ DO NOT: Suggest improvements or changes
5. ❌ DO NOT: Critique the implementation
6. ❌ DO NOT: Recommend refactoring

[... rest of prompt structure ...]
\```

## Example

**Context:**
New to a codebase, need to understand how authentication works.

**Input:**
\```
Research how authentication currently works in this codebase. Document what
exists without suggesting improvements.
\```

**Expected Output:**
\```
# Research: Authentication System

**Date:** 2026-01-12
**Question:** How does authentication currently work?

## Summary
The application uses JWT-based authentication with email/password credentials...

## Architecture Overview
[Detailed documentation with file:line references]

## Key Components
[Documentation of each component]

[No suggestions or critiques, pure documentation]
\```

## Expected Results

- Comprehensive understanding of existing code
- Specific file:line references for all claims
- No suggestions for improvements
- Clear documentation of patterns

## Variations

[Can be adapted for specific subsystems, integration points, etc.]

## Notes

**Why "no suggestions" matters:**
AI naturally wants to suggest improvements. During research phase, suggestions
are noise that distract from understanding what exists.

**Separate concerns:**
1. First, understand what exists (research phase)
2. Then, evaluate and improve (development phase)

## Version History

- 1.0.0 (2026-01-12): Extracted from auth system documentation conversation
---

This prompt captures the "pure documentation" pattern we used successfully.

Shall I:
1. Save it to content/prompt-task-research-codebase.md
2. Test it in a new conversation first
3. Make adjustments
```

## Expected Results

- Reusable prompt that captures the successful pattern
- Generalized instructions that work beyond the specific case
- Concrete example from the original conversation
- Proper metadata and structure following template
- Draft status (requires testing before verification)
- Clear use cases and anti-patterns documented

## Variations

**Quick extraction (minimal):**
```markdown
# Pattern: [Name]

## When to Use
[Brief description]

## The Prompt
\```
[Core instructions]
\```

## Example
[From this conversation]
```

**Extract multiple related prompts:**
```
Our conversation had several successful patterns. I'll extract them as separate prompts:

1. **Prompt A:** [Pattern 1]
   - Filename: prompt-task-[slug].md
   - For: [Use case]

2. **Prompt B:** [Pattern 2]
   - Filename: prompt-workflow-[slug].md
   - For: [Use case]

Which should I create first?
```

**Extract with variations:**
```
The core pattern works, but I see variations for different contexts:

**Base prompt:** [General version]
**Variation 1:** For [specific context]
**Variation 2:** For [another context]

Should I create:
1. One prompt with variations section
2. Separate prompts for each variation
```

## References

- [Prompt Engineering Guide](https://www.promptingguide.ai/) - Prompt patterns and techniques
- [Advanced Context Engineering](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents) - Context engineering principles
- [OpenAI Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering) - Best practices

## Notes

### Why Extract Prompts from Conversations

Successful interactions contain valuable patterns:
- **Trial and error refined** - The conversation worked out the kinks
- **Context-tested** - Proved effective in real situation
- **Implicitly optimized** - Natural language arrived at good structure

Benefits of extraction:
- **Reuse successes** - Don't reinvent each time
- **Share with team** - Others benefit from your discoveries
- **Continuous improvement** - Library grows over time
- **Reduce cognitive load** - Don't remember every detail

### What Makes a Pattern Worth Extracting

**Extract when:**
- Pattern achieved clear success
- Approach was non-obvious or took iteration
- Would be useful in multiple situations
- Contains specific structure or rules that matter

**Don't extract when:**
- Result was mediocre
- Approach was trivial or standard
- Too specific to be reusable
- Trial and error without clear pattern

### The Extraction Process

1. **Identify success** - What worked?
2. **Find the pattern** - What made it work?
3. **Generalize** - What's reusable?
4. **Structure** - Follow template
5. **Document** - Include examples and context
6. **Test** - Try it in new situations
7. **Iterate** - Refine based on testing

### Common Extraction Mistakes

1. **Too specific** - "Read src/auth.ts" instead of "Read [FILE]"
2. **Too vague** - "Make it better" instead of specific instructions
3. **Missing critical rules** - The constraints that made it work
4. **No examples** - Abstract without concrete reference
5. **Missing anti-patterns** - When NOT to use it

### Meta Pattern: This Prompt Itself

This prompt was created by:
1. Noticing successful prompt extraction conversations
2. Identifying the pattern (analyze → extract → generalize → structure)
3. Documenting the process
4. Adding examples and variations

It's prompts all the way down!

### Building a Prompt Library

Extracted prompts form a growing library:
- Each successful interaction adds to it
- Patterns emerge across multiple prompts
- Library becomes team knowledge
- Compound benefits over time

**Start small:**
- Extract 1-2 prompts per week
- Test them in practice
- Refine based on results
- Share with team

**Grow systematically:**
- Tag and organize
- Link related prompts
- Version as they improve
- Deprecate what doesn't work

## Version History

- 1.0.0 (2026-01-12): Initial version - meta prompt for extracting prompts
