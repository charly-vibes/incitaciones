---
title: Whisper — Accumulated Operational Knowledge
type: workflow
source: original
tags: [workflow, knowledge, planning, beads]
status: draft
created: 2026-07-27
updated: 2026-09-01
version: 1.1.0
related: [references-whisper-workflow.md]
---

# Whisper — Accumulated Operational Knowledge

Manage `~/.whisper/` — a global, tiered knowledge directory that accumulates operational knowledge across all your work. Supports init, check, status, link plan to beads, decommission, and knowledge routing.

## When to Use

- When starting work on a new branch or worktree
- When resuming work on an existing project
- When you've learned something worth keeping
- When winding down a worktree or branch
- When repo directories under `~/.whisper/repos/` are duplicated under different keys (e.g. bare repo name, owner dir, ssh-alias host) — `/w consolidate` merges them into the canonical key derived from the origin remote

See `content/distilled/whisper/SKILL.md` for the full procedure. Canonical repo key: `host/owner/repo` derived from `git remote get-url origin` (colons → slashes, `.git` stripped); `local/<repo-name>` when no remote. One repo, one key.