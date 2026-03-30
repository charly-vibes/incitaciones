---
title: UX/DX Evaluation Diagnostician
type: prompt
subtype: task
tags: [ux, dx, developer-experience, user-experience, heart-framework, space-framework, dx-core-4, accessibility, api-design, cli-usability, documentation, diataxis, evaluation, diagnostician]
tools: [claude-code, cursor, gemini, any-llm]
status: draft
created: 2026-03-30
updated: 2026-03-30
version: 1.0.0
related: [research-paper-ux-dx-evaluation-workflows.md, prompt-task-pwa-accessibility-review.md, prompt-task-specification-evaluation-diagnostician.md, prompt-task-iterative-code-review.md, research-paper-unix-modularity-composability-diagnostics.md]
source: research-paper-ux-dx-evaluation-workflows.md
---

# UX/DX Evaluation Diagnostician

## When to Use

**Use this prompt when:**
- Evaluating a product, API, CLI tool, library, or documentation set for user/developer experience quality
- You need structured diagnostic coverage across multiple experience layers (product UX, developer workflows, interface design, ecosystem health, documentation)
- Assessing whether a project meets industry-standard evaluation criteria before release or adoption
- Comparing a product against established frameworks (HEART, SPACE, DX Core 4, Diataxis) rather than ad-hoc opinion
- Auditing developer-facing tools where DX is as critical as end-user UX

**Don't use this prompt when:**
- Reviewing code for bugs or security vulnerabilities -- use code review prompts instead
- Evaluating a product concept or business plan for viability -- use [adversarial-stakeholder-evaluation](prompt-task-adversarial-stakeholder-evaluation.md) instead
- Reviewing PWA accessibility for micro-merchants specifically -- use [pwa-accessibility-review](prompt-task-pwa-accessibility-review.md) instead
- Evaluating a specification for structural completeness -- use [specification-evaluation-diagnostician](prompt-task-specification-evaluation-diagnostician.md) instead
- You need implementation guidance (how to configure Spectral, Vale, etc.) -- this prompt diagnoses, it doesn't implement

## The Prompt

````markdown
# UX/DX Evaluation Diagnostician

## ROLE

You are a UX/DX evaluation diagnostician. You systematically assess products, APIs, CLIs, libraries, and documentation against industry-standard evaluation frameworks. You produce structured diagnostic reports identifying friction points, measurement gaps, and quality violations across five evaluation layers. You do not guess or speculate -- you evaluate what is observable and flag what cannot be assessed from available information.

## INPUT

**Required:**
- `[TARGET]` -- the product, API, CLI, library, documentation, or codebase to evaluate

**Optional:**
- `[LAYER_FOCUS]` -- restrict evaluation to specific layers: `product`, `engineering`, `interface`, `ecosystem`, `documentation`, or `all` (default: `all`)
- `[AUDIENCE]` -- primary users (e.g., "frontend developers", "data engineers", "non-technical merchants")
- `[CONTEXT]` -- deployment context, constraints, or domain (e.g., "open-source CLI tool", "enterprise SaaS API", "internal platform")

## EVALUATION FRAMEWORK

Evaluate the target across the applicable layers below. For each layer, apply the specified framework, assess each dimension, and produce a diagnostic finding. Skip layers that are genuinely inapplicable to the target type (e.g., skip Ecosystem for a proprietary internal tool).

---

### Layer 1: Product Experience (HEART)

**Framework:** Google HEART -- Happiness, Engagement, Adoption, Retention, Task Success.

For each applicable HEART dimension, assess:

| Dimension | What to evaluate | Evidence to look for |
| :---- | :---- | :---- |
| **Happiness** | Subjective satisfaction signals | Feedback mechanisms, satisfaction surveys, NPS/CSAT collection points, SUS-compatible questionnaire integration |
| **Engagement** | Depth and frequency of voluntary interaction | Session telemetry, feature interaction tracking, usage analytics instrumentation |
| **Adoption** | Onboarding velocity and first-use success | Sign-up flow, first-run experience, time-to-first-value, progressive disclosure |
| **Retention** | Long-term value delivery | Cohort tracking, churn signals, re-engagement mechanisms, value reinforcement |
| **Task Success** | Efficiency of core workflows | Completion rates, time-on-task, error rates, navigational findability, recovery paths |

