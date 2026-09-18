---
name: create-issues
description: "Compiled alias of the issue creation mode of the issues skill. Hidden from model invocation; invocable via /skill:create-issues; serves the legacy site URL with full compiled content."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.10.1"
  internal: true
---
> **Moved:** this entry is now the **create-issues** mode of the **issues** skill.
> The full method is compiled below from `content/distilled/issues/references/create-issues/SKILL.md`.
> Invoke via `/skill:create-issues`, invoke `/skill:issues` for the mode table,
> or use this URL directly in a chat interface.

#### Core Instructions (content/distilled/issues/references/create-issues/SKILL.md)

<!-- skill: create-issues, version: 1.4.1, status: verified -->
# Tracer-Bullet Issue Creation from Plan

Break a reviewed plan into independently grabbable issues using tracer-bullet vertical slices.

## Role
You are a Technical Project Manager. Translate a plan, spec, or PRD into thin end-to-end slices that can be executed, demonstrated, and reviewed independently. Preserve local workflow expectations like TDD and Tidy First.

## Procedure

1. **Gather context:**
   - Identify the source plan/spec. If none is provided, ask for it or list likely files.
   - Read it completely.
   - Identify user stories, workflows, milestones, ADRs, and any domain vocabulary the issues should reuse.

2. **Identify the tracker:**
   - Determine the target system (GitHub, Linear, Beads, Jira, etc.).
   - Check which CLI/API is available.
   - Confirm label vocabulary if the tracker uses triage labels.

3. **Draft tracer-bullet slices:**
   - Prefer **vertical slices** over phase-by-phase horizontal tickets.
   - Each issue should cut through all necessary layers for one narrow capability: storage/schema, business logic, interface, tests, and observability/docs when relevant.
   - A slice must be independently verifiable or demoable.
   - Mark each slice as:
     - **AFK** — can be implemented and merged without human intervention.
     - **HITL** — requires a human decision, approval, design review, copy review, policy signoff, etc.
   - Avoid tickets like “build backend”, “add UI”, or “refactor models first” unless the work is genuinely standalone.
   - **Title lint (hard rule — run on every drafted title before presenting):** a title must name a user-visible outcome (“CSV export works end-to-end”), not a layer. If a title names a layer or artifact — backend, frontend, API, route, button, serializer, schema, tests-only, docs-only, refactor-only — merge it into the outcome slice it serves. Layers differing is never sufficient reason to split: split by capability, never by layer.

4. **Review the proposed breakdown with the user:**
   - Re-run the title lint on every drafted title; merge any layer-named ticket into its outcome slice before presenting.
   - Present a numbered list before creating anything.
   - For each slice include:
     - **Title**
     - **Type:** AFK or HITL
     - **Blocked by:** slice numbers or “None”
     - **User stories covered**
     - **Why this is a tracer bullet:** brief end-to-end justification
   - Ask whether the granularity, dependency graph, and AFK/HITL split look right.
   - Iterate until approved.

5. **Prepare issue bodies:**
   - Use `references/templates.md`.
   - Every issue must include:
     - plan/spec traceability
     - end-to-end behavior description
     - concrete file paths or subsystems when knowable
     - binary acceptance criteria
     - a **file-header criterion** when the slice creates source files or changes a file's contract: new files open with `Purpose / Responsibilities / Rationale`; contract-changing edits update Rationale (see `file-headers`)
     - a **Verifiable Value Claim** where measurable: quantified **Must** gate (unit + number, no adjectives), a runnable **Meter** command, the measured **Baseline**, and the **regression suite** that must keep passing
     - **anti-goals** whenever the ticket touches tests, lockfiles, or public interfaces (prohibit test-assertion edits, dependency additions, API breaks)
     - explicit blocked-by field
     - TDD and Tidy First mandate

6. **Publish in dependency order:**
   - Create blockers first, then dependents.
   - Capture created IDs/URLs from stdout; never guess identifiers.
   - Apply tracker labels such as `needs-triage` when the project uses them.
   - Wire dependencies using actual captured identifiers or explicit body references.
   - Verify each creation step succeeded before continuing.
   - **After each successful creation**, extract the `**Files / Systems:**` bullet list from
     the issue description and store it as structured metadata together with a **base
     commit anchor** for staleness detection:
     ```bash
     base_sha=$(git rev-parse HEAD)
     bd update <id> --metadata "{\"files\": [\"path/to/file1.py\", \"path/to/file2.py\"], \"base_commit\": \"$base_sha\"}"
     ```
     `base_commit` is HEAD at ticket-creation time. Reviewers and claiming agents diff
     `base_commit..HEAD` against the ticket's `files` to detect out-of-date tickets (see
     `issue-review` skill, Pass 0 PRE-003, and `renew` skill **Claiming work** section).
     This enables automated file-conflict detection by concurrent agents. If the
     Files/Systems section is empty or contains only subsystem names without concrete
     paths, **stop and ask the user for specific file paths before publishing the ticket**
     — a ticket without concrete paths cannot participate in conflict detection and is
     incomplete.

7. **Final report:**
   - Summarize the approved slice set, created issues, labels, and dependency links.
   - Flag any deferred HITL items or unresolved ambiguity.

