# Report Template

Structure the final output by mode. All modes share the closing sections. Keep maps as tables/Mermaid — diff-able artifacts.

## Header (all modes)

```
## Cartography — <target>
**Entry zoom level:** macro | meso | micro
**Scope covered:** <paths examined>
```

## Mode: macro

1. **Module inventory** — table (module, path, responsibility, deps out, fan-in)
2. **Dependency matrix** — text DSM with ↑ marks for layer violations
3. **Module graph** — Mermaid, edges labeled with counts
4. Structural observations

## Mode: meso

1. **Parent context** — 2-3 lines: where this module sits in the macro map
2. **Component table** — components, paths, roles, internal links, external ports
3. **Wiring graph** — Mermaid with mechanism-labeled edges
4. Structural observations

## Mode: micro

1. **Entry point** — symbol and file:line
2. **Call chain** — numbered hops with file:line and purity/I-O markers
3. **Data flow** — transformation list from input to outputs/side effects
4. Structural observations

## Mode: health check (additive to any level)

One finding block per pattern (format in `smell-signatures.md`), ordered by severity. If nothing found, state the patterns checked and the evidence gathered — absence of findings without evidence of search is not a result.

## Closing sections (all modes)

**Key Relationships** — top 3-5 dependencies that explain the structure:

```
- web → api (all requests funnel here; 34 call sites)
- ledger ← webhooks (cycle with billing; see observations)
```

**Structural Observations** — facts only, no fixes:

```
- Cycle: billing → webhooks → ledger → billing (3 modules)
- Hotspot: core/ledger.ts imported by 14 modules
- Layer skip: web/cli imports infra/db directly (5 files)
```

**Open Questions** — what the cartographer could not resolve, for human follow-up:

```
- Is the billing → ledger edge intentional or legacy? (no test covers it)
```

**Adjacent levels offered** — one line each, e.g. "meso map of ledger available on request".

## Optional HTML Export

Produce only on request ("export as HTML", "shareable report"). The markdown report is the source of truth; the HTML files are a derived, regenerable view — never hand-edit them, regenerate them from the markdown.

The export is a **self-contained directory**: all pages plus shared assets under one folder, opening correctly via `file://`, offline, with no server, CDN at view time, or build step. JavaScript is permitted only as a local vendored asset (see Diagrams).

### Output directory

- All exports live in `docs/cartography/` (create directories as needed). If `docs/` does not already exist in the repo, confirm once with the user before creating it.
- Pages reference assets with relative paths (`assets/...`), never absolute or remote URLs.

### Files

- One page per report: `cartography-<level>-<target>.html` (e.g. `cartography-meso-payments-billing.html`; slugify the target with hyphens, no dots or spaces). The zoom level in the name prevents exports of different levels overwriting each other. Re-exporting the same level+target overwrites the previous file — intended; there is no history.
- `index.html` — regenerated on every export; never hand-maintained.
- `assets/mermaid.min.js` — vendored Mermaid v9.4.3 IIFE build, shared by all pages.

### Index

Regenerate `index.html` on every export from what is on disk plus what is known this session:

- Scan `docs/cartography/*.html` (excluding `index.html`), group entries by zoom level (macro / meso / micro / health), sorted alphabetically.
- Each entry links to the page and shows its target plus a one-line scope taken from the report header.
- Also list markdown reports known to this session (the artifact of record), linked with a repo-relative path from the HTML location. Do not invent paths for reports you cannot locate.
- The template must handle N=1 (a single entry) without looking broken.
- Deterministic: sorted, no timestamps, no generator metadata.

### Navigation

- Every page (including `index.html`) has a plain nav header: `← Index` plus links to parent-context and adjacent-level pages when they exist (meso → its macro page; micro → its macro/meso parent). Relative links only.
- Static links only — no interactivity. Do not evolve the export into an application — no servers, frameworks, or interactive controls. If live interaction is requested, note it is out of scope for this skill.

### Diagrams

- Render Mermaid client-side with the vendored local asset: `<script src="assets/mermaid.min.js"></script>` plus `<pre class="mermaid">` blocks. Use only the v9.x IIFE build (global `mermaid`); v10+ is ESM-only and is blocked by CORS under `file://`.
- Asset acquisition: on the first export, download `mermaid.min.js` v9.4.3 into `assets/` if absent (e.g. from jsDelivr); reuse thereafter. If the download fails (offline machine), still emit all pages — diagrams degrade to their source in a styled `<pre>` and the report footer notes "diagrams show source; rerun the export with network access to enable rendering". Never fail the whole export because of assets.
- Every diagram keeps its Mermaid source in `<details><pre class="mermaid-source">` as the no-JS fallback, so nothing is ever blank.
- Prose stays pre-rendered HTML — do not client-render markdown. The markdown report remains the artifact of record.

### Invariants

- **Mirror, don't redesign:** same sections, same order, same content as the markdown report. The HTML adds presentation only (readable typography; `prefers-color-scheme` support optional).
- **Deterministic:** stable section order, no timestamps, no generator metadata.
- **Size guard:** render large reports as-is; never paginate, collapse, or add interactivity.
- **Commit-able:** reports and `assets/` are self-contained and offline-safe; suggest committing them, never silently gitignore.

Decision record: diagrams use a vendored local Mermaid v9.4.3 IIFE; prose is pre-rendered. Rationale: offline rendering, `file://` compatibility, no ESM/CORS issues.
