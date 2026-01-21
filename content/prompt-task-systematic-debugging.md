---
title: Task for Systematic Debugging using Differential Diagnosis
type: prompt
subtype: task
tags: [debugging, root-cause-analysis, medical-diagnosis, cognitive-architecture]
tools: [claude-code, aider, cursor, gemini]
status: verified
created: 2026-01-12
updated: 2026-01-12
version: 1.0.0
related: [research-paper-cognitive-architectures-for-prompts.md]
source: research-based
---

# Systematic Debugging via Medical Differential Diagnosis (DDx)

## When to Use

This prompt applies a clinical, systematic approach to debugging complex software problems. It's most effective when you encounter a symptom (e.g., high latency, intermittent errors, memory leaks) that could have multiple potential causes. This method forces a structured, evidence-based process, preventing "anchoring bias" where developers fixate on the first cause that comes to mind.

Use this for bugs in complex, interconnected, or distributed systems. Avoid it for simple, obvious syntax errors or logic bugs where the cause is immediately apparent.

## The Prompt

````
You are an expert systems diagnostician. We are going to apply the principles of medical differential diagnosis to debug a software issue.

**1. Symptom & Problem Representation:**
The primary symptom is: [DESCRIBE THE OBSERVED PROBLEM, e.g., "p99 latency for the /api/v1/users endpoint has spiked by 300% in the last hour."]
The system context is: [BRIEFLY DESCRIBE THE SYSTEM, e.g., "A Node.js microservice connected to a PostgreSQL database, running on Kubernetes."]

**Your Task:**
Follow this seven-step workflow:

1.  **Re-state the Problem:** Briefly summarize the problem representation in standard engineering terminology.
2.  **Generate Hypotheses (Differential Diagnosis):** List all plausible root causes for the symptom, from most likely to least likely. Do not stop at the obvious.
3.  **Define Illness Scripts:** For each of your top 3 hypotheses, describe the "illness script"—the typical narrative or pattern of how this cause would manifest.
4.  **Propose Diagnostic Tests:** For each hypothesis, propose a specific, executable test (e.g., a command, a query, a metric to check) that could be used to *conclusively rule it out*.
5.  **Simulate Results & Narrow:**
    - Assume Test #1 (for your most likely hypothesis) comes back *negative*. What does this tell you?
    - Assume Test #2 (for your second most likely hypothesis) comes back *positive*.
6.  **State the Probable Diagnosis:** Based on the simulated results, state the most likely diagnosis (root cause).
7.  **Recommend Treatment:** Propose a specific, immediate action to mitigate or fix the issue.
````

## Example

**Context:**
An on-call engineer is alerted to a sudden increase in API response times.

**Input:**
```
You are an expert systems diagnostician. We are going to apply the principles of medical differential diagnosis to debug a software issue.

**1. Symptom & Problem Representation:**
The primary symptom is: "p99 latency for the /api/v1/users endpoint has spiked by 300% in the last hour."
The system context is: "A Node.js microservice connected to a PostgreSQL database, running on Kubernetes."

**Your Task:**
Follow this seven-step workflow:

1.  **Re-state the Problem:** Briefly summarize the problem representation in standard engineering terminology.
2.  **Generate Hypotheses (Differential Diagnosis):** List all plausible root causes for the symptom, from most likely to least likely.
3.  **Define Illness Scripts:** For each of your top 3 hypotheses, describe the "illness script".
4.  **Propose Diagnostic Tests:** For each hypothesis, propose a specific, executable test to rule it out.
5.  **Simulate Results & Narrow:**
    - Assume Test #1 comes back *negative*.
    - Assume Test #2 comes back *positive*.
6.  **State the Probable Diagnosis:** State the most likely root cause.
7.  **Recommend Treatment:** Propose a specific action.
```

