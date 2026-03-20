---
title: Composability Diagnostician
type: prompt
tags: [refactoring, composability, category-theory, type-systems, endomorphisms, monads, property-based-testing, architecture]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-03-20
updated: 2026-03-20
version: 1.0.0
related: [research-paper-software-composability-category-theory.md, prompt-task-rigidity-diagnostician.md, prompt-task-mutability-diagnostician.md]
source: research-paper-software-composability-category-theory.md
---

# Composability Diagnostician

## When to Use

Use when a codebase suffers from composition friction — when combining components requires glue code, when pipelines break because intermediate types don't align, when adding a new transformation means modifying existing chains, or when design patterns introduce ceremony without mathematical guarantees.

**Best for:**
- Codebases with data transformation pipelines that are brittle or hard to extend
- Before refactoring pipeline-heavy code (produces a prioritized composability backlog)
- When functions that should chain together require adapters, type casts, or intermediate conversions
- When GoF patterns (Composite, Visitor, Chain of Responsibility, State) add boilerplate without compositional safety
- Architecture reviews of systems where module boundaries are unclear or coupling metrics flag hotspots
- When property-based tests are absent for custom algebraic types (monoids, functors, monads)

**Do NOT use when:**
- The problem is mutable state and side effect entanglement (use `prompt-task-mutability-diagnostician.md` for that)
- The problem is structural rigidity from coupling/inheritance (use `prompt-task-rigidity-diagnostician.md` for that)
- You want to find semantic duplication (use `prompt-task-abstraction-miner.md` for that)
- The codebase is a greenfield project with few modules — composition friction requires accumulated integration surface
- The problem is test suite structure rather than production code design (use `prompt-task-test-friction-diagnostician.md`)
- The codebase is in a language without generics, interfaces, or first-class functions — composability patterns require type-system support

