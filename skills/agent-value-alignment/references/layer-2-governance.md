# Layer 2 — Governance: Specifying Authorized Behavior

**Question:** What behavior is authorized, prohibited, and escalated — and who reviews it?

## Why agent governance is different

In traditional software, behavior = code; correct code ⇒ correct behavior. In agent systems, behavior emerges from code × model × prompts × tools × execution context — none fully specifiable in advance. Traditional governance (code review, automated tests, deploy gates) is necessary but insufficient. You need mechanisms that detect behavioral drift *even when the code is correct*.

## Core artifacts

| Artifact | Purpose |
|---|---|
| **Behavioral Specification Document (BSD)** | Authoritative reference for *how* the agent should behave; source of truth for prompts, evals, audits. Covers: purpose, authorized behaviors, prohibited behaviors, escalation criteria, behavioral principles, success metrics, known limitations/edge cases. |
| **Agent Charter** | One-page "constitution" readable by non-technical stakeholders: purpose, scope, principles, prohibitions, escalation, success/failure criteria, governance. |
| **Kill Criteria Document** | Pre-committed stopping conditions, signed before development (see Layer 1). |
| **Behavioral ADRs (BADRs)** | Record of intent for significant behavioral decisions — context, decision, options, rationale, consequences, implementation. Distinguishes bug from feature when behavior is questioned. |
| **Falsifiable Value Proposition** | Propagates verbatim into BSD §1, system prompt, and review agenda (see Integration). |
| **Pre-mortem** | Imagine failure in advance; generate mitigations with owners. |

## The "scope creep by proxy" anti-pattern

The signature governance failure for agents: capabilities expand through accumulation of *individually reasonable* changes — tool proliferation, edge-case capability expansion, behavioral drift from model updates, prompt accumulation. Each change is justified by a use case; the cumulative expansion was never approved. Hard to detect in real time.

**Countermeasure:** explicit scope gates at defined milestones — behavioral scope, tool access, data access, output scope reviews — with deviations either formally approved (via BADR) or rolled back.

## Review ceremonies (augment traditional sprints)

- **Behavioral regression testing** at each sprint boundary — checks alignment, not just functional correctness.
- **Red-team reviews** at regular intervals — attempt to induce goal drift, specification gaming, scope violations.
- **Alignment reviews** by team members *not* in the recent sprint — external perspective catches gradual drift invisible to builders.
- **Incident post-mortems** that classify incidents as goal drift / specification gaming / scope violation, with prevention recommendations. Treat agent behavior incidents with the rigor of security incidents.

## Open-source / distributed governance

Contributors carry different understandings of the objective; PR review is poorly suited to evaluating behavioral alignment. Best practices: versioned behavioral specs, behavioral contribution guidelines, behavioral CI/CD on every PR, designated *alignment maintainers* distinct from technical maintainers.

## Multi-agent systems

If the target is a multi-agent system (orchestrator/worker hierarchies), the
single-agent checklists are necessary but not sufficient — drift can occur at
four levels invisible to per-agent review: **orchestrator drift** (task
decomposition diverges from the objective), **worker drift** (a worker
diverges from its sub-task), **coordination drift** (orchestrator–worker
interaction diverges), and **emergent drift** (collective behavior diverges
in ways not visible at the individual level).

**Additional AUDIT checks for multi-agent targets:**
- [ ] Every worker sub-task has an explicit, verifiable specification (not a
      high-level instruction) and a defined success criterion.
- [ ] The orchestrator verifies worker results against the sub-task spec before
      incorporating them.
- [ ] Cross-agent consistency checks exist (outputs of different workers are
      consistent with each other and the overall objective).
- [ ] HITL review is configured at both orchestrator (task decomposition) and
      worker (sub-task execution) levels.

See the synthesis §5.6 for the orchestrator/worker alignment patterns and the
multi-agent alignment prompts.

## AUDIT checks

- [ ] BSD exists and is version-controlled with the same rigor as code.
- [ ] Agent Charter exists (≤1 page, readable by non-technical stakeholders).
- [ ] Prohibited behaviors are explicit (negation), not implicit.
- [ ] Escalation triggers are specific (not "when uncertain" but the 7 named triggers — see Layer 3).
- [ ] Scope gates exist at milestones; deviations require BADR.
- [ ] Behavioral regression tests run at sprint boundaries.
- [ ] Red-team reviews occur on a cadence.
- [ ] *(Multi-agent only)* Sub-task specs, result verification, and cross-agent
      consistency checks exist (see Multi-agent systems above).

## ESTABLISH (Day 2)

- Day 2 (1h): Write the Agent Charter (≤1 page). Draft the BSD (can be expanded later, but purpose/scope/prohibitions/escalation must exist from day one).
