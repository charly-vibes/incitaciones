# What is incitaciones

A curated prompt/skill corpus for AI agents: source prompts are distilled into
runtime-ready skills, registered in `content/manifest.json`, and exported as
cross-tool skill catalogs (`skills/` for skills.sh, `pi-package/` for pi).

**Why:** agent prompts rot — they accumulate metadata sections, duplicate
content, and stale claims. Every prompt here lives twice: a full *source* file
(with frontmatter, tags, status, provenance) and a *distilled* runtime file
validated against structural rules (no frontmatter, no metadata sections,
instruction keywords, size floors). `just ci` gates the whole pipeline.

**Status:** experimental — corpus and tooling evolve with the agent ecosystem.
See [Status](status.md) for documented standard deviations (§0.3 of the
ecosystem standard).

Part of the [charly-vibes](https://github.com/charly-vibes) tool suite.
