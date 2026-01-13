---
title: Implement Plan
type: prompt
subtype: workflow
tags: [implementation, tdd, execution, testing, verification]
tools: [claude-code, cursor, aider, any-cli-llm]
status: tested
created: 2026-01-12
updated: 2026-01-12
version: 1.0.0
related: [prompt-workflow-create-plan.md, prompt-workflow-plan-implement-verify-tdd.md, prompt-workflow-iterate-plan.md]
source: adapted-from-fabbro
---

# Implement Plan

## When to Use

Use this prompt when you have an approved implementation plan and need to execute it following Test-Driven Development.

**Critical for:**
- Executing approved plans from `plans/` directory
- Following TDD methodology (Red-Green-Refactor)
- Phased implementation with verification checkpoints
- Maintaining test coverage during implementation
- Working from existing plans created by yourself or others

**Do NOT use when:**
- No plan exists (create one first with `prompt-workflow-create-plan.md`)
- Plan is not approved or has unresolved questions
- You need to significantly deviate from the plan (iterate the plan first)

## The Prompt

```
# Implement Plan

Implement an approved plan following Test-Driven Development methodology.

## Getting Started

When given a plan path:
1. Read the plan completely (no limit/offset)
2. Check for existing checkmarks (✓ or [x]) indicating completed work
3. Read related specs/documentation referenced in the plan
4. Create a todo list to track progress through phases
5. Start implementing from the first unchecked phase

If no plan path provided, ask the user which plan to implement or list available plans.

## Implementation Philosophy

Follow the **Red, Green, Refactor** cycle:

1. **Red**: Write a failing test for the desired behavior
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Clean up code while keeping tests green

**Never skip the Red phase** - watching tests fail confirms they actually test something.

## Workflow

### For Each Phase:

#### Step 1: Read Phase Requirements

1. Read the phase section completely
2. Understand files to change and what changes are needed
3. Note the success criteria (automated and manual)
4. Check for any dependencies or prerequisites

#### Step 2: Write Tests First (TDD - RED)

1. Write test(s) that describe the desired behavior
2. Make tests as specific as possible
3. Run the tests - **confirm they fail** (and fail for the right reason)
4. If test doesn't fail, the test is wrong or code already works

```typescript
// Example: Write failing test first
describe('validateToken', () => {
  it('should accept valid JWT tokens', async () => {
    const token = 'valid.jwt.token'
    const result = await validateToken(token)
    expect(result.valid).toBe(true)
  })
})

// Run test: npm test
// ❌ FAILED: validateToken is not defined
// Good - fails for the right reason
```

#### Step 3: Implement Minimal Code (GREEN)

1. Write just enough code to make the test pass
2. Don't add features not tested yet
3. Resist the urge to "make it perfect" now
4. Run tests - **confirm they pass**

```typescript
// Minimal implementation to pass test
export async function validateToken(token: string) {
  const decoded = jwt.verify(token, SECRET)
  return { valid: true, userId: decoded.sub }
}

// Run test: npm test
// ✓ PASSED
```

#### Step 4: Refactor (if needed)

1. Clean up the code while tests stay green
2. Extract functions, improve names, remove duplication
3. Run tests after each refactor - **keep them green**
4. Stop when code is clean enough

```typescript
// Refactored with better error handling
export async function validateToken(token: string): Promise<TokenResult> {
  try {
    const decoded = jwt.verify(token, getSecret()) as JWTPayload
    return {
      valid: true,
      userId: decoded.sub
    }
  } catch (error) {
    return {
      valid: false,
      userId: null,
      error: error.message
    }
  }
}

// Run test: npm test
// ✓ Still passing after refactor
```

#### Step 5: Run Success Criteria Checks

**Automated verification:**
```bash
# Run all tests (not just the new ones)
npm test

# Type checking (if applicable)
npm run type-check  # or tsc --noEmit

# Linting (if applicable)
npm run lint

# Build (if applicable)
npm run build
```

**Manual verification:**
- Follow manual verification steps from the plan
- Actually perform the verification, don't skip it
- Note any issues or unexpected behaviors

#### Step 6: Mark Phase Complete

1. Check off completed items in the plan file
2. Update the plan with any learnings or deviations
3. Commit the changes for this phase (if appropriate)

#### Step 7: Inform User

```
Phase [N] Complete - Ready for Verification

