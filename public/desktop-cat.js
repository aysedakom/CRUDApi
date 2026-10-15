/* Desktop-pet cat: draggable, falls under gravity, and chases again whenever the pointer moves. */
(() => {
  const cat = document.getElementById('desktop-cat');
  if (!cat) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let x = Math.max(12, window.innerWidth * 0.18);
  let y = 0, vy = 0, dragging = false, facing = 1;
  let lastFrame = performance.now();
  let pointerX = window.innerWidth * 0.65;
  let pointerY = window.innerHeight * 0.5;
  let chasing = true;
  let lastPointerX = pointerX, lastPointerY = pointerY;
  const gravity = 1800, terminalVelocity = 1400;
  const chaseSpeed = reduced ? 0 : 155;
  const size = () => cat.getBoundingClientRect().width || 96;
  const height = () => cat.getBoundingClientRect().height || 96;
  const groundY = () => Math.max(0, window.innerHeight - height());
  function pose(name) { cat.classList.remove('running', 'idling', 'loaf', 'dragging'); cat.classList.add(name); }
  function place() {
    x = Math.max(0, Math.min(window.innerWidth - size(), x));
    y = Math.max(0, Math.min(groundY(), y));
    cat.style.left = `${x}px`; cat.style.top = `${y}px`; cat.style.bottom = 'auto';
    cat.style.transform = `scaleX(${facing})`;
  }
  y = groundY(); place();
  window.addEventListener('pointermove', e => {
    pointerX = e.clientX; pointerY = e.clientY;
    const moved = Math.abs(pointerX-lastPointerX)>3 || Math.abs(pointerY-lastPointerY)>3;
    if (moved && !dragging) chasing = true;
    lastPointerX=pointerX; lastPointerY=pointerY;
  }, { passive: true });
  cat.addEventListener('pointerdown', e => {
    dragging = true; chasing = false; vy = 0; cat.classList.add('dragging');
    cat.setPointerCapture?.(e.pointerId);
    cat.dataset.grabX = String(e.clientX - x); cat.dataset.grabY = String(e.clientY - y); e.preventDefault();
  });
  cat.addEventListener('pointermove', e => {
    if (!dragging) return;
    const oldX=x; x=e.clientX-Number(cat.dataset.grabX||0); y=e.clientY-Number(cat.dataset.grabY||0);
    if (Math.abs(x-oldX)>1) facing=x>oldX?1:-1; place();
  });
  function release() {
    if (!dragging) return; dragging=false; cat.classList.remove('dragging'); vy=0;
    lastFrame=performance.now(); chasing=false; pose(y<groundY()-1?'running':'idling');
  }
  cat.addEventListener('pointerup', release); cat.addEventListener('pointercancel', release);
  window.addEventListener('resize',()=>{x=Math.min(x,window.innerWidth-size());y=Math.min(y,groundY());place()});
  function tick(now) {
    const dt=Math.min(.035,Math.max(0,(now-lastFrame)/1000)); lastFrame=now;
    if (!dragging) {
      if (y < groundY()-.5) {
        vy=Math.min(terminalVelocity,vy+gravity*dt); y=Math.min(groundY(),y+vy*dt);
        if(y>=groundY()){vy=0;pose('idling')} else if(!reduced)pose('running');
      } else {
        vy=0;
        if(chasing && chaseSpeed>0){
          const targetX=pointerX-size()*.45, dx=targetX-x;
          if(Math.abs(dx)>22){const step=Math.sign(dx)*Math.min(Math.abs(dx),chaseSpeed*dt);x+=step;facing=step>=0?1:-1;if(!cat.classList.contains('running'))pose('running')}
          else {chasing=false;pose('idling')}
        } else if(!cat.classList.contains('idling')) pose('idling');
      }
      place();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
