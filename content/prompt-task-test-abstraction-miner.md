---
title: Test Abstraction Miner
type: prompt
tags: [testing, parameterization, property-based-testing, test-smells, abstraction-miner, tdd, lazy-test, resonant-coding]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-03-03
updated: 2026-03-04
version: 1.1.0
related: [research-finding-test-parameterization-pbt-pipeline.md, prompt-task-abstraction-miner.md, prompt-task-test-friction-diagnostician.md, prompt-workflow-resonant-refactor.md]
source: research-based
---

# Test Abstraction Miner

## When to Use

Use when a test suite has accumulated Lazy Tests — groups of test methods that are one parameterized test pretending to be many. This prompt extends the Abstraction Miner's Fabbro Loop to test code, collapsing test clusters into parameterized tests and proposing property-based tests that cover the input space the examples leave unchecked.

**Best for:**
- Test suites grown through vibe coding or rapid iteration
- Before a test refactoring sprint (produces a prioritized backlog)
- Periodic test quality audits
- When test suites feel exhaustive but edge cases keep slipping through

**Do NOT use when:**
- The tests are genuinely different behaviors (error path vs. success path) — those should stay separate
- You want to diagnose *why* tests are hard to write (use `prompt-task-test-friction-diagnostician.md` for that)
- The test suite has fewer than 10 tests (likely not enough duplication to warrant the scan)

**Prerequisites:**
- Test file(s) to scan
- Knowledge of which test framework and PBT library the project uses (or the agent can infer from project files)

## The Prompt

````
# AGENT SKILL: TEST_ABSTRACTION_MINER

## ROLE

You are a Test Pattern Recognition Engine operating in test mode of the Resonant Coding protocol. Your goal is to detect Lazy Test clusters (test duplication disguised as coverage) and resolve them into parameterized tests and property-based test proposals.

Do NOT write any code to the codebase during this session. This is an advisory-only scan.

## INPUT

- Target test files: [SPECIFY TEST FILES]
- Test framework: [Jest / Vitest / pytest / Go testing / JUnit 5 / RSpec / rstest — or "infer from code"]
- PBT library (if available): [Hypothesis / fast-check / jqwik / QuickCheck — or "none" / "infer"]

## PROTOCOL

### Phase 0 — Identify Test Infrastructure

Detect the test framework from file patterns and imports:
- `*.test.ts` / `*.spec.ts` → Jest or Vitest
- `test_*.py` / `*_test.py` → pytest
- `*_test.go` → Go testing
- `@Test` annotations → JUnit 5
- `*_spec.rb` → RSpec
- `#[rstest]` → Rust rstest

Note which PBT library is available (e.g., `from hypothesis import given`, `import fc from 'fast-check'`). If none is detected: describe proposed properties in prose only (no runnable code), flag which library to install for the detected framework (see Variations), and skip code blocks in Phase 4 output.

### Phase 1 — Test Cluster Detection

Read all test files. Look for Lazy Test clusters — groups of test methods that are one parameterized test in disguise.

**Detection signals (in priority order):**
1. Same function/method under test (primary)
2. Same assertion type and structure (confirmation)
3. Only literal values differ between tests (differentiator)
4. Same setup/teardown shape with different values (supporting)

**Threshold:** N ≥ 3 tests forming a cluster. At N = 2, note as a candidate but do not mandate parameterization. If the same cluster pattern appears across multiple test files (same SUT + same assertion shape), count them together — cross-file clusters above N ≥ 3 are valid findings; note all contributing source files in the cluster entry.

**Critical distinction:** Tests addressing genuinely different *behaviors* (error path vs. success path vs. auth failure) must stay separate even if they call the same function. Only *data variations* (same code path, different inputs) warrant collapsing.

**Diagnostic question:** Can you diff two test methods and find only literal constant differences? If yes, they form a cluster.

### Phase 2 — Cluster Analysis

