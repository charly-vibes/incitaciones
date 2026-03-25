---
title: "Reviewing Code for Invalid States: Enforcing Type Integrity Through Algebraic Design, Human Protocols, and Architectural Fitness Functions"
type: research
subtype: paper
tags: [type-systems, algebraic-data-types, domain-modeling, code-review, state-machines, parse-dont-validate, typestate, fitness-functions, value-objects, primitive-obsession, boolean-blindness]
tools: [netarchtest, archunit, clippy, mypy, eslint, zod]
status: draft
created: 2026-03-25
updated: 2026-03-25
version: 1.1.0
related: [research-paper-immutability-anti-patterns-refactoring.md, research-paper-software-composability-category-theory.md, research-paper-software-rigidity-ocp-composition.md]
source: Comprehensive synthesis of type-theoretic foundations, algebraic data type enforcement, "Parse Don't Validate" paradigms, human code review protocols, and automated architectural fitness functions for eliminating representable invalid states
---

# Reviewing Code for Invalid States: Enforcing Type Integrity Through Algebraic Design, Human Protocols, and Architectural Fitness Functions

## Summary

This research examines the principle of "making invalid states unrepresentable" — transferring correctness guarantees from runtime validation to compile-time structural constraints. It synthesizes the set-theoretic and algebraic foundations of state representation, the "Parse, Don't Validate" paradigm for boundary enforcement, human code review protocols targeting structural anti-patterns (primitive obsession, boolean blindness, implicit coupling, shotgun parsing, ad-hoc state machines), and automated architectural fitness functions (NetArchTest, ArchUnit) that codify invariants into CI pipelines. The paper concludes with strategic trade-offs — over-modeling brittleness, boundary inflexibility in distributed systems, and the unsigned integer fallacy — that distinguish principled engineering from dogmatic rigidity.

## Context

The principle of "making invalid states unrepresentable," coined by Yaron Minsky at Jane Street and popularized by Scott Wlaschin, asserts that a software system's type definitions should perfectly and exclusively map to the domain's legal business states.^1 When implemented with architectural rigor, invalid business states do not merely trigger runtime exceptions — they become logical impossibilities that result in compilation errors. The compiler ceases to be a translation engine and is elevated to an active participant in domain-driven design.^2

Despite the principle's elegance, systematic enforcement remains challenging. Codebases exhibit recurring structural anti-patterns — primitive obsession, boolean blindness, shotgun parsing — that silently expand the gap between representable and valid states. Language ecosystems vary dramatically in their native support for algebraic data types. Human reviewers lack repeatable protocols. And automated enforcement tooling remains underutilized. This research synthesizes these dimensions into a unified framework for auditing and enforcing state integrity.

## Hypothesis / Question

What theoretical foundations, structural anti-patterns, human review protocols, language-specific implementation techniques, and automated enforcement mechanisms constitute a comprehensive framework for auditing codebases against the "make invalid states unrepresentable" principle — and where must this principle be intentionally relaxed?

## Method

The research employs a multidisciplinary synthesis of:

- **Set-Theoretic Foundations:** Modeling representable state space (S_repr) versus valid business state space (S_valid), targeting the equilibrium S_repr = S_valid.^4
- **Algebraic Data Type Analysis:** Comparative evaluation of product types versus sum types and their impact on state space explosion.^6
- **Paradigm Review:** Deep examination of the "Parse, Don't Validate" paradigm and its epistemological implications for system boundary design.^9,11
- **Anti-Pattern Taxonomy:** Classification of five structural anti-patterns (primitive obsession, boolean blindness, implicit coupling, shotgun parsing, ad-hoc state machines) with diagnostic probes and resolutions.^12,14,17,21
- **Language-Specific Protocol Survey:** Analysis of enforcement techniques across Rust, Swift, F#, C#, Java, TypeScript, and Python.^2,5,7,8
- **Automated Enforcement Evaluation:** Assessment of NetArchTest and ArchUnit as architectural fitness functions for continuous invariant protection.^31,32,33
- **Trade-Off Analysis:** Examination of over-modeling risks, boundary inflexibility, and primitive constraint fallacies.^20,30

## Results

The results are organized in four arcs: theoretical foundations (sections 1–2), the "Parse, Don't Validate" paradigm and structural anti-patterns (sections 3–8), language-specific protocols (sections 9–12), and automated enforcement (sections 13–14). Strategic trade-offs are examined in Analysis.

