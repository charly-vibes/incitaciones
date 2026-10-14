# Subagent brief: incitaciones-av4 — docs skill: worked-example & expected-output methodology

**Repo:** `/var/home/sasha/para/areas/dev/gh/charly/incitaciones` · **Branch:** `docs/av4-worked-examples` (already checked out) · **Base:** cbc34ca

## Why
Delegation keeps the lead session's context free for orchestration and verification. This ticket is self-contained content authoring with machine-checkable gates (`just validate-distilled`, `just sync-manifest`), so it fits a bounded subagent run with no interactive decisions.

## Desired outcome
The `documentation` skill's implement mode teaches the worked-example / expected-output methodology mined from the 2026-10 specodelic docs work (evidence in `.wai/resources/reflections/docs-skill-survey-2026-10.org` and beads `incitaciones-av4`).

## Exact files (source of truth — NOT the installed `.agents/` copies, which are gitignored generated output)
- `content/distilled/documentation/references/implement-documentation/SKILL.md` — add a pointer/step for the new reference
- `content/distilled/documentation/references/implement-documentation/references/templates.md` — extend the Tutorial template
- NEW: `content/distilled/documentation/references/implement-documentation/references/worked-examples.md` — the full methodology

## Content to write (from the ticket + survey)
1. **Worked-example pattern** — one evolving example thread through the book/docs (install → first command → expected output → realistic failure → recovery → next feature), not N disconnected snippets. Example: specodelic's pack worked examples (data.lineage, numeric.predicates, empirical.registry).
2. **Quickstart rule** — every command shows its expected output and exit code; every install path ends with a post-install verification block (e.g. `spk --version` + `spk explain`).
3. **Example coverage matrix** — a table mapping every user-facing feature/pack/command to ≥1 example page; uncovered rows become follow-up tickets. Keep it a checklist, not tooling.
Keep the additions tight and instructional (agent-facing prose); follow the existing voice of `templates.md`. Honor the repo's progressive-disclosure budget: keep `SKILL.md` thin, put detail in the new `references/` file.

## Red/green/refactor sequence
1. **Red:** run `grep -q 'expected output' content/distilled/documentation/references/implement-documentation/references/templates.md` → must fail (exit 1) before you start.
2. **Green:** write the content until both acceptance greps pass (see Completion criteria).
3. **Refactor:** separate commit if any rewording/consistency pass is needed; do not bundle with green commit.

## Completion criteria (runnable; exit 0 = done)
- `just validate-distilled` → exit 0
- `just sync-manifest` → exit 0
- `grep -q 'expected output' content/distilled/documentation/references/implement-documentation/references/templates.md` → exit 0
- `grep -qi 'worked.example' content/distilled/documentation/references/implement-documentation/SKILL.md` → exit 0
- `test -f content/distilled/documentation/references/implement-documentation/references/worked-examples.md` → exit 0
- `git status --porcelain` shows only intended files (no `.agents/` edits, no `.beads` staging)

## Out of scope
- Router `SKILL.md` mode-table changes (no new mode)
- review/research modes (other tickets: 2u2, x3n, ef0, iio)
- Manifest entry changes beyond what `just sync-manifest` itself does (version date bump already in working tree — keep it, it is intended)
- Updating installed copies under `.agents/` or `skills/` or `pi-package/` (generated)

## Commit rules
- Atomic commits: green content commit first, refactor second (if needed). Include the already-modified `content/manifest.json` (date bump) in the first commit.
- Never `git add -A`; stage exact paths. Never stage `.beads/`.

## Spawn model
Spawn `pi` non-interactively with this brief; stream to a log; wall-clock budget ≤ 20 min. Context ceiling: ≤ 25% of the spawned model's window (brief is ~700 tokens; repo conventions load adds ~10k).

## Follow-up threshold
If the content needs a design decision not covered here (e.g. new router mode), STOP after ≤ 2 attempts and file a follow-up ticket instead of improvising.

## Verifier evidence contract (wai-px4g)
The verify session's review artifact must cite the artifacts it read (paths) and include fresh command output (the actual completion-criteria commands + results, pasted) before recording CONFIRM — otherwise REVIEW_REQUIRED.
