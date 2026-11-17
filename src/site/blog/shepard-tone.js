/* Silent visual preview. Transport and intensity events can later drive audio. */
(() => {
  const demo = document.querySelector('[data-shepard-demo]');
  if (!demo) return;
  const canvas = demo.querySelector('canvas');
  const context = canvas.getContext('2d');
  const play = demo.querySelector('[data-demo-play]');
  const pause = demo.querySelector('[data-demo-pause]');
  const slider = demo.querySelector('input[type="range"]');
  const output = demo.querySelector('[data-demo-value]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const contrast = matchMedia('(prefers-contrast: more)');
  let playing = false;
  let intensity = Number(slider.value);
  let phase = 0;
  let frame = 0;
  let previousTime = null;

  function draw() {
    if (!context) return;
    const { width, height } = canvas;
    context.clearRect(0, 0, width, height);
    context.strokeStyle = '#243448';
    context.lineWidth = 1;
    context.beginPath();
    for (let x = 0; x <= width; x += 100) { context.moveTo(x, 0); context.lineTo(x, height); }
    context.moveTo(0, height / 2); context.lineTo(width, height / 2);
    context.stroke();
    context.strokeStyle = contrast.matches ? '#ffffff' : '#8bcaff';
    context.lineWidth = 2.5;
    context.beginPath();
    for (let x = 0; x <= width; x++) {
      const t = x / width;
      const angle = t * Math.PI * (12 + intensity * 18) + phase;
      // An illustrative layered waveform, not synthesized audio data.
      const wave = (Math.sin(angle) + .45 * Math.sin(angle * 2) + .2 * Math.sin(angle * 4)) / 1.65;
      const y = height / 2 - wave * height * .38 * intensity;
      if (x === 0) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.stroke();
  }
  function animate(time) {
    frame = 0;
    if (!playing || motion.matches || document.hidden) return;
    if (previousTime !== null) phase += Math.min(time - previousTime, 50) * .001 * (1 + intensity * 5);
    previousTime = time;
    draw();
    frame = requestAnimationFrame(animate);
  }
  function syncAnimation() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = null;
    draw();
    if (playing && !motion.matches && !document.hidden) frame = requestAnimationFrame(animate);
  }
  function setPlaying(next) {
    playing = next;
    play.setAttribute('aria-pressed', String(playing));
    pause.disabled = !playing;
    syncAnimation();
    demo.dispatchEvent(new CustomEvent('shepard-transport', { bubbles: true, detail: { playing, intensity } }));
  }
  play.addEventListener('click', () => { if (!playing) setPlaying(true); });
  pause.addEventListener('click', () => setPlaying(false));
  slider.addEventListener('input', () => {
    intensity = Number(slider.value);
    output.value = intensity.toFixed(2);
    draw();
    demo.dispatchEvent(new CustomEvent('shepard-intensity', { bubbles: true, detail: { intensity } }));
  });
  motion.addEventListener('change', syncAnimation);
  contrast.addEventListener('change', draw);
  document.addEventListener('visibilitychange', syncAnimation);
  draw();
})();
