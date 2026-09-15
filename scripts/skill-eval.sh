#!/usr/bin/env bash
# Purpose: Actively execute a registered skill against its manifest eval rubric via an LLM judge — the "rerun evals on model change" gate.
# Responsibilities:
# - Load the skill's eval rubric (success/failure signals, stages) from content/manifest.json
# - Run an ACTOR pi session (skill as system prompt, fixture task) and a JUDGE pi session (rubric + actor output only, never the skill) per run
# - Aggregate: a run passes when no failure signal fires and >= 50% of success signals fire; overall pass requires both runs to pass and agree
# - Write artifacts to .cache/skill-eval/<name>/ and exit nonzero on any failure
# Rationale: incitaciones-env — manifest eval rubrics were consumed only passively (trace labeling); this harness EXECUTES the skill, catching silent model-upgrade regressions (B171: "rerun evals on every model change"). Slice 1: commit fixture; add fixtures in scripts/skill-eval-fixtures/<name>.md to extend coverage.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MANIFEST="$REPO_ROOT/content/manifest.json"
FIXTURE_DIR="$REPO_ROOT/scripts/skill-eval-fixtures"
CACHE="$REPO_ROOT/.cache/skill-eval"

usage() {
  cat <<'EOF'
Usage: scripts/skill-eval.sh PROMPT_NAME [pi args...]

Executes the registered skill PROMPT_NAME against its manifest eval rubric:
2 runs x (actor + judge) pi sessions. Exits 0 only if both runs pass and agree.

Fixtures live in scripts/skill-eval-fixtures/<name>.md — a realistic task the
skill should handle. Skills without a fixture are reported as uncovered.

Examples:
  scripts/skill-eval.sh commit
  scripts/skill-eval.sh commit --model sonnet:high
EOF
}

