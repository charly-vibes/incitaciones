---
title: Iterative Plan Review (Rule of 5 Principle)
type: prompt
subtype: task
tags: [review, planning, rule-of-5, quality-assurance, validation, single-agent]
tools: [claude-code, cursor, any-cli-llm]
status: tested
created: 2026-01-12
updated: 2026-01-13
version: 1.1.0
related: [prompt-workflow-create-plan.md, prompt-workflow-iterate-plan.md, prompt-task-iterative-code-review.md, research-paper-rule-of-5-multi-agent-review.md]
source: adapted-from-fabbro-with-rule-of-5-principle
---

# Iterative Plan Review (Rule of 5 Principle)

## About This Prompt

This prompt applies the **Rule of 5 principle** (iterative refinement until convergence) to plan review. It uses a single-agent, 5-pass approach with domain-focused passes adapted for planning:

- **Approach:** Single agent, sequential passes
- **Passes:** Feasibility → Completeness → TDD Alignment → Ordering → Executability
- **Philosophy:** Iterative refinement with convergence checking

**Note:** This is not Steve Yegge's original Draft/Correctness/Clarity/EdgeCases/Excellence structure, but applies his core principle to plan-specific concerns.

## When to Use

Use this prompt to perform thorough review of implementation plans using iterative refinement until convergence.

**Critical for:**
- Reviewing plans before implementation begins
- Validating feasibility and completeness of proposed work
- Checking alignment with specs and project goals
- Ensuring plans follow TDD and best practices
- Quality gate before committing to implementation approach

**Do NOT use when:**
- Plan is obviously incomplete (finish it first)
- Doing quick informal review (just read and comment)
- Reviewing trivial plans (<1 phase, <50 LOC)

## The Prompt

````
# Iterative Plan Review (Rule of 5)

Perform thorough implementation plan review using the Rule of 5 - iterative refinement until convergence.

## Setup

**If plan path provided:** Read the plan completely

**If no plan path:** Ask for the plan path or list available plans from `plans/`

## Process

Perform 5 passes, each focusing on different aspects. After each pass (starting with pass 2), check for convergence.

### PASS 1 - Feasibility & Risk

**Focus on:**
- Technical feasibility of proposed changes
- Identified risks and their mitigations
- Dependencies on external factors (APIs, services, libraries)
- Assumptions that need validation
- Potential blockers not addressed
- Resource requirements (time, expertise, infrastructure)

**Output format:**
```
PASS 1: Feasibility & Risk

Issues Found:

[FEAS-001] [CRITICAL|HIGH|MEDIUM|LOW] - Phase/Section
Description: [What's wrong]
Evidence: [Why this is a problem]
Recommendation: [How to fix with specific guidance]

[FEAS-002] ...
```

**What to look for:**
- "We'll just..." statements hiding complexity
- External dependencies assumed to be available
- Time estimates that seem unrealistic
- Required expertise not accounted for
- Breaking changes not acknowledged
- Rollback strategy missing or inadequate

### PASS 2 - Completeness & Scope

**Focus on:**
- Missing phases or steps
- Undefined or vague success criteria
- Gaps between current and desired state
- "Out of Scope" clearly defined
- All affected files/components identified
- Testing strategy covers all scenarios
- Edge cases considered

**Prefix:** COMP-001, COMP-002, etc.

**What to look for:**
- "And then..." without the "then" being in the plan
- Success criteria that can't be verified
- Missing integration points
- Unclear handoff points between phases
- Scope creep hiding in vague language

### PASS 3 - Spec & TDD Alignment

**Focus on:**
- Links to spec files (if applicable)
- Tests planned before implementation (TDD)
- Success criteria are testable
- Test-first approach clear in each phase
- All requirements from specs covered
- Verification steps defined

**Prefix:** TDD-001, TDD-002, etc.

**What to look for:**
- "We'll test it" without specific test descriptions
- Implementation before tests in phase sequence
- Untestable success criteria ("works well", "is fast")
- Missing test coverage for error cases
- No mention of what tests to write

### PASS 4 - Ordering & Dependencies

