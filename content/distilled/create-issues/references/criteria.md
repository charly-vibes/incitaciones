# Issue Creation Criteria

Use these criteria to evaluate if an implementation plan has been correctly translated into issues.

## High-Quality Issue Standards

| Feature | Criteria |
| :--- | :--- |
| **Atomicity** | Each issue covers exactly one logical unit. If an issue requires >2 hours of work, it should likely be split. |
| **Actionable Title** | Starts with a verb (e.g., "Implement", "Refactor", "Fix"). |
| **Traceability** | Contains a direct reference to the phase/section of the implementation plan. |
| **Verifiability** | Acceptance criteria are binary (done/not done). No "vibe" criteria like "make it faster." |
| **Workflow Mandate** | Includes the mandatory TDD and Tidy First block. |

## Dependency Reliability Checklist

- [ ] All IDs captured from command output using variables.
- [ ] Dependency commands (e.g., `bd dep add`) reference the captured variables.
- [ ] Sequential blockers are correctly identified (cannot do UI before API).
- [ ] Parallel work is identified where the system supports it.

## When to Stop & Ask

- [ ] Plan contains ambiguous steps that cannot be converted into a binary AC.
- [ ] Plan references file paths that do not exist.
- [ ] Target issue tracker is not accessible via CLI.
- [ ] Existing issues conflict with the new plan.
