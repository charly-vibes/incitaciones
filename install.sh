#!/bin/bash
# install.sh - Install incitaciones prompts
# Usage: ./install.sh [--bundle NAME] [--dir PATH] [--list] [--help]

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_DIR="$HOME/.claude/commands"
DISTILLED_DIR="$SCRIPT_DIR/content/distilled"
MANIFEST_FILE="$SCRIPT_DIR/content/manifest.json"

# Colors (if terminal supports them)
if [ -t 1 ]; then
  GREEN='\033[0;32m'
  YELLOW='\033[0;33m'
  RED='\033[0;31m'
  NC='\033[0m' # No Color
else
  GREEN=''
  YELLOW=''
  RED=''
  NC=''
fi

usage() {
  cat << EOF
Usage: $(basename "$0") [OPTIONS]

Install incitaciones prompts to your Claude Code commands directory.

Options:
  --bundle NAME    Install only prompts from a specific bundle
                   Available: essentials, planning, reviews, all (default: all)
  --dir PATH       Install to custom directory (default: ~/.claude/commands)
  --list           List available prompts and bundles
  --help           Show this help message

Examples:
  $(basename "$0")                    # Install all prompts
  $(basename "$0") --bundle essentials # Install only essential prompts
  $(basename "$0") --dir ~/my-prompts  # Install to custom directory
  $(basename "$0") --list              # Show available prompts

EOF
}

list_prompts() {
  echo "Available bundles:"
  echo ""

  if command -v jq &> /dev/null && [ -f "$MANIFEST_FILE" ]; then
    # Use jq if available
    echo "  essentials - Core prompts for everyday development"
    jq -r '.bundles.essentials.prompts[]' "$MANIFEST_FILE" 2>/dev/null | while read -r p; do
      echo "    - $p"
    done
    echo ""

    echo "  planning - Project planning and implementation workflows"
    jq -r '.bundles.planning.prompts[]' "$MANIFEST_FILE" 2>/dev/null | while read -r p; do
      echo "    - $p"
    done
    echo ""

    echo "  reviews - Code, design, and research review processes"
    jq -r '.bundles.reviews.prompts[]' "$MANIFEST_FILE" 2>/dev/null | while read -r p; do
      echo "    - $p"
    done
    echo ""
  else
    # Fallback: list files directly
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
    echo "  - $p"
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
      # All prompts
      ls "$DISTILLED_DIR"/*.md 2>/dev/null | xargs -n1 basename | sed 's/\.md$//' | tr '\n' ' '
      ;;
    *)
      echo ""
      ;;
  esac
}

# Parse arguments
BUNDLE="all"
INSTALL_DIR="$DEFAULT_DIR"
DO_LIST=false

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
    --list)
      DO_LIST=true
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

# Handle --list
if [ "$DO_LIST" = true ]; then
  list_prompts
  exit 0
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

# Create install directory
echo "Installing incitaciones prompts..."
echo ""

mkdir -p "$INSTALL_DIR/incitaciones"

# Install prompts
INSTALLED=0
SKIPPED=0

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

# Setup symlinks for other tools
setup_tool_symlink() {
  local tool="$1"
  local tool_dir="$HOME/.$tool"
  local commands_dir="$tool_dir/commands"

  if [ -d "$tool_dir" ] && [ ! -e "$commands_dir/incitaciones" ]; then
    mkdir -p "$commands_dir"
    ln -s "$INSTALL_DIR/incitaciones" "$commands_dir/incitaciones" 2>/dev/null && \
      echo -e "  ${GREEN}+${NC} Linked to $tool" || true
  fi
}

echo "Checking for other AI coding tools..."
setup_tool_symlink "cursor"
setup_tool_symlink "windsurf"
setup_tool_symlink "zed"
echo ""
