---
title: "A Generic Framework for Specification Evaluation: Extending the Resonant Coding Methodology"
type: research
subtype: paper
tags: [spec-driven-development, resonant-coding, openspec, specification-evaluation, iso-29148, requirements-engineering, llm-as-judge, formal-verification, executable-specifications]
tools: [claude-code, openspec]
status: draft
created: 2026-03-26
updated: 2026-03-26
version: 1.0.0
related: [research-standalone-specification-standards.md, research-paper-verification-protocols-deterministic-architectures.md, research-documentation-frameworks.md, research-paper-bias-detection-prevention-mitigation.md, research-paper-rule-of-5-multi-agent-review.md, research-rule-of-5-universal-with-optionality.md]
source: "Synthesis of Resonant Coding / SDD methodology, ISO/IEC/IEEE 29148, LLM-as-a-Judge paradigms, and cross-domain specification evaluation profiles"
---

# A Generic Framework for Specification Evaluation: Extending the Resonant Coding Methodology

## Summary

The principles of Resonant Coding and Specification-Driven Development (SDD) possess utility far beyond software engineering. This research abstracts the core mechanical structures of these approaches — the Propose-Apply-Archive lifecycle, the Rule of 5 evaluation filter, and the tripartite verification engine (Completeness, Correctness, Coherence) — and fuses them with ISO/IEC/IEEE 29148 requirements engineering standards to formulate an exhaustive, multi-dimensional framework for evaluating specifications across diverse, non-software domains. The paper examines executable specification paradigms, LLM-as-a-Judge automation for subjective assessment, and cross-domain application profiles spanning enterprise business process analysis, hardware design compliance, and academic research design.

## Context

Systems and software engineering is navigating a transformation from improvisational, prompt-driven interactions ("vibe coding") toward systematic, structure-first methodologies.^1 Vibe coding — iterative conversational prompting where a human intuitively guides an LLM — collapses under production-grade complexity due to reliance on implicit context, fragmented chat histories, and fundamental model statelessness, producing architecturally inconsistent outputs whose complexity grows faster than human comprehension.^1

Specification-Driven Development (SDD) addresses this entropy by treating the specification as the definitive, executable single source of truth, shifting engineering focus from execution optimization toward understanding optimization.^1 The human operator is elevated from code producer to systems architect and output validator.^1

The Resonant Coding framework, codified within the *incitaciones* repository, operationalizes this shift through the premise that working effectively with stochastic algorithmic systems requires discovering their "resonance frequency" — a structured, deterministic method of interaction achieved through exhaustive Context Engineering: externalizing project state into durable, versioned documents that serve as explicit guardrails.^1,2

However, the challenge of translating abstract human intent into verifiable, machine-executable reality is a universal engineering problem — not confined to software development. Extending these methodologies to hardware design, enterprise business process modeling, and academic research design requires abstracting them into a generic evaluation framework.

## Hypothesis / Question

Can the Resonant Coding methodology's core structures — the Propose-Apply-Archive lifecycle, the Rule of 5 sequential evaluation filter, and the tripartite verification engine — be synthesized with ISO/IEC/IEEE 29148 requirements engineering standards into a universally applicable specification evaluation framework that maintains rigor across non-software domains including hardware design, business process analysis, and scientific research?

## Method

The research employs a multidisciplinary synthesis of:

- **Methodology Deconstruction:** Mechanical analysis of the Resonant Coding lifecycle and its three formal phases (Proposal, Apply, Archive) as operationalized by SDD toolchains like OpenSpec.^2,3,4
- **Evaluation Filter Analysis:** Detailed examination of the Rule of 5 sequential filtering process (Draft, Accuracy, Clarity, Edge Cases, Excellence) and its mapping to quantifiable verification dimensions.^2
- **Tripartite Engine Formalization:** Decomposition of Completeness, Correctness, and Coherence into structural and functional sub-metrics, drawing on modern evaluation toolchains including the OpenSpec Change Verifier.^8,9
- **International Standards Integration:** Synthesis of the nine essential requirement characteristics from ISO/IEC/IEEE 29148:2018 with the Rule of 5 and Tripartite Engine.^12,19,20,21
- **Executable Specification Review:** Assessment of executability paradigms across business process modeling (BPMN), dynamic contract checking, and hardware description languages.^24,25,28,30
- **LLM-as-a-Judge Analysis:** Evaluation of automated subjective assessment via semantic review, structured rubrics, multi-agent workflows, and PARCER contract systems.^5,31,32
- **Cross-Domain Application Profiling:** Application of the generic framework to enterprise BPA, hardware compliance verification, and academic research design to validate portability.^14,22,34,39,40

