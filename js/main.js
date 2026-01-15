// Dynamic waveform backgrounds for multiple sections
const waveCanvases = Array.from(document.querySelectorAll('#waveCanvas, .intro-wave-canvas, .section-wave-canvas'));
const waveContexts = [];

function resizeAllCanvases() {
  waveCanvases.forEach(c => {
    c.width = c.offsetWidth || window.innerWidth;
    c.height = c.offsetHeight || window.innerHeight;
  });
}
resizeAllCanvases();
window.addEventListener('resize', resizeAllCanvases);

// Prepare contexts and per-canvas state
waveCanvases.forEach((c, i) => {
  const ctx = c.getContext('2d');
  waveContexts.push({ canvas: c, ctx, time: Math.random() * 1000, speed: 0.12 + i * 0.02 });
});

function drawOnCanvas(state) {
  const { canvas, ctx } = state;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const waves = [
    { freq: 0.008, amp: Math.max(20, canvas.height * 0.06), phase: 0, color: 'rgba(106, 176, 243, 0.35)', lineWidth: 2.5 },
    { freq: 0.012, amp: Math.max(14, canvas.height * 0.045), phase: Math.PI / 4, color: 'rgba(147, 112, 219, 0.28)', lineWidth: 2 },
    { freq: 0.015, amp: Math.max(25, canvas.height * 0.08), phase: Math.PI / 2, color: 'rgba(106, 176, 243, 0.25)', lineWidth: 2 }
  ];

  const centerY = canvas.height / 2;

  waves.forEach((wave, idx) => {
    ctx.strokeStyle = wave.color;
    ctx.lineWidth = wave.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    for (let x = 0; x <= canvas.width; x += 3) {
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

// Audio Waveform Animation
const canvas = document.getElementById('waveformCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = 200;

let bars = 100;
let barWidth = canvas.width / bars;

function drawWaveform() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < bars; i++) {
    let barHeight = Math.sin((i + Date.now() / 100) / 10) * 50 + 50;
    ctx.fillStyle = `rgba(106, 176, 243, 0.7)`;
    ctx.fillRect(i * barWidth, canvas.height / 2 - barHeight / 2, barWidth - 2, barHeight);
  }
  requestAnimationFrame(drawWaveform);
}

drawWaveform();

// Wave Animation for Vision Section Only
const waveSections = document.querySelectorAll('.wave-section');

waveSections.forEach(section => {
  const canvas = section.querySelector('.section-wave-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = section.offsetHeight;

  let waveHeight = 20;
  let waveLength = 0.02;
  let waveSpeed = 0.05;
  let offset = 0;

  function drawWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);

    for (let x = 0; x < canvas.width; x++) {
      const y = waveHeight * Math.sin(x * waveLength + offset) + canvas.height / 2;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(106, 176, 243, 0.5)';
    ctx.fill();

    offset += waveSpeed;
    requestAnimationFrame(drawWave);
  }

  drawWave();
});
