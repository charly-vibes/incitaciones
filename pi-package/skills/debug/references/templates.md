# Systematic Debugging Templates

Use this template for reporting findings during a Differential Diagnosis (DDx) session.

## Differential Diagnosis Report

```markdown
### 1. Problem Representation
**Symptom:** [User's description]
**System:** [Brief context]
**Refined Representation:** [Engineering terminology for the problem]

### 2. Hypotheses (Differential Diagnosis)
1.  **[Hypothesis 1]** (Probability: High) - [Brief reasoning]
2.  **[Hypothesis 2]** (Probability: Medium) - [Brief reasoning]
3.  **[Hypothesis 3]** (Probability: Medium) - [Brief reasoning]
4.  **[Hypothesis 4]** (Probability: Low) - [Brief reasoning]
5.  **[Hypothesis 5 (ZEBRA)]** (Probability: Very Low) - [Brief reasoning]

### 3. Top 3 Illness Scripts
1.  **[Hypothesis 1]:** [How it manifests in metrics/logs]
2.  **[Hypothesis 2]:** [How it manifests in metrics/logs]
3.  **[Hypothesis 3]:** [How it manifests in metrics/logs]

### 4. Diagnostic Tests & Verified Results
| Hypothesis | Diagnostic Test | Result (Verified/Simulated) | Finding |
| :--- | :--- | :--- | :--- |
| **H1** | [Executable test] | [Positive/Negative] | [What was found] |
| **H2** | [Executable test] | [Positive/Negative] | [What was found] |
| **H3** | [Executable test] | [Positive/Negative] | [What was found] |

### 5. Probable Diagnosis
**Conclusion:** [State the most likely root cause based on findings]
**Confidence Score:** [0-100%]

### 6. Treatment Plan
**Immediate Mitigation:** [Specific action to restore service]
**Long-term Fix:** [Specific action to prevent recurrence]
```