Automated verification:
- [x] All tests pass (15 tests, 3 new)
- [x] Type checking passes
- [x] Build succeeds

Manual verification needed:
- [ ] [Manual step 1 from plan]
- [ ] [Manual step 2 from plan]

Changes made:
- src/auth/validate.ts:25-45 - Added validateToken function
- tests/auth/validate.test.ts:12-28 - Added 3 tests for token validation

Let me know when verified so I can proceed to Phase [N+1].
```

**Wait for user confirmation before proceeding to next phase.**

### Moving Between Phases

- Complete one phase before starting the next
- Don't work on multiple phases in parallel
- Each phase should leave the codebase in a working state
- If a phase is blocked, inform the user immediately

## When Things Don't Match Reality

If the plan doesn't match what you find:

```
Issue in Phase [N]:

Expected (from plan): [What the plan says]
Found (in codebase): [Actual situation]
Why this matters: [Impact explanation]

Options:
1. Adapt implementation to current reality
2. Update the plan to reflect new understanding
3. Ask user for guidance

How should I proceed?
```

**Important:** Don't blindly follow an outdated or incorrect plan. Reality wins.

## Resuming Work

If the plan has checkmarks indicating completed work:

1. **Trust completed work** - assume it's done correctly
2. **Start from first unchecked item** - don't redo completed work
3. **Verify previous work ONLY if**:
   - Something seems obviously broken
   - Tests are failing
   - Current phase depends on previous phase and seems incompatible
4. **Continue with Red-Green-Refactor** cycle from current phase

## Key Reminders

1. **Tests first, always** - Write test before implementation (TDD)
2. **Watch it fail** - Confirm test fails before implementing
3. **Minimal code** - Write just enough to pass the test
4. **Keep tests green** - All tests should pass after each change
5. **Refactor safely** - Only refactor when tests are green
6. **One phase at a time** - Complete and verify before moving on
7. **Mark progress** - Check off items as you complete them
8. **Verify thoroughly** - Actually run the verification steps

## Handling Common Situations

### Tests are already passing (someone implemented it):
```
Phase [N]: The tests I was about to write already pass. It appears this work was already completed.

Verification:
- [x] Tests exist and pass
- [x] Implementation matches plan requirements

Marking phase complete and moving to next phase.
```

### Can't make tests pass:
```
Phase [N]: Issue encountered

I wrote tests for [feature] but after [X] attempts, can't make them pass due to [specific reason].

Options:
1. Revise the approach (suggest alternative)
2. Update the plan (if requirements changed)
3. Need more research/context

How should we proceed?
```

### Found a better approach mid-implementation:
```
Phase [N]: Alternative approach discovered

While implementing [feature], I discovered [better pattern/approach].

Current plan: [Approach from plan]
Alternative: [New approach]
Tradeoffs: [Pros/cons]

Should I:
1. Continue with plan as written
2. Update plan and use new approach
3. Discuss further
```

### External dependency is broken/unavailable:
```
Phase [N]: Blocked by external dependency

Cannot proceed because [dependency] is [unavailable/broken/different than expected].

Impact: [What this blocks]
Workaround options: [If any]

Need guidance on how to proceed.
```

## Working with Issue Trackers

If using an issue tracker (GitHub Issues, Jira, etc.):

**Before starting:**
```bash
# Note the issue ID in commits
# Reference the plan in issue comments
```

**After completing a phase:**
```bash
# Update issue with progress
# Link commits to issue
# Add "Completed Phase N" comment
```

**After completing all phases:**
```bash
# Close or mark issue as ready for review
# Link to relevant commits/PRs
```

## Integration with Other Workflows

**After implementation:**
- Use `prompt-workflow-deliberate-commits.md` to commit changes thoughtfully
- Use `prompt-task-describe-pr.md` to create comprehensive PR descriptions
- Use `prompt-task-iterative-code-review.md` to self-review before committing

**If need to pause:**
- Use `prompt-workflow-create-handoff.md` to document progress
- Mark current phase status in todo list
- Note what's complete vs in-progress

## Example Flow

**Input:**
```
Implement the plan at plans/2026-01-12-dark-mode-support.md
```

**AI Response (following prompt):**
```
I'll implement the dark mode support plan. Let me read it first.

[Reads plan completely]

