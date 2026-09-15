## Decision Matrix Review

### Check 1: Status Quo Baseline

Question: Is "do nothing" the first column?

Output:

```text
Status Quo Baseline: [PRESENT | MISSING]

If missing:
- Impact: Cannot compare alternatives to current state
- Fix: Add Status Quo column with honest assessment
```

### Check 2: Fact vs. Judgment Separation

Question: Is cell text factual and neutral, with judgment shown separately?

Contaminated cells:
- "Good performance"
- "Easy to implement"
- "Better than X"

Clean cells:
- "< 10ms p99 latency"
- "Requires changes to 3 files"
- "Uses existing auth pattern"

Output:

```text
Fact/Judgment Separation: [CLEAN | CONTAMINATED]

Contaminated cells:
| Row | Column | Current Text | Factual Rewrite |
|-----|--------|--------------|-----------------|
| [Row] | [Col] | "[Text]" | "[Suggestion]" |

Assessment indicators:
- Are judgments shown via color or symbol, not text? [YES/NO]
```

### Check 3: Criteria Completeness

Question: Are all relevant trade-off dimensions represented?

Common missing criteria:
- Maintenance burden
- Rollback difficulty
- Team expertise
- Integration complexity
- Failure modes

Output:

```text
Criteria Completeness: [COMPLETE | GAPS]

Present criteria: [List]

Potentially missing:
- [Criterion]: [Why it matters]
- [Criterion]: [Why it matters]

Recommendation:
- [Which criteria to add]
```

### Check 4: Approach Diversity

Question: Are the approaches fundamentally different, or variations of the same idea?

Output:

```text
Approach Diversity: [DIVERSE | SIMILAR]

Approaches listed:
- [Approach 1]: [Category]
- [Approach 2]: [Category]
- [Approach 3]: [Category]

Missing perspectives:
- [What category of solution was not considered]
```

### Check 5: Cell Verification

Question: Are the facts in the matrix verifiable and accurate?

Output:

```text
Cell Verification: [VERIFIED | MIXED | UNVERIFIED]

Verified cells:
- [Cell Row/Col]: [Claim] -> [Verification result]

Incorrect or unsupported cells:
- [Cell]: [What's wrong and what's correct]
```

### Verdict Template

```text
## Decision Matrix Review Summary

| Check | Result | Action Needed |
|-------|--------|---------------|
| Status Quo | [PRESENT/MISSING] | [Action or "None"] |
| Fact/Judgment | [CLEAN/CONTAMINATED] | [Action or "None"] |
| Criteria | [COMPLETE/GAPS] | [Action or "None"] |
| Diversity | [DIVERSE/SIMILAR] | [Action or "None"] |
| Verification | [VERIFIED/MIXED/UNVERIFIED] | [Action or "None"] |

Verdict: [READY_FOR_DECISION | NEEDS_REVISION | NEEDS_MORE_OPTIONS]
Selected approach justified? [YES/NO]
Top Issue: [Most critical thing to fix]
Recommended Action: [Specific next step]
```
