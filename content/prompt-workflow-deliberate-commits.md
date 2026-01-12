---
title: Deliberate Commits with Review
type: prompt
tags: [git, commits, code-review, workflow, safety]
tools: [claude-code, aider, cursor]
status: tested
created: 2026-01-12
updated: 2026-01-12
version: 1.0.0
related: [prompt-workflow-create-handoff.md, prompt-task-describe-pr.md]
source: adapted-from-fabbro-and-ace
---

# Deliberate Commits with Review

## When to Use

Use this prompt when working with an AI assistant on code changes that need to be committed to git. This ensures:
- All changes are reviewed before committing
- Commit messages are accurate and contextual
- Changes are grouped logically into focused commits
- No accidental bulk commits or vague messages

**Critical for:**
- Repositories requiring high-quality commit history
- Collaborative projects where commits communicate intent
- Any project where you can't easily revert changes
- Working with AI tools that might auto-commit

**Do NOT use when:**
- You're doing rapid prototyping in a scratch branch
- You explicitly want bulk commits for a work-in-progress
- You're already reviewing every change manually

## The Prompt

```
# Commit Changes with Review

Create git commits for changes made during this session.

## CRITICAL RULES

1. **NEVER commit without describing what will be committed first**
2. **NEVER use `git add -A` or `git add .`**
3. **ALWAYS review conversation history to write accurate commit messages**
4. **ALWAYS make multiple logical commits instead of one large commit**
5. **NEVER add co-author or AI attribution** (commits authored by human only)

## Process

### Step 1: Review What Changed

```bash
# Show all changes
git status

# Review each file
git diff path/to/file1
git diff path/to/file2
```

### Step 2: Describe Changes to User

Present a structured description:

```
I've made changes to the following files:

1. src/components/Login.tsx
   - Added OAuth provider selection
   - Implemented token refresh logic
   - Added error boundary for auth failures

2. src/utils/auth.ts
   - Created validateToken helper
   - Added token expiry checking

3. tests/auth.test.ts
   - Added tests for new OAuth flow
   - Added tests for token validation

These changes can be grouped into logical commits:

Commit 1: "Add OAuth provider selection to login"
- src/components/Login.tsx
- src/utils/auth.ts

Commit 2: "Add token validation and refresh"
- src/utils/auth.ts (additional changes)
- tests/auth.test.ts

Shall I proceed with these commits?
```

### Step 3: Wait for Confirmation

**Do not proceed until the user confirms or provides guidance.**

### Step 4: Execute Commits

For each approved commit:

```bash
# Add specific files only
git add src/components/Login.tsx
git add src/utils/auth.ts

# Create commit with descriptive message
git commit -m "add(auth): OAuth provider selection in login

Added UI for selecting OAuth provider (Google, GitHub, Microsoft).
Implemented provider-specific configuration and redirect handling.

- LoginForm component now displays provider buttons
- auth.ts handles provider-specific OAuth flows
- Error states for unsupported providers"

# Verify
git log --oneline -1
```

### Step 5: Repeat for Additional Commits

Continue with remaining logical groups of changes.

## Commit Message Format

```
<type>(<scope>): <short description>

<detailed description of what and why>

- Bullet points for key changes
- Focus on the 'why' not just the 'what'
```

**Types:** add, update, fix, refactor, docs, test, chore

## Examples of Good vs Bad

### ❌ Bad Approach
```bash
git add -A
git commit -m "updates"
```

### ✅ Good Approach
```bash
git add src/auth/oauth.ts
git add src/auth/providers.ts
git commit -m "add(auth): OAuth provider abstraction

Created provider interface and implementations for Google, GitHub.
Each provider handles its own authorization URLs and token exchange.

- BaseProvider interface defines contract
- GoogleProvider and GitHubProvider implementations
- Provider registry for runtime selection"
```

## Verification Checklist

Before each commit:
- [ ] Reviewed git diff for each file
- [ ] Grouped changes logically
- [ ] Written descriptive commit message with context
- [ ] Used explicit file paths in git add
- [ ] No AI attribution in commit message
- [ ] Commit message explains why, not just what
```

## Example

**Context:**
Working with Claude Code to add authentication to a web app. Multiple files changed including components, utilities, and tests.

**Input:**
```
I've finished implementing OAuth authentication. Please commit these changes.
```

