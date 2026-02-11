---
title: Resonant Coding - From Vibe Coding to Agentic Refactoring
type: research
subtype: paper
tags: [resonant-coding, vibe-coding, agentic-engineering, refactoring, context-engineering, abstraction, fabbro-loop, humanlayer]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-02-10
updated: 2026-02-10
version: 1.0.0
related: [research-paper-cognitive-architectures-for-prompts.md, prompt-workflow-design-in-practice.md, research-design-in-practice-methodology.md]
source: synthesis
---

# Resonant Coding: From Vibe Coding to Agentic Refactoring Through Structured Agent Skills

## Summary

An analysis of the "Resonant Coding" methodology that bridges the velocity of vibe coding with the rigor of agentic engineering. Proposes three agent skills (Abstraction Miner, Context Guardian, Resonant Refactor) built on Fabbro cybernetic loops, HumanLayer safety protocols, and advanced context engineering to systematically transform technical debt into reusable architecture.

## Context

Vibe coding (Karpathy, 2025) democratized software creation through natural language-driven LLM code generation, but produced massive technical debt: semantic duplication, lack of abstraction, and architectural drift. The question is not whether LLMs can produce excellent code — they are trained on excellent examples — but how to constrain their stochastic output away from median-quality generation toward architecturally resonant solutions. This research synthesizes the theoretical framework and practical skills needed for that transition.

## Hypothesis / Question

Can structured agent skills, built on cybernetic control loops and context engineering, reliably guide LLMs to produce architecturally consistent, abstraction-rich code instead of the verbose, duplicative output that characterizes unguided vibe coding?

## Method

Synthesis of three complementary frameworks applied to LLM-assisted refactoring:

### 1. The Vibe Coding Paradox

Vibe coding optimizes for local correctness within the current context window. LLMs, being probabilistic engines, generate the most statistically likely token sequence — which corresponds to median-quality code from their training corpus. Without architectural constraints, each generation episode is "amnesic": the model assumes a greenfield environment, reinventing patterns and duplicating logic.

**Three failure modes identified:**

- **Semantic Duplication:** Multiple functions with identical intent but different syntax (DRY violations)
- **Abstraction Absence:** Hardcoded values and inline logic replacing reusable components
- **Architectural Drift:** New features diverging from established design patterns ("Frankenstein" systems)

### 2. Resonance as an Engineering Metric

Borrowing from physics, "resonance" measures the alignment between a code unit and the system's architectural patterns. A resonant codebase exhibits:

- **Harmonic Consistency:** All components follow the same structural rules (e.g., unified API error handling, shared validation schemas)
- **Constructive Interference:** New code amplifies existing abstractions rather than competing with them
- **Low Entropy:** Active self-regulation resists the natural drift toward disorder

### 3. Three-Pillar Architecture

**Pillar 1: Fabbro Agent System Patterns (Cybernetic Loop)**

Transforms the agent from a linear executor into a closed-loop control system:

1. **Sensor:** Observe current code state (AST parsing, linting, static analysis)
2. **Comparator:** Compare against a "Golden Standard" (architectural rules)
3. **Controller:** Calculate "Error Signal" (deviation from standard)
4. **Actuator:** Perform corrective action (refactoring, abstraction)

**Pillar 2: HumanLayer Workflows (Outer Loop)**

Enforces human-in-the-loop checkpoints at high-impact decision points. The human sets intent (outer loop); the agent executes implementation (inner loop). Critical "Stop and Ask" directives prevent runaway refactoring.

**Pillar 3: Advanced Context Engineering (Knowledge Graph)**

Curates the LLM's context to contain exactly the information needed for resonance:

- Context caching for immutable architectural rules
- Dynamic retrieval (RAG) for existing abstraction interfaces
- Context masking to hide irrelevant implementation details

## Results

### Key Findings

1. **LLMs default to median code quality without architectural constraints.** The "excellent examples" in training data are statistically outnumbered by average code. Explicit context injection is required to shift the distribution.

