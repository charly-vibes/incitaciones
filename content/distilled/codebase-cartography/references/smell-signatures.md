# Anti-Pattern Signatures — Agent-Computable Proxies

Structural health check. Each anti-pattern from the visual framework is reduced to evidence an agent can gather by search and counting. Report findings; do not propose fixes unless explicitly asked.

## Report Format (per finding)

```
[PATTERN] severity: high|medium|low
Evidence: file:line list or matrix marks
Quantity: loop members / fan-out count / depth / ratio
```

Severity scales with blast radius: fan-out count, number of affected modules, loop size.

## Signature Catalog

### Circular Dependencies

- **Proxy:** closed loops in the module or component graph. Build the dependency list (see `zoom-levels.md` macro), then trace: if A → B → … → A exists, report the full loop.
- **Quick scan:** mutual imports between two files (`rg` for A importing B, then B importing A); module-pair matrix marks both ways.
- **Severity:** loop spanning multiple top-level modules > intra-module pair.

### God Object

- **Proxy:** one file/class with extreme fan-in AND fan-out, plus size. Check: file length (`wc -l`), count of exported methods/attributes, count of distinct importers (`rg -l "from .*<module>" | wc -l`), count of its own imports.
- **Thresholds:** relative to the repo baseline — flag when a file is ~3× the median size AND importers are ~3× the median. State the baseline numbers used. In tiny repos (< ~10 files of the same kind), the median is meaningless — fall back to absolute judgment (e.g., one file dominating all coupling) and label the weak baseline.
- **Severity:** grows with importer count (every change touches all of them).

### Shotgun Surgery

- **Proxy:** one concept scattered across many modules. Pick a domain concept from the target question (e.g., "invoice", "permissions") and count modules containing references to it: `rg -l "<concept>" | cut -d/ -f1-2 | sort -u | wc -l`.
- **Severity:** grows with module count and with coupling between the scattered sites (do they import each other or duplicate?).

### Feature Envy

- **Proxy:** a module imports another module far more than its own internals. Count both sides and compare — imports of the foreign module: `rg -c "from .*<moduleX>" moduleA/`; imports resolving inside moduleA (relative `./` imports): `rg -c "from '\./" moduleA/`. Flag when the foreign count exceeds the local count by ~2× or more.
- **Severity:** medium when it is one direction; high when the envying module is otherwise nearly disconnected from its own parent.

### Deep Inheritance

- **Proxy:** chains of `extends`/subclassing beyond ~3 levels: `rg "extends "` then follow each chain. Report max depth and the chain.
- **Severity:** medium; flag deepest chain only, not every chain.

### Pure/Impure Entanglement (functional codebases)

- **Proxy:** business-logic functions directly performing I/O (network, DB, filesystem, clock, randomness) instead of receiving results as parameters. Verify by reading the call chain at micro level: mark the first impure hop and whether logic continues after it.
- **Severity:** high when the same file mixes domain rules and I/O calls repeatedly (report count).

### Broken Composition (layer-skipping)

- **Proxy:** dependencies that bypass an architectural interface layer — e.g., web module importing infra directly instead of going through the api/service layer. Visible as ↑ marks in the macro matrix (a dependency pointing against the repo's declared or evident layering).
- **Severity:** scales with how many files take the shortcut.

## Interpretation Rules

- One finding per pattern per target; list all instances under Evidence.
- If the pattern is suspected but evidence is thin, say "suspected, evidence: <what's missing>" instead of asserting.
- Findings are facts about structure. The user decides what to do with them.
