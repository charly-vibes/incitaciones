## Pass 2: Scope, Atomicity, and Tracer-Bullet Shape

Focus on:
- One logical capability per issue
- Thin vertical slices instead of horizontal layer tickets
- Issues small enough to finish in one focused session
- Clear boundaries with no overlap
- Independent demo or verification value

Watch for:
- Oversized epics disguised as issues
- Backend-only / schema-only / UI-only tickets that should be part of one slice
- Preparatory plumbing tickets with no standalone value
- Trivial issues that should be bundled into a slice
- Refactor + feature bundles with unclear boundaries

Questions to ask:
- If this issue lands alone, is anything real now possible or testable?
- Does it cut through the necessary layers for one outcome?
- Would splitting it by component create worse tickets?

Prefix findings with `SCOPE-`.

Session-size fit (falsifiable, not vibes):

- One session = one red→green→refactor cycle inside a single context budget
  (~150K tokens before compaction; the ceiling is token-primary — at measured p50
  rates that is ≈ 26 min of afk run time or ≈ 93 min interactive, so `estimate`
  ≤ 120 minutes is the scheduling hint, not the bound). PRE-005/PRE-006 enforce
  this mechanically against bd's `estimated_minutes`.
- A ticket that honestly needs two sessions is two tickets: the boundary must be a
  closed ticket + commit, never conversation memory (a fresh session recovers via
  `bd ready`, not a transcript).
- A ticket parked or resumed mid-cycle carries its continuation state in the bd
  ticket itself (`bd note`: done, safe resume point, blockers) — renew starts at
  `bd ready`/`bd show`, not at transcripts or sidecar handoff files.
