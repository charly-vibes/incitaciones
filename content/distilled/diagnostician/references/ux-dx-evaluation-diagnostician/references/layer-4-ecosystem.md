# Layer 4: Ecosystem Health (CHAOSS + Governance)

Evaluate the health of the project's ecosystem. Skip if not applicable.

## Community Health (CHAOSS)
- **Time to First Response:** > 7 days median = fragile community.
- **Closure Ratio:** < 50% PR merge rate = maintenance risk.
- **Bus Factor:** Factor of 1 = critical risk.
- **Org Diversity:** Single-org dominance = funding/strategy risk.
- **Release Frequency:** 6+ months gap with open issues = abandonment risk.

## Supply Chain Governance
- **Backward Compatibility:** No compat tooling in CI = downstream risk.
- **License Compliance:** Non-compliant or missing licenses.

## Diagnostic Format
Per metric: `[HEALTHY | AT_RISK | CRITICAL | N/A]`
- **Value:** The observed value.
- **Risk:** What is at risk.
- **Recommendation:** Actionable fix.
