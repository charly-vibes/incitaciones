#!/usr/bin/env bash
# site/build.sh — Generate static site for GitHub Pages
# Produces _site/ with llms.txt, llms-full.txt, and all content files.
# Dependencies: bash, jq
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANIFEST="$REPO_ROOT/content/manifest.json"
SITE="$REPO_ROOT/_site"

# ------------------------------------------------------------------
# Prerequisites
# ------------------------------------------------------------------
if ! command -v jq &>/dev/null; then
  echo "Error: jq is required but not installed." >&2
  exit 1
fi

if [ ! -f "$MANIFEST" ]; then
  echo "Error: manifest.json not found at $MANIFEST" >&2
  exit 1
fi

# ------------------------------------------------------------------
# Clean & create output directory
# ------------------------------------------------------------------
rm -rf "$SITE"
mkdir -p "$SITE/content/distilled"

# ------------------------------------------------------------------
# Copy static files
# ------------------------------------------------------------------
cp "$REPO_ROOT/install.sh"      "$SITE/install.sh"
cp "$REPO_ROOT/README.md"       "$SITE/README.md"
cp "$REPO_ROOT/CONTRIBUTING.md" "$SITE/CONTRIBUTING.md"
cp "$REPO_ROOT/AGENTS.md"       "$SITE/AGENTS.md"
[ -f "$REPO_ROOT/CHANGELOG.md" ] && cp "$REPO_ROOT/CHANGELOG.md" "$SITE/CHANGELOG.md"

# Copy content tree (all .md files, preserving distilled/ subdir)
for f in "$REPO_ROOT"/content/*.md; do
  [ -f "$f" ] && cp "$f" "$SITE/content/"
done
for f in "$REPO_ROOT"/content/distilled/*.md; do
  [ -f "$f" ] && cp "$f" "$SITE/content/distilled/"
done

# Copy manifest
cp "$MANIFEST" "$SITE/manifest.json"

# Disable Jekyll
touch "$SITE/.nojekyll"

# ------------------------------------------------------------------
# Helper: look up a prompt field from manifest
# ------------------------------------------------------------------
prompt_field() {
  local name="$1" field="$2"
  jq -r --arg n "$name" --arg f "$field" \
    '.prompts[] | select(.name == $n) | .[$f] // empty' "$MANIFEST"
}

# ------------------------------------------------------------------
# Generate llms.txt
# ------------------------------------------------------------------
LLMS="$SITE/llms.txt"

cat > "$LLMS" <<'HEADER'
# Incitaciones

> A curated library of reusable prompts and skills for CLI LLM tools
> (Claude Code, Amp, Gemini CLI, Cursor, Windsurf, Zed). Install all
> skills with `./install.sh --global` or browse individual prompts below.
> Each prompt has a full version (documented, with examples) and a
> distilled version (token-optimized, for direct use).

## Getting Started

- [README](README.md): Quick start, install options, and meta-prompt for organizing your own prompts
- [Install Script](install.sh): Shell script to install skills — `./install.sh --global --bundle essentials`
- [Contributing Guide](CONTRIBUTING.md): How to create, test, and submit new prompts
- [Repository Structure](AGENTS.md): File naming conventions, workflow, and quality standards

## How to Build a Prompt or Skill

- [Prompt Template](content/template-prompt.md): Required frontmatter, sections, and format for new prompts
- [Research Template](content/template-research.md): Template for research documentation
- [Distill Prompt](content/prompt-task-distill-prompt.md): Create lean, token-efficient versions of prompts
- [Verify Distilled Prompt](content/prompt-task-verify-distilled-prompt.md): Validate distilled prompts preserve intent
- [Extract Prompt](content/prompt-workflow-extract-prompt-from-conversation.md): Turn successful interactions into reusable prompts
- [Install Commands Meta-Prompt](content/meta-prompt-install-commands.md): How the installation system works
HEADER

# --- Bundle sections ---
for bundle in essentials planning reviews; do
  bundle_desc=$(jq -r ".bundles.$bundle.description" "$MANIFEST")
  # Capitalize first letter for H2
  bundle_title="$(echo "$bundle" | sed 's/./\U&/')"
  printf '\n## %s Bundle\n\n' "$bundle_title" >> "$LLMS"
  printf '> %s\n\n' "$bundle_desc" >> "$LLMS"

  jq -r ".bundles.$bundle.prompts[]" "$MANIFEST" | while read -r name; do
    title=$(prompt_field "$name" "title")
    desc=$(prompt_field "$name" "description")
    source=$(prompt_field "$name" "source")
    distilled=$(prompt_field "$name" "distilled")
    printf -- '- [%s](%s): %s' "$title" "$source" "$desc" >> "$LLMS"
    if [ -n "$distilled" ]; then
      printf ' — [distilled](%s)' "$distilled" >> "$LLMS"
    fi
    printf '\n' >> "$LLMS"
  done
done

# --- Prompts not in any named bundle ---
printf '\n## All Other Prompts\n\n' >> "$LLMS"

# Collect all bundle prompt names into a temp file for filtering
bundle_names=$(jq -r '.bundles | to_entries[] | select(.key != "all") | .value.prompts[]' "$MANIFEST" | sort -u)

jq -r '.prompts[].name' "$MANIFEST" | while read -r name; do
  if echo "$bundle_names" | grep -qx "$name"; then
    continue
  fi
  title=$(prompt_field "$name" "title")
  desc=$(prompt_field "$name" "description")
  source=$(prompt_field "$name" "source")
  distilled=$(prompt_field "$name" "distilled")
  printf -- '- [%s](%s): %s' "$title" "$source" "$desc" >> "$LLMS"
  if [ -n "$distilled" ]; then
    printf ' — [distilled](%s)' "$distilled" >> "$LLMS"
  fi
  printf '\n' >> "$LLMS"
done

# --- Research section ---
printf '\n## Research\n\n' >> "$LLMS"

for f in "$REPO_ROOT"/content/research-*.md; do
  [ -f "$f" ] || continue
  fname="$(basename "$f")"
  # Extract title from frontmatter
  title=$(sed -n 's/^title: *//p' "$f" | head -1)
  if [ -z "$title" ]; then
    # Fallback: use filename
    title="$fname"
  fi
  printf -- '- [%s](content/%s)\n' "$title" "$fname" >> "$LLMS"
