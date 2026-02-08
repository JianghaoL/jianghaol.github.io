// Dynamic waveform backgrounds for multiple sections
const waveCanvases = Array.from(document.querySelectorAll('#waveCanvas, .intro-wave-canvas, .section-wave-canvas'));
const waveContexts = [];
const dpr = window.devicePixelRatio || 1;

function resizeAllCanvases() {
  waveCanvases.forEach(c => {
    const parent = c.parentElement;
    const rect = parent.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    c.width = width * dpr;
    c.height = height * dpr;
    c.style.width = width + 'px';
    c.style.height = height + 'px';
  });
  
  // Reset contexts with proper scaling
  waveContexts.forEach(state => {
    state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  });
}

// Prepare contexts and per-canvas state
waveCanvases.forEach((c, i) => {
  const ctx = c.getContext('2d');
  waveContexts.push({ canvas: c, ctx, time: Math.random() * 1000, speed: 0.12 + i * 0.02 });
});

resizeAllCanvases();
window.addEventListener('resize', resizeAllCanvases);

function drawOnCanvas(state) {
  const { canvas, ctx } = state;
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;
  
  ctx.clearRect(0, 0, width, height);

  const waves = [
    { freq: 0.008, amp: Math.max(20, height * 0.06), phase: 0, color: 'rgba(106, 176, 243, 0.35)', lineWidth: 2.5 },
    { freq: 0.012, amp: Math.max(14, height * 0.045), phase: Math.PI / 4, color: 'rgba(147, 112, 219, 0.28)', lineWidth: 2 },
    { freq: 0.015, amp: Math.max(25, height * 0.08), phase: Math.PI / 2, color: 'rgba(106, 176, 243, 0.25)', lineWidth: 2 }
  ];

  const centerY = height / 2;

  waves.forEach((wave, idx) => {
    ctx.strokeStyle = wave.color;
    ctx.lineWidth = wave.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    for (let x = 0; x <= width; x += 3) {
      const timeShift = state.time * (0.08 + idx * 0.02);
      const y = centerY +
                Math.sin(x * wave.freq + timeShift + wave.phase) * wave.amp +
                Math.sin(x * wave.freq * 0.5 + timeShift * 0.7 + wave.phase) * (wave.amp * 0.35);

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
  });

  state.time += state.speed;
}

function drawAll() {
  waveContexts.forEach(state => drawOnCanvas(state));
  requestAnimationFrame(drawAll);
}

if (waveContexts.length) drawAll();

// 背景流体动效（Vanta Waves）
if (typeof VANTA !== 'undefined') {
  VANTA.WAVES({
    el: "#hero",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.0,
    minWidth: 200.0,
    waveHeight: 12.0,
    waveSpeed: 0.85,
    color: 0x1e1e2d,
    shininess: 50.0
  });
}

// Scroll Reveal 功能
const revealElements = document.querySelectorAll("[data-reveal]");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

revealElements.forEach(el => observer.observe(el));

// Small typewriter effect for the intro line
// Wait for i18n translations to complete before running typewriter effect
function initTypewriter() {
  const typeEl = document.getElementById('intro-type');
  if (typeEl) {
    const text = typeEl.textContent.trim();
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