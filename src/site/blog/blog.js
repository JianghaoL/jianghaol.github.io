/**
 * Blog Page - Data-driven blog showcase
 * 
 * Features:
 * - Category-based organization
 * - Table of contents with smooth scroll
 * - Flip card display with hover animation
 * - Modular, easy-to-extend architecture
 * 
 * To add a new blog post, simply add a new object to the blogData array.
 * Categories are automatically detected and organized.
 */

// ============================================
// BLOG DATA - Add new posts here
// Each post can link to a detail page (placeholder for now)
// ============================================
const blogData = [
  {
    id: 1,
    title: "Building a Real-Time Audio Crossfade Tool",
    category: "Audio Programming",
    date: "2026-01-15",
    excerpt: "Exploring DSP fundamentals and C# to create an automated audio looping workflow tool.",
    fullExcerpt: "Deep dive into digital signal processing, implementing crossfade algorithms, and building a user-friendly audio tool with Avalonia UI. Learn how to handle real-time audio processing and create seamless loops programmatically.",
    image: "", // Optional: path to featured image
    tags: ["DSP", "C#", "Audio Tools"],
    detailPage: "#" // Placeholder link
  },
  {
    id: 2,
    title: "Unity Performance Optimization: Memory Management",
    category: "Game Development",
    date: "2026-01-08",
    excerpt: "Best practices for managing memory in Unity to keep your games running smoothly across platforms.",
    fullExcerpt: "Comprehensive guide to Unity's memory management system, including object pooling, garbage collection optimization, and profiling techniques. Includes practical examples and benchmarks from real projects.",
    image: "",
    tags: ["Unity", "Performance", "C#"],
    detailPage: "#"
  },
  {
    id: 3,
    title: "Procedural Audio in Games: A Practical Guide",
    category: "Game Audio",
    date: "2025-12-20",
    excerpt: "How to generate dynamic soundscapes that respond to gameplay in real-time.",
    fullExcerpt: "Learn the principles of procedural audio design and implementation in game engines. Covers synthesis techniques, parameter mapping, and middleware integration with practical examples from shipped titles.",
    image: "",
    tags: ["Audio", "Procedural Generation", "Wwise"],
    detailPage: "#"
  },
  {
    id: 4,
    title: "Designing Puzzle Mechanics That Feel Fair",
    category: "Game Design",
    date: "2025-12-10",
    excerpt: "Lessons learned from prototyping puzzle games: balancing challenge and player satisfaction.",
    fullExcerpt: "A retrospective on puzzle design from multiple game jam projects. Discusses playtesting feedback, iterative design, and creating 'aha!' moments that feel earned rather than frustrating.",
    image: "",
    tags: ["Game Design", "Puzzles", "UX"],
    detailPage: "#"
  },
  {
    id: 5,
    title: "Blender to Unity: Automating the Asset Pipeline",
    category: "Technical Art",
    date: "2025-11-28",
    excerpt: "Building a Python-based tool to streamline 3D model transfers between Blender and Unity.",
    fullExcerpt: "Technical breakdown of creating a custom pipeline tool using Python and the Blender API. Covers batch processing, material conversion, and Unity Editor integration for seamless asset workflows.",
    image: "",
    tags: ["Python", "Blender", "Unity"],
    detailPage: "#"
  },
  {
    id: 6,
    title: "Spatial Audio for VR: Implementation Tips",
    category: "Game Audio",
    date: "2025-11-15",
    excerpt: "Creating immersive 3D soundscapes for virtual reality experiences.",
    fullExcerpt: "Practical guide to implementing spatial audio in VR projects. Covers HRTF, ambisonic workflows, and performance considerations for real-time 3D audio in Unity and Unreal Engine.",
    image: "",
    tags: ["VR", "Spatial Audio", "Unity"],
    detailPage: "#"
  },
  {
    id: 7,
    title: "Git Workflows for Solo Game Developers",
    category: "Workflow & Tools",
    date: "2025-10-30",
    excerpt: "How to use version control effectively even when working alone.",
    fullExcerpt: "A practical guide to Git for individual developers. Covers branching strategies, commit best practices, and using Git LFS for game assets. Includes real examples from personal projects.",
    image: "",
    tags: ["Git", "Workflow", "Best Practices"],
    detailPage: "#"
  },
  {
    id: 8,
    title: "Shader Basics for Game Programmers",
    category: "Technical Art",
    date: "2025-10-18",
    excerpt: "Demystifying HLSL/GLSL with practical examples for gameplay effects.",
    fullExcerpt: "Beginner-friendly introduction to shader programming for game developers. Start with vertex and fragment shaders, then build up to more complex effects like dissolve transitions and stylized rendering.",
    image: "",
    tags: ["Shaders", "HLSL", "Graphics Programming"],
    detailPage: "#"
  },
  {
    id: 9,
    title: "Interactive Music Systems in Games",
    category: "Game Audio",
    date: "2025-09-25",
    excerpt: "Implementing adaptive music that responds to player actions and game state.",
    fullExcerpt: "Explore different approaches to interactive music systems, from simple layer mixing to complex state-based transitions. Includes case studies and implementation patterns using FMOD and Wwise.",
    image: "",
    tags: ["Music", "FMOD", "Audio Implementation"],
    detailPage: "#"
  },
  {
    id: 10,
    title: "Prototyping Tools: My Setup for Game Jams",
    category: "Workflow & Tools",
    date: "2025-09-10",
    excerpt: "The software, plugins, and shortcuts that help me ship games in 48 hours.",
    fullExcerpt: "A comprehensive overview of my game jam workflow and tool stack. Covers Unity packages, asset libraries, audio tools, and organizational strategies that maximize productivity under tight deadlines.",
    image: "",
    tags: ["Game Jams", "Unity", "Productivity"],
    detailPage: "#"
  },
  {
    id: 11,
    title: "State Machines vs Behavior Trees in Unity",
    category: "Game Development",
    date: "2025-08-28",
    excerpt: "Comparing two popular AI architectures and when to use each.",
    fullExcerpt: "In-depth comparison of finite state machines and behavior trees for game AI. Discusses implementation complexity, scalability, and provides code examples for both approaches in Unity.",
    image: "",
    tags: ["AI", "Unity", "Architecture"],
    detailPage: "#"
  },
  {
    id: 12,
    title: "My Favorite VSCode Extensions for Game Dev",
    category: "Workflow & Tools",
    date: "2025-08-15",
    excerpt: "Essential IDE tools that improve my C# and Unity development workflow.",
    fullExcerpt: "Curated list of Visual Studio Code extensions for game development. Covers C# tools, Unity integrations, Git helpers, and productivity boosters with setup guides and usage tips.",
    image: "",
    tags: ["VSCode", "Tools", "C#"],
    detailPage: "#"
  },
  {
    id: 13,
    title: "Level Design Patterns from Classic Puzzlers",
    category: "Game Design",
    date: "2025-07-20",
    excerpt: "Analyzing what makes Portal, The Witness, and Baba Is You work so well.",
    fullExcerpt: "Deep dive into level design principles from acclaimed puzzle games. Examines teaching mechanics, difficulty curves, and the art of guiding players without explicit tutorials.",
    image: "",
    tags: ["Level Design", "Game Design", "Analysis"],
    detailPage: "#"
  }
];

