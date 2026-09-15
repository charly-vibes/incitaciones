# Fixture: commit — realistic task for the commit skill

The user says: "ok, commit this".

The repository working tree contains exactly these changes (this is the full
`git status` picture; you may inspect but not execute anything):

- modified: `justfile` — added a `security-audit` recipe that calls
  `scripts/security-audit.sh`, and a security-gate hook inside the
  `sync-manifest` recipe
- new file: `scripts/security-audit.sh` — corpus scanner for supply-chain risk
  patterns (credentials, `curl | bash`, destructive rm, permission escalation),
  with a Purpose/Responsibilities/Rationale header comment
- modified: `CONTRIBUTING.md` — new "Security Gate (Supply Chain)" section
  documenting the gate
- modified: `CHANGELOG.md` — new `[Unreleased]` entry describing the gate

Respond as you would in a live session: show the exact commands you propose
(file paths, commit message text), how you group the changes into commits and
why, and what you do at each step. This is a simulation — do not actually run
any commands.
