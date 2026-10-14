/* Cursor-chasing desktop cat using carysaurus' original Run and Idle sprites.
   Jump and loaf are small CSS effects because the free pack only includes Run + Idle. */
(() => {
  const cat = document.getElementById('desktop-cat');
  if (!cat || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let mouseX = window.innerWidth * 0.65;
  let catX = Math.max(12, window.innerWidth * 0.18);
  let lastMove = 0;
  let facing = 1;
  let restingUntil = 0;
  let nextLoafAt = performance.now() + 12000 + Math.random() * 12000;

  function pose(name) {
    cat.classList.remove('running', 'idling', 'loaf');
    cat.classList.add(name);
  }
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    lastMove = performance.now();
    if (restingUntil < lastMove) restingUntil = 0;
  }, { passive: true });
  window.addEventListener('touchmove', e => {
    if (e.touches && e.touches[0]) {
      mouseX = e.touches[0].clientX;
      lastMove = performance.now();
    }
  }, { passive: true });
  window.addEventListener('resize', () => {
    catX = Math.min(catX, window.innerWidth - 96);
    mouseX = Math.min(mouseX, window.innerWidth);
  });

  function tick(now) {
    const width = cat.getBoundingClientRect().width || 96;
    const maxX = Math.max(0, window.innerWidth - width);
    mouseX = Math.max(0, Math.min(mouseX, window.innerWidth));
    const target = Math.max(0, Math.min(maxX, mouseX - width * 0.48));
    const distance = target - catX;
    const cursorNear = Math.abs(distance) < 46;

    if (now >= nextLoafAt) {
      restingUntil = now + 3000 + Math.random() * 1800;
      nextLoafAt = restingUntil + 14000 + Math.random() * 22000;
      pose('loaf');
    }
    if (now < restingUntil) {
      pose('loaf');
    } else if (Math.abs(distance) > 14) {
      facing = distance > 0 ? 1 : -1;
      catX += distance * (cursorNear ? 0.018 : 0.012);
      if (Math.abs(distance) < 0.8) catX = target;
      pose('running');
    } else {
      pose('idling');
    }

    catX = Math.max(0, Math.min(maxX, catX));
    cat.style.left = `${catX}px`;
    cat.style.transform = `scaleX(${facing})`;
    requestAnimationFrame(tick);
  }
  cat.style.left = `${catX}px`;
  requestAnimationFrame(tick);
})();
