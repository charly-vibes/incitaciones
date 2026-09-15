## Locating a Handoff

Examples:

```bash
# List recent handoffs
ls -lt handoffs/ | head -10

# Find handoffs for a specific issue
ls handoffs/*issue-123* | sort -r | head -1
rg -n "issue: issue-123" handoffs/*.md
```
