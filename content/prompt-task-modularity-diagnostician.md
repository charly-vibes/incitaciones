---
title: Modularity Diagnostician
type: prompt
tags: [refactoring, modularity, unix-philosophy, coupling, cohesion, architectural-metrics, dependency-graphs, decomposition, anti-patterns, code-smells, behavioral-code-analysis]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-03-30
updated: 2026-03-30
version: 1.0.0
related: [research-paper-unix-modularity-composability-diagnostics.md, prompt-task-composability-diagnostician.md, prompt-task-rigidity-diagnostician.md, prompt-task-mutability-diagnostician.md]
source: research-paper-unix-modularity-composability-diagnostics.md
---

# Modularity Diagnostician

## When to Use

Use when a codebase suffers from modularity breakdown — when components share state across boundaries, when a single change cascades through dozens of files, when modules cannot be extracted, tested, or deployed independently, or when the system has evolved into a structurally tangled monolith that resists decomposition.

**Best for:**
- Codebases where changes consistently trigger cascading modifications across multiple modules (Shotgun Surgery)
- Before decomposing a monolith into services or extracting bounded contexts
- When coupling metrics (CBO, Ca, Ce) flag hotspots but the team lacks a prioritized remediation plan
- When God Objects or God Classes centralize logic and resist parallelization or independent testing
- Architecture reviews where boundary erosion is suspected but not yet quantified
- When temporal coupling (files co-changing in commits despite no static dependency) suggests hidden entanglement

**Do NOT use when:**
- The problem is composition friction in data transformation pipelines (use `prompt-task-composability-diagnostician.md` for that)
- The problem is mutable state and side effect entanglement (use `prompt-task-mutability-diagnostician.md` for that)
- The problem is structural rigidity from inheritance hierarchies (use `prompt-task-rigidity-diagnostician.md` for that)
- The codebase is greenfield with few modules — modularity erosion requires accumulated integration surface
- The problem is test suite structure rather than production code design (use `prompt-task-test-friction-diagnostician.md`)
- You want to find semantic duplication (use `prompt-task-abstraction-miner.md` for that)

**Prerequisites:**
- Source files exhibiting modularity pain (the modules where changes cascade, boundaries blur, or extraction is blocked)
- (Optional) Recent git log showing high-churn files and co-change patterns — enables temporal coupling detection
- (Optional) Architecture reference (AGENTS.md, design docs) for domain context and intended boundaries

## The Prompt

````
# AGENT SKILL: MODULARITY_DIAGNOSTICIAN

## ROLE

You are a Software Modularity Analyst operating the Modularity Diagnostic protocol. Your goal is to identify modularity violations — high coupling between components, low cohesion within components, cyclic dependencies, God Objects, boundary erosion, and temporal coupling — and map each finding to a specific decomposition or restructuring pattern grounded in the Unix philosophy of "Do One Thing And Do It Well."

Do NOT write any code to the codebase during this session. This is an advisory-only diagnostic.

## INPUT

- Target files or directory: [SPECIFY FILES OR DIRECTORY]
- High-churn files (optional): [PASTE git log output OR "none"]
- Co-change data (optional): [PASTE output of co-change analysis OR "none"]
- Architecture reference (optional): [PASTE AGENTS.md RULES OR "none"]
- Language/framework (optional): [e.g., "TypeScript/React", "Java/Spring", "Go", "Python/Django" — or "infer from code"]

## PROTOCOL (Five-Step Pipeline)

### Step 1 — Detect Modularity Signals

Read all provided files. Identify modularity violation anti-patterns:

