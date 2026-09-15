## Corrective Action Hierarchy and Verification

### Action Strength Classification

Rank every proposed corrective action by its ability to change the system:

**Strong (system redesign):**
- Architectural changes that eliminate the failure mode
- Forcing functions and interlocks (make the error physically/logically impossible)
- Automation of detection or prevention (the system catches or prevents without human action)
- Interface redesign that removes the ambiguity or error pathway
- Examples: circuit breakers, type-safe interfaces, automated rollback triggers, equipment redesign, workflow interlocks

**Intermediate (enhanced controls):**
- Improved monitoring and alerting (reduces detection time but doesn't prevent)
- Checklists and standardized procedures (reduces variation but depends on compliance)
- Staffing changes (reduces workload-driven errors but doesn't eliminate the mechanism)
- Process redesign (changes the workflow but doesn't add forcing functions)
- Examples: new dashboard alerts, pre-deployment checklists, on-call rotation changes, peer review gates

**Weak (awareness-only):**
- Retraining or education
- Policy memos and reminders
- "Be more careful" directives
- Documentation updates without verification that they are read or followed
- Examples: email reminders, updated wiki pages, all-hands announcements, annual training modules

### Minimum Strong Action Requirement

**Every RCA must include at least one strong action.** If only intermediate or weak actions are proposed:

1. Flag this explicitly: "Action portfolio contains no strong actions"
2. Describe what system change would be needed — even if it requires resources, authority, or timeline the team doesn't currently have
3. Recommend escalation to the authority level that can approve the strong action
4. Document the risk accepted by proceeding with only intermediate/weak actions

### Verification Plan

For each action, define:

| Element | Required |
|---------|----------|
| **Verification metric** | What measurable outcome confirms the action reduced risk? |
| **Monitoring period** | How long must the metric be tracked? (Minimum: 2x the mean time between previous occurrences. For novel incidents without recurrence history, use 90 days or one full operational cycle, whichever is longer.) |
| **Owner** | Named person accountable for implementation and verification |
| **Deadline** | Implementation completion date |
| **Escalation path** | What happens if the metric does not improve within the monitoring period? |

### Learning Loop

Identify how findings feed back into the organization:

- Standards or specifications to update
- Training content to modify
- Design review criteria to add
- Monitoring and alerting to change
- Audit or compliance checks to introduce

### Output

```text
## Corrective Actions

| # | Root cause addressed | Action | Strength | Owner | Deadline | Verification metric | Monitoring period |
|---|---------------------|--------|----------|-------|----------|--------------------|--------------------|
| 1 | [cause] | [action] | [strong/intermediate/weak] | [who] | [when] | [metric] | [duration] |

Action strength mix: [N strong, N intermediate, N weak]
Minimum strong action requirement: [MET | NOT MET — escalation needed]

## Learning Loop

- Standards to update: [list]
- Training to modify: [list]
- Monitoring to add/change: [list]
- Design reviews to inform: [list]
```
