---
title: Systematic Bias Audit & Mitigation (S-BAM)
type: task
tags: [bias, ethics, auditing, safety, rule-of-5, red-teaming, context-engineering]
tools: [claude-code, cursor, gemini, aider]
status: draft
created: 2026-03-03
updated: 2026-03-03
version: 1.0.0
related: [research-paper-bias-detection-prevention-mitigation.md, prompt-workflow-pre-mortem-planning.md, prompt-task-rule-of-5-universal.md]
source: research-paper-bias-detection-prevention-mitigation.md
---

# Systematic Bias Audit & Mitigation (S-BAM)

## When to Use

Use this prompt when you need to audit an AI-generated output, a system design, or a dataset for hidden biases. It is specifically designed for:
- **High-stakes environments:** Healthcare, legal, recruitment, or financial systems.
- **Systemic evaluation:** Checking if a tool inadvertently marginalizes specific demographics.
- **Context Recalibration:** When a model begins to drift, hallucinate, or show "greasy context" (contaminated history).
- **Final Safety Gate:** Before deploying an algorithmic decision-making tool.

**Do NOT use this prompt for:**
- Simple creative writing or low-stakes brainstorming.
- Basic code refactoring where no human-impact logic exists.

## The Prompt

````
# Systematic Bias Audit & Mitigation (S-BAM)

Act as a Senior Ethical Auditor and AI Safety Engineer. Your objective is to perform a rigorous, multi-layered audit of the provided [INPUT] to detect, prevent, and mitigate systemic, statistical, and cognitive biases.

Follow this 4-Phase Protocol:

## Phase 1: Taxonomy Classification (Diagnostic Scan)
Analyze the input for the following bias classes:
1. **Systemic Bias:** Institutional inequalities or historical prejudices embedded in the data/logic.
2. **Statistical/Computational Bias:** Sampling errors, over-optimization for majority classes, or spurious correlations.
3. **Human Cognitive Bias:** Confirmation bias, automation bias (blindly trusting the AI), or apophenia (perceiving patterns in noise).

## Phase 2: Adversarial Pressure Test (Red Teaming)
Conduct "Emotional Bias Probes" (EBP: testing response polarity to loaded/ambiguous prompts) and stress-test the logic against:
- **Edge Cases:** How does this perform for extreme out-of-distribution inputs?
- **Marginalized Demographics:** Proactively imagine impacts on specific races, ethnicities, ages (e.g., "simple-for-the-designer" fallacy for elderly users), or socio-economic strata.
- **Counterfactuals:** If we changed a sensitive attribute (e.g., Gender or Race), would the outcome change?

## Phase 3: Context Engineering & Mitigation Strategy
Propose structural recalibrations:
1. **Context Compaction:** Identify "greasy context" (irrelevant or biasing history) that should be summarized or removed.
2. **Pole Positioning:** Identify critical fairness constraints that should be moved to the beginning and end of the prompt to mitigate "attention bias."
3. **Algorithmic Interventions:** Recommend pre-, in-, or post-processing techniques (e.g., Re-weighting, Adversarial Debiasing, or Calibrated Equalized Odds).

## Phase 4: Rule of 5 Execution (Refinement Passes)
Execute five distinct, adversarial passes over the proposed output/plan:
1. **Draft:** Ensure informational completeness.
2. **Accuracy:** Adverarial check for factual integrity; verify all data and sources against internal knowledge (or flag for external verification).
3. **Clarity:** Purge ambiguity and obscure jargon to improve explainability.
4. **Edge Cases:** Visualize catastrophic failure (Pre-Mortem) and neutralize fragility.
5. **Excellence:** Final polish for operational deployment, ensuring ethical alignment.

**Capacity Alert:** If the [INPUT] exceeds your comfortable context window, suggest a sampling strategy or multi-pass approach rather than truncating.

[INPUT]:
{provide_input_here}
````

## Example

**Context:**
Reviewing an automated recruitment tool's ranking logic for software engineers.

**Input:**
```
/s-bam "Evaluate this ranking logic: The algorithm prioritizes candidates with 5+ years of experience, a degree from a top-tier university, and contributions to high-traffic open-source projects."
```

**Expected Output:**
A detailed report identifying:
- **Systemic Bias:** Favoring "top-tier" universities often excludes candidates from lower socio-economic backgrounds or non-traditional paths.
- **Edge Cases:** How it treats self-taught experts or those from underrepresented regions.
- **Mitigation:** Suggesting skills-based testing or re-weighting "university tier" to 0.

## Expected Results

- **Categorized Risks:** A clear taxonomy of identified biases.
- **Actionable Red Teaming:** Specific scenarios where the system fails or discriminates.
- **Recalibrated Logic:** Concrete suggestions for "cleaning the context" and repositioning constraints.
- **Rule of 5 Verification:** A final, refined version of the input that is demonstrably safer.

## Variations

**For Prompt Engineering:**
Focus strictly on Phase 3 (Context Engineering) and Phase 4 (Rule of 5) to optimize the prompt's structural integrity.

**For Data Science:**
Focus on Phase 1 (Taxonomy) and the "Algorithmic Interventions" in Phase 3 to fix dataset imbalances.

## References

- [research-paper-bias-detection-prevention-mitigation.md](research-paper-bias-detection-prevention-mitigation.md)
- NIST SP 1270 (2022) Standard for Identifying and Managing Bias in AI.
- "Resonant Coding" on the Bucket Metaphor and Rule of 5.

## Notes

- **The Bucket Metaphor:** Remember that context is like a bucket of water; any irrelevant or biased info "greases" the bucket and contaminates all future steps.
- **Pre-Mortem Mindset:** Don't ask *if* it will fail; assume it *has* failed and explain why.

## Version History

- 1.0.0 (2026-03-03): Initial version based on multidisciplinary bias research.