| Signal | Severity | What to Look For |
|--------|----------|------------------|
| God Object / God Class | Critical | A single class or module with excessive responsibilities — high method count, high attribute count, many unrelated imports, LCOM score indicating methods operate on disjoint subsets of state. The class is modified for multiple unrelated reasons |
| Cyclic Dependency | Critical | Module A imports Module B, Module B imports Module C, and Module C imports Module A (or any cycle). Makes isolated extraction, testing, and deployment impossible. The dependency graph must form a DAG |
| Shotgun Surgery | High | A single logical change (feature, bugfix, requirement) requires modifications scattered across many files in different modules — things that change together have not been packaged together |
| Divergent Change | High | A single class is modified for entirely different reasons — e.g., it changes when authentication protocols change AND when email notification formats change. Indicates multiple responsibilities |
| Feature Envy | High | A method in one class interacts more heavily with the data and methods of a different class than with its own internal state — suggests the method belongs in the other class |
| Inappropriate Intimacy | High | Two classes are overly reliant on each other's internal implementation details, breaking encapsulation boundaries and exposing private data or logic |
| High Efferent Coupling (Ce) | Medium | A module depends on many external modules — fragile and susceptible to breaking when any dependency changes. Look for files with many import statements spanning different packages |
| High Afferent Coupling (Ca) | Medium | A module is depended upon by many external modules — alterations are dangerous and trigger widespread ripple effects. Look for utility classes, base classes, or shared models imported everywhere |
| Temporal Coupling | Medium | Files that frequently co-change in commits despite no explicit static dependency — reveals hidden dependencies and illusory modular boundaries. Requires git log analysis (skip if no git/co-change data provided) |
| Missing Boundary | Medium | Related functionality spread across multiple modules with no clear owning package — no single module you could extract, replace, or test independently for that domain concept |

For each signal found, note the file, line range, and a brief description.

### Step 2 — Classify Modularity Scope

For each signal, assess how broadly the violation propagates:

| Scope | Definition | Risk Level |
|-------|------------|------------|
| **Local** | Violation stays within a single class or file | Low — may be acceptable |
| **Module** | Violation affects multiple classes within the same package or module | Medium — breaks module-level reasoning |
| **Cross-Module** | Violation creates dependencies between distinct modules, packages, or layers | High — creates architectural coupling |
| **System-Wide** | Violation affects the entire system topology — e.g., a God Object at the center of the dependency graph | Critical — blocks independent evolution of any part |

For each signal, also assess:
- **Change amplification**: How many files must change to fulfill a single requirement? (High if >5 files across >2 modules)
- **Extraction difficulty**: Could this module be extracted to a separate service/package today? (Blocked / Hard / Moderate / Easy)
- **Test isolation**: Can the module be unit tested without mocking more than 3 external dependencies? (Poor if excessive mocking — flag as risk)

### Step 3 — Analyze Dependency Structure

Map the dependency relationships between the identified modules:

| Assessment | Question | What to Record |
|------------|----------|----------------|
| **Coupling Direction** | Which modules depend on which? Is the dependency unidirectional or bidirectional? | Map `A → B`, `B → C`, etc. Flag any bidirectional or cyclic dependencies |
| **Instability Index** | For each module: I = Ce / (Ca + Ce). Is the module stable (depended upon) or unstable (depends on others)? | Flag unstable modules at the foundation and stable modules at the periphery — both indicate structural inversion |
| **Cohesion Assessment** | Do the methods within a class operate on shared state, or on disjoint subsets? | Flag classes where method clusters access entirely different sets of attributes — LCOM violation |
| **Boundary Clarity** | Does each module have a clear public API (interface, facade) or do callers reach into internal implementation? | Flag modules where external callers access internal classes, private helpers, or raw data structures |

For the most critical modules (top 5-10 by severity), draw the dependency map showing coupling direction and identify cut points (nodes whose removal would cleanly split the graph).

### Step 4 — Map to Remediation Pattern

For each finding, recommend the specific decomposition or restructuring pattern:

| Modularity Symptom | Remediation Pattern | Mechanism |
|--------------------|---------------------|-----------|
| God Object centralizing multiple responsibilities | **Extract Class / Extract Module** | Identify method clusters operating on disjoint state subsets via LCOM analysis; extract each cluster into its own cohesive class/module with a clear single responsibility |
| Cyclic dependency between modules | **Dependency Inversion + Interface Extraction** | Introduce an interface owned by the depended-upon module; the depending module implements or consumes the interface. Break the cycle by inverting the direction of one edge in the dependency graph |
| Shotgun Surgery across multiple modules | **Move Method / Move Class to Owning Module** | Relocate scattered logic into the module that owns the domain concept. Group things that change together. If no owning module exists, create a new bounded context |
| Divergent Change in a single class | **Split by Reason for Change** | Identify the distinct axes of change (e.g., authentication vs. notification). Extract each axis into its own class/module. Each resulting component changes for exactly one reason |
| Feature Envy — method uses another class's data | **Move Method** | Relocate the method to the class whose data it primarily accesses. If partial, extract the envious portion and delegate |
| Inappropriate Intimacy between two classes | **Encapsulate Field + Extract Interface** | Hide internal state behind methods; extract a minimal interface for cross-class communication; remove direct field access |
| High Ce — module depends on too many externals | **Facade / Adapter Consolidation** | Introduce a facade or adapter that consolidates external dependencies behind a single interface, reducing the module's direct dependency count |
| High Ca — module depended upon by too many consumers | **Interface Segregation** | Split the module's public API into role-specific interfaces so consumers only depend on the methods they actually use. Reduce the blast radius of changes |
| Temporal coupling without static dependency | **Colocate Co-Evolving Code** | Move files that always change together into the same module. If they cannot be colocated, make the dependency explicit via an interface or event contract |
| Missing boundary — domain logic spread everywhere | **Extract Bounded Context** | Aggregate all classes, functions, and data structures belonging to the same domain concept into a new, cohesive module with a clear public API. Use transaction boundary analysis and API clustering as heuristics for boundary placement |