[ $# -ge 1 ] || { usage >&2; exit 1; }
NAME="$1"; shift || true
PI_ARGS=("$@")

command -v pi >/dev/null 2>&1 || { echo "Error: pi is required" >&2; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "Error: jq is required" >&2; exit 1; }

# --- load manifest entry -----------------------------------------------------
row=$(jq -r --arg name "$NAME" '.prompts[] | select(.name == $name)' "$MANIFEST")
[ -n "$row" ] || { echo "Error: prompt not in manifest: $NAME" >&2; exit 1; }

DISTILLED_REL=$(jq -r '.distilled // empty' <<<"$row")
[ -n "$DISTILLED_REL" ] || { echo "Error: no distilled file for $NAME" >&2; exit 1; }
DISTILLED="$REPO_ROOT/$DISTILLED_REL"
[ -f "$DISTILLED" ] || { echo "Error: distilled file missing: $DISTILLED_REL" >&2; exit 1; }

if ! jq -e '.eval' <<<"$row" >/dev/null; then
  echo "UNCOVERED: $NAME has no eval rubric in the manifest — write one before it can be skill-evaled." >&2
  exit 2
fi

FIXTURE="$FIXTURE_DIR/$NAME.md"
[ -f "$FIXTURE" ] || { echo "UNCOVERED: no fixture at scripts/skill-eval-fixtures/$NAME.md — create one (a realistic task for the skill)." >&2; exit 2; }

# --- flatten skill (SKILL.md + references), same convention as nucleus-roundtrip ---
flatten_distilled() {
  cat "$1"
  if [[ "$1" == */SKILL.md ]]; then
    local ref_dir
    ref_dir="$(dirname "$1")/references"
    if [ -d "$ref_dir" ]; then
      while IFS= read -r ref; do
        printf '\n\n---\n\n## Reference: %s\n\n' "$(basename "$ref")"
        cat "$ref"
      done < <(find "$ref_dir" -maxdepth 1 -name '*.md' -type f | sort)
    fi
  fi
}

SKILL_CONTENT="$(flatten_distilled "$DISTILLED")"
FIXTURE_CONTENT="$(<"$FIXTURE")"

SUCCESS_SIGNALS=$(jq -r '.eval.success_signals // [] | .[]' <<<"$row")
FAILURE_SIGNALS=$(jq -r '.eval.failure_signals // [] | .[]' <<<"$row")

OUT_DIR="$CACHE/$NAME"
mkdir -p "$OUT_DIR"
RUN_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

COMMON_PI_ARGS=( -p --no-session --no-tools --no-context-files --no-skills --no-prompt-templates --no-extensions )

ACTOR_SYSTEM="You are a careful agent executing the following procedure. Follow it exactly.
Output only your response to the task — no meta-commentary about being a test subject.

<PROCEDURE>
$SKILL_CONTENT
</PROCEDURE>"

JUDGE_SYSTEM="You are an impartial evaluation judge. You score an agent's response against a rubric. You have NOT seen the agent's instructions and must not guess them — judge only what is visible in the response.

RUBRIC
Task types: $(jq -r '.eval.task_types // [] | join(", ")' <<<"$row")
Success signals (desired observable behaviors):
$(jq -r '.eval.success_signals // [] | .[] | "  - " + .' <<<"$row")
Failure signals (disqualifying behaviors):
$(jq -r '.eval.failure_signals // [] | .[] | "  - " + .' <<<"$row")
Expected procedure stages (context only — judge adherence loosely):
$(jq -r '.eval.stages // [] | .[] | "  - \(.name): \(.hints | join("; "))"' <<<"$row")

OUTPUT
Respond with ONLY a JSON object, no code fences, no prose:
{
  \"success_signals\": {\"<signal-name>\": true|false, ...},
  \"failure_signals\": {\"<signal-name>\": true|false, ...},
  \"stages_followed\": [\"<stage-name>\", ...],
  \"verdict\": \"PASS\" | \"FAIL\"
}
Every rubric signal must appear in its object. FAIL if any failure signal is true or fewer than half the success signals are true."

verdict_json() {  # $1 = raw judge output; emits parsed JSON or fails
  python3 - "$1" <<'PYEOF'
import json, re, sys
raw = sys.argv[1]
m = re.search(r'\{.*\}', raw, re.S)
if not m:
    sys.exit("no JSON object found in judge output")
obj = json.loads(m.group(0))
for key in ("success_signals", "failure_signals", "verdict"):
    if key not in obj:
        sys.exit(f"judge JSON missing key: {key}")
json.dump(obj, sys.stdout)
PYEOF
}

score_run() {  # $1 = run number (1|2); sets RUN_VERDICT
  local n="$1"
  echo "── run $n: actor (executes skill on fixture)…" >&2
  local actor_out judge_raw parsed
  actor_out=$(pi "${COMMON_PI_ARGS[@]}" --system-prompt "$ACTOR_SYSTEM" "${PI_ARGS[@]}" "$FIXTURE_CONTENT")
  printf '%s\n' "$actor_out" > "$OUT_DIR/run$n-actor.md"

  echo "── run $n: judge (scores against rubric)…" >&2
  local judge_msg
  judge_msg="Score the following agent response against the rubric in your system prompt.

<AGENT_RESPONSE>
$actor_out
</AGENT_RESPONSE>"
  judge_raw=$(pi "${COMMON_PI_ARGS[@]}" --system-prompt "$JUDGE_SYSTEM" "${PI_ARGS[@]}" "$judge_msg") \
    || { echo "run $n: judge pi invocation failed" >&2; RUN_VERDICT="FAIL"; return 0; }
  printf '%s\n' "$judge_raw" > "$OUT_DIR/run$n-judge-raw.md"

  if ! parsed=$(verdict_json "$judge_raw"); then
    echo "run $n: unparseable judge output: $parsed" >&2
    RUN_VERDICT="FAIL"
    return 0
  fi
  printf '%s\n' "$parsed" > "$OUT_DIR/run$n-verdict.json"

  local fail_hit success_total success_hit fail_json succ_json
  fail_json=$(jq -c '.failure_signals' <<<"$parsed")
  succ_json=$(jq -c '.success_signals' <<<"$parsed")
  fail_hit=$(python3 -c "import json,sys; d=json.loads('$fail_json'); print(sum(1 for v in d.values() if v))")
  success_total=$(python3 -c "import json,sys; d=json.loads('$succ_json'); print(len(d))")
  success_hit=$(python3 -c "import json,sys; d=json.loads('$succ_json'); print(sum(1 for v in d.values() if v))")

  echo "   success signals: $success_hit/$success_total · failure signals fired: $fail_hit · judge verdict: $(jq -r '.verdict' <<<"$parsed")" >&2

  if [ "$fail_hit" -gt 0 ] || [ "$success_total" -eq 0 ] || [ "$success_hit" -lt $(( (success_total + 1) / 2 )) ] \
     || [ "$(jq -r '.verdict' <<<"$parsed")" != "PASS" ]; then
    RUN_VERDICT="FAIL"
  else
    RUN_VERDICT="PASS"
  fi
}

echo "skill-eval: $NAME (2 runs × actor+judge)"
score_run 1; V1="$RUN_VERDICT"
score_run 2; V2="$RUN_VERDICT"

{
  printf '{\n  "skill": "%s",\n  "run_at": "%s",\n  "run1": "%s",\n  "run2": "%s",\n  "result": "%s"\n}\n' \
    "$NAME" "$RUN_AT" "$V1" "$V2" \
    "$(if [ "$V1" = PASS ] && [ "$V2" = PASS ]; then echo PASS; else echo FAIL; fi)"
} > "$OUT_DIR/result.json"

if [ "$V1" = PASS ] && [ "$V2" = PASS ]; then
  echo "✅ skill-eval: $NAME PASS (2/2 runs agree)"
  echo "   artifacts: ${CACHE#$REPO_ROOT/}/$NAME/"
  exit 0
fi

echo "❌ skill-eval: $NAME FAIL (run1=$V1 run2=$V2) — inspect ${CACHE#$REPO_ROOT/}/$NAME/"
exit 1
