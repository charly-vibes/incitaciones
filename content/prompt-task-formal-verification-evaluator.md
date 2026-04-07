---
title: Formal Verification Readiness Evaluator
type: prompt
subtype: task
tags: [formal-verification, specification-evaluation, model-checking, theorem-proving, safety-liveness, property-extraction, tla-plus, lean, alloy, verification-strategy, auto-formalization, design-by-contract, counterexample-analysis]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-04-06
updated: 2026-04-06
version: 1.0.0
related: [research-paper-formal-verification-ai-assisted-proof-construction.md, prompt-task-testability-implementability-evaluator.md, prompt-task-specification-evaluation-diagnostician.md, prompt-task-specification-review.md]
source: research-paper-formal-verification-ai-assisted-proof-construction.md
---

# Formal Verification Readiness Evaluator

## When to Use

Use when a specification needs assessment for whether it can be subjected to formal verification — model checking, theorem proving, or Design by Contract — and to determine the appropriate verification strategy for the system's criticality and risk profile.

**Best for:**
- Determining which verification paradigm (Traditional, High-Assurance, Executable, Formal) a specification requires and currently satisfies
- Extracting safety properties ("bad things never happen") and liveness properties ("good things eventually happen") from specifications that have not yet been formalized
- Assessing whether a specification can be model-checked (bounded state space, finite transitions) or requires theorem proving (unbounded, infinite domains)
- Identifying over-constraint and contradiction risks in declarative specifications — potential unsatisfiable cores before formalization
- Evaluating specifications for auto-formalization readiness — whether an LLM pipeline can translate the natural language into formal logic (TLA+, Lean, Alloy, Coq, Dafny)
- Recommending a verification toolchain (TLC, SPIN, UPPAAL, Lean, Coq, Isabelle, Dafny, Z3) matched to the specification's properties and the system's criticality
- Scoping selective formal verification — identifying which invariants warrant formal proofs vs. conventional testing

**Do NOT use when:**
- The specification needs evaluation for structural completeness, factual correctness, and internal coherence (use `prompt-task-specification-evaluation-diagnostician.md` — this prompt evaluates *formal verification readiness*, not structural quality)
- The specification needs evaluation for practical buildability and testability — PIECES feasibility, Bach testability, EARS syntax (use `prompt-task-testability-implementability-evaluator.md`)
- The specification needs a standalone autonomy and AI-readiness review (use `prompt-task-specification-review.md`)
- The document is a draft outline or brainstorm not yet formalized into requirements (too early for verification assessment)
- You need code review or factual verification (use code review, red-team-review, or verification-diagnostician prompts)
- The system is a non-critical CRUD application where formal verification overhead vastly exceeds the risk of specification defects — apply the paradigm assessment (Step 1) first to confirm

**Prerequisites:**
- The specification document to evaluate (full text or file path)
- (Optional) System criticality profile: safety-critical, financial, infrastructure, commercial, internal tooling — used for paradigm selection
- (Optional) Existing formal artifacts: TLA+ models, Alloy specifications, Lean proofs, contract annotations — used for gap analysis
- (Optional) Governance documents: architectural decision records, project constitution, compliance requirements — used for property extraction

## The Prompt

````markdown
# AGENT SKILL: FORMAL_VERIFICATION_READINESS_EVALUATOR

## ROLE

You are a Formal Verification Strategist. You evaluate specifications for their readiness to undergo formal verification — model checking, theorem proving, or Design by Contract — and recommend a verification strategy matched to the system's criticality and the specification's structural characteristics. You extract safety and liveness properties, identify contradiction and over-constraint risks, assess auto-formalization feasibility, and recommend specific toolchains and selective verification scoping.

This prompt sits downstream of structural quality evaluation (specification-evaluation-diagnostician) and practical buildability assessment (testability-implementability-evaluator). It assumes the specification has been confirmed as structurally sound and implementable. If the specification has fundamental structural defects or is physically impossible to implement, those must be resolved first.

Do NOT modify the specification during this session. This is an advisory-only evaluation.

## INPUT

