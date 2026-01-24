/**
 * Work Gallery - Modular, data-driven gallery component
 * 
 * Features:
 * - Three distinct view layouts: Timeline, Category, Alphabetical
 * - Flip card display with 3D animation
 * - Smooth transitions between views
 * - Data-driven architecture for easy updates
 * - Direct linking to project detail pages
 * 
 * To add a new project, simply add a new object to the galleryData array.
 * Categories should match those used in the project detail pages for consistency.
 */

// ============================================
// CATEGORY DEFINITIONS
// Categories are defined once here and used across the gallery
// Keep these in sync with the categories in project detail pages
// ============================================
const CATEGORIES = {
  GAME_DEVELOPMENT: 'Game Development',
  GAME_AUDIO: 'Game Audio',
  DEVELOPMENT_TOOL: 'Development Tool',
  AUDIO_TOOL: 'Audio Tool',
  AUDIO_PRODUCTION: 'Audio Production',
  THEATER: 'Theater'
};

// ============================================
// GALLERY DATA - Add new projects here
// Each project links to its corresponding detail page
// Thumbnail paths can be empty strings to show placeholder
// ============================================
const galleryData = [
  {
    id: 1,
    title: "Dough it Yourself",
    category: CATEGORIES.GAME_DEVELOPMENT,
    year: 2025,
    date: "2025-08-01",
    thumbnail: "../assets/images/thumbnails/thumbnails (7).png", // Placeholder - add actual thumbnail path when available
    description: "A donut making puzzle game made for GMTK 2025.",
    techStack: ["Unity", "C#", "Git"],
    projectPage: "../project-pages/dough-it-yourself.html",
    roles: ["Level Design", "Game Programming", "Game Prototyping", "Audio Implementation", "Sound Design"]
  },
  {
    id: 2,
    title: "Forest Fears",
    category: CATEGORIES.GAME_DEVELOPMENT,
    year: 2025,
    date: "2025-03-15",
    thumbnail: "../assets/images/thumbnails/thumbnails (11).png",
    description: "An educational game that aims to help players gain awareness of nature and its connection with humans.",
    techStack: ["Unity", "C#", "Wwise", "Logic Pro", "Git"],
    projectPage: "../project-pages/forest-fears.html",
    roles: ["Level Design", "Game Programming", "Narrative Design", "Audio Implementation", "Composing"]
  },
  {
    id: 3,
    title: "Mantle",
    category: CATEGORIES.GAME_AUDIO,
    year: 2025,
    date: "2025-05-20",
    thumbnail: "../assets/images/thumbnails/thumbnails (14).png",
    description: "A game that focuses on narrative, seeking ways to guide players into believing different design ideas.",
    techStack: ["Unity", "Logic Pro", "Recording", "Perforce", "Sound Design"],
    projectPage: "../project-pages/mantle.html",
    roles: ["Sound Design"]
  },
  {
    id: 4,
    title: "CrossfadER",
    category: CATEGORIES.AUDIO_TOOL,
    year: 2025,
    date: "2025-10-10",
    thumbnail: "../assets/images/thumbnails/thumbnails (21).png",
    description: "An audio tool automating the looping sound production workflow.",
    techStack: ["DSP", "C#", "Avalonia", "Git"],
    projectPage: "../project-pages/crossfadER.html",
    roles: ["Audio Programming"]
  },
  {
    id: 5,
    title: "SpongeBob Musical",
    category: CATEGORIES.THEATER,
    year: 2024,
    date: "2024-04-15",
    thumbnail: "../assets/images/thumbnails/thumbnails (9).jpg",
    description: "Juvenile version of the Broadway musical: SpongeBob",
    techStack: ["Logic Pro", "Mainstage", "Theater Sound", "Live Mixing", "Sound Reinforcement", "Microphone Setup"],
    projectPage: "../project-pages/spongebob-musical.html",
    roles: ["Head of Crew", "Sound Designer"]
  },
  {
    id: 6,
    title: "SpongeBob Soundtrack",
    category: CATEGORIES.AUDIO_PRODUCTION,
    year: 2024,
    date: "2024-06-20",
    thumbnail: "../assets/images/thumbnails/thumbnails (8).jpg",
    description: "Post-show soundtrack production.",
    techStack: ["Studio One", "Recording", "Micing", "Mixing"],
    projectPage: "../project-pages/spongebob-soundtrack.html",
    roles: ["Recording Engineer", "Audio Editing", "Mixing"]
  },
  {
    id: 7,
    title: "Theme for Carnival",
    category: CATEGORIES.AUDIO_PRODUCTION,
    year: 2023,
    date: "2023-12-31",
    thumbnail: "../assets/images/thumbnails/thumbnails (19).png",
    description: "Instrumental music piece produced for an annual carnival.",
    techStack: ["Studio One", "Recording", "Micing", "Mixing"],
    projectPage: "../project-pages/theme-for-carnival.html",
    roles: ["Recording Engineer", "Audio Editing", "Mixing"]
  },
  {
    id: 8,
    title: "Blender-Unity Communicator",
    category: CATEGORIES.DEVELOPMENT_TOOL,
    year: 2025,
    date: "2025-11-05",
    thumbnail: "../assets/images/thumbnails/thumbnails (3).png",
    description: "A tool to streamline the workflow of transferring 3D models from Blender to Unity.",
    techStack: ["Python", "C#", "Blender API", "Unity", "Git"],
    projectPage: "../project-pages/blender-unity-communicator.html",
    roles: ["Developer"]
  }
];

