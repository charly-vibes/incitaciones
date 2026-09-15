# Layer 1: Product Experience (HEART)

Evaluate the target against the HEART dimensions. Skip if not applicable.

## HEART Dimensions
- **Happiness:** Satisfaction signals, NPS/CSAT/SUS.
- **Engagement:** Interaction depth and frequency.
- **Adoption:** Onboarding velocity, time-to-first-value.
- **Retention:** Churn signals, cohort tracking.
- **Task Success:** Completion rates, time-on-task, error rates.

## Checks
- **Web-based Targets:** If CI is accessible, check Lighthouse/AXE. Note if accessibility testing is only automated (which is insufficient).
- **CI Inaccessible:** Record in "Measurement Gaps".

## Diagnostic Format
Per dimension: `[HEALTHY | DEGRADED | MISSING | N/A]`
- **Evidence:** What was observed.
- **Gap:** What is missing or broken.
- **Recommendation:** Actionable fix.
