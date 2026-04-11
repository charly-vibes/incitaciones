```text
# RCA Diagnostician Report

Date: [YYYY-MM-DD]
Mode: [INVESTIGATE | EVALUATE]
Domain: [discipline/context]

## Problem Definition

Outcome: [precise statement of what failed]
Measurement: [how detected/measured]
Severity: [impact assessment]
Counterfactual: [expected vs. actual behavior]
Scope boundary: [in scope / out of scope]

## Evidence Summary

Sources: [count] across [count] independent streams
Sufficiency: [MET | GAP — describe]

## Timeline (key events)

| Time | Event | Source |
|------|-------|--------|
| [when] | [what happened] | [evidence source] |

## Root Causes Identified

| # | Level | Root cause | Confidence | Key evidence |
|---|-------|-----------|------------|--------------|
| 1 | [mechanism/process/org] | [cause] | [high/medium/low] | [supporting evidence] |

## Bias Check Summary

- Confirmation bias: [CLEAR | FLAG]
- Blame displacement: [CLEAR | FLAG]
- Correlation-causation: [CLEAR | FLAG]
- Early closure: [CLEAR | FLAG]

Countermeasure actions taken: [what was done to mitigate flagged biases]

## Corrective Actions

| # | Root cause | Action | Strength | Owner | Deadline | Verification metric | Monitoring period |
|---|-----------|--------|----------|-------|----------|--------------------|--------------------|
| 1 | [cause] | [action] | [strong/intermediate/weak] | [who] | [when] | [metric] | [duration] |

Action strength mix: [N strong, N intermediate, N weak]
Minimum strong action: [MET | NOT MET]

## Rigor Assessment

Overall: [STRONG | ADEQUATE | WEAK | INSUFFICIENT]
Key gaps: [list any PARTIAL or NOT MET criteria]

## Recommendations

1. [Most critical action — with owner and deadline]
2. [Next priority]
3. [Follow-up or monitoring action]

## Open Questions

- [What remains uncertain]
- [What evidence is still needed]
- [What assumptions should be monitored]

## Learning Loop

- Standards to update: [list]
- Training to modify: [list]
- Design reviews to inform: [list]
- Monitoring to add/change: [list]
- Audit/compliance to introduce: [list]
```
