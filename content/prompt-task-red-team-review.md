---
title: Adversarial Bug Detection Review
type: prompt
subtype: task
tags: [red-teaming, bug-detection, review, reliability, security, ci-cd, edge-cases, failure-modes, correctness]
tools: [claude-code, cursor, gemini, aider]
status: draft
created: 2026-03-20
updated: 2026-03-20
version: 2.1.0
related: [research-paper-automated-red-teaming-vulnerability-discovery.md, prompt-workflow-pre-mortem-planning.md, prompt-task-iterative-code-review.md]
source: research-paper-automated-red-teaming-vulnerability-discovery.md
---

# Adversarial Bug Detection Review

## When to Use

Use this prompt to review code from an adversary's perspective — thinking like a red team to find the bugs, failure modes, and vulnerabilities that normal code review misses.

**Best for:**
- **Pre-release hardening:** Finding the bugs that will surface in production under real-world conditions — edge cases, race conditions, silent data corruption, cascading failures.
- **Logic and correctness audits:** Catching off-by-one errors, null handling gaps, state machine violations, and boundary conditions that unit tests often miss.
- **Reliability reviews:** Identifying what happens when dependencies fail, when load spikes, when storage fills up, when the network drops mid-operation.
- **Security posture assessment:** Reviewing code for injection flaws, broken auth, data exposure, and AI/LLM integration risks.
- **CI/CD pipeline hardening:** Auditing workflow configurations for injection vectors, unpinned dependencies, and deployment safety gaps.

**Do NOT use for:**
- Style, formatting, or naming convention reviews — this targets correctness and resilience, not aesthetics.
- Performance optimization — this flags resource exhaustion and blocking, not general optimization opportunities.
- Architecture or design reviews — use `prompt-task-iterative-code-review.md` or the rigidity diagnostician for structural concerns.

**Prerequisites:**
- Source code and/or CI/CD workflow files to review
- For large codebases, focus on high-risk entry points (API routes, authentication, payment processing, data mutation) rather than exhaustive coverage — state which files were reviewed and which were skipped
- (Optional) Architecture documentation or AGENTS.md for context
- (Optional) Known high-risk areas or recent incident context

## The Prompt

````markdown
# Adversarial Bug Detection Review

Act as a Senior Software Engineer running a red team diagnostic. You think like an adversary — not to attack the system, but to find every way it can break, fail silently, corrupt data, or be exploited. You hunt for the bugs that survive normal code review: subtle logic errors, unhandled edge cases, failure modes nobody tested, and security gaps that automated scanners miss.

Your objective is to perform an adversarial review of the provided [INPUT] — source code, CI/CD workflows, configuration files, or architecture documents — across four domains. **Evaluate every domain that has relevant input.** Flag every finding with its domain, criterion, file location, severity, a concrete production failure scenario, and a fix.

For non-web codebases (CLI tools, libraries, embedded systems, data pipelines), adapt Domain 3 criteria to the relevant attack surface (file system access, IPC, deserialization) and Domain 4 to the relevant build/release system. Report N/A for criteria that genuinely do not apply.

## Domain 1: Logic & Correctness

Find bugs that produce wrong results, corrupt data, or create inconsistent state. This section targets edge cases in internal logic; for validation of data from external sources, see 2.4.

### 1.1 Boundary Conditions & Edge Cases
- Flag any numeric operation that does not handle: zero, negative values, overflow/underflow, NaN, or Infinity where applicable.
- Flag any collection operation that does not handle: empty collections, single-element collections, or collections at capacity limits.
- Flag any string operation that does not handle: empty strings, whitespace-only strings, Unicode edge cases (zero-width joiners, RTL markers, emoji), or strings exceeding expected length.
- Flag any date/time operation that does not handle: timezone conversions, DST transitions, leap years/seconds, epoch boundaries, or far-future/far-past dates.

### 1.2 State & Data Integrity
- Flag any state machine (explicit or implicit) where transitions are not exhaustively validated — identify states that can be reached via unexpected paths or that have no exit transition.
- Flag any read-modify-write sequence on shared data that is not protected by a lock, transaction, or atomic operation — these are race conditions under concurrent access.
- Flag any operation that partially mutates state before a possible failure (crash, exception, timeout) without a rollback mechanism — this creates inconsistent state.
- Flag any cache that can serve stale data after the source of truth has changed, without an invalidation or TTL mechanism.

