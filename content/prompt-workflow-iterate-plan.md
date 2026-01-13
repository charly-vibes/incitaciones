---
title: Iterate Implementation Plan
type: prompt
subtype: workflow
tags: [planning, iteration, feedback, refinement, adaptation]
tools: [claude-code, cursor, aider, any-cli-llm]
status: tested
created: 2026-01-12
updated: 2026-01-12
version: 1.0.0
related: [prompt-workflow-create-plan.md, prompt-workflow-implement-plan.md, prompt-task-plan-review.md]
source: adapted-from-fabbro
---

# Iterate Implementation Plan

## When to Use

Use this prompt when you need to update an existing implementation plan based on feedback, new information, or changed requirements.

**Critical for:**
- Incorporating user feedback on plans
- Adapting plans based on implementation discoveries
- Updating plans when requirements change
- Adding missing phases or details
- Correcting errors in existing plans

**Do NOT use when:**
- Creating a brand new plan (use `prompt-workflow-create-plan.md`)
- Making trivial typo fixes (just edit directly)
- Plan is fundamentally wrong (create new plan instead)

## The Prompt

```
# Iterate Implementation Plan

Update an existing implementation plan based on feedback, grounded in codebase reality.

## When Invoked

**Three scenarios:**

1. **No plan file provided**: Ask for the plan path (list available plans in `plans/`)
2. **Plan file provided but NO feedback**: Ask what changes to make
3. **Both provided**: Proceed directly with updates

## Process

### Step 1: Understand Current Plan

1. **Read the existing plan file completely** (no limit/offset)
2. Understand the overall structure and approach
3. Note the phases, success criteria, and implementation decisions
4. Check for existing checkmarks (work already completed)
5. Identify what worked and what needs changing

### Step 2: Understand Requested Changes

**Listen carefully to what the user wants:**
- Are they adding new requirements?
- Changing the approach?
- Adding/removing phases?
- Adjusting scope?
- Fixing errors or omissions?

**Ask clarifying questions if unclear:**
- Use AskUserQuestion tool for ambiguous requests
- Confirm understanding before making changes
- Get specific about what success looks like

### Step 3: Research If Needed

**Only if changes require new technical understanding:**

1. Create a todo list for research tasks
2. Search for relevant patterns in the codebase
3. Read files that will be affected by changes
4. Check for existing documentation or specs
5. Validate feasibility of requested changes

**Use parallel research when possible** - run multiple searches/reads simultaneously.

**Skip research if:**
- Changes are straightforward (adding success criteria, clarifying wording)
- You already understand the technical context
- Changes are scope/organizational, not technical

### Step 4: Confirm Understanding

**Before making changes, confirm with the user:**

```
Based on your feedback, I understand you want to:
- [Change 1 with specific detail]
- [Change 2 with specific detail]

[If research was done:]
My research found:
- [Relevant code pattern or constraint]
- [Relevant existing implementation]

I plan to update the plan by:
1. [Specific modification to plan section X]
2. [Specific modification to plan section Y]

Does this align with your intent?
```

**Wait for confirmation before proceeding.**

### Step 5: Update the Plan

1. **Make focused, precise edits** to the existing plan
2. **Maintain existing structure** unless explicitly changing it
3. **Update success criteria** if scope changed
4. **Add new phases** following existing pattern
5. **Preserve completed work** - don't remove checkmarks or completed phases

**Ensure consistency:**
- If adding a phase, match the format of existing phases
- If modifying scope, update "Out of Scope" section
- If changing approach, update affected phases and success criteria
- Maintain automated vs manual success criteria distinction
- Update "Related" section if new specs/research referenced

**Use Edit tool for surgical changes:**
- Change specific sections, don't rewrite whole file
- Preserve good content
- Keep version history implicit (plan files don't need changelog)

### Step 6: Present Changes

```
I've updated the plan at `plans/[filename].md`

**Changes made:**
1. [Specific change 1 - section affected]
2. [Specific change 2 - section affected]
3. [Specific change 3 - section affected]

