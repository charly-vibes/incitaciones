---
name: session
description: "Session lifecycle: end-of-session wrap-up and commit (close), quick stash (next), park before context switch, renew to resume prior work, create or resume handoff documents. Trigger for closing, wrapping up, parking, resuming, or handoffs."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.9.0"
---
# Session Lifecycle Router

Route a session-lifecycle task to the right mode, then read that mode's instructions before acting. Do not improvise a lifecycle ritual from memory — each mode encodes a specific, tested procedure.

## Modes

| Task signal | Mode | Read |
|---|---|---|
| "wrap up", "close session", end-of-session summary + commit + push + context clear | close | `references/close/SKILL.md` |
| switch context now, will return later; stash work + release claims | park | `references/park/SKILL.md` |
| fast snapshot, no ceremony; resume later via `/renew` | next | `references/next/SKILL.md` |
| resume work on a project/area; load journal, whisper, beads context; claim work | renew | `references/renew/SKILL.md` |
| generate a context/handoff document for session continuity | create-handoff | `references/create-handoff/SKILL.md` |
| continue from a previous session's handoff document | resume-handoff | `references/resume-handoff/SKILL.md` |

## Selection rules

- Full ceremony with journal routing and push → **close**. Quick stash without ceremony → **next**. Context switch mid-session → **park**.
- The user asks *how to continue later* → **create-handoff**; the user asks *to continue* from an existing handoff → **resume-handoff**.
- "renew" always means resuming; "close" always means ending. When unsure whether the user wants to stop or stash, ask one clarifying question.

## Procedure

1. Identify the mode from the table above.
2. Read the referenced file (resolve paths against this skill's directory).
3. Follow that file's instructions exactly — they handle non-interactive shell quirks, `$JOURNAL_PATH` resolution, and beads/git state.
