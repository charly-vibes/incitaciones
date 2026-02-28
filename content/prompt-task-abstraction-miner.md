---
title: Abstraction Miner (Dry-Dock Protocol)
type: prompt
tags: [refactoring, abstraction, duplication, resonant-coding, code-quality, dry, fabbro-loop]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-02-28
updated: 2026-02-28
version: 1.1.0
related: [research-paper-resonant-coding-agentic-refactoring.md, prompt-system-context-guardian.md, prompt-workflow-resonant-refactor.md]
source: research-based
---

# Abstraction Miner (Dry-Dock Protocol)

## When to Use

Use when you suspect a codebase has accumulated semantic duplication — code that does the same thing but looks different. This is a **passive, advisory-only** skill: it scans, proposes, and stops. It never writes to the codebase.

**Best for:**
- Codebases grown through vibe coding or rapid prototyping
- Before starting a refactoring sprint (produces the prioritized backlog)
- Weekly/periodic technical debt audits
- When a developer notices "code smell" but can't pinpoint it

**Do NOT use when:**
- You want to immediately refactor (use `prompt-workflow-resonant-refactor.md` for that)
- The codebase is a greenfield project with few components
- You need a single-file code review (use `prompt-task-iterative-code-review.md`)

**Prerequisites:**
- A list of files or a directory to analyze
- (Optional) an AGENTS.md or architecture reference for the "Golden Standard"

## The Prompt

````
# AGENT SKILL: ABSTRACTION_MINER

## ROLE

You are a Pattern Recognition Engine operating under the Resonant Coding protocol. Your goal is to detect "Dissonance" (duplication, tight coupling) and resolve it into "Resonance" (reusable abstractions).

Do NOT write any code to the codebase during this session. This is an advisory-only scan.

## INPUT

- Target files or directory: [SPECIFY FILES OR DIRECTORY]
- Architecture reference (optional): [PASTE AGENTS.md RULES OR KEY PATTERNS, OR "none"]

## PROTOCOL (The Fabbro Loop)

### Phase 1 — Semantic Scanning

Read all provided files. Ignore variable names and whitespace.

Look for **Identical Intent** — code that does the same logical operation even if it looks different:
- Multiple ways of handling errors that all result in the same user-facing outcome
- UI components that share 80%+ of their structure with different labels/data
- Repeated sequences of setup → operation → teardown
- Multiple fetch/data-loading patterns with the same retry/error/loading logic

### Phase 2 — Cluster Analysis

Group instances into named clusters. For each cluster:
- **Invariant**: the logic that never changes across instances
- **Variant**: the data, config, or context that changes per instance
- **Occurrence count**: how many times this pattern appears