### 1. The Set Theory of Program State

In type theory, a type is modeled as a set of possible values. The structural composition of types dictates the total representable state space of an application. Let S_repr represent all states representable by the type system and S_valid represent all states valid according to business domain logic.^4

In a poorly modeled system, S_repr is significantly larger than S_valid (S_repr is a strict superset of S_valid). This mathematical discrepancy means the program can represent states with no valid business meaning, requiring extensive runtime validation to prevent undefined behavior.^4 The objective is to constrain the type system such that S_repr = S_valid. When representable states perfectly intersect with valid states, the program achieves intrinsic correctness — it is structurally impossible for the system to enter an illegal state because the compiler lacks the vocabulary to express it.^4

This concept has deep roots in hardware logic design, where it is desirable that hardware state machines be physically incapable of locking up in an invalid state.^5 Hardware lacking this property inevitably requires manual reset buttons. In software, this translates to "bounded liveness" — guaranteeing valid execution paths within a finite timeframe.^5

### 2. Algebraic Data Types and State Space Control

The enforcement of the S_repr = S_valid equilibrium relies on Algebraic Data Types (ADTs), specifically the distinction between product types and sum types.^6

**Product types** (structs, records, tuples, classes) generate a state space equal to the Cartesian product of their fields. A class with two boolean fields has 2 x 2 = 4 representable states. Systems relying exclusively on product types inevitably create invalid states when modeling mutually exclusive conditions. A network response containing both a `data` field and an `error` field allows a state where both are populated or both are null — neither is valid.^1

**Sum types** (tagged unions, discriminated unions, enums with associated values) act as a logical XOR, collapsing representable state space to match valid state space by forcing the system to occupy exactly one variant at a time. A `Result` type defined as either `Success(data)` OR `Failure(error)` eliminates the overlap inherent in product types.^1

Implementation varies across ecosystems: Haskell uses tagged unions, TypeScript and Scala 3 use untagged unions, Swift and Rust implement enums with inner data, and Kotlin uses sealed classes.^2,8 Code reviewers must search for product types modeling mutually exclusive states and mandate refactoring into language-appropriate sum types.

### 3. The "Parse, Don't Validate" Paradigm

Alexis King's "Parse, Don't Validate" paradigm establishes a boundary between untrusted external data and trusted internal knowledge at application edges, mandating that loosely typed data be transformed into strongly typed domain objects immediately upon entry.^9,11

**The validation fallacy.** Traditional validation evaluates a condition and returns a boolean, leaving downstream code to implicitly "remember" the data was validated. A function verifying that a string is a valid email address but leaving data typed as `String` forces downstream functions to either blindly trust the caller or implement redundant checks.^10

This produces **shotgun parsing** — validation code haphazardly mixed with and spread across core business logic, hoping without systematic justification that scattered checks catch invalid cases.^12

**Parsing as axiomatic guarantee.** Parsing consumes less-structured input and produces strictly more-structured output. Because some input values will fail to correspond to any output value, all parsers must have a standardized notion of failure.^12 If parsing succeeds, the resulting type acts as an absolute axiom for the remainder of the application. Downstream functions accept the parsed type, eliminating redundant conditional checks.^10

Reviewers should look for "lowest common denominator" values (empty strings, raw integers) propagating through systems. The frequent use of `Maybe.withDefault` or forced unwrapping often indicates data should have been parsed into a stricter type earlier.^12 The burden of proof must be pushed to the system boundary — but no further.^13

### 4. Primitive Obsession and Semantic Dilution

Primitive obsession is the most ubiquitous architectural code smell — modeling complex business entities using generic primitives instead of domain-specific objects.^14 It is a structural vulnerability that silently expands into scattered logic as systems evolve.^14

When a `Price` is modeled as a `float` or an `EmailAddress` as a `String`, the type system permits semantically absurd operations. A compiler will happily allow multiplying an email address by an integer or assigning a negative value to a price.^15,16

**Diagnostic probe:** "Does this primitive harbor hidden business rules (regex, max length, numeric range)?"

