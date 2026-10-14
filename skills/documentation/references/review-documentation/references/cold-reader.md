# Cold-Reader & Positioning Review (Pass 7)

Methodology for Pass 7 of the review-documentation skill. Mined from the
2026-10 evidence: two separate cold-read exercises drove the specodelic docs
work — one reviewed real user conversations and turned the actual questions
into FAQ, decision-guide, and glossary pages (commit `2e52854`, beads `7gh`);
the other produced the "what the format assumes / when NOT to use it"
positioning page (commit `427bf9a`). Evidence:
`.wai/resources/reflections/docs-skill-survey-2026-10.org`.

The gap Pass 7 closes: `ai-readiness-criteria.md` scores structure for LLM
ingestion — chunking, unique headers, dual-audience — and never asks the
human question: *would a confused first-time reader succeed?* Structure that
scores perfectly for RAG can still strand a human at the front door.

## 1. The Question Mine (enumerate real questions, don't invent them)

Before reading the docs at all, collect the questions real users actually
asked. The evidence is already sitting in three places:

- **Support conversations** — chat logs, email threads, community channels.
  Copy the user's question *verbatim*; paraphrase erases the exact
  vocabulary gap that made the docs hard to find.
- **Session logs / agent transcripts** — where a human or agent worked with
  the tool, the points where they stopped to re-read, backtracked, or asked
  a clarifying question are the confusion map.
- **Issue titles and discussion threads** — a question filed as an issue is
  a question the docs failed to answer in the most discoverable place.

For each question, grep the docs for an answer: not the topic, the actual
answer a cold reader could act on. Classify each question:

- **Answered but undiscoverable** — the answer exists on a page the reader
  would never reach from the entry point. Finding: add the missing link or
  FAQ entry pointing at it.
- **Answered but unclear** — the answer exists and is findable, yet the
  user still asked. Finding: the page's wording failed; cite the exact
  sentence that did not transfer.
- **Unanswered** — no page answers it. Finding: becomes a FAQ entry or an
  implementation ticket (`implement-documentation`), not a silent gap.

Rules:

- Mine at least the last 10 real user questions before judging any page —
  a review built on imagined questions flags what authors fear, not what
  readers hit.
- Every unanswered question produces an artifact: a FAQ entry with the
  user's own wording, or a filed ticket. A mined question that changes
  nothing was decoration.
- Record each finding with the question's source (conversation, log, issue
  URL) — evidence-mined findings outrank reviewer intuition.

## 2. The First-Run Funnel (time-to-first-success under 10 minutes)

Walk the entry path exactly as a cold first-time reader would: land on the
README or quickstart, follow the first action it names, and do not use any
knowledge the page does not state. Time it end to end.

The 2026-10 prompt was a user's own words: *"we have a presentation today,
it should be clear and easy to onboard"* — onboarding time is a user-visible
requirement, not an internal quality goal. The metric is
time-to-first-success: first page view to first successful, verified use.

Checks along the funnel walk:

- **Zero-to-install**: does the first page state the prerequisites up front,
  or does the reader discover them by failing? Each discovered-late
  prerequisite is a restart.
- **Decision count**: count the forks where the reader must choose without
  guidance (package managers, install methods, "advanced vs. simple" paths).
  More than a couple of unguided forks before first success is drift between
  the docs and a cold reader's context.
- **Verified success**: does the quickstart end with an output the reader
  can check ("you should see…") rather than an unverified "it works"? An
  unverifiable success is indistinguishable from a failure.
- **Cross-reference, don't re-derive**: the metric definitions (TTFS,
  support-ticket deflection, search analytics) live in
  `../../research-documentation/references/metrics.md` — Pass 4 already uses
  that file for entry-point pages. Read it for the measurement playbook;
  this pass only runs the walk and reports where the clock exceeded 10
  minutes or the reader stalled.

Rules:

- Time the funnel with a stopwatch or by counting steps, and report the
  number — "it felt long" is not a finding; "install-to-first-success took
  23 steps across 4 pages" is.
- Walk the path as written, including the parts that are wrong; fixing the
  docs in your head during the walk erases exactly the findings the pass
  exists to produce.
- If the funnel cannot be completed at all, that is the top-severity
  finding, not a pass failure.

## 3. Positioning: "When NOT to Use This" and the Decision Guide

The `427bf9a` evidence: a format that explained itself well still needed a
page stating what the format *assumes* and when NOT to use it — because
readers who pick the wrong tool blame the tool, and no amount of positive
documentation prevents the wrong first choice. Positioning is the part of
the docs written for the reader who should walk away.

Checks:

- **"When NOT to use" section**: every tool or format doc needs an explicit
  section naming the situations where this tool is the wrong choice, with
  the reason and — where one exists — the alternative to use instead. A
  good section is concrete ("do not use X when your data exceeds memory;
  use Y instead"), not hedged ("X may not be suitable for all use cases" —
  a hedge that answers nothing).
- **Decision guide for overlapping entry points**: where two pages
  (README vs. docs index, tutorial vs. how-to, tool A vs. tool B) could
  both be a reader's first stop, there must be a stated rule for choosing
  — a short comparison table or "start here if / use instead if" list at
  the top of each overlapping page. Overlapping entry points without a
  decision guide fork the reader at the moment they have no context to
  choose.
- **Assumptions stated**: the "what the format assumes" list belongs near
  the top of the positioning page — readers invalidated by an unstated
  assumption lose the most time.

Rules:

- Flag every tool/format doc missing the "when NOT to use" section as a
  finding, not a suggestion — the evidence case shipped one after a real
  user picked the format for a job it was never meant for.
- Test each "when NOT to use" claim against the artifact where possible
  (same stance as the Pass 4 spot-check); a wrong negative sends readers
  away from a tool that would have worked.
- The decision guide goes where the overlap is — at the entry points, not
  buried on a comparison page nobody reaches before choosing.
