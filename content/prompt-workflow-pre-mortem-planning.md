---
title: Workflow for Pre-Mortem Planning
type: prompt
subtype: workflow
tags: [pre-mortem, risk-assessment, project-planning, cognitive-architecture]
tools: [claude-code, aider, cursor, gemini]
status: verified
created: 2026-01-12
updated: 2026-01-12
version: 1.0.0
related: [research-paper-cognitive-architectures-for-prompts.md]
source: research-based
---

# Pre-Mortem: Prospective Hindsight for Project Planning

## When to Use

This prompt is designed for use at the beginning of a project, a new feature sprint, or any significant undertaking. It helps teams identify potential risks and weaknesses in a plan before they materialize. By framing the failure as a past event, it bypasses natural optimism bias and encourages more critical, specific, and honest feedback.

**Do not use this** for trivial tasks or when a project is already in crisis mode (in which case, a standard post-mortem or a root cause analysis would be more appropriate).

## The Prompt

````
Imagine it is [FUTURE DATE, e.g., six months from now]. The [PROJECT NAME] project has failed spectacularly. It was a complete disaster, resulting in [SPECIFIC NEGATIVE BUSINESS OUTCOME, e.g., 40% customer churn, a major security breach, a total budget overrun].

You are the lead investigator writing the internal autopsy report. Your job is to uncover the root causes of the failure.

Do not speculate on *if* it might fail. You must assume it *has* failed.

Your task:
1. Write a brief, 1-2 paragraph narrative describing how the failure unfolded.
2. Based on that narrative, identify the top 3-5 root causes of the failure. For each root cause, trace it back to a specific decision, assumption, or action made in the plan *today*.
3. Be specific and unflinching in your analysis. Your goal is to provide the team with the "prospective hindsight" needed to prevent this future from happening.
````

## Example

**Context:**
A team is about to start building a new feature called "Project Chimera," a real-time collaboration editor. The launch date is set for three months from now.

**Input:**
```
Imagine it is July 12, 2026. The "Project Chimera" launch has failed spectacularly. It was a complete disaster, resulting in corrupted user data and a public apology.

You are the lead investigator writing the internal autopsy report. Your job is to uncover the root causes of the failure.

Do not speculate on *if* it might fail. You must assume it *has* failed.

Your task:
1. Write a brief, 1-2 paragraph narrative describing how the failure unfolded.
2. Based on that narrative, identify the top 3-5 root causes of the failure. For each root cause, trace it back to a specific decision, assumption, or action made in the plan *today*.
3. Be specific and unflinching in your analysis. Your goal is to provide the team with the "prospective hindsight" needed to prevent this future from happening.
```

**Expected Output:**
```
### Autopsy Report: Project Chimera Failure

**Narrative of Failure:**
The launch of Project Chimera was initially met with excitement, but within 48 hours, reports of data corruption began flooding our support channels. The root issue was a series of race conditions in the collaborative sync algorithm that were never detected during our testing phase. The pressure to meet the July deadline led the team to cut corners on concurrency testing, assuming that standard user testing would suffice. When thousands of users began collaborating simultaneously, the system's conflict-resolution logic failed, leading to data being overwritten and permanently lost.

**Root Causes:**

1.  **Inadequate Concurrency Testing:** The optimistic assumption that our CRDT (Conflict-Free Replicated Data Type) implementation was robust without rigorous, automated stress testing. This decision, made in today's planning meeting, stemmed from a desire to accelerate the timeline.
2.  **Underestimation of Technical Complexity:** The initial project plan classified the sync algorithm as a "medium" complexity task. This fundamentally misunderstood the challenges of distributed state management and led to insufficient allocation of time and senior engineering resources.
3.  **"Happy Path" QA Mentality:** The QA plan focused on user-facing features and usability, not on adversarial network conditions or high-latency scenarios. The failure to budget for a dedicated "chaos engineering" day in the sprint plan was a critical oversight.
```

## Expected Results

- A clear, plausible narrative of project failure.
- A list of 3-5 specific, actionable root causes.
- Each root cause should be linked directly to a decision or assumption in the current plan.
- The team is equipped with a concrete list of high-risk areas to address immediately.

## Variations

### Risk Categorization (Parabol Taxonomy)

To add another layer of analysis, ask the AI to categorize the identified risks using the following taxonomy.

**Add this to the prompt:**
```
After identifying the root causes, categorize each one as an "Iguana," "Crocodile," or "Komodo Dragon":
- **Iguanas:** Small, annoying problems that could be ignored but will bite us later (e.g., tech debt, minor UI inconsistencies).
- **Crocodiles:** Significant, foreseeable threats that will cause major damage if not addressed (e.g., the database won't scale, a key dependency is deprecated).
- **Komodo Dragons:** Unpredictable, existential threats that could kill the project outright (e.g., a sudden shift in market needs, a competitor's surprise launch).
```

## References

- [Gary Klein's research on pre-mortems](https://www.mountaingoatsoftware.com/blog/use-a-pre-mortem-to-identify-project-risks-before-they-occur)
- `research-paper-cognitive-architectures-for-prompts.md`

## Notes

This technique is powerful but relies on psychological framing. It is crucial that the prompt insists on the failure being a past event. Any language that allows for speculation ("what might go wrong?") will dilute the effect and lead to less specific, more generic risk brainstorming.

## Version History

- 1.0.0 (2026-01-12): Initial version based on the cognitive architectures research paper.
