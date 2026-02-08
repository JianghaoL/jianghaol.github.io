# Blog Page Guide

## Overview

The Blog page is a data-driven showcase for your tech and geek-oriented blog posts. It maintains visual consistency with the Work Gallery and the rest of your portfolio site.

## Features

- **Category-Based Organization**: Posts are automatically grouped by category
- **Table of Contents**: Quick navigation sidebar with smooth scrolling
- **Flip Cards**: Hover-activated 3D flip animation showing full content
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Scroll Spy**: TOC automatically highlights the current section
- **Modular & Data-Driven**: Easy to add new posts without touching HTML/CSS

## File Structure

```
blog/
├── index.html      # Main blog page structure
├── blog.css        # Blog-specific styling
├── blog.js         # Blog functionality and data
└── BLOG_GUIDE.md   # This file
```

## Adding a New Blog Post

To add a new blog post, simply add a new object to the `blogData` array in `blog.js`:

```javascript
{
  id: 14,                                    // Unique ID
  title: "Your Post Title",                 // Post title (shown on card)
  category: "Game Development",             // Category name (groups posts)
  date: "2026-02-15",                       // Publication date (YYYY-MM-DD)
  excerpt: "Short summary for card front",  // Brief description (3-4 lines)
  fullExcerpt: "Full description...",       // Longer description (card back)
  image: "",                                // Optional: path to featured image
  tags: ["Unity", "C#", "Tutorial"],        // Optional: technology tags
  detailPage: "#"                           // Link to full post (or "#" for placeholder)
}
```

### Field Details

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique numeric identifier |
| `title` | Yes | Post title displayed on card |
| `category` | Yes | Category for grouping (auto-generates TOC) |
| `date` | Yes | Publication date in YYYY-MM-DD format |
| `excerpt` | Yes | Short summary shown on card front (keep under 100 chars) |
| `fullExcerpt` | Yes | Longer description shown on card back |
| `image` | No | Path to featured image (empty string shows placeholder) |
| `tags` | No | Array of technology/topic tags |
| `detailPage` | Yes | URL to full blog post or "#" for placeholder |

## Categories

Categories are automatically detected from your blog data. Common categories in use:

- **Game Development**: Unity, C#, game programming
- **Game Audio**: Sound design, audio implementation, procedural audio
- **Game Design**: Level design, puzzle mechanics, UX
- **Audio Programming**: DSP, audio tools, plugins
- **Technical Art**: Shaders, graphics, pipelines
- **Workflow & Tools**: Development tools, productivity tips

**Note**: Category names should be consistent (use the exact same string for posts in the same category). The TOC is automatically generated based on unique categories.

## Linking to Full Blog Posts

Currently, `detailPage` is set to `"#"` (placeholder). When you create actual blog post pages:

1. Create a `blog-posts/` directory
2. Add individual HTML files for each post
3. Update the `detailPage` field with the relative path:
   ```javascript
   detailPage: "blog-posts/my-post-name.html"
   ```

## Customization

### Changing Card Height

In `blog.css`, adjust:
```css
.blog-card {
  height: 420px; /* Change this value */
}
```

### Modifying TOC Position

The TOC is sticky. To adjust its scroll position, modify in `blog.css`:
```css
.blog-toc {
  top: 100px; /* Adjust based on header height */
}
```

### Adding Custom Icons

Icons are defined in `blog.js` in the `iconLibrary` object. To add new icons:

```javascript
const iconLibrary = {
  // ... existing icons
  newIcon: `<svg>...</svg>`
};
```

## Styling Consistency

The blog page uses the same design system as the rest of the site:

- CSS variables from `base.css` (colors, radius, etc.)
- Typography styles from `style.css`
- Card animations similar to Work Gallery
- Header/footer match site-wide components

## Mobile Behavior

- **Desktop**: TOC sidebar on the left, side-by-side layout
- **Tablet**: Slightly narrowed TOC, similar layout
- **Mobile**: TOC moves above content, single-column cards, no flip cards on touch

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox required
- Intersection Observer for scroll spy
- CSS transforms for card flip effect

## Tips

1. **Keep excerpts concise**: Front card shows 3 lines max
2. **Use consistent categories**: Exact string matching for grouping
3. **Date format matters**: Use YYYY-MM-DD for proper sorting
4. **Test card flips**: Ensure back content fits without overflow
5. **Optimize images**: Featured images should be ~800px wide for best performance

## Future Enhancements

Potential features to add:

- Search/filter functionality
- Tag-based filtering (in addition to categories)
- Pagination or infinite scroll
- RSS feed generation
- Reading time estimates
- Social sharing buttons

---

**Questions?** The blog system is designed to be self-explanatory. If you need to modify styles or behavior, check the comments in `blog.js` and `blog.css`.
