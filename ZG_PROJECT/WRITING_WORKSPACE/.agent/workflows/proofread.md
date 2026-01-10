---
description: Proofread and review the current article draft
---

# Proofread Workflow

1. **Lint Check**:
   - Run `npx textlint {current_file}` (if available).
   - If `textlint` is not installed, suggest installing it or skip to manual review.

2. **Style Check** (Manual by Agent):
   - Check if the Tone & Manner matches `rules/10-writing-style.md`.
   - Check if H2/H3 hierarchy is correct.
   - Check if there are any obvious typos or grammatical errors.

3. **Report**:
   - Create a summary of findings.
   - If there are critical errors, stop and ask user to fix.
   - If minor suggestions, list them.

4. **SEO Check**:
   - Verify if keywords are used in the title and introduction.
   - Check if `description` in frontmatter is filled.

