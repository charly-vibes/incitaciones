---
title: Research Codebase Without Suggestions
type: prompt
tags: [research, documentation, codebase, analysis, discovery]
tools: [claude-code, aider, cursor, any-cli-llm]
status: tested
created: 2026-01-12
updated: 2026-01-12
version: 1.0.0
related: [prompt-workflow-create-handoff.md]
source: adapted-from-fabbro
---

# Research Codebase Without Suggestions

## When to Use

Use this prompt when you need an AI to **document and explain existing code** without suggesting improvements, refactoring, or changes.

**Critical for:**
- Understanding unfamiliar codebases
- Documenting current architecture
- Onboarding to existing projects
- Creating handoffs or knowledge base articles
- Investigating how features currently work

**Do NOT use when:**
- You want suggestions for improvements (use different prompt)
- You're actively developing new features (research first, then develop)
- You already understand the code well

## The Prompt

````
# Research Codebase

Document and explain the codebase as it exists today.

## CRITICAL RULES

**You are a documentarian, not an evaluator:**

1. ✅ **DO:** Describe what exists, where it exists, and how it works
2. ✅ **DO:** Explain patterns, conventions, and architecture
3. ✅ **DO:** Provide file:line references for everything
4. ✅ **DO:** Show relationships between components
5. ❌ **DO NOT:** Suggest improvements or changes
6. ❌ **DO NOT:** Critique the implementation
7. ❌ **DO NOT:** Recommend refactoring
8. ❌ **DO NOT:** Say things like "could be improved" or "should use"

## Process

### Step 1: Understand the Research Question

[User will provide a question like:]
- "How does authentication work?"
- "Where are errors handled?"
- "What's the data flow for user registration?"
- "Document the API layer architecture"

**Clarify if needed:**
- What specific aspect to focus on?
- What level of detail is needed?
- Any specific files already identified?

### Step 2: Decompose the Question

Break down the research into searchable components:

```
Research question: "How does authentication work?"

Components to investigate:
1. Where authentication logic lives
2. What authentication methods exist
3. How authentication state is managed
4. Where authentication is validated
5. How errors are handled
6. What the authentication flow looks like
```

### Step 3: Research with Parallel Searches

Use search tools efficiently:

```bash
# Find auth-related files
find . -name "*auth*" -type f

# Search for authentication patterns
grep -r "authenticate" --include="*.ts" --include="*.js"
grep -r "login" --include="*.ts" --include="*.js"

# Look for middleware or hooks
grep -r "middleware" --include="*.ts"
grep -r "useAuth" --include="*.tsx"

# Find configuration
grep -r "auth" config/ .env.example
```

### Step 4: Read Identified Files

**Read completely, don't skim:**
- Read files from top to bottom
- Note imports and dependencies
- Track how components connect

### Step 5: Document Findings

**Template for research output:**

```markdown
# Research: [Topic]

**Date:** [ISO date]
**Question:** [Original research question]

## Summary

[2-3 paragraph high-level overview of findings]

## Architecture Overview

[Describe the overall architecture for this component/feature]

```
[Optional ASCII diagram showing relationships]
```

## Key Components

### Component 1: [Name]

**Location:** `path/to/file.ext:123-456`
**Purpose:** [What it does]
**Used by:** [What depends on this]
**Depends on:** [What this depends on]

**How it works:**
[Step-by-step explanation of the implementation]

**Key methods/functions:**
- `functionName()` (line 123): [What it does]
- `anotherFunction()` (line 145): [What it does]

### Component 2: [Name]
[Same structure]

## Data Flow

[Describe how data flows through the system for this feature]

1. User action triggers X
2. X calls Y with data
3. Y validates and transforms data
4. Y passes to Z
5. Z persists/returns result

**File references:**
- Step 1: `src/components/Button.tsx:67`
- Step 2: `src/handlers/handler.ts:23`
- Step 3: `src/validators/validate.ts:89`
- etc.

## Patterns and Conventions

**Pattern 1:** [Describe pattern found]
- Used in: [file:line, file:line]
- Purpose: [Why this pattern]

**Pattern 2:** [Another pattern]
- Used in: [file:line]

## Configuration

**Environment variables:**
- `AUTH_SECRET` - Used in `src/auth/jwt.ts:12`
- `AUTH_EXPIRY` - Used in `src/auth/jwt.ts:34`

**Config files:**
- `config/auth.json` - Contains [what]

## Error Handling

[How errors are handled in this area]

- Error types: [List error types]
- Error handlers: `src/errors/AuthError.ts:23`
- User-facing errors: [How shown to users]

## Testing

**Test files:**
- `tests/auth.test.ts` - Tests [what]
- `tests/integration/auth.integration.test.ts` - Tests [what]

**Coverage:** [If determinable]
**Test patterns:** [How tests are structured]

## Dependencies

**External libraries:**
- `jsonwebtoken` - Used for JWT creation/validation
- `bcrypt` - Used for password hashing

**Internal dependencies:**
- `src/db/users.ts` - User data access
- `src/utils/validation.ts` - Input validation

## Entry Points

**Where this feature is invoked:**
1. `src/routes/auth.ts:45` - Login endpoint
2. `src/middleware/authCheck.ts:12` - Auth middleware
3. `src/components/LoginForm.tsx:89` - Login UI

## Related Code

**Related features:**
- Authorization (see `src/authz/`)
- User management (see `src/users/`)
- Session management (see `src/sessions/`)

## References

**Documentation:**
- `docs/authentication.md` (if exists)
- `README.md` sections on auth

**Comments:**
[Notable code comments that explain design decisions]

## Open Questions

[Things that are unclear or need further investigation]
- [ ] How are refresh tokens handled?
- [ ] What happens on token expiry during request?
```

