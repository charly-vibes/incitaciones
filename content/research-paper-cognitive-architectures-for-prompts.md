---
title: Cognitive Architectures for Prompt Engineering
type: research
subtype: paper
tags: [cognitive-architecture, disney-strategy, six-hats, red-teaming, pre-mortem, medical-diagnosis, aviation-crm, legal-review]
tools: [claude-code, cursor, aider, gemini]
status: verified
created: 2026-01-12
updated: 2026-01-12
version: 1.0.0
related: [research-paper-rule-of-5-multi-agent-review.md, prompt-task-iterative-code-review.md, prompt-workflow-multi-agent-parallel-review.md]
source: synthesis
---

# Cognitive Architectures for Prompt Engineering: Cross-Disciplinary Methodologies

## Summary

A comprehensive analysis of how professional methodologies from creative arts, military, medicine, aviation, and law can be adapted into "metacognitive prompts" that structure AI reasoning. Moves beyond simple instruction-based prompting to cognitive emulation of expert thought processes.

## Context

As LLMs evolve from text generation to complex reasoning and agentic workflows, simple "instruction-based" prompting becomes insufficient. This research explores how treating LLMs as cognitive systems that can emulate specialized thought processes unlocks higher-order problem solving.

## Hypothesis / Question

Can we significantly improve AI agent reasoning and output quality by adapting mature methodologies from high-stakes human disciplines (arts, military, medicine, aviation, law) into structured prompt frameworks?

## Method

Analysis of six cross-disciplinary frameworks and their application to prompt engineering:

### 1. Disney Creative Strategy: Compartmentalizing Cognition

**Origin:** Walt Disney's three-room creative process (Dreamer, Realist, Critic)

**Core Concept:** Separate divergent thinking from convergent execution from critical evaluation to prevent cognitive contamination.

**Three Roles:**

**A. The Dreamer** - Unconstrained ideation
- **Function:** Generate possibilities without feasibility constraints
- **Key Question:** "What do we want?" "How can we imagine a solution?"
- **Constraint:** Forbidden from using words like "budget," "limit," "impossible"
- **Integration:** SCAMPER technique (Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse)

**B. The Realist** - Bridge to feasibility
- **Function:** Constructive planning assuming the dream is possible
- **Key Question:** "How can this be done with resources we have?"
- **Constraint:** Must accept Dreamer's goal as valid; focus on logistics
- **Mechanism:** Does not reject ideas; reframes them into achievable steps

**C. The Critic** - Quality assurance
- **Function:** Adversarial risk identification
- **Key Question:** "What could go wrong?" "What is missing?"
- **Constraint:** Does not generate solutions; only identifies problems
- **Note:** Distinct from Red Team - Critic wants project to succeed

**Application to Prompts:**
```
Phase 1: "You are the Dreamer. Propose 5 solutions ignoring all constraints."
Phase 2: "You are the Realist. Take solution X and create a step-by-step plan."
Phase 3: "You are the Critic. Find every flaw in this plan."
```

### 2. Six Thinking Hats: De-Biasing with Parallel Thinking

**Origin:** Edward de Bono's cognitive separation framework

**Core Concept:** Separate modes of thinking to prevent "spaghetti thinking" where multiple cognitive modes conflict.

**Six Hats (Agent Roles):**

1. **White Hat - The Objective Researcher**
   - Focus: Information, facts, data
   - No judgment, only metrics and ground truth
   - Example: "List function metrics: lines, complexity, test coverage"

2. **Red Hat - The Emotional Proxy**
   - Focus: Feelings, intuition, user empathy simulation
   - Example: "How would a non-technical user *feel* with this error message?"

3. **Black Hat - The Cautious Guardian**
   - Focus: Risk, caution, "why it might not work"
   - Example: "Identify regulatory violations and security vulnerabilities"

4. **Yellow Hat - The Logical Optimist**
   - Focus: Value and benefits
   - Balances Black Hat
   - Example: "Despite risks, what is the unique competitive advantage?"

5. **Green Hat - The Creative Catalyst**
   - Focus: Alternatives and new ideas
   - Replaces judgment with movement
   - Example: "For every Black Hat risk, propose a novel mitigation"

