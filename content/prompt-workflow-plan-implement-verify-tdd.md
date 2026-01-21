---
title: Plan-Implement-Verify with TDD
type: prompt
tags: [tdd, workflow, testing, implementation, planning]
tools: [claude-code, aider, cursor, any-cli-llm]
status: tested
created: 2026-01-12
updated: 2026-01-12
version: 1.0.0
related: [prompt-workflow-deliberate-commits.md, prompt-workflow-create-handoff.md]
source: adapted-from-fabbro
---

# Plan-Implement-Verify with TDD

## When to Use

Use this prompt when implementing features or fixes using Test-Driven Development methodology.

**Critical for:**
- Implementing new features with test-first approach
- Ensuring code is testable from the start
- Creating a clear implementation plan before coding
- Maintaining test coverage throughout development
- Verifying each phase before moving forward

**Do NOT use when:**
- Exploring or prototyping without clear requirements
- Fixing trivial typos or documentation
- Working in codebases without test infrastructure
- Requirements are too vague to write tests

## The Prompt

````
# Implement with TDD Workflow

Implement the requested feature following Test-Driven Development and a phased approach.

## Core Principle: Red, Green, Refactor

**Red:** Write a failing test that describes desired behavior
**Green:** Write minimal code to make the test pass
**Refactor:** Clean up code while keeping tests green

## Process

### Phase 0: Plan (If needed)

**For complex features, create a plan first:**

1. Read relevant code to understand current state
2. Identify what needs to change
3. Break work into logical phases
4. Define success criteria (automated and manual)
5. Get user approval of plan before implementing

**Plan structure:**
```markdown
# [Feature Name] Implementation Plan

## Current State
[What exists now]

## Desired End State
[What will exist, how to verify]

## Out of Scope
[What we're NOT doing]

## Phase 1: [Name]

### Changes Required
- File: `path/to/file.ext`
- Changes: [Description]
- Tests: [What tests to write]

### Success Criteria

#### Automated:
- [ ] New tests pass
- [ ] Existing tests still pass
- [ ] Type checking passes (if applicable)

#### Manual:
- [ ] [Specific manual verification]

## Phase 2: [Name]
[Continue...]
```

**Get plan approved before proceeding.**

### Phase 1: Implement First Component

**For each phase:**

#### Step 1: Write Failing Test

```typescript
// RED: Test describes what should happen
describe('UserAuthentication', () => {
  it('should validate JWT tokens', async () => {
    const token = 'valid.jwt.token'
    const result = await validateToken(token)
    expect(result).toEqual({ userId: '123', valid: true })
  })
})
```

Run test: **Confirm it fails** (and fails for the right reason)

#### Step 2: Implement Minimal Code

```typescript
// GREEN: Minimal implementation to pass test
async function validateToken(token: string) {
  // Simplest thing that could work
  const decoded = jwt.verify(token, SECRET)
  return {
    userId: decoded.sub,
    valid: true
  }
}
```

Run test: **Confirm it passes**

#### Step 3: Refactor If Needed

```typescript
// REFACTOR: Clean up while keeping tests green
async function validateToken(token: string): Promise<TokenResult> {
  try {
    const decoded = jwt.verify(token, getSecret()) as JWTPayload
    return {
      userId: decoded.sub,
      valid: true
    }
  } catch (error) {
    return { userId: null, valid: false, error: error.message }
  }
}
```

Run tests: **Confirm they still pass**

#### Step 4: Verify Phase Completion

**Automated verification:**
```bash
# Run all tests
npm test

# Run type checking (if applicable)
npm run type-check

# Run linting (if applicable)
npm run lint
```

**Manual verification:**
- [ ] [Specific manual tests from plan]

#### Step 5: Inform User

```
Phase 1 Complete - Ready for Verification

Automated verification:
- [x] Tests pass (12 new tests, all existing tests still passing)
- [x] Type checking passes
- [x] Linting passes

Manual verification needed:
- [ ] [Manual verification step 1]
- [ ] [Manual verification step 2]

Changes made:
- src/auth/validate.ts: Added validateToken function
- tests/auth/validate.test.ts: Added 12 tests covering valid/invalid tokens

Let me know when verified so I can proceed to Phase 2.
```

**Wait for user confirmation before proceeding.**

### Phase 2, 3, etc.: Repeat

