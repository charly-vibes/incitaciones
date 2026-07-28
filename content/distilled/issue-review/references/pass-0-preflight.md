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

**Prefix:** PRE-001, PRE-002, etc.