6. **Blue Hat - The Agentic Orchestrator**
   - Focus: Managing the thinking process itself
   - Controller agent in multi-agent systems
   - Example: "Review White and Red hat outputs. Do we need Green Hat for more ideas?"

**Application:** "Ensemble of Experts" architecture where each agent adopts an extreme cognitive stance to avoid mode collapse into mediocre responses.

### 3. Military Red Teaming: Adversarial Resilience Testing

**Origin:** Prussian Kriegsspiel → Cold War wargaming → Cybersecurity

**Core Concept:** Independent adversarial entity modeling the enemy to expose vulnerabilities.

**Key Difference from Critic:** Red Team wants the project to fail (for testing purposes).

**Threat Modeling Requirements:**
- Define specific adversary capabilities and goals
- Adopt adversarial persona (not generic "find bugs")

**Two Personas:**

1. **Insider Threat**
   - Legitimate access, malicious intent
   - Example: "You have read-access to the database. How can you infer sensitive data from non-sensitive logs?"

2. **Chaos Monkey**
   - Random infrastructure failure simulation
   - Example: "You can sever network connections. Which dependency causes the most catastrophic cascading failure?"

**Application:**
```
"Act as a Red Team. You are a malicious actor.
Analyze this API. Find the endpoint with weakest input validation.
Draft a request that exploits it for DoS."
```

### 4. Pre-Mortem Analysis: Prospective Hindsight

**Origin:** Gary Klein's cognitive psychology research

**Core Concept:** "It *has* failed. Why?" vs "What *might* go wrong?"

**Psychology:** Explaining a certainty (past) is cognitively easier than predicting a probability (future). Overrides optimism bias.

**Prompt Structure:**
```
"Imagine it is [FUTURE DATE]. The project has failed spectacularly.
40% of customers have churned. You are writing the autopsy report.
Do not tell me IF it failed. Tell me WHY it failed.
Look for root causes in today's technical decisions."
```

**Risk Categorization (Parabol Taxonomy):**

