# Planos concluídos — `navblue_website`

Índice dos planos executados neste subprojeto.

## 2026

- [`waypoints-flexiveis-guidance-sim.plan.md`](./waypoints-flexiveis-guidance-sim.plan.md) (2026-07-01, Site 1.1.2, cross-subprojeto com `navblue_flutter_app`) — Espelho do fix responsivo do subtítulo do intro na `demo.html` e atualização do `DATA` da demo pela última geração do `guidance-sim_cinematic.py` (rota Rio Zona Sul ajustada), preservando as edições manuais da cópia publicada.
- [`auto-deteccao-device-web-installer.plan.md`](./auto-deteccao-device-web-installer.plan.md) (2026-06-27, multi-device) — Auto-detecção de device (VIEWE SmartRing-Plus ↔ Waveshare AMOLED 1.75C) pelo JEDEC ID do flash, `manifest.json` multi-build com bloco `detect`, override manual sempre visível, upsert por `id` nos `build-web-installer.sh`, e correção do brick por `flash_size` errado no merge (espelhar `pio upload`: dio + tamanho real do board).
- [`landing-page-parallax-navblue.plan.md`](./landing-page-parallax-navblue.plan.md) (2026-06-12, Site 1.0.0) — Landing page parallax do NavBlue como raiz do site (hero "night ride" com mock de navegação no grid 3D, mini-clipe do problema, mock fiel do AMOLED, telas reais do app), instalador preservado em `install.html` e demo cinematográfica em `demo.html` (sem chave Mapbox), com grafia NavBlue e navegação de volta unificadas.