For each cluster, identify:
- **Invariant:** the test setup shape + SUT call + assertion structure (what never changes)
- **Variant:** the literal values for setup, call arguments, and expected output (what changes per case)
- **Cluster name:** a descriptive label for the pattern
- **Count:** number of tests in the cluster

Reject clusters where differences include control flow, assertion type, or which SUT is called — flag these for "Needs Human Review".

### Phase 3 — Parameterization Proposal

For each cluster, produce:
1. The data table (variant) extracted from the cluster
2. The test template (invariant) in the project's detected framework syntax (see **Framework Reference** below)
3. A before/after diff for one representative test case

Flag: if test case names are meaningful (describe a behavior, not just an input), recommend using the `id`/`name` field in the data table row to preserve that intent.

### Phase 4 — Property Escalation Proposal

Read each collapsed data table and infer property types using this decision tree:

```
What is the type relationship between input and output?

(T → T) same type:
  ├── f(f(x)) == f(x) plausible for all rows?   → Idempotency
  ├── f(a,b) == f(b,a) for swapped args?         → Commutativity
  └── Otherwise                                   → Invariant on output shape

(T → bool) predicate:
  ├── Inputs partition into valid/invalid groups? → Partitioned invariant
  └── Otherwise                                   → Invariant per partition

(T → U, U → T) inverse function pair exists?     → Round-trip

(T → numeric) aggregation:
  ├── Output grows consistently as input grows?   → Monotonicity
  └── Output matches a simpler known formula?     → Model-based

Row-to-row relationships:
  ├── Row N input = Row N-1 input + one element?  → Metamorphic (count/membership)
  ├── Row N input = Row N-1 input scaled/negated? → Metamorphic (algebraic)
  └── Row N expected = Row N-1 input via f?       → Idempotency confirmation
```

**Function name priors (apply before reading the data table):**
- `normalize`, `clean`, `format`, `deduplicate`, `sort` → **Idempotency**
- `encode`/`decode`, `serialize`/`deserialize`, `compress`/`decompress` → **Round-trip**
- `validate`, `is_valid`, `check`, `matches` → **Partitioned invariant**
- `add`, `merge`, `concat`, `union` (binary ops) → **Commutativity + Associativity**
- `fast_*`, `optimized_*` → **Model-based** (compare against naïve oracle)
- `filter`, `search`, `query` with extra constraint param → **Metamorphic**

For each inferred property type, propose a concrete property test in the project's PBT library. Rank proposals: Model-based and Metamorphic first (easiest to derive mechanically), Partitioned invariant second, others as applicable.

The PBT escalation is advisory: if the data table inputs were carefully hand-chosen for specific regression cases or documented edge cases, note that parameterization is the right endpoint and PBT would not add value for this cluster.

## OUTPUT FORMAT

### Summary Table

| Cluster Name | Test Count | Est. Lines Saved | Property Types | Priority |
|:-------------|:-----------|:-----------------|:---------------|:---------|
| [Name]       | [Count]    | [Lines]          | [Types]        | [1-N]    |

### Detail per Cluster

For each row in the table:
- **Cluster:** what pattern is duplicated
- **Invariant / Variant:** what's fixed vs. what changes
- **Parameterized test:** before/after diff + data table in framework syntax
- **Property proposals:** 1-3 concrete PBT tests ranked by confidence, with generator design rationale
- **Caveats:** behavioral subtleties or ambiguous cases requiring human review

### Needs Human Review

List clusters where behavioral vs. data variation is ambiguous — tests that look like data variations but may actually exercise different code paths or test different behaviors. Note the distinguishing signal and what human judgment is needed.

## STOP CONDITION

When all test files are scanned and all Lazy Test clusters with N ≥ 3 are reported, with each cluster receiving a parameterization proposal and at least one property escalation proposal (or a note explaining why PBT would not add value), output the summary and stop. Do not modify any files.

If no clusters meet the threshold:

> **No Lazy Test clusters found** (N ≥ 3) in the scanned test files. Test suite appears parametrically resonant.

Do not fabricate findings to fill the table.
````

## Framework Reference

Parameterized test syntax by framework. Use the syntax matching the project's detected framework.

