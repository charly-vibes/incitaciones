# Multi-Agent Code Review Criteria

Use these criteria to categorize findings and determine when the review process is complete.

## Issue Severity Definitions

| Severity | Criteria | Example Findings |
| :--- | :--- | :--- |
| **CRITICAL** | Severe security vulnerability, data loss risk, or fundamental logic failure that makes the code unshipable. | SQL Injection, plaintext passwords, unhandled exceptions in core path. |
| **HIGH** | Significant performance issue, major regression risk, or violation of key requirements. | Missing index on hot query, non-singular requirement, missing error states. |
| **MEDIUM** | Minor technical debt, sub-optimal pattern, or readability issues. | Magic strings, DRY violations, lack of docstrings, magic numbers. |
| **LOW** | Nice to have. Stylistic improvements, minor metadata gaps, or typos in non-critical comments. | Minor formatting, redundant comments, small consistency improvements. |

## Convergence Criteria

**CONVERGED** if:
- All CRITICAL and HIGH severity issues have been cross-validated by at least two agents (e.g., Security Reviewer and False Positive Checker).
- Gate 1 and Gate 2 synthesis steps result in a stable list of issues with no major contradictions.
- The Integration Validator confirms that no new cascading failures are likely.

**ITERATE** if:
- Wave 2 identifies more than two HIGH or one CRITICAL severity issue that were missed in Wave 1.
- Specialist agents have directly contradictory findings on a CRITICAL issue.

**NEEDS_HUMAN** if:
- After two full multi-agent cycles, no consensus is reached on a CRITICAL issue.
- The specialist agents identify a foundational architectural conflict.

## Verification Checklist (For Orchestrator)

As the Lead Orchestration Engineer, you MUST:
- [ ] Use `read_file` to confirm that every CRITICAL finding actually exists at the cited file:line.
- [ ] Cross-check the "Requirements Validator" findings against the actual specification file (if provided).
- [ ] Verify that suggested performance optimizations don't violate existing project constraints (e.g., using a library that is explicitly forbidden).
