---
name: rule-of-5-universal
description: "Compiled alias of the Rule-of-5 universal review mode of the review skill. Hidden from model invocation; invocable via /skill:rule-of-5-universal; serves the legacy site URL with full compiled content."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.10.2"
  internal: true
---
> **Moved:** this entry is now the **rule-of-5-universal** mode of the **review** skill.
> The full method is compiled below from `content/distilled/review/references/rule-of-5-universal/SKILL.md`.
> Invoke via `/skill:rule-of-5-universal`, invoke `/skill:review` for the mode table,
> or use this URL directly in a chat interface.

#### Core Instructions (content/distilled/review/references/rule-of-5-universal/SKILL.md)

# Universal Rule of 5 Review

Review any intellectual artifact (code, plans, research, issues, specs, documentation) using Steve Yegge's 5-stage iterative editorial refinement process until convergence.

## Core Philosophy
"Breadth-first exploration, then editorial passes." Don't aim for perfection in early stages. Each stage builds on insights from previous stages.

## Procedure
1.  **Stage 1: DRAFT** - Evaluate overall shape and sound approach. Focus on architecture, organization, and scope.
2.  **Stage 2: CORRECTNESS** - Identify errors, bugs, or logical flaws. Check for convergence.
3.  **Stage 3: CLARITY** - Ensure comprehensibility for the intended audience. Check for convergence.
4.  **Stage 4: EDGE CASES** - Handle boundary conditions and unusual scenarios. Check for convergence.
5.  **Stage 5: EXCELLENCE** - Final polish for production quality and pride.
6.  **Final Report** - Synthesize findings and provide a final verdict.

## Rules
- **Progressive Build:** Each stage must build on previous findings.
- **Specificity:** Reference exact locations (file:line, section, paragraph).
- **Actionability:** Suggest specific solutions, don't just identify problems.
- **Validation:** Confirm issues exist; do not flag "potential" issues without evidence.
- **Early Stop:** Stop if convergence criteria are met before Stage 5.

## References
- **Templates:** Use `references/templates.md` for the exact output format of each stage and the final report.
- **Criteria:** Refer to `references/criteria.md` for convergence and escalation rules.
- **Examples:** (Optional) See `references/examples.md` for domain-specific review examples.

---

#### Reference: references/criteria.md

# Rule of 5 Convergence & Escalation Criteria

## Convergence Check
Perform this check after Stage 2, Stage 3, and Stage 4.

```
New CRITICAL issues: [count]
Total new issues: [count]
New issues vs Previous Stage: [percentage change]
Status: [CONVERGED | CONTINUE]
```

## Convergence Rules
- **CONVERGED** if:
    - No new CRITICAL issues AND
    - New issue rate < 10% vs previous stage AND
    - False positive rate < 20%
- **CONTINUE** if:
    - New issues found that need addressing and do not meet the above criteria.

## Escalation Rules
- **ESCALATE_TO_HUMAN** if:
    - After 5 stages, still finding CRITICAL issues OR
    - Uncertain about severity or correctness OR
    - False positive rate > 30%

## Convergence Check Output Format
```
New CRITICAL issues: [count]
Total new issues: [count]
New issues vs Previous Stage: [percentage change]
Estimated false positive rate: [percentage]
Status: [CONVERGED | CONTINUE | NEEDS_ITERATION | ESCALATE_TO_HUMAN]
```

---

#### Reference: references/examples.md

# Rule of 5 Domain-Specific Examples

## Example 1: Code Review

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

STAGE 5: EXCELLENCE
Production Ready: WITH_NOTES - Fix CORR-001 and EDGE-001 first
```

## Example 2: Plan Review

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

---

#### Reference: references/templates.md

# Rule of 5 Output Templates

Use these templates for each stage of the review and the final report.

## Stage 1: DRAFT
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

## Stage 2: CORRECTNESS
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

## Stage 3: CLARITY
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

## Stage 4: EDGE CASES
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

## Stage 5: EXCELLENCE
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

## Final Report
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