done

# --- Optional section ---
cat >> "$LLMS" <<'FOOTER'

## Optional

- [Manifest](manifest.json): Machine-readable JSON registry of all prompts, bundles, and metadata
- [Changelog](CHANGELOG.md): Version history
FOOTER

# ------------------------------------------------------------------
# Generate llms-full.txt
# ------------------------------------------------------------------
FULL="$SITE/llms-full.txt"

{
  # 1. Project overview
  printf '# Incitaciones — Full Content for LLMs\n\n'
  printf 'This file contains everything an LLM needs to understand, use, and extend\n'
  printf 'the incitaciones prompt library in a single fetch.\n\n'
  printf '%s\n\n' '---'
  printf '## Project Overview\n\n'
  cat "$REPO_ROOT/README.md"
  printf '\n\n---\n\n'

  # 2. How to construct a prompt/skill
  printf '## How to Create a New Prompt\n\n'
  printf '### Contributing Guidelines (structure & quality standards)\n\n'
  cat "$REPO_ROOT/CONTRIBUTING.md"
  printf '\n\n---\n\n'
  printf '### Prompt Template\n\n'
  cat "$REPO_ROOT/content/template-prompt.md"
  printf '\n\n---\n\n'

  # 3. All distilled prompts
  printf '## All Distilled Prompts\n\n'
  printf 'These are the token-optimized versions ready for direct use as skills.\n\n'

  jq -r '.prompts[] | "\(.name)\t\(.title)\t\(.description)\t\(.distilled)"' "$MANIFEST" | \
  while IFS=$'\t' read -r name title desc distilled_path; do
    if [ -z "$distilled_path" ] || [ ! -f "$REPO_ROOT/$distilled_path" ]; then
      continue
    fi
    printf '### %s — %s\n\n' "$title" "$desc"
    printf '> Skill name: `%s`\n\n' "$name"
    cat "$REPO_ROOT/$distilled_path"
    printf '\n\n---\n\n'
  done

  # 4. Manifest data
  printf '## Manifest (JSON)\n\n'
  printf '```json\n'
  cat "$MANIFEST"
  printf '\n```\n'

} > "$FULL"

# ------------------------------------------------------------------
# Generate index.html — lightweight landing page listing all prompts
# ------------------------------------------------------------------
INDEX="$SITE/index.html"

