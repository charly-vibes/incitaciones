---
title: Optionality Review
type: prompt
subtype: workflow
tags: [review, optionality, decisions, reversibility, flexibility, strategic-thinking, real-options, antifragile]
tools: [claude-code, cursor, aider, gemini, any-cli-llm]
status: tested
created: 2026-01-19
updated: 2026-01-19
version: 1.1.0
related: [research-rule-of-5-universal-with-optionality.md, prompt-workflow-rule-of-5-review.md, prompt-task-rule-of-5-universal.md]
source: taleb-antifragile + bezos-two-way-doors + real-options-theory + financial-options
---

# Optionality Review

## About This Prompt

A focused review workflow for evaluating **strategic flexibility** in code, architecture, plans, and decisions. Based on optionality thinking from financial options theory, Taleb's antifragility, and Bezos's two-way door framework.

**Core Question:** "Are we preserving future choices, or unnecessarily locking ourselves in?"

**Use this when:**
- Making architectural or technology choices
- Designing APIs or interfaces others will depend on
- Planning projects with uncertain or evolving requirements
- Evaluating decisions with long-term implications
- Reviewing work where "what if we're wrong?" matters

**Skip this for:**
- Simple bug fixes or trivial changes
- Work with clear, unchanging requirements
- Truly temporary/throwaway work
- When speed matters more than flexibility

## The Prompt