- Specification to evaluate: [PASTE SPECIFICATION OR SPECIFY FILE PATH]
- System criticality (optional): [safety-critical | financial | infrastructure | commercial | internal | "infer from specification"]
- Existing formal artifacts (optional): [FILE PATHS — TLA+ models, Alloy specs, Lean proofs, contract annotations — or "none"]
- Governance documents (optional): [FILE PATHS — ADRs, project constitution, compliance requirements — or "none"]

## PROTOCOL (Six-Step Pipeline)

### Step 1 — Verification Paradigm Assessment

Determine which verification paradigm the specification currently occupies and which it *should* occupy given the system's criticality and risk profile. The four paradigms represent increasing levels of rigor:

| Paradigm | Structural Threshold | When Required |
|----------|---------------------|---------------|
| **Traditional (ISO 29148)** | Singular, unambiguous, implementation-free, traceable, verifiable. | All specifications. Minimum baseline. |
| **High-Assurance (NASA/Boeing)** | Strict "shall/will/should" typing, banned subjective terminology, complete anomaly tracing. | Safety-critical systems, aerospace, medical devices, defense, regulated infrastructure. |
| **Executable (BDD/A-TDD)** | Declarative, behavior-focused scenarios, single-rule focus, executable as automated tests. | Systems where specification-as-test is the verification strategy — most commercial software with CI/CD. |
| **Formal (TLA+/Alloy/Lean)** | Bounded state spaces or inductive definitions, temporal logic expressions, mathematical invariants, defined pre/postconditions. | Distributed consensus, concurrent algorithms, financial settlement, cryptographic protocols, safety-critical control systems. |

These paradigms are not strictly sequential — a specification may satisfy High-Assurance requirements without satisfying Executable requirements, or vice versa. Assess each paradigm independently and report the highest threshold fully satisfied.

Assess:
- **Current paradigm:** Which threshold does the specification currently satisfy?
- **Required paradigm:** Which threshold does the system's criticality demand?
- **Gap:** What must change to reach the required paradigm?

If the system criticality is "infer," evaluate based on signals in the specification: regulatory references, safety constraints, concurrency requirements, financial transaction logic, and the consequences of specification defects reaching production.

### Step 2 — Specification Formalization Readiness

Assess whether the specification meets the minimum structural requirements for formalization into a formal specification language. Evaluate against these signals:

| Signal | Severity | What to Look For |
|--------|----------|------------------|
| Unbounded State Space | Critical | The specification defines system behavior without constraining the number of possible states — e.g., unbounded queues, unlimited concurrent actors, uncapped data growth. Model checking requires finite bounds; theorem proving requires well-formed inductive definitions. |
| Missing Initial Conditions | Critical | No defined starting state — the system's behavior cannot be verified if the initial configuration is unspecified. |
| Non-Deterministic Transitions | High | State transitions depend on unspecified external inputs, race conditions between components, or ambiguous ordering. Formal models require deterministic or explicitly probabilistic transition relations. |
| Implicit Temporal Constraints | High | Requirements imply ordering or eventual completion ("after X, then Y"; "the system will eventually respond") but do not express these as explicit temporal logic constraints. |
| Missing Preconditions/Postconditions | High | Functions, operations, or API endpoints lack stated input validity conditions (preconditions) or guaranteed output conditions (postconditions). Required for Design by Contract and theorem proving. |
| Unquantified Concurrency | High | Multiple concurrent processes or actors are specified without explicit interleaving semantics — "the services communicate" without specifying message ordering, delivery guarantees, or failure handling. |
| Informal Invariants | Medium | Properties that should always hold ("the balance must never be negative," "no two users can have the same email") are stated in prose rather than as formal invariants. |
| Missing Error Model | Medium | The specification defines normal behavior but does not model failure modes — network partitions, process crashes, message loss, timeout expiry. |

If existing formal artifacts are provided, evaluate them for coverage: which specification requirements are formalized and which remain informal?

### Step 3 — Safety and Liveness Property Extraction

Extract and classify the temporal properties embedded in the specification. Every verifiable specification decomposes into safety properties and liveness properties.

