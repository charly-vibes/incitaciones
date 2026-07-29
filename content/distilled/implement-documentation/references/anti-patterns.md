# Documentation Anti-Patterns

Avoid these during Step 1 (quadrant check) and throughout writing. The canonical theory is `content/research-documentation-frameworks.md`.

## Leading with explanation instead of action

The engineer's impulse is to explain how a system works before showing how to use it. This is backwards for most users. Quickstart then how-to then reference is the ramp-up order. Fix: in Tutorials and How-tos, lead with a runnable result; move "how it works" to Explanation.

## One stream of text serving as THE DOCS

A single document trying to teach beginners, guide intermediate users, and serve as expert reference serves none of them. Fix: split by Diátaxis quadrant; each page has one intent.

## FAQ lists as an anti-pattern

An FAQ is "the box in the garage where you put things when you can't be bothered to put them in the right place." If information is in the right Diátaxis quadrant, it does not need repeating in an FAQ. Fix: place each answer where it belongs; delete the FAQ or keep only genuinely miscellaneous items.

## The curse of knowledge

Experts forget what it was like not to know. They skip "obvious" steps, use undefined jargon, assume context beginners lack. Fix: in Tutorials, state every prerequisite; define jargon on first use; have a non-expert read it.

## Stale documentation

Docs not embedded in the development workflow drift from the code. Incorrect docs are worse than missing docs — they waste time and erode trust. Fix: docs-as-code, docs-updated checkboxes in PRs, "you touch it, you document it."

## Knowledge silos

Scattered docs across wikis, READMEs, Confluence, Notion create a fragmented experience where users cannot find things and contributors do not know where to put new content. Fix: one canonical location, ideally in the same repo as the code.

## Partial coverage

Documenting some but not all of a feature or API creates a false sense of completeness — users assume the undocumented part does not exist or work. Fix: cover a concept fully or not at all; use the completeness checklist (`../research-documentation/references/checklist.md`).

## Mixed-intent "Frankenbooks"

A page that starts as a tutorial, becomes reference, and ends as explanation. Fix: split into three focused pages; each keeps quadrant purity. Use a Note or Deep Dive sidebar only when a sliver of theory is required inside a task page.