---
name: review
description: "Multi-pass reviews of code, plans, specs, or docs: general code review, Rule-of-5 iterative refinement, parallel agent review waves, multi-agent coordination, adversarial red-team pass, guided teaching review. Trigger on review requests."
metadata:
  installed-from: "incitaciones"
  installed-version: "0.10.3"
---
# Review Router

Route a review request to the right review method, then read that method's instructions before acting.

## Modes

| Task signal | Mode | Read |
|---|---|---|
| "review this code/PR/change" — general multi-pass review | code-review | `references/code-review/SKILL.md` |
| iterate any artifact (code, plan, spec, docs, research) through 5 editorial stages to convergence | rule-of-5-universal | `references/rule-of-5-universal/SKILL.md` |
| high-stakes change needing parallel agent review waves | parallel-review | `references/parallel-review/SKILL.md` |
| coordinate multiple agents for comprehensive review coverage | multi-agent-review | `references/multi-agent-review.md` |
| adversarial pass hunting logic bugs, failure modes, security, deployment risk | red-team-review | `references/red-team-review.md` |
| review that teaches the human the change and surrounding code | guided-review | `references/guided-review.md` |

## Selection rules

- Default code-review requests → **code-review**. Explicitly iterative/editorial refinement of any artifact → **rule-of-5-universal**.
- "break it", "find vulnerabilities", "what could fail in production" → **red-team-review**.
- More than one reviewer perspective is requested or stakes are high → **parallel-review** (agent waves) or **multi-agent-review** (coordination pattern).
- The user wants to learn, not just fix → **guided-review**.

## Procedure

1. Identify the mode from the table above.
2. Read the referenced file (resolve paths against this skill's directory). Multi-file modes have their own `references/` — follow their cross-references.
3. Apply the mode's output format and convergence rules.
