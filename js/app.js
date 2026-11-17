'use strict';
/* Canvas interativo — BemCria Criatividade e Estratégia. Sem dependências.
   © 2026 BemCria Criatividade e Estratégia. Todos os direitos reservados. */
const KEY = 'canvasEditorial.v2';          /* post-its de todas as páginas: { version: 2, boards: { chave: [post-its] } } */
const KEY_V1 = 'canvasEditorial.v1';       /* versão anterior (um único Canvas, hoje “Planejamento Editorial”) */
const PAGE_KEY = 'canvasEditorial.page';   /* última página aberta */
const MAX_TEXT = 500;
const COPYRIGHT = '© 2026 BemCria Criatividade e Estratégia';
const COPYRIGHT_FULL = COPYRIGHT + '. Todos os direitos reservados.';
const COLORS = [['Amarelo', '#fff176'], ['Verde', '#b9f6ca'], ['Azul', '#90caf9'], ['Rosa', '#f8bbd0'], ['Laranja', '#ffcc80'], ['Lilás', '#d1c4e9']];

/* Páginas do projeto, na ordem das abas (a mesma numeração dos arquivos PDF de origem: 1 a 11).
   O nome de cada página vem do nome do arquivo; o Planejamento Editorial (arquivo 11, com 3 páginas) fica por último.
   A imagem de cada página fica em assets/<key>.png.
   kind 'canvas' = página com post-its · kind 'viewer' = página só de visualização (referências).
   Para incluir uma página: adicione o PNG em assets/, uma linha aqui e rode tools/gerar-assets-offline.py. */
const PAGES = [
  { key: 'analise-swot', kind: 'canvas', title: 'Análise SWOT', alt: 'Análise SWOT em quatro quadrantes: Forças e Fraquezas, identificadas como fatores internos, e Oportunidades e Ameaças, identificadas como fatores externos, cada um com perguntas orientadoras.' },
  { key: 'canvas-do-modelo-de-negocio', kind: 'canvas', title: 'Canvas do Modelo de Negócio', alt: 'Canvas do Modelo de Negócio com nove blocos: Quem irá te ajudar? (principais parceiros), Como você faz? (principais atividades), O que você faz? (proposta de valor), Como você interage? (relações com os stakeholders), Quem você ajuda? (segmentação de stakeholders), O que você precisa? (principais recursos), Como você obtém recursos? (canais de distribuição e fontes de receita), Quanto custará? (estrutura de custo) e Quanto você receberá? (fluxo de receita).' },
  { key: 'tour-da-experiencia', kind: 'canvas', title: 'Tour da Experiência', alt: 'Canvas Tour da Experiência com campos de perguntas: Qual é o foco para esse tour?; Quais são as práticas observadas?; Quem está envolvido?; Que informações são usadas? O que está faltando?; Que produtos são utilizados?; Como é o ambiente?; O que funciona bem?; O que não funciona bem? O que pode ser melhorado?; e uma coluna de notas e observações adicionais com linhas para escrever.' },
  { key: 'definicao-do-problema', kind: 'canvas', title: 'Definição do Problema', alt: 'Canvas Definição do Problema com cinco colunas de perguntas: a questão principal e por que é importante; para quem isso é um problema; que fatores sociais e culturais moldam o problema; que evidências mostram que vale o investimento; e se é possível reformular o problema.' },
  { key: 'diagrama-de-causas', kind: 'canvas', title: 'Diagrama de Causas', alt: 'Diagrama de Causas: um círculo grande, Problema central, à esquerda, ligado a duas sequências de três círculos: Sintomas diretos, Sintomas subjacentes e Fatores contribuintes, na parte de cima; e Causas diretas, Causas subjacentes e Fatores contribuintes, na parte de baixo.' },
  { key: 'loop-de-aprendizagem', kind: 'canvas', title: 'Loop de Aprendizagem', alt: 'Loop de Aprendizagem: quatro quadros ligados por setas em ciclo: Colete histórias e insights; Priorize percepções e soluções; Acompanhe indicadores e progresso; e Reveja resultados e impacto.' },
  { key: 'mapeamento-de-valores', kind: 'canvas', title: 'Mapeamento de Valores', alt: 'Canvas Mapeamento de Valores com duas linhas, Valores individuais e Valores organizacionais, cada uma com quatro colunas: Sempre importante, Às vezes é importante, Raramente é importante e Nunca é importante.' },
  { key: 'mix-de-marketing', kind: 'canvas', title: 'Mix de Marketing', alt: 'Canvas Mix de Marketing com sete campos, cada um com uma pergunta orientadora: Produto, Praça, Preço, Propósito, Processo, Pessoas e Promoção.' },
  { key: 'mapa-de-parcerias', kind: 'canvas', title: 'Mapa de Parcerias', alt: 'Mapa de Parcerias com doze etapas numeradas em duas linhas: Delimitando, Identificando, Construindo, Planejando, Gerenciando, Reunindo recursos, Implementando, Medindo, Revendo, Revisando, Institucionalizando e Mantendo ou finalizando.' },
  { key: 'planejamento-de-evidencias', kind: 'canvas', title: 'Planejamento de Evidências', alt: 'Planejamento de Evidências com um losango central, Foco principal do seu projeto ou organização, cercado por quatro quadros: Melhorar (O que traz um novo valor?), Substituir (O que o torna menos desejável?), Reutilizar (No que se baseia?) e Limitar (Quais poderiam ser os efeitos negativos quando levados ao extremo?).' },
  { key: 'planejamento-editorial', kind: 'canvas', title: 'Planejamento Editorial', alt: 'Canvas Planejamento Editorial com quatro quadrantes: Quem / Público; O que e Porquê / Conceito Editorial; Quando e Quanto / Distribuição; Como / Mockup.' },
  { key: 'infografico', kind: 'viewer', title: 'Infográfico', alt: 'Exemplo de página dupla de revista com a identidade Conthabil, anotada com os elementos gráficos: cabeçalho, foto, legenda, título, linha fina, capitular, texto, janela-olho, subtítulo, vinheta, box, imagem vetorial, ilustração, gráfico, tabela, infográfico e assinatura.' },
  { key: 'fluxograma', kind: 'viewer', title: 'Fluxograma de Produção de Publicações', tab: 'Fluxograma', alt: 'Fluxograma de Produção de Publicações com 16 etapas: Planejamento Editorial, Reunião de Pauta, Projeto Gráfico, Cronograma, Definição do Espelho, Recebimento dos Anúncios, dos Textos e das Fotos, Diagramação, Revisão e Correções, Aprovações, Tratamento das Fotos, Fechamento de Arquivos, Produção Gráfica, Backup e Distribuição, seguidas da descrição de cada etapa.' }
];
const PAGE = Object.fromEntries(PAGES.map(p => [p.key, { ...p, src: `assets/${p.key}.png`, tab: p.tab || p.title }]));
const CANVAS_KEYS = PAGES.filter(p => p.kind === 'canvas').map(p => p.key);
/* Chaves de versões anteriores → chave atual (mantém post-its, links e a última página salvos) */
const ALIASES = { 'modelo-de-negocios': 'canvas-do-modelo-de-negocio', 'tour-de-experiencia': 'tour-da-experiencia' };
const resolveKey = k => (PAGE[k] ? k : (ALIASES[k] && PAGE[ALIASES[k]] ? ALIASES[k] : null));

