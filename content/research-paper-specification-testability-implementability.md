---
title: "Evaluating Software Specifications for Testability, Implementability, and Behavioral Plausibility"
type: research
subtype: paper
tags: [specification-evaluation, testability, implementability, requirements-engineering, iso-29148, bdd, atdd, ears, nlp-ambiguity-detection, feasibility-analysis, heuristic-evaluation, shift-left, definition-of-ready]
tools: [cucumber, robot-framework, sonarqube, arm, reta, gate]
status: draft
created: 2026-04-06
updated: 2026-04-06
version: 1.0.0
related: [research-paper-specification-evaluation-generic-framework.md, research-paper-verification-protocols-deterministic-architectures.md, research-standalone-specification-standards.md, research-documentation-frameworks.md]
source: "Synthesis of ISO/IEC/IEEE 29148 requirements engineering standards, James Bach's testability heuristics, PIECES/GLIA feasibility frameworks, EARS syntax enforcement, BDD/ATDD executable specification paradigms, and NLP-based automated ambiguity detection methodologies"
---

# Evaluating Software Specifications for Testability, Implementability, and Behavioral Plausibility

## Summary

The quality of a software requirements specification (SRS) determines the ceiling of engineering success — a specification that cannot be implemented or tested is indistinguishable from one that does not exist. This research synthesizes the principal methodologies for evaluating specifications prior to implementation: structural baseline requirements grounded in ISO/IEC/IEEE 29148, multi-dimensional feasibility frameworks (PIECES, GLIA), James Bach's five-dimensional testability heuristics, shift-left validation paradigms (BDD, ATDD, Specification by Example), structural syntax enforcement via the EARS framework, static analysis through collaborative reviews and heuristic evaluation, advanced NLP-based automated ambiguity detection, quantitative quality metrics, and the operational codification of evaluation gates through the Agile Definition of Ready. The paper further examines the novel challenge of evaluating behavioral specifications for foundation models and the role of post-implementation behavioral analytics in closing the specification-to-deployment verification loop.

## Context

Software project failures are disproportionately linked to defects introduced during requirements engineering.^2,26 Ambiguities, logical impossibilities, and untestable clauses embedded within specifications propagate silently through design and coding phases, magnifying remediation costs by orders of magnitude.^2 The shift-left movement emphasizes that defects found during requirements analysis cost significantly less to rectify than those discovered in production.^2

The SRS acts as the definitive translation of stakeholder needs into a rigorous, implementation-free description of the system to be developed — the ultimate source of truth for engineering efforts and the primary agreement between acquiring stakeholders and technical suppliers.^1,5 However, the theoretical existence of a specification is insufficient; a specification is only as valuable as its capacity to be accurately translated into working software (implementability) and rigorously validated against its original intent (testability).^1

The evaluation challenge is inherently multifaceted. Implementability assessment must determine whether stated behavior can be engineered within the constraints of current technology, budgets, legacy integrations, and operational environments.^3 Testability assessment must determine whether the specification is articulated in a manner that permits the derivation of definitive, executable test criteria.^4 Neither dimension can be evaluated in isolation — a specification that is perfectly testable but physically impossible to implement, or perfectly implementable but impossible to verify, fails the engineering mission equally.

While related work in this repository examines specification evaluation through the lens of the Resonant Coding methodology's generic framework (Completeness, Correctness, Coherence) and formal verification via theorem provers and model checkers, this paper focuses specifically on the *evaluation methodology pipeline* — the practical combination of standards, frameworks, heuristics, syntax enforcement, and automated tooling that engineering teams deploy to assess specifications before committing implementation resources.

## Hypothesis / Question

What combination of structural standards, feasibility frameworks, testability heuristics, executable specification paradigms, syntax enforcement templates, and automated NLP tooling is necessary to systematically evaluate software specifications for implementation plausibility and behavioral testability — and how are these methodologies operationalized into engineering workflow gates that prevent defective specifications from reaching development?

## Method

