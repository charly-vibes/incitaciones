#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MANIFEST="$REPO_ROOT/content/manifest.json"
SYSTEM_PROMPT_FILE="$REPO_ROOT/scripts/nucleus/lambda-compiler-system.md"
DECOMPILER_SYSTEM_PROMPT_FILE="$REPO_ROOT/scripts/nucleus/lambda-decompiler-system.md"

usage() {
  cat <<'EOF'
Usage: scripts/nucleus-roundtrip.sh PROMPT_NAME [pi args...]

Runs a Nucleus lambda compile + decompile roundtrip for a registered prompt
using `pi -p`, then writes:
  content/compiled/nucleus/<name>.lambda.md
  content/compiled/nucleus/<name>.roundtrip.md

Any extra arguments are passed directly to `pi`.
Examples:
  scripts/nucleus-roundtrip.sh distill-prompt
  scripts/nucleus-roundtrip.sh distill-prompt --model sonnet:high
EOF
}

if [ $# -lt 1 ]; then
  usage >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required" >&2
  exit 1
fi

if ! command -v pi >/dev/null 2>&1; then
  echo "Error: pi is required" >&2
  exit 1
fi

NAME="$1"
shift || true
PI_ARGS=("$@")

DISTILLED_REL=$(jq -r --arg name "$NAME" '.prompts[] | select(.name == $name) | .distilled // empty' "$MANIFEST")
if [ -z "$DISTILLED_REL" ]; then
  echo "Error: prompt not found in manifest: $NAME" >&2
  exit 1
fi

DISTILLED="$REPO_ROOT/$DISTILLED_REL"
if [ ! -f "$DISTILLED" ]; then
  echo "Error: distilled file not found: $DISTILLED_REL" >&2
  exit 1
fi

flatten_distilled() {
  local distilled_path="$1"
  cat "$distilled_path"
  if [[ "$distilled_path" == */SKILL.md ]]; then
    local ref_dir
    ref_dir="$(dirname "$distilled_path")/references"
    if [ -d "$ref_dir" ]; then
      while IFS= read -r ref; do
        printf '\n\n---\n\n'
        printf '## Reference: %s\n\n' "$(basename "$ref")"
        cat "$ref"
      done < <(find "$ref_dir" -maxdepth 1 -name '*.md' -type f | sort)
    fi
  fi
}

OUT_DIR="$REPO_ROOT/content/compiled/nucleus"
mkdir -p "$OUT_DIR"
LAMBDA_OUT="$OUT_DIR/$NAME.lambda.md"
ROUNDTRIP_OUT="$OUT_DIR/$NAME.roundtrip.md"
TMP_LAMBDA=$(mktemp)
TMP_ROUNDTRIP=$(mktemp)
trap 'rm -f "$TMP_LAMBDA" "$TMP_ROUNDTRIP"' EXIT

SYSTEM_PROMPT="$(<"$SYSTEM_PROMPT_FILE")"
DECOMPILER_SYSTEM_PROMPT="$(<"$DECOMPILER_SYSTEM_PROMPT_FILE")"
DISTILLED_CONTENT="$(flatten_distilled "$DISTILLED")"
REF_COUNT=0
if [[ "$DISTILLED" == */SKILL.md ]] && [ -d "$(dirname "$DISTILLED")/references" ]; then
  REF_COUNT=$(find "$(dirname "$DISTILLED")/references" -maxdepth 1 -name '*.md' -type f | wc -l | tr -d ' ')
fi

MODEL_VALUE="default"
PROVIDER_VALUE="default"
THINKING_VALUE="default"
if [ ${#PI_ARGS[@]} -gt 0 ]; then
  for ((i=0; i<${#PI_ARGS[@]}; i++)); do
    case "${PI_ARGS[$i]}" in
      --model)
        if [ $((i + 1)) -lt ${#PI_ARGS[@]} ]; then MODEL_VALUE="${PI_ARGS[$((i + 1))]}"; fi
        ;;
      --provider)
        if [ $((i + 1)) -lt ${#PI_ARGS[@]} ]; then PROVIDER_VALUE="${PI_ARGS[$((i + 1))]}"; fi
        ;;
      --thinking)
        if [ $((i + 1)) -lt ${#PI_ARGS[@]} ]; then THINKING_VALUE="${PI_ARGS[$((i + 1))]}"; fi
        ;;
    esac
  done
fi
PI_ARGS_RENDERED="${PI_ARGS[*]:-}"
RUN_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

read -r -d '' COMPILE_MESSAGE <<EOF || true
compile:

Compile the following distilled prompt to lambda notation.
Preserve executable instructions, mandatory constraints, negative constraints, output-format requirements, and logical hierarchy.
Output λ notation only. No prose. No code fences.

<PROMPT>
$DISTILLED_CONTENT
</PROMPT>
EOF

read -r -d '' DECOMPILE_PREFIX <<'EOF' || true
decompile to concise markdown for a prompt engineer:

Preserve ALL executable instructions, mandatory constraints, negative constraints, and output-format requirements from the lambda source.
Reconstruct a concise runtime prompt suitable for comparison against the original distilled prompt.
Output prose markdown only. No lambda notation. No commentary. No code fences.

<LAMBDA>
EOF

COMMON_PI_ARGS=(
  -p
  --no-session
  --no-tools
  --no-context-files
  --no-skills
  --no-prompt-templates
  --no-extensions
)

echo "Compiling $NAME with pi..." >&2
pi "${COMMON_PI_ARGS[@]}" --system-prompt "$SYSTEM_PROMPT" "${PI_ARGS[@]}" "$COMPILE_MESSAGE" > "$TMP_LAMBDA"

LAMBDA_CONTENT="$(<"$TMP_LAMBDA")"
DECOMPILE_MESSAGE="${DECOMPILE_PREFIX}
${LAMBDA_CONTENT}
</LAMBDA>"

echo "Decompiling $NAME with pi..." >&2
pi "${COMMON_PI_ARGS[@]}" --system-prompt "$DECOMPILER_SYSTEM_PROMPT" "${PI_ARGS[@]}" "$DECOMPILE_MESSAGE" > "$TMP_ROUNDTRIP"

{
  echo "<!-- Experimental Nucleus lambda variant -->"
  echo "<!-- Source distilled prompt: $DISTILLED_REL -->"
  echo "<!-- Distilled references included: $REF_COUNT -->"
  echo "<!-- Generated at: $RUN_AT -->"
  echo "<!-- pi provider: $PROVIDER_VALUE -->"
  echo "<!-- pi model: $MODEL_VALUE -->"
  echo "<!-- pi thinking: $THINKING_VALUE -->"
  echo "<!-- pi args: ${PI_ARGS_RENDERED:-<none>} -->"
  echo
  cat "$TMP_LAMBDA"
} > "$LAMBDA_OUT"

{
  echo "<!-- Experimental Nucleus roundtrip variant -->"
  echo "<!-- Source distilled prompt: $DISTILLED_REL -->"
  echo "<!-- Distilled references included: $REF_COUNT -->"
  echo "<!-- Generated at: $RUN_AT -->"
  echo "<!-- pi provider: $PROVIDER_VALUE -->"
  echo "<!-- pi model: $MODEL_VALUE -->"
  echo "<!-- pi thinking: $THINKING_VALUE -->"
  echo "<!-- pi args: ${PI_ARGS_RENDERED:-<none>} -->"
  echo
  cat "$TMP_ROUNDTRIP"
} > "$ROUNDTRIP_OUT"

echo "Wrote: ${LAMBDA_OUT#$REPO_ROOT/}" >&2
echo "Wrote: ${ROUNDTRIP_OUT#$REPO_ROOT/}" >&2