## Rules
- **Tracer bullets first:** prefer many thin, complete slices over a few thick horizontal tickets.
- **Independently valuable:** each issue should produce a testable behavior change, not just preparatory plumbing.
- **Traceable:** reference the exact plan/spec section or story.
- **Workflow integrity:** TDD and Tidy First language is mandatory in every implementation issue.
- **No guessed IDs:** capture identifiers from actual command output.
- **Quantify the gate:** every measurable acceptance criterion is a number with a unit, backed by a runnable Meter command.
- **Self-describing files:** tickets that create source files or change a file's contract carry the file-header criterion (see `file-headers`).
- **Name the cheats:** add anti-goals wherever the gate could be gamed (test edits, new deps, API breaks).
- **Anchor staleness:** always record `base_commit` metadata at creation; never publish a ticket anchored to nothing.
- **Stop and ask:** if the plan only supports horizontal decomposition, propose a vertical rewrite before publishing.

## References
- **Templates:** `references/templates.md`
- **Criteria:** `references/criteria.md`

---

#### Reference: references/criteria.md

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
| **Quantified Must gate** | Hard acceptance criterion carries a unit and number (Planguage Must), never an adjective. |
| **Machine-checkable Meter** | An exact runnable command (Meter) whose exit code decides the gate; verifiable at the ticket's `base_commit`. |
| **Anti-goals** | Negative constraints name prohibited behaviors (test edits, dependency additions, API breaks) so agents can't cheat the gate. |
| **Baseline anchored** | Measurable claims record the pre-work value and the HEAD SHA as `base_commit` metadata for staleness detection. |
| **Dependency hygiene** | Only real blockers are encoded; parallel work is not serialized without reason. |
| **Workflow Mandate** | Includes the mandatory TDD and Tidy First block. |
| **Execution mode** | Slice is explicitly marked AFK or HITL. |

## Tracer-Bullet Heuristics

Use these checks before publishing:

- [ ] Does this issue deliver a narrow but complete path through relevant layers?
- [ ] Could someone demo or verify this slice without waiting for a later ticket?
- [ ] Is this a user-visible or system-verifiable outcome rather than plumbing-only work?
- [ ] Could a fresh agent verify the Must gate by running the Meter command verbatim?
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

---

#### Reference: references/templates.md

# Issue Creation Templates

Use these templates for proposed slice breakdowns, issue descriptions, and the final creation summary.

## Proposed Slice Review Template

```markdown
1. **[Title]**
   - **Type:** [AFK|HITL]
   - **Blocked by:** [None | Slice 1, Slice 2]
   - **User stories covered:** [Story A, Story B]
   - **Tracer-bullet rationale:** [Why this is a thin end-to-end slice]
```

## Issue Description Template

```markdown
## Parent

[Reference to parent plan/spec/issue, if applicable]

## What to build

[Describe the end-to-end behavior of this slice in domain language.]

**Context:** [Brief explanation tied to the source plan/spec]
Ref: [Link to plan/spec file and section]

**Files / Systems:**
- `path/to/file1`
- `path/to/file2`
- `[subsystem or surface area if exact files are not yet known]`

## Verifiable Value Claim

**Must (hard gate):** [Quantified threshold defining done, with unit and number — e.g. "P95 latency ≤ 250 ms at 100 req/sec"; never "fast" or "robust"]
**Meter:** [Exact runnable command that verifies the Must gate — e.g. `pytest tests/val_claims/test_issue_NNN.py -q`; exit 0 = pass]
**Baseline:** [Measured value before work starts — e.g. "P95 = 450 ms"; omit if not measurable]
**Regression suite:** [Existing tests that must keep passing — e.g. `pytest tests/core/`]

## Acceptance Criteria

- [ ] [Binary, observable criterion 1]
- [ ] [Binary, observable criterion 2]
- [ ] [Automated tests cover the slice end-to-end]
- [ ] [When the slice creates source files or changes a file's contract: file-header criterion — new files carry Purpose/Responsibilities/Rationale; changed files update Rationale (see `file-headers`)]

## Blocked by

- [Issue reference] 

Or: `None - can start immediately`

---
**CRITICAL: Follow Test Driven Development and Tidy First workflows.**
- Write tests *before* writing implementation code.
- Clean up related code *before* adding new functionality.

**Anti-goals (do NOT):**
- [Prohibited behavior with obvious reward-hacking payoff — e.g. "modify, disable, or delete tests in `tests/core/`"]
- [e.g. "add new dependencies or modify lockfiles"]
- [e.g. "break public API / exported interfaces"]
```

## Issue Creation Summary Template

```markdown
## Issue Creation Summary

**System:** [e.g., GitHub/Beads]
**Plan:** [path/to/plan.md]

### Approved Slice Set
1. **[Title]** — [AFK|HITL], blocked by [None|IDs]
2. **[Title]** — [AFK|HITL], blocked by [None|IDs]

### Summary
- **Total Issues Created:** [count]
- **Dependencies Defined:** [count]
- **Labels Applied:** [e.g., needs-triage]
- **Base Commit Anchored:** [git SHA recorded in `base_commit` metadata]

### Created Issues
1. **[ID] [Title]** - [Link/Reference]
2. **[ID] ...**

### Verdict: [ISSUES_CREATED | FAILED_TO_CREATE | WAITING_FOR_APPROVAL]
**Rationale:** [1-2 sentences explaining the result]
```
