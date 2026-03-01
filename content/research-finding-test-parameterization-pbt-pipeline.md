---
title: Test Abstraction Pipeline — From Lazy Tests to Property-Based Testing
type: research
subtype: finding
tags: [testing, parameterization, property-based-testing, test-smells, abstraction-miner, resonant-coding, tdd, lazy-test]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-02-28
updated: 2026-02-28
version: 1.0.0
related: [prompt-task-abstraction-miner.md, research-paper-resonant-coding-agentic-refactoring.md, prompt-workflow-plan-implement-verify-tdd.md]
source: synthesis
---

# Test Abstraction Pipeline: From Lazy Tests to Property-Based Testing

## Summary

Test code accumulates twice as many clones as production code (ScienceDirect, 2021), yet the existing Abstraction Miner operates on production code only. This research documents a three-stage pipeline that extends the Abstraction Miner's Fabbro Loop to test code: (1) detect test clusters via the "Lazy Test" smell, (2) propose parameterized tests with explicit invariant/variant splits, (3) escalate to property-based tests by reading the data table for generative signals. The pipeline produces a layered output — parameterized test skeleton + PBT proposals — that subsumes manual test curation with systematic coverage.

## Context

When looking at a test suite grown through vibe coding or rapid iteration, the same duplication problem the Abstraction Miner targets in production code appears — but with a different shape. Instead of three functions doing the same API fetch, you see ten `it` blocks all calling the same validator with different string literals, or five `@Test` methods differing only in which integer they pass. These "Lazy Tests" (van Deursen et al., 2001) are semantically one parameterized test pretending to be many.

The question this research answers: **how should the Abstraction Miner's protocol change when the target is test code instead of production code?** And once test duplication is collapsed into a data table, what does that table reveal about the implementation that property-based testing can systematically probe?

## Hypothesis / Question

The existing Abstraction Miner phases (Semantic Scanning → Cluster Analysis → Abstraction Proposal → Refactoring Blueprint) can be extended with two additional layers when applied to test files:

1. **Test Cluster Detection**: apply the cluster analysis specifically to test structure (same SUT, same assertion shape, only literals differ)
2. **Property Escalation**: read the collapsed data table and infer generators + property types from the row patterns

These two layers, when added to the Abstraction Miner protocol, produce actionable proposals for parameterized tests and PBT specs without requiring the practitioner to know PBT patterns in advance.

## Method

Synthesis from three bodies of knowledge:

1. **Test smell literature**: van Deursen et al. "Refactoring Test Code" (XP2001, foundational taxonomy of 11 test smells), Meszaros "xUnit Test Patterns" (Parameterized Test pattern and Test Code Duplication smell), William Wake (xp123.com, practical rules for extracting parameterized tests), ScienceDirect 2021 comparative study on clone prevalence in test vs. production code

2. **Parameterized test frameworks**: Jest `test.each` (JS/TS), pytest `@pytest.mark.parametrize` (Python), Go table-driven tests, JUnit 5 `@ParameterizedTest`, RSpec `shared_examples`, rstest crate (Rust) — analyzing how each splits invariant from variant structurally