/* Dimensões do post-it: w = fração da largura da página, h = fração da altura da página. */
const LIM = { minW: 0.10, maxW: 0.45, minH: 0.10, maxH: 0.50 };
const DEF_W = 0.125;
const NOTE_ASPECT = 0.9;        /* altura ÷ largura de um post-it “padrão” (em pixels), qualquer que seja a proporção da página */
const RATIO = 3308 / 2339;      /* proporção das páginas (A4/A3 em paisagem) */
const PRESETS = [['Pequeno', 10], ['Médio', 12.5], ['Grande', 17], ['Extra grande', 24]]; /* nome, % da largura */
const FS_RATIO = 0.0105;        /* fonte do post-it = largura da página na tela × FS_RATIO (acompanha o zoom) */
const MIN_LEGIBLE = 1000;       /* largura mínima inicial do Canvas em telas estreitas (rola na horizontal) */
const svg = p => `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICON = {
  edit: svg('<path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>'),
  copy: svg('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/>'),
  del: svg('<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>'),
  grip: svg('<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>')
};
const $ = (s, r = document) => r.querySelector(s);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
const fmtDate = iso => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
const today = () => new Date().toLocaleDateString('en-CA'); /* AAAA-MM-DD */
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

const stage = $('#stage'), stageImg = $('#stageImg'), layer = $('#layer'), wrap = $('#stageWrap');
/* Tamanho padrão do post-it para uma página com a proporção dada */
const stageRatio = () => (stageImg.naturalWidth && stageImg.naturalHeight ? stageImg.naturalWidth / stageImg.naturalHeight : RATIO);
const sizeFor = (wPct, ratio = stageRatio()) => ({ w: wPct / 100, h: clamp(wPct / 100 * NOTE_ASPECT * ratio, LIM.minH, LIM.maxH) });

/* ---------- Ferramenta Mão: com zoom, arrastar a imagem move a visualização nos dois eixos ---------- */
const HAND_KEY = 'canvasEditorial.hand';
let handOn = true;
try { handOn = localStorage.getItem(HAND_KEY) !== '0'; } catch (e) { /* sem armazenamento: mantém ligada */ }
const panUpdaters = [];
function syncHand() { document.querySelectorAll('[data-hand]').forEach(b => b.setAttribute('aria-pressed', handOn)); panUpdaters.forEach(f => f()); }
function setHand(on) {
  handOn = on;
  try { localStorage.setItem(HAND_KEY, on ? '1' : '0'); } catch (e) { /* ignora */ }
  syncHand();
}
/* box = área rolável; watch = elementos cujo tamanho muda com o zoom. Só age com mouse/caneta (no toque, o dedo já rola). */
function enablePan(box, watch) {
  let st = null;
  const pannable = () => box.scrollWidth > box.clientWidth + 1 || box.scrollHeight > box.clientHeight + 1;
  const update = () => box.classList.toggle('can-pan', handOn && pannable());
  panUpdaters.push(update);
  const ro = new ResizeObserver(update);
  ro.observe(box); watch.forEach(el => ro.observe(el));
  box.addEventListener('pointerdown', e => {
    if (e.defaultPrevented || e.button !== 0 || e.pointerType === 'touch' || !box.classList.contains('can-pan')) return;
    const r = box.getBoundingClientRect();
    if (e.clientX - r.left - box.clientLeft >= box.clientWidth || e.clientY - r.top - box.clientTop >= box.clientHeight) return; /* barra de rolagem */
    if (e.target.closest('button, a, input, textarea, select, .note-bar, .note-resize')) return; /* controles e arraste de post-it */
    st = { x: e.clientX, y: e.clientY, l: box.scrollLeft, t: box.scrollTop };
    box.setPointerCapture(e.pointerId); box.classList.add('panning'); e.preventDefault();
  });
  box.addEventListener('pointermove', e => {
    if (!st) return;
    box.scrollLeft = st.l - (e.clientX - st.x); box.scrollTop = st.t - (e.clientY - st.y);
  });
  const end = () => { if (!st) return; st = null; box.classList.remove('panning'); };
  box.addEventListener('pointerup', end); box.addEventListener('pointercancel', end); box.addEventListener('lostpointercapture', end);
  update();
}

let boards = {}, activeKey = null, notes = [], editingId = null, drag = null, zTop = 1; /* notes = post-its da página ativa (boards[activeKey]) */
stage.style.setProperty('--fsr', FS_RATIO);
const setNotes = list => { boards[activeKey] = notes = list; };

/* ---------- Mensagens ---------- */
let toastTimer;
function toast(msg, type = 'ok', ms = 5000) {
  const t = $('#toast');
  t.textContent = msg; t.className = 'toast show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = 'toast'; }, ms);
}
function ask(message, okLabel) {
  return new Promise(resolve => {
    const dlg = $('#confirmDialog');
    $('#confirmMsg').textContent = message;
    $('#confirmOk').textContent = okLabel;
    dlg.returnValue = '';
    dlg.addEventListener('close', () => resolve(dlg.returnValue === 'ok'), { once: true });
    dlg.showModal();
  });
}

/* ---------- Persistência e validação ---------- */
function validateNotes(list) {
  if (!Array.isArray(list)) return { error: 'a lista de post-its está ausente ou em formato inválido.' };
  const seen = new Set(), out = [], def = sizeFor(DEF_W * 100, RATIO);
  for (const [i, n] of list.entries()) {
    const at = `Post-it ${i + 1}: `;
    if (!n || typeof n !== 'object') return { error: at + 'formato inválido.' };
    if (typeof n.text !== 'string' || n.text.length > MAX_TEXT) return { error: at + `texto ausente ou maior que ${MAX_TEXT} caracteres.` };
    if (typeof n.color !== 'string' || !/^#[0-9a-f]{6}$/i.test(n.color)) return { error: at + 'cor inválida (use #RRGGBB).' };
    if (![n.x, n.y].every(v => typeof v === 'number' && v >= 0 && v <= 1)) return { error: at + 'posição x/y deve ser um número entre 0 e 1.' };
    if (typeof n.createdAt !== 'string' || isNaN(Date.parse(n.createdAt))) return { error: at + 'data de criação inválida.' };
    /* w/h são opcionais (arquivos antigos não têm): usa o tamanho padrão quando ausentes. */
    if (n.w !== undefined && !(typeof n.w === 'number' && n.w >= LIM.minW && n.w <= LIM.maxW)) return { error: at + `largura “w” deve estar entre ${LIM.minW} e ${LIM.maxW}.` };
    if (n.h !== undefined && !(typeof n.h === 'number' && n.h >= LIM.minH && n.h <= LIM.maxH)) return { error: at + `altura “h” deve estar entre ${LIM.minH} e ${LIM.maxH}.` };
    const id = typeof n.id === 'string' && n.id && !seen.has(n.id) ? n.id : uid();
    seen.add(id);
    const upd = typeof n.updatedAt === 'string' && !isNaN(Date.parse(n.updatedAt)) ? n.updatedAt : n.createdAt;
    out.push({ id, text: n.text, color: n.color.toLowerCase(), x: n.x, y: n.y, w: n.w ?? def.w, h: n.h ?? def.h, createdAt: n.createdAt, updatedAt: upd });
  }
  return { notes: out };
}
/* Arquivo de importação: formato novo ({ boards: { chave: [...] } }) ou antigo ({ notes: [...] }, vai para a página aberta). */
function parseImport(data) {
  if (data && typeof data === 'object' && data.boards && typeof data.boards === 'object' && !Array.isArray(data.boards)) {
    const out = {};
    for (const [rawKey, list] of Object.entries(data.boards)) {
      const k = resolveKey(rawKey);
      if (!k || PAGE[k].kind !== 'canvas') continue; /* páginas desconhecidas são ignoradas */
      const r = validateNotes(list);
      if (r.error) return { error: `${PAGE[k].title}: ${r.error}` };
      out[k] = r.notes;
    }
    if (!Object.keys(out).length) return { error: 'O arquivo não tem post-its de nenhuma página deste projeto.' };
    return { boards: out };
  }
  if (data && typeof data === 'object' && Array.isArray(data.notes)) {
    const r = validateNotes(data.notes);
    return r.error ? { error: r.error } : { boards: { [activeKey]: r.notes } };
  }
  return { error: 'O arquivo não contém post-its (esperado “boards” ou “notes”).' };
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw);
      for (const [rawKey, list] of Object.entries(data.boards || {})) {
        const k = resolveKey(rawKey);
        if (!k || PAGE[k].kind !== 'canvas') continue;
        const r = validateNotes(list);
        if (r.error) throw new Error(r.error);
        boards[k] = r.notes;
      }
    } else {
      /* migração: os post-its da versão anterior pertenciam ao Canvas “Planejamento Editorial” */
      const old = localStorage.getItem(KEY_V1);
      if (old) { const r = validateNotes(JSON.parse(old).notes); if (r.notes) boards['planejamento-editorial'] = r.notes; }
    }
  } catch (e) { toast('Não foi possível ler os post-its salvos neste navegador.', 'error'); }
  CANVAS_KEYS.forEach(k => { boards[k] = boards[k] || []; });
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify({ version: 2, boards })); }
  catch (e) { toast('Não foi possível salvar: o armazenamento do navegador está cheio ou bloqueado.', 'error'); }
}
const find = id => notes.find(n => n.id === id);

/* ---------- Dimensões ---------- */
/* Muda largura/altura mantendo o canto superior esquerdo no mesmo lugar e o post-it dentro da página.
   (x e y guardam a posição como fração do espaço livre; por isso são recalculados.)
   o.a = âncora fixa (arraste do canto); o.push = se não couber, empurra o post-it para dentro em vez de travar na borda. */
function applySize(n, w, h, o = {}) {
  let { lf, tf } = o.a || { lf: (1 - n.w) * n.x, tf: (1 - n.h) * n.y };
  w = clamp(w, LIM.minW, LIM.maxW); h = clamp(h, LIM.minH, LIM.maxH);
  if (o.push) { lf = Math.min(lf, 1 - w); tf = Math.min(tf, 1 - h); }
  else { w = clamp(w, LIM.minW, 1 - lf); h = clamp(h, LIM.minH, 1 - tf); }
  n.w = w; n.h = h; n.x = clamp(lf / (1 - w)); n.y = clamp(tf / (1 - h));
}
function syncGeom(el, n) {
  el.style.setProperty('--x', n.x); el.style.setProperty('--y', n.y);
  el.style.setProperty('--w', n.w); el.style.setProperty('--h', n.h);
}

/* ---------- Renderização ---------- */
function noteEl(n) {
  const el = document.createElement('article');
  el.className = 'note'; el.dataset.id = n.id; el.tabIndex = 0;
  el.style.background = n.color;
  syncGeom(el, n);
  el.setAttribute('aria-label', `Post-it: ${n.text.slice(0, 80)}. Setas movem, Alt e setas mudam as dimensões, E edita, D duplica, Delete exclui.`);
  el.innerHTML = `<div class="note-bar"><span class="handle" title="Arrastar">${ICON.grip}</span><span class="acts">
    <button type="button" data-act="edit" title="Editar" aria-label="Editar post-it">${ICON.edit}</button>
    <button type="button" data-act="dup" title="Duplicar" aria-label="Duplicar post-it">${ICON.copy}</button>
    <button type="button" data-act="del" title="Excluir" aria-label="Excluir post-it">${ICON.del}</button></span></div>
    <p class="note-text"></p><time class="note-date"></time><span class="note-resize" title="Arraste para mudar as dimensões" aria-hidden="true"></span>`;
  $('.note-text', el).textContent = n.text;
  const t = $('.note-date', el);
  t.dateTime = n.createdAt; t.textContent = fmtDate(n.createdAt) + (n.updatedAt !== n.createdAt ? ' · editado' : '');
  return el;
}
function render(focusId) {
  layer.replaceChildren(...notes.map(noteEl));
  $('#count').textContent = plural(notes.length, 'post-it nesta página', 'post-its nesta página');
  if (focusId) $(`.note[data-id="${focusId}"]`, layer)?.focus({ preventScroll: true });
}

/* ---------- Zoom do Canvas ---------- */
/* modo: 'auto' = largura da tela (mínimo MIN_LEGIBLE), 'fit' = exatamente a largura da tela, 'manual' = zoom do usuário */
let zoomMode = 'auto';
const wrapW = () => Math.max(wrap.clientWidth - 2, 240);
function setStageW(w) {
  const px = Math.round(clamp(w, 320, 3308));
  stage.style.width = px + 'px'; stage.style.setProperty('--sw', px + 'px');
  wrap.classList.toggle('zoomed', px > wrapW() + 2);
  $('#zoomLabel').textContent = Math.round(px / wrapW() * 100) + '%';
  return px;
}
let stageW = 0;
function relayout() {
  if (!wrap.clientWidth) return; /* página oculta */
  if (zoomMode === 'auto') stageW = setStageW(Math.max(wrapW(), MIN_LEGIBLE));
  else if (zoomMode === 'fit') stageW = setStageW(wrapW());
  else stageW = setStageW(stageW);
}
function zoomBy(f) { /* mantém o centro da área visível no mesmo ponto (a rolagem vertical fica por conta da página) */
  const cx = (wrap.scrollLeft + wrap.clientWidth / 2) / stage.offsetWidth;
  zoomMode = 'manual'; stageW = setStageW(stageW * f);
  wrap.scrollLeft = cx * stage.offsetWidth - wrap.clientWidth / 2;
}
$('#zIn').addEventListener('click', () => zoomBy(1.25));
$('#zOut').addEventListener('click', () => zoomBy(0.8));
$('#zFit').addEventListener('click', () => { zoomMode = 'fit'; relayout(); wrap.scrollLeft = 0; });
new ResizeObserver(relayout).observe(wrap);
enablePan(wrap, [stage]);
$('#zHand').addEventListener('click', () => setHand(!handOn));
stageImg.addEventListener('load', () => { if (stageImg.naturalWidth) stageImg.style.aspectRatio = `${stageImg.naturalWidth} / ${stageImg.naturalHeight}`; relayout(); });
if (stageImg.complete) stageImg.dispatchEvent(new Event('load')); /* imagem já carregada antes do script */

/* ---------- Criar / editar ---------- */
const dlg = $('#noteDialog'), txt = $('#noteText'), sizeW = $('#sizeW'), sizeH = $('#sizeH');
$('#colors').innerHTML = COLORS.map(([name, hex], i) =>
  `<label><input type="radio" name="color" value="${hex}" ${i ? '' : 'checked'}><span class="sw" style="background:${hex}"></span><span class="sr" style="position:absolute;left:-999px">${name}</span></label>`).join('');
$('#colors').querySelectorAll('label').forEach((l, i) => l.title = COLORS[i][0]);
const pickedColor = () => $('input[name=color]:checked').value;

$('#presets').innerHTML = PRESETS.map(([name], i) => `<button type="button" data-p="${i}">${name}</button>`).join('');
const pct = v => (+v).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
function showSize() { $('#outW').textContent = pct(sizeW.value); $('#outH').textContent = pct(sizeH.value); }
function setSizeInputs(w, h) { sizeW.value = Math.round(w * 1000) / 10; sizeH.value = Math.round(h * 1000) / 10; showSize(); }
sizeW.addEventListener('input', showSize); sizeH.addEventListener('input', showSize);
$('#presets').addEventListener('click', e => {
  const b = e.target.closest('[data-p]'); if (!b) return;
  const s = sizeFor(PRESETS[+b.dataset.p][1]); setSizeInputs(s.w, s.h);
});

function openDialog(id) {
  editingId = id || null;
  const n = id && find(id), d = sizeFor(DEF_W * 100);
  $('#noteTitle').textContent = n ? 'Editar post-it' : 'Novo post-it';
  $('#noteSubmit').textContent = n ? 'Salvar alterações' : 'Criar post-it';
  txt.value = n ? n.text : ''; $('#noteErr').textContent = ''; txt.removeAttribute('aria-invalid');
  const hex = n ? n.color : COLORS[0][1];
  const radio = [...document.querySelectorAll('input[name=color]')].find(r => r.value === hex);
  if (radio) radio.checked = true;
  setSizeInputs(n ? n.w : d.w, n ? n.h : d.h);
  $('#noteLen').textContent = `${txt.value.length}/${MAX_TEXT}`;
  dlg.showModal(); txt.focus();
}
function visibleCenter(w, h) {
  const r = layer.getBoundingClientRect(), v = wrap.getBoundingClientRect();
  const nw = w * r.width, nh = h * r.height;
  const l = Math.max(r.left, v.left, 0), rt = Math.min(r.right, v.right, innerWidth), t = Math.max(r.top, v.top, 0), b = Math.min(r.bottom, v.bottom, innerHeight);
  const cx = (l + rt) / 2, cy = (t + b) / 2;
  return { x: clamp((cx - r.left - nw / 2) / (r.width - nw)), y: clamp((cy - r.top - nh / 2) / (r.height - nh)) };
}
$('#noteForm').addEventListener('submit', e => {
  e.preventDefault();
  const text = txt.value.trim();
  if (!text) { $('#noteErr').textContent = 'Escreva o conteúdo do post-it antes de continuar.'; txt.setAttribute('aria-invalid', 'true'); txt.focus(); return; }
  const now = new Date().toISOString(), color = pickedColor();
  const w = clamp(+sizeW.value / 100, LIM.minW, LIM.maxW), h = clamp(+sizeH.value / 100, LIM.minH, LIM.maxH);
  let id = editingId;
  if (id) { const n = find(id); Object.assign(n, { text, color, updatedAt: now }); applySize(n, w, h, { push: true }); toast('Post-it atualizado.'); }
  else { id = uid(); notes.push({ id, text, color, ...visibleCenter(w, h), w, h, createdAt: now, updatedAt: now }); toast('Post-it criado no centro da área visível. Arraste para posicionar.'); }
  save(); dlg.close(); render(id);
});
txt.addEventListener('input', () => { $('#noteLen').textContent = `${txt.value.length}/${MAX_TEXT}`; $('#noteErr').textContent = ''; txt.removeAttribute('aria-invalid'); });
$('#noteCancel').addEventListener('click', () => dlg.close());
$('#btnAdd').addEventListener('click', () => openDialog());

function duplicate(id) {
  const n = find(id), now = new Date().toISOString();
  const copy = { ...n, id: uid(), x: clamp(n.x + 0.03), y: clamp(n.y + 0.04), createdAt: now, updatedAt: now };
  notes.push(copy); save(); render(copy.id); toast('Post-it duplicado.');
}
async function remove(id) {
  if (!(await ask('Excluir este post-it? Esta ação não pode ser desfeita.', 'Excluir'))) { $(`.note[data-id="${id}"]`, layer)?.focus(); return; }
  setNotes(notes.filter(n => n.id !== id)); save(); render(); toast('Post-it excluído.');
  $('#btnAdd').focus();
}

/* ---------- Ações, teclado, arraste e redimensionamento ---------- */
layer.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const id = b.closest('.note').dataset.id, act = b.dataset.act;
  if (act === 'edit') openDialog(id); else if (act === 'dup') duplicate(id); else remove(id);
});
layer.addEventListener('keydown', e => {
  if (!e.target.classList.contains('note') || e.ctrlKey || e.metaKey) return;
  const el = e.target, id = el.dataset.id, n = find(id), step = e.shiftKey ? 0.03 : 0.01;
  const arrows = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
  if (e.altKey) { /* Alt + setas: dimensões */
    if (!arrows) return;
    e.preventDefault(); applySize(n, n.w + arrows[0] * step, n.h + arrows[1] * step, { push: true }); syncGeom(el, n); save();
    return;
  }
  if (arrows) {
    e.preventDefault(); const s = e.shiftKey ? 0.05 : 0.01;
    n.x = clamp(n.x + arrows[0] * s); n.y = clamp(n.y + arrows[1] * s); syncGeom(el, n); save();
  } else if (e.key === '+' || e.key === '=') { e.preventDefault(); applySize(n, n.w * 1.1, n.h * 1.1, { push: true }); syncGeom(el, n); save(); }
  else if (e.key === '-' || e.key === '_') { e.preventDefault(); applySize(n, n.w / 1.1, n.h / 1.1, { push: true }); syncGeom(el, n); save(); }
  else if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') { e.preventDefault(); openDialog(id); }
  else if (e.key === 'd' || e.key === 'D') { e.preventDefault(); duplicate(id); }
  else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); remove(id); }
});
layer.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  const grip = e.target.closest('.note-resize'), bar = e.target.closest('.note-bar'), handle = grip || bar;
  if (!handle || (!grip && e.target.closest('button'))) return;
  const el = handle.closest('.note'), n = find(el.dataset.id), r = layer.getBoundingClientRect();
  drag = {
    mode: grip ? 'size' : 'move', el, n, sx: e.clientX, sy: e.clientY, ox: n.x, oy: n.y, w0: n.w, h0: n.h,
    a: { lf: (1 - n.w) * n.x, tf: (1 - n.h) * n.y },
    rw: r.width - el.offsetWidth, rh: r.height - el.offsetHeight, lw: r.width, lh: r.height
  };
  handle.setPointerCapture(e.pointerId);
  el.classList.add(grip ? 'sizing' : 'dragging'); el.style.zIndex = ++zTop; el.focus({ preventScroll: true }); e.preventDefault();
});
layer.addEventListener('pointermove', e => {
  if (!drag) return;
  if (drag.mode === 'size') applySize(drag.n, drag.w0 + (e.clientX - drag.sx) / drag.lw, drag.h0 + (e.clientY - drag.sy) / drag.lh, { a: drag.a });
  else { drag.n.x = clamp(drag.ox + (e.clientX - drag.sx) / drag.rw); drag.n.y = clamp(drag.oy + (e.clientY - drag.sy) / drag.rh); }
  syncGeom(drag.el, drag.n);
});
const endDrag = () => { if (!drag) return; drag.el.classList.remove('dragging', 'sizing'); drag = null; save(); };
layer.addEventListener('pointerup', endDrag);
layer.addEventListener('pointercancel', endDrag);

/* ---------- Exportação: PDF, JPG, PNG e dados (JSON) ---------- */
const FONT = '"Segoe UI", system-ui, -apple-system, Roboto, sans-serif';
const FOOT_RATIO = 0.024; /* altura do rodapé de copyright = largura × FOOT_RATIO */
const PDF_W = 1190.55;    /* A3 em paisagem: 420 mm em pontos */
const PRODUCER = 'Canvas interativo — BemCria Criatividade e Estratégia';

function loadScript(src) {
  return new Promise((ok, fail) => {
    const s = document.createElement('script');
    s.src = src; s.onload = ok; s.onerror = () => fail(new Error('Não foi possível carregar ' + src));
    document.head.append(s);
  });
}
/* Abrindo o index.html direto do disco (file://), o navegador "contamina" o canvas ao desenhar imagens do disco
   e bloqueia a exportação. Nesse caso as imagens vêm de js/data/*.js (mesmas imagens em base64). */
async function loadImage(key) {
  let src = PAGE[key].src;
  if (location.protocol === 'file:') {
    window.__ASSETS = window.__ASSETS || {};
    if (!window.__ASSETS[key]) await loadScript(`js/data/${key}.js`);
    src = window.__ASSETS[key];
  }
  return new Promise((ok, fail) => {
    const i = new Image();
    i.onload = () => ok(i); i.onerror = () => fail(new Error('Não foi possível carregar a imagem ' + key));
    i.src = src;
  });
}
const toBlob = (c, type, q) => new Promise((ok, fail) => c.toBlob(b => b ? ok(b) : fail(new Error('toBlob')), type, q));

function roundRectPath(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
/* Quebra de linha igual ao CSS do post-it (pre-wrap + overflow-wrap:anywhere). */
function wrapLines(ctx, text, maxW) {
  const lines = [];
  for (const para of text.split(/\r?\n/)) {
    let line = '';
    for (const word of para.split(' ')) {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width <= maxW) { line = test; continue; }
      if (line) { lines.push(line); line = ''; }
      if (ctx.measureText(word).width <= maxW) { line = word; continue; }
      for (const ch of Array.from(word)) {
        if (line && ctx.measureText(line + ch).width > maxW) { lines.push(line); line = ch; } else line += ch;
      }
    }
    lines.push(line);
  }
  return lines;
}
/* Desenha os post-its com a mesma geometria do CSS (tudo em "em", sendo 1em = largura × FS_RATIO). */
function drawNotes(ctx, list, W, H) {
  const em = W * FS_RATIO;
  for (const n of list) {
    const nw = n.w * W, nh = n.h * H, x = (1 - n.w) * n.x * W, y = (1 - n.h) * n.y * H;
    const padX = 0.6 * em, bar = 2.3 * em, lh = 1.35 * em;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = em; ctx.shadowOffsetY = 0.45 * em;
    ctx.fillStyle = n.color; roundRectPath(ctx, x, y, nw, nh, 0.45 * em); ctx.fill();
    ctx.restore();
    ctx.save();
    roundRectPath(ctx, x, y, nw, nh, 0.45 * em); ctx.clip();
    ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(x, y + bar - Math.max(1, em / 13), nw, Math.max(1, em / 13));
    ctx.fillStyle = '#1f1f1f'; ctx.font = `${em}px ${FONT}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    const top = y + bar + 0.45 * em, dateH = 0.8 * em * 1.35, bottom = y + nh - 0.45 * em - dateH - 0.3 * em;
    const maxLines = Math.floor((bottom - top) / lh), maxW = nw - 2 * padX;
    let lines = wrapLines(ctx, n.text, maxW);
    if (lines.length > maxLines) {
      lines = lines.slice(0, Math.max(0, maxLines));
      if (lines.length) { let l = lines[lines.length - 1]; while (l && ctx.measureText(l + '…').width > maxW) l = l.slice(0, -1); lines[lines.length - 1] = l + '…'; }
    }
    lines.forEach((l, i) => ctx.fillText(l, x + padX, top + i * lh + lh / 2));
    ctx.fillStyle = '#3a3a3a'; ctx.font = `${0.8 * em}px ${FONT}`;
    ctx.fillText(fmtDate(n.createdAt) + (n.updatedAt !== n.createdAt ? ' · editado' : ''), x + padX, y + nh - 0.45 * em - dateH / 2);
    ctx.restore();
  }
}
function drawFooter(ctx, W, H, foot, title) {
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, H, W, foot);
  ctx.fillStyle = '#d0d3d8'; ctx.fillRect(0, H, W, Math.max(1, Math.round(W / 1650)));
  const fs = foot * 0.42, padX = W * 0.015, mid = H + foot / 2;
  ctx.textBaseline = 'middle'; ctx.fillStyle = '#4a4a4a';
  ctx.font = `600 ${fs}px ${FONT}`; ctx.textAlign = 'left'; ctx.fillText(title, padX, mid);
  ctx.font = `${fs}px ${FONT}`; ctx.textAlign = 'right'; ctx.fillText(COPYRIGHT_FULL, W - padX, mid);
  ctx.textAlign = 'left';
}
async function renderPage(key, scale) {
  const img = await loadImage(key);
  const W = Math.round(img.naturalWidth * scale), H = Math.round(img.naturalHeight * scale), foot = Math.round(W * FOOT_RATIO);
  const c = document.createElement('canvas'); c.width = W; c.height = H + foot;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H + foot); /* fundo branco: o JPG não tem transparência */
  ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, W, H);
  if (PAGE[key].kind === 'canvas') drawNotes(ctx, boards[key] || [], W, H);
  drawFooter(ctx, W, H, foot, PAGE[key].title);
  return c;
}

