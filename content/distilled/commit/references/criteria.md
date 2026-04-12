# Deliberate Commit Criteria

Use these criteria to evaluate the quality of a commit.

## Good vs. Bad Commit Examples

| Feature | ✅ Good Approach | ❌ Bad Approach |
| :--- | :--- | :--- |
| **Commit Size** | Atomic: one logical change (e.g., a bug fix OR a refactor). | Mega-commit: multiple unrelated changes. |
| **`git add`** | Explicit: `git add src/auth/oauth.ts` | Implicit: `git add .` or `git add -A` |
| **Commit Message** | Rationale: Explain WHY the change was made. | Summary: "Updates", "Fixes bug", "Refactor". |
| **Attribution** | Clear: Authored by the user. | AI-attributed: "Committed by AI". |

## Commit Quality Checklist

- [ ] Reviewed git diff for each file.
- [ ] Grouped changes logically.
- [ ] Written descriptive commit message with context.
- [ ] Used explicit file paths in `git add`.
- [ ] No co-author or AI attribution in commit message.
- [ ] Commit message explains "why" (rationale), not just "what" (summary).
