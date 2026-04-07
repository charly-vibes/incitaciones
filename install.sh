#!/bin/bash
# install.sh - Install incitaciones prompts to .agents/ with tool integrations
# Usage: ./install.sh [--local] [--global] [--bundle NAME] [--dir PATH] [--format FORMAT] [--list] [--uninstall] [--help]

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GIT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "")
DISTILLED_DIR="$SCRIPT_DIR/content/distilled"
MANIFEST_FILE="$SCRIPT_DIR/content/manifest.json"

# Colors (if terminal supports them)
if [ -t 1 ]; then
  GREEN='\033[0;32m'
  YELLOW='\033[0;33m'
  RED='\033[0;31m'
  BLUE='\033[0;34m'
  NC='\033[0m' # No Color
else
  GREEN=''
  YELLOW=''
  RED=''
  BLUE=''
  NC=''
fi

usage() {
  cat << EOF
Usage: $(basename "$0") [OPTIONS]

Install incitaciones prompts to .agents/skills/ with optional tool integrations
for Claude Code, Amp, Gemini CLI, Cursor, Windsurf, and Zed.

Options:
  --local          Install to project .agents/skills/ (default when in a git repo)
  --global         Install to ~/.agents/skills/ (user-wide)
  --bundle NAME    Install only prompts from a specific bundle (see --list)
  --dir PATH       Install to custom directory (overrides --local/--global)
  --format FORMAT  Output format: skills (default) or commands (legacy)
  --list           List available prompts and bundles
  --uninstall      Remove installed prompts and tool integrations
  --help           Show this help message

Examples:
  $(basename "$0")                       # Local install to .agents/skills/
  $(basename "$0") --global              # Global install to ~/.agents/skills/
  $(basename "$0") --bundle essentials   # Install only essential prompts
  $(basename "$0") --format commands     # Install as legacy flat commands
  $(basename "$0") --dir ~/my-skills     # Install to custom directory
  $(basename "$0") --list                # Show available prompts
  $(basename "$0") --uninstall           # Clean up old installations

EOF
}

# Get prompt metadata from manifest.json using jq
get_prompt_description() {
  local name="$1"
  if command -v jq &> /dev/null && [ -f "$MANIFEST_FILE" ]; then
    jq -r --arg n "$name" '.prompts[] | select(.name == $n) | .description // empty' "$MANIFEST_FILE" 2>/dev/null
  fi
}

list_prompts() {
  echo "Available bundles:"
  echo ""

  if command -v jq &> /dev/null && [ -f "$MANIFEST_FILE" ]; then
    jq -r '.bundles | to_entries[] | select(.key != "all") | .key' "$MANIFEST_FILE" | while read -r bundle; do
      desc=$(jq -r --arg b "$bundle" '.bundles[$b].description' "$MANIFEST_FILE")
      echo "  $bundle - $desc"
      jq -r --arg b "$bundle" '.bundles[$b].prompts[]' "$MANIFEST_FILE" 2>/dev/null | while read -r p; do
        pdesc=$(get_prompt_description "$p")
        if [ -n "$pdesc" ]; then
          echo "    - $p — $pdesc"
        else
          echo "    - $p"
        fi
      done
      echo ""
    done
  else
    echo "  (install jq for detailed bundle listing, or see content/manifest.json)"
    echo ""
  fi

  if command -v jq &> /dev/null && [ -f "$MANIFEST_FILE" ]; then
    total=$(jq '.prompts | length' "$MANIFEST_FILE")
  else
    total=$(list_distilled_names | wc -l | tr -d ' ')
  fi

  echo "  all - Complete collection ($total prompts)"
  echo ""
  echo "All available prompts:"
  if command -v jq &> /dev/null && [ -f "$MANIFEST_FILE" ]; then
    jq -r '.prompts[].name' "$MANIFEST_FILE" | sort | while read -r p; do
      pdesc=$(get_prompt_description "$p")
      if [ -n "$pdesc" ]; then
        echo "  - $p — $pdesc"
      else
        echo "  - $p"
      fi
    done
  else
    list_distilled_names | while read -r p; do
      pdesc=$(get_prompt_description "$p")
      if [ -n "$pdesc" ]; then
        echo "  - $p — $pdesc"
      else
        echo "  - $p"
      fi
    done
  fi
}