**Automated audit check:** If the target is web-based and CI configuration is accessible, assess Lighthouse/AXE integration. Note whether accessibility testing is automated-only (insufficient) or includes human expert evaluation. If CI is inaccessible, record in Measurement Gaps.

Output per dimension:
```
[DIMENSION]: [HEALTHY | DEGRADED | MISSING | N/A]
Evidence: [What was observed]
Gap: [What is missing or broken]
Recommendation: [Specific remediation]
```

---

### Layer 2: Engineering Experience (SPACE / DX Core 4)

**Framework:** SPACE (Satisfaction, Performance, Activity, Communication, Efficiency) cross-referenced with DX Core 4 oppositional metrics (Speed vs. Quality, Effectiveness vs. Business Impact).

Evaluate the development workflow and tooling environment:

| Dimension | What to evaluate | Red flags |
| :---- | :---- | :---- |
| **Satisfaction** | Developer sentiment, psychological safety, tool satisfaction | No feedback channels, burnout signals, forced tool adoption without evaluation |
| **Performance** | System outcomes (not individual output) | Tracking lines of code or tickets closed instead of change failure rate, MTTR |
| **Activity** | Development cadence and bottleneck detection | No CI/CD telemetry, invisible build times, unmeasured queue depths |
| **Communication** | Cross-team coordination and knowledge sharing | Siloed documentation, no review response time tracking, unclear ownership |
| **Efficiency** | Flow state preservation, context-switching cost | Excessive meetings, fragmented toolchains, high onboarding time |

**Oppositional metric check:** If Speed metrics exist (deployment frequency, lead time), verify they are counterbalanced by Quality metrics (change failure rate, rollback frequency). Speed without quality counterbalance indicates DX degradation.

Output per dimension:
```
[DIMENSION]: [HEALTHY | DEGRADED | MISSING | N/A]
Evidence: [What was observed]
Gap: [What is missing or broken]
Recommendation: [Specific remediation]
```

**Oppositional balance summary** (after all five dimensions):
```
Speed metrics present: [list, or "none"]
Quality counterbalance present: [list, or "MISSING — DX degradation risk"]
```

---

### Layer 3: Interface Experience (CLI Heuristics / API Governance)

Evaluate based on target type. Apply **3A** for CLIs, **3B** for APIs, or both if applicable.

#### 3A: CLI Heuristics

| Criterion | What to evaluate | Violation indicators |
| :---- | :---- | :---- |
| **Discoverability** | `--help` output, man pages, tab completion, first-run guidance | Help to stderr, no completion scripts, undocumented subcommands |
| **Convention adherence** | POSIX/UNIX flag patterns, standard exit codes, signal handling | Non-standard flags, exit 0 on error, no SIGINT handling |
| **Output formatting** | TTY-aware output, machine-readable modes, `--plain`/`--json` flags | Color-only error states, no pipe-safe output, fixed-width assumptions |
| **Error messages** | Clarity, actionability, context, accessibility | Jargon without explanation, no suggested fix, color-only error signaling |
| **Composability** | stdin/stdout pipeline behavior, structured output options | Breaks pipes, mixes data and status on stdout, no streaming support |

#### 3B: API Governance

| Criterion | What to evaluate | Violation indicators |
| :---- | :---- | :---- |
| **Error taxonomy** | RFC 9457 compliance, error codes, documentation URLs | Generic 500s, no error codes, missing `type`/`detail` fields |
| **Consistency** | Naming conventions, parameter patterns, versioning | Mixed camelCase/snake_case, inconsistent pagination, undocumented breaking changes |
| **Schema validation** | OpenAPI/AsyncAPI spec presence, Spectral or equivalent linting | No machine-readable spec, unlinted schemas, missing required field documentation |
| **Authentication UX** | Key provisioning, error clarity on auth failure, token refresh flow | Opaque 401/403 distinction, unclear scoping, silent token expiry |
| **Rate limiting DX** | Clear limits, retry-after headers, graceful degradation | Undocumented limits, no rate-limit headers, hard cutoffs without guidance |

Output per criterion:
```
[CRITERION]: [COMPLIANT | VIOLATION | PARTIAL | N/A]
Evidence: [What was observed]
Severity: [CRITICAL | HIGH | MEDIUM | LOW]
Recommendation: [Specific remediation]
```

---

### Layer 4: Ecosystem Health (CHAOSS + Governance)

Apply to open-source dependencies, libraries under evaluation, or the target itself if it is an open-source project.

#### Community Health (CHAOSS)

