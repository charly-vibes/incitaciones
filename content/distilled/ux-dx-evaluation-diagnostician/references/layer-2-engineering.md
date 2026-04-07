# Layer 2: Engineering Experience (SPACE / DX Core 4)

Evaluate the engineering experience based on system outcomes. Skip if not applicable.

## SPACE Dimensions
- **Satisfaction:** Sentiment, tool satisfaction.
- **Performance:** System outcomes (change failure rate, MTTR).
- **Activity:** CI/CD telemetry, build times.
- **Communication:** Review response time, ownership clarity.
- **Efficiency:** Flow preservation, onboarding time.

## Evaluation Rules
- **System Outcomes Only:** Do not measure individual output (lines of code, tickets).
- **Oppositional Check:** Speed metrics (deployment frequency) MUST be counterbalanced by Quality metrics (change failure rate, rollback frequency).

## Diagnostic Format
Per dimension: `[HEALTHY | DEGRADED | MISSING | N/A]`
- **Evidence:** What was observed.
- **Gap:** What is missing or broken.
- **Recommendation:** Actionable fix.
