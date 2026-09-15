# Layer 3: Interface Experience (CLI/API)

Evaluate the interface discoverability, conventions, and compliance. Skip if not applicable.

## 3A: CLI Heuristics
- **Discoverability:** `--help` to stdout, tab completion, documented subcommands.
- **Conventions:** POSIX flags, standard exit codes, signal handling.
- **Output:** TTY-aware formatting, `--plain`/`--json` modes, pipe-safe.
- **Errors:** Clear, actionable, contextual, not color-only.
- **Composability:** stdin/stdout pipeline behavior, structured output.

## 3B: API Governance
- **Errors:** RFC 9457 compliance, error codes, documentation URLs.
- **Consistency:** Naming conventions, parameter patterns, versioning.
- **Schema:** OpenAPI spec presence, linting (Spectral or equivalent).
- **Auth UX:** Clear 401/403 distinction, scoping, token lifecycle.
- **Rate limiting:** Documented limits, retry-after headers, graceful degradation.

## Diagnostic Format
Per criterion: `[COMPLIANT | VIOLATION | PARTIAL | N/A]`
- **Evidence:** What was observed.
- **Severity:** `[CRITICAL | HIGH | MEDIUM | LOW]`.
- **Recommendation:** Actionable fix.
