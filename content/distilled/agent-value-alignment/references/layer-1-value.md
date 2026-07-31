# Layer 1 — Value: Defining and Verifying the Promise

**Question:** What value was promised, to whom, and how will we know if it was delivered?

## The falsifiable value proposition

A value proposition is only useful if it can be proven false. The canonical structure:

> "[TOOL] will enable [USER SEGMENT] to [OUTCOME VERB] [OUTCOME OBJECT] by [AMOUNT] within [TIMEFRAME], as measured by [METRIC]."

Append **"compared to [BASELINE]"** as a falsifiability requirement — improvement is meaningless without a baseline.

If you cannot fill every slot, you have an aspiration, not a value proposition. Post-hoc rationalization ("we missed the metric but look at this other one") is the most common honesty failure.

## Output vs. outcome vs. impact

- **Outputs** — what was built (within the team's control; always looks successful).
- **Outcomes** — what changed in user behavior.
- **Impact** — what changed at the business level.

Measure at all three. Outputs are leading indicators of outcomes; outcomes of impact. A tool with high output volume but low outcome change is in the **activity trap**.

## Measurement disciplines

1. **Resist Goodhart's Law.** When a measure becomes a target, it ceases to be a good measure. Four failure types: regressive, extremal, causal, adversarial (Cobra Effect). Counter: multiple metrics in healthy tension; metrics requiring genuine behavioral change; monitor trends not point values; audit when metrics move unexpectedly.
2. **Leading before lagging.** A code assistant's "acceptance rate without modification" is *leading*; "PR cycle time reduction" is *lagging*. By the time lagging confirms failure, months are sunk.
3. **Counterfactual measurement.** Gold standard = randomized controlled trial. Where infeasible: difference-in-differences, regression discontinuity, instrumental variables. Self-reported productivity gains are not evidence.

## Frameworks (when to reach for which)

- **JTBD / ODI** (Ulwick/Christensen) — define value solution-free; 86% success vs. 17% industry avg.
- **Impact Mapping** (Adzic) — trace every deliverable → impact → goal; kills unmapped features.
- **Opportunity Solution Trees** (Torres) — outcome → opportunities → solutions → assumption tests.
- **HEART + GSM** (Google) — force multi-dimensional measurement; resists engagement over-indexing.
- **North Star Metric** — single leading indicator; not directly movable by the team.
- **OKRs** — outcome-based key results, quarterly, divorced from compensation.
- **Working Backwards / PR-FAQ** (Amazon) — articulate success + the hard questions before building.
- **Benefits Realization Management** (Jenner) — formal benefits register, independent verification.

## Accountability

- **Kill criteria** — written *before* development; four components: metric, threshold, timeframe, consequence; named decision owner; signed. Unsigned/vague criteria are not criteria.
- **Independent evaluation** — the building team must not be the sole measurer (structural conflict of interest, not honesty).
- **Value realization reviews** — quarterly ceremony (distinct from sprint review/retro): restate VP → review evidence → gap analysis → causal analysis → explicit continue/pivot/kill.
- **Portfolio governance** — forces honest comparison across tools; sunsetting is a pre-committed plan, not a political judgment.

## Activity trap diagnostic

Ask: *if this tool disappeared tomorrow, what would users lose?* If the honest answer is "not much," the tool is busy but not valuable.

## AUDIT checks

- [ ] Falsifiable VP exists with all slots filled (including baseline).
- [ ] Kill criteria exist, are signed, pre-development, with named owner + specific threshold + date.
- [ ] Measurement plan tracks leading *and* lagging indicators.
- [ ] Value realization review is scheduled on a cadence shorter than the drift half-life.
- [ ] Evaluation is independent of the building team.

## ESTABLISH (Day 1–2)

- Day 1 (2h): Write the falsifiable value proposition. *If the team cannot agree on the single sentence, the disagreement is the most important discovery — do not proceed.*
- Day 2 (1h): Write ≥3 kill criteria with specific numbers, dates, owners; sign them.
