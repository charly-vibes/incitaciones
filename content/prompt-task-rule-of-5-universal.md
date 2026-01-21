---
title: Universal Rule of 5 Review (Steve Yegge's Original)
type: prompt
subtype: task
tags: [review, rule-of-5, universal, iteration, convergence, quality-assurance]
tools: [claude-code, cursor, aider, gemini, any-cli-llm]
status: tested
created: 2026-01-13
updated: 2026-01-13
version: 1.0.0
related: [research-paper-rule-of-5-multi-agent-review.md, prompt-task-iterative-code-review.md, prompt-workflow-rule-of-5-review.md]
source: steve-yegge-gastown-rule-of-five-formula
---

# Universal Rule of 5 Review (Steve Yegge's Original)

## About This Prompt

This is the **universal implementation of Steve Yegge's original Rule of 5** from his gastown tool. It can be applied to any type of work: code, plans, research, issues, specs, documentation, or any other artifact.

**Core Philosophy:** "Breadth-first exploration, then editorial passes"

**The 5 Stages:**
1. **Draft** - Get the shape right
2. **Correctness** - Is the logic sound?
3. **Clarity** - Can someone else understand this?
4. **Edge Cases** - What could go wrong?
5. **Excellence** - Ready to ship?

**Why universal?**
These stages are editorial refinement stages that apply to any work product. Whether you're reviewing code, a plan, research, or a spec, you always want to check: structure, correctness, clarity, edge cases, and overall quality.

**Source:** https://github.com/steveyegge/gastown/blob/main/internal/formula/formulas/rule-of-five.formula.toml

## When to Use

**Use this prompt for 80% of your review needs:**
- Code review before committing
- Plan review before implementing
- Research review before finalizing
- Issue review before starting work
- Spec review before sharing
- Documentation review before publishing
- Any work product that needs quality review

**When NOT to use:**
- Security-critical code requiring 85-92% detection (use extended multi-agent variant)
- Trivial changes (just read and fix)
- Work that's clearly incomplete (finish it first)

## The Prompt

````
# Universal Rule of 5 Review

Review this [CODE/PLAN/RESEARCH/ISSUE/SPEC/DOCUMENT] using Steve Yegge's Rule of 5 - five stages of iterative editorial refinement until convergence.

## Work to Review

[PASTE YOUR WORK OR SPECIFY FILE PATH]

## Core Philosophy

"Breadth-first exploration, then editorial passes"

Don't aim for perfection in early stages. Each stage builds on insights from previous stages.

## Stage 1: DRAFT - Get the shape right

**Question:** Is the overall approach sound?

**Focus on:**
- Overall structure and organization
- Major architectural or conceptual issues
- Is this solving the right problem?
- Are the main components/sections present?
- Is the scope appropriate?
- Don't sweat the details yet - focus on the big picture

**For Code:** Architecture, design patterns, major functions/classes
**For Plans:** Phase structure, dependencies, overall approach
**For Research:** Sections, flow, research questions coverage
**For Issues:** Title appropriateness, basic description presence
**For Specs:** Requirements structure, completeness at high level

**Output:**
```
STAGE 1: DRAFT

Assessment: [1-2 sentences on overall shape]

Major Issues:
[DRAFT-001] [CRITICAL|HIGH|MEDIUM|LOW] - [Location]
Description: [What's wrong structurally]
Recommendation: [How to fix]

[DRAFT-002] ...

Shape Quality: [EXCELLENT|GOOD|FAIR|POOR]
```

---

## Stage 2: CORRECTNESS - Is the logic sound?

**Question:** Are there errors, bugs, or logical flaws?

**Focus on:**
- Building on Stage 1 assessment
- Factual accuracy and logical consistency
- Errors, bugs, or incorrect assumptions
- Internal contradictions
- Misinterpretation or misunderstanding
- Does it actually work/make sense?

**For Code:** Syntax errors, logic bugs, algorithm correctness, data structure usage
**For Plans:** Feasibility issues, impossible dependencies, resource misestimates
**For Research:** Factual errors, incorrect citations, wrong conclusions from data
**For Issues:** Impossible scope, contradictory requirements, technical impossibilities
**For Specs:** Contradictory requirements, infeasible features, wrong assumptions

**Output:**
```
STAGE 2: CORRECTNESS

Issues Found:
[CORR-001] [CRITICAL|HIGH|MEDIUM|LOW] - [Location]
Description: [What's incorrect]
Evidence: [Why this is wrong]
Recommendation: [How to fix with specifics]

[CORR-002] ...

Correctness Quality: [EXCELLENT|GOOD|FAIR|POOR]
```

**Convergence Check (after Stage 2):**
```
New CRITICAL issues: [count]
Total new issues: [count]
Status: [CONVERGED | CONTINUE]
```

---

## Stage 3: CLARITY - Can someone else understand this?

**Question:** Is this comprehensible to the intended audience?

**Focus on:**
- Building on corrected work from Stage 2
- Readability and comprehensibility
- Unclear or ambiguous language
- Jargon without explanation
- Poor naming or labeling
- Missing context or explanation
- Flow and organization

**For Code:** Variable/function names, comments, code organization, complexity
**For Plans:** Phase descriptions, success criteria clarity, instruction specificity
**For Research:** Term definitions, logical flow, transitions, accessibility
**For Issues:** Description clarity, actionability, context sufficiency
**For Specs:** Requirement clarity, unambiguous language, examples provided

**Output:**
```
STAGE 3: CLARITY

Issues Found:
[CLAR-001] [HIGH|MEDIUM|LOW] - [Location]
Description: [What's unclear]
Impact: [Why this matters]
Recommendation: [How to improve clarity]

[CLAR-002] ...

Clarity Quality: [EXCELLENT|GOOD|FAIR|POOR]
```

**Convergence Check (after Stage 3):**
```
New CRITICAL issues: [count]
Total new issues: [count]
New issues vs Stage 2: [percentage change]
Status: [CONVERGED | CONTINUE]
```

---

## Stage 4: EDGE CASES - What could go wrong?

**Question:** Are boundary conditions and unusual scenarios handled?

**Focus on:**
- Building on clarified work from Stage 3
- Edge cases and boundary conditions
- Error handling and failure modes
- Unusual inputs or scenarios
- Gaps in coverage
- "What if..." scenarios
- Assumptions that might not hold

**For Code:** Null checks, empty arrays, max values, error handling, race conditions
**For Plans:** Rollback strategies, blocked scenarios, resource unavailability, assumption failures
**For Research:** Alternative explanations, conflicting evidence, unanswered questions, limitations
**For Issues:** Acceptance criteria gaps, unclear done conditions, edge scenarios
**For Specs:** Corner cases, conflicting requirements, missing scenarios, error states

**Output:**
```
STAGE 4: EDGE CASES

Issues Found:
[EDGE-001] [CRITICAL|HIGH|MEDIUM|LOW] - [Location]
Description: [What edge case is unhandled]
Scenario: [When this could happen]
Impact: [What goes wrong]
Recommendation: [How to handle it]

[EDGE-002] ...

Edge Case Coverage: [EXCELLENT|GOOD|FAIR|POOR]
```

**Convergence Check (after Stage 4):**
```
New CRITICAL issues: [count]
Total new issues: [count]
New issues vs Stage 3: [percentage change]
Estimated false positive rate: [percentage]
Status: [CONVERGED | CONTINUE]
```

---

## Stage 5: EXCELLENCE - Ready to ship?

**Question:** Would you be proud to ship this?

**Focus on:**
- Final polish based on all previous stages
- Production quality assessment
- Best practices adherence
- Professional standards
- Performance and efficiency
- Completeness and thoroughness
- Overall quality for intended purpose

**For Code:** Performance, style, documentation, test coverage, maintainability
**For Plans:** Implementability, completeness, TDD approach, verification steps
**For Research:** Actionability, recommendations, references, presentation quality
**For Issues:** Executability, priority, labels, handoff readiness
**For Specs:** Testability, completeness, stakeholder readiness, sign-off criteria

**Output:**
```
STAGE 5: EXCELLENCE

Final Polish Issues:
[EXCL-001] [HIGH|MEDIUM|LOW] - [Location]
Description: [What could be better]
Recommendation: [How to achieve excellence]

[EXCL-002] ...

Excellence Assessment:
- Structure: [EXCELLENT|GOOD|FAIR|POOR]
- Correctness: [EXCELLENT|GOOD|FAIR|POOR]
- Clarity: [EXCELLENT|GOOD|FAIR|POOR]
- Edge Cases: [EXCELLENT|GOOD|FAIR|POOR]
- Overall: [EXCELLENT|GOOD|FAIR|POOR]

Production Ready: [YES|NO|WITH_NOTES]
```

**Convergence Check (after Stage 5):**
```
New CRITICAL issues: [count]
Total new issues: [count]
New issues vs Stage 4: [percentage change]
Estimated false positive rate: [percentage]
Status: [CONVERGED | NEEDS_ITERATION | ESCALATE_TO_HUMAN]
```

---

## Convergence Criteria

**CONVERGED** if:
- No new CRITICAL issues AND
- New issue rate < 10% vs previous stage AND
- False positive rate < 20%

**CONTINUE** if:
- New issues found that need addressing

**ESCALATE_TO_HUMAN** if:
- After 5 stages, still finding CRITICAL issues OR
- Uncertain about severity or correctness OR
- False positive rate > 30%

**If converged before Stage 5:** Stop and report. Don't continue unnecessarily.

---

## Final Report

After convergence or completing Stage 5:

```
# Rule of 5 Review - Final Report

**Work Reviewed:** [type] - [path/identifier]
**Convergence:** Stage [N]

## Summary

Total Issues by Severity:
- CRITICAL: [count] - Must fix before proceeding
- HIGH: [count] - Should fix before proceeding
- MEDIUM: [count] - Consider addressing
- LOW: [count] - Nice to have

## Top 3 Critical Findings

1. [ID] [Description] - [Location]
   Impact: [Why this matters]
   Fix: [What to do]

2. [ID] [Description] - [Location]
   Impact: [Why this matters]
   Fix: [What to do]

3. [ID] [Description] - [Location]
   Impact: [Why this matters]
   Fix: [What to do]

## Stage-by-Stage Quality

- Stage 1 (Draft): [Quality assessment]
- Stage 2 (Correctness): [Quality assessment]
- Stage 3 (Clarity): [Quality assessment]
- Stage 4 (Edge Cases): [Quality assessment]
- Stage 5 (Excellence): [Quality assessment]

## Recommended Actions

1. [Action 1 - specific and actionable]
2. [Action 2 - specific and actionable]
3. [Action 3 - specific and actionable]

## Verdict

[READY | NEEDS_REVISION | NEEDS_REWORK | NOT_READY]

**Rationale:** [1-2 sentences explaining the verdict]
```

---

## Rules for All Stages

1. **Build progressively** - Each stage builds on work from previous stages
2. **Be specific** - Reference exact locations (file:line, section, paragraph)
3. **Provide actionable fixes** - Don't just identify problems, suggest solutions
4. **Validate claims** - Don't flag potential issues, confirm they exist
5. **Prioritize correctly**:
   - CRITICAL: Blocks use/deployment, fundamentally broken
   - HIGH: Significantly impacts quality or usability
   - MEDIUM: Should be addressed but not blocking
   - LOW: Minor improvements
6. **Check convergence** - Stop when new issues drop below threshold
7. **Don't force 5 stages** - If converged earlier, report and stop
````

---

## Domain-Specific Examples

### Example 1: Code Review

**Input:**
```python
def process_users(users):
    results = []
    for user in users:
        if user.age > 18:
            results.append(user.name.upper())
    return results
```

**Output (abbreviated):**

```
STAGE 1: DRAFT
Shape Quality: GOOD - Simple function, clear structure

STAGE 2: CORRECTNESS
[CORR-001] HIGH - Line 4
Description: No null check on user.name
Evidence: Will crash if user.name is None
Recommendation: Add null check: `if user.name: results.append(user.name.upper())`

STAGE 3: CLARITY
[CLAR-001] MEDIUM - Function name
Description: "process_users" is vague
Recommendation: Rename to "get_adult_user_names_uppercase"

STAGE 4: EDGE CASES
[EDGE-001] HIGH - Line 2
Description: Empty users list not handled efficiently
Recommendation: Add early return: `if not users: return []`

[EDGE-002] MEDIUM - Line 4
Description: No handling for non-string names
Recommendation: Add type check or use str(user.name)

STAGE 5: EXCELLENCE
Production Ready: WITH_NOTES - Fix CORR-001 and EDGE-001 first
```

### Example 2: Plan Review

**Input:** Plan for implementing user authentication

**Output (abbreviated):**

```
STAGE 1: DRAFT
Shape Quality: FAIR - Missing rollback phase and testing phase

STAGE 2: CORRECTNESS
[CORR-001] CRITICAL - Phase 3
Description: Assumes JWT library handles all validation automatically
Evidence: Most libraries require explicit error handling
Recommendation: Add error handling to Phase 3, add test for invalid tokens

STAGE 3: CLARITY
[CLAR-001] HIGH - Phase 2
Description: "Integrate with auth system" is vague
Recommendation: Specify files: "Update api/middleware/auth.ts and api/routes/protected.ts"

STAGE 4: EDGE CASES
[EDGE-001] HIGH - Overall
Description: No plan for token expiration or refresh
Recommendation: Add Phase 4 for token refresh mechanism or mark as out of scope

STAGE 5: EXCELLENCE
Production Ready: NO - Fix CORR-001 and add missing phases
```

### Example 3: Research Review

**Input:** Research document on OAuth implementation patterns

**Output (abbreviated):**

```
STAGE 1: DRAFT
Shape Quality: GOOD - Well-structured sections

STAGE 2: CORRECTNESS
[CORR-001] CRITICAL - Section 3.2
Description: Claims localStorage is secure for tokens
Evidence: OWASP warns against localStorage for sensitive data (XSS risk)
Recommendation: Correct to recommend httpOnly cookies

STAGE 3: CLARITY
[CLAR-001] MEDIUM - Section 2
Description: Uses "PKCE" without definition
Recommendation: Define: "PKCE (Proof Key for Code Exchange)"

STAGE 4: EDGE CASES
[EDGE-001] HIGH - Conclusion
Description: No discussion of refresh token strategy
Recommendation: Add section on token refresh patterns

STAGE 5: EXCELLENCE
Production Ready: WITH_NOTES - Fix CORR-001 before using for decisions
```

### Example 4: Issue Review

**Input:** GitHub issue for implementing feature

**Output (abbreviated):**

```
STAGE 1: DRAFT
Shape Quality: FAIR - Has title and basic description

STAGE 2: CORRECTNESS
[CORR-001] HIGH - Description
Description: Estimates 2 hours but requires API changes + frontend + tests
Evidence: Similar work took 8 hours last time
Recommendation: Re-estimate or break into multiple issues

STAGE 3: CLARITY
[CLAR-001] CRITICAL - Description
Description: "Update the form" - which form? how?
Recommendation: Specify: "Update UserProfileForm to add email validation field"

STAGE 4: EDGE CASES
[EDGE-001] MEDIUM - Acceptance criteria
Description: No test for invalid email format
Recommendation: Add: "Tests verify invalid emails are rejected"

STAGE 5: EXCELLENCE
Production Ready: NO - Fix CLAR-001 before starting work
```

---

## Performance Characteristics

**Single-agent linear (this approach):**
- Time: 12-17 minutes
- API calls: 5-7
- Detection rate: 75-85%
- False positives: 15-20%
- Cost: $0.40-0.60 per 500 LOC equivalent
- Best for: 80% of review needs

**When to use extended multi-agent instead:**
- Security-critical systems: Need 85-92% detection
- Large refactorings (>500 LOC): Need cross-validation
- Pre-production gates: Need maximum confidence
- Cost: 2-3x more expensive

---

## References

**Primary Sources:**
- **Steve Yegge's Article:** https://steve-yegge.medium.com/six-new-tips-for-better-coding-with-agents-d4e9c86e42a9
- **Gastown Implementation:** https://github.com/steveyegge/gastown/blob/main/internal/formula/formulas/rule-of-five.formula.toml
- **Original Discovery:** Jeffrey Emanuel

**Research & Extensions:**
- **Research Paper:** research-paper-rule-of-5-multi-agent-review.md
- **Extended Multi-Agent:** prompt-workflow-rule-of-5-review.md
- **Detailed Wave/Gate:** prompt-workflow-multi-agent-parallel-review.md

**Domain-Specific Adaptations:**
- **Code Review Variant:** prompt-task-iterative-code-review.md (includes domain-focused alternative)
- **Plan Review:** prompt-task-plan-review.md (uses principle with plan-specific passes)
- **Research Review:** prompt-task-research-review.md (uses principle with research-specific passes)
- **Issue Review:** prompt-task-issue-tracker-review.md (uses principle with issue-specific passes)

---

## Notes

### Why These 5 Stages?

Steve Yegge's insight: **"LLM agents produce best work through 4-5 iterative refinements until convergence"**

The 5 stages create a natural progression:
1. **Draft:** Big picture, don't sweat details
2. **Correctness:** Fix what's wrong (builds on Draft)
3. **Clarity:** Make it understandable (builds on Correct version)
4. **Edge Cases:** Cover gaps (now visible in Clear version)
5. **Excellence:** Final polish (all previous issues addressed)

Each stage catches issues that become visible only after earlier stages are complete.

### Why Universal?

These are **editorial** stages that apply to any intellectual work:
- Writing code? Draft structure → Correct bugs → Clarify names → Handle edge cases → Polish
- Writing plans? Draft phases → Correct feasibility → Clarify steps → Handle risks → Polish completeness
- Writing research? Draft sections → Correct facts → Clarify arguments → Handle limitations → Polish recommendations

The stages are universal. Only the specific concerns within each stage vary by domain.

### Progressive Refinement

**Key principle:** Don't try to be perfect in Stage 1.

Bad approach:
- Stage 1: Try to catch everything at once
- Result: Overwhelmed, miss obvious issues

Good approach (Rule of 5):
- Stage 1: Get the shape right, note major issues
- Stage 2: Now that shape is good, fix correctness
- Stage 3: Now that it's correct, make it clear
- Stage 4: Now that it's clear, spot the edge cases
- Stage 5: Now that everything works, achieve excellence

### Convergence is Key

**Don't blindly run all 5 stages:**

Most work converges by Stage 3-4:
- Simple code: Converges Stage 3
- Complex systems: Converges Stage 4-5
- If not converged by Stage 5: Human judgment needed

**Convergence means:** Each stage finds fewer issues. When new issues drop below 10%, you're done.

### False Positive Rate

Estimate honestly:
- 0-10%: Very confident
- 10-20%: Mostly confident
- 20-30%: Some uncertainty
- >30%: Need human review

High false positive rate suggests:
- Need more context
- Work is very early draft
- Domain expertise needed

### Cost vs Quality

**This approach (75-85% detection):**
- $0.40-0.60 per review
- 12-17 minutes
- Sufficient for 80% of needs

**Extended multi-agent (85-92% detection):**
- $0.80-1.20 per review
- 10-15 minutes
- Justified for critical systems only

**Human review (60-70% detection):**
- $100-200 per review
- 2-4 hours
- Still valuable for critical decisions

AI review doesn't replace human review—it's Line 2 of defense:
1. **Line 1:** Self-review (developer)
2. **Line 2:** AI review (this prompt)
3. **Line 3:** Human peer review

### Actionable Recommendations

**Bad:** "Add more detail"
**Good:** "Add file paths: api/auth.ts, api/middleware/validate.ts, and tests/auth.test.ts"

**Bad:** "Handle errors"
**Good:** "Wrap in try-catch, return 401 for invalid tokens, 500 for server errors"

**Bad:** "Improve clarity"
**Good:** "Rename getUserData() to fetchAuthenticatedUserProfile() to clarify it requires auth"

---

## Version History

- 1.0.0 (2026-01-13): Initial universal implementation of Steve Yegge's original Rule of 5 from gastown, adaptable to code, plans, research, issues, specs, and documentation
