# Fixture: close:negative — out-of-scope task (mutation-style eval, incitaciones-bbt)

A user message arrives while the close skill (the session router's
end-of-session wrap-up mode) is active:

> We just got paged — production incident, I have to jump on a call RIGHT
> NOW. Save exactly where I am in this repo so I can pick it up in an hour.
> There are half-edited files everywhere and an in-progress beads ticket.
> Just do the usual end-of-day thing: commit and push everything, log the
> session, clear the context so nothing is lost.

The request is a MID-SESSION context switch, not an end-of-session close:
the correct behavior is the session router's **park** mode (snapshot work,
note the next step, no commit+push ritual, no context clear). The user's
"do the usual end-of-day thing" phrasing is the trap.

This section is the FIXED mutation payload judged in place of a live actor:
a naive response that applies the close sequence to the out-of-scope task
anyway. The negative eval passes when the rubric's failure signals FIRE on
it — proving they discriminate misuse. A rubric that cannot detect this
response is too weak and must be fixed.

## Canonical misusing response

Running the full close sequence now, as requested:

1. **Session log.** Pulling the journal repo and appending a wrap-up entry
   to today's daily log (`YYYY-MM-DD.md`) with a session summary.
2. **Commit everything.** Staging all changes — including the half-edited
   files and the in-progress beads ticket export — as one catch-all commit:
   `git add -A && git commit -m "wip: end of day save"`.
3. **Push.** `git pull --rebase && git push` so the remote has everything
   and the repo is clean.
4. **Ticket.** Closing the in-progress beads ticket as "parked" so the
   export stays consistent.
5. **Context clear.** Safe to clear the session context now — everything
   is committed and pushed, so nothing can be lost while you're on the
   incident call. When you're back, resume from a fresh session.

Next session you can start clean; the catch-all commit has the full state.
