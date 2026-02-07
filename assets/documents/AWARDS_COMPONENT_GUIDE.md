# Awards Showcase Component - Usage Guide

## Overview
A premium, modular Awards showcase section for displaying project awards and certificates on portfolio project pages.

## Features
- **Laurel wreath emblems** with customizable award titles
- **Certificate modal/lightbox** for viewing full certificates
- **Fully responsive** design across all devices
- **Modular structure** - supports 0, 1, or multiple awards
- **Accessible** - keyboard navigation, ARIA labels, screen reader support
- **Premium animations** - smooth hover effects and transitions

## File Structure
```
css/
  components/
    awards.css          # Awards component styles
js/
  certificate-modal.js  # Certificate modal functionality
```

## How to Use

### 1. Basic Setup
The Awards section is already integrated into:
- `whiteout.html` - Example with one award
- `project-template.html` - Template with two example awards

### 2. Adding the Awards Section to a New Project Page

Copy this HTML structure and place it between the Overview section and the first content block:

```html
<!-- Awards Section -->
<section class="content-block content-block--awards" data-reveal>
  <div class="awards-container">
    <h2>Awards & Recognition</h2>
    <p class="awards-subtitle">Celebrating achievements and milestones</p>
    
    <div class="awards-grid">
      <!-- Award cards go here -->
    </div>
  </div>
</section>
```

### 3. Adding an Award Card

Each award follows this structure:

```html
<article class="award-card">
  <div class="award-emblem">
    <!-- Laurel Wreath SVG (use the provided SVG) -->
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- SVG paths here - see template for full code -->
    </svg>
    <div class="award-emblem-title">Your Award Title</div>
  </div>
  <p class="award-description">
    This project received the [Award Name] at [Event/Organization].
  </p>
  <button class="btn-certificate" 
          data-certificate="path/to/certificate.jpg"
          data-certificate-alt="Award Certificate Description"
          aria-label="View Award Certificate">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <!-- Document icon SVG - see template for full code -->
    </svg>
    View Certificate
  </button>
</article>
```

### 4. Customizing an Award

**Change the award title:**
```html
<div class="award-emblem-title">Best Design</div>
```

**Update the description:**
```html
<p class="award-description">
  This game received the Best Design Award at the 2026 Global Game Jam.
</p>
```

**Link to certificate image:**
```html
<button class="btn-certificate" 
        data-certificate="../assets/images/certificates/your-certificate.jpg"
        data-certificate-alt="Best Design Award Certificate"
        aria-label="View Best Design Award Certificate">
```

### 5. Multiple Awards

Simply duplicate the `<article class="award-card">` block for each additional award:

```html
<div class="awards-grid">
  <article class="award-card">
    <!-- First award -->
  </article>
  
  <article class="award-card">
    <!-- Second award -->
  </article>
  
  <article class="award-card">
    <!-- Third award -->
  </article>
</div>
```

The grid will automatically adjust to fit the awards in a responsive layout.

### 6. No Awards (Hide Section)

If a project has no awards, simply remove or comment out the entire Awards section:

```html
<!-- No awards for this project
<section class="content-block content-block--awards" data-reveal>
  ...
</section>
-->
```

### 7. Certificate Image Requirements

For best results, certificate images should:
- Be in **JPG** or **PNG** format
- Have a **landscape orientation** (recommended)
- Be **high resolution** (at least 1200px wide recommended)
- Be stored in: `assets/images/certificates/`

Example path structure:
```
assets/
  images/
    certificates/
      whiteout-best-design.jpg
      whiteout-innovation.jpg
      project-name-award.jpg
```

## Customization Options

### Change Colors
Edit `css/components/awards.css` to modify:
- Background gradients
- Border colors
- Laurel wreath color (currently using `--accent: #6AB0F3`)

### Adjust Spacing
Modify these values in `awards.css`:
```css
.awards-grid {
  gap: 2.5rem;  /* Space between award cards */
}

.content-block--awards {
  padding: 4rem 2rem;  /* Section padding */
}
```

### Modify Laurel Wreath
The laurel wreath is an inline SVG that you can customize:
- Change stroke colors
- Adjust path curves
- Add/remove decorative elements

## Accessibility Features

✅ Keyboard navigation support
✅ ARIA labels for screen readers
✅ Focus management (returns focus after modal closes)
✅ Escape key closes modal
✅ High contrast mode compatible

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

**Modal not opening?**
- Ensure `certificate-modal.js` is loaded
- Check browser console for JavaScript errors
- Verify the certificate image path is correct

**Styles not applying?**
- Confirm `awards.css` is imported in `style.css`
- Clear browser cache
- Check for CSS conflicts

**Layout breaking on mobile?**
- The component is fully responsive by default
- Check parent container constraints
- Verify viewport meta tag is present

## Examples

### Single Award (Whiteout):
See: `project-pages/whiteout.html`

### Multiple Awards (Template):
See: `project-template.html`

## Need Help?

The Awards component uses the same design patterns as other modular components:
- Similar to Contact Modal (`contact-modal.css`, `contact-modal.js`)
- Follows the same grid system as Media + Text blocks
- Uses consistent design tokens from `base.css`

---

**Created**: February 2026  
**Version**: 1.0  
**Compatible with**: Personal Portfolio Website v2026
