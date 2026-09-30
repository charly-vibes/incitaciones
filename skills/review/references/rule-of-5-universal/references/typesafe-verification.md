# TypeSafe Verification Pass (conditional)

Use this procedure **only** when the `TYPESAFE_API_KEY` environment variable is set.
When it is not set, or the API call fails (see Failure Handling), mark every finding
`UNVERIFIED`, print the banner below, and fall back to self-reported validation —
do not block the review.

```
BANNER: Findings NOT verified by TypeSafe (API unavailable or key absent).
Self-reported validation in effect; treat false-positive estimates as unmeasured.
```

Use this procedure as-is; consult the `typesafe-ai` skill or docs.typesafe.ai only
for SDK-language bindings beyond the HTTP call specified here. Do not re-derive
questions, thresholds, or request shape at review time.

## Constants (edit here, not inline)

| Constant | Value | Notes |
| --- | --- | --- |
| Endpoint | `https://api.typesafe.ai/v1/systemone` | `POST`, Bearer auth |
| Model | `jev-latest` | TypeSafe flagship alias |
| `CONFIDENCE_GATE` | `0.8` | Tunable starting point; calibrate per workflow. Below gate → human review |
| `VERIFY_SEVERITIES` | `CRITICAL, HIGH` | Cost cap: MEDIUM/LOW findings stay UNVERIFIED |
| Batching | one request | All verification questions in a single parallel call |

## Stage A — Mechanical pre-gate (no API)

For each finding at or above `VERIFY_SEVERITIES`, check mechanically:

1. Does the referenced location exist (file:line, section, paragraph)?
2. Does any quoted evidence appear verbatim in the artifact under review?

- Both pass → send to Stage B.
- Location missing or quote absent → verdict `fabricated` **without an API call**
  (this is a CRITICAL meta-finding about the reviewer, not the artifact).
- No quoted evidence to check → send to Stage B anyway; the model judges context.

## Stage B — One parallel verification request

`state` = the artifact text plus the surviving findings (id, location, claim,
evidence). Ask **one Choice question per finding**, all in the same request:

```json
{
  "model": "jev-latest",
  "state": { "artifact": "...", "findings": [ { "id": "CORR-001", "location": "...", "claim": "...", "evidence": "..." } ] },
  "questions": {
    "verify_CORR-001": {
      "type": "choice",
      "instructions": {
        "finding": "`findings[0]`",
        "question": "Does the `artifact` at the location named in `finding` contain evidence that supports `finding.claim`?"
      },
      "criteria": {
        "verified": "The cited location contains evidence supporting the claim",
        "unsupported": "The location exists but says nothing about the claim",
        "contradicted": "The location's context says the opposite of the claim",
        "fabricated": "The claim misrepresents what the location says"
      }
    }
  }
}
```

Generate one `verify_<ID>` question per finding. Never ask about multiple findings
in one question.

## Stage C — Verdict mapping

| Verdict | Action |
| --- | --- |
| `verified`, confidence ≥ gate | Finding stands; counts toward convergence |
| `unsupported` or `contradicted` | Drop the finding; it counts as a **measured** false positive |
| `fabricated` (Stage A or B) | Drop; file CRITICAL meta-finding `[META-<n>]` against the review pass |
| Any verdict with confidence < `CONFIDENCE_GATE` | Keep finding, mark `REVIEW_REQUIRED`, route to `ESCALATE_TO_HUMAN` |
| Findings below `VERIFY_SEVERITIES` | Mark `UNVERIFIED`; excluded from FP-rate arithmetic |

Convergence arithmetic (in `criteria.md`) uses these measured numbers:

```
False positive rate = dropped findings / (verified + dropped findings)
```

This replaces the self-estimated false-positive rate. Self-estimated rates are
insufficient as a sole gate but remain one input alongside other convergence criteria.
