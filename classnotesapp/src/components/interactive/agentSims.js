// Interactive simulator for "LLMs, Agentes y MCP Servers" (Computación en Internet II).
// Plain DOM, no React and no imports, same contract as springSecuritySims.js:
// every simulator is `mount(element, args) => destroy`.

const STYLE_ID = 'asim-style';

const CSS = `
.asim{background:#FBFBFD;color:#161A26;border:1px solid #D9DEE8;border-radius:16px;padding:16px;box-sizing:border-box;
  font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:1.4;max-width:960px;margin:0 auto;container-type:inline-size}
.asim *{box-sizing:border-box}
.asim .as-title{font-size:17px;font-weight:700;margin:0 0 2px}
.asim .as-sub{font-size:12.5px;color:#79809A;margin:0 0 12px}
.asim .as-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
.asim .as-tab{border:1.5px solid #C4CBD8;background:#fff;color:#556074;border-radius:18px;padding:6px 16px;cursor:pointer;
  font:700 13px Roboto,Arial,sans-serif}
.asim .as-tab:hover{box-shadow:0 0 0 3px #E3E7EF}
.asim .as-tab.as-sel{background:#4453C9;border-color:#4453C9;color:#fff}
.asim .as-explain{background:#fff;border:1.5px solid #D9DEE8;border-radius:12px;padding:10px 14px;margin-bottom:12px;font-size:13.5px;line-height:1.5}
.asim .as-explain b{color:#4453C9}
.asim .as-body{display:grid;grid-template-columns:minmax(0,1fr) 26px minmax(0,1fr) 34px minmax(0,1fr);align-items:stretch}
.asim .as-bg{border:1.5px solid var(--b);background:var(--bg);border-radius:12px}
.asim .as-cell{min-width:0;padding:10px;display:flex;flex-direction:column;gap:6px;position:relative;z-index:1}
.asim .as-context{--b:#C9A6EE;--bg:#F4EBFF;--ink:#7439B8}
.asim .as-tools{--b:#A9B4F2;--bg:#EEF1FF;--ink:#4453C9}
.asim .as-bg.as-tools{border-style:dashed}
.asim .as-project{--b:#86D3CA;--bg:#E3F6F3;--ink:#0F8478}
.asim .as-outside{--b:#C4CBD8;--bg:#EFF1F5;--ink:#556074}
.asim .as-cell.as-outside{justify-content:center}
.asim .as-outside .as-ext-note{font-size:11.5px;color:#556074;margin:-2px 0 2px}
.asim .as-wire{display:flex;align-items:center;padding:0 2px;z-index:1}
.asim .as-wire i{flex:1;height:2px;background:var(--w,#A9B4F2);position:relative;transition:box-shadow .25s}
.asim .as-wire i::after{content:'';position:absolute;right:-2px;top:-5px;border:6px solid transparent;border-left:8px solid var(--w,#A9B4F2);border-right:0}
.asim .as-wire.as-stitch{--w:#D9A23F}
.asim .as-wire.as-playwright{--w:#3FB3A4}
.asim .as-wire.as-hot i{height:3px;box-shadow:0 0 0 3px #F8DFA8}
.asim .as-colhead{font-size:11.5px;font-weight:700;letter-spacing:.08em;color:var(--ink)}
.asim .as-llm{background:#7439B8;color:#fff;border-radius:10px;padding:8px;text-align:center;font-weight:700;font-size:15px}
.asim .as-llm small{display:block;font-weight:400;font-size:11.5px;opacity:.9}
.asim .as-group{font-size:10.5px;font-weight:700;letter-spacing:.06em;color:#79809A;margin-top:4px}
.asim .as-group.as-stitch{color:#A96C05}
.asim .as-group.as-playwright{color:#0F8478}
.asim .as-item{background:#fff;border:1.5px solid #D9DEE8;border-radius:8px;padding:4px 8px;font-size:12.5px;
  display:flex;justify-content:space-between;gap:4px 8px;flex-wrap:wrap;align-items:baseline;transition:box-shadow .25s,opacity .25s}
.asim .as-item code{font:600 12px 'JetBrains Mono',Menlo,Consolas,monospace;overflow-wrap:anywhere;min-width:0}
.asim .as-item span{font-size:11.5px;color:#79809A}
.asim .as-item.as-skill{border-color:#C9A6EE}
.asim .as-item.as-stitch{border-color:#F0C572;background:#FFFBF1}
.asim .as-item.as-playwright{border-color:#86D3CA;background:#F3FBF9}
.asim .as-item.as-new{border-style:dashed;border-width:2px}
.asim .as-item.as-hot{box-shadow:0 0 0 3px #F2C069}
.asim .as-item.as-ext{padding:6px 8px}
.asim .as-item[data-depth="1"]{margin-left:12px}
.asim .as-item[data-depth="2"]{margin-left:24px}
.asim .as-item[data-depth="3"]{margin-left:36px}
.asim .as-badge{font:700 10px Roboto,Arial,sans-serif;border-radius:8px;padding:0 6px;background:#FFF3DC;color:#A96C05}
.asim .as-link{display:flex;align-items:center;justify-content:center;color:#A9B4F2;font-size:18px;font-weight:700}
.asim .as-prompts{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:12px 0 8px;font-size:12px;color:#556074}
.asim .as-prompt{border:1.5px solid #C9A6EE;background:#fff;color:#161A26;border-radius:10px;padding:5px 12px;cursor:pointer;
  font:600 12.5px Roboto,Arial,sans-serif;text-align:left}
.asim .as-prompt:hover{box-shadow:0 0 0 3px #E6D5FA}
.asim .as-prompt.as-sel{background:#F4EBFF;border-color:#7439B8}
.asim .as-steps{margin:0;padding:10px 14px 10px 34px;background:#fff;border:1.5px solid #D9DEE8;border-radius:12px;font-size:13px;line-height:1.5}
.asim .as-steps li+li{margin-top:4px}
.asim .as-steps code{font:12px 'JetBrains Mono',Menlo,Consolas,monospace;background:#EFF1F5;border-radius:4px;padding:0 4px}
@container (max-width:640px){
  .asim .as-body{display:flex;flex-direction:column;gap:6px}
  .asim .as-bg,.asim .as-link{display:none}
  .asim .as-cell{border:1.5px solid var(--b);background:var(--bg);border-radius:12px}
  .asim .as-wire{justify-content:center;height:22px}
  .asim .as-wire i{flex:0 0 22px;transform:rotate(90deg)}
}
`;

