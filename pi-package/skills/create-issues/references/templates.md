# Issue Creation Templates

Use these templates for issue descriptions and the final creation summary.

## Issue Description Template

```markdown
**Context:** [Brief explanation, e.g., "Implement JWT validation as defined in Phase 2 of the Auth Plan."]
Ref: [Link to plan file and section]

**Files:**
- `path/to/file1`
- `path/to/file2`

**Acceptance Criteria:**
- [ ] [Verifiable step 1]
- [ ] [Verifiable step 2]
- [ ] [Automated tests covering the change]

---
**CRITICAL: Follow Test Driven Development and Tidy First workflows.**
- Write tests *before* writing implementation code.
- Clean up related code *before* adding new functionality.
```

## Issue Creation Summary Template

```markdown
## Issue Creation Summary

**System:** [e.g., GitHub/Beads]
**Plan:** [path/to/plan.md]

### Summary
- **Total Issues Created:** [count]
- **Dependencies Defined:** [count]

### Created Issues
1. **[ID] [Title]** - [Link/Reference]
2. **[ID] ...**

### Verdict: [ISSUES_CREATED | FAILED_TO_CREATE]
**Rationale:** [1-2 sentences explaining the result]
```
