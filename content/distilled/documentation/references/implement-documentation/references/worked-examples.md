# Worked Examples & Expected Output

Methodology for tutorial, quickstart, and example-page content. Mined from the
2026-10 docs work (specodelic packs: `data.lineage`, `numeric.predicates`,
`empirical.registry`); evidence in `.wai/resources/reflections/docs-skill-survey-2026-10.org`.
Canonical theory: `content/research-documentation-frameworks.md`.

## 1. The Worked-Example Pattern (one thread, not N snippets)

Examples were the #1 documentation gap in the 2026-10 survey. The failure mode
was not "too few examples" but **disconnected examples**: N one-off snippets that
each demonstrate a feature in isolation. Learners cannot see how features
compose, and maintainers cannot tell which examples are stale.

The fix is a single **evolving example thread**: one project that grows across
every example page, each page building on the previous state.

Thread shape (adapt per product):

1. **Install** — prerequisites, install command, expected output.
2. **First command** — smallest useful action, expected output, exit code.
3. **Verification** — post-install verification block (see §2).
4. **Realistic failure** — a failure a real first-time user hits, shown verbatim, with recovery.
5. **Recovery + next feature** — fix it, then extend the same project with the next feature.

Rules:

- **One continuous project.** Page N+1 imports or extends the artifact built on page N. Name it explicitly ("in the `inventory` project from the previous example…").
- **Each page stands alone in *task*, not in *state*.** A reader can jump in if they follow a one-line "start from" pointer, but never re-explains earlier steps.
- **Realistic failure over toy failure.** Mine real user conversations or support logs for the failure to show; a fabricated typo error teaches nothing.
- **Show the failure verbatim** — the actual error text, not a paraphrase — so learners can match it against their own terminal.

## 2. The Quickstart Rule (expected output everywhere)

Every command shown in a tutorial, quickstart, or how-to must show its expected
output and exit code. Two components:

**a. Expected output per command.**

```bash
$ spk explain data.lineage
lineage: tracks how records flow between datasets
```

Exit code 0. If the command can fail realistically, the recovery goes inline
right after (see the Tutorial template in `references/templates.md`).

**b. Post-install verification block.** Every install path ends with the
tool's own self-check — never "it should now work":

```bash
$ spk --version
spk 0.4.1
$ spk explain --list
data.lineage  numeric.predicates  empirical.registry  ...
```

Rules:

- Output shown must be **actual captured output**, not invented prose. If the docs are executable, the gate re-runs the commands and diffs against what you wrote — invented output fails.
- Prefer the tool's self-check (`--version`, `explain`, `--list`) over existence checks (`which`, `ls`) — a binary can exist and still be broken.
- Normalize volatile output (versions, timestamps, hashes) only if the docs pipeline documents the normalization.
- Exit codes: show them when a command is known to fail in realistic conditions, so learners can grep their terminal against the doc.

## 3. The Example Coverage Matrix (checklist, not tooling)

After writing example pages, produce a coverage matrix mapping every
user-facing feature (pack, command, module, endpoint) to at least one example
page. Keep it a plain table or checklist in the docs or the tracker — do not
build tooling for it; the audit is the point.

| Feature | Example page | Thread position |
| :--- | :--- | :--- |
| [feature/command 1] | [path to example] | 1 (install) |
| [feature/command 2] | [path to example] | 3 (first command) |
| [feature/command 3] | *(uncovered)* | — |

Rules:

- **Every row needs ≥1 example page or an explicit "(uncovered)".** Uncovered rows become follow-up tickets immediately — do not let them linger as implicit debt.
- **One row per user-facing feature**, from the user's vocabulary, not the internal module graph.
- **Thread position** records where the feature appears in the evolving example, exposing which pages are doing double duty and which features are stranded outside the thread.
- Re-run the matrix check after each release; new features enter with a row, not an apology.