```
# Optionality Review

Review this [CODE/ARCHITECTURE/PLAN/DECISION] through the lens of strategic optionality.

(See Quick Reference section below for optionality principles and red/green flags)

## Work to Review

[PASTE YOUR WORK OR SPECIFY FILE PATH]

## Context (optional)

[Any relevant context: timeline, constraints, uncertainty level]

---

## Phase 1: Decision Classification

First, classify the key decisions using Bezos's framework:

**Type 1 (One-Way Doors):** Consequential and irreversible
- Require careful, methodical consideration
- Need broad consultation
- Examples: Core architecture, public APIs, major vendor commitments

**Type 2 (Two-Way Doors):** Changeable and reversible
- Should be made quickly with ~70% information
- Can be changed if wrong
- Examples: Internal tooling, feature flags, config choices

For each major decision in this work:

| Decision | Type | Reversibility | Decision Deadline | Justification |
|----------|------|---------------|-------------------|---------------|
| [What's being decided] | [1 or 2] | [EASY/MODERATE/HARD/IRREVERSIBLE] | [When must we decide?] | [Why this classification] |

**Early Exit:** If NO Type 1 decisions identified, output abbreviated report:
- List Type 2 decisions with brief notes
- Recommend: "Proceed quickly - all decisions are reversible"
- Skip Phases 2-6

---

## Phase 2: Alternative Paths

For Type 1 decisions, evaluate the option space (2-4 alternatives):

### Current Approach
- Description: [Brief summary]
- Locks in: [What future choices this constrains]
- Enables: [What this makes possible]

### Alternative A
- Description: [Different approach]
- Would preserve: [What options stay open]
- Trade-off: [What we'd give up]

### Alternative B (if applicable)
- Description: [Another approach]
- Would preserve: [What options stay open]
- Trade-off: [What we'd give up]

### Alternative C, D... (add more if needed for complex decisions)

**Assessment:** Are alternatives adequately explored? [YES/NO]
If NO, what should be investigated before committing?

**For Type 2 decisions:** Don't deep-dive. Briefly note 1-2 alternatives, then move on - speed matters more than exhaustive analysis for reversible decisions.

---

## Phase 3: Exit Costs & Escape Hatches

For Type 1 decisions from Phase 1, map the exit strategy:

| Decision | Reversal Cost | Reversal Time | Escape Hatch |
|----------|---------------|---------------|--------------|
| [Choice made] | [LOW/MED/HIGH] | [hours/days/weeks/months] | [Concrete path to undo if needed] |
| [Another choice] | [LOW/MED/HIGH] | [hours/days/weeks/months] | [How to exit] |

**Red Flags:**
- [ ] Irreversible decisions without clear justification
- [ ] No escape hatches for major commitments
- [ ] Assumptions treated as facts
- [ ] "We can refactor later" without a concrete path

**Reversibility Score:** [1-10] (10 = easily reversible)

---

## Phase 4: Failure Modes & Fallbacks

What if things go wrong?

| Failure Scenario | Probability | Impact | Fallback Plan | Recovery Cost |
|------------------|-------------|--------|---------------|---------------|
| [What could fail] | [L/M/H] | [L/M/H/CRITICAL] | [Plan B] | [time/effort] |

**External Dependencies:**
- [ ] Vendor lock-in: [None / Acceptable / Concerning]
- [ ] Technology bets: [Reversible / Locked]
- [ ] Regulatory assumptions: [Validated / Assumed]
- [ ] Single points of failure identified: [YES/NO]

**Resilience Score:** [1-10] (10 = multiple fallbacks, graceful degradation)

**Convergence Check:** If Reversibility ≥7 AND Resilience ≥7, consider skipping to Final Report.

---

## Phase 5: Future Value Assessment

Does this create or destroy options?

### Options CREATED
1. [New capability enabled]
   - Enables: [What becomes possible]
   - Value: [Why this matters]

2. [Another capability]
   - Enables: [What becomes possible]
   - Value: [Why this matters]

### Options DESTROYED (with justification)
1. [Closed off possibility]
   - Prevents: [What becomes harder/impossible]
   - Justified because: [Why trade-off is acceptable]

### Growth Potential
- Can scale to 10x: [YES/PARTIALLY/NO]
- Can add features without rewrite: [YES/PARTIALLY/NO]
- Can be extracted/reused: [YES/PARTIALLY/NO]
- Learning/telemetry built in: [YES/NO]

**Future Value Score:** [1-10] (10 = maximum option creation)

---

## Phase 6: Decision Points & Triggers

Where should we reassess?

| Milestone | What to Assess | Reassess Trigger | Go/No-Go Criteria |
|-----------|----------------|------------------|-------------------|
| [When] | [What we're evaluating] | [What would cause review] | [How to decide] |
| [Next milestone] | [Another assessment] | [Trigger condition] | [Decision criteria] |
| [Future checkpoint] | [Long-term assessment] | [Warning sign] | [How to decide] |

**Assumption Validation:**
- [ ] Key assumptions explicitly stated
- [ ] Validation checkpoints defined
- [ ] Early warning metrics identified

---

## Final Report

### Scores Summary
- Reversibility: [X/10]
- Resilience: [X/10]
- Future Value: [X/10]
- **Overall Optionality: [X/10]** (average, or lowest score if any ≤3)

### Verdict

**Optionality Assessment:** [FLEXIBLE | BALANCED | LOCKED_IN | CONCERNING]
- FLEXIBLE (8-10): Excellent strategic flexibility
- BALANCED (5-7): Acceptable trade-offs, some lock-in justified
- LOCKED_IN (3-4): Significant constraints, ensure they're intentional
- CONCERNING (1-2): High risk, reconsider approach

**Key Findings:**
1. [Most significant optionality issue or strength]
2. [Second finding]
3. [Third finding]

### Recommendations

**Before proceeding:**
- [Critical actions to preserve flexibility]

**Build in over time:**
- [Strategic improvements for future flexibility]

### The Bottom Line

[2-3 sentences: Is the level of lock-in appropriate for our uncertainty level? Are we preserving the right options? What's the key trade-off?]

**Human review recommended:** [YES/NO]
**Reason:** [Why human judgment needed, or why assessment is sufficient]
```

---

## Quick Reference: Optionality Principles

### The Meta-Principle

The value of flexibility is highest when:
1. **Uncertainty is high** - Can't predict what we'll need
2. **Stakes are high** - Mistakes are costly
3. **Learning is possible** - We can gain information
4. **Time is available** - We can defer without critical cost

When these hold, *invest* in optionality rather than *spending* it.

### Key Frameworks

**Bezos's 70% Rule:** "Most decisions should probably be made with somewhere around 70 percent of the information you wish you had."

**Taleb's Barbell:** 85-95% conservative/reversible + 5-15% high-risk/high-upside bets. Avoid the middle.

**Real Options Types:**
- Option to defer (wait for information)
- Option to expand (scale up if successful)
- Option to contract (scale down if needed)
- Option to abandon (exit and salvage)
- Option to switch (change direction)
- Compound options (options that create options)

### Red Flags

- "We'll never need to change this"
- "This is the only way"
- "We can refactor later" (with no path shown)
- Single points of failure without fallbacks
- Irreversible choices without stated justification
- Hard-coded assumptions

### Green Flags

