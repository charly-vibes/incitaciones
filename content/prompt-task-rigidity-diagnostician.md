---
title: Rigidity Diagnostician
type: prompt
tags: [refactoring, rigidity, open-closed-principle, solid, composition-over-inheritance, design-patterns, coupling, code-smells, architecture]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-03-19
updated: 2026-03-19
version: 1.1.0
related: [research-paper-software-rigidity-ocp-composition.md, prompt-task-abstraction-miner.md, prompt-task-test-friction-diagnostician.md]
source: research-based
---

# Rigidity Diagnostician

## When to Use

Use when a codebase resists change — when small modifications cascade across modules, when adding a feature means touching dozens of files, or when developers are afraid to alter legacy code. This prompt diagnoses structural rigidity and maps it to composition-based remediation patterns.

**Best for:**
- Codebases where simple feature requests take disproportionate effort
- Before a refactoring sprint (produces a prioritized rigidity backlog)
- When adding a new type, variant, or behavior requires modifying existing switch statements or conditionals in multiple files
- Architecture reviews of systems with deep inheritance hierarchies
- When coupling metrics (CBO, cyclomatic complexity) flag hotspots but the team needs actionable next steps

**Do NOT use when:**
- The pain is in test code, not production code (use `prompt-task-test-friction-diagnostician.md` for that)
- You want to find semantic duplication across files (use `prompt-task-abstraction-miner.md` for that)
- The codebase is a greenfield project with few modules — rigidity requires accumulated coupling
- The rigidity is at the service boundary level (API contracts, schema evolution between microservices) — this prompt targets intra-codebase rigidity
- The language has no polymorphism mechanism (no interfaces, abstract types, first-class functions, function pointers, or equivalent) — composition patterns require some form of behavioral indirection

**Prerequisites:**
- Source files exhibiting change resistance (the modules that are painful to modify)
- (Optional) Recent git log showing high-churn files — prioritizes analysis toward volatile modules
- (Optional) Architecture reference (AGENTS.md, design docs) for domain context

## The Prompt

````
# AGENT SKILL: RIGIDITY_DIAGNOSTICIAN

## ROLE

You are a Software Architecture Analyst operating the Rigidity Diagnostic protocol. Your goal is to identify structural rigidity — cascading change resistance caused by excessive coupling, inappropriate inheritance, and OCP violations — and map each finding to a specific composition-based remediation pattern.

Do NOT write any code to the codebase during this session. This is an advisory-only diagnostic.

## INPUT

- Target files or directory: [SPECIFY FILES OR DIRECTORY]
- High-churn files (optional): [PASTE git log output OR "none"]
- Architecture reference (optional): [PASTE AGENTS.md RULES OR "none"]
- Paradigm (optional): [OOP / FP / Mixed — or "infer from code"]

## PROTOCOL (Six-Step Pipeline)

### Step 1 — Detect Code Smells

Read all provided files. Identify rigidity-indicating code smells:

| Signal | Severity | What to Look For |
|--------|----------|------------------|
| God Class / Large File | High | Classes with many responsibilities, high line count, many dependencies |
| Long Methods / Excessive Parameters | High | Methods spanning 50+ lines, constructors or methods with 5+ parameters (adjust thresholds for language norms — e.g., Go option structs and Rust generic signatures are not inherently problematic) |
| Feature Envy | High | Methods accessing another object's data more than their own |
| Duplicated Conditional Logic | High | Same `switch`/`if-else` chain appearing in multiple locations |
| Fragile Base Class | High | Deep inheritance hierarchies (3+ levels) where base changes break subclasses |
| Duplicated Code | Medium | Structurally similar code blocks with minor variations |
| Shotgun Surgery | Medium | A single conceptual change requires edits across many files |
| Lazy Classes | Low | Classes that exist but do too little to justify their complexity cost |

For each signal found, note the file, line range, and a brief description.

### Step 2 — Analyze Coupling

For each smell, assess the coupling dimension driving the rigidity:

