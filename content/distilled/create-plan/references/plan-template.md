```markdown
# [Feature Name] Implementation Plan

Date: YYYY-MM-DD

## Overview

[Brief description of what is being implemented]

## Related

- Spec: `specs/...` [if applicable]
- Research: `research/...` [if applicable]
- Related issues or tickets: [references]

## Current State

[What exists now and what is missing]

## Desired End State

[What will exist after implementation]

How to verify:
- [Specific verification step]
- [Expected behavior]

## Out of Scope

[What is explicitly excluded]

## Risks & Mitigations

[Key risks and mitigations]

## Phase 1: [Name]

### Changes Required

File: `path/to/file.ext`
- Changes: [Specific modifications needed]
- Tests: [What to write first]

### Implementation Approach

[How this phase should be implemented]

### Success Criteria

Automated:
- [ ] Tests pass
- [ ] Type checking passes [if applicable]
- [ ] Linting passes [if applicable]
- [ ] Build succeeds [if applicable]

Manual:
- [ ] [Manual verification step]

### Dependencies

[Dependencies or blockers]

---

## Testing Strategy

Following TDD:
1. Write tests first.
2. Confirm they fail.
3. Implement the minimum to pass.
4. Refactor while staying green.

Test types needed:
- Unit tests: [What to cover]
- Integration tests: [What to cover]
- E2E tests: [If applicable]

## Rollback Strategy

[How to back out safely]

## Related Links

- [Documentation]
- [Similar implementation]
- [External resource]
```
