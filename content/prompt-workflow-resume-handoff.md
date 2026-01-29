---
title: Resume Work from Handoff Document
type: prompt
tags: [context, handoff, session-management, resume, workflow]
tools: [claude-code, aider, cursor, any-cli-llm]
status: tested
created: 2026-01-12
updated: 2026-01-12
version: 1.0.0
related: [prompt-workflow-create-handoff.md, prompt-workflow-deliberate-commits.md]
source: https://github.com/humanlayer/humanlayer/blob/main/.claude/commands/resume_handoff.md
---

# Resume Work from Handoff Document

## When to Use

Use this prompt when starting a new AI session and need to continue work from a previous session that created a handoff document.

**Critical for:**
- Continuing work after hitting context limits
- Resuming work after breaks (hours, days, weeks)
- Picking up work from another developer
- Restoring context efficiently without re-explaining everything

**Do NOT use when:**
- Starting completely new work
- The handoff is very old and codebase has changed significantly
- You prefer to start fresh with new context

## The Prompt

````
# Resume from Handoff

Resume work from a handoff document through analysis and verification.

## Step 1: Read Handoff Completely

**If given a handoff path:**
```bash
# Read the handoff file
cat handoffs/2026-01-12_14-30-00_oauth-integration.md
```

**If given an issue ID:**
```bash
# Find handoffs for this issue
ls handoffs/*issue-123* | sort -r | head -1

# Or search in handoff content
grep -l "issue: issue-123" handoffs/*.md | sort -r | head -1
```

**If no parameter provided:**
```bash
# List recent handoffs
ls -lt handoffs/ | head -10

# Ask user which to resume
```

## Step 2: Extract Key Information

From the handoff, identify:

**Task Status:**
- What was completed?
- What's in progress?
- What's planned?

**Critical Files:**
- Which files are most important?
- What are the line ranges mentioned?

**Key Learnings:**
- What discoveries affect our work?
- What mistakes should we avoid?

**Open Questions:**
- What needs decisions?
- What was uncertain?

**Next Steps:**
- What's the prioritized todo list?

## Step 3: Verify Current State

```bash
# Check if anything changed since handoff
git log --oneline [handoff_commit]..HEAD

# Check current branch
git branch --show-current

# Check working directory status
git status

# Compare current state to handoff state
git diff [handoff_commit]
```

## Step 4: Read Referenced Files

Read the "Critical Files" section files:

```bash
# Read each critical file mentioned
cat src/auth/oauth.ts
cat src/auth/providers.ts
# ... etc
```

**Focus on:**
- Understanding current implementation
- Verifying learnings still apply
- Finding any conflicts with changes since handoff

## Step 5: Present Analysis

```
I've analyzed the handoff from [date]. Here's the current situation:

## Original Context
[Summary of what was being worked on]

## Task Status Review

**Completed (from handoff):**
- [x] Task 1 - VERIFIED: Still complete
- [x] Task 2 - VERIFIED: Still complete

**In Progress (from handoff):**
- [ ] Task 3 - STATUS: [describe current state]

**Planned:**
- [ ] Next task 1 [Priority from handoff]
- [ ] Next task 2

## Changes Since Handoff

**Commits since handoff:**
[List any commits between handoff and now]

**Impact:**
[How these changes affect our work]

## Key Learnings Still Applicable

1. [Learning 1] - Still valid because [reason]
2. [Learning 2] - Still valid, see [file:line]

## Questions Needing Resolution

From handoff:
- [ ] [Question 1] - [Current thinking or need decision]
- [ ] [Question 2] - [Can we resolve this now?]

## Recommended Next Action

Based on the handoff priorities and current state:

**Priority 1:** [Action from handoff]
- Reason: [Why this is still the priority]
- Files: [What needs to change]
- Approach: [How to do it]

Shall I proceed with [action]?
```

## Step 6: Get Confirmation and Begin

Wait for user confirmation, then:
- Create todo list from next steps
- Start with highest priority action
- Apply learnings from handoff
- Track progress as you go

## Scenarios

### Clean Continuation
All changes present, no conflicts, proceed normally.

### Diverged Codebase
```
Changes detected since handoff:

Commit a1b2c3d: "refactor: restructure auth module"
- Affects our OAuth implementation
- Provider files moved to src/auth/providers/ directory
- Need to update our understanding

I'll read the new structure before proceeding. Let me check:
- src/auth/providers/ directory contents
- How existing patterns changed
- If our learnings still apply

[After reading]

Updated understanding:
- Providers now in separate directory (not one file)
- Pattern still the same, just reorganized
- Our work can continue with file path updates

Shall I proceed with the original plan, adapting to new structure?
```