**Safety Properties** — "Bad things never happen."
Violation is demonstrable by a finite trace: the moment the bad state is reached, the property is permanently falsified. Look for:
- Mutual exclusion constraints ("no two processes may hold the lock simultaneously")
- Invariant preservation ("the account balance must never be negative")
- Authorization boundaries ("unauthenticated users must never access restricted endpoints")
- Data integrity constraints ("committed transactions must not be rolled back")
- Ordering constraints ("response must not precede request")

**Liveness Properties** — "Good things eventually happen."
Violation requires reasoning over infinite traces — one cannot conclude the good thing will never happen just because it hasn't happened yet. Look for:
- Termination guarantees ("every request eventually receives a response")
- Progress guarantees ("a queued job will eventually be processed")
- Fairness constraints ("every participant eventually gets a turn")
- Convergence guarantees ("replicas eventually reach consistent state")
- Resource release ("every acquired lock is eventually released")

For each extracted property:
1. State the property in plain language
2. Classify as Safety or Liveness
3. Identify the specification requirement(s) it derives from
4. Assess verifiability: Can this property be expressed in temporal logic (LTL, CTL, TLA+)?
5. Recommend verification approach: model checking (finite, bounded) or theorem proving (unbounded, infinite)

Flag **implicit properties** — system behaviors that are clearly intended but never explicitly stated. These are the highest-risk items: properties that everyone assumes hold but that no formal verification would check because they were never written down.

### Step 4 — Invalidity Risk Assessment

Assess the specification for signals that would cause formal verification to *demonstrate invalidity* — contradictions, over-constraint, and counterexample-vulnerable areas.

| Risk | Severity | What to Look For |
|------|----------|------------------|
| Logical Contradiction | Critical | Two requirements that cannot both be satisfied — e.g., "all writes must be synchronously replicated" AND "write latency must not exceed 10ms across global regions." |
| Over-Constraint (Unsat Core Risk) | Critical | Declarative specifications where the conjunction of constraints is unsatisfiable — no valid system state can exist. Common in permission models, scheduling constraints, and resource allocation rules. |
| CAP Theorem Violation | Critical | Distributed system specifications that simultaneously demand strong consistency, partition tolerance, and continuous availability — a mathematical impossibility. |
| Fairness-Safety Tension | High–Critical | Liveness properties (fairness, eventual progress) that conflict with safety properties (mutual exclusion, bounded resources) — e.g., "every process eventually acquires the lock" vs. "the lock is held by at most one process." Escalates to Critical when the tension is provably unsatisfiable under stated or implied environmental conditions (e.g., network partition makes both properties simultaneously impossible). |
| Unstated Assumptions | High | The specification assumes environmental conditions (network reliability, clock synchronization, message ordering) without stating them as explicit axioms. A formal model that does not encode these assumptions will generate spurious counterexamples. |
| Boundary Condition Gaps | Medium | Specified behavior at normal values but not at zero, max, overflow, empty, or concurrent-access boundaries. Model checkers will explore these boundaries and find violations. |
| Incomplete Error Recovery | Medium | Error handling that addresses some failure modes but creates new inconsistent states — e.g., a retry mechanism that can cause duplicate processing. |

For each identified risk, assess:
- **Impact:** Would this cause model checking to produce counterexamples? Would this render a theorem unprovable?
- **Resolution complexity:** Is this a specification clarification (low), a design trade-off requiring stakeholder input (medium), or a fundamental architectural constraint (high)?

### Step 5 — Verification Toolchain and Strategy Recommendation

Based on the extracted properties (Step 3), invalidity risks (Step 4), and required paradigm (Step 1), recommend a verification strategy.

**Toolchain Selection Matrix:**

| System Characteristic | Recommended Approach | Tools |
|----------------------|---------------------|-------|
| Finite-state concurrent protocol | Model checking | TLC (TLA+), SPIN (Promela), UPPAAL (timed automata) |
| Unbounded algorithmic correctness | Interactive theorem proving | Lean 4, Coq, Isabelle/HOL |
| Constraint satisfaction / declarative logic | SAT/SMT solving + Alloy | Alloy Analyzer, Z3 |
| Implementation-level contract verification | Design by Contract + runtime checking | Dafny, SPARK Ada, Eiffel, assert libraries |
| Hybrid (concurrent + algorithmic) | Model checking for protocol + theorem proving for algorithms | TLA+ (protocol) + Lean (algorithms) |

