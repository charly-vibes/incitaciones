## Pass 5: Executability and Handoff

Focus on:
- Can another developer or agent pick this up immediately?
- Are verification steps concrete and end-to-end?
- Is there a machine-checkable Must gate (quantified, unit + number) backed by a runnable Meter command?
- Are priorities and labels sensible?
- Are HITL handoff points explicit?
- Is it clear what demo, test, or observable behavior proves completion?

Watch for:
- Hidden conversational context
- "You know what to do"
- Missing verification commands or test references
- Qualitative acceptance criteria with no unit or threshold ("fast", "robust", "clean") — a Scale/Meter is missing
- A Meter command that cannot run at the ticket's `base_commit` (stale claim) or that no fresh agent could execute verbatim
- Missing anti-goals on tickets touching tests, lockfiles, or public interfaces (reward-hacking surface: nothing stops gaming the gate)
- No regression suite named (pass-to-pass coverage unspecified)
- HITL work masquerading as AFK
- Tickets that cannot be closed without information from another issue not listed as a blocker

Prefix findings with `EXEC-`.
