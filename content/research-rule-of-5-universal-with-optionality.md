---
title: Universal Rule of 5 Review with Optionality (Enhanced)
type: prompt
subtype: task
tags: [review, rule-of-5, universal, iteration, convergence, optionality, flexibility, strategic-thinking, finance, real-options, antifragile]
tools: [claude-code, cursor, aider, gemini, any-cli-llm]
status: enhanced
created: 2026-01-16
updated: 2026-01-18
version: 2.1.0
extends: rule-of-5-universal
related: [research-paper-rule-of-5-multi-agent-review.md, prompt-task-iterative-code-review.md, prompt-workflow-rule-of-5-review.md]
source: steve-yegge-gastown-rule-of-five-formula + optionality-thinking + financial-options-theory + real-options + taleb-antifragile + bezos-two-way-doors
---

# Universal Rule of 5 Review with Optionality (Enhanced)

## About This Enhanced Prompt

This builds on **Steve Yegge's original Rule of 5** by integrating **optionality thinking** at each stage. It maintains the proven 5-stage progressive refinement approach while adding strategic evaluation of flexibility, reversibility, and long-term possibilities.

**Core Philosophy:** "Breadth-first exploration, then editorial passes—with strategic option preservation"

**The Enhanced 5 Stages:**
1. **Draft + Option Space** - Get the shape right AND evaluate alternative approaches
2. **Correctness + Reversibility** - Is the logic sound AND can we change course?
3. **Clarity + Decision Points** - Can others understand this AND when to reassess?
4. **Edge Cases + Pivot Options** - What could go wrong AND what are our fallbacks?
5. **Excellence + Future Flexibility** - Ready to ship AND does it enable future options?

**Why add optionality?**
Great work products aren't just correct—they're strategically flexible. This enhanced framework helps you:
- Preserve future choices instead of locking in prematurely
- Build adaptable solutions that can evolve
- Identify when you're burning bridges unnecessarily
- Create compound options that open new possibilities

**Source:** Steve Yegge's Rule of 5 + Optionality Theory (Taleb, financial options thinking)

---

## Theoretical Foundations: Optionality Across Domains

This section synthesizes optionality concepts from finance, decision theory, and software architecture to provide rigorous foundations for the review framework.

### Financial Options: The Core Mental Model

Financial options provide the foundational mental model for thinking about flexibility and asymmetric outcomes.

**Key Insight:** An option is the right—but not the obligation—to take an action at a future time. This asymmetry is powerful: you capture upside while limiting downside.

**Core Properties:**
| Property | Financial Meaning | Decision/Design Analog |
|----------|-------------------|------------------------|
| **Strike Price** | Price at which you can exercise | Threshold/trigger for decision |
| **Premium** | Cost to acquire the option | Investment in maintaining flexibility |
| **Expiration** | When option expires worthless | Decision deadline / opportunity window |
| **Underlying** | Asset the option references | The project, feature, or decision subject |
| **In/Out of Money** | Whether exercising is profitable | Whether conditions favor the choice |

**The Greeks: Sensitivity Analysis for Decisions**

The "Greeks" measure how option values change with different variables. Each has a decision-making analog:

| Greek | Financial Meaning | Decision Analog | Implication |
|-------|-------------------|-----------------|-------------|
| **Delta (Δ)** | Price sensitivity to underlying | How much outcome changes with conditions | High delta = decision matters a lot |
| **Gamma (Γ)** | Rate of delta change | Acceleration of sensitivity | High gamma = situation changing rapidly |
| **Theta (Θ)** | Time decay | Option value erodes as deadline approaches | Waiting has a cost; don't defer indefinitely |
| **Vega (ν)** | Volatility sensitivity | Value of flexibility increases with uncertainty | Uncertain environments → preserve more options |
| **Rho (ρ)** | Interest rate sensitivity | Sensitivity to cost of capital/opportunity cost | Higher opportunity cost → decide sooner |

**Key Takeaway:** In uncertain environments (high vega), options are more valuable. Don't lock in prematurely when volatility is high.

### Real Options: Business Decision Flexibility

Real options theory applies option pricing concepts to business decisions. Stewart Myers (MIT, 1977) coined the term to describe the value of managerial flexibility.

**The Six Types of Real Options:**

| Option Type | Definition | Example | When Valuable |
|-------------|------------|---------|---------------|
| **Option to Defer** | Wait for more information | Delay product launch to see competitor moves | High uncertainty, low first-mover advantage |
| **Option to Expand** | Scale up if successful | Build modular architecture that can grow | High growth potential, uncertain demand |
| **Option to Contract** | Scale down if needed | Design for graceful degradation | Downside risk, uncertain adoption |
| **Option to Abandon** | Exit and salvage value | Use proven tech with resale value | High uncertainty, reversibility matters |
| **Option to Switch** | Change inputs/outputs | Abstract interfaces for swappable backends | Volatile prices, evolving requirements |
| **Compound Options** | Options that create options | R&D that enables future products | Strategic, multi-phase investments |

**Compound Options Are Especially Valuable:**
Sequential investments where each phase creates options for the next phase have multiplicative value. A static NPV analysis may show negative value, but option value from future flexibility can dwarf the initial investment. Research shows compound options can add 20x or more to traditional valuations.

### Taleb's Optionality Framework

Nassim Nicholas Taleb's work on antifragility provides a powerful lens for optionality thinking.

**Core Concepts:**

**1. Asymmetric Payoffs (Convexity)**
> "Optionality is the property of asymmetric upside (preferably unlimited) with correspondingly limited downside (preferably tiny)."

The key insight: you don't need to be right often if your payoffs are asymmetric. Someone with convex payoffs can guess worse than random and still outperform.

**2. The Barbell Strategy**
Rather than pursuing "medium" risk, combine extremes:
- **85-95% in extremely safe choices** (proven, reversible, low-commitment)
- **5-15% in high-risk, high-upside bets** (experiments, moonshots)
- **Avoid the middle** (medium risk is prone to estimation error)

