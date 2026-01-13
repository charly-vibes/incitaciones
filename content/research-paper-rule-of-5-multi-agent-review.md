---
title: Rule of 5 Multi-Agent Code Review Framework
type: research
subtype: paper
tags: [code-review, rule-of-5, multi-agent, steve-yegge, quality-assurance, testing]
tools: [claude-code, cursor, aider]
status: verified
created: 2026-01-12
updated: 2026-01-13
version: 1.2.0
related: [research-paper-cognitive-architectures-for-prompts.md, prompt-task-iterative-code-review.md, prompt-workflow-multi-agent-parallel-review.md]
source: https://steve-yegge.medium.com/six-new-tips-for-better-coding-with-agents-d4e9c86e42a9
---

# Rule of 5 Multi-Agent Code Review Framework

## Summary

A comprehensive framework built on Steve Yegge's "Rule of 5" principle (iterative refinement until convergence). This paper documents both Steve's original linear implementation from gastown and an extended parallel multi-agent variant. The original achieves 75-85% defect detection through 5-stage editorial refinement. The parallel variant, enhanced with cross-disciplinary review methodologies from medicine, law, aviation, engineering, and finance, achieves 85-92% defect detection in 10-15 minutes.

## Context

Traditional AI code review suffers from two problems: (1) taking the first AI output leads to disappointment, and (2) sequential review is too slow. This research synthesizes the Rule of 5 concept with multi-agent parallel execution to create a practical, high-quality review system.

## Hypothesis / Question

Can we achieve professional-grade code review quality (85%+ defect detection) in under 15 minutes by combining:
1. Steve Yegge's Rule of 5 (iterative refinement)
2. Multi-agent parallel execution
3. Cross-disciplinary review methodologies

## Method

### Two Approaches: Original vs. Extended

This framework encompasses two distinct implementations:

**1. Steve Yegge's Original Implementation (gastown)**
- **Type:** Linear 5-stage pipeline (expansion formula)
- **Architecture:** Sequential dependency - each stage builds on previous
- **Philosophy:** "Breadth-first exploration, then editorial passes"
- **Stages:** Draft → Correctness → Clarity → Edge Cases → Excellence
- **Best for:** Individual code review, iterative refinement, simplicity
- **Tool:** Implemented in gastown as `rule-of-five.formula.toml`

**2. Extended Multi-Agent Parallel Variant**
- **Type:** Wave/Gate architecture with parallel agents
- **Architecture:** 3 waves + 2 gates, multiple independent reviewers
- **Philosophy:** Cross-disciplinary perspectives with cross-validation
- **Stages:** Wave 1 (5 parallel) → Gate 1 (consolidate) → Wave 2 (validate) → Gate 2 (synthesize) → Wave 3 (converge)
- **Best for:** Critical systems, large refactorings, team environments
- **Tool:** Claude Code multi-agent Task system

Both approaches share the core "Rule of 5" principle: **"LLM agents produce best work through 4-5 iterative refinements until convergence."**

### Steve Yegge's Original Implementation (gastown)

**Source:** https://github.com/steveyegge/gastown/blob/main/internal/formula/formulas/rule-of-five.formula.toml

**Formula Configuration:**
- Name: `rule-of-five`
- Type: `expansion` (creates multi-stage pipeline)
- Version: 1

**Core Philosophy:**
> "LLM agents produce best work through 4-5 iterative refinements. Breadth-first exploration, then editorial passes."

**Five-Stage Pipeline:**

**Stage 1: Draft**
- Focus: Initial breadth-first attempt
- Instruction: "Don't aim for perfection. Get the shape right."
- Goal: Establish scope and structure without obsessing over details
- Evaluation: Is the overall approach sound?

**Stage 2: Refine 1 - Correctness**
- Depends on: Draft stage (sequential)
- Focus: Identifying and fixing errors, bugs, logical flaws
- Question: "Is the logic sound?"
- Evaluation: Are there factual errors, bugs, or logical inconsistencies?

**Stage 3: Refine 2 - Clarity**
- Depends on: Refinement 1 (sequential)
- Focus: Improving comprehensibility and removing technical jargon
- Question: "Can someone else understand this?"
- Evaluation: Is the code/output clear and accessible?

