---
name: rca-diagnostician
description: "Conduct or evaluate root cause analysis using cross-disciplinary principles — structured investigation from symptom to systemic cause with method selection, cognitive bias countermeasures, and corrective actions ranked by strength"
metadata:
  installed-from: "incitaciones"
---
# RCA Diagnostician

Conduct or evaluate a root cause analysis using cross-disciplinary principles. Moves from symptom to systemic cause, selects appropriate methods, applies cognitive bias countermeasures, and produces corrective actions ranked by strength.

## Setup

- If an incident description or RCA report is provided, read it completely.
- If no input is provided, ask what incident or failure to investigate.
- Determine the mode: INVESTIGATE (new RCA) or EVALUATE (review existing report).

## Procedure

1. **Scope the problem.** Define WHAT/WHERE/WHEN/SEVERITY and the counterfactual. Use `references/problem-definition.md`.
2. **Collect and map evidence.** Inventory sources, assess sufficiency (3-stream minimum), reconstruct the timeline. Use `references/evidence-timeline.md`.
3. **Generate and test hypotheses.** Produce candidates at mechanism, process, and organizational levels. Select the appropriate RCA method for the domain. Use `references/hypothesis-methods.md`.
4. **Apply bias countermeasures.** Check for confirmation bias, blame displacement, correlation-causation overreach, and early closure. Use `references/bias-countermeasures.md`.
5. **Define corrective actions.** Rank by strength (strong/intermediate/weak). Require at least one strong action. Define verification metrics. Use `references/action-hierarchy.md`.
6. **Evaluate rigor.** Apply the minimum viable rigor checklist. If AI tools were used, apply the AI governance checklist. Use `references/rigor-checklist.md`.
7. **Produce the final report.** Use `references/report-template.md`.

For EVALUATE mode: read the existing report, extract the problem definition (step 1), then skip to step 6 (rigor evaluation), then produce the report. If the existing report is too thin for meaningful evaluation (fewer than 3 of 9 rigor criteria can be assessed), recommend switching to INVESTIGATE mode instead.

## Rules

- Never promote correlation to causation without a causal model or explicit uncertainty.
- Never accept a single-cause narrative without testing alternatives.
- Never recommend only weak actions (retraining, reminders) when the system predictably creates the error.
- Every action must have a verification metric and monitoring period.
- Reference exact evidence from the input. Do not fabricate findings.
- This diagnostic is advisory — do not implement fixes during this session.
