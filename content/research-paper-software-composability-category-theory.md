---
title: "Software Composability, Type-Preserving Transformations, and Category Theoretic Patterns"
type: research
subtype: paper
tags: [composability, category-theory, type-systems, polymorphism, endomorphisms, monads, profunctor-optics, property-based-testing, static-analysis, architectural-metrics]
tools: [archunit, wartremover, clippy, liquidhaskell, quickcheck, proptest, sonarqube, ndepend]
status: draft
created: 2026-03-20
updated: 2026-03-20
version: 1.0.0
related: [research-paper-immutability-anti-patterns-refactoring.md, research-paper-software-rigidity-ocp-composition.md, references-oop-fp-pattern-equivalences.md]
source: Comprehensive analysis of composability evaluation methodologies spanning polymorphism theory, endomorphism monoids, category-theoretic design pattern equivalences, formal verification of algebraic laws, property-based testing strategies, and quantitative architectural metrics
---

# Software Composability, Type-Preserving Transformations, and Category Theoretic Patterns

## Summary

This research examines how to evaluate and enforce software composability through three converging disciplines: polymorphism and type-system theory, type-preserving transformations (endomorphism monoids), and applied category theory (functors, monads, profunctor optics). It synthesizes evaluation methodologies spanning static analysis tooling (ArchUnit, WartRemover, Clippy), formal verification (LiquidHaskell, refinement types), property-based testing for algebraic law compliance, and quantitative architectural metrics (cohesion, coupling, instability, orthogonality). The central claim is that replacing ad-hoc design patterns with universal category-theoretic abstractions yields mathematically provable composability guarantees that scale from individual function signatures to enterprise architectures.

## Context

Modern software engineering manages exponentially increasing complexity by constructing applications from smaller, self-contained, interoperable components. While modularity focuses on dividing systems into distinct parts, composability extends this by emphasizing mathematical predictability and interoperability — the ability to "plug and play" components without disrupting architectural integrity or introducing unforeseen side effects.^2

Evaluating composability requires bridging practical software metrics with theoretical foundations from programming language theory, type systems, and abstract algebra. The most advanced paradigms borrow directly from category theory — originally introduced by Eilenberg and Mac Lane in the 1940s for algebraic topology — which has become the lingua franca for expressing computational semantics and structural relationships.^8 These constructs now manifest practically in static analysis tools, property-based testing frameworks, and type-system extensions that enforce algebraic laws at compile time.^12

## Hypothesis / Question

What are the rigorous methodologies — spanning type theory, abstract algebra, and architectural metrics — for evaluating whether software components compose safely, predictably, and infinitely, and how do category-theoretic abstractions provide mathematically provable guarantees that supersede traditional ad-hoc design patterns?

## Method

The research employs a multidisciplinary synthesis of:

- **Paradigm Analysis:** Comparative evaluation of OOP (state encapsulation, subtype polymorphism) versus FP (referential transparency, higher-order functions) composability models, including their intersection in multi-paradigm architectures.^14,15
- **Polymorphism Classification:** Structural analysis of parametric, subtype, and ad-hoc polymorphism with their respective verification challenges — parametricity constraints, LSP compliance, and semantic consistency of overloaded functions.^4,5
- **Endomorphism Theory:** Mathematical formalization of type-preserving transformations as monoids with associative composition and identity elements, enabling infinite pipeline decomposition.^6,7
- **Category Theory Mapping:** Systematic mapping of GoF design patterns to categorical universals (monoids, coproducts, catamorphisms, state monads) with formal evaluation criteria.^11
- **Formal Verification Survey:** Evaluation of LiquidHaskell refinement types and SMT solvers for proving monadic laws, and graded monads for effect tracking.^12,52
- **Property-Based Testing Analysis:** Empirical comparison of applicative vs. monadic test generator composition, including shrinking performance data from Rust's proptest framework.^54
- **Architectural Metrics Modeling:** Quantitative formulas for cohesion, coupling, instability, abstractness (Martin's Main Sequence), and orthogonality via complex network analysis.^79,82

## Results

The results are organized in six arcs: paradigm foundations (section 1), polymorphism evaluation (section 2), endomorphism composability (section 3), category-theoretic abstractions (section 4), automated verification and testing (section 5), and quantitative metrics (section 6).

### 1. OOP vs. FP Composability: Orthogonal, Not Opposing

Object-oriented composability relies on state encapsulation, message passing, and inheritance chains. The interface of each object acts as a strict contract hiding internal state. However, mutable state creates temporal coupling — composition of two objects may yield different results depending on execution order or implicit sharing of mutable references.^15

Functional composability grounds itself in immutable data transformations and referential transparency: an expression can be systematically replaced with its evaluated result without altering observable behavior.^20 Pure functions bypass shared mutable state, providing a natural path to concurrent and parallel code.^15

These paradigms are orthogonal, not conflicting. The expression `o.f()` in OOP has no semantic difference from `f(o)` in procedural/functional styles, apart from implicit polymorphic dispatch.^14 Modern architectures employ functional principles "in the small" (pure functions, immutable data for business logic) and OOP "in the large" (components, dependency injection for system state and I/O boundaries). Evaluating composability in multi-paradigm systems requires metrics assessing both architectural module coupling and granular functional purity simultaneously.^23

### 2. Polymorphism: Classification and Structural Constraints

Polymorphism — the ability for code to operate uniformly over values of different types — is essential for reusable, composable components. Unregulated polymorphism leads to fragile systems where runtime behavior deviates from compile-time expectations.^4

| Polymorphism Type | Mechanism | Verification Challenge |
| :---- | :---- | :---- |
| **Parametric** | Generic code parametric in type parameters, without knowledge of underlying types (ML, Java Generics, C# `<T>`).^4 | Compiler must enforce the component does not inspect or rely on the type's internal structure. Relies on unification algorithms for type inference.^26 |
| **Subtype (Inclusion)** | Functions on base type `T` also operate on any derived subtype `S`, via subsumption and dynamic dispatch.^4 | Highly susceptible to behavioral contract violations. Requires strict LSP adherence.^17 |
| **Ad-hoc** | Appears polymorphic to caller, but dispatches to type-specific implementations (operator overloading, coercion).^4 | Compiler resolves dispatch by argument types. Requires semantic verification of logical consistency across overloaded implementations.^4 |

Parametric polymorphism enforces the strongest structural invariants: the function cannot inspect the generic type's inner structure; it can only manipulate the external structure containing it.^5

**Liskov Substitution Principle (LSP):** For subtype polymorphism to be safely composable, subtypes must require no more than the supertype (contravariance of preconditions) and promise no less (covariance of postconditions), while respecting supertype invariants.^31 Violations force callers to introduce type-checking conditionals (`instanceof`), destroying orthogonality and tight-coupling client code to derived type internals.^18

**Static Analysis of Polymorphic Invariants:** Hindley-Milner type inference uses unification algorithms to deduce most-general types, verifying parametric polymorphism without verbose annotations. The analyzer rejects programs where type variables cannot be unified across all execution paths — even for rarely-executed code paths.^26

### 3. Endomorphism Monoids: Infinite Type-Preserving Composition

When an operation takes input of type `A` and returns output of the identical type `A`, the operation is an endomorphism.^7 Because domain and codomain are identical, endomorphisms can be infinitely composed: if `f: A → A` and `g: A → A`, then `g ∘ f: A → A` is guaranteed.^6,7

This structure forms a **monoid** — requiring:
- **Associativity:** `(f ∘ g) ∘ h = f ∘ (g ∘ h)` — grouping does not affect the result.
- **Identity:** A no-op transformation that, composed with any endomorphism, leaves it unchanged.^34

This decomposition allows massive transformation pipelines to be built from small, isolated, independent unary operations. The compiler guarantees that the output of step *n* is suitable input for step *n+1*.

**Practical Example — Date/Time Adjustments:** An interface mandates a single type-preserving method `DateTimeOffset Adjust(DateTimeOffset value)`. Implementations (Dutch bank holiday adjustment, business hours enforcement, UTC conversion) compose via a binary `Append` method returning a new composite with the same type signature. The system achieves infinite, tree-like nesting while adhering to LSP.^7

**Verification:** Commutativity is not required (adjusting hours then converting timezone may differ from the reverse), but associativity is mandatory. Because unit tests cannot exhaustively prove associativity, evaluators must use property-based testing and equational reasoning over pure functions.^7

**Correctness Preserving Transformations (CPTs):** In automated refactoring and compiler optimization, CPTs alter syntactic structure or algorithmic efficiency without changing functional output. Verification involves constructing bisimulations — formal proofs that every state transition in the source program has a corresponding transition in the target program, and vice versa, ensuring behavioral equivalence.^1,40

### 4. Category Theory: Universal Abstractions for Composability

Category theory — the mathematical study of abstract structures and their relations — provides a universally applicable framework for reasoning about software components.^35

#### Design Patterns as Categorical Structures

Traditional GoF design patterns are ad-hoc and informally specified. Under theoretical inspection, many are specialized implementations of universal category-theoretic abstractions.^11

| GoF Pattern | Category Theory Abstraction | Compositional Evaluation |
| :---- | :---- | :---- |
| **Composite** | **Monoid** | Check for associative binary operation and identity element.^11 |
| **Null Object** | **Identity Element** | Composition with any other object yields that object unchanged.^11 |
| **Visitor** | **Sum Type (Coproduct)** | Ensure exhaustive pattern matching over all variants via ADTs.^11 |
| **Chain of Responsibility** | **Catamorphism** | Evaluate as fold over recursive data structure to single return value.^11 |
| **State** | **State Monad** | Transitions modeled as pure functions returning new states, governed by monadic bind laws.^11 |

This table covers patterns with the clearest categorical correspondences. Many GoF patterns (Factory, Builder, Observer) have weaker or context-dependent categorical interpretations that remain active areas of study.^11

#### Functors and Natural Transformations

A **Functor** is a structure-preserving mapping between categories. In software, it represents a generic data structure (`List<T>`, `Optional<T>`, `Future<T>`) implementing a structure-preserving `map` operation.^8

Functor law verification requires:
1. Mapping the identity function returns the functor unchanged.
2. Mapping a composition of two functions equals mapping the first, then mapping the second.^13

A **Natural Transformation** maps from one functor to another while preserving internal data structure (e.g., `List<T>` → `Optional<T>` by extracting the head). The transformation logic is completely orthogonal to the data's underlying type `T`. Natural transformations need not preserve all information — an array-to-set transformation loses duplicates but remains valid. Only when information is perfectly preserved and reversible does it achieve natural isomorphism status.^34

#### Monads and Kleisli Composition

Monads — formally a monoid in the category of endofunctors — sequentially compose operations that return computational contexts, providing mathematical power for composing side-effects, state, error handling, and async computations into pure, referentially transparent sequences.^49,51

Three algebraic laws must hold:^53
1. **Left Identity:** Injecting a value into monadic context via `return`/`pure` and binding it to function `f` equals applying `f` directly.
2. **Right Identity:** Binding a monadic value to `return` yields the original monadic value.
3. **Associativity:** Chaining multiple operations can be grouped in any order without altering the computation.

These laws are most elegantly expressed through **Kleisli composition** (`>=>` operator). If `f: A → M<B>` and `g: B → M<C>`, Kleisli composition yields `f >=> g: A → M<C>`. Ensuring architectures form a valid Kleisli category mathematically guarantees that deeply nested, context-dependent computations compose as safely as basic arithmetic.^53

#### Profunctor Optics: Lenses and Prisms

For composable state management of deeply nested immutable data structures, category theory provides **Optics** — bidirectional data accessors capturing transformation patterns.^55

- **Lenses** focus on product types (records, structs). A lens accessing `Street` within `Address` composes with one accessing `Address` within `User`, yielding a direct `User → Street` lens.^56
- **Prisms** focus on sum types (tagged unions, enums), allowing safe traversal into potentially missing data pathways without exceptions.^56

The modern standard uses **Profunctor Optics**, which generalize the get/set pattern into a single composable interface parametric over the access strategy. The mathematical foundation relies on Tambara modules — profunctors endowed with additional structural constraints that interplay with monoidal actions. Lenses correspond to Tambara modules with Cartesian tensor product; Prisms correspond to Cocartesian tensor product — both unified under a single mathematically verifiable interface, enabling arbitrary optics to be composed by simple function composition.^55

### 5. Automated Verification: Tooling and Testing

#### Architectural Dependency Enforcement (ArchUnit)

ArchUnit analyzes compiled bytecode to construct a complete dependency graph, enabling programmatic architectural rules as unit tests.^58 Critical for Hexagonal/Clean Architecture:

| Rule | Enforcement Target |
| :---- | :---- |
| **Domain Layer Isolation** | Domain classes may not access any other layer; only Application and Adapters may access Domain.^61 |
| **Infrastructure Encapsulation** | Infrastructure accesses only Config; only Adapters access Infrastructure.^61 |
| **Cyclic Dependency Prevention** | Package slices must form a DAG — no cyclic dependencies.^58 |
| **Annotation Integrity** | `@Transactional` only in service layer; `@Repository` restricted to data-access packages.^61 |

#### Functional Purity Enforcement

**Scala (WartRemover):** Statically restricts features detrimental to functional composability by evaluating the AST.^63

| Rule | Rationale |
| :---- | :---- |
| **Null** | Bans `null`, forcing `Option` monad for referential transparency.^63 |
| **AsInstanceOf** | Bans unsafe casting that violates parametricity.^65 |
| **Any / AnyVal** | Prevents silent universal supertype inference masking unification failures.^65 |
| **Enumeration** | Bans reflection-based `Enumeration`; enforces sealed classes for exhaustive pattern matching.^65 |

**Rust (Clippy):** Hundreds of specialized lints enforcing correctness, complexity management, and idiomatic style.^66

| Category | Default Level | Impact |
| :---- | :---- | :---- |
| **correctness** | Deny | Mathematically wrong code; aborts compilation.^66 |
| **suspicious** | Warn | Likely behavioral/structural violations.^66 |
| **complexity** | Warn | Overly complex operations reducible by better abstractions.^66 |
| **restriction** | Allow | Prevents specific language features (e.g., `unwrap_used` to prevent panics).^67 |

#### Formal Verification of Monadic Laws

Traditional type systems ensure syntactic input/output matching but cannot verify algebraic law compliance. **LiquidHaskell** embeds logical predicates into type signatures using refinement types, with SMT solvers proving operations obey required laws — e.g., verifying Kleisli associativity: `(f >=> g) >=> h ≡ f >=> (g >=> h)`.^12

Graded monads extend this, allowing the type system to enforce specific effect profiles (read/write permissions, probability distributions, taint tracking) as formally verified parts of monadic bind operations.^52

#### Property-Based Testing for Algebraic Laws

When full formal verification is unfeasible, PBT defines mathematical invariants and generates thousands of randomized inputs to verify:^73

- **Idempotence:** Applying a transformation twice equals applying it once.^75
- **Round-trip Properties:** `deserialize(serialize(x)) = x`, proving strict inverses.^74
- **Structural Induction:** Proving properties hold for base elements and that composition preserves them.^75

**Testing Parametric Polymorphism:** Generic functions defined `∀a. a → a` must work for infinite types, but tests run on concrete instances. By relying on parametricity — the guarantee that the function does not inspect generic type internals — frameworks like QuickCheck substitute basic types (integers, booleans) into type variables. If properties hold for a large domain of integers, parametricity dictates they hold for complex domain objects.^27

**Applicative vs. Monadic Generator Composition:** A critical performance distinction emerges during PBT shrinking — minimizing failing inputs to find the smallest reproducible case.^76

| Composition Strategy | Median Time (Triples) | 90th Percentile | Max Time | Median Iterations | Max Iterations |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Applicative (`prop_map`)** | 2.52 ms | 8.41 ms | 15.53 ms | 306 | 530 |
| **Monadic (`prop_flat_map`)** | 181 ms | 435 ms | 1808 ms | 281,016 | 884,729 |

Data from Rust's proptest framework; frameworks with integrated shrinking (e.g., Hypothesis) may show different characteristics for monadic composition. Monadic generator composition makes shrinking exponentially slow because reducing the first value forces regeneration of the entire dependent strategy tree.^54 Best practice: use non-monadic tuples and `prop_map` operations; where dependent values are required, generate independent base values and offsets rather than dynamically binding generators.^54

### 6. Quantitative Metrics for Architectural Composability

#### Cohesion, Coupling, and Instability

Composability requires low coupling (independence between modules) and high cohesion (internal elements related to a single responsibility).^79

| Cohesion Type | Characteristics | Composability Impact |
| :---- | :---- | :---- |
| **Functional** | Every element related to a single well-defined task. | Ideal — maximizes composability.^79 |
| **Sequential** | Output from one component feeds the next. | High — functions as internal pipeline.^79 |
| **Communicational** | Components operate on the same data. | Moderate — shared data dependency.^79 |
| **Procedural / Temporal** | Grouped by execution order or timing. | Low — introduces temporal coupling.^79 |
| **Logical** | Grouped logically but execute different behaviors. | Poor — produces god-object modules.^79 |

**Instability Metric:** `I = Ce / (Ca + Ce)` where `Ca` = afferent coupling (incoming dependencies), `Ce` = efferent coupling (outgoing dependencies). `I → 1` indicates a highly unstable module — heavily dependent on others, making it fragile to upstream changes and difficult to compose into new environments.^79

**Martin's Main Sequence:** `D = |A + I − 1|` where `A` = abstractness. Modules close to `D = 0` are optimally balanced — either completely abstract and stable, or completely concrete and unstable.^79

#### Orthogonality

Orthogonality means modifying one component exerts zero impact on any other. If changing a core database access module inadvertently breaks a decoupled sorting algorithm, the system is demonstrably non-orthogonal. Measuring orthogonality involves analyzing side effects and the "blast radius" of code changes. At macro scale, complex network analysis represents architecture as a DAG, applying cluster-based modularity algorithms to measure intra-module edge density versus inter-module connections.^80,82

## Discussion

### For Prompt and Tool Design

The composability evaluation framework has direct implications for AI-assisted code review and generation:

1. **Endomorphism detection** can be automated as a prompt pattern: identify functions where input and output share the same *domain-specific* type (not primitives like `int` or `String`, which would generate excessive false positives), then verify they participate in composition chains and that associativity holds via property-based test generation. This maps directly to a composability diagnostician tool.

2. **GoF-to-category-theory mapping** provides a structured refactoring vocabulary for prompts. When a Composite pattern is detected, the prompt can suggest monoid-based refactoring; when a State pattern appears, it can recommend state monad formalization.

3. **The applicative vs. monadic PBT performance data** informs test generation prompts: default to applicative composition for generated test data, only introducing monadic dependencies when structurally necessary.

4. **Architectural metrics** (instability, Martin's Main Sequence, orthogonality) provide quantitative thresholds that can be embedded in review prompts as acceptance criteria.

### For Development Teams

The paradigm analysis confirms that OOP and FP are complementary tools. Teams should evaluate composability at two granularities: macro-level architectural coupling (ArchUnit, dependency graphs) and micro-level functional purity (WartRemover, Clippy, ESLint functional plugins). The endomorphism monoid pattern provides an accessible entry point for teams new to category theory — its practical benefits (infinite safe composition, compiler-guaranteed pipeline integrity) are immediately tangible without requiring deep mathematical background.

### For Architects

Category-theoretic abstractions are not academic exercises. The GoF-to-categorical-universal mapping provides a decision framework: when a traditional pattern is identified, evaluate whether the corresponding universal abstraction provides stronger compositional guarantees. Profunctor optics solve the last-mile problem of deeply nested immutable state management, but should be introduced selectively — only where nesting depth exceeds two or three levels.

## Practical Applications

- **Composability diagnostician prompt:** Evaluate codebases for endomorphism opportunities, LSP violations, and cohesion/coupling metrics, recommending category-theoretic refactorings.
- **Property-based test generation:** Auto-generate PBT suites verifying functor laws, monad laws, and monoid associativity for custom algebraic types, defaulting to applicative composition for generator performance.
- **Architectural review checklist:** Embed instability metrics, Martin's Main Sequence distance, and ArchUnit-style dependency rules into code review prompts.
- **Refactoring vocabulary:** Use the GoF-to-category-theory mapping table as a structured recommendation engine when reviewing design pattern usage.

## Limitations

**Mathematical Accessibility:** Category theory's notation and concepts present a steep learning curve. Teams without FP experience may struggle to apply profunctor optics or verify monadic laws without significant investment in foundational concepts.

**Language Ecosystem Variance:** Formal verification tooling (LiquidHaskell, refinement types) is concentrated in Haskell/ML-family languages. Mainstream languages (Java, TypeScript, Python) lack native support for expressing or verifying algebraic laws at compile time, requiring heavier reliance on PBT.

**Metric Limitations:** Quantitative metrics (instability, cohesion) measure structural properties but cannot capture semantic composability — whether composed components produce logically correct results. Algebraic law verification and PBT address this gap but cannot be fully automated for novel abstractions.

**Scalability of Formal Verification:** SMT-solver-based verification is computationally expensive and may not scale to large industrial codebases. PBT provides a pragmatic middle ground but offers probabilistic, not absolute, guarantees.

**Organizational Risk:** Teams adopting category-theoretic abstractions may concentrate comprehension in a small number of mathematically trained developers, creating knowledge silos and bus factor vulnerabilities. Adoption should be paired with systematic onboarding and accessible documentation to prevent a "priesthood" dynamic where only specialists can review or debug core abstractions.

## Related Prompts

- [research-paper-immutability-anti-patterns-refactoring.md] - Covers the immutability foundation that enables referential transparency and safe composition
- [research-paper-software-rigidity-ocp-composition.md] - Addresses rigidity diagnostics and the Open-Closed Principle, directly related to subtype polymorphism and LSP compliance
- [references-oop-fp-pattern-equivalences.md] - Reference collection mapping OOP patterns to FP/category-theoretic equivalents

## References

1. "The application of correctness preserving transformations to software maintenance." R Discovery. https://discovery.researcher.life/article/the-application-of-correctness-preserving-transformations-to-software-maintenance/dbe3d9c461cf3826bdb77ee716167032
2. "Composability in Software Development: A Deep Dive." CodeStringers. https://www.codestringers.com/insights/composability-in-software-development/
3. "What Is Composable Architecture? A Concise Guide." Boomi. https://boomi.com/blog/concise-guide-to-composability/
4. "Parametric polymorphism." Cornell CS4110. https://www.cs.cornell.edu/courses/cs4110/2012fa/lectures/lecture22.pdf
5. "Parametric Polymorphism (Generics)." Cornell CS4120. https://courses.cs.cornell.edu/cs4120/2022sp/notes/generics/index.html
6. "Endomorphism." Wikipedia. https://en.wikipedia.org/wiki/Endomorphism
7. "Endomorphism monoid." ploeh blog. https://blog.ploeh.dk/2017/11/13/endomorphism-monoid/
8. "Category theory." Wikipedia. https://en.wikipedia.org/wiki/Category_theory
9. "Category Theory for Software Modeling and Design." Angeline Aguinaldo. https://angelineaguinaldo.com/assets/slides/HCAM_Seminar___Oct_29_2020.pdf
10. "A Brief Introduction to Category Theory for Systems and Software Engineers." OMG. https://www.omg.org/maths/September-2024-Mathsig-Presentation-to-the-AI-PTF.pdf
11. "From design patterns to category theory." ploeh blog. https://blog.ploeh.dk/2017/10/04/from-design-patterns-to-category-theory/
12. LiquidHaskell Docs. https://ucsd-progsys.github.io/liquidhaskell/
13. "preferences-algebraic-laws." LobeHub. https://lobehub.com/it/skills/cameronraysmith-vanixiets-preferences-algebraic-laws
14. "FP vs. OO." The Clean Code Blog. https://blog.cleancoder.com/uncle-bob/2018/04/13/FPvsOO.html
15. "ObjectOriented Programming (OOP) Vs Functional Programming." YoungWonks. https://www.youngwonks.com/blog/objectoriented-programming-(oop)-vs-functional-programming
17. "Liskov Substitution Principle in Test Automation." Medium. https://medium.com/@gulzhasm/liskov-substitution-principle-in-test-automation-c0ea07bc6e68
18. "What can go wrong if the Liskov substitution principle is violated?" Software Engineering SE. https://softwareengineering.stackexchange.com/questions/170222/what-can-go-wrong-if-the-liskov-substitution-principle-is-violated
20. "Referential transparency." Wikipedia. https://en.wikipedia.org/wiki/Referential_transparency
23. "Functional purity as a code quality metric in multi-paradigm languages." Info Support Research. https://research.infosupport.com/wp-content/uploads/Master_thesis_bjorn_jacobs_1.6.1.pdf
26. "Type Constraint Solving for Parametric and Ad-hoc Polymorphism." Lirias. https://lirias.kuleuven.be/retrieve/6144edd4-7539-4540-af5a-e8d0ef7d477a
27. "Testing Polymorphic Properties." Chalmers Publication Library. https://publications.lib.chalmers.se/records/fulltext/local_99387.pdf
31. "Liskov Substitution Principle Real-time Use Cases." Reddit. https://www.reddit.com/r/ExperiencedDevs/comments/16q6m2x/liskov_substitution_principle_realtime_use_cases/
34. "Functional Programming Jargon, Part 1." ybogomolov.me. https://ybogomolov.me/fp-jargon-part-1
35. "Category Theory for Functional Programmers." Nick Hu. https://nickx.hu/CT-FP.pdf
38. "Auto-SPT: Automating Semantic Preserving Transformations for Code." arXiv. https://arxiv.org/html/2512.06042v1
40. "Type-changing rewriting and semantics-preserving transformation." ResearchGate. https://www.researchgate.net/publication/262401730_Type-changing_rewriting_and_semantics-preserving_transformation
49. "Knowing Monads Through The Category Theory." Medium (Datio). https://medium.com/datio-big-data/knowing-monads-through-the-category-theory-4a0b629f969c
51. "Category theory for programmers and how our mind works." Reddit. https://www.reddit.com/r/programming/comments/dejzl7/category_theory_for_programmers_and_how_our_mind/
52. "Programming and static analysis with graded monads." University of Cambridge. https://www.repository.cam.ac.uk/bitstreams/901716b2-87aa-43e4-94d3-d8e0902edce1/download
53. "Monad laws." HaskellWiki. https://www.haskell.org/haskellwiki/monad_laws
54. "Demystifying monads in Rust through property-based testing." sunshowers.io. https://sunshowers.io/posts/monads-through-pbt/
55. "Profunctor Optics: a Categorical Update." Compositionality. https://compositionality.episciences.org/13530/pdf
56. "Profunctor Optics: The Categorical View." The n-Category Café. https://golem.ph.utexas.edu/category/2020/01/profunctor_optics_the_categori.html
58. ArchUnit. https://www.archunit.org/
61. "ArchUnit Guide – How to Unit Test Your Architecture." Pask Software. https://pasksoftware.com/archunit/
63. WartRemover. https://www.wartremover.org/
65. "Built-in Warts." WartRemover. https://www.wartremover.org/doc/warts.html
66. "Clippy's Lints." Rust Documentation. https://doc.rust-lang.org/stable/clippy/lints.html
67. "Introduction." Clippy Documentation. https://doc.rust-lang.org/stable/clippy
73. "Understanding Property-based Testing: An Introduction With TypeScript." Medium. https://medium.com/@LRNZ09/property-based-testing-a-hands-on-introduction-with-typescript-c4d0703a5772
74. "Finding bugs across the Python ecosystem with Claude and property-based testing." Anthropic Red Team. https://red.anthropic.com/2026/property-based-testing/
75. "Choosing properties for property-based testing." F# for fun and profit. https://fsharpforfunandprofit.com/posts/property-based-testing-2/
76. "Property-Based Testing in Practice using Hypothesis." TU Delft Repository. https://resolver.tudelft.nl/uuid:aa9cc98d-032f-4544-9447-d6e24bb8ebd2
79. "Modularity Metrics in software architecture." Medium. https://medium.com/@naozary.diyar/modularity-metrics-in-software-architecture-03636b96604b
80. "Orthogonality in Software Engineering." freeCodeCamp. https://www.freecodecamp.org/news/orthogonality-in-software-engineering/
82. "Measuring Software Modularity Based on Software Networks." MDPI. https://www.mdpi.com/1099-4300/21/4/344
84. "Composability in metric views." Databricks. https://docs.databricks.com/aws/en/metric-views/data-modeling/composability

## Future Research

- How can endomorphism detection be automated as a static analysis pass across mainstream languages (TypeScript, Java, Go, Rust) to surface composability opportunities that developers miss?
- What is the minimum viable subset of category theory that enables productive use of functors and monads without requiring full mathematical background — and how should that be taught via prompt-based code review?
- Can the applicative vs. monadic PBT performance differential be mitigated by hybrid shrinking strategies that preserve structural independence while allowing selective dependent generation?
- How do emerging language features (Kotlin context receivers, Swift opaque types, TypeScript branded types) change the cost-benefit calculus for encoding algebraic laws at the type level versus verifying them via PBT?
- What governance frameworks help teams decide when to adopt category-theoretic abstractions versus when simpler, ad-hoc patterns are "good enough" for the composability requirements of a given system?

## Version History

- 1.0.0 (2026-03-20): Initial version — synthesized from comprehensive analysis of composability evaluation spanning polymorphism theory, endomorphism monoids, category-theoretic patterns, formal verification, property-based testing, and architectural metrics
