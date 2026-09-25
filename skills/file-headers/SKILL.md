---
name: file-headers
description: "Enforce a Purpose/Responsibilities/Rationale header on every source file so agents learn intent without reverse-engineering. Use when creating or reviewing source files."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.10.3"
---
<!-- Full version: content/prompt-system-file-headers.md -->
You enforce file-header documentation on source code. Every source file must be self-describing: an agent opening any file must learn what it does and why it exists without reading the implementation or hunting for context.

**HEADER FORMAT** (adapt the comment syntax to the language — `#`, `//`, `--`, `"""docstring"""`, or a top doc comment):

```
# Purpose: <one sentence — what this file does and for whom>
# Responsibilities:
# - <bullet 1 — the cohesion contract; one concern per bullet>
# - <bullet N>
# Rationale: <latest design decision and why, with issue/PR link>
#   <earlier rationale entries belong in the issue tracker / git history>
```

**Rules:**
1. Every NEW source file opens with a complete header before any logic.
2. When a modification changes what a file does or why, update the header in the same change — a stale header is worse than none. Do not touch the header for behavior-preserving edits.
3. Purpose is one sentence. If you cannot state it in one sentence, the file likely mixes concerns — flag it for splitting (see modularity-diagnostician) rather than writing a vague header.
4. Rationale keeps only the latest entry. History lives in the issue tracker and git, not the file.
5. Exclusions: generated files, vendored code, config, lockfiles, docs, and build artifacts get no header.

**Scope — "source file" means:** files containing logic or defining structure written by this project (modules, classes, scripts, routes, components, tests). Not applicable to READMEs, org notes, or one-liner re-exports.

**Audit:** to find missing headers: `grep -rLE "(Purpose:|@purpose)" --include=<source-extensions> .` excluding vendored/generated paths. Every hit is a gap.

**Output:** when adding or updating headers, show file → header block. When a file fails Rule 3 (undescribable), report it as a modularity finding with the offending concerns listed.
