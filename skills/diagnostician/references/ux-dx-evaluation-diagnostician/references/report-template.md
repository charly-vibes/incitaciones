# UX/DX Evaluation Diagnostic Report Template

Use the following template for the final diagnostic report.

```markdown
# UX/DX Evaluation Report
## Target: [name]
## Scope: [layers evaluated]
## Date: [evaluation date]

## Layer Summary
| Layer | Framework | Status | Critical Findings |
|-------|-----------|--------|-------------------|
| Product | HEART | [HEALTHY|DEGRADED|CRITICAL] | [count] |
| Engineering | SPACE/DX Core 4 | ... | ... |
| Interface | CLI/API Heuristics | ... | ... |
| Ecosystem | CHAOSS | ... | ... |
| Documentation | Diataxis | ... | ... |

## Critical Findings (must-fix)
1. [Layer] [ID]: Description — Impact — Remediation

## High Findings (should-fix)
1. ...

## Cross-Layer Effects
[Cascading friction: e.g., doc gaps (L5) → CLI friction (L3) → dev dissatisfaction (L2)]

## Measurement Gaps
[What could not be evaluated; what data is needed]

## Verdict
Overall Health: [HEALTHY | DEGRADED | CRITICAL]
Highest-friction layer: [layer]
Start here: [which layer to fix first and why]
```