/* PDF escrito à mão (sem bibliotecas): uma imagem JPEG por página, em A3 paisagem, com metadados e copyright. */
const utf8 = new TextEncoder();
const pdfText = s => '<FEFF' + Array.from(s, ch => ch.charCodeAt(0).toString(16).padStart(4, '0')).join('') + '>'; /* UTF-16BE */
const xml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function buildPdf(pages, title) {
  const parts = [], offsets = []; let len = 0;
  const push = d => { const u = typeof d === 'string' ? utf8.encode(d) : d; parts.push(u); len += u.length; };
  const obj = (num, body) => { offsets[num] = len; push(`${num} 0 obj\n${body}\nendobj\n`); };
  const stream = (num, dict, bytes) => { offsets[num] = len; push(`${num} 0 obj\n<< ${dict} /Length ${bytes.length} >>\nstream\n`); push(bytes); push('\nendstream\nendobj\n'); };
  const now = new Date(), iso = now.toISOString().replace(/\.\d+Z$/, 'Z'), d = iso.replace(/[-:]/g, '').replace('T', '');
  const xmp = `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>\n<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xmp="http://ns.adobe.com/xap/1.0/" xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/" xmlns:pdf="http://ns.adobe.com/pdf/1.3/">`
    + `<dc:title><rdf:Alt><rdf:li xml:lang="x-default">${xml(title)}</rdf:li></rdf:Alt></dc:title>`
    + `<dc:creator><rdf:Seq><rdf:li>BemCria Criatividade e Estratégia</rdf:li></rdf:Seq></dc:creator>`
    + `<dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${xml(COPYRIGHT_FULL)}</rdf:li></rdf:Alt></dc:rights>`
    + `<xmpRights:Marked>True</xmpRights:Marked><xmp:CreateDate>${iso}</xmp:CreateDate><pdf:Producer>${xml(PRODUCER)}</pdf:Producer>`
    + `</rdf:Description></rdf:RDF></x:xmpmeta>\n<?xpacket end="w"?>`;
  push('%PDF-1.4\n%\u00E2\u00E3\u00CF\u00D3\n');
  obj(1, '<< /Type /Catalog /Pages 2 0 R /Metadata 4 0 R >>');
  obj(2, `<< /Type /Pages /Kids [${pages.map((_, i) => `${5 + i * 3} 0 R`).join(' ')}] /Count ${pages.length} >>`);
  obj(3, `<< /Title ${pdfText(title)} /Author ${pdfText('BemCria Criatividade e Estratégia')} /Copyright ${pdfText(COPYRIGHT_FULL)} /Creator ${pdfText(PRODUCER)} /Producer ${pdfText(PRODUCER)} /CreationDate (D:${d}) >>`);
  stream(4, '/Type /Metadata /Subtype /XML', utf8.encode(xmp));
  pages.forEach((p, i) => {
    const pg = 5 + i * 3, ct = pg + 1, im = pg + 2, ph = (PDF_W * p.h / p.w).toFixed(2);
    obj(pg, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_W} ${ph}] /Resources << /XObject << /Im0 ${im} 0 R >> /ProcSet [/PDF /ImageC] >> /Contents ${ct} 0 R >>`);
    stream(ct, '', utf8.encode(`q ${PDF_W} 0 0 ${ph} 0 0 cm /Im0 Do Q`));
    stream(im, `/Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode`, p.jpeg);
  });
  const total = 4 + pages.length * 3, xref = len;
  push(`xref\n0 ${total + 1}\n0000000000 65535 f \n`);
  for (let i = 1; i <= total; i++) push(String(offsets[i]).padStart(10, '0') + ' 00000 n \n');
  push(`trailer\n<< /Size ${total + 1} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(parts, { type: 'application/pdf' });
}
function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
}
function exportJSON() {
  const json = JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), boards }, null, 2);
  download(new Blob([json], { type: 'application/json' }), `postits-canvas-${today()}.json`);
  const total = CANVAS_KEYS.reduce((s, k) => s + boards[k].length, 0);
  toast(`${plural(total, 'post-it exportado', 'post-its exportados')} (todas as páginas).`);
}
async function runExport({ fmt, what, scale }) {
  if (fmt === 'json') return exportJSON();
  const keys = what === 'all' ? PAGES.map(p => p.key) : [what];
  const name = `${what === 'all' ? 'canvas-completo' : what}-${today()}`;
  const go = $('#btnExport'); go.disabled = true;
  toast('Gerando o arquivo…', 'ok', 180000);
  await new Promise(r => setTimeout(r, 50)); /* deixa o aviso aparecer antes do trabalho pesado */
  try {
    if (fmt === 'pdf') {
      const pages = [];
      for (const [i, k] of keys.entries()) {
        if (keys.length > 1) toast(`Gerando página ${i + 1} de ${keys.length}…`, 'ok', 180000);
        const c = await renderPage(k, scale), blob = await toBlob(c, 'image/jpeg', 0.92);
        pages.push({ jpeg: new Uint8Array(await blob.arrayBuffer()), w: c.width, h: c.height });
        c.width = c.height = 0;
      }
      download(buildPdf(pages, what === 'all' ? 'Canvas — BemCria Criatividade e Estratégia' : PAGE[what].title), name + '.pdf');
    } else {
      const c = await renderPage(keys[0], scale);
      download(await toBlob(c, fmt === 'jpg' ? 'image/jpeg' : 'image/png', 0.92), `${name}.${fmt}`);
      c.width = c.height = 0;
    }
    toast('Arquivo exportado.');
  } catch (err) {
    const tainted = err && (err.name === 'SecurityError' || /taint|insecure/i.test(err.message || ''));
    toast(tainted ? 'O navegador bloqueou a exportação das imagens. Abra o projeto por um servidor (veja o README) e tente de novo.' : 'Não foi possível gerar o arquivo. Tente a resolução Média.', 'error', 9000);
  } finally { go.disabled = false; }
}

