/* NavBlue — device-rider: a réplica mini do AMOLED cavalga a rota-espinha.
   O HUD dele é dirigido pelos waypoints da página: mostra a manobra da
   PRÓXIMA seção, a "distância" até ela (px≈m) e a velocidade real do
   scroll em km/h. Aparece após o showcase (#device) — lá o device grande
   é o momento "câmera aproxima"; o rider assume dali em diante.
   Mobile (<680px) e reduced-motion: sem rider (a spine estática basta). */
import { onTick, reduceMotion, speedKmh } from './scroll.js';
import { spineData, loadIcon } from './route-spine.js';

const SIZE = 124;

export function initRider(){
  if (reduceMotion) return;

  const el = document.createElement('div');
  el.className = 'rider';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<div class="rider-screen">' +
      '<div class="rd-man"></div>' +
      '<div class="rd-dist">—</div>' +
      '<div class="rd-kmh"><span>0</span><small>KM/H</small></div>' +
    '</div>';
  document.body.appendChild(el);
  const manEl = el.querySelector('.rd-man');
  const distEl = el.querySelector('.rd-dist');
  const kmhEl = el.querySelector('.rd-kmh span');

  let showFromY = Infinity, embTop = -1, embBottom = -1;
  function measure(){
    const dev = document.getElementById('device');
    showFromY = dev ? dev.offsetTop + dev.offsetHeight * .8 : Infinity;
    const emb = document.querySelector('.demo-embed');
    if (emb){
      /* offsetTop seria relativo ao .wrap (position:relative) — usar coords de documento */
      const r = emb.getBoundingClientRect();
      embTop = r.top + scrollY - 70;
      embBottom = r.top + scrollY + r.height + 70;
    } else { embTop = -1; embBottom = -1; }
  }
  measure();
  document.addEventListener('navblue:spine', measure);
  document.addEventListener('navblue:embed', measure);

  let visible = false, curMan = null, lastDist = -1, lastKmh = -1, swapping = false;

  function setMan(name){
    if (curMan === name || swapping) return;
    curMan = name; swapping = true;
    manEl.classList.add('swap');
    loadIcon(name).then(txt => {
      manEl.innerHTML = txt;
      manEl.classList.remove('swap');
      swapping = false;
    });
  }

  onTick((pS, kmh) => {
    /* só cavalga onde existe gutter de verdade para a rota (≥1100px) */
    if (innerWidth < 1100){ if (visible){ visible = false; el.classList.remove('on'); } return; }
    const s = spineData();
    if (!s) return;

    const yHead = scrollY + innerHeight * .55;
    const show = yHead > showFromY;
    if (show !== visible){ visible = show; el.classList.toggle('on', show); }
    if (!show) return;

    const atEnd = scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
    const len = atEnd ? s.total : Math.min(s.total, s.lenAtY(yHead));
    const pt = s.path.getPointAtLength(len);
    const x = Math.min(innerWidth - SIZE - 10, Math.max(10, pt.x - SIZE / 2));
    el.style.transform = 'translate3d(' + x + 'px,' +
      (pt.y - scrollY - SIZE / 2) + 'px,0)';
    /* fantasma enquanto cruza a demo embutida — não atropelar o replay */
    el.classList.toggle('ghost', embTop >= 0 && pt.y > embTop && pt.y < embBottom);

    /* próxima manobra = primeiro waypoint à frente */
    let next = null;
    for (const m of s.markers){ if (m.len > len - 4){ next = m; break; } }
    if (next){
      setMan(next.sec.dataset.man);
      const meters = Math.max(0, Math.round((next.len - len) / 10) * 10);
      if (meters !== lastDist){ lastDist = meters; distEl.innerHTML = meters + '<small>m</small>'; }
    } else {
      setMan('arrive');
      if (lastDist !== 0){ lastDist = 0; distEl.innerHTML = '0<small>m</small>'; }
    }
    if (kmh !== lastKmh){ lastKmh = kmh; kmhEl.textContent = kmh; }
  });
}
