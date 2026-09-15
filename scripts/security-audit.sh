#!/usr/bin/env bash
# Purpose: Scan the skill corpus for supply-chain risk patterns before publication.
# Responsibilities:
# - Scan content/distilled/**.md and content/prompt-*.md for: hardcoded credentials,
#   known API-key formats, curl/wget piped to shell, destructive rm, permission
#   escalation, and safety-bypass instructions.
# - Suppress advisory mentions: lines that teach a reviewer to FLAG a pattern
#   (red-team content) or give a refusal example are not execution instructions.
#   NOTE: no bare "example" term — it swallows real hits whose URL/domain
#   contains ".example" (caught by negative test 2026-09-16).
# - Print every surviving hit as file:line with pattern name and matched text.
# Rationale: incitaciones-8am — published skills are supply chain, not config
# (B166/Nubank evidence): they steer code other people's agents generate. Wired
# into `just sync-manifest` so nothing unvetted reaches a release.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

mapfile -t FILES < <({ find content/distilled -name '*.md'; find content -maxdepth 1 -name 'prompt-*.md'; } | sort -u)
if [ ${#FILES[@]} -eq 0 ]; then
    echo "security-audit: no corpus files found — is content/ present?"
    exit 1
fi

# Lines matching this are advisory (teach to flag/avoid, give refusal examples),
# not execution instructions. Keep narrow: every filter here must be justified
# by a real corpus line, or the gate degrades into false positives.
ADVISORY='(\bflag|\bavoid|\bnever\b|do not|don.t|require|reject|refus|e\.g\.)'

# Risk patterns, each with a name used in output. Reviewable list: adjust here,
# with corpus evidence, when adding.
declare -a PATTERNS=(
    "credential-assignment:(api[_-]?key|access[_-]?token|secret|password|passwd|credential)[a-z_]*['\"]?[[:space:]]*(=|:=)[[:space:]]*['\"][^'\"\\\$\{]{8,}"
    "known-key-format:(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|gho_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|xox[bp]-[A-Za-z0-9-]{10,}|BEGIN [A-Z ]*PRIVATE KEY)"
    "pipe-to-shell:(curl|wget)[^|]*\|[[:space:]]*(sudo[[:space:]]+)?(ba)?sh\b"
    "destructive-rm:rm[[:space:]]+-[a-zA-Z]*r[a-zA-Z]*f?[a-zA-Z]*[[:space:]]+[^ ]*(\\\$\{|~|\*|\.\.|/etc|/usr|/var|/home)"
    "permission-escalation:chmod[[:space:]]+[^ ]*(777|666|u\+s|a\+s|g\+s)"
    "safety-bypass:(disable|bypass|skip)[[:space:]]+(the[[:space:]]+)?(safety|security|sanity|validation)"
)

HITS=0
for entry in "${PATTERNS[@]}"; do
    name="${entry%%:*}"
    rx="${entry#*:}"
    # grep -E does not support (?i); emulate case-insensitivity per pattern
    while IFS= read -r hit; do
        [ -n "$hit" ] || continue
        if echo "$hit" | grep -qiE "$ADVISORY"; then
            continue
        fi
        if [ $HITS -eq 0 ]; then
            echo "❌ security-audit: risk patterns found:"
        fi
        echo "  [$name] $hit"
        HITS=$((HITS + 1))
    done < <(grep -rniE "$rx" "${FILES[@]}" || true)
done

if [ $HITS -gt 0 ]; then
    echo ""
    echo "$HITS risk hit(s) — each must be fixed or the pattern justified in scripts/security-audit.sh before publishing."
    exit 1
fi

echo "✅ security-audit: ${#FILES[@]} corpus files scanned, 0 risk patterns"