**AI Response (following prompt):**
```
I've made changes to the following files:

1. src/components/LoginForm.tsx (152 lines changed)
   - Added OAuth provider selection UI
   - Implemented redirect handling
   - Added loading and error states

2. src/utils/oauth.ts (new file, 89 lines)
   - Created OAuth flow orchestration
   - Added token exchange logic
   - Implemented state validation

3. src/utils/providers.ts (new file, 134 lines)
   - Provider interface and implementations
   - Google, GitHub, Microsoft providers

4. src/types/auth.ts (34 lines changed)
   - Added OAuthProvider type
   - Added OAuthToken interface

5. tests/oauth.test.ts (new file, 67 lines)
   - Unit tests for OAuth flow
   - Mock provider implementations

I suggest creating 3 logical commits:

**Commit 1: Core OAuth infrastructure**
- src/utils/oauth.ts
- src/utils/providers.ts
- src/types/auth.ts

**Commit 2: Login UI with OAuth**
- src/components/LoginForm.tsx

**Commit 3: OAuth tests**
- tests/oauth.test.ts

Shall I proceed with these commits?
```

**User confirms, AI executes:**
```bash
# Commit 1
git add src/utils/oauth.ts src/utils/providers.ts src/types/auth.ts
git commit -m "add(auth): OAuth infrastructure with provider abstraction

Created OAuth flow orchestration and provider system. Providers implement
a common interface for different OAuth services (Google, GitHub, Microsoft).

- oauth.ts: Flow orchestration, state validation, token exchange
- providers.ts: Provider interface and three implementations
- auth.ts types: OAuthProvider and OAuthToken interfaces

Designed for easy addition of new providers."

# Commit 2
git add src/components/LoginForm.tsx
git commit -m "update(ui): add OAuth provider selection to login

LoginForm now shows OAuth provider buttons alongside traditional login.
Handles OAuth redirect flow with loading and error states.

- Provider buttons with brand styling
- Redirect handling on mount
- Loading spinner during OAuth flow
- Error messages for failed authentication"

# Commit 3
git add tests/oauth.test.ts
git commit -m "test(auth): add OAuth flow unit tests

Added comprehensive tests for OAuth flow and provider system.

- Mock provider implementations for testing
- State validation tests
- Token exchange success and failure cases
- Provider selection and initialization"

git log --oneline -3
```

## Expected Results

- Every commit has a clear, descriptive message
- Changes are grouped by logical purpose, not by file type
- Commit messages explain context from the conversation
- No bulk `git add` commands used
- Each commit could be reverted independently without breaking unrelated features
- Commit history tells a story of intentional changes

## Variations

**For AI tools without file-level control:**
```
Before committing, please:
1. Show me `git diff --stat` for overview
2. Show me `git diff` for each file individually
3. Describe what each change does
4. Propose commit groupings
5. Wait for my approval
```

**For pair programming sessions:**
```
# Add to prompt
After committing, create a handoff document summarizing:
- What was implemented
- Key decisions made
- Files modified with line references
- Next steps for future sessions
```

**For repositories with conventional commits:**
```
# Enforce stricter format
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
Scope: Component or module name
Description: 50 chars max, imperative mood

Body: Wrap at 72 chars, explain what and why
Footer: Reference issues (Closes #123)
```

## References

- [Fabbro Agent System](https://github.com/example/fabbro) - Original workflow inspiration
- [Advanced Context Engineering for Coding Agents](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)

## Notes

### Why This Matters

AI assistants can easily create dozens of file changes in minutes. Without this workflow:
- Commit history becomes "AI updated stuff" over and over
- Hard to understand what changed and why
- Difficult to revert specific features
- No connection between conversation context and commits
- Loss of valuable context for future developers

### Common Pitfalls

1. **Trusting AI to auto-commit** - Always review first
2. **One giant commit** - Split into logical units
3. **Missing context** - AI knows the "why" from conversation, must capture it
4. **Bulk staging** - Easy to accidentally commit unintended files

### Implementation Notes

Some AI tools try to be helpful by auto-committing. This prompt trains them to:
- Stop and describe first
- Wait for confirmation
- Use explicit staging
- Write contextual messages

The key is making review **non-optional** in the workflow.

### Adapting for Your Team

Modify the commit message format to match your team's conventions:
- Add required footers (ticket numbers, reviewers)
- Enforce specific type/scope values
- Add required sections (testing, migration notes)
- Include co-author tags if pair programming (human pairs only)

## Version History

- 1.0.0 (2026-01-12): Initial version adapted from fabbro and ACE principles
