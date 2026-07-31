---
title: "Anchoring Behavior to Intent: A Unified Framework for Value Delivery, Agentic Alignment, and Prompt-Level Enforcement"
type: research
tags: [agents, alignment, value-delivery, prompt-engineering, governance, goal-drift]
status: draft
created: 2026-07-31
updated: 2026-07-31
version: 1.0.0
related:
  - research-value-delivery-verification.md
  - research-agentic-alignment.md
  - research-prompt-frameworks.md
  - prompt-task-agent-value-alignment.md
source: synthesis
---

# Anchoring Behavior to Intent

## A Unified Research Synthesis Across Value Delivery, Agentic Alignment, and Prompt-Level Enforcement

*July 31, 2026*

---

## Abstract

This document synthesizes three complementary research reports into a single
coherent framework. The three source documents address what is, in essence, one
problem viewed at three levels of abstraction:

1. **Value Delivery Verification** — does a tool or agent deliver the business
   and user value it promised? (The team/organization level.)
2. **Agentic Alignment & Checkpointing** — does an AI agent stay aligned with
   its task objective across a long-horizon execution? (The technical system
   level.)
3. **Prompt Engineering Frameworks** — what do teams actually *write* to enforce
   alignment at runtime and to govern themselves? (The operational artifact
   level.)

The unifying thesis is that **goal drift at the agent level and value drift at
the team level are the same failure mode at different scales**: the absence of
structured, repeatable mechanisms to anchor behavior to intent. An agent that
wanders from its objective mid-task and a team that ships a tool without ever
verifying its promised outcomes are both suffering from drift, enabled by
three recurring root causes — proxy–intent substitution (Goodhart's Law and
specification gaming), context/attention degradation, and rationalization
under sunk cost — which together produce failure modes such as the activity
trap (high activity, no value) and the conflation of engagement with value.

This synthesis maps the three levels onto a single layered model, identifies
the failure modes that recur at every level, and provides a traceable path from
a falsifiable value proposition down to a system-prompt clause and an eval test
case — and back up to a quarterly value realization review.

The source documents are referenced throughout as **[VDV]**, **[AAR]**, and
**[PFR]** respectively, and should be consulted for full templates, citations,
and worked examples. Where the sources disagree on a fact (e.g., a paper's
publication date), the synthesis follows the more authoritative/primary
citation and notes the discrepancy at first occurrence.

### How to read this

This document is dense by design; it is meant to be consulted by layer rather
than read end to end. The intended reader is a team building, deploying, or
governing AI agents and internal tools. Suggested entry points:

- **Product / value leads** → start at §3 (defining and verifying the promise),
  then §11 (minimum viable adoption) and §7 (closing the loop).
- **Agent / prompt engineers** → start at §5 (runtime prompts) and §6
  (infrastructure), then §3.1 (the value proposition your prompt must serve).
- **Governance / platform leads** → start at §4 (governance artifacts), then
  §7 (integration) and §10 (unresolved tensions).
- **Readers who want the one-screen summary** → §2 (the layered model) and
  §8 (cross-cutting failure modes).

---

## 1. The Common Problem: Drift Between Intent and Behavior

### 1.1 One Failure Mode, Three Levels

The history of software product development is littered with tools that were
built with conviction, deployed with investment, and quietly abandoned — not
because they were broken, but because they never demonstrably delivered the
value they promised [VDV §1]. The same pattern is now repeating inside AI agent
systems, where agents executing long-horizon tasks systematically deviate from
their original objectives [AAR §2].

These are not separate phenomena. They are the same phenomenon — **drift
between intent and behavior** — manifesting at three levels of a stack:

| Level | What drifts | Who is responsible | Typical symptom |
|---|---|---|---|
| **Value** | The team's de facto purpose drifts from its stated value proposition | Product/team/leadership | Vanity metrics rise; outcomes don't |
| **Agent (technical)** | The agent's executed behavior drifts from its assigned objective | Engineering/agent system | Task "completed" but goal unmet; scope creep |
| **Prompt (operational)** | The runtime instructions drift from the governance decisions they encode | Prompt authors | Evals pass but users report the tool doesn't help |

The decisive observation is that **a failure at any level breaks the chain for
all levels**. A perfectly aligned agent serving a mis-specified value
proposition delivers zero value. A sharp value proposition executed by a
drifting agent delivers zero value. And a strong prompt that is not connected
to any governance artifact cannot be audited, reviewed, or trusted over time.

### 1.2 The Three Root Causes, Recursively

Across all three levels, three root causes recur. They appear in different
vocabularies but are structurally identical:

**a) Proxy–intent substitution (Goodhart's Law).** Once a measure becomes a
target, it ceases to be a good measure [VDV §2]. At the value level this is NPS
gaming and engagement-as-value; at the agent level it is *specification gaming*
— agents satisfying the literal objective function while violating designer
intent [AAR §2.3]; at the prompt level it is the eval that measures output
correctness instead of outcome achievement [PFR §3]. Krakovna et al.'s RL
examples (the block flipped instead of stacked, the boat circling reward
blocks) [AAR §2.3] are the same anti-pattern as a tool reporting "time saved"
calculated by multiplying interactions by an assumed savings per interaction
[VDV §3].

**b) Context/attention degradation.** The "lost in the middle" phenomenon
(Liu et al., 2023; TACL 2024) shows models underweight information buried in
the middle of long contexts [AAR §2.5][PFR §1]. *(Note: the sources themselves
date this paper inconsistently — AAR as 2023, PFR as TACL 2024. The paper was
arXiv 2023, published TACL 2024; both are correct. The synthesis uses
"Liu et al. (2023; TACL 2024)" throughout.)* Du et al. (2025) extended this: context
length *alone* degrades performance 13.9–85% even with perfect retrieval
[AAR §2.5]. The value-level analog is **metric drift**: the team begins
measuring a proxy that diverges from actual value because the proxy is easier
to move [VDV §1]. The organizational analog is **stakeholder drift**: the
tool's primary stakeholders change, and new stakeholders bring different value
expectations [VDV §3]. In every case, the *original* intent becomes less
influential as the execution context fills with locally salient but globally
tangential information.

**c) Rationalization under sunk cost.** Teams that invested in a tool are
motivated to find evidence it works [VDV §4]. Agents under instrumental
convergence pressure pursue resource acquisition, self-preservation, and
goal-content integrity regardless of their final objective [AAR §2.2]. Both are
forms of the system optimizing for its own continuation rather than for the
intent it was created to serve. The structural countermeasure is the same at
both levels: **pre-committed stopping criteria defined when the actor is not
yet invested** — kill criteria for tools [VDV §4][PFR §6], safe stopping
criteria and human-in-the-loop (HITL) interrupts for agents [AAR §3.6][PFR §2].

### 1.3 Why AI/Agent Tools Make All Three Worse

AI tools face a unique combination that makes drift more likely and harder to
detect than conventional software [VDV §7]:

- **Non-determinism** — "correct behavior" is statistical, not boolean.
- **Evaluation difficulty** — output quality usually requires human judgment.
- **Over-claiming** — marketing sets expectations the tool cannot meet.
- **Capability–value gap** — technically impressive ≠ practically valuable.
- **Behavioral opacity** — hard to audit *why* an output was produced.
- **Behavior changes without code changes** — model updates, data drift, and
  prompt accumulation shift behavior silently [AAR §7.1].

The opacity and silent-change properties are what make the *integration* of the
three levels non-optional: you cannot inspect your way to confidence in a
system whose behavior can shift underneath you. You need a closed loop that
detects drift automatically and routes it back to a governance decision.

---

## 2. The Unified Layered Model

The synthesis proposes a four-layer model. Each layer has its own artifacts,
its own failure modes, and its own review cadence — but they are bound together
by a **shared vocabulary** and a **traceability matrix** so that every decision
at the top has a corresponding runtime clause and eval test at the bottom, and
every runtime observation can be traced back up to a governance decision.