3. **PBT literature**: Scott Wlaschin "Choosing Properties for PBT" (F# for Fun and Profit), Johannes Link "How to Specify It! In Java!", Hillel Wayne "Metamorphic Testing", Hypothesis docs, fast-check docs, jqwik docs — specifically the property taxonomy and the signals for inferring property types from example sets

## Results

### Key Findings

1. **Test code contains 2x the clone density of production code**, and test clones are predominantly Type II (renamed) and Type III (near-miss) — exactly the semantic equivalence that the Abstraction Miner is designed to detect.

2. **The primary test duplication signal is "Lazy Test"**: multiple test methods that call the same production function, use the same assertion type, and differ only in literal values. This is structurally identical to the Invariant/Variant split in production code clusters.

3. **The Rule of Three applies**: N ≥ 3 test methods is the threshold for recommending parameterization. At N = 2 it is worth noting; at N ≥ 4 it is unambiguous.

4. **Seven property types cover almost all cases**: Invariant, Round-trip, Idempotency, Commutativity, Associativity, Monotonicity, Metamorphic — plus Model-based and Robustness as additional catch-alls.

5. **Property types can be inferred mechanically from data table structure**. The type-pair `(T, T)` suggests idempotency or commutativity; `(T, U)` where U is clearly derived from T suggests model-based or metamorphic; outputs that are uniformly boolean on distinct input classes suggest partitioned invariants.

6. **Function names are strong priors**: `normalize`, `format`, `sort`, `deduplicate` → idempotency; `encode`/`decode`, `serialize`/`deserialize` → round-trip; `validate`, `is_valid`, `check` → partitioned invariant; mathematical operations → commutativity/associativity.

---

## The Three-Stage Pipeline

### Stage 1: Test Cluster Detection

**Goal**: Find groups of test methods that are one parameterized test in disguise.

**Detection signals** (in priority order):

| Signal | Strength | Example |
|--------|----------|---------|
| Same SUT (function/method called) | Primary | All tests call `validate(input)` |
| Same assertion type/structure | Confirmation | All use `assertEquals(expected, result)` |
| Only literals differ | Differentiator | Only string/number values change |
| Same setup/teardown shape | Supporting | Same `beforeEach` calls, different values |

**Minimum threshold**: N ≥ 3 tests forming a cluster (Rule of Three). At N = 2, note as a candidate but do not mandate parameterization.

**Critical distinction**: tests addressing genuinely different *behaviors* (error path vs. success path vs. auth failure) should stay separate even if they call the same function. Only data variations (same code path, different inputs) warrant collapsing.

**The diagnostic question**: Can you diff two test methods and find only literal constant differences? If yes, they form a cluster.

---

### Stage 2: Parameterization Proposal

**Goal**: Produce the data table (variant) + test template (invariant) for the cluster.

**Framework-specific output to propose**:

**JavaScript/TypeScript (Jest):**
```typescript
// BEFORE (cluster of 3):
test('validates user@example.com', () => {
  expect(validateEmail('user@example.com')).toBe(true);
});
test('validates admin@domain.org', () => {
  expect(validateEmail('admin@domain.org')).toBe(true);
});
test('rejects "not-email"', () => {
  expect(validateEmail('not-email')).toBe(false);
});

// AFTER (parameterized):
test.each([
  { input: 'user@example.com',  expected: true  },
  { input: 'admin@domain.org',  expected: true  },
  { input: 'not-email',         expected: false },
])('validateEmail($input) → $expected', ({ input, expected }) => {
  expect(validateEmail(input)).toBe(expected);  // invariant
});
```

**Python (pytest):**
```python
# AFTER:
@pytest.mark.parametrize("input,expected", [
    ("user@example.com", True),
    ("admin@domain.org", True),
    ("not-email",        False),
])
def test_validate_email(input, expected):
    assert validate_email(input) == expected  # invariant
```

**Go (table-driven):**
```go
func TestValidateEmail(t *testing.T) {
    tests := []struct {
        name     string
        input    string
        expected bool
    }{
        {"valid user email",   "user@example.com", true},
        {"valid admin email",  "admin@domain.org", true},
        {"invalid no at-sign", "not-email",        false},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            if got := validateEmail(tt.input); got != tt.expected {
                t.Errorf("validateEmail(%q) = %v, want %v", tt.input, got, tt.expected)
            }
        })
    }
}
```

**Java (JUnit 5):**
```java
@ParameterizedTest
@CsvSource({
    "user@example.com, true",
    "admin@domain.org, true",
    "not-email,        false",
})
void testValidateEmail(String input, boolean expected) {
    assertEquals(expected, validateEmail(input));  // invariant
}
```

**The structural rule**: what goes in the data table (variant) is everything that changes across test cases. What stays in the test body (invariant) is the call to the SUT and the assertion structure.

---

### Stage 3: Property Escalation

**Goal**: Read the collapsed data table and propose property-based tests that generalize beyond the explicit examples.

**The decision tree for property type selection**:

```
What is the type relationship between input and output?

(T → T): same type
  ├── f(f(x)) could equal f(x) for all rows?  → Idempotency
  ├── f(a,b) == f(b,a) for mirrored rows?      → Commutativity
  └── Otherwise                                 → Invariant on output shape

(T → bool): validator/predicate
  ├── Inputs cluster into valid/invalid groups? → Partitioned invariant
  └── Otherwise                                 → Invariant for each partition

(T → U, U → T): inverse functions exist?       → Round-trip

(T → numeric): aggregation
  ├── Output grows as input grows?              → Monotonicity
  └── Output derivable by simpler formula?      → Model-based

Row-to-row relationships:
  ├── Row N input = Row N-1 input + extra element?   → Metamorphic (count/membership)
  ├── Row N input = Row N-1 input scaled/negated?    → Metamorphic (algebraic)
  └── Row N's expected = Row N-1's input via f?      → Idempotency confirmation
```

**Property taxonomy with signals**:

| Property Type | Pattern in Data Table | Generator Design |
|---------------|----------------------|-----------------|
| **Invariant** | All valid inputs → same output shape/range | `st.text()` / `fc.string()` over valid domain |
| **Partitioned Invariant** | Two groups: valid→True, invalid→False | Separate generators per partition |
| **Round-trip** | encode/decode, serialize/parse pairs | Generator for base type, apply encode for input |
| **Idempotency** | Output could be input again without change | `fc.array(fc.integer())`, apply f twice |
| **Commutativity** | Mirrored rows with swapped args, same output | `fc.tuple(fc.integer(), fc.integer())` |
| **Monotonicity** | As input grows, output consistently grows | `st.integers(min_value=0)` with `assume(a>=b)` |
| **Model-based** | Expected values match a known formula | Generator for input, use stdlib/naïve as oracle |
| **Metamorphic** | Row pairs: input changes → output changes predictably | Generator + transform: `xs + [extra_element]` |

**Worked example — from data table to properties**:

Given this parameterized test:
```python
@pytest.mark.parametrize("items,total", [
    ([],            0),
    ([10],          10),
    ([10, 20],      30),
    ([10, 20, 30],  60),
    ([10, 10, 10],  30),
])
def test_cart_total(items, total):
    assert ShoppingCart(items).total() == total
```

**Reading the table**:
- Type: `(list[int] → int)` — aggregation
- Empty list → 0 (identity element)
- Output matches `sum(items)` (model-based signal)
- Row 3 = row 2 + one more element, and output increases by that element (metamorphic signal)
- Duplicate items are counted separately (not deduplicated)

**Derived property proposals**:

```python
# 1. Model-based: total matches Python's sum
@given(st.lists(st.integers(min_value=0, max_value=10_000), max_size=100))
def test_cart_total_matches_sum(items):
    assert ShoppingCart(items).total() == sum(items)

# 2. Metamorphic: adding an item increases total by that item's price
@given(st.lists(st.integers(min_value=0, max_value=10_000)),
       st.integers(min_value=0, max_value=10_000))
def test_adding_item_increases_total(items, new_price):
    before = ShoppingCart(items).total()
    after = ShoppingCart(items + [new_price]).total()
    assert after == before + new_price

# 3. Commutativity: item order does not affect total
@given(st.lists(st.integers(min_value=0, max_value=10_000)))
def test_total_order_independent(items):
    shuffled = sorted(items, reverse=True)  # deterministic shuffle
    assert ShoppingCart(items).total() == ShoppingCart(shuffled).total()

# 4. Invariant: total is non-negative when all prices are non-negative
@given(st.lists(st.integers(min_value=0, max_value=10_000)))
def test_total_non_negative(items):
    assert ShoppingCart(items).total() >= 0
```

**TypeScript (fast-check) equivalent**:
```typescript
// Model-based
fc.assert(fc.property(
  fc.array(fc.integer({ min: 0, max: 10_000 }), { maxLength: 100 }),
  items => {
    const total = new ShoppingCart(items).total();
    expect(total).toBe(items.reduce((s, p) => s + p, 0));
  }
));

// Metamorphic
fc.assert(fc.property(
  fc.array(fc.integer({ min: 0, max: 10_000 })),
  fc.integer({ min: 0, max: 10_000 }),
  (items, newPrice) => {
    const before = new ShoppingCart(items).total();
    const after = new ShoppingCart([...items, newPrice]).total();
    expect(after).toBe(before + newPrice);
  }
));
```

---

## Function Name Priors (Strong Signals for Property Type)

| Function name pattern | Likely property type |
|----------------------|---------------------|
| `normalize`, `clean`, `format`, `deduplicate`, `sort` | **Idempotency**: `f(f(x)) == f(x)` |
| `encode`/`decode`, `serialize`/`deserialize`, `compress`/`decompress` | **Round-trip**: `decode(encode(x)) == x` |
| `validate`, `is_valid`, `check`, `matches` | **Partitioned invariant**: valid inputs → True, invalid → False |
| `add`, `merge`, `concat`, `union` (binary op) | **Commutativity + Associativity** |
| Mathematical ops on ordered domains | **Monotonicity** |
| `fast_sort`, `optimized_*`, renamed algorithm | **Model-based**: compare against naive/stdlib |
| `filter`, `search`, `query` (with extra constraint param) | **Metamorphic**: narrower filter → subset of results |

---

## Extension Protocol for the Abstraction Miner

When the Abstraction Miner is applied to test files, the four-phase Fabbro Loop gains two additional phases:

### Phase 0 (Pre-scan): Identify file as test code
- Detect test file markers: `*.test.ts`, `*_test.go`, `*_spec.rb`, `test_*.py`, `@Test` annotations
- Switch to test-mode cluster detection (Phases 1-2 use test-specific signals)
- Production code cluster rules (≥3 occurrences, ~10 lines saved) still apply, but the *what to look for* changes

### Phase 1 (Test): Semantic Scanning of test structure
Instead of looking for "identical intent across production functions", look for:
- Groups of test methods calling the same production function/method
- Identical assertion structure across the group
- Only literal values differing within the group

### Phase 2 (Test): Cluster Analysis with test-specific invariant/variant
- **Invariant**: the test setup shape + SUT call + assertion structure
- **Variant**: the literal values plugged into the setup, the call arguments, and the expected output
- **Cluster rule**: N ≥ 3 tests forming a Lazy Test cluster (Rule of Three)
- **Rejection condition**: if differences include control flow, assertion type, or which SUT is called → not a cluster, flag for "Needs Human Review"

### Phase 3 (Test): Parameterization Proposal
- Propose the data table (variant) extracted from the cluster
- Propose the test template (invariant) in the project's framework syntax
- Show one before/after diff
- Flag: are test case names meaningful? (if yes, recommend `name` field / `pytest.param(..., id=...)`)

### Phase 4 (Test): Property Escalation Proposal
- Apply the decision tree to the proposed data table
- For each inferred property type, propose a concrete property test in the project's PBT framework
- Rank proposals by confidence: Model-based and Metamorphic first (easiest to derive mechanically), Invariant second, others as applicable
- Flag: "These properties probe edge cases the data table cannot cover" — the key value statement for PBT

### Stop Conditions (Test Mode)
- All test files scanned
- All Lazy Test clusters with N ≥ 3 reported
- For each cluster: parameterization proposal + at least one property escalation proposal
- If no clusters: output "No Lazy Test clusters found (N ≥ 3) in the scanned test files. Test suite appears parametrically resonant."

---

## Analysis

### Why Test Duplication Matters Differently

Production code duplication increases maintenance burden when logic changes. Test duplication adds a different cost: it inflates the apparent comprehensiveness of a test suite without increasing actual coverage. Ten Lazy Tests for the same validator feel thorough but leave the same input space uncovered as two.

Property-based tests invert this: a single well-written property explores more of the input space than hundreds of hand-crafted examples. The pipeline from Lazy Test → parameterized → PBT is therefore a quality multiplier, not just a style improvement.

### The PBT Escalation is Advisory

Not every parameterized test needs a PBT equivalent. The escalation proposals are advisory:
- If the data table inputs were carefully hand-chosen for specific behaviors (regression tests, documented edge cases), parameterization is the right endpoint — PBT would not add much.
- If the inputs look arbitrary or exploratory (testing "a few valid emails"), PBT adds systematic coverage.
- The agent should flag which category each cluster falls into.

### False Equivalence Risk in Test Mode

The same "needs human review" concern from production code applies to tests. Two test methods may call the same function but exercise different code paths (e.g., happy path vs. edge case). Collapsing them into a parameterized test would hide the intent of each test case. The agent must distinguish:

- **Data variation** (same code path, different inputs) → parameterize
- **Behavioral variation** (different code paths, different expected outcomes) → keep separate, name clearly

The signal: if the test names describe *behaviors* ("should reject null", "should reject expired", "should reject malformed"), keep them separate. If test names describe *inputs* ("testValidate_foo", "testValidate_bar"), they are data variations.

---

## Practical Applications

- Extends `prompt-task-abstraction-miner.md` with a "test mode" that targets Lazy Test clusters
- Provides the framework-specific parameterized test templates an agent needs to output concretely (Jest, pytest, Go, JUnit 5)
- Gives the property taxonomy and decision tree for the PBT escalation phase
- The function name priors are a quick heuristic that can be applied before reading any test code

## Limitations

1. **Framework detection requires project context**: the agent needs to know which test framework and PBT library the project uses. This should be provided as input (or inferred from `package.json`, `requirements.txt`, `go.mod`).

2. **Behavioral vs. data variation is ambiguous**: the agent cannot always distinguish them from code alone. The "Needs Human Review" section is critical for cases where test names are vague.

3. **PBT framework availability**: not all projects have a PBT library installed. The agent should check before proposing `@given` or `fc.assert` — and if no PBT framework exists, recommend installation as a prerequisite.

4. **Generator composition complexity**: for tests with correlated inputs (lo < hi, user must exist before order), the agent needs to propose `@composite` / `fc.chain` generators, which require understanding the domain constraints. This is a harder inference than simple partition-based generators.

5. **Property correctness is unverified**: the agent proposes properties but cannot verify they are true. The "Needs Human Review" section must include proposed properties where the agent is not confident they hold for all inputs in the domain.

## Related Prompts

- [prompt-task-abstraction-miner.md] — the prompt this research extends (test mode addition)
- [research-paper-resonant-coding-agentic-refactoring.md] — foundational framework; the failure mode "False semantic equivalence requires falsification tests" is directly addressed here
- [prompt-workflow-plan-implement-verify-tdd.md] — parameterized and property tests are the "verify" layer in TDD

## References

### Test Smells and Parameterization
- [Refactoring Test Code — van Deursen et al. 2001](https://www.researchgate.net/publication/2534882_Refactoring_Test_Code) — canonical test smell taxonomy
- [Test Code Duplication — xunitpatterns.com](http://xunitpatterns.com/Test%20Code%20Duplication.html)
- [Parameterized Test — xunitpatterns.com](http://xunitpatterns.com/Parameterized%20Test.html)
- [Extracting Parameterized Unit Tests — xp123.com (William Wake)](https://xp123.com/extracting-parameterized-unit-tests/)
- [Automated Clone Elimination in Python Tests — ISoLA 2024](https://link.springer.com/chapter/10.1007/978-3-031-75387-9_7)
- [A Comparative Study of Test Code Clones vs Production — ScienceDirect 2021](https://www.sciencedirect.com/science/article/abs/pii/S0164121221000376)
- [Rule of Three — Wikipedia](https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming))

### Parameterized Test Frameworks
- [Jest API — test.each](https://jestjs.io/docs/api)
- [pytest parametrize docs](https://docs.pytest.org/en/stable/how-to/parametrize.html)
- [Go Wiki: TableDrivenTests](https://go.dev/wiki/TableDrivenTests)
- [Prefer Table Driven Tests — Dave Cheney](https://dave.cheney.net/2019/05/07/prefer-table-driven-tests)
- [JUnit 5 Parameterized Tests — Baeldung](https://www.baeldung.com/parameterized-tests-junit-5)
- [rstest docs](https://docs.rs/rstest/latest/rstest/index.html)
- [RSpec shared_examples](https://rspec.info/features/3-13/rspec-core/example-groups/shared-examples/)

### Property-Based Testing
- [Choosing Properties for PBT — F# for Fun and Profit](https://fsharpforfunandprofit.com/posts/property-based-testing-2/)
- [How to Specify It! In Java! — Johannes Link](https://johanneslink.net/how-to-specify-it/)
- [Metamorphic Testing — Hillel Wayne](https://www.hillelwayne.com/post/metamorphic-testing/)
- [Property-Based Testing Patterns — ssanj.net](https://blog.ssanj.net/posts/2016-06-26-property-based-testing-testing-patterns.html)
- [Hypothesis docs](https://hypothesis.readthedocs.io/)
- [fast-check GitHub](https://github.com/dubzzz/fast-check)
- [jqwik — Property-Based Testing for Java](https://jqwik.net/property-based-testing.html)
- [Agentic PBT: Finding Bugs Across the Python Ecosystem — arXiv 2510.09907](https://arxiv.org/html/2510.09907v1)

## Future Research

1. **Automated cluster detection prompt**: build a dedicated "Test Abstraction Miner" prompt (separate from the production code version) with test-mode phases explicitly specified

2. **Framework auto-detection**: how should the agent detect which test framework and PBT library a project uses from project metadata? What fallback when none is installed?

3. **Behavioral vs. data variation classification**: is there a reliable heuristic beyond test name analysis? Could AST-level branching analysis help?

4. **PBT suggestion quality**: empirically evaluate whether LLM-proposed properties are correct and non-trivial. The arXiv 2510.09907 paper on agentic PBT is a starting point.

5. **Integration with Resonant Refactor**: once a Lazy Test cluster is identified, the Resonant Refactor skill could apply the parameterization automatically — closing the loop on the test side of the Fabbro Loop.

## Version History

- 1.0.0 (2026-02-28): Initial synthesis from test smell literature, parameterized test framework survey, and PBT property taxonomy research
