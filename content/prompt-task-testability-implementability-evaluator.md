---
title: Testability and Implementability Evaluator
type: prompt
subtype: task
tags: [specification-evaluation, testability, implementability, iso-29148, pieces, glia, ears, bach-testability, definition-of-ready, feasibility-analysis, shift-left]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-04-06
updated: 2026-04-06
version: 1.0.0
related: [research-paper-specification-testability-implementability.md, prompt-task-specification-evaluation-diagnostician.md, prompt-task-specification-review.md, research-standalone-specification-standards.md]
source: research-paper-specification-testability-implementability.md
---

# Testability and Implementability Evaluator

## When to Use

Use when a software specification needs assessment for whether it can be *built* (implementability) and whether it can be *verified* (testability) before committing implementation resources.

**Best for:**
- Pre-sprint evaluation of user stories, backlog items, or SRS documents against the Definition of Ready
- Assessing whether specifications can survive the reality of their deployment environment — technology constraints, budget, legacy integrations, operational load
- Detecting untestable requirements: vague language, missing triggers, absent acceptance criteria, unobservable system states
- Validating that functional requirements remain feasible under non-functional constraints (latency, throughput, scalability, security)
- Evaluating EARS/Gherkin syntax compliance for structured textual requirements
- Identifying specifications that require architectural spikes before implementation can be estimated
- Pre-implementation gate for agile teams adopting shift-left testing practices

**Do NOT use when:**
- The specification needs evaluation for structural completeness, factual correctness, and internal coherence (use `prompt-task-specification-evaluation-diagnostician.md` — this prompt evaluates *buildability and verifiability*, not structural quality)
- The document is a draft outline or brainstorm not yet formalized into requirements (too early)
- You need factual verification of a research document (use `prompt-task-verification-diagnostician.md`)
- You need code review of an implementation (use code review or red-team-review prompts)
- The specification is for a trivial change where formal evaluation overhead exceeds implementation cost
- You need to evaluate AI/foundation model behavioral specifications — probabilistic adherence scoring requires a different methodology (no prompt currently available in this repository)

**Prerequisites:**
- The specification document to evaluate (full text or file path)
- (Optional) System context: architecture documentation, infrastructure constraints, team capabilities — used for implementability assessment
- (Optional) Target deployment environment: hardware specs, latency SLAs, legacy system integration points — used for PIECES feasibility analysis
- (Optional) Test infrastructure description: available test frameworks, CI/CD pipeline, mock/simulation capabilities — used for testability assessment

## The Prompt

````markdown
# AGENT SKILL: TESTABILITY_IMPLEMENTABILITY_EVALUATOR

## ROLE

You are a Specification Feasibility Analyst operating a dual-axis evaluation protocol. You assess software specifications across two co-dependent dimensions — Implementability (can it be built?) and Testability (can it be verified?) — using established feasibility frameworks, testability heuristics, and syntax enforcement standards. You identify specifications that are architecturally implausible, economically unviable, linguistically untestable, or operationally unverifiable, then produce severity-ranked findings with specific remediation.

Implementability and testability are co-dependent: a specification that is perfectly testable but physically impossible to implement, or perfectly implementable but impossible to verify, fails equally.

Do NOT modify the specification during this session. This is an advisory-only evaluation.

## INPUT

- Specification to evaluate: [PASTE SPECIFICATION OR SPECIFY FILE PATH]
- System context (optional): [PASTE OR SPECIFY — architecture docs, infrastructure constraints, team capabilities — or "none"]
- Deployment environment (optional): [PASTE OR SPECIFY — hardware, latency SLAs, legacy integrations — or "none"]
- Test infrastructure (optional): [PASTE OR SPECIFY — test frameworks, CI/CD, mock capabilities — or "none"]

## PROTOCOL (Six-Step Pipeline)

### Step 1 — ISO 29148 Baseline Gate

Before evaluating implementability or testability, verify that the specification meets the structural minimum for meaningful evaluation. Scan for baseline violations that would invalidate any further assessment.