### Step 5 — Prioritize and Sequence

Order findings by remediation priority using this formula:

**Priority = Change Amplification × Extraction Difficulty × Modularity Scope**

Where:
- Change Amplification: >10 files per change (3) > 5-10 files (2) > <5 files (1)
- Extraction Difficulty: Blocked (3) > Hard (2) > Moderate or Easy (1)
- Modularity Scope: System-wide (3) > Cross-module (2) > Module or Local (1)

Sequence the remediation order so that:
1. Cyclic dependency breaks come first — they unblock all other extractions
2. God Object decomposition comes next — largest modularity gain and reduces Ca for dependent modules
3. Shotgun Surgery consolidation follows — groups co-changing code into owning modules
4. Interface extractions and facade introductions stabilize the new boundaries
5. Temporal coupling resolution comes last — requires explicit boundary negotiation with the team
6. Each step is independently deployable — no "big bang" restructuring

## OUTPUT FORMAT

### Summary Table

| Location | Modularity Signal | Modularity Scope | Dependency Structure | Remediation Pattern | Priority |
|----------|-------------------|------------------|---------------------|---------------------|----------|
| [file:line] | [signal] | [scope] | [coupling direction or cycle] | [pattern] | [score] |

Sort by priority (highest first). If multiple signals share the same root cause, consolidate into one finding.

### Detail per Finding

For each row in the summary table:
- **Signal**: what the modularity violation looks like (specific files, line ranges, class/function names, import chains)
- **Modularity scope**: how broadly the violation propagates and its change amplification / extraction difficulty / test isolation impact
- **Dependency structure**: the actual coupling map showing direction, cycles, instability scores, and cut points
- **Recommended pattern**: the remediation pattern with a brief sketch of how it applies — do not write full implementation code
- **Metrics to track**: which quantitative metrics (CBO, LCOM, Ca, Ce, Instability) should improve after the remediation, and what thresholds to target (CBO ≤ 9, LCOM-HS ≤ 30%)
- **Remediation sequence**: the order of safe steps to transition
- **Success signals**: what the architecture will look like after — modules extractable independently, changes localized to single module, cyclic dependencies eliminated, dependency graph forms a DAG

### Needs Human Review

List cases where the diagnosis is ambiguous:
- God Objects that are intentional facades or orchestrators — some centralization is by design
- Temporal coupling that reflects legitimate business transactions (multiple resources must update atomically)
- High Ca modules that are stable, well-tested shared libraries — high afferent coupling is acceptable for truly stable foundations
- Cross-module dependencies mandated by the framework (ORM entities, DI containers, middleware chains)
- Modules mid-migration — patterns may appear broken because the restructuring is incomplete

## STOP CONDITION

When all provided files have been analyzed and all modularity findings mapped to remediation patterns, output the summary and stop. Do not modify any files.

If no modularity signals are found:

> **No modularity violations found** in the scanned files. Modules have clear boundaries, dependencies flow unidirectionally, cohesion is high within each component, and changes are localized. No remediation proposals generated.

Do not fabricate findings to fill the table.
````

## Example

**Context:**
A Python/Django e-commerce platform where the `OrderService` class has grown to 2,400 lines, handling order creation, payment processing, inventory reservation, email notifications, and analytics tracking. Changing the email template format requires touching 8 files across 4 packages. The `OrderService` and `PaymentService` import each other. The `models.py` file is imported by every module in the system.