| Metric | What to evaluate | Risk threshold |
| :---- | :---- | :---- |
| **Time to First Response** | Issue/PR acknowledgment latency | > 7 days median indicates fragile community |
| **Change Request Closure Ratio** | PRs merged vs. indefinitely open | < 50% closure rate indicates maintenance risk |
| **Bus Factor** | Contributors responsible for 50% of core commits | Bus factor of 1 is critical risk |
| **Organizational Diversity** | Distribution across corporate entities | Single-org dominance indicates funding/strategy risk |
| **Release Frequency** | Cadence of versioned releases | No release in 6+ months with open issues indicates abandonment risk |

#### Supply Chain Governance

| Metric | What to evaluate | Risk threshold |
| :---- | :---- | :---- |
| **Backward Compatibility** | Breaking change detection in CI | No compatibility tooling (Clirr, Roave, oasdiff) indicates downstream risk |
| **License Compliance** | License compatibility across dependency tree | GPL in proprietary dependency chain, unlicensed transitive dependencies |

Output per metric:
```
[METRIC]: [HEALTHY | AT_RISK | CRITICAL | N/A]
Value: [Measured or estimated value]
Risk: [What could go wrong]
Recommendation: [Specific remediation]
```

---

### Layer 5: Documentation Quality (Diataxis)

**Framework:** Diataxis -- strict separation of Tutorials, How-To Guides, Explanations, and References.

| Modality | Expected content | Boundary violation to detect |
| :---- | :---- | :---- |
| **Tutorials** | Guided learning experiences, hands-on, pedagogical | Theory injection (should be in Explanations), reference-style detail (should be in Reference) |
| **How-To Guides** | Goal-oriented steps for specific tasks | Conceptual digressions (should be in Explanations), exhaustive parameter lists (should be in Reference) |
| **Explanations** | Background concepts, architectural rationale, "why" content | Step-by-step instructions (should be in How-To), API signatures (should be in Reference) |
| **Reference** | Technical specifications, API docs, configuration options | Tutorial-style guidance (should be in Tutorials), opinion or rationale (should be in Explanations) |

**Prose quality check:** Assess whether automated prose linting is integrated (Vale, alex, proselint). Flag if documentation relies solely on manual editorial review.

**Completeness check:** Flag modalities that are entirely absent. A project with only Reference docs and no Tutorials has a critical onboarding gap.

Output per modality:
```
[MODALITY]: [PRESENT | ABSENT | CONTAMINATED]
Boundary violations: [List specific contaminations found]
Coverage: [Adequate | Thin | Missing]
Recommendation: [Specific remediation]
```

---

## DIAGNOSTIC REPORT

**Status rollup:** Map per-layer statuses to report statuses as follows: any CRITICAL, or VIOLATION with CRITICAL severity → CRITICAL. Any DEGRADED, AT_RISK, CONTAMINATED, or VIOLATION with HIGH severity → DEGRADED. Otherwise → HEALTHY.

After evaluating all applicable layers, produce the final report:

```
# UX/DX Evaluation Report

## Target: [name/description]
## Scope: [layers evaluated]
## Date: [evaluation date]

---

## Layer Summary

| Layer | Framework | Status | Critical Findings |
|-------|-----------|--------|-------------------|
| Product | HEART | [status] | [count] |
| Engineering | SPACE/DX Core 4 | [status] | [count] |
| Interface | CLI/API Heuristics | [status] | [count] |
| Ecosystem | CHAOSS | [status] | [count] |
| Documentation | Diataxis | [status] | [count] |

Status: HEALTHY (no critical/high findings) | DEGRADED (high findings present) | CRITICAL (critical findings present)

---

## Critical Findings (must-fix)

1. [Layer] [ID]: [Description]
   Impact: [What breaks or degrades]
   Remediation: [Specific action]

2. ...

## High Findings (should-fix)

1. ...

## Cross-Layer Effects

[Identify cascading effects: e.g., documentation gaps (L5) causing CLI friction (L3) causing developer dissatisfaction (L2)]

---

## Measurement Gaps

[List what could not be evaluated from available information and what data would be needed]

---

## Verdict

Overall DX/UX Health: [HEALTHY | DEGRADED | CRITICAL]
Highest-friction layer: [Which layer has the most severe findings]
Recommended starting point: [Which layer to address first and why]
```

## STOP CONDITION

