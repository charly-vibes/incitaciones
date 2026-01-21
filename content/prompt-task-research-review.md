---
title: Iterative Research Review (Rule of 5 Principle)
type: prompt
subtype: task
tags: [review, research, rule-of-5, quality-assurance, validation, single-agent]
tools: [claude-code, cursor, any-cli-llm]
status: tested
created: 2026-01-12
updated: 2026-01-13
version: 1.1.0
related: [prompt-task-research-codebase.md, prompt-task-plan-review.md, prompt-task-iterative-code-review.md, research-paper-rule-of-5-multi-agent-review.md]
source: adapted-from-fabbro-with-rule-of-5-principle
---

# Iterative Research Review (Rule of 5 Principle)

## About This Prompt

This prompt applies the **Rule of 5 principle** (iterative refinement until convergence) to research document review. It uses a single-agent, 5-pass approach with domain-focused passes adapted for research validation:

- **Approach:** Single agent, sequential passes
- **Passes:** Accuracy → Completeness → Clarity → Actionability → Integration
- **Philosophy:** Iterative refinement with convergence checking

**Note:** This is not Steve Yegge's original Draft/Correctness/Clarity/EdgeCases/Excellence structure, but applies his core principle to research-specific concerns.

## When to Use

Use this prompt to perform thorough review of research documents using iterative refinement until convergence.

**Critical for:**
- Reviewing research documents before finalizing
- Validating findings and conclusions
- Checking for gaps in analysis
- Ensuring research is actionable and complete
- Quality gate before using research to drive decisions

**Do NOT use when:**
- Research is clearly incomplete (finish it first)
- Doing quick informal review (just read and comment)
- Reviewing trivial notes or quick findings

## The Prompt

````
# Iterative Research Review (Rule of 5)

Perform thorough research document review using the Rule of 5 - iterative refinement until convergence.

## Setup

**If research document path provided:** Read the document completely

**If no path:** Ask for the research document path or list available research documents

## Process

Perform 5 passes, each focusing on different aspects. After each pass (starting with pass 2), check for convergence.

### PASS 1 - Accuracy & Sources

**Focus on:**
- Claims backed by evidence
- Source credibility and recency
- Correct interpretation of sources
- Factual accuracy of technical details
- Version/date relevance (is information outdated?)
- Code references are correct (file:line exist and match claim)

**Output format:**
```
PASS 1: Accuracy & Sources

Issues Found:

[ACC-001] [CRITICAL|HIGH|MEDIUM|LOW] - Section/Paragraph
Description: [What's inaccurate or unsourced]
Evidence: [Why this is problematic]
Recommendation: [How to fix with specific guidance]

[ACC-002] ...
```

**What to look for:**
- "This works by..." without code reference
- Claims about codebase without verification
- Outdated information (library versions, deprecated APIs)
- Misinterpretation of source code
- Assumptions presented as facts

### PASS 2 - Completeness & Scope

**Focus on:**
- Missing important topics or considerations
- Unanswered questions that should be addressed
- Gaps in the analysis
- Scope creep (irrelevant tangents)
- Depth appropriate for the topic
- All research questions answered

**Prefix:** COMP-001, COMP-002, etc.

**What to look for:**
- Research question asked but not answered
- Obvious related topics not explored
- Shallow treatment of complex topics
- Too much detail on tangential topics
- "Further research needed" without followthrough

### PASS 3 - Clarity & Structure

**Focus on:**
- Logical flow and organization
- Clear definitions of terms
- Appropriate headings and sections
- Readability for target audience
- Jargon explained or avoided
- Consistent terminology

**Prefix:** CLAR-001, CLAR-002, etc.

**What to look for:**
- Jumping between topics without transitions
- Technical terms used without definition
- Conclusions before supporting evidence
- Redundant sections
- Confusing or ambiguous language

### PASS 4 - Actionability & Conclusions

