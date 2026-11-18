#!/usr/bin/env bash
# Purpose: Actively execute a registered skill against its manifest eval rubric via an LLM judge — the "rerun evals on model change" gate.
# Responsibilities:
# - Load the skill's eval rubric (success/failure signals, stages) from content/manifest.json
# - Run an ACTOR pi session (skill as system prompt, fixture task) and a JUDGE pi session (rubric + actor output only, never the skill) per run
# - Aggregate, positive mode: a run passes when no failure signal fires and >= 50% of success signals fire; overall pass requires both runs to pass and agree
# - Aggregate, negative mode (PROMPT_NAME:negative, incitaciones-bbt): the fixture describes a task just OUTSIDE the skill's scope and carries a FIXED canonical misusing response ('## Canonical misusing response'); the live actor is skipped (models reliably refuse to perform destructive-looking misuse, so fault injection is deterministic) and the judge scores the payload instead. A run passes when >= 50% of the declared failure signals fire (success signals ignored; a rubric with zero failure signals is vacuous and always fails). Proves the rubric's failure signals actually catch misuse
# - Write artifacts to .cache/skill-eval/<name>/ and exit nonzero on any failure
#
# Sourcing this file is side-effect-free: functions (decide_run, judge_output_rule) are unit-tested by tests/test_skill_eval.sh
# Rationale: incitaciones-env — manifest eval rubrics were consumed only passively (trace labeling); this harness EXECUTES the skill, catching silent model-upgrade regressions (B171: "rerun evals on every model change"). Slice 1: commit fixture; add fixtures in scripts/skill-eval-fixtures/<name>.md to extend coverage.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MANIFEST="$REPO_ROOT/content/manifest.json"
FIXTURE_DIR="$REPO_ROOT/scripts/skill-eval-fixtures"
CACHE="$REPO_ROOT/.cache/skill-eval"

usage() {
  cat <<'EOF'
Usage: scripts/skill-eval.sh PROMPT_NAME[:VARIANT] [pi args...]

Executes the registered skill PROMPT_NAME against its manifest eval rubric:
2 runs x (actor + judge) pi sessions. Exits 0 only if both runs pass and agree.

Fixtures live in scripts/skill-eval-fixtures/<name>.md — a realistic task the
skill should handle. Skills without a fixture are reported as uncovered.

A variant (PROMPT_NAME:VARIANT) pins a specific mode against its own rubric
stored at .eval.variants.<variant> in the manifest, with fixture
scripts/skill-eval-fixtures/<name>-<variant>.md (incitaciones-qba).

The reserved variant PROMPT_NAME:negative is a mutation-style eval: the
fixture scripts/skill-eval-fixtures/<name>-negative.md describes a realistic
task just outside the skill's scope and must contain a '## Canonical
misusing response' section — a fixed exemplar of the skill being applied
out of scope. The judge scores that payload; the eval asserts the rubric's
declared failure signals FIRE (>= half), proving they catch misuse. No
actor session runs. Rubric: .eval.variants.negative with >= 1 failure
signal; success signals are ignored. Use it to validate rubric
discrimination, not skill quality.

Examples:
  scripts/skill-eval.sh commit
  scripts/skill-eval.sh commit --model sonnet:high
  scripts/skill-eval.sh session:renew
  scripts/skill-eval.sh close:negative
EOF
}

# Decision rule text fed to the judge; differs by $EVAL_MODE (positive|negative).
# Unit-tested: tests/test_skill_eval.sh
judge_output_rule() {
  if [ "$EVAL_MODE" = negative ]; then
    printf 'Every rubric signal must appear in its object. This is a NEGATIVE eval: the fixture task is outside the skill scope, and a correct evaluation PASSES when the disqualifying behaviors ARE observed. PASS if at least half of the failure signals are true; FAIL otherwise. Success signals are informational only and never decide the verdict.'
  else
    printf 'Every rubric signal must appear in its object. FAIL if any failure signal is true or fewer than half the success signals are true.'
  fi
}