**Expected Output:**
```
### Differential Diagnosis Report: API Latency Spike

**1. Problem Representation:**
The user-facing API endpoint for retrieving user profiles is experiencing a severe latency degradation (3x increase in p99 response time) over the past 60 minutes.

**2. Differential Diagnosis (Hypotheses):**
1.  **Database Contention:** A long-running query or transaction lock in the PostgreSQL database is blocking reads. (High probability)
2.  **Service Resource Starvation:** The Node.js service pod is hitting CPU or Memory limits. (Medium probability)
3.  **Network Latency:** Increased network delay between the service and the database. (Low probability)
4.  **Downstream Service Failure:** An internal service called by the users endpoint is slow or failing. (Low probability)
5.  **Bad Deploy:** A recent deployment introduced inefficient code. (Low, assuming no recent deploys)

**3. Illness Scripts:**
1.  **Database Contention:** Latency would increase suddenly, affecting all endpoints that touch the `users` table. We'd see a high number of active connections in `pg_stat_activity` with a `waiting` status.
2.  **Service Resource Starvation:** Latency would climb gradually as the service struggles. Kubernetes health checks might show high CPU or Memory usage. We would likely see this affect all endpoints on the service, not just `/api/v1/users`.
3.  **Network Latency:** This would manifest as increased response times for all database queries, not just one. A simple `ping` from the service pod to the database host would show elevated times.

**4. Diagnostic Tests:**
1.  **Test for DB Contention:** Run `SELECT * FROM pg_stat_activity WHERE state <> 'idle' AND query_start < now() - interval '1 minute';` to find long-running queries.
2.  **Test for Resource Starvation:** Run `kubectl top pod <service-pod-name> -n <namespace>` to check CPU and Memory usage.
3.  **Test for Network Latency:** `exec` into the service pod and run `ping <db-host>`.

**5. Simulated Results:**
- Test #1 (DB Contention) is **negative**. The query returns no long-running transactions. This makes a database-level lock unlikely to be the primary cause.
- Test #2 (Resource Starvation) is **positive**. `kubectl top pod` shows the service pod is at 99% of its CPU limit.

**6. Probable Diagnosis:**
**CPU Saturation at the service layer.** The Node.js process is overloaded, causing a processing bottleneck that manifests as high response latency. The original symptom might be caused by an inefficient bit of code that is CPU-intensive, perhaps a complex data transformation that is being triggered more frequently.

**7. Recommended Treatment:**
**Immediate Mitigation:** Initiate a rolling restart of the deployment to temporarily restore service health by moving the pod to a new node.
**Follow-up:** Analyze the flame graph or CPU profile of the Node.js process to identify the function causing the high CPU usage.
```

## Expected Results

- A structured, ordered list of potential causes for a bug.
- A clear, actionable test for each potential cause.
- A logical deduction of the most likely root cause based on simulated test results.
- This process avoids wasted time on incorrect "hunches" and provides a clear path to resolution.

## Variations

### "Zebra" Diagnosis

For particularly tricky or recurring bugs, you can ask the AI to include a "Zebra"—a rare but possible diagnosis.

**Add this to the prompt's `Generate Hypotheses` step:**
```
Include at least one "Zebra" diagnosis: a rare, non-obvious cause that could explain the symptoms if all common causes are ruled out (e.g., kernel-level issue, noisy neighbor on the node, cosmic rays).
```

## References

- [Clinical Reasoning & Differential Diagnosis](https://en.wikipedia.org/wiki/Differential_diagnosis)
- [Differential Diagnosis for Distributed Systems](https://chronosphere.io/learn/troubleshoot-faster-with-ddx/)
- `research-paper-cognitive-architectures-for-prompts.md`

## Notes

The power of this method comes from its systematic process of elimination. The prompt is designed to force the AI to consider multiple possibilities before jumping to a conclusion, mirroring the best practices of expert human diagnosticians.

## Version History

- 1.0.0 (2026-01-12): Initial version based on the cognitive architectures research paper.
