---
name: create-handoff
description: "Compiled alias of the handoff document mode of the session skill. Hidden from model invocation; invocable via /skill:create-handoff; serves the legacy site URL with full compiled content."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.10.1"
  internal: true
---
> **Moved:** this entry is now the **create-handoff** mode of the **session** skill.
> The full method is compiled below from `content/distilled/session/references/create-handoff/SKILL.md`.
> Invoke via `/skill:create-handoff`, invoke `/skill:session` for the mode table,
> or use this URL directly in a chat interface.

#### Core Instructions (content/distilled/session/references/create-handoff/SKILL.md)

# Create Handoff Document

Create a concise handoff document for another agent session.

## Procedure

1. Gather current repository metadata.
2. Choose a handoff filename using `references/naming.md`.
3. Write the document using `references/handoff-template.md`.
4. Tell the user where the handoff was written and how to resume from it.

## Rules

- Be specific and include file references where they matter.
- Capture decisions, learnings, and next steps, not just a task list.
- Reference artifacts instead of copying large code blocks.

---

#### Reference: references/handoff-template.md

```markdown
---
date: [ISO timestamp with timezone]
git_commit: [short hash]
branch: [branch name]
directory: [working directory]
issue: [issue-123 if applicable]
status: handoff
---

# Handoff: [brief description]

## Context

[1-2 paragraph overview]

## Current Status

### Completed
- [x] [Task with file references]

### In Progress
- [ ] [Task with current state]

### Planned
- [ ] [Next task]

## Critical Files

1. `path/to/file.ext:123` - [Why it matters]
2. `path/to/file.ext:456` - [Why it matters]

## Recent Changes

- `path/to/file.ext:123` - [What changed]

## Key Learnings

1. [Learning]
   - Evidence: [file reference or reasoning]

## Open Questions

- [ ] [Unresolved question]

## Next Steps

1. [Priority action]

## Artifacts

New files:
- `path/to/new-file.ext`

Modified files:
- `path/to/modified-file.ext`

## Related Links

- [Relevant documentation, plan, or discussion]

## Additional Context

[Anything another session needs immediately]
```

---

#### Reference: references/naming.md

## Handoff Naming

Create files at `handoffs/YYYY-MM-DD_HH-MM-SS_description.md`

Examples:
- `handoffs/2026-01-12_14-30-00_issue-123_add-oauth.md`
- `handoffs/2026-01-12_14-30-00_refactor-auth-system.md`