2. **Multi-phase prompting breaks the median-code habit.** The Fabbro Loop's Diagnosis → Prescription → Treatment sequence forces the model to reason before generating, engaging analytical capabilities before generative ones.

3. **"Prompts as Code" is a viable engineering practice.** Versioning, testing, and executing prompts with the same rigor as application code produces repeatable, improvable agent behaviors.

4. **Safety latches are essential for refactoring workflows.** The HumanLayer "Stop and Ask" directive (pause if >5 files affected or public API modified) prevents catastrophic autonomous refactoring while maintaining velocity on low-risk changes.

5. **Semantic duplication detection requires intent-based clustering, not syntactic matching.** Code that looks different but does the same thing is the highest-value refactoring target and the hardest to detect without explicit agent skills.

6. **The "10-line rule" prevents abstraction bloat.** Requiring that proposed abstractions save at least 10 lines of code avoids over-engineering, a common LLM failure mode.

7. **Context Guardian as system prompt produces continuous architectural enforcement.** Prepending reuse-first directives to every generation session prevents drift without requiring manual review of every output.

8. **Atomic execution with rollback provides safe refactoring.** File-by-file application with verification scripts and automatic git rollback on failure makes large-scale refactoring recoverable.

## Analysis

### The Three Agent Skills

The practical output of this framework is three composable agent skills:

**Skill 1: Abstraction Miner ("Dry-Dock" Protocol)**

A passive scanning skill that identifies semantic duplication and proposes reusable abstractions. Operates on the Fabbro Loop: scan → cluster by intent → identify invariant vs. variant → propose abstraction. Output is advisory only (respects HumanLayer). Best run periodically on high-churn directories.

**Skill 2: Context Guardian**

A preventive skill that operates as a system prompt filter. Before generating any code, the agent must: inventory existing reusable components, perform gap analysis (reuse X, create Y), and inject style rules from AGENTS.md. Strictly forbidden from writing raw logic when higher-level abstractions exist.

**Skill 3: Resonant Refactor**

An interactive execution skill for applying refactoring plans. Follows a five-step protocol: impact analysis → shadow test generation (TDD) → human latch → atomic execution with self-correction loop (3 attempts) → quality gates (linter + documentation).

### Phased Deployment Roadmap

| Phase | Objective | Skill | Outcome |
|-------|-----------|-------|---------|
| 1. Audit | Identify refactoring targets | Abstraction Miner | Prioritized refactoring backlog |
| 2. Foundation | Establish architectural rules | Context Guardian | AGENTS.md with resonant rules |
| 3. Migration | Reduce technical debt | Resonant Refactor | Incremental codebase improvement |
| 4. Maintenance | Prevent regression | Context Guardian (CI) | Continuous architectural enforcement |

### Resonant vs. Regeneratable Code

The "regeneratable code" counter-argument (simply re-generate modules on demand) fails at scale. Abstractions serve not just reuse but **cognitive compression** — they allow both humans and agents to reason about the system in chunks. Without abstractions, the cognitive footprint of the system exceeds manageable bounds.

## Practical Applications

- **Refactoring backlogs:** Use Abstraction Miner to systematically identify high-value refactoring targets in vibe-coded systems
- **Architectural guardrails:** Deploy Context Guardian as a persistent system prompt to prevent drift during ongoing development
- **Safe large-scale refactoring:** Apply Resonant Refactor with HumanLayer checkpoints for high-risk codebase surgery
- **AGENTS.md as Golden Standard:** Define resonant rules (prefer abstractions, follow Fabbro Loop, align with directory structure) as persistent agent context
- **Periodic audits:** Schedule Abstraction Miner runs on high-churn directories to catch emerging duplication before it compounds

## Limitations

1. **Semantic intent clustering is imprecise.** LLMs may misidentify code as semantically equivalent when subtle differences matter.

