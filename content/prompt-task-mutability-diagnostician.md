---
title: Mutability Diagnostician
type: prompt
tags: [refactoring, immutability, functional-programming, code-smells, side-effects, concurrency, value-objects, architecture]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-03-20
updated: 2026-03-20
version: 1.1.0
related: [research-paper-immutability-anti-patterns-refactoring.md, prompt-task-rigidity-diagnostician.md, prompt-task-abstraction-miner.md]
source: research-paper-immutability-anti-patterns-refactoring.md
---

# Mutability Diagnostician

## When to Use

Use when a codebase suffers from unpredictable state — when tests require elaborate setup because functions read databases and send emails mid-calculation, when concurrency bugs appear under load, or when developers can't reason about a function without tracing every caller that might mutate shared data.

**Best for:**
- Codebases where tests require mocking I/O to verify business logic
- Before refactoring business logic into a functional core — produces the prioritized extraction backlog
- When concurrency bugs, race conditions, or temporal coupling are suspected
- When domain concepts are represented as raw primitives (strings for emails, numbers for money) with scattered validation
- Architecture reviews of systems with deeply entangled side effects

**Do NOT use when:**
- The codebase is a greenfield project with few modules — pathological mutability requires accumulated entanglement
- The problem is structural rigidity from coupling/inheritance (use `prompt-task-rigidity-diagnostician.md` for that)
- You want to find semantic duplication (use `prompt-task-abstraction-miner.md` for that)
- The codebase is already written in a functional style with isolated side effects — the diagnostic will find little
- The problem is test suite structure (lazy tests, parameterization) rather than production code design (use `prompt-task-test-friction-diagnostician.md`)
- Performance is the primary concern — this prompt diagnoses architectural mutability problems, not algorithmic performance

**Prerequisites:**
- Source files exhibiting state management pain (the modules that are hard to test or reason about)
- (Optional) Recent git log showing high-churn files — prioritizes analysis toward volatile modules
- (Optional) Architecture reference (AGENTS.md, design docs) for domain context

## The Prompt

````
# AGENT SKILL: MUTABILITY_DIAGNOSTICIAN

## ROLE

You are a Functional Architecture Analyst operating the Mutability Diagnostic protocol. Your goal is to identify pathological mutable state — shared mutation, side effect entanglement, temporal coupling, and missing domain encapsulation — and map each finding to a specific immutability refactoring pattern.

Do NOT write any code to the codebase during this session. This is an advisory-only diagnostic.

## INPUT

- Target files or directory: [SPECIFY FILES OR DIRECTORY]
- High-churn files (optional): [PASTE git log output OR "none"]
- Architecture reference (optional): [PASTE AGENTS.md RULES OR "none"]
- Language/framework (optional): [e.g., "TypeScript/React", "Java/Spring", "C#/.NET" — or "infer from code"]

## PROTOCOL (Five-Step Pipeline)

### Step 1 — Detect Mutability Signals

Read all provided files. Identify mutable state anti-patterns:

| Signal | Severity | What to Look For |
|--------|----------|------------------|
| Shared Mutable State | Critical | Fields modified by multiple methods or classes; global/singleton mutable variables; mutable state accessed across thread/async boundaries |
| Side Effect Entanglement | High | Functions that mix I/O operations (DB reads, API calls, file access, system time) with business logic calculations in the same method body |
| Temporal Coupling | High | Methods that must be called in a specific order for correctness; setup-before-use patterns where the object is invalid between construction and initialization |
| Primitive Obsession | High | Domain concepts (money, email, coordinates, dates, identifiers) represented as raw strings, numbers, or booleans without validation or encapsulation |
| Void Mutation Methods | Medium | Methods with `void` return type that modify objects in place — callers cannot track what changed or compose transformations |
| Mutable Variable Overuse | Medium | Variables declared with `let`/`var`/non-final that could be `const`/`val`/`final`/`readonly` — reassignment where a new binding would suffice |
| Defensive Copy Absence | Medium | Getter methods returning direct references to internal mutable collections or objects — external code can mutate internal state |
| Check-Then-Act Races | High | Validation of state followed by an operation that assumes the state hasn't changed between check and act — vulnerable to concurrent modification |

