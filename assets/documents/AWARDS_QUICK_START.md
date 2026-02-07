# Quick Start: Adding Your First Award

## Step-by-Step Example

### 1. Prepare Your Certificate Image

Save your certificate image to:
```
assets/images/certificates/my-award-certificate.jpg
```

### 2. Use This HTML Template

```html
<article class="award-card">
  <div class="award-emblem">
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.9">
        <!-- Left Laurel Branch -->
        <path d="M70 100 Q50 90 45 70 Q40 50 45 35 Q50 25 60 30 Q55 45 60 60 Q65 75 70 85" 
              stroke="#6AB0F3" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M70 100 Q55 95 50 80 Q45 65 50 50 Q55 40 65 45 Q60 60 65 75 Q68 85 70 92" 
              stroke="#6AB0F3" stroke-width="2" fill="none" stroke-linecap="round"/>
        <ellipse cx="60" cy="35" rx="4" ry="6" fill="#6AB0F3" opacity="0.8"/>
        <ellipse cx="52" cy="55" rx="4" ry="6" fill="#6AB0F3" opacity="0.8"/>
        <ellipse cx="48" cy="75" rx="4" ry="6" fill="#6AB0F3" opacity="0.8"/>
        
        <!-- Right Laurel Branch -->
        <path d="M130 100 Q150 90 155 70 Q160 50 155 35 Q150 25 140 30 Q145 45 140 60 Q135 75 130 85" 
              stroke="#6AB0F3" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M130 100 Q145 95 150 80 Q155 65 150 50 Q145 40 135 45 Q140 60 135 75 Q132 85 130 92" 
              stroke="#6AB0F3" stroke-width="2" fill="none" stroke-linecap="round"/>
        <ellipse cx="140" cy="35" rx="4" ry="6" fill="#6AB0F3" opacity="0.8"/>
        <ellipse cx="148" cy="55" rx="4" ry="6" fill="#6AB0F3" opacity="0.8"/>
        <ellipse cx="152" cy="75" rx="4" ry="6" fill="#6AB0F3" opacity="0.8"/>
        
        <!-- Bottom Ribbon -->
        <path d="M70 100 Q100 110 130 100" 
              stroke="#6AB0F3" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M70 100 L65 120 L75 105" 
              fill="#6AB0F3" opacity="0.7"/>
        <path d="M130 100 L135 120 L125 105" 
              fill="#6AB0F3" opacity="0.7"/>
        
        <!-- Decorative Circle -->
        <circle cx="100" cy="100" r="55" 
                stroke="#6AB0F3" stroke-width="2" fill="none" opacity="0.3"/>
        <circle cx="100" cy="100" r="50" 
                stroke="#6AB0F3" stroke-width="1.5" fill="none" opacity="0.5"/>
      </g>
    </svg>
    
    <!-- ⬇️ CUSTOMIZE THIS: Your award title (keep it short!) -->
    <div class="award-emblem-title">Best Innovation</div>
  </div>
  
  <!-- ⬇️ CUSTOMIZE THIS: Award description -->
  <p class="award-description">
    This project received the Best Innovation Award at IndieGameCon 2026.
  </p>
  
  <!-- ⬇️ CUSTOMIZE THIS: Certificate image path -->
  <button class="btn-certificate" 
          data-certificate="../assets/images/certificates/my-award-certificate.jpg"
          data-certificate-alt="Best Innovation Award Certificate"
          aria-label="View Best Innovation Award Certificate">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
    View Certificate
  </button>
</article>
```

### 3. Customize These Three Lines

1. **Award Title** (Line 36):
   ```html
   <div class="award-emblem-title">Best Innovation</div>
   ```

2. **Description** (Line 40):
   ```html
   <p class="award-description">
     This project received the Best Innovation Award at IndieGameCon 2026.
   </p>
   ```

3. **Certificate Path** (Line 45-47):
   ```html
   data-certificate="../assets/images/certificates/my-award-certificate.jpg"
   data-certificate-alt="Best Innovation Award Certificate"
   aria-label="View Best Innovation Award Certificate"
   ```

### 4. Done! 🎉

The award will automatically:
- ✅ Display with laurel wreath emblem
- ✅ Show description below
- ✅ Open certificate in modal when button is clicked
- ✅ Work on all devices (responsive)
- ✅ Support keyboard navigation

### Common Award Title Examples
Keep titles short (2-4 words max) for best appearance:

- "Best Design"
- "Best Innovation"
- "People's Choice"
- "Gold Award"
- "Excellence"
- "Grand Prize"
- "First Place"
- "Best Narrative"
- "Best Audio"
- "Technical Achievement"

### Folder Structure
```
assets/
  images/
    certificates/          ← Create this folder if needed
      whiteout-award.jpg
      another-award.jpg
      my-certificate.png
```
