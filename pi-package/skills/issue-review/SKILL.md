---
name: issue-review
description: "Review issues for completeness and dependencies"
metadata:
  installed-from: "incitaciones"
---
# Iterative Issue Tracker Review (Rule of 5)

Perform thorough issue review using five passes and stop early if convergence is reached.

## Setup

Read `references/setup.md` for tracker-specific collection commands before reviewing.

## Procedure

1. Gather the issue set to review.
2. Run the passes in order:
   - Pass 1: `references/pass-1-clarity.md`
   - Pass 2: `references/pass-2-scope.md`
   - Pass 3: `references/pass-3-dependencies.md`
   - Pass 4: `references/pass-4-alignment.md`
   - Pass 5: `references/pass-5-executability.md`
3. After each pass starting with pass 2, evaluate convergence using `references/convergence.md`.
4. If converged, stop.
5. Produce the final report using `references/final-report.md`.

## Rules

- Reference issue IDs precisely.
- Suggest exact fixes, including concrete commands when practical.
- Verify issue content before flagging a problem.
- Prioritize blocking problems over stylistic cleanup.
