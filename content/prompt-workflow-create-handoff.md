---
title: Create Context Handoff Between Sessions
type: prompt
tags: [context, handoff, session-management, documentation, workflow]
tools: [claude-code, aider, cursor, any-cli-llm]
status: tested
created: 2026-01-12
updated: 2026-01-12
version: 1.0.0
related: [prompt-workflow-resume-handoff.md, prompt-workflow-deliberate-commits.md]
source: adapted-from-fabbro
---

# Create Context Handoff Between Sessions

## When to Use

Use this prompt when you need to transfer context from one AI session to another, especially when:
- Hitting context limits in the current session
- Taking a break and want to resume work later
- Handing off work to another developer or AI session
- Creating a snapshot of current progress
- Need to compact and summarize accumulated context

**Critical for:**
- Long-running development tasks spanning multiple sessions
- Complex features requiring context preservation
- Asynchronous collaboration across time zones
- Projects with intermittent work patterns

**Do NOT use when:**
- Work is complete and doesn't need continuation
- Context is simple enough to explain in a few sentences
- Starting fresh makes more sense than preserving context

## The Prompt

````
# Create Handoff Document

Create a concise handoff document to transfer context to another agent session.
Compress and summarize the context without losing key details.

## Process

### Step 1: Gather Metadata

```bash
# Get current state
git branch --show-current
git rev-parse --short HEAD
date -Iseconds
pwd
```

### Step 2: Determine Filepath

Create file at `handoffs/YYYY-MM-DD_HH-MM-SS_description.md`

**Naming patterns:**
- With issue tracking: `handoffs/2026-01-12_14-30-00_issue-123_add-oauth.md`
- Without issues: `handoffs/2026-01-12_14-30-00_refactor-auth-system.md`

### Step 3: Write Handoff Document

**Template:**

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