**Resolution:** Wrap the primitive in a Value Object (Tiny Type) that enforces all invariants upon instantiation. Once instantiated, the Value Object serves as a compile-time guarantee across the ecosystem. `ValidateEmail(EmailAddress email)` communicates its constraints; `ValidateEmail(String email)` hides them.^3,16

### 5. Boolean Blindness and Loss of Context

Robert Harper's concept of "boolean blindness" identifies that booleans carry no intrinsic semantic information — `true` and `false` are entirely devoid of domain context.^17

When a program branches on a boolean, the validity of branches relies entirely on the programmer's implicit memory. `userGroup.setPermissionsFor(currentUser, true, false)` provides no context about what permissions are being granted.^17

A classic manifestation: checking `Map.mem(key)` returns a boolean, then calling `Map.find(key)` which throws if absent.^18 Because the boolean check is not structurally connected to data retrieval, refactoring can silently break the assumption.

Multiple boolean flags (`isPublished`, `isDraft`, `isDeleted`) create exponential state explosions. Three booleans generate eight states — many mutually exclusive and logically invalid.^20

**Diagnostic probe:** "If I read `update(true)`, do I inherently know what state is being altered?"

**Resolution:** Replace booleans with expressive enums, discriminated unions, or distinct state types. A method returning `bool` for success should return `Success | Failure`.^19,22

### 6. Implicitly Coupled Variables and Monolithic Records

Data that must remain consistent should be structurally grouped. A frequent anti-pattern is implicitly coupled variables — fields that rely on each other but exist independently within a broader scope.^23

Fields like `Address1`, `City`, `State`, `ZipCode` form a natural atomic set. If a method updates `ZipCode` but a runtime error prevents updating `City`, the object enters an invalid state.^23

**Diagnostic probe:** "Can I update field A without updating field B and corrupt the domain context?"

**Resolution:** Group coupled fields into an atomic type (`PostalAddress` record) guaranteeing cohesive transactional updates.^23

Conversely, the **Monolithic Record** anti-pattern over-groups unrelated data into a single entity. If fields within a record are frequently updated independently, the record is not atomic and must be decomposed.^23

### 7. Ad-hoc State Machines

Many applications suffer from implicit state machines implemented via scattered enums, string matching, or complex conditionals. No structural mechanism prevents executing "Publish" on a "Deleted" payload.^20,21

In frontend development, this manifests as wide, leaky props acting as DTO dumping grounds rather than specific domain types.^21

**Diagnostic probe:** "Can I call `approve()` while the internal status flag evaluates to `REJECTED`?"

**Resolution:** Implement the **Typestate Pattern** — representing business states as distinct types (`DraftDocument` vs `PublishedDocument`). Operations valid for specific states are bound exclusively to those types. Attempting an invalid transition becomes a compiler error because the method does not exist on the held type.^1,24

### 8. Anti-Pattern Summary

| Anti-Pattern | Description | Diagnostic Probe | Resolution |
| :---- | :---- | :---- | :---- |
| **Primitive Obsession** | Generic types (int, string) for constrained domain concepts | "Does this primitive harbor hidden business rules?" | Extract into strongly typed Value Object^14 |
| **Boolean Blindness** | Bare bools for binary domain states | "If I read `update(true)`, do I know what changes?" | Replace with semantic enums or discriminated unions^17 |
| **Implicit Coupling** | Coupled fields existing loosely in a parent class | "Can I update field A without B and corrupt state?" | Group into atomic records^23 |
| **Monolithic Record** | Unrelated fields over-grouped into one entity | "Are fields in this record updated independently?" | Decompose into context-specific types^23 |
| **Shotgun Parsing** | Validation scattered across business logic layers | "Is this deep function verifying formats instead of processing rules?" | Parse at the boundary; pass infallible structs^9 |
| **Ad-hoc State Machines** | Lifecycle status inferred from booleans or strings | "Can I call `approve()` while status is `REJECTED`?" | Typestate pattern — new type per transition^21 |

### 9. Systems and Functional Languages (Rust, Swift, F#)

Languages with native ADTs excel at enforcing state integrity. Sum types are first-class citizens: `enum` in Rust and Swift, discriminated unions in F#.^2