## Guidelines

1. **Be precise** - Include file:line for every claim
2. **Be objective** - Describe, don't judge
3. **Be thorough** - Cover all aspects of the question
4. **Show relationships** - How components connect
5. **Capture patterns** - Note conventions used throughout
6. **Include config** - Environment variables, config files
7. **Track tests** - Document existing test coverage
````

## Example

**Context:**
New to a codebase, need to understand how authentication works before adding OAuth support.

**Input:**
```
Research how authentication currently works in this codebase. I need to understand the existing system before adding OAuth support.
```

**AI Response (following prompt):**

```
I'll research the authentication system. Let me search for auth-related code:

[Runs parallel searches]
- Finding auth files
- Searching for authentication patterns
- Looking for middleware/hooks
- Checking configuration

[Reads identified files]
- src/auth/jwt.ts
- src/middleware/authCheck.ts
- src/routes/auth.ts
- src/contexts/AuthContext.tsx
- tests/auth.test.ts

[After research, presents findings]

# Research: Authentication System

**Date:** 2026-01-12
**Question:** How does authentication currently work?

## Summary

The application uses JWT-based authentication with email/password credentials.
Authentication state is managed through React Context on the frontend and
validated via middleware on the backend. JWTs are stored in localStorage
and included in requests via Authorization header. The system supports login,
logout, token validation, and automatic token refresh.

## Architecture Overview

```
┌─────────────┐
│ LoginForm   │ (UI)
└──────┬──────┘
       │ POST /auth/login
       ↓
┌──────────────┐
│ Auth Routes  │ (API Endpoints)
└──────┬───────┘
       │ validates credentials
       ↓
┌──────────────┐
│ JWT Service  │ (Token Creation)
└──────┬───────┘
       │ returns token
       ↓
┌──────────────┐
│ AuthContext  │ (State Management)
└──────┬───────┘
       │ stores token
       ↓
┌──────────────┐
│ API Client   │ (Adds token to requests)
└──────┬───────┘
       │ Authorization: Bearer <token>
       ↓
