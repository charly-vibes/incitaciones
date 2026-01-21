---
title: Iterative Code Review with Rule of 5 (Steve Yegge's Original)
type: prompt
tags: [code-review, rule-of-5, iteration, convergence, quality-assurance, linear]
tools: [claude-code, cursor, aider, gemini, gastown]
status: tested
created: 2026-01-12
updated: 2026-01-13
version: 1.1.0
related: [research-paper-rule-of-5-multi-agent-review.md, research-paper-cognitive-architectures-for-prompts.md, prompt-workflow-multi-agent-parallel-review.md]
source: steve-yegge-gastown-rule-of-five-formula
---

# Iterative Code Review with Rule of 5 (Steve Yegge's Original)

## About This Prompt

This prompt implements **Steve Yegge's original Rule of 5 approach** as found in his gastown tool. It follows a linear 5-stage refinement process: Draft → Correctness → Clarity → Edge Cases → Excellence.

**Key characteristic:** Sequential stages where each builds on insights from the previous stage.

**Source:** Inspired by Steve's gastown `rule-of-five.formula.toml`

## When to Use

**This is Steve's original approach - use it for 80% of your code reviews.**

**Use this prompt when:**
- Reviewing your own code before committing
- Standard code review for non-critical systems
- Doing a quality check on a feature
- Working solo without a code review partner
- You want high-quality review (75-85% detection) without complexity
- Budget-conscious scenarios ($0.40-0.60 per review)
- Learning AI-assisted code review
- Time budget: 12-17 minutes for thorough review

**When NOT to use (consider extended multi-agent variant instead):**
- Security-critical code requiring 85-92% detection
- Large refactorings (>500 LOC) with high cascading failure risk
- Pre-production quality gates for critical systems
- When you need cross-validated findings from multiple specialized perspectives

**When NOT to use (neither approach is sufficient):**
- Very large changes (>1000 LOC) - chunk it first
- Deep architectural review - use specialized prompts
- Compliance/regulatory review - need human expert

**Prerequisites:**
- Code is complete and functional
- Basic tests pass
- You've done a first self-review already

## The Prompt

### Original Variant (Steve's Actual Stages)

This follows Steve Yegge's actual gastown implementation most closely:

````
I need you to review this code using the Rule of 5 - five stages of iterative refinement.

CODE TO REVIEW:
[paste your code or specify file path]

PHILOSOPHY: "Breadth-first exploration, then editorial passes"

STAGE 1: DRAFT - Get the shape right
Question: Is the overall approach sound?
Focus:
- Don't aim for perfection
- Review overall structure and approach
- Identify major architectural issues
- Get the "shape" right before refining details
- Is this solving the right problem?

Output: High-level assessment, major structural issues

STAGE 2: CORRECTNESS - Is the logic sound?
Question: Are there errors, bugs, or logical flaws?
Focus:
- Fix errors and bugs identified in Stage 1
- Verify logical correctness
- Check algorithms and data structures
- Ensure functions do what they claim
- Identify off-by-one errors, wrong operators, etc.

Output: List of correctness issues with locations

STAGE 3: CLARITY - Can someone else understand this?
Question: Is the code comprehensible?
Focus:
- Improve readability based on Stage 2 fixes
- Remove or explain technical jargon
- Clarify variable and function names
- Improve code organization
- Add comments where intent isn't obvious

Output: Clarity improvements and naming suggestions

STAGE 4: EDGE CASES - What could go wrong?
Question: Are boundary conditions handled?
Focus:
- Identify gaps from previous stages
- Handle unusual scenarios
- Check boundary conditions (null, empty, max values)
- Error handling for external dependencies
- Input validation gaps

Output: Edge cases and error handling issues

STAGE 5: EXCELLENCE - Ready to ship?
Question: Would you be proud to ship this?
Focus:
- Final polish based on all previous stages
- Production quality check
- Performance considerations
- Documentation completeness
- Overall code quality

Output: Final recommendations for production readiness

CONVERGENCE CHECK:
After each stage (starting with Stage 2), report:
1. Number of new CRITICAL issues found
2. Number of new issues vs previous stage
3. Convergence status:
   - CONVERGED: No new CRITICAL, <10% new issues
   - CONTINUE: Proceed to next stage
   - NEEDS_HUMAN: Found blocking issues requiring judgment

FINAL REPORT:
- Total issues by severity
- Top 3 most critical findings
- Recommended next actions
- Production readiness assessment
````

### Code Review Variant (Specialized Domains)

This variant focuses on code review domains rather than editorial refinement:

````
I need you to review this code using the Rule of 5 - iterative refinement until convergence.

CODE TO REVIEW:
[paste your code or specify file path]

REVIEW PROCESS:
Perform 5 passes, each focusing on different aspects. After each pass, check for convergence.

PASS 1 - Security & Safety
Focus on:
- Input validation and sanitization
- Authentication and authorization
- SQL injection, XSS, CSRF vulnerabilities
- Secret management and data exposure
- Error handling that doesn't leak information

Output format:
- Issue ID (SEC-001, etc.)
- Severity: CRITICAL | HIGH | MEDIUM | LOW
- Location (file:line)
- Description
- Recommendation with code example

PASS 2 - Performance & Scalability
Focus on:
- Time complexity (O(n²), O(n³) patterns)
- Database queries (N+1, missing indexes)
- Memory allocation and potential leaks
- Unnecessary loops or iterations
- Caching opportunities

Same output format, prefix: PERF-001, etc.

PASS 3 - Maintainability & Readability
Focus on:
- Code clarity and naming
- Documentation (comments, docstrings)
- Pattern consistency
- Technical debt indicators
- DRY violations
- Magic numbers and hard-coded values

Prefix: MAINT-001, etc.

PASS 4 - Correctness & Requirements
Focus on:
- Does it do what it's supposed to do?
- Edge case handling
- Test coverage gaps
- Behavioral correctness
- Requirements satisfaction

Prefix: REQ-001, etc.

PASS 5 - Operations & Reliability
Focus on:
- Failure modes and error handling
- Timeout and retry logic
- Observability (logging, metrics)
- Resource management (connections, files)
- Deployment considerations

Prefix: OPS-001, etc.

CONVERGENCE CHECK:
After each pass (starting with pass 2), report:
1. Number of new CRITICAL issues found
2. Number of new issues vs previous pass
3. Estimated false positive rate
4. Convergence status:
   - CONVERGED: No new CRITICAL, <10% new issues, <20% false positives
   - ITERATE: Continue to next pass
   - NEEDS_HUMAN: Found blocking issues that need human judgment

FINAL REPORT:
- Total issues by severity
- Top 3 most critical findings
- Recommended next actions
- Convergence assessment

RULES:
1. Be specific with file:line references
2. Provide actionable code examples for fixes
3. Don't just list potential issues - confirm they exist
4. Prioritize: CRITICAL security > CRITICAL other > HIGH > MEDIUM > LOW
5. If converged before pass 5, stop and report
````

## Example

**Context:**
Reviewing a Node.js Express API endpoint that handles user registration before committing to main branch.

**Input:**
```javascript
// routes/auth.js
app.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  const user = await db.query(
    `INSERT INTO users (email, password, username) VALUES ('${email}', '${password}', '${username}')`
  );

  res.json({ success: true, userId: user.id });
});
```

**Expected Output:**

```
PASS 1 - Security & Safety
==========================

SEC-001 | CRITICAL | routes/auth.js:3
Description: SQL injection vulnerability. User input directly interpolated into SQL query.
Attack Vector: Attacker can inject SQL via email parameter: ' OR '1'='1
Recommendation: Use parameterized queries
```javascript
const user = await db.query(
  'INSERT INTO users (email, password, username) VALUES (?, ?, ?)',
  [email, password, username]
);
```

SEC-002 | CRITICAL | routes/auth.js:3
Description: Password stored in plaintext
Recommendation: Hash password before storing
```javascript
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```

SEC-003 | HIGH | routes/auth.js:2
Description: No input validation
Recommendation: Validate email format, password strength, username length
```javascript
const { body, validationResult } = require('express-validator');
// Add validation middleware
```

Convergence Check: ITERATE (3 CRITICAL found)

PASS 2 - Performance & Scalability
===================================

PERF-001 | MEDIUM | routes/auth.js:4
Description: No database index on email likely to be used for lookups
Recommendation: Add unique index on email column
```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
```

No performance bottlenecks detected. Async/await used correctly.

Convergence Check: ITERATE (0 CRITICAL, 1 new issue = 25% new)

PASS 3 - Maintainability & Readability
=======================================

MAINT-001 | LOW | routes/auth.js:8
Description: Magic string 'success' in response
Recommendation: Use constant or enum for API response keys

MAINT-002 | LOW | routes/auth.js:1-9
Description: No error handling visible
Recommendation: Add try-catch for async operation

Convergence Check: ITERATE (0 CRITICAL, 2 new issues = 40% new)

PASS 4 - Correctness & Requirements
====================================

REQ-001 | HIGH | routes/auth.js:4
Description: No check for duplicate email before insert
Impact: Database error if email already exists
Recommendation: Check if email exists first
```javascript
const existing = await db.query('SELECT id FROM users WHERE email = ?', [email]);
if (existing.length > 0) {
  return res.status(400).json({ error: 'Email already registered' });
}
```

REQ-002 | MEDIUM | routes/auth.js:8
Description: No verification email sent after registration
Assumption: Most registration flows require email verification
Recommendation: Confirm requirement with team

Convergence Check: ITERATE (0 CRITICAL, 2 new issues = 33% new)

PASS 5 - Operations & Reliability
==================================

OPS-001 | MEDIUM | routes/auth.js:4
Description: No database connection timeout
Impact: Request can hang indefinitely if DB is slow
Recommendation: Set query timeout
```javascript
const user = await db.query(query, params, { timeout: 5000 });
```

OPS-002 | LOW | routes/auth.js:1-9
Description: No logging for registration attempts
Impact: Hard to debug issues or detect abuse
Recommendation: Log registration attempts with outcome

Convergence Check: CONVERGED (0 CRITICAL, 2 new issues = 25%, estimated FP <20%)

FINAL REPORT
============

Total Issues:
- CRITICAL: 3 (all security)
- HIGH: 2
- MEDIUM: 4
- LOW: 4

Top 3 Critical Findings:
1. SEC-001: SQL injection - MUST FIX before merge
2. SEC-002: Plaintext passwords - MUST FIX before merge
3. SEC-003: No input validation - MUST FIX before merge

Recommended Next Actions:
1. FIX: All 3 CRITICAL security issues immediately
2. FIX: REQ-001 duplicate email check (causes user-facing errors)
3. CONSIDER: Add rate limiting for registration endpoint (not flagged but relevant)
4. REVIEW: All MEDIUM/LOW issues and decide which to address now vs later

Convergence: ACHIEVED after 5 passes
Status: BLOCKS MERGE (3 CRITICAL issues)
```

## Expected Results

- **Clear prioritization** - CRITICAL issues clearly marked and blocking
- **Specific locations** - Every issue has file:line reference
- **Actionable fixes** - Code examples provided for major issues
- **Convergence tracking** - You know when to stop iterating
- **Realistic assessment** - Not every code smell is CRITICAL

## Variations

**For small changes (< 100 LOC):**
```
Abbreviated Rule of 5: Combine passes.

PASS 1: Security + Performance
PASS 2: Maintainability + Correctness
PASS 3: Operations + Final Review

Check convergence after pass 2.
```

**For UI/Frontend code:**
```
Modify passes:

PASS 1: Security (XSS, CSRF, data validation)
PASS 2: Performance (rendering, bundle size, unnecessary re-renders)
PASS 3: Accessibility (ARIA, keyboard nav, screen readers)
PASS 4: UX (error states, loading states, responsive design)
PASS 5: Code quality (component structure, hooks rules, maintainability)
```

**For refactoring (not new features):**
```
Add a PASS 0 before everything:

PASS 0: Behavioral Preservation
- Does refactored code have identical behavior?
- Are all tests still passing?
- Are edge cases still handled the same way?

Then proceed with standard passes focusing on "did refactoring introduce new issues?"
```

**For high-risk production code:**
```
Add verification passes:

Standard 5 passes, then:

PASS 6: Verify all CRITICAL issues are actually problems (false positive check)
PASS 7: Cross-check fixes don't introduce new issues
PASS 8: Production readiness (deployment, rollback, monitoring)

Don't stop until: 0 CRITICAL, <3 HIGH, and explicit "READY FOR PRODUCTION" statement
```

## Comparison: Original vs Extended Multi-Agent

| Aspect | This (Original) | Extended Multi-Agent |
|--------|-----------------|----------------------|
| **Approach** | Linear 5-stage | Parallel with gates |
| **Stages** | Draft → Correctness → Clarity → Edge Cases → Excellence | Wave 1 (5 parallel) → consolidate → Wave 2 → synthesize |
| **Context Building** | Sequential, each stage builds on previous | Independent, then cross-validated |
| **Detection Rate** | 75-85% | 85-92% |
| **Cost** | $0.40-0.60 per 500 LOC | $0.80-1.20 per 500 LOC |
| **Time** | 12-17 minutes | 10-15 minutes |
| **Complexity** | Simple, easy to understand | Complex orchestration |
| **Best For** | Daily workflow, most reviews | Critical systems, security |
| **Prompt File** | This file | prompt-workflow-rule-of-5-review.md |

**Recommendation:** Start with this original approach. Use extended only when additional 10% detection justifies 2x cost.

## References

**Primary Sources:**
- **Steve Yegge's Article:** https://steve-yegge.medium.com/six-new-tips-for-better-coding-with-agents-d4e9c86e42a9
- **Gastown Implementation:** https://github.com/steveyegge/gastown/blob/main/internal/formula/formulas/rule-of-five.formula.toml
- **Original Discovery:** Jeffrey Emanuel

**Related Prompts:**
- **Research Paper:** research-paper-rule-of-5-multi-agent-review.md
- **Extended Multi-Agent:** prompt-workflow-rule-of-5-review.md (for critical systems)
- **Detailed Parallel:** prompt-workflow-multi-agent-parallel-review.md (full Wave/Gate architecture)

## Notes

**Why This is Called "Original":**
This prompt most closely follows Steve Yegge's actual gastown implementation: linear stages, each building on the previous, focused on editorial refinement from draft to excellence.

**Why 5 stages?**
Steve's insight: "LLM agents produce best work through 4-5 iterative refinements"
- Stage 1: Breadth-first, get the shape
- Stages 2-4: Progressive refinement catching issues that become visible after earlier fixes
- Stage 5: Final polish and convergence check
- After 5, if not converged, likely need human judgment

**Two Variants in This File:**
1. **Original Variant** (Steve's actual stages): Best for most use cases, follows gastown approach
2. **Code Review Variant** (domain-focused): Alternative focusing on security/performance/etc domains

**Convergence criteria tuning:**
- For stricter review: Change thresholds to 0 CRITICAL, <5% new issues
- For faster review: Accept convergence at <15% new issues after pass 3

**Common pitfall:**
Don't skip passes to save time. The iterative refinement is what makes this work - later passes catch issues that become visible only after earlier issues are conceptually resolved.

**Token usage:**
- Expect 5-8 Claude API calls
- ~5000-10000 tokens per pass
- Total cost: $0.50-1.00 for typical review

**Time investment:**
- AI time: 10-15 minutes
- Your review of findings: 5-10 minutes
- Total: 15-25 minutes for thorough review

**When to escalate to human:**
- Any CRITICAL issue you're unsure how to fix
- Architectural concerns that emerge
- Conflicting recommendations across passes
- False positive rate seems high (>30%)

## Version History

- 1.1.0 (2026-01-13): Added "Original Variant" matching Steve's actual gastown stages (Draft → Correctness → Clarity → Edge Cases → Excellence); kept existing domain-focused version as "Code Review Variant"; added comparison table and gastown reference
- 1.0.0 (2026-01-12): Initial version based on Steve Yegge's Rule of 5
