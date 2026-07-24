/* NavBlue — hero night-ride: parallax por camadas (tick único), showcase
   do device e velocímetro que responde à velocidade real do scroll. */
import { onTick, reduceMotion } from './scroll.js';

const layers = [...document.querySelectorAll('#hero [data-depth]')];
const stage = document.getElementById('device-stage');
const needle = document.getElementById('speedo-needle');
const speedoV = document.getElementById('speedo-v');

let stageTop = 0, stageH = 1;
function measure(){
  if (!stage) return;
  const r = stage.getBoundingClientRect();
  stageTop = r.top + scrollY;
  stageH = r.height || 1;
}

let lastKmh = -1;
export function initHero(){
  if (reduceMotion) return;
  measure();
  addEventListener('resize', measure, {passive:true});
  document.addEventListener('navblue:lang', () => requestAnimationFrame(measure));

  onTick((pS, kmh) => {
    const y = scrollY;
    if (y < innerHeight * 1.2){
      for (const l of layers){
        l.style.transform = 'translate3d(0,' + (y * parseFloat(l.dataset.depth)) + 'px,0)';
      }
    }
    /* parallax do showcase — pré-medido, zero getBoundingClientRect por frame */
    if (stage){
      const prog = (innerHeight - (stageTop - y)) / (innerHeight + stageH);
      if (prog > 0 && prog < 1.2){
        stage.style.transform = 'translate3d(0,' + ((prog - .5) * -44) + 'px,0)';
      }
    }
    /* velocímetro: agulha -90°..+90° (semicírculo do arco) para 0..120 km/h */
    if (kmh !== lastKmh){
      lastKmh = kmh;
      if (needle) needle.style.transform = 'rotate(' + (kmh * 1.5 - 90) + 'deg)';
      if (speedoV) speedoV.textContent = kmh;
    }
  });
}
