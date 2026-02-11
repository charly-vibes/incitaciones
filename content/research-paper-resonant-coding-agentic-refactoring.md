---
title: Resonant Coding - From Vibe Coding to Agentic Refactoring
type: research
subtype: paper
tags: [resonant-coding, vibe-coding, agentic-engineering, refactoring, context-engineering, abstraction, control-loop, humanlayer]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-02-10
updated: 2026-02-10
version: 1.1.0
related: [research-paper-cognitive-architectures-for-prompts.md, prompt-workflow-design-in-practice.md, research-design-in-practice-methodology.md]
source: synthesis
---

# Resonant Coding: From Vibe Coding to Agentic Refactoring Through Structured Agent Skills

## Summary

A synthesis of the "Resonant Coding" methodology that bridges the velocity of vibe coding with the rigor of agentic engineering. Proposes three agent skills (Abstraction Miner, Context Guardian, Resonant Refactor) built on cybernetic control loops, HumanLayer safety protocols, and advanced context engineering. Intended as a conceptual framework and precursor to concrete prompt deliverables for the incitaciones repository.

## Glossary

| Term | Operational Definition |
|------|----------------------|
| **Resonance** | Measurable alignment between a code unit and the system's established patterns (quantified via reuse ratio, duplication clusters, lint pass rate) |
| **Golden Standard** | The combination of AGENTS.md rules, canonical exemplar files, and lint/test gates that define "correct" for a project |
| **Control Loop** | An Observe → Orient → Decide → Act cycle (OODA) applied to code quality regulation; the agent scans, compares against the Golden Standard, and acts to reduce deviation |
| **Constructive Interference** | New code that increases the value of existing abstractions (measured by reuse ratio trending upward) |
| **Low Entropy** | A codebase state where duplication clusters are minimal and architectural consistency is high |
| **Context Pack** | The structured set of instructions, exemplars, and retrieval results injected into the LLM's context window to constrain output quality |

## Context

Vibe coding (Karpathy, 2025) democratized software creation through natural language-driven LLM code generation, but produced massive technical debt: semantic duplication, lack of abstraction, and architectural drift. The question is not whether LLMs can produce excellent code — they are trained on excellent examples — but how to constrain their stochastic output away from median-quality generation toward architecturally consistent solutions. This research synthesizes the theoretical framework and practical skills needed for that transition.

## Hypothesis / Question

Can structured agent skills, built on cybernetic control loops and context engineering, improve the likelihood that LLMs produce architecturally consistent, abstraction-rich code instead of the verbose, duplicative output that characterizes unguided vibe coding?

## Method

Synthesis of three complementary frameworks applied to LLM-assisted refactoring, drawing from:

- Andrej Karpathy's "Vibe Coding" concept and subsequent "Agentic Engineering" framing
- Addy Osmani's practitioner analysis of AI-assisted vs vibe coding workflows
- The HumanLayer protocol for human-in-the-loop agent safety
- Context engineering surveys (arXiv:2507.13334)
- The incitaciones repository's existing research on cognitive architectures and design-in-practice methodology

### 1. The Vibe Coding Paradox

