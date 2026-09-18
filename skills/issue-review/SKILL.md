---
name: issue-review
description: "Compiled alias of the issue review mode of the issues skill. Hidden from model invocation; invocable via /skill:issue-review; serves the legacy site URL with full compiled content."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.10.0"
  internal: true
---
> **Moved:** this entry is now the **issue-review** mode of the **issues** skill.
> The full method is compiled below from `content/distilled/issues/references/issue-review/SKILL.md`.
> Invoke via `/skill:issue-review`, invoke `/skill:issues` for the mode table,
> or use this URL directly in a chat interface.

#### Core Instructions (content/distilled/issues/references/issue-review/SKILL.md)

# Tracer-Bullet Issue Review (Rule of 5)

Review an issue set in five passes, with special attention to whether tickets are true tracer-bullet vertical slices.

## Setup

Read `references/setup.md` for tracker-specific collection commands before reviewing.

## Procedure

1. Gather the issue set to review plus the source plan/spec/parent issue when available.
2. For Beads trackers, run PASS 0 pre-flight checks first: `references/pass-0-preflight.md`
3. Run the content passes in order:
   - Pass 1: `references/pass-1-clarity.md`
   - Pass 2: `references/pass-2-scope.md`
   - Pass 3: `references/pass-3-dependencies.md`
   - Pass 4: `references/pass-4-alignment.md`
   - Pass 5: `references/pass-5-executability.md`
4. After each pass starting with pass 2, evaluate convergence using `references/convergence.md`.
5. If converged, stop.
6. Produce the final report using `references/final-report.md`.

## Review Lens

Treat the best issue sets as:
- thin vertical slices rather than layer tickets
- independently verifiable or demoable
- minimal but sufficient dependency graphs
- explicit about AFK vs HITL work
- traceable back to stories, plans, or specs
- self-describing: tickets that create or reshape source files carry the file-header criterion (see `file-headers`) — undocumented files force agents to re-derive intent
- machine-verifiable value claims: quantified Must gate, runnable Meter, explicit anti-goals, and a `base_commit` anchor that reveals staleness

## Rules

- Reference issue IDs precisely.
- Verify issue content before flagging a problem.
- Prioritize blockers over cosmetic cleanup.
- Suggest exact tracker edits or commands when practical.
- Call out horizontal decomposition explicitly: backend-only, schema-only, UI-only, or refactor-only tickets that should be folded into a tracer bullet.

---

#### Reference: references/convergence.md

## Convergence Check

After each pass starting with pass 2, report:

```text
Convergence Check After Pass [N]:

1. New CRITICAL issues: [count]
2. Total new issues this pass: [count]
3. Total new issues previous pass: [count]
4. Estimated false positive rate: [percentage]

Status: [CONVERGED | ITERATE | NEEDS_HUMAN]
```

Criteria:
- `CONVERGED`: no new CRITICAL issues, <10% new issues vs previous pass, <20% false positives
- `ITERATE`: continue
- `NEEDS_HUMAN`: blocking judgment call required

---

#### Reference: references/final-report.md

## Final Report Template

```text
## Issue Tracker Review Final Report

System: [Beads/GitHub/Linear/Jira]
Scope: [All issues / Milestone / Label set]
Source: [Plan/spec/parent issue if known]

### Summary

Total Issues Reviewed: [count]

Issues Found by Severity:
- CRITICAL: [count]
- HIGH: [count]
- MEDIUM: [count]
- LOW: [count]

Convergence: Pass [N]

### Tracer-Bullet Assessment

- Slice quality: [Excellent|Good|Fair|Poor]
- Horizontal-ticket leakage: [None|Low|Moderate|High]
- AFK/HITL clarity: [Excellent|Good|Fair|Poor]

### Top 3 Most Critical Findings

1. [ID] [Finding]
   - Impact: [Why it blocks or degrades execution]
   - Fix: [Exact command or edit]

2. [ID] [Finding]
   - Impact: [Why it matters]
   - Fix: [Exact command or edit]

3. [ID] [Finding]
   - Impact: [Why it matters]
   - Fix: [Exact command or edit]

### Recommended Actions

- Provide exact tracker commands where practical.
- Collapse horizontal tickets into tracer bullets when possible.
- Include file paths, tests, and plan/story references when missing.

### Verdict

[READY_TO_WORK | NEEDS_UPDATES | NEEDS_REPLANNING]

Rationale: [1-2 sentences]

### Issue Quality Assessment

- Clarity: [Excellent|Good|Fair|Poor]
- Scope: [Excellent|Good|Fair|Poor]
- Dependencies: [Excellent|Good|Fair|Poor]
- Completeness: [Excellent|Good|Fair|Poor]
```

