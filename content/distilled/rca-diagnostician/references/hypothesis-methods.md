## Hypothesis Generation and Method Selection

### Multi-Level Hypothesis Generation

Produce at least three candidate root causes across different analytical levels:

- **Mechanism level**: What physical, logical, or behavioral process failed? (e.g., memory leak, O-ring degradation, medication dosage calculation error)
- **Process control level**: What check, barrier, or monitoring should have caught it? (e.g., missing alert threshold, no pre-deployment validation, absent second-check protocol)
- **Organizational level**: What policy, incentive, resource, or cultural factor enabled the failure? (e.g., staffing pressure, incentive misalignment, deferred maintenance, blame culture suppressing reports)

### Method Selection Guide

Select based on domain, evidence, and the question being asked:

| Method | Best when | Domain fit |
|--------|-----------|------------|
| **5 Whys** | Fast initial exploration; small team | Any — but stop only when you reach a system-modifiable cause |
| **Fishbone/Ishikawa** | Brainstorming across cause categories | Any — team-friendly for cross-functional groups |
| **FTA (Fault Tree)** | Combinations of failures matter; system architecture available | Engineering, manufacturing, safety |
| **FMEA/FMECA** | Preventive analysis of components/processes; need risk ranking | Engineering, manufacturing, design |
| **STAMP/STPA** | Complex sociotechnical systems with control interactions | Aviation, healthcare, autonomous systems |
| **Causal inference (DAG/SCM)** | Need to identify intervention effects formally; confounding is a concern | Social science, policy, epidemiology |
| **Qualitative inquiry** | Practices, incentives, or culture are the suspected drivers | Organizational, healthcare, education |
| **Bayesian networks** | Multiple uncertain evidence streams; need probabilistic diagnosis | Engineering, medical diagnostics, security |
| **Postmortem (structured)** | Software/infrastructure incidents; need detection-response-recovery analysis | Software, IT operations, security |

### Hypothesis Testing

For each candidate cause, answer:

1. **What evidence supports it?** (cite specific sources from evidence inventory)
2. **What evidence contradicts it?** (actively seek disconfirming data)
3. **What would falsify it?** (define the test that would eliminate this hypothesis)
4. **Is the mechanism plausible?** (can you explain how X causes Y, not just that X correlates with Y?)
5. **Causal role**: Is it necessary? Sufficient? Or a contributing factor?

### Differentiating Causal Levels

- **Contributing factor**: Exacerbated the outcome or increased its likelihood, but did not directly initiate it
- **Root cause**: The specific mechanism or broken process that, if removed, would have prevented the outcome
- **Latent/generic cause**: The overarching systemic flaw that allowed the root cause to exist (e.g., flawed policy, missing training program, cultural norm). Fixing these yields the highest ROI.

### Output

```text
## Hypotheses

| # | Level | Candidate cause | Supporting evidence | Contradicting evidence | Falsification test | Status |
|---|-------|-----------------|--------------------|-----------------------|-------------------|--------|
| 1 | [mechanism/process/org] | [hypothesis] | [evidence] | [evidence] | [what would disprove] | [supported/weakened/falsified] |

Method selected: [method] — Rationale: [why this method fits the domain and evidence]
```
