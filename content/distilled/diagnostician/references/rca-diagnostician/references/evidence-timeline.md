## Evidence Collection and Timeline Reconstruction

Map what happened before hypothesizing why.

### Evidence Inventory

Classify each source into one of four types:

| Type | Examples | Reliability notes |
|------|----------|-------------------|
| **Records** | Logs, metrics, charts, audit trails | Machine-generated; check for gaps and clock skew |
| **Direct observation** | Inspections, screenshots, reproductions | Strongest when captured during/near the event |
| **Testimony** | Interviews, incident comms, retrospective accounts | Subject to hindsight bias and memory distortion |
| **Artifacts** | Config changes, code diffs, design docs, process maps | Check timestamps; distinguish planned vs. actual |

### Three-Stream Sufficiency Test

Do you have at least three independent evidence streams (e.g., logs + interviews + config history)? If not:

- Flag the gap explicitly
- Recommend what to gather before proceeding
- Note which hypotheses cannot be tested with current evidence
- Mark all subsequent outputs as **PROVISIONAL** until evidence gaps are filled — this must carry through to the rigor checklist and final report

### Timeline Construction

Build chronologically from last known normal state through detection and resolution:

- **Decision points**: who decided what, with what information available at the time
- **Environmental context**: workload, staffing, concurrent changes, external events
- **Hindsight compression guard**: record what was known vs. not known at each point — do not project post-event knowledge backward

### Output

```text
## Evidence Inventory

| Source | Type | Reliability | Key facts |
|--------|------|-------------|-----------|
| [source] | [record/observation/testimony/artifact] | [high/medium/low] | [what it tells us] |

Evidence sufficiency: [MET — 3+ streams | GAP — need X]

## Timeline

| Time | Event | Source | Notes |
|------|-------|--------|-------|
| [when] | [what happened] | [evidence source] | [context] |
```
