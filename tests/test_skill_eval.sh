#!/usr/bin/env bash
# Tests for scripts/skill-eval.sh eval machinery — unit level, no LLM calls.
#
# Covers (incitaciones-bbt):
# - library mode: sourcing the script defines functions without running an
#   eval or requiring arguments (pure functions must be testable)
# - decide_run positive mode: existing rule (no failure signal, >= half of
#   success signals, judge verdict PASS)
# - decide_run negative mode (:negative convention): passes when >= half the
#   declared failure signals fire; success signals ignored; a rubric with
#   zero failure signals is vacuous and must FAIL
# - judge_output_rule: the judge's decision text differs per mode
#
# Run: bash tests/test_skill_eval.sh   (exit 0 = all green)

set -u
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT="$REPO_ROOT/scripts/skill-eval.sh"

PASS_COUNT=0
FAIL_COUNT=0

assert_eq() { # got want label
  if [ "$1" = "$2" ]; then
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    FAIL_COUNT=$((FAIL_COUNT + 1))
    echo "FAIL: $3"
    echo "  got:  $1"
    echo "  want: $2"
  fi
}

# --- library mode: sourcing must not execute an eval ------------------------
# shellcheck source=../scripts/skill-eval.sh
source "$SCRIPT"

# --- decide_run: positive mode (existing rule, regression guard) ------------
EVAL_MODE="positive"
decide_run '{"success_signals":{"a":true,"b":true,"c":true},"failure_signals":{"x":false},"verdict":"PASS"}'
assert_eq "$RUN_VERDICT" "PASS" "positive: clean pass"
decide_run '{"success_signals":{"a":true,"b":true,"c":true},"failure_signals":{"x":true},"verdict":"PASS"}'
assert_eq "$RUN_VERDICT" "FAIL" "positive: any failure signal fails"
decide_run '{"success_signals":{"a":true,"b":false,"c":false},"failure_signals":{"x":false},"verdict":"PASS"}'
assert_eq "$RUN_VERDICT" "FAIL" "positive: minority success signals fail"
decide_run '{"success_signals":{"a":true,"b":true},"failure_signals":{"x":false},"verdict":"FAIL"}'
assert_eq "$RUN_VERDICT" "FAIL" "positive: judge FAIL verdict fails"

# --- decide_run: negative mode (:negative convention) ------------------------
EVAL_MODE="negative"
decide_run '{"success_signals":{},"failure_signals":{"x":true,"y":true,"z":false},"verdict":"PASS"}'
assert_eq "$RUN_VERDICT" "PASS" "negative: majority failure signals pass"
decide_run '{"success_signals":{},"failure_signals":{"x":true,"y":false,"z":false},"verdict":"PASS"}'
assert_eq "$RUN_VERDICT" "FAIL" "negative: minority failure signals fail"
decide_run '{"success_signals":{},"failure_signals":{"x":false,"y":false},"verdict":"PASS"}'
assert_eq "$RUN_VERDICT" "FAIL" "negative: zero failure signals fail"
decide_run '{"success_signals":{},"failure_signals":{},"verdict":"PASS"}'
assert_eq "$RUN_VERDICT" "FAIL" "negative: vacuous rubric (no failure signals) must fail"
decide_run '{"success_signals":{"a":false,"b":false,"c":false,"d":false},"failure_signals":{"x":true,"y":true},"verdict":"PASS"}'
assert_eq "$RUN_VERDICT" "PASS" "negative: success signals ignored even at zero"
decide_run '{"success_signals":{},"failure_signals":{"x":true,"y":true},"verdict":"FAIL"}'
assert_eq "$RUN_VERDICT" "FAIL" "negative: judge FAIL verdict fails"

# --- judge_output_rule: per-mode decision text -------------------------------
POS_RULE=$(EVAL_MODE="positive"; judge_output_rule)
case "$POS_RULE" in
  *"any failure signal is true"*) PASS_COUNT=$((PASS_COUNT + 1)) ;;
  *) FAIL_COUNT=$((FAIL_COUNT + 1)); echo "FAIL: positive judge rule missing failure-signal text: $POS_RULE" ;;
esac

NEG_RULE=$(EVAL_MODE="negative"; judge_output_rule)
case "$NEG_RULE" in
  *"failure signals are true"*) PASS_COUNT=$((PASS_COUNT + 1)) ;;
  *) FAIL_COUNT=$((FAIL_COUNT + 1)); echo "FAIL: negative judge rule missing inverted decision: $NEG_RULE" ;;
esac
case "$NEG_RULE" in
  *"any failure signal is true"*) FAIL_COUNT=$((FAIL_COUNT + 1)); echo "FAIL: negative judge rule leaks positive-only decision" ;;
  *) PASS_COUNT=$((PASS_COUNT + 1)) ;;
esac

# --- negative_payload: extract the mutation payload from a negative fixture --
TMPFIX=$(mktemp)
cat > "$TMPFIX" <<'FIXEOF'
# Fixture: close:negative — out-of-scope task

The user says: do the usual end-of-day thing.

## Canonical misusing response

1. Commit and push everything with git add -A.
2. Clear the context.
FIXEOF
GOT=$(negative_payload "$TMPFIX")
WANT=$'1. Commit and push everything with git add -A.
2. Clear the context.'
assert_eq "$GOT" "$WANT" "negative_payload: extracts text after marker"

printf '# Fixture: broken — no payload marker

Just a task, no canonical misusing response section.
' > "$TMPFIX"
if negative_payload "$TMPFIX" >/dev/null 2>&1; then
  FAIL_COUNT=$((FAIL_COUNT + 1)); echo "FAIL: negative_payload: missing marker must be an error"
else
  PASS_COUNT=$((PASS_COUNT + 1))
fi
rm -f "$TMPFIX"

# --- resolve_distilled: pointer entries eval their member content ------------
GOT=$(resolve_distilled "content/distilled/pointers/close.md" "session/close")
assert_eq "$GOT" "$REPO_ROOT/content/distilled/session/references/close/SKILL.md" \
  "resolve_distilled: pointer_for resolves to member SKILL.md"
GOT=$(resolve_distilled "content/distilled/commit.md" "")
assert_eq "$GOT" "$REPO_ROOT/content/distilled/commit.md" \
  "resolve_distilled: non-pointer passes through"
GOT=$(resolve_distilled "content/distilled/pointers/close.md" "")
assert_eq "$GOT" "$REPO_ROOT/content/distilled/pointers/close.md" \
  "resolve_distilled: pointer without pointer_for passes through"
GOT=$(resolve_distilled "content/distilled/pointers/ghost.md" "router/ghost")
assert_eq "$GOT" "$REPO_ROOT/content/distilled/pointers/ghost.md" \
  "resolve_distilled: missing member falls back to the pointer"

# --- report -------------------------------------------------------------------
echo "tests/test_skill_eval.sh: $PASS_COUNT passed, $FAIL_COUNT failed"
[ "$FAIL_COUNT" -eq 0 ]
