---
title: Whisper Workflow — Operational Knowledge System
type: reference
source: original
tags: [workflow, whisper, reference]
status: draft
created: 2026-07-27
updated: 2026-07-27
version: 1.0.0
related: [prompt-workflow-whisper.md]
---

# Whisper Workflow — Accumulated Operational Knowledge

Whisper is a global, tiered knowledge directory (`~/.whisper/`) that accumulates operational knowledge across all your work. It replaces per-worktree `.LOCAL_PLANS/` with a persistent, path-tiered structure that survives worktree deletion and is shared across multiple checkouts of the same repo.

## Philosophy

- **Knowledge should persist** — what you learn in one session should be available in the next, regardless of which worktree or branch you're on.
- **Route by scope** — findings go where they're most useful: global rules, repo infra, branch notes, or worktree setup.
- **Lightweight by default** — planning is optional (only when you need it), but knowledge routing is always available.

## Directory Layout

```
~/.whisper/
  rules.md                              ← Global agent behavior rules
                                          (bd remember equivalent)

  repos/
    github.com/user/repo/
      env.md                            ← Repo-wide: deploy commands, infra
                                          facts, auth quirks, testing patterns

      branches/
        branch-slug/                    ← One slot per branch
          context.md                    ← Branch anchor: repo, branch,
                                          beads epic ID, status
          plan.md                       ← Implementation plan
          notes.md                      ← Free-form scratch, /next snapshots,
                                          accumulated findings
          agents/                       ← Sub-agent files (optional)

      worktrees/
        worktree-name/                  ← One slot per worktree checkout
          env.md                        ← Worktree-specific: ports, venvs,
                                          credentials, local-only setup
```

### Naming Rules

- **Branch slug:** `git rev-parse --abbrev-ref HEAD | sed 's|/|--|g'` — `/` in branch names become `--`
- **Worktree slot:** `basename $(git rev-parse --git-common-dir 2>/dev/null)` — strips the `.git` suffix

## Knowledge Routing

When a session reveals something worth keeping, route it by scope:

| Scope | Test | Destination |
|---|---|---|
| **Global** | True for every repo and every project | `~/.whisper/rules.md` |
| **Repo-wide** | True regardless of branch or feature (deploy, gateway limits, log retention, auth quirks) | `~/.whisper/repos/<host>/<repo>/env.md` |
| **Branch-specific** | Only matters for the current epic/branch | `~/.whisper/.../branches/<slug>/notes.md` or `bd note <epic-id>` |
| **Worktree setup** | Credentials, ports, venv specifics for *this checkout* only | `~/.whisper/.../worktrees/<name>/env.md` |
| **Universal agent rule** | Standing instruction independent of any repo | `bd remember` or `~/.whisper/rules.md` |

### Routing Rules

- **No secrets anywhere.** Never write tokens, keys, passwords, or PII into `~/.whisper/`.
- **Extend, don't duplicate.** Append to an existing note rather than creating a new one that says the same thing.
- **Search first.** Before creating a new entry, check if one already exists.
- If `bd` is not available, everything falls back to `~/.whisper/` files.

## Session Lifecycle

```
        ┌──────────────────────────────────────────────┐
        │                                              │
        ▼                                              │
    ┌──────┐    ┌──────┐    ┌──────┐    ┌────────┐    │
    │ init │───►│ work │───►│ next │───►│ close  │────┘
    └──────┘    └──────┘    └──────┘    └────────┘     ↑
        │          │            │                       │
        │          ▼            ▼                       │
        │      ┌──────┐    ┌──────┐                     │
        │      │ park │    │ snap │                     │
        │      └──────┘    └──────┘                     │
        │          │            │                       │
        │          ▼            ▼                       │
        │      ┌────────┐                               │
        └──────┤ renew  │◄──────────────────────────────┘
               └────────┘
```

### First Time

| Command | When | What it does |
|---------|------|-------------|
| `/w init` | Start of a new project/branch | Creates `~/.whisper/`, repo env, branch slot, optional beads epic |

### During Work

| Command | When | What it does |
|---------|------|-------------|
| `/next` | Quick context switch | Appends 2–5 bullet snapshot to branch `notes.md` — no ticket ops, no git |
| `/park` | Thorough context switch | Logs to journal, releases ticket claims, records to beads epic |
| `/close` | End of day | Logs to journal, routes durable knowledge to `~/.whisper/`, commits, clears |

### Resuming

| Command | When | What it does |
|---------|------|-------------|
| `/renew` | Start of a session | Pulls journal, loads context from journal + whisper + beads, offers claiming work |
| `/w status` | Check workspace state | Shows branch slot, plan status, epic tree, active branches |
| `/w check` | Validate before work | Detects stale slots, offers init if missing |

### Planning

| Command | When | What it does |
|---------|------|-------------|
| `/w link [path]` | After writing a plan | Creates beads issues from plan phases, wires metadata.files for conflict detection |

### Cleanup

| Command | When | What it does |
|---------|------|-------------|
| `/w decommission` | Winding down a worktree | Defers beads issues, records final note on epic, prints removal command |

## Configuration

The journal path is configured via environment variables:

```bash
export JOURNAL_PATH="$HOME/dev/status"                          # default
# For the JORNAL layout:
export JOURNAL_PATH="$HOME/para/areas/dev/gh/ak/journal"
export JOURNAL_LOG_SUBDIR="areas/log"
```

- `$JOURNAL_PATH` — base directory for the daily log journal (default: `~/dev/status`)
- `$JOURNAL_LOG_SUBDIR` — subdirectory within the journal for log files (default: `log`, set to `areas/log` for JORNAL layout)

## Migration from `.LOCAL_PLANS/`

If you have an existing `.LOCAL_PLANS/` directory:

1. Run `/w init` to create `~/.whisper/` with the new layout.
2. Copy `plan.md`, `notes.md`, and `context.md` from `.LOCAL_PLANS/branches/<slug>/` into the corresponding `~/.whisper/repos/.../branches/<slug>/` slot.
3. Copy any `.LOCAL_PLANS/env.md` content into `~/.whisper/repos/.../worktrees/<name>/env.md`.
4. The old `.LOCAL_PLANS/` can be removed once confirmed.

## Related Skills

- `whisper` — manages `~/.whisper/` (init, check, status, link, decommission)
- `next` — rapid session snapshot to `~/.whisper/`
- `park` — thorough mid-session context switch
- `close` — end-of-day wrap-up with knowledge routing
- `renew` — session resume with claiming work
- `create-issues` — creates beads issues with metadata.files (consumed by renew's conflict detection)