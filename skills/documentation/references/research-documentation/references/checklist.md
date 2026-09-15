# Documentation Completeness Checklist

Use during the audit (Step 2) to check existing or planned coverage. Source: `content/research-finding-library-docs-best-practices.md` (Section 1, the best-practices checklist, and Section 5, accessibility).

## Completeness and accuracy

- All public APIs, endpoints, parameters, and return values are documented.
- All error codes and messages are documented with explanations and remediation steps.
- Prerequisites and system requirements are stated upfront.
- All code examples are tested and verified to work with the current version.
- No documented features are missing from the implementation, and no undocumented features exist.

## Getting started and onboarding

- A "Getting Started" or "Quick Start" guide exists and can be completed in under 15 minutes.
- The guide leads to a meaningful, working result (not just "Hello, World" unless that is genuinely useful).
- Installation instructions cover all supported platforms and package managers.
- Authentication and configuration are explained before any API calls are shown.

## API reference

- Each endpoint/function/method has a human-friendly description, not just a parameter list.
- Request and response examples are provided for every endpoint.
- Authentication requirements are documented per endpoint where relevant.
- Rate limits, pagination, and other operational constraints are documented.
- The reference is generated from or synchronized with a machine-readable specification (OpenAPI, TypeDoc, JSDoc, Sphinx autodoc).

## Versioning and changelog

- Documentation is versioned to match software releases.
- A changelog exists and is kept up to date.
- Breaking changes are prominently highlighted.
- Deprecated features are marked with migration paths provided.
- Old versions of documentation remain accessible.

## Code examples

- Examples exist for all major use cases.
- Examples are provided in all officially supported languages/frameworks.
- Examples are complete and runnable, not pseudocode or partial snippets.
- Examples follow current best practices and idioms for each language.

## Conceptual and explanatory content

- Architecture and design decisions are explained (the "why", not just the "what").
- Key concepts are defined before they are used.
- Diagrams and visuals are used where they clarify complex relationships.

## Accessibility (WCAG 2.1 AA)

- Code syntax highlighting meets minimum contrast ratios.
- All navigation, search, and interactive elements are operable by keyboard alone.
- Code blocks, tables, and diagrams have appropriate ARIA labels and alt text.
- The site is readable on mobile and manages focus correctly in single-page-app navigation.

## Out of scope for this checklist

Internationalization/localization and interactive documentation (live playgrounds, API explorers) are valid concerns but are tracked separately as platform/infrastructure decisions, not architectural-audit items.