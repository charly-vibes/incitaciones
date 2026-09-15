# Contextual correctness — full criteria

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