### Incomplete Work
```
The handoff shows Task 3 was "in progress". Let me verify current state:

[Reads relevant files]

Current state: Task 3 is partially done:
- OAuth flow implemented
- Provider selection NOT YET implemented
- Error states missing

Recommended approach:
1. Complete Task 3 first (finish what was started)
2. Then proceed to planned work

Shall I complete Task 3 before moving to new work?
```

### Stale Handoff
```
The handoff is from [3 weeks ago]. Significant changes detected:

Changes:
- 47 commits since handoff
- Auth system refactored
- New OAuth library integrated

This handoff may be too stale to resume directly.

Options:
1. Review changes and adapt the plan
2. Start fresh with current codebase state
3. Cherry-pick specific unfinished work

What would you like to do?
```

## Guidelines

1. **Always verify before acting** - Don't assume handoff matches reality
2. **Apply learnings** - Use documented patterns and avoid noted pitfalls
3. **Check open questions** - Some may be resolved or need decisions now
4. **Respect priorities** - Handoff author prioritized for a reason
5. **Adapt to changes** - If codebase changed, acknowledge and adapt
6. **Create new handoff** - When this session ends, update or create new one
````

## Example

**Context:**
Resuming OAuth implementation from yesterday's handoff. Need to continue with testing and error handling.

**Input:**
```
Resume from handoffs/2026-01-12_14-30-00_oauth-integration.md
```

**AI Response (following prompt):**

```bash
# Reading handoff
cat handoffs/2026-01-12_14-30-00_oauth-integration.md

# Checking for changes
git log --oneline a7f3c92..HEAD
# Output: (empty - no new commits)

git status
# Output: On branch feature/oauth-integration, working tree clean

# Reading critical files
cat src/auth/oauth.ts
cat src/auth/providers.ts
cat src/contexts/AuthContext.tsx
```

**AI presents analysis:**

```
I've analyzed the handoff from yesterday (2026-01-12 14:30).

## Original Context
Implementing OAuth authentication (Google, GitHub, Microsoft) to supplement
existing email/password login. Infrastructure is complete, UI integration
mostly done, testing and error handling remain.

## Task Status Review

**Completed (verified):**
- [x] OAuth flow orchestration - VERIFIED in src/auth/oauth.ts:1-89
- [x] Provider abstraction - VERIFIED in src/auth/providers.ts:1-134
- [x] TypeScript interfaces - VERIFIED in src/types/auth.ts:34-67
- [x] Basic unit tests - VERIFIED in tests/oauth.test.ts
- [x] LoginForm UI updates - VERIFIED in src/components/LoginForm.tsx:67-89

**In Progress (to complete):**
- [ ] Provider button error states - Partially styled, missing error states
- [ ] OAuth flow error handling - Basic errors only, needs network error handling

**Planned (from handoff):**
- [ ] End-to-end testing with real providers [HIGH PRIORITY]
- [ ] Complete error handling [HIGH PRIORITY]
- [ ] Token storage decision [BLOCKING]
- [ ] Configuration UI [MEDIUM]

## Changes Since Handoff

No commits since handoff (a7f3c92).
Working directory clean.
All code from handoff is present and unchanged.

## Key Learnings Applied

1. **SessionStorage for OAuth state** (src/auth/oauth.ts:45)
   - Still implemented correctly
   - Prevents multi-tab state confusion

2. **Provider interface is async** (src/auth/providers.ts:8-15)
   - All providers correctly implement async methods
   - Ready for config-fetching providers

3. **Must use existing Context pattern** (src/contexts/AuthContext.tsx:23-45)
   - Pattern still in place
   - Our integration points still valid

## Open Questions from Handoff

1. **Token storage location?**
   - Options: localStorage vs httpOnly cookies vs memory
   - BLOCKS: Token refresh implementation
   - Need: Security decision

2. **PKCE for all providers?**
   - Current: Not implemented
   - Decision needed before finalizing

3. **Provider rate limiting handling?**
   - Google has rate limits
   - Need strategy for 429 responses

## Recommended Next Action

Based on handoff Priority 1: **End-to-end testing**

**What:** Test complete OAuth flow with real provider credentials
**Why:** Validates implementation before proceeding to configuration UI
**How:**
1. Set up test OAuth apps (Google, GitHub, Microsoft)
2. Add test credentials to local config
3. Test flow: button click → redirect → callback → logged in
4. Verify token storage and usage
5. Test error cases

**Files involved:**
- src/auth/oauth.ts (main flow)
- src/auth/providers.ts (provider implementations)
- src/components/LoginForm.tsx (entry point)

**Prerequisite:** Need test OAuth app credentials
- Do you have these, or should I provide setup instructions?

Shall I proceed with testing setup?
```

