## Pass 3: Dependencies and Ordering

Focus on:
- Correct dependency links
- Missing prerequisites
- Circular dependencies
- Avoidable serialization
- Sensible critical path
- Whether the issue graph reflects tracer bullets rather than phase gates

Watch for:
- Hidden blockers
- Cycles
- Artificial bottlenecks from horizontal decomposition
- Missing rationale for dependencies
- Tickets blocked only because the work was split by layer instead of by outcome

Questions to ask:
- Could these issues run in parallel if they were sliced vertically?
- Is a dependency real, or an artifact of poor decomposition?
- Are HITL issues isolated so AFK work can continue around them?

Prefix findings with `DEP-`.
