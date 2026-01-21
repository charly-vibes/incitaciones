---
title: Design in Practice Workflow (6-Phase Framework)
type: prompt
subtype: workflow
tags: [design, hickey, problem-solving, decision-matrix, architecture, planning]
tools: [claude-code, cursor, aider, any-cli-llm]
status: draft
created: 2026-01-18
updated: 2026-01-18
version: 1.0.0
related: [prompt-workflow-create-plan.md, prompt-task-design-review.md, research-design-in-practice-methodology.md]
source: research-based
---

# Design in Practice Workflow (6-Phase Framework)

## When to Use

Use this prompt when facing complex problems that require understanding before implementation. Based on Rich Hickey's "Design in Practice" methodology.

**Critical for:**
- Complex architectural decisions with multiple valid approaches
- Problems where "the solution isn't obvious"
- Features requiring strategic trade-off analysis
- Work that will affect multiple components or systems
- Situations where you've been iterating without progress ("do-over" cycles)

**Do NOT use when:**
- Making trivial changes (typos, simple bug fixes)
- The problem and solution are already well understood
- Prototyping/spiking to gather information (use this after the spike)
- Emergency hotfixes (document in retrospective)

**Key Principle:** If the solution doesn't feel obvious, the problem isn't understood yet.

~~~~

Apply the 6-phase design framework to understand a problem before implementing a solution.

## Phases

Work through each phase sequentially. Do not skip phases. The goal is understanding, not artifacts.

### PHASE 1: DESCRIBE (Symptoms)

**Objective:** Capture the reality without imposing solutions.

1. **Gather signals:**
   - What symptoms are observed? (errors, complaints, metrics)
   - Where do they occur? (files, components, conditions)
   - When did they start? (commits, deployments, changes)
   - Who is affected? (users, systems, processes)

2. **Write a neutral description:**
   - Facts only, no speculation on causes
   - No mention of solutions
   - Observable behaviors, not interpretations

**Output format:**
~~~~
## Description

### Observed Symptoms
- [Symptom 1]: [Where/When observed]
- [Symptom 2]: [Where/When observed]

### Signal Sources
- [Bug reports, logs, user complaints, metrics]

### Timeline
- [When symptoms first appeared, any patterns]
~~~~

**Anti-patterns to avoid:**
- "The database is slow" (diagnosis, not description)
- "We need to add caching" (solution, not description)
- "Users are confused by the UI" (interpretation, not observation)

**Correct examples:**
- "Page load time exceeds 5s when user count > 100"
- "Error rate increased from 0.1% to 2.3% after deploy on Jan 15"
- "Users submit support tickets asking how to find the export button"

### PHASE 2: DIAGNOSE (Root Cause)

**Objective:** Identify the mechanism causing the symptoms.

1. **Generate multiple hypotheses:**
   - List at least 3 possible causes
   - "If I only have one hypothesis, I'm probably wrong"

2. **Test hypotheses systematically:**
   - Use logic to rule things out (negative progress)
   - Use evidence to support remaining hypotheses
   - Divide and conquer (git bisect, component isolation)

3. **Write the Problem Statement:**

**Problem Statement Template:**
~~~~
## Problem Statement

**Current behavior:** [What happens now - factual]

**Mechanism:** [Root cause - how/why it happens]

**Evidence:**
- [Fact supporting this diagnosis]
- [Fact supporting this diagnosis]