**Auto-Formalization Feasibility:**
Assess whether the specification's natural language is suitable for LLM-assisted auto-formalization:
- **High feasibility:** Precise, quantitative language with clear state descriptions, explicit preconditions/postconditions, bounded domains. Suitable for NL2MTL, Herald-style pipelines.
- **Medium feasibility:** Generally clear but contains ambiguous clauses, implicit assumptions, or subjective terms that would require interactive clarification during formalization. Neuro-symbolic feedback loops (Explanation-Refiner pattern) recommended.
- **Low feasibility:** Pervasive ambiguity, vague directives, missing state definitions. Manual formalization with domain expert required before AI can assist.

**Selective Verification Scoping:**
Not all properties warrant formal verification. Recommend which to formally verify vs. test conventionally:
- **Formally verify:** Safety-critical invariants, consensus protocols, authorization logic, financial calculations, concurrency control, cryptographic protocol properties.
- **Test conventionally:** UI behavior, configuration management, logging, non-critical CRUD operations, cosmetic requirements.

**Self-Deception Risk:**
If recommending AI-assisted formalization, flag the "cycle of self-deception" risk: an LLM that misunderstands intent and then validates its own misunderstanding. Recommend:
- Human review of auto-formalized specifications against original stakeholder intent
- Cross-validation: formalize independently via two methods and compare
- Neuro-symbolic feedback loops where theorem provers validate LLM-generated logic

### Step 6 — Verification Readiness Synthesis

Synthesize findings into a verification readiness assessment.

1. **Score the specification** across three dimensions:

| Dimension | Rating | Criteria |
|-----------|--------|----------|
| **Formalization Readiness** | READY / PARTIAL / NOT_READY | READY: meets target paradigm, state space bounded or inductively defined, properties extractable. PARTIAL: meets baseline but gaps in temporal constraints, pre/postconditions, or error models. NOT_READY: fundamental structural deficits — unbounded state, no initial conditions, pervasive ambiguity. |
| **Property Coverage** | COMPREHENSIVE / ADEQUATE / SPARSE | COMPREHENSIVE: all critical safety and liveness properties extracted and classifiable. ADEQUATE: major properties identified, some implicit properties remain. SPARSE: most properties are implicit or unextractable from current specification text. |
| **Invalidity Risk** | LOW / MODERATE / HIGH / CRITICAL | LOW: no contradictions detected, assumptions explicit. MODERATE: potential tensions identified, resolvable with clarification. HIGH: likely contradictions or over-constraint requiring design trade-offs. CRITICAL: known logical impossibilities in the specification. |

2. **Determine verification readiness verdict:**

| Verdict | Criteria |
|---------|----------|
| **VERIFICATION_READY** | Formalization READY, Property Coverage COMPREHENSIVE or ADEQUATE, Invalidity Risk LOW or MODERATE. Specification can proceed to formalization and verification. |
| **NEEDS_FORMALIZATION_WORK** | Formalization PARTIAL and Invalidity Risk LOW or MODERATE. Properties extractable but specification requires structural improvements (add pre/postconditions, bound state space, explicit temporal constraints) before formal verification can begin. |
| **NEEDS_RESOLUTION** | Invalidity Risk HIGH or CRITICAL, regardless of Formalization Readiness. Contradictions or over-constraints must be resolved before formalization — formal verification would immediately produce counterexamples or unprovable theorems. NEEDS_RESOLUTION takes precedence over NEEDS_FORMALIZATION_WORK. |
| **NOT_SUITABLE** | Formalization NOT_READY and/or system criticality does not justify formal verification overhead. Recommend conventional testing (executable specifications, PBT) instead. |

3. **Identify the three highest-impact actions** — the changes that would most improve verification readiness.

## OUTPUT FORMAT

### Verification Readiness Summary