Continue with each phase following the same Red-Green-Refactor cycle.

## Key Guidelines

1. **Tests first, always** - Write the test before the implementation
2. **Minimal implementation** - Write just enough code to pass the test
3. **One phase at a time** - Complete and verify before moving on
4. **Keep tests green** - Never commit with failing tests
5. **Refactor with green tests** - Only clean up when tests pass
6. **Verify at each phase** - Automated and manual checks
7. **Update plan** - Check off completed items as you go

## When Things Don't Match

If reality doesn't match the plan:

```
Issue in Phase [N]:

Expected: [What the plan says]
Found: [Actual situation]
Why this matters: [Explanation]

Options:
1. Adapt implementation to reality
2. Update plan to reflect new understanding
3. Discuss with user

How should I proceed?
```

**Don't blindly follow an outdated plan.**

## Resuming Work

If resuming from an existing plan:

1. Read the plan completely
2. Check for items already checked off
3. Start from first unchecked item
4. Verify previous work if something seems off
5. Continue with Red-Green-Refactor cycle
````

## Example

**Context:**
Implementing OAuth token validation feature. Plan has been created and approved with 3 phases.

**Input:**
```
Implement the OAuth token validation following the approved plan at plans/2026-01-12-oauth-validation.md
```

**AI Response (following prompt):**

```
I'll implement OAuth token validation following TDD. Let me read the plan first.

[Reads plan]

The plan has 3 phases:
1. Basic token structure validation
2. Signature verification
3. Expiry and claims validation

Starting with Phase 1: Basic token structure validation

## Phase 1: Token Structure Validation

### Step 1: Write Failing Test (RED)

I'll create a test that describes what we want:

```typescript
// tests/auth/oauth-token.test.ts
import { validateTokenStructure } from '@/auth/oauth-token'

describe('OAuth Token Validation', () => {
  describe('validateTokenStructure', () => {
    it('should accept valid JWT structure', () => {
      const validToken = 'header.payload.signature'
      expect(validateTokenStructure(validToken)).toBe(true)
    })

    it('should reject tokens without 3 parts', () => {
      const invalidToken = 'header.payload'
      expect(validateTokenStructure(invalidToken)).toBe(false)
    })

    it('should reject empty strings', () => {
      expect(validateTokenStructure('')).toBe(false)
    })

    it('should reject null/undefined', () => {
      expect(validateTokenStructure(null)).toBe(false)
      expect(validateTokenStructure(undefined)).toBe(false)
    })
  })
})
```

Running test: `npm test -- oauth-token.test.ts`

❌ FAILED (as expected): Module '@/auth/oauth-token' not found

Good - test fails for the right reason (function doesn't exist yet).

### Step 2: Implement Minimal Code (GREEN)

Now I'll write the simplest implementation:

```typescript
// src/auth/oauth-token.ts
export function validateTokenStructure(token: any): boolean {
  if (!token || typeof token !== 'string') {
    return false
  }

  const parts = token.split('.')
  return parts.length === 3 && parts.every(part => part.length > 0)
}
```

Running test: `npm test -- oauth-token.test.ts`

✓ PASSED: All 4 tests passing

### Step 3: Refactor (if needed)

The implementation is already clean and minimal. No refactoring needed.

### Step 4: Verify Phase Completion

Automated verification:
```bash
# All tests
npm test
# ✓ 156 tests passing (4 new, 152 existing)

# Type checking
npm run type-check
# ✓ No type errors

# Linting
npm run lint
# ✓ No linting errors
```

Manual verification: None required for this phase.

✓ Phase 1 Complete

## Phase 1 Summary

**Implemented:**
- `validateTokenStructure()` function in src/auth/oauth-token.ts
- 4 tests covering valid and invalid token structures
- All tests passing

**Files changed:**
- src/auth/oauth-token.ts (new file, 10 lines)
- tests/auth/oauth-token.test.ts (new file, 28 lines)

**Next:** Phase 2 - Signature Verification

Shall I proceed to Phase 2, or would you like to verify Phase 1 first?
```

**User confirms, AI continues:**