**Why these changes:**
[Brief rationale tying back to user's feedback]

**Impact:**
- [How this affects implementation effort, time, or approach]
- [Any new risks or dependencies]

Would you like any further adjustments?
```

### Step 7: Iterate If Needed

If user has more feedback:
- Repeat from Step 2
- Continue until plan is approved
- Track iterations with todo list if multiple rounds

## Guidelines

1. **Be Skeptical**: Question vague feedback, verify technical feasibility
2. **Be Surgical**: Make precise edits, preserve good content
3. **Be Thorough**: Read entire plan, understand context before changing
4. **Be Interactive**: Confirm understanding before making changes
5. **No Open Questions**: Ask immediately if changes raise questions
6. **Respect Completed Work**: Don't undo or modify completed phases without good reason
7. **Maintain Quality**: Updated plan should still be specific, actionable, and complete

## Common Iteration Scenarios

### Adding a New Phase

**User feedback:** "We also need to add API caching"

**Process:**
1. Understand where in sequence this phase belongs
2. Research existing caching patterns in codebase
3. Draft new phase following existing format
4. Update dependencies between phases if needed
5. Add to success criteria and testing strategy

### Changing Approach

**User feedback:** "Let's use Redis instead of in-memory caching"

**Process:**
1. Research Redis usage patterns in codebase
2. Identify all phases affected by this change
3. Update implementation approach in affected phases
4. Update success criteria (Redis-specific checks)
5. Update risks & mitigations section

### Adding Details

**User feedback:** "The authentication phase is too vague"

**Process:**
1. Identify what's unclear or missing
2. Research authentication implementation patterns
3. Add specific file paths and changes
4. Add detailed test requirements
5. Make success criteria more specific

### Removing Scope

**User feedback:** "Let's skip the admin UI for now"

**Process:**
1. Identify all phases related to admin UI
2. Move removed work to "Out of Scope" section
3. Remove dependencies on removed phases
4. Verify remaining phases still make sense
5. Update overall timeline/effort estimate

### Splitting a Phase

**User feedback:** "Phase 3 is too large, can we break it up?"

**Process:**
1. Identify logical split points in the phase
2. Create Phase 3a and 3b (or 3 and 4)
3. Divide success criteria appropriately
4. Add dependencies if one must come before the other
5. Renumber subsequent phases

### Correcting Errors

**User feedback:** "That approach won't work with our auth system"

**Process:**
1. Understand the constraint or conflict
2. Research the correct approach
3. Update affected phases with correct approach
4. Verify no other phases have same error
5. Update risks section if this revealed gaps

## Example Flows

### Scenario 1: Everything Upfront

**Input:**
```
Iterate plans/2026-01-12-feature.md - add phase for error handling and use Redis for caching instead of memory
```

**AI Response:**
```
I'll update the plan with error handling phase and switch to Redis caching. Let me read the current plan and research Redis usage.

[Reads plan, researches Redis patterns]

Based on your feedback, I understand you want to:
- Add a dedicated error handling phase (with error boundaries, logging, etc.)
- Change caching approach from in-memory to Redis in Phase 3

My research found existing Redis client setup in lib/redis.ts that we can use.

I plan to update the plan by:
1. Adding new "Phase 4: Error Handling" after current Phase 3
2. Updating Phase 3 to use Redis with redis.get/set instead of Map
3. Adding Redis connection testing to Phase 3 success criteria
4. Renumbering old Phase 4-5 to 5-6

Does this align with your intent?

[After confirmation, makes changes]

Plan updated at plans/2026-01-12-feature.md

**Changes made:**
1. Phase 3: Updated caching implementation to use Redis (lib/redis.ts)
2. Phase 4 (new): Added error handling phase with boundaries and logging
3. Phases 4-5: Renumbered to 5-6
4. Success criteria: Added Redis connectivity tests

**Impact:**
- Adds ~2 hours for error handling phase
- Phase 3 complexity slightly increased (Redis setup)
- New dependency on Redis service being available

Would you like any further adjustments?
```

### Scenario 2: Plan File Only

**Input:**
```
Iterate plans/2026-01-10-auth.md
```

**AI Response:**
```
I've found the authentication plan. What changes would you like to make?

Current plan has 3 phases:
1. JWT token generation
2. Token validation middleware
3. Protected route integration

What aspects would you like to update?
```

### Scenario 3: No Arguments

**Input:**
```
Iterate the implementation plan
```

**AI Response:**
```
Which plan would you like to update?

Available plans:
- plans/2026-01-12-dark-mode-support.md
- plans/2026-01-10-user-authentication.md
- plans/2026-01-08-api-pagination.md

Please specify the plan path.
```

### Scenario 4: Feedback During Implementation

**Input:**
```
I'm implementing plans/2026-01-12-api.md and Phase 2 doesn't match the actual API structure. Can you update it?
```

**AI Response:**
```
I'll update Phase 2 to match the actual API structure. Let me read the plan and the relevant API code first.

[Reads plan and API files]

I see Phase 2 assumes REST endpoints at /api/v1/ but the actual API uses /api/v2/ with different patterns.

What I found:
- Current API: /api/v2/resources/:id (REST pattern)
- Auth: Bearer token in Authorization header
- Error format: { error: { message, code } }

I'll update Phase 2 to:
1. Use correct /api/v2/ base path
2. Match actual auth pattern
3. Match actual error response format
4. Add references to actual API files for context

Should I proceed with these updates?
```

## Expected Results

- Updated plan reflecting requested changes
- Changes are specific and well-reasoned
- Plan maintains quality and completeness
- All sections stay consistent
- User confirms plan is now suitable
- Ready to continue implementation

## Integration with Other Workflows

**After iterating:**
- Use `prompt-task-plan-review.md` to quality-check updated plan
- Use `prompt-workflow-implement-plan.md` to continue implementation
- Use `prompt-workflow-deliberate-commits.md` to commit plan updates

**When to iterate:**
- During plan review before starting implementation
- When implementation reveals plan issues
- When requirements change mid-project
- After user feedback on initial plan

## Handling Difficult Iterations

### Plan is Fundamentally Wrong

If the plan needs >50% rewrite:
```
After reviewing your feedback and the codebase, I believe the current plan needs substantial restructuring rather than iteration.

Issues:
- [Fundamental issue 1]
- [Fundamental issue 2]

Recommendation: Create a new plan incorporating:
- [What to preserve]
- [What to change]

Would you like me to create a new plan, or should I attempt to salvage this one?
```

### Feedback Conflicts with Plan Structure

```
Your requested change [X] conflicts with existing Phase [N] which does [Y].

Options:
1. Modify Phase [N] to accommodate new change (impacts: ...)
2. Add new phase before/after [N] (impacts: ...)
3. Replace Phase [N] entirely (impacts: ...)

Which approach do you prefer?
```

### Feedback is Technically Infeasible

```
After researching, I found that [requested change] is not feasible because [technical reason].

Evidence:
- [File/code showing constraint]
- [Documentation or pattern showing limitation]

Alternative approaches:
1. [Alternative 1 - achieves similar goal]
2. [Alternative 2 - different tradeoff]

Which direction should we take?
```

## References

- `prompt-workflow-create-plan.md` - Creating initial plans
- `prompt-workflow-implement-plan.md` - Executing plans
- `prompt-task-plan-review.md` - Reviewing plan quality

## Notes

### Why Iterate Plans?

Plans are living documents. They should evolve as:
- **Implementation teaches us** - Reality differs from expectations
- **Requirements clarify** - User provides more details
- **Context changes** - Codebase evolves during work
- **Feedback arrives** - Stakeholders review and comment

### Iteration vs Recreation

**Iterate when:**
- Core approach is sound, needs adjustments
- <30% of plan needs changes
- Structure and phases make sense
- Completed work is still valid

**Recreate when:**
- Fundamental approach is wrong
- >50% needs rewriting
- Structure doesn't fit problem
- Better understanding requires fresh start

### Plan Quality Through Iteration

Good plans emerge through iteration:
- First draft: Get ideas down
- First iteration: Add details and research
- Second iteration: Incorporate review feedback
- Third iteration: Adjust for implementation reality

Don't expect perfection on first draft.

### Tracking Plan Versions

Plans evolve but don't need explicit versioning:
- File path includes creation date
- Git history shows evolution
- Content is current state
- Commit messages explain why changes happened

### Iteration Velocity

Iterate quickly:
- Small focused changes are better than big rewrites
- Confirm understanding before changing
- Make changes, get feedback, iterate again
- Multiple quick iterations > one slow perfect update

## Version History

- 1.0.0 (2026-01-12): Initial version adapted from fabbro iterate_plan command
