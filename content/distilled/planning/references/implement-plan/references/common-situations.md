## Common Situations

### Tests already pass

- Verify the implementation really matches the plan.
- Mark the phase complete if it does.

### The plan does not match reality

Report:

```text
Issue in Phase [N]:

Expected (from plan): [What the plan says]
Found (in codebase): [Actual situation]
Why this matters: [Impact]

Options:
1. Adapt implementation to current reality
2. Update the plan
3. Ask the user for guidance
```

### A better approach appears mid-implementation

- Explain the current plan.
- Explain the alternative.
- Summarize the tradeoffs.
- Ask whether to continue or update the plan.

### External dependency is unavailable

- State what is blocked.
- Explain impact.
- List available workarounds, if any.