```
Proceeding to Phase 2: Signature Verification

### Step 1: Write Failing Test (RED)

```typescript
describe('verifySignature', () => {
  it('should verify valid signature with correct secret', async () => {
    const token = 'eyJ...valid.token'
    const result = await verifySignature(token, 'correct-secret')
    expect(result.valid).toBe(true)
  })

  it('should reject invalid signature', async () => {
    const token = 'eyJ...tampered.token'
    const result = await verifySignature(token, 'secret')
    expect(result.valid).toBe(false)
  })
})
```

Running test: `npm test`

❌ FAILED: verifySignature is not defined

[Continues with GREEN, REFACTOR, VERIFY cycle...]
```

## Expected Results

- Feature implemented incrementally with tests
- Each phase completed and verified before moving on
- Tests written before implementation (TDD)
- All tests passing at every checkpoint
- Clear communication of progress
- User verification at phase boundaries

## Variations

**For bug fixes:**
```markdown
## Bug Fix with TDD

### Step 1: Write Failing Test (Reproduces Bug)
[Test that demonstrates the bug]

### Step 2: Verify Test Fails
[Confirm test reproduces the bug]

### Step 3: Fix Implementation
[Minimal fix to make test pass]

### Step 4: Verify Fix
[Test now passes, bug no longer reproduces]

### Step 5: Add Regression Test
[Ensure bug can't return]
```

**For refactoring:**
```markdown
## Refactoring with Test Safety

### Step 1: Ensure Existing Tests Pass
[All tests green before refactoring]

### Step 2: Refactor Code
[Structural changes]

### Step 3: Verify Tests Still Pass
[No behavior change, tests prove it]

**Rule:** If tests fail during refactoring, revert and approach differently.
```

**For exploratory work:**
```markdown
## Spike with Learning Tests

### Step 1: Write Learning Test
[Test to understand how library/API works]

### Step 2: Experiment
[Try different approaches]

### Step 3: Extract Pattern
[Once understood, write real implementation tests]

**Note:** Spike code is throwaway. Real implementation follows TDD.
```

## References

- [Test-Driven Development by Kent Beck](https://www.oreilly.com/library/view/test-driven-development/0321146530/)
- [Growing Object-Oriented Software, Guided by Tests](http://www.growing-object-oriented-software.com/)
- [Fabbro Agent System](https://github.com/example/fabbro) - TDD workflow inspiration
- [Martin Fowler on TDD](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

## Notes

### Why TDD

**Benefits:**
- **Testable design** - Tests first force testable architecture
- **Clear requirements** - Writing tests clarifies what you're building
- **Refactoring safety** - Tests catch regressions immediately
- **Documentation** - Tests show how code should be used
- **Confidence** - Green tests mean code works

**Common objections:**
- "TDD is slower" - Slower initially, faster overall (less debugging)
- "Tests are overhead" - Tests are the product (verified code)
- "Hard to test UI" - Component/integration tests still follow Red-Green-Refactor

### The Discipline

TDD requires discipline:
1. **Don't skip the test** - Even when you "know" the implementation
2. **Watch it fail first** - Confirms test actually tests something
3. **Minimal implementation** - Resist premature optimization
4. **Refactor with green tests** - Only clean up when safe
5. **Never commit failing tests** - Red is temporary, commit green

### When TDD Is Hard

TDD is harder when:
- **Legacy code without tests** - Use characterization tests first
- **External dependencies** - Use mocks and integration tests
- **UI-heavy code** - Test logic separately, use component tests
- **Unclear requirements** - Spike first, then TDD

In these cases:
- Adapt the approach (integration tests, component tests)
- Invest in testability (dependency injection, abstractions)
- Start small (test one thing, grow from there)

### TDD with AI Assistance

AI can help with TDD:
- **Write tests quickly** - Generate test scaffolding
- **Suggest test cases** - Edge cases you might miss
- **Implement to tests** - Code that passes tests
- **Explain failures** - Interpret test output

AI should NOT:
- Skip the Red phase (watch tests fail)
- Write implementation before tests
- Commit failing tests

### Phase-Based Development

Breaking work into phases:
- **Prevents overwhelm** - One piece at a time
- **Enables verification** - Check each piece works
- **Allows course correction** - Adapt plan as you learn
- **Creates checkpoints** - Known good states to return to

Each phase should:
- Be independently verifiable
- Add value
- Leave codebase in working state
- Take <2 hours ideally

## Version History

- 1.0.0 (2026-01-12): Initial version adapted from fabbro TDD workflow