Applied to decisions: Make most choices conservative and reversible, but deliberately allocate budget for bold experiments with asymmetric upside.

**3. Antifragility: Gaining from Disorder**
Beyond robustness (surviving volatility), antifragile systems *improve* from stressors:
- Build systems that learn from failure
- Design for experimentation, not just execution
- Preserve ability to benefit from positive Black Swans

**4. Via Negativa: What to Avoid**
Often more valuable to know what NOT to do:
- What decisions would you regret most if wrong?
- What irreversible commitments can you avoid?
- What hidden fragilities exist?

### Amazon's Two-Way Door Framework

Jeff Bezos's decision framework from his 1997 shareholder letter provides practical heuristics:

**Type 1 Decisions (One-Way Doors):**
- Consequential and irreversible
- Require slow, methodical, careful consideration
- Need broad consultation
- Examples: Major acquisitions, core architecture choices, public API contracts

**Type 2 Decisions (Two-Way Doors):**
- Changeable, reversible
- Should be made quickly with ~70% of desired information
- Can be made by individuals or small groups
- Examples: A/B tests, feature flags, internal tooling

**The Organizational Trap:**
> "As organizations get larger, there seems to be a tendency to use the heavy-weight Type 1 decision-making process on most decisions... The end result is slowness, unthoughtful risk aversion, failure to experiment sufficiently, and consequently diminished invention."

**The 70% Rule:** "Most decisions should probably be made with somewhere around 70 percent of the information you wish you had. If you wait for 90 percent, in most cases, you're probably being slow."

### Architectural Patterns for Flexibility

Software architecture provides concrete patterns for implementing optionality:

**Hexagonal Architecture (Ports and Adapters):**
- Core business logic isolated from external systems
- Adapters can be swapped without touching core
- Enables: switching databases, APIs, UIs independently

**Interface Segregation:**
- Depend on abstractions, not concretions
- Small, focused interfaces over large ones
- Enables: swapping implementations, A/B testing, gradual migration

**Feature Flags:**
- Runtime toggles for features
- Enable rollback without deployment
- Support incremental rollout and testing

**The Strangler Fig Pattern:**
- Gradually replace system components
- Run old and new in parallel
- Enables: safe migration, reversibility, learning

### Synthesis: The Optionality Mindset

Combining these frameworks yields key principles:

| Principle | Source | Application |
|-----------|--------|-------------|
| **Asymmetric bets** | Taleb | Limit downside, maximize upside |
| **Buy time** | Options theory | Defer irreversible decisions |
| **Value uncertainty** | Vega | More flexibility when future unclear |
| **Compound options** | Real options | Build capabilities that create options |
| **Barbell allocation** | Taleb | Conservative baseline + bold experiments |
| **Two-way doors** | Bezos | Classify decisions by reversibility |
| **Ports and adapters** | Architecture | Isolate decisions, enable swapping |
| **Learn before committing** | All | Validate assumptions cheaply |

**The Meta-Principle:** The value of flexibility is highest when:
1. Uncertainty is high (can't predict what you'll need)
2. Stakes are high (mistakes are costly)
3. Learning is possible (you can gain information)
4. Time is available (you can defer without critical cost)

When these conditions hold, *invest* in optionality rather than *spending* it.

---

## When to Use the Enhanced Version

**Use this enhanced prompt when:**
- Building systems or making decisions with long-term implications
- Working in uncertain or rapidly changing environments
- Architecting solutions where requirements might evolve
- Making technology choices that affect future flexibility
- Planning projects where learning as you go is valuable
- Designing APIs, interfaces, or contracts others will depend on

**Use the original Rule of 5 when:**
- Simple bug fixes or straightforward improvements
- Well-understood domains with stable requirements
- Work with clear, unchanging success criteria
- Speed matters more than strategic flexibility

## The Enhanced Prompt

```
# Universal Rule of 5 Review with Optionality

Review this [CODE/PLAN/RESEARCH/ISSUE/SPEC/DOCUMENT] using the enhanced Rule of 5 - five stages of iterative editorial refinement WITH strategic optionality assessment at each stage.

## Work to Review

[PASTE YOUR WORK OR SPECIFY FILE PATH]

## Core Philosophy

"Breadth-first exploration, then editorial passes—preserving strategic flexibility"

Don't aim for perfection OR lock yourself in during early stages. Each stage builds on insights from previous stages while maintaining future options.

## Stage 1: DRAFT + OPTION SPACE
### Get the shape right AND evaluate alternative approaches

**Quality Questions:**
- Is the overall approach sound?
- Are the main components/sections present?
- Is the scope appropriate?

**Optionality Questions:**
- What alternative approaches were considered?
- Does this approach unnecessarily constrain future choices?
- Are there fundamentally different ways to solve this?
- What assumptions lock us into this path?
- Could we start smaller and expand later?

**Focus on:**
- Overall structure and organization (quality lens)
- Major architectural or conceptual issues (quality lens)
- Alternative solution paths (optionality lens)
- Degrees of freedom in the approach (optionality lens)
- Scalability of commitment (optionality lens)

**For Code:** 
- Quality: Architecture, design patterns, major functions/classes
- Optionality: Could we use plugins instead of hardcoding? Interface vs concrete types? Modular vs monolithic?

**For Plans:** 
- Quality: Phase structure, dependencies, overall approach
- Optionality: Can we validate assumptions before full commitment? Pilot phase possible? Reversible vs irreversible decisions?

**For Research:** 
- Quality: Sections, flow, research questions coverage
- Optionality: Alternative hypotheses explored? Multiple methodologies considered? Assumptions stated?

**Output:**
```
STAGE 1: DRAFT + OPTION SPACE

=== QUALITY ASSESSMENT ===
Shape Quality: [EXCELLENT|GOOD|FAIR|POOR]