The research employs a multidisciplinary synthesis of:

- **International Standards Analysis:** Examination of the ISO/IEC/IEEE 29148:2018 framework and its predecessor IEEE 830-1998, defining the minimum structural and semantic characteristics required for specification viability.^1,5
- **Granular Specification Paradigm Review:** Comparative evaluation of INVEST, SMART, and PABLO criteria for evaluating agile-scale specifications (user stories, product backlog items).^6,7
- **Feasibility Framework Analysis:** Detailed decomposition of the PIECES framework (Performance, Information, Economy, Control, Efficiency, Services) and the GLIA instrument (Computability, Decidability, Executability) adapted for software specification evaluation.^3,8,9
- **Testability Heuristic Assessment:** Analysis of James Bach's five-dimensional testability model (Intrinsic, Epistemic, Value-Related, Project-Related, Subjective) and its evaluative guidewords.^4
- **Executable Specification Review:** Assessment of BDD, ATDD, and Specification by Example paradigms including the Gherkin syntax as mechanisms for intrinsic testability enforcement.^10,11,12
- **Structural Syntax Analysis:** Examination of the EARS framework's five behavioral patterns (Ubiquitous, Event-Driven, State-Driven, Unwanted Behavior, Optional Features) for enforcing testability in textual requirements.^13
- **Automated Tooling Evaluation:** Review of NLP tools (ARM, RETA, RCM), machine learning classifiers (SVM, RF, KNN), and LLM-based specification evaluation including the SpecEval framework.^14,15,16,17
- **Quantitative Metrics Assessment:** Analysis of deterministic quality metrics (Defect Density, Requirement Coverage, Potential Structural Inconsistency, MTTR, Defect Capture Rate).^18
- **Operational Gate Analysis:** Evaluation of the Agile Definition of Ready as the codification point for evaluation methodologies into daily engineering workflow.^19

## Results

### 1. Minimum Structural Requirements: The ISO/IEC/IEEE 29148 Baseline

Before any specification can be evaluated for implementability or testability, it must conform to a baseline set of structural and semantic requirements governed by ISO/IEC/IEEE 29148:2018.^5 The standard mandates that a viable requirement must exhibit:

- **Unambiguity:** Only one valid interpretation, communicated in precisely defined language. Ambiguity introduces branched logic in human comprehension, leading to divergent implementations and conflicting test cases.^1
- **Completeness:** All necessary information, conditions, and constraints required for functionality, performance, design constraints, and external interfaces, omitting no critical system responses or edge cases.^1
- **Consistency:** No internal contradictions, nor conflicts with higher-level business requirements or architectural constraints.^1
- **Verifiability:** Stated using measurable elements and defined terminology such that an independent entity can establish definitive test criteria.^1
- **Implementation-free formulation:** Articulates *what* the system shall do, not *how* — embedding architectural decisions within behavioral specifications artificially constrains the solution space and violates the SRS abstraction layer.^5
- **Traceability:** Backward to a validated stakeholder need, forward to specific design components and executable test cases.^5
- **Ranked importance and stability:** Acknowledging that not all requirements carry equal weight, providing a basis for cost, risk, and schedule estimation.^5

### 2. Granular Evaluative Paradigms: INVEST, SMART, and PABLO

In agile environments, specifications are localized to granular units (user stories, backlog items) evaluated through immediate filters before sprint planning.^6

The **INVEST** matrix demands specifications be Independent (minimizing dependencies), Negotiable (inviting technical conversation), Valuable (delivering tangible vertical value), Estimable (comprehensible enough for effort approximation), Small (fitting within a single iteration), and Testable (providing explicit success criteria).^6

**SMART** requires specifications to be Specific, Measurable, Achievable (implementable), Relevant, and Time-bound. **PABLO** further refines evaluation based on Purpose, Advantage, Benefit, Longevity, and Outlay.^7 Together, these paradigms ensure a specification is not a conceptual wish but an actionable, bounded, economically justified engineering directive.