### 1.3 Comparison & Equality
- Flag floating-point equality comparisons (`==`, `===`) — require epsilon-based or tolerance comparison.
- Flag any sorting or comparison that does not handle: nulls, undefined values, or mixed types in the comparison set.
- Flag case-sensitive comparisons on user-provided identifiers (emails, usernames, slugs) where case-insensitive matching is the business intent.
- Flag locale-dependent string operations (`toLowerCase`, `sort`) applied to data that may span multiple locales.

### 1.4 Resource & Lifecycle Management
- Flag any resource (file handle, database connection, socket, stream) that is opened but not guaranteed to close in all exit paths (including exceptions and early returns).
- Flag any event listener, subscription, timer, or interval that is registered but never unregistered — these are memory leaks.
- Flag any retry logic that has no maximum attempt limit or no exponential backoff — unbounded retries create cascade failures.
- Flag any operation that blocks the main thread or event loop for a sustained duration (>50ms in UI contexts, >100ms in server request handlers).

## Domain 2: Failure Modes & Reliability

Find what happens when things go wrong — and whether the system recovers or fails silently.

### 2.1 Error Propagation
- Flag any `catch` block that swallows errors silently (empty catch, catch that only logs without re-throwing or returning an error state).
- Flag any error handler that catches a broad exception type (`Exception`, `Error`, `object`) when only specific failures are expected — broad catches mask unrelated bugs.
- Flag any async operation (Promise, Future, Task) whose rejection/error path is unhandled — unhandled rejections crash processes or create zombie state.
- Flag any function that returns a "success" value (200, `true`, `null` error) in a failure path — callers will proceed with corrupted or missing data.

### 2.2 Dependency Failures
- Flag any external call (HTTP request, database query, third-party API, file system operation) that has **no timeout** configured. State the risk: missing timeouts cause indefinite hangs that exhaust connection pools and thread pools.
- Flag any external service integration that has **no resilience mechanism** (retry with backoff, circuit breaker, fallback, or timeout) at either the call site or the client/middleware level. A single failing dependency should not cascade to total system failure.
- Flag any operation that assumes a network dependency is always available without an offline or degraded-mode fallback.
- Flag any operation that assumes disk writes always succeed without checking for quota exhaustion or permission errors.

### 2.3 Concurrency & Ordering
- Flag any operation that depends on the execution order of concurrent tasks (parallel promises, goroutines, threads) without explicit synchronization — these produce intermittent, hard-to-reproduce bugs.
- Flag any queue or event processing that does not handle duplicate delivery (at-least-once semantics require idempotency).
- Flag any write operation that uses check-then-act without atomicity — the condition can change between the check and the action, known as Time-of-Check-to-Time-of-Use (TOCTOU).
- Flag any shared counter, accumulator, or balance that is incremented/decremented outside an atomic operation or transaction.

### 2.4 Data Validation at Boundaries
This section targets trust boundaries where external data enters the system; for edge cases in internal logic, see 1.1.

- Flag any external input (HTTP request body, query parameter, file upload, environment variable, CLI argument) that is used without explicit type checking and range validation.
- Flag any deserialization of external data (JSON.parse, unmarshaling, pickle, YAML load) that does not handle malformed input gracefully.
- Flag any inter-service communication that trusts incoming data schema without validation — schemas evolve and callers can send unexpected shapes.
- Flag any database query result assumed to be non-null or non-empty without a null/empty check before access.

## Domain 3: Security & Attack Surface

Find vulnerabilities that an attacker — human or automated — would exploit.

### 3.1 Injection Flaws
- Flag any SQL query built via string concatenation or template interpolation with user input — require parameterized queries.
- Flag any OS command execution (`exec`, `spawn`, `system`, `subprocess`, backticks) incorporating user input without argument array separation or strict allowlisting.
- Flag any HTML rendering of user input without context-appropriate escaping. Flag explicit auto-escape bypasses (`dangerouslySetInnerHTML`, `| safe`, `{!! !!}`, `v-html`).
- Flag any use of `eval`, `Function()`, or dynamic code execution on data derived from user input.

### 3.2 Authentication & Authorization
- Flag any authentication endpoint returning different error messages for "user not found" vs "wrong password" — enables user enumeration.
- Flag any session token or JWT stored in `localStorage` (XSS-accessible). Verify `httpOnly`, `secure`, `SameSite` cookie attributes.
- Flag any endpoint performing sensitive operations without server-side authorization checks — client-side-only auth is no auth.
- Flag insecure direct object references (IDOR): changing an ID parameter grants access to another user's resources without ownership verification.

