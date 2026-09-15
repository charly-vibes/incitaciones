<!-- Full version: content/prompt-task-red-team-review.md -->
Act as a Senior Software Engineer running a red team diagnostic. Find every way the system can break, fail silently, corrupt data, or be exploited. Review the provided [INPUT] across four domains. Flag every finding with domain, criterion, file location, severity, concrete production failure scenario, and fix. For non-web codebases (CLI tools, libraries, data pipelines), adapt criteria to the relevant attack surface and build system; report N/A where criteria genuinely do not apply.

## Domain 1: Logic & Correctness

Targets edge cases in internal logic; for external input validation see 2.4.

### 1.1 Boundary Conditions & Edge Cases
- Flag numeric ops not handling: zero, negative, overflow/underflow, NaN, Infinity.
- Flag collection ops not handling: empty, single-element, at-capacity.
- Flag string ops not handling: empty, whitespace-only, Unicode edge cases (ZWJ, RTL, emoji), exceeding length.
- Flag date/time ops not handling: timezone conversion, DST, leap years/seconds, epoch boundaries.

### 1.2 State & Data Integrity
- Flag state machines with unvalidated transitions or unreachable/inescapable states.
- Flag read-modify-write on shared data without lock/transaction/atomic (race conditions).
- Flag partial mutation before possible failure without rollback (inconsistent state).
- Flag caches servable stale after source-of-truth change without invalidation/TTL.

### 1.3 Comparison & Equality
- Flag float equality (`==`/`===`) — require epsilon comparison.
- Flag sort/compare not handling nulls, undefined, mixed types.
- Flag case-sensitive comparison on user identifiers where case-insensitive is intent.
- Flag locale-dependent string ops on multi-locale data.

### 1.4 Resource & Lifecycle
- Flag resources (files, connections, sockets) not guaranteed to close in all paths (including exceptions).
- Flag event listeners/timers registered but never unregistered (memory leaks).
- Flag retry logic without max attempts or backoff (cascade failures).
- Flag main thread/event loop blocking (>50ms UI, >100ms server).

## Domain 2: Failure Modes & Reliability

### 2.1 Error Propagation
- Flag silent error swallowing (empty catch, log-only without re-throw/error return).
- Flag broad exception catches masking unrelated bugs.
- Flag unhandled async rejections (promises, futures).
- Flag functions returning "success" on failure paths — callers proceed with bad data.

### 2.2 Dependency Failures
- Flag external calls (HTTP, DB, API, filesystem) with **no timeout** — causes indefinite hangs.
- Flag external service integrations with **no resilience mechanism** (retry with backoff, circuit breaker, fallback, or timeout) at either the call site or client/middleware level — single dependency cascades to total failure.
- Flag assumptions of always-available network or always-successful disk writes.

### 2.3 Concurrency & Ordering
- Flag operations depending on concurrent task execution order without synchronization.
- Flag event/queue processing without idempotency (at-least-once requires dedup).
- Flag check-then-act without atomicity — Time-of-Check-to-Time-of-Use (TOCTOU).
- Flag shared counters/balances outside atomic operations.

### 2.4 Data Validation at Boundaries

Targets trust boundaries where external data enters the system; for internal logic edge cases see 1.1.

- Flag external input used without type checking and range validation.
- Flag deserialization of external data without malformed-input handling.
- Flag inter-service communication trusting schema without validation.
- Flag DB query results assumed non-null/non-empty without checks.

## Domain 3: Security & Attack Surface

### 3.1 Injection Flaws
- Flag SQL via string concatenation — require parameterized queries.
- Flag OS command execution with user input — require argument arrays/allowlisting.
- Flag unescaped user input in HTML — verify auto-escaping, flag bypasses (`dangerouslySetInnerHTML`, `| safe`, `{!! !!}`, `v-html`).
- Flag `eval`/`Function()` on user-derived data.

### 3.2 Authentication & Authorization
- Flag user enumeration via differing auth error messages ("user not found" vs "wrong password").
- Flag session tokens or JWTs in `localStorage` (XSS-accessible). Verify `httpOnly`/`secure`/`SameSite` cookies.
- Flag endpoints performing sensitive operations without server-side authorization — client-side-only auth is no auth.
- Flag insecure direct object references (IDOR): ID parameter changes granting cross-user access without ownership check.

### 3.3 Data Exposure
- Flag stack traces, schema, paths, versions in client errors.
- Flag sensitive data in logs (passwords, tokens, PII).
- Flag over-fetching exposing admin fields, internal IDs, or other users' data.
- Verify HTTPS. Flag CORS wildcard on auth endpoints.

### 3.4 AI/LLM Integration *(skip if no AI components)*
- Flag user input in system prompts without structural separation (prompt injection).
- Flag unsanitized RAG content in prompts (indirect injection).
- Flag destructive LLM-callable tools without user confirmation.
- Flag LLM output used in HTML/queries/commands without sanitization — treat as untrusted.
- Flag agentic systems without iteration limits, cost caps, human-in-the-loop.

## Domain 4: CI/CD & Deployment Safety

### 4.1 Pipeline Injection & Supply Chain
- Flag actions pinned by **mutable tag** — require **commit SHA**. Flag `${{ }}` interpolation of user-controlled input in `run:` — require `env:`. Flag `pull_request_target` + PR head checkout. Flag `curl | bash` and installs without lockfiles.

### 4.2 Secret & Permission Hygiene
- Flag secrets in outputs/logs. Flag secrets accessible during untrusted input processing. Verify least-privilege `permissions:`. Flag self-hosted runners on public repos.

### 4.3 Deployment Safety
- Flag deploys with no rollback. Flag migrations that DROP columns, rename columns, add NOT NULL without defaults, or change column types (likely not backwards-compatible). Flag deploys without health checks. Flag undocumented staging/prod config differences.

### 4.4 Test & Gating Gaps
- Check for SAST/DAST/SCA/secret scanning as **blocking gates**. Flag gates only on default branch. Flag test suites passable with zero tests. Flag deploys proceeding on skipped/cancelled tests.

## Output Format

Per domain:
```
## Domain N: [Name]
Status: PASS | FAIL | PARTIAL
### Findings
[RED-N.M] [CRITICAL|HIGH|MEDIUM|LOW] — [file:line]
  Finding: [Bug, failure mode, or vulnerability]
  Scenario: [How this manifests in production]
  Fix: [Actionable remediation]
### Passes
- [What was correct]
```

Severity: CRITICAL = data corruption/loss/breach/total failure. HIGH = significant incorrect behavior under common conditions. MEDIUM = edge-case bugs or missing resilience. LOW = minor gaps, low probability.

Conclude with:
```
## Summary
- Domain 1 (Logic): [PASS|FAIL|PARTIAL]
- Domain 2 (Reliability): [PASS|FAIL|PARTIAL]
- Domain 3 (Security): [PASS|FAIL|PARTIAL]
- Domain 4 (CI/CD): [PASS|FAIL|PARTIAL]
Overall: [SOLID | NEEDS_HARDENING | FRAGILE]
Top 3 Critical Findings: [list]
Highest-Risk Area: [domain and why]
```

If no findings in a domain, mark PASS with a brief note on what was correct. Do not fabricate findings.

[INPUT]:
{provide_code_config_or_architecture_here}
