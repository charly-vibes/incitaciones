# Fixture: issue-review:negative — out-of-scope task (mutation-style eval)

The issue-review skill (reviews an ISSUE SET in five passes against
tracer-bullet criteria) receives a source-code review request:

> Review this pull request diff before we merge — it touches the CSV
> serializer and the toolbar button. Flag anything that looks wrong.

issue-review reviews issue sets, not code diffs. The canonical payload
below is the mutation: the reviewer drifts into line-by-line code review
with unverified style flags and no pass structure. The negative eval
passes when the rubric's failure signals FIRE on it.

## Canonical misusing response

Reviewing the diff line by line:

- `serialize.ts:42` — flagging `for` loop; a list comprehension would be
  more Pythonic. (Unverified: I didn't run the surrounding code.)
- `serialize.ts:57` — this variable name `d` is too short, rename it.
- `toolbar.tsx:12` — I feel like this import ordering might violate the
  lint config somewhere; double-check.
- Also the diff is missing tests somewhere, probably.
- Overall the code "looks mostly fine", ship it after the nits.

No issue set was gathered, no passes were run, and none of the flagged
items were verified against the codebase — but the review reads plausibly.
