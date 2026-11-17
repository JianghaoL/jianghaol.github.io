/* Real-time Shepard synthesis with a logarithmic spectrum of the audible output. */
(() => {
  const demo = document.querySelector('[data-shepard-demo]');
  if (!demo) return;
  const canvas = demo.querySelector('canvas');
  const drawing = canvas.getContext('2d');
  const play = demo.querySelector('[data-demo-play]');
  const pause = demo.querySelector('[data-demo-pause]');
  const slider = demo.querySelector('input[type="range"]');
  const output = demo.querySelector('[data-demo-value]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const contrast = matchMedia('(prefers-contrast: more)');
  const error = document.createElement('p');
  error.className = 'demo-error';
  error.setAttribute('role', 'alert');
  error.hidden = true;
  demo.append(error);
  canvas.setAttribute('aria-label', document.documentElement.lang.startsWith('zh') ? 'Shepard 音实时对数频谱，横轴为频率，纵轴为分贝' : 'Shepard tone live logarithmic spectrum, frequency in Hz and level in dB');

  let audio = null;
  let source = null;
  let transport = null;
  let analyser = null;
  let initializing = null;
  let spectrum = new Float32Array(8192).fill(-Infinity);
  let intensity = Number(slider.value);
  let playing = false;
  let wanted = false;
  let transition = 0;
  let frame = 0;

  function draw() {
    if (!drawing) return;
    if (analyser && playing) analyser.getFloatFrequencyData(spectrum);
    const { width, height } = canvas;
    const left = 68, right = width - 26, top = 36, bottom = height - 56;
    const minFrequency = 20;
    const maxFrequency = Math.min(20000, audio ? audio.sampleRate / 2 : 24000);
    const logRange = Math.log(maxFrequency / minFrequency);
    const minDb = -100, maxDb = 0;
    const frequencyX = frequency => left + Math.log(frequency / minFrequency) / logRange * (right - left);
    const levelY = db => bottom - (Math.max(minDb, Math.min(maxDb, db)) - minDb) / (maxDb - minDb) * (bottom - top);
    drawing.clearRect(0, 0, width, height);
    drawing.font = '20px system-ui, sans-serif';
    drawing.lineWidth = 1;
    drawing.fillStyle = contrast.matches ? '#ffffff' : '#9aacc0';
    drawing.strokeStyle = '#243448';
    drawing.beginPath();
    const ticks = canvas.clientWidth < 500 ? [20, 100, 1000, 10000] : [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
    drawing.textAlign = 'center';
    for (const frequency of ticks) {
      if (frequency > maxFrequency) continue;
      const x = frequencyX(frequency);
      drawing.moveTo(x, top); drawing.lineTo(x, bottom);
      drawing.fillText(frequency >= 1000 ? `${frequency / 1000}k` : String(frequency), x, bottom + 28);
    }
    drawing.textAlign = 'right';
    for (const db of [-90, -60, -30, 0]) {
      const y = levelY(db);
      drawing.moveTo(left, y); drawing.lineTo(right, y);
      drawing.fillText(String(db), left - 12, y + 7);
    }
    drawing.fillText('dB', left - 12, top - 16);
    drawing.fillText('Hz', right, height - 5);
    drawing.stroke();

    const binWidth = analyser ? audio.sampleRate / analyser.fftSize : 1;
    drawing.beginPath();
    for (let x = left; x <= right; x++) {
      const frequency = minFrequency * Math.exp((x - left) / (right - left) * logRange);
      const nextFrequency = minFrequency * Math.exp((x + 1 - left) / (right - left) * logRange);
      const bin = Math.min(spectrum.length - 1, frequency / binWidth);
      const start = Math.floor(bin);
      const end = Math.min(spectrum.length - 1, Math.floor(nextFrequency / binWidth));
      // Keep narrow oscillator peaks when many FFT bins share a screen pixel.
      let db = -Infinity;
      if (end > start) {
        for (let k = start; k <= end; k++) db = Math.max(db, spectrum[k]);
      } else {
        const a = Number.isFinite(spectrum[start]) ? spectrum[start] : minDb;
        const b = Number.isFinite(spectrum[Math.min(start + 1, spectrum.length - 1)]) ? spectrum[Math.min(start + 1, spectrum.length - 1)] : minDb;
        db = a + (b - a) * (bin - start);
      }
      const y = levelY(db);
      if (x === left) drawing.moveTo(x, y); else drawing.lineTo(x, y);
    }
    drawing.strokeStyle = contrast.matches ? '#ffffff' : '#8bcaff';
    drawing.lineWidth = 2.5;
    drawing.stroke();
  }

  function animate() {
    frame = 0;
    if (!playing || motion.matches || document.hidden) return;
    draw();
    frame = requestAnimationFrame(animate);
  }

  function syncAnimation() {
    cancelAnimationFrame(frame);
    draw();
    frame = playing && !motion.matches && !document.hidden ? requestAnimationFrame(animate) : 0;
  }

  function updateControls(pending = false) {
    play.disabled = pending || playing;
    play.setAttribute('aria-pressed', String(playing));
    play.setAttribute('aria-busy', String(pending));
    pause.disabled = !wanted;
  }

  function dispose() {
    ++transition;
    wanted = playing = false;
    const oldAudio = audio;
    audio = source = transport = analyser = initializing = null;
    if (oldAudio && oldAudio.state !== 'closed') void oldAudio.close().catch(() => {});
    spectrum.fill(-Infinity);
    updateControls();
    syncAnimation();
  }

  function fail() {
    dispose();
    error.textContent = document.documentElement.lang.startsWith('zh')
      ? '音频未能启动，请重试或使用支持 Web Audio 的浏览器。'
      : 'Audio could not start. Please retry or use a browser with Web Audio support.';
    error.hidden = false;
  }

  async function initialize() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error('Web Audio unavailable');
    const current = new AudioContextClass({ latencyHint: 'interactive' });
    audio = current;
    if (!current.audioWorklet) throw new Error('AudioWorklet unavailable');
    // Resume immediately inside the Play gesture, including on mobile Safari.
    await current.resume();
    await current.audioWorklet.addModule('/blog/shepard-tone-worklet.js');
    if (audio !== current) throw new Error('Audio initialization cancelled');
    source = new AudioWorkletNode(current, 'shepard-tone', {
      numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [1],
      parameterData: { intensity }
    });
    transport = current.createGain();
    transport.gain.value = 0;
    analyser = current.createAnalyser();
    analyser.fftSize = 16384;
    analyser.smoothingTimeConstant = 0.65;
    spectrum = new Float32Array(analyser.frequencyBinCount).fill(-Infinity);
    source.connect(transport).connect(analyser).connect(current.destination);
    source.onprocessorerror = () => { if (audio === current) fail(); };
  }

  async function start() {
    const version = ++transition;
    wanted = true;
    error.hidden = true;
    updateControls(true);
    try {
      if (!initializing) initializing = initialize();
      // On subsequent plays, resume in the user gesture before awaiting setup.
      const resume = audio ? audio.resume() : Promise.resolve();
      await Promise.all([initializing, resume]);
      if (version !== transition || !wanted) return;
      source.parameters.get('intensity').setValueAtTime(intensity, audio.currentTime);
      transport.gain.cancelScheduledValues(audio.currentTime);
      transport.gain.setValueAtTime(transport.gain.value, audio.currentTime);
      transport.gain.linearRampToValueAtTime(1, audio.currentTime + 0.02);
      playing = true;
      updateControls();
      syncAnimation();
    } catch {
      if (version === transition) fail();
    }
  }

  async function stop() {
    const version = ++transition;
    wanted = playing = false;
    updateControls();
    syncAnimation();
    try {
      if (initializing) await initializing;
      if (version !== transition || !audio) return;
      const current = audio;
      const now = current.currentTime;
      transport.gain.cancelScheduledValues(now);
      transport.gain.setValueAtTime(transport.gain.value, now);
      transport.gain.linearRampToValueAtTime(0, now + 0.02);
      await new Promise(resolve => setTimeout(resolve, 30));
      if (version === transition && audio === current) await current.suspend();
    } catch {
      if (version === transition) fail();
    }
  }

  play.addEventListener('click', () => { void start(); });
  pause.addEventListener('click', () => { void stop(); });
  slider.addEventListener('input', () => {
    intensity = Number(slider.value);
    output.value = intensity.toFixed(2);
    if (source && audio) source.parameters.get('intensity').setValueAtTime(intensity, audio.currentTime);
    draw();
  });
  motion.addEventListener('change', syncAnimation);
  contrast.addEventListener('change', draw);
  document.addEventListener('visibilitychange', syncAnimation);
  window.addEventListener('pagehide', dispose);
  draw();
})();
