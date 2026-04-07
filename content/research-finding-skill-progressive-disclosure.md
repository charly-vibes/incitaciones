---
title: Progressive Disclosure Pattern for AI Agent Skills
type: research
subtype: finding
tags: [skills, architecture, context-optimization, progressive-disclosure, agent-tooling]
status: verified
created: 2026-04-07
updated: 2026-04-07
version: 1.0.0
related: [AGENTS.md, prompt-task-distill-prompt.md, prompt-task-verify-distilled-prompt.md]
source: synthesis of Agent Skills best practices and repository refactoring
---

# Progressive Disclosure Pattern for AI Agent Skills

## Overview

As AI agent skills grow in complexity, single-file "megaprompts" become difficult to maintain and consume excessive context tokens. The **Progressive Disclosure Pattern** addresses this by splitting a skill into a core instruction set and a set of on-demand reference materials.

## The Problem: "Context Bloat"

When an agent activates a skill, it typically loads the entire content of the skill file into its context.
- **Maintenance:** Large files are harder to edit and version.
- **Cost/Latency:** High token counts increase API costs and slow down response times.
- **Noise:** Irrelevant examples or templates can distract the agent from the core logic during the execution phase.

## The Solution: Split Structure

A skill is divided into:
1.  **`SKILL.md` (Core Logic):** High-level procedure, rules, and "triggers" for loading more detail. Ideally < 500 lines.
2.  **`references/` (On-Demand Data):** Static templates, domain-specific examples, and complex criteria that the agent only reads when needed.

### Structure on Disk
```
content/distilled/
└── my-skill/
    ├── SKILL.md
    └── references/
        ├── templates.md
        ├── examples.md
        └── criteria.md
```

## Best Practices

### 1. The Trigger Protocol
Explicitly tell the agent when to read reference files.
> "Use `references/templates.md` for the exact output format of each stage."

### 2. Functional Core
The `SKILL.md` should contain the "how-to" (the algorithm), while the `references/` contain the "what" (the data).

### 3. Progressive Loading
Instruct the agent to read specific reference files only when it reaches that step in the procedure, using whatever file-reading tool the runtime provides.

## Implementation in Incitaciones

The `install.sh` script has been updated to support this directory-based structure. If a directory named `my-skill` exists in `content/distilled/` containing a `SKILL.md`, it is treated as a multi-file skill.

## Testing Results

Refactoring the `rule-of-5-universal` skill using this pattern reduced the initial context load by approximately **65%**, while maintaining full access to templates and examples via the `references/` directory.
