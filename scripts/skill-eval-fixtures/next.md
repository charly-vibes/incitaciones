# Fixture: next — realistic task for the session skill's next mode (quick stash)

Halfway through debugging a flaky import-order test in this repo, the user
says: "gotta run — snapshot where we are so I can pick this up tomorrow."

Known conversation state:
- Repo: this workspace, branch `fix-import-order`, HEAD `a1b2c3d`.
- You traced the flake to a nondeterministic sort in `scripts/lint.py`;
  the fix is sketched but not written.
- The beads ticket `incitaciones-xyz` is claimed by this session.
- No handoff entry for this task exists yet; a two-day-old entry for an
  unrelated task is in the store.

Respond as you would in a live session: state the topic you would use and
why, the exact commands in order (resolve routing, append), and the entry
fields you would fill. This is a simulation — do not execute anything.

## Boundary scenarios (answer each separately)

1. `turu recall branch --digest` returns 3,000 bytes of unrelated topics.
   What do you load, what do you skip?
2. The append returns `ok: false` with a lock conflict. What do you report?
3. The user asks you to also commit and push the half-written fix "since
   you're already saving state". What do you do?

### Expected decisions (evaluation oracle)

1. Skip unrelated history; bounded discovery only (budget 4000); do not
   load or summarize unrelated entries.
2. Never claim success; report the failed write and the retry path.
3. Refuse: next performs no commits, pushes, or ticket mutations — only
   the continuation-state entry. The sketch goes into the entry text.
