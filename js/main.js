/* NavBlue — orquestrador do index: nav, i18n (self-init), motor de scroll,
   reveals, hero e mini-HUD do showcase. Um único rAF (via scroll.js). */
import './nav.js';
import { initReveals } from './reveals.js';
import { initHero } from './hero.js';
import { initSpine } from './route-spine.js';
import { initRider } from './rider.js';
import { initHudSim } from './hud-sim.js';

initReveals();
initHero();
initSpine();
initRider();

/* ?og=1 — composição limpa para o card social (screenshot do hero) */
if (new URLSearchParams(location.search).get('og') === '1'){
  document.documentElement.classList.add('og-shot');
}

/* ---------- demo viva in-place (facade: iframe só nasce no clique) ---------- */
const demoCard = document.querySelector('#demo-s .demo-card');
if (demoCard){
  demoCard.addEventListener('click', e => {
    e.preventDefault();
    const lang = document.documentElement.lang.startsWith('pt') ? 'pt' : 'en';
    const wrap = document.createElement('div');
    wrap.className = 'demo-embed';
    wrap.innerHTML =
      '<iframe src="demo.html?embed=1&lang=' + lang + '" title="NavBlue Guidance Simulation" allow="fullscreen"></iframe>' +
      '<button type="button" class="demo-fs" aria-label="' +
        (lang === 'pt' ? 'Tela cheia' : 'Fullscreen') + '" title="' +
        (lang === 'pt' ? 'Tela cheia' : 'Fullscreen') + '">⛶</button>';
    demoCard.replaceWith(wrap);
    document.dispatchEvent(new CustomEvent('navblue:embed'));
    const iframe = wrap.querySelector('iframe');
    wrap.querySelector('.demo-fs').addEventListener('click', () => {
      const req = iframe.requestFullscreen || iframe.webkitRequestFullscreen;
      if (req) req.call(iframe);
    });
  });
}

/* ---------- mini-HUD do showcase: simulação fiel ao device (hud-sim.js) ---------- */
const clockEl = document.getElementById('hud-clock');
function setClock(){
  const d = new Date();
  clockEl.textContent = String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}
setClock();
setInterval(setClock, 30000);

initHudSim();
