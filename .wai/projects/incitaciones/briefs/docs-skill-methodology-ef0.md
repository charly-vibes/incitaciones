# Subagent brief: incitaciones-ef0 — docs skill: cross-surface drift audit (single-source facts)

**Repo:** `/var/home/sasha/para/areas/dev/gh/charly/incitaciones` · **Branch:** `docs/av4-worked-examples` (already checked out) · **Base:** 85d1bcf

## Why
Delegation keeps the lead session's context free for orchestration and verification. Self-contained content authoring with machine-checkable gates (`just validate-distilled`, `just sync-manifest`); complexity:s — the smallest ticket in the epic.

## Desired outcome
The `review-documentation` skill catches the failure class that made the *same* fix land 3× in the 2026-10 evidence (lf4b.1 explain-topic drift across README/index/installation; d8f97ce pack-count/kind-set drift; fd2fbe0 missing pack in user-facing counts): facts duplicated across surfaces with no source of truth and no consistency check. Evidence: `.wai/resources/reflections/docs-skill-survey-2026-10.org` row 17; beads `incitaciones-ef0`.

## Exact files (source of truth — NOT the installed `.agents/` copies)
- NEW: `content/distilled/documentation/references/review-documentation/references/drift-audit.md` — the methodology
- `content/distilled/documentation/references/review-documentation/SKILL.md` — add **Pass 6: Cross-Surface Consistency** (see shape below)

## Content to write (from the ticket)
1. **Drift audit** — enumerate facts repeated across surfaces (pack/module counts, command names, install steps, links, version claims); verify all copies agree; flag copies that should be **generated/stamped instead of hand-written**. Cross-reference the stamping methodology: `../implement-documentation/references/docs-accuracy.md` (2u2's) — link it, do NOT duplicate its content.
2. **Topic-alignment check** — README, docs index, and installation page must tell one consistent story (same audience, same promise, same next step), not drift into different framings.

## Shape constraints
- SKILL.md currently says "Perform 5 iterative passes." Introduce Pass 6 minimally: reword the intro to make Pass 6 the surface-consistency pass that applies **when the subject spans multiple surfaces** (README/docs index/installation); keep passes 1–5 and their convergence mechanics untouched.
- Pass 6 header block mirrors Passes 1–5: `### Pass 6: Cross-Surface Consistency`, a Goal line, Checks (the two bullets above), issue prefix `[DRIFT-001]`, and a pointer to `references/drift-audit.md` for the methodology (link, don't copy).
- `drift-audit.md` matches the voice of `docs-accuracy.md` / `worked-examples.md`: numbered sections, evidence-mined, instructional prose, concrete rules.

## Red/green/refactor sequence
1. **Red:** `grep -qi 'cross-surface' content/distilled/documentation/references/review-documentation/SKILL.md` → must fail (exit 1) before you start.
2. **Green:** one atomic commit until all acceptance criteria pass.
3. **Refactor:** separate commit only if a consistency pass is needed.

## Completion criteria (runnable; exit 0 = done)
- `just validate-distilled` → exit 0
- `just sync-manifest` → exit 0
- `test -f content/distilled/documentation/references/review-documentation/references/drift-audit.md` → exit 0
- `grep -qi 'cross-surface' content/distilled/documentation/references/review-documentation/SKILL.md` → exit 0
- `grep -qi 'DRIFT-001' content/distilled/documentation/references/review-documentation/SKILL.md` → exit 0
- `grep -qi 'docs-accuracy' content/distilled/documentation/references/review-documentation/references/drift-audit.md` → exit 0 (coordination cross-reference present)
- `git status --porcelain` shows only intended files (no `.agents/`, `skills/`, `pi-package/` edits, no `.beads` staging)

## Out of scope
- Passes 1–5 wording, convergence mechanics, Final Report structure (beyond optionally mentioning DRIFT findings)
- implement-documentation files (2u2's territory — cross-reference only)
- research mode; visual/ecosystem (iio); cold-reader pass (x3n)
- Generated outputs: `.agents/`, `skills/`, `pi-package/`; `.wai/` pipeline state (orchestrator-owned)

## Commit rules
- Atomic commits; never `git add -A`; stage exact paths; never stage `.beads/`.
- Pre-commit hooks are fixed on this branch — commit normally, no `--no-verify`.

## Spawn model
Spawn `pi` non-interactively with this brief; named session `subagent:incitaciones-ef0:impl`; stream to `.wai/projects/incitaciones/logs/ef0-impl.log`; wall-clock budget ≤ 15 min via `timeout`. Context ceiling: ≤ 25% of the spawned model's window (brief ~700 tokens; repo conventions ~10k).

## Follow-up threshold
If the content needs a design decision not covered here (e.g. restructuring the 5-pass flow rather than adding Pass 6), STOP after ≤ 2 attempts and file a follow-up ticket instead of improvising.

## Verifier evidence contract (wai-px4g)
The verify session's review artifact must cite the artifacts it read (paths) and include fresh command output (the actual completion-criteria commands + results, pasted) before recording CONFIRM — otherwise REVIEW_REQUIRED.
