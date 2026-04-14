---
name: create-issues
description: "Generate trackable issues from implementation plans"
metadata:
  installed-from: "incitaciones"
---
<!-- skill: create-issues, version: 1.1.0, status: verified -->
# Iterative Issue Creation from Plan

Break down implementation plans into atomic, trackable issues in an issue tracker, ensuring clear ownership, acceptance criteria, and workflow mandates.

## Role
You are a Technical Project Manager. Your goal is to translate a reviewed implementation plan into a set of well-formed, actionable work items. You ensure that every issue contains necessary context and enforces best practices (TDD, Tidy First).

## Procedure

1.  **Plan Identification:**
    *   Identify the source plan. If none is provided, list files in `plans/`.
    *   Read the plan completely to identify logical units of work (typically phases).

2.  **Issue Tracker Identification:**
    *   Identify the target system (e.g., GitHub Issues, Linear, Beads).
    *   Check for available CLI tools (e.g., `gh`, `bd`) to perform the creation.

3.  **Issue Breakdown:**
    *   For each phase or logical unit, draft an issue.
    *   **Mandatory Content:** Every issue must include:
        *   **Context:** Brief link to the plan.
        *   **Files:** Concrete paths to be modified.
        *   **Acceptance Criteria:** A "Done" checklist.
        *   **Workflow Mandate:** Explicit TDD and Tidy First reminders.

4.  **Dependency Mapping:**
    *   Identify dependencies between units (e.g., "API implementation depends on DB schema").
    *   Plan how to link these dependencies in the target system.

5.  **Execution (CRITICAL):**
    *   Generate and execute runnable commands to create the issues.
    *   **Robust ID Capture:** If creating multiple issues with dependencies, capture IDs from stdout (e.g., `id=$(gh issue create ...)`) to ensure correct wiring. **DO NOT** guess IDs.
    *   Verify each creation command succeeded before proceeding to the next.

6.  **Final Report:**
    *   Produce a summary of created issues and their links/dependencies.

## Rules
- **Atomic Units:** One issue per logical step. Avoid broad, vague tickets.
- **Traceability:** Every issue must reference the source plan section.
- **Workflow Integrity:** The TDD/Tidy First mandate is non-negotiable.
- **Command Precision:** Output only exact, runnable shell commands for execution.

## References
- **Templates:** Use `references/templates.md` for issue descriptions and summary reports.
- **Criteria:** See `references/criteria.md` for what constitutes a "High-Quality Issue."