| Signal | Severity | What to Look For |
|--------|----------|------------------|
| Missing Verifiability | Critical | Requirements stated in unmeasurable terms — "the system should be fast," "the interface should be intuitive," "performance should be acceptable." Without verifiability, no test criteria can be derived. |
| Implementation Bias | High | The specification dictates *how* to build rather than *what* to build — embedding specific vendors, protocols, algorithms, or architectural patterns that artificially constrain the solution space. |
| Missing Traceability | High | Requirements cannot be traced backward to a stakeholder need or forward to a test case. Orphaned requirements cannot be prioritized for feasibility analysis. |
| Ambiguous Language | High | Multiple valid interpretations exist — vague adjectives ("robust," "user-friendly," "seamless"), unresolved pronouns, passive voice obscuring the responsible actor, or universal quantifiers ("all," "every," "any") generating unbounded scope. |
| Missing Ranked Importance | Medium | Requirements are not prioritized. Without ranking, implementability trade-offs cannot be made — the team cannot determine which requirements to spike first or which to descope if constraints tighten. |
| Compound Requirements | Medium | Requirements joined by "and/or" — entangling multiple capabilities that have different feasibility and testability profiles. |

If the specification contains a mix of mature and placeholder requirements, categorize each as EVALUABLE (sufficient structure for the pipeline) or PLACEHOLDER (insufficient — e.g., title-only, TBD body, prose fragment). Report all placeholders as a single structural completeness finding rather than running them through Steps 2-5 individually, which would flood the report with noise.

If the specification fails the baseline gate with multiple Critical signals, report the failures and recommend structural remediation before proceeding. If failures are isolated, note them and continue.

### Step 2 — Implementability Assessment (PIECES Framework)

Evaluate whether the specified behavior can be realistically engineered within constraints. Assess each PIECES dimension against the specification:

| Dimension | Evaluative Question | Signals of Implausibility |
|-----------|--------------------|-----------------------------|
| **Performance** | Can the proposed architecture handle the throughput, response times, and processing load dictated by the specification under peak stress? | Latency requirements below physical network limits; throughput exceeding available hardware; real-time processing mandated on batch-oriented infrastructure. |
| **Information** | Can the system generate, organize, and retrieve the data the specification demands — accurately, completely, and within stated time constraints? | Data models requiring joins across incompatible storage systems; query patterns that violate database design constraints; data freshness requirements exceeding replication lag. |
| **Economy** | Is the financial cost of implementing the technical complexity justified by the expected return? | Feature cost exceeding its business value; infrastructure requirements demanding 10x budget for marginal capability; gold-plated requirements with no stakeholder demand. |
| **Control** | Can the system enforce the security, compliance, and permission models without breaking core functionality or degrading performance to unacceptable levels? | Multi-factor authentication requirements conflicting with sub-second response mandates; audit logging volume exceeding storage budget; encryption overhead making latency SLAs impossible. |
| **Efficiency** | Does the specification introduce unnecessary computational waste, excessive human intervention, or redundant technical layers? | Manual approval steps in automated pipelines; redundant data transformation between identical formats; requiring both synchronous and asynchronous processing of the same operation. |
| **Services** | Does the specification align with broader operational goals — accuracy, reliability, and maintainability suitable for the intended deployment? | Uptime requirements impossible without redundancy the architecture doesn't include; maintainability assumptions requiring expertise the team lacks. |

For each dimension with findings, specify the requirement, the constraint it violates, and whether the issue is absolute (physically impossible) or conditional (possible with stated remediation). If no system context is provided, evaluate PIECES against general engineering feasibility and caveat all findings as "unverifiable without infrastructure context."

### Step 3 — Implementability Assessment (GLIA Triad)

While PIECES evaluates feasibility against external constraints (infrastructure, budget, operations), the GLIA triad evaluates whether each requirement's *internal logic* can be translated into deterministic algorithmic code:

| Dimension | Evaluative Question | Failure Mode |
|-----------|--------------------|--------------|
| **Computability** | Can this behavior be operationalized into algorithmic logic? Can the required triggers and data states be digitized, monitored, and processed? | Specification relies on subjective human judgment without quantifiable thresholds — "flag suspicious transactions" without defining what constitutes "suspicious." |
| **Decidability** | Does the specification precisely dictate *when* the system should execute? Are triggering conditions unambiguous, non-contradictory, and visible to the software? | Triggers depend on external states invisible to the system, or conditions are ambiguous enough that developers will interpret timing discordantly. |
| **Executability** | Does the specification clearly communicate exactly *what* the system must do once triggered? | Vague directives: "optimize the data flow," "handle the error gracefully," "ensure data quality" — without explicit, deterministic computational instructions. |

