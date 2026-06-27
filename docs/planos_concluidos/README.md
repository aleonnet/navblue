# Planos concluídos — `navblue-device-web-installer`

Índice dos planos executados neste subprojeto.

## 2026

- [`auto-deteccao-device-web-installer.plan.md`](./auto-deteccao-device-web-installer.plan.md) (2026-06-27, multi-device) — Auto-detecção de device (VIEWE SmartRing-Plus ↔ Waveshare AMOLED 1.75C) pelo JEDEC ID do flash, `manifest.json` multi-build com bloco `detect`, override manual sempre visível, upsert por `id` nos `build-web-installer.sh`, e correção do brick por `flash_size` errado no merge (espelhar `pio upload`: dio + tamanho real do board).
- [`landing-page-parallax-navblue.plan.md`](./landing-page-parallax-navblue.plan.md) (2026-06-12, Site 1.0.0) — Landing page parallax do NavBlue como raiz do site (hero "night ride" com mock de navegação no grid 3D, mini-clipe do problema, mock fiel do AMOLED, telas reais do app), instalador preservado em `install.html` e demo cinematográfica em `demo.html` (sem chave Mapbox), com grafia NavBlue e navegação de volta unificadas.
