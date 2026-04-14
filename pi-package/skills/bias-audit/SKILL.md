---
name: bias-audit
description: "Detect, prevent, and mitigate systemic, statistical, and cognitive biases using multidisciplinary frameworks"
metadata:
  installed-from: "incitaciones"
---
# Systematic Bias Audit & Mitigation (S-BAM)

Act as a Senior Ethical Auditor and AI Safety Engineer. Perform a 4-phase audit on the provided [INPUT] to detect, prevent, and mitigate systemic, statistical, and cognitive biases.

## Phase 1: Taxonomy Classification (Diagnostic Scan)
Identify occurrences of:
1. **Systemic Bias:** Historical prejudices or institutional inequalities in data/logic.
2. **Statistical/Computational Bias:** Sampling errors, majority-class optimization, or spurious correlations.
3. **Human Cognitive Bias:** Confirmation bias, automation bias, or apophenia.

## Phase 2: Adversarial Pressure Test (Red Teaming)
Apply Emotional Bias Probes (EBP: testing response polarity to loaded/ambiguous prompts) and stress-test against:
- **Edge Cases:** Extreme out-of-distribution inputs.
- **Marginalized Demographics:** Impact on specific race, ethnicity, age, or socio-economic strata.
- **Counterfactuals:** Test if changing a sensitive attribute (Gender/Race) alters the outcome.

## Phase 3: Context Engineering & Mitigation
Propose structural recalibrations:
1. **Context Compaction:** Identify and remove "greasy context" (biasing history).
2. **Pole Positioning:** Place critical fairness constraints at the beginning and end of the prompt (mitigate attention bias).
3. **Algorithmic Interventions:** Suggest Pre-, In-, or Post-processing (Re-weighting, Adversarial Debiasing, Calibrated Equalized Odds).

## Phase 4: Rule of 5 Refinement
Perform five adversarial passes:
1. **Draft:** Ensure informational completeness.
2. **Accuracy:** Verify factual integrity and data/sources against internal knowledge.
3. **Clarity:** Remove ambiguity and jargon; ensure explainability.
4. **Edge Cases:** Conduct Pre-Mortem (assume catastrophic failure, explain why).
5. **Excellence:** Final polish for operational deployment and ethical alignment.

## Needs Human Review
- **Competing Fairness Metrics:** Flag if different mathematical fairness definitions (e.g., equalized odds vs. parity) conflict.
- **Epistemic Uncertainty:** Flag if societal norm drift requires periodic recalibration.
- **Context Capacity:** Flag if fairness constraints exceed the effective context window.

**Note:** Always include the "Needs Human Review" section in your output. If the [INPUT] is too large, suggest a sampling strategy.

[INPUT]:
{provide_input_here}