**Rust Typestates and Ownership.** Rust enforces strict rules where memory is owned, aliasing is controlled, and mutation is permissioned.^27 Using zero-cost abstractions like `PhantomData`, developers encode state machines into generic type parameters. A `Document<Draft>` cannot be passed to a function requiring `Document<Published>`. The `publish()` method consumes `self` (taking ownership) and returns a new `Document<Published>`. Because ownership was consumed, the old `Draft` state is mathematically inaccessible — eliminating "use-after-state-change" bugs.^25,28

```rust
use std::marker::PhantomData;

struct Draft;
struct Published;
struct Document<S> { content: String, _state: PhantomData<S> }

impl Document<Draft> {
    fn publish(self) -> Document<Published> {
        Document { content: self.content, _state: PhantomData }
    }
}
// Document<Draft> has no .unpublish() — calling it is a compiler error.
// publish() consumes self — the Draft instance is gone after transition.
```

Reviewers must ensure state transitions consume ownership. For primitive usage, converting raw values to strict enums reduces memory footprint and enables exhaustive matching. Clippy with pedantic settings (`#![deny(clippy::all)]` and `#![warn(clippy::pedantic)]`) catches common failures.^25,29

### 10. Managed Object-Oriented Languages (C#, Java)

Modern C# and Java provide tools to emulate ADTs.

**C#:** Reviewers should enforce `record` types for Value Objects (immutability and value-based equality). Exhaustive pattern matching enables discriminated union emulation via abstract base classes with `private protected` constructors and nested derived classes.^16

**Java:** Sealed classes and records limit which classes may implement an interface, enabling exhaustiveness checking in switch expressions. Reviewers must verify that `default` clauses are omitted — their presence destroys the exhaustiveness guarantee, allowing invalid states to slip through when new subtypes are added.^5,7

### 11. Dynamically and Gradually Typed Languages (TypeScript, Python)

**TypeScript Discriminated Unions.** TypeScript handles ADTs through discriminated unions — interfaces sharing a common singleton type property (the discriminant). Reviewers must ensure `strictNullChecks` is enabled and that developers use type guards or validation schemas (Zod) at system boundaries rather than raw type assertions (`as Type`).^5,7

```typescript
type ApiResponse =
  | { type: "success"; data: User }
  | { type: "error"; message: string };

function handle(response: ApiResponse) {
  switch (response.type) {
    case "success": return response.data;   // narrowed to { data: User }
    case "error":   throw new Error(response.message);
    default:        const _: never = response; // compiler error if case missed
  }
}
```

**Python Tagged Unions and Mypy.** Python requires runtime boundary validation combined with strict static analysis. Reviewers must audit for `Union` types, `Literal` types, and `dataclass(frozen=True)` for immutability. The `assert_never()` utility in match default cases forces the type checker to fail if a union case goes unhandled. `mypy --strict` or `pyright strict` must be integrated into CI.^8

```python
from dataclasses import dataclass
from typing import assert_never

@dataclass(frozen=True)
class Success:
    data: dict

@dataclass(frozen=True)
class Failure:
    message: str

type Response = Success | Failure

def handle(r: Response) -> dict:
    match r:
        case Success(data=d): return d
        case Failure(message=m): raise ValueError(m)
        case _: assert_never(r)  # mypy fails if a union variant is unhandled
```

### 12. The "TigerStyle" Assertion Protocol

Certain domain invariants cannot be expressed through types alone (e.g., "start date must precede end date"). The TigerStyle programming guide, used by TigerBeetle, provides heuristics for state integrity beyond types:^26

- **Explicitly-Sized Types:** Use `u32`/`u64` instead of architecture-dependent `usize` for predictable behavior.^26
- **High Assertion Density:** Minimum two assertions per function. Never operate on unchecked data.^26
- **Positive and Negative Space Checking:** Define both what the system expects to be true and what it explicitly rejects. Bugs manifest when data drifts silently between these spaces.^26
- **Centralized State Manipulation:** Ban aliasing and variable duplication. Parent functions maintain local state; pure helper functions compute changes.^26
- **In-Place Construction and Static Allocation:** Construct larger structs in-place via out pointers. Statically allocate memory at startup — dynamic allocation introduces use-after-free risks.^26
- **Bounded Executions:** Every operation must be bounded. Infinite loops or unbounded queues allow resource-exhaustion invalid states.^26

### 13. Automated Enforcement: Architectural Fitness Functions

Human code review is prone to fatigue and domain knowledge attrition. Architectural rules must be codified into automated, continuously executing tests — "Architectural Fitness Functions" — objective integrity assessments evaluating implementation alignment with stated characteristics.^31,32

