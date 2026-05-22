---
title: Evidence-Backed Project Status Report
type: prompt
tags: [project-management, status-reporting, agentic-coding, software-delivery, observability]
tools: [claude-code, cursor, gemini, chatgpt]
status: draft
created: 2026-05-22
updated: 2026-05-22
version: 1.0.0
related:
  - research-finding-project-status-reporting-synthesis.md
  - prompt-task-describe-pr.md
  - prompt-workflow-deliberate-commits.md
source: research-based
---

# Evidence-Backed Project Status Report

## When to Use

Use this prompt when you need to create a project status update that is decision-grade, evidence-backed, and tailored to a specific audience.

**Use for:**
- weekly project updates;
- executive or portfolio summaries;
- client or sponsor status reports;
- engineering delivery updates;
- agentic-coding work where traces, tool calls, verification, and human approvals matter;
- recovery updates for Amber/Red work.

**Do NOT use when:**
- the user only wants a casual progress note;
- there is no evidence source at all, including user-provided notes, and the task is to invent a report;
- the work is purely retrospective and does not need forecast, risks, or decisions.

**Prerequisites:**
- Know the reporting period, audience, and project or workstream.
- Gather available evidence first: issues, PRs, commits, CI, deployments, incidents, metrics, risk logs, decision logs, client messages, or agent traces.
- If evidence is missing, mark it as unknown instead of guessing.

## The Prompt

````
# Create an Evidence-Backed Project Status Report

Create a concise, decision-grade project status report for the requested project, workstream, or agent run.

## Inputs

If not provided, ask for the minimum missing context before drafting:
- project/workstream name;
- reporting period;
- audience: executive, engineering, product, client/sponsor, or mixed;
- available evidence sources: tickets, PRs, commits, CI/CD, incidents, metrics, docs, risk logs, decision logs, traces, or user-provided notes;
- baseline commitments, if any: scope, date, budget, quality, OKR, milestone, or SOW.

## Evidence Rules

- Prefer evidence-linked claims over narrative claims.
- Separate facts from interpretation.
- Mark unknowns explicitly instead of filling gaps with optimistic prose.
- Link to access-controlled evidence; do not paste secrets, credentials, personal data, private code, sensitive prompts, or sensitive trace content.
- If no safe evidence link exists, summarize only non-sensitive metadata, such as artifact ID, trace ID, run time, status, and redacted outcome.
- Never report Green without objective supporting evidence.
- If evidence conflicts, report dimension-specific status before assigning overall RAG.
- Separate “blocked” from “at risk”: blocked means work cannot proceed without external action; at risk means the forecast is threatened.
- Separate “tests passed” from “accepted,” “merged,” “deployed,” or “independently verified.”

## Status Scale

Use organization-specific thresholds when available. If none exist, use:

- **Unknown / Unrated:** no agreed baseline exists, evidence is insufficient, or discovery work has not established meaningful thresholds.
- **Green:** within agreed tolerance; no unresolved blocker threatens a key commitment; evidence supports the forecast.
- **Amber:** material variance or dependency risk exists, but there is a credible recovery plan with owner and date.
- **Red:** a critical objective, milestone, safety requirement, compliance requirement, or budget/schedule constraint is no longer under control, or no credible recovery plan exists.

## Procedure

1. Identify the audience and decision the report should support.
2. Gather or inspect available evidence before drafting.
3. Determine baseline vs current state.
4. Assign dimension-specific status when useful: scope, schedule, quality, reliability, cost, risk, governance.
5. Assign overall status only after reviewing evidence.
6. List completed outcomes, current work, forecast changes, blockers, risks, dependencies, and decisions needed.
7. For every Amber or Red item, include owner, mitigation, and next review date; if any field is unknown, mark it unknown and list it as a decision/ask.
8. If agentic AI was used, include the agentic evidence section.
9. Keep the executive summary short; put trace-level or ticket-level detail behind links or appendices.
10. For mixed audiences, put the executive summary first and move technical detail to evidence links or an appendix.

## Output Template

Use only applicable sections. Omit empty sections rather than padding a lightweight update.

