# Canvas interativo — BemCria Criatividade e Estratégia

© 2026 BemCria Criatividade e Estratégia. Todos os direitos reservados.

HTML + CSS + JavaScript puros, sem dependências, sem build e sem servidor.

## Executar localmente
- Abra `index.html` no navegador (duplo clique), **ou**
- na pasta do projeto: `python3 -m http.server 8000` e acesse http://localhost:8000

Funciona em computadores, tablets e celulares (Chrome, Edge, Firefox e Safari atuais).

## Publicar gratuitamente
- **Netlify:** arraste a pasta inteira em https://app.netlify.com/drop
- **GitHub Pages:** envie os arquivos a um repositório → Settings → Pages → Branch `main` / pasta `/(root)`
- **Vercel:** `npx vercel` na pasta do projeto (framework: “Other”)

Publique a pasta inteira, mantendo `index.html`, `css/`, `js/` e `assets/` juntos.

## Páginas (abas)
O nome de cada página vem do **nome do arquivo PDF de origem** (em Caixa Alta e Baixa, com a acentuação restaurada) e a ordem das abas segue a **numeração dos arquivos**. O Planejamento Editorial (arquivo 11, que traz 3 páginas) fica por último. As imagens já não têm título impresso na barra preta: o título aparece no cabeçalho e na aba.

| Nº | Aba | Tipo |
|---|---|---|
| 1 | Análise SWOT | Canvas (com post-its) |
| 2 | Canvas do Modelo de Negócio | Canvas |
| 3 | Tour da Experiência | Canvas |
| 4 | Definição do Problema | Canvas |
| 5 | Diagrama de Causas | Canvas |
| 6 | Loop de Aprendizagem | Canvas |
| 7 | Mapeamento de Valores | Canvas |
| 8 | Mix de Marketing | Canvas |
| 9 | Mapa de Parcerias | Canvas |
| 10 | Planejamento de Evidências | Canvas |
| 11 | Planejamento Editorial | Canvas |
| 11 | Infográfico | Referência (só visualização, com zoom) |
| 11 | Fluxograma (Fluxograma de Produção de Publicações) | Referência |

Cada Canvas tem os **seus próprios post-its**. O endereço muda com a página (ex.: `index.html#analise-swot`), então dá para compartilhar o link direto de uma página; o navegador também lembra a última página aberta. Com muitas abas, a faixa rola na horizontal (botões ‹ › no computador, deslize no celular; no teclado: setas, Home e End).

## Recursos
- **Exportar em PDF, JPG ou PNG** (botão **Exportar**): escolha a página (ou **todas as páginas** num único PDF), o formato e a resolução (Alta = 3308 px de largura; Média = metade). O PDF sai em A3 paisagem e o arquivo exportado inclui os post-its da página e o rodapé de copyright. **Dados (JSON)** faz o backup dos post-its de todas as páginas.
- **Post-its com dimensões ajustáveis:** arraste o canto inferior direito do post-it, ou abra **Editar** e use as predefinições (Pequeno, Médio, Grande, Extra grande) e os controles de largura e altura.
- **Ferramenta Mão** (botão **Mão** ao lado do zoom, em todas as páginas): com zoom, o ponteiro do mouse vira uma mãozinha e, arrastando a imagem, a visualização se move para todos os lados, sem usar as barras de rolagem. No Canvas, arraste o fundo ou o corpo do post-it; a barra superior continua movendo o post-it e o canto inferior direito continua redimensionando. A ferramenta vem ligada; clique em **Mão** para desligá-la (a escolha fica salva). Em telas de toque o botão não aparece, porque o dedo já arrasta a imagem.
- **Logo da BemCria** no canto superior esquerdo do cabeçalho (`assets/logo-bemcria.png`, 120 × 49 px), sobre uma placa branca no modo escuro.
- **Copyright 2026 BemCria Criatividade e Estratégia** no rodapé da página, nos metadados do HTML, no rodapé de todo arquivo exportado e nos metadados do PDF (autor e direitos).
- **Responsivo e pronto para celular:** layout adaptável, botões com área de toque confortável, arraste e redimensionamento por toque, zoom do Canvas (−, +, Ajustar à largura) e respeito às áreas seguras do iPhone.