get_bundle_prompts() {
  local bundle="$1"

  if [ "$bundle" = "all" ]; then
    if command -v jq &> /dev/null && [ -f "$MANIFEST_FILE" ]; then
      jq -r '.prompts[].name' "$MANIFEST_FILE" | tr '\n' ' '
    else
      list_distilled_names | tr '\n' ' '
    fi
    return
  fi

  if command -v jq &> /dev/null && [ -f "$MANIFEST_FILE" ]; then
    local prompts
    prompts=$(jq -r --arg b "$bundle" '.bundles[$b].prompts // empty | .[]' "$MANIFEST_FILE" 2>/dev/null | tr '\n' ' ')
    echo "$prompts"
  fi
}

list_distilled_names() {
  if command -v jq &> /dev/null && [ -f "$MANIFEST_FILE" ]; then
    jq -r '.prompts[].name' "$MANIFEST_FILE"
  else
    find "$DISTILLED_DIR" -maxdepth 2 \( -name "*.md" -o -name "SKILL.md" \) -type f | \
      sed "s|$DISTILLED_DIR/||" | \
      sed 's|/SKILL\.md$||; s|\.md$||' | \
      sort -u
  fi
}

resolve_distilled_path() {
  local name="$1"
  local manifest_path=""

  if command -v jq &> /dev/null && [ -f "$MANIFEST_FILE" ]; then
    manifest_path=$(jq -r --arg n "$name" '.prompts[] | select(.name == $n) | .distilled // empty' "$MANIFEST_FILE" 2>/dev/null)
    if [ -n "$manifest_path" ] && [ -f "$SCRIPT_DIR/$manifest_path" ]; then
      echo "$SCRIPT_DIR/$manifest_path"
      return 0
    fi
  fi

  if [ -f "$DISTILLED_DIR/${name}.md" ]; then
    echo "$DISTILLED_DIR/${name}.md"
    return 0
  fi

  if [ -f "$DISTILLED_DIR/${name}/SKILL.md" ]; then
    echo "$DISTILLED_DIR/${name}/SKILL.md"
    return 0
  fi

  return 1
}

is_multi_file_distilled_path() {
  local path="$1"
  [[ "$path" == */SKILL.md ]]
}