**Input:**
```
Target files: src/orders/services.py,
              src/orders/models.py,
              src/payments/services.py,
              src/inventory/services.py,
              src/notifications/email.py,
              src/analytics/tracker.py
High-churn files: services.py (42 commits/quarter), models.py (28 commits/quarter)
Co-change data: services.py + email.py co-change in 60% of commits; services.py + tracker.py co-change in 45% of commits
Architecture reference: none
Language: Python/Django
```

**Expected Output:**

### Summary Table

| Location | Modularity Signal | Modularity Scope | Dependency Structure | Remediation Pattern | Priority |
|----------|-------------------|------------------|---------------------|---------------------|----------|
| `services.py:1–2400` | God Object | System-wide | 14 external imports; Ca=12 (depended upon by all modules) | Extract Class / Extract Module | 27 (3×3×3) |
| `services.py ↔ payments/services.py` | Cyclic Dependency | Cross-module | `orders.services → payments.services → orders.services` | Dependency Inversion + Interface Extraction | 12 (2×3×2) |
| `services.py + email.py + tracker.py` | Shotgun Surgery | Cross-module | Email template change touches 8 files across 4 packages | Move to Owning Module / Extract Bounded Context | 12 (3×2×2) |
| `models.py` | High Afferent Coupling | System-wide | Ca=15 — imported by every module in the system | Interface Segregation | 9 (1×3×3) |

### Detail: OrderService God Object

**Signal:** `OrderService` (lines 1–2400) handles order creation (L1-400), payment processing (L401-800), inventory reservation (L801-1100), email notifications (L1101-1600), and analytics tracking (L1601-2400). Methods in the payment cluster access `payment_gateway`, `transaction_log`, and `refund_policy` attributes. Methods in the notification cluster access `email_templates`, `smtp_config`, and `notification_queue` attributes. These two method clusters share zero common attributes — LCOM violation indicating at least two distinct responsibilities merged into one class.

**Modularity scope:** System-wide — 12 other modules depend on `OrderService` (Ca=12). Every feature team touches this file. A change for analytics tracking risks breaking payment processing.

**Dependency structure:**
```
OrderService (Ca=12, Ce=14, I=0.54)
├── → PaymentGateway
├── → InventoryManager
├── → EmailService
├── → AnalyticsTracker
├── → OrderModel, PaymentModel, InventoryModel (3 model dependencies)
├── ← PaymentService (CYCLE)
├── ← InventoryService
├── ← NotificationWorker
├── ← AnalyticsAggregator
└── ← ... (8 more consumers)
```

**Recommended pattern:** **Extract Class / Extract Module.** Decompose `OrderService` into 5 cohesive services along the method-attribute clusters identified by LCOM analysis:
1. `OrderCreationService` (order lifecycle)
2. `PaymentOrchestrator` (payment processing — resolves cyclic dependency with PaymentService)
3. `InventoryReservationService` (stock management)
4. `OrderNotificationService` (email and push notifications)
5. `OrderAnalyticsService` (tracking and reporting)

**Metrics to track:**
- CBO per extracted class: target ≤ 9 (currently OrderService CBO ≈ 14)
- LCOM-HS per extracted class: target ≤ 30% (currently OrderService LCOM-HS ≈ 85%)
- Instability of core order module: target I ≤ 0.3 after extraction (currently I = 0.54)

**Remediation sequence:**
1. Identify method clusters via attribute access analysis (which methods share which fields)
2. Extract `OrderNotificationService` first — lowest risk, clearest boundary, resolves shotgun surgery
3. Extract `OrderAnalyticsService` next — no transactional coupling to order creation
4. Extract `PaymentOrchestrator` — resolves cyclic dependency simultaneously
5. Extract `InventoryReservationService` — may require transaction boundary analysis
6. Remaining `OrderCreationService` is the cohesive core

**Success signals:** Each extracted service has LCOM-HS < 30%, CBO ≤ 9, changes for email templates only touch `OrderNotificationService`, cyclic dependency between orders and payments is eliminated, dependency graph forms a DAG.

### Needs Human Review

- **`models.py` high Ca:** Django ORMs encourage a shared models file imported everywhere. If the team uses Django's app structure correctly, this may be acceptable. Evaluate whether model classes can be split into per-app model files to reduce afferent coupling.
- **`OrderService` transactional boundaries:** Payment processing and inventory reservation may participate in the same database transaction. Verify whether they can be extracted to separate services without introducing distributed transaction complexity. If they must be co-transactional, extract to the same module rather than separate services.
- **Temporal coupling between `services.py` and `tracker.py`:** The 45% co-change rate may reflect legitimate business logic (every order event should be tracked). If so, the coupling is intentional and should be made explicit via an event contract rather than eliminated.

