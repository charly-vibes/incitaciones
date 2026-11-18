# Archived Skills

Retired pointer aliases preserved for archaeology. These compiled pointer
files were removed from every distribution surface (manifest, bundles,
`skills/` catalog, site, npm/pi package) but are kept here rather than
deleted.

| File | Was | Retired |
|------|-----|---------|
| `park.md` | `/skill:park` → session router, context-switch stash mode | 2026-11-18 |
| `create-handoff.md` | `/skill:create-handoff` → session router, handoff document mode | 2026-11-18 |

## Why

Both were zero-usage legacy aliases: park had 0 real typed invocations
all-time; create-handoff had 3 (none in the last 90 days), across all
session stores (pi/omp/codex). The live `session` router already covers both
intents ("park before context switch", "create or resume handoff documents").

This is the documented exception to the pointer-permanence doctrine
(incitaciones-06i): permanence remains the default for high-traffic pointers
(close, next, renew, create-issues, issue-review, rule-of-5-universal);
these two were retired by explicit human decision on zero-usage evidence.

Evidence and decision: beads `incitaciones-of8` (usage audit) and
`incitaciones-alo` (retirement execution).

The underlying modes remain available in the `session` router skill — only
the `/skill:<name>` pointer aliases retired.
