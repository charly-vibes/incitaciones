# Issue Creation Criteria

Use these criteria to evaluate whether a plan has been translated into strong tracer-bullet issues.

## High-Quality Issue Standards

| Feature | Criteria |
| :--- | :--- |
| **Tracer-bullet shape** | Each issue is a thin vertical slice, not a horizontal layer ticket. |
| **Independent value** | A completed issue is demoable, testable, or otherwise verifiable on its own. |
| **Atomicity** | Each issue covers one logical capability. If it spans multiple unrelated behaviors, split it. |
| **Actionable Title** | Short, specific, and domain-oriented. Prefer behavior over component names. |
| **Traceability** | Contains a direct reference to the source plan/spec section or story. |
| **Verifiability** | Acceptance criteria are binary and observable. |
| **Dependency hygiene** | Only real blockers are encoded; parallel work is not serialized without reason. |
| **Workflow Mandate** | Includes the mandatory TDD and Tidy First block. |
| **Execution mode** | Slice is explicitly marked AFK or HITL. |

## Tracer-Bullet Heuristics

Use these checks before publishing:

- [ ] Does this issue deliver a narrow but complete path through relevant layers?
- [ ] Could someone demo or verify this slice without waiting for a later ticket?
- [ ] Is this a user-visible or system-verifiable outcome rather than plumbing-only work?
- [ ] If the ticket is preparatory, is that preparatory work itself independently valuable?
- [ ] Would splitting by backend/frontend/schema create worse horizontal tickets than the current slice?

## Dependency Reliability Checklist

- [ ] All IDs captured from command output using variables.
- [ ] Dependency commands reference the captured variables.
- [ ] Blockers are real prerequisites, not just preferred order.
- [ ] AFK/HITL designation is explicit.
- [ ] Parallel work is left parallel where the tracker supports it.

## When to Stop & Ask

- [ ] The plan is written as phases/layers only and cannot yet be sliced vertically.
- [ ] Acceptance criteria are too vague to make binary.
- [ ] File paths or impacted surfaces are unknown and need discovery.
- [ ] The target tracker is not accessible via CLI/API.
- [ ] Existing issues already cover part of the plan and would conflict with new tickets.
- [ ] HITL slices need human approval before publishing.
