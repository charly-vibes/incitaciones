## Convergence Check

After each pass starting with pass 2, report:

```text
Convergence Check After Pass [N]:

1. New CRITICAL issues: [count]
2. Total new issues this pass: [count]
3. Total new issues previous pass: [count]
4. Estimated false positive rate: [percentage]

Status: [CONVERGED | ITERATE | NEEDS_HUMAN]
```

Criteria:
- `CONVERGED`: no new CRITICAL issues, <10% new issues vs previous pass, <20% false positives
- `ITERATE`: continue
- `NEEDS_HUMAN`: blocking judgment call required