// ============================================
// ICON LIBRARY
// ============================================
const iconLibrary = {
  external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  folder: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
  category: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`
};

// ============================================
// ALPHABETICAL RANGES
// ============================================
const alphaRanges = [
  { label: 'A–D', letters: ['A', 'B', 'C', 'D'], id: 'a-d' },
  { label: 'E–H', letters: ['E', 'F', 'G', 'H'], id: 'e-h' },
  { label: 'I–L', letters: ['I', 'J', 'K', 'L'], id: 'i-l' },
  { label: 'M–P', letters: ['M', 'N', 'O', 'P'], id: 'm-p' },
  { label: 'Q–T', letters: ['Q', 'R', 'S', 'T'], id: 'q-t' },
  { label: 'U–Z', letters: ['U', 'V', 'W', 'X', 'Y', 'Z'], id: 'u-z' }
];

// ============================================
// GALLERY CLASS
// ============================================
class WorkGallery {
  constructor(containerSelector, data) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.data = [...data];
    this.currentSort = 'category';
    this.sortedData = [...this.data];

    this.init();
  }

  init() {
    this.sortData('category');
    this.render();
    this.bindEvents();
  }

  // Get icon SVG by type
  getIcon(type) {
    return iconLibrary[type] || iconLibrary.external;
  }

  // Sort data based on criteria
  sortData(criteria) {
    switch (criteria) {
      case 'date':
        this.sortedData = [...this.data].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        break;
      case 'category':
        this.sortedData = [...this.data].sort((a, b) => 
          a.category.localeCompare(b.category)
        );
        break;
      case 'alpha':
        this.sortedData = [...this.data].sort((a, b) => 
          a.title.localeCompare(b.title)
        );
        break;
      default:
        this.sortedData = [...this.data];
    }
    this.currentSort = criteria;
  }

  // Format date for display
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  // Generate card HTML (shared across all views)
  // Cards link to their project detail pages
  generateCardHTML(item, index) {
    const techTags = item.techStack
      .slice(0, 4) // Show max 4 tech tags on card
      .map(tech => `<span class="tech-tag">${tech}</span>`)
      .join('');
    
    // If there are more tech tags, add a "+N more" indicator
    const moreTech = item.techStack.length > 4 
      ? `<span class="tech-tag tech-tag--more">+${item.techStack.length - 4}</span>` 
      : '';

    // Generate role tags for the back
    const roleTags = item.roles
      ? item.roles.slice(0, 3).map(role => `<span class="role-tag">${role}</span>`).join('')
      : '';

    // Check if thumbnail exists or use placeholder
    const thumbnailStyle = item.thumbnail 
      ? `background-image: url('${item.thumbnail}')`
      : '';

    return `
      <article class="gallery-card" data-id="${item.id}" data-project-url="${item.projectPage}" style="--card-index: ${index}">
        <a href="${item.projectPage}" class="gallery-card-link" aria-label="View ${item.title} project details">
          <div class="gallery-card-inner">
            <!-- Front Side -->
            <div class="gallery-card-front">
              <div class="card-thumbnail" style="${thumbnailStyle}">
                <div class="card-thumbnail-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              </div>
              <div class="card-front-content">
                <h3>${item.title}</h3>
                <span class="card-category-badge">${item.category}</span>
              </div>
            </div>
            <!-- Back Side -->
            <div class="gallery-card-back">
              <h3>${item.title}</h3>
              <p class="card-back-description">${item.description}</p>
              <div class="card-back-meta">
                <div class="meta-item">
                  ${this.getIcon('folder')}
                  <span>${item.category}</span>
                </div>
                <div class="meta-item">
                  ${this.getIcon('calendar')}
                  <span>${item.year}</span>
                </div>
              </div>
              ${roleTags ? `<div class="card-back-roles">${roleTags}</div>` : ''}
              <div class="card-back-tech">
                ${techTags}${moreTech}
              </div>
              <div class="card-back-links">
                <span class="card-link card-link--view">
                  ${this.getIcon('external')}
                  <span>View Project</span>
                </span>
              </div>
            </div>
          </div>
        </a>
      </article>
    `;
  }

  // ============================================
  // TIMELINE VIEW RENDERER
  // ============================================
  renderTimelineView() {
    // Group items by year
    const byYear = {};
    this.sortedData.forEach(item => {
      if (!byYear[item.year]) byYear[item.year] = [];
      byYear[item.year].push(item);
    });

    // Sort years descending
    const years = Object.keys(byYear).sort((a, b) => b - a);
    
    let html = '';
    let itemIndex = 0;

    years.forEach((year, yearIdx) => {
      // Sort items within year by date descending
      const yearItems = byYear[year].sort((a, b) => new Date(b.date) - new Date(a.date));
      
      html += `
        <div class="timeline-year-section" style="--section-index: ${yearIdx}">
          <div class="timeline-year-marker" style="animation-delay: ${yearIdx * 0.15}s">
            <span class="year-badge">${year}</span>
          </div>
          <div class="timeline-cards-grid">
            ${yearItems.map((item, idx) => {
              const cardHTML = `
                <div class="timeline-card-wrapper" style="--card-index: ${itemIndex}">
                  <span class="timeline-date">${this.formatDate(item.date)}</span>
                  ${this.generateCardHTML(item, itemIndex)}
                </div>
              `;
              itemIndex++;
              return cardHTML;
            }).join('')}
          </div>
        </div>
      `;
    });

    this.container.className = 'gallery-grid view-timeline';
    this.container.innerHTML = html;
  }

  // ============================================
  // CATEGORY VIEW RENDERER
  // ============================================
  renderCategoryView() {
    // Group items by category
    const byCategory = {};
    this.sortedData.forEach(item => {
      if (!byCategory[item.category]) byCategory[item.category] = [];
      byCategory[item.category].push(item);
    });

    // Preferred ordering: Game Development and Game Audio first
    const preferredOrder = [
      CATEGORIES.GAME_DEVELOPMENT,
      CATEGORIES.GAME_AUDIO
    ];

    // Get categories and sort with preference first, then alphabetically
    const categories = Object.keys(byCategory).sort((a, b) => {
      const ia = preferredOrder.indexOf(a);
      const ib = preferredOrder.indexOf(b);
      // If either is in preferred list, use that ordering
      if (ia !== -1 || ib !== -1) {
        if (ia === -1) return 1;      // b is preferred, a comes after
        if (ib === -1) return -1;     // a is preferred, comes before
        return ia - ib;               // both preferred -> keep preferred order
      }
      // Neither preferred -> alphabetical
      return a.localeCompare(b);
    });
    
    let html = '';
    let globalIndex = 0;

    categories.forEach((category, sectionIdx) => {
      const items = byCategory[category];
      
      html += `
        <div class="category-section" style="--section-index: ${sectionIdx}">
          <div class="category-header">
            <div class="category-icon">
              ${this.getIcon('category')}
            </div>
            <h3 class="category-title">${category}</h3>
            <span class="category-count">${items.length} project${items.length !== 1 ? 's' : ''}</span>
          </div>
          <div class="category-cards">
            ${items.map((item, idx) => {
              const cardHTML = this.generateCardHTML(item, globalIndex);
              globalIndex++;
              return cardHTML;
            }).join('')}
          </div>
        </div>
      `;
    });

    this.container.className = 'gallery-grid view-category';
    this.container.innerHTML = html;
  }

  // ============================================
  // ALPHABETICAL VIEW RENDERER
  // ============================================
  renderAlphaView() {
    // Group items by letter range
    const byRange = {};
    alphaRanges.forEach(range => {
      byRange[range.id] = {
        label: range.label,
        letters: range.letters,
        items: []
      };
    });

    this.sortedData.forEach(item => {
      const firstLetter = item.title.charAt(0).toUpperCase();
      for (const range of alphaRanges) {
        if (range.letters.includes(firstLetter)) {
          byRange[range.id].items.push(item);
          break;
        }
      }
    });

    // Build jump navigation
    let jumpNavHTML = '<nav class="alpha-jump-nav" aria-label="Alphabetical navigation">';
    alphaRanges.forEach(range => {
      const hasItems = byRange[range.id].items.length > 0;
      jumpNavHTML += `
        <a href="#alpha-${range.id}" 
           class="alpha-jump-link${hasItems ? '' : ' disabled'}"
           ${hasItems ? '' : 'aria-disabled="true"'}>
          ${range.label}
        </a>
      `;
    });
    jumpNavHTML += '</nav>';

    // Build sections
    let sectionsHTML = '';
    let globalIndex = 0;
    let sectionIdx = 0;

    alphaRanges.forEach(range => {
      const rangeData = byRange[range.id];
      if (rangeData.items.length === 0) return;

      sectionsHTML += `
        <div class="alpha-section" id="alpha-${range.id}" style="--section-index: ${sectionIdx}">
          <div class="alpha-header">
            <span class="alpha-letter">${range.label}</span>
            <div class="alpha-divider"></div>
          </div>
          <div class="alpha-cards">
            ${rangeData.items.map((item, idx) => {
              const cardHTML = this.generateCardHTML(item, globalIndex);
              globalIndex++;
              return cardHTML;
            }).join('')}
          </div>
        </div>
      `;
      sectionIdx++;
    });

    this.container.className = 'gallery-grid view-alpha';
    this.container.innerHTML = jumpNavHTML + sectionsHTML;

    // Bind smooth scroll for jump navigation
    this.bindAlphaJumpNav();
  }

  // Bind smooth scroll for alphabetical jump navigation
  bindAlphaJumpNav() {
    const links = this.container.querySelectorAll('.alpha-jump-link:not(.disabled)');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ============================================
  // MAIN RENDER METHOD
  // ============================================
  render() {
    if (this.sortedData.length === 0) {
      this.container.className = 'gallery-grid view-grid';
      this.container.innerHTML = `
        <div class="gallery-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <h3>No projects found</h3>
          <p>Check back later for new work!</p>
        </div>
      `;
      return;
    }

    // Render based on current sort/view mode
    switch (this.currentSort) {
      case 'date':
        this.renderTimelineView();
        break;
      case 'category':
        this.renderCategoryView();
        break;
      case 'alpha':
        this.renderAlphaView();
        break;
      default:
        this.renderTimelineView();
    }
  }

  // Handle sort button clicks with animation
  async handleSort(criteria) {
    if (criteria === this.currentSort) return;

    // Add transitioning class for fade-out
    this.container.classList.add('transitioning');

    // Wait for fade-out
    await this.delay(300);

    // Sort and re-render
    this.sortData(criteria);
    this.render();

    // Force reflow
    void this.container.offsetWidth;

    // Remove transitioning class for fade-in
    this.container.classList.remove('transitioning');
  }

  // Utility: delay promise
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Bind event listeners
  bindEvents() {
    const sortButtons = document.querySelectorAll('.sort-btn');
    
    sortButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const sortType = btn.dataset.sort;
        
        // Update active state
        sortButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        // Handle sort
        this.handleSort(sortType);
      });
    });
  }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the gallery
  const gallery = new WorkGallery('#gallery-grid', galleryData);

  // Expose gallery instance for debugging (optional)
  window.workGallery = gallery;
});

// ============================================
// UTILITY: Add new project helper
// ============================================
/**
 * Helper function to add a new project to the gallery
 * Usage: addProject({ title: '...', category: '...', ... })
 * 
 * Required fields:
 * - id: unique identifier (number)
 * - title: project title (string)
 * - category: category name - use CATEGORIES constant for consistency
 * - year: year (number)
 * - date: ISO date string (e.g., '2025-01-15')
 * - thumbnail: path to thumbnail image (can be empty string for placeholder)
 * - description: project description
 * - techStack: array of technologies used
 * - projectPage: relative path to project detail page (e.g., '../project-pages/my-project.html')
 * 
 * Optional fields:
 * - roles: array of roles performed on the project
 * 
 * Example:
 * addProject({
 *   id: 8,
 *   title: 'New Project',
 *   category: CATEGORIES.GAME_AUDIO,
 *   year: 2025,
 *   date: '2025-06-01',
 *   thumbnail: '../assets/images/thumbnails/new-project-thumb.jpg',
 *   description: 'Description of the project...',
 *   techStack: ['Unity', 'FMOD'],
 *   projectPage: '../project-pages/new-project.html',
 *   roles: ['Sound Designer', 'Composer']
 * });
 */
function addProject(project) {
  // Validate required fields
  const required = ['id', 'title', 'category', 'year', 'date', 'description', 'techStack', 'projectPage'];
  const missing = required.filter(field => !project.hasOwnProperty(field));
  
  if (missing.length > 0) {
    console.error(`Missing required fields: ${missing.join(', ')}`);
    return false;
  }

  // Set default thumbnail to empty string if not provided
  if (!project.thumbnail) {
    project.thumbnail = '';
  }

  galleryData.push(project);
  
  // Re-initialize gallery if it exists
  if (window.workGallery) {
    window.workGallery.data = [...galleryData];
    window.workGallery.sortData(window.workGallery.currentSort);
    window.workGallery.render();
  }

  return true;
}

/**
 * Get all available categories
 * Useful for ensuring consistency between gallery and project pages
 */
function getCategories() {
  return { ...CATEGORIES };
}
