// A clear lens over the live browser backdrop, not a blurred copy of the page.
// Each surface owns a rounded-rectangle displacement map, rebuilt only on resize.
// SVG backdrop reference filters are currently most reliable in Chromium; other
// engines retain the transparent tint, specular rim, and readable foreground.
const NS = 'http://www.w3.org/2000/svg';
const surfaces = new Map();
const selector = [
  '.site-header', '.nav-links', '.gallery-controls', '.blog-toc',
  '.mix-card', '.reel-card', '.featured-project__arrow', '.contact-links a', '.contact-card', '.resume-modal',
  '.certificate-modal', '.image-lightbox-content', '.hero-details-container',
  '.details-container', '.about-introduction', '.about-education', '.about-skills'
].join(',');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const reducedTransparency = matchMedia('(prefers-reduced-transparency: reduce)');
const highContrast = matchMedia('(prefers-contrast: more)');
const mobile = matchMedia('(max-width: 768px)');
const supportsReference = CSS.supports('backdrop-filter', 'url("#glass")');
let sequence = 0;

function svgNode(name, attributes = {}) {
  const node = document.createElementNS(NS, name);
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

const svg = svgNode('svg', { width: 0, height: 0, 'aria-hidden': 'true', focusable: 'false' });
svg.classList.add('liquid-glass-definitions');
const definitions = svgNode('defs');
svg.append(definitions);
document.body.append(svg);

function updateLens(state) {
  const { element, layer, filter, mapImage, displacement } = state;
  const enabled = !reducedTransparency.matches && !highContrast.matches &&
    (!element.matches('.nav-links') || mobile.matches);
  if (!enabled || !supportsReference) {
    layer.style.removeProperty('--glass-refraction');
    return;
  }
  // Layout dimensions avoid baking hover/entrance transforms into the map.
  const width = element.clientWidth;
  const height = element.clientHeight;
  if (!width || !height || !state.visible) return;
  const radius = Math.min(parseFloat(getComputedStyle(element).borderTopLeftRadius) || 20, width / 2, height / 2);
  const key = `${width}:${height}:${radius}`;
  if (state.key === key) {
    layer.style.setProperty('--glass-refraction', `url("#${filter.id}")`);
    return;
  }
  state.key = key;
  // Cap texture cost for long reading panels. Displacement remains in CSS pixels.
  const resolution = Math.min(1, 960 / width, 640 / height);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * resolution));
  canvas.height = Math.max(1, Math.round(height * resolution));
  const context = canvas.getContext('2d');
  if (!context) return;
  const pixels = context.createImageData(canvas.width, canvas.height);
  const bevel = Math.min(24, height * 0.24, radius);
  const strength = Math.min(18, bevel * 0.85);
  const scale = strength * 2;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const px = (x + 0.5) * width / canvas.width - width / 2;
      const py = (y + 0.5) * height / canvas.height - height / 2;
      const qx = Math.abs(px) - (width / 2 - radius);
      const qy = Math.abs(py) - (height / 2 - radius);
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      const length = Math.hypot(ox, oy);
      const distance = length + Math.min(Math.max(qx, qy), 0) - radius;
      const depth = -distance;
      let dx = 0;
      let dy = 0;
      if (depth > 0 && depth < bevel) {
        // Surface normal of a rounded rectangular lens; its flat center stays
        // undistorted. A smooth curved shoulder bends rays inward at the rim.
        const nx = length > 0 ? ox / length : (qx > qy ? 1 : 0);
        const ny = length > 0 ? oy / length : (qx > qy ? 0 : 1);
        const bend = Math.sin(Math.PI * depth / bevel) ** 1.2;
        dx = -Math.sign(px) * nx * bend;
        dy = -Math.sign(py) * ny * bend;
      }
      const offset = (y * canvas.width + x) * 4;
      pixels.data[offset] = Math.round(127.5 + dx * 127.5);
      pixels.data[offset + 1] = Math.round(127.5 + dy * 127.5);
      pixels.data[offset + 2] = 128;
      pixels.data[offset + 3] = 255;
    }
  }
  context.putImageData(pixels, 0, 0);
  filter.setAttribute('width', width);
  filter.setAttribute('height', height);
  mapImage.setAttribute('width', width);
  mapImage.setAttribute('height', height);
  mapImage.setAttribute('href', canvas.toDataURL());
  displacement.setAttribute('scale', scale);
  layer.style.setProperty('--glass-refraction', `url("#${filter.id}")`);
}

