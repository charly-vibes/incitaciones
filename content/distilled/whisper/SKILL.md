---
name: whisper
description: "Manage the ~/.whisper/ knowledge workspace: init, check, status, link plan to beads, decommission, and knowledge routing. Trigger when the user says '/whisper', '/w', 'init workspace', 'check workspace', 'workspace status', 'link plan', or 'decommission worktree'."
tools: Read, Write, Edit, Bash
---

# Whisper — Accumulated Operational Knowledge

Manage `~/.whisper/` — a global, tiered knowledge directory that accumulates operational knowledge and planning context across all your work. Works with or without beads issue tracking.

## Directory Layout

```
~/.whisper/
  rules.md                          ← Global agent behavior rules (bd remember equiv)

  repos/
    github.com/user/repo/
      env.md                        ← Repo-wide: deploy commands, infra facts, auth quirks
      branches/
        branch-slug/                ← One slot per branch (/ in name → -- in slug)
          context.md                ← Branch anchor: repo, branch, beads epic ID, status
          plan.md                   ← Narrative implementation plan
          notes.md                  ← Free-form scratch and findings
          agents/                   ← Optional sub-agent files when work is split across agents
      worktrees/
        worktree-name/              ← One slot per worktree (basename of worktree path)
          env.md                    ← Worktree-specific: ports, venvs, credentials, local-only setup
```

**Branch slug rule:** `git rev-parse --abbrev-ref HEAD | sed 's|/|--|g'`

**Worktree slot rule:** `basename $(git rev-parse --git-common-dir 2>/dev/null)` (the `.git` worktree dir name), or `basename $(pwd)` when not in a worktree.

## Knowledge Routing

When a session learns something worth keeping, route it by scope:

| Scope | Test | Destination |
|---|---|---|
| **Global** | True for every repo and every project | `~/.whisper/rules.md` — append, don't overwrite |
| **Repo-wide infra** | True regardless of which branch or feature you're on (deploy behavior, gateway/timeout limits, log retention, auth quirks) | `~/.whisper/repos/<host>/<repo>/env.md` — create or extend |
| **Branch-specific** | Only matters for the work on *this* epic/branch | `~/.whisper/repos/<host>/<repo>/branches/<slug>/notes.md`, or `bd note <epic-id>` if beads is available |
| **Worktree setup** | Credentials, service IDs, ports, venv/docker specifics for *this checkout* | `~/.whisper/repos/<host>/<repo>/worktrees/<name>/env.md` |
| **Universal agent rule** | A standing instruction for how the agent should behave, independent of any branch or repo | `bd remember` if available, else `~/.whisper/rules.md` |

**Rules:**
- **No secrets anywhere.** Never write tokens, keys, passwords, or PII into `~/.whisper/`.
- **Extend, don't duplicate.** Append to or correct an existing note rather than creating a new one that says the same thing.
- **Search first.** Before creating a new entry, check if one already exists for the same topic.
- If `bd` is not available, everything falls back to `~/.whisper/` files — there's no beads-backed alternative.

## Modes

Determine mode from how the skill is triggered:

| Trigger | Mode |
|---|---|
| `/w init` or `~/.whisper/` does not exist | **init** |
| `/w` or `/w status` | **status** |
| `/w check` or called by `renew` | **check** |
| `/w link [<path>]` or "link plan" | **link** |
| `/w decommission` | **decommission** |

See each reference file for the full procedure:

- `references/init.md`
- `references/check.md`
- `references/status.md`
- `references/link.md`
- `references/decommission.md`

## Rules

- Never run `git worktree remove` automatically — always print the command for the user to execute.
- Never close beads issues during decommission — only defer. Closing is intentional.
- **One epic per branch, children via `--parent`, not flat siblings.**
- **`env.md` is shared and immutable across branch switches.** Never overwrite it during init or check — only create if absent.
- **Branch slug sanitization is mandatory.** Always run `sed 's|/|--|g'` on the branch name before using it as a directory path.
- **Worktree reuse across branches is normal, not an edge case.** Expect multiple slots to accumulate in `branches/` over time.
- **Legacy layout is still the common case.** Most worktrees never needed multiple branch slots — only migrate when a mismatch is detected.
- This skill is self-contained. Do not rely on `create-plan`, `park`, or `create-handoff` having `~/.whisper/` awareness.
- If `bd` is not initialized in the repo, skip beads steps gracefully and note what was skipped.