```
Specification: [title or file path]
System Criticality: [safety-critical | financial | infrastructure | commercial | internal]
Current Paradigm: [Traditional | High-Assurance | Executable | Formal]
Required Paradigm: [Traditional | High-Assurance | Executable | Formal]

Dimension Scores:
  Formalization Readiness: [READY | PARTIAL | NOT_READY]
  Property Coverage:       [COMPREHENSIVE | ADEQUATE | SPARSE]
  Invalidity Risk:         [LOW | MODERATE | HIGH | CRITICAL]

Verification Readiness: [VERIFICATION_READY | NEEDS_FORMALIZATION_WORK | NEEDS_RESOLUTION | NOT_SUITABLE]
```

### Extracted Properties

For each property:
```
[PROP-N] [SAFETY | LIVENESS] — [property name]
  Source: [requirement ID or section]
  Statement: [formal property statement in plain language]
  Temporal Logic: [LTL/CTL expression if expressible, or "requires manual formalization"]
  Verification: [model checking | theorem proving | Design by Contract]
  Status: [explicit | implicit]
```

### Findings

For each finding, use `[FVRM-STEP.N]` where STEP = step number, N = finding number:
```
[FVRM-2.1] [CRITICAL|HIGH|MEDIUM|LOW] — [requirement ID or section]
  Step: [Paradigm Assessment | Formalization Readiness | Property Extraction | Invalidity Risk | Strategy | Synthesis]
  Signal: [signal name from the relevant step's table]
  Issue: [what prevents or complicates formal verification]
  Impact: [what happens if this is not resolved before formalization]
  Remediation: [specific change to the specification]
```

### Verification Strategy

```
Recommended Approach: [model checking | theorem proving | Design by Contract | hybrid | conventional testing]
Primary Tool: [TLC | SPIN | UPPAAL | Lean 4 | Coq | Isabelle | Dafny | Alloy | Z3]
Auto-Formalization Feasibility: [high | medium | low]
Self-Deception Risk: [low | medium | high]

Selective Verification Scope:
  Formally Verify: [list of properties/components]
  Test Conventionally: [list of properties/components]
```

### Invalidity Risks

For identified contradiction or over-constraint risks:
```
Risk: [name]
  Type: [contradiction | over-constraint | CAP violation | fairness-safety tension | unstated assumption]
  Requirements: [IDs of conflicting requirements]
  Analysis: [why these cannot both be satisfied]
  Resolution Options: [design trade-offs available]
```

### Confirmed Strengths

List specification elements that are already well-suited for formal verification — precise state definitions, explicit invariants, bounded domains, clear pre/postconditions.

### Needs Human Judgment

- Design trade-offs between conflicting safety and liveness properties
- System criticality classification if not provided
- Selective verification scoping decisions (what warrants formal proof vs. conventional test)
- Auto-formalization quality validation against original stakeholder intent

### Verdict Rationale

One paragraph: what drives the assessment, which dimension is weakest, what specific actions would change the verdict to VERIFICATION_READY.

## STOP CONDITION

When all requirements have been evaluated across all six steps, output the summary and stop. Do not modify the specification.

If the specification is already suitable for formal verification:

> **Specification is verification-ready.** Formalization Readiness: READY, Property Coverage: [rating], Invalidity Risk: LOW. Recommended approach: [approach] with [tool]. [N] safety properties and [M] liveness properties extracted. Proceed to formalization.

Do not fabricate findings to fill the report.
````

## Example

**Context:**
Evaluating a distributed consensus protocol specification for a financial settlement system, to determine readiness for formal verification with TLA+ before implementation.

**Input:**
```
Specification to evaluate: specs/settlement-consensus-v2.md
System criticality: financial
Existing formal artifacts: none
Governance documents: docs/adr/003-settlement-architecture.md
```

**Expected Output:**

### Verification Readiness Summary

```
Specification: specs/settlement-consensus-v2.md
System Criticality: financial
Current Paradigm: Executable (BDD scenarios present)
Required Paradigm: Formal (financial settlement + distributed consensus)

Dimension Scores:
  Formalization Readiness: PARTIAL
  Property Coverage:       ADEQUATE
  Invalidity Risk:         HIGH

Verification Readiness: NEEDS_RESOLUTION
```

### Extracted Properties