2. **Context window constraints persist.** Even with context engineering, very large codebases may exceed what can be effectively communicated to the model.

3. **The framework assumes testable code.** The Shadow Test strategy in Resonant Refactor requires that the codebase has some testing infrastructure.

4. **Token cost increases.** Multi-phase Fabbro Loops consume significantly more tokens than single-pass generation.

5. **Human bottleneck at latches.** HumanLayer checkpoints slow velocity; the threshold for triggering them (>5 files) may need calibration per project.

6. **Golden Standard requires upfront investment.** Creating and maintaining the architectural rules in AGENTS.md is a non-trivial ongoing effort.

## Related Prompts

- research-paper-cognitive-architectures-for-prompts.md - Complementary cognitive frameworks for structuring agent reasoning
- prompt-workflow-design-in-practice.md - Design methodology applicable to abstraction proposals
- research-design-in-practice-methodology.md - Underlying design research methodology

## References

- Andrej Karpathy, "Vibe Coding" concept (2025)
- [Vibe Coding - Wikipedia](https://en.wikipedia.org/wiki/Vibe_coding)
- [Is vibe coding the new gateway to technical debt? - InfoWorld](https://www.infoworld.com/article/4098925/is-vibe-coding-the-new-gateway-to-technical-debt.html)
- [Vibe coding era over? Agentic engineering now - India Today](https://www.indiatoday.in/technology/news/story/vibe-coding-era-over-ai-guru-who-coined-the-term-says-time-has-come-for-agentic-engineering-now-2863387-2026-02-05)
- [The Complete Guide to Agentic Coding in 2026 - TeamDay.ai](https://www.teamday.ai/blog/complete-guide-agentic-coding-2026)
- [Context Engineering: A Guide With Examples - DataCamp](https://www.datacamp.com/blog/context-engineering)
- [A Survey of Context Engineering for LLMs - arXiv](https://arxiv.org/html/2507.13334v1)
- [A Survey of Vibe Coding with LLMs - arXiv](https://arxiv.org/html/2510.12399v1)
- [Resonant Coding - Charly Vibes](https://charly-vibes.github.io/microdancing/en/posts/resonant-coding.html)
- [Agentic Engineering - Addy Osmani](https://addyosmani.com/blog/agentic-engineering/)
- [Vibe coding is not AI-Assisted engineering - Addy Osmani](https://medium.com/@addyosmani/vibe-coding-is-not-the-same-as-ai-assisted-engineering-3f81088d5b98)
- [HumanLayer - GitHub](https://github.com/humanlayer/humanlayer/blob/main/humanlayer.md)
- [A New Era: From Reusable to Regeneratable Code - Medium](https://medium.com/@denisuraev/a-new-era-in-software-architecture-from-reusable-to-regeneratable-code-3a48c40609e6)
- [A Complete Guide To AGENTS.md - AI Hero](https://www.aihero.dev/a-complete-guide-to-agents-md)

## Future Research

1. **Empirical validation:** Measure technical debt reduction (lines saved, duplication ratio) after applying the three-skill framework to real vibe-coded projects

2. **Abstraction quality metrics:** Define quantitative measures for "resonance" beyond the 10-line heuristic

3. **Automated Golden Standard generation:** Can an agent bootstrap AGENTS.md rules from an existing codebase's best patterns?

4. **Cross-language applicability:** Test framework effectiveness across different programming paradigms (functional, OOP, scripting)

5. **HumanLayer threshold calibration:** Determine optimal file-count and API-impact thresholds for triggering human review per project type

6. **Integration with CI/CD:** Build Context Guardian as a linter plugin that runs in pull request pipelines

7. **Skill composition patterns:** How do Abstraction Miner → Context Guardian → Resonant Refactor chain in practice? What feedback loops emerge?

## Version History

- 1.0.0 (2026-02-10): Initial synthesis from "Improving LLM Code Refactoring Skills" source document