#### NetArchTest (C# / .NET)

NetArchTest scans assemblies to enforce constraints on namespaces, dependencies, and class structures.^33

**Strict Encapsulation.** An `EncapsulationRule` verifies that entity classes only contain private, protected, or init property setters. A public setter added for convenience triggers a build failure.^36

**Always-Valid Instantiation.** A `NoParameterlessPublicConstructorRule` asserts that public constructors require parameters, forcing all required data to be passed at instantiation and eliminating temporal coupling of half-initialized objects.^35

**Boundary and Dependency Integrity.** Domain namespace classes `.ShouldNot().HaveDependencyOnAny("Application", "Infrastructure")` — ensuring domain objects cannot trigger side-effects like database calls.^36,37

#### ArchUnit (Java)

ArchUnit enforces domain boundaries and structural integrity for Java. Beyond acyclic dependency checks, it enforces naming conventions and limits inheritance depth (preventing chains deeper than two levels), favoring composition over inheritance.^33,38

ArchUnit can verify that internal domain entities do not rely on external validation APIs (`javax.validation`), ensuring self-contained invariant checks.^34

### 14. Fitness Function Summary

| Objective | Implementation | Failure Trigger | Protection |
| :---- | :---- | :---- | :---- |
| **Strict Encapsulation** | NetArchTest | Entity has public set property | Prevents arbitrary state mutation^36 |
| **Always-Valid Instantiation** | NetArchTest | Entity has parameterless public constructor | Prevents half-initialized objects^35 |
| **Acyclic Dependencies** | ArchUnit | Package A depends on B and B depends on A | Enables safe modular refactoring^33 |
| **Domain Purity** | ArchUnit / NetArchTest | Domain references Infrastructure layer | Domain rules independent of I/O failures^36 |
| **Inheritance Depth** | ArchUnit | Chain exceeds 2 levels | Prevents obfuscated multi-layer mutations^38 |

## Analysis

### Over-Modeling and Brittleness

Software design often requires the code to be slightly more flexible than the strict domain model.^20 Real-world businesses generate edge cases that defy rigid state machines. A strict typestate graph (Draft -> Pending Review -> Approved) breaks when an emergency "un-reject" must skip the pending phase.^20 If arbitrary transitions are forbidden by the compiler, the team faces either a massive refactor or dangerous manual database interventions.^20

In high-variance domains (user-facing SaaS, CMS software), enforcing absolute unrepresentability creates brittle architecture. Bidirectional transitions — even when business rules are unidirectional — are a necessary compromise.^40 In zero-tolerance domains (financial ledgers, stock trades, core network protocols), strict enforcement should be uncompromising.^39

### Boundary Inflexibility

The principle is highly effective for in-memory application state but harmful when extended to distributed boundaries.^20 Making a field required in a Protocol Buffers definition forces lock-step deployment across all microservices; a missed consumer triggers message drops and outages.^20 Reviewers should advocate optional fields in boundary schemas while using "Parse, Don't Validate" to cast them into strict internal types once safely inside the boundary.^9

Relational database foreign key constraints prevent orphan records, but at hyperscale, hard constraints make migrations and sharding hostile.^20 Referential integrity may need to shift from the database engine into the application's domain logic.

### The Unsigned Integer Fallacy

Developers often misuse unsigned integers to model non-negative domain values (e.g., physical lift height). If arithmetic error drops the value below zero, an unsigned integer underflows to a massive positive value (e.g., 65,000 mm) — a far more dangerous invalid state than a small negative value.^30 Signed integers should be used for arithmetic types; unsigned integers reserved strictly for bit manipulation. Linux kernel macros strip arithmetic operations from bitwise types entirely.^30

## Practical Applications

- **Code review checklists:** The six anti-pattern diagnostic probes (section 8) provide a repeatable protocol for reviewers to interrogate domain modeling accuracy beyond syntax correctness.
- **Boundary design:** Enforce strict types internally while keeping external schemas (gRPC, REST) permissive; parse at the boundary.
- **CI pipeline hardening:** NetArchTest and ArchUnit fitness functions codify encapsulation, instantiation, and dependency rules into build-breaking tests.
- **Language selection guidance:** When choosing enforcement strategies, match techniques to ecosystem capabilities — Rust typestates, C# records with pattern matching, TypeScript discriminated unions, Python `assert_never()`.
- **Assertion protocols:** For invariants that transcend type expressiveness (temporal ordering, cross-field relationships), adopt TigerStyle assertion density and positive/negative space checking.

