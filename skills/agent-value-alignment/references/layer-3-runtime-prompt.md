# Layer 3 — Runtime Prompt: Enforcing Alignment at Execution Time

**Question:** Do the runtime instructions actually anchor behavior to the objective — and are they verified?

## The foundational constraint: lost in the middle

LLM performance follows a **U-shaped curve**: models attend well to the beginning (primacy) and end (recency) of context and systematically underweight the middle (Liu et al., 2023; TACL 2024). Context length *alone* degrades performance 13.9–85% even with perfect retrieval (Du et al., 2025). An objective stated once at the top of a long system prompt, after tool results accumulate, is buried in the middle and statistically underweighted. This is structural, not an intelligence failure.

## Goal-anchoring patterns

| Pattern | Mechanism | Addresses |
|---|---|---|
| **Goal Sandwich** | Primary objective verbatim at top *and* bottom of system prompt | U-shaped attention |
| **Objective Echo** | Agent restates objective before each major action | Active retrieval vs. passive presence |
| **Scope Fence** | Explicit negation of prohibited actions | Implicit-scope unreliability |
| **Minimal Footprint Clause** | Resource/side-effect constraints | Instrumental convergence pressure |
| **Constitutional self-critique** | Critique-then-revise against stated principles (Bai et al., 2022) | Goal alignment at output time |
| **Persistent objective store** | Objective retrieved from outside the context window | Compression/summarization drift |

**Instruction hierarchy:** primary objective in first and last 5 lines; scope fence + minimal footprint early; operational detail in the (lower-attention) middle; constitutional critique principles near the end. Any constraint that must be reliably followed appears in the first or last 20% of the prompt.

**Critical failure mode:** placing safety/scope constraints only in the middle of a long prompt.

## Drift detection and self-check loops

- **ReAct + alignment verification** — extend Thought → Action → Observation with OBJECTIVE/PROGRESS/ALIGNMENT/SCOPE checks before each action. (ReAct outperformed pure CoT by 34% on ALFWorld.) *Failure mode:* context accumulation; mitigate with observation compaction, step limits, periodic goal re-injection.
- **OODA self-correction** — Observe/Orient/Decide/Act as a continuous self-monitoring loop after each major action.
- **Uncertainty/escalation prompts** — structured decision rules forcing stop-and-ask on: ambiguity, scope uncertainty, irreversibility, unexpected state, conflicting instructions, high stakes, confidence below threshold. Implements Anthropic's Minimal Footprint Principle.

## Eval design — the most important shift

From **output correctness** ("is the answer right?") to **outcome achievement** ("did this help the user accomplish their goal?"). A value-focused eval scores 0–4 (DID NOT HELP → FULLY ENABLED) and requires a gap analysis: what would reach Level 4?

**Judges:**
- **LLM-as-judge** (Zheng et al., 2023) — ~80% agreement with humans, matching human-human. *Mandatory mitigations:* evaluate pairwise in both orders (position bias); instruct against verbosity bias; **never use the same model as both agent and judge** (self-enhancement bias up to 25%).
- **G-Eval** (Liu et al., 2023) — chain-of-thought form-filling; generates evaluation steps before scoring.

**Behavioral regression tests** detect when a model/prompt/context change breaks previously-passing behavior. Require a golden dataset with ≥30% "failure class" examples (inputs that should trigger escalation/refusal/scope denial) — happy-path-only suites cannot detect regression in failure handling.

## Meta-prompting for goal fidelity

- **Reflexion** (Shinn et al., 2023) — verbal self-reflection in an episodic buffer, prepended to retries; 91% pass@1 on HumanEval vs. GPT-4's prior 80%.
- **Self-consistency** (Wang et al., 2023) — sample multiple reasoning paths, select the most goal-aligned; +17.9% on GSM8K.
- **Checkpoint output prompts** — force the agent to emit current goal/state/confidence before each major action (auditable record).
- **Meta-alignment prompts** — agent generates its own task-specific checklist before beginning.

## The alignment trade-off

- **RLHF / Constitutional AI** — embeds constraints in weights; robust to drift/injection; expensive, can be gamed if reward model is imperfect.
- **Prompt-based** — flexible, interpretable; subject to drift, overridable.

Production uses both: RLHF/CAI for foundational constraints, prompt-based for task-specific scope. The Claude model specification (principal hierarchy: Anthropic → operators → users → agent; Minimal Footprint, corrigibility, consistency) is the current state of the art.

## AUDIT checks

- [ ] Objective appears verbatim at top *and* bottom (Goal Sandwich); identical wording.
- [ ] Prohibited actions are explicit negations, not implicit.
- [ ] Minimal Footprint clause present.
- [ ] Escalation triggers are the 7 named types, not "when uncertain."
- [ ] Eval suite measures outcome achievement, not just output correctness.
- [ ] Golden dataset includes ≥30% failure-class examples.
- [ ] LLM-as-judge uses a *different* model than the evaluated agent.
- [ ] Behavioral regression tests run on every prompt/model change.

## ESTABLISH (Day 3–4)

- Day 3 (2h): Implement Goal Sandwich + Scope Fence (≥5 prohibited) + Minimal Footprint + Escalation Triggers. This is the minimum viable goal-anchoring prompt.
- Day 4 (3h): Write 10 eval cases — 5 happy-path, 3 scope-boundary, 2 drift. Run manually; fix failures before deploy.
