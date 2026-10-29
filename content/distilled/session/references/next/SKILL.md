**Tools:** Read, Write, Bash

# Next

Save minimum sufficient continuation state from the conversation. No research,
commits, pushes, ticket mutations, journal updates, or context clearing.

1. Keep commands anchored to the original workspace. Resolve routing with
   `turu resolve branch --json`; honor explicit routing/privacy rules. Default
   branch writes stay repo-local. Add `--global` or `--private` only when routing
   requires it; never promote private content into a broader store.
2. Identify the task topic from the conversation. If needed, discover existing
   topics with `turu recall branch --digest --budget 4000 --no-usage --json`.
   Do not load unrelated history. Gather cheap timestamp/repo/branch/HEAD facts.
3. Compose the version-1 entry below from known conversation state. Save with
   `turu append branch --topic <topic> --stdin --json`, passing the exact entry
   through stdin. Use `--supersedes <id>` only under the contract's ownership rule.
   No manual entry IDs, path derivation, or sidecar mutations.
4. Check the append result. Report scope, topic and returned entry ID/path when
   available. Never claim success after a failed write. Say `/renew` can resume it.

Do not ask routine questions. Preserve older notes and unrelated entries.

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