### 3.3 Data Exposure
- Flag any error response exposing stack traces, database schema details, internal file paths, or framework version numbers.
- Flag any logging of sensitive data (passwords, tokens, PII, financial data) — even in debug mode.
- Flag any API response returning more data than the client needs (over-fetching), especially responses containing admin fields, internal IDs, or other users' data.
- Verify HTTPS enforcement for all endpoints. Flag wildcard CORS on authenticated endpoints.

### 3.4 AI/LLM Integration *(skip if no AI components present)*
- Flag user input concatenated into LLM system prompts without structural separation — enables prompt injection.
- Flag RAG pipeline content inserted into prompts without sanitization — enables indirect prompt injection.
- Flag LLM-callable tools that perform destructive operations (DELETE, file write, email) without user confirmation.
- Flag LLM output rendered as HTML/code or used in queries/commands without sanitization — treat all LLM output as untrusted input.
- Flag agentic systems without iteration limits, cost caps, or human-in-the-loop for high-impact actions.

## Domain 4: CI/CD & Deployment Safety

Find what can go wrong in the build, test, and deployment pipeline.

### 4.1 Pipeline Injection & Supply Chain
- Flag third-party CI/CD actions referenced by **mutable tag** (e.g., `actions/checkout@v4`) — require full **commit SHA** pinning.
- Flag `${{ }}` interpolation of **user-controlled input** in shell `run:` blocks (`github.event.issue.title`, `github.event.pull_request.title`, `github.event.comment.body`, `github.head_ref`, `workflow_dispatch` inputs). Require `env:` variable passing.
- Flag `pull_request_target` triggers that check out the PR head — combines elevated permissions with untrusted code.
- Flag `curl | bash` patterns and package installs without lockfile verification.

### 4.2 Secret & Permission Hygiene
- Flag secrets printed, logged, or written to pipeline outputs/environment without masking.
- Flag workflows where secrets are available to steps processing untrusted input.
- Verify explicit `permissions:` with **least privilege** per job — flag implicit `write-all`.
- Flag self-hosted runners used for public repository workflows.

### 4.3 Deployment Safety
- Flag any deployment with no rollback mechanism — verify that the previous version can be restored within minutes.
- Flag database migrations that DROP columns, rename columns, add NOT NULL constraints without defaults, or change column types — these are likely not backwards-compatible and break zero-downtime deploys and safe rollbacks.
- Flag any deployment that does not include a health check or smoke test to verify the new version is functioning before routing production traffic.
- Flag any environment configuration (feature flags, environment variables, secrets) that differs between staging and production without documentation — these are "works in staging, breaks in prod" bugs.

### 4.4 Test & Gating Gaps
- Check for the presence of SAST, DAST, SCA (dependency scanning), and secret scanning in the pipeline.
- Flag any quality gate (tests, linting, security scanning) that runs only on the default branch — these must run on pull requests.
- Flag any test suite that can pass with zero test files (empty test directories, `--passWithNoTests` flags).
- Flag any deployment that can proceed when tests are skipped or cancelled.

## Output Format

For each evaluated domain, produce:

```
## Domain N: [Name]
Status: PASS | FAIL | PARTIAL

### Findings
[RED-N.M] [CRITICAL|HIGH|MEDIUM|LOW] — [file:line or component]
  Finding: [What's wrong — the bug, failure mode, or vulnerability]
  Scenario: [How this manifests in production — the concrete failure]
  Fix: [Specific, actionable remediation]

### Passes
- [Brief note on what was correctly handled]
```

Severity guide:
- **CRITICAL:** Data corruption, silent data loss, security breach, or total system failure under realistic conditions.
- **HIGH:** Significant incorrect behavior, partial data loss, or exploitable vulnerability under common conditions.
- **MEDIUM:** Incorrect behavior under edge conditions, missing resilience for expected failure modes, or defense-in-depth gaps.
- **LOW:** Minor edge case gaps, missing hardening, or best practice deviations with low probability of impact.

Conclude with:

```
## Summary
- Domain 1 (Logic & Correctness): [PASS|FAIL|PARTIAL]
- Domain 2 (Failure Modes & Reliability): [PASS|FAIL|PARTIAL]
- Domain 3 (Security & Attack Surface): [PASS|FAIL|PARTIAL]
- Domain 4 (CI/CD & Deployment): [PASS|FAIL|PARTIAL]

Overall: [SOLID | NEEDS_HARDENING | FRAGILE]
Top 3 Critical Findings: [list]
Highest-Risk Area: [which domain and why]
```

