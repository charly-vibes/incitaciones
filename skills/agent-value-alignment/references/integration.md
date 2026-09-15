# Integration: Closing the Loop

**Question:** Are the four layers bound into one auditable system — or are they four separate piles of advice?

The governing invariant:

> **Every governance decision must have a corresponding prompt clause, and every prompt clause must have a corresponding eval test.** If a decision exists in the BSD but has no prompt clause, it is not enforced. If a prompt clause exists but has no eval test, it is not verified. If an eval test exists but is not reviewed in governance, it is not acted upon.

## The vocabulary bridge

The most common integration failure is **vocabulary fragmentation**: the system prompt says "PRIMARY OBJECTIVE," the eval suite says "goal," the value realization review says "value delivery" — all referring to the same thing without anyone knowing it. When language is inconsistent, no behavioral observation can be traced to a governance decision, and no governance decision can be translated into a prompt change.

**Fix:** a shared vocabulary document mapping each concept across system prompt / eval / governance terms, plus a **traceability matrix** linking each governance decision → prompt clause → eval test ID.

| Concept | System prompt term | Eval term | Governance term |
|---|---|---|---|
| What the agent is trying to do | PRIMARY OBJECTIVE | goal | value proposition |
| What the agent is not allowed to do | PROHIBITED ACTIONS | scope violation | out of scope |
| When the agent should stop and ask | ESCALATION TRIGGER | escalation behavior | human oversight event |
| Whether the agent helped the user | OBJECTIVE CHECK | goal achievement score | value delivery |
| Agent doing something unintended | SCOPE BOUNDARY REACHED | behavioral regression | alignment gap |
| Agent gradually shifting behavior | DRIFT CHECK (inner-monologue) | regression in eval suite | behavioral drift |

## Verbatim propagation of the value proposition

The value proposition statement must appear **verbatim** in three places:

1. The system prompt — as the PRIMARY OBJECTIVE in the Goal Sandwich.
2. The BSD — Section 1 (Purpose and Objective).
3. The Value Realization Review agenda — read aloud at the opening of every review.

When the value proposition changes, all three must be updated together, the eval suite re-run, and a Value Realization Review scheduled to re-baseline. This creates a direct, auditable chain from governance commitment to runtime behavior.

## Automated value reporting

Agents can be prompted to emit a structured JSON value report at the end of each task:

```json
{
  "task_id": "...",
  "original_objective": "[restate]",
  "goal_alignment": { "score": 1-5, "reasoning": "...", "gaps": "..." },
  "scope_compliance": { "compliant": true/false, "violations": "...", "escalations": "..." },
  "user_value_delivered": { "score": 1-5, "user_can_now": "..." },
  "resource_usage": { "tools_called": N, "steps_taken": N, "footprint": "minimal|appropriate|excessive" },
  "flags": { "requires_human_review": true/false, "reason": "..." }
}
```

These fields map directly to eval dimensions, feeding the decay detection dashboard and providing evidence for Value Realization Reviews — closing the loop with minimal manual data collection.

## The eval suite as the bridge

The eval suite is the load-bearing structure between Layers 2 and 3. It must be run:

- On every prompt change (before deployment).
- On every model update (before deployment).
- Weekly (as part of the decay dashboard).
- Before every Value Realization Review (as evidence).
- After every behavioral incident (to characterize the failure).

**Sprint-review gate:** do not demo new agent capabilities if eval pass rate has declined from the previous sprint without explanation.

**Value Realization Review question:** *is the relationship between eval pass rate and the primary value metric what we expected? If not, what does that tell us about our eval design?*

## AUDIT checks (integration-specific)

- [ ] Shared vocabulary document exists and is used across all artifacts.
- [ ] Traceability matrix links every governance decision → prompt clause → eval test.
- [ ] Value proposition appears verbatim in system prompt, BSD §1, and review agenda.
- [ ] Eval suite runs on the five required triggers above.
- [ ] Eval results are reviewed in sprint reviews and Value Realization Reviews.
- [ ] (If applicable) automated value reports feed the decay dashboard.
