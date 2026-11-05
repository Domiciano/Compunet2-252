// Interactive simulators for the React introduction (Computación en Internet II, SEMANA 14).
// Plain DOM, no React and no imports, same contract as agentSims.js:
// every simulator is `mount(element, args) => destroy`.

const STYLE_ID = 'rsim-style';
const MONO = "'JetBrains Mono',Menlo,Consolas,monospace";

const CSS = `
.rsim{background:#FBFBFD;color:#161A26;border:1px solid #D9DEE8;border-radius:16px;padding:16px;box-sizing:border-box;
  font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:1.4;max-width:960px;margin:0 auto;container-type:inline-size}
.rsim *{box-sizing:border-box}
.rsim .rs-title{font-size:17px;font-weight:700;margin:0 0 2px}
.rsim .rs-sub{font-size:12.5px;color:#79809A;margin:0 0 12px}
.rsim .rs-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px}
.rsim .rs-spacer{flex:1}
.rsim .rs-file{font:700 12px ${MONO};color:#556074;background:#EFF1F5;border:1px solid #C4CBD8;border-radius:8px;padding:3px 10px}
.rsim .rs-btn{border:1.5px solid #C4CBD8;background:#fff;color:#454C61;border-radius:18px;padding:5px 14px;cursor:pointer;
  font:600 13px Roboto,Arial,sans-serif}
.rsim .rs-btn:hover{box-shadow:0 0 0 3px #E3E7EF}
.rsim .rs-btn.rs-primary{background:#4453C9;border-color:#4453C9;color:#fff}
.rsim .rs-btn:disabled{opacity:.45;cursor:default;box-shadow:none}
.rsim .rs-check{display:flex;align-items:center;gap:6px;font-size:13px;color:#454C61;cursor:pointer;user-select:none}
.rsim .rs-tabs{display:flex;flex-wrap:wrap;gap:6px}
.rsim .rs-tab{border:1.5px solid #C4CBD8;background:#fff;color:#556074;border-radius:16px;padding:4px 12px;cursor:pointer;
  font:600 12.5px Roboto,Arial,sans-serif}
.rsim .rs-tab.rs-mono{font-family:${MONO};font-size:12px}
.rsim .rs-tab.rs-sel{background:#4453C9;border-color:#4453C9;color:#fff}
.rsim .rs-code{display:block;width:100%;background:#1F2430;color:#E6EAF2;border:0;border-radius:10px;padding:12px 14px;margin:0;
  font:12.5px/1.55 ${MONO};resize:vertical;tab-size:2;white-space:pre;overflow:auto;outline:none;caret-color:#F0C572}
.rsim .rs-code:focus{box-shadow:0 0 0 3px #A9B4F2}
.rsim .rs-panel{background:#fff;border:1.5px solid #D9DEE8;border-radius:10px;overflow:hidden;min-width:0}
.rsim .rs-head{font-size:11px;font-weight:700;letter-spacing:.08em;color:#556074;padding:6px 12px;background:#EFF1F5;
  border-bottom:1px solid #D9DEE8;display:flex;align-items:center;gap:8px}
.rsim .rs-console{margin-top:8px}
.rsim .rs-line{font:12.5px/1.5 ${MONO};padding:4px 12px;border-bottom:1px solid #F0F2F6;white-space:pre-wrap;overflow-wrap:anywhere}
.rsim .rs-line:last-child{border-bottom:0}
.rsim .rs-line.rs-error{background:#FFEBEF;color:#C2354F}
.rsim .rs-line.rs-warn{background:#FFF3DC;color:#A96C05}
.rsim .rs-empty{padding:8px 12px;font-size:12.5px;color:#9AA1B2}
.rsim .rs-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
.rsim .rs-stack{display:flex;flex-direction:column;gap:12px;min-width:0}
.rsim .rs-browser{border:1.5px solid #C4CBD8;border-radius:10px;overflow:hidden;background:#fff;display:flex;flex-direction:column}
.rsim .rs-browser-bar{display:flex;align-items:center;gap:6px;background:#EFF1F5;padding:6px 8px;border-bottom:1px solid #D9DEE8}
.rsim .rs-dot{width:9px;height:9px;border-radius:50%;background:#C4CBD8;flex:none}
.rsim .rs-url{flex:1;min-width:0;background:#fff;border-radius:12px;padding:2px 10px;font:11.5px ${MONO};color:#556074;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rsim iframe{border:0;width:100%;height:250px;background:#fff;display:block}
.rsim .rs-explain{background:#fff;border:1.5px solid #D9DEE8;border-radius:12px;padding:10px 14px;margin-bottom:12px;
  font-size:13.5px;line-height:1.5;min-height:44px}
.rsim .rs-explain b{color:#4453C9}
.rsim .rs-explain code,.rsim .rs-note code{font:12.5px ${MONO};background:#EEF1FF;border-radius:4px;padding:0 4px}
.rsim .rs-count{font:700 11px Roboto,Arial,sans-serif;color:#fff;background:#4453C9;border-radius:10px;padding:1px 8px;margin-right:6px}
.rsim .rs-note{font-size:12.5px;color:#556074;margin-top:8px}
.rsim .rs-pre{margin:0;padding:10px 12px;font:12px/1.55 ${MONO};white-space:pre;overflow:auto;color:#161A26;background:#fff}
.rsim .rs-error-box{margin:0;padding:10px 12px;font:12.5px/1.5 ${MONO};color:#C2354F;background:#FFEBEF;white-space:pre-wrap}
.rsim .rs-tree{padding:8px 10px;display:flex;flex-direction:column;gap:3px;overflow:auto}
.rsim .rs-node{display:flex;flex-wrap:wrap;align-items:center;gap:4px;font:12.5px ${MONO};border-left:2px solid #E3E7EE;
  padding:2px 0 2px 8px;transition:background .3s,box-shadow .3s}
.rsim .rs-tag{border-radius:6px;padding:1px 7px;font-weight:700}
.rsim .rs-comp .rs-tag{background:#F4EBFF;color:#7439B8;border:1px solid #C9A6EE}
.rsim .rs-elem .rs-tag{background:#EEF1FF;color:#4453C9;border:1px solid #A9B4F2}
.rsim .rs-txt{color:#454C61;background:#EFF1F5;border-radius:6px;padding:1px 7px;font-family:Roboto,Arial,sans-serif;font-size:12.5px}
.rsim .rs-prop{background:#FFF3DC;color:#A96C05;border:1px solid #F0C572;border-radius:10px;padding:0 7px;font-size:11.5px}
.rsim .rs-props-arrow{color:#A96C05;font:700 11px Roboto,Arial,sans-serif}
.rsim .rs-preview{padding:12px 14px;min-height:80px;color:#161A26;font-family:Roboto,Arial,sans-serif;overflow:auto}
.rsim .rs-preview h1{font-size:22px;margin:4px 0}
.rsim .rs-preview h2{font-size:18px;margin:4px 0}
.rsim .rs-preview p{margin:4px 0}
.rsim .rs-preview header{border-bottom:2px solid #A9B4F2;padding:4px 0 6px;margin-bottom:8px}
.rsim .rs-preview .tarjeta,.rsim .rs-preview .caja{border:1.5px solid #A9B4F2;border-radius:12px;padding:8px 14px;background:#EEF1FF}
.rsim .rs-preview input{font:inherit;padding:4px 8px;border:1px solid #C4CBD8;border-radius:6px;margin-left:6px}
.rsim .rs-warnings{display:flex;flex-direction:column}
@container (max-width:640px){
  .rsim .rs-split{grid-template-columns:minmax(0,1fr)}
}

.rsim .rs-bundle{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr) minmax(0,1fr);gap:12px;align-items:stretch}
.rsim .rs-col{background:#fff;border:1.5px solid var(--b,#D9DEE8);border-radius:12px;padding:10px;display:flex;flex-direction:column;
  gap:6px;min-width:0}
.rsim .rs-col-head{font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--ink,#556074)}
.rsim .rs-col-sub{font-size:11.5px;color:#79809A;margin-top:-4px}
.rsim .rs-dev{--b:#A9B4F2;--ink:#4453C9}
.rsim .rs-vite{--b:#C9A6EE;--ink:#7439B8}
.rsim .rs-dist{--b:#9FD68D;--ink:#3A8235}
.rsim .rs-fileitem{display:flex;align-items:center;gap:6px;font:12px ${MONO};border:1.5px solid #E3E7EE;border-radius:8px;padding:4px 8px;
  padding-left:calc(8px + var(--d,0) * 12px);background:#fff;transition:box-shadow .3s,background .3s,opacity .3s;overflow-wrap:anywhere}
.rsim .rs-fileitem i{width:10px;height:10px;border-radius:3px;background:var(--c);flex:none}
.rsim .rs-fileitem.rs-folder{border-style:dashed;color:#79809A}
.rsim .rs-fileitem.rs-seen{background:var(--s)}
.rsim .rs-fileitem.rs-hot{box-shadow:0 0 0 3px #F8DFA8}
.rsim .rs-fileitem.rs-ghost{opacity:.35}
.rsim .rs-imports{font:11px ${MONO};color:#79809A;padding-left:calc(26px + var(--d,0) * 12px);margin-top:-4px}
.rsim .rs-log{background:#1F2430;color:#E6EAF2;border-radius:8px;padding:8px 10px;font:11.5px/1.55 ${MONO};min-height:150px;
  white-space:pre-wrap;overflow-wrap:anywhere}
.rsim .rs-log .rs-ok{color:#9FD68D}
.rsim .rs-log .rs-dim{color:#8C95AA}
.rsim .rs-xform{display:grid;grid-template-columns:minmax(0,1fr);gap:4px}
.rsim .rs-xform pre{margin:0;border-radius:8px;padding:6px 8px;font:11px/1.5 ${MONO};white-space:pre-wrap;overflow-wrap:anywhere}
.rsim .rs-xform .rs-before{background:#EEF1FF;color:#4453C9}
.rsim .rs-xform .rs-after{background:#E8F6E3;color:#3A8235}
.rsim .rs-xform .rs-down{text-align:center;color:#7439B8;font-weight:700;font-size:12px}
.rsim .rs-stripes{display:flex;height:12px;border-radius:4px;overflow:hidden;margin-top:4px}
.rsim .rs-stripes i{flex:1;background:var(--c)}
@container (max-width:700px){
  .rsim .rs-bundle{grid-template-columns:minmax(0,1fr)}
}

.rsim .rs-codepane{background:#1F2430;border-radius:10px;padding:8px 0;font:12px/1.45 ${MONO};color:#E6EAF2;overflow:auto;margin-bottom:12px}
.rsim .rs-codepane div{padding:0 12px;white-space:pre;border-left:3px solid transparent;transition:background .3s}
.rsim .rs-codepane div.rs-hl{background:rgba(240,197,114,.22);border-left-color:#F0C572}
.rsim .rs-layers{display:grid;grid-template-columns:minmax(0,1fr) 80px minmax(0,1fr) 80px minmax(0,1fr) 80px minmax(0,1fr);
  align-items:stretch}
.rsim .rs-layer{background:#fff;border:1.5px solid var(--b);border-radius:12px;padding:10px;display:flex;flex-direction:column;
  gap:6px;min-width:0;transition:box-shadow .3s}
.rsim .rs-layer.rs-active{box-shadow:0 0 0 4px #F8DFA8}
.rsim .rs-l-comp{--b:#C9A6EE;--ink:#7439B8;--s:#F4EBFF}
.rsim .rs-l-vdom{--b:#A9B4F2;--ink:#4453C9;--s:#EEF1FF}
.rsim .rs-l-dom{--b:#86D3CA;--ink:#0F8478;--s:#E3F6F3}
.rsim .rs-l-screen{--b:#C4CBD8;--ink:#556074;--s:#EFF1F5}
.rsim .rs-layer .rs-col-head{color:var(--ink)}
.rsim .rs-statebox{border:1.5px solid var(--b);background:var(--s);border-radius:10px;padding:8px;display:flex;flex-direction:column;gap:6px}
.rsim .rs-statebox.rs-plain{--b:#C4CBD8;--s:#EFF1F5}
.rsim .rs-statelabel{font-size:10.5px;font-weight:700;letter-spacing:.06em;color:var(--ink)}
.rsim .rs-var{display:flex;align-items:center;justify-content:space-between;gap:6px;font:12.5px ${MONO}}
.rsim .rs-val{min-width:30px;text-align:center;border-radius:8px;padding:2px 8px;background:#7439B8;color:#fff;font-weight:700;
  transition:transform .3s}
.rsim .rs-plain .rs-val{background:#556074}
.rsim .rs-flash{animation:rsflash .7s ease-out}
@keyframes rsflash{0%{transform:scale(1.35);box-shadow:0 0 0 6px #F8DFA8}100%{transform:scale(1);box-shadow:0 0 0 0 transparent}}
.rsim .rs-vnode{font:12px ${MONO};border:1.5px solid #E3E7EE;border-radius:8px;padding:3px 7px;margin-left:calc(var(--d,0) * 12px);
  background:#fff;display:flex;flex-wrap:wrap;gap:4px;align-items:center;transition:box-shadow .3s,background .3s}
.rsim .rs-vnode.rs-focus{box-shadow:0 0 0 3px #F8DFA8}
.rsim .rs-vnode.rs-changed{background:#FFF3DC;border-color:#F0C572}
.rsim .rs-vnode.rs-same{opacity:.6}
.rsim .rs-vnode s{color:#C2354F;font-size:11px}
.rsim .rs-badge{font:700 10px Roboto,Arial,sans-serif;border-radius:8px;padding:0 6px;background:#3A8235;color:#fff}
.rsim .rs-badge.rs-amber{background:#A96C05}
.rsim .rs-badge.rs-violet{background:#7439B8}
.rsim .rs-emptyl{font-size:12px;color:#9AA1B2;font-style:italic}
.rsim .rs-gap{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:0 2px;min-width:0}
.rsim .rs-gap .rs-arrow{font-size:22px;color:#C4CBD8;line-height:1;transition:color .3s}
.rsim .rs-gap .rs-msg{white-space:nowrap;font:700 10px ${MONO};color:#fff;background:#4453C9;border-radius:8px;padding:2px 6px;text-align:center;
  overflow-wrap:anywhere;max-width:100%}
.rsim .rs-gap.rs-live .rs-arrow{color:#4453C9}
.rsim .rs-mini{border:1.5px solid #C4CBD8;border-radius:10px;overflow:hidden;background:#fff}
.rsim .rs-mini-body{padding:10px;text-align:center;font-family:Roboto,Arial,sans-serif;min-height:120px}
.rsim .rs-mini-body h1{font-size:17px;margin:0 0 4px}
.rsim .rs-mini-body p{margin:0 0 8px;font-size:14px;transition:background .3s;border-radius:6px}
.rsim .rs-mini-body p.rs-focus{background:#FFF3DC}
.rsim .rs-plus{width:40px;height:40px;border-radius:12px;border:0;background:#4453C9;color:#fff;font-size:22px;cursor:pointer}
.rsim .rs-plus:disabled{opacity:.45;cursor:default}
@container (max-width:760px){
  .rsim .rs-layers{grid-template-columns:minmax(0,1fr)}
  .rsim .rs-gap{flex-direction:row;padding:4px 0}
  .rsim .rs-gap .rs-arrow{transform:rotate(90deg)}
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

// `code` spans are written with backticks in the step texts.
const rich = (text) => {
  const out = [];
  String(text).split(/(`[^`]+`|\*\*[^*]+\*\*)/).forEach((part) => {
    if (!part) return;
    if (part.startsWith('`')) out.push(el('code', { text: part.slice(1, -1) }));
    else if (part.startsWith('**')) out.push(el('b', { text: part.slice(2, -2) }));
    else out.push(part);
  });
  return out;
};

