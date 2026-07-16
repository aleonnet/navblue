# Plano: waypoints flexíveis no guidance-sim_cinematic.py + intro-sub responsivo

> Concluído em 2026-07-01. Subprojetos tocados: `navblue_flutter_app` (ferramenta de simulação) e `navblue_website` (espelho do fix responsivo + dados da demo).

## Contexto

A rota da visualização cinematográfica era fixa: 5 `WayPoint` hardcoded no `__main__` (Zona Sul do Rio). Toda a cadeia a jusante já era genérica — `create_route_url()` monta a URL OSRM para qualquer lista; só o subtítulo do intro ("Guidance Simulation · Rio de Janeiro") era literal no template. Objetivos: (a) waypoints flexíveis; (b) subtítulo quebrando no `·` e centralizado em telas estreitas.

## Alternativas avaliadas

| Opção | Prós | Contras |
|---|---|---|
| **A. Flag repetível `--wp lat,lon[,Nome]`** | zero deps, rápido p/ teste ad-hoc | digitar coordenadas é chato |
| **B. Arquivo JSON `--route rota.json`** | presets versionáveis; `place` alimenta o subtítulo | exige criar arquivo |
| C. Geocoding por endereço (Nominatim) | UX ótima | serviço externo, rate-limit, ambiguidade |
| D. Picker interativo no browser | visual | contradiz o design "HTML standalone gerado" |

**Escolhido: A + B combinados** (mutuamente exclusivos), default = rota atual do Rio (sem args, comportamento idêntico ao anterior). C fica como evolução futura.

## O que foi feito

1. **CLI** (`guidance-sim_cinematic.py`): `--route <preset.json>`, `--wp "lat,lon[,Nome]"` repetível (mín. 2; o 1º é a posição inicial) e `--place`. Validação de coordenadas e contagem; resposta OSRM checada (`code == "Ok"` e `routes` não vazio) com `sys.exit` amigável em vez de `IndexError` (caminho comum com coordenadas do usuário, ex.: `NoRoute`).
2. **Bug real encontrado**: o argparse rejeitava valores iniciados em `-` (toda latitude do hemisfério sul!) como se fossem flags — só passava quando o nome do waypoint continha espaço. Contorno: fusão de `--wp <valor>` em `--wp=<valor>` antes do `parse_args`.
3. **Injeção do lugar**: placeholder `__PLACE__` no template, substituído com `html.escape(place)`; fallback `--place` → `place` do JSON → nome do último waypoint → "Rio de Janeiro" no default.
4. **Intro responsivo**: `.intro-sub` virou flex centrado; abaixo de 700px quebra em coluna centralizada e o `·` some. Espelhado manualmente em `navblue_website/demo.html`.
5. **Presets** em `tools/simulation/routes/`: `rio-zona-sul.json` (rota default, com ajuste fino do waypoint RioSul feito pelo usuário) e `sp-zona-sul.json` (Parque Ibirapuera → Shopping Ibirapuera → Brooklin → Ponte Estaiada, 9.972 m — equivalente aos 12.262 m do Rio).
6. **Demo do site**: `DATA` do `demo.html` substituído pelo da última geração local (`animation_map_cinematic.html`, rota Rio com RioSul ajustado, 1354 frames) via transplante do blob — preservando as edições manuais da cópia publicada (favicon, link "← NavBlue", código SAT/Mapbox removido), que uma cópia integral do arquivo gerado perderia.
7. **Doc**: seção "Rotas flexíveis (CLI)" em `ARQUITETURA-guidance-sim-cinematic.md`.

## Verificação

- Geração sem args (idêntica à anterior), com `--route` (idêntica) e com `--wp` em SP; 6 caminhos de erro de CLI com mensagens limpas; branch `NoRoute` validado injetando a resposta real da API no mesmo código.
- Responsivo confirmado no Chrome a 390px (duas linhas centradas, sem ponto) e 1280px (linha única com ponto), console zero erros — no HTML gerado e no `demo.html`.
- Rota SP conferida visualmente na câmera ROUTE (traçado coerente Ibirapuera → Pinheiros).