### 3. Functional vs. Non-Functional Specification Interdependence

A complete SRS must strictly delineate between functional specifications (inputs, operational sequences, data transformations, validity checks, outputs) and non-functional specifications (performance metrics, scalability limits, security protocols, reliability thresholds, usability heuristics).^1

Critically, non-functional requirements frequently dictate the technical implementability of functional requirements. A functional specification for real-time natural language processing may be easily implementable in isolation but becomes highly implausible when constrained by a non-functional requirement mandating sub-millisecond latency on legacy hardware with limited memory.^1 The minimum definition of a specification requires simultaneous evaluation of functional intent against non-functional constraints.

### 4. The PIECES Feasibility Framework

The PIECES framework systematizes implementability evaluation across six interconnected domains:^3

| Dimension | Evaluative Focus |
| :---- | :---- |
| **Performance** | Whether the proposed architecture can handle the throughput, flow, and response times dictated by the specification under peak operational stress. |
| **Information** | Whether the system can generate, organize, and retrieve correct, useful, and timely information — including database logical soundness and query efficiency. |
| **Economy** | Whether the financial cost of implementing the technical complexity is justified by expected ROI, guarding against scope-driven cost overruns. |
| **Control** | Whether the system can enforce necessary security protocols and permission models without breaking core functionality or degrading performance. |
| **Efficiency** | Whether the requirements waste computational cycles, demand excessive human intervention, or introduce unnecessary technical layers. |
| **Services** | Whether the specification aligns with broader operational goals, providing accuracy, reliability, and maintainability suitable for the intended market. |

By passing specifications through the PIECES matrix, abstract technical doubts are transformed into quantifiable risks, preventing functionally desirable but economically disastrous or architecturally paralyzing specifications from proceeding.^3

### 5. The GLIA Instrument Adapted for Software

The GuideLine Implementability Appraisal (GLIA) instrument, originally developed for evaluating clinical practice guidelines, encompasses ten appraisal dimensions. Three are particularly relevant when adapted for software specification evaluation:^8,9

- **Computability:** Whether a specified behavior can be operationalized into algorithmic logic. A specification is not computable if it relies on subjective human judgment without providing distinct, quantifiable thresholds.^9
- **Decidability:** Whether the specification precisely dictates *when* the system should execute an action. Ambiguous, contradictory, or externally dependent trigger conditions produce implementations that developers interpret discordantly.^9
- **Executability:** Whether the specification clearly communicates exactly *what* the system must do once triggered. Executability fails with vague directives like "optimize the data flow" or "handle the error gracefully" instead of explicit, deterministic computational instructions.^9

### 6. Architectural Spikes and Mathematical Intractability

When static analysis cannot conclusively prove implementability, teams employ architectural "spikes" — time-boxed, exploratory coding efforts that empirically validate technical assumptions by creating rapid, disposable prototypes.^20 The CMU/SEI framework recommends developing prototypes incorporating key algorithms to provide empirical results not otherwise available through theoretical analysis.^21

In complex operational research scenarios, evaluators may encounter specifications representing fundamentally intractable mathematical problems. Implementability assessment then requires determining whether a conservative approximation can restore computational tractability without violating the spirit of the specification — and testing these approximations on large-scale instances to validate that they are not overly conservative.^22

### 7. James Bach's Five Dimensions of Testability

James Bach's Heuristics of Software Testability model asserts that practical testability is a multi-dimensional concept that cannot be expressed in any single metric.^4 It is a function of the tester, the process, the context, and the product:

| Dimension | Evaluative Focus |
| :---- | :---- |
| **Intrinsic Testability** | Observability (can system states be queried?), Controllability (can inputs and execution states be manipulated for automation?), Simplicity (is the design self-consistent and minimally complex?), Availability (can the system be tested in isolated functional stages?). |
| **Epistemic Testability** | The "risk gap" — difference between what is known and what needs to be known. Novel or disruptive specifications inherently lower epistemic testability, requiring significantly more exploratory testing. |
| **Value-Related Testability** | Business value, risk tolerance, and quality requirements. Mission-critical systems demand vastly more rigorous testability standards than aesthetic enhancements. |
| **Project-Related Testability** | Change Control (are specifications evolving so rapidly they disrupt testing?), Information Availability (is documentation accurate and accessible?), and availability of test tools, data, and simulated environments. |
| **Subjective Testability** | Whether the testing personnel possess sufficient domain expertise. A specification testable by a cryptographic algorithm expert may be entirely untestable to a generalist QA engineer. |

A specification that mandates complex background data synchronization without specifying logging mechanisms or queryable states fails the Observability heuristic — "what you see is what can be tested" becomes a fatal limitation.^4

When specifications fail testability evaluation, **testability transformations** offer a remediation path. Evaluators may demand the inclusion of assertions within unit specifications, mandate deliberate decoupling of dependencies to allow isolated domain testing, or require that specifications explicitly define implementation boundaries so that test harnesses, mock servers, and simulated environments can be configured for high-fidelity record-and-replay scenarios.^4

### 8. BDD, ATDD, and Executable Specifications

The shift-left movement treats behavioral specifications as executable tests, bridging the semantic disconnect between business analysts and developers.^10

In ATDD and Specification by Example (SbE), cross-functional teams discover intended behaviors through concrete examples: "Imagine the system to be finished. How would you use it and what would you expect from it?"^11 Examples are distilled, deduplicated, and partitioned into equivalence classes — keeping one representative test per behavior class prevents test bloat while ensuring clarity.^12

The **Gherkin syntax** (Given/When/Then) enforces testability intrinsically:^10

- **Given:** Establishes precondition and system state.
- **When:** Defines the precise trigger or user action.
- **Then:** Dictates the verifiable, measurable system response.

If a product owner cannot articulate a behavior within this structure, the behavior is deemed logically incomplete and unready for implementation.^10 As formality increases, the boundary between specification and test dissolves — the executable test *is* the requirement, creating a single source of truth that eliminates the need to synchronize disparate documentation.^10

### 9. The EARS Framework for Structural Syntax Enforcement

The Easy Approach to Requirements Syntax (EARS) constrains natural language by providing strict structural syntax based on temporal logic, eliminating ambiguity, vague adjectives, and missing triggers.^13 Every requirement must possess, in specific order: optional preconditions, an optional trigger, a specific system name, an imperative verb ("shall"), and a concrete system response.

EARS aligns with high-assurance specification practices from organizations like NASA, which mandate precise use of imperative terminology: "shall" exclusively denotes a binding requirement, "will" denotes a declaration of purpose or statement of fact, and "should" denotes a goal.^27 Furthermore, NASA specifications must be free of unverifiable, subjective terminology — words such as "flexible," "easy," "sufficient," "robust," or "user-friendly" immediately invalidate a specification's testability because they cannot be mathematically or empirically bounded.^27

EARS defines five testable behavioral patterns:

| Pattern | Syntax | Evaluative Benefit |
| :---- | :---- | :---- |
| **Ubiquitous** | *The \<system\> shall \<response\>* | Fundamental properties always active; testable via static analysis. |
| **Event-Driven** | *When \<trigger\>, the \<system\> shall \<response\>* | Explicitly defines boundary event; test cases derived by simulating the trigger. |
| **State-Driven** | *While \<precondition\>, the \<system\> shall \<response\>* | Behaviors active only in defined states; verified by monitoring response during state. |
| **Unwanted Behavior** | *If \<error\>, then the \<system\> shall \<response\>* | Forces explicit error handling; ensures negative paths are defined and tested. |
| **Optional Features** | *Where \<feature present\>, the \<system\> shall \<response\>* | Isolates behaviors to specific configurations; test matrices account for variations. |

A requirement lacking an imperative, containing multiple imperatives, or using non-specific temporal words like "immediately" (which cannot be measured in milliseconds or CPU cycles) generates a structural quality alert.^13

