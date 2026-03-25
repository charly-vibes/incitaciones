---
title: Invalid States Diagnostician
type: prompt
tags: [refactoring, type-systems, domain-modeling, algebraic-data-types, code-review, state-machines, parse-dont-validate, typestate, value-objects, primitive-obsession, boolean-blindness]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-03-25
updated: 2026-03-25
version: 1.1.0
related: [research-paper-invalid-states-type-integrity-review.md, prompt-task-mutability-diagnostician.md, prompt-task-composability-diagnostician.md, prompt-task-rigidity-diagnostician.md]
source: research-paper-invalid-states-type-integrity-review.md
---

# Invalid States Diagnostician

## When to Use

Use when a codebase permits invalid business states at the type level — when functions accept `string` for emails or `number` for prices, when boolean flag combinations produce nonsensical states, when validation is scattered across business logic instead of enforced at boundaries, or when lifecycle transitions are governed by string comparisons instead of the type system.

**Best for:**
- Codebases where runtime validation errors reveal states that should have been structurally impossible
- Before refactoring domain models — produces a prioritized backlog of type-system tightening work
- When boolean flag clusters (`isActive`, `isDeleted`, `isPending`) govern lifecycle logic
- When external API data flows into business logic without boundary parsing
- Architecture reviews of systems where domain types mirror database schemas or DTOs instead of business rules
- When switch/match statements use catch-all defaults instead of exhaustive handling

**Do NOT use when:**
- The codebase is a greenfield project with few domain types — state integrity problems require accumulated modeling debt
- The problem is mutable state and side effect entanglement (use `prompt-task-mutability-diagnostician.md` for that)
- The problem is structural coupling and inheritance rigidity (use `prompt-task-rigidity-diagnostician.md` for that)
- The problem is semantic duplication (use `prompt-task-abstraction-miner.md` for that)
- The problem is composition friction and type flow (use `prompt-task-composability-diagnostician.md` for that)
- The language lacks static type checking and no gradual typing tool is in use (plain JavaScript without TypeScript, Python without mypy/pyright, Lua) — enforcement relies on types
- Performance optimization is the goal — this diagnoses representational problems, not algorithmic ones

**Prerequisites:**
- Source files exhibiting domain modeling pain (modules where invalid states cause bugs or where validation is duplicated)
- (Optional) Recent git log showing high-churn files — prioritizes analysis toward volatile modules
- (Optional) Architecture reference (AGENTS.md, design docs) for domain context

## The Prompt

````
# AGENT SKILL: INVALID_STATES_DIAGNOSTICIAN

## ROLE

You are a Type Integrity Analyst operating the Invalid States Diagnostic protocol. Your goal is to identify locations where the type system permits business-invalid states — primitive obsession, boolean blindness, implicit coupling, shotgun parsing, ad-hoc state machines, and exhaustiveness gaps — and map each finding to a specific type-tightening refactoring pattern.

Do NOT write any code to the codebase during this session. This is an advisory-only diagnostic.

## INPUT

- Target files or directory: [SPECIFY FILES OR DIRECTORY]
- High-churn files (optional): [PASTE git log output OR "none"]
- Architecture reference (optional): [PASTE AGENTS.md RULES OR "none"]
- Language/framework (optional): [e.g., "TypeScript/React", "Rust", "C#/.NET" — or "infer from code"]

## PROTOCOL (Five-Step Pipeline)

### Step 1 — Detect State Integrity Signals

Read all provided files. Identify locations where the type system permits invalid business states:

| Signal | Severity | What to Look For |
|--------|----------|------------------|
| Shotgun Parsing | Critical | Validation logic (format checks, range checks, null guards) scattered across business logic layers instead of enforced at the system boundary; the same validation repeated in multiple locations |
| Ad-hoc State Machine | Critical | Entity lifecycle managed via string comparisons, boolean flag combinations, or enum checks without structural enforcement — functions can be called in states where they are semantically invalid (e.g., `publish()` on a deleted entity) |
| Primitive Obsession | High | Domain concepts (email, money, URL, coordinates, identifiers) represented as raw strings, numbers, or booleans without validation or encapsulation; implicit constraints (regex, max length, numeric range) enforced only at usage sites |
| Boolean Blindness | High | Bare boolean parameters or return values whose meaning is invisible at the call site; clusters of boolean flags (`isActive`, `isPublished`, `isDeleted`) whose combinations produce invalid states; boolean checks structurally disconnected from the data they guard |
| Implicit Coupling | High | Fields that must change together to maintain a valid state but exist as independent members in a broader record — updating one without the other silently corrupts domain integrity |
| Exhaustiveness Gap | High | Switch/match statements with catch-all default/else branches on types that should be exhaustively handled; new enum variants or union members that slip through unhandled; missing `never`/`assert_never` guards |
| Unconstrained Optionality | High | Implicit nullability — fields or parameters that may be null/undefined without the type system enforcing a null check; `Option`/`Maybe` unwrapped with `!`, `.get()`, or `.withDefault` deep in business logic instead of parsed at the boundary |
| Monolithic Record | Medium | Large records or classes grouping unrelated fields that are frequently updated independently — changes to one field risk unintended interaction with others; domain transactions forced to lock or instantiate more data than needed |

For each signal found, note the file, line range, and a brief description.

### Step 2 — Classify State Space Gap

For each signal, assess how broadly the type-system gap affects the application:

| Scope | Definition | Risk Level |
|-------|------------|------------|
| **Type-Local** | A single type has a broader representation than its business meaning requires (e.g., `string` for an email) | Medium — contained but multiplied across usage sites |
| **Cross-Type** | Multiple types share implicit coupling or duplicate validation for the same domain concept | High — inconsistency risk across modules |
| **Boundary** | External data (API, database, user input) enters the application without being parsed into strict domain types | High — every downstream function inherits the uncertainty |
| **System-Wide** | Internal domain types are directly exposed as API contracts or database schemas, leaking representation details to consumers | Critical — changes require coordinated deployment across services |

For each signal, also assess:
- **Invalid state count**: How many representable states are business-invalid? (e.g., 3 booleans = 8 states, but only 3 are valid — 5 invalid states)
- **Failure mode**: What happens when an invalid state occurs? (silent corruption, runtime exception, data loss, security vulnerability)
- **Validation scattering**: How many locations currently guard against this invalid state at runtime?

### Step 3 — Analyze State Space

For each finding, map the gap between representable states (S_repr) and valid business states (S_valid):

**For finite state spaces** (boolean clusters, enum combinations, small product types):
- **Enumerate S_repr**: List all states the current type permits. For boolean clusters, enumerate all flag combinations. For product types, compute the Cartesian product.
- **Enumerate S_valid**: List all states the business domain considers legal. Consult domain logic, validation code, and business rules.
- **Identify S_invalid**: S_repr minus S_valid — the states that are representable but have no valid business meaning. These are the states that must be made unrepresentable.

**For unbounded state spaces** (string for email, number for price):
- **Characterize S_valid**: Describe the valid subset (e.g., "RFC 5322 email format", "non-negative decimal with 2-digit precision in ISO 4217 currency"). Do not attempt to enumerate the infinite invalid space.
- **Count compensating guards**: For each unbounded type, trace where runtime checks currently constrain it. Count the number of guard locations — this is the primary severity metric for unbounded gaps.

**For all findings:**
- **Locate compensating validation**: For each state in S_invalid (or each guard for unbounded types), trace where runtime checks currently prevent invalid states. Count the number of guard locations.

Focus the full enumeration on the top 5-10 findings by severity.

### Step 4 — Map to Refactoring Pattern

For each finding, recommend the type-tightening refactoring pattern:

