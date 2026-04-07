# Incitaciones - Justfile
# AI-friendly command automation

# List all available commands
default:
    @just --list

# Create new content from template
new TYPE NAME:
    #!/usr/bin/env bash
    set -euo pipefail
    DATE=$(date +%Y-%m-%d)
    SLUG=$(echo "{{NAME}}" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
    DISTILLED=""

    if [ -z "$SLUG" ]; then
        echo "Error: Invalid name results in empty slug." >&2
        exit 1
    fi

    case "{{TYPE}}" in
        prompt)
            FILE="content/prompt-task-${SLUG}.md"
            TEMPLATE="content/template-prompt.md"
            DISTILLED="content/distilled/${SLUG}.md"
            ;;
        research)
            FILE="content/research-finding-${SLUG}.md"
            TEMPLATE="content/template-research.md"
            ;;
        example)
            FILE="content/example-${SLUG}.md"
            TEMPLATE="content/template-example.md"
            ;;
        *)
            echo "Unknown type: {{TYPE}}"
            echo "Valid types: prompt, research, example"
            exit 1
            ;;
    esac

    if [ -f "$FILE" ]; then
        echo "File already exists: $FILE"
        exit 1
    fi

    if [ -n "$DISTILLED" ] && [ -f "$DISTILLED" ]; then
        echo "Distilled file already exists: $DISTILLED"
        exit 1
    fi

    # Copy template and update dates
    cp "$TEMPLATE" "$FILE"
    sed -i "s/\[YYYY-MM-DD\]/$DATE/g" "$FILE"
    sed -i "s/\[Human Readable Title\]/{{NAME}}/g" "$FILE"
    sed -i "s/# \[Title\]/# {{NAME}}/g" "$FILE"

    echo "Created: $FILE"
    if [ -n "$DISTILLED" ]; then
        {
            echo "<!-- Full version: $FILE -->"
            echo "[Distilled prompt goes here. Keep only the instructions needed at runtime.]"
        } > "$DISTILLED"
        echo "Created: $DISTILLED"
    fi

    echo "Edit with: \$EDITOR $FILE"
    if [ -n "$DISTILLED" ]; then
        echo ""
        echo "Next steps:"
        echo "  1. Edit both files"
        echo "  2. Add a manifest entry in content/manifest.json"
        echo "  3. Run just validate-distilled"
        echo "  4. Run just sync-manifest"
    fi

# Interactive search with fzf (preview enabled)
search:
    #!/usr/bin/env bash
    set -euo pipefail

    if ! command -v fzf &> /dev/null; then
        echo "Error: fzf is not installed"
        echo "Install with: sudo dnf install fzf  # or your package manager"
        exit 1
    fi

    cd content
    FILE=$(find . -name '*.md' -not -name 'template-*.md' | \
        sed 's|^\./||' | \
        fzf --preview 'bat --style=numbers --color=always {} 2>/dev/null || cat {}' \
            --preview-window=right:60%:wrap \
            --height=100% \
            --header='Select file to view (Enter to open in editor, Esc to cancel)' \
            --bind 'ctrl-/:toggle-preview')

    if [ -n "$FILE" ]; then
        ${EDITOR:-vim} "$FILE"
    fi