┌──────────────┐
│ Auth Middle- │ (Validates token)
│ ware         │
└──────────────┘
```

## Key Components

### Component 1: JWT Service

**Location:** `src/auth/jwt.ts:1-89`
**Purpose:** Creates and validates JWT tokens
**Used by:** Auth routes, auth middleware
**Depends on:** jsonwebtoken library, environment variables

**How it works:**
1. `createToken(userId)` (line 23): Takes user ID, creates JWT with 24h expiry
2. `verifyToken(token)` (line 45): Validates token, returns decoded payload
3. `refreshToken(token)` (line 67): Issues new token if old one expires within 1h

**Key methods:**
- `createToken(userId: string): string` - Creates JWT with user ID in payload
- `verifyToken(token: string): TokenPayload | null` - Validates and decodes
- `refreshToken(oldToken: string): string | null` - Issues new token

### Component 2: Auth Routes

**Location:** `src/routes/auth.ts:1-134`
**Purpose:** HTTP endpoints for authentication operations
**Used by:** Frontend API client
**Depends on:** JWT service, user database, bcrypt

**How it works:**
- POST /auth/login (line 23): Validates credentials, returns JWT
  1. Receives email and password
  2. Looks up user in database
  3. Compares password hash with bcrypt
  4. If valid, creates JWT and returns it

- POST /auth/logout (line 56): Clears session (currently just returns 200)

- POST /auth/refresh (line 78): Refreshes expiring token
  1. Receives current token
  2. Validates token
  3. Issues new token if within refresh window

- GET /auth/me (line 112): Returns current user info
  1. Expects Authorization header
  2. Validates token via middleware
  3. Returns user object

### Component 3: Auth Middleware

**Location:** `src/middleware/authCheck.ts:12-67`
**Purpose:** Validates JWT on protected routes
**Used by:** All protected API routes
**Depends on:** JWT service

**How it works:**
1. Extracts token from Authorization header (line 23)
2. Validates token format (Bearer scheme)
3. Calls JWT service to verify token
4. If valid, attaches user to request object
5. If invalid, returns 401 Unauthorized

**Usage pattern:**
```typescript
// Applied to protected routes
router.get('/protected', authCheck, handlerFunction)
```

### Component 4: Auth Context

**Location:** `src/contexts/AuthContext.tsx:23-156`
**Purpose:** Manages authentication state in React frontend
**Used by:** All components needing auth state
**Depends on:** API client, localStorage

**How it works:**
1. Provides `AuthProvider` component wrapping app
2. Exposes `useAuth()` hook for consuming auth state
3. Stores JWT token in localStorage (line 45)
4. Automatically includes token in API requests
5. Handles login, logout, token refresh

**State:**
- `user: User | null` - Current user object
- `token: string | null` - JWT token
- `loading: boolean` - Auth check in progress

**Methods:**
- `login(email, password)` - Calls API, stores token
- `logout()` - Clears token and user state
- `refreshAuth()` - Refreshes token if needed

## Data Flow

**Login flow:**
1. User submits email/password in `LoginForm.tsx:89`
2. `LoginForm` calls `authContext.login()` in `AuthContext.tsx:67`
3. `AuthContext.login()` POSTs to `/auth/login` via `api-client.ts:34`
4. API route validates credentials in `auth.ts:23`
5. If valid, JWT created by `jwt.ts:23`
6. Token returned to frontend
7. `AuthContext` stores token in localStorage (line 78)
8. `AuthContext` fetches user details via `/auth/me` (line 89)
9. User state updated, UI re-renders

**Protected API request flow:**
1. Component calls API endpoint via `api-client.ts`
2. API client reads token from localStorage (line 12)
3. Adds token to Authorization header (line 23)
4. Backend receives request
5. Auth middleware validates token (authCheck.ts:23)
6. If valid, request proceeds to handler
7. If invalid, 401 returned, frontend redirects to login

## Patterns and Conventions

**Pattern 1: Context + Hook Pattern**
- Used in: `src/contexts/AuthContext.tsx:23`
- Purpose: Global auth state accessible via `useAuth()` hook
- All auth state management centralized here

**Pattern 2: Middleware-based Protection**
- Used in: `src/middleware/authCheck.ts:12`, applied in route files
- Purpose: Declarative route protection
- Routes explicitly opt-in to auth requirement

**Pattern 3: Token in localStorage**
- Used in: `src/contexts/AuthContext.tsx:45`
- Purpose: Persist auth across page refreshes
- Token stored under key "auth_token"

## Configuration

**Environment variables:**
- `JWT_SECRET` - Used in `src/auth/jwt.ts:12` for signing tokens
- `JWT_EXPIRY` - Used in `src/auth/jwt.ts:23`, defaults to "24h"
- `JWT_REFRESH_WINDOW` - Used in `src/auth/jwt.ts:67`, defaults to "1h"

**Config files:**
- `.env.example` - Documents required variables
- No dedicated auth config file

## Error Handling

**Backend errors:**
- Invalid credentials: Returns 401 with message "Invalid email or password"
- Invalid token: Returns 401 with message "Invalid or expired token"
- Missing token: Returns 401 with message "No token provided"

**Error handling locations:**
- `src/routes/auth.ts:34` - Credential validation errors
- `src/middleware/authCheck.ts:45` - Token validation errors
- `src/auth/jwt.ts:56` - Token verification errors

**Frontend error handling:**
- `src/contexts/AuthContext.tsx:89` - Catches API errors
- `src/components/LoginForm.tsx:102` - Displays error messages
- 401 responses trigger automatic redirect to login (api-client.ts:67)

## Testing

**Test files:**
- `tests/auth.test.ts` - Unit tests for JWT service
  - Token creation, validation, refresh
  - 23 tests, all passing

- `tests/routes/auth.test.ts` - Integration tests for auth routes
  - Login, logout, refresh, /me endpoint
  - 34 tests, all passing

- `tests/middleware/authCheck.test.ts` - Middleware tests
  - Valid token, invalid token, missing token
  - 12 tests, all passing

**Test patterns:**
- Use `supertest` for API testing
- Mock JWT service in route tests
- Use `@testing-library/react` for context tests

## Dependencies

**External libraries:**
- `jsonwebtoken@9.0.0` - JWT creation and validation
- `bcrypt@5.1.0` - Password hashing
- `express@4.18.0` - Web framework
- React Context API (built-in) - State management

**Internal dependencies:**
- `src/db/users.ts` - User database queries
- `src/utils/validation.ts` - Email/password validation
- `src/types/auth.ts` - TypeScript types

## Entry Points

**Frontend:**
1. `src/components/LoginForm.tsx:89` - Login UI
2. `src/contexts/AuthContext.tsx:67` - Auth state management
3. `src/hooks/useAuth.ts:12` - Hook for accessing auth

**Backend:**
1. `src/routes/auth.ts:23` - Auth endpoints
2. `src/middleware/authCheck.ts:12` - Protection middleware
3. `src/server.ts:45` - Auth routes mounted at `/auth`

## Related Code

**Related features:**
- User management: `src/users/` - User CRUD operations
- Password reset: `src/routes/password-reset.ts` - Reset flow
- Email verification: `src/routes/email-verify.ts` - Verification

**Future extension points:**
- OAuth providers would integrate at `src/routes/auth.ts`
- Additional auth methods would extend `AuthContext`

## References

**Documentation:**
- `docs/api.md` - Documents auth endpoints
- `README.md:45-67` - Setup instructions including JWT_SECRET

**Inline comments:**
- `src/auth/jwt.ts:34` - Comment explaining refresh window choice
- `src/contexts/AuthContext.tsx:56` - Comment on localStorage choice

## Open Questions

- [ ] How are refresh tokens handled? (Currently using same JWT)
- [ ] What happens if token expires during a long-running request?
- [ ] Is there rate limiting on login attempts?
- [ ] Are failed login attempts logged?
```

