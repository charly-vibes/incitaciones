---
name: diagnostician
description: "Advisory-only diagnostics, no code changes: modularity, rigidity, mutability, invalid states, composability, error handling, Julia performance, UX/DX evaluation, spec evaluation, testability, verification, root-cause analysis."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.9.0"
---
# Diagnostician Router

Advisory-only diagnostic evaluation of a codebase, product, or document. Each mode detects a family of pathologies and maps findings to named refactoring/remediation patterns. **Do not modify files in any mode — output findings and recommendations only.**

## Modes

| Question the user is asking | Mode | Read |
|---|---|---|
| Is it tangled? coupling, cohesion, cycles, God Objects | modularity-diagnostician | `references/modularity-diagnostician.md` |
| Is change resisted? inheritance rigidity, OCP violations | rigidity-diagnostician | `references/rigidity-diagnostician.md` |
| Is mutable state pathological? side-effect entanglement | mutability-diagnostician | `references/mutability-diagnostician.md` |
| Can invalid states be represented? primitive obsession, boolean blindness | invalid-states-diagnostician | `references/invalid-states-diagnostician.md` |
| Does it compose? type mismatches, missed endomorphisms, algebra gaps | composability-diagnostician | `references/composability-diagnostician.md` |
| How does it fail? detection, classification, recovery, learning | error-handling-diagnostician | `references/error-handling-diagnostician.md` |
| Why is Julia slow? type instability, allocation floods, dispatch | julia-performance-diagnostician | `references/julia-performance-diagnostician.md` |
| Is the product usable? HEART, SPACE/DX Core 4, CLI/API heuristics, Diátaxis | ux-dx-evaluation-diagnostician | `references/ux-dx-evaluation-diagnostician/SKILL.md` |
| Is the spec verifiable/buildable? | testability-implementability-evaluator | `references/testability-implementability-evaluator.md` |
| Is this document true? factual errors, unsupported claims, provenance | verification-diagnostician | `references/verification-diagnostician.md` |
| Is the specification complete/correct/coherent? (ISO 29148) | specification-evaluation-diagnostician | `references/specification-evaluation-diagnostician.md` |
| Why did this fail? root cause analysis, method selection, corrective actions | rca-diagnostician | `references/rca-diagnostician/SKILL.md` |

## Mode notes

- The diagnostician modes are **mutually exclusive by design** — each SKILL.md opens with a GUARD naming its neighbors. Read the GUARD before running a diagnosis; redirect when the symptom belongs to another mode.
- Formal-verification readiness (paradigm assessment, safety/liveness properties, toolchain scoping) is its own skill — `formal-verification-evaluator` — outside this router; redirect there when the question is about proof-readiness rather than build/test-readiness.
- Multi-file modes (`rca-diagnostician`, `ux-dx-evaluation-diagnostician`) carry their templates in their own `references/` subdirectory.

## Procedure

1. Pick the mode whose *question* matches (not merely whose keyword matches).
2. Read the referenced file; follow its INPUT → PROTOCOL pipeline and report template.
3. Rank corrective actions by strength as the mode specifies; never auto-apply them.
