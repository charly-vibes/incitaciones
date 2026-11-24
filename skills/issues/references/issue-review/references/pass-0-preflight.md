# PASS 0: Pre-flight (Beads only)

Run before all content passes. Mechanical checks that don't require reading issue bodies.

**Check 1 — metadata.files coverage:**
```bash
bd list --format json | python3 -c "
import json, sys
issues = json.load(sys.stdin)
missing = [i['id'] for i in issues
           if not (i.get('metadata') or {}).get('files')]
if missing: print('Missing metadata.files:', missing)
"
```
Flag `[PRE-001] MEDIUM` for each ticket missing `metadata.files`.
Fix: `bd update <id> --set-metadata 'files=["path/to/file.py"]'`

**Check 2 — shared-file architecture smell:**
```bash
bd list --format json | python3 -c "
import json, sys
from collections import defaultdict
issues = json.load(sys.stdin)
owners = defaultdict(list)
for i in issues:
    for f in (i.get('metadata') or {}).get('files', []):
        owners[f].append(i['id'])
for f, ids in owners.items():
    if len(ids) >= 3: print(f, '->', ids)
"
```
Flag `[PRE-002] LOW` for any file claimed by 3+ open tickets.
Recommendation: consider a decomposition ticket to split `<file>` before these
tickets run (see navari-a3cv pattern). If not decomposing now, add a
co-modification note to all affected tickets.

**Check 3 — stale base commit (freshness):**
```bash
bd list --format json | python3 -c "
import json, subprocess, sys
issues = json.load(sys.stdin)
head = subprocess.run(['git','rev-parse','HEAD'], capture_output=True, text=True).stdout.strip()
for i in issues:
    meta = i.get('metadata') or {}
    base = meta.get('base_commit')
    if not base or base == head:
        continue
    files = meta.get('files') or []
    changed = []
    if files:
        changed = subprocess.run(
            ['git','diff','--name-only', f'{base}..HEAD', '--'] + files,
            capture_output=True, text=True).stdout.split()
    if changed:
        print(i['id'], 'STALE-TOUCHED', changed)
    else:
        print(i['id'], 'BEHIND-HEAD')
"
```
Flag `[PRE-003] HIGH` for STALE-TOUCHED: files in the ticket's scope changed since
`base_commit` — the description, acceptance criteria, or Meter may no longer apply.
Flag `[PRE-004] LOW` for BEHIND-HEAD: repo moved but ticket files untouched —
likely still valid, only re-anchor.
Fix: re-validate the ticket content against the current tree, then re-anchor:
```bash
sha=$(git rev-parse HEAD)
bd update <id> --metadata "{\"base_commit\": \"$sha\"}"
```
Tickets missing `base_commit` entirely: flag as part of PRE-001 remediation.

**Check 4 — estimate coverage and session-size ceiling:**
```bash
bd list --format json | python3 -c "
import json, sys
TOKEN_BUDGET = 150_000   # one session's context budget (2x subagent median 77K)
# Ceiling is token-primary: corpus p50 rates are 5,747 tok/min (afk/subagent) and
# 1,605 tok/min (interactive), so 150K tokens = ~26 min afk, ~93 min interactive.
for i in json.load(sys.stdin):
    est = i.get('estimated_minutes')  # bd JSON key; the CLI flag is --estimate
    if est is None or est == 0:
        print(i['id'], 'NO-ESTIMATE')
    elif est > 120:
        print(i['id'], 'OVERSIZED', est)
"
```
Plain `bd list` scans open issues; pass `--status all` for a full sweep.
Flag `[PRE-005] MEDIUM` for NO-ESTIMATE: without an estimate nothing tells an agent
whether the ticket fits one session's context budget (~150K tokens before compaction).
Batch fix: `bd update <id> --estimate 90`.
Flag `[PRE-006] HIGH` for OVERSIZED: the ticket cannot be completed in one session;
running it anyway forces mid-cycle compaction (losing red/green state) or an abandoned
claim. Fix: split into children at creation — one `bd create` per cycle, each wired
`--deps 'blocked-by:<previous-child-id>'` — or tag `complexity:xl` and treat as a
decomposition candidate (see Pass 5). Minutes are lane-dependent: at measured p50
rates 150K tokens is ~26 min of afk run time or ~93 min of interactive work, so the
120-minute mark is a scheduling midpoint — the token budget is the real ceiling.

**Check 5 — abandoned claims:**
```bash
bd list --format json | python3 -c "
import json, sys
for i in json.load(sys.stdin):
    if i.get('status') == 'in_progress':
        print(i['id'], 'CLAIMED', i.get('updated_at') or i.get('updatedAt') or '?')
"
```
Flag `[PRE-007] LOW` for each: a claimed ticket may belong to a dead session. Fix:
`bd reclaim` returns stale leases to ready; `bd close <id>` if the work actually landed.

**Prefix:** PRE-001, PRE-002, etc.