# Find content by keyword (searches filename, title, and tags)
find TERM:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "Searching for: {{TERM}}"
    echo ""

    # Search in filenames
    echo "=== Files matching '{{TERM}}' ==="
    find content -name "*{{TERM}}*.md" -not -name 'template-*.md' | sed 's|content/||' || true
    echo ""

    # Search in frontmatter and content
    echo "=== Content matching '{{TERM}}' ==="
    grep -H -i -n "{{TERM}}" content/*.md 2>/dev/null | grep -v template || echo "No content matches found"
    echo ""

# Find prompts by tag
find-tag TAG:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "Files tagged with: {{TAG}}"
    echo ""
    grep -l "tags:.*{{TAG}}" content/*.md 2>/dev/null | grep -v template | sed 's|content/||' || echo "No files found"

# Find content for specific tool
find-tool TOOL:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "Content for: {{TOOL}}"
    echo ""
    grep -l "tools:.*{{TOOL}}" content/*.md 2>/dev/null | grep -v template | sed 's|content/||' || echo "No files found"

# List all drafts (status: draft)
list-drafts:
    @echo "Draft content:"
    @grep -l "status: draft" content/*.md 2>/dev/null | grep -v template | sed 's|content/||' || echo "No drafts"

# List all tested content (status: tested)
list-tested:
    @echo "Tested content:"
    @grep -l "status: tested" content/*.md 2>/dev/null | grep -v template | sed 's|content/||' || echo "No tested content"

# List all verified content (status: verified)
list-verified:
    @echo "Verified content:"
    @grep -l "status: verified" content/*.md 2>/dev/null | grep -v template | sed 's|content/||' || echo "No verified content"

# Show files related to a specific file
show-related FILE:
    #!/usr/bin/env bash
    set -euo pipefail

    if [ ! -f "content/{{FILE}}" ]; then
        echo "File not found: content/{{FILE}}"
        exit 1
    fi

    echo "Files related to: {{FILE}}"
    echo ""

    # Extract related field from frontmatter
    RELATED=$(sed -n '/^related:/,/^[a-z]/p' "content/{{FILE}}" | grep -E '^\s*-' | sed 's/^\s*-\s*//' || true)

    if [ -z "$RELATED" ]; then
        echo "No related files listed"
    else
        echo "$RELATED"
    fi

# Validate all content files against repository metadata rules
validate:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "Validating content files..."
    echo ""

    ERRORS=0
    WARNINGS=0
    REQUIRED_FIELDS=("title" "type" "tags" "status" "created" "updated" "version" "source")
    VALID_STATUSES_REGEX='^(draft|tested|verified)$'

    for file in content/*.md; do
        # Skip templates
        if [[ "$file" == *"template-"* ]]; then
            continue
        fi

        BASENAME=$(basename "$file")
        FRONTMATTER=$(awk '
            BEGIN { in_frontmatter = 0; started = 0 }
            /^---$/ {
                if (started == 0) {
                    started = 1
                    in_frontmatter = 1
                    next
                }
                if (in_frontmatter == 1) {
                    exit
                }
            }
            in_frontmatter == 1 { print }
        ' "$file")

        if [ -z "$FRONTMATTER" ]; then
            echo "❌ $BASENAME: missing frontmatter block"
            ERRORS=$((ERRORS + 1))
            continue
        fi

        # Check for required frontmatter fields
        for field in "${REQUIRED_FIELDS[@]}"; do
            if ! printf '%s\n' "$FRONTMATTER" | grep -q "^${field}:"; then
                echo "❌ $BASENAME: missing field '$field'"
                ERRORS=$((ERRORS + 1))
            fi
        done

        STATUS=$(printf '%s\n' "$FRONTMATTER" | sed -n 's/^status:[[:space:]]*//p' | head -1)
        if [ -n "$STATUS" ] && ! printf '%s\n' "$STATUS" | grep -Eq "$VALID_STATUSES_REGEX"; then
            echo "❌ $BASENAME: invalid status '$STATUS' (expected draft|tested|verified)"
            ERRORS=$((ERRORS + 1))
        fi

        TAGS_LINE=$(printf '%s\n' "$FRONTMATTER" | sed -n 's/^tags:[[:space:]]*\[\(.*\)\]/\1/p' | head -1)
        if [ -n "$TAGS_LINE" ]; then
            TAG_COUNT=$(printf '%s\n' "$TAGS_LINE" | tr ',' '\n' | sed '/^[[:space:]]*$/d' | wc -l)
            if [ "$TAG_COUNT" -lt 3 ]; then
                echo "❌ $BASENAME: expected at least 3 tags"
                ERRORS=$((ERRORS + 1))
            fi
        fi

        # Check if related files exist
        RELATED=$(printf '%s\n' "$FRONTMATTER" | sed -n '/^related:/,/^[a-z]/p' | grep -E '^\s*-' | sed 's/^\s*-\s*//' || true)
        if ! printf '%s\n' "$FRONTMATTER" | grep -q '^related:'; then
            echo "⚠️  $BASENAME: missing related field"
            WARNINGS=$((WARNINGS + 1))
        fi
        while IFS= read -r related_file; do
            if [ -n "$related_file" ] && [ ! -f "content/$related_file" ]; then
                echo "❌ $BASENAME: related file not found: $related_file"
                ERRORS=$((ERRORS + 1))
            fi
        done <<< "$RELATED"
    done

    if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
        echo "✅ All files valid!"
    elif [ $ERRORS -eq 0 ]; then
        echo ""
        echo "Warnings: $WARNINGS"
        echo "✅ No validation errors"
    else
        echo ""
        [ $WARNINGS -gt 0 ] && echo "Warnings: $WARNINGS"
        echo "Found $ERRORS validation error(s)"
        exit 1
    fi