cat > "$INDEX" <<'HTML_HEAD'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Incitaciones — Reusable Prompts for CLI LLM Tools</title>
<style>
  :root { --bg: #fafafa; --fg: #222; --muted: #666; --accent: #1a73e8; --border: #ddd; }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #1a1a1a; --fg: #ddd; --muted: #999; --accent: #8ab4f8; --border: #333; }
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--fg);
         max-width: 52rem; margin: 0 auto; padding: 2rem 1rem; line-height: 1.5; }
  h1 { margin-bottom: .25rem; }
  .subtitle { color: var(--muted); margin-bottom: 2rem; }
  h2 { margin-top: 2rem; margin-bottom: .5rem; border-bottom: 1px solid var(--border); padding-bottom: .25rem; }
  .bundle-desc { color: var(--muted); font-size: .9rem; margin-bottom: .75rem; }
  ul { list-style: none; padding: 0; }
  li { padding: .35rem 0; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  .desc { color: var(--muted); }
  .links { font-size: .85rem; }
  .sep { color: var(--border); margin: 0 .25rem; }
  footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid var(--border);
           color: var(--muted); font-size: .85rem; }
  footer a { color: var(--muted); }
  code { font-size: .9em; background: var(--border); padding: .1em .3em; border-radius: 3px; }
</style>
</head>
<body>
<h1>Incitaciones</h1>
<p class="subtitle">Reusable prompts and skills for CLI LLM tools</p>
<p>Install all skills: <code>./install.sh --global</code>
&nbsp;|&nbsp; <a href="llms.txt">llms.txt</a>
&nbsp;|&nbsp; <a href="llms-full.txt">llms-full.txt</a>
&nbsp;|&nbsp; <a href="manifest.json">manifest.json</a></p>
HTML_HEAD

# Bundle sections
for bundle in essentials planning reviews; do
  bundle_desc=$(jq -r ".bundles.$bundle.description" "$MANIFEST")
  bundle_title="$(echo "$bundle" | sed 's/./\U&/')"
  printf '<h2>%s</h2>\n<p class="bundle-desc">%s</p>\n<ul>\n' "$bundle_title" "$bundle_desc" >> "$INDEX"

  jq -r ".bundles.$bundle.prompts[]" "$MANIFEST" | while read -r name; do
    title=$(prompt_field "$name" "title")
    desc=$(prompt_field "$name" "description")
    source=$(prompt_field "$name" "source")
    distilled=$(prompt_field "$name" "distilled")
    printf '<li><a href="%s">%s</a> <span class="desc">— %s</span>' "$source" "$title" "$desc" >> "$INDEX"
    if [ -n "$distilled" ]; then
      printf ' <span class="links">(<a href="%s">distilled</a>)</span>' "$distilled" >> "$INDEX"
    fi
    printf '</li>\n' >> "$INDEX"
  done
  printf '</ul>\n' >> "$INDEX"
done

# Other prompts
printf '<h2>Other Prompts</h2>\n<ul>\n' >> "$INDEX"
jq -r '.prompts[].name' "$MANIFEST" | while read -r name; do
  if echo "$bundle_names" | grep -qx "$name"; then
    continue
  fi
  title=$(prompt_field "$name" "title")
  desc=$(prompt_field "$name" "description")
  source=$(prompt_field "$name" "source")
  distilled=$(prompt_field "$name" "distilled")
  printf '<li><a href="%s">%s</a> <span class="desc">— %s</span>' "$source" "$title" "$desc" >> "$INDEX"
  if [ -n "$distilled" ]; then
    printf ' <span class="links">(<a href="%s">distilled</a>)</span>' "$distilled" >> "$INDEX"
  fi
  printf '</li>\n' >> "$INDEX"
done
printf '</ul>\n' >> "$INDEX"

# Research section
printf '<h2>Research</h2>\n<ul>\n' >> "$INDEX"
for f in "$REPO_ROOT"/content/research-*.md; do
  [ -f "$f" ] || continue
  fname="$(basename "$f")"
  title=$(sed -n 's/^title: *//p' "$f" | head -1)
  [ -z "$title" ] && title="$fname"
  printf '<li><a href="content/%s">%s</a></li>\n' "$fname" "$title" >> "$INDEX"
done
printf '</ul>\n' >> "$INDEX"

# Footer
cat >> "$INDEX" <<'HTML_FOOT'
<footer>
<p><a href="https://github.com/charly-vibes/incitaciones">GitHub</a>
&nbsp;|&nbsp; <a href="README.md">README</a>
&nbsp;|&nbsp; <a href="CONTRIBUTING.md">Contributing</a>
&nbsp;|&nbsp; <a href="AGENTS.md">Agents</a></p>
</footer>
</body>
</html>
HTML_FOOT

# ------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------
llms_lines=$(wc -l < "$LLMS")
full_lines=$(wc -l < "$FULL")
file_count=$(find "$SITE" -type f | wc -l)

echo "Build complete: _site/"
echo "  llms.txt:      $llms_lines lines"
echo "  llms-full.txt: $full_lines lines"
echo "  Total files:   $file_count"
