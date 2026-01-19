---
title: Design in Practice Methodology for Software Composition
type: research
subtype: synthesis
tags: [design-methodology, hickey, hammock-driven, decision-making, problem-solving]
tools: [claude-code]
status: draft
created: 2026-01-18
updated: 2026-01-18
version: 1.0.0
related: []
source: [https://www.youtube.com/watch?v=c5QF2HjHLSE, https://www.youtube.com/watch?v=VBnGhQOyTM4]
---

# Design in Practice Methodology for Software Composition

## Summary

Rich Hickey's "Design in Practice" methodology redefines software design as a distinct phase of knowledge acquisition and logical exclusion that must precede implementation. The six-phase framework (Describe, Diagnose, Delimit, Direction, Design, Develop) combined with Hammock Driven Development provides a structured approach to solving complex problems through rigorous thinking before coding.

## Context

Contemporary software development conflates "design" with "implementation," leading to costly "do-over" cycles where learning happens through failed code rather than upfront thinking. This research synthesizes Hickey's methodology to extract principles applicable to AI-assisted development and prompt engineering workflows.

## Hypothesis / Question

Can separating design (understanding) from implementation (execution) reduce wasted effort and improve solution quality? What structured artifacts and cognitive practices enable this separation?

## Method

Synthesis of three primary sources:
- "Design in Practice" lecture by Rich Hickey
- "Design in Practice in Practice" lecture by Alex Miller
- "Hammock Driven Development" lecture by Rich Hickey

Analysis focused on extracting: (1) the cognitive model, (2) the procedural framework, and (3) the artifact specifications.

## Results

### Key Findings

1. **Design is knowledge acquisition, not artifact production.** The cost of error correction grows exponentially from design (near-zero) to production (catastrophic). Thinking is the cheapest phase.

2. **The six-phase framework provides structured progression:**
   - **Describe**: Capture symptoms without imposing solutions
   - **Diagnose**: Identify root cause via hypothesis testing and logical exclusion
   - **Delimit**: Define explicit scope boundaries and non-goals
   - **Direction**: Select strategic approach via Decision Matrix
   - **Design**: Create detailed implementation blueprint
   - **Develop**: Execute the plan (should feel mechanical)

3. **Hammock Driven Development enables deep problem-solving:**
   - Load the cache: Intensive engagement until "brain full"
   - Disconnect: Sleep/walk to let background mind process
   - Capture synthesis: Write down insights immediately for verification

4. **Key artifacts enforce rigor:**
   - **Problem Statement**: Root cause in neutral language, no solutions
   - **Decision Matrix**: Columns=approaches (status quo first), Rows=criteria, Text=facts, Color=judgment
   - **Implementation Plan**: Detailed enough that coding feels like formality

5. **Incremental vs. Iterative distinction:**
   - Iterative = "do-over" (Code → Fail → Learn → Recode)
   - Incremental = monotonic value (Understand → Design → Code → Value)

## Analysis

The methodology directly applies to AI-assisted development:

**For prompting AI assistants:**
- Describe before asking for solutions
- Require diagnosis of root cause before implementation
- Explicitly state scope boundaries and non-goals
- Request multiple approaches for comparison (Decision Matrix thinking)
- Sleep on AI-generated solutions before committing

**For AI-generated code:**
- The "cheap thinking" phase is now even cheaper with AI exploration
- But the "do-over tax" remains expensive in production systems
- AI can accelerate the Describe/Diagnose phases through rapid exploration
- Human judgment remains critical in Delimit/Direction phases

**The "obvious solution" heuristic:**
> "The solution should feel obvious once you've written the right problem statement."

This applies directly to prompts: if you're struggling to get good output, the problem statement in your prompt is likely incomplete.

## Practical Applications

- **Before coding tasks**: Write explicit problem statements in prompts, not solution requests
- **For complex changes**: Use Decision Matrix structure to evaluate approaches before implementing
- **For AI workflows**: Build in "hammock time" between AI suggestion and commit
- **For prompt design**: Separate Describe/Diagnose prompts from Design/Develop prompts
- **For review**: Check if implementation matches the diagnosed problem, not just the requested feature

## Limitations

- Methodology assumes problems can be fully understood upfront (not always true in exploratory domains)
- "Hammock time" conflicts with real-time collaboration expectations
- Decision Matrix overhead may not justify itself for small changes
- Cultural resistance in "velocity-optimized" organizations

## Related Prompts

- [prompt-workflow-deliberate-commits.md] - Applies "think before acting" principle
- [prompt-system-optionality.md] - Related strategic decision-making

## References

- "Design in Practice" by Rich Hickey: https://www.youtube.com/watch?v=c5QF2HjHLSE
- "Design in Practice in Practice" by Alex Miller: https://www.youtube.com/watch?v=VBnGhQOyTM4
- Hammock Driven Development transcript: https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/HammockDrivenDev.md
- Design in Practice transcript: https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/DesignInPractice.md

## Future Research

- How to integrate Decision Matrix thinking into AI chat workflows
- Optimal "hammock time" intervals for AI-assisted development
- Prompt patterns that enforce the six-phase structure
- Measuring the "do-over tax" in AI-generated vs. human-generated code

## Version History

- 1.0.0 (2026-01-18): Initial synthesis from source document
