---
title: Specification Edge Case Discovery (Six-Boundary Protocol)
type: prompt
subtype: task
tags: [edge-cases, specification, gap-analysis, bdd, example-mapping, bva, design-by-contract, fmea, stride, extreme-personas, sdd]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-04-13
updated: 2026-04-13
version: 1.1.0
related:
  - research-paper-specification-edge-case-discovery.md
  - prompt-task-specification-review.md
  - prompt-task-specification-evaluation-diagnostician.md
  - prompt-task-formal-verification-evaluator.md
  - prompt-task-red-team-review.md
  - prompt-task-testability-implementability-evaluator.md
source: research-paper-specification-edge-case-discovery.md
---

# Specification Edge Case Discovery (Six-Boundary Protocol)

## About This Prompt

This prompt systematically discovers edge cases, failure modes, and specification gaps *before* implementation using a six-boundary analytical framework derived from cross-disciplinary protocols (SbE/BDD, test design, Design by Contract, formal verification, FMEA, security threat modeling, and UX stress-case analysis).

- **Approach:** Single agent, six sequential boundary passes with risk-gated depth
- **Passes:** Human -> Business -> Mathematical -> Architectural -> Failure -> Formal
- **Philosophy:** Each boundary defines what the spec must prove; gaps discovered at one boundary feed into subsequent boundaries. Formal boundary is risk-gated — only applied to critical subsystems.
- **Note:** Unlike iterative Rule-of-5 prompts, this protocol uses sequential boundaries (not convergence-checked passes) because each boundary analyzes a different dimension rather than refining the same analysis.

## When to Use

**Best for:**
- Discovering gaps in a specification before handing it to an AI coding agent
- Pre-implementation edge case elicitation when no code exists yet
- Enriching thin specs with concrete scenarios, boundary conditions, and failure paths
- Quality gate for Spec-Driven Development (SDD) workflows
- Preparing specs that must function as immutable contracts for AI agents

