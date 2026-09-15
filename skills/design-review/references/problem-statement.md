## Problem Statement Review

### Check 1: Solution Contamination

Question: Does the problem statement contain or imply solutions?

Red flags:
- "We need to..."
- Technology names unless they are the problem
- "Add", "implement", "create", "build"
- Comparisons to how other systems work

Test:
- YES: multiple fundamentally different solutions fit the statement -> clean
- NO: the solution is embedded -> contaminated

Output:

```text
Solution Contamination: [CLEAN | CONTAMINATED]

Evidence:
- [Quote from statement showing contamination, or "None found"]

Recommendation:
- [How to remove solution language]
```

### Check 2: Root Cause vs. Symptom

Question: Does this describe the mechanism, or just the observable effect?

Symptom language:
- "Users experience..."
- "The system is slow/broken/failing..."
- "Errors occur when..."

Mechanism language:
- "Because X happens, Y results in Z"
- "The [component] does [action] which causes [effect]"
- Clear causal chain

Test: Ask "Why?" If there is a deeper answer, this is still a symptom.

Output:

```text
Root Cause Analysis: [MECHANISM | SYMPTOM | UNCLEAR]

Depth check:
- Statement says: [quote]
- Ask "Why?": [deeper cause if exists]
- Assessment: [Is this the root or just a layer?]

Recommendation:
- [How to dig deeper, or "Root cause identified"]
```

### Check 3: Specificity

Question: Is the problem precise enough to guide solution selection?

Vague indicators:
- "Performance issues"
- "Users are confused"
- "The code is messy"

Specific indicators:
- Quantified thresholds
- Named components
- Reproducible conditions

Output:

```text
Specificity: [PRECISE | VAGUE | MIXED]

Vague elements:
- [Element 1]: [How to make specific]
- [Element 2]: [How to make specific]

Missing specifics:
- [What metric, threshold, or condition is unclear]
```

### Check 4: Evidence Quality

Question: Is the diagnosis based on verified facts or assumptions?

Look for:
- Evidence cited for each claim
- Ruled-out alternatives
- Hypothesis testing
- Data sources

Output:

```text
Evidence Quality: [VERIFIED | ASSUMED | MIXED]

Claims without evidence:
- [Claim 1]: [What evidence is needed]
- [Claim 2]: [What evidence is needed]

Ruled-out alternatives:
- [Listed? How many? Are they reasonable alternatives?]
```

### Check 5: The Obvious Solution Test

Question: Does the solution feel obvious after reading this statement?

Output:

```text
Obvious Solution Test: [PASS | FAIL | PARTIAL]

After reading, the obvious action is: [What seems like the right solution]

If FAIL:
- What's unclear: [What question remains]
- What's missing: [What would make it obvious]
```

### Verdict Template

```text
## Problem Statement Review Summary

| Check | Result | Action Needed |
|-------|--------|---------------|
| Solution Contamination | [CLEAN/CONTAMINATED] | [Action or "None"] |
| Root Cause | [MECHANISM/SYMPTOM] | [Action or "None"] |
| Specificity | [PRECISE/VAGUE] | [Action or "None"] |
| Evidence | [VERIFIED/ASSUMED] | [Action or "None"] |
| Obvious Solution | [PASS/FAIL] | [Action or "None"] |

Verdict: [READY_FOR_DIRECTION | NEEDS_REVISION | BACK_TO_DESCRIBE]
Top Issue: [Most critical thing to fix]
Recommended Action: [Specific next step]
```