**Focus on:**
- Clear takeaways and recommendations
- Conclusions supported by the research
- Practical applicability to the project
- Trade-offs clearly articulated
- Next steps identified
- Decision-making guidance provided

**Prefix:** ACT-001, ACT-002, etc.

**What to look for:**
- Research without recommendations
- Conclusions that don't follow from findings
- "Interesting but..." without actionable insight
- Missing implementation guidance
- No clear "what should we do?"

### PASS 5 - Integration & Context

**Focus on:**
- Alignment with existing research
- Connections to specs and requirements
- Relevance to current project goals
- Contradictions with established decisions
- Impact on existing plans
- References to related work

**Prefix:** INT-001, INT-002, etc.

**What to look for:**
- Contradicts previous research without acknowledgment
- Ignores existing patterns in codebase
- Doesn't reference related specs or docs
- Recommendations conflict with project direction
- Missing cross-references

## Convergence Check

After each pass (starting with pass 2), report:

```
Convergence Check After Pass [N]:

1. New CRITICAL issues: [count]
2. Total new issues this pass: [count]
3. Total new issues previous pass: [count]
4. Estimated false positive rate: [percentage]

Status: [CONVERGED | ITERATE | NEEDS_HUMAN]
```

**Convergence criteria:**
- **CONVERGED**: No new CRITICAL, <10% new issues vs previous pass, <20% false positives
- **ITERATE**: Continue to next pass
- **NEEDS_HUMAN**: Found blocking issues requiring human judgment

**If CONVERGED before Pass 5:** Stop and report final findings.

## Final Report

After convergence or completing all passes:

```
## Research Review Final Report

**Research:** [path/to/research.md]

### Summary

Total Issues by Severity:
- CRITICAL: [count] - Must fix before using research
- HIGH: [count] - Should fix before using research
- MEDIUM: [count] - Consider addressing
- LOW: [count] - Nice to have

Convergence: Pass [N]

### Top 3 Most Critical Findings

1. [ACC-001] [Description] - Section [N]
   Impact: [Why this matters]
   Fix: [What to do]

2. [COMP-003] [Description] - Section [N]
   Impact: [Why this matters]
   Fix: [What to do]

3. [ACT-002] [Description] - Conclusions
   Impact: [Why this matters]
   Fix: [What to do]

### Recommended Revisions

1. [Action 1 - specific and actionable]
2. [Action 2 - specific and actionable]
3. [Action 3 - specific and actionable]

### Verdict

[READY | NEEDS_REVISION | NEEDS_MORE_RESEARCH]

**Rationale:** [1-2 sentences explaining the verdict]

### Research Quality Assessment

- **Accuracy**: [Excellent|Good|Fair|Poor] - [brief comment]
- **Completeness**: [Excellent|Good|Fair|Poor] - [brief comment]
- **Actionability**: [Excellent|Good|Fair|Poor] - [brief comment]
- **Clarity**: [Excellent|Good|Fair|Poor] - [brief comment]
```

## Rules

1. **Be specific** - Reference sections/paragraphs, provide file:line for code claims
2. **Verify claims** - Actually check code references and factual statements
3. **Validate actionability** - Research should drive decisions, not just inform
4. **Prioritize correctly**:
   - CRITICAL: Factually wrong or misleading
   - HIGH: Significant gaps or unclear conclusions
   - MEDIUM: Could be clearer or more complete
   - LOW: Minor improvements
5. **If converged before pass 5** - Stop and report, don't continue needlessly
````

## Variations

### For Quick Research Notes

Combine passes:
- **PASS 1:** Accuracy + Completeness
- **PASS 2:** Clarity + Actionability
- **PASS 3:** Final Review + Convergence

### For Exploratory Research (Early Stage)

Relax standards:
- Accept more uncertainty in conclusions
- Focus on identifying promising directions
- Flag areas needing deeper investigation
- Don't require full actionability yet

