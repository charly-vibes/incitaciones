# Visual Docs & Cross-Repo Ecosystems: Diagrams, Fleet Maps & Rendered-Output Smoke

Methodology for documentation that covers pictures and ecosystems: diagrams
that survive static-site deploys, responsibility maps for multi-repo fleets,
and smoke checks that verify what readers' browsers actually render. Mined
from the 2026-10 ddl and specodelic docs work; evidence in
`.wai/resources/reflections/docs-skill-survey-2026-10.org` (row `iio`).
Canonical theory: `content/research-documentation-frameworks.md`.

The 2026-10 evidence: both failure classes are invisible to link checkers.
Specodelic shipped mermaid graphs that silently rendered as raw text on the
live site (`graph-views.html`) while passing every source-side check. Ddl
solved fleet navigation with a single responsibility-map SVG whose blocks
link into each project's own docs. The fixes are: prefer static pre-rendered
SVG over runtime mermaid on static sites; give each fleet layer one
responsibility map and each fleet-wide page exactly one home; after deploy,
smoke rendered behavior — not just reachability.

## 1. Diagrams: Prefer Static SVG Over Runtime Mermaid on Static-Site Books

The specodelic precedent: mermaid diagrams embedded as code blocks render
fine in the GitHub web UI (GitHub runs its own mermaid pipeline) but fail on
a self-hosted static-site book unless the site generator loads the mermaid
runtime — and that runtime is exactly the kind of third-party JS that breaks
quietly (CSP blocks, plugin version drift, JS load failures on cache-warm
pages). The `graph-views.html` incident shipped graphs as raw `graph TD`
text to every reader while the build stayed green, because nothing in the
pipeline executes a browser.

Rule: on a static-site book, prefer **pre-rendered SVG committed to the repo**
over runtime mermaid. SVG needs no JavaScript, renders in every browser and
PDF pipeline, and fails loudly (missing file → broken image) rather than
silently. If a diagram must stay in sync with code, close the loop with a
build step rather than by hoping:

- keep the mermaid (or dot, or similar) **source** in the repo next to the
  page that embeds its rendered SVG;
- regenerate the SVG in the docs build (or a stamp step, in the sense of
  `docs-accuracy.md` §2) and fail the build when the committed SVG is stale;
- never hand-edit the SVG — it is generated output, exactly like a stamped
  artifact.

When runtime rendering is unavoidable (e.g. diagrams are author-written
content), smoke the rendered page (§3) so a dead mermaid runtime fails CI,
not a reader.

Rules:

- Static SVG first; runtime mermaid only with a rendered-output smoke.
- Every embedded diagram has a source in the repo and a build step that
  regenerates it — a diagram no one can regenerate is a liability.
- Color-coding and clickable regions (see §2) belong in the SVG itself, so
  they survive without JS.
- Diagram alt text names what the diagram claims, not what it depicts
  ("Layers of the X ecosystem and which repo owns each", not "Diagram").

## 2. Cross-Repo (Fleet) Docs: One Responsibility Map, One Home Per Page

The ddl precedent (`cbfa300`): a multi-repo ecosystem is unreadable until
someone draws it. Ddl built an ecosystem **responsibility map** — an SVG
with color-coded layers, one block per project, each block a clickable link
into that project's own docs. A reader landing on any repo's docs can answer
"what is this part, what is it responsible for, and where is the rest?"
without reading six READMEs.

The pattern has three pieces:

1. **A responsibility map per layer** (or one map with visible layers):
   every block names a component, its one-line responsibility, and links to
   the owning project's docs. Color-code by layer (runtime, tooling,
   content, infra) so the map is scannable before it is readable. Place the
   map in the hub repo's ecosystem page and mirror nothing — links, not
   copies.
2. **Per-repo setup pages follow one shared template.** Each project's docs
   cover its own setup with the same section skeleton (install → configure →
   verify), so a reader moving between repos never re-learns the page
   shape. The template lives once, referenced by each repo's docs; per-repo
   pages differ only in content, never in structure.
3. **Fleet-wide pages live in exactly one repo.** Pages that describe the
   ecosystem as a whole — the umbrella install page, the architecture
   overview, the compatibility matrix — live in the hub repo. Duplicating a
   fleet-wide page into each member repo guarantees staleness in all but
   one copy; member repos link to the hub page instead. The responsibility
   map's links are the navigation layer that makes "one home" viable.

Rules:

- One responsibility map, in the hub, linking out — never a fleet diagram
  copied per repo.
- If a fact spans repos, either it lives in a hub fleet-wide page or it
  lives per-repo behind a stable link — never both.
- Every member repo's docs start by locating themselves: one sentence plus
  a link to the responsibility map.
- A shared setup template is enforced by review, not copy-paste: when the
  template changes, a drift audit (see `review-documentation`) checks the
  member pages.

## 3. Deployed-vs-Source Smoke: Verify Rendered Behavior, Not Just Links

The reachability layer is `docs-accuracy.md` §3 (live-site smoke: curl the
deployed URL, fail on non-2xx and soft-404s). This smoke builds **on** that
one: reachability is necessary but not sufficient, because the two 2026-10
incidents were fully reachable pages rendering wrong. Smoke what readers'
browsers actually receive and execute.

Smoke shape (runs after the reachability smoke, in the same pipeline):

1. **JS executes without errors.** Fetch the deployed page the way a browser
   would (a headless browser or a smoke script that asserts no console
   errors) on at least one page that loads JavaScript. A site whose search
   widget throws on load is broken in a way `curl -f` cannot see.
2. **Diagrams and graphs render.** For pages embedding diagrams, assert the
   rendered output, not the source: either the generated SVG is fetched and
   non-empty, or the JS-rendered graph container holds rendered nodes (not
   the raw mermaid text). This is the check the `graph-views.html` incident
   would have failed.
3. **The search index builds and serves.** Fetch the search index artifact
   the client would fetch, assert non-empty and parseable, and query it for
   a term from the newest page. A stale or empty index ships green through
   every link checker.

Rules:

- Smoke the rendered URL, not the build artifact — the point is the thing a
  reader's browser gets.
- Assertions stay minimal per check (one marker per failure mode); this is a
  smoke, not an end-to-end test suite.
- Run it in the deploy pipeline, after reachability, so a bad deploy fails
  before anyone moves on.
- Any content class that needs a JS runtime to be correct (diagrams, search,
  widgets) must appear in at least one rendered-behavior assertion.