| State Integrity Symptom | Refactoring Pattern | Mechanism |
|-------------------------|---------------------|-----------|
| Domain concepts as raw primitives | **Value Object (Tiny Type)** | Wrap primitive in a self-validating, immutable type that enforces all invariants upon construction. `EmailAddress` cannot be instantiated with invalid data — the compiler and constructor conspire to guarantee validity. |
| Bare booleans for domain states | **Semantic Enum / Discriminated Union** | Replace boolean parameters and flag clusters with intention-revealing sum types. `Permission.ReadOnly / Permission.ReadWrite` instead of `(bool canRead, bool canWrite)`. |
| Coupled fields existing independently | **Atomic Record** | Group fields that must change together into a single type. `PostalAddress` instead of separate `city`, `state`, `zip` fields. The grouped type is updated as a transactional unit. |
| Unrelated fields over-grouped | **Context-Specific Decomposition** | Split monolithic records into bounded types aligned with usage contexts. `BillingInfo` and `ShippingInfo` instead of one `UserProfile` with 30 fields. |
| Validation scattered across layers | **Parse at the Boundary** | Apply "Parse, Don't Validate" — transform untyped external data into strict domain types at the system edge. Downstream functions accept only parsed types, eliminating redundant checks. |
| Lifecycle managed by flags/strings | **Typestate Pattern** | Represent each business state as a distinct type. `DraftOrder` and `ConfirmedOrder` are different types — calling `ship()` on a `DraftOrder` is a compiler error, not a runtime check. |
| Missing exhaustive handling | **Exhaustiveness Enforcement** | Remove default/else branches from switch/match on domain types; add `never`/`assert_never` guards. In Java, omit `default` on sealed interface switches. In TypeScript, assign default to `never`. |
| Implicit nullability | **Explicit Optionality with Boundary Parsing** | Use `Option`/`Maybe`/strict null checks. Unwrap at the boundary — once inside the domain, non-optional types carry the guarantee. |

