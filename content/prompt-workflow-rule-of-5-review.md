---
title: Workflow for Rule of 5 Multi-Agent Code Review (Extended Variant)
type: prompt
subtype: workflow
tags: [code-review, multi-agent, rule-of-5, quality-assurance, testing, parallel]
tools: [claude-code, cursor, gemini]
status: verified
created: 2026-01-12
updated: 2026-01-13
version: 1.1.0
related: [research-paper-rule-of-5-multi-agent-review.md, prompt-task-iterative-code-review.md, prompt-workflow-multi-agent-parallel-review.md]
source: extended-from-steve-yegge-gastown
---

# Rule of 5 Multi-Agent Code Review (Extended Variant)

## About This Prompt

This prompt implements an **extended multi-agent variant** of Steve Yegge's Rule of 5 principle. It orchestrates multiple specialized reviewers in a simulated multi-agent workflow.

**Note:** This is NOT Steve Yegge's original implementation. For Steve's actual linear 5-stage approach (Draft → Correctness → Clarity → Edge Cases → Excellence), see **prompt-task-iterative-code-review.md**.

This variant trades simplicity and cost for higher detection rates through parallel specialized review.

## When to Use

This is a heavyweight, comprehensive review process designed to achieve very high defect detection rates (85-92%). Use it for:

- **Critical Code:** Changes to security-sensitive, performance-critical, or core business logic.
- **Large Refactorings:** When a change touches many parts of the system and has a high risk of unintended consequences.
- **Pre-Production Readiness:** As a final quality gate before a major release.

**Do not use this for:** Small, trivial changes where a simple iterative review (`prompt-task-iterative-code-review.md`) is sufficient. The cost and time are not justified for minor bug fixes or documentation updates.

## The Prompt

```
You are a master orchestrator of AI agents. Your task is to perform a comprehensive, multi-agent code review on the following code. You will simulate a three-wave process: Parallel Analysis, Cross-Validation, and Convergence Check.

**Code to Review:**
```
[PASTE YOUR CODE HERE]
```

**Your Instructions:**

**Wave 1: Parallel Independent Analysis**
Simulate five specialist agents running in parallel. Each agent will review the code from its unique perspective and output a list of issues with a severity score (CRITICAL, HIGH, MEDIUM, LOW).

1.  **Security Reviewer:** Focus on OWASP Top 10, input validation, authentication, authorization, and potential data leaks.
2.  **Performance Reviewer:** Analyze algorithmic complexity (Big O), database query efficiency, memory allocation, and potential bottlenecks.
3.  **Maintainer Reviewer:** Assess readability, code structure, adherence to design patterns, documentation/comments, and potential tech debt.
4.  **Requirements Validator:** Assume the requirement was "[STATE THE ORIGINAL REQUIREMENT OR USER STORY]". Check for requirement coverage, correctness, and missed edge cases.
5.  **Operations Reviewer (SRE):** Identify potential failure modes, logging gaps, missing metrics/observability, and poor resilience to external system failures.

**Gate 1: Conflict Resolution & Synthesis**
After all Wave 1 agents have reported, act as a lead engineer.
1.  Consolidate all findings into a single, deduplicated list.
2.  Resolve severity conflicts. A CRITICAL security issue outranks all other issues. An issue flagged by 3+ agents should be elevated in severity.
3.  Produce a prioritized list of findings from Wave 1.

**Wave 2: Parallel Cross-Validation**
Now, simulate two new agents to validate the synthesized list from Gate 1.

1.  **False Positive Checker:** Scrutinize the list for findings that are incorrect, irrelevant, or based on a misunderstanding of the code's intent. Mark them as `FALSE_POSITIVE`.
2.  **Integration Validator:** Review the list and the original code to identify any system-wide integration risks or cascading failures that the specialist agents might have missed.

**Gate 2: Final Synthesis**
Incorporate the results from Wave 2.
1.  Remove all issues marked `FALSE_POSITIVE`.
2.  Add any new integration risks.
3.  Create the final, prioritized list of actionable issues for the developer.

**Wave 3: Convergence Check**
Finally, assess the process. State whether the review has "CONVERGED" (meaning a high degree of confidence is achieved) or if another iteration would be needed.
```

## Example

**Context:**
A developer has submitted a new Python function for fetching user data and wants a rigorous review.

**Input:**
```
You are a master orchestrator of AI agents... [Full prompt from above]

**Code to Review:**
```python
import psycopg2

def get_user_info(user_id):
    # Connect to the database
    conn = psycopg2.connect("dbname=test user=postgres password=secret")
    cur = conn.cursor()

    # Fetch user data
    query = "SELECT * FROM users WHERE id = " + user_id
    cur.execute(query)
    user = cur.fetchone()

    # Close connection and return
    cur.close()
    conn.close()
    return user
```

**Expected Output:**
```
### Multi-Agent Code Review Report

**Wave 1: Parallel Analysis Findings**

*   **Security Reviewer:**
    *   [CRITICAL] SQL Injection vulnerability via string concatenation.
    *   [CRITICAL] Hardcoded database credentials.
*   **Performance Reviewer:**
    *   [MEDIUM] Creates a new database connection for every call, which is inefficient. A connection pool should be used.
