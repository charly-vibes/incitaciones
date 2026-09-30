# Getting started

## Install as skills

```bash
just install              # install prompts as cross-tool skills (pi, Claude Code, Amp, Gemini CLI, ...)
```

Or via the skills catalog:

```bash
npx skills add charly-vibes/incitaciones
```

## Author a new prompt

```bash
just new prompt "my prompt"        # creates source + distilled skeletons
# edit content/prompt-my-prompt.md (source) and content/distilled/my-prompt.md
just validate-distilled            # structural gate on distilled files
just sync-manifest                 # register + validate + bump manifest version
```

## Rebuild derived artifacts

```bash
just generate-skills-dir           # regenerate the committed skills/ catalog
just generate-pi-resources         # regenerate pi-package/skills + prompts
just validate-skills-dir           # check the catalog is fresh and conformant
just validate-pi-package           # check pi package resources
```

## Status lifecycle

`draft → tested → verified` via `just mark-tested FILE` / `just mark-verified FILE`.
