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
// The current locale is inferred from the URL so the shared listing script
// renders the matching card copy and detail-page link.
// ============================================
const isChineseBlog = window.location.pathname.startsWith('/zh/');

const blogCopy = isChineseBlog
  ? {
      readLabel: '阅读文章',
      postSingular: '篇文章',
      postPlural: '篇文章',
      locale: 'zh-CN'
    }
  : {
      readLabel: 'Read Full Post',
      postSingular: 'post',
      postPlural: 'posts',
      locale: 'en-US'
    };

const blogData = [isChineseBlog
  ? {
      id: 1,
      title: 'C++ 中的可变延迟',
      category: '音频编程',
      date: '2026-10-11',
      excerpt: '从采样精确的固定延迟出发，逐步实现支持分数采样、平滑变化与多普勒效应的可变延迟线。',
      fullExcerpt: '结合 Dreamcatchers 中的“拉线电话”实践，拆解环形缓冲区、线性插值和逐采样平滑，并说明为什么一条可变延迟线会自然产生多普勒效应。',
      image: '/assets/images/project-pages/Jianghao Li - Dreamcatcher/telephone-delay.png',
      tags: ['C++', 'DSP', 'JUCE'],
      detailPage: '/zh/blog/variable-delay.html'
    }
  : {
      id: 1,
      title: 'Variable Delay in C++',
      category: 'Audio Programming',
      date: '2026-10-11',
      excerpt: 'From a sample-accurate fixed delay to fractional reads, smoothing, and the Doppler effect.',
      fullExcerpt: 'A practical walkthrough of ring buffers, linear interpolation, and per-sample smoothing—starting with the string telephone in Dreamcatchers and ending with a variable delay that produces Doppler shift naturally.',
      image: '/assets/images/project-pages/Jianghao Li - Dreamcatcher/telephone-delay.png',
      tags: ['C++', 'DSP', 'JUCE'],
      detailPage: '/en/blog/variable-delay.html'
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
    return date.toLocaleDateString(blogCopy.locale, {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  // Generate category ID for anchoring
  getCategoryId(categoryName) {
    return categoryName
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\p{Letter}\p{Number}-]/gu, '');
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
    const imagePlaceholder = post.image
      ? ''
      : `<div class="card-image-placeholder">${this.getIcon('book')}</div>`;

    return `
      <article class="blog-card" data-id="${post.id}" style="--card-index: ${index}">
          <a href="${post.detailPage}" class="blog-card-link" aria-label="${blogCopy.readLabel}: ${post.title}">
          <div class="blog-card-inner">
            <!-- Front Side -->
            <div class="blog-card-front">
              <div class="card-image" style="${imageStyle}">
                ${imagePlaceholder}
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
                <span>${blogCopy.readLabel}</span>
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
              <span class="category-count">${posts.length} ${posts.length === 1 ? blogCopy.postSingular : blogCopy.postPlural}</span>
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