Requirements that fail all three dimensions are fundamentally unimplementable and require complete respecification. Requirements that fail one or two may be salvageable with targeted remediation.

### Step 4 — Testability Assessment (Bach's Five Dimensions)

Evaluate the specification's testability across James Bach's five dimensions:

| Dimension | Evaluative Question | Signals of Low Testability |
|-----------|--------------------|-----------------------------|
| **Intrinsic Testability** | Does the specification design for observability, controllability, simplicity, and availability? | **Observability:** Background processes specified without logging, state queryability, or transaction logs — "what you see is what can be tested." **Controllability:** No mechanism for manipulating inputs or execution states for automation — the system cannot be put into specific test states. **Simplicity:** Excessive coupling, circular dependencies, or unnecessary complexity that makes isolation testing impossible. **Availability:** The system cannot be tested in stages — it's all-or-nothing, blocking incremental verification. |
| **Epistemic Testability** | How much is unknown about the technology, user base, and dependencies? | Novel or experimental technology with no established testing patterns; unknown failure modes; first-of-kind integrations where the team has no prior experience to draw test scenarios from. |
| **Value-Related Testability** | Does the required testability rigor match the business criticality? | Mission-critical requirements (safety, financial, regulatory) specified with the same loose acceptance criteria as cosmetic enhancements. Conversely, low-risk features burdened with exhaustive test requirements that waste resources. |
| **Project-Related Testability** | Do operational constraints support testing? | Specifications evolving so rapidly that tests are invalidated before execution. Required test data unavailable or restricted. No simulated environment for integration testing. Missing or inaccurate technical documentation. |
| **Subjective Testability** | Does the testing team have the domain expertise to verify these requirements? | Cryptographic, ML/AI, or domain-specific requirements assigned to generalist QA without training plan or specialist review. |

When Intrinsic Testability is low, identify specific **testability transformations** needed: assertion injection, dependency decoupling, logging mandates, or explicit boundary definitions for mock/harness configuration.

### Step 5 — Syntax and Structure Enforcement (EARS + NLP Signals)

Evaluate textual requirements for structural testability using EARS patterns and NLP anti-pattern detection.

**EARS Pattern Compliance:** For each testable requirement, identify which EARS pattern it matches (or should match):

| Pattern | Expected Structure | Testability Enforcement |
|---------|--------------------|------------------------|
| **Ubiquitous** | *The \<system\> shall \<response\>* | Always-active property. Testable via static analysis or environmental check. |
| **Event-Driven** | *When \<trigger\>, the \<system\> shall \<response\>* | Explicit trigger. Test case derived by simulating the exact trigger event. |
| **State-Driven** | *While \<precondition\>, the \<system\> shall \<response\>* | Continuous behavior in defined state. Verified by monitoring during state. |
| **Unwanted Behavior** | *If \<error\>, then the \<system\> shall \<response\>* | Explicit error handling. Ensures negative paths are defined and tested. |
| **Optional Feature** | *Where \<feature present\>, the \<system\> shall \<response\>* | Configuration-dependent. Test matrix must account for feature variations. |

**NLP Anti-Pattern Detection:** Scan for linguistic signals that destroy testability:

| Anti-Pattern | What to Flag | Why It Matters |
|-------------|-------------|----------------|
| Weak Phrases | "adequate," "as appropriate," "as needed," "sufficient" | Subjective — every developer interprets differently; no binary test possible. |
| Options | "can," "may," "optionally" | Optionality destroys binary verifiability — the test cannot determine pass/fail. |
| Continuances | "and," "also," "below," "additionally" joining requirements | Increases complexity, obscures single responsibility, entangles test coverage. |
| Non-Specific Temporals | "immediately," "quickly," "in real time" | Cannot be measured in milliseconds, CPU cycles, or SLA terms. |
| Universal Quantifiers | "all," "every," "any," "never," "always" | Generate unbounded testing scenarios — exhaustive verification is impossible. |
| Passive Voice | "the data shall be processed" (by what?) | Obscures the responsible component, making test assignment ambiguous. |
| Missing Imperative | Requirement lacks "shall" or equivalent binding verb | No contractual obligation — the requirement is aspirational, not mandatory. |

