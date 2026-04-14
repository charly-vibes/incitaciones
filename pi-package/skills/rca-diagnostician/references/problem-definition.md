## Problem Definition

Define the outcome precisely before investigating causes.

### Required Elements

1. **WHAT** — Specific observable outcome (not interpretation)
2. **WHERE** — System, component, location, scope
3. **WHEN** — First detection, duration, resolution
4. **SEVERITY** — Impact on users, safety, business, compliance
5. **OUT OF SCOPE** — What this investigation does not cover

### Counterfactual

State the expected/normal behavior and what changed relative to that baseline. This anchors the investigation — without a counterfactual, you cannot distinguish cause from background condition.

### Red Flags

- Problem statement contains solutions ("we need to add...")
- Describes a symptom without measurable specificity ("the system is slow")
- No severity assessment — all problems feel urgent without scoping
- Scope is unbounded — investigation will grow without limit

### Output

```text
## Problem Definition

Outcome: [precise statement]
Measurement: [how detected/measured]
Severity: [impact assessment]
Counterfactual: [expected vs. actual]
Scope boundary: [in scope / out of scope]
```