- **Iguanas:** Small, annoying issues (UI lag)
- **Crocodiles:** Significant, foreseeable threats (database won't scale)
- **Komodo Dragons:** Unpredictable, existential threats (competitor releases free version, regulation changes)

### 5. Medical Differential Diagnosis (DDx): Bayesian Debugging

**Origin:** Clinical medicine diagnostic process

**Core Concept:** Systematic elimination to distinguish conditions with similar features.

**Seven-Step Workflow for Software:**

1. **Symptom Acquisition:** "What is the clinical presentation?" (latency spike, 500 error)
2. **Problem Representation:** Brief summary using standard terminology
3. **Hypothesis Generation:** List *all* possible causes ranked by probability
4. **Illness Scripts:** Narrative patterns (e.g., "Memory Leak Script" = gradual increase + degradation + OOM crash)
5. **Testing and Exclusion:** For each hypothesis, propose test to rule it out
6. **Diagnosis:** The remaining hypothesis
7. **Treatment:** Apply the fix

**Critical Concept:** "Zebra" diagnoses - rare causes to check when common ones ruled out.

**Application to Distributed Systems:**
```
"Symptom: High latency. Generate differential diagnosis:
1. Network latency
2. Database locks
3. Memory pressure
4. CPU saturation
5. Disk I/O

For each, propose a test to rule it out."
```

### 6. Scientific Method: Falsification over Verification

**Origin:** Karl Popper's philosophy of science

**Core Concept:** Robust science attempts to prove hypothesis *false*, not true.

**Application:** Counter confirmation bias in testing.

**Prompt Strategy:**
```
"Hypothesis: This function handles all valid date inputs correctly.
Your Goal: Falsify this hypothesis.
Generate test cases (Leap Year, Negative Timestamp, Non-standard format)
that cause the function to fail."
```

**Alignment with Property-Based Testing:** Define invariant properties, generate randomized inputs to violate them.

### 7. Aviation CRM: High Reliability Protocols

**Origin:** Crew Resource Management addressing human error in cockpits

**Core Concept:** Reliability through structured communication and Threat and Error Management (TEM).

**Managing the Startle Effect:**

Aviation mantra: "Aviate, Navigate, Communicate"

Applied to AI agents encountering Out-of-Distribution (OOD) data:
1. **Aviate:** Maintain system stability (circuit breaker, don't retry infinitely)
2. **Navigate:** Assess situation (parse error, transient vs permanent)
3. **Communicate:** Log clearly, alert human

**Checklist Types (Atul Gawande):**

1. **Read-Do Checklist:** Follow step-by-step as you perform (recipe-style)
   - Example: "Execute deployment: 1. Pull code 2. Build container 3. Push to registry"

2. **Do-Confirm Checklist:** Perform from memory, then verify
   - Example: "Generate SQL query. PAUSE. Checklist: 1. WHERE clause on DELETE? 2. Inputs sanitized?"

**Benefit:** Do-Confirm significantly reduces syntax errors by forcing a cognitive "pause."

### 8. Legal Contract Review: Ambiguity Detection

**Origin:** Legal drafting for deterministic execution in courts

**Core Concept:** Lawyers are the original prompt engineers - texts must execute correctly in future "runtime" (court).

**Taxonomy of Ambiguity:**

1. **Patent Ambiguity:** Obvious on the face ("system shall be fast")
2. **Latent Ambiguity:** Appears clear but becomes ambiguous in context ("process active accounts" - what if account is active but locked?)
3. **Syntactic Ambiguity:** Structural, modifier scope issues
   - Example: "Update user profile and send email if user is active" (does active apply to both?)

**Contra Proferentem Doctrine:**

Ambiguity interpreted *against* the drafter.

**Application:**
```
"Act as opposing counsel using Contra Proferentem.
Review these requirements. Find every ambiguity and interpret it
in the way most detrimental to the project (most work/liability).
This will help us tighten the spec."
```

**Logical Fallacy Detection:**

Loopholes are bugs in logic.

**Prompt:**
```
"Review this API rate limiting logic.
Find 'loopholes' - logical gaps allowing bypass
without technically violating the rules."
```

## Results

### Key Findings

1. **Compartmentalization prevents self-censorship:** Separating Dreamer from Critic allows uninhibited ideation that would otherwise be suppressed.

2. **Extreme perspectives beat averaged responses:** Forcing agents to adopt extreme stances (pure optimism vs pure pessimism) via Six Hats prevents "mode collapse" into mediocre middle-ground answers.

3. **Adversarial thinking finds edge cases:** Red Teaming and Pre-Mortem uncover "Black Swan" events that benevolent critics miss due to shared optimism.

4. **Structured diagnostics prevent anchoring bias:** Medical DDx workflow forces systematic consideration of all possibilities, not just the first error seen.

5. **Falsification is more robust than verification:** Testing what breaks (not what works) aligns with property-based testing and finds deeper bugs.

6. **Checklists reduce cognitive load:** Both Read-Do and Do-Confirm patterns significantly reduce errors in code generation.

7. **Ambiguity detection improves specifications:** Legal review techniques catch requirement gaps early, preventing implementation waste.

8. **Prospective hindsight beats forward prediction:** Pre-Mortem format (future perfect tense) produces more specific risk identification than standard risk assessment.

## Analysis

### The Cognitive Ensemble Architecture

The true power emerges when methodologies are chained into "Cognitive Workflows":

**Example: Designing Mission-Critical Microservice**

1. **Phase 1: Ideation (Artist)** - Dreamer + SCAMPER
2. **Phase 2: Refinement (Psychologist)** - Six Hats Council
3. **Phase 3: Stress Testing (General & Manager)** - Red Team + Pre-Mortem
4. **Phase 4: Specification (Lawyer)** - Ambiguity Detection
5. **Phase 5: Implementation (Pilot)** - Checklists
6. **Phase 6: Debugging (Doctor)** - Differential Diagnosis

### Why This Works: Overriding RLHF Biases

Modern LLMs are fine-tuned for "helpful, harmless, honest" responses. This creates biases:
- Reluctance to predict failure (optimism bias)
- Averaging conflicting perspectives (mode collapse)
- Avoiding extreme positions (safety rails)

These frameworks explicitly override these biases:
- Pre-Mortem forces failure prediction
- Six Hats forces extreme perspectives
- Red Team forces adversarial thinking

## Practical Applications

### Integration Strategies

**1. Sequential Chaining:**
```
"First, put on the Dreamer hat and generate 5 wild ideas.
Then, switch to the Realist hat and make idea 3 practical.
Finally, switch to the Black Hat and find flaws."
```

**2. Parallel Council:**
```
"Create a Six Hats Council. Each hat analyzes this proposal independently.
Then Blue Hat synthesizes all perspectives."
```

**3. Adversarial Pairing:**
```
"Agent A: Be the optimistic Yellow Hat.
Agent B: Be the pessimistic Black Hat.
Agent C (Blue Hat): Synthesize their debate."
```

### Tool-Specific Implementations

**Claude Code:** Use Task tool with specialized agents
**Aider:** Sequential prompts in one session
**Cursor:** Command palette with saved prompt chains

### When to Use Which Framework

| Framework | Best For | Time Investment |
|-----------|----------|-----------------|
| Disney Strategy | Feature design, creative problem solving | 15-20 min |
| Six Hats | Decision-making, UX review | 20-30 min |
| Red Teaming | Security review, resilience testing | 30-45 min |
| Pre-Mortem | Project planning, risk assessment | 10-15 min |
| Medical DDx | Debugging, root cause analysis | 15-25 min |
| Aviation CRM | Production deployment, safety-critical | 20-30 min |
| Legal Review | Requirements specification | 15-20 min |

## Limitations

1. **Increased token usage:** Multiple cognitive passes consume more tokens

2. **Requires explicit prompting:** LLMs won't naturally adopt these frameworks without instruction

3. **Context window management:** Long multi-phase workflows may exceed context limits

4. **Learning curve:** Users must understand when to apply which framework

5. **Not always necessary:** Simple tasks don't benefit from complex cognitive architectures

## Related Prompts

- prompt-task-iterative-code-review.md - Uses Disney Strategy and Six Hats
- prompt-workflow-pre-mortem-planning.md - Applies Pre-Mortem to project planning
- prompt-task-systematic-debugging.md - Uses Medical DDx workflow

## References

### Disney Creative Strategy
- Robert Dilts, NLP modeling of Walt Disney
- [Disney Creative Strategy Template - Miro](https://miro.com/templates/disney-creative-strategy/)

### Six Thinking Hats
- Edward de Bono, "Six Thinking Hats" (1985)
- [De Bono Group Official](https://www.debonogroup.com/services/core-programs/six-thinking-hats/)

### Red Teaming
- RAND Corporation, Cold War wargaming
- University of Foreign Military and Cultural Studies
- [Hacking AI for Good - Innodata](https://innodata.com/hacking-ai-for-good-the-essential-guide-to-ai-red-teaming/)

### Pre-Mortem
- Gary Klein, cognitive psychology research
- [Mountain Goat Software Guide](https://www.mountaingoatsoftware.com/blog/use-a-pre-mortem-to-identify-project-risks-before-they-occur)

### Medical Diagnosis
- Clinical reasoning education literature
- [Differential Diagnosis for Distributed Systems](https://chronosphere.io/learn/troubleshoot-faster-with-ddx/)

### Aviation CRM
- FAA Crew Resource Management standards
- Atul Gawande, "The Checklist Manifesto"

### Legal Review
- Contract law, ambiguity doctrines
- [How Courts Resolve Ambiguous Contract Language](https://www.plunkettcooney.com/dontbetthebusinessblog/ambiguous-contracts)

## Future Research

1. **Optimal framework combinations:** Which frameworks synergize best?

2. **Framework selection automation:** Can an AI meta-agent choose which framework to apply?

3. **Compression techniques:** How to get framework benefits with fewer tokens?

4. **Cross-tool portability:** How do frameworks adapt across different LLM tools?

5. **Measuring cognitive depth:** Can we quantify the "depth" of AI reasoning with vs without frameworks?

6. **Long-term learning:** Can agents learn from framework applications to improve base reasoning?

## Version History

- 1.0.0 (2026-01-12): Initial synthesis of cross-disciplinary cognitive methodologies for prompt engineering