- Multiple approaches evaluated
- Reversibility designed in
- Decision points clearly marked
- Fallback options exist
- Assumptions explicit
- Built to learn, not just to work

---

## When Optionality Doesn't Matter

Don't over-engineer flexibility when:

1. **Constraints are genuine** - Regulatory requirements, physical laws, third-party APIs
2. **Flexibility has negative value** - Security (limiting is the point), standards (consistency matters)
3. **Decision is reversible AND cheap** - Config changes, styling, naming

**The test:** "What's the cost if we're wrong?"
- LOW cost → Don't over-engineer flexibility
- HIGH cost → Optionality thinking essential

---

## Example Usage

### Scenario: Choosing a Database for a New Service

**Input:** "We're building a new user preferences service. Plan is to use MongoDB."

**Output (abbreviated):**

```
PHASE 1: Decision Classification

| Decision | Type | Reversibility | Decision Deadline | Justification |
|----------|------|---------------|-------------------|---------------|
| MongoDB as primary DB | 1 | HARD | Before first production data | Schema, queries, and ops tooling all change |
| Document model for preferences | 2 | EASY | Anytime | Can restructure documents without migration |

PHASE 2: Alternative Paths

### Current Approach: MongoDB
- Locks in: Document-oriented queries, eventual consistency model
- Enables: Flexible schema, horizontal scaling, JSON-native storage

### Alternative A: PostgreSQL with JSONB
- Would preserve: SQL ecosystem, ACID transactions, tooling familiarity
- Trade-off: Less native document feel, slightly more schema management

### Alternative B: DynamoDB
- Would preserve: Managed service benefits, AWS ecosystem integration
- Trade-off: Vendor lock-in to AWS, less query flexibility

Assessment: Alternatives adequately explored? YES

PHASE 3: Exit Costs & Escape Hatches

| Decision | Reversal Cost | Reversal Time | Escape Hatch |
|----------|---------------|---------------|--------------|
| MongoDB | HIGH | 2-4 weeks | Repository pattern isolates DB; migration script needed |

Reversibility Score: 4/10

PHASE 4: Failure Modes & Fallbacks

| Failure Scenario | Probability | Impact | Fallback Plan | Recovery Cost |
|------------------|-------------|--------|---------------|---------------|
| MongoDB Atlas outage | L | HIGH | Multi-region replica | 1 day setup |
| Query performance issues | M | MED | Add read replicas, caching layer | 1 week |

Resilience Score: 6/10

PHASE 5: Future Value Assessment

Options CREATED:
1. Flexible preference schema - can add fields without migrations
2. Horizontal scaling path - sharding built-in

Options DESTROYED:
1. Complex transactional workflows - justified: preferences don't need ACID
2. SQL-based analytics - mitigation: ETL to data warehouse

Future Value Score: 7/10

FINAL REPORT

Scores: Reversibility 4, Resilience 6, Future Value 7
Overall Optionality: 5/10 (BALANCED)

Key Findings:
1. Database choice is genuinely Type 1 - hard to reverse once data exists
2. Repository pattern provides partial escape hatch
3. Document model fits use case well

Recommendations:
- Before proceeding: Implement repository pattern to isolate MongoDB-specific code
- Build in over time: Add caching layer to reduce direct DB dependency

The Bottom Line: MongoDB is a reasonable choice for this use case, but the 4/10 reversibility score warrants attention. The repository pattern escape hatch reduces risk. Lock-in is acceptable given the good fit for document-oriented preference data.

Human review recommended: NO - standard architectural decision with adequate analysis
```

---

## Performance Characteristics

- **Expected time:** 10-15 minutes for medium complexity decisions
- **Best for:** Architectural choices, technology selection, API design
- **Overkill for:** Config changes, styling, internal naming, Type 2-only decisions

---

## References

- Taleb, Nassim Nicholas. *Antifragile: Things That Gain from Disorder* (2012)
- Bezos, Jeff. Amazon Shareholder Letters (1997, 2015) - Type 1/Type 2 framework
- Myers, Stewart C. "Determinants of Corporate Borrowing" (1977) - Real options theory
- See research-rule-of-5-universal-with-optionality.md for comprehensive theory

## Version History

- 1.1.0 (2026-01-19): Added convergence criteria, scoring thresholds, worked example, Type 2 guidance, performance characteristics
- 1.0.0 (2026-01-19): Initial version extracted from optionality research
