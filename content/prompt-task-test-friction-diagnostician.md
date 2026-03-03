---
title: Test Friction Diagnostician
type: prompt
tags: [testing, tdd, design-patterns, refactoring, oop, functional-programming, abstraction, test-design, code-quality]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-03-03
updated: 2026-03-04
version: 1.1.0
related: [research-finding-test-friction-design-diagnostic.md, prompt-task-abstraction-miner.md, prompt-task-test-abstraction-miner.md, references-oop-fp-pattern-equivalences.md]
source: research-based
---

# Test Friction Diagnostician

## When to Use

Use when writing tests is painful and you want to know what production code design is causing the pain. This prompt treats test difficulty as a measurement instrument — each type of friction points to a specific missing abstraction in the code under test.

**Best for:**
- Tests that feel overly complex to set up
- Codebases where tests break when "unrelated" things change
- Before a refactoring sprint (produces a prioritized design-debt backlog)
- Code review when reviewers instinctively reach for mocks, fixtures, and helpers rather than improving the design

**Do NOT use when:**
- You want to collapse test duplication into parameterized tests (use `prompt-task-test-abstraction-miner.md` for that)
- The codebase has no tests at all (apply Feathers' Working Effectively with Legacy Code seam-introduction techniques first)
- The friction comes from a third-party library you cannot change
- The missing FP abstraction (e.g., sum types) requires language features unavailable in the project's language — flag it as a tool selection issue, not a code design problem
- The conditionals or structural flaws are in generated code — recommend adapter/wrapper patterns rather than refactoring the generated output

**Prerequisites:**
- Test file(s) that are painful to write or maintain
- The corresponding production file(s) being tested

## The Prompt

````
# AGENT SKILL: TEST_FRICTION_DIAGNOSTICIAN

## ROLE

You are a Test Quality Analyst operating the Test Friction Diagnostic protocol. Your goal is to identify specific structural flaws in production code by reading the pain signals in test code.

Test difficulty is not a testing problem — it is a design problem made visible.

Do NOT write any code to the codebase during this session. This is an advisory-only diagnostic.

## INPUT

- Test files: [SPECIFY TEST FILES]
- Production files (corresponding to the tests): [SPECIFY PRODUCTION FILES]
- Paradigm: [OOP / FP / Mixed — or "infer from code"]

## PROTOCOL (The Five-Step Pipeline)

### Step 1 — Notice the Friction

Read all test files. Identify friction signals from "Listening to the Tests" (Freeman & Pryce):

| Signal | Severity |
|--------|----------|
| Bloated constructor requiring many collaborators in test setup | High |
| Heavy mock setup with complex stub configurations | High |
| Parameterized tests with many type-varying rows mirroring production conditionals | High |
| Tests that break when unrelated code changes | High |
| Tests hard to name because the unit does too many things | Medium |
| Private methods tested directly | Medium |
| Long setup sequences before each assertion | Medium |

For each signal found, note which test(s) exhibit it and a brief description of how it manifests.

### Step 2 — Identify the Smell

Map each friction signal to its underlying code smell:

| Friction | Smell |
|----------|-------|
| Many constructor parameters in test setup | God Class |
| Heavy mocking in unit tests¹ | Violated Dependency Inversion |
| Many type-varying parameterized rows | Feature Envy / missing polymorphism |
| Complex mock for a single operation | Mixed business logic and infrastructure |
| Cannot find extension point to inject a test double | Missing Seam (Feathers) |
| Private methods "need" tests | Hidden object inside the class |
| Tests break when unrelated things change² | Tight coupling |

¹ Rule out integration tests written as unit tests before concluding this is a production-code coupling issue.
² Rule out shared test state and test ordering dependencies before concluding this is a production-code coupling issue.

### Step 3 — Map to the Missing Abstraction

For each smell, identify what abstraction is absent. Use the OOP column for class-based languages (Java, C#, Ruby, Python OOP); use the FP column when the language has first-class functions and sum types (Haskell, F#, Scala, Rust, TypeScript with discriminated unions, Elixir). For mixed codebases, apply the column matching the primary style of the specific class or function under test.

| Smell | Missing Abstraction (OOP) | Missing Abstraction (FP) |
|-------|--------------------------|--------------------------|
| Behavior varies by type / config | Strategy pattern | Higher-order function |
| Behavior varies by state | State pattern | Sum types + pattern matching |
| Composable wrappers needed | Decorator | Function composition / Endomorphism monoid |
| Mixed concerns in one class | Extract Class | Module separation |
| Complex object creation | Factory / Builder | Applicative / monadic construction |
| Repeated null / error checks | Null Object | Maybe / Option monad |
| Type checks repeated across methods | Polymorphic subclasses | Algebraic data types |

### Step 4 — Refactor Proposal

For each identified missing abstraction:
- Name the specific refactoring move (e.g., "Replace Conditional with Polymorphism", "Extract Class", "Introduce Interface")
- Describe the structural change (do not apply it to the codebase)
- Follow Beck's constraint: small, safe steps within red-green-refactor; never change behavior and structure simultaneously

### Step 5 — Success Signals

For each refactoring proposal, state the test-level signals that would confirm the fix worked. These are acceptance criteria for the refactoring, not predictions — they tell the practitioner what to look for after applying the change:
- Constructor parameter counts decrease
- Mock setups shrink or vanish
- Test names become clearer and more focused
- Parameterized tests with type-varying rows split into focused tests on individual polymorphic classes

## OUTPUT FORMAT

### Summary Table

| Location | Friction Signal | Smell | Missing Abstraction | Priority |
|----------|----------------|-------|---------------------|----------|
| [file:line or test name] | [signal] | [smell] | [abstraction] | [1-N] |

Sort by priority: highest-friction tests identify highest-priority design debt. If multiple friction signals point to the same root smell, consolidate them into one finding and list all contributing signals in the Friction column.

### Detail per Finding

For each row in the table:
- **Friction**: what the test pain looks like (specific test names, line references)
- **Smell**: the design problem this reveals
- **Missing abstraction**: what should exist in the production code
- **Proposed refactoring**: the structural change that resolves it (do not apply)
- **Predicted simplification**: what the tests will look like after the fix

### Needs Human Review

List cases where symptom attribution is ambiguous — e.g., many mocks could signal tight coupling *or* an integration test incorrectly written as a unit test. Note which interpretation is more likely and why.

## STOP CONDITION

When all provided files have been analyzed and all friction signals mapped to their missing abstractions, output the summary and stop. Do not modify any files.

If no friction signals are found:

> **No test friction signals found** in the scanned files. Tests appear well-structured and the production code they cover appears to have clear design boundaries. No refactoring proposals generated.

Do not fabricate findings to fill the table.
````

## Example

**Context:**
A Python `NotificationService` that sends emails, SMS, and push notifications. Tests are slow and fragile — three different mock setups per test, and adding a new notification type requires changes in five places.

**Input:**
```
Test files: tests/test_notification_service.py
Production files: notification_service.py
Paradigm: OOP (Python)
```

**Expected Output:**

### Summary Table

| Location | Friction Signal | Smell | Missing Abstraction | Priority |
|----------|----------------|-------|---------------------|----------|
| `test_notification_service.py:12–40` | Heavy mock setup (3 mocks per test) | God Class / Violated DI | Strategy pattern: `NotificationChannel` interface | 1 |
| `test_notification_service.py:55–90` | Type-varying rows: email/SMS/push branches | Missing polymorphism | Polymorphic subclasses: `EmailChannel`, `SmsChannel`, `PushChannel` | 2 |
| `test_notification_service.py:95–110` | Private `_format_payload` tested directly | Hidden object inside class | Extract class: `PayloadFormatter` | 3 |

### Detail: Heavy mock setup (3 mocks per test)

**Friction:** Every test in `TestNotificationService` requires mocking `SmtpClient`, `TwilioClient`, and `FcmClient` directly. Test setup averages 15 lines before the first assertion.

**Smell:** `NotificationService` is a God Class that directly instantiates three external clients. It violates Dependency Inversion — tests must control all three concretions to exercise any single behavior.

**Missing abstraction:** A `NotificationChannel` interface (or abstract base class) with a single `send(message)` method. `NotificationService` depends only on `list[NotificationChannel]`, injected at construction. Each channel wraps one client.

**Proposed refactoring:** Extract Interface — introduce `NotificationChannel` with a `send(message: Message) -> None` method. Create `EmailChannel(SmtpClient)`, `SmsChannel(TwilioClient)`, `PushChannel(FcmClient)`. Inject `list[NotificationChannel]` into `NotificationService.__init__`.

**Predicted simplification:** Each test needs one mock: the specific `NotificationChannel` under test. Setup collapses from 15 lines to 3.

### Detail: Type-varying rows (email/SMS/push branches)

> **Note:** This is the dispatch consequence of the same God Class identified in finding #1. Applying the Strategy pattern from finding #1 eliminates this finding as a side-effect — the conditional disappears when each `NotificationChannel.send()` carries its own payload logic.

**Friction:** `test_sends_correct_payload` is parameterized with 3 rows — one per channel type — because `NotificationService._dispatch()` contains `if channel_type == "email" / "sms" / "push"` conditionals.

**Smell:** The parameterized rows mirror a production-code conditional that dispatches by type. Each new notification type requires adding a new branch and a new test row. This is the "conditional as design smell" (Metz): when tests require many variations parameterized only by type, the production code has an `if/case` that should be a polymorphic dispatch.

**Missing abstraction:** The Strategy pattern dissolves the conditional entirely. Each `NotificationChannel` subclass implements `send()` with its own payload logic. The dispatch `if` disappears — calling `channel.send(message)` for each channel in the list replaces it.

**Proposed refactoring:** Replace Conditional with Polymorphism. Move each branch of `_dispatch()` into the corresponding `Channel.send()` implementation.

**Predicted simplification:** The parameterized test with 3 type-varying rows becomes 3 focused unit tests — one per channel class — each testing only its own `send()` logic with no knowledge of other channel types.

## Expected Results

- A prioritized list of design-debt findings rooted in test pain
- Each finding traces the full chain: friction → smell → missing abstraction → refactoring direction
- Code-free: no files are modified
- Actionable proposals ready for human review before passing to a refactoring workflow

## Variations

**For a single friction type only:**
```
Focus only on mock-setup friction. Ignore test-naming and type-variation signals.
```

**For FP codebases:**
```
Paradigm: FP (TypeScript with discriminated unions)
Use the FP column exclusively for missing abstraction recommendations.
```

**For legacy code with no seams:**
```
If no extension points are found, flag the seam introduction step first:
identify where a seam can be added (constructor injection, virtual method,
link seam) before the full pipeline applies.
```

## References

- [research-finding-test-friction-design-diagnostic.md] — the research synthesis this prompt operationalizes
- [references-oop-fp-pattern-equivalences.md] — OOP ↔ algebraic structure Rosetta Stone for Step 3
- [prompt-task-test-abstraction-miner.md] — for collapsing test duplication (the downstream step after design improves)
- [prompt-task-abstraction-miner.md] — the production-code counterpart (scans for semantic duplication in production code)

### Source Research

- Sandi Metz: "The Magic Tricks of Testing" (RailsConf 2013); *Practical Object-Oriented Design* (POODR); *99 Bottles of OOP*
- Freeman & Pryce: *Growing Object-Oriented Software Guided by Tests* — "Listening to the Tests" chapter
- Michael Feathers: *Working Effectively with Legacy Code* — Seams concept
- Mark Seemann: "From Design Patterns to Category Theory" blog series
- Martin Fowler: "Replace Conditional with Polymorphism" (refactoring.com)

## Version History

- 1.1.0 (2026-03-04): RO5U review fixes — added mixed-paradigm tiebreaker to Step 3, added two missing "Do NOT use when" conditions (FP language support, generated code), reframed Step 5 as acceptance criteria not predictions, added signal-consolidation rule to output format, added root-cause note linking findings 1+2 in example
- 1.0.0 (2026-03-03): Initial extraction from research-finding-test-friction-design-diagnostic.md
