/**
 * Work Carousel - Modular flip card carousel component
 * 
 * To add a new project, simply add a new object to the workData array below.
 * The component will automatically render the new card.
 */

// ============================================
// PROJECT DATA - Add new projects here
// ============================================
const workData = [
  {
    id: 1,
    title: "Mantle",
    shortDesc: "A narrative-driven game experience",
    image: "assets/images/thumbnails/thumbnails (14).png",
    description: "A game that focuses on narrative, seeking ways to guide players into believing different design ideas.",
    techStack: ["Unity", "Logic Pro", "Recording", "Perforce", "Sound Design"],
    links: [
      { label: "View Project", url: "project-pages/mantle.html", icon: "external" }
    ]
  },
  {
    id: 2,
    title: "SpongeBob Musical",
    shortDesc: "Broadway musical sound design",
    image: "assets/images/thumbnails/thumbnails (9).jpg",
    description: "Juvenile version of the Broadway musical: SpongeBob. Led the sound crew for live theater production with comprehensive sound reinforcement and mixing.",
    techStack: ["Logic Pro", "Mainstage", "Theater Sound", "Live Mixing"],
    links: [
      { label: "View Project", url: "project-pages/spongebob-musical.html", icon: "external" }
    ]
  },
  {
    id: 3,
    title: "Dough it Yourself",
    shortDesc: "GMTK 2025 game jam puzzle game",
    image: "assets/images/thumbnails/thumbnails (7).png",
    description: "A donut making puzzle game made for GMTK 2025. Features creative level design and engaging gameplay mechanics.",
    techStack: ["Unity", "C#", "Git"],
    links: [
      { label: "View Project", url: "project-pages/dough-it-yourself.html", icon: "external" }
    ]
  }
];

// ============================================
// CAROUSEL CLASS - Pseudo-3D Effect
// ============================================
class WorkCarousel {
  constructor(containerSelector, data, options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.data = data;
    this.options = {
      autoPlayInterval: options.autoPlayInterval || 4000,
      autoPlay: options.autoPlay !== false,
      showProgress: options.showProgress !== false,
      ...options
    };

    this.currentIndex = 0;
    this.isHovering = false;
    this.autoPlayTimer = null;
    this.progressTimer = null;
    this.progressStartTime = null;
    this.slides = [];

    this.init();
  }

  init() {
    this.render();
    this.cacheElements();
    this.updateSlidePositions();
    this.bindEvents();
    if (this.options.autoPlay) {
      this.startAutoPlay();
    }
  }