# Score one parsed judge verdict; sets RUN_VERDICT per $EVAL_MODE.
# Unit-tested: tests/test_skill_eval.sh
decide_run() {  # $1 = parsed judge JSON
  local parsed="$1" verdict
  local fail_json succ_json fail_total fail_hit success_total success_hit
  fail_json=$(jq -c '.failure_signals' <<<"$parsed")
  succ_json=$(jq -c '.success_signals' <<<"$parsed")
  fail_total=$(python3 -c 'import json,sys; d=json.loads(sys.argv[1]); print(len(d))' "$fail_json")
  fail_hit=$(python3 -c 'import json,sys; d=json.loads(sys.argv[1]); print(sum(1 for v in d.values() if v))' "$fail_json")
  success_total=$(python3 -c 'import json,sys; d=json.loads(sys.argv[1]); print(len(d))' "$succ_json")
  success_hit=$(python3 -c 'import json,sys; d=json.loads(sys.argv[1]); print(sum(1 for v in d.values() if v))' "$succ_json")
  verdict=$(jq -r '.verdict' <<<"$parsed")

  echo "   success signals: $success_hit/$success_total · failure signals fired: $fail_hit · judge verdict: $verdict" >&2

  if [ "$EVAL_MODE" = negative ]; then
    # :negative convention — pass when the declared failure signals fire
    # (>= half); success signals ignored; zero failure signals = vacuous rubric.
    if [ "$fail_total" -eq 0 ] || [ "$fail_hit" -lt $(( (fail_total + 1) / 2 )) ] || [ "$verdict" != "PASS" ]; then
      RUN_VERDICT="FAIL"
    else
      RUN_VERDICT="PASS"
    fi
  else
    if [ "$fail_hit" -gt 0 ] || [ "$success_total" -eq 0 ] || [ "$success_hit" -lt $(( (success_total + 1) / 2 )) ] \
       || [ "$verdict" != "PASS" ]; then
      RUN_VERDICT="FAIL"
    else
      RUN_VERDICT="PASS"
    fi
  fi
}