For requirements with multiple anti-patterns, recommend rewriting in EARS format with specific trigger, system name, imperative, and measurable response.

### Step 6 — Definition of Ready Synthesis

Synthesize findings from all steps into a Definition of Ready assessment.

1. **Score the specification** across both axes:

| Axis | Rating | Criteria |
|------|--------|----------|
| **Implementability** | FEASIBLE / CONDITIONAL / IMPLAUSIBLE / IMPOSSIBLE | FEASIBLE: All PIECES dimensions clear, GLIA triad satisfied. CONDITIONAL: Feasible with stated remediation (spike needed, constraint relaxation, budget adjustment). IMPLAUSIBLE: Multiple PIECES failures, GLIA dimension failures without clear remediation path, or specifications requiring fundamental architectural changes to the existing system. IMPOSSIBLE: Violates physical laws or mathematical limits — no remediation can make this work. |
| **Testability** | TESTABLE / PARTIAL / UNTESTABLE | TESTABLE: All Bach dimensions adequate, EARS-compliant syntax, observable and controllable. PARTIAL: Some dimensions weak — testable with stated transformations (add logging, decouple dependencies, define boundaries). UNTESTABLE: Multiple Bach dimensions failed, pervasive NLP anti-patterns, no observability or controllability. |

2. **Determine Definition of Ready verdict:**

| Verdict | Criteria |
|---------|----------|
| **READY** | Implementability FEASIBLE, Testability TESTABLE. No Critical findings. Acceptance criteria defined and automatable. Dependencies identified. Team can estimate. |
| **READY_WITH_SPIKES** | Implementability CONDITIONAL on architectural spike results. Testability TESTABLE or PARTIAL with clear transformations. Spike scope and timebox defined. |
| **NOT_READY** | Implementability IMPLAUSIBLE or IMPOSSIBLE, or Testability UNTESTABLE. Specification requires structural changes before entering a sprint. |

3. **Identify the three highest-impact remediations** — findings that would cause the most costly implementation or verification failures if unaddressed.

## OUTPUT FORMAT

### Evaluation Summary

```
Specification: [title or file path]
Requirements Evaluated: [count]
System Context Referenced: [yes/no]

Axis Scores:
  Implementability: [FEASIBLE | CONDITIONAL | IMPLAUSIBLE | IMPOSSIBLE]
  Testability:      [TESTABLE | PARTIAL | UNTESTABLE]

Definition of Ready: [READY | READY_WITH_SPIKES | NOT_READY]
```

### Findings

For each finding, use `[AXIS-STEP.N]` where AXIS = IMPL|TEST|BASE, STEP = step number, N = finding number. Findings from Step 5 (EARS/NLP) appear here for severity tracking; the EARS Compliance Report below separately provides before/after rewrites for the same requirements:

```
[IMPL-2.1] [CRITICAL|HIGH|MEDIUM|LOW] — [requirement ID or section]
  Axis: Implementability
  Framework: PIECES / Performance
  Issue: [what makes this implausible or impossible]
  Constraint: [the specific limit being violated]
  Remediation: [specific change — requirement revision, spike, constraint relaxation]
```

```
[TEST-4.1] [CRITICAL|HIGH|MEDIUM|LOW] — [requirement ID or section]
  Axis: Testability
  Dimension: Intrinsic / Observability
  Issue: [what makes this untestable]
  Impact: [what cannot be verified during QA]
  Transformation: [specific testability improvement — add logging, decouple, inject assertions]
```

### EARS Compliance Report

For requirements that are not EARS-compliant, show current text and recommended rewrite:

```
Requirement: [ID or text]
Current: "The system should handle errors gracefully."
Pattern: None (missing trigger, missing imperative, vague response)
Rewrite: "If the payment gateway returns HTTP 5xx, the system shall
          retry once after 500ms, then return error code PAY_UNAVAILABLE
          with retry_after=30 to the client."
Pattern: Unwanted Behavior
```

### Confirmed Strengths

List requirements that are both implementable and testable — well-formed, measurable, EARS-compliant, with clear acceptance criteria. Establish what the specification author can rely on.

### Spike Recommendations

If any requirements need architectural spikes before implementability can be confirmed:

```
Spike: [descriptive name]
  Validates: [requirement ID(s)]
  Question: [what the spike must answer]
  Timebox: [recommended duration]
  Success Criteria: [what constitutes a conclusive result]
```

### Needs Human Judgment

- Requirements where implementability and testability are in tension (more testable = less performant)
- Feasibility assessments requiring infrastructure knowledge the evaluator lacks
- Cost/benefit trade-offs that depend on business priorities
- Requirements where the team's subjective testability cannot be assessed without knowing their expertise

### Verdict Rationale

One paragraph: what drives the assessment, which axis is weaker, and what specific actions would change the verdict to READY.

## STOP CONDITION

When all requirements have been evaluated across all six steps, output the summary and stop. Do not modify the specification.

If no issues are found:

> **Specification passes evaluation.** Both axes rated positively (Implementability: FEASIBLE, Testability: TESTABLE). Requirements are well-formed, architecturally feasible, and verifiable. Definition of Ready: READY.

Do not fabricate findings to fill the report.
````

## Example

**Context:**
Evaluating a user story specification for a real-time notification service before sprint planning, to determine if it meets the Definition of Ready.

**Input:**
```
Specification to evaluate: specs/stories/notification-service-v1.md
System context: docs/architecture.md (event-driven microservices, Kafka backbone, PostgreSQL)
Deployment environment: 4-node k8s cluster, 99.9% uptime SLA, 50k concurrent users
Test infrastructure: Jest + Playwright, no message queue test harness
```

**Expected Output:**

### Evaluation Summary

```
Specification: specs/stories/notification-service-v1.md
Requirements Evaluated: 9
System Context Referenced: yes

Axis Scores:
  Implementability: CONDITIONAL
  Testability:      PARTIAL

Definition of Ready: READY_WITH_SPIKES
```

### Findings

```
[BASE-1.1] HIGH — Requirement NOTIF-005
  Axis: ISO 29148 Baseline
  Signal: Missing Verifiability + Ambiguous Language
  Issue: "The system should handle notification failures gracefully
         and retry as appropriate." Contains unmeasurable terms
         ("gracefully," "as appropriate"), uses "should" instead of
         "shall," and joins two capabilities ("handle" + "retry")
         with "and." This requirement cannot have test criteria
         derived from it in its current form.
  Remediation: Decompose into two requirements with measurable terms
               and EARS Unwanted Behavior pattern. See EARS Compliance
               Report below for specific rewrite.

[IMPL-2.1] CRITICAL — Requirement NOTIF-003
  Axis: Implementability
  Framework: PIECES / Performance
  Issue: "All notifications must be delivered within 100ms of the
         triggering event." The Kafka backbone has p99 consumer lag
         of 200-500ms under load per architecture.md. The 100ms
         delivery SLA is below the infrastructure's physical floor.
  Constraint: Kafka consumer lag p99 = 200-500ms (documented).
  Remediation: Either relax to "500ms p99 delivery latency" consistent
               with the event backbone, or specify a bypass path for
               urgent notifications using direct WebSocket push,
               accepting the architectural divergence.

[IMPL-2.2] HIGH — Requirement NOTIF-007
  Axis: Implementability
  Framework: PIECES / Control
  Issue: "Notification preferences must support per-channel opt-out
         with immediate effect." Kafka topic subscriptions cannot be
         dynamically filtered per-user without a filtering layer.
         No such layer exists in the current architecture.
  Constraint: Kafka consumer groups consume entire topics; per-user
              filtering requires application-layer implementation.
  Remediation: Add requirement for a notification routing service
               between Kafka consumer and delivery, or spike the
               per-user filtering approach to validate feasibility.

[TEST-4.1] HIGH — Requirement NOTIF-001
  Axis: Testability
  Dimension: Intrinsic / Observability
  Issue: "The service must reliably deliver notifications across
         all channels (email, push, SMS)." No logging, delivery
         confirmation, or queryable delivery state is specified.
         Testers cannot verify delivery occurred without
         instrumenting each external channel independently.
  Impact: QA cannot confirm delivery without manual inspection
          of email inboxes, push notification logs, and SMS
          gateway dashboards for every test case.
  Transformation: Add requirements for: delivery event logging
                  (channel, timestamp, status, recipient_id),
                  queryable delivery status API endpoint, and
                  delivery confirmation callback from each channel.

[TEST-5.1] HIGH — Requirement NOTIF-005
  Axis: Testability
  Dimension: EARS / NLP Anti-Pattern
  Issue: "The system should handle notification failures gracefully
         and retry as appropriate." Contains: weak phrase
         ("as appropriate"), vague directive ("gracefully"),
         option verb ("should" instead of "shall"), and missing
         trigger (what constitutes "failure"?).
  Impact: Four anti-patterns in one requirement. No test can
          determine pass/fail. Every developer implements differently.
  Transformation: Rewrite as EARS Unwanted Behavior pattern:
                  "If a notification delivery attempt returns a
                  non-2xx response, the system shall retry up to
                  3 times with exponential backoff (1s, 2s, 4s),
                  then mark the notification as FAILED and emit
                  event notification.delivery.failed."

[IMPL-3.1] MEDIUM — Requirement NOTIF-004
  Axis: Implementability
  Framework: GLIA / Decidability
  Issue: "Notifications should be sent when relevant events occur."
         The trigger "relevant events" is not enumerated — the
         system cannot decide when to fire without a bounded event
         catalog.
  Constraint: Decidability requires exhaustive trigger enumeration.
  Remediation: Replace with explicit event catalog: "The system
               shall send notifications when any of the following
               events are emitted: order.placed, order.shipped,
               payment.failed, account.locked."
```

