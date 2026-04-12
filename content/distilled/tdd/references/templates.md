# TDD Implementation Templates

Use these templates to communicate the plan and phase progress to the user.

## Implementation Plan Template

```markdown
# [Feature/Fix Name] Implementation Plan

## Current State
[Description of current situation]

## Desired End State
[What will be implemented, how it will be verified]

## Out of Scope
[What this plan will NOT address]

## Phase 1: [Name]
### Changes Required
- **File:** `path/to/file`
- **Changes:** [Description]
- **Tests:** [Test cases to write]

### Success Criteria
- [ ] New tests pass
- [ ] Existing tests still pass
- [ ] [Manual verification step]

## Phase 2: [Name]
[Continue...]
```

## Phase Completion Summary Template

```markdown
Phase [N] Complete - Ready for Verification

**Automated Verification:**
- [x] New Tests: [Count] tests passing
- [x] Regressions: All existing tests still passing
- [x] Checks: Type-check and Lint passing

**Manual Verification Needed:**
- [ ] [Step 1]
- [ ] [Step 2]

**Changes Made:**
- [File 1]: [Brief summary]
- [File 2]: [Brief summary]

Shall I proceed to Phase [N+1]?
```