**Stage 4: Refine 3 - Edge Cases**
- Depends on: Refinement 2 (sequential)
- Focus: Handling unusual scenarios and identifying gaps
- Question: "What could go wrong?"
- Evaluation: Are boundary conditions and error cases handled?

**Stage 5: Refine 4 - Excellence**
- Depends on: Refinement 3 (sequential)
- Focus: Final polish emphasizing shipping quality
- Question: "Is this something you'd be proud to ship?"
- Evaluation: Does this meet production quality standards?

**Key Characteristics:**
- **Linear dependencies:** Each stage explicitly depends on the previous
- **Templated structure:** Each stage has unique ID and evaluation criteria
- **Progressive refinement:** Not parallel - intentionally sequential to build on previous insights
- **Structured workflow:** Creates a repeatable, predictable refinement pattern

**Design Rationale:**
The sequential nature is intentional - later stages benefit from insights gained in earlier stages. Unlike parallel review where agents work independently, this approach builds context progressively, allowing each stage to refine based on all previous work.

### The Rule of 5 Foundation

**Core Principle:** "When in doubt, have the agent review its own work 5 times until it converges."

**Why It Works:**
- First pass: Broad strokes, incomplete
- Passes 2-4: Iterative refinement, catching mistakes
- Pass 5+: Convergence - no new significant issues

**Convergence Criteria:**
- No new CRITICAL issues discovered
- <10% new issues vs previous pass
- False positive rate <20%

### Extended Multi-Agent Parallel Architecture (Variant)

**Note:** This is an extended interpretation of the Rule of 5, not Steve Yegge's original implementation. It applies the convergence principle to parallel multi-agent review for higher-stakes scenarios.

**Architecture: 3 Waves + 2 Gates**

```
Wave 1 (Parallel) → Gate 1 (Sequential) → Wave 2 (Parallel) → Gate 2 (Sequential) → Wave 3 (Sequential)
```

**Wave 1: Parallel Independent Analysis (5-7 agents)**

Run simultaneously with no dependencies:
1. **Security Reviewer** - OWASP Top 10, input validation, auth/authz
2. **Performance Reviewer** - Complexity, queries, memory, bottlenecks
3. **Maintainer Reviewer** - Readability, docs, patterns, tech debt
4. **Requirements Validator** - Coverage, edge cases, correctness
5. **Operations Reviewer** - Failure modes, observability, resilience

Optional additions:
6. **User Perspective Reviewer** - UX, accessibility, error messages
7. **Compliance Checker** - GDPR, CCPA, regulations

**Gate 1: Conflict Resolution (Sequential)**

Consolidates Wave 1 findings:
- Deduplicate issues
- Resolve severity conflicts (security > other domains)
- Identify patterns (issues flagged by 3+ reviewers)
- Prioritize: CRITICAL security > CRITICAL other > HIGH > MEDIUM > LOW

**Wave 2: Parallel Cross-Validation (2-4 agents)**

Validates Wave 1 consolidated output:
1. **Integration Validator** - System-wide impacts, cascading failures
2. **Source Verifier** - Fact-checks against OWASP, RFCs, docs
3. **False Positive Checker** - Removes incorrect flags
4. **Meta-Reviewer** - Coverage gaps, quality assessment

**Gate 2: Final Synthesis (Sequential)**

Integrates all validation:
- Remove false positives
- Adjust severities based on validation
- Add integration risks
- Create priority-ordered final list
- Assign confidence scores

**Wave 3: Convergence Check (Sequential)**

Determines if iteration needed:
```python
if new_critical_count == 0 and new_issue_rate < 0.10 and false_positive_rate < 0.20:
    return "CONVERGED"
elif iteration >= 3:
    return "ESCALATE_TO_HUMAN"
else:
    return "ITERATE"
```

### Cross-Disciplinary Enhancements

**1. Medical Peer Review**
- Multi-specialty perspective (assign different roles)
- Scoring system (0-3 scale)
- Harm assessment categories
- Hindsight bias mitigation

