---
title: Iterative Issue Tracker Review (Rule of 5)
type: prompt
subtype: task
tags: [review, issue-tracking, rule-of-5, project-management, quality-assurance]
tools: [claude-code, cursor, any-cli-llm]
status: tested
created: 2026-01-12
updated: 2026-01-12
version: 1.0.0
related: [prompt-workflow-create-plan.md, prompt-task-plan-review.md, prompt-workflow-rule-of-5-review.md]
source: adapted-from-fabbro
---

# Iterative Issue Tracker Review (Rule of 5)

## When to Use

Use this prompt to perform thorough review of issues in your issue tracking system using the Rule of 5 methodology - iterative refinement until convergence.

**Critical for:**
- Reviewing issues after creating them from a plan
- Validating issue quality before starting work
- Checking issue dependencies and ordering
- Ensuring issues are actionable and clear
- Quality gate for project management hygiene

**Do NOT use when:**
- Single issue review (just read and fix)
- Issues are placeholders (not ready for review)
- Tracking system is informal (notes, todos)

**Supported systems:**
- Beads (fabbro's issue tracker)
- GitHub Issues
- Linear
- Jira
- Any CLI-accessible issue tracker

## The Prompt

```
# Iterative Issue Tracker Review (Rule of 5)

Perform thorough issue review using the Rule of 5 - iterative refinement until convergence.

## Setup

### Gathering Issues to Review

**For Beads:**
```bash
bd list                    # All issues
bd ready                   # Unblocked issues
bd graph                   # Dependency visualization
bd show <id>               # Individual issue details
bd dep tree                # Dependency tree
bd dep cycles              # Check for circular dependencies
```

**For GitHub Issues:**
```bash
gh issue list --label "needs-review" --json number,title,body,labels
gh issue view <number>
```

**For other systems:**
- Export issues to JSON/CSV
- Use API or CLI tools
- Provide issue data as input

## Process

Perform 5 passes, each focusing on different aspects. After each pass (starting with pass 2), check for convergence.

### PASS 1 - Completeness & Clarity

**Focus on:**
- Title clearly describes the work
- Description has enough context to implement
- File paths and changes are concrete (not vague)
- Success criteria or tests are defined
- No ambiguous or vague language
- Acceptance criteria clear

**Output format:**
```
PASS 1: Completeness & Clarity

Issues Found:

[CLRT-001] [CRITICAL|HIGH|MEDIUM|LOW] - Issue ID/Number
Title: [Issue title]
Description: [What's unclear or incomplete]
Evidence: [Why this is a problem]
Recommendation: [How to fix - specific command or action]

[CLRT-002] ...
```

**What to look for:**
- Vague titles: "Fix auth" (fix what?)
- No description or minimal description
- "Implement X" without saying how or where
- Missing file paths
- No verification steps
- Unclear done criteria

**For Beads:**
```bash
# Fix issues found
bd edit <id> description     # Update description
bd update <id> --title="New clear title"
```

**For GitHub:**
```bash
gh issue edit <number> --title "New title"
gh issue edit <number> --body "New description"
```

### PASS 2 - Scope & Atomicity

**Focus on:**
- Each issue represents one logical unit of work
- Issues not too large (should complete in one session)
- Issues not too small (trivial changes bundled appropriately)
- Clear boundaries between issues
- No overlapping scope between issues
- Each issue independently valuable

**Prefix:** SCOPE-001, SCOPE-002, etc.

**What to look for:**
- "Implement entire authentication system" (too large)
- "Fix typo in README line 42" (maybe too small, could bundle)
- Two issues both say "update user model"
- Issue requires changes across 10+ files
- Issue mixes refactoring with feature work

**For Beads:**
```bash
# Split large issues
bd create --title="Phase 1: ..." --description="..."
bd create --title="Phase 2: ..." --description="..."
bd dep add phase2-id phase1-id  # phase2 depends on phase1

# Merge small issues
bd close small-issue-1 --reason="merged into main-issue"
bd update main-issue --description="Now includes work from small-issue-1"
```

### PASS 3 - Dependencies & Ordering

**Focus on:**
- Dependencies correctly defined
- No missing dependencies (B needs A but not linked)
- No circular dependencies (A→B→C→A)
- Critical path is sensible
- Parallelizable work not falsely serialized
- Dependency rationale is clear

**Prefix:** DEP-001, DEP-002, etc.

**What to look for:**
- Issue requires another to be done but not linked
- Circular dependency chains
- Everything depends on one issue (bottleneck)
- No dependencies when clear order exists
- Dependencies prevent parallel work unnecessarily

**For Beads:**
```bash
# Check for problems
bd dep cycles                           # Find circular dependencies
bd dep tree                            # Visualize dependencies

# Fix dependencies
bd dep add <blocked-id> <blocker-id>   # Add missing dependency
bd dep remove <blocked-id> <blocker-id> # Remove incorrect dependency
```

**For GitHub:**
```bash
# Use labels and issue references
gh issue edit <number> --add-label "blocked-by-#123"
# Or reference in description: "Depends on #123"
```

### PASS 4 - Plan & Spec Alignment

**Focus on:**
- Issues trace back to plan phases
- Plan references in descriptions
- Related specs linked where applicable
- TDD approach clear (tests defined before impl)
- All plan phases have corresponding issues
- Issue breakdown matches plan structure

**Prefix:** ALIGN-001, ALIGN-002, etc.

**What to look for:**
- Plan has 5 phases but only 3 issues
- Issue doesn't reference source plan
- Plan says "test first" but issue doesn't mention tests
- Spec requirements not covered by any issue
- Issue contradicts plan approach

**For Beads:**
```bash
# Add plan reference
bd update <id> --description="...

Ref: plans/2026-01-12-feature.md#phase-2"
```

**For GitHub:**
```bash
gh issue edit <number> --body "...

Related Plan: `plans/2026-01-12-feature.md#phase-2`"
```

### PASS 5 - Executability & Handoff

**Focus on:**
- Can be picked up by any developer/agent
- No implicit knowledge required
- Verification steps clear and specific
- Handoff points defined for multi-issue work
- Priority and labels appropriate
- Estimation realistic (if used)

**Prefix:** EXEC-001, EXEC-002, etc.

**What to look for:**
- "You know what to do" (no, they don't)
- Assumes knowledge of previous conversations
- "Test it" without saying how
- No verification steps
- Priority/labels missing or incorrect

## Convergence Check

After each pass (starting with pass 2), report:

```
Convergence Check After Pass [N]:

1. New CRITICAL issues: [count]
2. Total new issues this pass: [count]
3. Total new issues previous pass: [count]
4. Estimated false positive rate: [percentage]

Status: [CONVERGED | ITERATE | NEEDS_HUMAN]
```

**Convergence criteria:**
- **CONVERGED**: No new CRITICAL, <10% new issues vs previous pass, <20% false positives
- **ITERATE**: Continue to next pass
- **NEEDS_HUMAN**: Found blocking issues requiring human judgment

**If CONVERGED before Pass 5:** Stop and report final findings.

## Final Report

After convergence or completing all passes:

```
## Issue Tracker Review Final Report

**System:** [Beads/GitHub/Linear/Jira]
**Scope:** [All issues / Milestone X / Labels Y]

### Summary

Total Issues Reviewed: [count]

Issues Found by Severity:
- CRITICAL: [count] - Must fix before work starts
- HIGH: [count] - Should fix before work starts
- MEDIUM: [count] - Consider addressing
- LOW: [count] - Nice to have

Convergence: Pass [N]

### Top 3 Most Critical Findings

1. [DEP-001] Circular dependency detected
   Issues: #42 → #43 → #44 → #42
   Impact: Cannot start any of these issues
   Fix: `bd dep remove 42 44` to break cycle

2. [SCOPE-002] Issue too large to complete
   Issue: #38 "Implement authentication system"
   Impact: Unmanageable scope, blocks other work
   Fix: Split into 5 issues for each plan phase

3. [CLRT-003] Missing implementation details
   Issue: #29 "Update API"
   Impact: Cannot implement without more info
   Fix: Add file paths, endpoints, and success criteria

### Recommended Actions

Provide specific commands for fixes:

**Beads Commands:**
```bash
# Fix circular dependency
bd dep remove 42 44

# Split large issue
bd create --title="Phase 1: Auth tokens" --description="..."
bd create --title="Phase 2: Auth middleware" --description="..."
bd dep add phase2-id phase1-id
bd close 38 --reason="split into phase issues"

# Update missing details
bd edit 29 description
# Then add: Files: api/routes.ts, api/handlers.ts; Tests: api/routes.test.ts
```

**GitHub Commands:**
```bash
gh issue edit 29 --body "...

Files to change:
- api/routes.ts
- api/handlers.ts
- api/routes.test.ts

Success criteria:
- [ ] Tests pass
- [ ] Endpoints return correct status codes"
```

### Verdict

[READY_TO_WORK | NEEDS_UPDATES | NEEDS_REPLANNING]

**Rationale:** [1-2 sentences explaining the verdict]

### Issue Quality Assessment

- **Clarity**: [Excellent|Good|Fair|Poor] - [brief comment]
- **Scope**: [Excellent|Good|Fair|Poor] - [brief comment]
- **Dependencies**: [Excellent|Good|Fair|Poor] - [brief comment]
- **Completeness**: [Excellent|Good|Fair|Poor] - [brief comment]
```

## Rules

1. **Reference specific issues** - Use issue IDs/numbers precisely
2. **Provide actionable commands** - Show exact commands to fix issues
3. **Check actual content** - Don't assume, verify with issue details
4. **Prioritize correctly**:
   - CRITICAL: Blocks all work (circular deps, missing info)
   - HIGH: Blocks specific work or causes confusion
   - MEDIUM: Could be clearer but workable
   - LOW: Minor improvements
5. **If converged before pass 5** - Stop and report

## Variations

### For Small Issue Sets (<5 issues)

Combine passes:
- **PASS 1:** Completeness + Scope
- **PASS 2:** Dependencies + Alignment
- **PASS 3:** Final Review

### For Epic-Level Review

Add emphasis on:
- Epic structure and milestones clear
- Cross-cutting concerns identified
- Risk distribution across phases
- Checkpoint issues for validation
- Integration points between epics

### For Inherited/Stale Issues

Add verification passes:
- **PASS 6:** Validate against current codebase state
- **PASS 7:** Check for already-completed work
- **PASS 8:** Confirm assumptions still valid

### For Sprint/Milestone Planning

Add emphasis on:
- Capacity vs committed work
- Priority ordering within milestone
- Risk issues identified
- Dependencies within milestone resolved

## Example

**Input:**
```
Review beads issues for the authentication feature
```

**AI Response (following prompt):**
```
I'll review the authentication feature issues using the Rule of 5 methodology.

[Runs bd list, bd graph, reads issue details]

Found 8 issues tagged with "auth". Starting review...

---

## PASS 1: Completeness & Clarity

Issues Found:

[CLRT-001] CRITICAL - Issue auth-4
Title: "Implement middleware"
Description: Title is vague, description says only "Add auth middleware"
Evidence: No file paths, no specification of what middleware does
Recommendation: Update to "Implement JWT validation middleware" and add description: "File: api/middleware/auth.ts. Validates JWT tokens from Authorization header. Rejects invalid/expired tokens with 401."

Command: `bd edit auth-4 description`

[CLRT-002] HIGH - Issue auth-7
Title: "Tests"
Description: Just says "Add tests"
Evidence: No specification of what to test or where
Recommendation: Update title to "Add integration tests for auth endpoints" and specify test files and scenarios

Command: `bd update auth-7 --title="Add integration tests for auth endpoints"`

[CLRT-003] MEDIUM - Issue auth-2
Description: Says "Update user model" but doesn't say what fields to add
Evidence: Implementer won't know what changes to make
Recommendation: Add specific fields: "Add fields: passwordHash (string), lastLogin (Date), tokenVersion (number)"

---

## PASS 2: Scope & Atomicity

[SCOPE-001] CRITICAL - Issue auth-1
Title: "Implement authentication system"
Description: Covers JWT generation, validation, middleware, routes, and database changes
Evidence: Would take multiple days, blocks all other auth work
Recommendation: Split into 5 issues matching plan phases (auth-1a through auth-1e), add dependencies

Commands:
```bash
bd create --title="JWT token generation" --description="..."
bd create --title="JWT validation middleware" --description="..."
# ... create others
bd dep add auth-1b auth-1a  # middleware depends on generation
bd close auth-1 --reason="split into phase-based issues"
```

[SCOPE-002] LOW - Issues auth-5 and auth-6
Titles: "Update route imports", "Update route exports"
Evidence: Both trivial, can be bundled
Recommendation: Merge into one issue "Update route imports and exports"

Convergence Check After Pass 2:
1. New CRITICAL issues: 1
2. Total new issues this pass: 2
3. Total new issues previous pass: 3
4. Estimated false positive rate: 10%

Status: ITERATE (Continue to Pass 3)

---

## PASS 3: Dependencies & Ordering

[DEP-001] CRITICAL - Circular dependency detected
Issues: auth-3 → auth-4 → auth-5 → auth-3
Evidence: `bd dep cycles` shows this cycle
Impact: None of these can start
Recommendation: Remove dependency auth-5 → auth-3 (routes don't need to wait for model)

Command: `bd dep remove auth-5 auth-3`

[DEP-002] HIGH - Missing dependency
Issue: auth-7 (tests) has no dependencies but requires auth-4 (middleware) to be implemented
Evidence: Can't test middleware that doesn't exist
Recommendation: Add dependency

Command: `bd dep add auth-7 auth-4`

[DEP-003] MEDIUM - Unnecessary serialization
Issues: auth-2 (database) and auth-4 (middleware) are marked as serial but could be parallel
Evidence: Middleware doesn't require database changes (uses existing user table)
Recommendation: Remove false dependency if present

Convergence Check After Pass 3:
1. New CRITICAL issues: 1
2. Total new issues this pass: 3
3. Total new issues previous pass: 2
4. Estimated false positive rate: 15%

Status: ITERATE (Continue to Pass 4)

---

## PASS 4: Plan & Spec Alignment

[ALIGN-001] HIGH - Plan has 6 phases but only 8 issues
Evidence: Checked plans/2026-01-10-auth.md - Phase 4 "Error handling" has no corresponding issue
Impact: Important work will be missed
Recommendation: Create issue for error handling phase

Command: `bd create --title="Add auth error handling" --description="Ref: plans/2026-01-10-auth.md#phase-4"`

[ALIGN-002] MEDIUM - Missing plan references
Issues: auth-2, auth-3, auth-4 don't reference source plan
Evidence: Can't trace back to plan for context
Recommendation: Add plan reference to each issue description

Commands:
```bash
bd update auth-2 --description="...

Ref: plans/2026-01-10-auth.md#phase-1"
```

Convergence Check After Pass 4:
1. New CRITICAL issues: 0
2. Total new issues this pass: 2
3. Total new issues previous pass: 3
4. Estimated false positive rate: 15%

Status: ITERATE (Continue to Pass 5)

---

## PASS 5: Executability & Handoff

[EXEC-001] HIGH - Issue auth-4 assumes context
Description: Says "Use the usual pattern"
Evidence: New contributors won't know what "usual" means
Recommendation: Reference existing middleware example: "Follow pattern from api/middleware/cors.ts"

[EXEC-002] MEDIUM - Verification steps missing
Issue: auth-1 has no manual verification steps
Evidence: Success criteria only says "tests pass"
Recommendation: Add manual verification: "Test login flow in staging with actual credentials"

Convergence Check After Pass 5:
1. New CRITICAL issues: 0
2. Total new issues this pass: 2
3. Total new issues previous pass: 2
4. Estimated false positive rate: 20%

Status: CONVERGED

---

## Issue Tracker Review Final Report

**System:** Beads
**Scope:** Authentication feature (8 issues)

### Summary

Total Issues Reviewed: 8

Issues Found by Severity:
- CRITICAL: 3 - Must fix before work starts
- HIGH: 4 - Should fix before work starts
- MEDIUM: 4 - Consider addressing
- LOW: 1 - Nice to have

Convergence: Pass 5

### Top 3 Most Critical Findings

1. [DEP-001] Circular dependency detected
   Issues: auth-3 → auth-4 → auth-5 → auth-3
   Impact: Cannot start any of these issues
   Fix: `bd dep remove auth-5 auth-3`

2. [SCOPE-001] Issue too large to complete
   Issue: auth-1 "Implement authentication system"
   Impact: Unmanageable scope, blocks other work
   Fix: Split into 5 phase-based issues with dependencies

3. [CLRT-001] Missing implementation details
   Issue: auth-4 "Implement middleware"
   Impact: Cannot implement without specification
   Fix: Add file paths, functionality description, success criteria

### Recommended Actions

**Fix Circular Dependency:**
```bash
bd dep remove auth-5 auth-3
```

**Split Large Issue:**
```bash
bd create --title="Phase 1: JWT token generation" --description="..."
bd create --title="Phase 2: JWT validation middleware" --description="..."
bd create --title="Phase 3: Protect routes" --description="..."
bd create --title="Phase 4: Error handling" --description="..."
bd create --title="Phase 5: Integration tests" --description="..."
bd dep add phase2-id phase1-id
bd dep add phase3-id phase2-id
bd close auth-1 --reason="split into phase-based issues"
```

**Add Missing Details:**
```bash
bd edit auth-4 description
# Then add detailed description with files, approach, success criteria
```

**Add Missing Plan References:**
```bash
bd update auth-2 --description="$(bd show auth-2 --format=description)

Ref: plans/2026-01-10-auth.md#phase-1"
```

**Fix Missing Dependency:**
```bash
bd dep add auth-7 auth-4  # tests depend on middleware
```

### Verdict

NEEDS_UPDATES

**Rationale:** Found critical issues (circular dependency, oversized issue) that must be fixed before work can start. After addressing critical and high priority issues, issue tracker will be ready for development.

### Issue Quality Assessment

- **Clarity**: Fair - Several issues lack details and file paths
- **Scope**: Poor - One massive issue, some too granular
- **Dependencies**: Poor - Circular dependency and missing links
- **Completeness**: Fair - Missing issue for one plan phase, vague descriptions
```

## Expected Results

- Comprehensive review from 5 different perspectives
- Specific, actionable commands to fix issues
- Clear verdict on readiness to start work
- Fixed dependencies and scope issues
- Issues ready for implementation

## System-Specific Notes

### Beads

**Advantages:**
- Built for code project management
- Dependency tracking built-in
- CLI-first workflow

**Commands reference:**
```bash
bd list                           # List all issues
bd show <id>                      # Show issue details
bd create --title="..." --description="..."
bd edit <id> description          # Edit in $EDITOR
bd update <id> --title="..." --description="..."
bd dep add <blocked> <blocker>    # Add dependency
bd dep remove <blocked> <blocker>
bd dep tree                       # Visualize dependencies
bd dep cycles                     # Find circular deps
bd close <id> --reason="..."
bd ready                         # Show unblocked issues
```

### GitHub Issues

**Advantages:**
- Integrated with PRs and code
- Wide adoption and ecosystem
- Good for open source

**Commands reference:**
```bash
gh issue list --label="label"
gh issue view <number>
gh issue create --title="..." --body="..."
gh issue edit <number> --title="..." --body="..."
gh issue close <number>
```

**Dependencies:** Use labels (blocked-by-#N) or description links

### Linear

**Advantages:**
- Fast, modern UI
- Good keyboard shortcuts
- Built-in cycles/sprints

**API/CLI:** Use Linear CLI or API for programmatic access

### Jira

**Advantages:**
- Enterprise features
- Extensive customization
- Integrations

**CLI:** Use `jira-cli` or API for programmatic access

## References

- Steve Yegge's "Six New Tips for Better Coding with Agents" - Rule of 5 methodology
- `prompt-workflow-create-plan.md` - Plans should map to issues
- `prompt-task-plan-review.md` - Similar review for plans
- `prompt-workflow-rule-of-5-review.md` - Multi-agent variant

## Notes

### Why Review Issues?

Issue quality affects:
- **Developer productivity** - Clear issues = fast implementation
- **Project tracking** - Accurate issues = reliable estimates
- **Handoffs** - Good issues = anyone can pick up work
- **Alignment** - Issues match plans and specs

### Issue vs Plan

**Plan:** Design and approach document
- Why we're doing this
- How we'll implement it
- Phases and dependencies
- Success criteria

**Issue:** Work tracking unit
- One discrete unit of work
- Created from plan phases
- Assigned and tracked
- Closed when complete

Good issues reference their source plan.

### Atomic Issues

The "Goldilocks" principle:
- **Too large:** Can't complete in one session, blocks other work
- **Too small:** Overhead of tracking exceeds value
- **Just right:** Clear scope, 1-4 hours, independently valuable

When in doubt, smaller is better than larger.

### Dependency Management

Dependencies create order:
- Enable parallel work (no false serialization)
- Prevent broken work (B depends on A)
- Show critical path
- Identify bottlenecks

But too many dependencies = rigidity.
Balance structure with flexibility.

## Version History

- 1.0.0 (2026-01-12): Initial version adapted from fabbro beads_review command
