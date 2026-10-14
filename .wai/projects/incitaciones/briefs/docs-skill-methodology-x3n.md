# Subagent brief: incitaciones-x3n — docs skill: cold-reader review pass (FAQ, decision guide, when-NOT-to-use)

**Repo:** `/var/home/sasha/para/areas/dev/gh/charly/incitaciones` · **Branch:** `docs/av4-worked-examples` (already checked out) · **Base:** current HEAD after artifacts commit

## Why
Delegation keeps the lead session's context free for orchestration and verification. Self-contained content authoring, complexity:s, machine-checkable gates (`just validate-distilled`, `just sync-manifest`).

## Desired outcome
The `review-documentation` skill simulates a confused first-time human, not just LLM-ingestion structure. Evidence 2026-10: two cold-read exercises drove the specodelic docs work — mining real user conversations into FAQ/decision-guide/glossary pages (2e52854, 7gh) and the "what the format assumes / when NOT to use it" positioning page (427bf9a). `references/ai-readiness-criteria.md` only scores structure for LLMs and never asks "would a cold human reader succeed?" Evidence: `.wai/resources/reflections/docs-skill-survey-2026-10.org`; beads `incitaciones-x3n`.

## Exact files (source of truth — NOT the installed `.agents/` copies)
- NEW: `content/distilled/documentation/references/review-documentation/references/cold-reader.md` — the methodology
- `content/distilled/documentation/references/review-documentation/SKILL.md` — add **Pass 7: Cold-Reader & Positioning** to the existing pass structure

## Content to write (from the ticket)
1. **Cold-reader pass** — mine real user questions (support conversations, session logs, issue titles) and check each has a doc answer; unanswered ones become FAQ entries or tickets.
2. **First-run funnel check** — can a cold reader reach first success in <10 min? Cross-reference `../research-documentation/references/metrics.md` (time-to-first-success, already used by Pass 4 for entry-point pages) — do not duplicate its content.
3. **Positioning review** — every tool/format doc needs an explicit "when NOT to use this" section and a decision guide for overlapping entry points.

## Shape constraints
- SKILL.md now reads "Perform 5 iterative passes — 6 when the subject spans multiple surfaces…". Extend minimally: Pass 7 (Cold-Reader & Positioning) applies when the subject is user-facing documentation — for README/quickstart/tool docs that is effectively always. Keep passes 1–6 and convergence mechanics untouched.
- Pass 7 header block mirrors Passes 1–6: `### Pass 7: Cold-Reader & Positioning`, Goal line, the three checks above, pointer to `references/cold-reader.md` (link, don't copy), issue prefix `[COLD-001]`.
- `cold-reader.md` matches the voice of `docs-accuracy.md` / `drift-audit.md`: numbered sections, evidence-mined, instructional prose, concrete rules (e.g. how to mine questions from support logs; how to time the funnel; what a good "when NOT to use" section looks like).

## Red/green/refactor sequence
1. **Red:** `grep -qi 'cold-reader' content/distilled/documentation/references/review-documentation/SKILL.md` → must fail (exit 1) before you start.
2. **Green:** one atomic commit until all acceptance criteria pass.
3. **Refactor:** separate commit only if a consistency pass is needed.

## Completion criteria (runnable; exit 0 = done)
- `just validate-distilled` → exit 0
- `just sync-manifest` → exit 0
- `test -f content/distilled/documentation/references/review-documentation/references/cold-reader.md` → exit 0
- `grep -qi 'cold-reader' content/distilled/documentation/references/review-documentation/SKILL.md` → exit 0
- `grep -qi 'COLD-001' content/distilled/documentation/references/review-documentation/SKILL.md` → exit 0
- `grep -qi 'NOT to use' content/distilled/documentation/references/review-documentation/references/cold-reader.md` → exit 0
- `git status --porcelain` shows only intended files (no `.agents/`, `skills/`, `pi-package/` edits, no `.beads` staging)

## Out of scope
- Passes 1–6 wording, convergence mechanics, Final Report structure
- implement-documentation files; research mode; visual/ecosystem patterns (iio)
- Generated outputs: `.agents/`, `skills/`, `pi-package/`; `.wai/` pipeline state (orchestrator-owned)

## Commit rules
- Atomic commits; never `git add -A`; stage exact paths; never stage `.beads/`.
- **Do NOT push.** Commit locally only — the orchestrator handles remote state. The pre-push hooks are the orchestrator's concern, not the implementor's.

## Spawn model
Spawn `pi` non-interactively with this brief; named session `subagent:incitaciones-x3n:impl`; stream to `.wai/projects/incitaciones/logs/x3n-impl.log`; wall-clock budget ≤ 15 min via `timeout`. Context ceiling: ≤ 25% of the spawned model's window.

## Follow-up threshold
If the content needs a design decision not covered here (e.g. restructuring the pass flow), STOP after ≤ 2 attempts and file a follow-up ticket instead of improvising.

## Verifier evidence contract (wai-px4g)
The verify session's review artifact must cite the artifacts it read (paths) and include fresh command output (the actual completion-criteria commands + results, pasted) before recording CONFIRM — otherwise REVIEW_REQUIRED.
