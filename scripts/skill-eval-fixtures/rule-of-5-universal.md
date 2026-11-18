# Fixture: rule-of-5-universal — realistic task for the 5-stage iterative review

Review this artifact through the five stages until convergence. The
artifact is a two-paragraph design note for a cache layer:

> We will cache API responses in Redis with a 24-hour TTL. On a cache
> miss we query the primary database and store the result. To keep things
> simple there is no invalidation: writes go to the database, and reads
> after a write may return the previous value until the TTL expires.
> Authentication tokens are cached the same way for 24 hours.

Respond as you would in a live review: walk Stage 1 (DRAFT) through
Stage 5 (EXCELLENCE) with findings per stage — each stage building on the
previous — exact locations (paragraph, sentence), suggested fixes, an
UNVERIFIED marker where you cannot validate a claim, and the final report
with a verdict. This is a simulation; `TYPESAFE_API_KEY` is not set, so
self-reported validation with UNVERIFIED markers applies.

### Expected decisions (evaluation oracle)

- Stage 1 (shape): read path is clear; write path consistency is
  unaddressed — scope gap, not yet an error.
- Stage 2 (correctness): staleness after writes is stated but its impact
  is unanalyzed; token caching for 24h is a security defect (revocation
  window) — verifiable by reasoning, state it plainly.
- Stage 3 (clarity): "keep things simple" conflates no-invalidation with
  no-problem; audiences differ on tolerable staleness.
- Stage 4 (edge cases): eviction under memory pressure, cold-start stampede,
  multi-instance TTL drift.
- Stage 5 (excellence): concrete TTL/invalidation proposal, explicit
  token-caching removal.
- Locations cite paragraph/sentence; every flagged defect has a suggested
  fix; convergence may stop early only with criteria met.
