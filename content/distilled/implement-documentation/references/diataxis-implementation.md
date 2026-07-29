# Diátaxis Implementation Guide

Six-step rollout for adopting Diátaxis on an existing or new documentation set. Use in Step 5 when the task is a full architecture rollout rather than a single topic. The canonical theory is `content/research-documentation-frameworks.md`.

## Step 1: Audit existing documentation

Catalog every existing document and classify it as Tutorial, How-to, Reference, or Explanation. The audit typically reveals that most docs are reference, with gaps in tutorials and explanation. (Use the `research-documentation` skill for this.)

## Step 2: Create a directory structure

Create four directories or sections: `tutorials/`, `how-to/` (or `guides/`), `reference/`, and `explanation/`. Apply title conventions per type: Explanation titles use "Understanding / Dive into / Introduction to..."; How-to titles start with "How to..."; Tutorial titles use "Getting started with...".

## Step 3: Assign content types and split mixed documents

Long mixed-topic documents become multiple short, focused documents. A document that is tutorial then reference then explanation becomes three separate documents, each in its quadrant directory.

## Step 4: Establish contribution guidelines

Document the framework for contributors so new docs land in the right place from the start. Without guidelines the four-directory structure fills with misclassified content. Keep the guidelines short: one sentence per quadrant on what belongs there.

## Step 5: Integrate with the development workflow

Add architecture specs to Reference alongside code changes. Add technical decision logs to Explanation during feature development. Docs-updated checkboxes in PR templates. This integration is what keeps docs current.

## Step 6: Use Diátaxis as an AI prompt template

The clear information patterns make effective AI prompt templates: ask a model to sort unstructured content into the four patterns to accelerate a first draft, then review and refine. (See `references/templates.md` for the per-quadrant output shapes.)

## Critiques to keep in mind

Diátaxis is a guide, not dogma. Forcing every artifact into four rigid buckets produces awkward docs. The terms overlap (tutorial vs. how-to needs editorial judgment). The framework does not address content reuse (DITA's conref may suit enterprise multi-output needs) nor finding aids. For early-stage projects, a single compelling quick start may suffice before the full suite.