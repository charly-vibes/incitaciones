# Native handoff replay: first boundary results

2026-10-29, turu 0.11.0. Isolated temporary git repositories with example.invalid
remote; no production notes mutated. Task-topic isolation passed: recall resume-a
included its next action/constraint and excluded resume-b's unrelated action.

Supersession failed the expected exclusion oracle: ordinary recall returned both
old and new multiline entries after append --supersedes old-ID. Returned old text
contained '(superseded by <new-ID>)'; new text contained '(supersedes <old-ID>)'.
Same-second entry timestamps tied. Thus selecting by timestamp alone does not
resolve supersession. Follow-up incitaciones-9ui; do not claim native suppression
works for this handoff shape. Initial fixture had no commit and resolved branch
as none; repeat with a committed branch before generalizing.

Whole-entry budget boundary confirmed: a >9000-character handoff recalled with
4000-byte budget omitted its trailing constraint. Digest exposed the topic but
not the full constraint. This supports explicit empty/omitted-entry handling and
budget escalation; topic presence in envelope alone does not prove body delivery.

Commit 5458d3a contains the paired skill update; all commit hooks passed with
TMPDIR=/tmp and XDG_RUNTIME_DIR=/tmp. No historical token savings measured yet.
Replay work remains in progress under incitaciones-2w4. Next: committed-branch
multiline/single-line supersession fixtures, then persistent case harness and
usage accounting against deduplicated historical invocation windows.

