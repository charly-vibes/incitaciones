# Configuration

## Manifest

`content/manifest.json` is the registry: every prompt's `source`, `distilled`,
name, description, triggers, bundles, and pointer metadata. `just sync-manifest`
validates it (missing files, version consistency, orphans, security audit,
pointer targets, trigger-clause coverage) and bumps the version to today.

## Frontmatter (source files)

Required fields: `title`, `type`, `tags` (≥3), `status` (draft|tested|verified),
`created`, `updated`, `version`, `source`. Optional `related` links (checked by
`just check-links`).

## Distilled files

Structural rules (`just validate-distilled`): no frontmatter, no metadata
sections (When to Use / Example / Notes / Version History), ≥5 lines,
instruction keywords present, no nested code fences. Skills (routers) carry a
`references/` tree validated recursively.

## Global config

`~/.config/whisper/config.toml` governs the knowledge workspace incitaciones
shares with the ecosystem (`turu`); a repo-private `.whisper/config.toml` may
join a group or override the workspace root.
