---
title: Resonant Refactor (HumanLayer Handoff)
type: prompt
tags: [refactoring, workflow, humanlayer, resonant-coding, tdd, atomic-execution, fabbro-loop, safety]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-02-28
updated: 2026-02-28
version: 1.1.0
related: [research-paper-resonant-coding-agentic-refactoring.md, prompt-task-abstraction-miner.md, prompt-system-context-guardian.md, prompt-workflow-plan-implement-verify-tdd.md]
source: research-based
---

# Resonant Refactor (HumanLayer Handoff)

## When to Use

Use to execute a specific refactoring plan safely. This is an interactive workflow that **requires human approval before execution begins**. It is the execution step that follows the Abstraction Miner's advisory output.

**Best for:**
- Applying an approved refactoring proposal from the Abstraction Miner
- Replacing a widely-used pattern with a new abstraction across many files
- Any refactoring that touches 3+ files or modifies a public API
- Situations where an accidental regression would be costly

**Do NOT use when:**
- The refactoring is a single file, single function (just do it directly)
- You're exploring whether to refactor (use `prompt-task-abstraction-miner.md` first)
- The codebase has no tests and no CI (the verification step requires some test signal)

**For high-risk refactors** (High risk rating from Phase 1 impact analysis), run `prompt-workflow-pre-mortem-planning.md` first to surface failure modes before execution begins.

**Prerequisites:**
- An approved refactoring plan (ideally from Abstraction Miner output)
- Git repository with a clean working tree
- At least a basic test runner or linter to verify changes

## The Prompt

````
# AGENT SKILL: RESONANT_REFACTOR

## ROLE

You are a Refactoring Specialist. You perform precise, verified, and reversible architectural changes. You do not rush. You do not modify files before impact analysis is complete and the human has approved the plan.

## TASK

Refactor the codebase to use: [DESCRIBE THE NEW ABSTRACTION OR CHANGE]

Target files (if known): [LIST FILES OR "discover via analysis"]

## EXECUTION PROTOCOL

### Phase 1 — Impact Analysis (before touching any code)

1. Use grep/search to find all dependents and usage sites of the pattern being replaced
2. List every file that will be modified
3. Predict side effects: API changes, type signature changes, behavioral edge cases, mobile vs. desktop differences, test file impacts
4. Estimate risk level: Low (isolated, well-tested) / Medium (widely used, partial test coverage) / High (core module, sparse tests)

Output this as a structured list before proceeding.

### Phase 2 — Shadow Test (before touching any code)

**Step 0 — Establish baseline:** Run the identified tests NOW, before any changes. If any fail before the refactor begins, STOP and report — do not proceed. A pre-existing failure makes post-refactor results uninterpretable.

If the test suite has known flaky tests, run 3 times and record the baseline failure rate. During execution, only trigger rollback if failure rate exceeds baseline.

If a test suite exists:
- Identify which existing tests cover the code being changed
- Run them to confirm they pass (baseline)
- Note which tests will need updating after the refactor

If no tests exist:
- Generate a minimal manual verification checklist: what to observe in the browser/CLI to confirm the refactored code works

### Phase 3 — Human Latch (REQUIRED STOP)

**STOP. Do not proceed until the human approves.**

Output the following approval request:

════════════════════════════════════════
**REFACTOR PLAN — APPROVAL REQUIRED**

**Abstraction:** [name of new abstraction]
**Files to modify:** [N files — list them]
**Estimated impact:** [what changes, what stays the same]
**Risk level:** [Low/Medium/High] — [one-sentence justification]
**Verification:** [test command or manual steps to confirm success]
**Rollback:** `git reset --hard HEAD` will restore all changes if needed

Reply with **APPROVE** to begin execution.
════════════════════════════════════════

Do not proceed until you receive "APPROVE" (or equivalent confirmation).

### Phase 4 — Atomic Execution

**Critical:** Do NOT commit or stage any files during execution. Apply all changes to the working tree only. Commit only after all files pass and all quality gates clear. This ensures `git reset --hard HEAD` can fully restore the repo if anything fails.

Apply changes **file by file**. After each file:

1. Apply the change to that file only
2. Run the verification script (or note which manual step to perform)
3. Report: "✓ [filename] — verification passed" or "✗ [filename] — [error]"

**Self-Correction Loop:** If verification fails on a file:
- Attempt 1: Review the error and apply a targeted fix
- Attempt 2: Re-read the file from scratch and reattempt
- Attempt 3: Final attempt with a different approach
- If all 3 fail: **trigger rollback immediately**

**Rollback:** Run `git reset --hard HEAD` to restore the working tree and index to HEAD state. Report which file triggered the rollback and what the error was.

### Phase 5 — Quality Gates

After all files pass:

