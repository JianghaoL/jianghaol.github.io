// Dynamic waveform backgrounds for multiple sections. Rendering is visibility
// driven: an off-screen waveform should cost no animation frames or battery.
const waveCanvases = Array.from(document.querySelectorAll('#waveCanvas, .intro-wave-canvas, .section-wave-canvas'));
const waveContexts = [];
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const dpr = Math.min(window.devicePixelRatio || 1, 2);
let animationFrame = null;

function resizeCanvas(state) {
  const rect = state.canvas.parentElement.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  state.canvas.width = width * dpr;
  state.canvas.height = height * dpr;
  state.canvas.style.width = `${width}px`;
  state.canvas.style.height = `${height}px`;
  state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawOnCanvas(state);
}

function drawOnCanvas(state) {
  const { canvas, ctx } = state;
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;
  
  ctx.clearRect(0, 0, width, height);

  const waves = [
    { freq: 0.0065, amp: Math.max(22, height * 0.065), phase: 0, color: 'rgba(112, 186, 255, 0.42)', lineWidth: 1.4 },
    { freq: 0.0105, amp: Math.max(15, height * 0.044), phase: Math.PI / 4, color: 'rgba(154, 140, 255, 0.28)', lineWidth: 1.15 },
    { freq: 0.014, amp: Math.max(26, height * 0.075), phase: Math.PI / 2, color: 'rgba(87, 151, 232, 0.24)', lineWidth: 1.05 }
  ];

  const centerY = height / 2;

  waves.forEach((wave, idx) => {
    ctx.strokeStyle = wave.color;
    ctx.lineWidth = wave.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    for (let x = 0; x <= width; x += 4) {
      const timeShift = state.time * (0.055 + idx * 0.012);
      const y = centerY +
                Math.sin(x * wave.freq + timeShift + wave.phase) * wave.amp +
                Math.sin(x * wave.freq * 0.5 + timeShift * 0.7 + wave.phase) * (wave.amp * 0.35);

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
  });

  if (!reducedMotionQuery.matches) state.time += state.speed;
}

function scheduleWaveFrame() {
  if (animationFrame !== null || reducedMotionQuery.matches || document.hidden) return;
  if (!waveContexts.some(state => state.visible)) return;
  animationFrame = requestAnimationFrame(drawVisibleWaves);
}

function drawVisibleWaves() {
  animationFrame = null;
  waveContexts.filter(state => state.visible).forEach(drawOnCanvas);
  scheduleWaveFrame();
}

waveCanvases.forEach((canvas, index) => {
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;
  waveContexts.push({ canvas, ctx: context, time: index * 31.7, speed: 0.045 + index * 0.004, visible: true });
});

const canvasObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const state = waveContexts.find(item => item.canvas === entry.target);
        if (state) state.visible = entry.isIntersecting;
      });
      scheduleWaveFrame();
    }, { rootMargin: '120px 0px', threshold: 0 })
  : null;

waveContexts.forEach(state => {
  resizeCanvas(state);
  canvasObserver?.observe(state.canvas);
});

const resizeObserver = 'ResizeObserver' in window
  ? new ResizeObserver(entries => {
      entries.forEach(entry => {
        const state = waveContexts.find(item => item.canvas.parentElement === entry.target);
        if (state) resizeCanvas(state);
      });
    })
  : null;

waveContexts.forEach(state => resizeObserver?.observe(state.canvas.parentElement));
if (!resizeObserver) window.addEventListener('resize', () => waveContexts.forEach(resizeCanvas), { passive: true });

document.addEventListener('visibilitychange', scheduleWaveFrame);
reducedMotionQuery.addEventListener('change', () => {
  waveContexts.forEach(drawOnCanvas);
  scheduleWaveFrame();
});
scheduleWaveFrame();

// Scroll Reveal 功能
const revealElements = document.querySelectorAll("[data-reveal]");
const observer = new IntersectionObserver((entries, revealObserver) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

revealElements.forEach(el => {
  if (reducedMotionQuery.matches) el.classList.add('visible');
  else observer.observe(el);
});

// Small typewriter effect for the intro line
// Wait for i18n translations to complete before running typewriter effect
function initTypewriter() {
  const typeEl = document.getElementById('intro-type');
  if (typeEl) {
    const text = typeEl.textContent.trim();
    if (reducedMotionQuery.matches || !text) return;
    typeEl.textContent = '';
    let i = 0;
    const speed = 28;
    const typer = setInterval(() => {
      typeEl.textContent += text.charAt(i);
      i++;
      if (i >= text.length) clearInterval(typer);
    }, speed);
  }
}

// Listen for i18n ready event if translations.js is loaded, otherwise run immediately
if (typeof window.__translations !== 'undefined') {
  document.addEventListener('i18nReady', initTypewriter);
} else {
  initTypewriter();
}

// =============================================
// Mobile Navigation Toggle
// =============================================
(function initMobileNav() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!mobileToggle || !navLinks) return;

  // Toggle menu on button click
  mobileToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    const isExpanded = mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    mobileToggle.setAttribute('aria-expanded', isExpanded);
    
    // Toggle body scroll when menu is open
    document.body.style.overflow = isExpanded ? 'hidden' : '';
  });

  // Close menu when clicking a nav link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      mobileToggle.classList.remove('active');
      navLinks.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
      mobileToggle.classList.remove('active');
      navLinks.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      mobileToggle.classList.remove('active');
      navLinks.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      mobileToggle.focus();
    }
  });

  // Handle window resize - close menu if resizing to desktop
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }, 250);
  });
})();
