/* NavBlue — motor único de scroll: UM relógio para spine, rider, hero e HUD.
   pSmooth = progresso [0..1] suavizado; kmh = velocidade real do scroll
   mapeada para km/h fictício (o "velocímetro do rolê").
   Hooks de teste determinístico: ?progress=0..1 (congela), ?motion=reduce,
   ?debug=fps. */

const qs = new URLSearchParams(location.search);

export const forcedProgress = qs.has('progress')
  ? Math.min(1, Math.max(0, parseFloat(qs.get('progress')) || 0))
  : null;

export const reduceMotion =
  matchMedia('(prefers-reduced-motion: reduce)').matches || qs.get('motion') === 'reduce';
if (qs.get('motion') === 'reduce') document.documentElement.classList.add('force-reduce-motion');

let p = 0, pSmooth = 0, vSmooth = 0, kmh = 0;
let lastY = scrollY, lastT = performance.now();
const subs = [];

export function onTick(cb){ subs.push(cb); }
export function progress(){ return pSmooth; }
export function speedKmh(){ return kmh; }

function maxScroll(){
  return Math.max(1, document.documentElement.scrollHeight - innerHeight);
}

let rafId = null;
function frame(now){
  p = forcedProgress ?? (scrollY / maxScroll());
  const dt = Math.max(1, now - lastT);
  const inst = Math.abs(scrollY - lastY) / dt * 1000;   // px/s
  lastY = scrollY; lastT = now;
  vSmooth += (inst - vSmooth) * 0.08;
  pSmooth += (p - pSmooth) * 0.12;
  if (forcedProgress != null){ pSmooth = forcedProgress; vSmooth = 0; }
  kmh = Math.min(120, Math.round(vSmooth / 14));

  for (const cb of subs) cb(pSmooth, kmh, now);
  fpsTick(now);

  /* dorme quando assentado — acorda no próximo scroll/resize */
  if (Math.abs(p - pSmooth) < 0.0005 && vSmooth < 1){ rafId = null; return; }
  rafId = requestAnimationFrame(frame);
}

export function wake(){
  if (rafId == null){ lastT = performance.now(); lastY = scrollY; rafId = requestAnimationFrame(frame); }
}

addEventListener('scroll', wake, {passive:true});
addEventListener('resize', wake, {passive:true});
document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });

if (forcedProgress != null){
  /* posiciona o documento no ponto pedido após o layout assentar */
  requestAnimationFrame(() => scrollTo(0, forcedProgress * maxScroll()));
}

/* ---------- degradação adaptativa: frame-time médio > 22ms por ~2s → perf-lite ---------- */
let slow = 0, lastFrame = 0;
function perfTick(now){
  if (lastFrame){
    const ft = now - lastFrame;
    slow = ft > 22 ? slow + ft : 0;
    if (slow > 2000 && !document.documentElement.classList.contains('perf-lite')){
      document.documentElement.classList.add('perf-lite');
    }
  }
  lastFrame = now;
}

/* ---------- ?debug=fps ---------- */
let fpsEl = null, fpsN = 0, fpsT = 0;
if (qs.get('debug') === 'fps'){
  fpsEl = document.createElement('div');
  fpsEl.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:999;font:12px monospace;color:#0f0;background:rgba(0,0,0,.6);padding:4px 8px;border-radius:4px';
  document.body.appendChild(fpsEl);
}
function fpsTick(now){
  perfTick(now);
  if (!fpsEl) return;
  fpsN++;
  if (now - fpsT > 500){
    fpsEl.textContent = Math.round(fpsN * 1000 / (now - fpsT)) + ' fps';
    fpsN = 0; fpsT = now;
  }
}

wake();