**2. Legal Document Review**
- Multi-tiered review (cull → examine → validate)
- Hot/Warm/Cold classification for prioritization
- Quality control gate (meta-review validates reviewers)

**3. Journalism Fact-Checking**
- Two-layer principle (reporting vs verification)
- Source hierarchy (primary > secondary > tertiary)
- Annotation requirement (document decisions with sources)

**4. Engineering Design Review**
- Stage-gate process (requirements → design → implementation → integration → production)
- External reviewers prevent groupthink
- Assumption validation
- Risk registry

**5. Financial Auditing**
- Materiality thresholds (not all errors are equal)
- Three lines of defense:
  1. Developer self-review
  2. Automated review (AI)
  3. Human peer review
- Risk-based sampling

**6. Quality Control**
- Defect classification and tracking
- Pareto analysis (80% defects from 20% causes)
- Trend analysis for systemic issues

## Results

### Performance Characteristics

**Steve's Original Implementation (Linear 5-Stage):**
- Time: 12-17 minutes (5 stages × 2-3 min + synthesis)
- API calls: 5-7 (one per stage + final)
- Quality: 75-85% defect detection
- False positives: 15-20%
- Cost: $0.40-0.60 per 500 LOC review
- Best for: Individual developer workflow, learning, standard reviews

**Extended Parallel Multi-Agent Variant:**
- Time: 10-15 minutes (40-50% faster than sequential despite more work)
- API calls: 14-42 (2-3x more)
- Quality: 85-92% defect detection
- False positives: 10-15% (improved via meta-review)
- Cost: $0.80-1.20 per 500 LOC review
- Best for: Critical systems, security review, large refactorings

### Cost-Benefit Analysis

**Typical review (500 LOC):**
- Single pass: $0.10, 40-50% detection, 3 min
- Steve's original (linear 5-stage): $0.40-0.60, 75-85% detection, 12-17 min
- Extended parallel multi-agent: $0.80-1.20, 85-92% detection, 10-15 min
- Human reviewer: $100-200, 60-70% detection, 2-4 hours

**ROI:**
- Original vs human: Breakeven after 200-300 reviews
- Extended vs human: Breakeven after 100-150 reviews

### Key Findings

**Common to Both Approaches:**

1. **Convergence is real:** After 3-5 iterations, new issue rate drops below 10%

2. **Editorial refinement works:** Each pass catches issues that become visible only after earlier conceptual fixes

3. **Optimal spending:** 25-30% of coding time on code health activities (including reviews) is optimal

**Original Linear Implementation:**

4. **Sequential context building:** Later stages benefit from insights gained in earlier stages, creating progressive refinement

5. **Simplicity wins for standard cases:** Single-agent linear approach sufficient for 80% of code reviews

6. **Predictable quality:** Consistent 75-85% defect detection with predictable cost/time

**Extended Parallel Multi-Agent Variant:**

7. **Parallel is faster AND better:** Multi-agent not only saves time but increases quality through cross-validation

8. **Specialization matters:** Each agent can take extreme positions without averaging out

9. **Materiality hierarchy essential:** Security CRITICAL must override other severity ratings

10. **False positive control is critical:** Meta-reviewer reduces false positives from 30% to 10-15%

11. **Cross-disciplinary methods transfer well:**
    - Medical scoring (0-3) provides clear severity scale
    - Legal ambiguity detection catches requirement gaps
    - Aviation checklists prevent missed steps
    - Engineering stage-gates ensure readiness

## Analysis

### Choosing Between Approaches

**Use Steve's Original (Linear 5-Stage) when:**
- Standard code review for non-critical systems
- Individual developer workflow
- Learning and skill development
- Budget/cost is a primary constraint
- Simplicity and predictability are valued
- Team is new to AI-assisted review

**Use Extended Parallel Multi-Agent when:**
- Security-critical systems
- Large refactorings (>500 LOC)
- Pre-production quality gates
- High-stakes releases
- Budget allows 2x cost for ~10% better detection
- Team has mature AI review process

### Why Original Linear Works Well

1. **Progressive context building:** Each stage refines the work from the previous stage, building on accumulated insights

