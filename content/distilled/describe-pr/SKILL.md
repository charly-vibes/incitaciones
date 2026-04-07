# Generate PR Description

Create a pull request description based on the actual PR changes.

## Procedure

1. Identify the PR.
2. Gather diff, commit history, and metadata.
3. Analyze what changed, why it changed, and reviewer-relevant impact.
4. Generate the description using `references/pr-template.md`.
5. Show the draft to the user before updating the PR.

## Rules

- Focus on why, not just what.
- Be specific about impact, testing, and reviewer guidance.
- Highlight breaking changes, security implications, and rollout concerns when present.
