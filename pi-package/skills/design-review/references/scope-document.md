## Scope Document Review

### Check 1: Explicit Non-Goals

Question: Are out-of-scope items explicitly listed?

Output:

```text
Explicit Non-Goals: [CLEAR | PARTIAL | MISSING]

Missing non-goals:
- [Related item that might get added]
- [Adjacent problem that might expand scope]
```

### Check 2: Constraint Realism

Question: Are the constraints achievable and honest?

Look for:
- Conflicting constraints
- Unstated constraints
- Over-optimistic assumptions

Output:

```text
Constraint Realism: [REALISTIC | CONFLICTED | INCOMPLETE]

Conflicts:
- [Constraint A] vs [Constraint B]: [Why they conflict]

Unstated constraints:
- [What is missing but materially affects the work]
```

### Verdict Template

```text
## Scope Document Review Summary

| Check | Result | Action Needed |
|-------|--------|---------------|
| Non-Goals | [CLEAR/PARTIAL/MISSING] | [Action or "None"] |
| Constraints | [REALISTIC/CONFLICTED/INCOMPLETE] | [Action or "None"] |

Verdict: [READY_FOR_PLANNING | NEEDS_REVISION]
Top Issue: [Most critical thing to fix]
Recommended Action: [Specific next step]
```