### 10. Static Analysis, Reviews, and Heuristic Evaluation

Static testing examines specifications without executing software, proactively identifying logical defects, syntax errors, missing constraints, and inconsistencies at the cheapest rectification point.^23

**Collaborative Reviews** utilize checklist-driven inspections assessing cohesion (related requirements grouped logically), completeness (no undefined acronyms or missing edge cases), unambiguity (no vague adjectives like "fast," "user-friendly," "robust"), and traceability (lineage tracked via Requirements Verification Matrix).^23

**Heuristic Evaluation** applies Jakob Nielsen's 10 Usability Heuristics to UX specifications:^24

- *Visibility of system status:* Does the specification require timely, appropriate feedback to user actions?
- *Error prevention:* Does the specification anticipate user errors and provide graceful recovery paths?
- *Consistency and standards:* Does the specification conform to established platform conventions?

This prophylactic evaluation uncovers major usability issues without requiring expensive post-implementation user testing.^24

### 11. Automated NLP Tooling and Machine Learning

At scale, manual review becomes computationally impossible. Automated NLP mechanisms quantify requirement quality:^14

| Tool | Mechanism |
| :---- | :---- |
| **ARM (NASA)** | Scans for imperatives ("shall"), continuances ("and," "below" — increasing complexity), weak phrases ("adequate"), and options ("can," "may" — destroying binary verifiability). |
| **RETA** | Checks requirements against Rupp's and EARS templates; flags passive voice, unresolved pronouns, and universal quantifiers ("all," "every" — generating unbounded testing scenarios). |
| **RCM** | Calculates cognitive complexity: word count, vague phrases, conjunctions, reference documents, and automated readability index. High scores indicate likely misinterpretation during implementation. |

Supervised ML classifiers (SVM, RF, KNN) using Bag-of-Words features detect grammatical ambiguity with high accuracy, with Random Forests frequently achieving highest detection rates.^15 The C-value method extracts candidate concepts and ranks them based on contextual analysis (words immediately before and after the concept) to detect overloaded and synonymous ambiguities.^15

LLM-based evaluation (e.g., SpecEval) measures the "three-way consistency gap" between a provider's written specification, the model's actual outputs, and adherence scores generated by an LLM acting as judge.^16 For foundation model behavioral specifications, traditional binary testability is replaced by probabilistic adherence scoring.^16

### 12. Quantitative Quality Metrics

Deterministic metrics provide whole-number measurements of specification health:^18

| Metric | Purpose |
| :---- | :---- |
| **Defect Density** | Total defects / module size (FP or KLOC). Highlights the most volatile, poorly written specification areas. |
| **Requirement Coverage** | Percentage of requirements linked to test cases. Low coverage indicates untestable or ignored specifications. |
| **Potential Structural Inconsistency (PSI)** | Models structural relationships to detect hidden contradictions — e.g., MFA security requirement conflicting with one-click access usability requirement. |
| **MTTR / Defect Capture Rate** | Estimating potential recovery time gauges maintainability; capture rate during review indicates static analysis effectiveness. |

### 13. Post-Implementation Behavioral Analytics

The pre-implementation evaluation pipeline (standards, feasibility, testability, syntax enforcement, automation) validates a specification's *potential* for success. To close the loop and validate that the pipeline's assessment was correct, teams verify that implemented behavior functions as intended with real users through behavioral analytics — the empirical test of behavioral plausibility:^25

Key metrics include Average Session Duration, Average Time on Page, and Conversion Rate — the percentage of users performing the specific task dictated by the original user story. If a specification designed to "improve the checkout funnel" yields a stagnant or dropping conversion rate, the specification — while technically implementable and testable — failed its primary business objective.^25

### 14. The Definition of Ready as Operational Gate

The Agile Definition of Ready (DoR) codifies evaluation methodologies into the daily engineering workflow.^19 It acts as a quality gate that a specification must pass before entering an active sprint — a socio-technical contract between product owner and development team.