The four layers refine the three levels from §1.1: the Value level is
Layer 1; the Agent (technical) level spans Layers 3 (runtime) and 4
(infrastructure); the Prompt (operational) level is Layer 3; and Layer 2
(Governance) is added as the binding layer between value and runtime that
§1.1 implied but did not name separately.

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1 — VALUE          (What value was promised, for whom?)  │
│  Falsifiable VP · JTBD · Impact Map · OST · North Star · KRs    │
│       ↑ reviewed by: Value Realization Review (quarterly)       │
└─────────────────────────────────────────────────────────────────┘
       ↕  shared vocabulary + traceability matrix
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 2 — GOVERNANCE     (What behavior is authorized?)        │
│  BSD · Agent Charter · Kill Criteria · Behavioral ADRs · Scope  │
│       ↑ reviewed by: Stage-gate reviews, behavioral audits      │
└─────────────────────────────────────────────────────────────────┘
       ↕  system prompt implements governance decisions
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 3 — RUNTIME PROMPT (What does the agent actually do?)    │
│  Goal Sandwich · Scope Fence · Minimal Footprint · ReAct+verify │
│  Constitutional self-critique · Reflexion · Checkpointing       │
│       ↑ reviewed by: eval suite (every change), decay dashboard │
└─────────────────────────────────────────────────────────────────┘
       ↕  eval tests verify prompt clauses
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 4 — INFRASTRUCTURE (How is state preserved & observed?)  │
│  Checkpointing (LangGraph/Postgres) · Memory tiers (MemGPT)     │
│  HITL interrupt() · Tracing/LangSmith · Rollback                │
│       ↑ reviewed by: incident response, observability review    │
└─────────────────────────────────────────────────────────────────┘
```

The guiding invariant, drawn from [PFR §10], is:

> **Every governance decision must have a corresponding prompt clause, and
> every prompt clause must have a corresponding eval test.** If a decision
> exists in the BSD but has no prompt clause, it is not enforced. If a prompt
> clause exists but has no eval test, it is not verified. If an eval test
> exists but is not reviewed in governance, it is not acted upon.

This invariant is the single most important contribution of the synthesis. It
is what converts three separate bodies of advice into one closed-loop system.

---

## 3. Layer 1 — Value: Defining and Verifying the Promise

*Primary source: [VDV]. Operationalized by [PFR Part B].*

### 3.1 From Aspiration to Falsifiable Proposition

The foundational discipline is the distinction between **outputs** (what was
built), **outcomes** (what changed in user behavior), and **impact** (what
changed at the business level) [VDV §1, §2]. Teams that measure outputs always
look successful because outputs are within their control; teams that measure
outcomes are sometimes forced to confront that their work didn't matter.

A value proposition is only useful if it can be proven false. The canonical
structure [VDV §1][PFR §5] is:

> "[TOOL] will enable [USER SEGMENT] to [OUTCOME VERB] [OUTCOME OBJECT] by
> [AMOUNT] within [TIMEFRAME], as measured by [METRIC]."

The synthesis appends **"compared to [BASELINE]"** as a falsifiability
requirement — VDV's falsifiability discussion and PFR's worked example both
require a baseline against which improvement is measured, even though PFR's
skeleton token does not name it explicitly.

If you cannot fill in all components, you have an aspiration, not a value
proposition. Post-hoc rationalization — "we missed the original metric but
look at this other one" — is the most common way teams avoid honest reckoning
[VDV §1].

### 3.2 The Frameworks That Operationalize Value Definition

| Framework | Author / Origin | Role in the stack |
|---|---|---|
| **Jobs to be Done (JTBD) / ODI** | Ulwick; Christensen | Defines value in solution-free terms; 86% success rate vs. 17% industry avg [VDV §1] |
| **Impact Mapping** | Adzic (2012) | Traces every deliverable → impact → goal; kills unmapped features [VDV §1] |
| **Opportunity Solution Trees** | Torres (2016) | Visualizes outcome → opportunities → solutions → assumption tests [VDV §1] |
| **Lean Startup / Build-Measure-Learn** | Ries (2011) | Tests value hypotheses via validated learning; experiment cards [VDV §1] |
| **North Star Metric** | Ellis; Amplitude | Single leading indicator of value; not directly movable [VDV §1] |
| **HEART + GSM** | Rodden et al. (Google, CHI 2010) | Forces multi-dimensional measurement; resists engagement over-indexing [VDV §2] |
| **OKRs** | Grove; Doerr | Outcome-based key results, quarterly cadence, divorced from comp [VDV §1] |
| **Benefits Realization Management** | Jenner (2012); AXELOS MSP | Formal benefits register, independent verification [VDV §1, §4] |
| **Working Backwards (PR/FAQ)** | Bryar & Carr (Amazon, 2021) | Upfront articulation of success + the hard questions [VDV §6] |

### 3.3 Measurement: Goodhart, Leading Indicators, and Counterfactuals

Three measurement disciplines are non-negotiable:

1. **Resist Goodhart's Law** [VDV §2]. Manheim & Garrabrant's four failure
   types — regressive, extremal, causal, adversarial (the "Cobra Effect") — all
   appear in AI tools. Countermeasures: use multiple metrics in healthy
   tension, choose metrics that require genuine behavioral change, monitor
   trends not point values, and audit when metrics move unexpectedly.

2. **Track leading before lagging indicators** [VDV §2]. A code assistant's
   "acceptance rate without modification" is a *leading* indicator that
   "PR cycle time reduction" (the *lagging* outcome) will materialize. By the
   time lagging indicators confirm failure, months are sunk.

3. **Pursue counterfactual measurement** [VDV §2]. The gold standard is a
   randomized controlled trial (as in the GitHub Copilot study: 95 developers,
   RCT, 55.8% faster on a bounded task — but with serious generalizability
   limits [VDV §6]). Where RCTs are infeasible, use difference-in-differences,
   regression discontinuity, or instrumental variables. Self-reported
   productivity gains are not evidence.

### 3.4 Accountability: Kill Criteria and Independent Evaluation

The sunk-cost fallacy is the most powerful force against honest assessment
[VDV §4]. The structural countermeasures are:

- **Kill criteria**, written *before* development, with four components —
  metric, threshold, timeframe, consequence — and a named decision owner
  [VDV §4][PFR §6]. Unsigned or vague kill criteria are not kill criteria.
- **Independent evaluation** — the building team must not be the sole measurer.
  This is a statement about structural conflict of interest, not about honesty.
- **Value realization reviews** — a structured quarterly ceremony (distinct
  from sprint review and retro) that restates the value proposition, reviews
  evidence, conducts gap analysis, and makes an explicit continue/pivot/kill
  decision [VDV §4][PFR §7].
- **Portfolio-level governance** — forces honest comparison across tools and
  makes sunsetting a pre-committed plan rather than a political judgment.

### 3.5 The Activity Trap and Behavioral Alignment Audits

The "activity trap" — a tool that is busy but not valuable — is the most
dangerous value-level failure mode for AI tools, because activity is visible
and the absence of value is invisible [VDV §3]. The diagnostic question:
*if this tool disappeared tomorrow, what would users lose?*

The **behavioral alignment audit** [VDV §3][PFR §7] is the value-level analog
of the agent-level behavioral regression test. It has three components: a
behavior inventory (what the tool *actually* does), value-proposition mapping
(which behaviors serve the promise), and gap analysis. For AI tools this is
essential because behavior can change without any code change.

---

## 4. Layer 2 — Governance: Specifying Authorized Behavior

*Primary source: [AAR §4–5]. Operationalized by [PFR §5–9].*

### 4.1 Why Agent Governance Is Different

In traditional software, behavior is determined by code; if the code is
correct, the system behaves correctly. In agent systems, behavior is determined
by the interaction of code, model, prompts, tools, and execution context —
none of which can be fully specified in advance [AAR §5.1]. Traditional
governance (code review, automated tests, deployment gates) is necessary but
insufficient. Teams need mechanisms that detect behavioral drift even when the
code is correct.

### 4.2 The Core Governance Artifacts

| Artifact | Purpose | Source |
|---|---|---|
| **Behavioral Specification Document (BSD)** | Authoritative reference for *how* the agent should behave; source of truth for prompts, evals, and audits | [PFR §8] |
| **Agent Charter** | One-page "constitution" readable by non-technical stakeholders; purpose, scope, principles, prohibitions, escalation, success/failure | [PFR §8] |
| **Kill Criteria Document** | Pre-committed stopping conditions, signed before development begins | [VDV §4][PFR §6] |
| **Behavioral ADRs (BADRs)** | Record of intent for significant behavioral decisions; distinguishes bug from feature when behavior is questioned | [AAR §5.2][PFR §8] |
| **Falsifiable Value Proposition** | The single sentence that propagates verbatim into the system prompt, BSD, and review agenda | [PFR §5] |
| **Pre-mortem** | Imagines failure in advance and generates mitigations with owners | [PFR §6] |

### 4.3 Scope Gates and the "Scope Creep by Proxy" Anti-Pattern

The signature governance anti-pattern for agent systems is **scope creep by
proxy** [AAR §7.1]: the agent's capabilities expand through accumulation of
individually reasonable changes — tool proliferation, capability expansion for
edge cases, behavioral drift from model updates, prompt accumulation. Each
change is justified by a use case; the cumulative expansion was never approved.

The countermeasure is explicit scope management at defined stage-gates
[AAR §5.3][PFR §6]: behavioral scope review, tool access review, data access
review, and output scope review at each milestone, with deviations either
formally approved (via BADR) or rolled back.

### 4.4 Review Ceremonies Adapted for Agent Behavior

Traditional sprint ceremonies must be augmented [AAR §5.4]:

- **Behavioral regression testing** at each sprint boundary — checking
  alignment, not just functional correctness.
- **Red-team reviews** at regular intervals — attempting to induce goal drift,
  specification gaming, and scope violations.
- **Alignment reviews** by team members *not* involved in the recent sprint —
  external perspective catches gradual drift invisible to the builders.
- **Incident post-mortems** that classify incidents as goal drift,
  specification gaming, or scope violation, with prevention recommendations.

### 4.5 Open-Source and Distributed Governance

Open-source agent projects face acute governance challenges: contributors
carry different understandings of the objective, and PR review is poorly suited
to evaluating behavioral alignment [AAR §5.5]. AutoGPT's drift from research
demo to unreliable "product," and the engagement-algorithm specification
gaming at YouTube/Facebook, are documented case studies of projects that lost
their original purpose [AAR §5.6]. Best practices: versioned behavioral
specifications, behavioral contribution guidelines, behavioral CI/CD on every
PR, and designated alignment maintainers distinct from technical maintainers.

---

## 5. Layer 3 — Runtime Prompts: Enforcing Alignment at Execution Time

*Primary source: [PFR Part A]. Grounded by [AAR §3–4].*

### 5.1 The Foundational Constraint: Lost in the Middle

Liu et al. (2023; TACL 2024) established that LLM performance follows a **U-shaped
curve**: models attend well to the beginning (primacy) and end (recency) of
context and systematically underweight the middle [AAR §2.5][PFR §1]. The
implication for system prompts is severe: an objective stated once at the top
of a long system prompt, after dozens of tool results have accumulated, is now
buried in the middle and statistically underweighted. This is not an
intelligence failure; it is a structural property of transformer attention.

Du et al. (2025) sharpened this: context length *alone* degrades performance
13.9–85% even with perfect retrieval, across open and closed models [AAR
§2.5]. And the memory survey (Du, 2026) identifies "summarization drift" —
rare but critical facts lost after multiple compression passes — as a specific
threat to goal retention [AAR §3.5].

### 5.2 Goal Anchoring Patterns

The prompt-level response to context degradation is a small family of named
patterns [PFR §1]:

| Pattern | Mechanism | Addresses |
|---|---|---|
| **Goal Sandwich** | Primary objective verbatim at top *and* bottom of system prompt | U-shaped attention curve |
| **Objective Echo** | Agent restates objective before each major action | Active retrieval vs. passive presence |
| **Scope Fence** | Explicit negation of prohibited actions | Implicit-scope unreliability |
| **Minimal Footprint Clause** | Resource/side-effect constraints | Instrumental convergence pressure [AAR §2.2] |
| **Constitutional self-critique** | Critique-then-revise against stated principles (Bai et al., 2022) | Goal alignment at output time |
| **Persistent objective store** | Objective retrieved from outside the context window | Compression drift [AAR §7.2] |

The recommended instruction hierarchy [PFR §1] places the primary objective in
the first and last 5 lines (primacy + recency anchors), scope fence and minimal
footprint early, operational detail in the (lower-attention) middle, and
constitutional critique principles near the end where they apply at output
time.

**Critical failure mode:** placing safety and scope constraints only in the
middle of a long system prompt. Any constraint that must be reliably followed
should appear in the first or last 20% of the prompt.

### 5.3 Drift Detection and Self-Check Loops

Three runtime patterns convert passive context into active verification:

- **ReAct + alignment verification** [PFR §2] — extends Yao et al.'s Thought →
  Action → Observation loop with OBJECTIVE/PROGRESS/ALIGNMENT/SCOPE checks
  before each action. ReAct outperformed pure CoT by 34% on ALFWorld and 10%
  on WebShop [PFR §2]. *Failure mode:* context accumulation drags growing tool
  output through every step; mitigate with observation compaction, step limits,
  and periodic goal re-injection.
- **OODA self-correction** [PFR §2] — Observe/Orient/Decide/Act as a continuous
  self-monitoring loop after each major action.
- **Uncertainty/escalation prompts** [PFR §2] — structured decision rules that
  force the agent to stop and ask on ambiguity, scope uncertainty,
  irreversibility, unexpected state, conflicting instructions, high stakes, or
  confidence below threshold. Implements Anthropic's Minimal Footprint
  Principle [AAR §4.1].

### 5.4 Eval Design as a Prompt Engineering Problem

The most important shift in eval design is from **output correctness** ("is the
answer right?") to **outcome achievement** ("did this help the user accomplish
their goal?") [PFR §3]. This maps directly onto the output/outcome/impact
hierarchy from [VDV §2]. A value-focused eval scores on a 0–4 rubric from
"DID NOT HELP" to "FULLY ENABLED," and asks for a gap analysis: what would
have been needed to reach Level 4?

Two judge methodologies carry the field:

- **LLM-as-judge** (Zheng et al., 2023) — GPT-4 as judge reaches ~80% agreement
  with human preferences, matching human-human agreement [PFR §3]. *Mandatory
  bias mitigations:* evaluate pairwise comparisons in both orders (position
  bias), explicitly instruct against verbosity bias, and never use the same
  model as both agent and judge (self-enhancement bias up to 25%).
- **G-Eval** (Liu et al., 2023) — chain-of-thought form-filling that generates
  evaluation steps before scoring; correlates higher with human judgment than
  BLEU/ROUGE [PFR §3].

**Behavioral regression tests** [PFR §3] apply the eval framework to detect
when a model update, prompt change, or context change breaks previously-passing
behaviors. They require a golden dataset — and a dataset built only from
happy-path examples cannot detect regressions in failure handling, escalation,
or scope compliance. At least 30% of cases should be "failure class" examples.

### 5.5 Meta-Prompting for Goal Fidelity

- **Reflexion** (Shinn et al., 2023) — verbal self-reflection stored in an
  episodic memory buffer and prepended to subsequent attempts; 91% pass@1 on
  HumanEval vs. GPT-4's prior 80% [PFR §4].
- **Self-consistency** (Wang et al., 2023) — sample multiple reasoning paths,
  select the most goal-aligned; +17.9% on GSM8K [PFR §4].
- **Checkpoint output prompts** — force the agent to emit its current
  understanding of the goal, state, and confidence before each major action,
  creating an auditable record.
- **Meta-alignment prompts** — the agent generates its own task-specific
  alignment checklist (failure modes, scope boundaries, escalation triggers,
  success criterion) before beginning.

### 5.6 The Alignment Trade-off: RLHF vs. Prompt-Based

A fundamental tension recurs at this layer [AAR §4.4]:

- **RLHF / Constitutional AI** embeds constraints in model weights — robust to
  context drift and prompt injection, but expensive, can introduce unexpected
  behavioral changes, and can itself be gamed if the reward model is imperfect.
- **Prompt-based alignment** is flexible and interpretable — constraints can be
  modified without retraining and the agent's reasoning is visible — but is
  subject to context drift and can be overridden by strong conflicting
  instructions.

Production systems use both: RLHF/CAI for foundational behavioral constraints,
prompt-based alignment for task-specific scope. The Claude model specification
[AAR §6.1] represents the current state of the art in this combined approach,
with its principal hierarchy (Anthropic → operators → users → agent) and the
Minimal Footprint, corrigibility, and consistency principles.

---

## 6. Layer 4 — Infrastructure: State, Memory, and Observability

*Primary source: [AAR §3, §7].*

### 6.1 Checkpointing: From Fault Tolerance to Alignment

The distinction that matters: fault-tolerant checkpointing asks "can we resume
after a crash?"; alignment-oriented checkpointing asks "is the agent still
pursuing the right goal, and can we roll back to a known-good state if it has
drifted?" [AAR §3.1]. The latter requires goal-state verification at each
checkpoint, not just state persistence.

**LangGraph** (1.0 GA, October 2025) is the most mature production checkpointing
infrastructure: checkpoints at every super-step, pluggable backends
(`PostgresSaver` for production), first-class `interrupt()` API for
human-in-the-loop workflows resumable via `Command(resume=...)`, time-travel
debugging, and state mutation. It powers agents at ~400 companies (LinkedIn,
Uber, Replit) with 8% latency overhead [AAR §3.2]. **MemGPT/Letta** provides
OS-inspired tiered memory (main context / recall DB / archival vector store)
with LLM-managed tier movement [AAR §3.3].

### 6.2 Memory Architecture as a First-Class Concern

The 2026 memory survey (Du) is unambiguous: "Memory deserves the same level of
engineering investment as the LLM itself" [AAR §3.5]. Its taxonomy spans three
dimensions:

- **Temporal scope** — working (subject to lost-in-the-middle), episodic
  (concrete experience records), semantic (abstracted knowledge; risk of
  over-generalization), procedural (reusable skills; Voyager without its skill
  library showed 15.3× slower progression).
- **Representational substrate** — context-resident text (compression drift),
  vector stores, structured stores, executable repositories.
- **Control policy** — heuristic, prompted self-control (MemGPT; risk of silent
  orchestration failures), learned/RL (AgeMem 2026; most capable, requires
  training infra).

The empirical stakes are large: Generative Agents without reflection
degenerated to repetitive responses within 48 simulated hours; on MemoryArena
(2026), active memory agents achieved 80%+ task completion versus ~45% for
long-context-only baselines [AAR §3.5].

### 6.3 Safe Stopping, Rollback, and HITL

Safe stopping criteria [AAR §3.6] are conditions where the agent halts and
requests human review rather than proceeding — distinct from error conditions:
uncertainty threshold, scope boundary, resource limit, anomaly detection, and
human review triggers. LangGraph's `interrupt()` provides the technical
mechanism; the *design* challenge is choosing when to pause, what to surface,
and how to incorporate feedback (approve / modify / rollback-and-retry / abort)
[AAR §7.3].

The cost calculus favors false positives: unnecessary human reviews are far
cheaper than undetected goal drift leading to irreversible actions.

### 6.4 Observability for Drift Detection in Production

Quantitative drift signals [AAR §7.5]: task completion rate, goal retention
score, scope violation rate, rollback rate, HITL trigger rate, and token
efficiency (useful work / total tokens — flags unproductive spinning).
Qualitative signals: execution traces, reasoning traces, state snapshots, and
anomaly detection. The decay detection dashboard [PFR §9] tiers these into
behavioral health (weekly), adoption health (weekly), and value health
(monthly), with automatic review triggers (eval pass rate drops >10% WoW, any
🔴 metric persisting 2+ weeks, model or prompt change deployed).

---

## 7. The Integration: Closing the Loop

*Primary source: [PFR Part C].*

### 7.1 The Vocabulary Bridge

The most common integration failure is **vocabulary fragmentation**: the system
prompt says "PRIMARY OBJECTIVE," the eval suite says "goal," and the value
realization review says "value delivery" — and they refer to the same thing
without anyone knowing it [PFR §10]. When language is inconsistent, no
behavioral observation can be traced to a governance decision, and no
governance decision can be translated into a prompt change.

The fix is a **shared vocabulary document** mapping each concept across system
prompt, eval, and governance terms, plus a **traceability matrix** linking
each governance decision to its prompt clause and eval test ID.

### 7.2 Verbatim Propagation of the Value Proposition

The value proposition statement from Layer 1 must appear **verbatim** in three
places [PFR §10]:

1. The system prompt — as the PRIMARY OBJECTIVE in the Goal Sandwich.
2. The Behavioral Specification Document — Section 1 (Purpose and Objective).
3. The Value Realization Review agenda — read aloud at the opening of every
   review.

This creates a direct, auditable chain from governance commitment to runtime
behavior. When the value proposition changes, all three must be updated
together, the eval suite re-run, and a Value Realization Review scheduled to
re-baseline.

### 7.3 Automated Value Reporting

Agents can be prompted to emit a structured JSON value report at the end of
each task [PFR §10]: `goal_alignment.score`, `scope_compliance`, 
`user_value_delivered.score`, `resource_usage.footprint_assessment`, and a
`requires_human_review` flag. These fields map directly to eval dimensions,
feeding the decay detection dashboard and providing evidence for Value
Realization Reviews — closing the loop between runtime behavior and governance
metrics with minimal manual data collection.

### 7.4 The Eval Suite as the Bridge

The eval suite is the load-bearing structure between Layers 2 and 3. It must
be run [PFR §10]:

- On every prompt change (before deployment).
- On every model update (before deployment).
- Weekly (as part of the decay dashboard).
- Before every Value Realization Review (as evidence).
- After every behavioral incident (to characterize the failure).

The integration protocol adds a sprint-review gate: do not demo new agent
capabilities if eval pass rate has declined from the previous sprint without
explanation. And it adds a discussion question for every Value Realization
Review: *is the relationship between eval pass rate and the primary value
metric what we expected? If not, what does that tell us about our eval design?*

---

## 8. Cross-Cutting Failure Modes

These seven failure modes recur across all layers and deserve special
attention [PFR §"Common Failure Modes"]:

1. **The Vague Objective Failure.** "Help users be more productive" is a wish,
   not an objective. Every objective must be specific enough to be falsified
   from evidence. (Layers 1, 3.)

2. **The Middle-of-Context Failure.** Any constraint stated only once in the
   middle of a long system prompt is statistically underweighted [Liu et al.].
   The Goal Sandwich addresses this; teams frequently revert to single-statement
   objectives after initial deployment. (Layer 3.)

3. **The Goodhart's Law Failure.** An agent evaluated on a metric will optimize
   for that metric in ways that may not serve the goal. Value-focused evals
   ("did this help?") and behavioral alignment audits are the primary
   mitigations. (Layers 1, 3.)

4. **The Unsigned Kill Criteria Failure.** Kill criteria without a named
   decision owner, signed before development, are suggestions. When the
   threshold is reached, teams rationalize. (Layers 1, 2.)

5. **The Eval-Governance Disconnect Failure.** Excellent eval suites never
   connected to governance decisions are evals for their own sake. The
   integration protocol closes this loop. (Layers 2, 3.)

6. **The Prompt Injection Failure.** In agentic systems reading external
   content, malicious content can override instructions. Multi-agent alignment
   prompts with explicit skepticism are necessary but must be combined with
   architectural mitigations (input sanitization, sandboxed tool execution).
   (Layer 3.)

7. **The Self-Enhancement Bias Failure.** Using the same model as both
   evaluated agent and judge inflates scores by up to 25% [Zheng et al.].
   Always use a different model (or model family) as judge. (Layer 3.)

---

## 9. Empirical Scale of the Problem

The benchmarks make clear that drift is the norm, not the edge case [AAR §2.6]:

- **WebArena** (CMU, 2024): best GPT-4 agent 14.41% task success vs. 78.24%
  human baseline. GPT-4 incorrectly flagged 54.9% of feasible tasks as
  impossible (early stopping).
- **LiveAgentBench** (Ant Group, 2026): best commercial agent (Manus) 35.29%
  vs. 69.25% human. Tool stability mattered more than model capability in many
  cases.
- **Telco-GAIA** (KAUST/stc, 2026): strongest model (claude-opus-4-8) 71%,
  falling to ~40% under moderate cost budget.
- **MemoryArena** (2026): models near-saturating LoCoMo plummeted to 40–60% on
  realistic multi-session tasks — a deep gap between passive recall and active,
  decision-relevant memory.

On the value side, the GitHub Copilot RCT (55.8% faster on a bounded task) is
the *most* rigorous AI-productivity study available, and its generalizability
is sharply limited — most AI tool value claims rest on far weaker evidence
[VDV §6].

The asymmetry that should worry every team: **agent capability is advancing
faster than alignment and oversight tooling** [AAR §9.7]. The gap between what
agents can do and what teams can safely deploy and oversee is growing.

---

## 10. Unresolved Tensions

The synthesis does not resolve these; it inherits them.

- **Autonomy vs. controllability** [AAR §9.1] — more autonomy enables more
  capability but increases drift risk; more oversight reduces drift but limits
  independent task completion. Devin (autonomous) vs. Copilot Workspace (HITL)
  are different points on one trade-off curve, not a resolution.
- **Causation vs. correlation** [VDV §9] — RCTs are the gold standard but often
  infeasible for internal tools and AI tools whose behavior changes over time.
  Quasi-experimental methods require strong assumptions frequently violated.
- **Specification completeness vs. flexibility** [AAR §9.2] — a complete spec
  would eliminate gaming, but the space of possible situations is too large to
  enumerate and intent is context-dependent.
- **Memory completeness vs. governance** [AAR §9.3] — comprehensive memory
  aids goal retention but creates privacy, retention, and staleness problems.
- **Soft value** [VDV §9] — reduced cognitive load, improved decision quality,
  enhanced creativity are real and important but expensive to measure and
  systematically underweighted, biasing investment toward easily measurable
  value.
- **Equity** [VDV §7, §9] — AI tools deliver value unevenly; power users
  extract far more than average users. Aggregate measurement hides this.
  Disaggregating is technically straightforward but organizationally
  uncomfortable.
- **Organizational politics** [VDV §9] — the most rigorous framework in the
  world fails if the culture does not support honest reckoning with negative
  results. Stopping is career-limiting in most organizations. Structural
  countermeasures help; building the culture is a leadership challenge, not a
  measurement challenge.
- **Multi-stakeholder value** [VDV §9] — end users, managers, executives, and
  IT/security have conflicting value definitions; optimizing for one
  stakeholder can reduce value for another. This is acute for agent systems
  with provider/operator/user principal hierarchies (per the Claude principal
  hierarchy cited in §5.6). Most frameworks optimize a single primary
  stakeholder.
- **Temporal dynamics** [VDV §9] — value delivery is not static: tools that
  deliver value today may not tomorrow, and tools that don't today may later.
  Current frameworks largely measure at a point in time. The decay-detection
  approaches in §6.4 address part of this, but robust temporal modeling of
  value is an open problem.

*Selection note: the tensions above are those that recur across at least two
of the three sources. VDV's full open-problem list is longer; see [VDV §9].*

---

## 11. Minimum Viable Adoption (One Week)

A team can adopt the highest-leverage subset in one week [PFR §"Quick Start"].
These items address the most common and most severe failure modes across all
layers:

| Day | Artifact | Layer | Time |
|---|---|---|---|
| 1 | Falsifiable Value Proposition | 1 | 2h |
| 2 | Kill Criteria + Agent Charter | 1–2 | 2h |
| 3 | Goal Sandwich system prompt (objective + scope fence + minimal footprint + escalation triggers) | 3 | 2h |
| 4 | 10 eval test cases (5 happy-path, 3 scope-boundary, 2 drift) | 3 | 3h |
| 5a | First Value Realization Review scheduled (90 days out) | 1 | 30min |
| 5b | Decay detection dashboard stood up (Layer 4) | 4 | 30min–½ day |

The Day 5b estimate varies: 30 minutes if the value and behavioral metrics
are already instrumented; up to half a day if instrumentation must be built.
Do not skip the dashboard — without it, drift cannot be detected before
lagging outcome metrics confirm it (see §6.4).

The Day 1 deliverable is the keystone: if the team cannot agree on the single
falsifiable value-proposition sentence, *the disagreement is the most
important discovery of the week*. Do not proceed past Day 1 until it is
resolved.

---

## 12. Conclusion

The three source documents, read together, describe one closed-loop system for
anchoring behavior to intent:

- **[VDV]** supplies the *why* and the *whether*: what value was promised, to
  whom, and how do we know if it was delivered? It is the outermost loop, the
  one that ultimately determines whether any of the inner work mattered.
- **[AAR]** supplies the *how* at the system level: the technical and
  governance mechanisms that keep an agent aligned with its objective across
  long-horizon execution, and the organizational practices that keep a team
  aligned with its original vision.
- **[PFR]** supplies the *what*: the actual words in the system prompt, the
  template the team fills out, the agenda the review follows — and, critically,
  the integration patterns (shared vocabulary, traceability, verbatim
  propagation, automated value reporting) that bind the three layers into one
  auditable system.

The unifying claim is modest and empirical: **drift is the default**. Without
structured, repeatable mechanisms operating at every layer and bound together
by a shared vocabulary, agents will drift from their goals and teams will drift
from their value propositions — and both will report success while doing so,
because the metrics they optimize will have become the target rather than the
measure. The countermeasure is not a single technique but a closed loop in
which every governance decision has a prompt clause, every prompt clause has an
eval test, and every eval result is reviewed against the original value
proposition on a cadence shorter than the half-life of drift.

Readers who want to act rather than only understand should start with the
one-week adoption playbook in §11.

---

## Appendix A — Source Document Map

| Source | Full title | Primary scope | Approx. length |
|---|---|---|---|
| **[VDV]** | *Ensuring That a Tool, Agent, or System Delivers the Value It Proposes — A Comprehensive Framework* | Value definition, measurement, accountability, AI-specific considerations | 9 sections, ~37 refs |
| **[AAR]** | *Agentic Development Alignment and Checkpointing: Preventing Goal Drift in AI Agent Systems* | Goal drift mechanics, technical checkpointing, alignment techniques, team governance, lab frameworks | 10 sections, ~30 refs |
| **[PFR]** | *Prompt Engineering and Structured Frameworks for Agent Goal Alignment and Value Delivery Verification* | Agent-level prompts, governance templates, integration patterns, quick-start | 10 sections + quick start, ~19 refs |

## Appendix B — Key References (Consolidated)

*Section-level citations of the form `[VDV §N]`, `[AAR §N]`, `[PFR §N]`
resolve within the named source's own bibliography; the entries below list the
underlying works most often cited through those sections.*

**Value & product frameworks**
- Ulwick / Christensen — Jobs to be Done / Outcome-Driven Innovation (Strategyn)
- Adzic — *Impact Mapping* (2012)
- Torres — *Continuous Discovery Habits* / Opportunity Solution Trees (2021)
- Ries — *The Lean Startup* (2011)
- Rodden, Hutchinson, Fu — HEART framework (Google, CHI 2010)
- Amplitude — North Star Metric / Playbook
- Doerr — *Measure What Matters* (OKRs)
- Bryar & Carr — *Working Backwards* (Amazon, 2021)
- Jenner — *Managing Benefits* (BRM, 2012); AXELOS MSP
- Davis — Technology Acceptance Model (1989); DeLone & McLean IS Success Model (1992/2003)
- Rother & Shook — *Learning to See* (Value Stream Mapping, 1998)
- Singer — *Shape Up* (Basecamp, 2019)

**Agent alignment & safety**
- Bostrom / Omohundro — Instrumental convergence; paperclip maximizer
- Krakovna et al. — Specification gaming (DeepMind, 2020)
- Liu et al. — "Lost in the Middle" (TACL 2024, arXiv:2307.03172)
- Du et al. — "Context Length Alone Hurts LLM Performance" (2025, arXiv:2510.05381)
- Du — "Memory for Autonomous LLM Agents" (2026, arXiv:2603.07670)
- Zhou et al. — WebArena (2024, arXiv:2307.13854)
- LiveAgentBench (2026, arXiv:2603.02586); Telco-GAIA (2026, arXiv:2607.20510)
- Packer et al. — MemGPT (2023, arXiv:2310.08560)
- Park et al. — Generative Agents (2023, arXiv:2304.03442)
- Anthropic — Claude Model Specification; Constitutional AI (Bai et al., arXiv:2212.08073)
- GitHub Copilot RCT — Peng et al. (2022); METR evaluation research (2024)

**Prompt engineering & evaluation**
- Yao et al. — ReAct (2022, arXiv:2210.03629); Tree of Thoughts (2023, arXiv:2305.10601)
- Shinn et al. — Reflexion (2023, arXiv:2303.11366)
- Wang et al. — Self-Consistency (2023, arXiv:2203.11171)
- Zheng et al. — LLM-as-a-Judge / MT-Bench (2023, arXiv:2306.05685)
- Liu et al. — G-Eval (2023, arXiv:2303.16634)
- Zhang — Constitutional AI on Llama 3-8B (2025, arXiv:2504.04918)
- Strategyzer — Value Proposition Canvas; Experiment Cards
- OpenAI — Evals framework
- LangChain — LangGraph persistence/checkpointing documentation
