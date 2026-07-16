# Auto-detecção de device no web installer (VIEWE vs Waveshare)

## Objetivo

O instalador (`install.html`, esptool-js via Web Serial) gravava sempre o firmware de um `manifest.json`
estático de **build único**, e os dois `build-web-installer.sh` (um por firmware) reescreviam o **mesmo**
manifest sobrescrevendo o path do outro. Como o flasher **apaga** o device, gravar o firmware errado é
destrutivo. Objetivo: **auto-detectar o device e selecionar o binário certo**, com override manual.

## Discriminador (confirmado em hardware real — esptool v5.1.0 nos dois devices)

Ambos são **ESP32-S3 (QFN56) rev v0.2, 8MB PSRAM OPI** → `chipFamily`, package, MAC (OUI Espressif) e
PSRAM **não** distinguem (a esptool confirma: *"ESP32-S3 has no chip ID"*). O único discriminador legível
da ROM é o **JEDEC ID do chip de flash** (`readFlashId()`, independente de firmware/eFuse):

| | `readFlashId()` | manufacturer (`id & 0xFF`) | capacity (`(id>>16)&0xFF`) |
|---|---|---|---|
| **VIEWE** | `0x182085` | `0x85` (133) | `0x18` → 16MB |
| **Waveshare** | `0x1940C8` | `0xC8` (200, GigaDevice) | `0x19` → 32MB |

`getFlashSize()` do bundle **não serve** (tabela para em 16MB → `undefined` p/ 32MB); usar `readFlashId()`.
Chave de match: **`flashSizeMB` (âncora estável) + `flashManufacturer` (tolerante)** — uma troca futura de
fornecedor de flash (mesmo tamanho) não trava; cai no override manual.

## Implementação

- **`manifest.json`**: multi-build, cada um com `id`, `name`, `chipFamily`, `version`, `detect:{flashManufacturer, flashSizeMB}`, `parts`.
- **`install.html`**: após `main()`, lê `readFlashId()` → `mfr`/`flashMB`, casa o `selectedBuild`
  (chip + size + manufacturer tolerante), preenche `#deviceName`/`#fwVersion`, e mostra um **seletor de
  override sempre visível** pré-marcado no detectado. `startFlash()` usa `selectedBuild.parts[0].path`.
- **Os dois `build-web-installer.sh`**: **upsert por `id`** (atualiza só sua entrada no manifest; valores
  via env p/ evitar injeção), preservando a do outro device.

## Bug de brick descoberto e corrigido (geração do `.bin`)

A VIEWE bricava (não bootava, e por não ter PMU — latch GPIO47 — parecia "morta") via web flash, mas
funcionava via PlatformIO. Causa raiz (capturada do comando real do `pio run -t upload`):
`--flash-mode dio --flash-freq 80m --flash-size detect`. O merge usava `--flash_size 32MB` **fixo** →
header de 32MB num chip de **16MB** → o bootloader liga **endereçamento de 4 bytes** (exigido só p/ flash
> 16MB) → lê lixo → não boota. (Tentativa intermediária de derivar `flash_mode` do board JSON deu `qio`,
que **também** não boota nesta flash — por isso o Arduino grava `dio`.)

**Correção:** os scripts agora **espelham o `pio upload`** — `flash_mode=dio` fixo (não ler do board JSON),
`flash_freq=80m`, e `flash_size` derivado do board JSON (`upload.flash_size`: VIEWE 16MB, Waveshare 32MB).
Headers finais: VIEWE `e9 03 02 4f` (dio/16MB/80m), Waveshare `e9 03 02 5f` (dio/32MB/80m).

## Arquivos
- `navblue_website/manifest.json`, `install.html` (+ docs: este plano, `CHANGELOG.md`, `README.md`).
- `navblue_esp32s3_viewe-smartring-plus/build-web-installer.sh`, `navblue_esp32s3_waveshare-amoled-175C/build-web-installer.sh`.

## Validação (devices físicos)
- VIEWE → log `Flash ID 0x182085 (mfr 133, 16MB)` → UI "VIEWE SmartRing-Plus" v1.5.0 → grava e **boota**.
- Waveshare → `0x1940c8 (mfr 200, 32MB)` → "Waveshare AMOLED 1.75\"" v1.4.1 → grava e **boota**.
- Override troca device/firmware/path. Upsert: rodar os dois scripts mantém **as duas** entradas.
- **Ambos validados e funcionando no device.**
