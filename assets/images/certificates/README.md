# Certificates Folder

This folder contains award certificate images that will be displayed in the Awards section modal/lightbox.

## Recommended Image Specifications

- **Format**: JPG or PNG
- **Orientation**: Landscape (horizontal) preferred
- **Resolution**: At least 1200px width recommended
- **File naming**: Use descriptive names (e.g., `whiteout-best-design.jpg`)

## Example Structure

```
certificates/
  ├── whiteout-best-design.jpg
  ├── crossfader-innovation-award.jpg
  ├── mantle-technical-achievement.png
  └── project-name-award.jpg
```

## Usage

Reference these images in your project page HTML:

```html
<button class="btn-certificate" 
        data-certificate="../assets/images/certificates/your-certificate.jpg"
        data-certificate-alt="Award Description">
  View Certificate
</button>
```

## Tips

1. **Optimize images** before uploading to reduce page load time
2. **Keep filenames** lowercase with hyphens (e.g., `my-award-2026.jpg`)
3. **Test the modal** by clicking "View Certificate" buttons on your project pages