## Results

### 1. The Lifecycle of a Formal Specification

The Resonant Coding methodology treats the specification as a living, version-controlled entity evolving through a strict tripartite lifecycle: Proposal, Apply, and Archive.^4

**Proposal Phase.** Before any execution begins, the system must externalize its understanding of the problem into a formal proposal — "version control for intent."^1,3 Artifacts include an exploration document with risk assessment, a proposal outlining scope and rollback plans, and a delta specification describing requirements to be added, modified, or removed.^5 An interactive interview sequence surfaces assumptions and navigates decision trees upfront, narrowing the solution space toward high determinism.^7

**Apply Phase.** Implementation is restricted strictly to the boundaries defined by the approved specification. The agent operates autonomously within these guardrails while the human assumes the role of orchestrator and validator.^1 Continuous validation ensures the emerging implementation does not drift from agreed-upon constraints.^8

**Archive Phase.** The most critical component for long-term systemic health and the most frequently neglected in traditional paradigms.^2 The methodology dictates that unarchived changes constitute technical debt.^3 Delta specifications generated during Proposal are merged back into a consolidated top-level baseline specification, resolving the entropy problem of fragmented intent scattered across dozens of disconnected files.^3

### 2. The Rule of 5 Evaluation Filter

The transition from Proposal to Apply is governed by a mandatory, five-layer filtering process designed to ensure that generated content constitutes a rigorous solution rather than a statistical simulation.^2 The methodology demands that evaluators approach stochastic model outputs with the "firm conviction" that the model may have hallucinated, misunderstood requirements, or improperly synthesized data.^2

1. **Draft:** Verifies the raw presence of all necessary information — foundational constraints, stakeholder needs, operational requirements — regardless of formatting or polish.^2
2. **Accuracy:** Rigorous audit for factual correctness and logical validity, targeting AI hallucination, mathematical errors, and logical inconsistencies.^2
3. **Clarity:** Focuses on semantic transmission of intent — simplifying language, eliminating ambiguity, making implicit assumptions explicit as the first prerequisite to resolving them.^2
4. **Edge Cases:** Stresses the specification by anticipating failure modes, boundary conditions, and operating contexts outside standard parameters to ensure robustness against systemic anomalies.^2
5. **Excellence:** Polishes the artifact, optimizing structural organization and formatting for maximum readability by both human engineers and machine-parsing algorithms.^2

### 3. The Tripartite Verification Engine: Completeness, Correctness, and Coherence

To abstract the evaluation methodology into a generic framework, the sequential filters of the Rule of 5 must map to universal, quantifiable metrics. Modern evaluation toolchains distill this into three primary verification dimensions.^8

**Completeness** measures the degree to which a specification exhaustively covers the required functional scope — the mathematical mapping of initial intents to fully articulated constraints.^9,12

- *Structural Completeness (SC):* A statistical metric measuring integrity of required formalisms — scanning for unresolved placeholders, unfulfilled templates, or missing mandatory sections. For a business process SOP, SC verifies presence of purpose, trigger mechanism, step-by-step actions, responsible roles, and associated SLAs.^13,14
- *Functional Completeness (FC):* Evaluates whether intended capabilities are exhaustively described and bounded. In structured SDD workflows, this involves tracking a precise one-to-one mapping between proposed requirements and implementation tasks.^8,12

**Correctness** evaluates factual accuracy, technical implementability, and logical validity.^9 A specification may be structurally complete but entirely incorrect if its dictates violate established physics, logical principles, or prior architectural decisions.^12

- In software paradigms, correctness is frequently evaluated through passing unit tests and regression checks.^15
- For hardware design or cryptographic protocol development, correctness demands formal verification using finite-state machines, Petri nets, labeled transition systems, and Hoare logic to exhaustively prove adherence to specification.^16
- Semantic mapping verifies that proposed implementation directly maps to the specific requirements and scenarios mandated by the specification.^8,9

