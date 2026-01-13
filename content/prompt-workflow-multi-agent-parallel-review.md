---
title: Multi-Agent Parallel Code Review Workflow (Extended Rule of 5)
type: prompt
subtype: workflow
tags: [code-review, multi-agent, parallel, workflow, advanced, team, extended]
tools: [claude-code]
status: tested
created: 2026-01-12
updated: 2026-01-13
version: 1.1.0
related: [research-paper-rule-of-5-multi-agent-review.md, research-paper-cognitive-architectures-for-prompts.md, prompt-task-iterative-code-review.md, prompt-workflow-rule-of-5-review.md]
source: extended-from-steve-yegge-rule-of-5-principle
---

# Multi-Agent Parallel Code Review Workflow (Extended Rule of 5)

## About This Workflow

This is the **extended multi-agent parallel variant** of Steve Yegge's Rule of 5 principle. It provides the most detailed, prescriptive implementation of the Wave/Gate architecture for maximum code review quality.

**Architecture:** 3 Waves + 2 Gates with specialized parallel agents
**Detection Rate:** 85-92% (vs 75-85% for Steve's original)
**Cost:** 2-3x more expensive than original
**Best For:** Security-critical systems, large refactorings, pre-production gates

**Note:** For 80% of code reviews, use **prompt-task-iterative-code-review.md** (Steve's original linear approach). This workflow is for high-stakes scenarios where the additional 10% detection justifies 2x cost.

## When to Use

**Use this workflow when:**
- Reviewing security-critical code before production
- Large features or refactorings (>500 LOC)
- Team code reviews where multiple perspectives are needed
- High-stakes releases where quality is paramount
- You have time for comprehensive review (30-45 minutes)
- Using Claude Code with multi-agent support

**When NOT to use:**
- Quick fixes or small changes (<100 LOC) - use iterative review instead
- Time-sensitive hotfixes - do manual review
- Solo learning projects - simpler prompts suffice
- Code that's already been through human review and you just want a final check

**Prerequisites:**
- Claude Code CLI installed
- Code is complete and functional
- Basic tests pass
- You understand multi-agent Task execution

## The Prompt

```
I need a comprehensive multi-agent parallel code review using the Wave/Gate architecture.

CODE TO REVIEW:
[paste code or specify: "Review all files in src/auth/"]

ARCHITECTURE:
Wave 1 (Parallel) → Gate 1 (Sequential) → Wave 2 (Parallel) → Gate 2 (Sequential) → Wave 3 (Sequential)

Execute this workflow:

═══════════════════════════════════════════════════════════════
WAVE 1: PARALLEL INDEPENDENT ANALYSIS
═══════════════════════════════════════════════════════════════

Launch 5 parallel tasks. Each task is independent and can run simultaneously.

TASK 1: Security Review
Role: Security Engineer
Focus:
- OWASP Top 10 vulnerabilities
- Input validation and sanitization
- Authentication and authorization flaws
- SQL injection, XSS, CSRF, SSRF
- Secret management and data exposure
- API security and rate limiting
- Cryptography usage

Output JSON format:
{
  "issues": [
    {
      "id": "SEC-001",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "category": "authentication|input-validation|data-exposure|cryptography",
      "cwe_id": "CWE-XXX",
      "location": "file.js:line",
      "description": "Detailed description",
      "attack_vector": "How an attacker could exploit this",
      "recommendation": "Specific fix with code example"
    }
  ],
  "security_score": 0-3,
  "summary": "One-line summary"
}

TASK 2: Performance Review
Role: Performance Engineer
Focus:
- Time complexity (O(n²), O(n³) patterns)
- Database queries (N+1, missing indexes, full table scans)
- Memory allocation and leaks
- Unnecessary loops and iterations
- Caching opportunities
- Blocking I/O operations
- Resource pooling

Output JSON format:
{
  "issues": [
    {
      "id": "PERF-001",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "category": "complexity|database|memory|io-blocking|caching",
      "location": "file.js:line",
      "description": "Issue description",
      "current_performance": "Quantified impact",
      "impact": "What happens at scale",
      "recommendation": "Fix with code example",
      "code_example": "Working example"
    }
  ],
  "performance_score": 0-3,
  "bottlenecks": ["Top 3 performance concerns"],
  "scaling_analysis": "Behavior at 10x load"
}

TASK 3: Maintainability Review
Role: Future Developer (6 months out, original author gone)
Focus:
- Code clarity and readability
- Documentation (comments, docstrings, README)
- Pattern consistency across codebase
- Naming conventions (clear, descriptive)
- Technical debt indicators
- DRY violations
- Magic numbers and hard-coded values
- Complex conditionals

Output JSON format:
{
  "issues": [
    {
      "id": "MAINT-001",
      "severity": "HIGH|MEDIUM|LOW",
      "category": "naming|documentation|consistency|complexity|debt",
      "location": "file.js:line",
      "description": "What's confusing",
      "confusion_risk": "HIGH|MEDIUM|LOW",
      "recommendation": "How to improve clarity"
    }
  ],
  "maintainability_score": 0-3,
  "debt_areas": ["Concerning patterns"],
  "consistency_issues": ["Patterns that vary"]
}

TASK 4: Requirements Validation
Role: QA Engineer
Focus:
- Requirements coverage (are all requirements implemented?)
- Edge case handling
- Test coverage gaps
- Behavioral correctness
- Missing functionality
- Acceptance criteria satisfaction

Output JSON format:
{
  "issues": [
    {
      "id": "REQ-001",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "requirement_id": "REQ-XXX",
      "status": "MISSING|INCOMPLETE|INCORRECT",
      "description": "What's missing or wrong",
      "expected": "What should happen",
      "actual": "What happens now",
      "test_gap": "Missing tests",
      "edge_cases_missing": ["List of unhandled edge cases"]
    }
  ],
  "coverage_score": 0-3,
  "requirements_coverage": "X/Y requirements implemented",
  "uncovered": ["List of uncovered requirements"],
  "edge_cases": ["Unhandled edge cases"]
}

TASK 5: Operations Review
Role: SRE (on-call at 3am when this breaks)
Focus:
- Failure modes and error handling
- Observability (logging, metrics, tracing)
- Timeout and retry logic
- Circuit breakers and graceful degradation
- Resource management (connections, files, memory)
- Deployment/rollback complexity
- Configuration management
- Health checks and readiness probes

Output JSON format:
{
  "issues": [
    {
      "id": "OPS-001",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "category": "observability|resilience|deployment|resources",
      "location": "file.js:line",
      "description": "What will fail",
      "failure_mode": "How it fails",
      "impact": "Blast radius",
      "blast_radius": "Who gets affected",
      "recommendation": "How to make it resilient",
      "code_example": "Implementation"
    }
  ],
  "reliability_score": 0-3,
  "critical_paths": ["Endpoints with no error handling"],
  "observability_gaps": ["Areas with insufficient logging"],
  "deployment_risks": ["Risky deployment patterns"]
}

═══════════════════════════════════════════════════════════════
GATE 1: CONFLICT RESOLUTION (Wait for all Wave 1 tasks)
═══════════════════════════════════════════════════════════════

After all 5 tasks complete, consolidate findings:

TASK 6: Consolidation
Role: Senior Technical Lead

Input: All JSON outputs from Wave 1

Tasks:
1. DEDUPLICATE ISSUES
   - Same issue reported by multiple reviewers → merge
   - Similar issues → merge if same root cause
   - Different perspectives on same code → keep separate if addressing different concerns

2. RESOLVE SEVERITY CONFLICTS
   Rules:
   - Security CRITICAL always wins
   - Take highest severity if 2+ reviewers agree it's a problem
   - Downgrade if only 1 reviewer flagged and others cleared

3. CALCULATE CONFIDENCE
   - Found by 1 reviewer: confidence = 0.60
   - Found by 2 reviewers: confidence = 0.80
   - Found by 3+ reviewers: confidence = 0.95
   - Severity disagreement: reduce confidence by 0.15

4. IDENTIFY CROSS-CUTTING CONCERNS
   - Issues affecting multiple domains
   - Systemic patterns (same problem in multiple places)

Output JSON format:
{
  "consolidated_issues": [
    {
      "id": "CONS-001",
      "original_ids": ["SEC-001", "OPS-003", "REQ-005"],
      "severity": "CRITICAL",
      "found_by": ["security-reviewer", "operations-reviewer", "requirements-validator"],
      "confidence": 0.95,
      "consensus": true,
      "location": "file.js:line",
      "description": "Merged description",
      "merged_recommendations": "Consolidated fix",
      "cross_cutting": true
    }
  ],
  "conflicts_resolved": [
    {
      "issue": "Description",
      "original_severities": {},
      "resolution": "CRITICAL",
      "reason": "Why this severity"
    }
  ],
  "critical_themes": [
    "Pattern 1: Lack of input validation across 5 endpoints",
    "Pattern 2: Missing error handling in all external API calls"
  ],
  "statistics": {
    "total_issues": 47,
    "duplicates_merged": 12,
    "conflicts_resolved": 8,
    "high_confidence": 25
  }
}

═══════════════════════════════════════════════════════════════
WAVE 2: PARALLEL CROSS-VALIDATION
═══════════════════════════════════════════════════════════════

Launch 2-3 parallel tasks reviewing the consolidated findings.

TASK 7: Meta-Review
Role: Quality Control Lead

Input: All Wave 1 outputs + Gate 1 consolidation

Check:
1. COVERAGE GAPS - What wasn't examined?
2. FALSE POSITIVES - Are flagged issues actually problems?
3. SEVERITY CALIBRATION - Are CRITICAL ratings actually critical?
4. REVIEWER QUALITY - Did reviewers follow their focus areas?
5. SYSTEMIC PATTERNS - Do issues indicate deeper architectural problems?

Output JSON format:
{
  "coverage_gaps": [
    {
      "area": "caching strategy",
      "severity": "HIGH",
      "reason": "No reviewer examined caching",
      "assign_to": "performance-reviewer",
      "needs_focused_pass": true
    }
  ],
  "false_positives": [
    {
      "issue_id": "MAINT-005",
      "reviewer": "maintainer-reviewer",
      "flagged_as": "Unclear variable name",
      "reality": "Established codebase convention",
      "recommendation": "Remove or downgrade to LOW"
    }
  ],
  "severity_adjustments": [],
  "systemic_patterns": [
    {
      "pattern": "Missing input validation",
      "occurrences": 8,
      "root_cause": "No validation middleware framework",
      "recommendation": "Add express-validator or similar",
      "impact": "HIGH"
    }
  ],
  "quality_score": 0-3,
  "needs_iteration": false,
  "confidence_in_findings": 0.85
}

TASK 8: Integration Analysis
Role: Systems Architect

Check for:
- System-wide impacts of issues
- Cascading failure scenarios
- Service dependency problems
- Data flow issues across boundaries

═══════════════════════════════════════════════════════════════
GATE 2: FINAL SYNTHESIS (Wait for Wave 2)
═══════════════════════════════════════════════════════════════

Synthesize everything into final report.

TASK 9: Final Report

Input: All previous outputs

Generate:
1. EXECUTIVE SUMMARY
   - Total issues by severity
   - Blockers (CRITICAL issues that prevent merge/deploy)
   - Key systemic issues

2. PRIORITIZED ACTION LIST
   - Must fix before merge (CRITICAL)
   - Should fix before deploy (HIGH)
   - Can fix later (MEDIUM/LOW)

3. BLOCKING ASSESSMENT
   - BLOCKS MERGE: Has CRITICAL issues
   - BLOCKS DEPLOY: Has HIGH operational risks
   - APPROVED: Ready for production
   - APPROVED_WITH_NOTES: Deploy with monitoring plan

4. CONVERGENCE METRICS
   - Number of issues found: CRITICAL/HIGH/MEDIUM/LOW
   - Confidence level: X% high-confidence issues
   - False positive estimate: X%
   - Coverage assessment: X% of code reviewed thoroughly

Output format:
```markdown
# Code Review Report

## Executive Summary
[2-3 sentence summary]

## Status: [BLOCKS_MERGE | BLOCKS_DEPLOY | APPROVED | APPROVED_WITH_NOTES]

## Critical Issues (MUST FIX)
[List with file:line and brief description]

## High Priority (SHOULD FIX)
[List with file:line and brief description]

## Systemic Issues
[Patterns that indicate architectural problems]

## Metrics
- Total issues: X CRITICAL, Y HIGH, Z MEDIUM, W LOW
- High-confidence issues: X%
- Estimated false positives: Y%
- Coverage: Z% thorough

## Recommended Next Actions
1. [First action]
2. [Second action]
3. [Third action]
```

═══════════════════════════════════════════════════════════════
WAVE 3: CONVERGENCE CHECK
═══════════════════════════════════════════════════════════════

Determine if another iteration is needed:

CONVERGED if:
- new_critical_count == 0 AND
- new_issue_rate < 0.10 AND
- false_positive_rate < 0.20

ESCALATE_TO_HUMAN if:
- iteration >= 3 OR
- Found conflicting CRITICAL issues OR
- Uncertain about severity

ITERATE if:
- new_critical_count > 0 OR
- new_issue_rate >= 0.10

If ITERATE: Start Wave 1 again focusing only on CRITICAL and HIGH issues.
```

## Example

**Context:**
Reviewing a new authentication microservice before deploying to staging.

**Input:**
```
Review all files in src/auth/

Execute multi-agent parallel review workflow.
```

**Expected Output:**

*(Abbreviated for space - full output would include all task results)*

```
═══════════════════════════════════════════════════════════════
WAVE 1 COMPLETE: 5 PARALLEL REVIEWS FINISHED
═══════════════════════════════════════════════════════════════

Security Review: Found 8 issues (3 CRITICAL, 2 HIGH, 3 MEDIUM)
Performance Review: Found 4 issues (0 CRITICAL, 1 HIGH, 3 MEDIUM)
Maintainability Review: Found 12 issues (0 CRITICAL, 3 HIGH, 9 LOW)
Requirements Review: Found 6 issues (1 CRITICAL, 2 HIGH, 3 MEDIUM)
Operations Review: Found 7 issues (2 CRITICAL, 3 HIGH, 2 MEDIUM)

Total: 37 issues flagged

═══════════════════════════════════════════════════════════════
GATE 1 COMPLETE: CONSOLIDATION FINISHED
═══════════════════════════════════════════════════════════════

After deduplication and conflict resolution:
- 24 unique issues (13 were duplicates or merged)
- 4 CRITICAL (all high confidence)
- 8 HIGH
- 9 MEDIUM
- 3 LOW

Critical Themes Identified:
1. No input validation framework (8 instances)
2. JWT tokens never expire (security + ops concern)
3. No rate limiting on any endpoint (security + ops concern)
4. Database queries missing indexes (performance + ops concern)

═══════════════════════════════════════════════════════════════
WAVE 2 COMPLETE: META-REVIEW AND INTEGRATION ANALYSIS
═══════════════════════════════════════════════════════════════

Meta-Review Findings:
- Coverage: 92% thorough
- False positives: 3 issues downgraded (12%)
- 2 coverage gaps found: token refresh flow, rate limiting strategy

Integration Analysis:
- Cascading failure risk: If auth service down, all dependent services fail
- Recommendation: Add circuit breaker pattern to API gateway

═══════════════════════════════════════════════════════════════
GATE 2 COMPLETE: FINAL SYNTHESIS
═══════════════════════════════════════════════════════════════

# Code Review Report - Auth Microservice

## Executive Summary
Reviewed authentication microservice (487 LOC across 8 files). Found 4 CRITICAL security issues that block deployment, plus systemic patterns indicating missing foundational infrastructure (input validation, rate limiting).

## Status: BLOCKS_DEPLOY ⛔

## Critical Issues (MUST FIX BEFORE DEPLOY)

1. **SEC-001** | src/auth/routes.js:45
   JWT tokens have no expiration (exp claim missing)
   Impact: Stolen tokens work forever
   Fix: Add exp claim with 15-minute expiry, implement refresh tokens

2. **SEC-003** | src/auth/middleware/validate.js:12
   SQL injection in user lookup query
   Impact: Database compromise, data breach
   Fix: Use parameterized queries

3. **SEC-007** | src/auth/routes.js:89
   Passwords stored with MD5 hash
   Impact: Rainbow table attacks can recover passwords
   Fix: Use bcrypt with salt rounds >= 10

4. **OPS-002** | All endpoints
   No rate limiting on authentication endpoints
   Impact: Brute force attacks, credential stuffing
   Fix: Implement rate limiting (5 attempts/minute per IP)

## High Priority (FIX BEFORE PRODUCTION)

1. **PERF-002** - Missing index on users.email (slow login)
2. **OPS-005** - No circuit breaker for external OAuth providers
3. **REQ-001** - Password reset flow not implemented
4. **MAINT-008** - No logging of authentication attempts

## Systemic Issues

**Pattern: Missing Security Foundation**
8 endpoints lack input validation. No validation framework in place.
Recommendation: Adopt express-validator, add validation middleware to all routes

**Pattern: Operational Readiness Gaps**
No monitoring, no health checks, no graceful shutdown
Recommendation: Add /health endpoint, implement graceful shutdown, add Prometheus metrics

## Metrics
- Total issues: 4 CRITICAL, 8 HIGH, 9 MEDIUM, 3 LOW
- High-confidence issues: 87%
- Estimated false positives: 12%
- Coverage: 92% thorough

## Recommended Next Actions

**Immediate (blocks deploy):**
1. Fix all 4 CRITICAL issues
2. Add input validation framework
3. Add rate limiting middleware

**Before production (1-2 days):**
4. Fix all HIGH issues
5. Implement monitoring and health checks
6. Add integration tests for auth flows

**Technical debt (next sprint):**
7. Address MEDIUM/LOW issues
8. Improve documentation
9. Add performance tests

═══════════════════════════════════════════════════════════════
CONVERGENCE: NOT CONVERGED
═══════════════════════════════════════════════════════════════

Reason: 4 CRITICAL issues found
Recommendation: Fix CRITICAL issues and re-run focused security + ops review

Next iteration focus:
- Security validation of fixes
- Operations review of rate limiting implementation
- Integration testing of changes
```

## Expected Results

- **Comprehensive coverage** - Multiple expert perspectives
- **High confidence** - Cross-validated findings (3+ agents = 95% confidence)
- **Faster than sequential** - 10-15 minutes vs 20-30 minutes
- **Better quality** - 85-92% defect detection vs 75-85% sequential
- **Prioritized actions** - Clear BLOCKS_DEPLOY vs can-fix-later
- **Systemic insights** - Patterns that single reviewers miss

## Variations

**For smaller changes (200-500 LOC):**
```
Simplified Wave 1:
- Combine Security + Operations into one task
- Combine Performance + Maintainability into one task
- Keep Requirements separate

3 parallel tasks instead of 5.
```

**For frontend-specific code:**
```
Replace Wave 1 tasks with:
- Security (XSS, CSRF, data validation)
- Performance (rendering, bundle size, re-renders)
- Accessibility (ARIA, keyboard nav, screen readers)
- UX (error states, loading states, responsive)
- Code Quality (hooks rules, component structure)
```

**For infrastructure/DevOps code:**
```
Wave 1 focus:
- Security (secrets, permissions, network rules)
- Reliability (failure modes, disaster recovery)
- Performance (resource limits, autoscaling)
- Cost Optimization (resource efficiency)
- Operations (monitoring, alerting, runbooks)
```

**For iterative refinement:**
```
After first pass finds issues:

Iteration 2+:
- Wave 1: Only re-review areas with CRITICAL/HIGH issues
- Skip areas that passed with only LOW issues
- Gate 1: Check if fixes introduced new problems
- Wave 3: Convergence check (stop when no new CRITICAL)
```

## References

**Rule of 5 Principle:**
- **Steve Yegge's Article:** https://steve-yegge.medium.com/six-new-tips-for-better-coding-with-agents-d4e9c86e42a9
- **Gastown Implementation:** https://github.com/steveyegge/gastown/blob/main/internal/formula/formulas/rule-of-five.formula.toml
- **Research Paper:** research-paper-rule-of-5-multi-agent-review.md

**Related Prompts:**
- **prompt-task-iterative-code-review.md** - Steve's original linear approach (use this for 80% of reviews)
- **prompt-workflow-rule-of-5-review.md** - Simplified multi-agent orchestrator (less prescriptive than this)
- **prompt-task-plan-review.md** - Apply Rule of 5 principle to plan review
- **prompt-task-research-review.md** - Apply Rule of 5 principle to research review

## Notes

**Claude Code specific usage:**
```bash
# This prompt is designed for Claude Code's Task system
# The parallel tasks automatically run simultaneously
# You just paste the full prompt and Claude handles orchestration
```

**Cost considerations:**
- 5-8 parallel agents running
- 14-42 API calls total
- Typical cost: $0.80-1.20 for 500 LOC review
- 2-3x more expensive than sequential, but faster and higher quality

**Time investment:**
- AI execution: 10-15 minutes (wall clock, not cumulative)
- Your review of results: 10-15 minutes
- Total: 20-30 minutes for comprehensive review

**When to iterate:**
- Found CRITICAL issues → fix them → re-run focused review
- After 3 iterations, if still finding CRITICAL, escalate to human architect
- For MEDIUM/LOW issues, one pass is usually sufficient

**Interpreting confidence scores:**
- 0.95 (3+ agents agree) → Almost certainly real, fix it
- 0.80 (2 agents agree) → Likely real, investigate
- 0.60 (1 agent only) → Possible false positive, verify manually

**False positive handling:**
- Meta-review identifies likely false positives
- Look for issues flagged by only 1 agent with unusual reasoning
- When in doubt, ask for human verification

**Best practices:**
1. Run this on code that's already passed basic tests
2. Review the final report carefully - don't blindly fix everything
3. Prioritize CRITICAL > HIGH > MEDIUM > LOW
4. Use systemic pattern insights to prevent future issues
5. Track which types of issues are commonly found - improve your coding habits

**Integration with CI/CD:**
- Run this workflow on PR creation
- Block merge on CRITICAL issues
- Comment consolidated findings on PR
- Track metrics over time (are we improving?)

## Version History

- 1.1.0 (2026-01-13): Updated to clarify this is extended variant of Steve Yegge's Rule of 5; added gastown reference; added guidance on when to use vs. original
- 1.0.0 (2026-01-12): Initial multi-agent parallel workflow based on Rule of 5 research