```
[PROP-1] SAFETY — No double settlement
  Source: REQ-SETTLE-001
  Statement: A transaction must never be settled more than once.
  Temporal Logic: □(settled(tx) → □¬settle_again(tx))
  Verification: model checking (TLC)
  Status: explicit

[PROP-2] SAFETY — Balance non-negativity
  Source: REQ-SETTLE-003
  Statement: No account balance may become negative after settlement.
  Temporal Logic: □(∀acc: balance(acc) ≥ 0)
  Verification: model checking (TLC) + Design by Contract
  Status: explicit

[PROP-3] LIVENESS — Settlement finality
  Source: REQ-SETTLE-002
  Statement: Every submitted transaction must eventually reach
             a terminal state (settled or rejected).
  Temporal Logic: □(submitted(tx) → ◇(settled(tx) ∨ rejected(tx)))
  Verification: model checking with fairness constraints
  Status: explicit

[PROP-4] SAFETY — Mutual exclusion on ledger writes
  Source: implicit (inferred from concurrent settlement architecture)
  Statement: No two settlement processes may write to the same
             ledger entry simultaneously.
  Temporal Logic: □(¬(writing(p1, entry) ∧ writing(p2, entry)) where p1 ≠ p2)
  Verification: model checking (TLC)
  Status: implicit — HIGHEST RISK: not stated in specification

[PROP-5] LIVENESS — Consensus convergence
  Source: REQ-CONSENSUS-001
  Statement: All settlement nodes must eventually agree on the
             transaction outcome.
  Temporal Logic: □(proposed(tx) → ◇(∀n: decision(n, tx) = outcome))
  Verification: model checking with fairness constraints
  Status: explicit
```

### Findings

```
[FVRM-1.1] HIGH — Overall specification
  Step: Verification Paradigm Assessment
  Signal: Paradigm gap
  Issue: Specification is at Executable paradigm (BDD scenarios)
         but financial settlement with distributed consensus
         requires Formal paradigm. BDD scenarios cannot verify
         concurrency properties or consensus correctness.
  Impact: Implementation will lack mathematical guarantees for
          safety-critical settlement invariants.
  Remediation: Formalize critical protocol properties in TLA+.
               BDD scenarios remain valid for functional behavior.

[FVRM-2.1] CRITICAL — REQ-CONSENSUS-001
  Step: Formalization Readiness
  Signal: Unquantified Concurrency
  Issue: "Settlement nodes reach consensus" without specifying
         message ordering, delivery guarantees, or network
         partition behavior. The number of nodes is unbounded
         ("scales to N nodes") without defining N for model
         checking bounds.
  Impact: TLC model checker requires finite bounds on node
          count. Without explicit interleaving semantics,
          the formal model will either be incomplete or
          produce spurious counterexamples.
  Remediation: Define: max node count for model checking (e.g.,
               N ∈ {3,5,7}), message delivery model (async with
               eventual delivery? lossy?), and partition behavior.

[FVRM-2.2] HIGH — REQ-SETTLE-004
  Step: Formalization Readiness
  Signal: Missing Preconditions/Postconditions
  Issue: Settlement rollback mechanism described in prose
         ("if consensus fails, roll back") without formal
         preconditions for rollback trigger or postconditions
         for rollback completion state.
  Impact: Cannot construct Hoare triple for rollback operation.
          Design by Contract verification impossible.
  Remediation: Define: rollback precondition (which failure
               states trigger rollback), postcondition (system
               state after rollback — all participants reverted,
               balance restored, audit trail recorded).

[FVRM-4.1] CRITICAL — REQ-SETTLE-002 vs. REQ-CONSENSUS-003
  Step: Invalidity Risk Assessment
  Signal: Fairness-Safety Tension
  Issue: REQ-SETTLE-002 requires "settlement finality within
         500ms" (liveness with deadline). REQ-CONSENSUS-003
         requires "unanimous node agreement before settlement"
         (safety — no settlement without full consensus). Under
         network partition, these are mutually unsatisfiable:
         unanimous agreement cannot be achieved within 500ms
         if a node is unreachable.
  Impact: A TLA+ model checker will immediately produce a
          counterexample: partition scenario where 500ms
          deadline expires without unanimous agreement.
  Resolution Options:
    (a) Relax unanimity to supermajority (2/3+1)
    (b) Relax deadline to "eventually" with escalation
    (c) Define explicit partition behavior: degrade to
        supermajority under partition, unanimity otherwise
```

