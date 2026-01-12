---
title: Generate Comprehensive PR Descriptions
type: prompt
tags: [pull-request, git, documentation, code-review, github]
tools: [claude-code, aider, cursor, gh-cli]
status: tested
created: 2026-01-12
updated: 2026-01-12
version: 1.0.0
related: [prompt-workflow-deliberate-commits.md, prompt-workflow-create-handoff.md]
source: adapted-from-fabbro
---

# Generate Comprehensive PR Descriptions

## When to Use

Use this prompt when you need to create or update a pull request description based on the actual changes in the PR.

**Critical for:**
- Documenting PR contents for reviewers
- Creating thorough PR descriptions that explain "why"
- Connecting PRs to related issues, plans, or documentation
- Providing testing guidance for reviewers

**Do NOT use when:**
- PR is a draft with no real changes yet
- Description is already comprehensive and accurate
- PR is trivial (typo fix, one-line change)

## The Prompt

```
# Generate PR Description

Create a comprehensive pull request description based on the actual changes in the PR.

## Process

### Step 1: Identify the PR

**If on branch with associated PR:**
```bash
gh pr view --json url,number,title,state,baseRefName
```

**If not on PR branch or PR doesn't exist:**
```bash
# List open PRs
gh pr list --limit 10 --json number,title,headRefName,author

# Ask user which PR to describe
```

### Step 2: Gather PR Information

```bash
# Get full diff
gh pr diff {number}

# Get commit history
gh pr view {number} --json commits --jq '.commits[] | "\(.oid[0:7]) \(.messageHeadline)"'

# Get PR metadata
gh pr view {number} --json url,title,number,state,baseRefName,additions,deletions
```

### Step 3: Analyze Changes Deeply

Review all changes and understand:

**What changed:**
- Files modified, added, removed
- Lines added/removed
- Key functions/classes affected

**Why it changed:**
- What problem does this solve?
- What requirement does this fulfill?
- What was wrong before?

**Impact:**
- User-facing changes
- API changes
- Breaking changes
- Performance implications
- Security considerations

**Context:**
- Related issues
- Related plans or design docs
- Dependencies on other PRs
- Follow-up work needed

### Step 4: Generate Description

**Template:**

```markdown
## Summary