## Expected Results

- Comprehensive understanding of how the code currently works
- Specific file:line references for all claims
- Clear documentation of patterns and conventions
- No suggestions for improvements or changes
- Architecture diagrams showing relationships
- Entry points clearly identified
- Dependencies mapped out

## Variations

**For specific subsystem research:**
```
Research only the error handling system. Focus on:
- Where errors are defined
- How errors are thrown and caught
- How errors reach the user
- What error information is logged
```

**For pattern documentation:**
```
Document the data fetching patterns used in this codebase.
Find all the different ways data is fetched and show examples
of each pattern with file references.
```

**For integration points:**
```
Research how this codebase integrates with external services.
Document all external API calls, webhook handlers, and third-party
libraries used for external communication.
```

## References

- [Fabbro Agent System](https://github.com/example/fabbro) - Research workflow inspiration
- [Advanced Context Engineering](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents) - Documentation techniques
- [Documentation as Code](https://www.writethedocs.org/) - Documentation principles

## Notes

### Why "No Suggestions" Matters

AI assistants naturally want to be helpful by suggesting improvements. But during research:
- **Suggestions are noise** - They distract from understanding what IS
- **Premature optimization** - Can't optimize what you don't understand
- **Bias toward change** - Makes everything seem like it needs fixing
- **Cognitive load** - Mixing research with evaluation is mentally taxing

**Separate concerns:**
1. First, understand what exists (research phase)
2. Then, evaluate and improve (development phase)

### When to Break This Rule

Never, during research phase. If improvements are obvious:
- **Note them separately** - Keep research pure, note ideas elsewhere
- **Return to them later** - After research is complete

### Common AI Mistakes in Research

Without this prompt, AIs often:
- Say "This could be refactored to..."
- Comment "This is tightly coupled"
- Suggest "Consider using X instead of Y"
- Critique "This doesn't follow best practices"

These are all violations. The AI should document, not judge.

### Research as Foundation

Good research creates foundation for:
- **Accurate planning** - Can't plan without understanding
- **Safe refactoring** - Know what depends on what
- **Effective handoffs** - Document existing patterns
- **Onboarding docs** - Turn research into team knowledge

### Integration with Other Workflows

Research feeds into:
- **Planning prompts** - Use research to inform plans
- **Handoff documents** - Include research in handoffs
- **Architecture docs** - Convert research to documentation
- **Onboarding guides** - Share research with new team members

## Version History

- 1.0.0 (2026-01-12): Initial version adapted from fabbro research workflow
