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