Vibe coding optimizes for local correctness within the current context window. LLMs, being probabilistic engines, tend to generate token sequences that correspond to common patterns from their training corpus — which often means average-quality code rather than highly abstracted, architecturally elegant solutions (observed tendency; see Osmani's analysis and arXiv:2510.12399). Without architectural constraints, each generation episode can be "amnesic": the model may assume a greenfield environment when context is incomplete, reinventing patterns and duplicating logic.

**Three failure modes identified:**

- **Semantic Duplication:** Multiple functions with identical intent but different syntax (DRY violations)
- **Abstraction Absence:** Hardcoded values and inline logic replacing reusable components
- **Architectural Drift:** New features diverging from established design patterns

### 2. Resonance as a Quality Framework

Borrowing metaphorically from physics, "resonance" describes the alignment between a code unit and the system's architectural patterns. A resonant codebase exhibits:

- **Harmonic Consistency:** All components follow the same structural rules (e.g., unified API error handling, shared validation schemas). In practice, this means a new developer (or agent) can predict how a module is structured by reading any other module.
- **Constructive Interference:** New code amplifies existing abstractions rather than competing with them. In practice, this means the reuse ratio (calls to shared utilities / total function calls) trends upward over time.
- **Low Entropy:** Active self-regulation resists the natural drift toward disorder. In practice, this means duplication cluster counts stay flat or decrease as the codebase grows.

### 3. Three-Pillar Architecture

**Pillar 1: Cybernetic Control Loop (OODA)**

Transforms the agent from a linear executor into a closed-loop control system, following the Observe–Orient–Decide–Act pattern:

1. **Observe:** Scan current code state (AST parsing, linting, static analysis)
2. **Orient:** Compare against the Golden Standard (architectural rules in AGENTS.md + exemplars)
3. **Decide:** Calculate deviation from standard (duplication count, missing abstractions, style violations)
4. **Act:** Perform corrective action (refactoring, abstraction extraction)

This mirrors the Describe → Diagnose → Delimit → Direction → Design → Develop framework from Design in Practice (Hickey), where understanding must precede action. Specifically: Observe maps to Describe, Orient maps to Diagnose, Decide maps to Delimit + Direction, and Act maps to Design + Develop.

**Pillar 2: HumanLayer Workflows (Outer Loop)**

Enforces human-in-the-loop checkpoints at high-impact decision points (see [HumanLayer protocol](https://github.com/humanlayer/humanlayer)). The human sets intent (outer loop); the agent executes implementation (inner loop).

Recommended latch threshold (calibrate per project): pause and request approval when a refactoring plan affects more than ~5 files or modifies a public API. This is a proposed default, not a universal standard — teams should tune based on test coverage confidence and codebase familiarity.

**Pillar 3: Structured Context Packs**

Curates the LLM's context to contain exactly the information needed for resonance:

- **Persistent instruction files** (AGENTS.md, CLAUDE.md, .cursorrules) for immutable architectural rules
- **Dynamic retrieval** (tool-managed search or RAG) for existing abstraction interfaces so the agent knows what to reuse
- **Context scoping** to hide irrelevant implementation details and reduce hallucination risk

## Synthesis Findings

Each finding is labeled by evidence level: **[Practitioner consensus]**, **[Heuristic]**, or **[Hypothesis]**.

1. **[Practitioner consensus] LLMs tend toward average code quality without architectural constraints.** The excellent examples in training data are statistically outnumbered by average code. Explicit context injection shifts the output distribution toward higher quality. (Sources: Osmani; arXiv:2510.12399; InfoWorld analysis)

2. **[Practitioner consensus] Multi-phase prompting improves output quality over single-pass generation.** The Control Loop's Observe → Orient → Decide → Act sequence forces the model to reason before generating. This aligns with Chain of Thought findings and with Design in Practice's principle that "thinking is the cheapest phase." (Sources: context engineering survey arXiv:2507.13334; Hickey methodology)

3. **[Practitioner consensus] "Prompts as Code" is a viable engineering practice.** Versioning, testing, and executing prompts with the same rigor as application code produces repeatable, improvable agent behaviors. The incitaciones repository itself demonstrates this approach.

4. **[Heuristic] Safety latches reduce catastrophic refactoring risk.** A "Stop and Ask" directive at configurable thresholds (~5 files or public API changes) prevents autonomous refactoring from producing unrecoverable states. Threshold should be calibrated per project based on test coverage and CI confidence.

5. **[Hypothesis] Semantic duplication detection requires intent-based clustering, not syntactic matching.** Code that looks different but does the same thing is the highest-value refactoring target. This is the hardest to detect and needs explicit agent skill design. See worked example below.

6. **[Heuristic] A minimum-savings threshold prevents abstraction bloat.** Requiring that proposed abstractions save a meaningful amount of code (e.g., ~10 lines as a starting heuristic) avoids over-engineering. Exceptions: correctness/safety abstractions that don't save LOC but reduce error surface.

7. **[Hypothesis] Context Guardian as system prompt can provide continuous architectural guidance.** Prepending reuse-first directives to every generation session may prevent drift without requiring manual review of every output. Requires linter/test backup to enforce.

8. **[Heuristic] Atomic execution with rollback provides recoverable refactoring.** File-by-file application with verification scripts and automatic git rollback on failure makes large-scale refactoring recoverable. See safe procedure checklist below.

### Worked Example: Semantic Duplication

Consider three API error handlers in a vibe-coded project:

```javascript
// In users.js
try { await fetchUsers() } catch(e) { toast.error("Failed to load users"); log(e); }

// In orders.js  
try { await fetchOrders() } catch(e) { showToast("Orders error", "error"); logger.warn(e); }

// In products.js
try { const res = await getProducts(); } catch(err) { notify({ type: "error", msg: "Product fetch failed" }); console.error(err); }
```

**Syntactic matching** finds nothing — different variable names, different toast APIs, different loggers.

**Intent-based clustering** identifies: all three perform `try/catch around fetch → show error toast → log error`. The **invariant** is the pattern; the **variants** are the fetch function, error message, and toast/log implementations.

**Proposed abstraction:**
```javascript
async function withApiError(fetchFn, errorMsg) {
  try { return await fetchFn(); }
  catch(e) { toast.error(errorMsg); logger.error(e); throw e; }
}
```

## The Three Agent Skills

### Skill 1: Abstraction Miner ("Dry-Dock" Protocol)

A passive scanning skill that identifies semantic duplication and proposes reusable abstractions.

| Property | Value |
|----------|-------|
| **Inputs** | Directory path or file list; Golden Standard reference |
| **Outputs** | Refactoring Proposal (markdown table + code samples) |
| **Stop condition** | All files scanned; all clusters with ≥3 occurrences reported |
| **Verification** | Proposed abstractions compile; usage-site diffs preserve behavior |
| **Human approval** | Required before any code changes (advisory-only skill) |
| **Failure handling** | If clustering is ambiguous, flag as "needs human review" |

**Cognitive architecture mapping:** Uses Medical DDx workflow (from Cognitive Architectures research) for systematic clustering — enumerate all possible patterns, test each for semantic equivalence, eliminate false positives. Uses Scientific Method (falsification) to verify proposed abstractions don't change behavior.

### Skill 2: Context Guardian

A preventive skill that operates as a system prompt filter during ongoing development.

| Property | Value |
|----------|-------|
| **Inputs** | User's feature request; Golden Standard; component inventory |
| **Outputs** | Reuse plan + generated code + verification checklist |
| **Stop condition** | Code generated with all available abstractions reused |
| **Verification** | Lint passes; no raw logic where abstraction exists |
| **Human approval** | Only on Refusal Protocol activation (user requests architecture violation) |
| **Failure handling** | If inventory lookup fails, warn and proceed with explicit "new code" label |

**Cognitive architecture mapping:** Uses Six Hats "Blue Hat" orchestration (from Cognitive Architectures research) — the Guardian acts as the meta-cognitive controller, checking that the generative agent hasn't bypassed existing patterns. Uses Legal ambiguity review to catch vague requirements before generating code.

### Skill 3: Resonant Refactor

An interactive execution skill for applying refactoring plans from the Abstraction Miner.

| Property | Value |
|----------|-------|
| **Inputs** | Refactoring Proposal from Abstraction Miner; test suite |
| **Outputs** | Refactored code; test results; rollback branch if failed |
| **Stop condition** | All usage sites migrated and tests pass; or rollback triggered |
| **Verification** | Pre-refactor tests pass on new code; linter clean; no regressions |
| **Human approval** | Required at human latch (before execution begins) |
| **Failure handling** | 3 self-correction attempts → automatic `git checkout` rollback → error report |

**Cognitive architecture mapping:** Uses Aviation CRM checklists (from Cognitive Architectures research) — Do-Confirm pattern after each file modification. Uses Pre-Mortem analysis before execution: "If this refactor fails, what broke?"

**Safe refactoring procedure:**
1. Create feature branch from main
2. Commit current state (clean baseline)
3. Apply changes file-by-file
4. Run verification script after each file
5. If any step fails: 3 self-correction attempts
6. If repair fails: `git checkout .` and report error
7. If all pass: run full test suite + linter
8. Request human review before merge

## Deployment Roadmap

### Track A: Migration (Legacy Vibe Debt)

| Phase | Objective | Skill | Outcome |
|-------|-----------|-------|---------|
| 1. Audit | Identify refactoring targets | Abstraction Miner | Prioritized refactoring backlog |
| 2. Triage | Evaluate cost/benefit per cluster | Human review | Approved refactoring plan |
| 3. Execute | Reduce technical debt | Resonant Refactor | Incremental codebase improvement |

### Track B: Ongoing Development (Greenfield / Feature Work)

| Phase | Objective | Skill | Outcome |
|-------|-----------|-------|---------|
| 1. Foundation | Establish architectural rules | Manual | AGENTS.md with resonant rules |
| 2. Guard | Prevent drift during development | Context Guardian | Continuous reuse enforcement |
| 3. Audit | Periodic duplication check | Abstraction Miner | Early detection of emerging debt |

### Prerequisites Checklist

Before deploying these skills, ensure:

- [ ] Test runner exists and CI is configured
- [ ] Formatter and linter exist with agreed rules
- [ ] AGENTS.md (or equivalent) defines architectural conventions
- [ ] Git branching strategy supports feature branches
- [ ] At least one canonical exemplar file exists per major pattern

## Proposed Resonance Metrics

| Metric | Definition | Baseline | Target |
|--------|-----------|----------|--------|
| **Duplication clusters** | Count of semantic duplication groups (≥3 occurrences) | Measure before audit | Decrease by 50% per migration cycle |
| **Reuse ratio** | Calls to shared utilities / total function calls | Measure before audit | Trending upward |
| **Churn reduction** | Lines changed per feature in high-debt directories | Measure before audit | Decrease after abstraction |
| **Lint pass rate** | % of files passing architectural lint rules | Measure at foundation | >95% sustained |
| **Abstraction coverage** | % of major patterns with a canonical implementation | Count at foundation | 100% for identified patterns |
| **New-code reuse** | % of new PRs that use existing abstractions vs creating new ones | Measure after Guardian deployed | >80% |
| **Rollback rate** | % of Resonant Refactor runs that trigger rollback | Track from first use | <10% after calibration |

## Repository Integration Plan

This research should produce the following incitaciones artifacts:

| File | Type | Status |
|------|------|--------|
| `prompt-skill-abstraction-miner.md` | prompt (skill) | TODO |
| `prompt-skill-context-guardian.md` | prompt (skill) | TODO |
| `prompt-skill-resonant-refactor.md` | prompt (skill) | TODO |

Each prompt file should follow the repository template and include: inputs, outputs, stop conditions, verification commands, the control loop phases, and cognitive architecture mappings.

## Failure Modes & Mitigations

| Failure Mode | Risk | Mitigation |
|-------------|------|------------|
| **Resonance as dogma:** Golden Standard locks in a bad architecture | HIGH | Schedule periodic Golden Standard review; allow "architecture evolution proposals" that update the standard |
| **Context Guardian over-constrains:** Blocks legitimate innovation by forcing reuse of unsuitable abstractions | MEDIUM | Refusal Protocol allows human override; Guardian should suggest, not block |
| **False semantic equivalence:** Abstraction Miner groups code that looks similar but has subtle behavioral differences | HIGH | Require falsification tests (property-based or edge-case) before approving any abstraction |
| **Test coverage gaps:** Refactored code passes tests but introduces subtle regressions | MEDIUM | Shadow Test strategy: generate tests for current behavior before touching code |
| **Token cost explosion:** Multi-phase control loops consume significantly more tokens than single-pass generation | LOW | Use control loops only for high-value refactoring; single-pass with Context Guardian for routine work |
| **Human latch bottleneck:** Approval requirements slow velocity | MEDIUM | Calibrate thresholds per project; auto-approve for well-tested, low-impact changes |

## Regeneratable vs. Resonant Code

The "regeneratable code" counter-argument (simply re-generate modules on demand rather than maintaining abstractions) fails at scale. Abstractions serve not just reuse but **cognitive compression** — they allow both humans and agents to reason about the system in chunks rather than individual lines. Without abstractions, the cognitive footprint of the system exceeds manageable bounds for both human supervisors and LLM context windows.

However, this is a spectrum, not a binary. Small utility scripts and throwaway prototypes may be legitimately regeneratable. The framework applies primarily to systems intended for production longevity.

## Limitations

1. **Semantic intent clustering is imprecise.** LLMs may misidentify code as semantically equivalent when subtle behavioral differences matter. Falsification tests mitigate but don't eliminate this risk.

2. **Context window constraints persist.** Even with structured context packs, very large codebases may exceed what can be effectively communicated to the model. Chunking and prioritization strategies are needed.

3. **The framework assumes testable code.** The Shadow Test strategy in Resonant Refactor requires that the codebase has at least minimal testing infrastructure.

4. **Token cost increases.** Multi-phase control loops consume significantly more tokens than single-pass generation. Cost-benefit analysis needed per use case.

5. **Human bottleneck at latches.** HumanLayer checkpoints slow velocity; the threshold for triggering them (~5 files) needs calibration per project based on test coverage and team trust.

6. **Golden Standard requires upfront investment.** Creating and maintaining the architectural rules in AGENTS.md is a non-trivial ongoing effort, but amortizes over the project's lifetime.

7. **No empirical validation yet.** These findings are synthesis-level: derived from practitioner consensus and theoretical analysis, not controlled experiments. Empirical measurement against the proposed metrics is needed.

## How This Extends Existing Research

**Cognitive Architectures for Prompts (research-paper-cognitive-architectures-for-prompts.md):**
The Cognitive Architectures paper provides the role-based reasoning frameworks that power each skill. This paper maps those frameworks to specific refactoring concerns:

| Skill | Cognitive Architecture | How Used |
|-------|----------------------|----------|
| Abstraction Miner | Medical DDx + Scientific Method | Systematic clustering via hypothesis-and-elimination; falsification testing for proposed abstractions |
| Context Guardian | Six Hats (Blue Hat) + Legal Review | Meta-cognitive orchestration of reuse; ambiguity detection in requirements |
| Resonant Refactor | Aviation CRM + Pre-Mortem | Do-Confirm checklists for each file change; prospective failure analysis before execution |

**Design in Practice Methodology (research-design-in-practice-methodology.md):**
The Control Loop's Observe → Orient → Decide → Act phases parallel Hickey's Describe → Diagnose → Delimit → Direction → Design → Develop. Both insist that understanding must precede action. This paper applies that principle specifically to refactoring workflows, where the temptation to "just fix it" is strongest.

**Design in Practice Workflow (prompt-workflow-design-in-practice.md):**
The Abstraction Miner's phased protocol mirrors the workflow's Describe (scan symptoms) → Diagnose (identify root pattern) → Design (propose abstraction) structure.

## Related Prompts

- research-paper-cognitive-architectures-for-prompts.md - Provides the cognitive frameworks mapped to each skill
- research-design-in-practice-methodology.md - Foundational methodology for "understand before acting"
- prompt-workflow-design-in-practice.md - Operational workflow that parallels the Control Loop phases

## References

### Primary Sources
- Andrej Karpathy, "Vibe Coding" concept (Feb 2025), subsequently "Agentic Engineering" framing (Feb 2026)
- [Agentic Engineering - Addy Osmani](https://addyosmani.com/blog/agentic-engineering/)
- [Vibe coding is not AI-Assisted engineering - Addy Osmani](https://medium.com/@addyosmani/vibe-coding-is-not-the-same-as-ai-assisted-engineering-3f81088d5b98)
- [HumanLayer Protocol - GitHub](https://github.com/humanlayer/humanlayer/blob/main/humanlayer.md)

### Surveys and Research
- [A Survey of Context Engineering for LLMs - arXiv:2507.13334](https://arxiv.org/html/2507.13334v1)
- [A Survey of Vibe Coding with LLMs - arXiv:2510.12399](https://arxiv.org/html/2510.12399v1)
- [Context Engineering: A Guide With Examples - DataCamp](https://www.datacamp.com/blog/context-engineering)

### Practitioner Analysis
- [Resonant Coding - Charly Vibes](https://charly-vibes.github.io/microdancing/en/posts/resonant-coding.html)
- [Is vibe coding the new gateway to technical debt? - InfoWorld](https://www.infoworld.com/article/4098925/is-vibe-coding-the-new-gateway-to-technical-debt.html)
- [A New Era: From Reusable to Regeneratable Code - Medium](https://medium.com/@denisuraev/a-new-era-in-software-architecture-from-reusable-to-regeneratable-code-3a48c40609e6)
- [A Complete Guide To AGENTS.md - AI Hero](https://www.aihero.dev/a-complete-guide-to-agents-md)

### Background
- [Vibe Coding - Wikipedia](https://en.wikipedia.org/wiki/Vibe_coding)
- [Vibe coding era over? Agentic engineering now - India Today](https://www.indiatoday.in/technology/news/story/vibe-coding-era-over-ai-guru-who-coined-the-term-says-time-has-come-for-agentic-engineering-now-2863387-2026-02-05)
- [The Complete Guide to Agentic Coding in 2026 - TeamDay.ai](https://www.teamday.ai/blog/complete-guide-agentic-coding-2026)

## Future Research

1. **Empirical validation:** Measure technical debt reduction (duplication clusters, reuse ratio, churn) after applying the three-skill framework to real vibe-coded projects

2. **Abstraction quality metrics:** Validate or refine the proposed resonance metrics against real project data

3. **Automated Golden Standard generation:** Can an agent bootstrap AGENTS.md rules from an existing codebase's best patterns?

4. **Cross-language applicability:** Test framework effectiveness across different programming paradigms (functional, OOP, scripting)

5. **HumanLayer threshold calibration:** Determine optimal file-count and API-impact thresholds for triggering human review per project type

6. **CI integration design:** Specify whether Context Guardian in CI runs lint rules, architectural grep checks, LLM review steps, or a combination

7. **Skill composition patterns:** How do Abstraction Miner → Context Guardian → Resonant Refactor chain in practice? What feedback loops emerge?

8. **Cost-benefit analysis:** Token cost of multi-phase control loops vs. quality improvement — when is the overhead justified?

## Version History

- 1.1.0 (2026-02-10): Revised based on 5-pass research review. Reframed claims with evidence levels. Added glossary, worked example, metrics, prerequisites, failure modes, cognitive architecture mappings, integration plan, and cross-references to existing repo research. Restructured sections from research-study format to framework-proposal format.
- 1.0.0 (2026-02-10): Initial synthesis from "Improving LLM Code Refactoring Skills" source document
