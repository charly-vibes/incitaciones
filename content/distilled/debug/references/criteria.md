# Systematic Debugging Criteria

Use these criteria to evaluate the quality of a debugging diagnosis.

## Diagnostic Confidence Rules

| Confidence | Criteria | Action |
| :--- | :--- | :--- |
| **High** | Hypothesis verified by direct evidence (log trace, metric spike, failing test) and related causes ruled out. | **Implement fix.** |
| **Medium** | Hypothesis consistent with symptoms and simulated tests positive, but direct evidence missing. | **Gather more logs.** |
| **Low** | Hypothesis only explains some symptoms; major contradictions remain. | **Re-run DDx.** |

## "Illness Severity" (Bug Prioritization)

| Severity | Criteria | Treatment Strategy |
| :--- | :--- | :--- |
| **CRITICAL** | Production data loss, security breach, or system-wide outage. | **Immediate mitigation first (Restart/Rollback), then root cause fix.** |
| **HIGH** | Severe performance degradation or core feature broken. | **Prioritize fix above all in-flight work.** |
| **MEDIUM** | Intermittent error or minor feature failure. | **Add monitoring/logging to catch next occurrence.** |
| **LOW** | Cosmetic or non-functional issue. | **Record in backlog for future fix.** |

## Hypotheses Quality Checklist

- [ ] **Broad Spectrum:** Did you list at least 4 hypotheses?
- [ ] **Zebra Presence:** Did you include at least one non-obvious cause?
- [ ] **Mutual Exclusivity:** Are the hypotheses distinct, or are they different symptoms of the same cause?
- [ ] **Executable Verification:** Is there at least one test for each that uses a project tool or command?