## Limitations

- The source material focuses on statically typed or gradually typed ecosystems. Pure dynamically typed languages (Ruby, plain JavaScript without TypeScript) receive limited coverage.
- Performance trade-offs of persistent typestates and deep sum type hierarchies in hot paths are not benchmarked.
- The paper does not address formal verification tools (TLA+, Alloy, Lean) that provide mathematically complete state integrity proofs beyond compile-time type checking.
- Fitness function examples target .NET and Java ecosystems; equivalent automation for Go, Rust, and Python build systems would require further research.
- Trade-off guidance is heuristic rather than quantitative — the boundary between "high-variance" and "zero-tolerance" domains is context-dependent.

## Related Research

- [research-paper-immutability-anti-patterns-refactoring.md] — Complementary analysis of mutable state pathology and refactoring patterns toward functional purity
- [research-paper-software-composability-category-theory.md] — Algebraic composition and type-theoretic foundations applied to software design
- [research-paper-software-rigidity-ocp-composition.md] — OCP and composition strategies that prevent architectural brittleness

## References

1. Is there a name for this API/type design principle?, Software Engineering Stack Exchange, https://softwareengineering.stackexchange.com/questions/452970/is-there-a-name-for-this-api-type-design-principle-i-think-of-it-as-state-hyg
2. What do you like about Rust?, Reddit r/rust, https://www.reddit.com/r/rust/comments/xaoc2d/what_do_you_like_about_rust/
3. Making Illegal States Unrepresentable, Reddit r/rust, https://www.reddit.com/r/rust/comments/1667sc8/making_illegal_states_unrepresentable/
4. Make invalid states unrepresentable, GeekLaunch, https://geeklaunch.io/blog/make-invalid-states-unrepresentable/
5. Make invalid states unrepresentable (2023), Hacker News, https://news.ycombinator.com/item?id=40150159
6. How to implement clean architecture in rust?, Reddit r/rust, https://www.reddit.com/r/rust/comments/ogxxc6/how_to_implement_clean_architecture_in_rust/
7. Typescript Code Review Checklist, Redwerk, https://redwerk.com/blog/typescript-code-review-checklist/
8. Functional programming and reliability: ADTs, safety, critical infrastructure, Hacker News, https://news.ycombinator.com/item?id=46406901
9. Effective TypeScript Principles in 2025, Dennis O'Keeffe, https://www.dennisokeeffe.com/blog/2025-03-16-effective-typescript-principles-in-2025
10. The Concrete Programming Language: Systems Programming for Formal Reasoning, https://federicocarrone.com/series/concrete/the-concrete-programming-language-systems-programming-for-formal-reasoning/
11. Parse, Don't Validate, Alexis King, https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/
12. Parse, Don't Validate, Elm Radio, https://elm-radio.com/episode/parse-dont-validate/
13. charlax/professional-programming, GitHub, https://github.com/charlax/professional-programming
14. What is the "Primitive Obsession" Code Smell?, IN-COM Data Systems, https://www.in-com.com/blog/what-is-the-primitive-obsession-code-smell/
15. Code Smell – Primitive Obsession and Refactoring Recipes, NDepend Blog, https://blog.ndepend.com/code-smell-primitive-obsession-and-refactoring-recipes/
16. Primitive Obsession: The Anti-Pattern That Stays Invisible, Medium, https://medium.com/@alt.wibbing/primitive-obsession-the-anti-pattern-6339efb82c87
17. A collection of notes from a 7-year career in software engineering, Medium, https://isocroft.medium.com/a-collection-of-notes-from-a-7-year-career-in-software-engineering-0dc1a6242d4f
18. The Ultimate Conditional Syntax, https://lptk.github.io/ucs-paper
19. Anti-If: The missing patterns (2016), Hacker News, https://news.ycombinator.com/item?id=17406379
20. 'Make invalid states unrepresentable' considered harmful, Sean Goedecke, https://www.seangoedecke.com/invalid-states/
21. Clean Code in Frontend: A Practical Checklist, Feature-Sliced Design, https://feature-sliced.design/vi/blog/writing-clean-frontend-code
22. What's a controversial coding convention that you use?, Reddit r/csharp, https://www.reddit.com/r/csharp/comments/1c6abzb/whats_an_controversial_coding_convention_that_you/
23. Designing with types: Introduction, F# for fun and profit, https://fsharpforfunandprofit.com/posts/designing-with-types-intro/
24. Rust Guidelines: Introduction, Azure SDKs, https://azure.github.io/azure-sdk/rust_introduction.html
25. Long-term Rust Project Maintenance, Corrode.dev, https://corrode.dev/blog/long-term-rust-maintenance/
26. tigerbeetle/docs/TIGER_STYLE.md, GitHub, https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md
27. 13 Languages Are Challenging C, DEV Community, https://dev.to/dimension-ai/13-languages-are-challenging-c-most-fail-only-five-stack-up-2no5
28. Hey Rustaceans! Got an easy question? Ask here, Reddit r/rust, https://www.reddit.com/r/rust/comments/m0b9pa/hey_rustaceans_got_an_easy_question_ask_here/
29. First project: A brainf** interpreter, Rust Users Forum, https://users.rust-lang.org/t/first-project-a-brainf-interpreter/77908
30. Make Invalid States Unrepresentable, Reddit r/programming, https://www.reddit.com/r/programming/comments/1agj22q/make_invalid_states_unrepresentable/
31. Architectural fitness function, ThoughtWorks Technology Radar, https://www.thoughtworks.com/en-us/radar/techniques/architectural-fitness-function
32. Fitness Functions for Your Architecture, InfoQ, https://www.infoq.com/articles/fitness-functions-architecture/
33. What Are Architecture Tests?, testRigor, https://testrigor.com/blog/what-are-architecture-tests/
34. anton-liauchuk/educational-platform, GitHub, https://github.com/anton-liauchuk/educational-platform
35. Sairyss/domain-driven-hexagon, GitHub, https://github.com/sairyss/domain-driven-hexagon
36. Fitness Test in ASP.NET source, GitHub (ILoveDotNet), https://github.com/ILoveDotNet/ilovedotnet/blob/main/WebAPIDemoComponents/Pages/Blogs/FitnessTestInASPNET.razor
37. Hexagonal Architecture Example, BeyondxScratch, https://beyondxscratch.com/2020/08/23/hexagonal-architecture-example-digging-a-spring-boot-implementation/
38. domain-driven-hexagon README, GitHub (Sairyss), https://github.com/Sairyss/domain-driven-hexagon/blob/master/README.md
39. Functional Programming Self-Affirmations, Hacker News, https://news.ycombinator.com/item?id=42244851
40. 'Make invalid states unrepresentable' considered harmful, Hacker News, https://news.ycombinator.com/item?id=45164444