### EARS Compliance Report

```
Requirement: NOTIF-005
Current: "The system should handle notification failures gracefully
          and retry as appropriate."
Pattern: None (missing trigger, wrong verb, vague response, weak phrase)
Rewrite: "If a notification delivery attempt returns a non-2xx
          response, the system shall retry up to 3 times with
          exponential backoff (1s, 2s, 4s), then mark the
          notification as FAILED and emit event
          notification.delivery.failed."
Pattern: Unwanted Behavior

Requirement: NOTIF-004
Current: "Notifications should be sent when relevant events occur."
Pattern: None (vague trigger, wrong verb)
Rewrite: "When an event matching the notification catalog
          (order.placed, order.shipped, payment.failed,
          account.locked) is consumed from the event bus, the
          notification service shall generate and enqueue a
          notification for each recipient in the event's subscriber list."
Pattern: Event-Driven
```

### Confirmed Strengths
- NOTIF-002 (notification templating) — well-formed GIVEN/WHEN/THEN with specific template variables and expected output format
- NOTIF-006 (rate limiting) — measurable thresholds: "no more than 5 notifications per user per hour per channel"
- NOTIF-008 (audit trail) — specific retention period, queryable fields, and compliance standard reference

### Spike Recommendations

```
Spike: Kafka per-user notification filtering
  Validates: NOTIF-007
  Question: Can per-user opt-out be implemented as an application-layer
            filter between Kafka consumer and delivery service without
            exceeding 200ms additional latency at 50k concurrent users?
  Timebox: 2 days
  Success Criteria: Prototype filters 10k preferences with <50ms p99
                    overhead. If >200ms, recommend dedicated routing
                    service as alternative architecture.
```

### Needs Human Judgment
- NOTIF-003 (delivery latency): The 100ms requirement may originate from a product commitment. Relaxing to 500ms requires product owner approval and potential customer communication.
- Test infrastructure gap: No Kafka test harness exists. Whether to build one (2-3 day investment) or use Testcontainers (faster setup, slower execution) is a team capacity decision.

### Verdict Rationale
Rated READY_WITH_SPIKES because the core notification architecture is sound and most requirements are well-formed, but NOTIF-003 mandates delivery latency below the infrastructure's physical floor (CRITICAL), NOTIF-007 requires per-user filtering not supported by the current architecture (needs spike), and three requirements contain pervasive NLP anti-patterns preventing test derivation. Resolving the latency SLA with product owner, completing the filtering spike, and rewriting NOTIF-004 and NOTIF-005 in EARS format would raise the verdict to READY.

## Expected Results

- A dual-axis evaluation report (Implementability + Testability) with Definition of Ready verdict
- Each finding traces: issue → specific constraint violated → concrete remediation
- PIECES feasibility assessment against real architectural and deployment constraints
- GLIA triad evaluation for algorithmic translatability of each requirement
- Bach's five testability dimensions applied with specific transformation recommendations
- EARS compliance report with before/after rewrites for non-compliant requirements
- NLP anti-pattern detection: weak phrases, options, continuances, passive voice, universals
- Spike recommendations with timebox and success criteria for conditional requirements
- Specification is NOT modified — advisory only

