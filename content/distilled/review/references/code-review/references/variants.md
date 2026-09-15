# Code Review Variants

Apply these specialized passes for specific types of work.

## UI/Frontend Variant

| Pass | Focus Area |
| :--- | :--- |
| **Pass 1: Security** | XSS, CSRF, Secure storage of sensitive data. |
| **Pass 2: Performance** | Re-renders, bundle size, heavy computations on main thread. |
| **Pass 3: Accessibility** | WCAG, ARIA labels, semantic HTML, keyboard nav. |
| **Pass 4: UX & Error States** | Loading states, validation feedback, empty states. |
| **Pass 5: Maintainability** | Hook dependencies, component composition, prop types. |

## Refactoring Variant

| Pass | Focus Area |
| :--- | :--- |
| **Pass 0: Behavioral Preservation** | Do tests still pass? Is functionality identical? |
| **Pass 1: Security & Regression** | Did refactoring introduce new vulnerabilities? |
| **Pass 2: Structure & Cleanliness** | Is the new structure actually better? |
| **Pass 3: Documentation** | Updated comments/types reflecting the change? |
| **Pass 4: Performance Impact** | New bottlenecks in abstracted layers? |

## High-Risk Production Code Variant

| Pass | Focus Area |
| :--- | :--- |
| **Pass 1-5** | Standard domain passes. |
| **Pass 6: FP Check** | Rigorously check for false positives in findings. |
| **Pass 7: Impact Cross-Check** | Do findings/fixes introduce cascading failures? |
| **Pass 8: Reliability & Ops** | Metrics, logging, rollback strategy. |
