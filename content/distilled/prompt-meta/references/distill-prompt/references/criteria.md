# Distill Prompt Criteria

Use these criteria to evaluate the quality of a distilled prompt.

## Safe vs. Unsafe Distillation Patterns

| Feature | ✅ Safe (Preserved) | ❌ Unsafe (Removed) |
| :--- | :--- | :--- |
| **Negative Constraints** | "NEVER use X", "DO NOT Y" | "Prefer X over Y" (Weak) |
| **Templates / Formats** | JSON schemas, Markdown templates, specific output structure. | "Write a brief summary of X" (Vague) |
| **Role-Based Behavior** | "You are an expert X", "Adopt a tone of Y" | "This prompt helps the user with X" (Description) |
| **Essential Procedure** | "Step 1: X, Step 2: Y" | "You should generally try to do X" (Suggestion) |

## Instruction Density Checklist

- [ ] All 1-based procedural steps are preserved.
- [ ] No conversational filler ("Please", "I will now", "Thank you").
- [ ] No front-matter/metadata.
- [ ] Logic density is maximized (stronger verbs, shorter sentences).
- [ ] Final result is 100% LLM-consumable (no human commentary).

## When to Stop & Ask

- [ ] The original prompt's "Rules" are contradictory or ambiguous.
- [ ] The "Example" is the ONLY way to understand the output format, but is too long to include.
- [ ] You are unsure if a section is "Human Context" or an "Essential Rule."
