# TDD Implementation Criteria

Use these criteria to evaluate the quality of a TDD session.

## Red-Green-Refactor Rules

| Phase | Criteria | Action |
| :--- | :--- | :--- |
| **RED** | Test fails for the *expected* reason (e.g., function not found, property mismatch). | **Write minimal code.** |
| **GREEN** | Test passes with minimal implementation. All existing tests still pass. | **Refactor for quality.** |
| **REFACTOR** | Implementation code is clean and idiomatic. No behavior change. Tests stay green. | **Complete the phase.** |

## Phase Completion Standards

- [ ] All success criteria from the Phase plan are met.
- [ ] Automated tests (unit, integration) cover new logic.
- [ ] No regressions introduced in existing functionality.
- [ ] Type-checking and linting are passing globally.
- [ ] Plan is updated to reflect current progress.

## When to Stop & Ask

- [ ] Requirements change midway through a phase.
- [ ] Implementation reveals a hidden architectural debt.
- [ ] Tests fail in a way that is not understood.
- [ ] Manual verification fails despite green automated tests.
