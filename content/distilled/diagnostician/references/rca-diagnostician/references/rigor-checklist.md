## Rigor Evaluation Checklist

Apply to your own RCA (self-check) or to an existing report (EVALUATE mode).

### Core Criteria (always apply)

| # | Criterion | What to check | MET when |
|---|-----------|---------------|----------|
| 1 | **Problem definition** | Is the outcome measurable, time-bounded, and severity-scoped? | WHAT/WHERE/WHEN/SEVERITY all specified; no solution language embedded |
| 2 | **Counterfactual** | Is the expected/normal behavior stated? | Explicit baseline; change from normal identified |
| 3 | **Evidence sufficiency** | Are there at least three independent evidence streams? | 3+ distinct source types (records, observation, testimony, artifacts) |
| 4 | **Hypothesis discipline** | Were alternative hypotheses documented with falsification criteria? | 3+ candidates at different levels; disconfirming evidence sought for each |
| 5 | **Mechanism plausibility** | Is each claimed cause explained by mechanism, not just correlation? | "How X causes Y" stated; not just "X preceded Y" |
| 6 | **Action quality** | Do actions materially change system constraints? | At least 1 strong action; weak-only portfolios flagged |
| 7 | **Ownership** | Is there a named owner, deadline, and authority for each action? | Every action row complete |
| 8 | **Effectiveness verification** | Are verification metrics and monitoring periods defined? | Metric + period + escalation path for each action |
| 9 | **Learning loop** | Does the RCA feed back into standards, training, and monitoring? | At least one organizational update identified |

### AI Governance Criteria (apply when AI tools were used in the investigation)

| # | Criterion | What to check | MET when |
|---|-----------|---------------|----------|
| 10 | **Provenance** | Does every AI-produced claim link to evidence artifacts? | Each AI output traceable to source data |
| 11 | **Explainability** | Are AI outputs interpretable and connected to interventions? | Explanations are meaningful to domain practitioners |
| 12 | **Causal guardrails** | Were associations distinguished from causal claims? | Uncertainty stated; no bare "AI found the root cause" |
| 13 | **Human decision rights** | Did accountable humans review and approve findings? | Named reviewer signed off on AI-informed conclusions |

### Scoring

- **MET**: Criterion fully satisfied with evidence
- **PARTIAL**: Criterion addressed but with gaps or weak evidence
- **NOT MET**: Criterion absent or inadequate

Overall rigor (based on 9 core criteria):
- **STRONG**: All 9 core criteria MET
- **ADEQUATE**: No more than 2 PARTIAL, zero NOT MET
- **WEAK**: 1-2 NOT MET or 3+ PARTIAL
- **INSUFFICIENT**: 3+ NOT MET

AI governance criteria do not affect the core rigor score but are reported separately. If any AI governance criterion is NOT MET, append "(AI governance gaps)" to the overall rigor rating.

### Output

```text
## Rigor Evaluation

| # | Criterion | Status | Evidence/Gap |
|---|-----------|--------|-------------|
| 1 | Problem definition | [MET/PARTIAL/NOT MET] | [detail] |
| 2 | Counterfactual | [MET/PARTIAL/NOT MET] | [detail] |
| 3 | Evidence sufficiency | [MET/PARTIAL/NOT MET] | [detail] |
| 4 | Hypothesis discipline | [MET/PARTIAL/NOT MET] | [detail] |
| 5 | Mechanism plausibility | [MET/PARTIAL/NOT MET] | [detail] |
| 6 | Action quality | [MET/PARTIAL/NOT MET] | [detail] |
| 7 | Ownership | [MET/PARTIAL/NOT MET] | [detail] |
| 8 | Effectiveness verification | [MET/PARTIAL/NOT MET] | [detail] |
| 9 | Learning loop | [MET/PARTIAL/NOT MET] | [detail] |

AI governance (if applicable):
| 10 | Provenance | [MET/PARTIAL/NOT MET/N/A] | [detail] |
| 11 | Explainability | [MET/PARTIAL/NOT MET/N/A] | [detail] |
| 12 | Causal guardrails | [MET/PARTIAL/NOT MET/N/A] | [detail] |
| 13 | Human decision rights | [MET/PARTIAL/NOT MET/N/A] | [detail] |

Overall rigor: [STRONG | ADEQUATE | WEAK | INSUFFICIENT]
```
