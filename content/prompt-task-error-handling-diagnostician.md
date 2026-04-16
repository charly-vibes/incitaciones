---
title: Error Handling Diagnostician
type: prompt
subtype: task
tags: [error-handling, resilience, reliability, incident-response, software-architecture, observability, human-factors, review]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-04-16
updated: 2026-04-16
version: 1.0.0
related:
  - research-paper-cross-disciplinary-error-handling.md
  - research-paper-cross-disciplinary-root-cause-analysis.md
  - prompt-task-specification-evaluation-diagnostician.md
  - prompt-task-testability-implementability-evaluator.md
  - prompt-system-context-guardian.md
source: research-paper-cross-disciplinary-error-handling.md
---

# Error Handling Diagnostician

## When to Use

Use when you need to diagnose whether a system, specification, plan, API, workflow, or incident response design handles failure well. This prompt evaluates error handling as an end-to-end control loop — detection, classification, communication, recovery, and learning — rather than as isolated try/catch logic.

**Best for:**
- Reviewing API error handling contracts, boundary translation, and leakage risks
- Auditing implementation plans or specifications for missing negative paths, degraded-mode behavior, or retry policy
- Evaluating whether code or architecture places error handling at the right boundaries
- Reviewing alerting, escalation, and operator-facing recovery guidance for noise, ambiguity, or missing actionability
- Assessing whether incident writeups and operational workflows close the learning loop after failures
- Cross-domain design review where software can borrow safely from aviation, healthcare, safety engineering, or cybersecurity incident response

**Do NOT use when:**
- You need a full root-cause investigation after an incident (use `prompt-task-rca-diagnostician.md`)
- You need to verify the factual accuracy of a research report or claim set (use `prompt-task-verification-diagnostician.md`)
- You need general specification quality review across completeness/correctness/coherence (use `prompt-task-specification-evaluation-diagnostician.md`)
- You only need code-level bug fixing or implementation changes rather than architectural diagnosis
- The artifact is an early brainstorm with no meaningful behavior, interfaces, or failure modes yet defined (use `prompt-task-plan-review.md` or `prompt-workflow-create-plan.md` first, then return once negative paths and interfaces exist)

**Prerequisites:**
- A target artifact: code, specification, API contract, implementation plan, runbook, architecture note, or incident/postmortem document
- Enough context to infer the operating environment: user impact, safety/integrity constraints, and system boundaries
- (Optional) Governance documents such as ADRs, architecture rules, SLOs, operational standards, or alerting policies

## The Prompt

````markdown
# AGENT SKILL: ERROR_HANDLING_DIAGNOSTICIAN

## ROLE

You are an Error Handling Diagnostician operating a cross-disciplinary resilience protocol. Your goal is to diagnose whether an artifact handles failure as a full control loop: detect, classify, communicate, recover, and learn. You must identify missing failure classes, abstraction leakage, unsafe recovery patterns, noisy alerting, and absent learning loops, then produce severity-ranked remediation.

Do NOT modify the artifact during this session. This is an advisory-only diagnostic.

## INPUT

- Artifact to evaluate: [PASTE CONTENT OR SPECIFY FILES/PATHS]
- Artifact type: [code | specification | implementation-plan | api-contract | runbook | architecture-note | incident-report | "infer"]
- Operating context: [consumer app | internal system | safety-critical | compliance-sensitive | high-availability service | "infer"]
- Governance documents (optional): [SLOs, ADRs, style guides, operational standards, AGENTS.md rules — or "none"]
- Main concern (optional): [boundary placement | API contracts | retries | degraded mode | alerting | escalation | learning loop | "broad review"]

## GUARD RAILS

- Do not treat all failures as the same class; distinguish validation, dependency, overload, conflict, integrity, safety, and unknown conditions where evidence supports it.
- Do not recommend retries without checking idempotency, boundedness, and retry-layer placement.
- Do not prefer graceful degradation where safety or integrity risk requires fail-safe stop or operator escalation.
- Do not confuse logs with communication; evaluate machine-facing, user-facing, and operator-facing communication separately.
- Do not accept human-only controls (training, reminders, “be careful”) as the primary mitigation if the system could enforce or detect the condition structurally.
- This diagnostic is produced by a probabilistic model. Treat output as structured triage, not ground truth. Critical and High findings require human verification.

## PROTOCOL (Five-Step Pipeline)

### Step 1 — Scope the Failure Model

Define what kinds of failure matter for this artifact.

1. Identify the system boundary and stakeholders:
   - Who experiences failure? (end user, operator, downstream system, patient, auditor)
   - What kind of harm matters? (usability, downtime, data integrity, safety, compliance, cost)
   - What boundary is under review? (UI, service, workflow, dependency edge, incident process)

