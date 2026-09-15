# Link audit report template

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
