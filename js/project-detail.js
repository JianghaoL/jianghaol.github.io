/**
 * Project Detail Page - Scroll Animations & Interactions
 * 
 * Provides subtle scroll-reveal animations for content blocks
 * Uses Intersection Observer for performance
 */

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================
class ScrollReveal {
  constructor(options = {}) {
    this.options = {
      threshold: options.threshold || 0.15,
      rootMargin: options.rootMargin || '0px 0px -50px 0px',
      ...options
    };

    this.elements = document.querySelectorAll('[data-reveal]');
    
    if (this.elements.length > 0) {
      this.init();
    }
  }

  init() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.showAllElements();
      return;
    }

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        threshold: this.options.threshold,
        rootMargin: this.options.rootMargin
      }
    );

    this.elements.forEach(el => {
      this.observer.observe(el);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add staggered delay for multiple elements appearing together
        const delay = entry.target.dataset.revealDelay || 0;
        
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        // Stop observing once revealed
        this.observer.unobserve(entry.target);
      }
    });
  }

  showAllElements() {
    this.elements.forEach(el => {
      el.classList.add('visible');
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// ============================================
// IMAGE LAZY LOADING ENHANCEMENT
// ============================================
class LazyImageLoader {
  constructor() {
    this.images = document.querySelectorAll('img[loading="lazy"]');
    
    if (this.images.length > 0) {
      this.init();
    }
  }

  init() {
    this.images.forEach(img => {
      // Add loading class
      img.classList.add('lazy-loading');
      
      // Handle load event
      img.addEventListener('load', () => {
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-loaded');
      });

      // Handle error
      img.addEventListener('error', () => {
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-error');
      });
    });
  }
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
class SmoothScrollLinks {
  constructor() {
    this.links = document.querySelectorAll('a[href^="#"]');
    
    if (this.links.length > 0) {
      this.init();
    }
  }

  init() {
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// ============================================
// PARALLAX EFFECT FOR HERO (Optional)
// ============================================
class HeroParallax {
  constructor(selector = '.project-hero') {
    this.hero = document.querySelector(selector);
    
    if (this.hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.init();
    }
  }

  init() {
    this.heroContent = this.hero.querySelector('.project-hero-content');
    
    if (this.heroContent) {
      window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    }
  }

  handleScroll() {
    const scrolled = window.pageYOffset;
    const heroHeight = this.hero.offsetHeight;
    
    // Only apply effect while hero is in view
    if (scrolled < heroHeight) {
      const opacity = 1 - (scrolled / heroHeight) * 0.5;
      const translateY = scrolled * 0.3;
      
      this.heroContent.style.opacity = Math.max(opacity, 0.5);
      this.heroContent.style.transform = `translateY(${translateY}px)`;
    }
  }

  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}

// ============================================
// IMAGE LIGHTBOX (Optional Enhancement)
// ============================================
class ImageLightbox {
  constructor() {
    this.images = document.querySelectorAll('.grid-image-item img, .full-image, .media-text-image img');
    
    if (this.images.length > 0) {
      this.init();
    }
  }

  init() {
    // Create lightbox overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'lightbox-overlay';
    this.overlay.innerHTML = `
      <button class="lightbox-close" aria-label="Close lightbox">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <img class="lightbox-image" src="" alt="">
    `;
    document.body.appendChild(this.overlay);

    // Cache lightbox elements
    this.lightboxImage = this.overlay.querySelector('.lightbox-image');
    this.closeBtn = this.overlay.querySelector('.lightbox-close');

    // Add click listeners to images
    this.images.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => this.open(img));
    });

    // Close handlers
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  open(img) {
    this.lightboxImage.src = img.src;
    this.lightboxImage.alt = img.alt;
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ============================================
// PROGRESS INDICATOR
// ============================================
class ReadingProgress {
  constructor() {
    this.content = document.querySelector('.project-content');
    
    if (this.content) {
      this.init();
    }
  }

  init() {
    // Create progress bar
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'reading-progress';
    this.progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
    document.body.appendChild(this.progressBar);

    this.bar = this.progressBar.querySelector('.reading-progress-bar');

    window.addEventListener('scroll', this.updateProgress.bind(this), { passive: true });
  }

  updateProgress() {
    const contentTop = this.content.offsetTop;
    const contentHeight = this.content.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrolled = window.pageYOffset;

    // Calculate progress based on content position
    const startPoint = contentTop - windowHeight;
    const endPoint = contentTop + contentHeight - windowHeight;
    const progress = Math.max(0, Math.min(1, (scrolled - startPoint) / (endPoint - startPoint)));

    this.bar.style.width = `${progress * 100}%`;
  }
}

// ============================================
// ADD LIGHTBOX STYLES
// ============================================
function addLightboxStyles() {
  const styles = document.createElement('style');
  styles.textContent = `
    /* Lightbox Overlay */
    .lightbox-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    
    .lightbox-overlay.active {
      opacity: 1;
      visibility: visible;
    }
    
    .lightbox-close {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: background 0.3s ease;
    }
    
    .lightbox-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .lightbox-close svg {
      width: 24px;
      height: 24px;
      stroke: white;
    }
    
    .lightbox-image {
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      border-radius: var(--radius-md);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    
    /* Reading Progress */
    .reading-progress {
      position: fixed;
      top: 80px;
      left: 0;
      width: 100%;
      height: 3px;
      background: rgba(255, 255, 255, 0.1);
      z-index: 9998;
    }
    
    .reading-progress-bar {
      height: 100%;
      width: 0;
      background: var(--accent);
      transition: width 0.1s ease-out;
    }
    
    /* Mobile - attach progress bar to header */
    @media (max-width: 768px) {
      .reading-progress {
        top: 56px;
      }
    }
    
    @media (max-width: 480px) {
      .reading-progress {
        top: 48px;
      }
    }
    
    /* Lazy Loading States */
    .lazy-loading {
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    
    .lazy-loaded {
      opacity: 1;
    }
    
    .lazy-error {
      background: var(--card-bg);
    }
  `;
  document.head.appendChild(styles);
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Add lightbox styles
  addLightboxStyles();

  // Initialize components
  const scrollReveal = new ScrollReveal();
  const lazyLoader = new LazyImageLoader();
  const smoothScroll = new SmoothScrollLinks();
  const heroParallax = new HeroParallax();
  const lightbox = new ImageLightbox();
  const readingProgress = new ReadingProgress();

  // Make components accessible for debugging
  window.projectDetailComponents = {
    scrollReveal,
    lazyLoader,
    smoothScroll,
    heroParallax,
    lightbox,
    readingProgress
  };
});
