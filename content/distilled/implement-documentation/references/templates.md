# Diátaxis Templates

One template per quadrant. Match the template to the quadrant identified in Step 1. The canonical theory is `content/research-documentation-frameworks.md`.

## Tutorial (learning-oriented, beginners)

Goal: build competency through a guided, safe experience. Show, do not lecture.

```markdown
# [Getting Started with X]

**TL;DR:** [1-sentence outcome for human/AI]

## What You Will Learn
By the end you will have [concrete result]. No prior knowledge of [X] is assumed.

## Prerequisites
- [Prerequisite 1]
- [Prerequisite 2]

## Step 1: [Specific Result]
[Chunked, do-this-now instructions. Each step yields a visible result.]

## Step 2: [Specific Result]
[Chunked instructions.]

## Recap & Next Steps
You built [X]. Next, try [lateral link 1] or [lateral link 2].
```

## How-to (task-oriented, assumes baseline competence)

Goal: answer a specific question directly. Minimal theory.

```markdown
# [Task-Focused Title]

**TL;DR:** [1-sentence summary for human/AI]

## Context & Prerequisites
This guide explains how to [Goal]. Before starting, ensure you have:
- [Prerequisite 1]
- [Prerequisite 2]

## [Action Step 1: Specific Result]
[Chunked instructions]

## [Action Step 2: Specific Result]
[Chunked instructions]

## Troubleshooting: Common Fail-States
| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| [Error] | [Reason] | [Solution] |

## Further Exploration
- [Lateral Link 1] (Subject affinity)
- [Lateral Link 2] (Subject affinity)
```

## Reference (information-oriented, experienced users)

Goal: fast, accurate facts. Scannable tables, no narrative filler.

```markdown
# [X] Reference

**TL;DR:** [1-sentence summary for human/AI]

## [Function/Endpoint/Class Name]

**Signature:** `signature`

**Parameters:**
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| [name] | [type] | yes/no | [description] |

**Returns:** [type and meaning]

**Errors:**
| Code | Meaning | Remediation |
| :--- | :--- | :--- |
| [code] | [meaning] | [fix] |

**Example:**
[Minimal, complete, runnable example]
```

## Explanation (understanding-oriented, the "why")

Goal: deepen knowledge; no specific task. Discussion, design rationale, trade-offs.

```markdown
# [Understanding X]

**TL;DR:** [1-sentence summary for human/AI]

## Why [X] Exists This Way
[Design rationale and history. No steps.]

## Key Concepts
- [Concept 1]: [definition and why it matters]
- [Concept 2]: [definition and how it relates to Concept 1]

## Trade-offs
| Approach | Pro | Con |
| :--- | :--- | :--- |
| [A] | [pro] | [con] |
| [B] | [pro] | [con] |

## Further Exploration
- [Lateral Link 1] (Subject affinity)
- [Lateral Link 2] (Subject affinity)
```