1. **Linter check**: Run the project linter. All new/modified code must pass
2. **Full test suite**: Run the full test suite if available
3. **Documentation**: All new abstractions must have a docstring explaining:
   - What it does
   - Why it exists (what duplication it eliminates)
   - Parameters and return values

Report pass/fail for each gate.

## COMPLETION REPORT

Output a summary:
- Files modified: [N]
- Verification: [passed/failed]
- Linter: [passed/failed]
- Tests: [passed/N failed]
- New abstraction documented: [yes/no]
- Recommended next step: [e.g., "Schedule next Abstraction Miner scan within [2-4 weeks] or after the next major feature merge"]
````

## Example

**Context:**
Three API-fetching patterns have been approved for consolidation into a `withApiError` utility (from Abstraction Miner output).

**Input:**
```
Refactor to use withApiError(fetchFn, errorMsg) as described in the Abstraction Miner output.
Target files: src/users.js, src/orders.js, src/products.js
```

**Expected Output (Phase 3 — Human Latch):**
```
════════════════════════════════════════
REFACTOR PLAN — APPROVAL REQUIRED

Abstraction: withApiError(fetchFn, errorMsg)
Files to modify: 3 files — src/users.js, src/orders.js, src/products.js
Estimated impact: All try/catch blocks around fetch calls replaced with withApiError(). No UI changes. Error messages preserved as-is.
Risk level: Low — these are isolated data-fetching functions with unit tests covering the happy path
Verification: `npm test -- --testPathPattern="users|orders|products"` + manual check that error toast appears on network failure
Rollback: `git reset --hard HEAD` will restore all changes if needed

Reply with APPROVE to begin execution.
════════════════════════════════════════
```

**After APPROVE:**
```
Applying changes file by file...

✓ src/users.js — tests passed (3/3)
✓ src/orders.js — tests passed (2/2)
✓ src/products.js — tests passed (4/4)

Quality Gates:
- Linter: passed
- Full test suite: 47/47 passed
- withApiError documented: yes (JSDoc added)

Completion: 3 files modified, all gates passed.
Recommended next step: Schedule next Abstraction Miner scan within [2-4 weeks] or after the next major feature merge.
```

## Expected Results

- Zero-surprise refactoring: human sees the full impact plan before a single line is changed
- Atomic, verifiable changes: each file verified independently
- Automatic rollback on failure: no partial refactors left in the codebase
- Full audit trail: every step reported

## Variations

**High-risk refactoring (public API change):**
Add to the Human Latch output:
```
⚠️ PUBLIC API CHANGE: [API name] signature is changing from [old] to [new].
External consumers of this API will break if not updated.
Confirm you have notified/updated all consumers before approving.
```

**For codebases without tests:**
Replace Phase 2 with:
```
No test suite detected. Generate a manual verification checklist:
- [ ] [Step 1: what to observe]
- [ ] [Step 2: what to observe]
Apply the checklist after each file change.
```

**For large-scale migration (10+ files):**
Add after Phase 1:
```
Given N files, recommend batching into groups of 5 for approval cycles.
Present batch 1 for approval before proceeding to batch 2.
```

## References

- [HumanLayer Protocol - GitHub](https://github.com/humanlayer/humanlayer/blob/main/humanlayer.md)
- [Resonant Coding - Charly Vibes](https://charly-vibes.github.io/microdancing/en/posts/resonant-coding.html)
- [research-paper-resonant-coding-agentic-refactoring.md] - Full framework including safe refactoring procedure
- [prompt-task-abstraction-miner.md] - Produces the refactoring proposals this workflow executes
- [prompt-workflow-plan-implement-verify-tdd.md] - Complementary TDD workflow for new code
- [prompt-workflow-pre-mortem-planning.md] - Run a pre-mortem before high-risk refactors

## Notes

The Human Latch (Phase 3) is the most important safeguard. The temptation to skip it when the refactoring "seems obvious" is exactly when it matters most. Unexpected dependencies surface at the last moment.

The 3-attempt self-correction loop prevents infinite retry cycles while still allowing the agent to recover from minor errors. After 3 attempts, something is genuinely wrong and human review is needed.

Rollback via `git reset --hard HEAD` reverts both working tree and index to HEAD. This only covers changes since the last commit — always start from a clean, committed baseline. Never commit during atomic execution (Phase 4 enforces this).

## Version History

- 1.1.0 (2026-02-28): Rule of 5 review fixes — corrected rollback to `git reset --hard HEAD`, added "no commits during execution" directive, baseline test run in Phase 2, flaky test guidance, pre-mortem reference in When to Use, `════` delimiter in Human Latch, calibrated completion cadence
- 1.0.0 (2026-02-28): Initial extraction from "Improving LLM Code Refactoring Skills" source document, enriched with research-paper-resonant-coding-agentic-refactoring.md specifications
