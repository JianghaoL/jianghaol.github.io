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

  // SVG icons ----------------------------------------------------------------
  const ICON_PLAY =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<polygon points="5,3 19,12 5,21"/>' +
    '</svg>';

  const ICON_PAUSE =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect x="5" y="3" width="4" height="18" rx="1"/>' +
      '<rect x="15" y="3" width="4" height="18" rx="1"/>' +
    '</svg>';

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
        playBtn.innerHTML = ICON_PLAY;
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
        playBtn.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
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
      if (!audio.paused) rafId = requestAnimationFrame(updateProgress);
    }

    // ---- Duration ready ----
    audio.addEventListener('loadedmetadata', function () {
      if (durationEl) durationEl.textContent = formatTime(audio.duration);
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
      playBtn.innerHTML = ICON_PLAY;
      playBtn.setAttribute('aria-label', 'Play');

      playBtn.addEventListener('click', function () {
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
              prevBtn.innerHTML = ICON_PLAY;
              prevBtn.setAttribute('aria-label', 'Play');
            }
          }
          audio.play().catch(function (err) {
            console.warn('[music-player] Playback failed:', err);
          });
          setPlaying(true);
          activeCard = card;
          rafId = requestAnimationFrame(updateProgress);
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
      progressTrack.addEventListener('click', function (e) {
        if (!audio.duration) return;
        const rect = progressTrack.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.currentTime = ratio * audio.duration;
        if (progressFill)  progressFill.style.width = (ratio * 100) + '%';
        if (progressThumb) progressThumb.style.left  = (ratio * 100) + '%';
        if (currentTime)   currentTime.textContent   = formatTime(audio.currentTime);
      });

      // Pointer-drag seek
      let dragging = false;
      progressTrack.addEventListener('pointerdown', function (e) {
        dragging = true;
        progressTrack.setPointerCapture(e.pointerId);
      });
      progressTrack.addEventListener('pointermove', function (e) {
        if (!dragging || !audio.duration) return;
        const rect = progressTrack.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.currentTime = ratio * audio.duration;
        if (progressFill)  progressFill.style.width = (ratio * 100) + '%';
        if (progressThumb) progressThumb.style.left  = (ratio * 100) + '%';
        if (currentTime)   currentTime.textContent   = formatTime(audio.currentTime);
      });
      progressTrack.addEventListener('pointerup', function () { dragging = false; });
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