  // Generate icon SVG based on type
  getIcon(type) {
    const icons = {
      external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
      github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
      play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`
    };
    return icons[type] || icons.external;
  }

  // Render the carousel HTML
  render() {
    const slidesHTML = this.data.map((item, index) => `
      <div class="carousel-slide" data-index="${index}">
        <div class="flip-card" data-card-id="${item.id}">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <div class="card-image" style="background-image: url('${item.image}')"></div>
              <div class="card-title">
                <h3>${item.title}</h3>
                <p>${item.shortDesc}</p>
              </div>
            </div>
            <div class="flip-card-back">
              <h3>${item.title}</h3>
              <p class="card-description">${item.description}</p>
              <div class="card-tech">
                <h4>Tech Stack</h4>
                <div class="tech-tags">
                  ${item.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
              </div>
              <div class="card-links">
                ${item.links.map(link => `
                  <a href="${link.url}" class="card-link" target="_blank" rel="noopener noreferrer">
                    ${this.getIcon(link.icon)}
                    ${link.label}
                  </a>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    const dotsHTML = this.data.map((_, index) => `
      <button class="carousel-dot${index === 0 ? ' active' : ''}" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>
    `).join('');

    this.container.innerHTML = `
      <div class="work-carousel">
        <div class="carousel-track">
          ${slidesHTML}
        </div>
        <div class="carousel-nav">
          <button class="carousel-btn carousel-prev" aria-label="Previous slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button class="carousel-btn carousel-next" aria-label="Next slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        <div class="carousel-dots">
          ${dotsHTML}
        </div>
        ${this.options.showProgress ? `
          <div class="carousel-progress">
            <div class="carousel-progress-bar"></div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Cache DOM elements after render
  cacheElements() {
    this.track = this.container.querySelector('.carousel-track');
    this.slides = Array.from(this.container.querySelectorAll('.carousel-slide'));
    this.dots = this.container.querySelectorAll('.carousel-dot');
    this.prevBtn = this.container.querySelector('.carousel-prev');
    this.nextBtn = this.container.querySelector('.carousel-next');
    this.progressBar = this.container.querySelector('.carousel-progress-bar');
    this.flipCards = this.container.querySelectorAll('.flip-card');
    this.carousel = this.container.querySelector('.work-carousel');
  }

  // Calculate position for each slide based on its relation to current index
  getSlidePosition(slideIndex) {
    const total = this.data.length;
    const diff = slideIndex - this.currentIndex;
    
    // Normalize difference to handle wrapping
    let normalizedDiff = diff;
    if (diff > total / 2) normalizedDiff = diff - total;
    if (diff < -total / 2) normalizedDiff = diff + total;

    if (normalizedDiff === 0) return 'center';
    if (normalizedDiff === -1) return 'left-1';
    if (normalizedDiff === -2) return 'left-2';
    if (normalizedDiff === 1) return 'right-1';
    if (normalizedDiff === 2) return 'right-2';
    return 'hidden';
  }

  // Update all slide positions
  updateSlidePositions() {
    this.slides.forEach((slide, index) => {
      const position = this.getSlidePosition(index);
      slide.setAttribute('data-position', position);
    });
  }

  // Bind all event listeners
  bindEvents() {
    // Navigation buttons
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());

    // Dot navigation
    this.dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index);
        this.goTo(index);
      });
    });

    // Pause on hover
    this.carousel.addEventListener('mouseenter', () => {
      this.isHovering = true;
      this.pauseAutoPlay();
    });

    this.carousel.addEventListener('mouseleave', () => {
      this.isHovering = false;
      if (this.options.autoPlay) {
        this.startAutoPlay();
      }
    });

    // Touch support for flip cards
    if ('ontouchstart' in window) {
      this.flipCards.forEach(card => {
        card.addEventListener('click', (e) => {
          // Don't flip if clicking a link
          if (e.target.closest('.card-link')) return;
          // Only flip if the card is in the center position
          const slide = card.closest('.carousel-slide');
          if (slide && slide.getAttribute('data-position') === 'center') {
            card.classList.toggle('flipped');
          }
        });
      });
    }

    // Click on side cards to navigate to them
    this.slides.forEach((slide, index) => {
      slide.addEventListener('click', (e) => {
        const position = slide.getAttribute('data-position');
        // Only navigate if clicking a non-center card and not clicking a link
        if (position !== 'center' && !e.target.closest('.card-link')) {
          this.goTo(index);
        }
      });
    });

    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    this.carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, { passive: true });
  }

  handleSwipe(startX, endX) {
    const threshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  // Navigation methods
  goTo(index) {
    if (index < 0) index = this.data.length - 1;
    if (index >= this.data.length) index = 0;

    this.currentIndex = index;
    
    // Update slide positions for 3D effect
    this.updateSlidePositions();

    // Update dots
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    // Reset progress
    if (this.options.autoPlay && !this.isHovering) {
      this.resetProgress();
    }
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  // Auto-play methods
  startAutoPlay() {
    this.pauseAutoPlay();
    this.progressStartTime = Date.now();
    
    this.autoPlayTimer = setTimeout(() => {
      this.next();
      if (!this.isHovering) {
        this.startAutoPlay();
      }
    }, this.options.autoPlayInterval);

    // Start progress animation
    if (this.progressBar) {
      this.animateProgress();
    }
  }

  pauseAutoPlay() {
    if (this.autoPlayTimer) {
      clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
    if (this.progressTimer) {
      cancelAnimationFrame(this.progressTimer);
      this.progressTimer = null;
    }
  }

  resetProgress() {
    if (this.progressBar) {
      this.progressBar.style.width = '0%';
    }
    this.progressStartTime = Date.now();
    this.animateProgress();
  }

  animateProgress() {
    if (!this.progressBar || this.isHovering) return;

    const elapsed = Date.now() - this.progressStartTime;
    const progress = Math.min((elapsed / this.options.autoPlayInterval) * 100, 100);
    this.progressBar.style.width = `${progress}%`;

    if (progress < 100) {
      this.progressTimer = requestAnimationFrame(() => this.animateProgress());
    }
  }

  // Public API methods
  addSlide(slideData) {
    this.data.push(slideData);
    this.render();
    this.cacheElements();
    this.updateSlidePositions();
    this.bindEvents();
  }

  removeSlide(index) {
    if (index >= 0 && index < this.data.length) {
      this.data.splice(index, 1);
      if (this.currentIndex >= this.data.length) {
        this.currentIndex = this.data.length - 1;
      }
      this.render();
      this.cacheElements();
      this.updateSlidePositions();
      this.bindEvents();
    }
  }

  destroy() {
    this.pauseAutoPlay();
    this.container.innerHTML = '';
  }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the carousel with the work data
  const carousel = new WorkCarousel('#work .work-grid', workData, {
    autoPlayInterval: 5000,
    autoPlay: true,
    showProgress: true
  });

  // Make carousel accessible globally for debugging/customization
  window.workCarousel = carousel;
});
