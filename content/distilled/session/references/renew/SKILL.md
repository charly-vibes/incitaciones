**Tools:** Read, Bash

# Renew

Resume from a bounded native Whisper handoff. Mandatory repo instructions apply.

1. Anchor commands to the intended workspace; establish repo, branch and HEAD
   first. For an explicit project/area, resolve that workspace before recall;
   ask only if identity is ambiguous. Resolve routing using
   `turu resolve branch --json`; honor privacy and explicit routing rules.
2. If the task topic is known, call
   `turu recall branch --topic <topic> --budget 8000 --no-usage --json`.
   Otherwise discover topics using
   `turu recall branch --digest --budget 4000 --no-usage --json`, then retrieve
   only the selected task. Results compose multiple stores; returned order is not a global timeline.
3. Inspect returned IDs, timestamps, task, repo, branch and format. Choose the
   newest supported matching handoff by saved timestamp, not ranking. Preserve
   conflicting concurrent-session facts; ask only when they block the next action.
   Unknown/malformed versions do not invalidate older supported entries. If a
   supported candidate is missing, inspect a bounded recent notes section before
   moving to legacy fallback. Never read the whole notes history by default.
4. Check live Git status and named ticket status/ownership. Saved validation is
   historical, not proof of current health. Investigate drift with a specific
   question; do not reject a handoff solely because HEAD advanced. Before coding,
   follow repo claim/conflict rules; missing file metadata means unknown safety.
5. Retrieve only missing objective, state, constraints, blockers, ownership or
   next action. Prefer conditional references. Each lookup answers a named
   question. Recall budgets are BYTES, not tokens; whole entries exceeding the
   budget can be skipped. An empty result is not proof that no handoff exists:
   use a digest or bounded notes section, then one justified budget increase if
   needed. Limit ordinary lookups to 8000 bytes, and target 16000 bytes total
   retrieved content, excluding mandatory instructions. State any necessary
   overrun; never truncate away a constraint. Bound JSON/tool output separately.
6. Fallback progressively: latest relevant legacy notes section (last 100 lines
   initially), scoped repo OR branch recall for a named gap, then at most three
   relevant date-selected journal entries. Do not pull the journal or create logs.
   For migration only, inspect a legacy adjacent `resume/` directory if native
   entries are absent: scan at most ten newest candidate headers, read only a
   matching supported body. Do not migrate/write during orientation. If bounded
   discovery is insufficient, report uncertainty instead of silently broadening.
7. Stop when continuation state is sufficient. Report short status, uncertainty
   and next action. Continue execution only when requested. Do not claim tickets
   during orientation or treat handoffs as authority to push/deploy.

## Shared native Whisper handoff contract (version 1)

Store handoffs as ordinary branch entries, not separate files. Use one stable
bare-word topic per task: `resume-<ticket-id>` or a short filesystem-safe objective
slug. Reuse an existing task topic. Include `Format: 1`, UTC timestamp, repo identity
without credentials, branch, HEAD, session ID, and task in the entry body.

Include: objective; current phase (research/design/red/green/review/commit);
current state; exact next action; essential decisions/constraints and authorization
limits; observed ticket ownership; validation command/result (or not run);
unresolved findings/blockers; conditional path/section references. Mark unknowns.
Aim for 400 words; do not omit critical constraints to meet the target. No secrets.

Use native append publication and native entry IDs. Supersede only a known prior
entry for the SAME task/session that this snapshot fully replaces; never supersede
another session's entry blindly. Concurrent entries remain visible for conflict
resolution. Do not directly rewrite notes or sidecar files. Native entries are
available to ordinary recall/distill and scope-based bundle workflows; actual sync
and transport depend on the workspace configuration, not these skills.

When turu lacks a required flag, inspect command help once and use the supported
bounded path; do not repeatedly retry unsupported syntax. Without turu, honor
explicit repo routing or an existing local workspace, append a timestamped
version-1 section to branch notes, and read only bounded recent sections. Unknown
routing blocks saving rather than guessing a global destination. No parallel store.