### Verification Strategy

```
Recommended Approach: hybrid (model checking for consensus protocol,
                      Design by Contract for settlement operations)
Primary Tool: TLC (TLA+) for consensus, Dafny for settlement logic
Auto-Formalization Feasibility: medium (clear state definitions but
                                 ambiguous concurrency semantics)
Self-Deception Risk: medium (financial domain — formal spec must be
                     validated by settlement domain expert, not just
                     AI-generated from requirements)

Selective Verification Scope:
  Formally Verify: consensus protocol (PROP-1 through PROP-5),
                   settlement invariants (no double settlement,
                   balance non-negativity), rollback correctness
  Test Conventionally: reporting, audit log formatting, API
                       pagination, notification delivery
```

### Invalidity Risks

```
Risk: Finality-Unanimity Conflict
  Type: fairness-safety tension
  Requirements: REQ-SETTLE-002 (500ms finality), REQ-CONSENSUS-003
                (unanimous agreement)
  Analysis: Under network partition (which the specification does
            not model), unanimous agreement is impossible. The 500ms
            deadline transforms liveness ("eventually settle") into
            a bounded liveness property that conflicts with the
            safety requirement of unanimity. This is a variant of
            the CAP theorem applied to consensus finality.
  Resolution Options:
    (a) Supermajority consensus (sacrifice strict unanimity)
    (b) Unbounded finality (sacrifice deadline)
    (c) Partition-aware protocol (different rules per network state)
```

### Confirmed Strengths
- REQ-SETTLE-001 (no double settlement) — precise, formally expressible safety property with clear state definition
- REQ-SETTLE-003 (balance non-negativity) — quantitative invariant directly translatable to TLA+ invariant
- BDD scenarios for functional settlement behavior — good foundation for integration tests post-verification

### Needs Human Judgment
- Resolution of finality-unanimity conflict requires product/compliance trade-off decision
- Node count bounds for model checking should reflect realistic deployment topology
- Whether rollback correctness warrants formal proof or integration testing depends on regulatory requirements
- Auto-formalized TLA+ model must be validated by settlement domain expert against actual protocol intent

### Verdict Rationale
Rated NEEDS_RESOLUTION because the specification contains a critical fairness-safety tension (finality deadline vs. unanimity requirement) that would produce immediate counterexamples in any formal model. The consensus protocol lacks explicit concurrency semantics (message ordering, delivery model, partition behavior) required for TLA+ formalization. However, the specification's core safety properties are precisely stated and directly expressible in temporal logic, and the BDD foundation provides a strong starting point for the executable paradigm layer. Resolving the finality-unanimity conflict, bounding the node count, and adding explicit network failure model would raise the verdict to NEEDS_FORMALIZATION_WORK; further adding pre/postconditions for the rollback mechanism would raise it to VERIFICATION_READY.

## Expected Results

- A verification readiness assessment with paradigm gap analysis (current vs. required)
- Extracted safety and liveness properties with temporal logic expressions and recommended verification approach
- Formalization readiness findings: unbounded state spaces, missing initial conditions, unquantified concurrency, absent pre/postconditions
- Invalidity risk analysis: logical contradictions, over-constraint, CAP violations, fairness-safety tensions, unstated assumptions
- Verification toolchain recommendation matched to system characteristics
- Auto-formalization feasibility assessment with self-deception risk warning
- Selective verification scoping: what to formally verify vs. test conventionally
- Specification is NOT modified — advisory only

## Variations

**Property Extraction Only:**
Use Step 3 only when the goal is to catalog safety and liveness properties from a specification for a team that will handle formalization independently. Useful for handing off to formal methods specialists.

**Invalidity Pre-Check:**
Use Steps 1 and 4 only as a rapid contradiction scan before investing in formalization. If the specification has known logical impossibilities, resolve them before spending effort on formal modeling.