const expDlg = $('#exportDialog'), expForm = $('#exportForm'), expPage = $('#expPage');
const optGroup = (label, kind) => `<optgroup label="${label}">${PAGES.filter(p => p.kind === kind).map(p => `<option value="${p.key}">${p.title}</option>`).join('')}</optgroup>`;
expPage.innerHTML = optGroup('Canvas (com os post-its)', 'canvas') + optGroup('Referências', 'viewer') + `<option value="all">Todas as páginas — PDF com ${PAGES.length} páginas</option>`;
const chosenFmt = () => $('input[name=fmt]:checked', expForm).value;
function baseDims() { return [stageImg.naturalWidth || 3308, stageImg.naturalHeight || 2339]; }
function syncExport() {
  const fmt = chosenFmt(), isPdf = fmt === 'pdf', isJson = fmt === 'json';
  $('option[value=all]', expPage).disabled = !isPdf;
  if (!isPdf && expPage.value === 'all') expPage.value = currentKey;
  $('#expWhat').disabled = isJson; $('#expScaleWrap').hidden = isJson;
  const [bw, bh] = baseDims(), keep = $('#expScale').value || '1';
  $('#expScale').innerHTML = [['1', 'Alta'], ['0.5', 'Média']].map(([v, t]) => {
    const w = Math.round(bw * v), h = Math.round(bh * v) + Math.round(w * FOOT_RATIO);
    return `<option value="${v}" ${v === keep ? 'selected' : ''}>${t} — ${w} × ${h} px</option>`;
  }).join('');
  const w = expPage.value, withNotes = w === 'all' ? 'Inclui os post-its de todas as páginas. ' : (PAGE[w]?.kind === 'canvas' ? 'Inclui os post-its desta página. ' : '');
  $('#expHint').textContent = isJson
    ? 'Salva os post-its de todas as páginas, para backup ou para levar a outro computador. Restaure com “Importar dados”.'
    : `${withNotes}Todas as páginas saem com o rodapé de copyright.${isPdf ? ' O PDF usa o formato A3 em paisagem.' : ''} A resolução Média gera um arquivo menor.`;
}
function openExport(what = currentKey) {
  expPage.value = what; syncExport(); expDlg.showModal(); $('input[name=fmt]:checked', expForm).focus();
}
expForm.addEventListener('change', syncExport);
$('#expCancel').addEventListener('click', () => expDlg.close());
expForm.addEventListener('submit', e => {
  e.preventDefault();
  const req = { fmt: chosenFmt(), what: expPage.value, scale: +$('#expScale').value || 1 };
  expDlg.close(); runExport(req);
});
$('#btnExport').addEventListener('click', () => openExport(currentKey));

