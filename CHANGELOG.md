# Changelog

Todas as alterações notáveis deste repositório (instalador web + firmware publicado) serão documentadas aqui.

## [Instalador — multi-device] — 2026-06-27

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
