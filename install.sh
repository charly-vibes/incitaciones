#!/bin/bash
# install.sh - Install incitaciones prompts as Claude Code skills or legacy commands
# Usage: ./install.sh [--bundle NAME] [--dir PATH] [--format FORMAT] [--list] [--uninstall] [--help]

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_SKILLS_DIR="$HOME/.claude/skills"
DEFAULT_COMMANDS_DIR="$HOME/.claude/commands"
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

Install incitaciones prompts as Claude Code skills (or legacy commands).

Options:
  --bundle NAME    Install only prompts from a specific bundle
                   Available: essentials, planning, reviews, all (default: all)
  --dir PATH       Install to custom directory (default: ~/.claude/skills)
  --format FORMAT  Output format: skills (default) or commands (legacy)
  --list           List available prompts and bundles
  --uninstall      Remove old commands/incitaciones/ directory
  --help           Show this help message

Examples:
  $(basename "$0")                       # Install all prompts as skills
  $(basename "$0") --bundle essentials   # Install only essential prompts
  $(basename "$0") --format commands     # Install as legacy flat commands
  $(basename "$0") --dir ~/my-skills     # Install to custom directory
  $(basename "$0") --list                # Show available prompts
  $(basename "$0") --uninstall           # Clean up old commands directory

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

# Uninstall old commands/incitaciones/ directory
do_uninstall() {
  local old_dir="$HOME/.claude/commands/incitaciones"
  if [ -d "$old_dir" ]; then
    echo "Removing old commands directory: $old_dir"
    rm -rf "$old_dir"
    echo -e "${GREEN}Removed: $old_dir${NC}"
  else
    echo "No old commands directory found at: $old_dir"
  fi

  # Also check for tool symlinks pointing to old location
  for tool in cursor windsurf zed; do
    local tool_link="$HOME/.$tool/commands/incitaciones"
    if [ -L "$tool_link" ]; then
      echo "Removing old symlink: $tool_link"
      rm -f "$tool_link"
      echo -e "${GREEN}Removed: $tool_link${NC}"
    fi
  done
  echo ""
  echo -e "${GREEN}Uninstall complete.${NC}"
}

# Parse arguments
BUNDLE="all"
INSTALL_DIR=""
FORMAT="skills"
DO_LIST=false
DO_UNINSTALL=false

while [[ $# -gt 0 ]]; do
  case $1 in
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

# Handle --uninstall
if [ "$DO_UNINSTALL" = true ]; then
  do_uninstall
  exit 0
fi

# Handle --list
if [ "$DO_LIST" = true ]; then
  list_prompts
  exit 0
fi

# Validate format
if [ "$FORMAT" != "skills" ] && [ "$FORMAT" != "commands" ]; then
  echo -e "${RED}Error: Unknown format '$FORMAT'. Use 'skills' or 'commands'.${NC}"
  exit 1
fi

# Set default install dir based on format
if [ -z "$INSTALL_DIR" ]; then
  if [ "$FORMAT" = "skills" ]; then
    INSTALL_DIR="$DEFAULT_SKILLS_DIR"
  else
    INSTALL_DIR="$DEFAULT_COMMANDS_DIR"
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

# Install prompts
echo "Installing incitaciones prompts (format: $FORMAT)..."
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
  echo -e "${GREEN}Installation complete!${NC}"
  echo "  Installed: $INSTALLED skills"
  [ $SKIPPED -gt 0 ] && echo -e "  ${YELLOW}Skipped: $SKIPPED (not found)${NC}"
  echo "  Location: $INSTALL_DIR/"
  echo ""
  echo "Usage in Claude Code:"
  echo "  /commit"
  echo "  /debug"
  echo "  /create-plan"
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
  echo -e "${GREEN}Installation complete!${NC}"
  echo "  Installed: $INSTALLED prompts"
  [ $SKIPPED -gt 0 ] && echo -e "  ${YELLOW}Skipped: $SKIPPED (not found)${NC}"
  echo "  Location: $INSTALL_DIR/incitaciones/"
  echo ""
  echo "Usage in Claude Code:"
  echo "  /incitaciones/commit"
  echo "  /incitaciones/debug"
  echo "  /incitaciones/create-plan"
  echo ""
fi

# Setup symlinks for other tools (always use flat commands format)
setup_tool_symlink() {
  local tool="$1"
  local tool_dir="$HOME/.$tool"
  local commands_dir="$tool_dir/commands"

  # For skills format, create a flat commands copy for other tools
  if [ "$FORMAT" = "skills" ]; then
    if [ -d "$tool_dir" ]; then
      mkdir -p "$commands_dir/incitaciones"
      for prompt in $PROMPTS; do
        src="$DISTILLED_DIR/${prompt}.md"
        if [ -f "$src" ]; then
          cp "$src" "$commands_dir/incitaciones/${prompt}.md"
        fi
      done
      echo -e "  ${GREEN}+${NC} Copied to $tool (commands format)"
    fi
  else
    # Legacy: symlink to the commands directory
    if [ -d "$tool_dir" ] && [ ! -e "$commands_dir/incitaciones" ]; then
      mkdir -p "$commands_dir"
      ln -s "$INSTALL_DIR/incitaciones" "$commands_dir/incitaciones" 2>/dev/null && \
        echo -e "  ${GREEN}+${NC} Linked to $tool" || true
    fi
  fi
}

echo "Checking for other AI coding tools..."
setup_tool_symlink "cursor"
setup_tool_symlink "windsurf"
setup_tool_symlink "zed"
echo ""
