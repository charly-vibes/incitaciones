# Universal Rule of 5 Review

Review any intellectual artifact (code, plans, research, issues, specs, documentation) using Steve Yegge's 5-stage iterative editorial refinement process until convergence.

## Core Philosophy
"Breadth-first exploration, then editorial passes." Don't aim for perfection in early stages. Each stage builds on insights from previous stages.

## Procedure
1.  **Stage 1: DRAFT** - Evaluate overall shape and sound approach. Focus on architecture, organization, and scope.
2.  **Stage 2: CORRECTNESS** - Identify errors, bugs, or logical flaws. Check for convergence.
3.  **Stage 3: CLARITY** - Ensure comprehensibility for the intended audience. Check for convergence.
4.  **Stage 4: EDGE CASES** - Handle boundary conditions and unusual scenarios. Check for convergence.
5.  **Stage 5: EXCELLENCE** - Final polish for production quality and pride.
6.  **Final Report** - Synthesize findings and provide a final verdict.

## Rules
- **Progressive Build:** Each stage must build on previous findings.
- **Specificity:** Reference exact locations (file:line, section, paragraph).
- **Actionability:** Suggest specific solutions, don't just identify problems.
- **Validation:** Confirm issues exist; do not flag "potential" issues without evidence.
- **Early Stop:** Stop if convergence criteria are met before Stage 5.

## References
- **Templates:** Use `references/templates.md` for the exact output format of each stage and the final report.
- **Criteria:** Refer to `references/criteria.md` for convergence and escalation rules.
- **Examples:** (Optional) See `references/examples.md` for domain-specific review examples.