**Ruled out:**
- [Hypothesis A]: [Why it's not this]
- [Hypothesis B]: [Why it's not this]
~~~~

**Quality check:** The solution should feel obvious after writing the right problem statement. If it doesn't, the diagnosis is incomplete.

### PHASE 3: DELIMIT (Scope)

**Objective:** Define what's in and what's out.

1. **Set explicit boundaries:**
   - What subset of the problem will we solve?
   - What constraints do we accept?
   - What's explicitly NOT being addressed?

2. **Document non-goals:**
   - Future considerations
   - Related problems not in scope
   - Nice-to-haves deferred

**Output format:**
~~~~
## Scope

### In Scope
- [What we will address]
- [Specific constraints we'll work within]

### Out of Scope (Non-Goals)
- [What we explicitly won't do]
- [Why it's deferred]

### Constraints
- [Technical limitations]
- [Time/resource constraints]
- [Compatibility requirements]
~~~~

**Why this matters:** Prevents scope creep. Sets the "physics" of the project before considering solutions.

### PHASE 4: DIRECTION (Strategic Approach)

**Objective:** Select the best approach from viable alternatives.

1. **Generate multiple approaches:**
   - **Status Quo**: Always include "do nothing" as baseline
   - **Approach A**: [First viable approach]
   - **Approach B**: [Different viable approach]
   - **Approach C**: [If applicable]

2. **Build a Decision Matrix:**

**Decision Matrix Structure:**
~~~~
## Decision Matrix

| Criterion | Status Quo | Approach A | Approach B |
|-----------|------------|------------|------------|
| [Criterion 1] | [Fact] | [Fact] | [Fact] |
| [Criterion 2] | [Fact] | [Fact] | [Fact] |
| [Criterion 3] | [Fact] | [Fact] | [Fact] |

### Criteria Definitions
- **[Criterion 1]**: [What this measures]
- **[Criterion 2]**: [What this measures]

### Assessment Key
- Green: Desirable
- Yellow: Acceptable with trade-offs
- Red: Problematic or blocking
~~~~

**Rules for Decision Matrix:**
- Text is FACT (neutral, objective descriptions)
- Color/assessment is JUDGMENT (subjective evaluation)
- Status Quo is always the first column
- Each cell must be specific, not "good" or "bad"

3. **Select and justify:**
~~~~
### Decision

**Selected approach:** [Approach name]

**Rationale:** [Why this approach best addresses the scoped problem]

**Trade-offs accepted:** [What we're giving up]
~~~~

### PHASE 5: DESIGN (Tactical Plan)

**Objective:** Create detailed blueprint for implementation.

Only after Direction is selected:

1. **Define specifics:**
   - Data structures and schemas
   - API signatures and contracts
   - Component responsibilities
   - Error handling approach
   - Edge cases

2. **Write Implementation Plan:**

Use the standard implementation plan format (see prompt-workflow-create-plan.md) with:
- Phases that can be independently verified
- TDD approach (tests before implementation)
- Specific file paths and changes
- Success criteria for each phase

**Hammock time:** Write the plan, then sleep on it. Read it the next day before proceeding.

### PHASE 6: DEVELOP (Execute)

**Objective:** Translate design into working code.

If Phases 1-5 were rigorous, this phase should feel mechanical:
- Follow the plan
- Write tests first
- Implement to pass tests
- Verify against success criteria

**If you're struggling in this phase:** Return to earlier phases. Struggling to code usually means the design is incomplete.

## Process Rules

1. **No phase skipping:** Each phase builds on the previous
2. **Artifacts are thinking tools:** Not bureaucracy, but aids to understanding
3. **Hammock time:** Sleep on ideas before committing to them
4. **Multiple hypotheses:** One idea is a trap; generate alternatives
5. **Incremental over iterative:** Understand → Design → Code → Value (not Code → Fail → Learn)

## When to Return to Earlier Phases

- **Can't write Problem Statement clearly** → Back to Describe (need more symptoms)
- **Solution doesn't feel obvious** → Back to Diagnose (incomplete root cause)
- **Scope keeps expanding** → Back to Delimit (boundaries not firm)
- **Can't choose between approaches** → Back to Direction (need more criteria or research)
- **Implementation keeps hitting surprises** → Back to Design (missing edge cases)

~~~~

**Context:** Application performance degrading over time

~~~~
I'll work through the 6-phase design framework to understand this problem before proposing solutions.

---

## PHASE 1: DESCRIBE

Let me gather the symptoms without jumping to conclusions.

### Observed Symptoms
- Support tickets increased 3x in past month mentioning "slow"
- Average page load time: 4.2s (was 1.1s 3 months ago)
- Memory usage grows from 200MB to 1.2GB over 24 hours
- Users report worst performance on Monday mornings

### Signal Sources
- APM dashboard metrics
- Support ticket analysis
- Server resource monitoring
- User session recordings

### Timeline
- Performance was stable until v2.3 release (Oct 15)
- Memory growth pattern started after v2.4 (Nov 1)

---

## PHASE 2: DIAGNOSE

### Hypotheses

1. **Memory leak in new feature code** (v2.3 or v2.4)
2. **Database query degradation** as data volume increased
3. **Third-party API latency** from external service
4. **Caching layer issues** (cache misses or invalidation)

### Testing

**Hypothesis 1 (Memory leak):**
- Evidence FOR: Memory grows over time, matches release timeline
- Test: Heap snapshots show growing object count in SessionManager
- Result: CONFIRMED - SessionManager not releasing closed sessions

**Hypothesis 2 (Database):**
- Evidence AGAINST: Query times stable in slow query log
- Result: RULED OUT

**Hypothesis 3 (Third-party):**
- Evidence AGAINST: External API response times unchanged
- Result: RULED OUT

**Hypothesis 4 (Caching):**
- Evidence PARTIAL: Cache hit rate dropped 40% to 25%
- But this is a SYMPTOM not cause - stale cache entries from leaked sessions
- Result: RULED OUT as root cause (secondary effect)

### Problem Statement

**Current behavior:** Application memory grows unbounded, causing GC pressure and eventual OOM after ~24 hours of operation.

**Mechanism:** SessionManager.close() removes session from active map but does not unsubscribe event listeners, causing closed sessions to remain in memory via listener references.

**Evidence:**
- Heap snapshot shows 12,000 Session objects (expected: ~200 active)
- Each Session holds references to 5 event listeners
- Memory growth correlates with session creation rate

**Ruled out:**
- Database queries: Slow query log shows stable performance
- External APIs: Response times unchanged
- Caching: Cache behavior is symptom of memory pressure, not cause

---

## PHASE 3: DELIMIT

### In Scope
- Fix memory leak in SessionManager
- Add monitoring for session lifecycle
- Verify fix resolves memory growth

### Out of Scope (Non-Goals)
- General performance optimization (separate effort)
- Cache architecture improvements (not root cause)
- Session persistence/recovery (feature request, not bug)

### Constraints
- Must be backward compatible (no API changes)
- Must not disrupt active sessions
- Deploy during next maintenance window

---

## PHASE 4: DIRECTION

### Decision Matrix

| Criterion | Status Quo | Fix Cleanup | WeakRef Pattern | Session Pool |
|-----------|------------|-------------|-----------------|--------------|
| Memory behavior | Leak continues | Bounded | Bounded | Bounded |
| Implementation risk | None | Low | Medium | High |
| Code changes | 0 files | 2 files | 5 files | 12 files |
| Backward compat | N/A | Full | Full | Breaking |
| Time to implement | 0 | 2 hours | 8 hours | 3 days |

### Criteria Definitions
- **Memory behavior**: Whether memory stays bounded over time
- **Implementation risk**: Chance of introducing new bugs
- **Code changes**: Scope of modifications needed
- **Backward compat**: Whether existing code continues to work

### Decision

**Selected approach:** Fix Cleanup

**Rationale:** Directly addresses root cause (missing listener cleanup) with minimal code changes and lowest risk. WeakRef is over-engineering for this case; Session Pool is scope creep.

**Trade-offs accepted:** Not addressing broader session architecture concerns.

---

## PHASE 5: DESIGN

[Would continue with detailed implementation plan for the fix...]

---

~~~~

- Clear Problem Statement that makes the solution obvious
- Decision Matrix with objective trade-off analysis
- Implementation Plan based on understanding, not guessing
- Reduced "do-over" cycles from premature implementation
- Artifacts that can be reviewed and challenged

## Variations

~~~~

**For Exploratory/Research Problems:**
```
Focus on Phases 1-2 (Describe/Diagnose):
- Goal is understanding, not solution
- Document what you learn
- Multiple hypothesis testing
- May result in "more research needed" not implementation
```

**For Architecture Decisions:**
```
Emphasize Phase 4 (Direction):
- Detailed Decision Matrix with many criteria
- Multiple stakeholder perspectives as criteria
- Long-term consequences as criteria
- Formal review of matrix before decision
```

## References

- "Design in Practice" by Rich Hickey: https://www.youtube.com/watch?v=c5QF2HjHLSE
- "Design in Practice in Practice" by Alex Miller: https://www.youtube.com/watch?v=VBnGhQOyTM4
- "Hammock Driven Development" by Rich Hickey
- research-design-in-practice-methodology.md - Full synthesis

## Notes

### The Core Insight

Design is understanding. Implementation is execution. Conflating them leads to expensive "do-over" cycles.

The cost of changing your mind:
- During design (Phase 1-5): Near zero
- During implementation: Moderate
- After deployment: Catastrophic

### Hammock Time

"Never build an idea on the same day you think of it."

Write artifacts, then sleep on them. The next morning reveals flaws that enthusiasm hid.

### When It Feels Slow

This process feels slower than "just start coding" but:
- Prevents weeks of coding down dead-end paths
- Reduces rework from misunderstood requirements
- Creates artifacts that help others understand decisions
- Builds confidence that the solution addresses root cause

### Multiple Hypotheses

If you only have one hypothesis, you're probably wrong. The brain confirms what it expects to find. Force yourself to generate alternatives to break confirmation bias.

### The "Obvious Solution" Test

> "The solution should feel obvious once you've written the right problem statement."

If you've completed Diagnose and the solution isn't obvious:
- The problem statement is incomplete
- You've diagnosed a symptom, not root cause
- Return to Describe for more signals

## Version History

- 1.0.0 (2026-01-18): Initial version based on research synthesis
