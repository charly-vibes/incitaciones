# Deliberate Commit Templates

Use these templates to communicate with the user and format your commits.

## User Summary Template

Present this to the user before committing any files.

```markdown
I've made changes to the following files:

1. [Path to File]
   - [Short bullet list of changes]
   - [Short bullet list of changes]

2. [Path to File]
   - ...

These changes can be grouped into logical commits:

**Commit 1: "[Proposed Commit Title]"**
- [File 1]
- [File 2]

**Commit 2: "[Proposed Commit Title]"**
- [File 3]

Shall I proceed with these commits?
```

## Commit Message Template

Use this format for the actual `git commit -m` command.

```markdown
<type>(<scope>): <short description>

<detailed description of what and why - explain the rationale for the change>

- Key change 1
- Key change 2
- Key change 3 (focus on the 'why' not just the 'what')
```

**Types:** add, update, fix, refactor, docs, test, chore.
**Scope:** The part of the system being changed (e.g., auth, ui, api, core).