**Coherence** measures internal consistency, contextual alignment, and logical flow — the most nuanced dimension.^17

- *Internal Consistency:* Ensures terminology is utilized uniformly and that requirements in one subsection do not logically conflict with constraints elsewhere.^17
- *Contextual Relevance:* Ensures the specification remains bounded to its original intent, increasingly assessed via semantic similarity scoring using embedding-based analysis.^17
- *Design Adherence:* Verifies that individual capability specifications reflect the boundaries established by the broader systemic architecture's governance documents. Architectural drift or pattern inconsistency is flagged as a coherence violation.^1,8,10,11

### 4. Standardizing Quality via ISO/IEC/IEEE 29148

ISO/IEC/IEEE 29148:2018 defines the construct of a "good requirement" and outlines attributes specifications must possess, irrespective of target domain.^19 Synthesizing the Rule of 5 and Tripartite Engine with this standard produces an exhaustively comprehensive evaluation matrix:

| ISO 29148 Characteristic | Generic Definition | Integration with Evaluation Metrics |
| :---- | :---- | :---- |
| **Necessary** | Addresses a core stakeholder need or critical quality characteristic (safety, security). Without it, the system exhibits a fundamental deficiency.^20 | Mapped to the *Draft* filter; evaluated via **Value Analysis** quantifying utility against business/mission objectives.^2 |
| **Appropriate** | Suited to the specific domain, operating context, and level of abstraction, without implying a specific implementation prematurely.^12 | Evaluated under **Coherence (Contextual Relevance)** using semantic embedding analysis for architectural constraint alignment.^17 |
| **Unambiguous** | Possesses only one possible interpretation by any stakeholder or autonomous agent.^12 | Enforced by the *Clarity* filter.^2 LLM-based linguistic analysis flags statements generating multiple interpretative paths.^20 |
| **Complete** | Contains all information necessary to define expected behavior, including responses to abnormal situations and boundary conditions.^20 | Assessed via the **Completeness** dimension using SC and FC statistical metrics.^13 |
| **Singular** | Specifies only one distinct capability, function, or constraint, preventing entanglement of multiple objectives.^12 | Evaluated by syntactic parsing algorithms detecting compound statements, excessive conjunctions, and multi-part mandates. |
| **Feasible** | Can be realized within physical, temporal, and budget constraints.^12 | Assessed via the *Edge Cases* filter.^2 Historical data retrieval and predictive simulation validate solution limits.^2 |
| **Verifiable** | Implementation can be objectively proven through testing, mathematical proof, inspection, or demonstration.^12 | Core to the **Correctness** dimension. Requires testable acceptance criteria (GIVEN/WHEN/THEN) and formal mathematical modeling.^6 |
| **Correct** | Accurately reflects stakeholder intent and complies with all higher-level mandates and legal obligations.^12 | Mapped to the *Accuracy* filter and **Correctness** dimension.^2 Validated through mandatory human-in-the-loop review.^2 |
| **Conforming** | Adheres to prescribed structural standards, organizational templates, and formatting conventions.^20 | Addressed by the *Excellence* filter.^2 Enforced via strict Markdown/LaTeX structure validation and schema adherence checks.^18 |

### 5. The Paradigm of Executable Specifications

A critical advancement is the transition toward executability — the demand that specifications be inherently machine-executable while remaining human-readable, eliminating "implementation bias" where overly detailed but non-executable specifications arbitrarily favor specific implementations.^15,23,24

**Business Process Modeling.** Business processes modeled in BPMN function as generic specifications for organizational behavior.^25 Executability is evaluated to ensure the workflow can be mathematically simulated without deadlocks or infinite loops.^26 If removing an IT component renders a compliance process non-executable, the engine flags a violation of superior compliance requirements.^25 Evaluation metrics include the ratio of successfully executed pathways to total pathways.^27

**Dynamic Contract Checking.** Specifications defined by pre- and post-conditions can serve as active runtime safety mechanisms.^28 Advanced frameworks employ constraint solvers to automatically execute the specification during violations, calculating alternative logical pathways that maintain required constraints — transforming specifications from passive evaluation tools into dynamic agents of systemic resilience.^28

