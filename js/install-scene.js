/* NavBlue — cena "abastecer o device" (install.html).
   Zero-touch sobre a lógica esptool: lê o DOM que a lógica já escreve
   (#deviceName, #progressPct) via MutationObserver e escuta o evento
   installer:state (REDESIGN HOOK). Hooks de teste: ?state=stateX&pct=N. */

const DEV_MAP = [
  {match: 'VIEWE',  id: 'viewe-smartring-plus'},
  {match: '1.75C',  id: 'waveshare-amoled-175C'},
  {match: '2.16',   id: 'waveshare-amoled-216'},
];

const strip = document.getElementById('devStrip');
const sils = strip ? [...strip.querySelectorAll('.dev-sil')] : [];
const deviceName = document.getElementById('deviceName');
const progressPct = document.getElementById('progressPct');
const frProg = document.getElementById('frProg');
const frDot = document.getElementById('frDot');
const doneMan = document.getElementById('doneMan');

let curState = 'stateIdle';

/* ---------- silhuetas ---------- */
function updateSils(){
  const name = (deviceName?.textContent || '').trim();
  const hit = DEV_MAP.find(d => name.includes(d.match));
  sils.forEach(sil => {
    const isHit = hit && sil.dataset.dev === hit.id;
    sil.classList.toggle('lit', !!isHit);
    /* sem device identificado em stateReady → candidatas pulsam até a escolha */
    sil.classList.toggle('maybe', !hit && curState === 'stateReady');
  });
  if (strip) strip.classList.toggle('active', curState === 'stateReady' || !!hit);
}

if (deviceName){
  new MutationObserver(updateSils).observe(deviceName, {childList: true, characterData: true, subtree: true});
}

/* ---------- rota-progresso do flash ---------- */
let frTotal = 0;
function updateFlashRoute(){
  if (!frProg) return;
  if (!frTotal){
    frTotal = frProg.getTotalLength();
    frProg.style.strokeDasharray = frTotal + ' ' + frTotal;
  }
  const pct = parseInt(progressPct?.textContent, 10) || 0;
  const len = frTotal * Math.min(100, Math.max(0, pct)) / 100;
  frProg.style.strokeDashoffset = frTotal - len;
  const pt = frProg.getPointAtLength(len);
  frDot.setAttribute('cx', pt.x);
  frDot.setAttribute('cy', pt.y);
}

if (progressPct){
  new MutationObserver(updateFlashRoute).observe(progressPct, {childList: true, characterData: true, subtree: true});
}

/* ---------- ícone de chegada no done ---------- */
if (doneMan){
  fetch('assets/man_arrive.svg').then(r => r.ok ? r.text() : '').catch(() => '')
    .then(t => { doneMan.innerHTML = t; });
}

/* ---------- estados ---------- */
document.addEventListener('installer:state', e => {
  curState = e.detail;
  updateSils();
  if (curState === 'stateFlashing'){ frTotal = 0; updateFlashRoute(); }
});

/* ---------- hooks de teste ?state= / ?pct= (nunca usados no fluxo real) ---------- */
const qs = new URLSearchParams(location.search);
const qState = qs.get('state');
if (qState){
  const apply = () => {
    if (typeof window.__nbShowState === 'function'){
      window.__nbShowState(qState);
      const pct = qs.get('pct');
      if (pct != null && progressPct){
        progressPct.textContent = pct + '%';
        const fill = document.getElementById('progressFill');
        if (fill) fill.style.width = pct + '%';
        updateFlashRoute();
      }
    } else setTimeout(apply, 60);
  };
  apply();
}
