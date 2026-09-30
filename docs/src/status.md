# Status

**experimental** — corpus and tooling evolve with the agent ecosystem.

## Implemented

| Workflow | Status | Notes |
|---|---|---|
| Distilled-prompt pipeline | stable | validate-distilled, sync-manifest, lifecycle marks |
| skills/ catalog export | stable | skills.sh format, freshness-gated in CI |
| pi-package export | stable | skills + prompt templates |
| Security audit | stable | supply-chain scan (incitaciones-8am) |
| Pointer compilation | beta | compiled-pointers doctrine, /skill: aliases |
| Trace analysis | beta | multi-tool trace exports, insight artifacts |
| Nucleus roundtrips | experimental | compile/decompile comparison harness |
| Site build | stable | GitHub Pages via site/build.sh |

## In progress

- Standardization rollout (docs structure, conformance) — tracked under
  dulce-de-leche epic DDL-u8x.

## Documented standard deviations (§0.3)

incitaciones is a skill/pnpm package, not a Rust CLI. Deviations from the
ecosystem standard, per docs/standardization.md:

- **No Cargo/mdBook CI parity**: `ci.yml` runs `just ci` (content, links,
  headers, distilled gate, catalog freshness) instead of Rust checks.
- **Release slot**: npm publish (`npm-publish.yml`) instead of `release.yml`
  with the 5-target binary matrix — npm artifact, no binaries.
- **Docs slot**: `docs.yml` deploys the site built by `site/build.sh`
  (hand-rolled static site), not a stock mdBook build.
- **§4 dogfood matrix**: consumes pretender/wai/ddl via planned pins in
  `versions.ddl.toml` (no openspec column per §4).

## Dogfooding

- **whisper** keeps a thin pointer to incitaciones' whisper skill
  (`turu skill install` output)
- **session/renew skill** reads distilled prompts from this corpus at runtime
- incitaciones' own CI validates the corpus end-to-end via `just ci`