Adjust convergence criteria:
- Allow more gaps (research is exploratory)
- Emphasize accuracy over completeness
- Look for "what to research next"

### For Technical Deep Dives

Add emphasis on:
- Code examples are complete and runnable
- Performance characteristics documented
- Edge cases identified
- Alternative approaches compared
- Limitations clearly stated

### For Decision-Oriented Research

Add emphasis on:
- Clear recommendation
- Trade-offs quantified
- Risk assessment included
- Implementation complexity estimated
- Rollback strategy considered

## Example

**Input:**
```
Review research/2026-01-11-oauth-implementation-patterns.md using Rule of 5
```

**AI Response (following prompt):**
```
I'll review the OAuth implementation patterns research using the Rule of 5 methodology.

[Reads research document completely]

Starting comprehensive review...

---

## PASS 1: Accuracy & Sources

Issues Found:

[ACC-001] CRITICAL - Section: JWT Token Validation
Description: Claims "jwt.verify() automatically handles all security" but this is incorrect
Evidence: Verified jwt.verify() documentation - it throws errors that must be caught
Recommendation: Update to state "jwt.verify() handles signature validation but requires try-catch for error handling"

[ACC-002] HIGH - Section: Token Storage Patterns
Description: References localStorage without mentioning XSS risks
Evidence: OWASP guidelines warn against localStorage for sensitive tokens
Recommendation: Add security note: "localStorage vulnerable to XSS; httpOnly cookies preferred for sensitive tokens"

[ACC-003] MEDIUM - Section: Existing Implementation
Description: References auth/middleware.ts:45 but that file is only 30 lines
Evidence: Checked file, implementation is at auth/handlers.ts:45
Recommendation: Correct file reference to auth/handlers.ts:45

[ACC-004] LOW - Section: OAuth Libraries
Description: Lists passport-oauth2@1.5.0 but current version is 1.8.0
Evidence: npm registry shows 1.8.0 released 6 months ago
Recommendation: Update version reference or note research date

---

## PASS 2: Completeness & Scope

[COMP-001] HIGH - Research Question: Token Refresh
Description: Research question asks "How to implement token refresh?" but section never answers it
Evidence: Document has "Token Refresh" heading but only describes what it is, not how to implement
Recommendation: Add implementation approach for refresh tokens or explicitly mark as "out of scope"

[COMP-002] HIGH - Missing Topic: Error Handling
Description: No discussion of error handling patterns for OAuth failures
Evidence: Common gotcha in OAuth implementations, should be researched
Recommendation: Add section on handling auth failures, network errors, invalid tokens

[COMP-003] MEDIUM - Gaps in Analysis
Description: Compares 3 OAuth libraries but doesn't compare them on consistent criteria
Evidence: passport-oauth2 discussed for features, simple-oauth2 for performance, oauth4webapi for compliance
Recommendation: Create comparison matrix with consistent criteria: features, performance, security, maintenance

[COMP-004] LOW - Scope Creep
Description: Detailed discussion of OAuth 2.1 spec changes is tangential
Evidence: Research is about implementation patterns, not spec evolution
Recommendation: Move spec discussion to appendix or remove

Convergence Check After Pass 2:
1. New CRITICAL issues: 1
2. Total new issues this pass: 4
3. Total new issues previous pass: 4
4. Estimated false positive rate: 10%

Status: ITERATE (Continue to Pass 3)

---

## PASS 3: Clarity & Structure

[CLAR-001] MEDIUM - Section Flow
Description: Jumps from "Current Implementation" to "Security Considerations" to "Alternative Libraries" without logical flow
Evidence: Reader loses context switching between analysis and recommendations
Recommendation: Reorder to: Current State → Requirements → Alternative Approaches → Security → Recommendations

[CLAR-002] MEDIUM - Technical Terms
Description: Uses "PKCE" without definition on first use
Evidence: Important security concept for OAuth, should be defined
Recommendation: Add definition: "PKCE (Proof Key for Code Exchange) - security extension preventing authorization code interception"

[CLAR-003] LOW - Inconsistent Terminology
Description: Alternates between "access token" and "bearer token"
Evidence: Both used to mean the same thing
Recommendation: Choose one term and use consistently, or define relationship

Convergence Check After Pass 3:
1. New CRITICAL issues: 0
2. Total new issues this pass: 3
3. Total new issues previous pass: 4
4. Estimated false positive rate: 15%

Status: ITERATE (Continue to Pass 4)

---

## PASS 4: Actionability & Conclusions

[ACT-001] CRITICAL - No Clear Recommendation
Description: Research presents 3 library options but doesn't recommend one
Evidence: Conclusions section says "all three are viable" without guidance
Recommendation: Add clear recommendation: "Recommend passport-oauth2 because [specific reasons], unless [specific scenarios for alternatives]"

[ACT-002] HIGH - Missing Implementation Guidance
Description: Identifies that we should use OAuth 2.0 but doesn't outline implementation steps
Evidence: Reader doesn't know what to do next
Recommendation: Add "Next Steps" section: 1) Choose library 2) Set up provider 3) Implement routes 4) Add tests

[ACT-003] MEDIUM - Trade-offs Not Quantified
Description: Says passport-oauth2 is "more feature-rich" but doesn't quantify
Evidence: Vague comparison doesn't help decision-making
Recommendation: Quantify: "passport-oauth2 supports 15+ providers vs 5 for simple-oauth2, but adds 150KB bundle size"

Convergence Check After Pass 4:
1. New CRITICAL issues: 1
2. Total new issues this pass: 3
3. Total new issues previous pass: 3
4. Estimated false positive rate: 15%

Status: ITERATE (Continue to Pass 5)

---

## PASS 5: Integration & Context

[INT-001] HIGH - Contradicts Existing Decision
Description: Recommends token in localStorage, but security-patterns.md requires httpOnly cookies
Evidence: Checked docs/security-patterns.md - explicit requirement for httpOnly cookies
Recommendation: Align with security-patterns.md or explain why deviation is warranted

[INT-002] MEDIUM - Missing Reference to Auth Spec
Description: Doesn't reference existing specs/auth.feature file
Evidence: Checked specs/ directory, auth.feature exists with OAuth requirements
Recommendation: Add "Related" section referencing specs/auth.feature

Convergence Check After Pass 5:
1. New CRITICAL issues: 0
2. Total new issues this pass: 2
3. Total new issues previous pass: 3
4. Estimated false positive rate: 20%

Status: CONVERGED

---

## Research Review Final Report

**Research:** research/2026-01-11-oauth-implementation-patterns.md

### Summary

Total Issues by Severity:
- CRITICAL: 2 - Must fix before using research
- HIGH: 5 - Should fix before using research
- MEDIUM: 6 - Consider addressing
- LOW: 3 - Nice to have

Convergence: Pass 5

### Top 3 Most Critical Findings

1. [ACC-001] jwt.verify() security claim is incorrect
   Impact: Could lead to insecure implementation with unhandled errors
   Fix: Correct claim and add try-catch requirement to recommendations

2. [ACT-001] No clear recommendation on which library to use
   Impact: Research doesn't drive decision, defeats purpose
   Fix: Add explicit recommendation with rationale and scenarios for alternatives

3. [INT-001] Contradicts existing security patterns document
   Impact: Following research would violate security requirements
   Fix: Align with security-patterns.md requirements for httpOnly cookies

### Recommended Revisions

1. Correct jwt.verify() security claim and add error handling guidance
2. Add clear library recommendation with specific rationale
3. Complete the token refresh implementation section or mark out of scope
4. Add comprehensive error handling patterns section
5. Align token storage recommendation with security-patterns.md
6. Reorder sections for better logical flow
7. Add references to specs/auth.feature and related documentation

### Verdict

NEEDS_REVISION

**Rationale:** Research has valuable content but contains critical factual errors and lacks actionable recommendations. After addressing critical and high priority issues, research will provide solid foundation for OAuth implementation decisions.

### Research Quality Assessment

- **Accuracy**: Fair - Contains critical factual error about jwt.verify(), incorrect file references
- **Completeness**: Fair - Unanswered research questions, missing error handling discussion
- **Actionability**: Poor - No clear recommendations, missing implementation guidance
- **Clarity**: Good - Generally well-written, some structural issues
```

