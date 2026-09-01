---
title: Engineering Autonomous Agent Tickets - Structuring Verifiable Value Claims for AI-Driven Software Development
type: research
subtype: paper
tags: [agentic-engineering, requirements-engineering, planguage, verifiable-value-claims, design-by-contract, spec-driven-development, negative-constraints, verification-harness]
tools: [claude-code, aider, cursor, gemini]
status: draft
created: 2026-09-01
updated: 2026-09-01
version: 1.0.0
related: [prompt-task-create-issues.md, prompt-workflow-create-plan.md, prompt-task-edge-case-discovery.md, prompt-task-specification-review.md, prompt-task-testability-implementability-evaluator.md, research-paper-specification-testability-implementability.md]
source: synthesis
---

# Engineering Autonomous Agent Tickets: Structuring Verifiable Value Claims for AI-Driven Software Development

## Summary

The paper argues that autonomous coding agents fail predictably on ambiguous, qualitative user stories (vibe coding, specification drift, structural degradation, reward hacking) and that the software issue ticket must evolve into an executable, machine-verifiable specification. Its central contribution is the **Verifiable Value Claim**: a ticket formalization combining Tom Gilb's Planguage metrics, Design by Contract invariants, explicit negative constraints, and a dual-suite (Fail-to-Pass / Pass-to-Pass) verification harness the agent runs autonomously inside a sandbox until all gates pass.

## Context

Human-centric requirements rely on implicit domain knowledge, shared team context, and post-hoc human review. Autonomous LLM agents have none of these: they operate on explicit context windows, pattern-match from training data, and optimize relentlessly against whatever evaluation function is provided. The research question: what ticket structure converts an open-ended prompt into a bounded optimization problem that produces deterministic, verifiable outcomes without degrading codebase integrity?

## Hypothesis / Question

Main claim: if a ticket specifies intent as a machine-evaluable predicate over system state and environment — with quantified thresholds, contract invariants, anti-goals, and an executable verification script — then an autonomous agent can converge to compliant implementations without human review, while avoiding reward hacking and structural debt.

## Method

Literature synthesis across requirements engineering (Planguage, GORE), formal methods (Design by Contract, Agent Behavioral Contracts), spec-driven development practices (SDD/EARS), agentic evaluation benchmarks (SWE-bench, AutoBuilder), and empirical studies of agent code quality (code-smell rates, security flaw introduction, ABC contract compliance). Findings are operationalized into a ticket template plus a four-phase `verify.sh` harness.

## Results

### Key Findings

1. **The translation gap is the primary failure source.** Qualitative goals ("make checkout faster") leave agents without intrinsic domain judgment, yielding fragile, unmaintainable code. Unconstrained agents generate ~63% more code smells than human developers and frequently introduce MITRE Top-25 CWE vulnerabilities.
2. **Verifiable Value Claims require eight Planguage parameters:** Tag (hierarchical identifier for traceability), Gist (unambiguous intent statement), Scale (unit of measure + scope), Meter (executable measurement command), Past (measured baseline), Must (hard pass/fail acceptance gate), Plan (convergence target for optimization loops), and Defined Context (hardware, platform, load, and data configuration for the Meter). This transforms a subjective goal `g` into a logical predicate φ evaluated over system state `S` and environment `E`.
3. **Four complementary verification frameworks cover distinct failure surfaces:**
   - *BDD/SBE* — functional interface behavior (Given/When/Then); weak on internal structure; vulnerable to assertion gaming.
   - *Design by Contract / Agent Behavioral Contracts* — tuple (𝒫 preconditions, ℐ_hard safety invariants, 𝒬 governance rules, ℛ recovery strategies). Contracted agents detect 5.2–6.8 soft violations per session that uncontracted baselines miss, with near-100% hard-safety compliance.
   - *Spec-Driven Development (SDD/EARS)* — versioned specs as source of truth over a Specify→Plan→Task→Implement lifecycle; 3–10× higher first-pass success rates vs. ad-hoc prompting; risks context saturation from verbose specs.
   - *Hypothesis-Driven / Autoresearch loops* — scalar-metric optimization (edit → measure → keep/rollback); optimal for performance tuning; risks benchmark overfitting.
4. **Negative constraints are mandatory, not optional.** Anti-goals mapped to Gilb's Theory of Guides prevent the destructive optimizations agents default to: test-assertion manipulation, public-interface breakage, unapproved dependency additions, complexity-ceiling breaches, and cross-layer imports.
5. **Dual-test patch methodology (from SWE-bench):** a Fail-to-Pass suite (fails on baseline, passes on solution) plus a Pass-to-Pass regression suite (passes on both) gives unambiguous functional acceptance; static analysis (complexity, security, contracts) and benchmark telemetry parsing complete the four-phase closed loop.
6. **Sandboxing and state checkpointing are prerequisites for autonomous trial loops:** ephemeral containers with restricted network/filesystem, git checkpointing before each trial for rollback, and pre-execution classification of shell commands to intercept destructive operations.

### The Proposed Ticket Structure

The paper's production template ([ISSUE-742] checkout-latency optimization) orders sections as:

1. Agent operational metadata (editable vs. read-only scope, context file references)
2. Verifiable Value Claim (Planguage formalization: Tag, Gist, Scale, Meter, Past=450ms, Must≤250ms, Plan≤180ms, Defined Context)
3. Design-by-Contract block (preconditions, postconditions, hard invariants: data integrity, PAN-never-logged, memory ceiling)
4. Anti-goals & negative constraints (no test edits, no isolation-level changes, no new dependencies, complexity ≤ 10)
5. Acceptance criteria as Gherkin scenarios (happy path + payment-timeout failure path)
6. Automated verification hooks (four sequential steps, all must exit 0)
7. Self-repair protocol (parse failure JSON → localize → revert on hard-invariant breach → re-run → submit only on VERIFICATION SUCCESSFUL)

## Analysis

The paper's core insight aligns with this repository's philosophy: **the agent optimizes against whatever is verifiable, so the specification must own the verification**. A ticket that cannot be executed is a suggestion, not a contract. Three implications for prompt design:

- Quantification converts negotiation into evaluation. "Must ≤ 250 ms" removes the human from the acceptance loop; the Meter, not a reviewer, decides.
- Contracts encode the unstated. Humans assume engineers won't delete tests to go green; agents have no such prior, so prohibitions must be explicit and ticket-scoped.
- Negative constraints encode the unstated. Humans assume engineers won't delete tests to go green; agents have no such prior, so prohibitions must be explicit and ticket-scoped.
- Verification harnesses are prompts in disguise. A `verify.sh` with four deterministic phases is a more reliable instruction artifact than any prose paragraph, because the agent's loop terminates on exit code 0 rather than on vibes.

The DbC/ABC empirical numbers (5.2–6.8 soft violations caught per session) suggest the invariant layer catches what functional tests cannot: structural and safety violations invisible to pass/fail assertions.

## Practical Applications

- **Ticket authoring**: use `prompt-task-create-issues.md` with the eight Planguage parameters and the seven-section template; every ticket must name its Meter command and Must threshold.
- **Edge-case and constraint coverage**: pair with `prompt-task-edge-case-discovery.md` to derive the hard invariants and anti-goals (timeout paths, lock release, resource ceilings).
- **Specification review**: `prompt-task-specification-review.md` can audit tickets for verifiability — is the Scale measurable, the Meter executable, the Must falsifiable, the context deterministic?
- **Session discipline**: the Self-Repair Protocol maps directly to per-ticket TDD→fix→verify→commit pipelines; revert-on-invariant-breach is a `git checkout -- .` away.
- **Distilled skills**: the four-framework table is a decision matrix for choosing verification depth per ticket type (functional → BDD; safety-critical → DbC; multi-file → SDD; performance → HDD).

## Limitations

- The source document is a synthesis with citation markers; several empirical claims (63% code-smell increase, 3–10× SDD success rates, 5.2–6.8 violations/session) are cited to arXiv preprints of varying review maturity.
- The template targets Python/pytest ecosystems (radon, bandit, mypy, deal); porting to other stacks requires re-deriving the Meter and static-analysis phases.
- Planguage parameter values in one table were inline images in the source; the 450/250/180 ms figures here are taken from the paper's own ticket template.
- No longitudinal data on developer overhead: writing eight-parameter tickets with executable Meters is expensive; the paper does not measure the break-even ticket count or codebase size.
- Sandbox and pre-execution gate claims (e.g., routing commands through a fast classifier model) are architectural recommendations, not benchmarked results.

## Related Prompts

- [prompt-task-create-issues.md](prompt-task-create-issues.md) - ticket generation; adopt the Verifiable Value Claim structure
- [prompt-workflow-create-plan.md](prompt-workflow-create-plan.md) - SDD-style Specify→Plan→Task→Implement phasing
- [prompt-task-edge-case-discovery.md](prompt-task-edge-case-discovery.md) - derives the hard invariants and anti-goals
- [prompt-task-specification-review.md](prompt-task-specification-review.md) - review gate for ticket verifiability
- [prompt-task-testability-implementability-evaluator.md](prompt-task-testability-implementability-evaluator.md) - complements the Meter/Must design

## References

- Agent-generated code maintenance: https://arxiv.org/html/2605.06464v2
- Agent Behavioral Contracts: https://arxiv.org/html/2602.22302v1
- Spec-Driven Development overview: https://www.glukhov.org/app-architecture/documentation/what-is-spec-driven-development/
- SDD in the age of agentic AI: https://medium.com/@sezenerdem/spec-driven-development-in-the-age-of-agentic-ai-orchestrating-determinism-37011ba58e62
- Planguage (Gilb): https://www.modernanalyst.com/Resources/Articles/tabid/115/ID/2926/Specifying-Quality-Requirements-With-Planguage.aspx
- SWE-bench (F2P/P2P methodology): https://www.swebench.com/SWE-bench/
- Context files for agentic coding: https://arxiv.org/html/2511.12884v1
- Ten Simple Rules for AI-Assisted Coding: https://arxiv.org/html/2510.22254v1

## Future Research

- Measure ticket-authoring overhead vs. rework saved across a real multi-week agentic project.
- Generalize the verify.sh harness beyond Python (Go, Rust, Julia stacks) and into the repository's `just`-based command convention.
- Test whether LLM-generated Planguage parameters (auto-drafted Must/Plan from telemetry) match human-set thresholds.
- Evaluate anti-goal phrasing: which formulations of negative constraints most reliably suppress assertion gaming?
- Integrate the ABC tuple (𝒫, ℐ_hard, 𝒬, ℛ) into a distilled skill for runtime-contract generation.

## Version History

- 1.0.0 (2026-09-01): Initial version from source document
