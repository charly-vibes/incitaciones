# Evidence-Backed Project Status Report

Create a concise, decision-grade project status report for the requested project, workstream, or agent run.

## Inputs

If missing, ask for the minimum context before drafting:
- project/workstream name;
- reporting period;
- audience: executive, engineering, product, client/sponsor, or mixed;
- available evidence sources: tickets, PRs, commits, CI/CD, incidents, metrics, docs, risk logs, decision logs, traces, or notes;
- baseline commitments, if any: scope, date, budget, quality, OKR, milestone, or SOW.

## Rules

- Prefer evidence-linked claims over narrative claims.
- Separate facts from interpretation.
- Mark unknowns explicitly; do not invent missing evidence.
- Link to access-controlled evidence; do not paste secrets, credentials, personal data, private code, sensitive prompts, or sensitive trace content.
- If no safe evidence link exists, summarize only non-sensitive metadata, such as artifact ID, trace ID, run time, status, and redacted outcome.
- Never report Green without objective supporting evidence.
- If evidence conflicts, report dimension-specific status before assigning overall RAG.
- Separate “blocked” from “at risk.” Blocked means work cannot proceed without external action; at risk means the forecast is threatened.
- Separate “tests passed” from “accepted,” “merged,” “deployed,” or “independently verified.”
- Every Amber or Red item must include owner, mitigation, and next review date; if any field is unknown, mark it unknown and list it as a decision/ask.

## Status Scale

Use organization-specific thresholds when available. Otherwise:

- **Unknown / Unrated:** no agreed baseline exists, evidence is insufficient, or discovery work has not established meaningful thresholds.
- **Green:** within agreed tolerance; no unresolved blocker threatens a key commitment; evidence supports the forecast.
- **Amber:** material variance or dependency risk exists, but there is a credible recovery plan with owner and date.
- **Red:** a critical objective, milestone, safety requirement, compliance requirement, or budget/schedule constraint is no longer under control, or no credible recovery plan exists.

## Procedure

1. Identify audience and decision the report supports.
2. Gather/inspect available evidence before drafting.
3. Compare baseline vs current state.
4. Assign dimension-specific status when useful: scope, schedule, quality, reliability, cost, risk, governance.
5. Assign overall status only after reviewing evidence.
6. Summarize completed outcomes, current work, forecast changes, blockers, risks, dependencies, and decisions needed.
7. Include agentic AI evidence when applicable.
8. Keep executive summary short; put trace-level/ticket-level detail behind links or appendices.
9. For mixed audiences, put the executive summary first and move technical detail to evidence links or an appendix.

## Output Template

Use only applicable sections. Omit empty sections.

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