*   **Maintainer Reviewer:**
    *   [LOW] No docstring explaining what the function does.
*   **Requirements Validator:** (Assuming req: "Fetch a user by ID")
    *   [HIGH] No error handling for when `user_id` is not found, will return `None` unexpectedly.
*   **Operations Reviewer:**
    *   [HIGH] No logging for successful or failed database operations.
    *   [MEDIUM] The function swallows exceptions (e.g., if the database is down), which will crash the application.

**Gate 1: Synthesized & Prioritized List**

1.  [CRITICAL] SQL Injection vulnerability.
2.  [CRITICAL] Hardcoded database credentials.
3.  [HIGH] No error handling for a missing user.
4.  [HIGH] No logging for database operations.
5.  [MEDIUM] Inefficient connection management (no connection pooling).
6.  [MEDIUM] Swallows exceptions, risking a crash.
7.  [LOW] Missing docstring.

**Wave 2: Cross-Validation Findings**

*   **False Positive Checker:** All findings appear to be valid. No false positives.
*   **Integration Validator:** If this function is called in a loop, the connection management issue could exhaust database resources and cause a system-wide outage. This elevates the priority.

**Gate 2: Final Actionable List**

1.  **[CRITICAL] SQL Injection:** Rewrite the query using parameterized statements.
2.  **[CRITICAL] Hardcoded Credentials:** Externalize credentials using environment variables or a secrets management system.
3.  **[HIGH] Connection Exhaustion Risk:** Implement a shared database connection pool. (Elevated from MEDIUM).
4.  **[HIGH] No Error Handling for Not Found:** Explicitly check if `user` is `None` and raise a custom `UserNotFound` exception.
5.  **[HIGH] No Logging:** Add structured logging for query execution and results.
6.  **[MEDIUM] Lack of Exception Handling:** Wrap the database operations in a `try...finally` block to ensure connections are closed even if errors occur.
7.  **[LOW] Missing Docstring:** Add a docstring explaining the function's purpose, arguments, and return value.

**Wave 3: Convergence Check**

**CONVERGED.** The review produced multiple critical and high-severity findings with high confidence. The issues are distinct and actionable. No further iteration is required to generate a high-quality report.
```

## Expected Results

- A comprehensive and structured report detailing issues from multiple expert perspectives.
- A prioritized, actionable list of defects for the developer to address.
- Increased confidence in code quality and a significant reduction in bugs missed by a single-pass review.

## Variations

### Claude Code Sub-Agents

For tools that support it (like Claude Code), you can define each reviewer as a separate agent file (e.g., `~/.claude/agents/security-reviewer.md`) and orchestrate them with a simpler prompt. This is more maintainable for repeated use.

**Example Orchestrator Prompt:**
```
Review this codebase using 5 parallel tasks:
- security-reviewer: Check for vulnerabilities
- performance-reviewer: Analyze bottlenecks
- maintainer-reviewer: Review code quality
- requirements-validator: Validate coverage (Req: [Requirement])
- operations-reviewer: Check reliability

After all complete, use conflict-resolver to consolidate, then meta-reviewer to identify gaps.
```

## Comparison to Original

| Aspect | Steve's Original | This Extended Variant |
|--------|------------------|----------------------|
| **Architecture** | Linear 5-stage pipeline | Parallel multi-agent with gates |
| **Stages** | Draft → Correctness → Clarity → Edge Cases → Excellence | Wave 1 (5 parallel) → Gate 1 → Wave 2 → Gate 2 → Wave 3 |
| **Detection Rate** | 75-85% | 85-92% |
| **Cost** | $0.40-0.60 per 500 LOC | $1.00-1.50 per 500 LOC |
| **Time** | 12-17 minutes | 10-15 minutes |
| **Complexity** | Simple, single agent | Complex, orchestration required |
| **Best For** | Standard reviews, daily workflow | Critical systems, security review |
| **Implementation** | prompt-task-iterative-code-review.md | This prompt |
| **Source** | gastown formula | Extended interpretation |

**When to use original:** Most code reviews, learning, budget-conscious scenarios

**When to use this variant:** Security-critical, large refactorings, pre-production gates

## References

- **Steve Yegge's Article:** https://steve-yegge.medium.com/six-new-tips-for-better-coding-with-agents-d4e9c86e42a9
- **Gastown Implementation:** https://github.com/steveyegge/gastown/blob/main/internal/formula/formulas/rule-of-five.formula.toml
- **Research Paper:** research-paper-rule-of-5-multi-agent-review.md
- **Original Implementation:** prompt-task-iterative-code-review.md

## Notes

**Cost vs Quality Trade-off:**
This extended variant is 2-3x more expensive than Steve's original but provides ~10% better defect detection through cross-validation and specialized review. Reserve it for high-stakes scenarios where the cost of a defect is very high.

**Simplicity vs Power:**
Steve's original linear approach is sufficient for 80% of code reviews. This variant's complexity and cost are only justified when the additional detection rate matters.

## Version History

- 1.1.0 (2026-01-13): Updated to clarify this is extended variant, not Steve's original; added comparison table and gastown reference
- 1.0.0 (2026-01-12): Initial version based on the Rule of 5 multi-agent research paper