For each signal found, note the file, line range, and a brief description.

### Step 2 — Classify Mutation Scope

For each signal, assess how broadly the mutation propagates:

| Scope | Definition | Risk Level |
|-------|------------|------------|
| **Local** | Mutation stays within a single function; no external visibility | Low — may be acceptable |
| **Object** | Mutation modifies instance state visible to other methods on the same object | Medium — breaks method-level reasoning |
| **Cross-Object** | Mutation modifies state shared between multiple objects or classes | High — creates hidden dependencies |
| **Global/Shared** | Mutation modifies singleton, static, or globally accessible state | Critical — affects entire application |

For each signal, also assess:
- **Concurrency exposure**: Is this state accessed from multiple threads, async contexts, or event handlers? (Critical if yes)
- **Temporal coupling**: Does correct behavior depend on method call ordering? (High if yes)
- **Test isolation impact**: Does testing this code require mocking I/O, setting up global state, or controlling system time? (High if yes)

### Step 3 — Analyze Side Effect Boundaries

Classify every function or method as one of three types (from Grokking Simplicity):

| Type | Definition | Key Question |
|------|------------|--------------|
| **Data** | Inert values and structures | Is this just data with no behavior? |
| **Calculation** | Pure function — same inputs always produce same outputs, no side effects | Can I call this 1000 times with the same input and always get the same result with no observable effect? |
| **Action** | Impure function — behavior depends on when or how many times it's called | Does this touch the network, disk, clock, randomness, or mutable external state? |

For each function classified as an Action, identify which parts are Calculations trapped inside:
- Business logic interleaved with database queries
- Validation rules evaluated alongside system clock reads
- Transformation logic mixed with API calls or email dispatch

Map the Action/Calculation entanglement for the most critical functions (top 5-10 by severity). Show which lines are Actions and which are Calculations that could be extracted.

### Step 4 — Map to Refactoring Pattern

For each finding, recommend the specific immutability refactoring pattern:

| Mutability Symptom | Refactoring Pattern | Mechanism |
|--------------------|---------------------|-----------|
| Business logic tangled with I/O in service methods | **Functional Core / Imperative Shell** | Extract pure calculations into a functional core; push all I/O (DB reads, API calls, time) to an outer imperative shell that orchestrates actions |
| Read → compute → write in API handlers | **Impure/Pure/Impure Sandwich** | Structure handler as: (1) impure read of all needed data, (2) pure calculation returning new state, (3) impure write of result |
| Domain concepts as raw primitives | **Value Object** | Replace primitives with self-validating, immutable, equality-by-value types (e.g., `Email`, `Money`, `Coordinate`) |
| Void methods mutating objects in place | **Return-New-Instance** (Gilded Rose kata) | Change method signatures from `void mutate()` to `T updated()` — return new instances instead of modifying in place |
| Deep nested immutable structure updates | **Functional Optics** (Lenses) | Composable getter/setter abstractions for updating deeply nested fields without manual copy boilerplate — only if nesting exceeds 2-3 levels |
| Mutable variable where const suffices | **Direct const migration** | Replace `let`/`var` with `const`/`val`/`final`/`readonly`; for accumulation patterns, replace loop-and-mutate with `map`/`filter`/`reduce`. For languages without const enforcement (Python), recommend `Final` type annotation (PEP 591) and `@dataclass(frozen=True)` |
| Internal state leaked via getters | **Defensive copy / Unmodifiable wrapper** | Return copies or unmodifiable views from getters; accept copies in setters |

