# Redesign "Rota Noturna" — a página é um rolê

**Data**: 2026-07-24 · **Versão**: Site 1.2.0 · **Branch**: `redesign/rota-noturna` (31+ commits, F0–F7 + ondas de refinamento)

## Objetivo

Elevar as 3 páginas do site a nível "mind blowing" mantendo vanilla + zero build + GitHub Pages, bilíngue PT-BR/EN, com a lógica esptool/manifest do instalador intocada. Referência de disciplina: `atlasfile-website` (metáfora do produto como física da página, motor único de scroll, tokens rigorosos, hooks determinísticos).

## Conceito central

**Scroll = pilotar uma rota noturna.** Uma polyline SVG contínua (rota-espinha) conecta as seções como waypoints de navegação — numeradas "KM 01…07" com os ícones de manobra reais do firmware — desenhando-se em gradiente azul→teal conforme o scroll. Um mini-AMOLED (rider) cavalga a rota mostrando a manobra da próxima seção, a distância e a velocidade real do scroll em km/h. Dark-only é decisão de arte (a marca é o rolê noturno).

## Entregas

### Fundações (F0–F3)
- **Higiene**: legados `index-v1/v2.html` e 7 bins órfãos removidos (~12MB); og:image corrigida (repo antigo) e regravada 1200×630 (60KB); favicon.svg + apple-touch-icon; derivados WebP (`<picture>`).
- **Design system**: `css/tokens.css` (dark-only) + `base.css` compartilhados pelas 3 páginas; logo via `<symbol>`; nav mobile com hamburger acessível; IBM Plex Mono self-hosted; demo sem Google Fonts (exceção MapLibre CDN documentada `ABSOLUTE-URL`).
- **i18n vanilla** (`js/i18n.js`): PT canônico + dicionário EN (~170 chaves), `data-i18n`/-html/-attr, `?lang=`, localStorage, `window.NB_I18N.t()` para os literais de UI do installer (única categoria de edição no script).
- **Motor único de scroll** (`js/scroll.js`): pSmooth, km/h do scroll, rAF que dorme, `?progress=`/`?motion=`/`?debug=fps`, degradação `perf-lite`.

### Landing (F4–F5 + ondas)
- Rota-espinha medida por seção (re-mede em resize/fonts/idioma), tabela y→len, 1 escrita de dashoffset/frame; waypoints que "executam"; nasce da zona da estrada com fade (junção com o hero); pulso do hero mascarado para nascer no marcador.
- Device-rider ≥1100px com HUD por waypoints; fantasma sobre a demo embutida.
- Hero: 3 camadas de estrelas, faróis CSS, velocímetro real (-90°..+90°), título gradiente.
- Showcase HUD fiel ao device (`js/hud-sim.js`): mapa heading-up desliza sob marcador fixo, bearing suavizado, distância/velocidade por trecho, rua em amarelo, perspectiva 32°.
- Demo embutida via facade (iframe só no clique + fullscreen; `?embed=1`).
- Cenas do problema: cockpit de moto ilustrado (guidão gaivota, espelhos, gauge, tanque com tampa, estrada noturna), celular com mini-mapa na barra esquerda, e furto com mão-luva em duas poses (aberta por trás → grab → sai) — braço/palma persistentes, palma∪polegar em path único, polegar fechado clipado pelo celular.

### Installer (F6 + ondas)
- Hooks aditivos únicos no script: `CustomEvent installer:state` + `window.__nbShowState` (hook `?state=`/`?pct=`).
- Silhuetas dos 3 devices = seletor clicável em `stateReady` (proxy para os botões reais `data-build-id`); nome do device "vivo"; fileira de botões oculta (card compacto).
- Estado de gravação compacto: barra + porcentagem Orbitron 28px (gráfico de rota removido por feedback).
- `man_arrive` verde no done. i18n completo.

## Decisões

- PT-BR canônico no HTML (público primário BR); EN via dicionário.
- Dark-only documentado no tokens.css; sem `[data-theme]`.
- Contrato intocável honrado: `manifest.json`, `lib/esptool-bundle.js`, fluxo JEDEC/flash/clock-sync — diff do bloco esptool = 2 hooks + literais `tr()`.
- Sem bump do `manifest.json` (versiona o firmware publicado, não o site).

## Validação

- Lighthouse mobile: index 95/100/100/100 · install 90/100/100/100.
- Zero erros de console nas 3 páginas; zero paths absolutos; `git diff main -- manifest.json lib/` vazio.
- Hooks determinísticos verificados; reduced-motion = versão estática digna; validações visuais de detalhe em crop 4× escala de device.
- **Flash real** em Waveshare AMOLED 1.75C: detecção JEDEC → gravação 100% → boot (validado pelo usuário em 2026-07-24).
- Aprovação final do usuário em 2026-07-24.
