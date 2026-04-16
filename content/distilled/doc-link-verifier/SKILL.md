---
name: doc-link-verifier
description: Audit repository documentation for broken links and contextual correctness — HTTP status, relative paths, anchors, and semantic mismatches between link text and target content.
---

# doc-link-verifier

Audit a repository's documentation for link problems. Two problems, actually:

1. **Broken** — the link doesn't resolve (404, wrong file path, dead anchor).
2. **Wrong in context** — the link resolves fine but points to something that doesn't match what the surrounding text claims it points to. This is the subtler, more damaging kind, because it survives every "dead link checker" on the market.

This skill bundles scripts for the first problem (deterministic — either the page exists or it doesn't) and guides your judgment for the second (not deterministic — someone has to actually read the target and compare it to the context).

## When to use this skill

Trigger any time the user wants to check/audit/verify/validate links in documentation. They might not use any of those exact words — "are the links still good?", "find broken links", "the docs are old, can you make sure they still work", "do a link check on the repo" all qualify. If a repo + links is involved, reach for this.

## Inputs you need

Ask for these only if they aren't already obvious from context:

1. **Repo path** — the root of the repository to scan.
2. **Scope** — whole repo, just `/docs`, just the README, etc. Default: whole repo.
3. **Include code comments?** — URLs inside `//`, `#`, `/* */`, docstrings, JSDoc. Default: include them, since users who say "all documentation" usually mean prose docs AND the doc comments that end up in generated API references.
4. **Depth of context check** — shallow (title/heading match) or deep (read target content and semantically compare). Default: shallow, escalate to deep if shallow turns up anything suspicious or the user asks.

If the user just says "check my repo's links" and points at a directory, assume whole repo + include code comments + shallow. Don't pepper them with questions before starting.

## Script location

The helper scripts live in the `scripts/` directory next to this file. Resolve the absolute path from this skill file's location. For example, if you read this file from `~/.claude/skills/doc-link-verifier/SKILL.md`, substitute `~/.claude/skills/doc-link-verifier` for `<this-skill-dir>` in the commands below.

Run scripts with `uv run` — each script embeds its own dependency metadata (PEP 723), so `uv` automatically installs what's needed (e.g. `aiohttp` for the checker) in an ephemeral environment. No manual `pip install` required.

## Workflow

### Step 1 — Extract every link

Run the extractor. It walks the tree, pulls out links with surrounding context, and writes a JSON file.

```bash
uv run <this-skill-dir>/scripts/extract_links.py <repo> \
  --include-code \
  --out /tmp/links.json
```

Useful flags:
- `--include-code` — scan URLs in code comments (usually you want this)
- `--extensions .md,.mdx,.rst,.txt` — restrict to specific doc types
- `--exclude dist,examples/legacy` — skip specific directories (on top of the sensible defaults it already skips: `node_modules`, `.git`, `dist`, `build`, `target`, `vendor`, `.venv`, etc.)

The output is a JSON document with one entry per link occurrence. Each entry has `url`, `text` (the anchor text, when present), `file`, `line`, `col`, `context` (the surrounding lines), `kind` (which syntax produced it: `md-inline`, `md-ref`, `md-autolink`, `md-image`, `rst-link`, `bare`, `comment-url`, etc.), and `link_type` (`external`, `relative`, `anchor`, `mailto`, `other`).

Peek at the link count and the breakdown before moving on. If it's under a few hundred links, you're fine; if it's thousands, flag to the user that external checking will take a few minutes.

### Step 2 — Check each link

```bash
uv run <this-skill-dir>/scripts/check_links.py /tmp/links.json \
  --out /tmp/report.json \
  --cache /tmp/.link_cache.json
```

What it does:
- **External** (`http://`, `https://`) — HEAD request first, falls back to GET if the server returns 403/405/501. Follows redirects and records the chain. Results are cached (pass `--cache` to control location) so re-runs don't re-hit the network.
- **Relative** — resolves the path against the source file's directory (or repo root if it starts with `/`) and verifies the target exists. If the link has a `#fragment`, also verifies a matching heading exists in the target.
- **Anchor-only** (`#section`) — verifies the fragment matches a heading in the same file.
- **mailto:** — skipped (noted in the report).

Headings are matched using GitHub's slug algorithm: lowercase, strip punctuation, spaces → hyphens. This is what GitHub, GitLab, and most markdown renderers use. Note: **Sphinx and some RST-based generators use different anchor rules** — if the repo is obviously Sphinx-based (has `conf.py`, `.rst` everywhere), mention this caveat in the final report.

Useful flags:
- `--deep` — for external links, fetch the full body (capped at 200KB) and extract `<title>` + H1–H3 headings. This takes longer but enables real contextual checking. **Don't enable deep by default** — it multiplies network load. Turn it on only for the second pass (see Step 4) or when the user explicitly asks.
- `--concurrency 8` — how many external requests in flight at once. Bump it up for big repos on fast networks; drop it for sites that rate-limit.
- `--timeout 15` — per-request timeout.
- `--no-cache` — skip the cache (for forced re-checks).
- `--user-agent "..."` — override the UA string if a site blocks the default.

The summary at the top of the report groups links by status: `ok`, `broken`, `redirected`, `anchor-missing`, `skipped`, `unknown`.

### Step 3 — Triage the structural results

Before reading target pages for context, walk through what the checker found. Sort by severity:

1. **`broken` (external)** — genuinely dead. Record the HTTP status and the error.
2. **`broken` (relative)** — file doesn't exist. Usually a moved/renamed/deleted file. Sometimes a typo.
3. **`anchor-missing`** — the file exists but the heading doesn't. The `headings` field in the check result lists what DOES exist, which is often enough to suggest a fix (e.g. the heading was renamed from "Setup" to "Installation").
4. **`redirected`** — not necessarily wrong, but often worth updating. A redirect from HTTP to HTTPS is fine; a redirect from `/old-docs/x` to `/docs/x` means the link should be updated. Note the pattern and flag notable ones.
5. **`unknown`** — transient failures (DNS, timeout). Consider re-running the checker for these with a longer timeout before treating them as broken.

Group results by source file so the user can see which docs are worst-hit.

### Step 4 — Contextual correctness (the hard part)

A link can pass Step 3 (it resolves, the anchor exists) and still be wrong — pointing at an outdated version of a page, at the wrong section, at a page whose title/subject no longer matches what the surrounding prose promises. This is what the user means by "correct in context."

**Shallow check (default).** For each `ok` link, compare the link text (and a sentence of surrounding context) to the target's identifying label:
- External link, deep mode was run: compare to `<title>` and H1.
- Relative link to another repo file: compare to the file's first H1, or to the heading just under the fragment if one is present. You can read the file directly — this is cheap.
- Anchor-only link: compare the link text to the heading itself.

Shallow check mismatches worth flagging:
- Link text says "the API reference" but the target's title is "Installation Guide."
- Link text says "see the v2 migration notes" but the target page is titled "v3 migration notes."
- Link text references a specific concept ("rate limiting") and the target page is about something unrelated ("authentication").

Shallow misses are usually false alarms when the link text is generic ("see here", "this page", "click here"). Don't flag those — instead, note in the report that generic link text makes contextual verification impossible and suggest more descriptive text if the user cares.

**Deep check (on request, or for suspicious cases).** Fetch the target page's content and read it. For external links, this means re-running `check_links.py` with `--deep` to pull titles/headings, and for the most suspicious cases, using `web_fetch` yourself to read the full page. For relative links, just read the target file.

Then ask: does the surrounding context's claim hold up when you look at what the target actually says?

**Example — shallow pass, deep fail:**

> "For rate limiting details, see the [API guide](https://example.com/api)."

Shallow: link text "API guide", target title "API Guide" → match, passes.
Deep: page is about endpoints and auth; there's no rate limiting section anywhere → contextual mismatch.

**Example — deep pass:**

> "See [issue #42](https://github.com/org/repo/issues/42) for the discussion of the memory leak."

Deep: fetch the issue, confirm the title/body talk about a memory leak → context is correct.

When to escalate from shallow to deep automatically:
- The shallow check flagged a mismatch, but the link text is specific enough that it's worth verifying before reporting.
- The surrounding context makes a specific technical claim ("as shown in X"), and the user has asked for a thorough audit.
- The user explicitly asked for a deep check.

When NOT to escalate:
- The link text is generic ("here", "this", "docs").
- The repo has thousands of external links (the network cost is too high; ask the user if they want to narrow the scope).

### Step 5 — Produce the report

The report has a consistent structure so users can skim or drill in:

```markdown
# Link audit: <repo>

## Summary
- Scanned N files, found M links
- ✅ ok: X · ⚠️ redirected: Y · ❌ broken: Z · ❓ anchor-missing: W · ⏭ skipped: V
- Contextual mismatches flagged: K

## Broken links (❌)
Grouped by source file. For each:
- File + line number
- Link text and URL
- What went wrong (HTTP status / "file not found" / etc.)
- Suggested fix if one is obvious

## Missing anchors (❓)
For each:
- File + line, link text, URL
- Available headings in the target (from the check result)
- Best-guess replacement

## Redirects worth updating (⚠️)
Only include notable ones — permanent URL changes, org renames, etc.
Don't flood the report with trivial http→https redirects unless the user asked.

## Contextual mismatches
The judgment calls from Step 4. Each one shows:
- The source line with context
- The link
- What the target actually contains
- Why it's a mismatch
- Suggested fix or "needs human review"

## Generic link text
Links whose text is too generic to verify contextually ("here", "this", "click here").
Not a bug; a quality suggestion.
```

Keep the report in a file (`link-audit.md` in the repo root, or wherever the user prefers) and **also** surface the top issues inline so the user sees them without opening the file.

### Step 6 — Fixes (opt-in, confirmation required)

After presenting the report, offer to fix things. Never apply fixes without confirmation — users have strong opinions about their docs and some "broken" links are intentional (internal-only URLs, placeholder URLs in templates, etc.).

Offer fixes in tiers so the user can pick what they trust:

1. **Safe fixes** — renamed anchors where the new heading is an unambiguous match (e.g. `#installation` → `#install` and only one heading is close). These are near-certain to be right.
2. **Likely fixes** — permanent redirects where the server tells us the canonical URL. The new URL is what the server itself is pointing at, but the content might've changed, so ask first.
3. **Needs review** — broken external links, contextual mismatches, file not found errors where the user probably moved or renamed something. Don't guess — ask.

When applying fixes:
- Edit the exact file + line using the available edit tool. Don't rewrite whole files.
- Preserve the link's surrounding syntax (reference-style vs. inline, angle brackets, etc.) by matching what's already there.
- Show a diff before writing, and confirm.
- After applying, re-run the checker on just the edited files to confirm the fixes stuck.

## Edge cases and gotchas

- **Sphinx anchors**: Sphinx uses `:ref:` and generates its own anchor IDs based on section labels, not heading text. If the repo uses Sphinx, GitHub-style slug matching will false-positive as broken. Note this in the report and offer to skip `.rst` anchor checking, or point the user at a Sphinx-specific tool like `sphinx-lint`.
- **Versioned URLs**: Links like `/v2.3/foo` may be intentional pins. Don't auto-update these to the latest version without asking.
- **Placeholder URLs**: Templates often have `https://example.com` or `https://your-org.com/docs`. These will 404 but are intentional. If you see many links to the same example-looking domain, ask the user before marking them broken.
- **Private/internal URLs**: Intranet links, staging servers, localhost. Will look broken from outside the user's network. Ask about this if the repo has many failing links to the same private-looking host.
- **Rate limiting**: If external checks start returning 429 or timing out, drop `--concurrency` and/or increase `--timeout`, then re-run on just the failures. The cache means you won't re-check the ones that already succeeded.
- **Huge repos**: For repos with thousands of links, warn the user up front, default to shallow, skip code comments unless asked, and offer to scope down to `docs/` or the most-read files.
- **Badge/nested links**: Nested markdown links like `[![alt](img)](url)` (common in README badges) may not be fully extracted by the regex-based parser. If the report seems to miss badge links, check them manually.
- **Images**: `![alt](path)` is treated like a relative link and checked for existence. We don't verify the image content is what the alt text says — that's outside scope.

## Reminders

- Cache is your friend — use `--cache /tmp/.link_cache.json` to keep the cache out of the repo working tree. Don't pass `--no-cache` unless you actually want to re-hit the network.
- Be polite to external servers — the script already rate-limits per host, but if you're checking a lot of links to one place (say, internal GitHub wiki pages), think about whether you could fetch them through a different mechanism.
- The contextual check is judgment-heavy. When in doubt, flag it as "needs human review" rather than asserting a mismatch. False positives erode trust in the report faster than false negatives.
- Report writing matters as much as the check itself. A 300-entry JSON dump isn't useful; a 20-line summary with the 5 worst problems and suggested fixes is.
