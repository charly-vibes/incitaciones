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
for Claude Code, Cursor, Windsurf, and Zed.

Options:
  --local          Install to project .agents/skills/ (default when in a git repo)
  --global         Install to ~/.agents/skills/ (user-wide)
  --bundle NAME    Install only prompts from a specific bundle
                   Available: essentials, planning, reviews, all (default: all)
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
    for bundle in essentials planning reviews; do
      desc=$(jq -r ".bundles.$bundle.description" "$MANIFEST_FILE")
      echo "  $bundle - $desc"
      jq -r ".bundles.$bundle.prompts[]" "$MANIFEST_FILE" 2>/dev/null | while read -r p; do
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
    echo "  essentials:"
    echo "    commit, debug, describe-pr, code-review, research-codebase, create-handoff, resume-handoff"
    echo ""
    echo "  planning:"
    echo "    create-plan, implement-plan, iterate-plan, create-issues, design-practice, pre-mortem, tdd, plan-review"
    echo ""
    echo "  reviews:"
    echo "    code-review, rule-of-5, optionality-review, multi-agent-review, plan-review, design-review, research-review, issue-review, rule-of-5-universal"
    echo ""
  fi

  echo "  all - Complete collection ($(ls "$DISTILLED_DIR"/*.md 2>/dev/null | wc -l | tr -d ' ') prompts)"
  echo ""
  echo "All available prompts:"
  ls "$DISTILLED_DIR"/*.md 2>/dev/null | xargs -n1 basename | sed 's/\.md$//' | sort | while read -r p; do
    pdesc=$(get_prompt_description "$p")
    if [ -n "$pdesc" ]; then
      echo "  - $p — $pdesc"
    else
      echo "  - $p"
    fi
  done
}

get_bundle_prompts() {
  local bundle="$1"

  case "$bundle" in
    essentials)
      echo "commit debug describe-pr code-review research-codebase create-handoff resume-handoff"
      ;;
    planning)
      echo "create-plan implement-plan iterate-plan create-issues design-practice pre-mortem tdd plan-review"
      ;;
    reviews)
      echo "code-review rule-of-5 optionality-review multi-agent-review plan-review design-review research-review issue-review rule-of-5-universal"
      ;;
    all|"")
      ls "$DISTILLED_DIR"/*.md 2>/dev/null | xargs -n1 basename | sed 's/\.md$//' | tr '\n' ' '
      ;;
    *)
      echo ""
      ;;
  esac
}

# Generate YAML frontmatter for a SKILL.md file
generate_frontmatter() {
  local name="$1"
  local description=""

  if command -v jq &> /dev/null && [ -f "$MANIFEST_FILE" ]; then
    description=$(jq -r --arg n "$name" '.prompts[] | select(.name == $n) | .description // empty' "$MANIFEST_FILE" 2>/dev/null)
  fi

  # Fallback description if not found in manifest
  if [ -z "$description" ]; then
    description="Incitaciones prompt: $name"
  fi

  echo "---"
  echo "name: $name"
  echo "description: $description"
  echo "disable-model-invocation: true"
  echo "---"
  echo ""
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
  for tool in claude cursor windsurf zed; do
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
  echo "Available bundles: essentials, planning, reviews, all"
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
    src="$DISTILLED_DIR/${prompt}.md"
    dst_dir="$INSTALL_DIR/${prompt}"
    dst="$dst_dir/SKILL.md"

    if [ -f "$src" ]; then
      mkdir -p "$dst_dir"
      # Generate frontmatter + distilled content
      {
        generate_frontmatter "$prompt"
        cat "$src"
      } > "$dst"
      INSTALLED=$((INSTALLED + 1))
      echo -e "  ${GREEN}+${NC} $prompt"
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
    src="$DISTILLED_DIR/${prompt}.md"
    dst="$INSTALL_DIR/incitaciones/${prompt}.md"

    if [ -f "$src" ]; then
      cp "$src" "$dst"
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
        local src="$INSTALL_DIR/${prompt}/SKILL.md"
        if [ -f "$src" ]; then
          mkdir -p "$skills_dir/${prompt}"
          cp "$src" "$skills_dir/${prompt}/SKILL.md"
        fi
      done
      echo -e "  ${GREEN}+${NC} $tool (skills)"
    else
      local commands_dir="$tool_dir/commands"
      mkdir -p "$commands_dir/incitaciones"
      for prompt in $PROMPTS; do
        local src="$DISTILLED_DIR/${prompt}.md"
        if [ -f "$src" ]; then
          cp "$src" "$commands_dir/incitaciones/${prompt}.md"
        fi
      done
      echo -e "  ${GREEN}+${NC} $tool (commands)"
    fi
  else
    # Other tools use flat commands format
    local commands_dir="$tool_dir/commands"
    mkdir -p "$commands_dir/incitaciones"
    for prompt in $PROMPTS; do
      local src="$DISTILLED_DIR/${prompt}.md"
      if [ -f "$src" ]; then
        cp "$src" "$commands_dir/incitaciones/${prompt}.md"
      fi
    done
    echo -e "  ${GREEN}+${NC} $tool (commands)"
  fi

  return 0
}

echo "Setting up tool integrations..."
TOOLS_FOUND=0
TOOLS_SKIPPED=""

for tool in claude cursor windsurf zed; do
  if setup_tool_integration "$tool"; then
    TOOLS_FOUND=$((TOOLS_FOUND + 1))
  else
    TOOLS_SKIPPED="$TOOLS_SKIPPED $tool"
  fi
done

if [ $TOOLS_FOUND -eq 0 ]; then
  echo -e "  ${YELLOW}No tool directories found at $BASE/.{claude,cursor,windsurf,zed}/${NC}"
  echo -e "  Create the directory for your tool to enable integration."
fi

if [ -n "$TOOLS_SKIPPED" ]; then
  echo -e "  ${BLUE}Skipped (no dir):${TOOLS_SKIPPED}${NC}"
fi

echo ""
echo "Usage:"
echo "  /commit      /debug      /create-plan"
echo ""
