---
title: Iterative Issue Creation from Plan
type: prompt
subtype: task
tags: [creation, issue-tracking, project-management, planning, single-agent]
tools: [claude-code, cursor, any-cli-llm]
status: tested
created: 2026-01-20
updated: 2026-04-28
version: 1.1.0
related: [prompt-workflow-create-plan.md, prompt-task-issue-tracker-review.md]
source: derived-from-prompt-task-issue-tracker-review
---

# Iterative Issue Creation from Plan

## About This Prompt

This prompt guides an AI agent to take a development plan and systematically break it down into well-defined, actionable issues in an issue tracker. It emphasizes **tracer-bullet vertical slices**: thin, end-to-end issues that are independently testable or demoable, rather than horizontal layer tickets. It also preserves critical workflow reminders like TDD and Tidy First.

## When to Use

Use this prompt after a plan has been created and reviewed, and you are ready to populate your issue tracker with the work items for implementation.

**Critical for:**
- Translating a plan into a set of tracer-bullet issues.
- Ensuring issues are thin vertical slices rather than backend/frontend/schema phase tickets.
- Reviewing granularity and dependencies before publishing to the tracker.
- Automatically adding development process requirements to each ticket.

**Do NOT use when:**
- You have no plan.
- The work is a single, simple task.

**Supported systems:**
- Beads (fabbro's issue tracker)
- GitHub Issues
- Linear
- Jira
- Any CLI-accessible issue tracker

## The Prompt

````markdown
# Iterative Issue Creation from Plan

You will act as a project manager. Your task is to take the provided plan and create a set of issues in the specified issue tracking system. You will generate the precise, runnable commands to do so.

## Setup

### Input Plan

The plan to be implemented will be provided here. Your task is to parse it and create issues accordingly.

**Example Plan:**
```markdown
# Plan for New Authentication Feature

## Phase 1: Database Schema
- Add `password_hash` and `last_login` to the `users` table.
- File: `db/migrations/001_add_auth_fields.sql`

## Phase 2: Create Login Endpoint
- Create a new endpoint `POST /login`.
- It should take `email` and `password`.
- It should return a JWT.
- File: `src/auth/routes.ts`

## Phase 3: Protect Routes
- Create middleware that checks for a valid JWT.
- Apply it to the `/api/v1/profile` endpoint.
- File: `src/auth/middleware.ts`
```

## Process

Draft the issue set as **tracer-bullet vertical slices**. Prefer thin, end-to-end slices that cut across the required layers for one narrow capability. Avoid horizontal tickets like "build backend", "add UI", or "create schema" unless they are independently valuable. Before creating anything in the tracker, present the proposed slices to the user for approval. After approval, create the issues and define their dependencies.

### Issue Template

Each issue you create MUST use the following template for its title and description.

**Title:** A short, clear, behavior-oriented title (e.g., "Allow signed-in users to view their profile").

```
## Parent

[Reference to parent plan/spec/issue, if applicable]

## What to build

[Describe the end-to-end behavior of this slice.]

**Context:** [Brief explanation of what this issue is about, referencing the plan]
Ref: [Link to plan document and section]

**Files / Systems:**
- [List of files to be modified]
- [Or affected subsystems if exact files are not yet known]

## Acceptance Criteria
- [ ] A binary, observable checklist of what "done" means for this issue.
- [ ] Automated tests cover the slice end-to-end.

## Blocked by
- [Issue reference]

Or: `None - can start immediately`

---
**CRITICAL: Follow Test Driven Development and Tidy First workflows.**
- Write tests *before* writing implementation code.
- Clean up related code *before* adding new functionality.
```

### Creating Issues and Dependencies

Generate the full, runnable commands to create the issues and then wire up their dependencies.

#### Strategy for Robust Execution

To ensure that dependencies are wired correctly, you MUST follow this process:

1.  **Draft slices and review with the user:** Present a numbered list showing title, AFK/HITL classification, blockers, user stories covered, and why each slice is a tracer bullet.
2.  **Create Issues in dependency order:** Run the creation command for each approved issue, starting with blockers.
3.  **Capture IDs:** From the output of each command, capture the newly created issue ID or number and store it in a shell variable (e.g., `slice_1_issue_id=$(...)`). Most modern CLI tools provide a way to get machine-readable output.
4.  **Connect Dependencies:** Use the variables from the previous step to run the dependency commands, ensuring you are linking the correct issues.

This prevents errors that can arise from assuming sequential or predictable issue IDs.

**Example for Beads:**
```bash
# Create issues for each phase, capturing the new issue ID from stdout
issue_1_id=$(bd create --title="DB Schema: Add auth fields to users table" --description="""
**Context:** As per the auth feature plan, we need to update the users table to support authentication.
Ref: plans/auth-feature.md#phase-1

**Files:**
- `db/migrations/001_add_auth_fields.sql`

**Acceptance Criteria:**
- [ ] Migration is created and applied.
- [ ] `users` table has `password_hash` and `last_login` fields.

---
**CRITICAL: Follow Test Driven Development and Tidy First workflows.**
- Write tests *before* writing implementation code.
- Clean up related code *before* adding new functionality.
""")

issue_2_id=$(bd create --title="API: Create Login Endpoint" --description="""
**Context:** Create the `POST /login` endpoint to authenticate users and issue JWTs.
Ref: plans/auth-feature.md#phase-2

**Files:**
- `src/auth/routes.ts`

**Acceptance Criteria:**
- [ ] Endpoint `POST /login` exists.
- [ ] It returns a JWT on successful login.
- [ ] It returns an error on failed login.

---
**CRITICAL: Follow Test Driven Development and Tidy First workflows.**
- Write tests *before* writing implementation code.
- Clean up related code *before* adding new functionality.
""")

# (Assume issue for Phase 3 is also created and its ID is in $issue_3_id)

# Set dependencies using the captured IDs
bd dep add "$issue_2_id" "$issue_1_id"  # login endpoint depends on db schema
# bd dep add "$issue_3_id" "$issue_2_id" # middleware depends on login endpoint
```

**Example for GitHub Issues:**
```bash
# Create issues, capturing the new issue URL from stdout
issue_1_url=$(gh issue create --title "DB Schema: Add auth fields to users table" --body "...") # (full body as above)
issue_2_url=$(gh issue create --title "API: Create Login Endpoint" --body "...")
# ...

# Extract the issue numbers from the URLs
issue_1_number=$(echo "$issue_1_url" | sed 's/.*\\///')
issue_2_number=$(echo "$issue_2_url" | sed 's/.*\\///')

# Note dependencies in the body. Since gh CLI has no formal dep command,
# we add a reference to the blocking issue in the body of the dependent issue.
gh issue edit "$issue_2_number" --body "$(gh issue view "$issue_2_number" --json body -q .body)

Blocked by #$issue_1_number"
```

## Final Report

After generating all commands, provide a final summary report in the following format.

```
## Issue Creation Summary

**System:** [Beads/GitHub/Linear/Jira]
**Plan:** [path/to/plan.md]

### Summary

- Total Issues Created: [count]
- Dependencies Defined: [count]

### Verdict

[ISSUES_CREATED | FAILED_TO_CREATE]

**Rationale:** [1-2 sentences explaining the result, e.g., "Successfully created all issues and dependencies from the plan."]
```
````

## Rules

1.  **Tracer bullets over phases:** Break down the plan into the smallest logical, independently valuable vertical slices of work.
2.  **Include Workflow Mandate:** Every single issue *must* contain the TDD and Tidy First mandate in its description, exactly as specified in the template.
3.  **Reference the Plan:** Always link back to the source plan document in the issue description for traceability.
4.  **Set Dependencies:** After creating issues, generate the commands to correctly wire up the dependencies between them.
5.  **Generate Runnable Commands:** The output must be the exact, complete, and runnable shell commands required to perform the actions.
6.  **Assume Clean State:** This prompt assumes no issues exist for the plan. If issues already exist, ask the user for guidance on how to proceed.
7.  **Label execution mode:** Mark each slice as AFK or HITL before publishing.
