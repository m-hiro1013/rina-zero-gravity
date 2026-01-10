---
description: Create a new article draft with standard frontmatter
---

# Create Draft Workflow

1. Ask the user for the "Article Title" and "Slug" (URL path).
2. Ask for "Tags" (comma separated).
3. Generate the current date in YYYY-MM-DD format.
4. Create a new markdown file in `ZG_PROJECT/WRITING_WORKSPACE/articles/` (create directory if not exists).
   - Filename: `{YYYY-MM-DD}-{slug}.md`
5. Write the following Frontmatter to the file:
   ```markdown
   ---
   title: {Article Title}
   date: {YYYY-MM-DD}
   tags: [{Tags}]
   draft: true
   description: ""
   ---

   # {Article Title}

   ## Introduction
   <!-- Write your introduction here -->

   ## Body
   <!-- Main content -->

   ## Conclusion
   <!-- Summary and CTA -->
   ```
6. Open the created file for the user.

