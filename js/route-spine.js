/* NavBlue — rota-espinha: polyline SVG contínua que conecta as seções como
   uma rota de navegação, desenhando-se com o scroll. Gerada por medição das
   seções (re-mede em resize/fonts/idioma). Waypoints = ícones de manobra
   reais do firmware; "executam" quando a cabeça da rota os alcança.
   Por frame: apenas 1 escrita de stroke-dashoffset + toggles de classe. */
import { onTick, reduceMotion, wake } from './scroll.js';

const SECTIONS = [...document.querySelectorAll('section[data-km]')];
const NS = 'http://www.w3.org/2000/svg';

let overlay, svg, glowPath, basePath, progPath, grad;
let markers = [];        // {el, sec, len, reached}
let table = [];          // amostras {len, y} — y é monotônico crescente
let total = 0;

const iconCache = {};
export function loadIcon(name){
  if (!iconCache[name]) iconCache[name] =
    fetch('assets/man_' + name + '.svg').then(r => r.ok ? r.text() : '').catch(() => '');
  return iconCache[name];
}

function anchorFor(sec, vw){
  const narrow = vw < 680;
  const wide = vw >= 1100;
  const gutter = wide ? Math.max(34, (vw - 1080) / 2 - 46) : 26;
  const xL = narrow ? 20 : gutter;
  const xR = narrow ? 20 : vw - gutter;
  const x = sec.dataset.side === 'right' ? xR : xL;
  const y = sec.offsetTop + Math.min(sec.offsetHeight * .32, 280);
  return {x, y};
}

function lenAtY(y){
  if (!table.length) return 0;
  if (y <= table[0].y) return 0;
  const last = table[table.length - 1];
  if (y >= last.y) return last.len;
  let lo = 0, hi = table.length - 1;
  while (hi - lo > 1){
    const mid = (lo + hi) >> 1;
    if (table[mid].y < y) lo = mid; else hi = mid;
  }
  const a = table[lo], b = table[hi];
  const f = (y - a.y) / Math.max(1e-6, b.y - a.y);
  return a.len + (b.len - a.len) * f;
}

function build(){
  const vw = document.documentElement.clientWidth;
  const docH = document.documentElement.scrollHeight;
  overlay.style.height = docH + 'px';
  svg.setAttribute('viewBox', '0 0 ' + vw + ' ' + docH);

  const hero = document.getElementById('hero');
  const pts = SECTIONS.map(s => anchorFor(s, vw));
  /* a spine nasce DENTRO da zona da estrada do hero (onde a rota 3D some
     no clip) e materializa com fade — lê como continuação da rota em
     qualquer largura, sem depender de projeção 3D */
  const heroBottom = hero.offsetTop + hero.offsetHeight;
  const start = {x: vw / 2, y: heroBottom - 170};
  const fade = 'linear-gradient(180deg,transparent ' + (start.y + 20) + 'px,#000 ' + (start.y + 230) + 'px)';
  svg.style.maskImage = fade;
  svg.style.webkitMaskImage = fade;
  const all = [start, ...pts];

  let d = 'M ' + all[0].x + ',' + all[0].y;
  for (let i = 1; i < all.length; i++){
    const a = all[i - 1], b = all[i];
    const dy = (b.y - a.y) * .5;          // controles verticais → y monotônico
    d += ' C ' + a.x + ',' + (a.y + dy) + ' ' + b.x + ',' + (b.y - dy) + ' ' + b.x + ',' + b.y;
  }
  for (const path of [glowPath, basePath, progPath]) path.setAttribute('d', d);

  grad.setAttribute('y1', start.y);
  grad.setAttribute('y2', docH);

  total = progPath.getTotalLength();
  progPath.style.strokeDasharray = total + ' ' + total;

  table = [];
  const N = 200;
  for (let i = 0; i <= N; i++){
    const pt = progPath.getPointAtLength(total * i / N);
    table.push({len: total * i / N, y: pt.y});
  }

  markers.forEach((m, i) => {
    const pt = pts[i];
    m.el.style.transform = 'translate(' + pt.x + 'px,' + pt.y + 'px)';
    m.len = lenAtY(pt.y);
  });

  if (reduceMotion){
    progPath.style.strokeDashoffset = 0;
    markers.forEach(m => m.el.classList.add('reached'));
  } else {
    wake();
  }
  document.dispatchEvent(new CustomEvent('navblue:spine'));
}

/* dados vivos da rota para o rider */
export function spineData(){
  return total ? {path: progPath, markers, lenAtY, total} : null;
}

let debounceId = null;
function rebuild(){
  clearTimeout(debounceId);
  debounceId = setTimeout(() => requestAnimationFrame(build), 120);
}

export async function initSpine(){
  if (!SECTIONS.length) return;

  overlay = document.createElement('div');
  overlay.className = 'spine-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'spine');
  svg.setAttribute('preserveAspectRatio', 'none');

  const defs = document.createElementNS(NS, 'defs');
  grad = document.createElementNS(NS, 'linearGradient');
  grad.setAttribute('id', 'spineGrad');
  grad.setAttribute('gradientUnits', 'userSpaceOnUse');
  grad.setAttribute('x1', '0'); grad.setAttribute('x2', '0');
  const s1 = document.createElementNS(NS, 'stop');
  s1.setAttribute('offset', '0'); s1.setAttribute('stop-color', '#00aeef');
  const s2 = document.createElementNS(NS, 'stop');
  s2.setAttribute('offset', '1'); s2.setAttribute('stop-color', '#65ebe2');
  grad.append(s1, s2);
  defs.appendChild(grad);
  svg.appendChild(defs);

  glowPath = document.createElementNS(NS, 'path');
  glowPath.setAttribute('class', 'spine-glow');
  basePath = document.createElementNS(NS, 'path');
  basePath.setAttribute('class', 'spine-base');
  progPath = document.createElementNS(NS, 'path');
  progPath.setAttribute('class', 'spine-progress');
  svg.append(glowPath, basePath, progPath);
  overlay.appendChild(svg);

  for (const sec of SECTIONS){
    const el = document.createElement('div');
    el.className = 'km-marker';
    el.innerHTML = '<span class="wp-ring"></span><span class="wp-ic"></span>';
    overlay.appendChild(el);
    markers.push({el, sec, len: 0, reached: false});
    loadIcon(sec.dataset.man).then(txt => { el.querySelector('.wp-ic').innerHTML = txt; });
  }

  document.body.appendChild(overlay);
  build();

  addEventListener('resize', rebuild, {passive:true});
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(rebuild);
  document.addEventListener('navblue:lang', rebuild);

  if (reduceMotion) return;
  onTick(() => {
    const atEnd = scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
    const len = atEnd ? total : lenAtY(scrollY + innerHeight * .55);
    progPath.style.strokeDashoffset = Math.max(0, total - len);
    for (const m of markers){
      const reached = len >= m.len - 2;
      if (reached !== m.reached){
        m.reached = reached;
        m.el.classList.toggle('reached', reached);
      }
    }
  });
}