## Future Research

- **Formal verification integration:** How tools like TLA+, Alloy, or Lean's dependent types extend beyond compiler-checkable invariants to prove system-level state integrity properties.
- **Go and dynamic language fitness functions:** Porting NetArchTest/ArchUnit concepts to Go (`go/ast`), Ruby (Packwerk), and Python (import-linter) ecosystems.
- **Performance benchmarking:** Measuring the runtime cost of deep typestate hierarchies and sum type matching in hot paths versus traditional flag-based branching.
- **AI-assisted review:** Training code review models to detect the six structural anti-patterns automatically, reducing dependence on human reviewer domain expertise.
- **Cross-boundary state contracts:** Formalizing the "parse at the boundary" pattern for event-driven architectures, where the boundary between systems is asynchronous and schema evolution is continuous.

## Version History

- 1.1.0 (2026-03-25): Rule of 5 review pass — fixed 3 incorrect citation attributions (removed fluid dynamics paper, GitHub profile, and misattributed Rust thread), removed 17 uncited references and renumbered bibliography to 40 entries, merged fitness function sections and fixed heading hierarchy, added Alexis King primary source, added Monolithic Record to anti-pattern table, added Rust/TypeScript/Python code examples, clarified epistemological boundary terminology, corrected arc description count
- 1.0.0 (2026-03-25): Initial version — synthesized from source research on enforcing "make invalid states unrepresentable" across type theory, review protocols, and automated enforcement
