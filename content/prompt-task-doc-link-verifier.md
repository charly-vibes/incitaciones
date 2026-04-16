---
title: Documentation Link Verifier
type: prompt
subtype: task
tags: [documentation, links, verification, broken-links, link-rot, audit, qa]
tools: [claude-code, cursor, gemini, aider]
status: draft
created: 2026-04-16
updated: 2026-04-16
version: 1.0.0
related: [prompt-task-review-documentation.md, prompt-task-research-documentation.md]
source: original
---

# Documentation Link Verifier

## When to Use

Use this prompt to audit a repository's documentation for link problems -- both broken links and links that resolve but point to the wrong thing.

**Best for:**
- **Link rot audits:** Finding dead links (404s), missing file paths, broken anchors in documentation.
- **Contextual correctness:** Detecting links that resolve but don't match what the surrounding text claims -- the subtler, more damaging kind that survives every automated dead-link checker.
- **Documentation hygiene:** Periodic sweeps of docs, READMEs, code comments for stale URLs.
- **Migration verification:** After reorganizing docs or renaming files, verifying all internal links still work.

**Do NOT use for:**
- Checking links inside compiled/generated output (run on source, not build artifacts).
- Deep content accuracy auditing beyond link targets -- use the verification-diagnostician for that.
- Image content verification -- the skill checks image paths exist but not what the images show.

**Prerequisites:**
- Repository with documentation files (markdown, MDX, rST, or plain text)
- `uv` (scripts use PEP 723 inline metadata — `uv run` handles dependencies automatically)
- Network access for checking external URLs

## How It Works

The skill operates in two phases:

1. **Extraction** -- walks the repo tree, pulls out every link (markdown inline, reference-style, autolinks, rST, bare URLs, code-comment URLs) with surrounding context. Output is a JSON file.
2. **Checking** -- for each link, verifies it resolves (external: HTTP request, relative: file exists, anchors: heading match). Produces a structured report.

A third phase (contextual correctness) uses LLM judgment to compare link text against what the target actually contains.

## The Prompt

This is a multi-file skill with bundled Python scripts. The distilled version at `content/distilled/doc-link-verifier/SKILL.md` is the runtime procedure; the scripts in `content/distilled/doc-link-verifier/scripts/` do the extraction and checking.

The workflow:
1. Run `extract_links.py` to walk the repo and produce a JSON file of every link with context.
2. Run `check_links.py` to verify each link (HTTP, relative path, anchor). Produces a structured report.
3. Triage structural results (broken, redirected, anchor-missing, unknown).
4. Contextual correctness check — compare link text to target content (shallow or deep).
5. Produce a human-readable report grouped by severity.
6. Offer tiered fixes (safe / likely / needs review) with confirmation before applying.

<!-- Full version: content/distilled/doc-link-verifier/SKILL.md -->
