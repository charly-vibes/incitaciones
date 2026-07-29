# Tooling Comparison & Docs-as-Code

Use in Step 5 when choosing a platform or setting up docs infrastructure. Platform selection is an implementation decision, not an audit finding. The canonical theory is `content/research-documentation-frameworks.md`.

## Platform comparison

| Platform | Best For | Stack | Key Strength |
| :--- | :--- | :--- | :--- |
| Docusaurus | Complex OSS docs, versioning | React/JS | Ecosystem, versioning, MDX |
| MkDocs (Material) | Python projects, simple setup | Python | Simplicity, polished theme |
| Sphinx | Python API reference | Python | Autodoc, multiple outputs |
| Read the Docs | OSS hosting, versioning | Agnostic | Free hosting, versioning |
| GitBook | Team knowledge bases | Agnostic | Editing UX, AI search |
| Mintlify | API docs, dev portals | Agnostic | Design, AI search, OpenAPI |
| Starlight | Performance-critical docs | Astro | Performance, accessibility |
| Nextra | Custom Next.js sites | React/Next.js | Customization, React components |

## How to choose

- Python ecosystem or simplicity: MkDocs / Sphinx.
- API reference that must stay synced to code: Sphinx autodoc, mkdocstrings, or TypeDoc.
- API docs with interactive playground: Mintlify.
- Complex OSS docs with versioning and i18n: Docusaurus.
- Performance and built-in accessibility: Starlight.
- Free open-source hosting with versioning: Read the Docs.

## Docs-as-code workflow

Write docs in plain text (Markdown/AsciiDoc/reST), store in Git, review through pull requests, publish through CI/CD. Core practices:

- Store docs in the same repository as the code.
- Write in plain text (Markdown dominates for developer docs).
- Review all doc changes through the same PR process as code.
- Automate builds and deployments via CI/CD (GitHub Actions, GitLab CI).
- Enforce quality through automation: Vale, markdownlint, link checkers (htmlproofer, lychee), spell checkers on every PR.
- Generate API reference from OpenAPI/Swagger to keep it synchronized.

## Specification-driven API docs

- **OpenAPI** is the standard for REST APIs (YAML/JSON). Use it to auto-generate interactive reference (Swagger UI, Redoc, Stoplight Elements), client SDKs, and mock servers, and to power AI agent tool manifests.
- **AsyncAPI** extends the approach to event-driven APIs (WebSockets, Kafka, MQTT).
- Prefer a **design-first** approach: write the spec before the code. This enables early collaboration, immediate mock servers, and ensures docs are never an afterthought.

## Interactive documentation

Place the interactive element directly adjacent to the relevant docs, not on a separate playground page. Live code playgrounds (CodeSandbox, StackBlitz), interactive API explorers (Swagger UI, Mintlify), and embedded REPLs reduce time-to-first-success.