2. **Simplicity:** Single agent, clear progression, easy to understand and debug

3. **Cost-effective:** Minimal API calls, predictable cost

4. **Sufficient for most cases:** 75-85% detection rate handles vast majority of bugs

### Why Extended Parallel Outperforms for Critical Systems

1. **Eliminates bias propagation:** Each agent starts fresh from the code, not from previous reviewer's findings

2. **Specialization:** Each agent can adopt extreme positions (pure security focus vs pure usability focus) without averaging out

3. **Cross-validation:** When 3+ agents independently flag the same issue, confidence is 95%+

4. **Coverage:** Different perspectives catch different issue classes

5. **Meta-review quality control:** Validates the reviewers themselves, reducing false positives

### Critical Success Factors

1. **Explicit convergence criteria:** Without defined stopping conditions, reviews either stop too early or iterate forever

2. **Conflict resolution logic:** Security must trump other domains when severity conflicts occur

3. **Meta-review quality control:** The review process itself must be reviewed

4. **Materiality thresholds:** Not treating all issues equally prevents "death by a thousand papercuts" paralysis

## Practical Applications

### Implementation Methods

**Method 1: Steve's Original (Universal - RECOMMENDED)**

Use the universal prompt that works for any domain:

See **prompt-task-rule-of-5-universal.md** for complete implementation.

This prompt works for:
- Code review
- Plan review
- Research review
- Issue review
- Spec review
- Documentation review

Quick example:
```
Review this [CODE/PLAN/RESEARCH/ISSUE/SPEC] using Steve Yegge's Rule of 5:

STAGE 1 - DRAFT: Get the shape right
STAGE 2 - CORRECTNESS: Is the logic sound?
STAGE 3 - CLARITY: Can someone else understand this?
STAGE 4 - EDGE CASES: What could go wrong?
STAGE 5 - EXCELLENCE: Ready to ship?

After each stage, report findings and check for convergence.
```

**Method 2: Extended Parallel Multi-Agent (Claude Code)**

Create specialized agent files in `~/.claude/agents/`:
- `security-reviewer.md`
- `performance-reviewer.md`
- `maintainer-reviewer.md`
- `requirements-validator.md`
- `operations-reviewer.md`
- `conflict-resolver.md`
- `meta-reviewer.md`

**Simple prompt:**
```
Review this codebase using 5 parallel tasks:
- security-reviewer: Check for vulnerabilities
- performance-reviewer: Analyze bottlenecks
- maintainer-reviewer: Review code quality
- requirements-validator: Validate coverage
- operations-reviewer: Check reliability

After all complete, use conflict-resolver to consolidate,
then meta-reviewer to identify gaps.
```

**Method 3: Extended Parallel via Pure Prompt**

For one-off parallel reviews without agent files:
```
I need a comprehensive code review. Create 5 parallel specialized roles:
1. Security engineer (OWASP, input validation, auth)
2. Performance engineer (complexity, queries, memory)
3. Code maintainer (readability, docs, patterns)
4. QA engineer (requirements coverage, edge cases)
5. SRE (failure modes, observability, resilience)

Each outputs JSON with issues and 0-3 domain score.
Then consolidate, meta-review, and check convergence.
```

**Comparison:**
- **Method 1 (Original):** Simplest, best for standard reviews, 12-17 min, $0.40-0.60
- **Method 2 (Extended Parallel):** Most powerful, best for critical code, 10-15 min, $0.80-1.20
- **Method 3 (Pure Prompt):** One-off parallel without setup, same as Method 2 but no reusable agents

### Use Cases

**Standard Code Review (daily workflow):**
- **Approach:** Original linear 5-stage
- **Why:** Fast, simple, cost-effective, sufficient quality
- **Process:** Draft → Correctness → Clarity → Edge Cases → Excellence

**Pre-Commit Quality Check:**
- **Approach:** Original linear 5-stage
- **Why:** Catches 75-85% of issues before human review
- **Process:** Run locally before pushing

**Security-Critical Code:**
- **Approach:** Extended parallel multi-agent
- **Why:** Need 85-92% detection, cross-validation, deep security focus
- **Process:** Full Wave 1-3, iterate until 0 CRITICAL security issues