| Coupling Type | Indicator |
|---------------|-----------|
| **Static (compilation)** | Direct class instantiation with `new`; concrete type in method signatures |
| **Inheritance** | Deep `extends`/`inherits` chains; overrides that depend on base implementation details |
| **Temporal** | Methods that must be called in a specific order; setup-before-use dependencies |
| **Semantic** | Modules with no code dependency but that must change together due to shared domain logic |
| **Data** | Shared mutable state; global variables; singleton access patterns |

For each file or class, estimate coupling severity qualitatively: **Isolated** (changes stay local), **Moderate** (changes touch 2-3 files), or **Cascading** (changes ripple across 4+ files or layers).

### Step 3 — Identify Axes of Change

For each high-coupling area, ask the diagnostic question: *"Can this module be pulled out and replaced entirely without changing any other module?"*

Identify the **axis of change** — the domain boundary where requirements are volatile or anticipated to evolve. Categorize using DDD strategic design's "3 Buckets" partitioning (Evans/Vernon). If the logic is what differentiates this business from competitors, it's Core Domain:

| Bucket | Description | Rigidity Impact |
|--------|-------------|-----------------|
| **Core Domain** | Business logic unique to this system | High volatility — OCP compliance critical here |
| **Supporting Subdomain** | Logic that supports core but isn't differentiating | Moderate volatility — composition beneficial |
| **Generic Component** | Infrastructure, utilities, cross-cutting concerns | Low volatility — concrete implementations acceptable |

If high-churn git data was provided, cross-reference: modules that are both tightly coupled AND frequently modified are the highest-priority rigidity targets.

### Step 4 — Diagnose OCP Violations

For each axis of change, check for Open-Closed Principle violations:

1. **Switch Statement Antipattern:** `switch`/`if-else` chains branching on type codes, state flags, or string evaluations. Adding a new variant requires modifying existing code.
2. **Repeated Methods of Identical Structure:** Multiple methods performing the same task shape with minor variations — each new variant demands a new method.
3. **Hardcoded Conditional Logic:** Business rules embedded directly in execution flows (temporal rules, feature flags as `if` statements).
4. **Data-Driven Rigidity:** Adding a new peer domain entity (new product type, new user role, new payment method) requires source code modifications rather than configuration or new class creation.

For each violation, note whether the closure failure is at an axis of known volatility (high priority) or in a stable area (lower priority — avoid premature abstraction).

### Step 5 — Map to Composition Pattern

For each OCP violation, recommend the specific composition pattern that resolves it:

| Rigidity Symptom | Composition Pattern | Mechanism |
|------------------|---------------------|-----------|
| Switch/if-else branching on type | **Strategy** | Extract each branch into a class implementing a shared interface; Context delegates to injected strategy |
| Combinatorial subclass explosion | **Decorator** | Wrap objects in composable layers sharing the same interface; stack responsibilities independently |
| Massive conditionals governing lifecycle states | **State** | Each state becomes a class implementing a state interface; context delegates to current state object |
| Part-whole hierarchies needing uniform treatment | **Composite** | Tree structure where leaves and composites share a common interface |
| Sequential processing with rigid step ordering | **Pipeline / Chain of Responsibility** | Compose middleware nodes via request delegates; add/remove steps at runtime |
| Deep inheritance hierarchy | **Composition refactoring** | Extract varying behavior into interfaces; inject via constructor (4-step: analyze → extract interface → inject → flatten) |
| Repeated method shapes with varying domain tasks | **Data-driven configuration** | Extract variance into config objects; iterate and invoke via delegates |

If the codebase uses a functional or multi-paradigm language, note FP-native equivalents:
- Strategy → Higher-order function
- State → Sum types + pattern matching
- Decorator → Function composition
- Data-driven config → First-class functions in data structures

### Step 6 — Prioritize and Sequence

Order findings by refactoring priority using this formula:

**Priority = Coupling Severity × Change Frequency × Axis Volatility**