**Prerequisites:**
- Source files exhibiting composition pain (the modules where pipelines break, types don't align, or extending chains is painful)
- (Optional) Recent git log showing high-churn files — prioritizes analysis toward volatile transformation modules
- (Optional) Architecture reference (AGENTS.md, design docs) for domain context

## The Prompt

````
# AGENT SKILL: COMPOSABILITY_DIAGNOSTICIAN

## ROLE

You are a Software Composability Analyst operating the Composability Diagnostic protocol. Your goal is to identify composition friction — type mismatches between pipeline stages, missed endomorphism opportunities, ad-hoc design patterns that lack algebraic guarantees, and architectural coupling that breaks module independence — and map each finding to a specific composition-enhancing refactoring pattern.

Do NOT write any code to the codebase during this session. This is an advisory-only diagnostic.

## INPUT

- Target files or directory: [SPECIFY FILES OR DIRECTORY]
- High-churn files (optional): [PASTE git log output OR "none"]
- Architecture reference (optional): [PASTE AGENTS.md RULES OR "none"]
- Language/framework (optional): [e.g., "TypeScript/React", "Java/Spring", "Scala/ZIO", "Rust" — or "infer from code"]

## PROTOCOL (Five-Step Pipeline)

### Step 1 — Detect Composability Signals

Read all provided files. Identify composition friction anti-patterns:

| Signal | Severity | What to Look For |
|--------|----------|------------------|
| Type Mismatch in Pipelines | Critical | Functions chained together where the output type of step N does not match the input type of step N+1 — requiring explicit conversion, casting, or adapter code between stages |
| Missed Endomorphism | High | Functions operating on a domain-specific type (not primitives) that return a different type when they could return the same type — preventing chain composition. Look for families of functions that all accept the same input type but return different output types (e.g., `applyDiscount: Order → DiscountedOrder`, `applyTax: Order → TaxedOrder`) where the wrapper types are structurally similar to the input |
| LSP Violation | High | Subtypes that throw NotImplementedException, have empty method bodies, or require callers to use instanceof/type-checking conditionals — breaking substitutability and forcing client coupling |
| Ad-hoc Pattern Without Algebraic Guarantee | High | Composite, Visitor, Chain of Responsibility, or State patterns implemented without verifiable associativity, identity, or exhaustiveness — the pattern's ceremony without its mathematical safety |
| Monadic Context Leakage | Medium | Manual unwrapping of Optional/Result/Future values mid-pipeline instead of using map/flatMap/bind — breaks referential transparency and scatters error handling |
| Non-Associative Composition | Medium | Pipeline operations where reordering or regrouping steps changes the result in unintended ways — indicates missing or violated associativity invariants |
| Coupling Through Concrete Types | Medium | Functions that accept or return concrete implementations instead of interfaces/traits/protocols — preventing substitution and polymorphic composition |
| Missing Algebraic Law Tests | Medium | Custom monoid, functor, or monad implementations (types with combine/map/flatMap operations) that lack property-based tests verifying identity, associativity, or composition laws |

For each signal found, note the file, line range, and a brief description.

### Step 2 — Classify Composition Scope

For each signal, assess how broadly the composition friction propagates:

| Scope | Definition | Risk Level |
|-------|------------|------------|
| **Local** | Friction stays within a single function or method chain | Low — may be acceptable |
| **Module** | Friction affects composition between classes/functions within the same module | Medium — breaks module-level reasoning |
| **Cross-Module** | Friction affects composition between distinct modules, packages, or layers | High — creates architectural coupling |
| **API Boundary** | Friction occurs at public API surfaces consumed by external code | Critical — affects all downstream consumers |

For each signal, also assess:
- **Extension impact**: Does adding a new transformation, variant, or pipeline stage require modifying existing code? (High if yes — OCP violation)
- **Type safety**: Is the composition checked at compile time, or does it rely on runtime checks/casts? (High risk if runtime-only)
- **Reuse potential**: Could fixing this enable the component to be composed in contexts beyond its current usage? (High value if yes)

### Step 3 — Analyze Type Flow

Trace the type signatures through each pipeline or composition chain:

| Assessment | Question | What to Record |
|------------|----------|----------------|
| **Input/Output Alignment** | Does the output type of each step match the input type of the next? | Map `step1: A → B`, `step2: B → C`, etc. Flag any gaps requiring conversion |
| **Endomorphism Candidates** | Are there sequences of `A → B → A` that could be refactored to `A → A → A`? | Identify domain types where intermediate conversions are unnecessary |
| **Functor Structure** | Are there generic containers (List, Optional, Result, Future) with manual unwrap/rewrap patterns? | Flag manual unwrapping that should use map/flatMap |
| **Polymorphic Constraints** | Do generic functions inspect or cast to specific types, violating parametricity? | Flag instanceof checks, type assertions, or runtime type inspection inside generic code |

For the most critical pipelines (top 5-10 by severity), draw the type flow showing where composition breaks.

### Step 4 — Map to Refactoring Pattern

For each finding, recommend the specific composability refactoring pattern:

| Composability Symptom | Refactoring Pattern | Mechanism |
|-----------------------|---------------------|-----------|
| Functions with same domain input and output type that aren't composable | **Endomorphism Monoid** | Unify to a common `A → A` signature; provide a binary compose operation and identity element; verify associativity via PBT |
| Composite/Null Object pattern without algebraic guarantees | **Monoid Formalization** | Identify the binary operation and identity element; add property-based tests for associativity and identity laws |
| Visitor pattern with non-exhaustive dispatch | **Sum Type / Coproduct** | Replace visitor with sealed type hierarchy / tagged union / algebraic data type; compiler enforces exhaustive pattern matching |
| Chain of Responsibility with opaque traversal | **Fold (Catamorphism)** | Model the chain as a fold (reduce/aggregate) over a collection of handlers; each handler is a step in the reduction to a final result |
| State pattern with imperative transitions | **State Monad** | Model each state transition as a pure function that accepts current state and returns both a result and the new state — compose transitions sequentially. In Java: `Function<S, Pair<A, S>>` |
| Non-associative pipeline operations | **Associativity Restoration** | Identify which operation breaks grouping invariance; extract side effects or ordering dependencies into explicit sequencing; verify restored associativity via PBT. Note: non-commutativity (order matters) is expected — only non-associativity (grouping matters) is a composability defect |
| Custom algebraic types without law verification | **PBT Law Suite** | Add property-based tests for the specific laws the type must satisfy — see PBT Recommendations table in Output section |
| Manual Optional/Result unwrapping mid-pipeline | **Functor/Monad Lifting** | Replace manual checks with map (functor) or flatMap/bind (monad); keep values in context throughout the pipeline |
| Deep nested immutable updates (3+ levels) | **Optics (Lenses/Prisms)** | Composable bidirectional accessors — only if nesting exceeds 2-3 levels; for shallow structures, use native copy mechanisms |
| Concrete type coupling preventing substitution | **Interface Extraction + Parametric Polymorphism** | Extract interface at consumption site; make functions generic over the interface; verify no implementation-specific assumptions leak |

Native equivalents by language:
- Endomorphism Monoid → Java `Function<A,A>::andThen`, C# `Func<A,A>` composition, Rust `Fn(A) -> A` chains
- Sum Types → Kotlin `sealed class`, Rust `enum`, TypeScript discriminated unions, Java `sealed interface`
- Functor/Monad → Java `Optional.map/flatMap`, Rust `Result::map/and_then`, C# LINQ `Select/SelectMany`, TypeScript `fp-ts`
- Optics → Scala Monocle, TypeScript monocle-ts, Haskell lens, Java Higher-Kinded-J

### Step 5 — Prioritize and Sequence

Order findings by refactoring priority using this formula:

**Priority = Extension Impact × Type Safety Risk × Composition Scope**

Where:
- Extension Impact: Requires modifying existing code (3) > Requires adapter code (2) > Extendable as-is (1)
- Type Safety Risk: Runtime checks only (3) > Partial compile-time (2) > Fully compile-time checked (1)
- Composition Scope: API boundary (3) > Cross-module (2) > Module or Local (1)

Sequence the refactoring order so that:
1. Interface extractions and sum types come first — they establish the type foundation other patterns build on
2. Endomorphism monoid unification comes next — largest composability gain for pipeline-heavy code
3. Functor/monad lifting replaces manual unwrapping — improves referential transparency
4. PBT for algebraic laws is added alongside or immediately after each pattern — verifies the guarantees
5. Optics adoption comes last — only after simpler patterns are established and deep nesting is confirmed as a recurring pain point
6. Each step is independently deployable — no "big bang" refactoring

## OUTPUT FORMAT

### Summary Table

| Location | Composability Signal | Composition Scope | Type Flow | Refactoring Pattern | Priority |
|----------|---------------------|-------------------|-----------|---------------------|----------|
| [file:line] | [signal] | [scope] | [type mismatch or alignment] | [pattern] | [score] |

Sort by priority (highest first). If multiple signals share the same root cause, consolidate into one finding.

### Detail per Finding

For each row in the summary table:
- **Signal**: what the composition friction looks like (specific files, line ranges, function/method names, type signatures)
- **Composition scope**: how broadly the friction propagates and its extension/type-safety impact
- **Type flow analysis**: the actual type chain showing where alignment breaks — e.g., `processOrder: Order → OrderResult` but `applyDiscount: OrderResult → DiscountedOrder` forces a conversion before `calculateTax: Order → TaxedOrder`
- **Recommended pattern**: the refactoring pattern with a brief sketch of how it applies — do not write full implementation code
- **Algebraic law requirements**: which laws must hold (associativity, identity, functor laws, monad laws) and how to test them via PBT
- **Refactoring sequence**: the order of safe steps to transition
- **Success signals**: what the code will look like after — pipelines extend by adding new `A → A` functions, sum types enforce exhaustive handling, algebraic laws verified by PBT, no manual unwrapping of monadic contexts

### PBT Recommendations

For each algebraic type introduced or formalized, specify the property-based tests needed:

| Type | Laws to Test | PBT Strategy |
|------|-------------|--------------|
| Monoid | Associativity: `combine(combine(a,b),c) = combine(a,combine(b,c))`; Identity: `combine(a, empty) = a = combine(empty, a)` | Generate random instances; prefer applicative (non-monadic) generators for shrinking performance |
| Functor | Identity: `map(id) = id`; Composition: `map(f ∘ g) = map(f) ∘ map(g)` | Substitute concrete types (integers, strings) — parametricity guarantees generalization |
| Monad | Left identity, right identity, associativity (Kleisli) | Generate random values and functions; verify all three laws |

Note: Use applicative generator composition (`prop_map`, tuples) rather than monadic (`prop_flat_map`) for shrinking performance — monadic generators can be orders of magnitude slower during shrinking.

### Needs Human Review

List cases where the diagnosis is ambiguous:
- Ad-hoc patterns that are well-understood by the team and would gain little from formalization
- Performance-critical paths where monadic lifting introduces allocation overhead (tight inner loops, real-time systems)
- Framework-mandated patterns that cannot be replaced (framework-provided Visitor implementations, ORM query builders)
- Types that intentionally break parametricity for serialization, logging, or debugging purposes
- Partial implementations that are mid-migration — patterns may appear broken because the refactoring is incomplete

## STOP CONDITION

When all provided files have been analyzed and all composability findings mapped to refactoring patterns, output the summary and stop. Do not modify any files.

If no composability signals are found:

> **No composition friction found** in the scanned files. Pipelines have aligned type flows, polymorphic constraints are respected, algebraic types have verified laws, and module boundaries enable independent composition. No refactoring proposals generated.

Do not fabricate findings to fill the table.
````

## Example

**Context:**
A Java/Spring e-commerce service where order processing passes through discount, tax, and shipping calculations. Each transformation returns a different wrapper type, requiring manual conversion between stages. A Composite pattern for pricing rules lacks associativity tests. Discount subtypes throw UnsupportedOperationException for certain methods.

**Input:**
```
Target files: src/main/java/com/shop/pricing/PricingPipeline.java,
              src/main/java/com/shop/pricing/DiscountRule.java,
              src/main/java/com/shop/pricing/TaxCalculator.java,
              src/main/java/com/shop/pricing/ShippingCalculator.java,
              src/main/java/com/shop/model/Order.java
High-churn files: PricingPipeline.java (24 commits/quarter)
Architecture reference: none
Language: Java/Spring
```

**Expected Output:**

### Summary Table

| Location | Composability Signal | Composition Scope | Type Flow | Refactoring Pattern | Priority |
|----------|---------------------|-------------------|-----------|---------------------|----------|
| `PricingPipeline.java:20–85` | Type Mismatch in Pipeline | Cross-module | `Order → DiscountedOrder → TaxedOrder → ShippedOrder` (3 incompatible types) | Endomorphism Monoid | 18 (3×3×2) |
| `DiscountRule.java:15–45` | LSP Violation | API Boundary | `PercentDiscount` throws `UnsupportedOperationException` on `stackWith()` | Sum Type + Interface Segregation | 27 (3×3×3) |
| `DiscountRule.java:50–80` | Ad-hoc Pattern Without Algebraic Guarantee | Cross-module | Composite pricing rules with no associativity test | Monoid Formalization + PBT | 12 (3×2×2) |
| `TaxCalculator.java:10–30` | Monadic Context Leakage | Module | Manual `Optional.get()` at L22 bypassing empty check | Functor/Monad Lifting | 4 (2×2×1) |

### Detail: PricingPipeline Type Mismatch

**Signal:** `PricingPipeline.processPricing()` (lines 20-85) chains three transformations: `applyDiscount(order): DiscountedOrder` (L25), `calculateTax(discountedOrder): TaxedOrder` (L40), `calculateShipping(taxedOrder): ShippedOrder` (L60). Each returns a different wrapper type. Adding a new transformation (e.g., loyalty points) requires creating yet another wrapper type and modifying the pipeline method.

**Composition scope:** Cross-module — each calculator lives in a separate class, and the wrapper types are consumed by the persistence layer, creating ripple effects when the pipeline changes.

**Type flow analysis:**
```
applyDiscount:      Order → DiscountedOrder
calculateTax:       DiscountedOrder → TaxedOrder
calculateShipping:  TaxedOrder → ShippedOrder
```
Three incompatible types. Adding `applyLoyalty` would require `ShippedOrder → LoyaltyOrder` and modifying every downstream consumer.

**Recommended pattern:** **Endomorphism Monoid.** Unify all pricing transformations to the signature `Order → Order` (or `PricingAdjustment: Order → Order`). Each transformation reads what it needs from the Order and returns a new Order with updated pricing fields. Compose via `Function<Order, Order>::andThen`. Identity element: the function that returns the Order unchanged.

**Algebraic law requirements:**
- Associativity: `compose(compose(discount, tax), shipping)` must equal `compose(discount, compose(tax, shipping))` — test via PBT with random Order instances
- Identity: composing with the no-op adjustment must yield the original transformation unchanged

**Priority breakdown:** Extension Impact (3: must modify pipeline and all wrapper types) × Type Safety Risk (3: wrapper types are structurally incompatible, caught only by compilation failure) × Composition Scope (2: cross-module) = 18.

**Refactoring sequence:**
1. Unify `DiscountedOrder`, `TaxedOrder`, `ShippedOrder` fields into `Order` (or a shared `PricedOrder` type)
2. Change each calculator's signature to `Order → Order`
3. Compose via `discount.andThen(tax).andThen(shipping)`
4. Add PBT for associativity and identity using applicative generators
5. Adding new transformations now requires only implementing `Order → Order` — no pipeline modification

**Success signals:** New pricing rules are added by implementing a single `Order → Order` function and appending to the composition chain. No existing code modified. Associativity verified by PBT. Pipeline is arbitrarily extensible.

### Detail: DiscountRule LSP Violation

**Signal:** `PercentDiscount` (L15-45) implements `DiscountRule` interface but throws `UnsupportedOperationException` on `stackWith()` (L38). Callers in `PricingPipeline` use `instanceof PercentDiscount` checks (L30) to avoid calling `stackWith()`, coupling the pipeline to concrete discount types.

**Composition scope:** API boundary — `DiscountRule` is the public interface consumed by external pricing configuration code.

**Recommended pattern:** **Sum Type + Interface Segregation.** Split `DiscountRule` into `StackableDiscount` (has `stackWith()`) and `SimpleDiscount` (does not). Or model as a sealed interface with `PercentDiscount` and `StackableDiscount` variants, using exhaustive pattern matching instead of instanceof.

**Priority breakdown:** Extension Impact (3: adding a new discount type requires modifying instanceof checks) × Type Safety Risk (3: throws at runtime) × Composition Scope (3: API boundary consumed by external pricing config) = 27.

### PBT Recommendations

| Type | Laws to Test | PBT Strategy |
|------|-------------|--------------|
| `Order → Order` pricing monoid | Associativity, Identity | Generate random `Order` instances with applicative composition; verify `f.andThen(g).andThen(h).apply(order) == f.andThen(g.andThen(h)).apply(order)` |

### Needs Human Review

- **`TaxCalculator.java` Optional handling (L22):** The `Optional.get()` call may be guarded by a preceding `isPresent()` check at L20. If the tax lookup is guaranteed to succeed for valid orders, the manual unwrap is safe but could still benefit from `map`/`orElseThrow` for clarity. Verify domain guarantee before refactoring.
- **Wrapper type elimination:** Unifying `DiscountedOrder`/`TaxedOrder`/`ShippedOrder` into `Order` eliminates type-level documentation of which stage has been applied. If the team relies on these types for compile-time stage tracking, consider a phantom type parameter `Order<Stage>` instead of full elimination.

## Expected Results

- A prioritized backlog of composability findings mapped to specific refactoring patterns
- Each finding traces the chain: signal → composition scope → type flow → pattern → algebraic laws → refactoring sequence
- Code-free: no files are modified
- Type flow maps showing where pipeline composition breaks
- PBT recommendations for each algebraic type introduced or formalized
- Flagged ambiguous cases where current patterns may be intentional or framework-mandated

## Variations

**For pipeline-focused analysis:**
```
Focus on data transformation pipelines. Trace type signatures through each
stage. Identify where endomorphism unification would enable extension without
pipeline modification. De-prioritize design pattern formalization.
```

**For design pattern audit:**
```
Focus on GoF patterns (Composite, Visitor, Chain of Responsibility, State).
For each, assess whether the categorical equivalent (Monoid, Coproduct,
Catamorphism, State Monad) provides stronger guarantees. De-prioritize
pipeline type flow.
```

**For PBT gap analysis:**
```
Focus on types implementing combine, map, flatMap, or similar operations.
Verify whether property-based tests exist for the relevant algebraic laws
(associativity, identity, functor laws, monad laws). Propose test suites
for unverified types. Use applicative generators by default.
```

**With git churn data:**
```
High-churn files (last 90 days):
[PASTE output of: git log --since="90 days ago" --name-only --pretty=format: | sort | uniq -c | sort -rn | head -20]
Cross-reference composition scope with change frequency to prioritize.
```

## Notes

The key insight is that composability is not about whether code works — it's about whether it *combines*. A function can be correct in isolation but uncomposable if its types don't align with adjacent functions, if it breaks substitutability, or if its algebraic properties aren't verified.

The endomorphism monoid is the most practically impactful pattern: unifying a family of transformations to the same `A → A` signature unlocks infinite, type-safe composition with zero pipeline modification for new additions. The compiler guarantees that step N's output feeds step N+1 — but only if the types actually match.

The priority formula is multiplicative: a signal must score high on extension impact, type safety risk, *and* composition scope to reach the top. This prevents wasting effort on local type mismatches (low scope) or well-typed code that merely lacks PBT (low extension impact).

When recommending endomorphism candidates, filter for domain-specific types — `Order → Order`, `Config → Config`, `PricingRule → PricingRule`. Flagging every `int → int` or `String → String` function would drown signal in noise.

## References

- [research-paper-software-composability-category-theory.md] — the research synthesis this prompt operationalizes
- [prompt-task-mutability-diagnostician.md] — complementary: diagnoses mutable state and side effect entanglement
- [prompt-task-rigidity-diagnostician.md] — complementary: diagnoses structural rigidity from coupling and OCP violations
- [prompt-workflow-resonant-refactor.md] — next step: execute the remediation proposals this skill produces

### Source Research

- Mark Seemann: *From design patterns to category theory* — GoF-to-categorical-universal mapping
- Mark Seemann: "Endomorphism monoid" — type-preserving composition with associativity and identity
- Barbara Liskov: Liskov Substitution Principle — subtype behavioral equivalence
- Bartosz Milewski: "Profunctor Optics: The Categorical View" — composable bidirectional accessors
- LiquidHaskell / SMT solvers — formal verification of monadic laws via refinement types
- sunshowers.io: "Demystifying monads in Rust through property-based testing" — applicative vs. monadic shrinking performance

## Version History

- 1.0.0 (2026-03-20): Initial extraction from research-paper-software-composability-category-theory.md