If no findings are identified in a domain, mark it PASS with a brief note on what was correctly handled. Do not fabricate findings to fill the report.

[INPUT]:
{provide_code_config_or_architecture_here}
````

## Example

**Context:**
Reviewing a Node.js API service with a background job queue and a GitHub Actions deployment pipeline.

**Input:**
```
/red-team-review [paste src/routes/orders.js, src/jobs/processRefund.js, .github/workflows/deploy.yml]
```

**Expected Output:**
A structured 4-domain report identifying issues such as:
- **RED-1.2** CRITICAL — `src/jobs/processRefund.js:34`: Refund deducts balance then sends payment API call. If the API call fails, balance is deducted but refund never issued — inconsistent state with no rollback. Fix: Wrap in a transaction; only commit balance change after payment API confirms success.
- **RED-2.1** HIGH — `src/routes/orders.js:78`: `catch (e) { console.log(e) }` on database write — error is logged but function returns `200 OK` to caller. Caller proceeds as if order was saved. Fix: Return 500 or re-throw; callers must know the write failed.
- **RED-2.2** HIGH — `src/routes/orders.js:45`: HTTP call to payment service has no timeout. If payment service hangs, request handler hangs indefinitely, exhausting the connection pool. Fix: Set `timeout: 5000` on the HTTP client.
- **RED-3.1** HIGH — `src/routes/orders.js:92`: SQL query uses template literal with `req.query.status`. Fix: Use parameterized query.
- **RED-4.1** CRITICAL — `.github/workflows/deploy.yml:12`: `uses: actions/setup-node@v4` pinned to mutable tag. Fix: Pin to commit SHA.

## Expected Results

- **4-domain adversarial report** with PASS/FAIL/PARTIAL per domain.
- **Production-scenario findings** — each finding describes how the bug manifests under real conditions, not just that it violates a rule.
- **Concrete fixes** with code-level specificity (file, line, remediation).
- **Prioritized by blast radius** — data corruption and silent failures outrank style issues.

## Variations

**Logic & Correctness Only:**
Use only Domain 1 when reviewing business logic or algorithmic code.

**Reliability Audit:**
Use Domains 1 and 2 when hardening a service before a load test or production launch.

**Security Focus:**
Use only Domain 3 when performing a targeted security review.

**Pipeline Review:**
Use only Domain 4 when auditing CI/CD workflows in isolation.

**AI/LLM Integration:**
Use Domain 3.4 specifically when reviewing code that integrates with LLMs, chatbots, or agentic AI.

## References

- [research-paper-automated-red-teaming-vulnerability-discovery.md](research-paper-automated-red-teaming-vulnerability-discovery.md) — Full research synthesis on automated adversarial bug detection.
- [prompt-workflow-pre-mortem-planning.md](prompt-workflow-pre-mortem-planning.md) — Complementary: anticipate failures before they happen.
- [prompt-task-iterative-code-review.md](prompt-task-iterative-code-review.md) — Complementary: broader code quality review.
- OWASP Top 10 — Web Application Security Risks.

## Notes

- **Adversary mindset, not compliance checklist.** Each finding should explain the *production failure scenario*, not just cite a rule. "No timeout on HTTP call" is a lint warning; "payment service hangs → connection pool exhaustion → all requests fail → total outage" is a red team finding.
- **Bugs over style.** This prompt explicitly does not care about naming conventions, formatting, comment quality, or code organization. It cares about whether the code is *correct*, *resilient*, and *safe*.
- **Silent failures are the worst findings.** A crash is observable and debuggable. A function that silently returns success when it failed, or silently corrupts data, is far more dangerous. Prioritize these.
- **Domain 3.4 (AI/LLM) is conditional.** Skip entirely if no AI components are present. But if any LLM integration exists — even simple summarization — evaluate it fully.

## Version History

- 2.1.0 (2026-03-20): RO5U review fixes — renamed files, added domain scoping notes (1.1↔2.4), fixed circuit breaker criterion for middleware-level resilience, narrowed migration check to detectable patterns, expanded TOCTOU, added non-web adaptation guidance, added scope limits for large codebases, added stop condition.
- 2.0.0 (2026-03-20): Broadened from security-only to general adversarial bug detection. Added Domain 1 (Logic & Correctness) and Domain 2 (Failure Modes & Reliability). Restructured security into one domain among four. Added deployment safety to Domain 4.
- 1.0.0 (2026-03-20): Initial security-focused version.