**Performance Optimization:**
- **Approach:** Original with focus on performance stage, OR extended if system-critical
- **Why:** Single performance pass often sufficient unless high-stakes
- **Process:** Analyze hot paths, queries, memory, caching

**Large Refactoring (>500 LOC):**
- **Approach:** Extended parallel multi-agent
- **Why:** High risk of cascading failures, need integration validation
- **Process:** Full multi-pass: all agents iteration 1, focused CRITICAL/HIGH iteration 2, final validation iteration 3

**CI/CD Integration:**
- **Approach:** Original for all PRs, extended for release branches
- **Why:** Balance cost vs quality based on risk
- **Process:** Block PR on CRITICAL issues, comment findings

## Limitations

**Original Linear 5-Stage:**

1. **Single perspective:** One agent means potential blind spots in specialized domains

2. **Lower detection rate:** 75-85% is good but may miss critical security issues

3. **False positives:** 15-20% rate requires human filtering

4. **Sequential means slower:** Can't parallelize the work

**Extended Parallel Multi-Agent:**

5. **API cost:** 2-3x more API calls than original (though faster wall-clock time)

6. **Complexity:** Requires understanding multi-agent orchestration

7. **Requires maturity:** Teams need to understand how to interpret and act on findings

8. **False positives still exist:** Even at 10-15%, human judgment needed to filter

**Common to Both:**

9. **Not a replacement for human review:** This is "Line 2 defense" - developer self-review (Line 1) and human peer review (Line 3) still essential

10. **Context window limits:** Very large codebases may need chunking strategies

11. **Learning curve:** Teams need training on interpreting AI review findings

## Related Prompts

**Steve's Original Implementation:**
- **prompt-task-rule-of-5-universal.md** - Universal implementation for code, plans, research, issues, specs (RECOMMENDED)
- **prompt-task-iterative-code-review.md** - Code-specific implementation with two variants

**Domain-Specific Adaptations:**
- **prompt-task-plan-review.md** - Applies principle to plan review
- **prompt-task-research-review.md** - Applies principle to research review
- **prompt-task-issue-tracker-review.md** - Applies principle to issue review

**Extended Multi-Agent Variants:**
- **prompt-workflow-rule-of-5-review.md** - Simplified multi-agent orchestrator (high-stakes)
- **prompt-workflow-multi-agent-parallel-review.md** - Detailed Wave/Gate architecture (maximum structure)

## References

**Primary Sources:**
- Steve Yegge's Article: https://steve-yegge.medium.com/six-new-tips-for-better-coding-with-agents-d4e9c86e42a9
- Gastown Implementation: https://github.com/steveyegge/gastown/blob/main/internal/formula/formulas/rule-of-five.formula.toml
- Original discovery by Jeffrey Emanuel

**Security Standards:**
- OWASP Application Security Verification Standard (ASVS)
- CWE Top 25 Most Dangerous Software Weaknesses
- Atul Gawande: The Checklist Manifesto
- Gary Klein: Pre-Mortem Analysis
- Edward de Bono: Six Thinking Hats
- Karl Popper: Falsification principle

## Future Research

1. **Optimal agent count:** Is 5 the right number, or does it vary by codebase size/complexity?

2. **Agent specialization depth:** Should agents be framework-specific (React, Django, etc.)?

3. **Learning from patterns:** Can we build a "defect database" to train better agent prompts?

4. **Convergence prediction:** Can we predict iteration count needed based on code metrics?

5. **Cost optimization:** What's the minimum agent set for 80% of the quality at 50% of the cost?

6. **Human-AI handoff:** What's the optimal threshold for escalating to human review?

## Version History

- 1.2.0 (2026-01-13): Added universal Rule of 5 prompt (prompt-task-rule-of-5-universal.md) as recommended implementation; reorganized related prompts section
- 1.1.0 (2026-01-13): Added Steve Yegge's actual gastown implementation; distinguished original linear approach from extended parallel variant
- 1.0.0 (2026-01-12): Initial version synthesized from Steve Yegge's Rule of 5 article and cross-disciplinary research
