# Cross-Surface Drift Audit (Pass 6)

Methodology for Pass 6 of the review-documentation skill. Mined from the
2026-10 evidence: the same fix landed three times — `lf4b.1` (explain-topic
drift across README/index/installation), `d8f97ce` (pack-count and kind-set
drift in format-summary surfaces), `fd2fbe0` (a pack missing from
user-facing counts) — because facts duplicated across surfaces had no source
of truth and no consistency check. Evidence:
`.wai/resources/reflections/docs-skill-survey-2026-10.org` (row 17).

Drift is silent: each surface is internally plausible, and no single page is
wrong — the *set* of pages is wrong. A reader who visits only one surface
never notices; a reader who visits two gets contradicted.

## 1. The Drift Inventory (enumerate facts, don't sample pages)

Before reading surfaces as prose, enumerate the individual *facts* each
surface states. The fact classes that drifted in the 2026-10 evidence:

- **Counts** — pack/module counts, kind sets, totals ("10 packs" on the
  README, "11 packs" on the index, a pack listed on one surface and missing
  from another).
- **Command names & invocations** — the same CLI spelled differently across
  README quickstart, installation page, and docs index.
- **Install steps** — prerequisites, package-manager choice, post-install
  verification steps that differ per surface.
- **Links** — the same destination linked with different slugs, anchors, or
  fragments (some resolve, some 404).
- **Version claims** — "current version", "requires X or later", release
  notes stated in more than one place.

For each fact class, grep the *fact*, not the page: search for the pattern
(`grep -rn` for the command name, the version string, the counted noun)
across every user-facing surface, so copies are found even where they were
not expected. Facts found through page-by-page reading drift precisely where
nobody thought to look.

Rules:

- Enumerate all copies of a fact before judging any of them; a drift audit
  that samples misses the third surface.
- Verify every copy agrees — and agrees with the artifact itself (count the
  packs in the repo, not the claims about packs).
- Record each copy with its exact location (file, section) — a drift finding
  without locations cannot be fixed.

## 2. Topic Alignment Across Entry Surfaces

README, docs index, and installation page are the three surfaces a new
reader walks in order. They must tell one consistent story: the same
audience, the same promise, the same next step. The `lf4b.1` failure was not
a fact mismatch but a framing drift — the pages drifted into different
explanations of what the tool is.

Checks, per surface pair:

- **Audience**: does each entry surface address the same reader (user vs.
  contributor vs. AI agent)? A README talking to users above an index
  talking to contributors reads as two different projects.
- **Promise**: does each surface state the same one-sentence claim about
  what the thing does? Rephrasing is fine; a different promise is drift.
- **Next step**: does each surface point to the same first action
  (install → quickstart → docs)? Conflicting next steps fork the reader's
  path at the exact moment they have no context to choose.

Rules:

- Compare first screens (title, first paragraph, primary CTA), not full
  pages — framing drift lives where the reader enters.
- Flag framing drift with the same severity as fact drift: a consistent
  wrong story is as broken as a contradictory right one.

## 3. Flagging Single-Source Remediation (reviewer stance)

A fact stated in N hand-written places is not maintained N times carefully —
it is maintained zero times, then fixed 3× after readers report it. When a
duplicated fact has no generator, no stamp, and no consistency check, flag
the *structure* as the finding, not each individual mismatch:

- Should the fact live in one place with the other surfaces linking to it?
- Should the copies be generated or stamped from a single source (counts,
  versions, release artifacts)?
- Is there a check that would have caught the drift (a gate, a lint, a test)?

The stamping methodology — which artifacts to generate per release, how to
lint against hand-edits — lives in
`../../implement-documentation/references/docs-accuracy.md`; cross-reference
it, do not duplicate it here. Note that stamped artifacts fix
*machine-derived* facts (versions, release notes); the drift audit covers
the broader set of hand-duplicated facts, and the two combine: stamp what a
generator can compute, single-source what a human must write.

Rules:

- Flag the remediation shape, not a rewrite: the reviewer names the single
  source; the implementer (`implement-documentation`) builds it.
- Never flag "potential" drift — a finding is a fact with at least two
  copies that disagree, verified by reading both.