const ensureStyle = () => {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
};

const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false) return;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? '' : value);
  });
  children.flat().forEach((child) => {
    if (child === null || child === undefined || child === false) return;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  });
  return node;
};

// Text with `code` spans, so the step lists can name tools and files.
const rich = (text) => text.split(/(`[^`]+`)/).filter(Boolean)
  .map((part) => (part.startsWith('`') ? el('code', { text: part.slice(1, -1) }) : part));

export const AGENT_STAGES = [
  {
    key: 'agent',
    tab: 'Agente',
    explain: 'El **LLM** solo produce texto. El **tool system** convierte lo que pide en acciones reales sobre '
      + 'tu proyecto: leer, buscar, editar y ejecutar. Repite ese ciclo hasta que puede responder.',
  },
  {
    key: 'skills',
    tab: '+ Skills',
    explain: 'Una **skill** es una descripción metodológica: los pasos para hacer una tarea, en una carpeta con '
      + 'un `SKILL.md`. Puede traer **references** (lo que consulta) y **scripts** (lo que ejecuta). '
      + 'No agrega tools: el LLM la lee y la sigue con las de siempre. De entrada solo ve su description.',
  },
  {
    key: 'mcp',
    tab: '+ MCP',
    explain: 'Un **servidor MCP** agrega tools nuevas al tool system. El LLM las ve en el mismo catálogo que '
      + 'las nativas y las llama igual; el servidor hace el trabajo afuera: Stitch en la nube por HTTP, '
      + 'Playwright en un Chromium de tu equipo por stdio.',
  },
];

// col: context | tools | world. stage: first stage where it appears. onDemand: only while a prompt uses it.
export const AGENT_ITEMS = [
  { key: 'c-system', col: 'context', stage: 'agent', label: 'Instrucciones del agente' },
  { key: 'c-catalog', col: 'context', stage: 'agent', label: 'Catálogo de tools', note: 'nombre + parámetros' },
  { key: 'c-agents', col: 'context', stage: 'agent', label: 'AGENTS.md' },
  { key: 'c-spec', col: 'context', stage: 'skills', kind: 'skill', label: 'spec-writer', note: 'solo description' },
  { key: 'c-db', col: 'context', stage: 'skills', kind: 'skill', label: 'db-designer', note: 'solo description' },
  { key: 'c-spec-body', col: 'context', stage: 'skills', kind: 'skill', onDemand: true, label: 'SKILL.md de spec-writer', note: 'cargado' },
  { key: 'c-db-body', col: 'context', stage: 'skills', kind: 'skill', onDemand: true, label: 'SKILL.md de db-designer', note: 'cargado' },
  { key: 'c-prompt', col: 'context', stage: 'agent', label: 'Tu pedido' },

  { key: 't-read', col: 'tools', stage: 'agent', group: 'native', label: 'read', note: 'Leer archivos' },
  { key: 't-grep', col: 'tools', stage: 'agent', group: 'native', label: 'grep', note: 'Buscar en el código' },
  { key: 't-edit', col: 'tools', stage: 'agent', group: 'native', label: 'edit', note: 'Editar archivos' },
  { key: 't-bash', col: 'tools', stage: 'agent', group: 'native', label: 'bash', note: 'Ejecutar comandos' },
  { key: 't-st-gen', col: 'tools', stage: 'mcp', group: 'stitch', label: 'generate_screen_from_text' },
  { key: 't-st-get', col: 'tools', stage: 'mcp', group: 'stitch', label: 'get_screen' },
  { key: 't-pw-nav', col: 'tools', stage: 'mcp', group: 'playwright', label: 'browser_navigate' },
  { key: 't-pw-click', col: 'tools', stage: 'mcp', group: 'playwright', label: 'browser_click' },
  { key: 't-pw-snap', col: 'tools', stage: 'mcp', group: 'playwright', label: 'browser_snapshot' },

  { key: 'w-root', col: 'world', stage: 'agent', depth: 0, label: 'mi-api/' },
  { key: 'w-agents', col: 'world', stage: 'agent', depth: 1, label: 'AGENTS.md' },
  { key: 'w-pom', col: 'world', stage: 'agent', depth: 1, label: 'pom.xml' },
  { key: 'w-service', col: 'world', stage: 'agent', depth: 1, label: 'src/…/CursoService.java' },
  { key: 'w-skills', col: 'world', stage: 'skills', depth: 1, kind: 'skill', label: '.agents/skills/' },
  { key: 'w-spec', col: 'world', stage: 'skills', depth: 2, kind: 'skill', label: 'spec-writer/SKILL.md' },
  { key: 'w-spec-ref', col: 'world', stage: 'skills', depth: 3, kind: 'skill', label: 'references/plantilla.md' },
  { key: 'w-db', col: 'world', stage: 'skills', depth: 2, kind: 'skill', label: 'db-designer/SKILL.md' },
  { key: 'w-db-script', col: 'world', stage: 'skills', depth: 3, kind: 'skill', label: 'scripts/validar.py' },
  { key: 'w-spec-out', col: 'world', stage: 'skills', depth: 1, onDemand: true, label: 'docs/specs/exportar-csv.md', note: 'nuevo' },
  { key: 'w-db-out', col: 'world', stage: 'skills', depth: 1, onDemand: true, label: 'docs/modelo.sql', note: 'nuevo' },
  { key: 'w-stitch', col: 'world', stage: 'mcp', group: 'stitch', ext: true, label: 'Stitch', note: 'nube · HTTP',
    what: 'Genera los diseños de pantallas.' },
  { key: 'w-chromium', col: 'world', stage: 'mcp', group: 'playwright', ext: true, label: 'Chromium', note: 'tu equipo · stdio',
    what: 'Un navegador que controla Playwright.' },
];

export const AGENT_PROMPTS = {
  agent: [
    {
      key: 'bug',
      text: 'Lee CursoService.java y dime si hay un bug',
      hot: ['c-prompt', 't-read', 'w-service'],
      steps: [
        'El LLM lee tu pedido y el catálogo, y responde con una llamada: `read("src/…/CursoService.java")`.',
        'El tool system lee el archivo del disco y le devuelve el texto al LLM.',
        'Con el código en su contexto, el LLM responde: "en la línea 34 puede haber un NullPointerException".',
      ],
    },
    {
      key: 'tests',
      text: 'Corre los tests y arregla el que falle',
      hot: ['c-prompt', 't-bash', 't-edit', 'w-service'],
      steps: [
        'El LLM pide `bash("mvn test")`; el tool system lo ejecuta y le devuelve la salida con el test que falla.',
        'El LLM pide `edit` sobre CursoService.java con el cambio.',
        'Vuelve a pedir `bash("mvn test")`. Todo pasa: ahora sí responde.',
      ],
    },
  ],
  skills: [
    {
      key: 'spec',
      text: 'Escribe la spec para exportar los pedidos a CSV',
      hot: ['c-prompt', 'c-spec', 'c-spec-body', 't-read', 't-edit', 'w-spec', 'w-spec-ref', 'w-spec-out'],
      steps: [
        'El LLM solo conoce el name y la description de cada skill. La de `spec-writer` coincide con el pedido.',
        'Con `read` carga su SKILL.md: las secciones de una spec y cómo redactar cada una.',
        'Sigue los pasos: lee `references/plantilla.md` y escribe `docs/specs/exportar-csv.md` con `edit`.',
        '`db-designer` nunca se cargó: se quedó en su description.',
      ],
    },
    {
      key: 'db',
      text: 'Diseña el modelo de datos de las matrículas',
      hot: ['c-prompt', 'c-db', 'c-db-body', 't-read', 't-edit', 't-bash', 'w-db', 'w-db-script', 'w-db-out'],
      steps: [
        'La description de `db-designer` coincide con el pedido.',
        'Con `read` carga su SKILL.md: entidades, relaciones, normalización y convención de nombres.',
        'Escribe `docs/modelo.sql` con `edit`.',
        'El SKILL.md dice "al terminar, ejecuta `scripts/validar.py`". El LLM lo corre con `bash`.',
      ],
    },
  ],
  mcp: [
    {
      key: 'stitch',
      text: 'Diseña en Stitch la pantalla de login',
      hot: ['c-prompt', 'c-catalog', 't-st-gen', 't-st-get', 'w-stitch'],
      steps: [
        'Al arrancar, el agente le pidió al servidor de Stitch su lista de tools y las sumó al catálogo.',
        'El LLM llama `generate_screen_from_text` como a cualquier otra tool. El servidor la ejecuta en la nube.',
        'Con `get_screen` trae el diseño generado. El LLM nunca habló con Stitch: solo con el tool system.',
      ],
    },
    {
      key: 'playwright',
      text: 'Abre la app y prueba el login',
      hot: ['c-prompt', 'c-catalog', 't-bash', 't-pw-nav', 't-pw-click', 't-pw-snap', 'w-chromium'],
      steps: [
        'Con `bash` arranca la app, como antes.',
        '`browser_navigate` abre `localhost:8080/login` en un Chromium que controla Playwright.',
        '`browser_click` pulsa "Entrar" y `browser_snapshot` devuelve lo que quedó en la página.',
        'El LLM lee esa snapshot y te dice si el login funcionó.',
      ],
    },
  ],
};

const STAGE_INDEX = Object.fromEntries(AGENT_STAGES.map((stage, index) => [stage.key, index]));

export const agentScene = (stageKey, promptKey) => {
  const level = STAGE_INDEX[stageKey] ?? 0;
  const stage = AGENT_STAGES[level];
  const prompts = AGENT_PROMPTS[stage.key];
  const prompt = prompts.find((item) => item.key === promptKey) || null;
  const hot = new Set(prompt ? prompt.hot : []);
  const items = AGENT_ITEMS
    .filter((item) => STAGE_INDEX[item.stage] <= level && (!item.onDemand || hot.has(item.key)))
    .filter((item) => !(stage.key === 'mcp' && item.col === 'world' && item.depth >= 2))
    .map((item) => ({ ...item, isNew: level > 0 && item.stage === stage.key, hot: hot.has(item.key) }));
  return { stage, prompts, prompt, items, steps: prompt ? prompt.steps : [] };
};

const GROUP_LABEL = { native: 'NATIVAS', stitch: 'MCP · STITCH', playwright: 'MCP · PLAYWRIGHT' };

const mountAgentStack = (root, args = []) => {
  ensureStyle();
  const container = el('div', { class: 'asim', 'data-testid': 'agent-stack' });
  root.replaceChildren(container);

  let stageKey = STAGE_INDEX[args[0]] !== undefined ? args[0] : 'agent';
  let promptKey = null;

  const tabs = el('div', { class: 'as-tabs', role: 'tablist' });
  const explain = el('div', { class: 'as-explain', 'aria-live': 'polite' });
  const body = el('div', { class: 'as-body' });
  const prompts = el('div', { class: 'as-prompts' });
  const steps = el('ol', { class: 'as-steps', 'data-testid': 'agent-steps' });

  const itemNode = (item) => {
    const classes = ['as-item', item.kind === 'skill' && 'as-skill', item.group && item.group !== 'native' && `as-${item.group}`,
      item.ext && 'as-ext', item.isNew && 'as-new', item.hot && 'as-hot'].filter(Boolean).join(' ');
    const note = item.isNew ? el('span', { class: 'as-badge', text: item.note || 'nuevo' }) : item.note && el('span', { text: item.note });
    return el('div', { class: classes, 'data-item': item.key, 'data-depth': item.depth || undefined },
      item.col === 'context' && !item.kind ? el('b', { text: item.label, style: 'font-size:12.5px' }) : el('code', { text: item.label }), note);
  };

  const render = () => {
    const scene = agentScene(stageKey, promptKey);
    [...tabs.children].forEach((tab) => {
      const on = tab.dataset.stage === stageKey;
      tab.classList.toggle('as-sel', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    explain.replaceChildren(...scene.stage.explain.split(/(\*\*[^*]+\*\*)/).filter(Boolean)
      .flatMap((part) => (part.startsWith('**') ? [el('b', { text: part.slice(2, -2) })] : rich(part))));

    const byCol = (col) => scene.items.filter((item) => item.col === col);
    const tools = (group) => byCol('tools').filter((item) => item.group === group);
    const mcp = stageKey === 'mcp';
    const at = (col, row) => `grid-column:${col};grid-row:${row}`;
    const rows = mcp ? '1 / 4' : '1 / 2';
    const cell = (cls, col, row, ...children) => el('div', { class: `as-cell ${cls}`, style: at(col, row) }, ...children);
    const wire = (group, row, items) => el('div', {
      class: `as-wire as-${group}${items.some((item) => item.hot) ? ' as-hot' : ''}`,
      style: at(4, row),
      'data-wire': group,
    }, el('i'));
    const toolCell = (group, row, head) => cell('as-tools', 3, row, head,
      el('div', { class: `as-group as-${group}`, text: GROUP_LABEL[group] }), tools(group).map(itemNode));
    const project = byCol('world').filter((item) => !item.ext);
    const outside = (key) => byCol('world').find((item) => item.key === key);

    const parts = [
      el('div', { class: 'as-bg as-context', style: at(1, rows) }),
      cell('as-context', 1, rows, el('div', { class: 'as-colhead', text: 'CONTEXTO DEL LLM' }),
        el('div', { class: 'as-llm' }, 'LLM', el('small', { text: 'predice texto y decide qué tool pedir' })),
        byCol('context').map(itemNode)),
      el('div', { class: 'as-link', style: at(2, rows), text: '⇄' }),
      el('div', { class: 'as-bg as-tools', style: at(3, rows) }),
      toolCell('native', 1, el('div', { class: 'as-colhead', text: 'TOOL SYSTEM' })),
      wire('native', 1, [...tools('native'), ...project]),
      el('div', { class: 'as-bg as-project', style: at(5, 1) }),
      cell('as-project', 5, 1, el('div', { class: 'as-colhead', text: 'TU PROYECTO' }), project.map(itemNode)),
    ];
    if (mcp) {
      const stitch = outside('w-stitch');
      const chromium = outside('w-chromium');
      parts.push(
        el('div', { class: 'as-bg as-outside', style: at(5, '2 / 4') }),
        toolCell('stitch', 2), wire('stitch', 2, [...tools('stitch'), stitch]),
        cell('as-outside', 5, 2, el('div', { class: 'as-colhead', text: 'MUNDO EXTERIOR' }),
          itemNode(stitch), el('div', { class: 'as-ext-note', text: stitch.what })),
        toolCell('playwright', 3), wire('playwright', 3, [...tools('playwright'), chromium]),
        cell('as-outside', 5, 3, itemNode(chromium), el('div', { class: 'as-ext-note', text: chromium.what })));
    }
    body.replaceChildren(...parts);

    prompts.replaceChildren('Pídale:', ...scene.prompts.map((item) => el('button', {
      class: `as-prompt${item.key === promptKey ? ' as-sel' : ''}`,
      type: 'button',
      'data-prompt': item.key,
      onclick: () => { promptKey = item.key === promptKey ? null : item.key; render(); },
    }, `«${item.text}»`)));

    steps.hidden = !scene.steps.length;
    steps.replaceChildren(...scene.steps.map((text) => el('li', {}, rich(text))));
  };

  AGENT_STAGES.forEach((stage) => tabs.append(el('button', {
    class: 'as-tab',
    type: 'button',
    role: 'tab',
    'data-stage': stage.key,
    onclick: () => { stageKey = stage.key; promptKey = null; render(); },
  }, stage.tab)));

  container.append(
    el('div', { class: 'as-title', text: 'Qué le suman las skills y los servidores MCP a un agente' }),
    el('div', { class: 'as-sub', text: 'Cambie de pestaña y pulse un pedido para ver por dónde pasa.' }),
    tabs, explain, body, prompts, steps);
  render();
  return () => root.replaceChildren();
};

export const SIMS = Object.freeze({
  'agent-stack': mountAgentStack,
});
