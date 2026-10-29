# Native Whisper integration and recurring continuation workflows

2026-10-29. Installed turu 0.11.0 help exposes append --topic/--stdin/--supersedes
and recall --topic/--budget/--digest/--no-usage. Local whisper/src/recall.rs
confirms whole-entry byte budgets, per-store newest-first sorting, and composition
of checkout, private and machine-local stores. Native entries participate in
ordinary scope recall; a separate resume directory does not participate in those
file readers. Replaced proposed sidecar writes with native topic-scoped entries.

Verification: isolated temporary git repository, turu init, append branch with
resume-test topic, recall same topic with 8000-byte budget; next action and critical
no-push constraint retained. Distilled/manifest validation, generated catalog,
ah structural check and diff whitespace check pass. No historical savings claim.

Exploratory October session scan: Pi filename month filter and Codex October path;
extract user messages only, deduplicate exact text, exclude texts over 4000 chars.
3229 distinct short user texts. Nonexclusive keyword hits: implementation/fix 590,
commit/push 394, context/clear/compact/handoff 382, review/ro5 278, research 143,
renew invocation 87, next invocation 54, close 14. These are keyword counts, not
unique workflows, frequencies of intent, or evidence of skill efficacy. Generic
words such as clear produce false positives; wrappers collapse repeated invocations.
No private message excerpts retained.

Candidate applications: review→fix (finding IDs, unresolved findings, validation);
implementation→validation (red/green phase, failing command, dirty work ownership);
research→decision (supported conclusions, unknowns, exact evidence references);
commit→push (local commit IDs, checks and explicit pending authorization);
context switch/worktree handoff (workspace/task identity and exact next action).
Next is appropriate when pausing with unfinished continuation state. Renew is
appropriate when reopening that task; neither replaces Beads, durable repo-level
knowledge, project planning, or full close/release workflows. Do not duplicate
normal Whisper auto-capture or blindly run recall all in addition to renewal.

Remaining: deduplicated behavioral replay and measured token savings tracked in
incitaciones-2w4. Native topic/format compatibility, older CLI and manual fallback
need behavioral cases before claiming robust end-to-end continuation.