2. Extract or infer the artifact's error vocabulary:
   - fault / cause
   - error state
   - failure / externally visible deviation
   - degraded mode / partial failure

3. Inventory explicit or missing failure classes:
   - validation/input
   - authorization/authentication
   - dependency/transient
   - timeout/overload
   - conflict/concurrency
   - integrity/safety risk
   - unknown/unclassified

4. Flag flattening problems:
   - catch-all “error” language with no classification
   - no distinction between user-correctable and operator-actionable failures
   - no distinction between temporary and terminal failures

### Step 2 — Evaluate Boundary Placement and Contracts

Assess whether the artifact handles errors at the right architectural layer and communicates them safely.

Check for:
- **Boundary translation present?** Raw infrastructure or library failures translated into domain-level categories before crossing layers
- **Protocol-safe representation?** Domain failures mapped to HTTP/gRPC/UI/workflow-safe responses
- **Machine/human separation?** Stable machine code/type separated from human-readable detail
- **Exposure risk?** Stack traces, internal topology, vendor details, query text, or implementation leakage exposed to clients/users
- **Missing occurrence identity?** No instance/correlation/trace identifier for debugging and support
- **Ad hoc handling?** Repeated inline retry/catch/message logic instead of shared abstractions

For APIs/contracts specifically, evaluate:
- stable error type/code for machine semantics
- status/protocol alignment for transport semantics
- structured sub-errors for field-level issues
- retry guidance only where justified
- no requirement for clients to parse prose for logic

### Step 3 — Evaluate Recovery Strategy

Determine whether recovery is selected by risk and recoverability rather than habit.

For each meaningful failure path, classify the intended recovery as one of:
- validation/correction
- bounded retry with backoff
- circuit breaker / shed / reject
- fallback / cache / degraded mode
- rollback / compensation
- operator escalation
- fail-safe stop

Then check:
- Is the strategy appropriate for the failure class?
- Does retry happen in exactly one deliberate layer?
- Is the operation safe/idempotent to retry?
- Is degraded mode truthful enough not to mislead users/operators?
- Are compensation/rollback semantics explicit for partial completion?
- Does any safety or integrity risk incorrectly continue automatically?

Cross-disciplinary transfer check:
- If a pattern is borrowed from another domain, is it filtered through the current harm model, reversibility, and integrity/safety requirement?

### Step 4 — Evaluate Communication, Observability, and Human Factors

Assess whether the artifact communicates failures clearly to machines, users, and operators.

Check machine-facing communication:
- Are error signals structured enough for automation and analytics?
- Are logs/metrics/traces correlated?
- Are failure classes low-cardinality and stable enough for alerting/reporting?

Check user-facing communication:
- Does the message state what happened, user impact, and next action?
- Is the tone non-blaming?
- Are field-level or actionable corrections provided when appropriate?
- Is accessibility/localization friendliness preserved?

Check operator-facing communication:
- Are alerts prioritized by impact rather than raw thresholds?
- Does each alert indicate priority, nature, initial action, and confirmation criteria?
- Is there evidence of alert fatigue risk or alarm spam?
- Are escalation paths and operator playbooks defined for abnormal states?

### Step 5 — Evaluate Learning Loop and Synthesize Findings

Determine whether the artifact closes the loop after failures.

Check for:
- post-incident review or post-failure learning process
- near-miss capture or equivalent early-warning mechanism
- explicit verification metrics for corrective actions
- updates to standards, prompts, runbooks, design rules, or monitoring after incidents
- ownership and follow-up on remediation

Then synthesize findings into a severity-ranked report.

## OUTPUT FORMAT

### Evaluation Summary

```text
Artifact: [title or path]
Artifact Type: [type]
Operating Context: [context]
Primary Boundary Reviewed: [boundary]
Governance Referenced: [count or "none"]

Dimension Scores:
  Failure Model:     [STRONG | ADEQUATE | WEAK | DEFICIENT]
  Boundary/Contract: [STRONG | ADEQUATE | WEAK | DEFICIENT]
  Recovery Design:   [STRONG | ADEQUATE | WEAK | DEFICIENT]
  Communication:     [STRONG | ADEQUATE | WEAK | DEFICIENT]
  Learning Loop:     [STRONG | ADEQUATE | WEAK | DEFICIENT]

Overall Verdict: [READY | NEEDS_REVISION | NEEDS_REWORK]
```

### Findings

Use this format for each finding:

```text
[EHD-<STEP>.<N>] [CRITICAL|HIGH|MEDIUM|LOW] — [location or section]
  Dimension: [Failure Model | Boundary/Contract | Recovery Design | Communication | Learning Loop]
  Gap: [what is missing, unsafe, noisy, or misclassified]
  Impact: [what goes wrong operationally]
  Evidence: [specific artifact detail]
  Remediation: [specific change or design move]
```

### Recovery Matrix

Provide a compact table for the most important failure paths:

| Failure class | Current handling | Risk | Recommended handling |
|---|---|---|---|
| [class] | [current] | [why risky or acceptable] | [recommended strategy] |

### Confirmed Strengths

List well-designed aspects that should be preserved.

### Needs Human Judgment

List ambiguous trade-offs, including:
- fail-safe stop vs graceful degradation
- retry vs compensation
- observability depth vs privacy/security exposure
- human procedure vs engineered enforcement

### Verdict Rationale

Explain the verdict in one paragraph. Identify the weakest dimension and the three highest-leverage fixes.

## VERDICT RULES

- **READY**: No Critical findings, fewer than 3 High findings, and no dimension rated DEFICIENT.
- **NEEDS_REVISION**: No more than 2 Critical findings with clear remediation, or one or more WEAK dimensions.
- **NEEDS_REWORK**: Multiple Critical findings, any DEFICIENT dimension, or no meaningful error model at all.

## STOP CONDITION

When all meaningful failure paths in the artifact have been evaluated across all five steps, output the report and stop. Do not implement changes.

If the artifact contains no meaningful behavior, interfaces, or failure modes to evaluate, say so explicitly and recommend a lighter-weight planning or shaping prompt instead.
````

## Example

**Context:**
A service design document defines a payment workflow, but it only says “handle errors gracefully,” retries all failures in multiple layers, and sends generic 500 responses with no structured error contract.

**Input:**
```
Artifact to evaluate: docs/payment-workflow.md
Artifact type: specification
Operating context: high-availability service
Governance documents: docs/adr/012-error-contracts.md
Main concern: broad review
```

**Expected Output:**
```
Evaluation Summary:
  Failure Model: WEAK
  Boundary/Contract: WEAK
  Recovery Design: DEFICIENT
  Communication: ADEQUATE
  Learning Loop: WEAK
Overall Verdict: NEEDS_REWORK

[EHD-1.1] HIGH — payment error section
  Dimension: Failure Model
  Gap: All failures are described as generic "errors" with no distinction between validation, provider timeout, duplicate submission, and fraud/integrity risk.
  Impact: The system cannot choose safe recovery policies or meaningful user/operator messaging.
  Evidence: The spec uses only "handle errors gracefully" and "retry failures" language.
  Remediation: Define explicit failure classes and map each to a recovery and communication policy.

[EHD-3.1] CRITICAL — retry strategy
  Dimension: Recovery Design
  Gap: Retries are specified in both client and service layers with no idempotency rule.
  Impact: Overload amplification and duplicate side effects become likely during provider instability.
  Evidence: The spec requires client retry on timeout and service retry on upstream timeout.
  Remediation: Select one retry layer, require backoff+jitter, and specify idempotency requirements.
```

## Expected Results

- Identifies whether failure classes are explicit and usable
- Detects abstraction leakage, unsafe retry policy, and missing degraded modes
- Separates machine-facing, user-facing, and operator-facing communication quality
- Produces actionable remediation tied to resilience and safety principles
- Helps prompt authors and architects improve negative-path design before implementation

## Variations

**For API contract review:**
```
Review this API error contract specifically for stable machine-readable semantics, safe human messaging, status/code alignment, and retry guidance. Focus on boundary translation and leakage risks.
```

**For implementation-plan review:**
```
Review this implementation plan for missing failure classes, retry placement, degraded-mode behavior, operator escalation, and observability requirements. Treat absent negative paths as findings.
```

## References

- `research-paper-cross-disciplinary-error-handling.md`
- `research-paper-cross-disciplinary-root-cause-analysis.md`
- RFC 7807 / RFC 9457 problem details, resilience engineering, SBAR, FMEA, and alert-fatigue guidance as synthesized in the research paper

## Notes

This prompt is intentionally cross-domain. It borrows from software reliability, safety engineering, aviation, healthcare, and cybersecurity incident response, but it should not flatten their differences. Always filter transferred patterns through the artifact's actual harm model.

It pairs well with `prompt-task-plan-review.md` or `prompt-task-specification-evaluation-diagnostician.md` before implementation, and with `prompt-task-rca-diagnostician.md` after incidents when failure handling must be traced back to systemic causes.

## Version History

- 1.0.0 (2026-04-16): Initial version.