const flash = (node) => {
  if (!node) return;
  node.classList.remove('rs-flash');
  node.offsetWidth;
  node.classList.add('rs-flash');
};

// A textarea that behaves like a small code editor: Tab indents, Ctrl/Cmd+Enter runs.
const codeEditor = (code, { onRun, onInput, label } = {}) => {
  const area = el('textarea', {
    class: 'rs-code',
    spellcheck: 'false',
    autocapitalize: 'off',
    autocomplete: 'off',
    'aria-label': label || 'Código editable',
  });
  const fit = () => { area.rows = Math.min(Math.max(area.value.split('\n').length + 1, 4), 26); };
  area.value = code;
  fit();
  area.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const { selectionStart: start, selectionEnd: end, value } = area;
      area.value = `${value.slice(0, start)}  ${value.slice(end)}`;
      area.selectionStart = area.selectionEnd = start + 2;
      fit();
      if (onInput) onInput(area.value);
    } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && onRun) {
      event.preventDefault();
      onRun();
    }
  });
  area.addEventListener('input', () => { fit(); if (onInput) onInput(area.value); });
  area.setValue = (value) => { area.value = value; fit(); };
  return area;
};

/* ------------------------------------------------------------------ */
/* js-run: an editable snippet with a simulated console                */
/* ------------------------------------------------------------------ */

export const JS_SNIPPETS = Object.freeze({
  variables: `let edad = 20;
edad = 21;
console.log(edad);

const nombre = "Ana";
console.log(nombre);

// Quita las dos barras de la siguiente línea y vuelve a ejecutar:
// nombre = "Luis";`,
  var: `if (true) {
  var a = "soy var";
  let b = "soy let";
}

console.log(a);
console.log(b);`,
  types: `const texto = "Hola";
const edad = 25;
const activo = true;
const vacio = null;
let indefinido;

console.log(typeof texto, typeof edad, typeof activo);
console.log(typeof vacio, typeof indefinido);
console.log(\`\${texto}, tengo \${edad} años\`);`,
  objects: `const persona = { nombre: "Carlos", edad: 30 };

console.log(persona.nombre);
console.log(persona["edad"]);

persona.edad = 31;
persona.ciudad = "Cali";
console.log(persona);`,
  arrays: `const frutas = ["manzana", "pera", "uva"];
console.log(frutas[0], frutas.length);

frutas.push("banano");
frutas[1] = "kiwi";
console.log(frutas);`,
  destructuring: `const usuario = { nombre: "Lucía", correo: "lucia@icesi.edu.co" };
const { nombre, correo } = usuario;
console.log(nombre, correo);

const colores = ["rojo", "verde", "azul"];
const [primero, segundo] = colores;
console.log(primero, segundo);`,
  functions: `function saludar(nombre) {
  return "Hola, " + nombre;
}

const despedir = (nombre) => \`Chao, \${nombre}\`;
const doble = (n) => n * 2;

console.log(saludar("Ana"));
console.log(despedir("Luis"));
console.log(doble(21));`,
  callbacks: `const ejecutar = (accion) => {
  console.log("Antes");
  accion();
  console.log("Después");
};

ejecutar(() => console.log("¡Me llamaron!"));`,
  params: `const mostrar = ({ nombre, correo }) => {
  console.log("Nombre:", nombre);
  console.log("Correo:", correo);
};

mostrar({ nombre: "María", correo: "maria@icesi.edu.co", rol: "admin" });`,
  'map-filter': `const notas = [3.2, 4.5, 2.8, 5];

const dobles = notas.map((n) => n * 2);
const aprobadas = notas.filter((n) => n >= 3);

console.log(dobles);
console.log(aprobadas);
console.log(notas);`,
  spread: `const a = [1, 2];
const b = [...a, 3];
console.log(a, b);

const ana = { nombre: "Ana", edad: 20 };
const anaMayor = { ...ana, edad: 21 };
console.log(ana);
console.log(anaMayor);`,
  conditionals: `const edad = 17;
const mensaje = edad >= 18 ? "Puede votar" : "Aún no";
console.log(mensaje);

const logueado = true;
console.log(logueado && "Bienvenido");
console.log(false && "Esto no se ve");`,
  async: `const esperar = (ms) => new Promise((listo) => setTimeout(listo, ms));

const cargar = async () => {
  console.log("Cargando…");
  await esperar(1000);
  console.log("Listo");
};

cargar();
console.log("Esto sale antes de Listo");`,
});