/* ---------- Importar e limpar ---------- */
$('#btnImport').addEventListener('click', () => $('#fileImport').click());
$('#fileImport').addEventListener('change', async e => {
  const file = e.target.files[0]; e.target.value = '';
  if (!file) return;
  let data;
  try { data = JSON.parse(await file.text()); } catch (err) { return toast('Arquivo inválido: não é um JSON legível.', 'error'); }
  const r = parseImport(data);
  if (r.error) return toast('Importação cancelada. ' + r.error, 'error');
  const keys = Object.keys(r.boards), incoming = keys.reduce((s, k) => s + r.boards[k].length, 0), current = keys.reduce((s, k) => s + boards[k].length, 0);
  const where = keys.length === 1 ? `na página “${PAGE[keys[0]].title}”` : `em ${keys.length} páginas`;
  if (current && !(await ask(`Importar ${plural(incoming, 'post-it', 'post-its')} ${where}? Os ${current} atuais ${keys.length === 1 ? 'dessa página serão substituídos' : 'dessas páginas serão substituídos'}.`, 'Importar'))) return;
  keys.forEach(k => { boards[k] = r.boards[k]; });
  notes = boards[activeKey]; save(); render(); toast(`${plural(incoming, 'post-it importado', 'post-its importados')} com sucesso ${where}.`);
});
$('#btnClear').addEventListener('click', async () => {
  if (!notes.length) return toast('Esta página já está vazia.');
  if (!(await ask(`Apagar ${notes.length === 1 ? 'o post-it' : `todos os ${notes.length} post-its`} desta página (${PAGE[activeKey].title})? Esta ação não pode ser desfeita. Considere exportar os dados antes.`, 'Apagar tudo'))) return;
  setNotes([]); save(); render(); toast('Página limpa.');
});

