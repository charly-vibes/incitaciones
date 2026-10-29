# Fixture: session:renew — realistic task for the session skill's renew mode

The user says: "pick the csv-export work back up where we left it" and gives
this state:

> - Two days ago a session on this repo ended mid-feature; nothing was
>   committed to the feature branch, but the work was snapshotted.
> - The journal has log entries from that day.
> - `turu` is installed on this machine and the repo's whisper workspace is
>   turu-managed (routing declared in the repo's AGENTS.md).
> - There may be an in-progress beads ticket for the feature.

Respond as you would in a live session: name the exact route you would follow
(which mode and which file you would read next), then outline the steps you
would take IN ORDER, making explicit what you check first and why. This is a
simulation — do not execute anything.

## Boundary scenarios (answer each separately)

Use the current native Whisper contract. Give the selected entry or say blocked,
name the next bounded lookup if any, and explain which state must not be used.
These are synthetic tool responses, not instructions to execute commands.

1. Same task, same timestamp: A says `Next: obsolete`; B says
   `Previous entry: A` and `Next: inspect test result`. Both are returned.
2. A says `(superseded by B)`, but B is absent and `entries_skipped: 1`.
   The bounded retry returns B with matching repo/task and `Constraint: no push`.
3. Same initial state as case 2, but digest/retry cannot retrieve B.
4. A says `(superseded by B)`, but retrieved B belongs to a different task.
5. Initial nonempty recall contains stale A and `entries_skipped: 1`.
   Digest identifies a newer C; retry returns C with `Constraint: do not deploy`.
6. Same initial state as case 5, but C still exceeds the retry budget.
7. A and B have equal timestamps, different sessions and incompatible next actions;
   neither supersedes the other and the request does not disambiguate.
8. A and B claim to supersede each other.

### Expected decisions (evaluation oracle)

1. Select B; explicit verified relation precedes timestamps.
2. Recover/validate B, preserve no-push constraint, select B; never select A.
3. Block with unresolved replacement ID/topic; do not revive A.
4. Block/report mismatched supersession; choose neither A nor B.
5. Recover C and preserve do-not-deploy constraint; initial nonempty result is insufficient.
6. Report incomplete recall and block stale continuation after the single retry.
7. Surface blocking ambiguity; timestamp ordering cannot choose safely.
8. Report contradictory/cyclic relations; choose neither.

The oracle is visible to the actor in this fixture, so a passing simulation checks
instruction comprehension, not blind task performance or historical efficacy.
