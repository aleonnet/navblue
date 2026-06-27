# NavBlue — Site oficial

Site estático do **NavBlue** (HUD de navegação para motociclistas), hospedado no GitHub Pages. Três páginas, zero build:

| Página | URL | Propósito |
|---|---|---|
| `index.html` | `/` | **Landing page** do produto: parallax "night ride", mock animado do device, telas reais do app, links para as lojas, demo e instalador |
| `install.html` | `/install.html` | **Instalador web de firmware** para os devices NavBlue ESP32-S3 (VIEWE SmartRing-Plus e Waveshare AMOLED 1.75C), via Web Serial ([esptool-js](https://github.com/espressif/esptool-js)) com **auto-detecção do device** |
| `demo.html` | `/demo.html` | **Demo cinematográfica** da engine de navegação (replay interativo gerado por `navblue_flutter_app/tools/simulation/guidance-sim_cinematic.py`) |

**Firmware publicado:** VIEWE SmartRing-Plus `1.5.0` (`firmware/navblue_viewe-smartring-plus_v1.5.0.bin`) e Waveshare AMOLED 1.75C `1.4.1` (`firmware/navblue_waveshare_v1.4.1.bin`). O instalador **detecta automaticamente** qual device está conectado e seleciona o binário certo (com override manual sempre disponível).

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

## Project Structure

```
navblue-device-web-installer/
  index.html            # Landing page do produto (self-contained)
  install.html          # Instalador web de firmware (self-contained, sem CDN)
  demo.html             # Demo cinematográfica da engine (artefato gerado; usa CDNs MapLibre/Fonts)
  index-v2.html         # esptool-js via CDN (referência histórica)
  index-v1.html         # versão ESP Web Tools (referência histórica)
  manifest.json         # Manifesto do firmware (versão, chip, caminho do binário)
  assets/               # Logo, favicon, badges, telas do app, recorte do device, ícones de manobra
  lib/
    esptool-bundle.js   # bundle local do esptool-js 0.5.7
  fonts/
    orbitron-latin.woff2
    dm-sans-latin.woff2
    dm-sans-latin-ext.woff2
  firmware/
    navblue_viewe-smartring-plus_v*.bin   # Binário mesclado VIEWE (gerado pelo build script)
    navblue_waveshare_v*.bin              # Binário mesclado Waveshare (gerado pelo build script)
  .gitignore
  README.md
```

## Building the Firmware

Each firmware project has its own build script that outputs the merged binary here:

```bash
cd /path/to/navblue_esp32s3_viewe-smartring-plus      # or .../navblue_esp32s3_waveshare-amoled-175C
./build-web-installer.sh
```

This will:
1. Compile the firmware via PlatformIO
2. Merge bootloader + partitions + app into a single binary via `esptool.py`. **Flash params match
   `pio run -t upload` exactly** (`--flash-mode dio`, `--flash-freq 80m`, and the board's real
   `--flash-size`, derived from the board JSON). A wrong `flash_size` bricks the device — a 16MB chip
   flashed with a 32MB header switches to 4-byte addressing and never boots.
3. Copy the binary to `../navblue-device-web-installer/firmware/`
4. **Upsert** this device's entry in `manifest.json` (its `version`, `path` and `detect` block),
   leaving the other device's entry untouched — so the two builds never clobber each other.

### Prerequisites

- PlatformIO CLI (`pio`)
- `esptool.py` (installed with PlatformIO or `pip install esptool`)
- Python 3 (for manifest update)

## Local Testing

**Do not** open `install.html` via `file://` in the browser. The installer loads `manifest.json` and firmware with `fetch()`; `file://` origins break that flow. Always serve this directory over HTTP(S). The landing (`/`) and demo (`/demo.html`) also work best served over HTTP.

Recommended local flow:

```bash
cd navblue-device-web-installer
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

### Step 1 — Create the repository

```bash
cd navblue-device-web-installer

git init
git add .
git commit -m "Initial commit — navblue device web installer"

# Create repo on GitHub (requires gh CLI)
gh repo create navblue-installer --public --source=. --push
```

Or manually:
1. Go to https://github.com/new
2. Create repository named `navblue-installer`
3. Push:
   ```bash
   git remote add origin https://github.com/aleonnet/navblue-installer.git
   git branch -M main
   git push -u origin main
   ```

### Step 2 — Include the firmware binary

By default `.gitignore` excludes `firmware/*.bin`. To distribute the firmware via GitHub Pages, force-add the binaries of **both** devices:

```bash
git add -f firmware/navblue_viewe-smartring-plus_v1.5.0.bin firmware/navblue_waveshare_v1.4.1.bin
git commit -m "Add firmware binaries for web installer"
git push
```

### Step 3 — Enable GitHub Pages

1. Go to **Settings > Pages** in your repository
2. Under **Source**, select **Deploy from a branch**
3. Select **main** branch, **/ (root)** folder
4. Click **Save**

### Step 4 — Set the entry page

The `index.html` is already the main installer. The page will be live at:

```
https://aleonnet.github.io/navblue-installer/
```

### Updating firmware

When you release a new firmware version:

```bash
# 1. Build the new firmware (run the script of the device you released)
cd /path/to/navblue_esp32s3_viewe-smartring-plus      # or .../navblue_esp32s3_waveshare-amoled-175C
./build-web-installer.sh

# 2. Commit and push the new binary + manifest
cd /path/to/navblue-device-web-installer
git add -f firmware/navblue_viewe-smartring-plus_v*.bin firmware/navblue_waveshare_v*.bin manifest.json
git commit -m "Update firmware to vX.Y.Z"
git push
```

GitHub Pages will automatically redeploy within minutes.

## How It Works

1. User opens the page in Chrome/Edge
2. Clicks **Connect Device**
3. Browser prompts to select the USB serial port (the NavBlue board)
4. esptool-js connects and detects the chip (ESP32-S3)
5. **Device auto-detection** — both boards are ESP32-S3, so they're told apart by the external
   flash chip's JEDEC ID (`readFlashId()`): VIEWE = manufacturer `0x85` + 16MB, Waveshare =
   manufacturer `0xC8` + 32MB. The matching build from `manifest.json` (`detect.flashManufacturer`
   + `detect.flashSizeMB`) is selected; size is the stable anchor, manufacturer is tolerant.
6. Page shows the detected device + firmware version, plus a **manual override** (VIEWE / Waveshare)
   pre-selected on the detection — always visible, in case the user needs to correct it
7. User clicks **Install Firmware** — the selected device's binary is downloaded and flashed with progress
8. Device is automatically reset after flashing

If the device isn't detected, the user may need to enter **Download Mode**:
- Hold **BOOT** button
- Press **RESET** button (while holding BOOT)
- Release **BOOT**

## Technology

- **esptool-js** 0.5.7 — Web Serial flashing (local bundle, no CDN dependency)
- **Canvas 2D** — Interactive particle background with network connections
- **Orbitron + DM Sans** — Typography (self-hosted woff2)
- Single HTML file, zero build step, fully self-contained

## Version History

| File | Description |
|---|---|
| `index.html` | **Current** — esptool-js self-contained (all assets local) |
| `index-v2.html` | esptool-js via unpkg CDN (reference) |
| `index-v1.html` | ESP Web Tools with external modals (reference) |