## Expected Results

- Comprehensive review from 5 different perspectives
- Prioritized, actionable list of issues
- Clear verdict on research quality and readiness
- Specific recommendations for improvements
- Quality assessment across key dimensions

## References

**Rule of 5 Principle:**
- **Steve Yegge's Article:** https://steve-yegge.medium.com/six-new-tips-for-better-coding-with-agents-d4e9c86e42a9
- **Gastown Implementation:** https://github.com/steveyegge/gastown/blob/main/internal/formula/formulas/rule-of-five.formula.toml
- **Research Paper:** research-paper-rule-of-5-multi-agent-review.md

**Related Prompts:**
- **prompt-task-research-codebase.md** - How to conduct research
- **prompt-task-plan-review.md** - Similar iterative review for plans
- **prompt-task-iterative-code-review.md** - Steve's original 5-stage approach for code
- **prompt-workflow-rule-of-5-review.md** - Extended multi-agent variant for code (high-stakes)

## Notes

### About This Adaptation

**Core Principle:** Steve Yegge's Rule of 5 - "LLM agents produce best work through 4-5 iterative refinements until convergence"

**This prompt adapts the principle to research review:**
- Steve's original: Draft → Correctness → Clarity → Edge Cases → Excellence (editorial)
- This prompt: Accuracy → Completeness → Clarity → Actionability → Integration (research-specific)
- Both use convergence checking to know when to stop