# resolve_distilled: pointer entries (content/distilled/pointers/<name>.md, thin
# banners in-repo) eval against their full member method at
# content/distilled/<router>/references/<member>/SKILL.md via pointer_for
# ("router/member"). Everything else resolves to its own distilled path.
# Unit-tested: tests/test_skill_eval.sh
resolve_distilled() { # $1 = distilled rel path, $2 = pointer_for (may be empty); emits path
  local rel="$1" pointer_for="$2" member
  if [ -n "$pointer_for" ] && [[ "$rel" == content/distilled/pointers/* ]]; then
    member="$REPO_ROOT/content/distilled/${pointer_for%%/*}/references/${pointer_for##*/}/SKILL.md"
    if [ -f "$member" ]; then
      printf '%s\n' "$member"
      return 0
    fi
  fi
  printf '%s\n' "$REPO_ROOT/$rel"
}

# Extract the mutation payload from a negative fixture: everything after the
# '## Canonical misusing response' marker. Unit-tested: tests/test_skill_eval.sh
negative_payload() {  # $1 = fixture path; emits payload on stdout
  local fixture="$1"
  if ! grep -q '^## Canonical misusing response' "$fixture"; then
    echo "Error: negative fixture must contain a '## Canonical misusing response' section (the fixed mutation payload judged in place of a live actor): $fixture" >&2
    return 1
  fi
  sed -n '/^## Canonical misusing response/,$p' "$fixture" | tail -n +2 | sed -e '/./,$!d'
}

main() {

  [ $# -ge 1 ] || { usage >&2; exit 1; }
  NAME="$1"; shift || true
VARIANT=""
  if [[ "$NAME" == *:* ]]; then VARIANT="${NAME#*:}"; NAME="${NAME%%:*}"; fi
  PI_ARGS=("$@")
  EVAL_MODE=positive
  [ "$VARIANT" = negative ] && EVAL_MODE=negative

command -v pi >/dev/null 2>&1 || { echo "Error: pi is required" >&2; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "Error: jq is required" >&2; exit 1; }

# --- load manifest entry -----------------------------------------------------
  row=$(jq -r --arg name "$NAME" '.prompts[] | select(.name == $name)' "$MANIFEST")
  [ -n "$row" ] || { echo "Error: prompt not in manifest: $NAME" >&2; exit 1; }

  DISTILLED_REL=$(jq -r '.distilled // empty' <<<"$row")
  [ -n "$DISTILLED_REL" ] || { echo "Error: no distilled file for $NAME" >&2; exit 1; }
  DISTILLED=$(resolve_distilled "$DISTILLED_REL" "$(jq -r '.pointer_for // empty' <<<"$row")")
  [ -f "$DISTILLED" ] || { echo "Error: distilled file missing: $DISTILLED_REL" >&2; exit 1; }

  RUBRIC='.eval'
  if [ -n "$VARIANT" ]; then
    RUBRIC=".eval.variants.$VARIANT"
    if ! jq -e "$RUBRIC" <<<"$row" >/dev/null; then
      echo "UNCOVERED: $NAME has no eval.variants.$VARIANT rubric in the manifest — write one before it can be skill-evaled." >&2
      exit 2
    fi
  fi

  if ! jq -e "$RUBRIC" <<<"$row" >/dev/null; then
    echo "UNCOVERED: $NAME has no eval rubric in the manifest — write one before it can be skill-evaled." >&2
    exit 2
  fi

  FIXTURE="$FIXTURE_DIR/$NAME${VARIANT:+-$VARIANT}.md"
  [ -f "$FIXTURE" ] || { echo "UNCOVERED: no fixture at scripts/skill-eval-fixtures/$NAME${VARIANT:+-$VARIANT}.md — create one (a realistic task for the skill)." >&2; exit 2; }

# --- flatten skill (SKILL.md + full references tree) ---
# Recursive: routers keep multi-file members under references/<member>/SKILL.md
# (maxdepth-1 flatten silently dropped them — caught by skill-eval run where
# the create-issues title lint never reached the actor).
flatten_distilled() {
  cat "$1"
  if [[ "$1" == */SKILL.md ]]; then
    local ref_dir
    ref_dir="$(dirname "$1")/references"
    if [ -d "$ref_dir" ]; then
      while IFS= read -r ref; do
        local rel="${ref#$ref_dir/}"
        printf '\n\n---\n\n## Reference: %s\n\n' "$rel"
        cat "$ref"
      done < <(find "$ref_dir" -name '*.md' -type f | sort)
    fi
  fi
}

  SKILL_CONTENT="$(flatten_distilled "$DISTILLED")"
  FIXTURE_CONTENT="$(<"$FIXTURE")"

  SUCCESS_SIGNALS=$(jq -r "$RUBRIC.success_signals // [] | .[]" <<<"$row")
  FAILURE_SIGNALS=$(jq -r "$RUBRIC.failure_signals // [] | .[]" <<<"$row")

  OUT_DIR="$CACHE/$NAME${VARIANT:+-$VARIANT}"
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
Task types: $(jq -r "$RUBRIC.task_types // [] | join(\", \")" <<<"$row")
Success signals (desired observable behaviors):
$(jq -r "$RUBRIC.success_signals // [] | .[] | \"  - \" + ." <<<"$row")
Failure signals (disqualifying behaviors):
$(jq -r "$RUBRIC.failure_signals // [] | .[] | \"  - \" + ." <<<"$row")
Expected procedure stages (context only — judge adherence loosely):
$(jq -r "$RUBRIC.stages // [] | .[] | \"  - \(.name): \(.hints | join(\"; \"))\"" <<<"$row")

OUTPUT
Respond with ONLY a JSON object, no code fences, no prose:
{
  \"success_signals\": {\"<signal-name>\": true|false, ...},
  \"failure_signals\": {\"<signal-name>\": true|false, ...},
  \"stages_followed\": [\"<stage-name>\", ...],
  \"verdict\": \"PASS\" | \"FAIL\"
}
$(judge_output_rule)"

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

score_run() {  # $1 = run number (1|2); sets RUN_VERDICT via decide_run
  local n="$1"
  echo "── run $n: actor (executes skill on fixture)…" >&2
  local actor_out judge_raw parsed
  if [ "$EVAL_MODE" = negative ]; then
    # No live actor: the fixture's canonical misusing response IS the
    # agent response under test (deterministic fault injection).
    actor_out=$(negative_payload "$FIXTURE")
  else
    actor_out=$(pi "${COMMON_PI_ARGS[@]}" --system-prompt "$ACTOR_SYSTEM" "${PI_ARGS[@]}" "$FIXTURE_CONTENT")
  fi
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

  decide_run "$parsed"
}

  echo "skill-eval: $NAME ($EVAL_MODE, 2 runs × actor+judge)"
  score_run 1; V1="$RUN_VERDICT"
  score_run 2; V2="$RUN_VERDICT"

  {
    printf '{\n  "skill": "%s",\n  "variant": "%s",\n  "mode": "%s",\n  "run_at": "%s",\n  "run1": "%s",\n  "run2": "%s",\n  "result": "%s"\n}\n' \
      "$NAME" "$VARIANT" "$EVAL_MODE" "$RUN_AT" "$V1" "$V2" \
      "$(if [ "$V1" = PASS ] && [ "$V2" = PASS ]; then echo PASS; else echo FAIL; fi)"
  } > "$OUT_DIR/result.json"

  if [ "$V1" = PASS ] && [ "$V2" = PASS ]; then
    echo "✅ skill-eval: $NAME${VARIANT:+:$VARIANT} PASS ($EVAL_MODE, 2/2 runs agree)"
    echo "   artifacts: ${CACHE#$REPO_ROOT/}/$NAME${VARIANT:+-$VARIANT}/"
    exit 0
  fi

  echo "❌ skill-eval: $NAME${VARIANT:+:$VARIANT} FAIL ($EVAL_MODE, run1=$V1 run2=$V2) — inspect ${CACHE#$REPO_ROOT/}/$NAME${VARIANT:+-$VARIANT}/"
  exit 1
}

# Library mode: sourcing defines functions (unit-tested by
# tests/test_skill_eval.sh) without executing an eval.
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then main "$@"; fi