The plan has 4 phases:
1. Theme infrastructure (Context + storage)
2. CSS variable system for colors
3. Dark mode styles for components
4. System preference detection

I'll create a todo list to track progress:
- [ ] Phase 1: Theme infrastructure
- [ ] Phase 2: CSS variables
- [ ] Phase 3: Component styles
- [ ] Phase 4: System preference

Starting with Phase 1: Theme infrastructure

## Phase 1: Theme Infrastructure

### Step 1: Write Failing Test (RED)

I'll create a test for the theme context:

```typescript
// tests/contexts/ThemeContext.test.tsx
import { renderHook, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'

describe('ThemeContext', () => {
  it('should default to light theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    })
    expect(result.current.theme).toBe('light')
  })

  it('should toggle between light and dark', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    })

    act(() => {
      result.current.setTheme('dark')
    })

    expect(result.current.theme).toBe('dark')
  })

  it('should persist theme to localStorage', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    })

    act(() => {
      result.current.setTheme('dark')
    })

    expect(localStorage.getItem('theme')).toBe('dark')
  })
})
```

Running test: `npm test ThemeContext`

❌ FAILED: Module '@/contexts/ThemeContext' not found

Good - test fails for the right reason (context doesn't exist yet).

### Step 2: Implement Minimal Code (GREEN)

Now I'll create the theme context:

```typescript
// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

Running test: `npm test ThemeContext`

✓ PASSED: All 3 tests passing

### Step 3: Refactor

The implementation is clean. No refactoring needed at this stage.

### Step 4: Run Success Criteria

Automated verification:
```bash
npm test
# ✓ 128 tests passing (3 new)

npm run type-check
# ✓ No type errors

npm run lint
# ✓ No linting errors
```

Manual verification: None required for this phase.

✓ Phase 1 Complete

## Phase 1 Summary

**Implemented:**
- ThemeContext with light/dark theme support
- localStorage persistence
- 3 tests covering default theme, toggle, and persistence

**Files changed:**
- src/contexts/ThemeContext.tsx (new file, 32 lines)
- tests/contexts/ThemeContext.test.tsx (new file, 45 lines)

**Next:** Phase 2 - CSS variable system

Shall I proceed to Phase 2, or would you like to verify Phase 1 first?
```

**User confirms, continues to Phase 2 following same Red-Green-Refactor cycle...**

## Expected Results

- Plan implemented incrementally with TDD
- Each phase completed and verified before moving on
- All tests passing at every checkpoint
- Clear communication of progress
- Plan file updated with completed checkmarks
- Working, tested code ready for review

## References

- [Test-Driven Development by Kent Beck](https://www.oreilly.com/library/view/test-driven-development/0321146530/)
- `prompt-workflow-create-plan.md` - How to create plans
- `prompt-workflow-plan-implement-verify-tdd.md` - Full TDD workflow with planning
- `prompt-workflow-iterate-plan.md` - Update plans when needed

## Notes

### The Discipline of TDD

TDD requires discipline to:
1. **Write the test first** - Even when you "know" the implementation
2. **Watch it fail** - Confirms test actually tests something
3. **Write minimal code** - Resist premature optimization
4. **Refactor with green tests** - Only clean up when safe
5. **Never commit red** - Tests must pass before committing

### Why Follow Plans?

Plans provide:
- **Clear direction** - Know what to build next
- **Verification checkpoints** - Ensure quality at each step
- **Handoff capability** - Anyone can continue the work
- **Documentation** - Record of decisions and approach
- **Scope control** - Avoid feature creep

### When to Deviate from Plan

It's okay to deviate when:
- **Reality doesn't match** - Codebase changed since planning
- **Better approach discovered** - Found a clearer pattern
- **Plan has errors** - Identified mistakes in planning
- **Requirements changed** - User provided new information

**Important:** Always inform the user and update the plan when deviating.

### Phase-Based Development Benefits

Breaking work into phases:
- **Prevents overwhelm** - One piece at a time
- **Enables verification** - Check each piece works
- **Allows course correction** - Adapt as you learn
- **Creates checkpoints** - Known good states to return to
- **Facilitates collaboration** - Natural handoff points

Each phase should:
- Be independently verifiable
- Add value
- Leave codebase in working state
- Take <2 hours ideally

## Version History

- 1.0.0 (2026-01-12): Initial version adapted from fabbro implement_plan command
