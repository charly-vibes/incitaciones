## Pass 5: Executability and Handoff

Focus on:
- Can another developer or agent pick this up immediately?
- Are verification steps concrete and end-to-end?
- Is there a machine-checkable Must gate (quantified, unit + number) backed by a runnable Meter command?
- Are touched code files self-describing — Purpose/Responsibilities/Rationale header present and current (see `file-headers`)?
- Are priorities and labels sensible?
- Does every ticket carry lane and complexity metadata (`afk`/`design`/`hitl`/`review` + `complexity:s/m/l/xl`)?
- Are lane/complexity tags consistent with the work (DESIGN or HITL work never tagged `afk`)?
- Are AFK tickets backed by an objective gate (CI/test suite/Meter), or tagged `no-gate` and kept out of autonomous scheduling?
- Are HITL handoff points explicit?
- Is it clear what demo, test, or observable behavior proves completion?

Watch for:
- Hidden conversational context
- "You know what to do"
- Missing verification commands or test references
- Qualitative acceptance criteria with no unit or threshold ("fast", "robust", "clean") — a Scale/Meter is missing
- A Meter command that cannot run at the ticket's `base_commit` (stale claim) or that no fresh agent could execute verbatim
- Missing anti-goals on tickets touching tests, lockfiles, or public interfaces (reward-hacking surface: nothing stops gaming the gate)
- Tickets that create or reshape source files with no file-header acceptance criterion — undocumented files force every implementing agent to re-derive intent
- No regression suite named (pass-to-pass coverage unspecified)
- HITL work masquerading as AFK
- DESIGN work (semantics decisions, API shape, concurrency models) tagged or scheduled as AFK — semantics need an interactive session, not an overnight run
- Tickets tagged `complexity:xl` (epic-sized or semantics-heavy) presented as schedulable work instead of decomposition candidates
- AFK tickets with no objective gate and no `no-gate` tag
- Complexity grades that fail the falsifiable criteria — an S/M ticket touching a public API, an invariant, or concurrency code is mis-tagged and must be retagged L before scheduling
- Tickets that cannot be closed without information from another issue not listed as a blocker

Prefix findings with `EXEC-`.