const formatInner = (value, depth, seen) => {
  if (typeof value === 'string') return depth === 0 ? value : JSON.stringify(value);
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
  if (typeof value === 'symbol') return value.toString();
  if (typeof value === 'function') return `ƒ ${value.name || 'anonymous'}()`;
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (value instanceof Promise) return 'Promise {<pending>}';
  if (seen.has(value)) return '[Circular]';
  if (depth > 3) return Array.isArray(value) ? '[…]' : '{…}';
  seen.add(value);
  let out;
  if (Array.isArray(value)) {
    out = `[${value.map((item) => formatInner(item, depth + 1, seen)).join(', ')}]`;
  } else {
    const entries = Object.entries(value).map(([key, item]) => {
      const name = /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
      return `${name}: ${formatInner(item, depth + 1, seen)}`;
    });
    const ctor = value.constructor && value.constructor.name;
    const prefix = ctor && ctor !== 'Object' ? `${ctor} ` : '';
    out = `${prefix}{${entries.join(', ')}}`;
  }
  seen.delete(value);
  return out;
};

export const formatValue = (value) => formatInner(value, 0, new Set());

// Runs a snippet with a fake console. `onLine` also receives lines printed later
// (timers, promises). Returns the lines printed synchronously.
export const runSnippet = (code, onLine = () => {}) => {
  const lines = [];
  const push = (kind, args) => {
    const line = { kind, text: args.map(formatValue).join(' ') };
    lines.push(line);
    onLine(line);
  };
  const fakeConsole = {
    log: (...args) => push('log', args),
    info: (...args) => push('log', args),
    warn: (...args) => push('warn', args),
    error: (...args) => push('error', args),
  };
  try {
    const result = new Function('console', `"use strict";\n${code}`)(fakeConsole);
    if (result instanceof Promise) result.catch((error) => push('error', [error]));
  } catch (error) {
    const line = { kind: 'error', text: `Uncaught ${error.name}: ${error.message}` };
    lines.push(line);
    onLine(line);
  }
  return lines;
};

const mountJsRun = (root, args = []) => {
  ensureStyle();
  const key = JS_SNIPPETS[args[0]] !== undefined ? args[0] : 'variables';
  const original = JS_SNIPPETS[key];
  let runId = 0;
  const output = el('div', { 'data-testid': 'js-run-output' });
  const empty = () => output.replaceChildren(el('div', {
    class: 'rs-empty',
    text: '¿Qué crees que va a imprimir? Pulsa Ejecutar (o Ctrl + Enter) y compruébalo.',
  }));
  const run = () => {
    runId += 1;
    const mine = runId;
    output.replaceChildren();
    const add = (line) => {
      if (mine !== runId) return;
      output.appendChild(el('div', { class: `rs-line${line.kind === 'log' ? '' : ` rs-${line.kind}`}`, text: line.text }));
    };
    runSnippet(editor.value, add);
    if (!output.childNodes.length) {
      output.appendChild(el('div', { class: 'rs-empty', text: 'El código corrió, pero no imprimió nada.' }));
    }
  };
  const editor = codeEditor(original, { onRun: run, label: 'Código JavaScript editable' });
  const container = el('div', { class: 'rsim', 'data-testid': 'js-run' },
    el('div', { class: 'rs-bar' },
      el('span', { class: 'rs-file', text: 'repaso.js' }),
      el('span', { class: 'rs-note', style: 'margin:0', text: 'Puedes editarlo' }),
      el('span', { class: 'rs-spacer' }),
      el('button', { class: 'rs-btn', type: 'button', onclick: () => { editor.setValue(original); empty(); } }, '↺ Restaurar'),
      el('button', { class: 'rs-btn rs-primary', type: 'button', onclick: run }, '▶ Ejecutar')),
    editor,
    el('div', { class: 'rs-panel rs-console' }, el('div', { class: 'rs-head', text: 'CONSOLA' }), output));
  empty();
  root.replaceChildren(container);
  return () => { runId += 1; root.replaceChildren(); };
};

/* ------------------------------------------------------------------ */
/* vanilla-dom: index.html + app.js running in a sandboxed iframe      */
/* ------------------------------------------------------------------ */

export const VANILLA_EXAMPLES = Object.freeze({
  greet: {
    url: 'saludador/index.html',
    html: `<!DOCTYPE html>
<html>
  <body>
    <h1>Saludador</h1>
    <input id="nombre" placeholder="Tu nombre">
    <button id="saludar">Saludar</button>
    <p id="mensaje"></p>

    <script src="app.js"></script>
  </body>
</html>`,
    js: `const input = document.getElementById("nombre");
const boton = document.getElementById("saludar");
const mensaje = document.getElementById("mensaje");

boton.addEventListener("click", () => {
  console.log("Clic. El input dice:", input.value);
  mensaje.textContent = \`Hola, \${input.value}\`;
});`,
  },
  list: {
    url: 'tareas/index.html',
    html: `<!DOCTYPE html>
<html>
  <body>
    <h1>Mis tareas</h1>
    <input id="tarea" placeholder="Nueva tarea">
    <button id="agregar">Agregar</button>
    <ul id="lista"></ul>
    <p id="total"></p>

    <script src="app.js"></script>
  </body>
</html>`,
    js: `const tareas = ["Repasar JS", "Leer sobre React"];

const input = document.getElementById("tarea");
const boton = document.getElementById("agregar");
const lista = document.getElementById("lista");
const total = document.getElementById("total");

const pintar = () => {
  lista.innerHTML = "";
  tareas.forEach((tarea) => {
    const li = document.createElement("li");
    li.textContent = tarea;
    lista.appendChild(li);
  });
  total.textContent = \`Total: \${tareas.length}\`;
};

boton.addEventListener("click", () => {
  tareas.push(input.value);
  input.value = "";
  pintar();
});

pintar();`,
  },
});