**User provides credentials, AI continues:**

```
Great! I'll start with end-to-end testing. Let me create a todo list:

1. [ ] Add test credentials to local config
2. [ ] Create test helper for OAuth flow
3. [ ] Test Google OAuth flow
4. [ ] Test GitHub OAuth flow
5. [ ] Test Microsoft OAuth flow
6. [ ] Test error cases (deny, network failure)
7. [ ] Document findings

Starting with test configuration...
```

## Expected Results

- Seamless continuation of work from previous session
- All context from handoff properly restored
- Current state verified against handoff expectations
- Clear understanding of next steps
- Any changes since handoff identified and adapted to
- User confirmation before proceeding with work

## Variations

**For team handoffs:**
```markdown
## Team Context

Original author: @alice
Time since handoff: 2 days

Changes by others:
- @bob merged PR #456 (refactor auth module)
- @charlie added tests in commit def789

I'll verify these changes don't conflict with our planned work.
[Analysis of team changes]
```

**For multi-phase projects:**
```markdown
## Phase Context

Original handoff: Phase 2 of 4 (Provider Integration)
Phase document: docs/oauth-implementation-plan.md

Phase 2 status:
- ✓ Subtask 2.1: Provider interface (complete)
- ⚠ Subtask 2.2: OAuth flow (90% done)
- ☐ Subtask 2.3: Error handling (not started)

Continuing with Subtask 2.2 completion, then 2.3.
```

**For stale handoffs requiring reconciliation:**
```markdown
## Reconciliation Needed

Handoff age: 3 weeks
Commits since: 47
Major changes detected:
- New OAuth library integrated (replaces our custom impl)
- Provider interface changed
- Test structure reorganized

Analysis:
- Our provider abstraction: OBSOLETE (library provides this)
- Our OAuth flow: PARTIALLY OBSOLETE (library handles core flow)
- Our UI integration: STILL VALID (UI code unchanged)

Recommended approach:
1. Abandon custom OAuth flow implementation
2. Integrate with new library
3. Preserve UI work
4. Update tests for new library

This is a significant pivot from the handoff. Shall we proceed with
adapting to the new approach, or would you prefer to discuss first?
```

## References

- [HumanLayer resume_handoff.md](https://github.com/humanlayer/humanlayer/blob/main/.claude/commands/resume_handoff.md) - Original resume handoff workflow
- [The Phoenix Project](https://itrevolution.com/the-phoenix-project/) - Work handoff principles from DevOps

## Notes

### Why Handoff Resumption Matters

Simply providing a handoff file to an AI without this process leads to:
- **Blindly following outdated plans** - Codebase may have changed
- **Missing context** - Not understanding why decisions were made
- **Duplicated work** - Not recognizing completed tasks
- **Ignoring learnings** - Repeating mistakes from previous session

This structured approach ensures:
- Verification of current state
- Understanding of context
- Adaptation to changes
- Application of learnings

### Critical Steps Not to Skip

1. **Verify current state** - Always check git log and diff
2. **Read critical files** - Don't assume, verify implementation
3. **Present analysis** - Let user confirm understanding before proceeding
4. **Check open questions** - Some may need resolution before continuing

### Common Mistakes

1. **Assuming nothing changed** - Always verify git state
2. **Not reading files** - Trust but verify
3. **Ignoring learnings** - The most valuable part of handoffs
4. **Following priorities blindly** - Context may have changed
5. **Not adapting to changes** - Rigid adherence to outdated plans

### When Handoffs Don't Work

Handoffs become less effective when:
- **Too much time passed** - Codebase diverged significantly
- **Major refactoring occurred** - Architecture changed
- **Handoff was too brief** - Missing critical context
- **Learnings not captured** - "Why" is lost

In these cases:
- Consider starting fresh
- Or invest time in reconciliation
- Create a new handoff after reconciliation

## Version History

- 1.0.0 (2026-01-12): Initial version adapted from [HumanLayer resume_handoff.md](https://github.com/humanlayer/humanlayer/blob/main/.claude/commands/resume_handoff.md)