A standard DoR checklist verifies:^19

1. Business value is clear and traces to a validated stakeholder need.
2. Acceptance criteria are explicitly defined and testable (ideally in BDD/Gherkin format).
3. External dependencies have been identified and resolved (architectural spikes have proven feasibility).
4. Estimability is achieved — the team understands the implementation path sufficiently for complexity estimation.
5. UI/UX mockups have undergone heuristic evaluation.

By strictly enforcing the DoR, organizations prevent developers from attempting to build systems based on half-formed, ambiguous, structurally inconsistent, or technically unfeasible specifications.^19

## Analysis

### The Dual Mandate: Implementability and Testability as Inseparable Concerns

The central architectural insight of this research is that implementability and testability are not independent quality dimensions — they are co-dependent constraints that must be evaluated simultaneously. A specification that is perfectly implementable but untestable produces software that cannot be verified. A specification that is perfectly testable but physically impossible to implement produces nothing at all. The evaluation methodologies surveyed form a coherent pipeline precisely because they address both concerns at each stage: ISO 29148 demands both feasibility and verifiability; PIECES assesses architectural plausibility while EARS enforces the syntax required for test derivation; BDD/ATDD collapses the specification-test distinction entirely.

### The Spectrum from Heuristic to Deterministic Evaluation

The methodologies range across a spectrum of formality. At the heuristic end, collaborative reviews and James Bach's testability dimensions provide structured but ultimately subjective evaluative frameworks — their effectiveness depends on evaluator expertise and domain knowledge. At the deterministic end, NLP tools like ARM and RETA produce quantifiable scores, and executable specifications in Gherkin syntax create binary pass/fail verification. The most robust evaluation regimes layer both: heuristic review catches semantic and contextual defects invisible to automated tools, while NLP analysis catches systematic linguistic patterns invisible to fatigued human reviewers.

### Behavioral Plausibility as a Distinct Evaluative Dimension

While implementability and testability dominate the evaluation pipeline, behavioral plausibility — whether the specified behavior will function as intended when interacting with real humans — emerges as a third evaluative axis. Heuristic evaluation (Section 10) assesses plausibility *before* implementation by validating specifications against cognitive and design principles. Post-implementation behavioral analytics (Section 13) assesses plausibility *after* deployment by measuring whether users actually perform the behaviors the specification predicted. Together, these bookend the implementation phase with empirical checks on the human-system interaction model, catching specifications that are technically sound but behaviorally implausible.

### The GLIA Adaptation and Cross-Domain Portability

Adapting the clinical GLIA instrument to software specification evaluation reveals a generalizable pattern: the Computability-Decidability-Executability triad maps to a fundamental question sequence applicable to any specification domain — Can the behavior be algorithmically expressed? Can the trigger conditions be precisely defined? Can the response be deterministically specified? These questions are domain-agnostic. Applied to business process specifications, Computability asks whether a workflow step can be automated; Decidability asks whether the triggering conditions for escalation are precisely defined; Executability asks whether the required action is concrete enough for a process operator to perform without interpretation. This triad complements the Completeness-Correctness-Coherence dimensions explored in the repo's existing generic specification evaluation framework.

### Critical Limitations

**Manual review scalability.** Collaborative reviews, walkthroughs, and heuristic evaluations are indispensable but do not scale to enterprise-grade specification portfolios containing tens of thousands of requirements. The NLP tooling layer is necessary but currently limited in semantic depth — detecting vague adjectives is trivial; detecting subtle logical contradictions between distant requirements remains an open problem.

**Foundation model testability.** Evaluating behavioral specifications for non-deterministic AI models fundamentally challenges the binary verifiability assumption underlying traditional testability. Probabilistic adherence scoring via SpecEval represents a promising but immature methodology, and LLM-as-Judge circularity (using stochastic models to evaluate stochastic outputs) introduces systemic bias replication.

