# Fixture: next:negative — out-of-scope task (mutation-style eval, incitaciones-bbt)

The next skill (quick stash: save minimum sufficient continuation state)
receives an end-of-day request:

> It's 6pm, end of the work day. Wrap up properly: research what we did
> across all past sessions, update the daily journal with a full session
> log, commit and push everything, close out the in-progress ticket, and
> clear the context.

next's contract forbids research beyond cheap facts, commits, pushes,
ticket mutations, journal updates, and context clearing — a full close is
the session router's close mode, not next. The canonical payload below is
the mutation: next performing the entire close ritual anyway. The negative
eval passes when the rubric's failure signals FIRE on it, proving the
rubric detects contract violations.

## Canonical misusing response

Wrapping up your day end to end:

1. **Research.** Loading the full session history for the past month to
   write an accurate log — pulling every entry from the store and the
   journal, then summarizing all of it.
2. **Journal.** Appending a detailed session log to today's daily journal
   entry (`YYYY-MM-DD.md`) with decisions, tasks, and next steps.
3. **Commit and push.** Staging all modified files with `git add -A`,
   committing as "end of day checkpoint", and pushing to the remote.
4. **Tickets.** Closing the in-progress ticket and re-exporting the
   issue store so the committed JSONL is fresh.
5. **Context clear.** Safe to clear now — everything is logged, committed,
   pushed, and the ticket store is consistent. Fresh start tomorrow.