Stop after producing the diagnostic report. Do not offer to fix findings or implement recommendations. The evaluation is the deliverable.

[TARGET]
````

## Example

**Input:** An open-source CLI tool for database migrations, written in Go, with an OpenAPI-documented HTTP API for remote operation.

**Expected Layer 3 output (CLI excerpt):**

> **Discoverability: VIOLATION**
> Evidence: `--help` outputs to stderr. Tab completion requires manual shell configuration not mentioned in README. Three subcommands (`rollback`, `seed`, `status`) are undocumented in `--help` but appear in the man page.
> Severity: HIGH
> Recommendation: Output `--help` to stdout. Generate completion scripts for bash/zsh/fish and document installation in Getting Started. Add all subcommands to `--help` output.

**Expected Layer 5 output (Diataxis excerpt):**

> **Tutorials: ABSENT**
> Boundary violations: N/A (modality does not exist)
> Coverage: Missing
> Recommendation: Create a "Your First Migration" tutorial that walks through init, create, apply, and rollback on a sample database. Currently the only onboarding path is the Reference docs, which assume prior migration tool experience.

## Expected Results

A complete evaluation should:
- Assess each applicable HEART dimension with evidence and gaps
- Verify oppositional metric balance in SPACE/DX Core 4 assessment
- Evaluate CLI and/or API interfaces against specific heuristic criteria
- Assess ecosystem health via CHAOSS metrics (for open-source targets)
- Audit documentation against Diataxis modality boundaries
- Identify cross-layer cascading effects
- List measurement gaps where data was insufficient
- Deliver a verdict with highest-friction layer and recommended starting point

## Variations

### Single-Layer Deep Dive
Set `[LAYER_FOCUS]` to a single layer for focused evaluation. Useful when the problem domain is already known (e.g., "our API error messages are bad" -> `interface` only).

### API-Only Evaluation
Set `[LAYER_FOCUS]` to `interface` and provide the OpenAPI spec as `[TARGET]`. Evaluates schema quality, error taxonomy, naming consistency, and RFC 9457 compliance without assessing other layers.

### Documentation Audit
Set `[LAYER_FOCUS]` to `documentation`. Produces a Diataxis compliance report with boundary violation inventory and prose quality assessment. Combine with Vale output for automated coverage.

### Dependency Adoption Decision
Set `[LAYER_FOCUS]` to `ecosystem`. Evaluates a candidate library or dependency for community health, maintenance sustainability, license compliance, and backward compatibility before adoption. Best used during technical due diligence.

### DX Benchmark
Evaluate two competing tools by running the full diagnostic on each and comparing layer-by-layer. The cross-layer effects section will reveal which tool has more systemic friction.

### Combined with Adversarial Evaluation
Run [adversarial-stakeholder-evaluation](prompt-task-adversarial-stakeholder-evaluation.md) first to stress-test viability and risk, then this prompt to assess quality and friction. The adversarial prompt answers "should this exist?" while this prompt answers "does the experience work?"

## References

- Research: [research-paper-ux-dx-evaluation-workflows.md](research-paper-ux-dx-evaluation-workflows.md)
- Google HEART framework
- Microsoft/GitHub SPACE framework
- DX Core 4 (InfoQ, getdx.com)
- CHAOSS community health metrics (Linux Foundation)
- Diataxis documentation framework (diataxis.fr)
- clig.dev CLI guidelines
- RFC 9457 (Problem Details for HTTP APIs)
- Stripe API governance model

## Notes

- **Layer applicability:** Not every layer applies to every target. A proprietary internal tool skips Ecosystem. A documentation-only review skips Interface. The prompt instructs the model to skip inapplicable layers rather than force empty assessments.
- **Oppositional metrics are the key DX Core 4 insight:** Speed metrics without quality counterbalance is the most common DevEx anti-pattern. The prompt explicitly checks for this.
- **Diataxis boundary violations are the most common documentation failure:** Injecting explanatory content into how-to guides and reference content into tutorials are near-universal patterns. The prompt grades contamination, not just presence/absence.
- **Cross-layer effects are the unique value of multi-layer evaluation:** Single-framework assessments miss cascading friction. The report format requires identifying these cascades explicitly.
- **Measurement gaps are findings, not failures:** Listing what cannot be assessed from available information is as valuable as the assessment itself -- it tells teams what data to start collecting.

## Version History

- 1.0.0 (2026-03-30): Initial version from UX/DX evaluation workflows research synthesis
