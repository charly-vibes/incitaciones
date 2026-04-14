---
name: research-documentation
description: "Audit existing documentation or plan a new suite using advanced frameworks"
metadata:
  installed-from: "incitaciones"
---
# Research Documentation Architecture

Audit the existing documentation or plan a new suite using the Unified Frameworks for Technical Information Architecture.

## CRITICAL RULES

1. ✅ **DO:** Categorize every document into exactly one Diátaxis quadrant.
2. ✅ **DO:** Identify "Frankenbooks" (documents with mixed intent/quadrants).
3. ✅ **DO:** Map the "Snowflake" progression from Core Assertion to granular topics.
4. ✅ **DO:** Verify EPPO compliance (Does each page establish its own context?).
5. ❌ **DO NOT:** Start writing content yet; focus on architecture and gaps.
6. ❌ **DO NOT:** Suggest stylistic changes (focus on structural integrity).

## Process

### Step 1: Define the Scope

[User will provide a path to a documentation directory or a project description.]
- Identify the primary audience (Novice vs. Expert).
- State the "Core Assertion" (The single-sentence value proposition).
- **Legacy Conflict Resolution:** If existing documentation contains multiple, conflicting "hooks," identify the most impactful one or propose a synthesis for the new architecture.

### Step 2: Audit Existing Content (if applicable)

For each file in the directory, determine:
- **Quadrant:** (Tutorial | How-to | Reference | Explanation).
- **EPPO Status:** (Pass/Fail) Does it have standalone utility and context?
- **Cognitive Load:** Are there "walls of words" or missing labels?

### Step 3: Map the Snowflake Outline

Expand the Core Assertion into a structural map:
1. **Core Assertion:** [1 sentence]
2. **Macro-Expansion:** [1 paragraph user journey]
3. **Component List:** [The "characters" of the system]
4. **Topic Matrix:** A list of proposed EPPO topics categorized by quadrant.

### Step 4: Identify Gaps and Friction

- **Quadrant Imbalance:** e.g., "Too much reference, not enough tutorials."
- **Structural Plot-holes:** Where does the user journey break?
- **AI-Readiness Gaps:** Missing `llms.txt`, poor semantic labeling.

### Step 5: Final Research Report

Output the audit/plan using the following template:

```markdown
# Documentation Research: [Project Name]

## 1. Executive Summary & Core Assertion
**Core Assertion:** [The one-sentence hook]
**Status:** [Summary of current architecture health]

## 2. Diátaxis Matrix
| Quadrant | Existing Topics | Proposed/Missing Topics |
| :--- | :--- | :--- |
| **Tutorial** | | |
| **How-to** | | |
| **Reference** | | |
| **Explanation** | | |

## 3. Snowflake Structural Map
- **Macro-Journey:** [Description]
- **Key Components:** [List]

## 4. EPPO & Cognitive Audit
- **Frankenbooks Found:** [List of files with mixed intent]
- **Context Gaps:** [Topics needing better orientation]

## 5. AI-Readiness Assessment
- [ ] `llms.txt` present?
- [ ] Explicit semantic labeling for RAG?
- [ ] MCP endpoints identified?

## 6. Recommended Next Steps
1. [Actionable structural change]
2. [Actionable topic creation]
```
