---
description: Generate a thumbnail image for the article
---

# Generate Thumbnail Workflow

1. Identify the topic of the current article.
2. Propose 3 image prompts (styles: Minimalist, Abstract, or Photographic).
3. Ask user to select a style.
4. **Generate Image**:
   - Use `generate_image` tool with the selected prompt.
   - Save to `ZG_PROJECT/WRITING_WORKSPACE/assets/images/`.
5. **Link Image**:
   - Add the image link to the top of the markdown file (after frontmatter).
   - Format: `![Thumbnail](/path/to/image.png)`