Major Issues:
[DRAFT-001] [CRITICAL|HIGH|MEDIUM|LOW] - [Location]
Description: [What's wrong structurally]
Recommendation: [How to fix]

=== OPTIONALITY ASSESSMENT ===
Flexibility Score: [1-10] (10 = maximum future flexibility)

Alternative Approaches Considered:
1. Current approach: [Brief description]
   - Pros: [Key advantages]
   - Cons: [Key limitations]
   - Locks in: [What future choices this constrains]

2. Alternative A: [Brief description]
   - Would preserve: [What options this keeps open]
   - Trade-off: [What we'd give up]

3. Alternative B: [Brief description]
   - Would preserve: [What options this keeps open]
   - Trade-off: [What we'd give up]

Option Space Issues:
[OPT-001] [HIGH|MEDIUM|LOW] - [Location]
Description: [What unnecessarily constrains future choices]
Impact: [What future options this closes off]
Recommendation: [How to preserve flexibility]
Example: "Hardcoding database choice eliminates multi-backend option"

Commitment Scale:
- Reversibility: [EASY|MODERATE|DIFFICULT|IRREVERSIBLE]
- Can we start smaller?: [YES|PARTIALLY|NO]
- Information before commitment: [HIGH|MEDIUM|LOW]

Strategic Assessment: [1-2 sentences on flexibility vs commitment trade-offs]
```

**Convergence Check:**
```
Option space adequately explored: [YES|NO]
Unnecessary constraints identified: [count]
Status: [CONTINUE_TO_STAGE_2]
```

---

## Stage 2: CORRECTNESS + REVERSIBILITY
### Is the logic sound AND can we change course?

**Quality Questions:**
- Are there errors, bugs, or logical flaws?
- Does it actually work/make sense?
- Are assumptions valid?

**Optionality Questions:**
- Which decisions can be easily reversed?
- What's the "undo" cost for each major choice?
- Are we learning before committing?
- Can we test assumptions cheaply?
- What data/evidence would change our approach?

**Focus on:**
- Building on Stage 1 assessment (quality lens)
- Factual accuracy and logical consistency (quality lens)
- Reversibility of decisions (optionality lens)
- Cost to change course (optionality lens)
- Validation checkpoints (optionality lens)

**For Code:** 
- Quality: Syntax errors, logic bugs, algorithm correctness
- Optionality: Database migrations reversible? Can we A/B test? Feature flags present? Deprecation strategy?

**For Plans:** 
- Quality: Feasibility issues, resource estimates
- Optionality: Rollback plan? Pilot checkpoints? Cancel criteria? Exit costs?

**For Research:** 
- Quality: Factual errors, wrong conclusions
- Optionality: Can we validate claims incrementally? Early data collection possible? Multiple interpretation paths?

**Output:**
```
STAGE 2: CORRECTNESS + REVERSIBILITY

=== QUALITY ASSESSMENT ===
Correctness Quality: [EXCELLENT|GOOD|FAIR|POOR]

Issues Found:
[CORR-001] [CRITICAL|HIGH|MEDIUM|LOW] - [Location]
Description: [What's incorrect]
Evidence: [Why this is wrong]
Recommendation: [How to fix with specifics]

=== REVERSIBILITY ASSESSMENT ===
Reversibility Score: [1-10] (10 = easily reversible)

Decision Reversibility Map:
[Decision/Choice] | Reversal Cost | Reversal Time | Locked-in Period
----------------- | ------------- | ------------- | ----------------
[Major choice 1]  | [LOW|MED|HIGH]| [hours|days|months] | [when committed]
[Major choice 2]  | [LOW|MED|HIGH]| [hours|days|months] | [when committed]
[Major choice 3]  | [LOW|MED|HIGH]| [hours|days|months] | [when committed]

Reversibility Issues:
[REV-001] [HIGH|MEDIUM|LOW] - [Location]
Description: [What's irreversible without need]
Impact: [Cost of being wrong]
Recommendation: [How to add reversibility]
Example: "Add feature flag so we can disable new auth system if problems arise"

Validation Checkpoints:
[Location] - [What to validate] - [How to validate] - [When to decide]
Example: "After Phase 1 - User adoption rate - Analytics - Before Phase 2 starts"

Strategic Assessment: [How easily can we change course if wrong?]
```

**Convergence Check (after Stage 2):**
```
New CRITICAL issues: [count]
Irreversible decisions: [count] ([X] justified, [Y] questionable)
Early validation opportunities: [count]
Status: [CONVERGED | CONTINUE]
```

---

## Stage 3: CLARITY + DECISION POINTS
### Can someone else understand this AND when to reassess?

**Quality Questions:**
- Is this comprehensible to the intended audience?
- Is language clear and unambiguous?
- Is context sufficient?

**Optionality Questions:**
- Are decision points clearly marked?
- Do stakeholders understand what's locked in vs still flexible?
- Are reassessment triggers defined?
- Can someone continue/modify this work?
- Are assumptions explicit and visible?

**Focus on:**
- Building on corrected work from Stage 2 (quality lens)
- Readability and comprehensibility (quality lens)
- Explicit decision points (optionality lens)
- Visible flexibility boundaries (optionality lens)
- Handoff/continuation enablement (optionality lens)

**For Code:** 
- Quality: Variable/function names, comments, organization
- Optionality: Config documented? Extension points clear? Assumptions commented? TODO/FIXME for future options?

**For Plans:** 
- Quality: Phase descriptions, success criteria clarity
- Optionality: Decision gates marked? Go/no-go criteria stated? Assumption review points? Pivot triggers?

**For Research:** 
- Quality: Term definitions, logical flow, transitions
- Optionality: Limitations section? Alternative explanations noted? Future research directions? Confidence levels?

**Output:**
```
STAGE 3: CLARITY + DECISION POINTS

=== QUALITY ASSESSMENT ===
Clarity Quality: [EXCELLENT|GOOD|FAIR|POOR]

Issues Found:
[CLAR-001] [HIGH|MEDIUM|LOW] - [Location]
Description: [What's unclear]
Impact: [Why this matters]
Recommendation: [How to improve clarity]

=== DECISION POINT ASSESSMENT ===
Decision Visibility Score: [1-10] (10 = all decisions/assumptions explicit)

Decision Point Map:
[When] | [What's Decided] | [Locked/Flexible] | [Reassess Trigger]
------ | ---------------- | ----------------- | ------------------
[Milestone] | [Choice made] | [LOCKED|FLEXIBLE] | [What would cause review]
Example: "Phase 2 start | Database choice | FLEXIBLE | If >100ms query latency"

Decision Point Issues:
[DECPT-001] [HIGH|MEDIUM|LOW] - [Location]
Description: [What decision point is unclear or missing]
Impact: [Why this matters for flexibility]
Recommendation: [How to make explicit]
Example: "Add explicit checkpoint after MVP: continue with React or consider alternatives if bundle size >500KB"

Assumption Visibility:
Explicit assumptions: [count]
Hidden assumptions: [count]
Critical assumptions needing validation: [count]

Flexibility Communication:
- What's locked in: [CLEAR|UNCLEAR]
- What's still open: [CLEAR|UNCLEAR]
- How to modify: [CLEAR|UNCLEAR]

Strategic Assessment: [Can others understand AND continue/modify this work?]
```

**Convergence Check (after Stage 3):**
```
New CRITICAL issues: [count]
Hidden assumptions surfaced: [count]
Decision points clarified: [count]
Status: [CONVERGED | CONTINUE]
```

---

## Stage 4: EDGE CASES + PIVOT OPTIONS
### What could go wrong AND what are our fallbacks?

**Quality Questions:**
- Are boundary conditions handled?
- Are unusual scenarios covered?
- Is error handling robust?

**Optionality Questions:**
- What are our fallback options if this fails?
- Do we have Plan B for critical paths?
- Can we fail gracefully and recover?
- What external changes could invalidate this?
- Are there escape hatches for locked-in decisions?

**Focus on:**
- Building on clarified work from Stage 3 (quality lens)
- Edge cases and boundary conditions (quality lens)
- Fallback and pivot strategies (optionality lens)
- Graceful degradation (optionality lens)
- Environmental sensitivity (optionality lens)

**For Code:** 
- Quality: Null checks, error handling, race conditions
- Optionality: Fallback mechanisms? Circuit breakers? Feature flags for rollback? Alternative implementations?

**For Plans:** 
- Quality: Risk scenarios, blocked scenarios
- Optionality: Contingency plans? Alternative vendors? Resource substitutions? Descope options?

**For Research:** 
- Quality: Alternative explanations, conflicting evidence
- Optionality: What if hypothesis is wrong? Alternative data sources? Backup methodologies?

**Output:**
```
STAGE 4: EDGE CASES + PIVOT OPTIONS

=== QUALITY ASSESSMENT ===
Edge Case Coverage: [EXCELLENT|GOOD|FAIR|POOR]

Issues Found:
[EDGE-001] [CRITICAL|HIGH|MEDIUM|LOW] - [Location]
Description: [What edge case is unhandled]
Scenario: [When this could happen]
Impact: [What goes wrong]
Recommendation: [How to handle it]

=== PIVOT OPTIONS ASSESSMENT ===
Resilience Score: [1-10] (10 = multiple fallbacks, graceful degradation)

Failure Mode Analysis:
[Failure Scenario] | [Probability] | [Impact] | [Fallback Plan] | [Recovery Cost]
------------------ | ------------- | -------- | --------------- | ---------------
[What could fail]  | [L|M|H]       | [L|M|H|CRITICAL] | [Plan B] | [time/cost]
Example: "API vendor fails | M | CRITICAL | Switch to backup provider | 2 days"

Pivot Option Issues:
[PIVOT-001] [CRITICAL|HIGH|MEDIUM|LOW] - [Location]
Description: [What lacks fallback option]
Scenario: [When we'd need to pivot]
Impact: [Cost of no fallback]
Recommendation: [What fallback to add]
Example: "Add fallback to local caching if CDN fails, prevents total outage"

Escape Hatches:
[Locked Decision] | [Escape Hatch] | [Activation Cost] | [When Available]
----------------- | -------------- | ----------------- | ----------------
[What we committed to] | [How to undo] | [time/cost] | [conditions]
Example: "Monolithic DB | Add adapter layer | 1 week | After v2.0"

External Sensitivity:
- Vendor dependencies: [count] ([X] have fallbacks, [Y] single-source)
- Regulatory assumptions: [count] ([X] validated, [Y] assumed)
- Technology bets: [count] ([X] reversible, [Y] locked)

Strategic Assessment: [How robust is this to failure and change?]
```

**Convergence Check (after Stage 4):**
```
New CRITICAL issues: [count]
Single points of failure: [count] ([X] with fallbacks, [Y] without)
Escape hatches added: [count]
Status: [CONVERGED | CONTINUE]
```

---

## Stage 5: EXCELLENCE + FUTURE FLEXIBILITY
### Ready to ship AND does it enable future options?

**Quality Questions:**
- Would you be proud to ship this?
- Does it meet professional standards?
- Is it complete and thorough?

**Optionality Questions:**
- Does this create or destroy future options?
- Can this grow and evolve?
- Are we building capabilities or just features?
- What new possibilities does this enable?
- Have we optimized for learning?

**Focus on:**
- Final polish based on all previous stages (quality lens)
- Production quality assessment (quality lens)
- Future extensibility (optionality lens)
- Compound option creation (optionality lens)
- Learning and adaptation built in (optionality lens)

**For Code:** 
- Quality: Performance, style, documentation, test coverage
- Optionality: Plugin system? API versioning? Telemetry for learning? Modular for reuse?

**For Plans:** 
- Quality: Implementability, completeness, verification steps
- Optionality: Success metrics for learning? Expansion paths? Platform vs one-off? Reusable components?

**For Research:** 
- Quality: Actionability, recommendations, presentation
- Optionality: Multiple applications? Open questions for future work? Data collected for reuse? Methods transferable?

**Output:**
```
STAGE 5: EXCELLENCE + FUTURE FLEXIBILITY

=== QUALITY ASSESSMENT ===
Excellence Assessment:
- Structure: [EXCELLENT|GOOD|FAIR|POOR]
- Correctness: [EXCELLENT|GOOD|FAIR|POOR]
- Clarity: [EXCELLENT|GOOD|FAIR|POOR]
- Edge Cases: [EXCELLENT|GOOD|FAIR|POOR]
- Overall Quality: [EXCELLENT|GOOD|FAIR|POOR]

Final Polish Issues:
[EXCL-001] [HIGH|MEDIUM|LOW] - [Location]
Description: [What could be better]
Recommendation: [How to achieve excellence]

=== FUTURE FLEXIBILITY ASSESSMENT ===
Future Value Score: [1-10] (10 = maximum future value creation)

Option Creation Analysis:
What This CREATES:
1. [New capability/option enabled]
   - Enables: [What becomes possible]
   - Value: [Estimated future value]
   Example: "Plugin system enables 3rd party extensions without code changes"

2. [New capability/option enabled]
   - Enables: [What becomes possible]
   - Value: [Estimated future value]

What This DESTROYS:
1. [Option closed off]
   - Prevents: [What becomes harder/impossible]
   - Justified because: [Why trade-off is worth it]
   Example: "Choosing SQL prevents graph queries, but ACID guarantees worth it for financial data"

Extensibility Issues:
[EXT-001] [HIGH|MEDIUM|LOW] - [Location]
Description: [What limits future extension]
Impact: [What future needs this blocks]
Recommendation: [How to add extensibility]
Example: "Add event hooks so future features can subscribe to user actions"

Learning Infrastructure:
- Metrics/telemetry: [PRESENT|MISSING]
- A/B testing capability: [PRESENT|MISSING]
- Feedback loops: [PRESENT|MISSING]
- Experimentation support: [PRESENT|MISSING]

Growth Path:
- Can scale to 10x: [YES|PARTIALLY|NO]
- Can add features without rewrite: [YES|PARTIALLY|NO]
- Data model can evolve: [YES|PARTIALLY|NO]
- Can be extracted/reused elsewhere: [YES|PARTIALLY|NO]

Strategic Assessment: [Does this build capabilities or just check boxes?]

Production Ready: [YES|NO|WITH_NOTES]
```

**Convergence Check (after Stage 5):**
```
New CRITICAL issues: [count]
Option creation vs destruction ratio: [positive/negative/neutral]
Future flexibility adequate: [YES|NO|NEEDS_IMPROVEMENT]
Status: [CONVERGED | NEEDS_ITERATION | ESCALATE_TO_HUMAN]
```

---

## Enhanced Convergence Criteria

**CONVERGED** if:
- No new CRITICAL issues AND
- New issue rate < 10% vs previous stage AND
- False positive rate < 20% AND
- **Optionality adequately addressed** (flexibility score ≥ 6 OR trade-offs documented)

**CONTINUE** if:
- New issues found that need addressing OR
- **Significant flexibility concerns unresolved**

**ESCALATE_TO_HUMAN** if:
- After 5 stages, still finding CRITICAL issues OR
- Uncertain about severity or correctness OR
- False positive rate > 30% OR
- **High-stakes irreversible decisions need human judgment** OR
- **Option space inadequately explored for strategic decision**

---

## Final Report (Enhanced)

After convergence or completing Stage 5:

```
# Rule of 5 Review - Final Report (with Optionality Analysis)

**Work Reviewed:** [type] - [path/identifier]
**Convergence:** Stage [N]

## Executive Summary

**Quality Verdict:** [READY | NEEDS_REVISION | NEEDS_REWORK | NOT_READY]
**Optionality Verdict:** [FLEXIBLE | BALANCED | LOCKED_IN | CONCERNING]

**Key Insight:** [1-2 sentences summarizing quality AND strategic flexibility]

---

## Quality Assessment

### Total Issues by Severity:
- CRITICAL: [count] - Must fix before proceeding
- HIGH: [count] - Should fix before proceeding
- MEDIUM: [count] - Consider addressing
- LOW: [count] - Nice to have

### Top 3 Quality Findings

1. [ID] [Description] - [Location]
   Impact: [Why this matters]
   Fix: [What to do]

2. [ID] [Description] - [Location]
   Impact: [Why this matters]
   Fix: [What to do]

3. [ID] [Description] - [Location]
   Impact: [Why this matters]
   Fix: [What to do]

### Stage-by-Stage Quality

- Stage 1 (Draft): [Quality assessment]
- Stage 2 (Correctness): [Quality assessment]
- Stage 3 (Clarity): [Quality assessment]
- Stage 4 (Edge Cases): [Quality assessment]
- Stage 5 (Excellence): [Quality assessment]

---

## Optionality Assessment

### Strategic Scores

- Flexibility Score: [X/10] - [interpretation]
- Reversibility Score: [X/10] - [interpretation]
- Decision Visibility Score: [X/10] - [interpretation]
- Resilience Score: [X/10] - [interpretation]
- Future Value Score: [X/10] - [interpretation]

**Overall Optionality:** [X/10] - [EXCELLENT|GOOD|FAIR|CONCERNING]

### Top 3 Optionality Findings

1. [ID] [Description] - [Location]
   Impact: [What future options affected]
   Recommendation: [How to preserve flexibility]

2. [ID] [Description] - [Location]
   Impact: [What future options affected]
   Recommendation: [How to preserve flexibility]

3. [ID] [Description] - [Location]
   Impact: [What future options affected]
   Recommendation: [How to preserve flexibility]

### Decision Architecture

**Locked-In Decisions** (justified):
1. [Decision] - [Why necessary] - [Escape hatch if any]
2. [Decision] - [Why necessary] - [Escape hatch if any]

**Preserved Flexibility**:
1. [What remains flexible] - [Why valuable]
2. [What remains flexible] - [Why valuable]

**Created Options**:
1. [New option enabled] - [Future value]
2. [New option enabled] - [Future value]

**Destroyed Options** (with justification):
1. [Closed option] - [Why trade-off acceptable]

### Risk Mitigation

**Critical Dependencies**:
- [Dependency] - [Fallback plan] - [Risk level]

**Pivot Points**:
- [When]: [What to assess] - [Go/no-go criteria]

**Early Warning Signs**:
- [Metric/signal] indicates [problem] → [action to take]

---

## Recommended Actions

### Immediate (Before Proceeding)
1. [Action 1 - specific and actionable]
2. [Action 2 - specific and actionable]

### Near-Term (Within iteration)
3. [Action 3 - specific and actionable]
4. [Action 4 - specific and actionable]

### Strategic (Build in over time)
5. [Action 5 - for future flexibility]
6. [Action 6 - for future flexibility]

---

## Decision Framework

**This work should be:**

✅ **Approved if:**
- [Condition based on quality scores]
- [Condition based on optionality scores]
- [Condition based on risk tolerance]

⚠️ **Approved with conditions if:**
- [Condition requiring monitoring]
- [Condition requiring fallback plan]

❌ **Held for revision if:**
- [Blocker based on quality]
- [Blocker based on strategic risk]

---

## Long-Term Considerations

**In 6 months:**
- What will we likely need to change? [Prediction based on flexibility analysis]
- How hard will that change be? [Assessment based on reversibility]

**In 2 years:**
- What options does this create? [Based on option creation analysis]
- What options does this destroy? [Based on locked-in decisions]

**Recommended monitoring:**
- [Metric 1] - [Threshold that would trigger reconsideration]
- [Metric 2] - [Threshold that would trigger reconsideration]

---

## Verdict & Rationale

**Quality Verdict:** [READY | NEEDS_REVISION | NEEDS_REWORK | NOT_READY]
**Optionality Verdict:** [FLEXIBLE | BALANCED | LOCKED_IN | CONCERNING]

**Final Recommendation:** [SHIP | SHIP_WITH_MONITORING | REVISE | RETHINK]

**Rationale:** 

[2-4 sentences explaining:
- Quality readiness
- Strategic flexibility
- Risk/reward balance
- Key trade-offs made]

**Human review recommended:** [YES|NO]
**Reason:** [Why human judgment needed OR why AI review sufficient]
```

---

## Enhanced Rules for All Stages

1. **Build progressively** - Each stage builds on work from previous stages
2. **Preserve optionality** - Default to flexibility unless locking in is justified
3. **Make trade-offs explicit** - Document what flexibility you're giving up and why
4. **Be specific** - Reference exact locations and decisions
5. **Provide actionable fixes** - For both quality AND flexibility issues
6. **Validate claims** - Don't flag potential issues, confirm they exist
7. **Prioritize correctly**:
   - CRITICAL: Blocks use/deployment OR creates catastrophic lock-in
   - HIGH: Significantly impacts quality/usability OR unnecessarily constrains future
   - MEDIUM: Should be addressed but not blocking
   - LOW: Minor improvements
8. **Check convergence** - Stop when new issues drop below threshold
9. **Document flexibility boundaries** - Be clear what's flexible vs locked
10. **Build learning in** - Optimize for information gain, not just completion

---

## Optionality Cheat Sheet

### Quick Questions for Each Stage

**Stage 1: Draft + Option Space**
- "What else could we do?"
- "What are we assuming?"
- "Could we do less and learn first?"

**Stage 2: Correctness + Reversibility**
- "Can we undo this?"
- "What's the cost of being wrong?"
- "Can we test before fully committing?"

**Stage 3: Clarity + Decision Points**
- "When do we reassess?"
- "What's locked vs still open?"
- "How would someone modify this?"

**Stage 4: Edge Cases + Pivot Options**
- "What's Plan B?"
- "How do we fail gracefully?"
- "What external changes could break this?"

**Stage 5: Excellence + Future Flexibility**
- "What does this enable?"
- "Can this grow?"
- "Are we building capabilities or features?"

### Optionality Red Flags

🚩 **High Lock-In Risk:**
- Irreversible without stated justification
- No alternative approaches considered
- Single point of failure without fallback
- Hard-coded assumptions
- No validation checkpoints
- Tight coupling without abstraction

🚩 **Strategic Blindness:**
- "We'll never need to change this"
- "This is the only way"
- "We can refactor later" (but no path shown)
- Missing decision points
- No escape hatches
- Option destruction not acknowledged

### Optionality Green Flags

✅ **Good Flexibility:**
- Multiple approaches evaluated
- Reversibility designed in
- Decision points clearly marked
- Fallback options exist
- Learning checkpoints built in
- Abstractions enable change

✅ **Strategic Awareness:**
- Assumptions explicit
- Trade-offs documented
- Escape hatches present
- Growth paths visible
- Option creation > option destruction
- Built to learn, not just to work

---

## Domain-Specific Examples (Enhanced)

### Example 1: Code Review with Optionality

**Input:**
```python
# Proposed: Hardcoded to PostgreSQL
import psycopg2

def get_user(user_id):
    conn = psycopg2.connect(database="users", user="admin")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    return cursor.fetchone()
```

**Output (abbreviated):**

```
STAGE 1: DRAFT + OPTION SPACE
Shape Quality: FAIR - Function works but tightly coupled

Flexibility Score: 3/10
Alternative A: Use ORM (SQLAlchemy) - preserves database flexibility
Alternative B: Use database abstraction layer - enables multi-backend
Alternative C: Keep direct SQL but behind interface - easier to swap later

[OPT-001] HIGH - Function signature
Description: Direct psycopg2 dependency locks us to PostgreSQL
Impact: Changing databases requires rewriting all queries
Recommendation: Use abstraction layer or ORM

Commitment Scale:
- Reversibility: DIFFICULT (all queries would need rewrite)
- Can we start smaller?: YES (use ORM from start)
- Information before commitment: LOW (haven't tested other DBs)

STAGE 2: CORRECTNESS + REVERSIBILITY
[REV-001] HIGH - Database choice
Reversibility: DIFFICULT - No abstraction, ~40 queries use psycopg2
Recommendation: Add database interface layer, use dependency injection

Decision: PostgreSQL | Reversal Cost: HIGH | Reversal Time: 2 weeks | Locked: NOW

STAGE 3: CLARITY + DECISION POINTS
[DECPT-001] MEDIUM - Database assumption
Recommendation: Add comment: "# TODO: Consider ORM if we need multi-DB support in Q3"

Decision Point: "After 100 users | Review DB performance | Reassess if >100ms queries"

STAGE 4: EDGE CASES + PIVOT OPTIONS
[PIVOT-001] HIGH - No fallback if PostgreSQL fails
Recommendation: Add connection pooling, retry logic, consider read replica option

STAGE 5: EXCELLENCE + FUTURE FLEXIBILITY
Future Value Score: 4/10 - Works but limits future options

What This DESTROYS:
1. Multi-database support - "PostgreSQL-specific syntax hard to abstract later"
2. Easy testing - "Need PostgreSQL running for all tests"

What This CREATES:
1. PostgreSQL expertise - "Team learns PostgreSQL deeply"

[EXT-001] HIGH - Tight coupling
Recommendation: Wrap in repository pattern so future changes contained

VERDICT:
Quality: GOOD (works correctly)
Optionality: CONCERNING (unnecessary lock-in)
Recommendation: REVISE - Add abstraction layer before proceeding
```

### Example 2: Plan Review with Optionality

**Input:** 
"Plan: Migrate entire codebase to new framework in one big-bang release"

**Output (abbreviated):**

```
STAGE 1: DRAFT + OPTION SPACE
Flexibility Score: 2/10 - All-or-nothing approach

Alternative A: Strangler fig pattern - migrate incrementally
Alternative B: Run both frameworks in parallel with feature flags
Alternative C: Extract to microservices, migrate services individually

[OPT-001] CRITICAL - All-or-nothing approach
Description: Big-bang migration is irreversible once started
Impact: No learning before full commitment, no rollback if issues
Recommendation: Use strangler fig pattern for reversible migration

STAGE 2: CORRECTNESS + REVERSIBILITY
[REV-001] CRITICAL - Migration approach
Reversibility: IRREVERSIBLE once deployed
Reversal Cost: Project failure - can't go back
Recommendation: Add Phase 0: Pilot migration of one module with rollback plan

Decision Point Map:
Phase 1 | Migrate auth module | FLEXIBLE | If >5 bugs, pause and reassess
Phase 2 | Migrate user module | LOCKED | Only proceed if Phase 1 success rate >95%

STAGE 3: CLARITY + DECISION POINTS
[DECPT-001] CRITICAL - No go/no-go criteria
Recommendation: Add explicit gates:
- After pilot: <3 critical bugs → proceed, ≥3 bugs → replan
- After Phase 1: User satisfaction >4/5 → continue, <4/5 → pivot

STAGE 4: EDGE CASES + PIVOT OPTIONS
[PIVOT-001] CRITICAL - No Plan B if migration fails mid-way
Recommendation: Add parallel run capability - run old + new for 2 weeks

Fallback Plan: "Keep old framework code for 3 months, feature flag to switch back"

STAGE 5: EXCELLENCE + FUTURE FLEXIBILITY
Future Value Score: 6/10 - Creates clean codebase but risky path

What This DESTROYS:
1. Gradual learning - "All-at-once means no iteration"
2. Risk mitigation - "Can't back out mid-migration"

REVISED What This CREATES (with strangler pattern):
1. Incremental validation - "Learn which modules are risky"
2. Rollback options - "Can stop and assess at any point"
3. Parallel team learning - "Different teams migrate different modules"

VERDICT:
Quality: POOR (too risky as proposed)
Optionality: CONCERNING (irreversible, no learning)
Recommendation: RETHINK - Use incremental migration with decision gates
```

### Example 3: Architecture Decision with Optionality

**Input:** 
"We need real-time features. Let's use WebSockets throughout the app."

**Output (abbreviated):**

```
STAGE 1: DRAFT + OPTION SPACE
Flexibility Score: 4/10 - WebSockets commit but not terrible

Alternative Approaches:
1. Current: WebSockets everywhere
   - Locks in: Stateful connections, complex scaling
   
2. Alternative: Progressive enhancement - HTTP for most, WebSocket for real-time subset
   - Preserves: Simple scaling for 90% of features
   - Trade-off: Slightly more complex client code

3. Alternative: Server-Sent Events + fetch API
   - Preserves: HTTP infrastructure
   - Trade-off: One-way communication

[OPT-001] MEDIUM - Over-commitment to WebSockets
Recommendation: Start with real-time only where needed, HTTP elsewhere

STAGE 2: CORRECTNESS + REVERSIBILITY
Reversibility Analysis:
- WebSocket infrastructure: MODERATE cost to remove (load balancer changes)
- Per-feature WebSocket usage: LOW cost to replace with HTTP
  
[REV-001] MEDIUM - Architecture choice
Recommendation: Use feature flags per endpoint, can switch WebSocket→HTTP individually

STAGE 3: CLARITY + DECISION POINTS
Decision Point: After MVP launch
- Reassess: If WebSocket connections <1000, HTTP may be simpler
- Reassess: If scaling costs >$500/month, review necessity

STAGE 4: EDGE CASES + PIVOT OPTIONS
[PIVOT-001] HIGH - No fallback if WebSocket fails
Recommendation: Implement automatic degradation to polling for clients that can't maintain WebSocket

Failure Mode: WebSocket connection fails
Fallback: Auto-switch to long polling
Recovery: Retry WebSocket every 30 seconds

STAGE 5: EXCELLENCE + FUTURE FLEXIBILITY
Future Value Score: 7/10 - Good with recommended changes

What This CREATES:
1. Real-time capability infrastructure
2. Experience with stateful connection management

[EXT-001] MEDIUM - Make protocol switchable
Recommendation: Abstract behind transport layer so can swap HTTP/WebSocket/SSE per feature

Growth Path:
- Can scale to 10k connections: YES (with proper infrastructure)
- Can revert specific features to HTTP: YES (with abstraction layer)
- Can add new transport types: YES (with interface design)

VERDICT:
Quality: GOOD (solid architecture with changes)
Optionality: BALANCED (flexibility where it matters)
Recommendation: SHIP WITH MONITORING - Implement progressive enhancement + fallbacks
```

---

## When Optionality Doesn't Matter

**Don't over-optimize for flexibility when:**

1. **Truly temporary work**
   - Prototype meant to be thrown away
   - One-time data migration
   - Temporary workaround with clear end date

2. **Constraints are genuine**
   - Regulatory requirements (must use specific encryption)
   - Physical laws (can't change speed of light)
   - Third-party integration (their API, their rules)

3. **Flexibility has negative value**
   - Security: Limiting options is the point
   - Standards: Consistency matters more than flexibility
   - Performance: Abstraction adds unacceptable overhead

4. **Decision is reversible AND cheap**
   - Config file changes
   - CSS styling
   - Variable names

**The test:** "What's the cost if we're wrong?" 
- If LOW → Don't over-engineer flexibility
- If HIGH → Optionality thinking essential

---

## Performance Characteristics (Enhanced)

**Enhanced Rule of 5 with Optionality:**
- Time: 15-22 minutes (vs 12-17 for original)
- API calls: 5-7
- Detection rate: 75-85% (quality) + strategic insight (optionality)
- False positives: 15-20%
- Cost: $0.50-0.75 per review
- Best for: Strategic decisions, architecture, long-term planning

**When the extra time/cost is worth it:**
- Decisions with >6 month impact
- Architectural choices
- Framework/platform selections
- API design
- Multi-team coordination
- Uncertain or evolving requirements

**When to use original Rule of 5:**
- Bug fixes
- Well-understood patterns
- Short-term tactical work
- Speed critical

---

## References and Further Reading

### Financial Options Theory
- [Options Greeks: Understanding Delta, Gamma, Theta, Vega, Rho](https://optionalpha.com/learn/options-greeks) - Option Alpha
- [Get to Know the Options Greeks](https://www.schwab.com/learn/story/get-to-know-option-greeks) - Charles Schwab
- Black-Scholes-Merton model (1973) - Foundation of modern option pricing

### Real Options Theory
- [Real Options - Types and Pricing](https://corporatefinanceinstitute.com/resources/derivatives/real-options/) - Corporate Finance Institute
- [Real Options Analysis](https://thedecisionlab.com/reference-guide/economics/real-options-analysis) - The Decision Lab
- [Real Options Theory - Oxford Bibliographies](https://www.oxfordbibliographies.com/display/document/obo-9780199846740/obo-9780199846740-0213.xml)
- Myers, Stewart C. (1977). "Determinants of Corporate Borrowing" - MIT Sloan, coined "real options"
- [The Real Power of Real Options](https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/the-real-power-of-real-options) - McKinsey
- Trigeorgis, Lenos. *Real Options* (MIT Press, 1996)

### Taleb's Optionality Framework
- Taleb, Nassim Nicholas. *Antifragile: Things That Gain from Disorder* (2012)
- Taleb, Nassim Nicholas. *The Black Swan: The Impact of the Highly Improbable* (2007)
- [Understanding is a Poor Substitute for Convexity](https://www.edge.org/conversation/nassim_nicholas_taleb-understanding-is-a-poor-substitute-for-convexity-antifragility) - Edge.org
- [What is Optionality?](https://taylorpearson.me/optionality/) - Taylor Pearson
- [A Dozen Things I've Learned from Nassim Taleb about Optionality](https://25iq.com/2013/10/13/a-dozen-things-ive-learned-from-nassim-taleb-about-optionalityinvesting/) - 25iq
- [The Optionality Fallacy](https://nesslabs.com/optionality-fallacy) - Ness Labs (counterargument worth reading)

### Barbell Strategy
- [The Barbell Strategy](https://www.wealest.com/articles/barbell-strategy) - Wealest
- [Nassim Taleb: The Barbell Strategy](https://landexai.medium.com/investment-strategy-part-iv-nassim-taleb-the-barbell-strategy-b85da2c9ff7b) - LandEx

### Amazon's Decision Framework
- [Jeff Bezos's 1-Way vs 2-Way Doors](https://blueprints.guide/posts/one-way-vs-two-way-doors) - Blueprints
- [Elements of Amazon's Day 1 Culture](https://aws.amazon.com/executive-insights/content/how-amazon-defines-and-operationalizes-a-day-1-culture/) - AWS Executive Insights
- [Reversible and Irreversible Decisions](https://fs.blog/reversible-irreversible-decisions/) - Farnam Street
- Bezos, Jeff. Amazon Shareholder Letter (1997) - Original source of Type 1/Type 2 framework

### Architectural Patterns for Flexibility
- [Hexagonal Architecture - System Design](https://www.geeksforgeeks.org/system-design/hexagonal-architecture-system-design/) - GeeksforGeeks
- [Hexagonal Architecture](https://bitloops.com/docs/bitloops-language/learning/software-architecture/hexagonal-architecture) - Bitloops
- Cockburn, Alistair. "Hexagonal Architecture" (2005) - Original ports and adapters pattern
- Martin, Robert C. *Clean Architecture* (2017) - Synthesis of hexagonal, onion, and related patterns
- [Hexagonal Architecture - Wikipedia](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))

### Compound Options and Sequential Investment
- [Sequential Compound Options](https://www.financeinvest.at/sequential-compound-option/) - Finance Invest
- [Modeling Sequential R&D Investments: A Binomial Compound Option Approach](https://link.springer.com/article/10.1007/s40685-014-0017-5) - Business Research

---

## Version History

- 2.1.0 (2026-01-18): Added comprehensive theoretical foundations section with research on financial options theory, real options, Taleb's framework, Amazon's two-way doors, and architectural patterns
- 2.0.0 (2026-01-16): Enhanced version integrating optionality thinking at all 5 stages
- 1.0.0 (2026-01-13): Original universal implementation by Steve Yegge
