# Executable Docs: Accuracy Gate, Stamped Artifacts & Live-Site Smoke

Methodology for making documentation machine-checked instead of read-checked.
Mined from the 2026-10 specodelic and ddl docs work; evidence in
`.wai/resources/reflections/docs-skill-survey-2026-10.org` (row `lf4b.10`/`.11`).
Canonical theory: `content/research-documentation-frameworks.md`.

The 2026-10 evidence: docs that only humans check drift silently. The fixes are
three CI gates — the docs-accuracy gate re-runs documented commands and diffs
their real output against the docs; stamped artifacts are regenerated per
release and lint-checked for hand-edits; a live-site smoke curls the deployed
URL so a 404'd book fails in CI, not at the next human visit.

## 1. The Docs-Accuracy Gate (CI re-runs the documented commands)

Specodelic `lf4b.10` built a gate that re-runs the quickstart commands and
diffs captured output against the documented snippets (in `docs/src`). The
quickstart rule from `worked-examples.md` makes commands claimable; the gate
makes those claims executable. A doc that says one thing and outputs another
fails the build instead of embarrassing the maintainer in an issue thread.

Gate shape:

1. Inventory the documented commands (the quickstart and how-to pages are
   usually enough; every command in the example coverage matrix qualifies).
2. In CI, run each command, capture stdout/stderr and the exit code.
3. Normalize the capture (see capture-normalize below).
4. Diff the normalized capture against the documented snippet. Any drift —
   including an output the docs no longer show — fails the build.

The capture-normalize technique (specodelic commit `a2108b8`): before diffing,
normalize tool chatter on **both sides with the same rules**. Real output is
full of volatility that is not part of the contract:

- tool verbosity lines (`cargo`, `gh`, compilers: progress, timings, emoji)
- content hashes, digests, object IDs
- timestamps, durations, download speeds
- absolute paths (home dir, temp dirs, machine names)

Normalize these to stable placeholders (e.g. `[TIME]`, `[HASH]`, `[PATH]`)
before the diff. Only normalized output is diffable — raw captures diff-fail
on every run for reasons the docs never claimed to specify. Document the
normalization rules in the docs pipeline itself, so a reader comparing their
terminal to the docs knows what was masked.

Rules:

- The gate runs on every PR touching docs **or** code that changes
  command output — output drift is a code-change bug as often as a docs bug.
- The gate checks exit codes too, not just stdout: a command that starts
  erroring is drift even when stdout looks plausible.
- Keep the gate fast by scoping it to documented commands only; it is a
  contract check, not a full test suite.

## 2. Stamped Artifacts (generated per release, never hand-edited)

Specodelic `lf4b.11` made `release.md`, `llms.txt`, and similar release-facing
artifacts *stamped*: regenerated automatically at release time from the
repo state, never hand-edited. Facts that a generator can compute (version,
pack/module counts, release date, changelog digest) must not be maintained by
hand — hand-maintained facts are exactly the ones that drift (see the
pack-count drift fixes `lf4b.1`, `d8f97ce`, `fd2fbe0`).

Stamped artifacts include:

- `llms.txt` / `llm.txt` (AI-facing site indexes derived from the docs tree)
- `release.md` / release notes derived from tags and changelog
- README facts a generator owns: version numbers, counts, install shas

Freshness check: add a lint step that **regenerates (or re-derives) each
stamped artifact and fails on any diff**. The regeneration is cheap because
the stamps are derived from data already in the repo; the diff is the point.
A hand-edit survives exactly one CI run before it is flagged.

Rules:

- Stamp at release time from the single source the fact lives in — the stamp
  step copies, it never re-types.
- Treat a hand-edit to a stamped artifact as a bug: fix the generator (or the
  underlying source), not the artifact.
- If a fact is duplicated across stamped artifacts and hand-written pages, fix
  it with a single source, not a sync script (the cross-surface drift audit is
  a separate concern; the freshness check here covers machine-derived
  artifacts only).
- The freshness lint runs in CI on every push, not only at release — release
  day is when you can least afford a surprise.

## 3. Live-Site Smoke (CI curls the deployed URL)

The ddl precedent: CI curls the deployed docs URL (GitHub Pages, Netlify,
etc.) after deploy, so a 404'd book fails the pipeline immediately — not at
the next human visit, which might be weeks away. Build checks validate the
source; the smoke validates what readers actually receive.

Smoke shape:

1. After the deploy job succeeds, curl the URL a reader lands on: site root,
   quickstart, at minimum the newest release page.
2. Fail on non-2xx (and on obvious error bodies — some hosts return 200 for
   soft-404 pages; check for the expected content marker).
3. Run it in the same pipeline as the deploy, so a bad deploy fails before
   anyone moves on.

Rules:

- Smoke the rendered URL, not the build artifact — the point is the thing a
  reader's browser gets.
- Include at least one deep page, not only the index: deploy misconfigs often
  break path-based routing while the root still resolves.
- Keep the assertions minimal (status + one content marker); this is a smoke,
  not a rendering test suite.
