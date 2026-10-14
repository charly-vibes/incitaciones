# Subagent brief: incitaciones-iio — docs skill: visual docs & cross-repo ecosystem patterns

**Repo:** `/var/home/sasha/para/areas/dev/gh/charly/incitaciones` · **Branch:** `docs/av4-worked-examples` (already checked out) · **Base:** current HEAD after x3n artifacts commit

## Why
Delegation keeps the lead session's context free for orchestration and verification. Self-contained content authoring, complexity:s, machine-checkable gates (`just validate-distilled`, `just sync-manifest`). This is the LAST ticket of the docs-skill-methodology epic.

## Desired outcome
The `documentation` skill covers zero visual docs and zero multi-repo/fleet docs. Evidence 2026-10: ddl built an ecosystem responsibility-map SVG with color-coded layers and clickable blocks linking to each project's docs (cbfa300); specodelic hit deployed-docs bugs — mermaid graphs not rendering on the live site (graph-views.html) and the homepage carrying stale claims. Evidence row 18: `.wai/resources/reflections/docs-skill-survey-2026-10.org`; beads `incitaciones-iio`.

## Exact files (source of truth — NOT the installed `.agents/` copies)
- NEW: `content/distilled/documentation/references/implement-documentation/references/visual-cross-repo.md` — the methodology
- `content/distilled/documentation/references/implement-documentation/SKILL.md` — add ONE procedure pointer (mirror the step-5/5/7 pattern; the file now has steps 1–7)

## Content to write (from the ticket)
1. **Diagram guidance** — prefer static pre-rendered SVG over runtime mermaid on static-site books (GitHub Pages rendering failure modes; the specodelic graph-views.html incident); keep diagrams in sync via a build step when possible.
2. **Cross-repo (fleet) docs** — a responsibility map per layer, each block linking to the owning project's docs; per-repo setup pages follow one shared template; fleet-wide pages (install, ecosystem) live in the hub repo so they have exactly one home.
3. **Deployed-vs-source smoke** — after doc deploys, verify *rendered* output (JS errors, mermaid/graph rendering, search index) not just link integrity; smoke what readers actually receive, echoing 2u2's live-site smoke but for rendered behavior.

## Scope coordination
- 2u2's live-site smoke checks the URL is reachable (2xx + content marker); iio's deployed-vs-source smoke checks *rendered behavior* (JS executes, graphs render, search index builds). In the new file, cross-reference `../review-documentation/references/...`? No — cross-reference the sibling implement reference `docs-accuracy.md` (§3 live-site smoke) as the reachability layer this new smoke builds on. Link it, don't duplicate.

## Shape constraints
- Keep `SKILL.md` thin (progressive-disclosure budget): one new pointer step, same sentence-pattern as steps 5 and 7.
- The new file matches the voice of `docs-accuracy.md` / `drift-audit.md` / `cold-reader.md`: numbered sections, evidence-mined, instructional prose, concrete rules.

## Red/green/refactor sequence
1. **Red:** `test -f content/distilled/documentation/references/implement-documentation/references/visual-cross-repo.md` → must fail (exit 1) before you start.
2. **Green:** one atomic commit until all acceptance criteria pass.
3. **Refactor:** separate commit only if a consistency pass is needed.

## Completion criteria (runnable; exit 0 = done)
- `just validate-distilled` → exit 0
- `just sync-manifest` → exit 0
- `test -f content/distilled/documentation/references/implement-documentation/references/visual-cross-repo.md` → exit 0
- `grep -qi 'mermaid' content/distilled/documentation/references/implement-documentation/references/visual-cross-repo.md` → exit 0
- `grep -qi 'visual-cross-repo' content/distilled/documentation/references/implement-documentation/SKILL.md` → exit 0
- `grep -qi 'responsibility map' content/distilled/documentation/references/implement-documentation/references/visual-cross-repo.md` → exit 0
- `grep -qi 'docs-accuracy' content/distilled/documentation/references/implement-documentation/references/visual-cross-repo.md` → exit 0 (coordination cross-reference)
- `git status --porcelain` shows only intended files (no `.agents/`, `skills/`, `pi-package/` edits, no `.beads` staging)

## Out of scope
- Review-documentation files (2u2/ef0/x3n territory); research mode
- Generated outputs: `.agents/`, `skills/`, `pi-package/`; `.wai/` pipeline state (orchestrator-owned)
- Actually building any SVG/diagram tooling — this ticket documents the *methodology* only

## Commit rules
- Atomic commits; never `git add -A`; stage exact paths; never stage `.beads/`.
- **Do NOT push.** Commit locally only — the orchestrator handles remote state.

## Spawn model
Spawn `pi` non-interactively with this brief; named session `subagent:incitaciones-iio:impl`; stream to `.wai/projects/incitaciones/logs/iio-impl.log`; wall-clock budget ≤ 15 min via `timeout`. Context ceiling: ≤ 25% of the spawned model's window.

## Follow-up threshold
If the content needs a design decision not covered here, STOP after ≤ 2 attempts and file a follow-up ticket instead of improvising.

## Verifier evidence contract (wai-px4g)
The verify session's review artifact must cite the artifacts it read (paths) and include fresh command output (the actual completion-criteria commands + results, pasted) before recording CONFIRM — otherwise REVIEW_REQUIRED.