**Why domain-focused passes for research?**
Research documents need validation on different dimensions than code: accuracy of claims, completeness of analysis, actionability of recommendations, etc. The 5-pass iterative structure with convergence is the key, not the specific pass topics.

### Why Review Research?

Research drives decisions. Bad research leads to:
- Incorrect assumptions in planning
- Wasted implementation effort
- Security vulnerabilities
- Technical debt

Good review catches these before they propagate.

### Research Quality Dimensions

**Accuracy**: Foundation of trust
- Verify claims against codebase
- Check sources and references
- Validate technical details
- Most important dimension

**Completeness**: Answers the question
- Research questions fully addressed
- No obvious gaps
- Appropriate depth
- All relevant aspects covered

**Actionability**: Drives decisions
- Clear recommendations
- Practical guidance
- Trade-offs articulated
- Next steps defined

**Clarity**: Enables use
- Well-organized
- Readable
- Terms defined
- Logical flow

### False Positives in Research Review

Easier to have false positives in research because:
- Reviewer may lack context author had
- Claims may be true but unsourced
- Depth vs breadth tradeoffs are subjective

Be willing to mark issues as "needs clarification" vs "wrong".

### Exploratory vs Conclusive Research

**Exploratory research:**
- Identifies options and approaches
- Raises questions
- Maps the landscape
- Doesn't require strong recommendations

**Conclusive research:**
- Answers specific questions
- Makes recommendations
- Provides implementation guidance
- Drives decisions

Review standards should match research type.

### Iterative Research Quality

Research improves through:
1. Initial exploration (gather information)
2. First review (find gaps and errors)
3. Revision (fill gaps, fix errors)
4. Second review (validate improvements)
5. Finalization (ready to drive decisions)

Don't expect perfection on first draft.

## Version History

- 1.1.0 (2026-01-13): Updated to clarify relationship to Steve Yegge's Rule of 5; added gastown reference; clarified this uses the principle with research-specific domain passes
- 1.0.0 (2026-01-12): Initial version adapted from fabbro research_review command