**Definition of Ready enforcement.** The DoR's effectiveness depends entirely on organizational discipline. Without cultural commitment, the gate degrades into a checkbox exercise that fails to prevent defective specifications from entering development.

**Specification volatility.** The entire evaluation pipeline assumes a degree of specification stability. If specifications change rapidly between evaluation and implementation — a common reality in fast-moving agile environments — the evaluation itself becomes stale. Bach's Project-Related Testability dimension acknowledges this via the Change Control heuristic, but none of the frameworks surveyed provide a mechanism for *continuous re-evaluation* that keeps pace with specification churn without imposing prohibitive overhead.

**Formal verification gap.** This paper surveys heuristic, structural, and automated evaluation methodologies but does not cover formal methods — theorem provers, model checkers, and symbolic execution engines that can mathematically prove specification properties. These complementary techniques are examined in the related paper on verification protocols and deterministic architectures.

### Implications for Prompt and Specification Engineering

The methodologies surveyed validate a core premise of specification-driven development: that the quality of engineering output is bounded by the quality of its input specification. The EARS templates, BDD Gherkin syntax, and INVEST criteria function identically whether applied to software requirements, AI prompt specifications, or context engineering documents. A prompt that cannot be expressed in Given/When/Then format likely suffers from the same ambiguity and untestability as a software requirement that fails EARS structural validation.

## Key Takeaways

1. **Specifications must satisfy both implementability and testability simultaneously.** These are co-dependent constraints — evaluating either in isolation produces incomplete assessments. Non-functional requirements frequently dictate the technical feasibility of functional requirements, and the two categories must be evaluated together.

2. **ISO/IEC/IEEE 29148 provides the non-negotiable structural baseline.** Unambiguity, completeness, consistency, verifiability, implementation-free formulation, and traceability are minimum requirements before any further evaluation methodology can be meaningfully applied.

3. **Feasibility frameworks transform abstract doubts into quantifiable risks.** PIECES (Performance, Information, Economy, Control, Efficiency, Services) and the adapted GLIA triad (Computability, Decidability, Executability) provide systematic mechanisms to reject specifications that are functionally desirable but architecturally or economically implausible.

4. **Testability is multi-dimensional, not binary.** James Bach's five dimensions (Intrinsic, Epistemic, Value-Related, Project-Related, Subjective) demonstrate that testability depends on the product, the tester, the process, and the organizational context — not merely on whether acceptance criteria exist.

5. **Executable specifications eliminate the specification-test duality.** BDD/ATDD with Gherkin syntax collapses the boundary between requirement and test. A behavior that cannot be articulated in Given/When/Then format is logically incomplete and unready for implementation.

6. **EARS enforces testability through structural syntax.** The five behavioral patterns (Ubiquitous, Event-Driven, State-Driven, Unwanted Behavior, Optional Features) transform vague natural language into temporally precise, mathematically verifiable logic by mandating explicit triggers, system names, imperative verbs, and concrete responses.

7. **Automated NLP tooling is necessary but insufficient.** Tools like ARM, RETA, and RCM catch systematic linguistic patterns at scale, but semantic and contextual defects still require human heuristic review. The most robust evaluation layers both automated and manual analysis.

8. **The Definition of Ready operationalizes evaluation into workflow.** Without codification into an enforced quality gate, evaluation methodologies remain theoretical. The DoR transforms rigorous analytical preparation into a practical, daily engineering discipline.

## Sources