emit_flat_distilled_content() {
  local name="$1"
  local path=""
  local skill_dir=""

  path=$(resolve_distilled_path "$name") || return 1

  cat "$path"

  if is_multi_file_distilled_path "$path"; then
    skill_dir=$(dirname "$path")
    if [ -d "$skill_dir/references" ]; then
      for ref in "$skill_dir"/references/*.md; do
        [ -f "$ref" ] || continue
        printf '\n\n---\n\n'
        printf '## Reference: %s\n\n' "$(basename "$ref")"
        cat "$ref"
      done
    fi
  fi
}

install_canonical_skill() {
  local name="$1"
  local dst_root="$2"
  local path=""
  local src_dir=""
  local dst_dir="$dst_root/$name"
  local dst="$dst_dir/SKILL.md"

  path=$(resolve_distilled_path "$name") || return 1

  rm -rf "$dst_dir"
  mkdir -p "$dst_dir"

  {
    generate_frontmatter "$name"
    cat "$path"
  } > "$dst"

  if is_multi_file_distilled_path "$path"; then
    src_dir=$(dirname "$path")
    find "$src_dir" -maxdepth 1 -mindepth 1 -not -name "SKILL.md" -exec cp -R {} "$dst_dir/" \;
  fi

  return 0
}

copy_skill_tree() {
  local src_dir="$1"
  local dst_dir="$2"

  [ -d "$src_dir" ] || return 1

  rm -rf "$dst_dir"
  mkdir -p "$dst_dir"
  cp -R "$src_dir"/. "$dst_dir/"
}

# Generate YAML frontmatter for a SKILL.md file
generate_frontmatter() {
  local name="$1"
  local description=""

  description=$(get_prompt_description "$name")

  # Fallback description if not found in manifest
  if [ -z "$description" ]; then
    description="Incitaciones prompt: $name"
  fi

  # Escape backslashes and double quotes for YAML double-quoted string
  description_escaped=$(printf '%s' "$description" | sed 's/\\/\\\\/g; s/"/\\"/g')

  echo "---"
  echo "name: $name"
  echo "description: \"$description_escaped\""
  echo "disable-model-invocation: true"
  echo "---"
  echo ""
}

# Generate a TOML command file for Gemini CLI
generate_toml_command() {
  local name="$1"
  local src="$2"
  local description=""

  description=$(get_prompt_description "$name")

  if [ -z "$description" ]; then
    description="Incitaciones prompt: $name"
  fi

  # Escape backslashes and double quotes for TOML double-quoted string
  description_escaped=$(printf '%s' "$description" | sed 's/\\/\\\\/g; s/"/\\"/g')

  echo "description = \"$description_escaped\""
  echo 'prompt = """'
  # Escape backslashes and triple-quote sequences for TOML multi-line string
  # 1. Escape backslashes FIRST (\ -> \\)
  # 2. Escape triple-quotes (""" -> \""" or \"\"\", but \""" is enough)
  sed 's/\\/\\\\/g; s/"""/\\"""/g' "$src"
  echo '"""'
}

# Uninstall installed prompts and tool integrations
do_uninstall() {
  local base="$1"

  # Remove canonical .agents directory
  local agents_skills="$base/.agents/skills"
  local agents_commands="$base/.agents/commands/incitaciones"
  for dir in "$agents_skills" "$agents_commands"; do
    if [ -d "$dir" ]; then
      echo "Removing: $dir"
      rm -rf "$dir"
      echo -e "  ${GREEN}Removed: $dir${NC}"
    fi
  done

  # Remove tool integrations
  for tool in claude gemini cursor windsurf zed; do
    local skills_dir="$base/.$tool/skills"
    local commands_dir="$base/.$tool/commands/incitaciones"

    # Remove skills installed by incitaciones (check for our prompts)
    if [ -d "$skills_dir" ]; then
      for prompt_dir in "$skills_dir"/*/; do
        if [ -f "$prompt_dir/SKILL.md" ] && head -5 "$prompt_dir/SKILL.md" | grep -q "Incitaciones"; then
          echo "Removing: $prompt_dir"
          rm -rf "$prompt_dir"
        fi
      done
    fi

    if [ -d "$commands_dir" ]; then
      echo "Removing: $commands_dir"
      rm -rf "$commands_dir"
      echo -e "  ${GREEN}Removed: $commands_dir${NC}"
    fi

    # Legacy symlinks
    if [ -L "$commands_dir" ]; then
      echo "Removing old symlink: $commands_dir"
      rm -f "$commands_dir"
      echo -e "  ${GREEN}Removed: $commands_dir${NC}"
    fi
  done

  # Amp uses ~/.config/amp/ (non-standard XDG path)
  local amp_skills="$HOME/.config/amp/skills"
  if [ -d "$amp_skills" ]; then
    for prompt_dir in "$amp_skills"/*/; do
      if [ -f "$prompt_dir/SKILL.md" ] && head -5 "$prompt_dir/SKILL.md" | grep -q "Incitaciones"; then
        echo "Removing: $prompt_dir"
        rm -rf "$prompt_dir"
      fi
    done
  fi

  echo ""
  echo -e "${GREEN}Uninstall complete.${NC}"
}

# Parse arguments
BUNDLE="all"
INSTALL_DIR=""
FORMAT="skills"
SCOPE=""
DO_LIST=false
DO_UNINSTALL=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --local)
      SCOPE="local"
      shift
      ;;
    --global)
      SCOPE="global"
      shift
      ;;
    --bundle)
      BUNDLE="$2"
      shift 2
      ;;
    --dir)
      INSTALL_DIR="$2"
      shift 2
      ;;
    --format)
      FORMAT="$2"
      shift 2
      ;;
    --list)
      DO_LIST=true
      shift
      ;;
    --uninstall)
      DO_UNINSTALL=true
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      usage
      exit 1
      ;;
  esac
done

# Handle --list (before scope determination)
if [ "$DO_LIST" = true ]; then
  list_prompts
  exit 0
fi

# Validate format
if [ "$FORMAT" != "skills" ] && [ "$FORMAT" != "commands" ]; then
  echo -e "${RED}Error: Unknown format '$FORMAT'. Use 'skills' or 'commands'.${NC}"
  exit 1
fi

# Determine scope (local vs global)
if [ -z "$SCOPE" ]; then
  if [ -n "$GIT_ROOT" ]; then
    SCOPE="local"
  else
    SCOPE="global"
  fi
fi

if [ "$SCOPE" = "local" ] && [ -z "$GIT_ROOT" ]; then
  echo -e "${YELLOW}Warning: Not in a git repository, falling back to global install.${NC}"
  SCOPE="global"
fi

# Set base path based on scope
if [ "$SCOPE" = "local" ]; then
  BASE="$GIT_ROOT"
else
  BASE="$HOME"
fi

# Handle --uninstall (after scope determination)
if [ "$DO_UNINSTALL" = true ]; then
  do_uninstall "$BASE"
  exit 0
fi

# Set default install dir based on format and scope
if [ -z "$INSTALL_DIR" ]; then
  if [ "$FORMAT" = "skills" ]; then
    INSTALL_DIR="$BASE/.agents/skills"
  else
    INSTALL_DIR="$BASE/.agents/commands"
  fi
fi

# Validate bundle
PROMPTS=$(get_bundle_prompts "$BUNDLE")
if [ -z "$PROMPTS" ]; then
  echo -e "${RED}Error: Unknown bundle '$BUNDLE'${NC}"
  if command -v jq &> /dev/null && [ -f "$MANIFEST_FILE" ]; then
    available=$(jq -r '.bundles | keys | join(", ")' "$MANIFEST_FILE")
  else
    available="(install jq to list bundles, or see content/manifest.json)"
  fi
  echo "Available bundles: $available"
  exit 1
fi

# Check source directory exists
if [ ! -d "$DISTILLED_DIR" ]; then
  echo -e "${RED}Error: Distilled prompts directory not found: $DISTILLED_DIR${NC}"
  echo "Make sure you're running this script from the incitaciones repository."
  exit 1
fi

# Install prompts to canonical .agents/ directory
echo "Installing incitaciones prompts ($SCOPE, format: $FORMAT)..."
echo ""

INSTALLED=0
SKIPPED=0

if [ "$FORMAT" = "skills" ]; then
  # Skills format: <name>/SKILL.md with YAML frontmatter
  for prompt in $PROMPTS; do
    if install_canonical_skill "$prompt" "$INSTALL_DIR"; then
      INSTALLED=$((INSTALLED + 1))
      if is_multi_file_distilled_path "$(resolve_distilled_path "$prompt")"; then
        echo -e "  ${GREEN}+${NC} $prompt (multi-file)"
      else
        echo -e "  ${GREEN}+${NC} $prompt"
      fi
    else
      echo -e "  ${YELLOW}?${NC} $prompt (not found)"
      SKIPPED=$((SKIPPED + 1))
    fi
  done

  # Report
  echo ""
  echo -e "${GREEN}Installed: $INSTALLED skills to $INSTALL_DIR/${NC}"
  [ $SKIPPED -gt 0 ] && echo -e "${YELLOW}Skipped: $SKIPPED (not found)${NC}"
  echo ""

else
  # Legacy commands format: flat files in incitaciones/ subdirectory
  mkdir -p "$INSTALL_DIR/incitaciones"

  for prompt in $PROMPTS; do
    dst="$INSTALL_DIR/incitaciones/${prompt}.md"

    if emit_flat_distilled_content "$prompt" > "$dst"; then
      INSTALLED=$((INSTALLED + 1))
      echo -e "  ${GREEN}+${NC} $prompt"
    else
      echo -e "  ${YELLOW}?${NC} $prompt (not found)"
      SKIPPED=$((SKIPPED + 1))
    fi
  done

  # Copy manifest for reference
  if [ -f "$MANIFEST_FILE" ]; then
    cp "$MANIFEST_FILE" "$INSTALL_DIR/incitaciones/.manifest.json"
  fi

  # Report
  echo ""
  echo -e "${GREEN}Installed: $INSTALLED prompts to $INSTALL_DIR/incitaciones/${NC}"
  [ $SKIPPED -gt 0 ] && echo -e "${YELLOW}Skipped: $SKIPPED (not found)${NC}"
  echo ""
fi

# Setup tool integrations
setup_tool_integration() {
  local tool="$1"

  # Amp: uses ~/.config/amp/ (XDG path), reads .agents/skills/ for local
  if [ "$tool" = "amp" ]; then
    local amp_dir="$HOME/.config/amp"
    if [ ! -d "$amp_dir" ]; then
      return 1
    fi
    if [ "$SCOPE" = "local" ]; then
      # Local: Amp reads .agents/skills/ directly (discovery priority 3)
      echo -e "  ${GREEN}+${NC} amp (reads .agents/skills/)"
    elif [ "$FORMAT" = "skills" ]; then
      local skills_dir="$amp_dir/skills"
      for prompt in $PROMPTS; do
        local src_dir="$INSTALL_DIR/${prompt}"
        if [ -d "$src_dir" ]; then
          copy_skill_tree "$src_dir" "$skills_dir/${prompt}"
        fi
      done
      echo -e "  ${GREEN}+${NC} amp (skills)"
    else
      echo -e "  ${YELLOW}-${NC} amp (commands deprecated in Amp, use --format skills)"
    fi
    return 0
  fi

  # Gemini CLI: TOML commands (stable) + SKILL.md skills (experimental)
  if [ "$tool" = "gemini" ]; then
    local tool_dir="$BASE/.gemini"
    if [ ! -d "$tool_dir" ]; then
      return 1
    fi
    # TOML commands (stable, always installed)
    local commands_dir="$tool_dir/commands/incitaciones"
    mkdir -p "$commands_dir"
    for prompt in $PROMPTS; do
      local tmp_src="/tmp/incitaciones-gemini-${prompt}.md"
      if emit_flat_distilled_content "$prompt" > "$tmp_src"; then
        generate_toml_command "$prompt" "$tmp_src" > "$commands_dir/${prompt}.toml"
      fi
      rm -f "$tmp_src"
    done
    # SKILL.md skills (experimental, for users who enable it)
    if [ "$FORMAT" = "skills" ]; then
      for prompt in $PROMPTS; do
        local src_dir="$INSTALL_DIR/${prompt}"
        if [ -d "$src_dir" ]; then
          copy_skill_tree "$src_dir" "$tool_dir/skills/${prompt}"
        fi
      done
    fi
    echo -e "  ${GREEN}+${NC} gemini (commands + skills)"
    return 0
  fi

  # Standard tools: Claude, Cursor, Windsurf, Zed
  local tool_dir="$BASE/.$tool"

  # Skip if tool directory doesn't exist
  if [ ! -d "$tool_dir" ]; then
    return 1
  fi

  if [ "$tool" = "claude" ]; then
    # Claude Code uses skills format (SKILL.md in subdirectories)
    if [ "$FORMAT" = "skills" ]; then
      local skills_dir="$tool_dir/skills"
      for prompt in $PROMPTS; do
        local src_dir="$INSTALL_DIR/${prompt}"
        if [ -d "$src_dir" ]; then
          copy_skill_tree "$src_dir" "$skills_dir/${prompt}"
        fi
      done
      echo -e "  ${GREEN}+${NC} $tool (skills)"
    else
      local commands_dir="$tool_dir/commands"
      mkdir -p "$commands_dir/incitaciones"
      for prompt in $PROMPTS; do
        if emit_flat_distilled_content "$prompt" > "$commands_dir/incitaciones/${prompt}.md"; then
          :
        fi
      done
      echo -e "  ${GREEN}+${NC} $tool (commands)"
    fi
  else
    # Other tools use flat commands format
    local commands_dir="$tool_dir/commands"
    mkdir -p "$commands_dir/incitaciones"
    for prompt in $PROMPTS; do
      if emit_flat_distilled_content "$prompt" > "$commands_dir/incitaciones/${prompt}.md"; then
        :
      fi
    done
    echo -e "  ${GREEN}+${NC} $tool (commands)"
  fi

  return 0
}

echo "Setting up tool integrations..."
TOOLS_FOUND=0
TOOLS_SKIPPED=""

for tool in claude amp gemini cursor windsurf zed; do
  if setup_tool_integration "$tool"; then
    TOOLS_FOUND=$((TOOLS_FOUND + 1))
  else
    TOOLS_SKIPPED="$TOOLS_SKIPPED $tool"
  fi
done

if [ $TOOLS_FOUND -eq 0 ]; then
  echo -e "  ${YELLOW}No tool directories found (checked: claude, amp, gemini, cursor, windsurf, zed)${NC}"
  echo -e "  Create the directory for your tool to enable integration."
fi

if [ -n "$TOOLS_SKIPPED" ]; then
  echo -e "  ${BLUE}Skipped (no dir):${TOOLS_SKIPPED}${NC}"
fi

echo ""
echo "Usage:"
echo "  /commit      /debug      /create-plan"
echo ""