Language-specific native equivalents:
- Value Object: `record` (C#/Java), `data class` (Kotlin), newtype pattern (Haskell/Rust), branded types (TypeScript)
- Discriminated Union: `enum` with data (Rust/Swift), discriminated union (F#/TypeScript), `sealed interface` (Java/Kotlin)
- Typestate: `PhantomData` generics (Rust), sealed class hierarchies (Kotlin/Java), discriminated union (TypeScript — simple) or branded types (TypeScript — advanced)
- Exhaustiveness: `never` default (TypeScript), `assert_never()` (Python), `#[deny(unreachable_patterns)]` (Rust), omit `default` on sealed switches (Java)
- Boundary Parsing: Zod/io-ts (TypeScript), Pydantic/cattrs (Python), serde (Rust), `System.Text.Json` source generators (C#)

### Step 5 — Prioritize and Sequence

Order findings by refactoring priority using this formula:

**Priority = State Space Gap x Failure Severity x Validation Scattering**

Where:
- State Space Gap: System-wide (3) > Boundary or Cross-type (2) > Type-local (1)
- Failure Severity: Silent corruption or security vulnerability (3) > Runtime exception (2) > Cosmetic or logged warning (1)
- Validation Scattering: 3+ guard locations (3) > 2 guard locations (2) > Single guard or none (1)

Sequence the refactoring order so that:
1. **Value Objects** come first — smallest, safest changes; immediately tighten the domain vocabulary and collapse scattered validation
2. **Boundary parsing** comes next — prevents new invalid data from entering; pairs with Value Objects for maximum effect
3. **Semantic enums and exhaustiveness enforcement** follow — eliminate boolean blindness and ensure all states are explicitly handled
4. **Atomic records and decompositions** address structural grouping — moderate scope, moderate risk
5. **Typestate refactoring** comes last — highest architectural impact, requires the most coordination
6. Each step is independently deployable — no "big bang" refactoring

## OUTPUT FORMAT

### Summary Table

| Location | State Integrity Signal | State Space Gap | S_invalid Count | Refactoring Pattern | Priority |
|----------|----------------------|-----------------|-----------------|---------------------|----------|
| [file:line] | [signal] | [scope] | [count or estimate] | [pattern] | [score] |

Sort by priority (highest first). If multiple signals share the same root cause, consolidate into one finding.

### Detail per Finding

For each row in the summary table:
- **Signal**: what the state integrity symptom looks like (specific files, line ranges, type/field names)
- **State space gap**: S_repr vs S_valid — which representable states are business-invalid and how many guard locations compensate
- **Recommended pattern**: the refactoring pattern with a brief sketch of how it applies — do not write full implementation code
- **Refactoring sequence**: the order of safe steps to transition
- **Success signals**: what the code will look like after — domain types that reject invalid state at construction, switch statements that break at compile time when new variants are added, boundary parsers that transform chaos into axioms

### Enforcement Recommendations

Based on the language ecosystem, recommend specific tooling to prevent regression:

| Language | Tooling | Configuration |
|----------|---------|---------------|
| TypeScript | Compiler + ESLint | `strictNullChecks: true`, `noUncheckedIndexedAccess: true`; Zod or io-ts at boundaries; `never` default in switches |
| Rust | Clippy | `#![deny(clippy::all)]`, `#![warn(clippy::pedantic)]`; exhaustive `match` (no wildcard on domain enums) |
| Java | ArchUnit + compiler | Sealed interfaces with no `default` in switches; ArchUnit rules for domain encapsulation and constructor validation |
| C# / .NET | NetArchTest + Roslyn | Custom rules for no parameterless constructors on entities, no public setters on domain types; `record` with `init` |
| Python | mypy/pyright + runtime | `mypy --strict` or `pyright strict` in CI; `assert_never()` in match defaults; Pydantic at boundaries |

For unlisted languages: Kotlin (`sealed class`, `when` exhaustiveness), Swift (`enum` with associated values, exhaustive `switch`), F# (discriminated unions, exhaustive pattern matching), Go (unexported fields + constructor functions, sum type via sealed interface pattern).

For partially migrated JS/TS codebases: prioritize findings in `.ts` files where enforcement is possible. Flag `.js` files as candidates for TypeScript migration rather than type-tightening.

### Needs Human Review

List cases where the diagnosis is ambiguous:
- Domain concepts that are genuinely unconstrained strings (free-text comments, user notes) — not every string is primitive obsession
- Boolean flags required by framework conventions (serialization, ORM mapping, API compatibility layers)
- Boundary schemas (gRPC, REST, database) where strict typing conflicts with backwards compatibility or independent deployment — enforce internally via "Parse, Don't Validate", keep external schemas permissive
- State machines in high-variance domains (user-facing CMS, SaaS workflows) where bidirectional transitions are a business requirement, not a modeling failure
- Unsigned vs signed integer choices — unsigned integers for arithmetic types can cause underflow to dangerous positive values; flag but do not prescribe without understanding the domain's failure mode
- Performance-critical hot paths where Value Object allocation overhead matters (tight inner loops, real-time systems)

## STOP CONDITION

When all provided files have been analyzed and all state integrity findings mapped to refactoring patterns, output the summary and stop. Do not modify any files.

If no state integrity signals are found:

> **No representable invalid states found** in the scanned files. Domain types accurately constrain their business meaning, boundaries parse external data into strict types, and state transitions are structurally enforced. No refactoring proposals generated.

Do not fabricate findings to fill the table.
````

## Example

**Context:**
A TypeScript/Express e-commerce API where the `Order` entity uses string fields for email and currency, boolean flags for lifecycle state, and validation checks scattered across controllers, services, and repository layers. A recent production incident allowed an order in "cancelled" status to be shipped because the shipping service only checked `isActive` and not `isCancelled`.

**Input:**
```
Target files: src/models/Order.ts, src/services/OrderService.ts, src/controllers/OrderController.ts, src/services/ShippingService.ts
High-churn files: OrderService.ts (42 commits/quarter), Order.ts (28 commits/quarter)
Architecture reference: none
Language: TypeScript
```

**Expected Output:**

### Summary Table

| Location | State Integrity Signal | State Space Gap | S_invalid Count | Refactoring Pattern | Priority |
|----------|----------------------|-----------------|-----------------|---------------------|----------|
| `Order.ts:12-14`, `OrderService.ts:30-85`, `ShippingService.ts:12` | Ad-hoc State Machine + Boolean Blindness | Cross-type | 5 of 8 flag combinations invalid | Typestate Pattern | 18 |
| `OrderController.ts:15-40`, `OrderService.ts:22-28`, `ShippingService.ts:8-11` | Shotgun Parsing | Boundary | N/A — untyped input propagates | Parse at the Boundary | 18 |
| `Order.ts:8-10` | Primitive Obsession | Cross-type | unbounded (any string accepted) | Value Object | 12 |
| `OrderService.ts:90-120` | Exhaustiveness Gap | Cross-type | 1 unhandled state | Exhaustiveness Enforcement | 4 |

Note: The boolean flags on `Order.ts:12-14` emit both Ad-hoc State Machine and Boolean Blindness signals from the same root cause. They are consolidated into one finding because the Typestate refactoring resolves both — replacing the flag cluster with a discriminated union eliminates the boolean blindness (no more bare bools) and the ad-hoc state machine (transitions are structurally enforced) simultaneously.

### Detail: Order Ad-hoc State Machine + Boolean Blindness

**Signal:** `Order.ts` lines 12-14 declare `isActive: boolean`, `isPending: boolean`, `isCancelled: boolean`. These three flags govern the order lifecycle but have no structural enforcement. `ShippingService.ts:12` checks only `isActive` before shipping — it does not check `isCancelled`, which caused the production incident. The flags also exhibit boolean blindness: the semantic overlap between `isActive` and `isPending` is ambiguous (is a pending order "active"?), and bare booleans at call sites like `setStatus(true, false, false)` are unreadable.

**State space gap:** Three booleans produce 2^3 = 8 representable states. Only 3 are valid business states: Pending (`false, true, false`), Active (`true, false, false`), Cancelled (`false, false, true`). The remaining 5 states — including `isActive: true, isCancelled: true` — are representable but nonsensical. Runtime guards at `OrderService.ts:30`, `OrderService.ts:55`, `OrderService.ts:72`, and `ShippingService.ts:12` attempt to prevent invalid transitions, but the `ShippingService` guard is incomplete.

**Priority breakdown:** Cross-type (2) x Silent corruption (3) x 3+ guards (3) = 18.

**Recommended pattern:** **Typestate Pattern.** Replace the three boolean flags with a discriminated union:

```
type OrderState =
  | { status: "pending"; /* pending-specific fields */ }
  | { status: "active"; activatedAt: Date }
  | { status: "cancelled"; cancelledAt: Date; reason: string };
```

Functions that operate only on active orders accept `Order & { state: { status: "active" } }` — calling `ship()` on a cancelled order becomes a compiler error. The `ShippingService` guard becomes unnecessary because the type signature prevents it.

**Refactoring sequence:**
1. Define `OrderState` discriminated union with the three valid variants
2. Replace boolean fields on `Order` with `state: OrderState`
3. Update `OrderService` methods to narrow on `state.status` — remove scattered boolean checks
4. Update `ShippingService` to accept only active orders in its type signature
5. Add `never` default to all switch statements on `OrderState`

**Success signals:** Invalid flag combinations are unrepresentable. Adding a new state (e.g., "refunded") forces a compiler error at every switch statement that doesn't handle it. The `ShippingService` incident class is eliminated — the compiler catches it, not QA.

### Detail: Order Primitive Obsession

**Signal:** `Order.ts` lines 8-10 declare `email: string`, `currency: string`, `amount: number`. No constraints — the system accepts empty strings, negative amounts, and `"FAKE_CURRENCY"`. Validation for email format exists at `OrderController.ts:18` and `OrderService.ts:24` (duplicated, slightly different regex).

**State space gap:** `string` has effectively infinite representable values; only a small subset are valid emails or ISO 4217 currency codes. `number` permits negatives, `NaN`, and `Infinity` — none valid for monetary amounts. Two separate regex validations for email format are already diverging.

**Recommended pattern:** **Value Object.** Create `EmailAddress` (validates format at construction, single regex), `Currency` (validates against ISO 4217 list), `Money` (non-negative amount paired with currency, handles rounding). Construction with invalid data throws — a `Money` instance cannot exist with a negative amount.

**Refactoring sequence:**
1. Create `EmailAddress`, `Currency`, and `Money` value types with validation in constructors
2. Replace `Order.email: string` with `Order.email: EmailAddress`, etc.
3. Remove duplicated validation from `OrderController` and `OrderService` — the Value Objects enforce it
4. Parse raw input into Value Objects at the controller boundary (pair with Zod schema)

### Detail: Shotgun Parsing at API Boundary

**Signal:** `OrderController.ts` lines 15-40 receive raw JSON from the Express request body and pass it directly to `OrderService` methods. `OrderService.ts:22-28` re-validates email format (different regex than the controller). `ShippingService.ts:8-11` checks for required fields that should have been guaranteed at the boundary. Three separate locations guard against the same class of invalid input.

**State space gap:** The request body is typed as `any` or a loose interface — every downstream function inherits the uncertainty. The `email` field could be `undefined`, an empty string, or a number. Each service re-checks because no upstream parser guarantees the shape.

**Recommended pattern:** **Parse at the Boundary.** Define a Zod schema (`OrderRequestSchema`) at the controller layer that validates and transforms the raw request into a strict `OrderRequest` type. The schema uses the `EmailAddress` and `Money` Value Objects from the primitive obsession fix — parsing and domain typing happen in one step.

**Refactoring sequence:**
1. Define `OrderRequestSchema` using Zod, composing `EmailAddress`, `Currency`, and `Money` validations
2. Parse `req.body` through the schema at the top of the controller — invalid requests return 400 immediately
3. Change `OrderService` method signatures to accept the parsed `OrderRequest` type, not raw objects
4. Remove redundant validation from `OrderService` and `ShippingService` — the parsed type carries the guarantee

**Priority breakdown:** Boundary (2) x Silent corruption (3) x 3+ guards (3) = 18.

**Success signals:** Validation exists in exactly one location (the boundary schema). `OrderService` and `ShippingService` accept only parsed types — they cannot receive unvalidated data. Adding a new required field to the schema fails the build if the controller doesn't parse it.

### Enforcement Recommendations

| Language | Tooling | Configuration |
|----------|---------|---------------|
| TypeScript | Compiler + Zod | `strictNullChecks: true`, `noUncheckedIndexedAccess: true`; Zod schemas at API boundary; `never` default in all `switch` on union types |

### Needs Human Review

- **`Order.ts` boolean flags:** The typestate refactoring assumes three valid lifecycle states. Verify with product/domain experts whether additional states exist (e.g., "on hold", "partially shipped") before defining the union — adding states later is safe (compiler forces handling) but changing the variant structure requires more coordination.
- **`OrderController.ts` boundary parsing:** If the API has external consumers, changing the request schema to require validated types may break backwards compatibility. Consider keeping the external API schema permissive and parsing internally.

## Expected Results

- A prioritized backlog of state integrity findings mapped to specific type-tightening patterns
- Each finding traces the chain: signal -> state space gap (S_repr vs S_valid) -> refactoring pattern -> sequence
- Code-free: no files are modified
- State space maps showing which representable states are business-invalid and where runtime guards compensate
- Enforcement tooling recommendations to prevent regression
- Flagged ambiguous cases where broader types may be intentional (framework requirements, boundary compatibility, high-variance domains)

## Variations

**For boundary-focused analysis:**
```
Focus on system boundaries — API controllers, message consumers, database read
layers. For each boundary, identify where external data enters without being
parsed into domain types. De-prioritize internal type modeling.
```

**For state machine audit:**
```
Focus on entity lifecycle management. Identify all entities with lifecycle
states managed via boolean flags, string enums, or status fields. For each,
enumerate the valid transitions and identify which invalid transitions the
type system fails to prevent.
```

**For exhaustiveness audit:**
```
Focus on switch/match statements across the codebase. Identify all statements
on domain types (enums, unions, sealed classes) that use catch-all defaults.
For each, assess whether the default masks unhandled variants.
```

**With git churn data:**
```
High-churn files (last 90 days):
[PASTE output of: git log --since="90 days ago" --name-only --pretty=format: | sort | uniq -c | sort -rn | head -20]
Cross-reference state integrity signals with change frequency to prioritize.
```

## Notes

The key insight is that the type system is a proof engine — every type is a proposition, every value is a proof (the Curry-Howard correspondence). When `email: string`, the type system proves only that the value is a string, not that it's a valid email. The diagnostic targets the gap between what the type system proves and what the business requires to be true.

The "Parse, Don't Validate" principle (Alexis King) is the most powerful single heuristic: parse untrusted data into strict domain types at the boundary, then downstream functions can rely on the type as an axiom rather than defensively re-checking. Each boundary parser eliminates an entire class of scattered validation.

The anti-pattern summary table from the research (Primitive Obsession, Boolean Blindness, Implicit Coupling, Monolithic Records, Shotgun Parsing, Ad-hoc State Machines) provides the diagnostic vocabulary. The state space analysis (S_repr vs S_valid) provides the mathematical framework for measuring how severe each gap is.

Trade-off awareness is critical: strict typestate enforcement in high-variance domains (CMS, SaaS) creates brittleness. External boundary schemas (gRPC, REST) should remain permissive for independent deployment. Unsigned integers for arithmetic values can cause underflow to dangerous states. The diagnostic flags these nuances in Needs Human Review rather than prescribing dogmatically.

## References

- [research-paper-invalid-states-type-integrity-review.md] — the research synthesis this prompt operationalizes
- [prompt-task-mutability-diagnostician.md] — complementary: diagnoses mutable state pathology (a different axis of state problems)
- [prompt-task-composability-diagnostician.md] — complementary: diagnoses composition friction and type flow issues
- [prompt-workflow-resonant-refactor.md] — next step: execute the remediation proposals this skill produces

### Source Research

- Yaron Minsky: "Make illegal states unrepresentable" — the foundational principle (coined at Jane Street)
- Scott Wlaschin: *Domain Modeling Made Functional* / "Designing with types" — ADT-based domain modeling in F#
- Alexis King: "Parse, Don't Validate" — epistemological boundary enforcement
- Robert Harper: "Boolean blindness" — loss of semantic context in boolean-typed branches
- TigerBeetle: "TigerStyle" — assertion density and positive/negative space checking for invariants beyond types
- Sean Goedecke: "'Make invalid states unrepresentable' considered harmful" — trade-offs and intentional relaxations

## Version History

- 1.1.0 (2026-03-25): RO5U review fixes — fixed example priority score (Cross-type not System-wide), consolidated Boolean Blindness into Ad-hoc State Machine finding, added Shotgun Parsing detail section, clarified Step 3 for finite vs unbounded state spaces, added discriminated union as primary TypeScript typestate mechanism, added mixed JS/TS migration guidance, expanded guard for Python without mypy, added Curry-Howard attribution, added rigidity-diagnostician to related
- 1.0.0 (2026-03-25): Initial extraction from research-paper-invalid-states-type-integrity-review.md
