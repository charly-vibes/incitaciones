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