[1-2 paragraph overview of what we're working on and why]

## Current Status

### Completed
- [x] [Task 1 with file:line references]
- [x] [Task 2 with file:line references]

### In Progress
- [ ] [Task being worked on with current state]

### Planned
- [ ] [Next task]
- [ ] [Future task]

## Critical Files

> These are the MOST IMPORTANT files to understand for continuation

1. `path/to/critical/file.ext:123-156` - Core implementation of X
2. `path/to/config.ext:45` - Configuration for Y
3. `path/to/test.ext` - Existing tests that constrain changes

## Recent Changes

> Files modified in this session

- `src/auth/oauth.ts:34-89` - Added OAuth flow orchestration
- `src/auth/providers.ts:1-134` - Created provider abstraction (new file)
- `src/components/LoginForm.tsx:67-89` - Integrated OAuth UI
- `tests/oauth.test.ts:1-67` - Unit tests for OAuth (new file)

## Key Learnings

> Important discoveries that affect future work

1. **OAuth state must be stored in sessionStorage**
   - LocalStorage persists across tabs causing state confusion
   - See `src/auth/oauth.ts:45` for implementation

2. **Provider interface needs async initialization**
   - Some providers require config fetching before use
   - Current implementation in `src/auth/providers.ts:23`

3. **Existing auth system uses context pattern**
   - Must integrate OAuth without breaking existing email/password
   - See `src/contexts/AuthContext.tsx` for pattern

## Open Questions

> Unresolved decisions or uncertainties

- [ ] Should OAuth tokens be stored in httpOnly cookies or localStorage?
- [ ] Need to verify PKCE flow works with all providers
- [ ] How to handle provider-specific scopes?

## Next Steps

> Prioritized actions for next session

1. **Test OAuth flow end-to-end** [Priority: HIGH]
   - Test with real provider credentials
   - Verify token refresh works
   - Check error handling

2. **Add provider configuration UI** [Priority: MEDIUM]
   - Allow admin to enable/disable providers
   - Configure client IDs per environment

3. **Document OAuth setup** [Priority: MEDIUM]
   - Update README with provider setup instructions
   - Add environment variable documentation

## Artifacts

> Complete list of files created/modified

**New files:**
- `src/auth/oauth.ts`
- `src/auth/providers.ts`
- `tests/oauth.test.ts`

**Modified files:**
- `src/components/LoginForm.tsx`
- `src/types/auth.ts`

**Not committed:** [if applicable]
- `config/development.env` (local credentials)

## References

> Links to relevant docs, discussions, or research

- [OAuth 2.0 spec](https://oauth.net/2/)
- Slack discussion: #auth-redesign (2026-01-10)
- Design doc: `docs/oauth-integration.md`

## Notes

> Any other useful context

- Testing locally requires registered OAuth apps for each provider
- Google OAuth has strict redirect URI validation
- GitHub provider works but needs organization scope review
```

### Step 4: Commit the Handoff

```bash
git add handoffs/YYYY-MM-DD_HH-MM-SS_description.md
git commit -m "docs(handoff): add handoff for [brief description]"
```

### Step 5: Inform User

```
Handoff created at: handoffs/2026-01-12_14-30-00_oauth-integration.md

To resume in a new session:
1. Start fresh AI session
2. Provide the prompt: "Resume work from handoffs/2026-01-12_14-30-00_oauth-integration.md"
3. Or use: /resume_handoff handoffs/2026-01-12_14-30-00_oauth-integration.md

The handoff captures:
- Current task status
- Key learnings and decisions
- Files to read first
- Prioritized next steps
```

## Guidelines

1. **Be specific, not vague** - Include file:line references for everything
2. **Capture the "why"** - Future sessions need to understand decisions
3. **Prioritize learnings** - Mistakes and discoveries are most valuable
4. **Reference, don't duplicate** - Link to files rather than copy code
5. **Update issue tracking** - If using issues, link the handoff
````

## Example

**Context:**
Mid-way through implementing OAuth authentication. Need to stop for the day and resume tomorrow. Multiple files changed, several decisions made, some questions remain.

**Input:**
```
I need to stop for today. Please create a handoff document so I can resume this OAuth implementation tomorrow.
```

**AI Response (following prompt):**
```bash
# Gathering current state
git branch --show-current
# feature/oauth-integration

git rev-parse --short HEAD
# a7f3c92

date -Iseconds
# 2026-01-12T14:30:00-08:00
```

**AI creates file:**
```markdown
---
date: 2026-01-12T14:30:00-08:00
git_commit: a7f3c92
branch: feature/oauth-integration
directory: /home/user/projects/webapp
status: handoff
---

# Handoff: OAuth Integration Implementation

## Context

Implementing OAuth authentication to supplement existing email/password login.
Goal is to support Google, GitHub, and Microsoft OAuth with a pluggable provider
system. Current work is about 60% complete - infrastructure done, UI integration
in progress, testing remains.

## Current Status

### Completed
- [x] OAuth flow orchestration in `src/auth/oauth.ts`
- [x] Provider abstraction with Google, GitHub, Microsoft in `src/auth/providers.ts`
- [x] TypeScript interfaces in `src/types/auth.ts:34-67`
- [x] Basic unit tests in `tests/oauth.test.ts`
- [x] LoginForm UI updates in `src/components/LoginForm.tsx:67-89`

### In Progress
- [ ] Provider button styling (partially done, needs error states)
- [ ] Error handling in OAuth flow (basic errors only, need network errors)

### Planned
- [ ] End-to-end testing with real providers
- [ ] Configuration UI for admin
- [ ] Documentation in README

## Critical Files

1. `src/auth/oauth.ts:1-89` - Core OAuth flow orchestration
   - Handles state generation, redirect, token exchange
   - Uses sessionStorage for state (see Learnings below)

2. `src/auth/providers.ts:1-134` - Provider implementations
   - BaseProvider interface at lines 1-15
   - Three provider implementations following same pattern

3. `src/contexts/AuthContext.tsx:23-45` - Existing auth pattern
   - Must integrate OAuth without breaking this
   - Uses context + hooks pattern

## Recent Changes

- `src/auth/oauth.ts:1-89` - Complete OAuth flow (new file)
- `src/auth/providers.ts:1-134` - Provider system (new file)
- `src/components/LoginForm.tsx:67-89` - Added OAuth buttons
- `src/types/auth.ts:34-67` - Added OAuthProvider, OAuthToken types
- `tests/oauth.test.ts:1-67` - Unit tests with mocks (new file)

## Key Learnings

1. **SessionStorage required for OAuth state**
   - Initially used localStorage but caused issues with multiple tabs
   - OAuth state must be session-specific
   - Implementation: `src/auth/oauth.ts:45`

2. **Provider interface needs to be async**
   - Some providers need to fetch configuration before use
   - Made all provider methods return Promises
   - See `src/auth/providers.ts:8-15` for interface

3. **Existing auth uses Context pattern strictly**
   - Cannot introduce Redux or other state management
   - Must extend AuthContext to include OAuth
   - Pattern: `src/contexts/AuthContext.tsx:23-45`

4. **Token refresh is provider-specific**
   - Each provider has different refresh token behavior
   - Abstracted into provider interface method
   - Not yet fully implemented for all providers

## Open Questions

- [ ] **Where to store OAuth tokens?**
  - Options: localStorage, httpOnly cookies, memory only
  - Security vs. convenience tradeoff
  - Affects token refresh strategy

- [ ] **Should we support PKCE for all providers?**
  - More secure but not all providers require it
  - Implementation effort vs. security benefit

- [ ] **How to handle provider rate limiting?**
  - Google OAuth has rate limits
  - Need strategy for handling 429 responses

## Next Steps

1. **End-to-end testing** [HIGH PRIORITY]
   - Set up OAuth apps with test credentials
   - Test full flow: click button → redirect → callback → token → logged in
   - Verify each provider works correctly
   - Test error cases (user denies, network failure)

2. **Complete error handling** [HIGH PRIORITY]
   - Add network error handling in oauth.ts
   - Add provider-specific error mapping
   - Add user-friendly error messages in UI
   - Test error states in LoginForm

3. **Token storage decision** [BLOCKING NEXT WORK]
   - Research best practices for SPA OAuth token storage
   - Discuss with team security requirements
   - Implement chosen approach
   - Update all providers to use it

4. **Configuration UI** [MEDIUM PRIORITY]
   - Admin page to enable/disable providers
   - Input fields for client IDs per environment
   - Can wait until after testing

## Artifacts

**New files created:**
- `src/auth/oauth.ts` (89 lines)
- `src/auth/providers.ts` (134 lines)
- `tests/oauth.test.ts` (67 lines)

**Modified files:**
- `src/components/LoginForm.tsx` (+22 lines at 67-89)
- `src/types/auth.ts` (+34 lines at 34-67)

**Not committed yet:**
- None (all changes committed)

**Local only (not to commit):**
- `config/development.env` (contains test OAuth client secrets)

## References

- [OAuth 2.0 RFC](https://tools.ietf.org/html/rfc6749)
- [PKCE Extension](https://tools.ietf.org/html/rfc7636)
- Google OAuth docs: https://developers.google.com/identity/protocols/oauth2
- GitHub OAuth docs: https://docs.github.com/en/developers/apps/oauth-apps
- Team discussion: Slack #auth-redesign (thread from 2026-01-10)

## Notes

- Google OAuth requires exact redirect URI match (no wildcards)
- GitHub OAuth needs organization scope for private org users
- Microsoft OAuth supports both personal and work accounts (different endpoints)
- All test provider apps registered under team account
- OAuth state parameter prevents CSRF, must be validated on callback
```

**AI then:**
```bash
git add handoffs/2026-01-12_14-30-00_oauth-integration.md
git commit -m "docs(handoff): OAuth integration mid-implementation

Captured current state of OAuth feature:
- Core infrastructure complete
- UI integration in progress
- Testing and error handling remain

Key context preserved for next session."

# Response to user
Handoff created: handoffs/2026-01-12_14-30-00_oauth-integration.md

To resume tomorrow:
1. Start a new AI session
2. Say: "Resume from handoffs/2026-01-12_14-30-00_oauth-integration.md"

The handoff includes:
✓ Task status and next steps
✓ Key learnings about OAuth state handling
✓ Open questions needing decisions
✓ All file references with line numbers
✓ Priority-ordered next actions
```

## Expected Results

- Comprehensive document that allows seamless continuation in a new session
- All context questions answerable by reading the handoff
- Clear prioritization of next steps
- Preservation of important decisions and learnings
- File references are specific enough to quickly navigate to relevant code
- New session can start immediately without re-discovering context

## Variations

**For project tracking system integration:**
```markdown
## Issue Tracking

**Related issues:**
- #234 - Add OAuth authentication
- #235 - Provider configuration UI (blocked by this)

**Issue comments to add:**
```bash
# Add handoff reference to issue
gh issue comment 234 --body "Handoff created: handoffs/2026-01-12_14-30-00_oauth-integration.md"
```

**For team handoffs (not just AI):**
```markdown
## Team Context

**Who started this:** @alice
**Architectural decisions with:** @bob (see Slack #architecture 2026-01-10)
**Security review needed from:** @security-team
**Deployment owner:** @devops-team

**Important team context:**
- OAuth requirement came from customer request (ticket CST-4567)
- Must support enterprise SSO eventually (phase 2)
- Marketing wants this for Q1 launch
```

**For complex multi-phase projects:**
```markdown
## Project Phase

**Current phase:** Phase 2 of 4 (Provider Integration)
**Phase document:** docs/oauth-implementation-plan.md
**Previous handoff:** handoffs/2026-01-08_14-30-00_oauth-phase1.md

**Phase 1 (complete):** Architecture and design
**Phase 2 (current):** Provider integration (70% done)
**Phase 3 (next):** Testing and error handling
**Phase 4 (future):** Admin UI and documentation
```

## References

- [Fabbro Agent System](https://github.com/example/fabbro) - Handoff workflow inspiration
- [Advanced Context Engineering](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents) - Context compaction techniques
- [The Art of the Handoff](https://increment.com/teams/the-art-of-the-handoff/) - Team handoff principles
- [Working in Public](https://press.stripe.com/working-in-public) - Async collaboration patterns

## Notes

### Why Handoffs Matter

AI sessions have context limits. Long-running work eventually hits these limits and performance degrades. Handoffs:
- **Reset context windows** - Start fresh with just what's needed
- **Force documentation** - Explicit capture of decisions and learnings
- **Enable async work** - Multiple people/sessions can work on same task
- **Create checkpoints** - Known good states to return to

### What Makes a Good Handoff

**Good handoffs have:**
- Specific file:line references for everything
- Captured "why" behind decisions
- Prioritized next steps
- Key learnings prominently featured
- Enough detail to avoid re-research

**Bad handoffs have:**
- Vague descriptions ("worked on auth stuff")
- No file references
- Missing context on decisions
- Unclear next steps
- No learnings captured

### Common Mistakes

1. **Too brief** - "Worked on OAuth. Almost done. File is src/auth.ts"
2. **Too verbose** - Copying entire code blocks instead of referencing
3. **Missing learnings** - Not capturing why decisions were made
4. **Unclear status** - Hard to tell what's done vs. in progress
5. **No prioritization** - All next steps seem equally important

### Tool Integration

Handoffs work well with:
- **Issue trackers** - Link handoff in issue comments
- **Pull requests** - Reference handoff in PR description
- **Documentation** - Convert handoffs to docs when complete
- **Standup notes** - Handoffs double as status updates
- **Knowledge bases** - Archive handoffs as tribal knowledge

## Version History

- 1.0.0 (2026-01-12): Initial version adapted from fabbro workflow
