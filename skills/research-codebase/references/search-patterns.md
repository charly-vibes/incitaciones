## Research Search Patterns

Use fast search tools first.

```bash
# Find auth-related files
rg --files | rg "auth"

# Search for authentication patterns
rg -n "authenticate" .
rg -n "login" .

# Look for middleware or hooks
rg -n "middleware" .
rg -n "useAuth" .

# Find configuration
rg -n "auth" config .env.example
```

Research questions usually break down into:
- Where the logic lives
- What entry points exist
- How state is managed
- Where validation happens
- How errors are handled
- What the end-to-end flow looks like