/* ---------- Visualizadores estáticos (páginas de referência) ---------- */
function buildViewer(sec, p) {
  const v = $('#viewerTpl').content.firstElementChild.cloneNode(true);
  const img = $('img', v), box = $('.vbox', v), label = $('.zoom-label', v), dl = $('[data-v=dl]', v);
  img.loading = 'lazy'; img.decoding = 'async'; img.src = p.src; img.alt = p.alt; dl.href = p.src; dl.download = `${p.key}.png`;
  box.setAttribute('aria-label', `${p.title}: imagem ampliável, role para navegar`);
  let width = 0, fitMode = true;
  const fitW = () => Math.max(box.clientWidth - 2, 200);
  const apply = () => { img.style.width = width + 'px'; label.textContent = Math.round(width / fitW() * 100) + '%'; };
  const fit = () => { fitMode = true; width = fitW(); apply(); };
  const zoom = f => { fitMode = false; width = clamp(width * f, 200, (img.naturalWidth || 3308) * 2); apply(); };
  v.addEventListener('click', e => {
    const a = e.target.closest('[data-v]')?.dataset.v;
    if (a === 'in') zoom(1.25); else if (a === 'out') zoom(0.8); else if (a === 'fit') fit();
    else if (a === 'orig') { fitMode = false; width = img.naturalWidth || 3308; apply(); }
    else if (a === 'exp') openExport(p.key);
    else if (a === 'hand') setHand(!handOn);
    else if (a === 'full') {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (v.requestFullscreen) v.requestFullscreen().catch(() => toast('Seu navegador bloqueou a tela cheia.', 'error'));
      else toast('Tela cheia não é suportada neste navegador. Use o zoom.', 'error');
    }
  });
  v.addEventListener('shown', () => { if (fitMode) fit(); });
  new ResizeObserver(() => { if (fitMode && box.clientWidth) fit(); }).observe(box);
  img.draggable = false; enablePan(box, [img]);
  sec.append(v);
}