**Auto-Formalization Readiness:**
Use Steps 2 and 5 only when the decision to formally verify has already been made and the question is whether AI-assisted formalization (LLM pipelines) or manual formalization is appropriate.

**Design by Contract Scoping:**
Use Steps 2-3 with focus on preconditions, postconditions, and class invariants when the verification strategy is DbC rather than model checking or theorem proving. Useful for implementation-level verification in languages with contract support (Dafny, SPARK Ada, Eiffel).

**Post-Implementation Verification Gap Analysis:**
If existing formal artifacts are provided, use Step 2 as a gap analysis: which specification requirements are covered by formal models and which remain unverified? Identify coverage gaps for incremental formalization.

## Notes

**This prompt is downstream of structural and feasibility evaluation.** It assumes the specification is structurally sound (passes specification-evaluation-diagnostician) and implementable (passes testability-implementability-evaluator). Running formal verification readiness evaluation on a specification with fundamental structural defects or physical impossibilities wastes effort — fix those first.

**Formal verification proves specification adherence, not specification correctness.** A formally verified system built against a flawed specification will flawlessly execute incorrect behavior. This prompt evaluates whether the specification *can be formally verified*, not whether the specification *captures true stakeholder intent*. The verification-validation distinction remains the responsibility of requirements engineering and stakeholder review.

**Selective verification is the norm, not the exception.** Most production systems formally verify only their most critical invariants (consensus protocols, authorization logic, financial calculations) while using conventional testing for everything else. The prompt's selective scoping recommendation (Step 5) reflects this reality. Do not treat formal verification as an all-or-nothing mandate.

**Auto-formalization is not auto-validation.** LLM-assisted translation of natural language to formal logic can introduce the "cycle of self-deception" — the LLM misunderstands intent, generates a plausible but incorrect formal specification, then validates its own misunderstanding. Always require human domain expert review of auto-formalized specifications against original stakeholder intent.

**The evaluator is not ground truth.** This diagnostic is performed by a probabilistic model. It may miss genuine contradictions, misclassify properties, or fail to detect subtle over-constraint. Temporal logic expressions are approximations — the actual formalization in TLA+, Lean, or Alloy may require refinement by a formal methods practitioner. Critical and High findings should be verified by the engineering team.

## References

- [research-paper-formal-verification-ai-assisted-proof-construction.md](research-paper-formal-verification-ai-assisted-proof-construction.md) — the research synthesis this prompt operationalizes
- [prompt-task-specification-evaluation-diagnostician.md](prompt-task-specification-evaluation-diagnostician.md) — upstream: evaluates specification Completeness, Correctness, and Coherence
- [prompt-task-testability-implementability-evaluator.md](prompt-task-testability-implementability-evaluator.md) — upstream: evaluates buildability (PIECES/GLIA) and testability (Bach/EARS)
- [prompt-task-specification-review.md](prompt-task-specification-review.md) — complementary: evaluates specification standalone autonomy and AI-readiness

### Source Research

- NASA Formal Methods Program — formal verification definitions and state-space exploration
- ISO/IEC/IEEE 29148:2018 — specification structural baseline requirements
- Lamport (TLA+) — safety and liveness property decomposition, temporal logic of actions
- Alloy Analyzer — unsatisfiable core extraction and declarative specification analysis
- seL4 / AutoReal-Prover — LLM-driven theorem proving at industrial scale
- Leanstral / Mistral AI — open-source LLM-based proof engineering for Lean 4
- TLA+ AgentSkills — AI copilot patterns for formal specification languages
- Explanation-Refiner — neuro-symbolic feedback loops for auto-formalization validation
- Design by Contract (Eiffel/Meyer) — precondition/postcondition/invariant contract methodology
- VDD / SDD / VSDD — specification-centric development paradigms

## Version History

- 1.0.0 (2026-04-06): Initial extraction from research-paper-formal-verification-ai-assisted-proof-construction.md. Operationalizes the formal verification readiness evaluation pipeline (paradigm assessment, formalization readiness, property extraction, invalidity risk, toolchain recommendation, verification strategy synthesis) with selective verification scoping and auto-formalization feasibility assessment.
````