## Variations

**Implementability-Only Scan:**
Use Steps 1-3 only when the primary concern is architectural feasibility — e.g., evaluating whether a specification is buildable on existing infrastructure before investing in test planning.

**Testability-Only Scan:**
Use Steps 1, 4-5 only when the specification's feasibility is already established (architecture validated, spikes completed) and the focus is deriving test plans.

**EARS Remediation Pass:**
Use Step 5 only as a targeted rewriting exercise. Apply to textual requirements that need conversion from natural language to EARS-compliant structured syntax. Useful during backlog refinement.

**Definition of Ready Gate:**
Use the full six-step pipeline as the mandatory quality gate before sprint planning. The specification must achieve READY or READY_WITH_SPIKES (with spikes scheduled) before entering a sprint.

**Agile Granularity (INVEST Check):**
Prepend a quick INVEST assessment before the pipeline: is the specification Independent, Negotiable, Valuable, Estimable, Small, and Testable? If it fails multiple INVEST criteria, recommend restructuring before running the full pipeline.

## Notes

**Implementability and testability are co-dependent.** A specification that passes PIECES feasibility but fails Bach's testability dimensions will produce software that works but cannot be verified. A specification with perfect EARS syntax but physically impossible performance requirements will produce test cases that can never pass. Always evaluate both axes together.

**PIECES requires context to be useful.** Without knowledge of the target infrastructure, team capabilities, and budget constraints, PIECES evaluation degrades to theoretical plausibility rather than practical feasibility. Provide system context whenever possible.

**EARS is syntax, not semantics.** A requirement can be perfectly EARS-compliant but factually wrong or architecturally implausible. EARS enforces testability through structural syntax — it cannot assess whether the specified behavior is correct or desirable. Use this prompt for testability; use the specification-evaluation-diagnostician for correctness.

**Not every requirement needs EARS.** The EARS compliance check is most valuable for behavioral requirements that drive test cases. Ubiquitous properties (coding standards, platform constraints) and organizational requirements (process mandates, documentation standards) may not benefit from EARS restructuring.

**The evaluator is not ground truth.** This diagnostic is performed by a probabilistic model. It may miss genuine feasibility constraints, flag viable requirements as implausible, or fail to detect subtle testability gaps. PIECES assessments in particular depend on accurate infrastructure context — if the provided system context is incomplete, feasibility conclusions may be wrong. Critical and High findings should be verified by the engineering team.

## References

- [research-paper-specification-testability-implementability.md](research-paper-specification-testability-implementability.md) — the research synthesis this prompt operationalizes
- [prompt-task-specification-evaluation-diagnostician.md](prompt-task-specification-evaluation-diagnostician.md) — complementary: evaluates specification Completeness, Correctness, and Coherence via the tripartite verification engine
- [prompt-task-specification-review.md](prompt-task-specification-review.md) — complementary: evaluates specification standalone autonomy and AI-readiness (Amnesia Test)
- [research-standalone-specification-standards.md](research-standalone-specification-standards.md) — ISO 29148 and standalone specification standards

### Source Research

- ISO/IEC/IEEE 29148:2018 — requirement quality characteristics and structural baseline
- James Bach / Satisfice — Heuristics of Software Testability (five dimensions)
- PIECES Framework — multi-dimensional implementability assessment
- GLIA Instrument — Computability, Decidability, Executability triad adapted from clinical guidelines
- EARS Framework — Easy Approach to Requirements Syntax (five behavioral patterns)
- NASA Systems Engineering Handbook — imperative terminology mandates and banned subjective terms
- BDD / ATDD / Specification by Example — executable specification paradigms
- ARM, RETA, RCM — NLP-based ambiguity detection tools

## Version History

- 1.0.0 (2026-04-06): Initial extraction from research-paper-specification-testability-implementability.md. Operationalizes the dual-axis evaluation pipeline (Implementability via PIECES + GLIA, Testability via Bach + EARS) with ISO 29148 baseline gate, NLP anti-pattern detection, spike recommendations, and Definition of Ready synthesis.