/* ---------- Abas e páginas ---------- */
const tabsEl = $('#tabs'), tabsPrev = $('#tabsPrev'), tabsNext = $('#tabsNext'), canvasPanel = $('#panel-canvas');
const tabBtns = {}, viewerPanels = {};
let currentKey = null;
PAGES.forEach((p, i) => {
  if (p.kind === 'viewer' && PAGES[i - 1]?.kind === 'canvas') { /* divisória entre Canvas e Referências */
    const sep = document.createElement('span'); sep.className = 'tab-sep'; sep.setAttribute('aria-hidden', 'true'); tabsEl.append(sep);
  }
  const t = document.createElement('button');
  t.type = 'button'; t.setAttribute('role', 'tab'); t.id = `tab-${p.key}`; t.dataset.key = p.key; t.textContent = PAGE[p.key].tab;
  t.setAttribute('aria-controls', p.kind === 'canvas' ? 'panel-canvas' : `panel-${p.key}`);
  t.setAttribute('aria-selected', 'false'); t.tabIndex = -1;
  tabsEl.append(t); tabBtns[p.key] = t;
  if (p.kind === 'viewer') {
    const sec = document.createElement('section');
    sec.setAttribute('role', 'tabpanel'); sec.id = `panel-${p.key}`; sec.setAttribute('aria-labelledby', t.id); sec.hidden = true;
    $('#viewerPanels').append(sec); viewerPanels[p.key] = sec; buildViewer(sec, PAGE[p.key]);
  }
});

