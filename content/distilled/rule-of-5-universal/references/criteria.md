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