**Hardware Description Languages.** Hardware specifications must be executable to mitigate the costs of post-fabrication flaw discovery. HDLs simulate logic gates, timing delays, and power management sequences, allowing the framework to identify signal integrity issues, deadlocks in power-up sequences, and latency contention before physical manufacturing.^29,30

### 6. Automating Subjective Assessment: The LLM-as-a-Judge Framework

Assessing architectural coherence, conceptual clarity, and domain appropriateness requires semantic understanding beyond deterministic scripts.^5 The LLM-as-a-Judge paradigm uses advanced foundational models to evaluate outputs by scoring against dynamically generated, context-specific rubrics, solving the bottleneck of scaling human-level semantic review.^31 Studies indicate properly calibrated LLM judges achieve agreement with human preferences rivaling human-to-human agreement.^32

**Semantic Review vs. Generic Linting.** The framework replaces static generic linting with Semantic Code Review, where the evaluation engine dynamically generates a bespoke rubric from: (1) functional scenarios in the specification (GIVEN/WHEN/THEN), (2) technical decisions in architectural design files, and (3) foundational conventions in project governance documents.^1,5 This enables domain-specific judgments — e.g., recognizing that logging system actions is a CRITICAL violation in a secure payment handler but merely a SUGGESTION in a benign utility module.^5

**Structuring the LLM Judge.** To prevent degradation into arbitrary scoring, evaluation prompts must define:^31

- **Persona:** A specific, highly focused role (Principal Architecture Reviewer, Functional Safety Manager, Performance Engineer) to narrow the evaluative lens.^33
- **Criteria and Definitions:** Explicit, unambiguous definitions of quality levels for Completeness, Relevance, Consistency, Clarity.^18
- **Scoring Scheme:** Formal output structure (binary pass/fail, ordinal scale, or weighted quantitative formula), often requiring chain-of-thought reasoning for transparency and debuggability.^31

An automated scoring formula distributes weights quantitatively across the Tripartite Engine dimensions: `V = w_RC * RC + w_IC * IC + w_SA * SA`, where RC is Requirement Coverage (Completeness, e.g., w=0.30), IC is Internal Consistency (Coherence, e.g., w=0.25), and SA is Semantic Accuracy (Correctness, e.g., w=0.45). Specifications failing a minimum threshold (e.g., 70/100) are automatically rejected.^35

**Multi-Agent Workflows and PARCER Contracts.** Advanced instantiations deploy Multi-Agent Markov-state (MaMs) workflows with shared policies executing structured loops of search, state updates, and report generation.^36 Every phase declares explicit preconditions and postconditions via a PARCER contract system; the orchestrator validates these before launching any phase.^5 When violations are detected, issues are classified as AUTO_FIXABLE or HUMAN_REQUIRED.^5 Auto-fixable issues trigger a bounded negotiation loop: a subordinate agent rewrites the failing section and the evaluation gate reruns, with early termination triggers (e.g., max two iterations) preventing infinite recursion before forced escalation to the human orchestrator.^5

### 7. Cross-Domain Application Profiles

**Profile 1: Enterprise Business Process Analysis (BPA).** Specifications manifest as SOPs, workflow diagrams, and compliance mandates.^14

- *Completeness:* Verifies the SOP exhaustively defines purpose, triggering mechanism, step-by-step actions, responsible personnel, and required SLAs. Missing nodes cause structural completeness failure.^14
- *Correctness:* Utilizes Value Analysis to quantify operational utility — evaluating estimated duration, resource costs, and decision probabilities against strategic business goals.^22
- *Coherence:* Employs Gap Analysis, cross-referencing current process value against theoretically optimized value to verify proposed changes logically bridge the discrepancy.^22

**Profile 2: Hardware Design and Compliance Verification.** Hardware is bound by inflexible physical laws, strict manufacturing tolerances, and uncompromising safety regulations.