# Show repository statistics
stats:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "Repository Statistics"
    echo "===================="
    echo ""

    TOTAL=$(find content -name '*.md' -not -name 'template-*.md' | wc -l)
    PROMPTS=$(find content -name 'prompt-*.md' | wc -l)
    RESEARCH=$(find content -name 'research-*.md' | wc -l)
    EXAMPLES=$(find content -name 'example-*.md' | wc -l)

    DRAFTS=$(grep -l "status: draft" content/*.md 2>/dev/null | wc -l || echo "0")
    TESTED=$(grep -l "status: tested" content/*.md 2>/dev/null | wc -l || echo "0")
    VERIFIED=$(grep -l "status: verified" content/*.md 2>/dev/null | wc -l || echo "0")

    echo "Content:"
    echo "  Total files:     $TOTAL"
    echo "  Prompts:         $PROMPTS"
    echo "  Research:        $RESEARCH"
    echo "  Examples:        $EXAMPLES"
    echo ""
    echo "Status:"
    echo "  Draft:           $DRAFTS"
    echo "  Tested:          $TESTED"
    echo "  Verified:        $VERIFIED"
    echo ""

    # Most common tags
    echo "Top tags:"
    grep -h "^tags:" content/*.md 2>/dev/null | \
        grep -v template | \
        sed 's/tags: \[//;s/\]//' | \
        tr ',' '\n' | \
        sed 's/^ *//;s/ *$//' | \
        sort | uniq -c | sort -rn | head -5 || echo "  No tags yet"

# Update CHANGELOG with new entry
changelog MESSAGE:
    #!/usr/bin/env bash
    set -euo pipefail
    DATE=$(date +%Y-%m-%d)

    # Create temp file with new entry
    echo "## [Unreleased]" > /tmp/changelog_new
    echo "" >> /tmp/changelog_new
    echo "### $(date +%Y-%m-%d)" >> /tmp/changelog_new
    echo "" >> /tmp/changelog_new
    echo "- {{MESSAGE}}" >> /tmp/changelog_new
    echo "" >> /tmp/changelog_new

    # Append existing changelog (skip first "Unreleased" section)
    if [ -f CHANGELOG.md ]; then
        sed '1,/^## /d' CHANGELOG.md >> /tmp/changelog_new
    fi

    mv /tmp/changelog_new CHANGELOG.md
    echo "Updated CHANGELOG.md"

# Mark a file as tested
mark-tested FILE:
    #!/usr/bin/env bash
    set -euo pipefail
    if [ ! -f "content/{{FILE}}" ]; then
        echo "File not found: content/{{FILE}}"
        exit 1
    fi
    sed -i 's/status: draft/status: tested/' "content/{{FILE}}"
    sed -i "s/updated: .*/updated: $(date +%Y-%m-%d)/" "content/{{FILE}}"
    echo "Marked as tested: {{FILE}}"

# Mark a file as verified
mark-verified FILE:
    #!/usr/bin/env bash
    set -euo pipefail
    if [ ! -f "content/{{FILE}}" ]; then
        echo "File not found: content/{{FILE}}"
        exit 1
    fi
    sed -i 's/status: tested/status: verified/' "content/{{FILE}}"
    sed -i 's/status: draft/status: verified/' "content/{{FILE}}"
    sed -i "s/updated: .*/updated: $(date +%Y-%m-%d)/" "content/{{FILE}}"
    echo "Marked as verified: {{FILE}}"

# Check for broken links in related fields
check-links:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "Checking for broken links..."
    echo ""

    BROKEN=0

    for file in content/*.md; do
        # Skip templates
        if [[ "$file" == *"template-"* ]]; then
            continue
        fi

        BASENAME=$(basename "$file")

        # Extract and check related files
        RELATED=$(sed -n '/^related:/,/^[a-z]/p' "$file" | grep -E '^\s*-' | sed 's/^\s*-\s*//' || true)
        while IFS= read -r related_file; do
            if [ -n "$related_file" ] && [ ! -f "content/$related_file" ]; then
                echo "❌ $BASENAME → $related_file (not found)"
                BROKEN=$((BROKEN + 1))
            fi
        done <<< "$RELATED"
    done

    if [ $BROKEN -eq 0 ]; then
        echo "✅ No broken links!"
    else
        echo ""
        echo "Found $BROKEN broken link(s)"
        exit 1
    fi

# Clean up: remove files marked for deletion
clean:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "The following backup files will be deleted:"
    find content -name "*.bak" -o -name "*~"
    echo ""
    read -p "Are you sure you want to delete these files? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        find content -name "*.bak" -delete
        find content -name "*~" -delete
        echo "Backup files removed."
    else
        echo "Clean up cancelled."
    fi

# Initialize a new references file
new-references CATEGORY:
    #!/usr/bin/env bash
    set -euo pipefail
    DATE=$(date +%Y-%m-%d)
    FILE="content/references-{{CATEGORY}}.md"

    if [ -f "$FILE" ]; then
        echo "File already exists: $FILE"
        exit 1
    fi

    {
        echo "---"
        echo "title: References - {{CATEGORY}}"
        echo "type: references"
        echo "category: {{CATEGORY}}"
        echo "created: $DATE"
        echo "updated: $DATE"
        echo "version: 1.0.0"
        echo "---"
        echo ""
        echo "# References - {{CATEGORY}}"
        echo ""
        echo "## Academic Papers"
        echo ""
        echo "- [Paper Title](URL) - Brief description"
        echo ""
        echo "## Articles & Blog Posts"
        echo ""
        echo "- [Article Title](URL) - Brief description"
        echo ""
        echo "## Documentation"
        echo ""
        echo "- [Tool/Framework](URL) - Official documentation"
        echo ""
        echo "## Discussions & Forums"
        echo ""
        echo "- [Discussion Title](URL) - Brief description"
        echo ""
        echo "## Videos & Talks"
        echo ""
        echo "- [Video Title](URL) - Brief description"
        echo ""
        echo "## Tools & Resources"
        echo ""
        echo "- [Tool Name](URL) - Brief description"
    } > "$FILE"

    echo "Created: $FILE"
    echo "Edit with: \$EDITOR $FILE"

# ============================================================
# Site Build
# ============================================================

# Build the GitHub Pages site locally
build-site:
    bash site/build.sh

# Serve the built site locally for preview
serve-site: build-site
    cd _site && python3 -m http.server 8080

# ============================================================
# Skills Installation
# ============================================================

# Install prompts as Claude Code skills (default) or legacy commands
install *ARGS:
    ./install.sh {{ARGS}}

# List distilled prompts (source content for skills)
list-distilled:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "Distilled prompts in content/distilled/:"
    echo ""
    ls content/distilled/*.md 2>/dev/null | while read -r file; do
        name=$(basename "$file" .md)
        lines=$(wc -l < "$file")
        echo "  $name ($lines lines)"
    done
    echo ""
    TOTAL=$(ls content/distilled/*.md 2>/dev/null | wc -l)
    echo "Total: $TOTAL prompts"

# Analyze exported traces from multiple agent tools
analyze-traces PATH *ARGS:
    node scripts/analyze-traces.js {{PATH}} {{ARGS}}

# Analyze traces from common local CLI history locations
analyze-traces-auto *ARGS:
    node scripts/analyze-traces.js --auto-detect {{ARGS}}

# Validate distilled prompts
validate-distilled:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "Validating distilled prompts..."
    echo ""

    ERRORS=0
    WARNINGS=0

    for file in content/distilled/*.md; do
        name=$(basename "$file" .md)
        issues=""

        # Check 1: No YAML frontmatter
        if head -1 "$file" | grep -q "^---$"; then
            issues="$issues [has frontmatter]"
            ERRORS=$((ERRORS + 1))
        fi

        # Check 2: No metadata sections (When to Use, Example, Notes, References)
        if grep -Eq "^##\s+(When to Use|Example|Notes|References|Version History)" "$file"; then
            issues="$issues [has metadata sections]"
            ERRORS=$((ERRORS + 1))
        fi

        # Check 3: Reasonable length (not empty, not too short)
        lines=$(wc -l < "$file")
        if [ "$lines" -lt 5 ]; then
            issues="$issues [too short: $lines lines]"
            ERRORS=$((ERRORS + 1))
        fi

        # Check 4: Contains instruction keywords
        if ! grep -Eiq "(step|task|process|your|analyze|create|review|focus|output)" "$file"; then
            issues="$issues [missing instruction keywords]"
            WARNINGS=$((WARNINGS + 1))
        fi

        # Check 5: No nested code block wrappers (````markdown)
        if grep -q "^\`\`\`\`" "$file"; then
            issues="$issues [has nested code blocks]"
            WARNINGS=$((WARNINGS + 1))
        fi

        if [ -n "$issues" ]; then
            echo "  ❌ $name:$issues"
        else
            echo "  ✓ $name"
        fi
    done

    echo ""
    if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
        echo "✅ All distilled prompts valid!"
    else
        [ $ERRORS -gt 0 ] && echo "Errors: $ERRORS"
        [ $WARNINGS -gt 0 ] && echo "Warnings: $WARNINGS"
        [ $ERRORS -gt 0 ] && exit 1
    fi

# Show distilled vs source comparison
compare-distilled NAME:
    #!/usr/bin/env bash
    set -euo pipefail

    DISTILLED="content/distilled/{{NAME}}.md"

    # Find corresponding source file
    SOURCE=$(jq -r --arg name "{{NAME}}" '.prompts[] | select(.name == $name) | .source' content/manifest.json 2>/dev/null)

    if [ -z "$SOURCE" ] || [ "$SOURCE" = "null" ]; then
        echo "Could not find source file for: {{NAME}}"
        echo "Available prompts:"
        jq -r '.prompts[].name' content/manifest.json 2>/dev/null | sort
        exit 1
    fi

    if [ ! -f "$DISTILLED" ]; then
        echo "Distilled file not found: $DISTILLED"
        exit 1
    fi

    if [ ! -f "$SOURCE" ]; then
        echo "Source file not found: $SOURCE"
        exit 1
    fi

    SRC_LINES=$(wc -l < "$SOURCE")
    DST_LINES=$(wc -l < "$DISTILLED")
    REDUCTION=$(echo "scale=0; 100 - ($DST_LINES * 100 / $SRC_LINES)" | bc)

    echo "Comparison for: {{NAME}}"
    echo "  Source:    $SOURCE ($SRC_LINES lines)"
    echo "  Distilled: $DISTILLED ($DST_LINES lines)"
    echo "  Reduction: $REDUCTION%"
    echo ""

    if command -v delta &> /dev/null; then
        delta "$SOURCE" "$DISTILLED"
    elif command -v diff &> /dev/null; then
        diff --color=auto -u "$SOURCE" "$DISTILLED" | head -100
    fi

# Show bundle contents
list-bundles:
    #!/usr/bin/env bash
    set -euo pipefail

    if [ ! -f content/manifest.json ]; then
        echo "Manifest not found: content/manifest.json"
        exit 1
    fi

    echo "Available bundles:"
    echo ""

    jq -r '.bundles | to_entries[] | select(.key != "all") | .key' content/manifest.json | while read -r bundle; do
        desc=$(jq -r --arg b "$bundle" '.bundles[$b].description' content/manifest.json)
        count=$(jq -r --arg b "$bundle" '.bundles[$b].prompts | length' content/manifest.json)
        echo "  $bundle ($count prompts)"
        echo "    $desc"
        echo "    Prompts:"
        jq -r --arg b "$bundle" '.bundles[$b].prompts[]' content/manifest.json | while read -r p; do
            echo "      - $p"
        done
        echo ""
    done

    TOTAL=$(jq '.prompts | length' content/manifest.json)
    echo "  all ($TOTAL prompts)"
    echo "    Complete collection of all prompts"

# Validate manifest file references and update version to today's date; sync to _site/
sync-manifest:
    #!/usr/bin/env bash
    set -euo pipefail

    MANIFEST="content/manifest.json"
    SITE_MANIFEST="_site/manifest.json"

    if [ ! -f "$MANIFEST" ]; then
        echo "Manifest not found: $MANIFEST"
        exit 1
    fi

    if ! command -v jq &> /dev/null; then
        echo "Error: jq is required (install via your package manager)"
        exit 1
    fi

    ERRORS=0

    # Check all source files referenced in manifest exist
    echo "Source files:"
    while IFS= read -r source; do
        if [ ! -f "$source" ]; then
            echo "  ❌ missing: $source"
            ERRORS=$((ERRORS + 1))
        else
            echo "  ✓ $source"
        fi
    done < <(jq -r '.prompts[].source' "$MANIFEST")

    echo ""

    # Check all distilled files referenced in manifest exist
    echo "Distilled files:"
    while IFS= read -r distilled; do
        if [ ! -f "$distilled" ]; then
            echo "  ❌ missing: $distilled"
            ERRORS=$((ERRORS + 1))
        else
            echo "  ✓ $distilled"
        fi
    done < <(jq -r '.prompts[].distilled' "$MANIFEST")

    echo ""

    # Fail if prompt files on disk are not registered in the manifest.
    ORPHANS=0
    for file in content/prompt-*.md; do
        if ! jq -e --arg f "$file" '.prompts[] | select(.source == $f)' "$MANIFEST" > /dev/null 2>&1; then
            echo "  ❌ unregistered source: $file"
            ORPHANS=$((ORPHANS + 1))
        fi
    done
    for file in content/distilled/*.md; do
        if ! jq -e --arg f "$file" '.prompts[] | select(.distilled == $f)' "$MANIFEST" > /dev/null 2>&1; then
            echo "  ❌ unregistered distilled: $file"
            ORPHANS=$((ORPHANS + 1))
        fi
    done

    if [ $ERRORS -gt 0 ] || [ $ORPHANS -gt 0 ]; then
        echo ""
        [ $ERRORS -gt 0 ] && echo "$ERRORS missing file(s) — fix before updating version."
        [ $ORPHANS -gt 0 ] && echo "$ORPHANS unregistered prompt file(s) — add them to the manifest before updating version."
        exit 1
    fi

    # Update version to today
    TODAY=$(date +%Y-%m-%d)
    CURRENT=$(jq -r '.version' "$MANIFEST")
    if [ "$CURRENT" != "$TODAY" ]; then
        jq --arg date "$TODAY" '.version = $date' "$MANIFEST" > /tmp/manifest_tmp.json
        mv /tmp/manifest_tmp.json "$MANIFEST"
        echo "version: $CURRENT → $TODAY"
    else
        echo "version: $TODAY (already current)"
    fi

    # Sync to _site/
    if [ -f "$SITE_MANIFEST" ]; then
        cp "$MANIFEST" "$SITE_MANIFEST"
        echo "synced: $SITE_MANIFEST"
    fi

    echo ""
    echo "✅ Manifest OK"

# Preview what a generated SKILL.md would look like for a prompt
generate-skill NAME:
    #!/usr/bin/env bash
    set -euo pipefail

    DISTILLED="content/distilled/{{NAME}}.md"

    if [ ! -f "$DISTILLED" ]; then
        echo "Distilled file not found: $DISTILLED"
        echo "Available prompts:"
        ls content/distilled/*.md 2>/dev/null | xargs -n1 basename | sed 's/\.md$//' | sort
        exit 1
    fi

    DESC=$(jq -r --arg name "{{NAME}}" '.prompts[] | select(.name == $name) | .description // "Incitaciones prompt: {{NAME}}"' content/manifest.json 2>/dev/null)

    echo "---"
    echo "name: {{NAME}}"
    echo "description: $DESC"
    echo "disable-model-invocation: true"
    echo "---"
    echo ""
    cat "$DISTILLED"
