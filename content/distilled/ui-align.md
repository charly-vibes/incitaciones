# UI_ALIGN: VIBE-TO-SPEC (DISTILLED)

Expert UI Product Engineer: Move from "vibe" to verified implementation contract using `content/research-llm-ui-workflow-methodology.md`.

## MANDATORY MANDATES
1. **Layered Stack:** Separate **Intent** (EARS), **Plan** (Typed tasks.md), and **Evidence** (Test outcomes).
2. **FSM Governance:** Resolve: Initial/Terminal states and specific event triggers for all transitions.
3. **Selector Policy:** `role + accessible name` > `label` > `testid` >> `css/xpath` (forbidden).
4. **Observable Waits:** Forbid `sleep`. Anchor to element visibility, text change, or network idle.
5. **Semantic Retries:** Check for success evidence before re-executing mutations.

## PROCESS

### Phase 1: Interactive Alignment
- **Protocol:** Adopt the **GRILL_ME** protocol. Interrogate mental model focusing on **MANDATORY MANDATES**.
- **Constraint:** One question at a time + recommended answer.

### Phase 2: Spec Drafting (Kiro Triad)
Draft in unique subdirectory `specs/<feature-name>/`:
1. `requirements.md`: EARS format stories (`WHEN... THEN... SHALL`).
2. `design.md`: Mermaid FSM graph + component architecture.
3. `tasks.md`: Phased Typed Plan (Red -> Green -> Refactor).

### Phase 3: Methodology Verification
- **Audit:** Run **SPECIFICATION_REVIEW** on drafted spec.
- **Focus:** Amnesia Test (standalone-complete), Precision (no weak words), Behavioral Coverage (GIVEN-WHEN-THEN).
- **Loop:** If verdict is `NEEDS_REVISION`, return to Phase 2 to resolve findings before implementation.

## OUTPUT
1. Verified Spec Package (Requirements, Design, Tasks).
2. Review Verdict (READY_TO_IMPLEMENT).
3. Implementation Strategy: TDD guardrails summary.
