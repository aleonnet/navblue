/* NavBlue — orquestrador do index: nav, i18n (self-init), motor de scroll,
   reveals, hero e mini-HUD do showcase. Um único rAF (via scroll.js). */
import './nav.js';
import { reduceMotion } from './scroll.js';
import { initReveals } from './reveals.js';
import { initHero } from './hero.js';
import { initSpine } from './route-spine.js';

initReveals();
initHero();
initSpine();

/* ---------- mini-HUD (ícones de manobra reais do conjunto do firmware) ---------- */
const HUD_SCRIPT = [
  {icon:'depart',            from:600, spd:[0,38]},
  {icon:'turn_right',        from:350, spd:[38,46]},
  {icon:'continue_straight', from:900, spd:[46,108]},
  {icon:'turn_slight_left',  from:450, spd:[108,62]},
  {icon:'turn_left',         from:280, spd:[62,34]},
  {icon:'arrive',            from:120, spd:[34,0]}
];
const ICONS = {};
const arrowEl = document.getElementById('hud-arrow');
const distEl = document.getElementById('hud-dist');
const speedEl = document.getElementById('hud-speed-v');
const clockEl = document.getElementById('hud-clock');

function setClock(){
  const d = new Date();
  clockEl.textContent = String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}
setClock();
setInterval(setClock, 30000);

Promise.all(HUD_SCRIPT.map(s =>
  fetch('assets/man_' + s.icon + '.svg').then(r => r.ok ? r.text() : '').catch(() => '')
    .then(t => { ICONS[s.icon] = t; })
)).then(startHud);

function startHud(){
  if (reduceMotion){
    arrowEl.innerHTML = ICONS['turn_right'] || '';
    return;
  }
  let seg = 0, t = 0;
  const SEG_TICKS = 5;
  function tick(){
    const s = HUD_SCRIPT[seg];
    const u = t / SEG_TICKS;
    const dist = Math.max(0, Math.round(s.from * (1 - u) / 10) * 10);
    const spd = Math.round(s.spd[0] + (s.spd[1] - s.spd[0]) * u);
    if (t === 0) {
      arrowEl.classList.add('swap');
      setTimeout(() => {
        arrowEl.innerHTML = ICONS[s.icon] || '';
        arrowEl.classList.remove('swap');
      }, 220);
    }
    distEl.innerHTML = dist + '<small>m</small>';
    speedEl.textContent = spd;
    t++;
    if (t > SEG_TICKS) { t = 0; seg = (seg + 1) % HUD_SCRIPT.length; }
  }
  tick();
  setInterval(tick, 1100);
}