---

#### Reference: references/pass-0-preflight.md

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

---

#### Reference: references/pass-1-clarity.md

## Pass 1: Completeness and Clarity

Focus on:
- Clear title
- Sufficient context
- Concrete file paths and changes
- Success criteria or tests
- Unambiguous done criteria

Watch for:
- Vague titles
- Minimal descriptions
- "Implement X" without where or how
- Missing verification steps

Output:

```text
PASS 1: Completeness & Clarity

Issues Found:

[CLRT-001] [CRITICAL|HIGH|MEDIUM|LOW] - Issue ID/Number
Title: [Issue title]
Description: [What's unclear or incomplete]
Evidence: [Why this is a problem]
Recommendation: [How to fix]
```

---

#### Reference: references/pass-2-scope.md

## Pass 2: Scope, Atomicity, and Tracer-Bullet Shape

Focus on:
- One logical capability per issue
- Thin vertical slices instead of horizontal layer tickets
- Issues small enough to finish in one focused session
- Clear boundaries with no overlap
- Independent demo or verification value

Watch for:
- Oversized epics disguised as issues
- Backend-only / schema-only / UI-only tickets that should be part of one slice
- Preparatory plumbing tickets with no standalone value
- Trivial issues that should be bundled into a slice
- Refactor + feature bundles with unclear boundaries

Questions to ask:
- If this issue lands alone, is anything real now possible or testable?
- Does it cut through the necessary layers for one outcome?
- Would splitting it by component create worse tickets?

Prefix findings with `SCOPE-`.

---

#### Reference: references/pass-3-dependencies.md

## Pass 3: Dependencies and Ordering

Focus on:
- Correct dependency links
- Missing prerequisites
- Circular dependencies
- Avoidable serialization
- Sensible critical path
- Whether the issue graph reflects tracer bullets rather than phase gates

Watch for:
- Hidden blockers
- Cycles
- Artificial bottlenecks from horizontal decomposition
- Missing rationale for dependencies
- Tickets blocked only because the work was split by layer instead of by outcome

Questions to ask:
- Could these issues run in parallel if they were sliced vertically?
- Is a dependency real, or an artifact of poor decomposition?
- Are HITL issues isolated so AFK work can continue around them?

Prefix findings with `DEP-`.

---

#### Reference: references/pass-4-alignment.md

## Pass 4: Plan, Story, and Spec Alignment

Focus on:
- Traceability to plan/spec sections or user stories
- Coverage of the intended workflow end-to-end
- Alignment between the chosen issue breakdown and the source material
- Explicit tests before implementation
- AFK/HITL classification when relevant

Watch for:
- Missing plan or story references
- Gaps where a user story is only partially covered across layer tickets
- Specs with no corresponding issue
- Issues that contradict the intended implementation approach
- Breakdown by phase/component when the source material describes user outcomes

Prefix findings with `ALIGN-`.

---

#### Reference: references/pass-5-executability.md

## Pass 5: Executability and Handoff

Focus on:
- Can another developer or agent pick this up immediately?
- Are verification steps concrete and end-to-end?
- Is there a machine-checkable Must gate (quantified, unit + number) backed by a runnable Meter command?
- Are touched code files self-describing — Purpose/Responsibilities/Rationale header present and current (see `file-headers`)?
- Are priorities and labels sensible?
- Are HITL handoff points explicit?
- Is it clear what demo, test, or observable behavior proves completion?

Watch for:
- Hidden conversational context
- "You know what to do"
- Missing verification commands or test references
- Qualitative acceptance criteria with no unit or threshold ("fast", "robust", "clean") — a Scale/Meter is missing
- A Meter command that cannot run at the ticket's `base_commit` (stale claim) or that no fresh agent could execute verbatim
- Missing anti-goals on tickets touching tests, lockfiles, or public interfaces (reward-hacking surface: nothing stops gaming the gate)
- Tickets that create or reshape source files with no file-header acceptance criterion — undocumented files force every implementing agent to re-derive intent
- No regression suite named (pass-to-pass coverage unspecified)
- HITL work masquerading as AFK
- Tickets that cannot be closed without information from another issue not listed as a blocker

Prefix findings with `EXEC-`.

---

#### Reference: references/setup.md

## Gathering Issues to Review

### Beads

```bash
bd list
bd ready
bd graph
bd show <id>
bd dep tree
bd dep cycles
```

### GitHub Issues

```bash
gh issue list --label "needs-review" --json number,title,body,labels
gh issue view <number>
```

### Other systems

- Export issues to JSON or CSV.
- Use available CLI or API tooling.
- Require issue data as input before reviewing.
