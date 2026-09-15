# Documentation Quality Metrics

Use in Step 4 to recommend measurement signals. The single most important metric is time-to-first-success; the rest build the feedback loops that keep docs honest. Source: `content/research-finding-library-docs-best-practices.md` (Section 7, Measuring Documentation Quality).

## Key metrics

- **Time-to-first-success (TTFS).** Time from a developer's first encounter with the docs to their first successful use of the library/API. Measure via user testing, analytics (first page view to first successful API call), or surveys. This is the headline number.
- **Support ticket deflection.** Percentage of support questions answered by docs rather than a human. Quantifies economic value; track the ratio of tickets to page views, or add "Did this page answer your question?" widgets.
- **Page engagement.** Time on page, scroll depth, return visits. High bounce on getting-started may mean unmet expectations; low time on reference may mean fast finds (good) or frustration (context matters).
- **Search analytics.** Track queries, click-through rates, and "no results" queries. No-results queries are direct evidence of missing docs. High click-through to a page means it is well-titled and relevant.
- **Broken link rates.** Percentage of internal/external links returning 404. Automated link checking should run on every deployment (see `doc-link-verifier` skill).
- **Documentation coverage.** Percentage of public APIs/endpoints/features that have docs. Measurable automatically for API reference (OpenAPI vs. documented endpoints) and code docs (docstring coverage via `interrogate`).
- **Page freshness.** Age of a doc page relative to the last code change that touched the documented feature. Stale docs are a leading frustration indicator.

## User testing and feedback loops

- **Usability testing.** Watch representative users attempt tasks using only the docs. Even informal tests reveal problems invisible to authors.
- **Inline feedback widgets.** "Was this page helpful?" at the bottom of pages. Act on it: low-rated pages get prioritized.
- **GitHub issues and discussions.** Questions already answered in docs indicate the docs are not discoverable or clear enough.
- **Developer surveys.** Periodic structured feedback on quality, gaps, and priorities.
- **Community channels.** Repeated questions in Discord/Slack/Stack Overflow are strong gap signals.

## Automated quality tools (CI/CD)

- **Vale** — prose linter enforcing style-guide rules (passive voice, jargon, inconsistent terminology).
- **markdownlint** — Markdown formatting consistency.
- **htmlproofer / lychee** — internal and external link checking on every deployment.
- **interrogate** (Python) — docstring coverage reporting.
- **cspell / aspell** — spell checking.
- **Lighthouse** — page performance, accessibility, SEO, best practices in CI.

A practical pipeline: on every PR run markdownlint + Vale + cspell + example tests; on every deployment run link checking + Lighthouse; weekly run a full broken-link crawl, coverage report, and freshness report; monthly review user feedback and search analytics.

## Building a quality culture

Metrics are necessary but not sufficient. Culture is the larger factor:

- Add "docs updated" checkboxes to PR templates.
- Allocate explicit sprint time (15-20%) to documentation and refactoring.
- Apply "you touch it, you document it" — the author of a code change owns the doc update.
- Assign a named owner to every documentation section.
- Celebrate documentation contributions the same way as code contributions.