Only report clusters with **3 or more occurrences** (fewer likely don't justify abstraction). An occurrence is a distinct code site implementing the same logic — count unique implementations, not call sites. (e.g., a function called 10 times from one file counts as 1 occurrence, not 10.)

### Phase 3 — Abstraction Proposal

For each cluster propose a "Golden Standard" abstraction (function, component, class, hook, or utility) that:
- Encapsulates the Invariant as the implementation
- Accepts the Variant as parameters
- Follows the Open/Closed Principle (extensible without modifying the abstraction)

**Skip any cluster** where the abstraction would save fewer than ~10 lines of code total. Note it but don't propose a refactor (avoid Abstraction Bloat). Exception: correctness or safety abstractions where the value is error-surface reduction, not LOC — these are worth extracting even if they save 0 lines.

### Phase 4 — Refactoring Blueprint

For each valid proposal:
1. Show the abstraction code (do not apply it)
2. Show a before/after diff for one usage site to illustrate the simplification
3. Flag any behavioral subtleties that could cause false equivalence

## OUTPUT FORMAT

### Summary Table

| Pattern Name | Occurrences | Est. Lines Saved | Risk | Priority |
|:-------------|:------------|:-----------------|:-----|:---------|
| [Name]       | [Count]     | [Lines]          | [High/Med/Low] | [1-N] |

### Detail per Cluster

For each row in the table, provide:
- **Cluster**: what the pattern does
- **Invariant / Variant**: what's fixed vs. what changes
- **Proposed abstraction**: code block (do not apply)
- **Usage diff**: before → after for one site
- **Caveats**: edge cases or behavioral subtleties to verify before applying

### Needs Human Review

List any clusters where semantic equivalence is uncertain — patterns that look similar but may have subtle behavioral differences that require human judgment.

## STOP CONDITION

When all provided files have been scanned and all clusters with ≥3 occurrences reported, output the summary and stop. Do not modify any files.

If no clusters meet the threshold, output:

> **No semantic duplication clusters found** meeting the threshold (≥3 occurrences, ~10 lines saved) in the scanned files. The codebase appears resonant in this area. No refactoring proposals generated.

Do not fabricate findings to fill the table.
````

## Example

**Context:**
A React codebase where three different pages each fetch data and handle loading/error states with slightly different implementations.

**Input:**
```
Scan src/pages/UsersPage.tsx, src/pages/OrdersPage.tsx, src/pages/ProductsPage.tsx
Architecture reference: none
```

**Expected Output:**

### Summary Table

| Pattern Name | Occurrences | Est. Lines Saved | Risk | Priority |
|:-------------|:------------|:-----------------|:-----|:---------|
| API Fetch with Loading/Error State | 3 | ~45 lines | Low | 1 |

### Detail: API Fetch with Loading/Error State

**Cluster:** Each page manually manages `loading`, `error`, and `data` state for a single API call.

**Invariant:** useState for loading/error/data → useEffect to fetch → conditional render of loading spinner / error message / content

**Variant:** The fetch function, the error message text, and the content component

**Proposed abstraction:**

```typescript
function useFetch<T>(fetchFn: () => Promise<T>) {
  const [state, setState] = useState<{ loading: boolean; error: string | null; data: T | null }>
    ({ loading: true, error: null, data: null });
  useEffect(() => {
    fetchFn()
      .then(data => setState({ loading: false, error: null, data }))
      .catch(e => setState({ loading: false, error: e.message, data: null }));
  }, []);
  return state;
}
```

**Usage diff (UsersPage.tsx):**
Before: 18 lines of useState/useEffect/conditionals
After: `const { loading, error, data } = useFetch(fetchUsers);`

## Expected Results

- A prioritized backlog of refactoring opportunities with estimated impact
- Code-free: no files are modified
- Actionable proposals ready for human review before passing to `prompt-workflow-resonant-refactor.md`
- Flagged ambiguous cases that need human judgment before proceeding

## Variations

**For a specific pattern type only:**
```
Only look for API error-handling duplication. Ignore UI structure patterns.
```

**For a large codebase (chunked scan):**
```
Scan only the files with the most recent git changes (high-churn areas).
I'll provide the output of `git log --name-only --since="30 days ago"`.
```

**For a single concern:**
```
Focus only on authentication/authorization logic duplication.
```

## References

- [Resonant Coding - Charly Vibes](https://charly-vibes.github.io/microdancing/en/posts/resonant-coding.html)
- [research-paper-resonant-coding-agentic-refactoring.md] - Full theoretical framework and skill specification
- [prompt-workflow-resonant-refactor.md] - Next step: execute the proposals this skill produces
- [prompt-system-context-guardian.md] - Complementary: prevents new duplication during development

## Notes

The key insight is **semantic equivalence, not syntactic similarity**. Code that looks completely different can still be semantically duplicated. The prompt forces the agent to look at *intent* (what it does) rather than *form* (how it's written).

The `~10 lines` minimum-savings threshold in Phase 3 is a starting heuristic — calibrate per project. Small utility scripts may warrant abstractions at 5 lines; large enterprise codebases may prefer 20+. The exception for correctness/safety abstractions (worth extracting even at 0 lines saved) is the more important rule.

The "Needs Human Review" section is critical: false semantic equivalence (two things that look the same but have subtle behavioral differences) is the primary failure mode of this skill.

## Version History

- 1.1.0 (2026-02-28): Rule of 5 review fixes — fixed nested code block in Example, added zero-results handling to Stop Condition, clarified "occurrence" definition in Phase 2, moved safety-abstraction exception into Phase 3, cleaned Notes duplication
- 1.0.0 (2026-02-28): Initial extraction from "Improving LLM Code Refactoring Skills" source document, enriched with research-paper-resonant-coding-agentic-refactoring.md specifications
