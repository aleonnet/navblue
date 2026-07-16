# Plano: Landing page parallax do NavBlue (raiz do site)

> Concluído em 2026-06-12. Repo `navblue_website` vira o **site oficial do NavBlue**: landing na raiz, instalador preservado em `install.html`, demo cinematográfica em `demo.html`.

## Contexto

O NavBlue tinha app nas duas lojas, web installer no GitHub Pages e uma demo cinematográfica gerada por `navblue_flutter_app/tools/simulation/guidance-sim_cinematic.py` — mas nenhuma vitrine de produto. Este plano criou a landing "blow people's mind" reaproveitando a infraestrutura existente (mesmo repo/Pages, zero-build, tudo self-hosted exceto CDNs da demo).

## Decisões

- **Hospedagem**: landing assume `index.html` (raiz = landing); instalador movido com `git mv` para `install.html` (conteúdo preservado, depois recebeu grafia NavBlue + favicon + link de volta); demo commitada como `demo.html` (artefato gerado; chave Mapbox e opção SAT removidas da cópia antes do push público).
- **Estética**: "night ride" — navy `#0a0a0f` + cyan `#00aeef`, Orbitron + DM Sans (fonts woff2 já self-hosted no repo).
- **Marca**: grafia unificada **NavBlue** (Nav claro + Blue cyan, sem separação) nas três páginas; volta padrão via link "← NavBlue"/"← Início" no topo esquerdo de install e demo.

## O que a landing contém

1. **Hero parallax** multi-camada (céu/estrelas/glow/grid 3D synthwave animado) com **mock de navegação no grid**: rota SVG com gradiente de progresso (percorrido apagado), **pulso de energia** (`pathLength=1000` + dash animado) e **marcador do veículo** (chevron + anel pulsante) navegando via SMIL `animateMotion` — espelho do RouteFX/Vehicle da demo cinematográfica.
2. **Problema** ("Seu celular não pertence ao guidão") com **mini-clipe CSS** em 3 cenas em loop de 13,5 s: vibração+queda do celular, chuva com tela em alerta, furto.
3. **Device showcase**: mock CSS fiel à foto real do device em rota — mapa com vias cinza claro de espessura real, **esmaecimento radial** (`mask-image: radial-gradient(circle closest-side …)`), rota azul com fluxo, seta de posição cyan, manobra branca (SVGs reais do firmware), distância com arco pontilhado "vale", KMH cyan, bateria verde e **relógio real**. Specs: 1.75″ AMOLED / ESP32-S3 / BLE 5 / Bateria USB-C.
4. **Como funciona** (3 passos) com telas reais: `tela-tutorial`, `tela-ble` e o **recorte do device** (máscara circular alpha via PIL → WebP 44 KB).
5. **Demo** (`aspect-ratio` + `object-fit: cover` contra distorção) → `demo.html`.
6. **Mapa do Brasil** com `tela-rota`; **Instalador** → `install.html`; footer com badges.
7. **Badges das lojas** no padrão `store-button` do cuidamais.com.br (ícones SVG extraídos do bundle deles), mesma altura do botão "Ver demo da engine".

## Técnica

- Zero-build, page única com CSS/JS inline; parallax via um rAF lendo `scrollY` (`data-depth` → `translate3d`); reveals com `IntersectionObserver`; `prefers-reduced-motion` neutraliza grid/parallax/mock/clipe; imagens lazy + comprimidas com `sips` (foto do device 3,5 MB → WebP 44 KB com recorte alpha via PIL); SEO/OG tags; favicon em todas as páginas.

## Lições/bugs do percurso

- `img{max-width:100%}` sem `height:auto` distorce imagens com atributos width/height — corrigido na regra global.
- Texto + `<b>` dentro de flex container com `gap` viram itens separados (marca "Nav Blue" espaçada) — wrap em `<span>`.
- Mask `radial-gradient` dimensiona por `farthest-corner` por padrão — para fade circular exato usar `closest-side`.
- `pathLength="1000"` normaliza o comprimento e torna triviais as animações de dash (pulso/percorrido) sincronizadas com `animateMotion`.
- A cópia da demo continha a **chave Mapbox real** embutida da geração — removida antes do push público.

## Verificação

Playwright + Chrome local (`python3 -m http.server`): console zero erros/warnings nas três páginas; links internos/lojas; responsivo 390/768/1200; `install.html` com fluxo de flash intacto; demo abrindo e rodando; revisão visual contínua do usuário durante a construção (várias rodadas de ajuste fino: arco do HUD, espessura/topologia das vias, fade radial, badges, recorte do device).
