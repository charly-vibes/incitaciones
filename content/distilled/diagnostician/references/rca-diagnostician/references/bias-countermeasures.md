## Cognitive Bias Countermeasures

RCA fails more often from cognitive and organizational barriers than from lack of method. Apply these checks explicitly during hypothesis generation and evaluation.

### Check 1: Confirmation Bias

Question: Did you actively seek disconfirming evidence for your leading hypothesis?

Red flags:
- All cited evidence supports one narrative
- Alternative hypotheses were listed but not seriously tested
- Disconfirming data was explained away rather than weighted
- The investigation stopped at the first plausible story

Test: Can you name specific evidence that would weaken your leading hypothesis? If you cannot, the investigation has early-closure risk.

### Check 2: Blame Displacement

Question: Are you attributing to individuals what the system predictably creates?

Red flags:
- Root cause is stated as "operator error," "didn't follow procedure," or "lack of training"
- No analysis of why the system allowed or encouraged the error
- Corrective actions are person-only (retraining, disciplinary action, reminders)
- The same error has occurred before with different individuals

Test: If you replaced this person with a competent peer, would the system still create conditions for the same failure? If YES, the system is the root cause, not the individual.

### Check 3: Correlation-Causation Overreach

Question: Are you promoting a statistical association to a causal claim without a mechanistic explanation?

Red flags:
- "X happened before Y, therefore X caused Y" (temporal precedence alone)
- Pattern found in data without explanation of how X produces Y
- Confounding variables not considered (something else changed simultaneously)
- AI/ML tool surfaced a correlation and it was adopted as a root cause

Test: Can you explain the mechanism by which X causes Y? Can you identify confounders that might explain the association? If not, label this as "candidate association, not confirmed cause."

### Check 4: Early Closure

Question: Did the investigation stop at an organizationally convenient explanation?

Red flags:
- Only one root cause identified for a complex failure
- Investigation ended after a single pass of "5 Whys" without cross-checking
- The root cause conveniently avoids implicating leadership decisions, resource allocation, or organizational culture
- Timeline reconstruction was skipped or abbreviated

Test: Ask "who benefits from this being the root cause?" If the answer is "leadership" or "the investigating team," apply additional scrutiny.

### Output

```text
## Bias Check

- Confirmation bias: [CLEAR | FLAG — describe concern]
- Blame displacement: [CLEAR | FLAG — describe concern]
- Correlation-causation: [CLEAR | FLAG — describe concern]
- Early closure: [CLEAR | FLAG — describe concern]

Countermeasure actions taken: [what you did to mitigate flagged biases]
```