const resizeObserver = new ResizeObserver(entries => {
  entries.forEach(({ target }) => updateLens(surfaces.get(target)));
});
const visibilityObserver = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    const state = surfaces.get(target);
    state.visible = isIntersecting;
    if (isIntersecting) updateLens(state);
  });
}, { rootMargin: '80px' });

function attach(element) {
  if (surfaces.has(element)) return;
  const filter = svgNode('filter', {
    id: `liquid-lens-${++sequence}`, x: 0, y: 0,
    filterUnits: 'userSpaceOnUse', primitiveUnits: 'userSpaceOnUse',
    'color-interpolation-filters': 'sRGB'
  });
  const mapImage = svgNode('feImage', { x: 0, y: 0, preserveAspectRatio: 'none', result: 'lens-map' });
  const displacement = svgNode('feDisplacementMap', {
    in: 'SourceGraphic', in2: 'lens-map', xChannelSelector: 'R', yChannelSelector: 'G', scale: 0
  });
  filter.append(mapImage, displacement);
  definitions.append(filter);
  const layer = document.createElement(element.matches('ul, ol') ? 'li' : 'span');
  layer.className = 'liquid-glass-layer';
  layer.setAttribute('aria-hidden', 'true');
  if (getComputedStyle(element).position === 'static') element.classList.add('liquid-glass-static');
  element.classList.add('liquid-glass');
  // An independent, negative-z material lets the nav popup sample the page too:
  // the header itself must never become a backdrop root by having a filter.
  element.prepend(layer);
  const state = { element, layer, filter, mapImage, displacement, visible: false, key: '', frame: 0 };
  surfaces.set(element, state);
  resizeObserver.observe(element);
  visibilityObserver.observe(element);
  element.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || reducedMotion.matches || reducedTransparency.matches || highContrast.matches) return;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    if (state.frame) return;
    state.frame = requestAnimationFrame(() => {
      state.frame = 0;
      const rect = element.getBoundingClientRect();
      element.style.setProperty('--glass-light-x', `${(state.pointerX - rect.left) / rect.width * 100}%`);
      element.style.setProperty('--glass-light-y', `${(state.pointerY - rect.top) / rect.height * 100}%`);
    });
  }, { passive: true });
  element.addEventListener('pointerleave', () => {
    cancelAnimationFrame(state.frame);
    state.frame = 0;
    element.style.removeProperty('--glass-light-x');
    element.style.removeProperty('--glass-light-y');
  });
}

function scan(root) {
  if (!(root instanceof Element)) return;
  if (root.matches(selector)) attach(root);
  root.querySelectorAll(selector).forEach(attach);
}
scan(document.body);
// Lightboxes and certificate sheets are created lazily by existing scripts.
new MutationObserver(records => {
  records.forEach(record => record.addedNodes.forEach(scan));
  for (const [element, state] of surfaces) {
    if (element.isConnected) continue;
    resizeObserver.unobserve(element);
    visibilityObserver.unobserve(element);
    cancelAnimationFrame(state.frame);
    state.filter.remove();
    surfaces.delete(element);
  }
}).observe(document.body, { childList: true, subtree: true });

[mobile, reducedMotion, reducedTransparency, highContrast].forEach(query => {
  query.addEventListener('change', () => surfaces.forEach(state => {
    state.element.style.removeProperty('--glass-light-x');
    state.element.style.removeProperty('--glass-light-y');
    updateLens(state);
  }));
});
