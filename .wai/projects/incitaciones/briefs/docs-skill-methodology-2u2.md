# Subagent brief: incitaciones-2u2 — docs skill: docs-accuracy gate + stamped-artifact sync patterns

**Repo:** `/var/home/sasha/para/areas/dev/gh/charly/incitaciones` · **Branch:** `docs/av4-worked-examples` (already checked out) · **Base:** 4a61a7b

## Why
Delegation keeps the lead session's context free for orchestration and verification. This ticket is self-contained content authoring with machine-checkable gates (`just validate-distilled`, `just sync-manifest`), so it fits a bounded subagent run with no interactive decisions.

## Desired outcome
The `documentation` skill teaches the executable-docs methodology mined from the 2026-10 specodelic/ddl docs work (evidence: `.wai/resources/reflections/docs-skill-survey-2026-10.org` row `lf4b.10/.11` line 15; beads `incitaciones-2u2`), across BOTH the implement mode (how to build it) and the review mode (how to flag its absence).

## Exact files (source of truth — NOT the installed `.agents/` copies, which are gitignored generated output)
- NEW: `content/distilled/documentation/references/implement-documentation/references/docs-accuracy.md` — the full methodology
- `content/distilled/documentation/references/implement-documentation/SKILL.md` — add ONE procedure pointer (mirror how step 5 points at `references/worked-examples.md`)
- `content/distilled/documentation/references/review-documentation/SKILL.md` — extend Pass 4 with the new checks; **link, never copy** (the file's own Rules section mandates cross-referencing sibling references)

## Content to write (from the ticket + survey evidence)
1. **Docs-accuracy gate** — CI re-runs quickstart commands, captures real output, and diffs it against the documented snippets (specodelic `lf4b.10`). Document the **capture-normalize** technique: normalize tool chatter (cargo/gh verbosity, hashes, timestamps, absolute paths) before diffing (specodelic commit `a2108b8`); only normalized output is diffable.
2. **Stamped artifacts** — `llms.txt`, `llm.txt`, `release.md`, README version/count facts are *generated per release*, never hand-edited (specodelic `lf4b.11`). Include a freshness check: a lint step that regenerates (or re-derives) and fails on drift, so hand-edits are caught immediately.
3. **Live-site smoke** — CI curls the deployed docs URL (Pages/Netlify etc.) so a 404'd book fails immediately, not at next human visit (ddl precedent).

Voice & structure: match `worked-examples.md` (numbered sections, evidence-mined, agent-facing instructional prose). Keep `SKILL.md` thin (progressive-disclosure budget) — detail goes in the new reference file.

For the review side (Pass 4 extension): add one check sentence + link: does the repo re-run documented commands in CI (accuracy gate), are derived artifacts generated rather than hand-edited (freshness), and does CI smoke the live deployed URL? Flag absence as ACC-severity findings; do not duplicate the methodology text here.

## Scope boundary (do NOT drift into ef0)
The *cross-surface drift audit* of facts duplicated across many docs pages (pack counts, kind sets, stale homepage claims) is ticket **incitaciones-ef0**, not this one. Here, stamping/freshness covers machine-derived artifacts only.

## Red/green/refactor sequence
1. **Red:** `grep -qi 'accuracy gate' content/distilled/documentation/references/review-documentation/SKILL.md` → must fail (exit 1) before you start.
2. **Green:** write the content until all acceptance greps pass (below). One atomic green commit.
3. **Refactor:** separate commit if a consistency pass is needed; do not bundle.

## Completion criteria (runnable; exit 0 = done)
- `just validate-distilled` → exit 0
- `just sync-manifest` → exit 0
- `test -f content/distilled/documentation/references/implement-documentation/references/docs-accuracy.md` → exit 0
- `grep -qi 'normalize' content/distilled/documentation/references/implement-documentation/references/docs-accuracy.md` → exit 0
- `grep -qi 'accuracy gate' content/distilled/documentation/references/implement-documentation/SKILL.md` → exit 0
- `grep -qi 'accuracy gate' content/distilled/documentation/references/review-documentation/SKILL.md` → exit 0
- `grep -qi 'stamped' content/distilled/documentation/references/review-documentation/SKILL.md` → exit 0
- `git status --porcelain` shows only intended files (no `.agents/` edits, no `skills/` or `pi-package/` edits, no `.beads` staging)

## Out of scope
- Router `documentation/SKILL.md` mode-table changes (no new mode)
- research mode; cross-surface drift audit (ef0); visual/ecosystem patterns (iio); cold-reader pass (x3n)
- Generated outputs: `.agents/`, `skills/`, `pi-package/`
- Implementor must NOT commit `.wai/` pipeline state or research artifacts (orchestrator owns those)

## Commit rules
- Atomic commits; never `git add -A`; stage exact paths; never stage `.beads/`.
- Pre-commit hooks are FIXED on this branch (4a61a7b) — commit normally, no `--no-verify`.

## Spawn model
Spawn `pi` non-interactively with this brief; named session `subagent:incitaciones-2u2:impl`; stream to `.wai/projects/incitaciones/logs/2u2-impl.log`; wall-clock budget ≤ 25 min via `timeout`. Context ceiling: ≤ 25% of the spawned model's window (brief is ~800 tokens; repo conventions load adds ~10k).

## Follow-up threshold
If the content needs a design decision not covered here (e.g. new router mode, or the freshness check wants tooling rather than a checklist), STOP after ≤ 2 attempts and file a follow-up ticket instead of improvising.

## Verifier evidence contract (wai-px4g)
The verify session's review artifact must cite the artifacts it read (paths) and include fresh command output (the actual completion-criteria commands + results, pasted) before recording CONFIRM — otherwise REVIEW_REQUIRED.