function activateBoard(key) {
  activeKey = key; notes = boards[key];
  const p = PAGE[key];
  stageImg.alt = p.alt;
  if (!stageImg.src.endsWith(p.src)) stageImg.src = p.src;
  wrap.scrollLeft = 0; wrap.scrollTop = 0;
  render(); relayout();
}
function selectPage(key, o = {}) {
  const p = PAGE[key]; if (!p) return;
  currentKey = key;
  PAGES.forEach(q => { const on = q.key === key; tabBtns[q.key].setAttribute('aria-selected', on); tabBtns[q.key].tabIndex = on ? 0 : -1; });
  const isCanvas = p.kind === 'canvas';
  canvasPanel.hidden = !isCanvas;
  if (isCanvas) canvasPanel.setAttribute('aria-labelledby', `tab-${key}`);
  Object.entries(viewerPanels).forEach(([k, sec]) => { sec.hidden = k !== key; });
  if (isCanvas) activateBoard(key); else $('.viewer', viewerPanels[key]).dispatchEvent(new Event('shown'));
  $('#pageTitle').textContent = p.title;
  document.title = `${p.title} — Canvas interativo | BemCria`;
  const t = tabBtns[key];
  tabsEl.scrollTo({ left: t.offsetLeft - (tabsEl.clientWidth - t.offsetWidth) / 2, behavior: o.init || reduceMotion() ? 'auto' : 'smooth' });
  try { history.replaceState(null, '', '#' + key); } catch (e) { /* alguns navegadores bloqueiam em file:// */ }
  try { localStorage.setItem(PAGE_KEY, key); } catch (e) { /* ignora */ }
  if (o.focus) t.focus();
}
tabsEl.addEventListener('click', e => { const t = e.target.closest('[role=tab]'); if (t) selectPage(t.dataset.key); });
tabsEl.addEventListener('keydown', e => {
  const i = PAGES.findIndex(p => p.key === currentKey);
  const j = { ArrowRight: (i + 1) % PAGES.length, ArrowLeft: (i - 1 + PAGES.length) % PAGES.length, Home: 0, End: PAGES.length - 1 }[e.key];
  if (j === undefined) return;
  e.preventDefault(); selectPage(PAGES[j].key, { focus: true });
});
function updateTabsNav() {
  const max = tabsEl.scrollWidth - tabsEl.clientWidth;
  tabsPrev.hidden = max <= 1 || tabsEl.scrollLeft <= 1;
  tabsNext.hidden = max <= 1 || tabsEl.scrollLeft >= max - 1;
}
tabsEl.addEventListener('scroll', updateTabsNav, { passive: true });
new ResizeObserver(updateTabsNav).observe(tabsEl);
const scrollTabs = dir => tabsEl.scrollBy({ left: dir * tabsEl.clientWidth * 0.7, behavior: reduceMotion() ? 'auto' : 'smooth' });
tabsPrev.addEventListener('click', () => scrollTabs(-1));
tabsNext.addEventListener('click', () => scrollTabs(1));
addEventListener('hashchange', () => { const k = resolveKey(location.hash.slice(1)); if (k && k !== currentKey) selectPage(k); });

load();
let first = resolveKey(location.hash.slice(1));
if (!first) { try { first = resolveKey(localStorage.getItem(PAGE_KEY)); } catch (e) { first = null; } }
selectPage(first || PAGES[0].key, { init: true });
syncHand(); updateTabsNav();
