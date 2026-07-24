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
const doneMan = document.getElementById('doneMan');

let curState = 'stateIdle';

/* ---------- silhuetas (também são o seletor de device em stateReady) ---------- */
function updateSils(){
  const name = (deviceName?.textContent || '').trim();
  const hit = DEV_MAP.find(d => name.includes(d.match));
  const selectable = curState === 'stateReady';
  sils.forEach(sil => {
    const isHit = hit && sil.dataset.dev === hit.id;
    sil.classList.toggle('lit', !!isHit);
    /* sem device identificado em stateReady → candidatas pulsam até a escolha */
    sil.classList.toggle('maybe', !hit && selectable);
    sil.setAttribute('tabindex', selectable ? '0' : '-1');
    sil.setAttribute('aria-disabled', String(!selectable));
  });
  if (strip){
    strip.classList.toggle('active', selectable || !!hit);
    strip.classList.toggle('selectable', selectable);
  }
  if (deviceName) deviceName.classList.toggle('dn-live', selectable && !!hit);
}

if (deviceName){
  new MutationObserver(updateSils).observe(deviceName, {childList: true, characterData: true, subtree: true});
}

/* clique/teclado na silhueta = proxy para o botão real que o script esptool
   gera em #deviceOptions (data-build-id) — a lógica de seleção roda intacta */
function selectDev(sil){
  if (curState !== 'stateReady') return;
  const btn = document.querySelector('#deviceOptions [data-build-id="' + sil.dataset.dev + '"]');
  if (btn) btn.click();
}
sils.forEach(sil => {
  sil.setAttribute('role', 'button');
  sil.addEventListener('click', () => selectDev(sil));
  sil.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); selectDev(sil); }
  });
});

/* ---------- ícone de chegada no done ---------- */
if (doneMan){
  fetch('assets/man_arrive.svg').then(r => r.ok ? r.text() : '').catch(() => '')
    .then(t => { doneMan.innerHTML = t; });
}

/* ---------- estados ---------- */
document.addEventListener('installer:state', e => {
  curState = e.detail;
  updateSils();
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
      }
    } else setTimeout(apply, 60);
  };
  apply();
}
