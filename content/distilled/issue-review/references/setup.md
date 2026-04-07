## Gathering Issues to Review

### Beads

```bash
bd list
bd ready
bd graph
bd show <id>
bd dep tree
bd dep cycles
```

### GitHub Issues

```bash
gh issue list --label "needs-review" --json number,title,body,labels
gh issue view <number>
```

### Other systems

- Export issues to JSON or CSV.
- Use available CLI or API tooling.
- Require issue data as input before reviewing.
