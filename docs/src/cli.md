# Workflows

incitaciones is a skill/pnpm package, not a Rust CLI — the workflow surface is
`just` recipes and npm scripts. Full list: `just --list`.

## Content

| Recipe | What |
|---|---|
| `new TYPE NAME` | scaffold source + distilled skeletons (prompt/research/example) |
| `validate` | frontmatter + status + tags + related links over all content |
| `validate-distilled` | structural gate on distilled runtime files |
| `check-links` | broken `related:` links |
| `header-audit` | File Headers convention over scripts |
| `security-audit` | supply-chain scan of the skill corpus |
| `sync-manifest` | full manifest validation + version bump |
| `mark-tested / mark-verified` | status lifecycle transitions |

## Packaging

| Recipe | What |
|---|---|
| `generate-skills-dir` / `validate-skills-dir` | committed skills/ catalog (skills.sh format) |
| `generate-pi-resources` / `validate-pi-package` | pi-package skills + prompt templates |
| `install` | cross-tool skill installation |
| `npm publish` | release slot (npm-publish.yml workflow) |

## Analysis

| Recipe | What |
|---|---|
| `analyze-traces` / `analyze-traces-auto` | exported agent-tool traces |
| `trace-insights` | insight artifacts into .cache/trace-insights/ |
| `nucleus-roundtrip` / `compare-nucleus` | Nucleus lambda compile/decompile roundtrips |
| `compare-distilled NAME` | distilled vs source diff + reduction % |
