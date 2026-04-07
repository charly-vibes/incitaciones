---
title: "Adversarial Stakeholder Role-Play for Concept and Product Evaluation"
type: research
subtype: paper
tags: [adversarial-evaluation, prompt-engineering, red-teaming, stakeholder-simulation, pre-mortem, devils-advocate, anti-persona, ux-heuristics, sycophancy, cognitive-bias]
tools: [claude-code, gemini, any-llm]
status: draft
created: 2026-03-30
updated: 2026-03-30
version: 1.0.0
related:
  - prompt-task-adversarial-stakeholder-evaluation.md
  - prompt-task-systematic-bias-audit-and-mitigation.md
  - research-paper-automated-red-teaming-vulnerability-discovery.md
  - research-paper-cognitive-architectures-for-prompts.md
  - research-paper-bias-detection-prevention-mitigation.md
  - prompt-task-red-team-review.md
  - prompt-workflow-pre-mortem-planning.md
  - prompt-task-design-review.md
  - prompt-task-specification-evaluation-diagnostician.md
source: [research-based]
---

# Adversarial Stakeholder Role-Play for Concept and Product Evaluation

## Summary

Aligned LLMs are optimized for helpfulness and agreeableness, making them unreliable as critical evaluators in their default state. This paper synthesizes research on non-security adversarial prompt engineering techniques -- Simulated Stakeholder Councils, Pre-Mortem protocols, Devil's Advocate patterns, Anti-Personas, and structured frameworks like TRIZ and Six Thinking Hats -- that override sycophantic defaults to extract rigorous, pessimistic analysis of products, business logic, and concepts.

## Context

Organizations increasingly rely on LLMs for product evaluation, strategy review, and concept validation. However, RLHF alignment makes models default to optimistic, sandwich-style feedback that obscures real flaws. The question is: how can adversarial prompt architectures systematically counteract this sycophancy to produce genuinely critical evaluation?

## Hypothesis / Question

Constraint-first adversarial prompting (structured roles, forced pessimism, epistemic conflict) produces more rigorous and actionable product evaluation than standard persona assignment or open-ended critique requests.

## Method

Synthesis of research across adversarial prompt engineering, cognitive psychology frameworks, UX evaluation methodology, and multi-agent architectures. Sources include empirical studies on persona degradation (Google DeepMind), heuristic evaluation accuracy benchmarks (Baymard/HPSS), and practitioner frameworks from product strategy and software engineering.

## Results

### Key Findings

1. **Expert personas without constraints degrade reasoning.** A study testing 162 expert persona prompts found that unconstrained personas nearly double hallucination rates. Models pattern-match linguistic markers of expertise (confidence, jargon) while bypassing deliberate reasoning. Constraint-first architectures that define failure conditions, solution bounds, and adversarial mandates outperform identity-based prompting.

2. **Structured adversarial conflict outperforms homogenized critique.** The Simulated Stakeholder Council forces sequential adoption of conflicting perspectives (Skeptical CFO, Visionary Product Lead, Practical Engineer), each required to produce two brutal critiques before one synthesis point. This compartmentalization prevents perspective dilution and eliminates "spaghetti thinking" where facts, emotions, and ideas become unproductively intertwined.

3. **Temporal reframing bypasses sycophantic alignment.** The Pre-Mortem protocol ("Assume it is one year from now and this project has failed spectacularly") treats failure as historical fact, freeing the model from evaluating *if* failure occurs and redirecting capacity to reverse-engineering *how* and *why*. Further granularity comes from the Tigers/Paper Tigers/Elephants taxonomy that categorizes threats by visibility, actual risk, and organizational reluctance to address them.

4. **Isolated multi-agent adversaries prevent correlated reasoning failures.** The TAC Triad (Thesis, Antithesis, Consolidator) routes proposals through isolated Devil's Advocate agents prohibited from communicating with each other, each using specialized attack strategies (edge cases, regulatory gaps, historical market failures). A Consolidator assesses resilience qualitatively rather than by democratic vote.

5. **Anti-Personas reveal edge cases invisible to happy-path testing.** Simulating users who misuse, misunderstand, or subvert the product (e.g., "Entitled Multinational Corporation" stress-testing a small-business tool) identifies missing guardrails, inadequate rate limits, and documentation gaps. This implements Murphy's Law as a form of cognitive fuzzing.

6. **UX heuristic evaluation requires multi-factor prompt optimization.** In public benchmarks, unstructured LLM-based UX analysis achieved only 50-75% accuracy versus human experts. The HPSS framework optimizes eight interdependent prompt factors (scoring scale, in-context examples, evaluation criteria, reference benchmarks, chain-of-thought, auto-CoT, metrics, component order) across 12,000+ strategy combinations to approach 95% human-level accuracy.

7. **Classical frameworks provide rigid analytical structure.** Socratic Irony (feigned ignorance forcing users to uncover their own contradictions), TRIZ (systematic identification of technical and physical contradictions), and Six Thinking Hats Black Hat protocol (exclusive focus on flaws with positive attributes expressly forbidden) each force analysis through historically proven methodologies that break superficial assumptions.

## Analysis

The core insight across all techniques is the same: effective adversarial evaluation requires *structural constraints*, not just persona labels. Telling a model to "be critical" triggers stylistic emulation of criticism. Telling it to "assume failure has occurred and list five causes" or "produce two brutal critiques before any synthesis" imposes computational constraints that redirect the reasoning process itself.