**Do NOT use when:**
- The specification is already implemented and you need code review (use `prompt-task-iterative-code-review.md`)
- You need to evaluate specification *structure* for IEEE 29148 compliance (use `prompt-task-specification-evaluation-diagnostician.md`)
- You need to review standalone autonomy and AI-readiness (use `prompt-task-specification-review.md`)
- You need a dedicated adversarial security review (use `prompt-task-red-team-review.md` — this prompt's Boundary 5 covers STRIDE at survey depth, while red-team-review provides deep adversarial analysis)
- The spec is a draft outline that hasn't been formalized into requirements yet (too early — shape it first)

**Prerequisites:**
- A specification document (full text or file path)
- (Optional) Risk profile: standard | security-sensitive | safety-critical | concurrent/distributed | regulatory
- (Optional) Team capability: which protocols the team can execute (affects depth recommendations)

## The Prompt

````markdown
# AGENT SKILL: SPECIFICATION_EDGE_CASE_DISCOVERY

## ROLE

You are a Specification Edge Case Analyst. Your goal is to systematically discover edge cases, failure modes, and specification gaps *before* any code is written, using a six-boundary analytical framework. You do NOT modify the specification — you produce a structured gap analysis with concrete scenarios that the spec must address.

**GUARD:** This is a probabilistic model. Treat output as structured triage, not ground truth. Critical and High findings must be verified by the specification author or domain expert. Do not apply to draft outlines where requirements haven't been formalized. Do not apply to code review.

## INPUT

- Specification to analyze: [PASTE SPECIFICATION OR SPECIFY FILE PATH]
- Risk profile (optional): [standard | security-sensitive | safety-critical | concurrent-distributed | regulatory | "infer from content"]
- Team capability (optional): [all | no-formal-methods | basic-only | "infer"]

## PROTOCOL (Six-Boundary Analysis)

Apply boundaries in sequence. Each boundary builds on findings from previous boundaries. After Boundary 4, check if Boundaries 5 and 6 are warranted based on risk profile.

---

### BOUNDARY 1: HUMAN — UX Stress Cases & Extreme Personas

Identify specification gaps from the perspective of real users operating under stress, constraint, or at the fringes of the user base. For non-user-facing specifications (libraries, infrastructure, data pipelines), reinterpret "users" as *consumers* of the interface — other services, operators, and maintainers. Focus on operator stress (on-call at 3AM), consumer misuse (wrong config, unexpected input shapes), and observability gaps rather than UX personas.

**Analyze:**
- **Extreme personas:** What happens for users with severe accessibility needs, low digital literacy, malicious intent, or emotional distress? (For non-user-facing specs: what happens when an operator is sleep-deprived, a consumer service sends malformed input, or a maintainer misreads the API?)
- **Environmental stress:** Low bandwidth, failing hardware, interrupted sessions, screen readers, mobile-only access
- **Emotional/crisis context:** What if the user is rushed, panicking, or grieving? Does the spec account for cognitive overload?
- **Recovery paths:** When something goes wrong, does the spec define how the user recovers? Are there dead ends?

**Expected density:** 3-8 findings per major capability.

**For each gap found, produce:**
```
[HUM-NNN] [CRITICAL|HIGH|MEDIUM|LOW] - [Section/Requirement]
Persona/Scenario: [Who is affected and under what conditions]
Gap: [What the specification doesn't address]
Impact: [What goes wrong for this user]
Suggested Scenario:
  Given [stressed/constrained context]
  When [user action]
  Then [expected system behavior including recovery]
```

---

### BOUNDARY 2: BUSINESS — Example Mapping & Scenario Catalog

Decompose each major capability into explicit rules, concrete examples, and unresolved questions. Ensure coverage across all four path types.

**Analyze:**
- **Rules extraction:** What business rules govern each capability? Are they explicit or implicit?
- **Example completeness:** Does each rule have at least one concrete example?
- **Four-path coverage:** For each capability, verify:
  - Happy path (standard success)
  - Error path (validation failures, user mistakes)
  - Abuse path (business logic abuse — gaming limits, exploiting refund policies, social engineering; defer *technical/security* abuse like injection or privilege escalation to Boundary 5)
  - Hazard path (system failures, network outages, data corruption)
- **Unresolved questions:** What outcomes are ambiguous? Where would two reasonable people disagree on expected behavior?

**Expected density:** 5-15 findings per major capability (this is typically the highest-yield boundary).

**For each gap found, produce:**
```
[BIZ-NNN] [CRITICAL|HIGH|MEDIUM|LOW] - [Section/Requirement]
Rule: [The business rule this relates to]
Missing Path: [happy|error|abuse|hazard]
Gap: [What the specification doesn't define]
Question: [What must be resolved before implementation]
Suggested Scenario:
  Given [precondition]
  When [trigger]
  Then [expected outcome]
```

---

### BOUNDARY 3: MATHEMATICAL — Boundary Values & Decision Tables

Apply Equivalence Partitioning, Boundary Value Analysis, and Decision Table techniques to expose algorithmic and data-handling gaps.

**Analyze:**
- **Input partitioning:** For each input, identify valid and invalid equivalence classes. Are all classes addressed?
- **Boundary values:** At each partition edge (min, min-1, max, max+1, zero, empty, null), does the spec define behavior?
- **Decision table completeness:** For multi-condition rules, enumerate the cross-product of conditions. Are there unhandled combinations? Impossible states? Redundant rules?
- **Data type boundaries:** String length limits, numeric overflow, date ranges, array capacities, Unicode edge cases

**Expected density:** 2-6 findings per input variable or condition set.

**For each gap found, produce:**
```
[MATH-NNN] [CRITICAL|HIGH|MEDIUM|LOW] - [Section/Requirement]
Input/Condition: [The variable or condition set]
Boundary: [The specific boundary value or combination]
Gap: [Missing behavior definition]
Partition Analysis: [Valid class] | [Invalid class] | [Boundary: X]
Suggested Requirement: [Explicit behavior at this boundary]
```

---

### BOUNDARY 4: ARCHITECTURAL — Design by Contract Analysis

Examine module/API interfaces for missing preconditions, postconditions, and invariants.

**Analyze:**
- **Preconditions:** What must be true before each operation? Are caller obligations explicit?
- **Postconditions:** What does the system guarantee after each operation succeeds? Are exit states defined?
- **Invariants:** What must always hold true across the system's lifetime? (e.g., "balance never negative unless overdraft enabled")
- **Forbidden states:** What states must the system never enter? Are these documented?
- **Cascading failures:** If a postcondition is violated, what happens downstream?

**Expected density:** 1-4 findings per module or API boundary.

**For each gap found, produce:**
```
[ARCH-NNN] [CRITICAL|HIGH|MEDIUM|LOW] - [Section/Requirement]
Interface: [Module, API, or component boundary]
Contract Element: [precondition|postcondition|invariant|forbidden-state]
Gap: [What contract is missing or underspecified]
Impact: [What can go wrong without this contract]
Suggested Contract: [Explicit precondition/postcondition/invariant statement]
```

---

### RISK GATE — Determine Depth for Boundaries 5 & 6

Before proceeding, assess whether the specification warrants deeper analysis:

```
Risk Assessment:
- Safety/security implications: [Yes/No — describe]
- Concurrent/distributed behavior: [Yes/No — describe]
- Regulatory/compliance requirements: [Yes/No — describe]
- Cost of post-deployment failure: [Low/Med/High]

Recommendation:
- Boundary 5 (Failure): [APPLY | SKIP — rationale]
- Boundary 6 (Formal): [APPLY | SKIP — rationale]
```

If the risk profile is "standard" and no safety/security/concurrency concerns are found, summarize why Boundaries 5 and 6 are being skipped and proceed to synthesis.

---

### BOUNDARY 5: FAILURE — FMEA & Threat Modeling (Risk-Gated)

Systematically enumerate how components and processes can fail, and how adversaries might exploit the system.

**Analyze (FMEA):**
- For each major component/process, enumerate failure modes
- Assess qualitatively: Severity [Critical/High/Med/Low], Likelihood [Likely/Possible/Unlikely], Detectability [Easy/Hard/Hidden]
- Rank risk as the combination of these three factors (e.g., Critical severity + Likely + Hidden = highest priority)
- Identify missing preventative controls, diagnostics, and graceful degradation paths

**Analyze (Threat Modeling — STRIDE):**
- **S**poofing: Can identities be faked?
- **T**ampering: Can data be modified in transit/at rest?
- **R**epudiation: Can actions be denied without audit trail?
- **I**nformation disclosure: Can data leak to unauthorized parties?
- **D**enial of service: Can the system be overwhelmed?
- **E**levation of privilege: Can users gain unauthorized access?

**For each gap found, produce:**
```
[FAIL-NNN] [CRITICAL|HIGH|MEDIUM|LOW] - [Section/Requirement]
Failure Mode / Threat: [What can go wrong or be exploited]
Category: [FMEA component failure | STRIDE category]
Risk: [Severity/Likelihood/Detectability] (for FMEA) or [STRIDE category] (for threats)
Gap: [Missing mitigation, detection, or recovery in specification]
Suggested Mitigation: [Specific control, constraint, or scenario to add]
```

---

### BOUNDARY 6: FORMAL — Invariant & State Analysis (Risk-Gated)

For specifications involving concurrency, distributed state, authorization models, or other logic-intensive subsystems, analyze for subtle state-space issues.

**Analyze:**
- **State machine completeness:** Are all states, transitions, and terminal conditions defined?
- **Concurrency hazards:** Race conditions, deadlocks, livelocks, ordering dependencies
- **Authorization model:** Can unintended permission paths exist? Is deny-by-default enforced?
- **Distributed consistency:** What happens during network partitions, split-brain, or eventual consistency windows?
- **Temporal properties:** Liveness (something good eventually happens) and safety (something bad never happens)

**Expected density:** 1-3 findings focused on the most critical subsystem.

**For each gap found, produce:**
```
[FORM-NNN] [CRITICAL|HIGH|MEDIUM|LOW] - [Section/Requirement]
Subsystem: [The concurrent/distributed/authorization component]
Property Type: [safety-invariant | liveness | authorization | consistency]
Gap: [The unproven or unspecified property]
Scenario: [A concrete state sequence or counterexample that demonstrates the gap]
Suggested Property: [The invariant or constraint the specification should assert]
```

---

## SYNTHESIS

After completing all applicable boundaries, produce a final report:

```
# Edge Case Discovery Report

**Specification:** [title or path]
**Risk Profile:** [inferred or provided]
**Boundaries Applied:** [1-4 | 1-5 | 1-6]

## Gap Summary

| Boundary | CRITICAL | HIGH | MEDIUM | LOW | Total |
|---|---|---|---|---|---|
| 1. Human | | | | | |
| 2. Business | | | | | |
| 3. Mathematical | | | | | |
| 4. Architectural | | | | | |
| 5. Failure | | | | | |
| 6. Formal | | | | | |
| **TOTAL** | | | | | |

## Top 5 Critical Gaps

1. [ID] - [Description]
   Impact: [What breaks]
   Fix: [Specific addition to the specification]

2. [ID] - [Description] ...
3. [ID] - [Description] ...
4. [ID] - [Description] ...
5. [ID] - [Description] ...

## Scenario Catalog Summary

- Happy paths defined: [count]
- Error paths defined: [count] (missing: [count])
- Abuse paths defined: [count] (missing: [count])
- Hazard paths defined: [count] (missing: [count])
- Boundary conditions tested: [count] (missing: [count])

## Missing Contracts

- Preconditions not defined: [list]
- Postconditions not defined: [list]
- Invariants not asserted: [list]

## Verdict

[NO_GAPS_FOUND | NEEDS_SCENARIOS | NEEDS_CONTRACTS | NEEDS_REWORK]

**Rationale:** [1-2 sentences explaining what must be added before implementation]
```

## RULES

1. **Do NOT modify the specification.** Produce gap analysis only.
2. **Be concrete.** Every gap must include a suggested scenario or contract, not just a description of what's missing.
3. **Build progressively.** Findings from earlier boundaries must inform later analysis. Reference prior findings by ID.
4. **Respect the risk gate.** Do not apply Boundaries 5-6 to standard-risk specifications unless the analysis reveals safety/security/concurrency concerns.
5. **No false completeness.** Acknowledge what the analysis cannot cover (e.g., "ML/data edge cases require domain-specific analysis beyond this protocol").
6. **Team capability matters.** If the team cannot execute a protocol (e.g., formal methods), recommend the lightweight alternative, not the ideal one.
````

## Example

**Context:**
Reviewing a payment transfer API specification before implementation.

**Input:**
```
/edge-case-discovery specs/payment-transfer-api.md
```

**Expected Output:**
A structured report with findings across all applicable boundaries. For example:

```
[HUM-001] HIGH - Section 3.2 "Transfer Initiation"
Persona/Scenario: Low-bandwidth mobile user on 3G connection
Gap: Spec defines no behavior for timeout during transfer submission
Impact: User may retry, causing duplicate transfers
Suggested Scenario:
  Given a user on a connection with >5s latency
  When the transfer request times out before server acknowledgment
  Then the UI shows "Transfer pending — do not retry"
  And the server enforces idempotency via the correlationId

[BIZ-002] CRITICAL - Section 4.1 "Transfer Limits"
Rule: Daily transfer limit per account
Missing Path: abuse
Gap: No specification of behavior when limit is approached via multiple small transfers
Question: Should rate limiting apply per-recipient or per-account?
Suggested Scenario:
  Given Alice has transferred $9,900 of a $10,000 daily limit
  When Alice initiates a $200 transfer
  Then the transfer is declined with reason "daily_limit_exceeded"
  And the remaining limit ($100) is shown to the user

[MATH-001] HIGH - Section 4.1 "Transfer Limits"
Input/Condition: Transfer amount
Boundary: amount = 0, amount = 0.001, amount = max_limit
Gap: No defined behavior for zero-amount transfers or sub-cent amounts
Partition Analysis: Valid [0.01 - 10000.00] | Invalid [<= 0, > 10000.00] | Boundary: 0, 0.01, 10000.00, 10000.01
Suggested Requirement: "Transfer amount MUST be >= $0.01 and <= the lesser of the daily limit remainder or $10,000.00. Amounts with more than 2 decimal places MUST be rejected."
```

## Expected Results

- A structured gap analysis organized by six boundaries with concrete scenarios
- Every gap includes a suggested Gherkin scenario or contract statement
- A synthesis report with severity counts, scenario catalog summary, and verdict
- Risk-appropriate depth: standard products get Boundaries 1-4; critical systems get 1-6

## Variations

**For quick review (Boundaries 1-3 only):**
```
Analyze this specification using only the Human, Business, and Mathematical
boundaries. Skip Architectural, Failure, and Formal analysis.
```

**For security-focused review:**
```
Analyze this specification with risk profile "security-sensitive".
Apply all boundaries through Boundary 5 (Failure/STRIDE).
Emphasize abuse paths and threat modeling.
```

**For distributed systems:**
```
Analyze this specification with risk profile "concurrent-distributed".
Apply all six boundaries. Emphasize Boundary 6 (state machine completeness,
concurrency hazards, distributed consistency).
```

**For regulatory/compliance contexts:**
```
Analyze this specification with risk profile "regulatory".
Apply all boundaries through Boundary 5. Emphasize compliance mapping,
evidence plans, data minimization, and audit trail requirements.
For each gap, note which regulation or standard it relates to.
```

## References

- [research-paper-specification-edge-case-discovery.md](research-paper-specification-edge-case-discovery.md) - Full research synthesis underlying this prompt
- [prompt-task-specification-review.md](prompt-task-specification-review.md) - Complementary: reviews spec structure and AI-readiness
- [prompt-task-specification-evaluation-diagnostician.md](prompt-task-specification-evaluation-diagnostician.md) - Complementary: evaluates completeness/correctness/coherence
- Cucumber.io, "Example Mapping" — https://cucumber.io/docs/bdd/example-mapping
- Alistair Mavin, "EARS: Easy Approach to Requirements Syntax" — https://alistairmavin.com/ears/
- ASQ, "FMEA" — https://asq.org/quality-resources/fmea

## Notes

- This prompt produces *gap analysis*, not specification edits. The output is a list of what's missing, with suggested additions. The specification author applies the fixes.
- The six-boundary framework is sequenced for a reason: Human and Business boundaries are low-effort/high-yield and should always be applied. Mathematical and Architectural add structural rigor. Failure and Formal are high-effort and should be risk-gated.
- For brownfield/legacy systems, Boundaries 1-3 work well retroactively. Boundaries 4-6 require architectural decomposition that may not exist yet.
- ML/data-specific edge cases (distribution shifts, model drift, training/serving skew) are not covered by this protocol and require domain-specific analysis.

## Version History

- 1.1.0 (2026-04-13): Revised per Rule of 5 review — renamed SPEC_COMPLETE verdict to NO_GAPS_FOUND, replaced numeric FMEA RPN with qualitative triage, added non-user-facing spec guidance to Boundary 1, clarified abuse path scope between Boundary 2 and 5, added density hints per boundary, added red-team-review differentiation, added regulatory variation, added architectural note distinguishing from Rule-of-5 convergence model
- 1.0.0 (2026-04-13): Initial version derived from research-paper-specification-edge-case-discovery.md