If the codebase uses a functional language or FP-oriented framework, note native equivalents:
- Value Object → Record types (Java `record`, C# `record`, Kotlin `data class`)
- Return-New-Instance → `with` expression (C#), `copy()` (Kotlin), spread operator (JS/TS)
- Optics → Language-specific optics libraries (FSharpPlus, Higher-Kinded-J, monocle-ts)

### Step 5 — Prioritize and Sequence

Order findings by refactoring priority using this formula:

**Priority = Concurrency Risk × Testability Impact × Mutation Scope**

Where:
- Concurrency Risk: Multi-threaded shared (3) > Async shared (2) > Single-threaded (1)
- Testability Impact: Requires I/O mocking (3) > Requires specific setup ordering (2) > Already testable in isolation (1)
- Mutation Scope: Global/shared (3) > Cross-object (2) > Object or Local (1)

Sequence the refactoring order so that:
1. Value Objects come first — they are the smallest, safest changes and immediately improve domain modeling
2. FC/IS extractions come next — they yield the largest testability gains
3. Const migrations and defensive copies are low-risk cleanup that can happen opportunistically
4. Optics adoption comes last — only after simpler patterns are established and deep nesting is confirmed as a recurring pain point
5. Each step is independently deployable — no "big bang" refactoring

## OUTPUT FORMAT

### Summary Table

| Location | Mutability Signal | Mutation Scope | Side Effect Type | Refactoring Pattern | Priority |
|----------|-------------------|----------------|------------------|---------------------|----------|
| [file:line] | [signal] | [scope] | [Data/Calc/Action] | [pattern] | [score] |

Sort by priority (highest first). If multiple signals share the same root cause, consolidate into one finding.

### Detail per Finding

For each row in the summary table:
- **Signal**: what the mutable state symptom looks like (specific files, line ranges, variable/method names)
- **Mutation scope**: how broadly the mutation propagates and its concurrency/temporal coupling risk
- **Side effect analysis**: which lines are Actions vs Calculations; what pure logic is trapped inside impure functions
- **Recommended pattern**: the refactoring pattern with a brief sketch of how it applies — do not write full implementation code
- **Refactoring sequence**: the order of safe steps to transition
- **Success signals**: what the code will look like after — pure functions testable with static data, side effects isolated to thin shell, domain types that reject invalid state at construction

### Enforcement Recommendations

Based on the language ecosystem, recommend specific tooling to prevent regression:

| Language | Tooling | Configuration |
|----------|---------|---------------|
| JS/TS | ESLint | `functional/no-let`, `functional/immutable-data`, `ts-immutable/readonly-keyword` |
| Java | Mutability Detector | `assertImmutable(MyClass.class)` in unit tests; prefer `record` over POJO |
| C#/.NET | Roslyn analyzers | Custom analyzers for reassignment detection; `System.Collections.Immutable`; prefer `record` with `with` expressions |

For unlisted languages, recommend native immutability features: Python (`@dataclass(frozen=True)`, `Final`, `NamedTuple`), Kotlin (`data class`, `val`, `copy()`), Go (unexported fields + constructor functions), Rust (default immutable bindings, ownership model).

### Needs Human Review

List cases where the diagnosis is ambiguous:
- Local mutation that is genuinely the clearest expression of an algorithm (loop accumulators, builders)
- Performance-critical hot paths where object allocation overhead matters (tight inner loops, real-time systems)
- Framework conventions that mandate mutability (ORM entity hydration, DI container lifecycle)
- State that appears shared but is actually thread-confined by framework guarantees (request-scoped objects)
- Reactive/Observable patterns (RxJS, Project Reactor) where side effects are deferred to subscription — classify the pipeline declaration as Calculation and the `subscribe()` callback as Action

## STOP CONDITION

When all provided files have been analyzed and all mutability findings mapped to refactoring patterns, output the summary and stop. Do not modify any files.

If no mutability signals are found:

> **No pathological mutability found** in the scanned files. Functions are pure or have well-isolated side effects, domain concepts are properly encapsulated, and mutable state is appropriately scoped. No refactoring proposals generated.

Do not fabricate findings to fill the table.
````

## Example

**Context:**
A Node.js/TypeScript e-commerce service where the order processing function fetches from the database, applies discount logic, charges a payment API, and sends a confirmation email — all in a single 80-line method. Tests require a running database, a mocked payment gateway, and an intercepted SMTP server.

**Input:**
```
Target files: src/services/OrderService.ts, src/models/Order.ts, src/utils/pricing.ts
High-churn files: OrderService.ts (38 commits/quarter)
Architecture reference: none
Language: TypeScript
```

**Expected Output:**

### Summary Table

| Location | Mutability Signal | Mutation Scope | Side Effect Type | Refactoring Pattern | Priority |
|----------|-------------------|----------------|------------------|---------------------|----------|
| `OrderService.ts:15–95` | Side Effect Entanglement | Cross-object | Action (DB + API + SMTP tangled with pricing logic) | FC/IS | 12 |
| `OrderService.ts:42–55` | Void Mutation Methods | Cross-object | Action | Return-New-Instance | 6 |
| `Order.ts:8–12` | Primitive Obsession | Cross-object | Data | Value Object | 4 |
| `pricing.ts:3,7,12` | Mutable Variable Overuse | Local | Calculation | Direct const migration | 1 |

### Detail: OrderService Side Effect Entanglement

**Signal:** `processOrder()` (lines 15-95) performs five actions interleaved with business logic: `db.getOrder()` (L18), `Date.now()` (L22), discount calculation (L25-40, pure but trapped), `paymentGateway.charge()` (L55), `emailService.send()` (L78). The pure pricing logic at L25-40 cannot be tested without provisioning the entire I/O stack.

**Mutation scope:** Cross-object — `processOrder()` mutates `order.status`, `order.total`, and `order.discountApplied` in place before persisting. Other methods on `OrderService` read these fields, creating temporal coupling (they assume `processOrder` ran first).

**Side effect analysis:**
- L18: Action (DB read)
- L22: Action (system time)
- L25-40: **Calculation trapped inside Action** — discount rules, tax computation, total calculation. These 15 lines are pure functions operating on order data and a timestamp.
- L42-55: Action (mutates order object, then charges payment)
- L78: Action (sends email)

**Recommended pattern:** **Functional Core / Imperative Shell.** Extract L25-40 into a pure function `calculateOrderTotals(order: OrderData, now: Date): OrderTotals` that accepts immutable data and returns a new result object. The imperative shell becomes: read order → generate timestamp → call pure calculation → charge payment with result → persist → send email.

**Priority breakdown:** Async shared (2) × I/O mocking (3) × Cross-object (2) = 12.

**Refactoring sequence:**
1. Extract `calculateOrderTotals()` as a pure function — accepts `OrderData` + `Date`, returns `OrderTotals`
2. Write unit tests for `calculateOrderTotals()` using static data (no mocks needed)
3. Modify `processOrder()` to call the extracted function and use its return value
4. Restructure `processOrder()` as an imperative shell: read → calculate → write → notify

**Success signals:** `calculateOrderTotals()` is testable with zero mocks — just pass data and assert results. Adding new discount rules requires only editing the pure function and its unit tests. Side effects (DB, payment, email) are tested separately via integration tests of the thin shell.

### Detail: Order Primitive Obsession

**Signal:** `Order.ts` lines 8-12 declare `email: string`, `currency: string`, `amount: number`. No validation — callers pass `""`, `"not-an-email"`, negative amounts. Validation is scattered across `OrderService.ts` (L20, L35) and `pricing.ts` (L8).

**Mutation scope:** Cross-object — validation of these primitives is scattered across `OrderService.ts` (L20, L35) and `pricing.ts` (L8), creating duplicated guard logic that must change in sync.

**Recommended pattern:** **Value Object.** Create `Email` (self-validates format at construction), `Money` (amount + currency, prevents negative values, handles rounding). Construction with invalid data throws — an `Email` object cannot exist in an invalid state.

### Enforcement Recommendations

| Language | Tooling | Configuration |
|----------|---------|---------------|
| TypeScript | ESLint | `functional/no-let`, `functional/immutable-data`, `ts-immutable/readonly-keyword` |

### Needs Human Review

- **`pricing.ts` mutable variables (L3, L7, L12):** Three `let` declarations used as loop accumulators in a reduce-like pattern. Converting to `reduce()` would be idiomatic but may be less readable for this team. Verify team preference.
- **`OrderService.ts` order mutation (L42-55):** The in-place mutation of `order.status` and `order.total` may be required by the ORM's change tracking. If the ORM expects entity mutation for persistence, the Return-New-Instance pattern requires an adapter layer. Verify ORM conventions before applying.

## Expected Results

- A prioritized backlog of mutability findings mapped to specific refactoring patterns
- Each finding traces the chain: signal → mutation scope → side effect type → pattern → refactoring sequence
- Code-free: no files are modified
- Side effect boundary maps showing which lines are pure calculations trapped inside impure functions
- Enforcement tooling recommendations to prevent regression
- Flagged ambiguous cases where mutation may be justified (performance, framework conventions)

## Variations

**For concurrency-focused analysis:**
```
Focus on shared mutable state accessed from multiple threads or async contexts.
Prioritize check-then-act races and temporal coupling. De-prioritize local
mutation and primitive obsession.
```

**For testability-focused analysis:**
```
Focus on functions that require I/O mocking to test. For each, map the
Action/Calculation boundary and propose the FC/IS extraction that eliminates
the mock dependency. De-prioritize concurrency concerns.
```

**With git churn data:**
```
High-churn files (last 90 days):
[PASTE output of: git log --since="90 days ago" --name-only --pretty=format: | sort | uniq -c | sort -rn | head -20]
Cross-reference mutation scope with change frequency to prioritize.
```

**For a specific domain layer only:**
```
Focus only on the service/business logic layer. Ignore controllers (expected
to be imperative shells) and data access (expected to be Actions).
```

## Notes

The key insight is that mutability itself is not the problem — *shared* mutability with *entangled side effects* is the problem. Local mutation within a pure function (a loop accumulator, a StringBuilder) is fine. The diagnostic targets mutation that crosses boundaries: between methods, between objects, between threads, and between I/O and business logic.

The Action/Calculation/Data classification from Step 3 is the most powerful analytical tool. Most legacy codebases have Calculations trapped inside Actions — business logic that *could* be pure but is tangled with I/O because it was written imperatively. Extracting these Calculations is the highest-ROI refactoring: each extraction produces a function testable with zero mocks.

The priority formula is multiplicative: a signal must score high on concurrency risk, testability impact, *and* mutation scope to reach the top. This prevents wasting effort on local `let` variables (low scope) or pure functions that happen to use mutable accumulators (low testability impact).

## References

- [research-paper-immutability-anti-patterns-refactoring.md] — the research synthesis this prompt operationalizes
- [prompt-task-rigidity-diagnostician.md] — complementary: diagnoses structural rigidity from coupling and OCP violations
- [prompt-task-abstraction-miner.md] — complementary: finds semantic duplication (a different manifestation of structural debt)
- [prompt-workflow-resonant-refactor.md] — next step: execute the remediation proposals this skill produces

### Source Research

- Eric Normand: *Grokking Simplicity* — Action/Calculation/Data classification
- Gary Bernhardt: "Functional Core, Imperative Shell" — architectural separation of pure logic from side effects
- Mark Seemann: "Impureim Sandwich" — Impure/Pure/Impure handler pattern
- Joshua Bloch: *Effective Java* Item 17 — "Minimize Mutability"
- Martin Fowler: "Value Object" — domain modeling with immutable types
- Nicolò Pignatelli: "Value Objects Like a Pro" — self-validating, equality-by-value encapsulation

## Version History

- 1.1.0 (2026-03-20): RO5U review fixes — fixed example priority scores for Node.js runtime (async not multi-threaded), aligned Step 2 scope taxonomy with Step 5 formula, renamed Gilded Rose to Return-New-Instance for clarity, added greenfield exclusion, added enforcement guidance for unlisted languages (Python, Kotlin, Go, Rust), added reactive/observable patterns to Needs Human Review, added Python const-migration fallback, added Enforcement Recommendations to example output
- 1.0.0 (2026-03-20): Initial extraction from research-paper-immutability-anti-patterns-refactoring.md
