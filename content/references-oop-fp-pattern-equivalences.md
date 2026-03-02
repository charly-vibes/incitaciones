---
title: OOP Design Patterns ↔ FP / Category Theory Equivalences
type: references
tags: [design-patterns, functional-programming, oop, category-theory, refactoring, abstraction, seemann, norvig, gof]
tools: [claude-code, cursor, aider, gemini, any-cli-llm]
status: draft
created: 2026-03-01
updated: 2026-03-01
version: 1.0.0
related: [research-finding-test-friction-design-diagnostic.md, research-finding-test-parameterization-pbt-pipeline.md, research-paper-resonant-coding-agentic-refactoring.md]
source: synthesis
---

# OOP Design Patterns ↔ FP / Category Theory Equivalences

A curated reference mapping each GoF design pattern to its functional / algebraic equivalent, with brief explanations, testing implications, and canonical source links per row. Intended as a lookup table for the diagnostic pipeline in `research-finding-test-friction-design-diagnostic.md`.

**Core thesis (Norvig 1996, Graham 2002, Seemann 2017–2021):** Design patterns are compensations for missing language features. In languages with first-class functions, sum types, and type classes, most GoF patterns dissolve into language-level constructs. The boilerplate that patterns introduce inflates test surface area; its elimination simplifies tests proportionally.

---

## Primary Equivalence Table

The "Testing implication" column states what disappears from the test suite when the FP equivalent is used instead of the OOP pattern.

| GoF Pattern | FP / Category Theory Equivalent | Plain-language meaning | Testing implication | Sources |
|---|---|---|---|---|
| **Strategy** | Higher-order function / Functor | Pass a function instead of an object implementing an interface | No interface, no mock — pass a test function directly | [Norvig 1996], [Seemann], [LtuPF] |
| **Command** | First-class function / IO monad | A function value instead of an object with an `execute()` method | No command object to construct or mock | [Norvig 1996], [LtuPF] |
| **Template Method** | Higher-order function | Pass the varying step as a function argument to the invariant skeleton | No abstract class hierarchy; test by passing different functions | [Norvig 1996] |
| **Visitor** | Sum types (algebraic data types) + pattern matching | Enumerate all cases in the type system; match exhaustively | Compiler enforces exhaustiveness — no test for "missing case" branch | [Seemann], [LtuPF] |
| **Composite** | Monoid (associative binary op + identity element) | Combine values of the same type the same way at any scale | `fold` replaces recursive traversal; test the binary op, not the recursion | [Seemann], [LtuPF] |
| **Null Object** | Identity element of a Monoid / Maybe monad | The "do nothing" value that satisfies the monoid laws | `mempty` or `Nothing` replaces a null-check class; no separate test for the null path | [Seemann] |
| **Decorator** | Endomorphism monoid (`a → a` function composition) | Compose functions with matching input/output types | Test each function independently; compose with `(.)` — no wrapper class | [Seemann] |
| **Builder** | Monoid / applicative construction | Assemble a value by combining parts that each have identity | No telescoping constructors; test each part independently | [Seemann] |
| **Chain of Responsibility** | Catamorphism (fold / `reduce`) | Collapse a list of handlers into a single result by folding | Test the fold function once; no linked-list of handler objects to wire | [Seemann] |
| **State** | State monad | Thread state through a pipeline of pure functions | Pure functions are trivially testable; no stateful object graph | [Seemann], [LtuPF] |
| **Iterator** | Traversable type class | Sequence effects across a structure without exposing the loop | Test the traversal law (`traverse id == id`) once; no cursor object | [Seemann], [LtuPF] |
| **Observer / Event** | Reactive streams / continuation / Event monad | Model event streams as first-class values | Test stream transformations as pure functions; no listener registration | — |
| **Abstract Factory** | Higher-order function / Type class | A function that returns the right constructor for the context | No factory hierarchy; test by passing the constructor function | [Norvig 1996] |
| **Factory Method** | First-class type / smart constructor | A value-level function that constructs the right type | Test the constructor function directly | [Norvig 1996] |
| **Flyweight** | Memoisation / first-class types | Cache and share values by construction-time equality | No pool object; test memoisation with identity comparison | [Norvig 1996] |
| **Proxy** | Newtype / first-class types | Wrap a type to add behavior without changing its interface | No proxy class; test the wrapping function | [Norvig 1996] |
| **Facade** | Module / namespace | Group related functions under a single import boundary | Test the module's public surface; no facade class | [Norvig 1996] |
| **Singleton** | Module-level value / global constant | A value defined once at the module level | No getInstance() dance; the value is just a binding | — |
| **Interpreter** | Reader monad / free monad / EDSL | Represent a program as a data structure, interpret separately | Test the interpreter and the program structure independently | [Norvig 1996], [LtuPF] |
| **Mediator** | Function composition / message passing | Route messages through a pipeline of pure functions | Test each transformation; no mediator object to wire | — |
| **Memento** | Purely functional data structures (persistent) | Every "snapshot" is a value — no mutation, no undo stack | Test by comparing values; no memento class | — |
| **Prototype** | Pure value + copy-on-write | Cloning is just assigning an immutable value | No `clone()` method; assignment is copying | — |
| **Bridge** | Type class / parametric polymorphism | Abstract over implementations via type parameters | Test each instance; no abstract/concrete hierarchy | — |

