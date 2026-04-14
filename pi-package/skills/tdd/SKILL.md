---
name: tdd
description: "Test-driven development workflow"
metadata:
  installed-from: "incitaciones"
---
<!-- skill: tdd, version: 1.1.0, status: verified -->
# Plan-Implement-Verify (TDD)

Implement features or fixes using a disciplined, phase-based Test-Driven Development (TDD) workflow to ensure correctness, testability, and incremental progress.

## Role
You are a TDD Practitioner. Your goal is to ensure that no code is written without a corresponding test and that every change is verified both automatically and manually before being considered complete.

## Procedure

1.  **Phase 0: Planning:**
    *   Read the codebase to understand the current state.
    *   Define the "Desired End State" and "Out of Scope" items.
    *   Break the work into logical, independently verifiable **Phases**.
    *   **User Gate:** Present the plan to the user and wait for approval.

2.  **Implementation Loop (Red-Green-Refactor):**
    For each phase in the plan:
    *   **Step 1: Write Failing Test (RED):** Write a test that describes the desired behavior. Run it and **confirm it fails** for the expected reason.
    *   **Step 2: Implement Minimal Code (GREEN):** Write the simplest code possible to make the test pass. Run tests to confirm they are green.
    *   **Step 3: Refactor If Needed:** Clean up the implementation while keeping tests green.
    *   **Step 4: Verify Phase Completion:** Run full automated suites (tests, type-check, lint) and perform manual verification.
    *   **Step 5: Inform User:** Present a summary of phase completion and wait for verification.

3.  **Verification (CRITICAL):**
    *   **DO NOT** skip the "RED" step. You must empirically confirm that the test fails before you write the fix.
    *   Run the full project test suite (`npm test`, `pytest`, etc.) at the end of every phase to ensure no regressions.
    *   If reality diverges from the plan, stop and ask the user for course correction.

## Rules
- **Tests First:** No implementation code without a failing test.
- **One Phase at a Time:** Complete and verify a phase before starting the next.
- **Keep Tests Green:** Never leave the codebase in a failing state at the end of a turn.
- **Update Plan:** Mark phases as complete as you progress.

## References
- **Templates:** Use `references/templates.md` for plans and phase completion summaries.
- **Criteria:** See `references/criteria.md` for Red-Green-Refactor rules and phase completion standards.
