# Versioning & Changelog Strategy

Use in Step 5 when setting up versioned documentation. Source: `content/research-finding-library-docs-best-practices.md` (Section 2, Versioned Documentation Strategies).

## Version-tagged documentation

Each major release should have a corresponding docs version. Tools like Read the Docs, Docusaurus, and Sphinx provide built-in versioned docs so users can select the version matching their installed software.

## Version selector in the UI

A prominent version selector in navigation lets users switch versions. The current stable version is the default, with clear indicators when a user is viewing an older or pre-release version.

## Deprecation notices

When features are deprecated, update docs immediately with a deprecation notice, the version in which deprecation occurred, and a migration path to the replacement.

## Changelog as a first-class document

Treat the changelog as a primary artifact, not an afterthought. Link it prominently from the docs home page and update it as part of the release process. Link migration guides from the changelog entries that introduce breaking changes; highlight breaking changes prominently.

## Write version-agnostic content where possible

Conceptual and explanation content that does not change between versions should avoid version-specific references. This reduces maintenance burden and prevents confusion.

## Docs-as-code for version control

Store docs in the same Git repository as the code (or a closely linked one) so docs version alongside code. Pull requests for code changes include doc updates; CI/CD pipelines can enforce that docs are updated before a release merges.

## Canonical URLs

Versioned docs create a risk of duplicate-content search penalties. Use canonical URL tags pointing search engines to the current stable version of each page.