The techniques form a natural evaluation pipeline:
- **Tier 1 (Macro):** Simulated Stakeholder Council for cross-functional stress testing
- **Tier 2 (Feature):** Anti-Personas and HPSS-optimized heuristics for edge cases and UX
- **Tier 3 (Strategy):** Pre-Mortem or TRIZ contradiction analysis for systemic viability

Separation of idea generation from idea evaluation is critical. The adversarial loop should be recursive: fix identified vulnerabilities, then re-submit to the adversarial pipeline until models can no longer identify catastrophic flaws.

## Practical Applications

- **Simulated Stakeholder Council:** Deploy for any product proposal requiring cross-functional buy-in. Mandate the 2-critiques-then-1-synthesis structure per persona to prevent softening.
- **Pre-Mortem protocol:** Use at project kickoff or before major investment decisions. Combine with Tigers/Paper Tigers/Elephants taxonomy for threat prioritization.
- **TAC Triad:** Use for high-stakes decisions (financial products, infrastructure architecture) where correlated reasoning failure is dangerous. Isolate adversarial agents strictly.
- **Anti-Persona simulation:** Run against APIs, onboarding flows, and self-service products to find abuse vectors and documentation gaps.
- **HPSS-structured UX evaluation:** Replace unstructured "evaluate this UI" prompts with the eight-factor framework. Always include few-shot examples and chain-of-thought mandates.
- **Black Hat protocol:** Use as a final pass when you suspect confirmation bias. Expressly forbid positive commentary to exhaust the risk surface.

## Limitations

- Most techniques are validated through practitioner reports and case studies rather than controlled experiments. Empirical evidence is strongest for persona degradation (DeepMind) and HPSS accuracy benchmarks (Baymard/ACL).
- Multi-agent architectures (TAC Triad) require orchestration infrastructure; single-prompt stakeholder councils are a practical approximation but lose strict isolation guarantees.
- Adversarial prompts can overcorrect, producing pessimism that is itself unreliable. Human judgment remains necessary to weigh adversarial outputs against real-world probability.
- HPSS optimization requires significant prompt engineering investment and is most justified for repeated, high-volume UX evaluation rather than one-off assessments.

## Related Prompts

- [prompt-task-red-team-review.md](prompt-task-red-team-review.md) - Red team review prompt implementing adversarial evaluation
- [prompt-workflow-pre-mortem-planning.md](prompt-workflow-pre-mortem-planning.md) - Pre-mortem workflow
- [prompt-task-design-review.md](prompt-task-design-review.md) - Design review with critical evaluation
- [prompt-task-specification-evaluation-diagnostician.md](prompt-task-specification-evaluation-diagnostician.md) - Specification evaluation

## References

- Obsidian Security. "Adversarial Prompt Engineering: The Dark Art of Manipulating LLMs." https://www.obsidiansecurity.com/blog/adversarial-prompt-engineering
- Reddit r/PromptDesign. "My Simulated Stakeholder prompt framework for decision making." https://www.reddit.com/r/PromptDesign/comments/1rfpgux/
- Booth, A. "I Created an LLM System Prompt to Ruthlessly Attack My Opinions." Medium. https://medium.com/@adrianbooth/i-created-an-llm-system-prompt-to-ruthlessly-attack-my-opinions-3b0d23088453
- Reddit r/PromptEngineering. "Google DeepMind tested 162 expert persona prompts (study summary)." https://www.reddit.com/r/PromptEngineering/comments/1qtxam7/
- Reddit r/PromptEngineering. "The 'Pre-Mortem' Protocol: Killing projects before they fail." https://www.reddit.com/r/PromptEngineering/comments/1rltvii/
- Smith, J.A. "When All Your AI Agents Are Wrong Together." Medium. https://medium.com/@jsmith0475/when-all-your-ai-agents-are-wrong-together-c719ca9a7f74
- AWS Machine Learning Blog. "How LinqAlpha assesses investment theses using Devil's Advocate on Amazon Bedrock." https://aws.amazon.com/blogs/machine-learning/how-linqalpha-assesses-investment-theses-using-devils-advocate-on-amazon-bedrock/
- Baymard Institute. "AI Heuristic UX Evaluations with a 95% Accuracy Rate." https://baymard.com/blog/ai-heuristic-evaluations
- ACL Anthology. "HPSS: Heuristic Prompting Strategy Search for LLM Evaluators." https://aclanthology.org/2025.findings-acl.1282.pdf
- arXiv. "Catching UX Flaws in Code: Leveraging LLMs to Identify Usability Flaws." https://arxiv.org/html/2512.04262v1
- User Interviews. "5 Ways to Communicate With the Anti-Persona." https://www.userinterviews.com/blog/5-ways-to-communicate-with-the-antipersona
- De Bono, E. "Six Thinking Hats." (via https://db.arabpsychology.com/six-thinking-hats-2/)
- TRIZ methodology. (via https://product-development-engineers.com/2025/10/06/triz-a-guide-to-inventive-problem-solving/)
- ResearchGate. "Enhancing AI-Assisted Group Decision Making through LLM-Powered Devil's Advocate." https://www.researchgate.net/publication/379615420
- Promptfoo. "LLM red teaming guide." https://www.promptfoo.dev/docs/red-team/

## Future Research

- Empirical comparison of single-prompt stakeholder councils vs. true multi-agent TAC Triad architectures for evaluation quality
- Calibration techniques to prevent adversarial overcorrection (pessimism bias)
- Integration of HPSS optimization with automated CI/CD-style evaluation pipelines
- Combining adversarial evaluation with structured output schemas for quantitative risk scoring
- Testing whether Pre-Mortem temporal reframing effectiveness varies across model families

## Version History

- 1.0.0 (2026-03-30): Initial synthesis from adversarial evaluation research