**Jest/Vitest:**
```typescript
test.each([
  { input: 'a', expected: true },
  { input: 'b', expected: false },
])('functionName($input) → $expected', ({ input, expected }) => {
  expect(functionName(input)).toBe(expected);
});
```

**pytest:**
```python
@pytest.mark.parametrize("input,expected", [
    ("a", True),
    ("b", False),
])
def test_function_name(input, expected):
    assert function_name(input) == expected
```

**Go (table-driven):**
```go
func TestFunctionName(t *testing.T) {
    tests := []struct {
        name     string
        input    string
        expected bool
    }{
        {"case a", "a", true},
        {"case b", "b", false},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            if got := functionName(tt.input); got != tt.expected {
                t.Errorf("functionName(%q) = %v, want %v", tt.input, got, tt.expected)
            }
        })
    }
}
```

**JUnit 5:**
```java
@ParameterizedTest
@CsvSource({ "a, true", "b, false" })
void testFunctionName(String input, boolean expected) {
    assertEquals(expected, functionName(input));
}
```

**RSpec:**
```ruby
shared_examples "validates correctly" do |input, expected|
  it { expect(function_name(input)).to eq(expected) }
end

describe "function_name" do
  [["a", true], ["b", false]].each do |input, expected|
    include_examples "validates correctly", input, expected
  end
end
```

**rstest (Rust):**
```rust
#[rstest]
#[case("a", true)]
#[case("b", false)]
fn test_function_name(#[case] input: &str, #[case] expected: bool) {
    assert_eq!(function_name(input), expected);
}
```

---

## Example

**Context:**
A TypeScript utility library for a shopping cart. Tests for `validateEmail`, `calculateDiscount`, and `formatCurrency` have each been written as 4–6 independent test blocks with only the input values changing.

**Input:**
```
Target test files: src/__tests__/utils.test.ts
Test framework: infer
PBT library: infer
```

**Expected Output:**

### Summary Table

| Cluster Name | Test Count | Est. Lines Saved | Property Types | Priority |
|:-------------|:-----------|:-----------------|:---------------|:---------|
| Email Validator | 5 | ~30 lines | Partitioned invariant | 1 |
| Discount Calculator | 4 | ~20 lines | Monotonicity, Model-based | 2 |

### Detail: Email Validator Cluster

**Cluster:** 5 test blocks each calling `validateEmail(input)` and asserting `toBe(true/false)`, differing only in the email string.

**Invariant:** `expect(validateEmail(input)).toBe(expected)`
**Variant:** `(input, expected)` pairs

**Parameterized test (before → after):**

Before (5 separate blocks):
```typescript
test('validates user@example.com', () => {
  expect(validateEmail('user@example.com')).toBe(true);
});
test('validates admin@domain.org', () => {
  expect(validateEmail('admin@domain.org')).toBe(true);
});
test('rejects "not-email"', () => {
  expect(validateEmail('not-email')).toBe(false);
});
// ... 2 more blocks
```

After (Jest `test.each`):
```typescript
test.each([
  { input: 'user@example.com',  expected: true,  id: 'valid local@domain' },
  { input: 'admin@domain.org',  expected: true,  id: 'valid subdomain' },
  { input: 'not-email',         expected: false, id: 'missing at-sign' },
  { input: '',                  expected: false, id: 'empty string' },
  { input: 'a@b',               expected: true,  id: 'minimal valid' },
])('validateEmail($input) → $expected [$id]', ({ input, expected }) => {
  expect(validateEmail(input)).toBe(expected);
});
```

**Property proposals:**

```typescript
import fc from 'fast-check';

// 1. Partitioned invariant — valid emails always pass (confidence: HIGH)
fc.assert(fc.property(
  fc.emailAddress(),  // fast-check built-in
  (email) => {
    expect(validateEmail(email)).toBe(true);
  }
));

// 2. Partitioned invariant — strings without @ always fail (confidence: HIGH)
fc.assert(fc.property(
  fc.string().filter(s => !s.includes('@')),
  (notEmail) => {
    expect(validateEmail(notEmail)).toBe(false);
  }
));
```