const SCRIPT_TAG = /<script\s+src=["']\.?\/?app\.js["']\s*>\s*<\/script>/i;

// The iframe reports console.log and errors back with postMessage.
const iframePrelude = (channel) => `<style>body{font-family:system-ui,Arial,sans-serif;margin:14px;color:#161A26}
input,button{font:inherit;padding:4px 8px}h1{font-size:22px;margin:0 0 10px}</style>
<script>(function(){var ch=${JSON.stringify(channel)};
function f(v){if(typeof v==='string')return v;try{return JSON.stringify(v)}catch(e){return String(v)}}
function send(k,a){parent.postMessage({rsim:ch,kind:k,text:Array.prototype.map.call(a,f).join(' ')},'*')}
console.log=function(){send('log',arguments)};console.error=function(){send('error',arguments)};
window.addEventListener('error',function(e){send('error',['Uncaught '+e.message])});})();</script>`;

// Builds the srcdoc: the <script src="app.js"> tag is swapped for the code of app.js.
export const buildDocument = (html, js, channel = 'rsim') => {
  const loadsApp = SCRIPT_TAG.test(html);
  const inline = `<script>\n${String(js).replace(/<\/script/gi, '<\\/script')}\n</script>`;
  const body = loadsApp ? html.replace(SCRIPT_TAG, () => inline) : html;
  const prelude = iframePrelude(channel);
  const doc = /<body[^>]*>/i.test(body) ? body.replace(/<body[^>]*>/i, (tag) => `${tag}\n${prelude}`) : prelude + body;
  return { doc, loadsApp };
};

let channelSeq = 0;

const mountVanillaDom = (root, args = []) => {
  ensureStyle();
  const key = VANILLA_EXAMPLES[args[0]] ? args[0] : 'greet';
  const example = VANILLA_EXAMPLES[key];
  channelSeq += 1;
  const channel = `rsim-${channelSeq}`;
  const files = { 'index.html': example.html, 'app.js': example.js };
  let current = 'app.js';

  const output = el('div', {});
  const frame = el('iframe', { sandbox: 'allow-scripts', title: 'Vista previa del navegador' });
  const tabs = el('div', { class: 'rs-tabs' });
  const editor = codeEditor(files[current], {
    label: 'Archivo editable',
    onInput: (value) => { files[current] = value; },
    onRun: () => reload(),
  });

  const log = (kind, text) => {
    const emptyNode = output.querySelector('.rs-empty');
    if (emptyNode) emptyNode.remove();
    output.appendChild(el('div', { class: `rs-line${kind === 'log' ? '' : ` rs-${kind}`}`, text }));
  };
  const onMessage = (event) => {
    if (!event.data || event.data.rsim !== channel || event.source !== frame.contentWindow) return;
    log(event.data.kind === 'error' ? 'error' : 'log', event.data.text);
  };
  window.addEventListener('message', onMessage);

  function reload() {
    const { doc, loadsApp } = buildDocument(files['index.html'], files['app.js'], channel);
    output.replaceChildren(el('div', { class: 'rs-empty', text: 'Aquí aparece lo que imprima console.log.' }));
    if (!loadsApp) log('warn', 'index.html no tiene <script src="app.js"></script>: app.js nunca se carga.');
    frame.srcdoc = doc;
  }

  const renderTabs = () => {
    tabs.replaceChildren(...Object.keys(files).map((name) => el('button', {
      class: `rs-tab rs-mono${name === current ? ' rs-sel' : ''}`,
      type: 'button',
      'data-file': name,
      onclick: () => { current = name; editor.setValue(files[name]); renderTabs(); },
    }, name)));
  };

  const container = el('div', { class: 'rsim', 'data-testid': 'vanilla-dom' },
    el('div', { class: 'rs-split' },
      el('div', { class: 'rs-stack' },
        el('div', { class: 'rs-bar', style: 'margin:0' }, tabs, el('span', { class: 'rs-spacer' }),
          el('button', {
            class: 'rs-btn',
            type: 'button',
            onclick: () => {
              files['index.html'] = example.html;
              files['app.js'] = example.js;
              editor.setValue(files[current]);
              reload();
            },
          }, '↺ Restaurar')),
        editor),
      el('div', { class: 'rs-stack' },
        el('div', { class: 'rs-browser' },
          el('div', { class: 'rs-browser-bar' },
            el('span', { class: 'rs-dot' }), el('span', { class: 'rs-dot' }), el('span', { class: 'rs-dot' }),
            el('span', { class: 'rs-url', text: `localhost/${example.url}` }),
            el('button', { class: 'rs-btn rs-primary', type: 'button', onclick: reload, title: 'Recargar' }, '↻ Recargar')),
          frame),
        el('div', { class: 'rs-panel' }, el('div', { class: 'rs-head', text: 'CONSOLA' }), output))),
    el('div', {
      class: 'rs-note',
      text: 'Edita index.html o app.js y pulsa Recargar: el navegador vuelve a leer el HTML, y el HTML vuelve a cargar el JS.',
    }));
  renderTabs();
  root.replaceChildren(container);
  reload();
  return () => {
    window.removeEventListener('message', onMessage);
    root.replaceChildren();
  };
};

/* ------------------------------------------------------------------ */
/* bundler: what `npm run build` does with the project                 */
/* ------------------------------------------------------------------ */

const KIND = {
  html: { c: '#556074', s: '#EFF1F5' },
  jsx: { c: '#4453C9', s: '#EEF1FF' },
  css: { c: '#C2354F', s: '#FFEBEF' },
  lib: { c: '#A96C05', s: '#FFF3DC' },
  out: { c: '#3A8235', s: '#E8F6E3' },
};

export const BUNDLE_FILES = Object.freeze([
  { key: 'index', name: 'index.html', depth: 0, kind: 'html', imports: ['src/main.jsx'] },
  { key: 'src', name: 'src/', depth: 0, folder: true },
  { key: 'main', name: 'main.jsx', depth: 1, kind: 'jsx', imports: ['react-dom/client', './App.jsx'] },
  { key: 'app', name: 'App.jsx', depth: 1, kind: 'jsx', imports: ['react', './Header.jsx', './App.css'] },
  { key: 'appcss', name: 'App.css', depth: 1, kind: 'css', imports: [] },
  { key: 'header', name: 'Header.jsx', depth: 1, kind: 'jsx', imports: [] },
  { key: 'nm', name: 'node_modules/', depth: 0, folder: true },
  { key: 'react', name: 'react', depth: 1, kind: 'lib', imports: [] },
  { key: 'reactdom', name: 'react-dom', depth: 1, kind: 'lib', imports: [] },
  { key: 'others', name: '… 30 paquetes más', depth: 1, kind: 'lib', ghost: true },
]);

export const BUNDLE_OUTPUT = Object.freeze([
  { key: 'outhtml', name: 'index.html', depth: 0 },
  { key: 'assets', name: 'assets/', depth: 0, folder: true },
  { key: 'outjs', name: 'index-B7xQ2k.js', depth: 1, mix: ['main', 'app', 'header', 'react', 'reactdom'] },
  { key: 'outcss', name: 'index-D4e5F6.css', depth: 1, mix: ['appcss'] },
]);

export const BUNDLE_STEPS = Object.freeze([
  {
    hot: ['index'],
    seen: ['index'],
    log: ['vite v7.2.2 building for production…'],
    text: 'Vite empieza por `index.html` y encuentra `<script type="module" src="/src/main.jsx">`: ese es el punto de entrada.',
  },
  {
    hot: ['main', 'reactdom'],
    seen: ['main', 'reactdom'],
    text: '`main.jsx` importa `react-dom/client` (de **node_modules**) y `./App.jsx`. Vite sigue cada `import`.',
  },
  {
    hot: ['app', 'react', 'header', 'appcss'],
    seen: ['app', 'react', 'header', 'appcss'],
    text: '`App.jsx` importa `react`, `./Header.jsx` y `./App.css`. Lo que nadie importa no entra al paquete.',
  },
  {
    hot: ['main', 'app', 'header'],
    log: ['transforming (6) src/App.jsx', '✓ 6 modules transformed.'],
    xform: true,
    text: 'Transforma: ningún navegador entiende JSX, así que Vite lo convierte en llamadas a funciones de JavaScript.',
  },
  {
    hot: ['outjs'],
    out: ['assets', 'outjs'],
    log: ['dist/assets/index-B7xQ2k.js   143.9 kB'],
    text: 'Junta **todo** el JavaScript (tu código y el de node_modules) en un solo archivo, minificado.',
  },
  {
    hot: ['outcss'],
    out: ['outcss'],
    log: ['dist/assets/index-D4e5F6.css    1.2 kB'],
    text: 'Junta los `.css` en un solo archivo.',
  },
  {
    hot: ['outhtml'],
    out: ['outhtml'],
    log: ['dist/index.html                 0.5 kB', '✓ built in 812ms'],
    text: 'Escribe `dist/index.html`, que ahora carga esos dos archivos. El nombre lleva un hash para que el navegador no use una versión vieja.',
  },
  {
    hot: ['outhtml', 'outjs', 'outcss'],
    done: true,
    text: '`dist/` es la **app empaquetada**: HTML, JS y CSS que cualquier navegador ejecuta tal cual. Ahí ya no hay JSX, ni `node_modules`, ni carpetas: es lo que se despliega.',
  },
]);

const mountBundler = (root) => {
  ensureStyle();
  let step = -1;
  const explain = el('div', { class: 'rs-explain', 'data-testid': 'bundler-explain' });
  const dev = el('div', { class: 'rs-col rs-dev' });
  const vite = el('div', { class: 'rs-col rs-vite' });
  const dist = el('div', { class: 'rs-col rs-dist' });
  const next = el('button', { class: 'rs-btn rs-primary', type: 'button', 'data-testid': 'bundler-next' });
  const reset = el('button', { class: 'rs-btn', type: 'button', onclick: () => { step = -1; render(); } }, '↺ Reiniciar');
  next.addEventListener('click', () => { if (step < BUNDLE_STEPS.length - 1) { step += 1; render(); } });

  const upTo = (field) => BUNDLE_STEPS.slice(0, step + 1).flatMap((s) => s[field] || []);

  const fileItem = (file, { seen, hot, color }) => el('div', {
    class: `rs-fileitem${file.folder ? ' rs-folder' : ''}${seen ? ' rs-seen' : ''}${hot ? ' rs-hot' : ''}${file.ghost ? ' rs-ghost' : ''}`,
    style: `--d:${file.depth};--c:${color.c};--s:${color.s}`,
    'data-file': file.key,
  }, file.folder ? null : el('i'), file.name);

  function render() {
    const current = BUNDLE_STEPS[step] || {};
    const hot = current.hot || [];
    const seen = upTo('seen');
    const out = upTo('out');

    dev.replaceChildren(
      el('div', { class: 'rs-col-head', text: 'PROYECTO · DESARROLLO' }),
      el('div', { class: 'rs-col-sub', text: 'lo que escribes tú' }),
      ...BUNDLE_FILES.flatMap((file) => {
        const color = KIND[file.kind] || KIND.html;
        const nodes = [fileItem(file, { seen: seen.includes(file.key), hot: hot.includes(file.key), color })];
        if (file.imports && file.imports.length && seen.includes(file.key)) {
          nodes.push(el('div', { class: 'rs-imports', style: `--d:${file.depth}`, text: `import ${file.imports.join(', ')}` }));
        }
        return nodes;
      }));

    const logLines = upTo('log');
    const xform = BUNDLE_STEPS.slice(0, step + 1).some((s) => s.xform) && !current.done && !out.includes('outhtml');
    vite.replaceChildren(...[
      el('div', { class: 'rs-col-head', text: 'VITE · BUNDLER' }),
      el('div', { class: 'rs-col-sub', text: '$ npm run build' }),
      el('div', { class: 'rs-log' }, ...(logLines.length ? logLines : ['(esperando)']).map((line) => el('div', {
        class: line.startsWith('✓') ? 'rs-ok' : (line === '(esperando)' ? 'rs-dim' : ''),
        text: line,
      }))),
      xform ? el('div', { class: 'rs-xform', 'data-testid': 'bundler-xform' },
        el('pre', { class: 'rs-before', text: '<h1>{title}</h1>' }),
        el('div', { class: 'rs-down', text: '↓ JSX a JavaScript' }),
        el('pre', { class: 'rs-after', text: 'jsx("h1", { children: title })' })) : null,
    ].filter(Boolean));

    dist.replaceChildren(
      el('div', { class: 'rs-col-head', text: 'DIST/ · PRODUCCIÓN' }),
      el('div', { class: 'rs-col-sub', text: 'lo que recibe el navegador' }),
      ...(out.length ? BUNDLE_OUTPUT.filter((file) => out.includes(file.key)).map((file) => {
        const item = fileItem(file, { seen: true, hot: hot.includes(file.key), color: file.key === 'outcss' ? KIND.css : KIND.out });
        if (file.mix) {
          return el('div', {}, item, el('div', { class: 'rs-stripes', title: 'Módulos que quedaron dentro' },
            ...file.mix.map((k) => el('i', { style: `--c:${KIND[BUNDLE_FILES.find((f) => f.key === k).kind].c}` }))));
        }
        return item;
      }) : [el('div', { class: 'rs-emptyl', text: '(vacía)' })]));

    explain.replaceChildren(...(step < 0
      ? ['Pulsa ', el('b', { text: 'npm run build' }), ' y avanza paso a paso.']
      : [el('span', { class: 'rs-count', text: `${step + 1}/${BUNDLE_STEPS.length}` }), ...rich(current.text)]));
    next.textContent = step < 0 ? '▶ npm run build' : 'Siguiente ›';
    next.disabled = step >= BUNDLE_STEPS.length - 1;
  }

  const container = el('div', { class: 'rsim', 'data-testid': 'bundler' },
    el('div', { class: 'rs-title', text: 'Qué hace el bundler con tu proyecto' }),
    el('div', { class: 'rs-sub', text: 'De muchos archivos y librerías a tres archivos que el navegador entiende.' }),
    el('div', { class: 'rs-bar' }, next, reset),
    explain,
    el('div', { class: 'rs-bundle' }, dev, vite, dist));
  render();
  root.replaceChildren(container);
  return () => root.replaceChildren();
};

/* ------------------------------------------------------------------ */
/* JSX: a tiny JSX → React.createElement transform + evaluator         */
/* ------------------------------------------------------------------ */

const isIdStart = (ch) => /[A-Za-z_$]/.test(ch || '');

// Skips a string, template or comment starting at i; returns the index after it, or -1.
const skipNonCode = (src, i) => {
  const ch = src[i];
  if (ch === '"' || ch === "'" || ch === '`') {
    let j = i + 1;
    while (j < src.length && src[j] !== ch) j += src[j] === '\\' ? 2 : 1;
    return j + 1;
  }
  if (ch === '/' && src[i + 1] === '/') {
    const end = src.indexOf('\n', i);
    return end < 0 ? src.length : end;
  }
  if (ch === '/' && src[i + 1] === '*') {
    const end = src.indexOf('*/', i + 2);
    return end < 0 ? src.length : end + 2;
  }
  return -1;
};

const jsxError = (message) => {
  const error = new SyntaxError(message);
  error.jsx = true;
  return error;
};

// Index of the `}` closing the `{` at i (JSX inside is fine: its braces are balanced).
const matchBrace = (src, i) => {
  let depth = 0;
  let j = i;
  while (j < src.length) {
    const skip = src[j] === '{' || src[j] === '}' ? -1 : skipNonCode(src, j);
    if (skip > 0) { j = skip; continue; }
    if (src[j] === '{') depth += 1;
    if (src[j] === '}') {
      depth -= 1;
      if (depth === 0) return j;
    }
    j += 1;
  }
  throw jsxError('Falta cerrar una llave } en el JSX.');
};

const cleanText = (raw) => {
  const lines = raw.split(/\r\n|\n|\r/);
  if (lines.length === 1) return raw;
  return lines
    .map((line, i) => {
      let out = line.replace(/\t/g, ' ');
      if (i > 0) out = out.replace(/^\s+/, '');
      if (i < lines.length - 1) out = out.replace(/\s+$/, '');
      return out;
    })
    .filter((line) => line)
    .join(' ');
};

// Parses one JSX element starting at src[i] === '<'. Returns { node, end }.
const parseElement = (src, i) => {
  let j = i + 1;
  const ws = () => { while (/\s/.test(src[j] || '')) j += 1; };
  ws();
  let tag = '';
  if (src[j] !== '>') {
    const m = /^[A-Za-z][\w.:-]*/.exec(src.slice(j));
    if (!m) throw jsxError('Etiqueta JSX inválida.');
    tag = m[0];
    j += tag.length;
  }
  const attrs = [];
  for (;;) {
    ws();
    if (j >= src.length) throw jsxError(`La etiqueta <${tag}> no se cerró.`);
    if (src.startsWith('/>', j)) {
      return { node: { tag, attrs, children: [] }, end: j + 2 };
    }
    if (src[j] === '>') { j += 1; break; }
    if (src[j] === '{') {
      const close = matchBrace(src, j);
      const inner = src.slice(j + 1, close).trim();
      if (!inner.startsWith('...')) throw jsxError('Atributo inválido entre llaves.');
      attrs.push({ spread: transformJsx(inner.slice(3)) });
      j = close + 1;
      continue;
    }
    const m = /^[A-Za-z_][\w:-]*/.exec(src.slice(j));
    if (!m) throw jsxError(`Atributo inválido en <${tag}>.`);
    const name = m[0];
    j += name.length;
    ws();
    if (src[j] !== '=') { attrs.push({ name, value: 'true' }); continue; }
    j += 1;
    ws();
    if (src[j] === '"' || src[j] === "'") {
      const end = src.indexOf(src[j], j + 1);
      attrs.push({ name, value: JSON.stringify(src.slice(j + 1, end)) });
      j = end + 1;
    } else if (src[j] === '{') {
      const close = matchBrace(src, j);
      attrs.push({ name, value: transformJsx(src.slice(j + 1, close).trim()) });
      j = close + 1;
    } else {
      throw jsxError(`El valor de ${name} va entre comillas o entre llaves.`);
    }
  }
  const children = [];
  for (;;) {
    if (j >= src.length) throw jsxError(tag ? `Falta la etiqueta de cierre </${tag}>.` : 'Falta cerrar el fragmento con </>.');
    if (src.startsWith('</', j)) {
      const end = src.indexOf('>', j);
      const closing = src.slice(j + 2, end).trim();
      if (closing !== tag) {
        throw jsxError(tag
          ? `Se esperaba </${tag}> y llegó </${closing}>. Cada etiqueta que abres se cierra.`
          : `Un fragmento <> se cierra con </>, no con </${closing}>.`);
      }
      return { node: { tag, attrs, children }, end: end + 1 };
    }
    if (src[j] === '<') {
      const { node, end } = parseElement(src, j);
      children.push({ el: node });
      j = end;
    } else if (src[j] === '{') {
      const close = matchBrace(src, j);
      const inner = src.slice(j + 1, close).trim();
      if (inner && !/^\/\*[\s\S]*\*\/$/.test(inner)) children.push({ expr: transformJsx(inner) });
      j = close + 1;
    } else {
      let k = j;
      while (k < src.length && src[k] !== '<' && src[k] !== '{') k += 1;
      const text = cleanText(src.slice(j, k));
      if (text.trim() || (text && !/\n/.test(src.slice(j, k)))) children.push({ text });
      j = k;
    }
  }
};

const attrKey = (name) => (/^[A-Za-z_$][\w$]*$/.test(name) ? name : JSON.stringify(name));

const printElement = (node, indent) => {
  const type = !node.tag ? 'React.Fragment' : (/^[A-Z]/.test(node.tag) || node.tag.includes('.') ? node.tag : JSON.stringify(node.tag));
  let props = 'null';
  if (node.attrs.length) {
    props = `{ ${node.attrs.map((a) => (a.spread ? `...${a.spread}` : `${attrKey(a.name)}: ${a.value}`)).join(', ')} }`;
  }
  const kids = node.children.map((child) => {
    if (child.text !== undefined) return JSON.stringify(child.text);
    if (child.expr !== undefined) return child.expr;
    return printElement(child.el, `${indent}  `);
  });
  const args = [type, props, ...kids];
  const flat = `React.createElement(${args.join(', ')})`;
  if (flat.length + indent.length <= 72 && !flat.includes('\n')) return flat;
  return `React.createElement(\n${args.map((a) => `${indent}  ${a}`).join(',\n')}\n${indent})`;
};

// Transforms every JSX expression in `src` into React.createElement calls.
export function transformJsx(src) {
  let out = '';
  let i = 0;
  const canStartJsx = () => {
    const before = out.replace(/\s+$/, '');
    if (!before) return true;
    if (/(^|[^\w$])return$/.test(before)) return true;
    if (before.endsWith('=>')) return true;
    return /[(,=:?[{!&|;]$/.test(before);
  };
  while (i < src.length) {
    const skip = skipNonCode(src, i);
    if (skip > 0) { out += src.slice(i, skip); i = skip; continue; }
    if (src[i] === '<' && (isIdStart(src[i + 1]) || src[i + 1] === '>') && canStartJsx()) {
      const { node, end } = parseElement(src, i);
      const lineStart = out.lastIndexOf('\n') + 1;
      const indent = /^\s*/.exec(out.slice(lineStart))[0];
      out += printElement(node, indent);
      i = end;
      let k = i;
      while (/\s/.test(src[k] || '')) k += 1;
      if (src[k] === '<' && (isIdStart(src[k + 1]) || src[k + 1] === '>')) {
        throw jsxError('Adjacent JSX elements must be wrapped in an enclosing tag. ¿Querías un fragmento <>...</>?');
      }
      continue;
    }
    out += src[i];
    i += 1;
  }
  return out;
}

const FRAGMENT = 'React.Fragment';

const fakeReact = {
  Fragment: FRAGMENT,
  createElement: (type, props, ...children) => ({ $el: true, type, props: props || {}, children }),
};

const componentNames = (src) => {
  const names = [];
  const re = /(?:function\s+([A-Z][\w$]*)|(?:const|let)\s+([A-Z][\w$]*)\s*=)/g;
  let m = re.exec(src);
  while (m) { names.push(m[1] || m[2]); m = re.exec(src); }
  return names;
};

// Resolves function components into a tree of { kind, name, props, children }.
const resolve = (node, depth = 0) => {
  if (depth > 40) throw new Error('Demasiada anidación: ¿un componente se usa a sí mismo?');
  if (node === null || node === undefined || node === false || node === true) return [];
  if (Array.isArray(node)) return node.flatMap((child) => resolve(child, depth));
  if (!node || !node.$el) return [{ kind: 'text', text: String(node) }];
  const kids = node.children.flat(Infinity);
  if (node.type === FRAGMENT) return kids.flatMap((child) => resolve(child, depth + 1));
  if (typeof node.type === 'function') {
    const props = { ...node.props };
    if (kids.length) props.children = kids.length === 1 ? kids[0] : kids;
    return [{
      kind: 'comp',
      name: node.type.name || 'Componente',
      props: node.props,
      children: resolve(node.type(props), depth + 1),
    }];
  }
  if (typeof node.type !== 'string') throw new Error(`No sé dibujar el tipo ${String(node.type)}.`);
  return [{ kind: 'elem', name: node.type, props: node.props, children: kids.flatMap((child) => resolve(child, depth + 1)) }];
};

// Compiles and runs JSX source; renders App (or the last component defined).
export const evaluateJsx = (src) => {
  const compiled = transformJsx(src);
  const names = componentNames(src);
  if (!names.length) throw new Error('Define al menos un componente: una función con nombre en mayúscula.');
  const entry = names.includes('App') ? 'App' : names[names.length - 1];
  const Entry = new Function('React', `"use strict";\n${compiled}\nreturn ${entry};`)(fakeReact);
  const tree = resolve(fakeReact.createElement(Entry, null));
  const warnings = [];
  const walk = (node) => {
    if (node.kind === 'elem' && node.props && Object.prototype.hasOwnProperty.call(node.props, 'class')) {
      warnings.push(`<${node.name} class="…">: en JSX se escribe className, porque class es palabra reservada de JavaScript.`);
    }
    (node.children || []).forEach(walk);
  };
  tree.forEach(walk);
  return { compiled, tree, entry, warnings };
};

const UNITLESS = /^(opacity|zIndex|fontWeight|lineHeight|flex|flexGrow|flexShrink|order|zoom)$/;

const renderDom = (nodes, parent) => {
  nodes.forEach((node) => {
    if (node.kind === 'text') { parent.appendChild(document.createTextNode(node.text)); return; }
    if (node.kind === 'comp') { renderDom(node.children, parent); return; }
    let elem;
    try { elem = document.createElement(node.name); } catch { elem = document.createElement('span'); }
    Object.entries(node.props || {}).forEach(([key, value]) => {
      if (key === 'key' || key === 'children' || value === undefined || value === null || value === false) return;
      if (key === 'className' || key === 'class') elem.className = value;
      else if (key === 'htmlFor') elem.setAttribute('for', value);
      else if (key === 'style' && typeof value === 'object') {
        Object.entries(value).forEach(([prop, v]) => {
          elem.style[prop] = typeof v === 'number' && !UNITLESS.test(prop) ? `${v}px` : v;
        });
      } else if (/^on[A-Z]/.test(key) && typeof value === 'function') {
        elem.addEventListener(key.slice(2).toLowerCase(), (event) => { try { value(event); } catch { /* ignore */ } });
      } else if (typeof value !== 'object' && typeof value !== 'function') {
        try { elem.setAttribute(key, value === true ? '' : value); } catch { /* ignore */ }
      }
    });
    renderDom(node.children, elem);
    parent.appendChild(elem);
  });
};

const propChips = (props) => Object.entries(props || {})
  .filter(([key]) => key !== 'children')
  .map(([key, value]) => {
    let shown;
    if (typeof value === 'string') shown = `"${value}"`;
    else if (typeof value === 'function') shown = 'ƒ';
    else shown = formatValue(value);
    if (shown.length > 28) shown = `${shown.slice(0, 26)}…`;
    return el('span', { class: 'rs-prop', text: `${key}=${shown}` });
  });

const treeRows = (nodes, depth = 0) => nodes.flatMap((node) => {
  if (node.kind === 'text') {
    if (!node.text.trim()) return [];
    return [el('div', { class: 'rs-node', style: `margin-left:${depth * 14}px` }, el('span', { class: 'rs-txt', text: `"${node.text}"` }))];
  }
  const chips = propChips(node.props);
  const row = el('div', { class: `rs-node rs-${node.kind}`, style: `margin-left:${depth * 14}px`, 'data-node': node.name },
    el('span', { class: 'rs-tag', text: node.kind === 'comp' ? node.name : `<${node.name}>` }),
    node.kind === 'comp' && chips.length ? el('span', { class: 'rs-props-arrow', text: 'props ↓' }) : null,
    chips.filter((chip, i) => node.kind === 'comp' || i < 3));
  return [row, ...treeRows(node.children, depth + 1)];
});

export const JSX_PRESETS = Object.freeze({
  jsx: [
    {
      key: 'basic',
      label: 'Básico',
      code: `function App() {
  return (
    <div className="tarjeta">
      <h1>Hola, React</h1>
      <p>Esto es JSX</p>
    </div>
  );
}`,
    },
    {
      key: 'expr',
      label: 'Expresiones { }',
      code: `function App() {
  const nombre = "Ana";
  const mensajes = 3;

  return (
    <div>
      <h1>Hola, {nombre.toUpperCase()}</h1>
      <p>Tienes {mensajes * 2} mensajes</p>
      <p>{mensajes > 0 ? "Revisa tu bandeja" : "Todo al día"}</p>
    </div>
  );
}`,
    },
    {
      key: 'adjacent',
      label: 'Dos raíces',
      code: `function App() {
  return (
    <h1>Título</h1>
    <p>Párrafo</p>
  );
}`,
    },
    {
      key: 'fragment',
      label: 'Fragmento <>',
      code: `function App() {
  return (
    <>
      <h1>Título</h1>
      <p>Párrafo</p>
    </>
  );
}`,
    },
    {
      key: 'attrs',
      label: 'Atributos',
      code: `function App() {
  return (
    <div className="caja" style={{ color: "teal", fontSize: 18 }}>
      <label htmlFor="nombre">Nombre</label>
      <input id="nombre" placeholder="Tu nombre" />
    </div>
  );
}`,
    },
    {
      key: 'map',
      label: 'Lista con map',
      code: `function App() {
  const frutas = ["Mango", "Lulo", "Guayaba"];

  return (
    <ul>
      {frutas.map((f) => <li key={f}>{f}</li>)}
    </ul>
  );
}`,
    },
  ],
  header: [
    {
      key: 'hardcoded',
      label: '1 · Quemado',
      code: `function Header() {
  return (
    <header>
      <h1>Computación 2</h1>
      <p>Introducción a React</p>
    </header>
  );
}

function App() {
  return (
    <div>
      <Header />
      <Header />
    </div>
  );
}`,
    },
    {
      key: 'props',
      label: '2 · Con props',
      code: `function Header({ title, subtitle }) {
  return (
    <header>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}

function App() {
  return (
    <div>
      <Header
        title="Computación 2"
        subtitle="Introducción a React"
      />
      <Header
        title="Semana 14"
        subtitle="Componentes y props"
      />
    </div>
  );
}`,
    },
  ],
});

const mountJsxPlayground = (root, args, set) => {
  ensureStyle();
  const presets = JSX_PRESETS[set];
  let preset = presets.find((p) => p.key === args[0]) || presets[0];
  let timer = null;

  const tabs = el('div', { class: 'rs-tabs' });
  const preview = el('div', { class: 'rs-preview', 'data-testid': 'jsx-preview' });
  const tree = el('div', { class: 'rs-tree', 'data-testid': 'jsx-tree' });
  const compiled = el('pre', { class: 'rs-pre', 'data-testid': 'jsx-compiled' });
  const warnings = el('div', { class: 'rs-warnings' });

  const update = () => {
    warnings.replaceChildren();
    try {
      const result = evaluateJsx(editor.value);
      compiled.className = 'rs-pre';
      compiled.textContent = result.compiled.trim();
      tree.replaceChildren(...treeRows(result.tree));
      preview.replaceChildren();
      renderDom(result.tree, preview);
      result.warnings.forEach((text) => warnings.appendChild(el('div', { class: 'rs-line rs-warn', text })));
    } catch (error) {
      const message = `${error.jsx || error instanceof SyntaxError ? 'SyntaxError' : error.name}: ${error.message}`;
      compiled.className = 'rs-error-box';
      compiled.textContent = message;
      tree.replaceChildren(el('div', { class: 'rs-emptyl', text: 'Sin árbol: el código no compila.' }));
      preview.replaceChildren(el('div', { class: 'rs-emptyl', text: 'Nada que mostrar.' }));
    }
  };
  const schedule = () => { clearTimeout(timer); timer = setTimeout(update, 250); };
  const editor = codeEditor(preset.code, { onInput: schedule, onRun: update, label: 'Código JSX editable' });

  const renderTabs = () => {
    tabs.replaceChildren(...presets.map((p) => el('button', {
      class: `rs-tab${p.key === preset.key ? ' rs-sel' : ''}`,
      type: 'button',
      'data-preset': p.key,
      onclick: () => { preset = p; editor.setValue(p.code); renderTabs(); update(); },
    }, p.label)));
  };

  const header = set === 'header'
    ? [el('div', { class: 'rs-title', text: 'Un componente Header, primero quemado y luego con props' }),
      el('div', { class: 'rs-sub', text: 'Cambia de pestaña y edita los textos: el árbol muestra qué props recibe cada Header.' })]
    : [el('div', { class: 'rs-title', text: 'JSX en vivo' }),
      el('div', { class: 'rs-sub', text: 'Escribe JSX a la izquierda: a la derecha ves lo que se dibuja, el árbol y el JavaScript que llega al navegador.' })];

  const container = el('div', { class: 'rsim', 'data-testid': set === 'header' ? 'props-header' : 'jsx-live' },
    ...header,
    el('div', { class: 'rs-bar' }, tabs),
    el('div', { class: 'rs-split' },
      el('div', { class: 'rs-stack' }, el('span', { class: 'rs-file', style: 'align-self:flex-start', text: 'App.jsx' }), editor),
      el('div', { class: 'rs-stack' },
        el('div', { class: 'rs-panel' }, el('div', { class: 'rs-head', text: 'PANTALLA' }), preview, warnings),
        el('div', { class: 'rs-panel' }, el('div', { class: 'rs-head', text: 'ÁRBOL DE COMPONENTES' }), tree))),
    el('div', { class: 'rs-panel', style: 'margin-top:12px' },
      el('div', { class: 'rs-head', text: 'EL JAVASCRIPT QUE LLEGA AL NAVEGADOR (JSX TRANSFORMADO)' }), compiled));
  renderTabs();
  update();
  root.replaceChildren(container);
  return () => { clearTimeout(timer); root.replaceChildren(); };
};

/* ------------------------------------------------------------------ */
/* react-counter: state → component → Virtual DOM → DOM → screen       */
/* ------------------------------------------------------------------ */

export const LAYERS = Object.freeze(['comp', 'vdom', 'dom', 'screen']);

export const COUNTER_CODE = Object.freeze({
  state: `import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>Contador</h1>
      <p>Valor: {count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}`,
  forget: `function App() {
  let count = 0;

  const increment = () => {
    count = count + 1;
  };

  return (
    <div>
      <h1>Contador</h1>
      <p>Valor: {count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}`,
});

// Steps are pure data. `at` is the layer where the step happens; `msg` (optional) is the one
// message travelling from the previous layer to `at`; `sets` lists the layers that now show
// the new value. Texts use {a} (old value) and {b} (new value).
export const MOUNT_STEPS = Object.freeze({
  state: [
    { at: 'comp', sets: ['comp'], lines: [3], text: 'React llama a `App()` por primera vez. `useState(0)` crea el estado: `count` vale **0**.' },
    { at: 'vdom', msg: 'JSX', sets: ['vdom'], lines: [9, 10, 11, 12, 13, 14, 15], text: 'El `return` de App es JSX: produce el **Virtual DOM**, un árbol de objetos JavaScript en memoria.' },
    { at: 'dom', msg: 'crear', sets: ['dom'], text: 'React recorre ese árbol y crea los nodos del **DOM real** dentro de `<div id="root">`.' },
    { at: 'screen', msg: 'pintar', sets: ['screen'], text: 'El navegador pinta el DOM. Ahora pulsa **+** en la pantalla.' },
  ],
  forget: [
    { at: 'comp', sets: ['comp'], lines: [1], text: 'React llama a `App()`. `let count = 0` es una variable normal de la función.' },
    { at: 'vdom', msg: 'JSX', sets: ['vdom'], lines: [7, 8, 9, 10, 11, 12, 13], text: 'El `return` de App produce el **Virtual DOM** con `Valor: 0`.' },
    { at: 'dom', msg: 'crear', sets: ['dom'], text: 'React crea los nodos del **DOM real**.' },
    { at: 'screen', msg: 'pintar', sets: ['screen'], text: 'El navegador pinta. Ahora pulsa **+** en la pantalla.' },
  ],
});

export const CLICK_STEPS = Object.freeze({
  state: [
    { at: 'screen', focus: 'button', text: 'Pulsas **+** en la pantalla.' },
    { at: 'dom', msg: 'click', focus: 'button', text: 'El clic llega al `<button>` del **DOM real**. React tiene un escuchador puesto ahí.' },
    { at: 'vdom', msg: 'evento', focus: 'button', lines: [13], text: 'React busca ese botón en su **Virtual DOM** y encuentra su `onClick`: la función `increment`.' },
    { at: 'comp', msg: 'increment()', lines: [5, 6, 7], text: 'Corre `increment`, que llama a `setCount({b})`.' },
    { at: 'comp', sets: ['comp'], lines: [3], text: 'El estado `count` pasa de {a} a **{b}**. Como cambió con `setCount`, React agenda un nuevo render.' },
    { at: 'vdom', msg: 'App()', sets: ['vdom'], mark: 'new', lines: [9, 10, 11, 12, 13, 14, 15], text: 'React vuelve a llamar a `App()`. Su JSX produce un **Virtual DOM nuevo** con `Valor: {b}`.' },
    { at: 'vdom', mark: 'diff', focus: 'p', text: '**Diff**: React compara el árbol nuevo con el anterior. Solo cambió el texto del `<p>`.' },
    { at: 'dom', msg: '1 cambio', focus: 'p', text: 'React aplica al DOM real un único cambio: el texto del `<p>`.' },
    { at: 'dom', sets: ['dom'], focus: 'p', text: 'El `<p>` del DOM ahora dice `Valor: {b}`. El `<h1>` y el `<button>` ni se tocaron.' },
    { at: 'screen', msg: 'pintar', focus: 'p', text: 'El navegador vuelve a pintar lo que cambió.' },
    { at: 'screen', sets: ['screen'], focus: 'p', text: 'La pantalla muestra **{b}**. Pulsa + otra vez.' },
  ],
  forget: [
    { at: 'screen', focus: 'button', text: 'Pulsas **+** en la pantalla.' },
    { at: 'dom', msg: 'click', focus: 'button', text: 'El clic llega al `<button>` del **DOM real**.' },
    { at: 'vdom', msg: 'evento', focus: 'button', lines: [11], text: 'React encuentra el `onClick` del botón en su **Virtual DOM**: `increment`.' },
    { at: 'comp', msg: 'increment()', lines: [3, 4, 5], text: 'Corre `increment`: `count = count + 1`.' },
    { at: 'comp', sets: ['comp'], lines: [4], text: 'La variable `count` sí cambió: vale **{b}**. Pero es una variable normal: React no se entera.' },
    { at: 'comp', text: 'Nadie llamó a un `setCount`, así que **no hay nuevo render**: el Virtual DOM, el DOM y la pantalla siguen en 0. Pulsa + varias veces y compara.' },
  ],
});

const mountCounter = (root, args = []) => {
  ensureStyle();
  const variant = args.includes('forget') ? 'forget' : 'state';
  const code = COUNTER_CODE[variant];
  const vals = { comp: null, vdom: null, dom: null, screen: null };
  let prevVdom = null;
  let seq = null;
  let idx = -1;
  let timer = null;
  let stepMode = false;

  const codeLines = code.split('\n').map((line) => el('div', { text: line || ' ' }));
  const explain = el('div', { class: 'rs-explain', 'data-testid': 'counter-explain' });
  const layerNodes = {};
  const gaps = [];
  const nextBtn = el('button', { class: 'rs-btn rs-primary', type: 'button', 'data-testid': 'counter-next' }, 'Siguiente ›');
  const mountBtn = el('button', { class: 'rs-btn rs-primary', type: 'button', 'data-testid': 'counter-mount' }, '▶ Primer render');
  const resetBtn = el('button', { class: 'rs-btn', type: 'button' }, '↺ Reiniciar');
  const stepBox = el('input', { type: 'checkbox', 'data-testid': 'counter-stepmode' });
  const plus = el('button', { class: 'rs-plus', type: 'button', 'aria-label': 'Incrementar', 'data-testid': 'counter-plus' }, '+');

  const fill = (text) => text.replace(/\{a\}/g, String(seq ? seq.from : 0)).replace(/\{b\}/g, String(seq ? seq.to : 0));

  const vnode = (depth, tag, text, key, extra = []) => el('div', {
    class: 'rs-vnode', style: `--d:${depth}`, 'data-node': key,
  }, el('span', { class: 'rs-tag', style: 'padding:0;color:#4453C9', text: tag }), text ? el('span', { class: 'rs-txt', text }) : null, ...extra);

  const render = () => {
    const step = seq ? seq.steps[idx] : null;
    const active = step ? step.at : null;
    const focus = step ? step.focus : null;
    const shown = (layer) => vals[layer];

    // Component
    const isState = variant === 'state';
    const valNode = el('span', { class: 'rs-val', 'data-testid': 'counter-comp-value', text: shown('comp') === null ? '—' : String(shown('comp')) });
    layerNodes.comp.replaceChildren(...[
      el('div', { class: 'rs-col-head', text: 'COMPONENTE' }),
      el('div', { class: 'rs-vnode', style: 'border-color:#C9A6EE;background:#F4EBFF' },
        el('span', { class: 'rs-tag', style: 'padding:0;color:#7439B8', text: 'App()' }),
        shown('comp') === null ? el('span', { class: 'rs-emptyl', text: 'sin llamar' }) : null),
      el('div', { class: `rs-statebox${isState ? '' : ' rs-plain'}` },
        el('div', { class: 'rs-statelabel', text: isState ? 'ESTADO (lo guarda React)' : 'VARIABLE NORMAL' }),
        el('div', { class: 'rs-var' }, el('span', { text: 'count' }), valNode)),
      isState ? el('div', { class: 'rs-note', style: 'margin:0', text: 'setCount avisa a React que debe volver a dibujar.' })
        : el('div', { class: 'rs-note', style: 'margin:0', text: 'Cambiarla no avisa a nadie.' }),
    ]);
    if (step && step.sets && step.sets.includes('comp')) flash(valNode);

    // Virtual DOM
    const v = shown('vdom');
    if (v === null) {
      layerNodes.vdom.replaceChildren(el('div', { class: 'rs-col-head', text: 'VIRTUAL DOM' }), el('div', { class: 'rs-emptyl', text: '(vacío)' }));
    } else {
      const mark = step && step.at === 'vdom' ? step.mark : null;
      const changed = prevVdom !== null && prevVdom !== v && (mark === 'new' || mark === 'diff');
      const pExtra = [];
      if (changed) pExtra.push(el('s', { text: `Valor: ${prevVdom}` }));
      if (mark === 'diff') pExtra.push(el('span', { class: 'rs-badge rs-amber', text: 'cambió' }));
      const same = mark === 'diff' ? [el('span', { class: 'rs-badge', text: '=' })] : [];
      const nodes = [
        vnode(0, '<div>', null, 'div', [...same]),
        vnode(1, '<h1>', 'Contador', 'h1', [...(mark === 'diff' ? [el('span', { class: 'rs-badge', text: '=' })] : [])]),
        vnode(1, '<p>', `Valor: ${v}`, 'p', pExtra),
        vnode(1, '<button>', '+', 'button', [el('span', { class: 'rs-prop', text: 'onClick=ƒ' }),
          ...(mark === 'diff' ? [el('span', { class: 'rs-badge', text: '=' })] : [])]),
      ];
      nodes.forEach((node) => {
        const key = node.getAttribute('data-node');
        if (active === 'vdom' && focus === key) node.classList.add('rs-focus');
        if (mark === 'diff') node.classList.add(key === 'p' ? 'rs-changed' : 'rs-same');
        if (mark === 'new' && key === 'p' && changed) node.classList.add('rs-changed');
      });
      layerNodes.vdom.replaceChildren(...[
        el('div', { class: 'rs-col-head', text: 'VIRTUAL DOM' }),
        mark === 'new' ? el('span', { class: 'rs-badge rs-violet', style: 'align-self:flex-start', text: 'árbol nuevo' }) : null,
        el('div', { class: 'rs-vnode', style: 'border-color:#C9A6EE;background:#F4EBFF' },
          el('span', { class: 'rs-tag', style: 'padding:0;color:#7439B8', text: 'App' })),
        ...nodes.map((node) => { node.style.setProperty('--d', String(Number(node.style.getPropertyValue('--d')) + 1)); return node; }),
      ].filter(Boolean));
    }

    // DOM
    const d = shown('dom');
    const domNode = (depth, html, key) => {
      const node = el('div', { class: 'rs-vnode', style: `--d:${depth}`, 'data-node': key, text: html });
      if (active === 'dom' && focus === key) node.classList.add('rs-focus');
      if (step && step.at === 'dom' && step.sets && step.sets.includes('dom') && key === 'p' && seq && seq.kind === 'click') {
        node.classList.add('rs-changed');
      }
      return node;
    };
    layerNodes.dom.replaceChildren(
      el('div', { class: 'rs-col-head', text: 'DOM REAL' }),
      el('div', { class: 'rs-vnode', style: 'border-color:#86D3CA;background:#E3F6F3', text: '<div id="root">' }),
      ...(d === null ? [el('div', { class: 'rs-emptyl', text: '(vacío)' })] : [
        domNode(1, '<div>', 'div'),
        domNode(2, '<h1>Contador</h1>', 'h1'),
        domNode(2, `<p>Valor: ${d}</p>`, 'p'),
        domNode(2, '<button>+</button>', 'button'),
      ]));

    // Screen
    const s = shown('screen');
    const busy = Boolean(seq) && idx < seq.steps.length;
    plus.disabled = s === null || busy;
    const pNode = el('p', { 'data-testid': 'counter-screen-value', text: `Valor: ${s}` });
    if (active === 'screen' && focus === 'p') pNode.classList.add('rs-focus');
    layerNodes.screen.replaceChildren(
      el('div', { class: 'rs-col-head', text: 'PANTALLA' }),
      el('div', { class: 'rs-mini' },
        el('div', { class: 'rs-browser-bar' }, el('span', { class: 'rs-dot' }), el('span', { class: 'rs-url', text: 'localhost:5173' })),
        el('div', { class: 'rs-mini-body' }, ...(s === null ? [el('div', { class: 'rs-emptyl', text: '(en blanco)' })]
          : [el('h1', { text: 'Contador' }), pNode, plus]))));
    if (step && step.sets && step.sets.includes('screen')) flash(pNode);

    LAYERS.forEach((layer) => layerNodes[layer].classList.toggle('rs-active', layer === active));

    // Gaps: at most one message, between the previous layer and `at`.
    gaps.forEach((gap) => { gap.node.classList.remove('rs-live'); gap.msg.hidden = true; gap.arrow.textContent = '→'; });
    if (step && step.msg) {
      const prev = idx > 0 ? seq.steps[idx - 1].at : seq.start;
      const a = LAYERS.indexOf(prev);
      const b = LAYERS.indexOf(step.at);
      const gap = gaps[Math.min(a, b)];
      gap.node.classList.add('rs-live');
      gap.msg.hidden = false;
      gap.msg.textContent = fill(step.msg);
      gap.arrow.textContent = b > a ? '→' : '←';
    }

    codeLines.forEach((line, i) => line.classList.toggle('rs-hl', Boolean(step && step.lines && step.lines.includes(i))));

    if (!seq) {
      explain.replaceChildren(...(vals.screen === null
        ? ['La app todavía no existe en pantalla. Pulsa ', el('b', { text: '▶ Primer render' }), '.']
        : rich('Pulsa **+** en la pantalla.')));
    } else {
      explain.replaceChildren(el('span', { class: 'rs-count', text: `${idx + 1}/${seq.steps.length}` }), ...rich(fill(step.text)));
    }
    mountBtn.disabled = vals.screen !== null || Boolean(seq);
    nextBtn.hidden = !stepMode;
    nextBtn.disabled = !seq;
  };

  const finish = () => {
    if (seq && seq.kind === 'click' && variant === 'state') prevVdom = null;
    seq = null;
    idx = -1;
    render();
  };

  const advance = () => {
    clearTimeout(timer);
    if (!seq) return;
    if (idx >= seq.steps.length - 1) {
      // Keep the last text on screen; just unlock the controls.
      const lastText = fill(seq.steps[idx].text);
      seq = null;
      idx = -1;
      render();
      explain.replaceChildren(...rich(lastText));
      return;
    }
    idx += 1;
    const step = seq.steps[idx];
    (step.sets || []).forEach((layer) => {
      if (layer === 'vdom') prevVdom = vals.vdom;
      vals[layer] = seq.to;
    });
    render();
    if (!stepMode) timer = setTimeout(advance, 1500);
  };

  const start = (kind) => {
    if (seq) return;
    if (kind === 'mount') {
      seq = { kind, steps: MOUNT_STEPS[variant], from: 0, to: 0, start: 'comp' };
    } else {
      const from = vals.comp;
      seq = { kind, steps: CLICK_STEPS[variant], from, to: from + 1, start: 'screen' };
    }
    idx = -1;
    advance();
  };

  plus.addEventListener('click', () => start('click'));
  mountBtn.addEventListener('click', () => start('mount'));
  nextBtn.addEventListener('click', advance);
  stepBox.addEventListener('change', () => {
    stepMode = stepBox.checked;
    if (!stepMode && seq) advance();
    else { clearTimeout(timer); render(); }
  });
  resetBtn.addEventListener('click', () => {
    clearTimeout(timer);
    Object.keys(vals).forEach((key) => { vals[key] = null; });
    prevVdom = null;
    finish();
  });

  LAYERS.forEach((layer) => { layerNodes[layer] = el('div', { class: `rs-layer rs-l-${layer}`, 'data-layer': layer }); });
  for (let i = 0; i < LAYERS.length - 1; i += 1) {
    const msg = el('span', { class: 'rs-msg', hidden: true });
    const arrow = el('span', { class: 'rs-arrow', text: '→' });
    gaps.push({ node: el('div', { class: 'rs-gap', 'data-gap': String(i) }, msg, arrow), msg, arrow });
  }

  const container = el('div', { class: 'rsim', 'data-testid': 'react-counter' },
    el('div', { class: 'rs-title', text: variant === 'state' ? 'El contador: del estado a la pantalla' : 'El contador con una variable normal' }),
    el('div', { class: 'rs-sub', text: 'Componente → Virtual DOM → DOM real → pantalla. Cada paso es un solo salto.' }),
    el('div', { class: 'rs-bar' }, mountBtn,
      el('label', { class: 'rs-check' }, stepBox, 'Paso a paso'), nextBtn, el('span', { class: 'rs-spacer' }), resetBtn),
    explain,
    el('div', { class: 'rs-layers' },
      layerNodes.comp, gaps[0].node, layerNodes.vdom, gaps[1].node, layerNodes.dom, gaps[2].node, layerNodes.screen),
    el('div', { class: 'rs-codepane', style: 'margin:12px 0 0' }, ...codeLines));
  render();
  root.replaceChildren(container);
  return () => { clearTimeout(timer); root.replaceChildren(); };
};

export const SIMS = Object.freeze({
  'js-run': mountJsRun,
  'vanilla-dom': mountVanillaDom,
  bundler: mountBundler,
  'jsx-live': (root, args = []) => mountJsxPlayground(root, args, 'jsx'),
  'props-header': (root, args = []) => mountJsxPlayground(root, args, 'header'),
  'react-counter': mountCounter,
});