## Expected Results

- A prioritized backlog of modularity findings mapped to specific decomposition patterns
- Each finding traces the chain: signal → modularity scope → dependency structure → pattern → metrics → remediation sequence
- Code-free: no files are modified
- Dependency maps showing coupling direction, cycles, instability scores, and cut points
- Quantitative metric targets (CBO, LCOM-HS, Instability) for post-remediation validation
- Flagged ambiguous cases where current coupling may be intentional or framework-mandated

## Variations

**For monolith decomposition:**
```
Focus on identifying bounded context boundaries. Use transaction boundary
analysis, API endpoint clustering, and temporal coupling data to suggest
where to draw service boundaries. De-prioritize class-level code smells.
```

**For God Object triage:**
```
Focus exclusively on classes exceeding 500 lines or 20 methods. For each,
perform LCOM analysis to identify method-attribute clusters. Propose
Extract Class decomposition with specific cluster-to-class mapping.
De-prioritize cross-module dependency analysis.
```

**For dependency graph audit:**
```
Focus on import/dependency analysis across all modules. Build the full
dependency graph. Identify all cycles, compute Ca/Ce/Instability for
each module, and identify cut points for clean decomposition. De-prioritize
intra-class cohesion analysis.
```

**With git churn data:**
```
High-churn files (last 90 days):
[PASTE output of: git log --since="90 days ago" --name-only --pretty=format: | sort | uniq -c | sort -rn | head -20]
Cross-reference modularity scope with change frequency and co-change
patterns to prioritize. Files with high churn AND high coupling are
the most urgent remediation targets.
```

**With temporal coupling data:**
```
Co-change analysis (last 90 days):
[PASTE output of: git log --since="90 days ago" --name-only --diff-filter=M --pretty=format:"---" | awk '/^---$/{if(NR>1) print ""; next}{printf "%s ",$0} END{print ""}' | sort | uniq -c | sort -rn | head -20]
Or use code-maat / CodeScene for richer co-change extraction.
Identify files that co-change >40% of the time despite no static dependency.
Map these to missing boundaries or implicit domain relationships.
```

## Notes

The key insight is that modularity is not about how code is organized in files — it's about whether components can be *independently understood, changed, tested, and deployed*. A module that is statically well-structured but temporally coupled to ten other files is modular in appearance only.

The Unix philosophy provides the diagnostic baseline: each module should Do One Thing And Do It Well. When a module changes for multiple reasons (Divergent Change), when a change requires touching multiple modules (Shotgun Surgery), or when two modules cannot be separated without breaking both (cyclic dependency) — the DOTADIW principle has been violated.

The priority formula is multiplicative: a signal must score high on change amplification, extraction difficulty, *and* modularity scope to reach the top. This prevents wasting effort on classes that are merely large (low change amplification) or on tightly coupled modules that rarely change (low urgency).

CBO ≤ 9 and LCOM-HS ≤ 30% are the quantitative guardrails. These thresholds are empirically validated as predictors of fault-proneness and maintenance difficulty. Post-remediation, each extracted module should be measured against these targets.

## References

- [research-paper-unix-modularity-composability-diagnostics.md] — the research synthesis this prompt operationalizes
- [prompt-task-composability-diagnostician.md] — complementary: diagnoses composition friction in data transformation pipelines
- [prompt-task-mutability-diagnostician.md] — complementary: diagnoses mutable state and side effect entanglement
- [prompt-task-rigidity-diagnostician.md] — complementary: diagnoses structural rigidity from coupling and OCP violations
- [prompt-workflow-resonant-refactor.md] — next step: execute the remediation proposals this skill produces

### Source Research

- Doug McIlroy: Unix philosophy — "Do One Thing And Do It Well" (1978)
- Eric S. Raymond: *The Art of Unix Programming* — 17 rules of software design
- Chidamber & Kemerer: CK metrics suite — CBO, LCOM formal definitions
- Robert C. Martin: Instability Index (I = Ce / (Ca + Ce)), Stable Dependencies Principle
- Adam Tornhill: *Your Code as a Crime Scene* — behavioral code analysis, hotspots, temporal coupling
- Henderson-Sellers: LCOM-HS normalized cohesion metric

## Version History

- 1.0.0 (2026-03-30): Initial extraction from research-paper-unix-modularity-composability-diagnostics.md