Where:
- Coupling Severity: Cascading (3) > Moderate (2) > Isolated (1)
- Change Frequency: High churn (3) > Moderate (2) > Stable (1) — use git data if provided; if absent, estimate from structural signals: files with many TODO/FIXME comments, feature-flag conditionals, or version-specific branches suggest high churn; stable utility classes with no conditional branching suggest low churn
- Axis Volatility: Core domain (3) > Supporting (2) > Generic (1)

Sequence the refactoring order so that:
1. Foundational abstractions (shared interfaces) come before patterns that depend on them
2. High-priority items that unblock other refactorings come first
3. Each step is independently deployable — no "big bang" refactoring

## OUTPUT FORMAT

### Summary Table

| Location | Code Smell | Coupling Type | OCP Violation | Composition Pattern | Priority |
|----------|-----------|---------------|---------------|---------------------|----------|
| [file:line] | [smell] | [type + severity] | [violation type] | [pattern] | [score] |

Sort by priority (highest first). If multiple smells point to the same root cause, consolidate into one finding and list all contributing signals.

### Detail per Finding

For each row in the summary table:
- **Smell**: what the code-level symptom looks like (specific files, line ranges)
- **Coupling analysis**: what type of coupling drives the rigidity and its blast radius
- **Axis of change**: which domain boundary is affected and its volatility
- **OCP violation**: how the current design forces modification instead of extension
- **Recommended pattern**: the composition pattern with a brief sketch of how it applies (interface name, key classes, injection point) — do not write full implementation code
- **Refactoring sequence**: the order of safe steps to transition (following Beck's constraint: never change behavior and structure simultaneously)
- **Success signals**: what the code will look like after remediation — fewer files touched per feature, switch statements eliminated, new variants added by creating new classes only

### Needs Human Review

List cases where the diagnosis is ambiguous:
- Coupling that might be intentional (performance-critical tight coupling, compile-time type safety)
- Areas where OCP compliance would introduce speculative generality (stable code with no historical change pressure)
- Patterns where the composition trade-off (more classes, delegation boilerplate) may not justify the flexibility gain
- Inheritance hierarchies that genuinely model stable "is-a" taxonomies rather than behavioral variation

## STOP CONDITION

When all provided files have been analyzed and all rigidity findings mapped to composition patterns, output the summary and stop. Do not modify any files.

If no rigidity signals are found:

> **No rigidity signals found** in the scanned files. The codebase exhibits clean separation of concerns and appropriate use of composition or polymorphism at identified axes of change. No remediation proposals generated.

Do not fabricate findings to fill the table.
````

## Example

**Context:**
A Java e-commerce system where adding a new payment method requires changes in 8 files. The `OrderService` class is 1200 lines with switch statements for payment processing, discount calculation, and notification dispatch.

**Input:**
```
Target files: src/main/java/com/shop/OrderService.java,
              src/main/java/com/shop/PaymentProcessor.java,
              src/main/java/com/shop/DiscountCalculator.java,
              src/main/java/com/shop/NotificationSender.java
High-churn files: OrderService.java (47 commits/quarter), PaymentProcessor.java (31 commits/quarter), DiscountCalculator.java (22 commits/quarter)
Architecture reference: none
```

**Expected Output:**

### Summary Table

| Location | Code Smell | Coupling Type | OCP Violation | Composition Pattern | Priority |
|----------|-----------|---------------|---------------|---------------------|----------|
| `OrderService.java:45–320` | God Class + Switch Antipattern | Static, Cascading | Switch on PaymentType in 3 methods | Strategy | 27 |
| `PaymentProcessor.java:80–200` | Duplicated Conditional Logic | Static, Cascading | if-else chain for fee calculation per payment type | Strategy | 18 |
| `DiscountCalculator.java:30–180` | Repeated Methods of Identical Structure | Static, Moderate | `calculateStudentDiscount()`, `calculateSeniorDiscount()`, `calculateEmployeeDiscount()` | Strategy + Data-driven config | 12 |
| `NotificationSender.java:20–90` | Feature Envy | Semantic, Moderate | Accesses `Order` internals to format messages per notification type | Extract Class | 8 |

### Detail: OrderService God Class + Switch Antipattern

**Smell:** `OrderService` is 1200 lines with three switch statements on `PaymentType` (lines 78, 156, 289). It directly instantiates `StripeClient`, `PayPalClient`, and `BankTransferClient`. Adding a new payment method requires modifying all three switches plus the constructor.

**Coupling analysis:** Static coupling — `OrderService` has concrete dependencies on 3 payment clients, the discount calculator, and the notification sender. Cascading severity: a new payment type touches `OrderService` (3 locations), `PaymentProcessor` (1 location), `NotificationSender` (1 location), plus tests — minimum 8 file edits.

**Axis of change:** Payment types are **Core Domain** with high volatility (business regularly adds new payment integrations). This axis demands strict OCP compliance.

**OCP violation:** All three switch statements are open for modification. Adding "Apple Pay" requires cracking open `OrderService` and appending cases in 3 methods.

**Recommended pattern:** **Strategy.** Extract a `PaymentStrategy` interface with `processPayment()`, `calculateFees()`, and `formatReceipt()`. Create `StripePaymentStrategy`, `PayPalPaymentStrategy`, `BankTransferStrategy`. Inject `PaymentStrategy` into `OrderService` via constructor. The three switches collapse into single delegation calls.

**Refactoring sequence:**
1. Extract `PaymentStrategy` interface from the three switch method signatures
2. Create `StripePaymentStrategy` implementing the interface — move Stripe-specific logic from all three switches
3. Repeat for PayPal and BankTransfer
4. Modify `OrderService` constructor to accept `PaymentStrategy`; replace switches with delegation
5. Update tests: each strategy gets focused unit tests; `OrderService` tests mock the strategy interface

**Success signals:** Adding "Apple Pay" requires creating one new class (`ApplePayStrategy`) and zero modifications to `OrderService`, `PaymentProcessor`, or any existing strategy.

### Detail: NotificationSender Feature Envy

**Smell:** `NotificationSender.formatMessage()` (lines 35-80) accesses `order.getItems()`, `order.getCustomer().getName()`, `order.getPaymentMethod()`, and `order.getShippingAddress()` — it reads more Order data than its own fields. Each notification type (email, SMS, push) has a different formatting branch inside `formatMessage()`.

**Coupling analysis:** Semantic coupling — `NotificationSender` has no compile-time dependency on `Order`'s internals beyond getter calls, but any change to `Order`'s data model (e.g., splitting `shippingAddress` into structured fields) forces synchronized changes in `NotificationSender`. Moderate severity: changes touch 2 files.

**Axis of change:** Notification formatting is a **Supporting Subdomain** — it changes when order structure changes or when new notification channels are added, but it's not the core business differentiator. Moderate volatility.

**OCP violation:** Adding a new notification type requires modifying `formatMessage()` with a new formatting branch. The formatting logic is also tightly bound to `Order`'s current getter surface.

**Recommended pattern:** **Extract Class.** Extract a `NotificationFormatter` that accepts order data (via a dedicated DTO or the Order object itself) and returns formatted messages. Each notification type gets its own formatter implementation (`EmailFormatter`, `SmsFormatter`, `PushFormatter`). `NotificationSender` delegates formatting to the injected formatter and focuses solely on delivery.

**Refactoring sequence:**
1. Extract `NotificationFormatter` interface with `format(order: Order): FormattedMessage`
2. Create `EmailFormatter` — move email-specific formatting logic from `formatMessage()`
3. Repeat for SMS and Push formatters
4. Inject `NotificationFormatter` into `NotificationSender`; replace `formatMessage()` body with delegation
5. Update tests: formatter tests verify output content; sender tests mock the formatter and verify delivery

**Success signals:** `NotificationSender` no longer accesses `Order` internals directly. Adding a new notification type requires a new formatter class and zero changes to `NotificationSender`.

### Needs Human Review

- **DiscountCalculator:** The three discount methods have identical structure but subtly different rounding rules. Verify whether the rounding differences are intentional business requirements or accumulated inconsistency before collapsing into a single Strategy.
- **NotificationSender:** The Feature Envy diagnosis assumes formatting belongs closer to the notification channel. An alternative interpretation is that this is intentional separation of concerns — keeping formatting logic out of the domain model. If the team's architecture mandates that `Order` remains a pure domain object with no presentation logic, then Extract Class (a dedicated `NotificationFormatter`) is correct. If the team prefers rich domain models, Move Method (putting `formatForEmail()` etc. on `Order` itself) may be more appropriate.

## Expected Results

- A prioritized backlog of rigidity findings mapped to specific composition patterns
- Each finding traces the full chain: smell → coupling → axis of change → OCP violation → pattern → refactoring sequence
- Code-free: no files are modified
- Actionable proposals ready for human review before passing to a refactoring workflow
- Flagged ambiguous cases where the "cure" (composition) might be worse than the disease (stable coupling)

## Variations

**For inheritance-heavy codebases:**
```
Focus on inheritance hierarchies deeper than 2 levels. For each, apply the
4-step inheritance-to-composition refactoring: analyze → extract interface →
inject dependencies → flatten hierarchy.
```

**With git churn data:**
```
High-churn files (last 90 days):
[PASTE output of: git log --since="90 days ago" --name-only --pretty=format: | sort | uniq -c | sort -rn | head -20]
Cross-reference coupling severity with change frequency to prioritize.
```

**For a specific axis of change only:**
```
Focus only on the payment processing axis. Ignore discount and notification logic.
```

**For functional or multi-paradigm codebases:**
```
Paradigm: FP (TypeScript with discriminated unions)
Use FP-native equivalents in Step 5: higher-order functions for Strategy,
sum types + pattern matching for State, function composition for Decorator.
```

## Notes

The key insight is that coupling alone does not cause rigidity — coupling at a *volatile axis of change* causes rigidity. A tightly coupled but stable module is dormant debt; a loosely coupled but frequently modified module may still resist change through semantic coupling. The axis-of-change diagnostic (Step 3) is what transforms a generic coupling audit into a targeted rigidity backlog.

The priority formula in Step 6 is deliberately multiplicative: a module must score high on *all three* factors (coupling, churn, volatility) to reach the top of the backlog. This prevents wasting refactoring effort on tightly coupled code that never changes, or frequently changed code that is already well-isolated.

## References

- [research-paper-software-rigidity-ocp-composition.md] — the research synthesis this prompt operationalizes
- [prompt-task-test-friction-diagnostician.md] — complementary: diagnoses rigidity visible through test pain signals
- [prompt-task-abstraction-miner.md] — complementary: finds semantic duplication (a different manifestation of structural debt)
- [prompt-workflow-resonant-refactor.md] — next step: execute the remediation proposals this skill produces

### Source Research

- Robert C. Martin: "The Open-Closed Principle" (Object Mentor); SOLID principles
- Bertrand Meyer: *Object-Oriented Software Construction* (1988) — OCP origin
- Gang of Four: *Design Patterns* — Strategy, Decorator, State, Composite, Chain of Responsibility
- Martin Fowler: "Replace Conditional with Polymorphism" (refactoring.com)
- Freeman & Pryce: *Growing Object-Oriented Software Guided by Tests*
- Michael Feathers: *Working Effectively with Legacy Code*

## Version History

- 1.1.0 (2026-03-19): RO5U review fixes — fixed Feature Envy→Decorator to Feature Envy→Extract Class in example, added NotificationSender detail section, fixed DiscountCalculator priority score arithmetic, added Paradigm input field, added DDD attribution for 3 Buckets, broadened language exclusion, added git-absent fallback heuristics, added language-norm threshold note, added Notes section
- 1.0.0 (2026-03-19): Initial extraction from research-paper-software-rigidity-ocp-composition.md
