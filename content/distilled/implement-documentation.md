# Implement Documentation Topic

Write a high-signal documentation topic using the Unified Frameworks for Technical Information Architecture.

## CRITICAL RULES

1. ✅ **DO:** Establish context and prerequisites in the first two sentences (EPPO).
2. ✅ **DO:** Lead with the answer or primary assertion in the TL;DR and first paragraph (Pyramid Principle).
3. ✅ **DO:** Use explicit, semantic block labels (descriptive headers) for every 2-3 paragraphs (Info Mapping).
4. ✅ **DO:** Provide a clear "fail-state" or troubleshooting section (Minimalism).
5. ❌ **DO NOT:** Mix intents (e.g., no deep theory in a How-to guide). If theory is *required* for a task, use a **Note:** or **Deep Dive:** sidebar to maintain quadrant purity.
6. ❌ **DO NOT:** Use "Next" or "Previous" as the only navigational cues (EPPO).

## Implementation Workflow

### Step 1: Quadrant Check

Identify the Diátaxis quadrant and follow its rhetorical rules:
- **Tutorial:** Action-oriented, safe environment. Use the **Martini Glass** narrative pattern: Author-driven stem (guided context) → Reader-driven bowl (open exploration).
- **How-to:** Task-focused, assumes baseline competence, minimal theory.
- **Reference:** Fact-based, scannable tables, no narrative filler.
- **Explanation:** Theoretical, discusses "Why," maps concepts.

### Step 2: EPPO Initialization

Every topic must stand alone. Start with:
- **Title:** Clear, task- or concept-focused.
- **Context Block:** "This topic covers [X]. You should already understand [Y] and have [Z] installed."

### Step 3: Information Mapping

Structure the body content:
- **Chunking:** Break large blocks into units of <7 items.
- **Labeling:** Use headers that describe the *result* or *content* (e.g., "Configuring the API" not just "Configuration").
- **Tables/Lists:** Convert complex comparisons or steps into visual structures.

### Step 4: AI-First Polish

- **Semantic Headers:** Ensure headers are descriptive for RAG indexing.
- **Compressed Summary:** Provide a 1-2 sentence "tl;dr" at the top for LLM ingestion.

## Template (How-to Guide)

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