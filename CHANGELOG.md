# Changelog

Todas as alterações notáveis deste repositório (instalador web + firmware publicado) serão documentadas aqui.

## [Site 1.2.2] — 2026-07-24

### Demo

- **Fix: HUD cobria o marcador no embed mobile** — no iframe 4/3 da landing em iPhone (~353×258), o card fixo do topo-direita ficava exatamente sobre o marcador centralizado pela câmera. Novo `HudOcclusion` em `demo.html`: quando o card invade a região central, a câmera (chase, top e skip da intro) reserva `padding.right` medido do retângulo real do `#device-hud` e enquadra o rider na faixa livre à esquerda (padrão de puck deslocado dos apps de navegação). Cap de 60% da largura protege o `jumpTo` do MapLibre em telas minúsculas; recálculo no resize; desktop inalterado (padding 0 quando o card não cruza o centro).

## [Site 1.2.1] — 2026-07-24

### Site

- **Página 404 "fora da rota"**: a rota percorrida se parte num rasgo com o marcador pulsando no fim, "404" em Orbitron gradiente, status "Recalculando rota…" piscando e CTA "Voltar à rota". 100% autocontida (o GitHub Pages a serve em qualquer profundidade de path — CSS inline, fontes/favicon via URL absoluta do próprio site com fallback de sistema), bilíngue via o mesmo `localStorage` do site, `prefers-reduced-motion` e `noindex`.

## [Site 1.2.0] — 2026-07-24

Redesign completo **"Rota Noturna — a página é um rolê"** (plano em `docs/planos_concluidos/redesign-rota-noturna.plan.md`).

### Landing

- **Rota-espinha**: polyline SVG contínua conecta as seções como waypoints de navegação ("KM 01…07" com os ícones de manobra reais do firmware), desenhando-se em gradiente azul→teal conforme o scroll; nasce da zona da estrada do hero com fade; waypoints "executam" ao serem alcançados.
- **Device-rider** (≥1100px): mini-AMOLED cavalga a rota mostrando a manobra da próxima seção, distância e a velocidade real do scroll em km/h; vira fantasma ao cruzar a demo embutida.
- **Hero elevado**: 3 camadas de estrelas com paralaxe, faróis passando na estrada 3D, velocímetro dirigido pelo scroll, título com gradiente azul→teal; pulso da rota do hero nasce no marcador (máscara SMIL sincronizada).
- **Showcase HUD fiel ao device**: mapa heading-up desliza sob o marcador fixo com bearing suavizado nas curvas, distância em metros reais do trajeto, velocidade por trecho, nome da rua em amarelo e perspectiva 3D — roda só com a seção visível.
- **Demo embutida** (facade): o card vira `<iframe demo.html?embed=1>` apenas no clique, com botão de fullscreen — custo zero no load.
- **Cenas do problema redesenhadas**: cockpit de moto ilustrado (guidão gaivota, espelhos, gauge com ponteiro, tanque com tampa, estrada noturna), celular com mini-mapa de navegação na barra esquerda, e furto com mão-luva em duas poses consistentes (entra aberta por trás, fecha no bote, sai com o aparelho).
- Nav mobile com hamburger acessível (antes os links sumiam em ≤680px).

### Instalador web

- **Silhuetas dos 3 devices viram o seletor**: clicáveis em `stateReady` (proxy para os botões reais `data-build-id` — lógica esptool intacta); nome do device "vivo" pulsando; card mais compacto (fileira de botões oculta).
- **Estado de gravação compacto**: barra de progresso + porcentagem em Orbitron.
- Chegada com `man_arrive` verde; hooks de teste `?state=stateX&pct=N` cobrem os 8 estados sem hardware.
- Diff do bloco esptool: **2 hooks aditivos** (`installer:state`, `__nbShowState`) + literais de UI via i18n — nada mais.

### Infra e A11y

- **Design system compartilhado**: `css/tokens.css` (dark-only por decisão de arte) + `css/base.css` nas 3 páginas; logo via `<symbol>`; IBM Plex Mono self-hosted; demo sem Google Fonts (MapLibre CDN documentado como exceção `ABSOLUTE-URL`).
- **i18n PT-BR/EN vanilla** (~170 chaves): PT canônico no HTML, `data-i18n`, switcher no nav, `?lang=`, persistência; literais do installer via `window.NB_I18N`.
- **Motor único de scroll**: rAF que dorme quando assentado; hooks determinísticos `?progress=`, `?motion=reduce`, `?debug=fps`, `?og=1`; degradação `perf-lite` (frame>22ms).
- `prefers-reduced-motion` em toda animação (versão estática digna); skip-link; `:focus-visible`.
- Higiene: `index-v1/v2.html` e 7 bins órfãos removidos (~12MB); og:image corrigida (repo antigo) e regravada 1200×630; favicon.svg; apple-touch-icon; screenshots com WebP + `<picture>`.
- Copy corrigido: instalador anunciado com os 3 devices (antes citava só o 1.75C).
- Lighthouse mobile: index 95/100/100/100 · install 90/100/100/100.

