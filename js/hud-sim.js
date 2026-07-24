/* NavBlue — simulação do HUD do showcase, fiel ao device real:
   mapa heading-up desliza sob o marcador FIXO; o mundo gira nas curvas
   (bearing suavizado), a distância conta até a próxima manobra, a
   velocidade varia por trecho e a rua corrente aparece em amarelo.
   Roda só com o showcase visível; reduced-motion = frame estático digno. */
import { reduceMotion } from './scroll.js';
import { loadIcon } from './route-spine.js';

const PTS = [
  {x:105, y:375}, {x:105, y:240}, {x:195, y:240},
  {x:195, y:105}, {x:150, y:60},  {x:105, y:15},
];
const SEGS = [
  {street:'Av. Atlântica',       v:[12, 38], nextMan:'turn_right'},
  {street:'R. Siqueira Campos',  v:[38, 52], nextMan:'turn_left'},
  {street:'R. Barata Ribeiro',   v:[52, 88], nextMan:'turn_slight_left'},
  {street:'Av. Princesa Isabel', v:[88, 61], nextMan:'continue_straight'},
  {street:'R. Duvivier',         v:[61, 30], nextMan:'arrive'},
];
const M_PER_U = 3;        /* 1 unidade do mundo ≈ 3 m */
const TIME_SCALE = 8;     /* replay acelerado (showcase) */
const AX = 99, AY = 129;  /* âncora do marcador na tela (fixo) */

/* geometria por segmento */
for (let i = 0; i < SEGS.length; i++){
  const a = PTS[i], b = PTS[i + 1];
  const dx = b.x - a.x, dy = b.y - a.y;
  SEGS[i].len = Math.hypot(dx, dy);
  SEGS[i].bearing = Math.atan2(dx, -dy) * 180 / Math.PI;  /* 0° = norte/cima */
}

export function initHudSim(){
  const world = document.getElementById('dh-world');
  const arrowEl = document.getElementById('hud-arrow');
  const distEl = document.getElementById('hud-dist');
  const speedEl = document.getElementById('hud-speed-v');
  const streetEl = document.getElementById('hud-street');
  if (!world || !arrowEl) return;

  let manShown = null, swapping = false;
  function setMan(name){
    if (manShown === name || swapping) return;
    manShown = name; swapping = true;
    arrowEl.classList.add('swap');
    loadIcon(name).then(txt => {
      setTimeout(() => {
        arrowEl.innerHTML = txt;
        arrowEl.classList.remove('swap');
        swapping = false;
      }, 180);
    });
  }

  function setWorld(px, py, bearing){
    world.setAttribute('transform',
      'rotate(' + (-bearing) + ' ' + AX + ' ' + AY + ') translate(' + (AX - px) + ' ' + (AY - py) + ')');
  }

  function frameState(si, du){
    const s = SEGS[si], a = PTS[si], b = PTS[si + 1];
    const f = Math.min(1, du / s.len);
    return {
      px: a.x + (b.x - a.x) * f,
      py: a.y + (b.y - a.y) * f,
      kmh: s.v[0] + (s.v[1] - s.v[0]) * f,
      distM: Math.max(0, Math.round((s.len - du) * M_PER_U / 10) * 10),
      seg: s,
    };
  }

  function paintHud(st, iconOverride){
    setMan(iconOverride || st.seg.nextMan);
    distEl.innerHTML = st.distM + '<small>m</small>';
    speedEl.textContent = Math.round(st.kmh);
    if (streetEl) streetEl.textContent = st.seg.street;
  }

  /* ---------- reduced-motion: frame estático no meio da curva ---------- */
  if (reduceMotion){
    const st = frameState(2, SEGS[2].len * .4);
    setWorld(st.px, st.py, SEGS[2].bearing);
    paintHud(st);
    return;
  }

  /* ---------- loop vivo ---------- */
  let si = 0, du = 0, bS = SEGS[0].bearing;
  let running = false, rafId = null, lastT = 0;
  let arrivedAt = 0;   /* 0 = navegando; timestamp = em chegada */

  function angleDiff(a, b){
    let d = (a - b) % 360;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    return d;
  }

  function tick(now){
    if (!running){ rafId = null; return; }
    const dt = Math.min(.1, (now - lastT) / 1000);
    lastT = now;

    if (arrivedAt){
      if (now - arrivedAt > 1600){
        /* reinicia o rolê com fade */
        si = 0; du = 0; bS = SEGS[0].bearing; arrivedAt = 0;
        world.style.opacity = '1';
      }
    } else {
      const s = SEGS[si];
      const f = Math.min(1, du / s.len);
      const kmh = s.v[0] + (s.v[1] - s.v[0]) * f;
      du += (kmh / 10.8) * TIME_SCALE * dt;   /* km/h → unidades/s (1u=3m) */

      if (du >= s.len){
        if (si < SEGS.length - 1){ du -= s.len; si++; }
        else {
          const st = frameState(si, s.len);
          setWorld(st.px, st.py, bS);
          setMan('arrive');
          distEl.innerHTML = '0<small>m</small>';
          speedEl.textContent = '0';
          arrivedAt = now;
          world.style.opacity = '0';
        }
      }
      if (!arrivedAt){
        const st = frameState(si, du);
        bS += angleDiff(SEGS[si].bearing, bS) * Math.min(1, dt * 6);
        setWorld(st.px, st.py, bS);
        /* no arranque, mostra o depart por alguns metros */
        paintHud(st, (si === 0 && du < 18) ? 'depart' : null);
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  function start(){ if (!running){ running = true; lastT = performance.now(); rafId = requestAnimationFrame(tick); } }
  function stop(){ running = false; }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? start() : stop());
  }, {threshold: .12});
  io.observe(document.getElementById('device-stage'));
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });
}
