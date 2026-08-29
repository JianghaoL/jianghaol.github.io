/**
 * music-player.js
 *
 * Initialises all .mix-card elements on the page.
 * Each card is self-contained — audio source, title and artist are driven
 * by data attributes on the card element itself, so adding a new demo is
 * just a matter of adding a new .mix-card in the HTML.
 *
 * Data attributes expected on .mix-card:
 *   data-audio  - path/URL to the audio file (omit or leave empty for "coming soon")
 *   data-title  - song title (fallback if no .mix-card-title child is used)
 *   data-artist - artist name (fallback)
 */

(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  // Icons are built as DOM nodes rather than injected HTML. This keeps the
  // player compatible with a strict script policy and prevents future metadata
  // from accidentally becoming executable markup.
  function createIcon(type) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');

    if (type === 'pause') {
      [[5, 3], [15, 3]].forEach(([x, y]) => {
        const rect = document.createElementNS(SVG_NS, 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', '4');
        rect.setAttribute('height', '18');
        rect.setAttribute('rx', '1');
        svg.append(rect);
      });
    } else {
      const polygon = document.createElementNS(SVG_NS, 'polygon');
      polygon.setAttribute('points', '5,3 19,12 5,21');
      svg.append(polygon);
    }

    return svg;
  }

  function setButtonIcon(button, type) {
    if (button) button.replaceChildren(createIcon(type));
  }

  // Helpers ------------------------------------------------------------------
  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // Track the currently-playing card so we can pause it when another starts
  let activeCard = null;

  // Initialise a single card -------------------------------------------------
  function initCard(card) {
    const audioSrc = card.dataset.audio || '';

    const playBtn        = card.querySelector('.mix-card-play-btn');
    const progressTrack  = card.querySelector('.mix-card-progress-track');
    const progressFill   = card.querySelector('.mix-card-progress-fill');
    const progressThumb  = card.querySelector('.mix-card-progress-thumb');
    const currentTime    = card.querySelector('.mix-card-current');
    const durationEl     = card.querySelector('.mix-card-duration');

    // No audio source — mark card and bail
    if (!audioSrc) {
      card.classList.add('no-audio');
      if (playBtn) {
        playBtn.disabled = true;
        playBtn.setAttribute('aria-label', 'No audio available');
        setButtonIcon(playBtn, 'play');
      }
      return;
    }

    // Create audio element
    const audio = new Audio(audioSrc);
    audio.preload = 'metadata';
    let rafId = null;

    // ---- State ----
    function setPlaying(playing) {
      card.classList.toggle('is-playing', playing);
      if (playBtn) {
        playBtn.classList.toggle('is-playing', playing);
        setButtonIcon(playBtn, playing ? 'pause' : 'play');
        playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
      }
    }

    // ---- Progress update loop ----
    function updateProgress() {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      if (progressFill)  progressFill.style.width = pct + '%';
      if (progressThumb) progressThumb.style.left  = pct + '%';
      if (currentTime)   currentTime.textContent   = formatTime(audio.currentTime);
      if (progressTrack) progressTrack.setAttribute('aria-valuenow', String(Math.round(audio.currentTime)));
      if (!audio.paused) {
        rafId = requestAnimationFrame(updateProgress);
        card._mixRaf = rafId;
      }
    }

    // ---- Duration ready ----
    audio.addEventListener('loadedmetadata', function () {
      if (durationEl) durationEl.textContent = formatTime(audio.duration);
      if (progressTrack) progressTrack.setAttribute('aria-valuemax', String(Math.round(audio.duration)));
    });

    // ---- Ended ----
    audio.addEventListener('ended', function () {
      setPlaying(false);
      cancelAnimationFrame(rafId);
      // Reset to start
      audio.currentTime = 0;
      if (progressFill)  progressFill.style.width = '0%';
      if (progressThumb) progressThumb.style.left  = '0%';
      if (currentTime)   currentTime.textContent   = '0:00';
      if (activeCard === card) activeCard = null;
    });

    // ---- Play / Pause button ----
    if (playBtn) {
      setButtonIcon(playBtn, 'play');
      playBtn.setAttribute('aria-label', 'Play');

      playBtn.addEventListener('click', async function () {
        if (audio.paused) {
          // Pause whatever is playing
          if (activeCard && activeCard !== card) {
            const prevAudio = activeCard._mixAudio;
            if (prevAudio) {
              prevAudio.pause();
              cancelAnimationFrame(activeCard._mixRaf);
            }
            activeCard.classList.remove('is-playing');
            const prevBtn = activeCard.querySelector('.mix-card-play-btn');
            if (prevBtn) {
              prevBtn.classList.remove('is-playing');
              setButtonIcon(prevBtn, 'play');
              prevBtn.setAttribute('aria-label', 'Play');
            }
          }
          try {
            await audio.play();
          } catch (err) {
            console.warn('[music-player] Playback failed:', err);
            setPlaying(false);
            return;
          }
          setPlaying(true);
          activeCard = card;
          rafId = requestAnimationFrame(updateProgress);
          card._mixRaf = rafId;
        } else {
          audio.pause();
          setPlaying(false);
          cancelAnimationFrame(rafId);
          if (activeCard === card) activeCard = null;
        }
      });
    }

    // ---- Seek on progress track click ----
    if (progressTrack) {
      progressTrack.tabIndex = 0;
      progressTrack.setAttribute('role', 'slider');
      progressTrack.setAttribute('aria-label', 'Audio position');
      progressTrack.setAttribute('aria-valuemin', '0');
      progressTrack.setAttribute('aria-valuenow', '0');

      function seekToRatio(ratio) {
        if (!audio.duration) return;
        const clamped = Math.max(0, Math.min(1, ratio));
        audio.currentTime = clamped * audio.duration;
        if (progressFill)  progressFill.style.width = (clamped * 100) + '%';
        if (progressThumb) progressThumb.style.left  = (clamped * 100) + '%';
        if (currentTime)   currentTime.textContent   = formatTime(audio.currentTime);
        progressTrack.setAttribute('aria-valuemax', String(Math.round(audio.duration)));
        progressTrack.setAttribute('aria-valuenow', String(Math.round(audio.currentTime)));
        progressTrack.setAttribute('aria-valuetext', formatTime(audio.currentTime));
      }

      progressTrack.addEventListener('click', function (e) {
        if (!audio.duration) return;
        const rect = progressTrack.getBoundingClientRect();
        seekToRatio((e.clientX - rect.left) / rect.width);
      });

      // Pointer-drag seek
      let dragging = false;
      progressTrack.addEventListener('pointerdown', function (e) {
        dragging = true;
        progressTrack.setPointerCapture(e.pointerId);
        const rect = progressTrack.getBoundingClientRect();
        seekToRatio((e.clientX - rect.left) / rect.width);
      });
      progressTrack.addEventListener('pointermove', function (e) {
        if (!dragging || !audio.duration) return;
        const rect = progressTrack.getBoundingClientRect();
        seekToRatio((e.clientX - rect.left) / rect.width);
      });
      progressTrack.addEventListener('pointerup', function () { dragging = false; });
      progressTrack.addEventListener('pointercancel', function () { dragging = false; });
      progressTrack.addEventListener('keydown', function (e) {
        if (!audio.duration) return;
        const steps = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5 };
        if (e.key in steps) {
          e.preventDefault();
          seekToRatio((audio.currentTime + steps[e.key]) / audio.duration);
        } else if (e.key === 'Home' || e.key === 'End') {
          e.preventDefault();
          seekToRatio(e.key === 'Home' ? 0 : 1);
        }
      });
    }

    // Stash references on the card element for cross-card communication
    card._mixAudio = audio;
    card._mixRaf   = rafId;
  }

  // Boot ---------------------------------------------------------------------
  function init() {
    document.querySelectorAll('.mix-card').forEach(initCard);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
