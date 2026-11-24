**Tools:** Read, Write, Bash

# Next

Save minimum sufficient continuation state from the conversation.
**Scope boundary:** handoff entries only — no research, commits, pushes,
journal updates, or context clearing; bd claim/notes updates are in scope.
Mid-session context switch (formerly
/park): same procedure, no commit/push, no /clear; the human-readable
journal entry happens at close.

1. Keep commands anchored to the original workspace. Resolve routing with
   `turu resolve branch --json`; honor explicit routing/privacy rules. Default
   branch writes stay repo-local. Add `--global` or `--private` only when routing
   requires it; never promote private content into a broader store.
2. Identify the task topic from the conversation. If needed, discover existing
   topics with `turu recall branch --digest --budget 4000 --no-usage --json`.
   Do not load unrelated history. Gather cheap timestamp/repo/branch/HEAD facts.
3. Compose the version-1 entry per `../handoff-contract.md` from known
   conversation state. For ticket-scoped work, mirror the state into the bd
   ticket first (`bd note`, contract's bd-primary rule). Save the entry with
   `turu append branch --topic <topic> --stdin --json`, passing the exact entry
   through stdin. Use `--supersedes <id>` only under the contract's ownership rule.
   No manual entry IDs, path derivation, or sidecar mutations.
4. Resolve in-progress claims per the **Claims decision** section of
   `../handoff-contract.md` (the /park case).
5. Check the append result. Report scope, topic and returned entry ID/path when
   available. Never claim success after a failed write. Say `/renew` can resume it.

**DO-NOT-PROCEED** — append failed or unverifiable: never claim success.
Remediation: retry once with identical flags; if it fails again, report and stop.

Do not ask routine questions. Preserve older notes and unrelated entries.
Entry format, supersession ownership, and bd mirroring: read
`../handoff-contract.md` before composing.
