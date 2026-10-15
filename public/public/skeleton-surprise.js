/* Offline skeleton video + local RAAH sound. No extra shaking effect is applied. */
(() => {
  const MIN_DELAY_MS = 15_000;
  const MAX_DELAY_MS = 60_000;
  const panel = document.getElementById('skeleton-surprise');
  const close = document.getElementById('close-surprise');
  const video = document.getElementById('skeleton-animation');
  const raahAudio = document.getElementById('skeleton-raah-audio');
  if (!panel || !close || !video) return;

  let timeoutId = 0;
  let hideId = 0;
  let dismissed = false;
  let firstAppearance = true;
  let audioUnlocked = false;

  // Unlock audible playback from a real user gesture. Muted playback alone
  // does not reliably authorize later unmuted playback in Chrome.
  function unlockAudio() {
    if (!raahAudio || audioUnlocked) return;
    raahAudio.pause();
    raahAudio.currentTime = 0;
    raahAudio.muted = false;
    raahAudio.volume = 0.001;
    const prime = raahAudio.play();
    if (prime && typeof prime.then === 'function') {
      prime.then(() => {
        window.setTimeout(() => {
          raahAudio.pause();
          raahAudio.currentTime = 0;
          raahAudio.volume = 1;
          audioUnlocked = true;
        }, 80);
      }).catch(() => {
        raahAudio.pause();
        raahAudio.currentTime = 0;
        raahAudio.volume = 1;
      });
    } else {
      raahAudio.pause();
      raahAudio.currentTime = 0;
      raahAudio.volume = 1;
      audioUnlocked = true;
    }
  }
  document.addEventListener('pointerdown', unlockAudio, { passive: true });
  document.addEventListener('keydown', unlockAudio);

  function stopMedia() {
    video.pause();
    try { video.currentTime = 0; } catch (_) {}
    if (raahAudio) { raahAudio.pause(); raahAudio.currentTime = 0; }
  }
  function hideSurprise() {
    window.clearTimeout(hideId);
    panel.classList.remove('show');
    stopMedia();
    scheduleSurprise();
  }
  function showSurprise() {
    if (dismissed) return;
    panel.classList.add('show');
    video.pause();
    try { video.currentTime = 0; } catch (_) {}
    const videoPlay = video.play();
    if (videoPlay && typeof videoPlay.catch === 'function') videoPlay.catch(err => console.warn('Skeleton video could not play. Check public/videos/skeleton.mp4.', err));
    if (raahAudio) {
      raahAudio.pause();
      raahAudio.currentTime = 0;
      raahAudio.volume = 1;
      raahAudio.muted = false;
      const soundPlay = raahAudio.play();
      if (soundPlay && typeof soundPlay.catch === 'function') soundPlay.catch(err => console.warn('RAAH audio could not play. Check public/sounds/raah.mp3; click the page once to enable audio.', err));
    }
    // Match the local video duration; the ended event also closes it.
    hideId = window.setTimeout(hideSurprise, 180000);
  }
  function scheduleSurprise() {
    if (dismissed) return;
    const delay = firstAppearance ? 180000 : Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
    firstAppearance = false;
    timeoutId = window.setTimeout(showSurprise, delay);
  }
  video.addEventListener('ended', hideSurprise);
  close.addEventListener('click', () => {
    dismissed = true;
    window.clearTimeout(timeoutId);
    window.clearTimeout(hideId);
    panel.classList.remove('show');
    stopMedia();
  });
  scheduleSurprise();
})();

window.playDeleteOof = function () {
  const audio = document.getElementById('delete-oof-audio');
  if (!audio) return;
  audio.pause(); audio.currentTime = 0; audio.volume = 1;
  audio.play().catch(error => console.warn('Check public/sounds/oof.mp3 and browser audio permissions.', error));
};
