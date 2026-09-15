# Layer 5: Documentation Quality (Diataxis)

Evaluate strict modality separation in documentation. Skip if not applicable.

## Modalities (Diataxis)
- **Tutorials:** Guided learning. Avoid theory injection or reference-style detail.
- **How-To Guides:** Goal-oriented steps. Avoid conceptual digressions or exhaustive parameter lists.
- **Explanations:** Background and rationale. Avoid step-by-step instructions or API signatures.
- **Reference:** Technical specifications. Avoid tutorial guidance or opinion/rationale.

## Checks
- **Prose Linting:** Is automated prose linting (Vale/alex) integrated?
- **Missing Modalities:** Flag absent modalities as critical onboarding gaps.

## Diagnostic Format
Per modality: `[PRESENT | ABSENT | CONTAMINATED]`
- **Boundary Violations:** Where modalities are mixed inappropriately.
- **Coverage:** How much of the topic is covered by this modality.
- **Recommendation:** Actionable fix.