```markdown
# Project Status: <project name>

Reporting period: <date range>
Owner / DRI: <name or unknown>
Audience: <executive | engineering | product | client | mixed>
Overall status: <Unknown / Unrated | Green | Amber | Red>
Trend: <Improving | Stable | Worsening | Unknown>
Confidence: <High | Medium | Low | Unknown>

## Executive Summary
- <1-3 bullets on outcome, forecast, and most important risk/ask>

## What Changed Since Last Report
- Completed: <evidence-linked outcomes, not activity lists>
- In progress: <current work and expected completion>
- Not completed as planned: <variance and reason>

## Evidence
- Tickets / roadmap items: <links or IDs>
- PRs / commits / releases: <links or IDs>
- CI / test / deployment status: <links or summary>
- Metrics: <DORA, flow, EVM, SLO, OKR, or domain-specific metrics>
- Agent traces, if applicable: <trace IDs / run IDs; link to access-controlled evidence>

## Forecast and Variance
- Baseline commitment: <scope/date/budget/quality target>
- Current forecast: <updated forecast>
- Variance: <numeric or concrete difference>
- Reason for variance: <root cause or current best explanation>

## Risks, Issues, Blockers, Dependencies
Use one row per risk, issue, blocker, or dependency.

| Type | Description | Impact | Owner | Due / review date | Mitigation / ask |
|---|---|---|---|---|---|
| Risk/Issue/Blocker/Dependency |  |  |  |  |  |

## Decisions
- Decisions made this period: <decision + rationale + link>
- Decisions needed: <decision + owner + deadline + consequence of no decision>

## Next Commitments
- By next report: <specific promised outcomes>
- Next 2-4 weeks: <look-ahead commitments and dependencies>

## Agentic AI Evidence, if applicable
Omit this section when no agentic AI was used.

Minimum evidence:
- Agent/model/prompt/tool versions: <versions>
- Autonomy level: <manual | assisted | supervised autonomous | autonomous with audit>
- Human checkpoints: <approvals, overrides, rejected actions>
- Verification state: <generated | tested | independently verified | merged | deployed>
- Trace/provenance: <trace IDs, commit SHA, PR, build, deployment>
- Cost/latency: <tokens, cost, runtime if material>
- Safety/policy exceptions: <none or details>

Extended governance evidence, when risk or regulation warrants:
- Retrieved context and data sources
- Detailed tool-call sequence / span tree
- Independent evaluation results
- SBOM, signatures, or release provenance
- Red-team, abuse-test, or policy-review notes
```

## Quality Bar

Before finalizing, verify:
- The report answers: what changed, what is next, what is blocked, and what decision/help is needed.
- Every nontrivial claim has evidence or is marked unknown.
- Amber/Red items include owner, mitigation, and next review date, or unknown fields are marked and converted into decisions/asks.
- The audience can act on the report without asking for a second status meeting.
````

## Example

**Context:**
A team needs a weekly status report for an engineering manager after an agent-assisted documentation and CI cleanup sprint.

**Input:**
```
Create a status report for the docs cleanup project for May 15-22. Audience: engineering manager. Evidence: PR #42 merged, CI green, issue DOC-18 still blocked on API owner review, agent trace run-781 used for link checking. Baseline: finish docs cleanup by May 29.
```

**Expected Output:**
```markdown
# Project Status: Docs Cleanup

Reporting period: May 15-22
Audience: engineering
Overall status: Amber
Trend: Stable
Confidence: Medium

## Executive Summary
- PR #42 merged and CI is green; core cleanup remains on track for May 29.
- DOC-18 is blocked on API owner review and is the main schedule risk.
- Decision needed: assign API reviewer by May 24 or move DOC-18 out of the May 29 scope.

...
```

## Expected Results

- The report is short enough for the target audience but links to deeper evidence.
- Overall status is justified by metrics, artifacts, or explicit unknowns.
- Blockers, risks, and decisions have owners and dates.
- Agentic work includes provenance and verification state when applicable.

## Variations

**Executive-only summary:**
```
Use the project status report prompt, but produce only the header, executive summary, top risks, decisions needed, and forecast/variance.
```

**Engineering detail report:**
```
Use the project status report prompt and include PRs, commits, CI, deployment status, incidents, and review queue details. Keep executive commentary to three bullets.
```

**Agent run report:**
```
Use the project status report prompt for a single autonomous agent run. Emphasize plan state, tool calls, trace/provenance, verification state, human approvals, cost/latency, and safety exceptions.
```

## References

- `research-finding-project-status-reporting-synthesis.md` - Source synthesis for this prompt.
- `prompt-task-describe-pr.md` - Related PR-description evidence workflow.
- `prompt-workflow-deliberate-commits.md` - Related commit hygiene workflow.

## Notes

The prompt intentionally supports `Unknown / Unrated` because forcing RAG without a baseline creates false confidence. It also treats sensitive evidence as link-only by default: status reports should cite traces and artifacts without leaking secrets or private data.

## Version History

- 1.0.0 (2026-05-22): Initial version based on project status reporting synthesis.
