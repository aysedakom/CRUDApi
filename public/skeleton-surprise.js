/* Random skeleton surprise + delete sound effects. */
(() => {
  const VIDEO_ID = 'pyBEvMXVfL0';
  const MIN_DELAY_MS = 45_000;
  const MAX_DELAY_MS = 180_000;
  const panel = document.getElementById('skeleton-surprise');
  const frame = document.getElementById('surprise-frame');
  const close = document.getElementById('close-surprise');
  if (!panel || !frame || !close) return;

  let timeoutId;
  let dismissed = false;
  let player;

  function scheduleSurprise() {
    const delay = Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
    timeoutId = window.setTimeout(showSurprise, delay);
  }

  function hideSurprise() {
    dismissed = true;
    window.clearTimeout(timeoutId);
    panel.classList.remove('show');
    if (player && typeof player.stopVideo === 'function') player.stopVideo();
    frame.src = 'about:blank';
  }

  function showSurprise() {
    if (dismissed) return;
    panel.classList.add('show');
    panel.setAttribute('aria-label', 'Unexpected skeleton video');
    frame.src = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=0&controls=0&playsinline=1&rel=0&enablejsapi=1`;
    // YouTube's iframe API lets the surprise disappear as soon as playback ends.
    if (window.YT && window.YT.Player) setupPlayer();
    else {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previous === 'function') previous();
        setupPlayer();
      };
      if (!document.querySelector('script[data-youtube-iframe-api]')) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.dataset.youtubeIframeApi = 'true';
        document.head.appendChild(script);
      }
    }
  }

  function setupPlayer() {
    if (dismissed || player) return;
    try {
      player = new YT.Player('surprise-frame', {
        events: { onStateChange: event => { if (event.data === YT.PlayerState.ENDED) hideSurprise(); } }
      });
    } catch (_) {
      // If the API cannot load, the close button remains available.
    }
  }

  close.addEventListener('click', hideSurprise);
  scheduleSurprise();
})();

// Called by the dashboard after a deletion succeeds.
window.playDeleteOof = function () {
  const audio = document.getElementById('delete-oof-audio');
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {
    // Browsers can block audio until the user has interacted with the page.
  });
};