- *Completeness:* Assessed against exhaustive industry checklists — ISO 26262 Part 5 for automotive (failure mode analyses, explicit safety mechanisms),^34 Section 508 compliance matrices for government procurement (accessibility features, contrast ratios, non-proprietary connections).^37
- *Correctness:* Physical and operational constraints (CPU utilization limits, memory boundaries, peripheral requirements, network access demands) evaluated against known physical limitations and enterprise capabilities.^38
- *Coherence:* Verifies internal logic of component design — seamless integration within the broader system architecture without signal degradation, unexpected latency, or power-up deadlocks.^30

**Profile 3: Academic and Scientific Research Design.** Research questions and systematic literature review structures represent highly abstract specifications.

- *Completeness:* Utilizes the PICO framework (Population, Interventions, Comparators, Outcomes) to evaluate structural completeness, verifying the specification bounds scope and defines eligibility criteria before data synthesis.^39
- *Correctness:* Evaluates research questions against the FINER criteria (Feasible, Interesting, Novel, Ethical, Relevant), ensuring methodology is practically executable and ethically bounded.^40
- *Coherence:* Applies Contextualized Topic Coherence (CTC) metrics, calculating occurrence probabilities of conceptual themes to mathematically verify alignment with established scholarship and avoid high-scoring but meaningless semantic combinations.^17,41

## Analysis

### The Universality of Specification-Driven Evaluation

The core insight of this research is that the Resonant Coding methodology's mechanical structures are domain-agnostic. The Propose-Apply-Archive lifecycle is not a software development pattern — it is a general-purpose pattern for managing intent under conditions of complexity and stochasticity. Every domain examined (business processes, hardware design, academic research) independently arrived at analogous lifecycle structures: SOPs undergo drafting, approval, and archival; hardware specifications pass through design review, fabrication, and post-silicon validation; research designs move through proposal, execution, and publication.

The tripartite verification engine (Completeness, Correctness, Coherence) maps universally because these dimensions correspond to the fundamental failure modes of any specification: missing information (incomplete), wrong information (incorrect), and contradictory information (incoherent). The ISO 29148 integration strengthens this mapping by providing nine granular characteristics that decompose naturally across the three dimensions and the five evaluation filters.

### Critical Limitations

**Domain-specific rubric dependency.** The framework's portability depends entirely on the quality of the domain-specific rubrics plugged into the evaluation engine. A poorly constructed rubric for hardware compliance will produce meaningless evaluations regardless of framework rigor. The framework defines the *structure* of evaluation but not the *content* — domain expertise remains irreplaceable.

**Executability asymmetry.** The demand for executable specifications is unevenly achievable across domains. Software and hardware specifications can approach full executability through test suites and HDL simulations. Business process specifications achieve partial executability through BPMN simulation. Academic research specifications resist executability — a research design cannot be "executed" in the same deterministic sense, and evaluation must rely more heavily on the heuristic and LLM-as-a-Judge layers.

**LLM-as-Judge circularity.** Deploying stochastic models to evaluate specifications generated by stochastic models introduces systemic bias replication. The bounded negotiation loops and PARCER contracts mitigate runaway recursion but do not resolve the fundamental epistemic problem: the judge may share the same blind spots as the generator.

**Scale-coherence tension.** As specifications grow in complexity, coherence evaluation becomes computationally expensive and increasingly dependent on network-size-matched reference models. The mathematical normalization approaches described (median slopes of internal vs. external degree distributions) are promising but remain largely theoretical for enterprise-scale specification networks.

### Implications for the Incitaciones Methodology

The framework validates the incitaciones repository's foundational premise: that prompt engineering and context engineering are fundamentally specification engineering problems. The Rule of 5 evaluation filter, originally designed for reviewing AI-generated code artifacts, functions identically when applied to business process SOPs, hardware requirement documents, or research methodology designs. This suggests that the prompt library's techniques — rigorous sequential evaluation, explicit context externalization, and systematic archival — constitute a domain-general engineering discipline rather than an AI-specific tooling concern.

## Key Takeaways

1. **The Propose-Apply-Archive lifecycle is domain-agnostic.** The Resonant Coding specification lifecycle — explicitly documenting intent before execution, constraining implementation to approved boundaries, and systematically archiving artifacts — applies identically to software, hardware, business processes, and research design. Unarchived changes are technical debt regardless of domain.