## [Site 1.1.3] — 2026-07-02

### Demo

- **Tipografia unificada com a landing e o app**: display Chakra Petch → **Orbitron** (a fonte dos números do HUD físico) e dígitos de instrumento do DeviceHUD (distância 44px e velocidade) também em Orbitron; IBM Plex Mono mantida na telemetria e no utilitário miúdo (ETA, badges, botões, atalhos). Mesmo híbrido aplicado ao template do gerador (`guidance-sim_cinematic.py` no repo do app).

## [Site 1.1.2] — 2026-07-01

### Demo

- **Subtítulo do intro responsivo**: "Guidance Simulation · Rio de Janeiro" quebra em duas linhas centralizadas (sem o ponto) abaixo de 700px, acompanhando o template do `guidance-sim_cinematic.py`.
- **Dados da rota atualizados**: `DATA` regenerado pela última execução do `guidance-sim_cinematic.py` (rota Rio Zona Sul com o waypoint do RioSul ajustado, 1354 frames), preservando as edições manuais da cópia publicada (favicon, link "← NavBlue", código SAT/Mapbox removido).

## [Site 1.1.1] — 2026-07-01

### Firmware publicado

- **Waveshare AMOLED 1.75C → v1.5.1** e **VIEWE SmartRing-Plus → v1.5.1** (sincronizados). Correções de responsividade: `indicate()` BLE, `decodePolyline` e dreno da fila BLE movidos para fora do loop de render (tasks FreeRTOS no Core 0), eliminando o congelamento de ~1–2 s com o BLE conectado; controle de brilho por arrasto vertical contínuo (com guarda anti-redundância no `setBrightness`); cache do logo em sprite. No SmartRing-Plus, correção da direção invertida do brilho (rotação de 180° do display com touch não rotacionado). Detalhes nos CHANGELOGs de cada firmware.
- `manifest.json`: ambos os builds atualizados para `v1.5.1`.

## [Site 1.1.0] — 2026-06-27

### Instalador web

- **Auto-detecção de device (VIEWE SmartRing-Plus ↔ Waveshare AMOLED 1.75C)**: ambos são ESP32-S3, então são distinguidos pelo **JEDEC ID do chip de flash** (`readFlashId()`), lido da ROM independente do firmware atual — VIEWE = fabricante `0x85` + 16MB, Waveshare = `0xC8` (GigaDevice) + 32MB. O `manifest.json` casa o build por `detect.flashSizeMB` (âncora estável) + `detect.flashManufacturer` (tolerante).
- **Override manual sempre visível** (VIEWE / Waveshare), pré-marcado no device detectado; se nada casar, o seletor aparece sem pré-seleção. `install.html` grava o binário do `selectedBuild` (nunca um índice fixo).
- **`manifest.json` multi-build**: de um build hardcoded para uma entrada por device (`id`, `name`, `version`, `detect`, `parts`).

### Firmware publicado

- **VIEWE SmartRing-Plus `1.5.0`** adicionado ao instalador; **Waveshare `1.4.1`** mantido.
- **Correção de brick (geração do `.bin`)**: o merge usava `--flash_size 32MB` fixo, que gravava um header de 32MB na VIEWE de 16MB → endereçamento de 4 bytes → não bootava. Os `build-web-installer.sh` agora espelham o `pio run -t upload` (`--flash-mode dio`, `--flash-freq 80m`, `--flash-size` real do board) e fazem **upsert** por `id` no manifest (sem um device sobrescrever o outro).

## [Site 1.0.1] — 2026-06-12

### Corrigido

- **Dessincronia entre o marcador do veículo e o rastro da rota no hero**: o `animateMotion` usava `calcMode="linear"` (tempo igual por segmento do path) enquanto o rastro avançava por distância, e veículo (SMIL) e rastro/pulso (CSS) rodavam em timelines distintas que divergiam com a aba em segundo plano. Agora as três animações compartilham a timeline SMIL do SVG com pacing por distância — sincronia garantida por construção.

## [Site 1.0.0] — 2026-06-12

### Site

- **Landing page do NavBlue** como nova raiz do site (`index.html`): hero parallax "night ride" com grid 3D animado e mock de navegação (rota com gradiente de progresso, pulso de energia e marcador do veículo), mini-clipe animado do problema (queda, chuva, furto), mock fiel do AMOLED 1.75" com mini-HUD vivo (ícones de manobra reais do firmware, vias com esmaecimento radial), telas reais do app nos passos e na seção Mapa do Brasil, recorte do device em rota (WebP com alpha), botões das lojas no padrão store-button e SEO/OG tags.
- **Instalador preservado** em `install.html` (conteúdo do antigo `index.html`; mudanças: grafia NavBlue, favicon e link "← NavBlue" de volta à landing).
- **Demo cinematográfica** publicada em `demo.html` (replay interativo da engine de navegação, gerado por `guidance-sim_cinematic.py` do app): chave Mapbox e opção SAT removidas; grafia NavBlue, favicon e link de volta.
- `README.md` reescrito para o novo propósito do repositório (site oficial com três páginas).

