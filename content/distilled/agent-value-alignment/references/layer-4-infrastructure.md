# Layer 4 — Infrastructure: State, Memory, and Observability

**Question:** How is state preserved, memory managed, and drift observed in production?

## Checkpointing: fault tolerance vs. alignment

- **Fault-tolerant checkpointing** asks: "can we resume after a crash?"
- **Alignment-oriented checkpointing** asks: "is the agent still pursuing the right goal, and can we roll back to a known-good state if it has drifted?"

The latter requires **goal-state verification at each checkpoint**, not just state persistence.

**LangGraph** (1.0 GA, Oct 2025) is the most mature production option: checkpoints at every super-step, pluggable backends (`PostgresSaver` for production), first-class `interrupt()` API for HITL resumable via `Command(resume=...)`, time-travel debugging, state mutation. Powers agents at ~400 companies (LinkedIn, Uber, Replit) with 8% latency overhead. **MemGPT/Letta** provides OS-inspired tiered memory (main context / recall DB / archival vector store) with LLM-managed tier movement.

Caveat: OpenAI Agents SDK and AutoGen lack native durable execution — teams must add Temporal/DBOS. Google ADK loses in-memory session state on Cloud Run restarts. Configure persistent storage from day one; retrofitting is significantly harder.

## Memory architecture as a first-class concern

"Memory deserves the same level of engineering investment as the LLM itself" (Du, 2026). Three dimensions:

- **Temporal scope** — working (subject to lost-in-the-middle), episodic (concrete experience records), semantic (abstracted knowledge; over-generalization risk), procedural (reusable skills; Voyager without its skill library showed 15.3× slower progression).
- **Representational substrate** — context-resident text (compression drift), vector stores, structured stores, executable repositories.
- **Control policy** — heuristic, prompted self-control (MemGPT; silent orchestration failure risk), learned/RL (e.g., AgeMem, per Du 2026; most capable, requires training infra).

Empirical stakes: Generative Agents without reflection degenerated to repetitive responses within 48 simulated hours; on MemoryArena (2026), active memory agents achieved 80%+ task completion vs. ~45% for long-context-only baselines. Models near-saturating LoCoMo plummet to 40–60% on MemoryArena — a deep gap between passive recall and active, decision-relevant memory.

## Safe stopping, rollback, and HITL

Safe stopping criteria (distinct from error conditions): uncertainty threshold, scope boundary, resource limit, anomaly detection, human review trigger. LangGraph's `interrupt()` provides the mechanism; the *design* challenge is choosing when to pause, what to surface, and how to incorporate feedback: approve / modify / rollback-and-retry / abort.

**Cost calculus favors false positives:** unnecessary human reviews are far cheaper than undetected goal drift leading to irreversible actions. Configure HITL at all irreversible action boundaries.

## Observability for drift detection

**Quantitative signals:** task completion rate, goal retention score, scope violation rate, rollback rate, HITL trigger rate, token efficiency (useful work / total tokens — flags unproductive spinning).

**Qualitative signals:** execution traces, reasoning traces, state snapshots, anomaly detection.

**Decay detection dashboard** tiers these into:
- Behavioral health (weekly) — eval pass rate, goal achievement, scope violations, escalations, errors.
- Adoption health (weekly) — WAU, tasks/user, retention, satisfaction.
- Value health (monthly) — primary value metric, cost/task, cost/user.

**Automatic review triggers:** eval pass rate drops >10% week-over-week; any red metric persists 2+ weeks; model or prompt change deployed (re-run full eval suite).

## AUDIT checks

- [ ] Checkpointing is alignment-oriented (goal-state verification, not just resume).
- [ ] Persistent backend configured from day one (not in-memory in production).
- [ ] Memory architecture is a deliberate choice across all three dimensions, not an afterthought.
- [ ] HITL interrupts configured at all irreversible action boundaries.
- [ ] Tracing/observability deployed before production (LangSmith or equivalent).
- [ ] Decay detection dashboard exists with the three tiers and automatic triggers.
- [ ] Full eval suite re-runs on every model/prompt change.

## ESTABLISH (Day 5)

- Day 5a (30 min): Schedule the first Value Realization Review for 90 days out.
- Day 5b (30 min – ½ day): Stand up the decay detection dashboard. *30 min only if metrics are already instrumented; up to half a day if instrumentation must be built.* Do not skip — without it, drift cannot be detected before lagging outcome metrics confirm it.
