# Research Review Criteria

Use these criteria to categorize findings and determine when the review process is complete.

## Issue Severity Definitions

| Severity | Criteria | Example Findings |
| :--- | :--- | :--- |
| **CRITICAL** | Factually wrong or misleading. Claims made about the codebase or external APIs that are false. | Incorrect architectural claim, broken code example, citation that doesn't support the claim. |
| **HIGH** | Significant gaps in analysis or logic. Conclusions that do not follow from findings. | Unanswered research question, missing trade-off analysis, no actionable recommendation. |
| **MEDIUM** | Could be clearer, more complete, or more organized. | Vague terminology, inconsistent formatting, redundant sections, minor depth gaps. |
| **LOW** | Minor improvements or metadata gaps. | Typos, outdated minor library versions, missing cross-references. |

## Convergence Criteria

**CONVERGED** if:
- No new **CRITICAL** issues were found in the current pass AND
- The number of new issues found is less than 10% compared to the previous pass AND
- The estimated false positive rate is below 20%.

**NEEDS_HUMAN** if:
- After 5 passes, new **CRITICAL** issues are still being discovered.
- The false positive rate exceeds 30%.
- A fundamental disagreement on methodology or problem framing is identified.

## Pass Focus Checklist

### Pass 1: Accuracy & Sources
- [ ] Are all claims backed by code references or citations?
- [ ] Are the cited sources credible and recent?
- [ ] Are technical details factually correct?

### Pass 2: Completeness & Scope
- [ ] Are all initial research questions answered?
- [ ] Are there obvious related topics that were ignored?
- [ ] Is the depth of analysis appropriate for the subject?

### Pass 3: Clarity & Structure
- [ ] Does the document flow logically from findings to conclusions?
- [ ] Are all technical terms and jargon defined?
- [ ] Is the terminology consistent throughout?

### Pass 4: Actionability & Conclusions
- [ ] Are the takeaways and recommendations clear?
- [ ] Are the trade-offs of proposed solutions articulated?
- [ ] Is there implementable guidance for the next steps?

### Pass 5: Integration & Context
- [ ] Does this research contradict established project decisions?
- [ ] Are there connections to related specs and codebase patterns?
- [ ] Does it provide clear guidance for decision-making?
