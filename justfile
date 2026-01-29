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

    if [ -z "$SLUG" ]; then
        echo "Error: Invalid name results in empty slug." >&2
        exit 1
    fi

    case "{{TYPE}}" in
        prompt)
            FILE="content/prompt-task-${SLUG}.md"
            TEMPLATE="content/template-prompt.md"
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

    # Copy template and update dates
    cp "$TEMPLATE" "$FILE"
    sed -i "s/\[YYYY-MM-DD\]/$DATE/g" "$FILE"
    sed -i "s/\[Human Readable Title\]/{{NAME}}/g" "$FILE"
    sed -i "s/# \[Title\]/# {{NAME}}/g" "$FILE"

    echo "Created: $FILE"
    echo "Edit with: \$EDITOR $FILE"

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

# Validate all content files (check metadata completeness)
validate:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "Validating content files..."
    echo ""

    ERRORS=0
    REQUIRED_FIELDS=("title" "type" "tags" "status" "created" "version")

    for file in content/*.md; do
        # Skip templates
        if [[ "$file" == *"template-"* ]]; then
            continue
        fi

        BASENAME=$(basename "$file")

        # Check for required frontmatter fields
        for field in "${REQUIRED_FIELDS[@]}"; do
            if ! grep -q "^${field}:" "$file"; then
                echo "❌ $BASENAME: missing field '$field'"
                ERRORS=$((ERRORS + 1))
            fi
        done

        # Check if related files exist
        RELATED=$(sed -n '/^related:/,/^[a-z]/p' "$file" | grep -E '^\s*-' | sed 's/^\s*-\s*//' || true)
        while IFS= read -r related_file; do
            if [ -n "$related_file" ] && [ ! -f "content/$related_file" ]; then
                echo "⚠️  $BASENAME: related file not found: $related_file"
            fi
        done <<< "$RELATED"
    done

    if [ $ERRORS -eq 0 ]; then
        echo "✅ All files valid!"
    else
        echo ""
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
# Distilled Prompts Commands
# ============================================================

# Install prompts to Claude Code commands directory
install *ARGS:
    ./install.sh {{ARGS}}

# List distilled prompts
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

    for bundle in essentials planning reviews; do
        desc=$(jq -r ".bundles.$bundle.description" content/manifest.json)
        count=$(jq -r ".bundles.$bundle.prompts | length" content/manifest.json)
        echo "  $bundle ($count prompts)"
        echo "    $desc"
        echo "    Prompts:"
        jq -r ".bundles.$bundle.prompts[]" content/manifest.json | while read -r p; do
            echo "      - $p"
        done
        echo ""
    done

    TOTAL=$(jq '.prompts | length' content/manifest.json)
    echo "  all ($TOTAL prompts)"
    echo "    Complete collection of all prompts"