[2-3 sentence overview of what this PR does and why it's needed]

## Changes

**Key changes:**
- [Specific change 1 with reasoning]
- [Specific change 2 with reasoning]
- [Specific change 3 with reasoning]

**Files changed:**
- `path/to/file1.ext` - [What changed and why]
- `path/to/file2.ext` - [What changed and why]

## Motivation

[Explain the problem this PR solves or the requirement it fulfills.
Reference related issues, user requests, or technical debt.]

## Implementation Details

[Explain key implementation decisions, trade-offs considered,
and why this approach was chosen over alternatives.]

**Key decisions:**
1. [Decision 1]: [Rationale]
2. [Decision 2]: [Rationale]

## Related

- Issue: #123 [if applicable]
- Plan: `plans/2026-01-12-feature-name.md` [if applicable]
- Design doc: `docs/design-xyz.md` [if applicable]
- Depends on: PR #456 [if applicable]
- Blocks: PR #789 [if applicable]

## Testing

**Automated tests:**
- [ ] Unit tests pass (`npm test`)
- [ ] Integration tests pass
- [ ] E2E tests pass [if applicable]

**Manual testing:**
- [ ] [Specific manual test 1]
- [ ] [Specific manual test 2]
- [ ] [Specific manual test 3]

**Test coverage:**
- [Coverage stats if available]

## Breaking Changes

[If any breaking changes, list them prominently here with migration guidance]

**None** [if no breaking changes]

## Migration Guide

[If breaking changes exist, provide step-by-step migration instructions]

## Security Considerations

[Any security implications, or state "None identified"]

## Performance Impact

[Any performance changes, benchmarks, or state "No significant impact"]

## Screenshots / Demos

[For UI changes, include before/after screenshots or GIFs]

## Rollout Plan

[If phased rollout needed, describe the plan]

## Follow-up Work

[List any follow-up work needed in future PRs]
- [ ] [Follow-up task 1]
- [ ] [Follow-up task 2]

## Reviewer Notes

[Specific things you want reviewers to focus on or be aware of]
```

### Step 5: Present to User

Show the generated description and ask for approval:

```
I've generated a PR description for PR #{number}. Here's what I've created:

[Show description]

Would you like me to:
1. Update the PR with this description
2. Make changes to the description first
3. Copy to clipboard for manual update
```

### Step 6: Update PR

Upon approval:

```bash
# Save description to temp file (for complex descriptions with newlines)
cat > /tmp/pr-description.md <<'EOF'
[description content]
EOF

# Update PR
gh pr edit {number} --body-file /tmp/pr-description.md

# Verify
gh pr view {number}
```

## Guidelines

1. **Focus on "why" not just "what"** - Diff shows what, description explains why
2. **Be specific** - Vague descriptions aren't helpful
3. **Include context** - Link to issues, plans, discussions
4. **Think about reviewers** - What do they need to know?
5. **Highlight breaking changes** - Make them impossible to miss
6. **Provide testing guidance** - Help reviewers verify
7. **Be thorough but scannable** - Use headers and bullets
```

## Example

**Context:**
Just finished implementing OAuth authentication. PR has 8 files changed with 450 additions. Need to create comprehensive description for review.

**Input:**
```
Generate a PR description for the OAuth feature we just implemented.
```

**AI Response (following prompt):**

```bash
# Checking current PR
gh pr view --json number,title,url
# Output: PR #234 "Add OAuth authentication support"

# Getting full context
gh pr diff 234 > /tmp/pr-diff.txt
gh pr view 234 --json commits
# Reviewing all changes...
```

**AI analyzes and presents:**

```markdown
I've analyzed PR #234 and generated this description:

---

## Summary

Adds OAuth authentication to supplement existing email/password login. Users can now
sign in with Google, GitHub, or Microsoft accounts. The implementation uses a provider
abstraction pattern allowing easy addition of more OAuth providers in the future.

## Changes

**Key changes:**
- OAuth flow orchestration with PKCE support for security
- Provider abstraction interface with three initial implementations
- Login UI updated with OAuth provider buttons
- AuthContext extended to support OAuth tokens
- Comprehensive test coverage for OAuth flows

**Files changed:**
- `src/auth/oauth.ts` - Core OAuth flow with state management and token exchange
- `src/auth/providers.ts` - Provider interface and Google/GitHub/Microsoft implementations
- `src/components/LoginForm.tsx` - UI integration for OAuth buttons
- `src/contexts/AuthContext.tsx` - Extended to manage OAuth tokens
- `src/types/auth.ts` - New TypeScript interfaces for OAuth types
- `tests/oauth.test.ts` - Unit tests with mocked providers
- `tests/integration/oauth.integration.test.ts` - E2E tests with test OAuth apps
- `docs/oauth-setup.md` - Setup guide for OAuth apps

## Motivation

Addresses customer requests for social login (#156, #178, #203). Email/password
authentication has high friction for new users - 40% of registrations are abandoned.
OAuth reduces this friction and aligns with modern auth best practices.

## Implementation Details

**Key decisions:**

1. **Provider abstraction pattern**: Each OAuth provider (Google, GitHub, Microsoft)
   implements a common `OAuthProvider` interface. This allows adding new providers
   without changing core OAuth logic.
   - Rationale: Extensibility and testability

2. **PKCE flow for security**: Uses Proof Key for Code Exchange extension to OAuth.
   - Rationale: Protects against authorization code interception attacks

3. **SessionStorage for OAuth state**: State parameter stored in sessionStorage, not localStorage.
   - Rationale: Prevents state confusion when user opens multiple tabs

4. **Integration with existing AuthContext**: Extended rather than replaced existing auth.
   - Rationale: Maintains backward compatibility with email/password flow

5. **Token storage in httpOnly cookies**: OAuth tokens stored server-side, referenced by cookie.
   - Rationale: Prevents XSS token theft (different from existing localStorage approach for backward compat)

## Related

- Issue: #156 "Add Google login"
- Issue: #178 "Support GitHub OAuth"
- Issue: #203 "Microsoft OAuth for enterprise users"
- Design doc: `docs/oauth-design.md`
- User research: `docs/auth-friction-analysis.md`

## Testing

**Automated tests:**
- [x] Unit tests pass (`npm test`) - 23 new tests
- [x] Integration tests pass - 8 OAuth flow tests
- [x] E2E tests pass - tested with test OAuth apps

**Manual testing:**
- [x] Google OAuth flow (tested with test Google app)
- [x] GitHub OAuth flow (tested with test GitHub app)
- [x] Microsoft OAuth flow (tested with test Microsoft app)
- [x] Error handling (user denies, network failure, invalid state)
- [x] Token refresh on expiry
- [x] Logout clears OAuth tokens
- [x] Mixed auth (some users email/password, some OAuth)

**Test coverage:**
- OAuth module: 94% coverage
- Overall auth: 89% coverage (up from 85%)

## Breaking Changes

**None** - This is an additive feature. Existing email/password authentication unchanged
and continues to work exactly as before.

## Security Considerations

- **PKCE implementation**: Prevents authorization code interception
- **State parameter validation**: Prevents CSRF attacks
- **httpOnly cookie storage**: Prevents XSS token theft
- **Provider validation**: Only whitelisted redirect URIs accepted
- **Token expiry**: OAuth tokens expire after 24h, refresh tokens after 30d

Security review completed by @security-team (see Slack #security thread 2026-01-10).

## Performance Impact

- Login page load: No impact (OAuth buttons are lightweight)
- OAuth flow: ~500ms redirect round-trip (measured)
- Token validation: +5ms per request (httpOnly cookie read)

Overall: No significant performance impact. OAuth flow is async and doesn't block UI.

## Screenshots

**Before:**
[Screenshot of old login form with only email/password]

**After:**
[Screenshot of new login form with OAuth buttons below email/password]

**OAuth provider selection:**
[Screenshot showing Google/GitHub/Microsoft buttons]

**OAuth flow:**
[GIF showing click → redirect → callback → logged in]

## Rollout Plan

**Phase 1 (current):** Deploy to staging for team testing
**Phase 2 (next week):** Beta rollout to 10% of users
**Phase 3 (week after):** Full rollout to 100%

Feature flag: `ENABLE_OAUTH` (currently true in staging, false in prod)

## Follow-up Work

- [ ] Add LinkedIn OAuth provider (#267)
- [ ] Add "Link accounts" feature (connect OAuth to existing email account) (#268)
- [ ] Implement automatic account merging for same email (#269)
- [ ] Add admin UI for OAuth app configuration (#270)
- [ ] Add analytics for OAuth vs email/password usage (#271)

## Reviewer Notes

**Key files to review:**
1. `src/auth/oauth.ts` - Core logic, pay attention to state validation (line 45-67)
2. `src/auth/providers.ts` - Provider interface, ensure new providers will fit this
3. Security: httpOnly cookie implementation in `src/auth/tokens.ts:89-123`

**Questions for review:**
- Does provider abstraction make sense for future providers (Apple, Twitter)?
- Is httpOnly cookie approach acceptable for new OAuth tokens while keeping localStorage for legacy?
- Should we automatically link accounts with matching emails or require user confirmation?

---

Shall I update PR #234 with this description?
```

**User approves, AI updates:**

```bash
cat > /tmp/pr-234-description.md <<'EOF'
## Summary
...
EOF

gh pr edit 234 --body-file /tmp/pr-234-description.md

# Verify update
gh pr view 234

✓ PR #234 description updated successfully!

View at: https://github.com/user/repo/pull/234
```

## Expected Results

- Comprehensive PR description that reviewers can quickly understand
- Clear explanation of what changed and why
- Context through links to issues, plans, and docs
- Testing guidance for reviewers
- Breaking changes prominently highlighted
- Security and performance considerations noted
- Follow-up work clearly identified

## Variations

**For quick PR description (simplified):**
```markdown
## What

[One paragraph: what changed]

## Why

[One paragraph: why it changed]

## Testing

- [ ] [Key test to verify]

## Notes

[Anything else reviewers should know]
```

**For bug fix PR:**
```markdown
## Bug

[Describe the bug and how to reproduce]

## Root Cause

[Explain what was causing the bug]

## Fix

[Explain how this fixes it]

## Testing

- [ ] Verified bug reproduction before fix
- [ ] Verified bug no longer reproduces after fix
- [ ] Added regression test

## Related Issues

Fixes #123
```

**For refactoring PR:**
```markdown
## Refactoring

[What was refactored and why]

## Changes

- [Structural change 1]
- [Structural change 2]

## No Behavior Changes

**Verified that behavior is unchanged:**
- [ ] All tests pass without modification
- [ ] Manual testing shows same behavior
- [ ] No user-facing changes

## Motivation

[Why this refactoring improves the codebase]
```

## References

- [Fabbro Agent System](https://github.com/example/fabbro) - PR description workflow
- [How to Write the Perfect Pull Request](https://github.blog/2015-01-21-how-to-write-the-perfect-pull-request/)
- [The Art of Pull Requests](https://hackernoon.com/the-art-of-pull-requests-6f0f099850f9)
- [Google Code Review Guidelines](https://google.github.io/eng-practices/review/)

## Notes

### Why PR Descriptions Matter

Good PR descriptions:
- **Save reviewer time** - Context upfront means faster review
- **Preserve decisions** - "Why" is often lost without documentation
- **Enable async review** - Reviewers don't need to ask basic questions
- **Create audit trail** - Future developers understand changes

Bad PR descriptions:
- "fixes bug" - What bug? How?
- "updates code" - What updates? Why?
- Empty - Reviewer has to reverse-engineer intent

### What Makes a Great PR Description

**Great descriptions have:**
- Clear summary of what and why
- Context through links and references
- Implementation rationale
- Testing guidance
- Breaking changes highlighted

**They DON'T have:**
- Vague language ("improves things")
- Missing context
- Just a list of commits (commits are in git log)
- Technical jargon without explanation

### Common Mistakes

1. **Copying commit messages** - Commits are too granular for PR overview
2. **No "why"** - Reviewers can see what changed, need to know why
3. **Missing context** - No links to issues, discussions, or docs
4. **Hidden breaking changes** - Buried in middle of description
5. **No testing guidance** - Reviewers don't know how to verify

### Tool Integration

This prompt works with:
- `gh` CLI for GitHub
- Can adapt for GitLab CLI (`glab`)
- Can adapt for Bitbucket
- Works with any PR-based workflow

### For Team Workflows

Adapt template to match team conventions:
- Required sections
- Links to issue tracker
- Approval requirements
- Deployment notes
- Security review checklist

## Version History

- 1.0.0 (2026-01-12): Initial version adapted from fabbro and PR best practices