// ============================================
// ICON LIBRARY
// ============================================
const iconLibrary = {
  folder: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  tag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`
};

// ============================================
// BLOG CLASS
// ============================================
class BlogShowcase {
  constructor(containerSelector, tocSelector, data) {
    this.container = document.querySelector(containerSelector);
    this.tocContainer = document.querySelector(tocSelector);
    if (!this.container || !this.tocContainer) return;

    this.data = [...data];
    this.categories = this.extractCategories();

    this.init();
  }

  init() {
    this.sortDataByCategory();
    this.renderTOC();
    this.renderBlog();
    this.bindEvents();
  }

  // Extract unique categories from data
  extractCategories() {
    const categoryMap = {};
    this.data.forEach(post => {
      if (!categoryMap[post.category]) {
        categoryMap[post.category] = [];
      }
      categoryMap[post.category].push(post);
    });
    return categoryMap;
  }

  // Sort data by category
  sortDataByCategory() {
    this.data.sort((a, b) => {
      // First sort by category, then by date (newest first within category)
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return new Date(b.date) - new Date(a.date);
    });
  }

  // Get icon SVG by type
  getIcon(type) {
    return iconLibrary[type] || iconLibrary.folder;
  }

  // Format date for display
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  // Generate category ID for anchoring
  getCategoryId(categoryName) {
    return categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  // Generate blog card HTML
  generateCardHTML(post, index) {
    const categoryTags = post.tags
      ? post.tags.map(tag => `<span class="category-tag">${tag}</span>`).join('')
      : '';

    // Check if image exists or use placeholder
    const imageStyle = post.image 
      ? `background-image: url('${post.image}')`
      : '';

    return `
      <article class="blog-card" data-id="${post.id}" style="--card-index: ${index}">
        <a href="${post.detailPage}" class="blog-card-link" aria-label="Read ${post.title}">
          <div class="blog-card-inner">
            <!-- Front Side -->
            <div class="blog-card-front">
              <div class="card-image" style="${imageStyle}">
                <div class="card-image-placeholder">
                  ${this.getIcon('book')}
                </div>
              </div>
              <div class="card-front-content">
                <h3>${post.title}</h3>
                <p class="card-excerpt">${post.excerpt}</p>
                <div class="card-category-tags">
                  ${categoryTags}
                </div>
              </div>
            </div>
            
            <!-- Back Side -->
            <div class="blog-card-back">
              <h3>${post.title}</h3>
              <p class="card-back-full-excerpt">${post.fullExcerpt}</p>
              <div class="card-back-meta">
                <div class="meta-item">
                  ${this.getIcon('calendar')}
                  <span class="meta-date">${this.formatDate(post.date)}</span>
                </div>
                <div class="meta-item">
                  ${this.getIcon('folder')}
                  <span>${post.category}</span>
                </div>
              </div>
              <div class="card-back-cta">
                <span>Read Full Post</span>
                ${this.getIcon('arrow')}
              </div>
            </div>
          </div>
        </a>
      </article>
    `;
  }

  // Render Table of Contents
  renderTOC() {
    const tocHTML = Object.keys(this.categories)
      .sort()
      .map(category => {
        const count = this.categories[category].length;
        const categoryId = this.getCategoryId(category);
        return `
          <a href="#${categoryId}" class="toc-link" data-category="${categoryId}">
            <span>${category}</span>
            <span class="toc-count">${count}</span>
          </a>
        `;
      })
      .join('');

    this.tocContainer.innerHTML = tocHTML;
  }

  // Render blog by categories
  renderBlog() {
    const categoriesHTML = Object.keys(this.categories)
      .sort()
      .map(category => {
        const posts = this.categories[category];
        const categoryId = this.getCategoryId(category);
        const cardsHTML = posts
          .map((post, index) => this.generateCardHTML(post, index))
          .join('');

        return `
          <section class="category-section" id="${categoryId}">
            <div class="category-header">
              <div class="category-icon">
                ${this.getIcon('folder')}
              </div>
              <h2 class="category-title">${category}</h2>
              <span class="category-count">${posts.length} ${posts.length === 1 ? 'post' : 'posts'}</span>
            </div>
            <div class="category-cards">
              ${cardsHTML}
            </div>
          </section>
        `;
      })
      .join('');

    this.container.innerHTML = categoriesHTML;
  }

  // Bind event listeners
  bindEvents() {
    // Smooth scroll for TOC links
    const tocLinks = this.tocContainer.querySelectorAll('.toc-link');
    tocLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          // Remove active class from all links
          tocLinks.forEach(l => l.classList.remove('active'));
          // Add active class to clicked link
          link.classList.add('active');
          
          // Smooth scroll to section
          targetSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      });
    });

    // Optional: Highlight active TOC link based on scroll position
    this.setupScrollSpy(tocLinks);
  }

  // Setup scroll spy to highlight active section in TOC
  setupScrollSpy(tocLinks) {
    const sections = this.container.querySelectorAll('.category-section');
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          
          // Update TOC active state
          tocLinks.forEach(link => {
            const linkCategory = link.getAttribute('data-category');
            if (linkCategory === sectionId) {
              tocLinks.forEach(l => l.classList.remove('active'));
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  new BlogShowcase('#blog-grid', '#toc-links', blogData);
});