### Instalador web

- Sem mudanças funcionais no fluxo de flash; firmware publicado permanece `1.4.1`.

## [1.4.1] — 2026-05-05

### Firmware

- Binário publicado: `firmware/navblue_waveshare_v1.4.1.bin` (substitui `navblue_waveshare_v1.4.0.bin` no manifesto).
- `manifest.json` atualizado para versão **1.4.1** e caminho do `.bin` correspondente.
- Firmware Waveshare atualizado com:
  - correção da janela canônica de polyline em rotas com geometrias sobrepostas;
  - prioridade visual por progresso canônico de navegação;
  - fade preservado pelo progresso geométrico da janela recebida.

### Instalador web

- Sem mudanças funcionais na interface; publicação alinhada ao firmware `1.4.1`.

---

## [1.4.0] — 2026-04-30

### Firmware

- Binário publicado: `firmware/navblue_waveshare_v1.4.0.bin` (substitui `navblue_waveshare_v1.2.0.bin`).
- `manifest.json` atualizado para versão **1.4.0** e caminho do `.bin` correspondente.
- Firmware Waveshare atualizado com:
  - schema `FeatureInfoPB` tipado para roads v2;
  - renderização diferenciada de bridge, viaduct, tunnel e ford;
  - polyline de rota sempre como camada visual superior;
  - HUD de velocidade vermelho apenas com `speedLimit > 0`;
  - harness agregado `pio test` corrigido com suite Unity embarcada.

### Instalador web

- Sem mudanças funcionais na interface; publicação alinhada ao firmware `1.4.0`.

---

## [1.2.0] — 2026-04-26

### Firmware

- Binário publicado: `firmware/navblue_waveshare_v1.2.0.bin` (substitui `navblue_waveshare_v1.1.0.bin`).
- `manifest.json` atualizado para versão **1.2.0** e caminho do `.bin` correspondente.
- Firmware Waveshare atualizado com:
  - streaming BLE contínuo com métricas e controle de payload;
  - roads tile-aware no protocolo BLE, preservando compatibilidade com o contrato legado;
  - janela local de polyline com coloração por progresso/leg;
  - otimizações de renderização de roads e clipping;
  - instrumentação disponível apenas no ambiente debug, sem custo de logs no build de uso real.

### Instalador web

- Sem mudanças funcionais na interface; publicação alinhada ao novo firmware `1.2.0`.

---

## [1.1.0] — 2026-04-03

### Firmware

- Binário publicado: `firmware/navblue_waveshare_v1.1.0.bin` (substitui `navblue_waveshare_v1.0.2.bin`).
- `manifest.json` atualizado para versão **1.1.0** e caminho do `.bin` correspondente.
- HUD do device passa a renderizar a rota com:
  - **cores por leg** entre waypoints;
  - **trecho já percorrido esmaecido**;
  - manutenção do protocolo BLE existente, sem alterar o payload publicado pelo instalador.

### Instalador web

- Sem mudanças funcionais na interface; publicação alinhada ao novo firmware `1.1.0`.

---

## [1.0.2] — 2026-03-23

### Firmware

- Binário publicado: `firmware/navblue_waveshare_v1.0.2.bin` (substitui `navblue_waveshare_v1.0.1.bin`).
- `manifest.json` atualizado para versão **1.0.2** e caminho do `.bin` correspondente.

### Instalador web (`index.html`)

- Cenário **nenhuma porta selecionada** (`NotFoundError` ao cancelar o seletor serial): ecrã dedicado alinhado à [esp-web-tools](https://github.com/esphome/esp-web-tools) — passos de troubleshooting e links para drivers (Silabs CP2102, WCH CH34x/CH9102), com dica **Linux** (`dialout` / `usermod`) quando aplicável.
- Botões **Cancel** e **Try Again**: mesma largura (grid `1fr 1fr`), mesma altura e modelo de caixa (padding, `appearance: none`, sem conflito com estilos globais).
- `NotAllowedError` mantém-se sem ecrã intrusivo (comportamento anterior).

### Documentação (`README.md`)

- Testes locais: servir a pasta via HTTP (ex.: `python3 -m http.server 8080` → `http://localhost:8080/`); aviso explícito para **não** abrir páginas com `file://` (quebra `fetch` do manifest e do fluxo de instalação).
- App móvel **Navblue** em conjunto com o device HUD: descrição resumida e links para [Google Play](https://play.google.com/store/apps/details?id=com.energuide.navblue) e [App Store](https://apps.apple.com/app/navblue/id6651858865).

---

## [1.0.1] — anterior

- Primeira publicação do binário `firmware/navblue_waveshare_v1.0.1.bin` no instalador web e `manifest.json` correspondente.
