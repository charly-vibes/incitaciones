# Rule of 5 Domain-Specific Examples

## Example 1: Code Review

**Input:**
```python
def process_users(users):
    results = []
    for user in users:
        if user.age > 18:
            results.append(user.name.upper())
    return results
```

**Output (abbreviated):**

```
STAGE 1: DRAFT
Shape Quality: GOOD - Simple function, clear structure

STAGE 2: CORRECTNESS
[CORR-001] HIGH - Line 4
Description: No null check on user.name
Evidence: Will crash if user.name is None
Recommendation: Add null check: `if user.name: results.append(user.name.upper())`

STAGE 3: CLARITY
[CLAR-001] MEDIUM - Function name
Description: "process_users" is vague
Recommendation: Rename to "get_adult_user_names_uppercase"

STAGE 4: EDGE CASES
[EDGE-001] HIGH - Line 2
Description: Empty users list not handled efficiently
Recommendation: Add early return: `if not users: return []`

STAGE 5: EXCELLENCE
Production Ready: WITH_NOTES - Fix CORR-001 and EDGE-001 first
```

## Example 2: Plan Review

**Input:** Plan for implementing user authentication

**Output (abbreviated):**

```
STAGE 1: DRAFT
Shape Quality: FAIR - Missing rollback phase and testing phase

STAGE 2: CORRECTNESS
[CORR-001] CRITICAL - Phase 3
Description: Assumes JWT library handles all validation automatically
Evidence: Most libraries require explicit error handling
Recommendation: Add error handling to Phase 3, add test for invalid tokens

STAGE 3: CLARITY
[CLAR-001] HIGH - Phase 2
Description: "Integrate with auth system" is vague
Recommendation: Specify files: "Update api/middleware/auth.ts and api/routes/protected.ts"

STAGE 4: EDGE CASES
[EDGE-001] HIGH - Overall
Description: No plan for token expiration or refresh
Recommendation: Add Phase 4 for token refresh mechanism or mark as out of scope

STAGE 5: EXCELLENCE
Production Ready: NO - Fix CORR-001 and add missing phases
```