2. **Completeness, Correctness, and Coherence are universal evaluation axes.** These three dimensions map to the fundamental specification failure modes (missing, wrong, contradictory information) and can be decomposed into measurable sub-metrics (Structural/Functional Completeness, Semantic Mapping, Internal Consistency/Contextual Relevance/Design Adherence) across any technical domain.

3. **ISO 29148's nine requirement characteristics provide the granular evaluation matrix.** The nine characteristics (Necessary, Appropriate, Unambiguous, Complete, Singular, Feasible, Verifiable, Correct, Conforming) distribute naturally across the Rule of 5 filters and the tripartite dimensions, enabling algorithmic processing of any proposed specification before implementation resources are committed.

4. **Executable specifications eliminate implementation bias.** The transition from descriptive to executable specifications — whether through BPMN simulation, dynamic contract checking, or HDL verification — enables detection of deadlocks, constraint violations, and integration failures before costly implementation or fabrication.

5. **LLM-as-a-Judge scales semantic review but requires strict structural controls.** Deploying context-aware, rubric-driven LLM judges with defined personas, explicit criteria, formal scoring schemes, and bounded auto-negotiation loops enables human-level semantic evaluation at computational scale — but the circularity problem (stochastic judges evaluating stochastic outputs) demands human escalation paths and early termination triggers.

6. **Domain expertise remains the bottleneck, not framework design.** The framework defines the structure of evaluation but not the content. Portability across business process analysis, hardware compliance, and academic research design depends entirely on the quality of domain-specific rubrics, checklists, and reference standards fed into the engine.

7. **Prompt engineering is specification engineering.** The techniques developed for AI prompt evaluation — sequential filtering, context externalization, systematic archival — constitute a domain-general engineering discipline applicable wherever abstract human intent must be translated into verifiable, machine-executable reality.

## Sources

