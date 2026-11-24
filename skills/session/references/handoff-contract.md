# Shared native Whisper handoff contract (version 1)

Store handoffs as ordinary branch entries, not separate files. Use one stable
bare-word topic per task: `resume-<ticket-id>` or a short filesystem-safe
objective slug. Reuse an existing task topic. Include `Format: 1`, UTC
timestamp, repo identity without credentials, branch, HEAD, session ID, and
task in the entry body.

Include: objective; current phase (research/design/red/green/review/commit);
current state; exact next action; essential decisions/constraints and
authorization limits; observed ticket ownership; validation command/result
(or not run); unresolved findings/blockers; conditional path/section
references. Mark unknowns. Aim for 400 words; do not omit critical
constraints to meet the target. No secrets.

**Ticket-scoped handoffs are bd-primary.** When the work maps to a bd ticket,
mirror the state into the ticket itself (`bd note <id> "Parked <time>. Done:
… . Safe to resume from: <commit>."`) before writing the turu entry. bd is
the primary continuation source — `bd ready`/`bd show` recover it — and the
turu entry carries only what does not belong in a ticket (cross-ticket
session context, authorization limits).

Use native append publication and native entry IDs. Supersede only a known
prior entry for the SAME task/session that this snapshot fully replaces;
never supersede another session's entry blindly. Include
`Previous entry: <id or none>` in the new body when replacing a known entry,
so the relation survives multiline parsing. Do not assume native recall
hides superseded entries. Concurrent entries remain visible for conflict
resolution. Do not directly rewrite notes or sidecar files. Native entries
are available to ordinary recall/distill and scope-based bundle workflows;
actual sync and transport depend on the workspace configuration, not these
skills.

When turu lacks a required flag, inspect command help once and use the
supported bounded path; do not repeatedly retry unsupported syntax. Without
turu, honor explicit repo routing or an existing local workspace, append a
timestamped version-1 section to branch notes, and read only bounded recent
sections. Unknown routing blocks saving rather than guessing a global
destination. No parallel store.