---

## Norvig's Original Absorption Map (1996)

Norvig's "Design Patterns in Dynamic Programming" (presented at OOPSLA 1996) showed that **16 of 23 GoF patterns become invisible or simpler** in languages with first-class functions and macros. His examples used Lisp and Dylan; the principle applies to any language with those features.

| Language feature | Patterns absorbed |
|---|---|
| **First-class functions** | Command, Strategy, Template Method, Visitor |
| **First-class types** | Abstract Factory, Flyweight, Factory Method, State, Proxy, Chain of Responsibility |
| **Macros** | Interpreter, Iterator |
| **Modules** | Facade |
| **Method combination** | Decorator, Observer |

The 7 patterns Norvig found not simplified: Singleton (trivially), Adapter, Bridge, Composite, Memento, Prototype, Mediator — most of which have FP equivalents identified by Seemann and the Haskell community in subsequent decades.

---

## FP Structure → What it Replaces

The inverse lookup: given an FP concept, what OOP pattern(s) does it subsume?

| FP / Category Theory Structure | Replaces | Key law to test |
|---|---|---|
| **Monoid** | Composite, Builder, Null Object | Associativity: `(a <> b) <> c == a <> (b <> c)`; Identity: `mempty <> x == x` |
| **Functor** | Strategy (over a context) | `fmap id == id`; `fmap (f . g) == fmap f . fmap g` |
| **Applicative** | Abstract Factory, Builder | `pure id <*> v == v`; interchange law |
| **Monad** | Chain of Responsibility, State, Command sequence, Interpreter | Left identity, right identity, associativity (monad laws) |
| **Maybe / Option** | Null Object | Functor + Monad laws on `Maybe` |
| **Either / Result** | Error-handling chain, Chain of Responsibility for errors | Monad laws; `Right` is identity for the happy path |
| **State monad** | State pattern | Monad laws; state threading preserves referential transparency |
| **Reader monad** | Dependency injection (manual), Interpreter | Monad laws; environment is read-only |
| **Sum types (ADT)** | Visitor, all type-dispatch conditionals | Exhaustiveness enforced by compiler; no runtime dispatch test needed |
| **Endomorphism monoid** | Decorator | `f . id == f`; associativity of function composition |
| **Catamorphism (fold)** | Chain of Responsibility, Iterator | Paramorphism laws; fold replaces explicit recursion |
| **Traversable** | Iterator | `traverse (pure . f) == pure . fmap f` |
| **Type class** | Abstract Factory, Bridge, Strategy with bounded polymorphism | Instance coherence; laws defined per type class |
| **Newtype** | Proxy, Flyweight | Isomorphism: `unwrap . wrap == id` |
| **Free monad** | Interpreter | Interpretation is a natural transformation; test interpreter separately from program |
| **Persistent data structures** | Memento | Value equality replaces snapshot/restore |

---

## Testing Impact Summary

The key practical insight for the test-friction diagnostic: **each pattern removed from OOP code reduces the test surface area it imposed**.

| What disappears when you use the FP equivalent | Test infrastructure saved |
|---|---|
| Interface declaration | No need to mock the interface |
| Concrete implementation class | No unit test for the implementation class |
| Context / factory class | No test for wiring or configuration |
| `if`/`switch` dispatch on type | No branch coverage for the dispatch |
| Null-check conditional | No test for the null path |
| Recursive traversal | No test for the recursion; test the algebra instead |
| Mutable state object | No setup/teardown for state; test pure functions |