1. "Steering the Agentic Future: A Technical Deep Dive into BMAD, Spec Kit, and OpenSpec in the SDD Landscape," Aparna Pradhan, Medium. https://medium.com/@ap3617180/steering-the-agentic-future-a-technical-deep-dive-into-bmad-spec-kit-and-openspec-in-the-sdd-4f425f1f8d2b
2. "Resonant Coding: or How I Learned to Stop Worrying and Love the..." https://charly-vibes.github.io/microdancing/en/posts/resonant-coding.html
3. "openspec.md," GitHub Gist. https://gist.github.com/Darkflib/c7f25b41054a04a5835052e5a21cdf82
4. "AI Software Development: Spec-Driven vs. Vibe Coding," DevOpsTales. https://devopstales.github.io/ai/ai-software-development-spec-vs-vibe/
5. "Building a Complete AI Development Ecosystem for Claude Code," GitHub Issue #32627. https://github.com/anthropics/claude-code/issues/32627
6. "Building Effective AI Coding Agents for the Terminal," arXiv. https://arxiv.org/html/2603.05344v3
7. "ADR, OpenSpec and Spec-Driven Development: Decision and Spec Management." https://ceaksan.com/en/adr-openspec-decision-spec-management/
8. "OpenSpec Verify Change | Claude Code Skill for Validation," MCP Market. https://mcpmarket.com/tools/skills/openspec-implementation-verifier-9
9. "Test and Evaluation of Artificial Intelligence Models," AI.mil. https://www.ai.mil/Portals/137/Documents/Resources%20Page/Test%20and%20Evaluation%20of%20Artificial%20Intelligence%20Models%20Framework.pdf
10. "OpenSpec Verify Change | Claude Code Skill for Validation," MCP Market. https://mcpmarket.com/tools/skills/openspec-implementation-verifier
11. "openspec-verify-change | Skills," LobeHub. https://lobehub.com/de/skills/foreztgump-massive-skill-openspec-verify-change
12. "IEEE 29148-2018 Standard for Requirements Engineering," CWNP. https://www.cwnp.com/req-eng/
13. "RTADev: Intention Aligned Multi-Agent Framework for Software Development," ACL Anthology. https://aclanthology.org/2025.findings-acl.80.pdf
14. "How to Evaluate Business Processes in a Company?," Aptien. https://aptien.com/en/kb/articles/how-to-evaluate-business-processes-in-a-company
15. "OpenSpec is a spec-driven development platform for AI coding," Jimmy Song. https://jimmysong.io/ai/openspec/
16. "Formal verification," Wikipedia. https://en.wikipedia.org/wiki/Formal_verification
17. "How To Measure Response Coherence in LLMs," Latitude.so. https://latitude.so/blog/how-to-measure-response-coherence-in-llms
18. "Rubrics reference guide," Microsoft Copilot Studio. https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/kit-rubrics-reference
19. "IEEE/ISO/IEC 29148-2018," IEEE SA. https://standards.ieee.org/standard/29148-2018.html
20. "Well-Formed Quality of System Requirements for Verifying to ISO 29148-2018," ResearchGate. https://www.researchgate.net/publication/385802396
21. "ISO/IEC/IEEE 29148:2018," Dr Kasbokar. https://drkasbokar.com/wp-content/uploads/2024/09/29148-2018-ISOIECIEEE.pdf
22. "5 Common BPA (Business Process Analysis) Techniques," Blueprint. https://www.blueprintsys.com/blog/5-bpa-business-process-analysis-techniques-you-should-know
23. "Bias and Design in Software Specifications," NASA Technical Reports Server. https://ntrs.nasa.gov/api/citations/19920010188/downloads/19920010188.pdf
24. "Specifications are (preferably) executable," Software Engineering Journal. https://digital-library.theiet.org/doi/10.1049/sej.1992.0033
25. "Maintaining business process compliance despite changes," Taylor & Francis. https://www.tandfonline.com/doi/full/10.1080/12460125.2020.1861920
26. "Requirements Engineering Based on Business Process Models: A Case Study," ResearchGate. https://www.researchgate.net/publication/224079788
27. "Improving Process Portability through Metrics and Continuous Inspection," Dr. Jorg Lenhard. https://joerglenhard.wordpress.com/wp-content/uploads/2017/05/ipais-lenhard-final.pdf
28. "Falling Back on Executable Specifications," UCLA CS. http://web.cs.ucla.edu/~todd/research/ecoop10.pdf
29. "Hardware verification: are you meeting your requirements?," Team Consulting. https://www.team-consulting.com/insights/hardware-verification-are-you-meeting-your-requirements/
30. "Verification And Validation Don't Mean The Same Thing," Semiconductor Engineering. https://semiengineering.com/verification-validation-dont-mean-thing/
31. "Exploring LLM-as-a-Judge," Weights & Biases. https://wandb.ai/site/articles/exploring-llm-as-a-judge/
32. "When AI Becomes the Judge: Understanding LLM-as-a-Judge," Bunnyshell. https://www.bunnyshell.com/blog/when-ai-becomes-the-judge-understanding-llm-as-a-j/
33. "Your AI code reviewer has no one to disagree with," DEV Community. https://dev.to/spencermarx/your-ai-code-reviewer-has-no-one-to-disagree-with-f1j
34. "Free ISO 26262 Hardware Design Audit Checklist." https://audit-now.com/templates/iso-26262-hardware-design-audit-checklist-331/
35. "OpenCode Agents: Another Path to Self-Healing Documentation Pipelines," Medium. https://medium.com/@richardhightower/opencode-agents-another-path-to-self-healing-documentation-pipelines-51cd74580fc7
36. "Learning Query-Specific Rubrics from Human Preferences for DeepResearch Report Generation," arXiv. https://arxiv.org/html/2602.03619v1
37. "VA Section 508 Hardware Standards Checklist." https://digital.va.gov/section-508/wp-content/uploads/sites/9/2024/02/VASection508StandardsChecklist-Hardware.pdf
38. "Hardware Requirements Checklist," Commonwealth of Pennsylvania. https://www.pa.gov/content/dam/copapwp-pagov/en/dhs/documents/providers/providers/documents/business-and-tech-standards/business-domain/Hardware%20Requirements%20Checklist.doc
39. "Chapter 3: Defining the criteria for including studies," Cochrane Handbook. https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-03
40. "Back to the basics: guidance for formulating good research questions," PMC/NIH. https://pmc.ncbi.nlm.nih.gov/articles/PMC11129835/
41. "Contextualized Topic Coherence Metrics," ACL Anthology, EACL 2024 Findings. https://aclanthology.org/2024.findings-eacl.123.pdf