**Focus on:**
- Phases in correct order (can't do B before A)
- Dependencies between phases clearly stated
- Parallelizable work identified
- Critical path identified
- Each phase can be independently verified
- Rollback/reversal possible at phase boundaries

**Prefix:** ORD-001, ORD-002, etc.

**What to look for:**
- Phase 2 requires Phase 3 to be done first
- Circular dependencies between phases
- "Big bang" integration at the end
- No incremental verification
- All-or-nothing approach

### PASS 5 - Clarity & Executability

**Focus on:**
- Specific enough for someone else to implement
- File paths and changes are concrete
- No ambiguous instructions
- Clear what "done" means for each phase
- Technical terms defined or understood
- Handoff points between phases clear

**Prefix:** EXEC-001, EXEC-002, etc.

**What to look for:**
- "Update the authentication" - update how? where?
- "Make it work with..." - what does "work" mean?
- "Refactor as needed" - refactor what? when?
- File paths missing or vague
- Assumptions about shared knowledge

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
## Plan Review Final Report

**Plan:** plans/[filename].md

### Summary

Total Issues by Severity:
- CRITICAL: [count] - Must fix before implementation
- HIGH: [count] - Should fix before implementation
- MEDIUM: [count] - Consider addressing
- LOW: [count] - Nice to have

Convergence: Pass [N]

### Top 3 Most Critical Findings

1. [FEAS-001] [Description] - Phase [N]
   Impact: [Why this matters]
   Fix: [What to do]

2. [COMP-003] [Description] - Phase [N]
   Impact: [Why this matters]
   Fix: [What to do]

3. [TDD-002] [Description] - Phase [N]
   Impact: [Why this matters]
   Fix: [What to do]

### Recommended Next Actions

1. [Action 1 - specific and actionable]
2. [Action 2 - specific and actionable]
3. [Action 3 - specific and actionable]

### Verdict

[READY_TO_IMPLEMENT | NEEDS_REVISION | NEEDS_MORE_RESEARCH]

**Rationale:** [1-2 sentences explaining the verdict]
```

## Rules

1. **Be specific** - Reference plan sections/phases, provide file:line if relevant
2. **Provide actionable fixes** - Don't just say "add more detail", say what detail
3. **Validate claims** - Don't flag potential issues, confirm they exist
4. **Prioritize correctly**:
   - CRITICAL: Blocks implementation or will cause failure
   - HIGH: Significantly impacts quality or feasibility
   - MEDIUM: Worth addressing but not blocking
   - LOW: Minor improvements
5. **If converged before pass 5** - Stop and report, don't continue needlessly
````

## Variations

### For Small Plans (single phase, <100 LOC)

Combine passes:
- **PASS 1:** Feasibility + Completeness
- **PASS 2:** TDD Alignment + Executability
- **PASS 3:** Final Review + Convergence

Check convergence after pass 2.

### For Refactoring Plans

Add emphasis on:
- Behavioral preservation guarantees
- Test coverage before refactoring starts
- Incremental verification at each step
- Rollback points clearly defined
- "What could go wrong" analysis

### For High-Risk Plans (production systems, security, data)

Add verification passes:
- **PASS 6:** Cross-check assumptions with actual codebase
- **PASS 7:** Validate no conflicts with in-progress work
- **PASS 8:** Confirm security/compliance requirements met

### For Plans Without Specs

Adjust PASS 3 to focus on:
- Requirements clearly stated in plan
- Acceptance criteria well-defined
- User stories or scenarios covered
- Plan serves as de facto spec

## Example

**Input:**
```
Review plans/2026-01-12-auth-token-validation.md using Rule of 5
```

**AI Response (following prompt):**
```
I'll review the auth token validation plan using the Rule of 5 methodology.

[Reads plan completely]

Starting comprehensive review...

---

## PASS 1: Feasibility & Risk

Issues Found:

[FEAS-001] CRITICAL - Phase 2 (JWT Signature Verification)
Description: Plan assumes jwt.verify() handles all edge cases
Evidence: Research shows jwt.verify() throws errors that can crash the app if not caught
Recommendation: Add explicit try-catch in Phase 2, add tests for malformed tokens, expired tokens, and invalid signatures

[FEAS-002] HIGH - Phase 3 (Integration)
Description: No consideration of existing auth middleware
Evidence: Codebase has authMiddleware.ts that may conflict
Recommendation: Research existing middleware in Phase 0, plan integration or replacement strategy

[FEAS-003] MEDIUM - Overall
Description: No rollback strategy if token validation breaks existing auth
Recommendation: Add Phase 0.5 for feature flag setup, implement validation behind flag

[FEAS-004] LOW - Phase 1 (Token Parsing)
Description: No mention of performance impact of base64 decoding
Evidence: Current implementation is synchronous, should be fine for typical load
Recommendation: Note acceptable given typical usage patterns

---

## PASS 2: Completeness & Scope

[COMP-001] HIGH - Success Criteria
Description: Manual verification steps missing for Phase 2
Evidence: Plan says "verify token validation works" but doesn't say how
Recommendation: Add specific manual tests: "Test with expired token from prod", "Test with token from different issuer", "Test with tampered signature"

[COMP-002] MEDIUM - Phase 3 (Integration)
Description: No mention of updating protected routes
Evidence: Plan updates middleware but doesn't cover routes that use it
Recommendation: Add Phase 3b for updating route definitions, add success criteria for protected endpoints

[COMP-003] LOW - Out of Scope
Description: Doesn't explicitly state token refresh is out of scope
Evidence: Token validation often comes with refresh, user might expect it
Recommendation: Add "Token refresh mechanism" to Out of Scope section

Convergence Check After Pass 2:
1. New CRITICAL issues: 1
2. Total new issues this pass: 3
3. Total new issues previous pass: 4
4. Estimated false positive rate: 10%

Status: ITERATE (Continue to Pass 3)

---

## PASS 3: Spec & TDD Alignment

[TDD-001] CRITICAL - Phase 1
Description: Tests are listed after implementation steps
Evidence: Plan says "1. Parse token 2. Extract claims 3. Add tests"
Recommendation: Reorder to "1. Write test for token parsing 2. Implement parser 3. Write test for claims 4. Extract claims"

[TDD-002] HIGH - Phase 2
Description: No test for cryptographic verification failure
Evidence: Security-critical path has no test coverage planned
Recommendation: Add test: "should reject token with valid structure but invalid signature"

[TDD-003] MEDIUM - Success Criteria
Description: "All tests pass" is too vague
Evidence: Doesn't specify which tests or expected coverage
Recommendation: Change to "All tests pass (minimum 15 tests covering valid tokens, expired tokens, invalid signatures, malformed tokens)"

Convergence Check After Pass 3:
1. New CRITICAL issues: 1
2. Total new issues this pass: 3
3. Total new issues previous pass: 3
4. Estimated false positive rate: 15%

Status: ITERATE (Continue to Pass 4)

---

## PASS 4: Ordering & Dependencies

[ORD-001] HIGH - Phase Order
Description: Phase 3 (Integration) requires Phase 4 (Error Handling) to be safe
Evidence: Integrating without error handling could crash production
Recommendation: Swap Phase 3 and Phase 4, or merge error handling into Phase 2

[ORD-002] LOW - Phase 2
Description: Could parallelize token parsing research and JWT library research
Evidence: Independent concerns
Recommendation: Note in plan that research can be parallelized for efficiency

Convergence Check After Pass 4:
1. New CRITICAL issues: 0
2. Total new issues this pass: 2
3. Total new issues previous pass: 3
4. Estimated false positive rate: 15%

Status: ITERATE (Continue to Pass 5)

---

## PASS 5: Clarity & Executability

[EXEC-001] MEDIUM - Phase 2
Description: "Integrate with secret management" is vague
Evidence: No file path, no specific approach mentioned
Recommendation: Specify "Use getSecret() from lib/secrets.ts" or "Add new env var JWT_SECRET to .env.example and lib/config.ts"

[EXEC-002] LOW - Phase 3
Description: "Update routes" doesn't specify which routes
Evidence: Could be interpreted differently by different implementers
Recommendation: List specific route files: "Update routes/api/user.ts, routes/api/admin.ts to use new validateToken middleware"

Convergence Check After Pass 5:
1. New CRITICAL issues: 0
2. Total new issues this pass: 2
3. Total new issues previous pass: 2
4. Estimated false positive rate: 20%

Status: CONVERGED

---

## Plan Review Final Report

**Plan:** plans/2026-01-12-auth-token-validation.md

### Summary

Total Issues by Severity:
- CRITICAL: 2 - Must fix before implementation
- HIGH: 4 - Should fix before implementation
- MEDIUM: 5 - Consider addressing
- LOW: 4 - Nice to have

Convergence: Pass 5

### Top 3 Most Critical Findings

1. [FEAS-001] JWT error handling missing - Phase 2
   Impact: Unhandled errors from jwt.verify() will crash the application
   Fix: Add explicit try-catch blocks, add tests for error cases

2. [TDD-001] Tests planned after implementation - Phase 1
   Impact: Violates TDD methodology, defeats purpose of test-first development
   Fix: Reorder phase steps to write tests before implementation

3. [ORD-001] Error handling comes after integration - Phase ordering
   Impact: Integrating without error handling risks production stability
   Fix: Move error handling to Phase 2 or before Phase 3 integration

### Recommended Next Actions

1. Reorder Phase 1 steps to follow TDD (write tests first)
2. Add comprehensive error handling to Phase 2 with try-catch and specific error tests
3. Swap Phase 3 and Phase 4 (error handling before integration)
4. Add specific manual verification steps to each phase
5. Add file paths and specific integration points in Phase 3
6. Research existing authMiddleware.ts before starting implementation

### Verdict

NEEDS_REVISION

**Rationale:** Plan has sound overall structure but contains 2 CRITICAL issues that would lead to implementation problems (lack of error handling, non-TDD approach) and several HIGH priority gaps. After addressing critical and high issues, plan will be ready for implementation.
```

## Expected Results

- Comprehensive review from 5 different perspectives
- Prioritized, actionable list of issues
- Clear verdict on plan readiness
- Specific recommendations for improvements
- Convergence typically reached by Pass 4-5

## References

**Rule of 5 Principle:**
- **Steve Yegge's Article:** https://steve-yegge.medium.com/six-new-tips-for-better-coding-with-agents-d4e9c86e42a9
- **Gastown Implementation:** https://github.com/steveyegge/gastown/blob/main/internal/formula/formulas/rule-of-five.formula.toml
- **Research Paper:** research-paper-rule-of-5-multi-agent-review.md

**Related Prompts:**
- **prompt-workflow-create-plan.md** - How to create plans
- **prompt-workflow-iterate-plan.md** - How to fix issues found in review
- **prompt-task-iterative-code-review.md** - Steve's original 5-stage approach for code
- **prompt-workflow-rule-of-5-review.md** - Extended multi-agent variant for code (high-stakes)

## Notes

### About This Adaptation

**Core Principle:** Steve Yegge's Rule of 5 - "LLM agents produce best work through 4-5 iterative refinements until convergence"

**This prompt adapts the principle to plan review:**
- Steve's original: Draft → Correctness → Clarity → Edge Cases → Excellence (editorial)
- This prompt: Feasibility → Completeness → TDD → Ordering → Executability (plan-specific)
- Both use convergence checking to know when to stop

**Why domain-focused passes for plans?**
Plans need different concerns than code: feasibility analysis, TDD alignment, dependency ordering, etc. The 5-pass iterative structure with convergence is what matters, not the specific pass topics.

### Detection Rates

Single-agent iterative review achieves:
- **75-85% defect detection** vs 60-70% for single-pass reviews
- **Multiple perspectives** - Each pass focuses on different aspect
- **Convergence validation** - Knows when to stop reviewing
- **Systematic coverage** - No aspect overlooked

### Single Agent vs Multi-Agent

This is **single-agent** iterative review:
- One agent performs all 5 passes sequentially
- Good for: Solo review, standard plans, quick quality gate
- Cost: ~$0.40-0.60 per review
- Time: 12-17 minutes

For **multi-agent** parallel review (10% better detection, 2x cost):
- Use `prompt-workflow-rule-of-5-review.md` for code review
- Parallel independent reviews by specialist agents
- Cross-validation and conflict resolution
- Best for: Critical code, security reviews, large changes
- Not typically needed for plan review (single-agent sufficient)

### Convergence is Key

Don't blindly run all 5 passes:
- Check convergence after each pass
- Stop when new issues drop below threshold
- Most plans converge by Pass 3-4
- Continuing past convergence wastes time

### False Positive Rate

Estimate false positive rate honestly:
- 0-10%: Very confident in findings
- 10-20%: Mostly confident, some uncertainty
- 20-30%: Multiple findings might be wrong
- >30%: Need human review or more context

High false positive rate suggests:
- Plan needs more context
- Reviewer needs more codebase knowledge
- Plan is in very early draft stage

### Actionable Recommendations

Bad: "Add more detail to Phase 2"
Good: "Add specific file paths for Phase 2 changes: auth/middleware.ts, auth/types.ts, and tests/auth/middleware.test.ts"

Bad: "Test coverage is insufficient"
Good: "Add tests for expired tokens (jwt expiry check), malformed tokens (json parse errors), and invalid signatures (crypto validation)"

### Review Quality Over Speed

Take time to:
- Actually read the plan thoroughly
- Research codebase when necessary
- Think through implications
- Provide specific, actionable guidance

A thorough 10-minute review is better than a superficial 2-minute scan.

## Version History

- 1.1.0 (2026-01-13): Updated to clarify relationship to Steve Yegge's Rule of 5; added gastown reference; clarified this uses the principle with plan-specific domain passes
- 1.0.0 (2026-01-12): Initial version adapted from fabbro plan_review command
