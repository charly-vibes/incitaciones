# Verify Prompt Criteria

Use these criteria to categorize distillation discrepancies.

## Fatal vs. Acceptable Losses

| Loss Type | Severity | Example |
| :--- | :--- | :--- |
| **Executable Rule** | **FATAL** | "Step 2: Run `ls`" is missing. |
| **Negative Constraint** | **FATAL** | "NEVER use `git add .`" is missing. |
| **Output Schema** | **FATAL** | JSON structure has different keys. |
| **Human Context** | **ACCEPTABLE** | "Use this when debugging complex bugs" is removed. |
| **Redundant Fluff** | **ACCEPTABLE** | "Please carefully follow these steps" is removed. |
| **Front-Matter** | **ACCEPTABLE** | Title, tags, and version are removed. |

## Verification Checklist

- [ ] All `ORIGINAL_PROMPT` rules are present.
- [ ] No behavioral change between versions.
- [ ] Only human-facing "fluff" was removed.
- [ ] Final output is `OK` or a specific discrepancy list.