---

## Source Links

### Foundational
- [Design Patterns in Dynamic Languages — Peter Norvig, OOPSLA 1996](http://norvig.com/design-patterns/) — the original "patterns as missing features" argument
- Gamma, Helm, Johnson, Vlissides — *Design Patterns: Elements of Reusable Object-Oriented Software* (GoF, Addison-Wesley, 1994) — [publisher](https://www.oreilly.com/library/view/design-patterns-elements/0201633612/)
- [Revenge of the Nerds — Paul Graham (2002)](http://www.paulgraham.com/icad.html) — "patterns in my programs are a sign of trouble"

### Mark Seemann's Category Theory Bridge
- [From Design Patterns to Category Theory — blog series index](https://blog.ploeh.dk/2017/10/04/from-design-patterns-to-category-theory/) — the primary source for the OOP↔FP Rosetta Stone; covers Monoid, Functor, Applicative, Monad, and specific pattern mappings
- [Functional architecture: a definition](https://blog.ploeh.dk/2018/11/19/functional-architecture-a-definition/) — Seemann on why FP design is intrinsically testable
- [Functors, applicatives, and friends](https://blog.ploeh.dk/2018/03/22/functors/) — functor as Strategy
- [The Maybe functor](https://blog.ploeh.dk/2018/03/26/the-maybe-functor/) — Maybe as Null Object
- [Monoids accumulate](https://blog.ploeh.dk/2017/10/10/strings-lists-and-sequences-as-a-monoid/) — Monoid as Composite
- [The Visitor as a sum type](https://blog.ploeh.dk/2018/06/25/visitor-as-a-sum-type/) — direct Visitor↔ADT mapping
- [The State functor](https://blog.ploeh.dk/2021/07/19/the-state-functor/) — State pattern → State monad

### Lambda the Ultimate Pattern Factory (Haskell)
- [Lambda the Ultimate Pattern Factory — Thomas Mahler, GitHub](https://github.com/thma/LtuPatternFactory) — complete GoF→Haskell translation with working code
  - Strategy → Functor
  - NullObject → Maybe Monad
  - Interpreter → Reader Monad
  - Composite → SemiGroup / Monoid
  - Visitor → Foldable
  - Iterator → Traversable
  - Command → IO Monad
  - Template Method → type class default methods

### Specific Pattern Mappings
- [Visitor pattern (Wikipedia)](https://en.wikipedia.org/wiki/Visitor_pattern#Advantages_and_disadvantages) — notes the relationship to double dispatch and sum types
- [Replace Conditional with Polymorphism — Fowler](https://refactoring.com/catalog/replaceConditionalWithPolymorphism.html) — OOP side of the conditional→pattern mapping
- [Algebraic Data Types — Haskell Wiki](https://wiki.haskell.org/Algebraic_data_type) — sum types as the FP replacement for Visitor
- [Monoid — Haskell Wiki](https://wiki.haskell.org/Monoid) — mathematical foundation for Composite/Builder/Null Object
- [Catamorphism — Haskell Wiki](https://wiki.haskell.org/Catamorphisms) — fold as Chain of Responsibility
- [Free Monad — Haskell Wiki](https://wiki.haskell.org/Free_structure) — Interpreter pattern FP equivalent

### Broader Context
- [SOLID Is OOP, but without Object-Orientation — Seemann](https://blog.ploeh.dk/2021/03/08/pendulum-swing-transactional-vs-choreography-based-workflows/) — SOLID principles lead to FP at the limit
- [Scott Wlaschin — Domain Modelling Made Functional](https://pragprog.com/titles/swdddf/domain-modeling-made-functional/) — sum types and type-driven design (practical F# treatment)
- [Make Illegal States Unrepresentable — Yaron Minsky, Jane Street](https://blog.janestreet.com/effective-ml-revisited/) — origin of the phrase; OCaml context
- [Types and Programming Languages — Pierce](https://www.cis.upenn.edu/~bcpierce/tapl/) — theoretical foundations for sum/product types

---

## Version History

- 1.0.0 (2026-03-01): Initial extraction from research-finding-test-friction-design-diagnostic.md; expanded with Norvig absorption map, FP→OOP inverse table, testing impact summary, and full source links