1. ISO/IEC/IEEE 29148:2018, "Systems and software engineering — Life cycle processes — Requirements engineering." IEEE SA. https://standards.ieee.org/standard/29148-2018.html
2. Boehm, B. and Basili, V. "Software Defect Reduction Top 10 List," IEEE Computer, vol. 34, no. 1, pp. 135-137, 2001.
3. Whitten, J.L. and Bentley, L.D. "Systems Analysis and Design Methods," 7th ed. McGraw-Hill, 2007. (PIECES Framework.)
4. Bach, J. "Heuristics of Software Testability," Satisfice, Inc. https://www.satisfice.com/download/heuristics-of-software-testability
5. "Well-Formed Quality of System Requirements for Verifying to ISO 29148-2018," ResearchGate. https://www.researchgate.net/publication/385802396
6. Wake, B. "INVEST in Good Stories, and SMART Tasks," XP123. https://xp123.com/articles/invest-in-good-stories-and-smart-tasks/
7. PABLO criteria (Purpose, Advantage, Benefit, Longevity, Outlay) — practitioner framework documented in agile project management training materials; no canonical academic citation identified.
8. Shiffman, R.N. et al. "The GuideLine Implementability Appraisal (GLIA): Development of an instrument to identify obstacles to guideline implementation," BMC Medical Informatics and Decision Making, vol. 5, no. 23, 2005. https://doi.org/10.1186/1472-6947-5-23
9. Shiffman, R.N. "Guideline Implementability Appraisal v2.0," Yale Center for Medical Informatics. https://gem.med.yale.edu/glia/
10. Wynne, M. and Hellesoy, A. "The Cucumber Book: Behaviour-Driven Development for Testers and Developers," 2nd ed. Pragmatic Bookshelf, 2017.
11. Adzic, G. "Specification by Example: How Successful Teams Deliver the Right Software." Manning Publications, 2011.
12. Adzic, G. "Bridging the Communication Gap: Specification by Example and Agile Acceptance Testing." Neuri Limited, 2009.
13. Mavin, A. et al. "Easy Approach to Requirements Syntax (EARS)," RE'09: Proceedings of the 17th IEEE International Requirements Engineering Conference, 2009. https://doi.org/10.1109/RE.2009.9
14. Wilson, W.M. et al. "Automated Requirements Measurement (ARM)," NASA Goddard Space Flight Center, Software Assurance Technology Center. https://ntrs.nasa.gov
15. Berry, D.M., Kamsties, E., and Krieger, M.M. "From Contract Drafting to Software Specification: Linguistic Sources of Ambiguity — A Handbook," v3. Various publications on NLP-based ambiguity detection using SVM, RF, and KNN classifiers.
16. Anthropic. "SpecEval: Evaluating Foundation Model Behavioral Specifications." Cited from source material; no independent arXiv ID or DOI verified.
17. Comparative analysis of LLM-generated specifications (ChatGPT vs. CodeLlama34b) for internal consistency under IEEE format compliance. Cited from source material; no independent publication record verified.
18. Fenton, N. and Bieman, J. "Software Metrics: A Rigorous and Practical Approach," 3rd ed. CRC Press, 2014.
19. Schwaber, K. and Sutherland, J. "The Scrum Guide," 2020. https://scrumguides.org
20. "Architectural Spikes in Agile Development," Scaled Agile Framework. https://www.scaledagileframework.com
21. Software Engineering Institute. "Validating Software Cost and Schedule Estimates: Guidelines and Checklists," Carnegie Mellon University. https://www.sei.cmu.edu
22. Madani, M. and Van Vyve, M. "Computationally tractable counterparts of robust constraints on uncertain linear programs in co-optimization of European electricity markets," Operations Research, European electricity market (EUPHEMIA) studies.
23. ISTQB Foundation Level Syllabus, "Static Testing." International Software Testing Qualifications Board, v4.0, 2023. https://www.istqb.org
24. Nielsen, J. "10 Usability Heuristics for User Interface Design," Nielsen Norman Group, 1994 (updated 2024). https://www.nngroup.com/articles/ten-usability-heuristics/
25. Contentsquare, Mixpanel, and Freshpaint. Behavioral analytics platform documentation and methodology guides.
26. The Standish Group. "CHAOS Report," various editions. Longitudinal study of IT project success and failure rates linked to requirements engineering quality.
27. NASA. "Systems Engineering Handbook," NASA/SP-2016-6105, Rev. 2. NASA Technical Standards for requirements formulation and specification terminology. https://www.nasa.gov/reference/systems-engineering-handbook/
