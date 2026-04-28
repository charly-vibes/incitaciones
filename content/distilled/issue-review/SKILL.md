# Tracer-Bullet Issue Review (Rule of 5)

Review an issue set in five passes, with special attention to whether tickets are true tracer-bullet vertical slices.

## Setup

Read `references/setup.md` for tracker-specific collection commands before reviewing.

## Procedure

1. Gather the issue set to review plus the source plan/spec/parent issue when available.
2. Run the passes in order:
   - Pass 1: `references/pass-1-clarity.md`
   - Pass 2: `references/pass-2-scope.md`
   - Pass 3: `references/pass-3-dependencies.md`
   - Pass 4: `references/pass-4-alignment.md`
   - Pass 5: `references/pass-5-executability.md`
3. After each pass starting with pass 2, evaluate convergence using `references/convergence.md`.
4. If converged, stop.
5. Produce the final report using `references/final-report.md`.

## Review Lens

Treat the best issue sets as:
- thin vertical slices rather than layer tickets
- independently verifiable or demoable
- minimal but sufficient dependency graphs
- explicit about AFK vs HITL work
- traceable back to stories, plans, or specs

## Rules

- Reference issue IDs precisely.
- Verify issue content before flagging a problem.
- Prioritize blockers over cosmetic cleanup.
- Suggest exact tracker edits or commands when practical.
- Call out horizontal decomposition explicitly: backend-only, schema-only, UI-only, or refactor-only tickets that should be folded into a tracer bullet.
