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

Produce only on request ("export as HTML", "shareable report"). The markdown report is the source of truth; the HTML file is a derived, regenerable view — never hand-edit it, regenerate it from the markdown.

Produce ONE self-contained file, `cartography-<level>-<target>.html` (e.g. `cartography-meso-payments-billing.html`; slugify the target with hyphens), next to the markdown report — or, if no report file was written this session, ask the user where to save it (default `docs/`). The zoom level in the name prevents exports of different levels overwriting each other.

- **Self-contained:** one inline `<style>` block. No CDN, no external CSS/JS/fonts, no build step, no server. Must open correctly offline.
- **No JavaScript:** diagrams render as styled `<pre>` blocks (text diagrams) or inline SVG producible without new dependencies. Keep the Mermaid source in the file (e.g. `<pre class="mermaid-source">`) so the diagram stays manipulable.
- **Mirror, don't redesign:** same sections, same order, same content as the markdown report. The HTML adds presentation only (readable typography; `prefers-color-scheme` support optional).
- **Deterministic:** stable section order, no timestamps, no generator metadata.
- **Size guard:** render large reports as-is; never paginate, collapse, or add interactivity.

Do not evolve the export into an application — no servers, frameworks, or interactive controls. If live interaction is requested, note it is out of scope for this skill.
