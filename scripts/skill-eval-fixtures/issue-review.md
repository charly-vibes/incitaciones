# Fixture: issue-review — realistic task for the tracer-bullet issue review

Review this issue set (from repo `acme/widgets`, plan: "add CSV export").
Respond as you would in a live review: name the passes you run in order,
what each pass flags in THIS set, the convergence decision, and the final
report with exact suggested edits. This is a simulation — do not execute
tracker commands.

- **W-1** `feat: csv export button` — "Add a button that exports CSV."
  No acceptance criteria. Files: `ui/toolbar.tsx` only.
- **W-2** `feat: csv serializer` — "Implement the CSV escaping rules."
  Files: `src/serialize.ts`. Gate: "escaping is correct". No Meter.
- **W-3** `chore: upgrade bundler` — bundled into the plan with no link to
  any story; large migration described in one line.
- **W-4** `test: csv export e2e` — depends on W-1 AND W-2; verifies the
  user-visible export flow end to end; runnable command given.

### Expected decisions (evaluation oracle)

- Tracer-bullet lens: W-1+W-2 are layer tickets (UI-only, serializer-only);
  the vertical slice is "export one sample CSV through button+serializer"
  with a runnable Meter — fold W-1/W-2 toward it, W-4 as its verifier.
- Clarity pass: W-1 has no quantified Must gate; W-2's "escaping is
  correct" is not machine-verifiable — rewrite as example-table checks.
- Dependencies pass: W-3 is unrelated to the story — cut it from the set
  or re-scope; W-4's double dependency collapses once W-1/W-2 merge.
- Reference issue IDs precisely (W-1…W-4); flag blockers (W-2 gate) before
  cosmetics; convergence is plausibly reached by pass 4.
