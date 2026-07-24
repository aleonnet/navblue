# NavBlue — Site oficial

Site estático do **NavBlue** (HUD de navegação para motociclistas), hospedado no GitHub Pages. Três páginas, zero build:

| Página | URL | Propósito |
|---|---|---|
| `index.html` | `/` | **Landing page** do produto: parallax "night ride", mock animado do device, telas reais do app, links para as lojas, demo e instalador |
| `install.html` | `/install.html` | **Instalador web de firmware** para os devices NavBlue ESP32-S3 (VIEWE SmartRing-Plus, Waveshare AMOLED 1.75C e Waveshare AMOLED 2.16), via Web Serial ([esptool-js](https://github.com/espressif/esptool-js)) com **auto-detecção do device** |
| `demo.html` | `/demo.html` | **Demo cinematográfica** da engine de navegação (replay interativo gerado por `navblue_flutter_app/tools/simulation/guidance-sim_cinematic.py`) |

**Firmware publicado** (trem de release alinhado ao app Navblue — todos os firmwares seguem o MAJOR.MINOR do app): ver `manifest.json` (fonte de verdade; hoje todos em `1.15.0`, com `1.14.1` mantido em `firmware/` como rollback). O instalador **detecta automaticamente** qual device está conectado e seleciona o binário certo (com override manual sempre disponível).

> O Waveshare AMOLED **1.75B** não é listado no instalador: o fingerprint JEDEC da flash dele é idêntico ao do 2.16 (fab `0x20`, 16MB), o que quebraria a auto-detecção. Flash do 1.75B é feito via PlatformIO (`pio run -t upload`).

## Companion mobile app (Navblue)

Firmware flashed with this installer powers the **Navblue** HUD hardware. The **[Navblue]** mobile app works **together with the Navblue device**: it connects over **Bluetooth** to the external display and provides **routes and turn-by-turn navigation** for motorcyclists, so you can follow directions on the device without mounting the phone on the handlebar.

| Store | Link |
|--------|------|
| **Google Play** (Android) | [Navblue on Google Play](https://play.google.com/store/apps/details?id=com.energuide.navblue) |
| **App Store** (iOS) | [Navblue on the App Store](https://apps.apple.com/app/navblue/id6651858865) |

> The web installer only updates device firmware; routing and map features require the Navblue app on a phone paired to the board.

## Requirements

- **Browser**: Google Chrome or Microsoft Edge (desktop or Android)
- **Connection**: USB-C cable to the Waveshare board
- **Protocol**: Page must be served over HTTPS (GitHub Pages works out of the box)

> Safari and iOS are **not supported** (Web Serial API unavailable).

## Arquitetura ("A página é um rolê")

O redesign 2026 tem uma ideia central: **scroll = pilotar uma rota noturna**. Uma
polyline SVG contínua (a *rota-espinha*) conecta as seções como waypoints de
navegação — cada uma numerada como um quilômetro (`KM 01…07`) com o ícone de
manobra real do firmware — e um mini-device AMOLED (*rider*) cavalga a rota
mostrando a manobra da próxima seção, a distância até ela e a velocidade real do
scroll em km/h. No instalador, a detecção JEDEC acende a silhueta do device e o
progresso do flash percorre uma rota até a chegada.

Decisões de arte documentadas:
- **Dark-only é o tema** (a marca é o rolê noturno) — sem `[data-theme]`, sem toggle.
- **Zero build, zero CDN** — ES modules nativos e assets self-hosted. Exceção
  única: MapLibre no `demo.html` (comentário `ABSOLUTE-URL` no head; os tiles
  CARTO já são remotos, self-hostar o JS não tornaria a demo offline).
- **Bilíngue PT-BR/EN** — PT canônico no HTML, EN via dicionário (`js/i18n.js`,
  `data-i18n`); persistência em localStorage, primeira visita por
  `navigator.language`.
- **Motor único de scroll** (`js/scroll.js`) — um rAF que dorme quando assentado;
  todos os sistemas (spine, rider, hero, velocímetro) são subscribers.
- **`prefers-reduced-motion`** em toda animação: rota 100% desenhada, waypoints
  acesos, rider/velocímetro ocultos — "versão estática digna".

### Hooks de teste determinísticos (querystring)

| Hook | Página | Efeito |
|---|---|---|
| `?lang=pt\|en` | todas | força e persiste o idioma |
| `?progress=0..1` | index | congela o scroll no ponto (screenshots estáveis) |
| `?motion=reduce` | index | força reduced-motion |
| `?debug=fps` | index | contador de FPS |
| `?og=1` | index | composição limpa p/ card social (sem nav/hints) |
| `?state=stateX&pct=N` | install | renderiza qualquer um dos 8 estados sem hardware |

## Project Structure

```
navblue_website/
  index.html            # Landing (markup + data-i18n; CSS/JS em css/ e js/)
  install.html          # Instalador (script esptool inline intocado + cena via módulos)
  demo.html             # Demo cinematográfica (artefato gerado; exceção MapLibre CDN)
  manifest.json         # Manifesto do firmware (versão, chip, caminho, detect JEDEC)
  css/
    tokens.css          # design tokens (dark-only) + @font-face self-hosted
    base.css            # reset, nav+hamburger, footer, reveals, a11y
    landing.css         # hero night-ride, seções, spine, rider, waypoints
    install.css         # silhuetas dos devices, rota-progresso, chegada
  js/
    i18n.js             # PT/EN vanilla (data-i18n, ?lang=, NB_I18N p/ installer)
    scroll.js           # motor único (pSmooth, km/h, ?progress/?motion/?debug)
    route-spine.js      # rota-espinha medida por seção (resize/fonts/idioma)
    rider.js            # device que cavalga a rota (HUD por waypoints)
    hero.js  reveals.js  nav.js  main.js  install-scene.js
  assets/               # logo/favicons, og-image, telas (JPEG+WebP), man_*.svg
  lib/esptool-bundle.js # bundle local do esptool-js 0.5.7
  fonts/                # Orbitron, DM Sans, IBM Plex Mono (woff2)
  firmware/             # binários mesclados navblue_<device>_v*.bin
```

## Building the Firmware

Each firmware project has its own build script that outputs the merged binary here:

```bash
cd /path/to/navblue_esp32s3_viewe-smartring-plus      # ou .../waveshare-amoled-175C, .../waveshare-amoled-216
./build-web-installer.sh
```

This will:
1. Compile the firmware via PlatformIO
2. Merge bootloader + partitions + app into a single binary via `esptool.py`. **Flash params match
   `pio run -t upload` exactly** (`--flash-mode dio`, `--flash-freq 80m`, and the board's real
   `--flash-size`, derived from the board JSON). A wrong `flash_size` bricks the device — a 16MB chip
   flashed with a 32MB header switches to 4-byte addressing and never boots.
3. Copy the binary to `../navblue_website/firmware/`
4. **Upsert** this device's entry in `manifest.json` (its `version`, `path` and `detect` block),
   leaving the other devices' entries untouched — builds never clobber each other.

### Prerequisites

- PlatformIO CLI (`pio`)
- `esptool.py` (installed with PlatformIO or `pip install esptool`)
- Python 3 (for manifest update)

## Local Testing

**Do not** open `install.html` via `file://` in the browser. The installer loads `manifest.json` and firmware with `fetch()`; `file://` origins break that flow. Always serve this directory over HTTP(S). The landing (`/`) and demo (`/demo.html`) also work best served over HTTP.

Recommended local flow:

```bash
cd navblue_website
python3 -m http.server 8080
```

Then open **Chrome or Edge** at:

```
http://localhost:8080/
```

(Use another free port if `8080` is taken — e.g. `python3 -m http.server 8080` → `http://localhost:8080/`.)

**Alternative:** `npx serve .` (may serve over HTTPS depending on the tool) — still use `localhost` or HTTPS so Web Serial is allowed.

> Web Serial requires **HTTPS** or **`http://localhost`**. For full testing, use a local server as above or deploy to GitHub Pages.

## Deploy to GitHub Pages

O repositório já existe (`git@github.com:aleonnet/navblue.git`, branch `main`,
Pages servindo a raiz). O fluxo de release é só:

```bash
# 1. Build do firmware do device liberado (atualiza bin + manifest.json)
cd /path/to/navblue_esp32s3_<device>
./build-web-installer.sh

# 2. Commit e push (o .gitignore exclui firmware/*.bin — usar -f)
cd /path/to/navblue_website
git add -A && git add -f firmware/*.bin
git commit -m "chore: <device> vX.Y.Z"
git push origin main
```

GitHub Pages redeploya automaticamente em poucos minutos. Ao publicar uma
versão nova, remova da pasta `firmware/` os binários antigos não
referenciados no `manifest.json` (mantemos só os listados).

## How It Works

1. User opens the page in Chrome/Edge
2. Clicks **Connect Device**
3. Browser prompts to select the USB serial port (the NavBlue board)
4. esptool-js connects and detects the chip (ESP32-S3)
5. **Device auto-detection** — as placas são todas ESP32-S3, então são distinguidas pelo JEDEC ID
   da flash externa (`readFlashId()`): VIEWE = fab `0x85` + 16MB, Waveshare 1.75C = fab `0xC8` +
   32MB, Waveshare 2.16 = fab `0x20` + 16MB. O build correspondente vem do `manifest.json`
   (`detect.flashManufacturer` + `detect.flashSizeMB`). O 1.75B compartilha o fingerprint do 2.16
   e por isso fica fora da listagem (flash via PlatformIO).
6. Page shows the detected device + firmware version, plus a **manual override** (lista de devices)
   pre-selected on the detection — always visible, in case the user needs to correct it
7. User clicks **Install Firmware** — the selected device's binary is downloaded and flashed with progress
8. Device is automatically reset after flashing

If the device isn't detected, the user may need to enter **Download Mode**:
- Hold **BOOT** button
- Press **RESET** button (while holding BOOT)
- Release **BOOT**

## Technology

- **esptool-js** 0.5.7 — Web Serial flashing (local bundle, no CDN dependency)
- **Canvas 2D** — partículas do instalador reagindo ao estado do flash
- **SVG dirigido por scroll** — rota-espinha com `stroke-dashoffset` (1 escrita/frame)
- **Orbitron + DM Sans + IBM Plex Mono** — tipografia self-hosted (woff2)
- Zero build step; ES modules nativos servidos direto pelo GitHub Pages
