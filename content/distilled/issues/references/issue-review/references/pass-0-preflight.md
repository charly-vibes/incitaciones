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

**Prefix:** PRE-001, PRE-002, etc.