## Estrutura
`index.html` · `css/styles.css` · `js/app.js` · `assets/<página>.png` (3308 px de largura, uma imagem por página) · `assets/logo-bemcria.png` · `js/data/<página>.js` · `tools/gerar-assets-offline.py`

### Incluir ou trocar uma página
1. Coloque a imagem em `assets/` (por exemplo `assets/minha-pagina.png`, proporção A4/A3 em paisagem, 3308 px de largura).
2. Em `js/app.js`, adicione uma linha à lista `PAGES` (chave = nome do arquivo sem `.png`, `kind: 'canvas'` para ter post-its ou `'viewer'` só para visualizar, título e texto alternativo).
3. Rode `python3 tools/gerar-assets-offline.py`.

### Sobre `js/data/` (exportar ao abrir o arquivo direto do disco)
Ao abrir o `index.html` por duplo clique (endereço `file://`), os navegadores bloqueiam a exportação de imagens que estão no disco. Por isso `js/data/*.js` guarda as mesmas imagens em base64, carregadas só na hora de exportar. Quando o projeto roda em um servidor (`http://` ou `https://`), esses arquivos não são usados e podem ser removidos para economizar espaço (~7,8 MB). **Se você trocar um PNG de `assets/`**, rode `python3 tools/gerar-assets-offline.py` para atualizar `js/data/`.

## Dados
Os post-its ficam no `localStorage` (chave `canvasEditorial.v2`) deste navegador/endereço, separados por página: `{ "version": 2, "boards": { "analise-swot": [ ... ] } }`. Cada post-it guarda a posição (`x`, `y`, de 0 a 1 do espaço livre da página) e as dimensões (`w` = fração da largura da página, de 0,10 a 0,45; `h` = fração da altura, de 0,10 a 0,50).
- **Versões anteriores:** os post-its salvos pela versão de um único Canvas (chave `canvasEditorial.v1`) aparecem automaticamente na página **Planejamento Editorial**. Páginas que mudaram de nome (`modelo-de-negocios` → `canvas-do-modelo-de-negocio` e `tour-de-experiencia` → `tour-da-experiencia`) mantêm os post-its, os links e a última página salvos; a tabela `ALIASES` em `js/app.js` faz essa correspondência.
- **Importar dados:** aceita o backup novo (todas as páginas) e o formato antigo (`{ "notes": [...] }`), que entra na página aberta. Backups sem `w` e `h` recebem o tamanho padrão.
- Limpar os dados do site no navegador apaga os post-its.

## Atalhos
Mouse: com zoom, arraste a imagem com a **Mão** · roda do mouse rola na vertical · Shift + roda rola na horizontal · as áreas de visualização aceitam as setas do teclado quando focadas (Tab)

Post-it focado: setas = mover (Shift = passo maior) · **Alt + setas = mudar largura/altura** (Shift = passo maior) · **+ / − = ampliar/reduzir** · E/Enter = editar · D = duplicar · Delete = excluir

## Limitações
- Dados locais: não há sincronização nem colaboração.
- Em telas estreitas o Canvas abre com 1000 px de largura e rola na horizontal, para os post-its continuarem legíveis; use **Ajustar à largura** para ver tudo de uma vez e **+** para aproximar.
- No arquivo exportado, o texto que não cabe no post-it termina em “…” (na tela, o texto rola dentro do post-it). Aumente o post-it para exibir tudo.
- Tela cheia pode não existir no iPhone (Safari); use o zoom.
- Em celulares, o arquivo exportado é baixado pelo navegador; em alguns navegadores embutidos de aplicativos (WebViews) o download pode ser bloqueado — abra o endereço no Chrome ou no Safari.

## Próxima versão colaborativa
Login (Supabase/Firebase Auth), tabela `notes` com `board_id`, tempo real via websockets/Realtime, papéis (leitor/editor), histórico de alterações e cursores de presença.