**Caveats:** The test named `'validates a@b'` (minimal valid email) may be intentionally testing a boundary condition — verify this is data variation (another valid format) rather than a behavior test (minimum-length edge case). If the latter, keep it separate with a descriptive name.

### Detail: Discount Calculator Cluster

**Cluster:** 4 test blocks calling `calculateDiscount(price, pct)`, differing only in price and percentage values. Outputs clearly grow as inputs grow.

**Invariant:** `expect(calculateDiscount(price, pct)).toBe(expected)`
**Variant:** `(price, pct, expected)` triples

**Property proposals:**

```typescript
// 1. Model-based — matches naïve formula (confidence: HIGH)
// Note: use toBeCloseTo for float math; use toBe if implementation uses integer cents.
fc.assert(fc.property(
  fc.float({ min: 0, max: 10_000, noNaN: true }),
  fc.float({ min: 0, max: 100, noNaN: true }),
  (price, pct) => {
    const expected = price * (1 - pct / 100);
    expect(calculateDiscount(price, pct)).toBeCloseTo(expected, 5);
  }
));

// 2. Monotonicity — larger discount → lower price (confidence: HIGH)
fc.assert(fc.property(
  fc.float({ min: 0, max: 10_000, noNaN: true }),
  fc.tuple(
    fc.float({ min: 0, max: 100, noNaN: true }),
    fc.float({ min: 0, max: 100, noNaN: true }),
  ).filter(([a, b]) => a < b),
  (price, [smallerPct, largerPct]) => {
    expect(calculateDiscount(price, smallerPct))
      .toBeGreaterThanOrEqual(calculateDiscount(price, largerPct));
  }
));
```

## Expected Results

- A prioritized backlog of test refactoring opportunities
- Framework-correct parameterized test skeletons ready to apply
- PBT proposals that probe input space the hand-written examples leave uncovered
- Code-free: no files are modified
- Flagged ambiguous cases for human review before applying

## Variations

**For a specific pattern only:**
```
Only scan for Lazy Test clusters on validator functions.
Ignore other clusters.
```

**For large test suites (chunked scan):**
```
Scan only test files modified in the last 30 days.
I'll provide: git log --name-only --since="30 days ago" -- '*.test.*'
```

**PBT library not installed:**
```
No PBT library is installed. Propose parameterized tests only.
Include a note on which PBT library to install per framework:
Jest → fast-check, pytest → Hypothesis, Go → gopter or rapid,
JUnit 5 → jqwik, RSpec → rantly.
```

## References

- [research-finding-test-parameterization-pbt-pipeline.md] — the research this prompt operationalizes (three-stage pipeline, property taxonomy, framework survey)
- [prompt-task-abstraction-miner.md] — the production-code counterpart (same Fabbro Loop applied to non-test code)
- [prompt-task-test-friction-diagnostician.md] — upstream diagnostic: if tests are hard to write, diagnose *why* before mining for parameterization opportunities

### Source Research

- van Deursen et al., "Refactoring Test Code" (XP2001) — Lazy Test smell taxonomy
- Meszaros, *xUnit Test Patterns* — Parameterized Test pattern
- Scott Wlaschin, "Choosing Properties for PBT" (F# for Fun and Profit)
- Johannes Link, "How to Specify It! In Java!"
- Hillel Wayne, "Metamorphic Testing"
- ScienceDirect 2021 comparative study — test code contains 2× clone density of production code

## Version History

- 1.1.0 (2026-03-04): RO5U review fixes — resolved PBT-library-not-found contradiction (Phase 0 now explicit: prose only, no code), added cross-file cluster counting (Phase 1), moved framework syntax blocks out of Phase 3 into standalone Framework Reference section, fixed RSpec example to idiomatic form, added float-precision note to calculateDiscount property example
- 1.0.0 (2026-03-03): Initial extraction from research-finding-test-parameterization-pbt-pipeline.md
