// Interactive simulators for Spring Security (Computación en Internet II).
// Plain DOM, no React and no imports, same contract as the simulators of the other
// courses: every simulator is `mount(element, args) => destroy`.

const STYLE_ID = 'jsim-style';

const CSS = `
.jsim{--js-bg:#FBFBFD;--js-ink:#161A26;--js-muted:#556074;--js-line:#D9DEE8;--js-accent:#4453C9;
  --js-ok:#3A8235;--js-err:#C2354F;--js-hot:#F2C069;
  background:var(--js-bg);color:var(--js-ink);border:1px solid var(--js-line);border-radius:16px;padding:16px;
  font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:1.4;box-sizing:border-box;max-width:960px;
  margin:0 auto;display:flex;flex-direction:column;gap:0;container-type:inline-size}
.jsim *{box-sizing:border-box}
.jsim .js-title{font-size:17px;font-weight:700;margin:0 0 2px}
.jsim .js-sub{font-size:12.5px;color:#79809A;margin:0 0 12px}
.jsim .js-band{--b:#C4CBD8;--bg:#EFF1F5;--ink:#556074;border:1.5px solid var(--b);background:var(--bg);border-radius:12px;
  padding:8px 12px;transition:box-shadow .3s,opacity .3s;opacity:.78;min-width:0}
.jsim .js-band.js-on{opacity:1;box-shadow:0 0 0 3px var(--js-hot)}
.jsim .js-band.js-client{--b:#C9A6EE;--bg:#F4EBFF;--ink:#7439B8;opacity:1}
.jsim .js-band.js-chain{--b:#A9B4F2;--bg:#EEF1FF;--ink:#4453C9;flex:1 1 0}
.jsim .js-band.js-context{--b:#F0C572;--bg:#FFF8E6;--ink:#A96C05;flex:0 1 190px;align-self:center}
.jsim .js-ctrl{--b:#9FD68D;--bg:#E8F6E3;--ink:#3A8235}
.jsim .js-svc{--b:#86D3CA;--bg:#E3F6F3;--ink:#0F8478}
.jsim .js-repo{--b:#9DB8F2;--bg:#E8EFFE;--ink:#2F5BC4}
.jsim .js-db{--b:#C4CBD8;--bg:#EFF1F5;--ink:#556074}
.jsim .js-gridwrap{overflow-x:auto;padding:3px}
.jsim .js-grid,.jsim .js-strip{--cols:minmax(0,1fr) 22px minmax(0,1.3fr) 22px minmax(0,1fr) 22px minmax(0,1fr);
  display:grid;grid-template-columns:var(--cols)}
.jsim .js-grid{min-width:540px;align-items:stretch}
.jsim .js-strip{grid-column:1 / -1;min-height:30px;align-items:center;padding:3px 0}
.jsim .js-strip > div{display:flex;justify-content:center;min-width:0}
.jsim .js-ghead{font-size:11px;font-weight:700;letter-spacing:.06em;color:var(--ink);padding:0 4px 4px;overflow-wrap:anywhere}
.jsim .js-cell{border:1.5px solid var(--b);background:var(--bg);border-radius:12px;padding:6px;display:flex;flex-direction:column;
  gap:6px;justify-content:center;min-width:0;opacity:.78;transition:box-shadow .3s,opacity .3s}
.jsim .js-cell.js-on{opacity:1;box-shadow:0 0 0 3px var(--js-hot)}
.jsim .js-cell .js-node{padding:4px 8px}
.jsim .js-cell .js-node b{font-size:11.5px}
.jsim .js-conn{display:flex;align-items:center;justify-content:center;color:#C4CBD8;font-size:15px;font-weight:700}
.jsim .js-conn.js-act{text-shadow:0 0 6px var(--js-hot)}
.jsim .js-conn.js-down{color:#4453C9}
.jsim .js-conn.js-back{color:#1F9D68}
.jsim .js-conn.js-bad{color:#D64545}
.jsim .js-head{display:flex;justify-content:space-between;align-items:baseline;gap:4px 10px;flex-wrap:wrap;margin-bottom:6px}
.jsim .js-name{font-size:11.5px;font-weight:700;letter-spacing:.08em;color:var(--ink)}
.jsim .js-role{font-size:11.5px;color:var(--js-muted)}
.jsim .js-mono{font-family:'JetBrains Mono',Menlo,Consolas,monospace}
.jsim .js-req{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.jsim .js-call{display:inline-flex;align-items:center;gap:8px;border:1.5px solid #C9A6EE;background:#fff;color:var(--js-ink);
  border-radius:10px;padding:6px 12px;cursor:pointer;font:600 13px 'JetBrains Mono',Menlo,Consolas,monospace}
.jsim .js-call:hover:not(:disabled){box-shadow:0 0 0 3px #E6D5FA}
.jsim .js-call:disabled{opacity:.5;cursor:default}
.jsim .js-verb{font-size:11px;font-weight:700;border-radius:6px;padding:1px 6px;color:#fff;background:#A96C05}
.jsim .js-verb.js-get{background:#0F8478}
.jsim .js-creds{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center;margin-top:8px;font-size:12px;color:var(--js-muted)}
.jsim .js-creds input{border:1px solid #DDE1E8;border-radius:8px;padding:4px 8px;width:150px;max-width:100%;
  font:12px 'JetBrains Mono',Menlo,Consolas,monospace;color:var(--js-ink);background:#fff}
.jsim .js-row{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;margin-top:8px;font-size:12px;color:var(--js-muted)}
.jsim .js-token{font:11.5px 'JetBrains Mono',Menlo,Consolas,monospace;padding:2px 8px;border-radius:8px;background:#fff;
  border:1px dashed #C4CBD8;color:#9AA1B2;overflow-wrap:anywhere}
.jsim .js-token.js-has{border-style:solid;border-color:#9FD68D;color:#245C21;background:#F1FAEE}
.jsim .js-token.js-bad{border-color:#F3A3B2;color:var(--js-err);background:#FFF5F7}
.jsim .js-mini{border:1px solid #C4CBD8;background:#fff;color:var(--js-muted);border-radius:14px;padding:2px 10px;
  font:500 12px Roboto,Arial,sans-serif;cursor:pointer}
.jsim .js-mini:disabled{opacity:.45;cursor:default}
.jsim .js-resp{font:12px 'JetBrains Mono',Menlo,Consolas,monospace;padding:3px 10px;border-radius:8px;background:#fff;
  border:1px solid #C4CBD8;color:#9AA1B2;overflow-wrap:anywhere}
.jsim .js-resp.js-ok{border-color:#9FD68D;color:#245C21;background:#F1FAEE;font-weight:700}
.jsim .js-resp.js-fail{border-color:#F3A3B2;color:var(--js-err);background:#FFF5F7;font-weight:700}
.jsim .js-gap{display:flex;gap:10px;padding:0 12px}
.jsim .js-slot{flex:1 1 0;min-width:0;min-height:34px;display:flex;align-items:center;justify-content:center;padding:4px 0;position:relative}
.jsim .js-slot::before{content:'';position:absolute;top:0;bottom:0;left:50%;border-left:1.5px dashed #C4CBD8}
.jsim .js-midrow{display:flex;flex-wrap:nowrap;align-items:stretch;gap:0}
.jsim .js-hgap{flex:0 0 140px;display:flex;align-items:center;justify-content:center;position:relative;min-height:34px;padding:0 4px}
.jsim .js-hgap::before{content:'';position:absolute;left:0;right:0;top:50%;border-top:1.5px dashed #C4CBD8}
.jsim .js-msg{position:relative;z-index:1;font:11.5px 'JetBrains Mono',Menlo,Consolas,monospace;background:#fff;
  border:1.5px solid #556074;color:var(--js-ink);border-radius:12px;padding:2px 10px;max-width:96%;text-align:center;
  overflow-wrap:anywhere;animation:jsIn .45s ease-out}
.jsim .js-msg.js-up{border-color:#1F9D68;color:#14724B;--from:8px}
.jsim .js-msg.js-fail{border-color:#D64545;color:#B23434;--from:8px}
.jsim .js-msg.js-side{border-color:#A96C05;color:#8A5A04;--from:0}
.jsim .js-hgap .js-msg{white-space:nowrap;font-size:10.5px;padding:2px 7px}
.jsim .js-strip .js-msg{font-size:11px}
@keyframes jsIn{0%{opacity:0;transform:translateY(var(--from,-8px))}100%{opacity:1;transform:none}}
.jsim .js-stack{display:flex;flex-direction:column}
.jsim .js-link{height:14px;margin-left:22px;border-left:1.5px solid #A9B4F2;position:relative}
.jsim .js-link.js-down{border-left:2.5px solid #4453C9}
.jsim .js-link.js-down::after{content:'';position:absolute;left:-6.25px;bottom:-1px;border-left:5px solid transparent;
  border-right:5px solid transparent;border-top:7px solid #4453C9}
.jsim .js-slot.js-down::before{border-left:2.5px solid #4453C9}
.jsim .js-slot.js-back::before{border-left:2.5px solid #1F9D68}
.jsim .js-slot.js-bad::before{border-left:2.5px solid #D64545}
.jsim .js-slot.js-down::after,.jsim .js-slot.js-back::after,.jsim .js-slot.js-bad::after{content:'';position:absolute;
  left:calc(50% - 4px);border-left:5px solid transparent;border-right:5px solid transparent}
.jsim .js-slot.js-down::after{bottom:0;border-top:7px solid #4453C9}
.jsim .js-slot.js-back::after{top:0;border-bottom:7px solid #1F9D68}
.jsim .js-slot.js-bad::after{top:0;border-bottom:7px solid #D64545}
.jsim .js-varrow{grid-column:1;min-height:20px;padding:0}
.jsim .js-hgap.js-side::before{border-top:2.5px solid #A96C05}
.jsim .js-hgap.js-side::after{content:'';position:absolute;right:0;top:calc(50% - 4px);border-top:5px solid transparent;
  border-bottom:5px solid transparent;border-left:7px solid #A96C05}
.jsim .js-rules{flex-basis:100%;display:flex;flex-direction:column;gap:3px;margin-top:2px}
.jsim .js-rule{font:10.5px 'JetBrains Mono',Menlo,Consolas,monospace;padding:2px 6px;border-radius:6px;background:#F4F6F9;
  color:#79809A;border:1px solid #E3E7EE;overflow-wrap:anywhere;transition:background .3s,color .3s}
.jsim .js-rule.js-pass{background:#D9F2D0;color:#245C21;border-color:#7CC56A;font-weight:700}
.jsim .js-rule.js-stop{background:#FFEBEF;color:var(--js-err);border-color:#F3A3B2;font-weight:700}
.jsim .js-node{display:flex;align-items:center;justify-content:space-between;gap:4px 10px;flex-wrap:wrap;background:#fff;
  border:1.5px solid var(--b,#A9B4F2);border-radius:10px;padding:5px 10px;transition:box-shadow .3s,opacity .3s;min-width:0}
.jsim .js-node b{font:700 12.5px 'JetBrains Mono',Menlo,Consolas,monospace;color:var(--ink,#4453C9);overflow-wrap:anywhere}
.jsim .js-node small{font-size:11.5px;color:var(--js-muted)}
.jsim .js-node.js-dim b{font-weight:500;color:#79809A}
.jsim .js-node.js-jwt{--b:#F0C572;background:#FFFBF1;border-width:2.5px}
.jsim .js-node.js-jwt b{color:#A96C05}
.jsim .js-node.js-hot{box-shadow:0 0 0 3px var(--js-hot)}
.jsim .js-st{font-size:11.5px;font-weight:700;border-radius:10px;padding:1px 8px}
.jsim .js-st:empty{display:none}
.jsim .js-st.js-pass{background:#E8F6E3;color:var(--js-ok)}
.jsim .js-st.js-stop{background:#FFEBEF;color:var(--js-err)}
.jsim .js-st.js-info{background:#EFF1F5;color:var(--js-muted)}
.jsim .js-ctx{background:#fff;border:1.5px dashed #F0C572;border-radius:10px;padding:8px 10px;transition:box-shadow .3s}
.jsim .js-ctx.js-hot{box-shadow:0 0 0 3px var(--js-hot)}
.jsim .js-ctx b{display:block;font:700 12px 'JetBrains Mono',Menlo,Consolas,monospace;color:#A96C05;margin-bottom:4px}
.jsim .js-ctx div{font:11.5px 'JetBrains Mono',Menlo,Consolas,monospace;color:var(--js-muted);overflow-wrap:anywhere}
.jsim .js-ctx .js-who{color:#245C21;font-weight:700}
.jsim .js-ctx-note{font-size:11px;color:#79809A;margin-top:6px}
.jsim .js-idle{opacity:.45}
.jsim .js-table{background:#fff;border:1px solid #C4CBD8;border-radius:8px;padding:6px 8px;transition:box-shadow .3s}
.jsim .js-table.js-hot{box-shadow:0 0 0 3px var(--js-hot)}
.jsim .js-table > b{display:block;font:700 11.5px 'JetBrains Mono',Menlo,Consolas,monospace;color:#556074;margin-bottom:4px}
.jsim .js-rowdb{font:11px 'JetBrains Mono',Menlo,Consolas,monospace;padding:4px 8px;border-radius:6px;overflow-wrap:anywhere;
  color:#454C61;background:#F4F6F9;border:1px solid #E3E7EE;margin-top:4px}
.jsim .js-rowdb.js-read{color:#245C21;background:#D9F2D0;border-color:#7CC56A;font-weight:600}
.jsim .js-foot{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;justify-content:space-between;margin-top:12px}
.jsim .js-note{flex:1 1 320px;font-size:13.5px;color:var(--js-ink);min-height:40px;background:#fff;border:1px solid var(--js-line);
  border-radius:10px;padding:8px 12px}
.jsim .js-note.js-warn{color:var(--js-err)}
.jsim .js-note small{display:block;font-size:11px;color:#79809A;margin-bottom:2px}
.jsim .js-ctrls{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.jsim .js-switch{display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;user-select:none}
.jsim .js-switch input{accent-color:var(--js-accent);width:16px;height:16px}
.jsim .js-btn{border:1px solid var(--js-accent);background:var(--js-accent);color:#fff;border-radius:20px;padding:6px 14px;
  font:500 13px Roboto,Arial,sans-serif;cursor:pointer}
.jsim .js-flash{animation:jsFlash .9s ease-out}
@keyframes jsFlash{0%{transform:scale(.96);box-shadow:0 0 0 0 rgba(58,130,53,.5)}60%{transform:scale(1.03)}
  100%{transform:none;box-shadow:0 0 0 8px rgba(58,130,53,0)}}
@container (max-width:760px){.jsim .js-hgap{flex-basis:130px}.jsim .js-hgap .js-msg{font-size:10px;padding:2px 6px}
  .jsim .js-band.js-context{flex-basis:160px}.jsim .js-band.js-chain .js-node b{font-size:11.5px}}
@container (max-width:540px){.jsim .js-midrow{flex-wrap:wrap}.jsim .js-band.js-chain{flex:1 1 100%}.jsim .js-hgap{flex:1 1 100%}.jsim .js-hgap::before{left:50%;right:auto;top:0;bottom:0;border-top:0;
  border-left:1.5px dashed #C4CBD8}.jsim .js-band.js-context{flex:1 1 100%}}
@media (max-width:520px){.jsim{padding:12px}.jsim .js-node b{font-size:11px}.jsim .js-msg{font-size:10.5px}
  .jsim .js-call{font-size:12px;padding:5px 8px}.jsim .js-gap{gap:6px}.jsim .js-gap{padding:0 4px}}
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

const flash = (node) => {
  if (!node) return;
  node.classList.remove('js-flash');
  void node.offsetWidth;
  node.classList.add('js-flash');
};

const USER = { username: 'profesor@gmail.com', password: '123456', authority: 'ROLE_PROFESOR' };
const TOKEN = 'eyJhbGciOiJIUzM4NCJ9.eyJhdXRob3JpdGllcyI6…';
const TAMPERED = 'eyJhbGciOiJIUzM4NCJ9.eyJhdXRob3JpdGllcyI6…X';
const STEP_MS = 1500;

// Which band (row) each piece lives in, top to bottom. The tests use it too.
export const JWT_BANDS = {
  client: 0,
  others: 1, jwt: 1, upaf: 1, authz: 1, ctx: 1,
  auth: 2, posts: 2,
  manager: 3, jwtService: 3, userService: 3, postService: 3,
  userRepo: 4, postRepo: 4,
  db: 5,
};
export const JWT_GAPS = { g1: [0, 1], gx: [1, 1], g2: [1, 2], g3: [2, 3], g4: [3, 4], g5: [4, 5] };

// One message between two layers per step; what its arrival causes goes in the next step.
// A gap step is [gap, direction, text, side]: side 'l' is the login column, 'r' the posts one.
export const jwtSteps = ({ endpoint, token, password }) => {
  const login = endpoint === 'login';
  const steps = [];
  const add = (step) => steps.push(step);
  const request = login
    ? 'POST /api/v1/auth/login · { username, password }'
    : `GET /api/v1/posts · ${token ? `Authorization: Bearer ${token === 'bad' ? 'eyJ…X' : 'eyJ…'}` : 'sin Authorization'}`;

  add({
    hot: ['client'],
    gap: ['g1', 'down', request],
    caption: login
      ? 'El cliente envía sus credenciales al endpoint de login. Todavía no tiene token.'
      : token
        ? 'El cliente pide los posts y adjunta el token en el encabezado Authorization.'
        : 'El cliente pide los posts sin token: no ha iniciado sesión.',
  });
  if (login) {
    add({
      hot: ['others', 'jwt', 'upaf'],
      status: { others: ['pass', 'pasa'], jwt: ['info', 'sin token: sigue'], upaf: ['info', 'no actúa'] },
      caption: 'El login cruza los filtros sin que ninguno lo detenga: no trae token, así que JwtAuthFilter no tiene nada que validar. permitAll() no se salta estos filtros; la regla se revisa al final, en AuthorizationFilter.',
    });
  } else {
    add({
      hot: ['others'],
      status: { others: ['pass', 'pasa'] },
      caption: 'El request entra a la SecurityFilterChain. Los primeros filtros (CORS, logout…) no tienen nada que objetar.',
    });

    if (!token) {
      add({
        hot: ['jwt'],
        status: { jwt: ['info', 'sin token: sigue'] },
        caption: 'JwtAuthFilter no encuentra «Bearer …». No hay nada que validar: deja seguir el request sin autenticar.',
      });
    } else if (token === 'bad') {
      add({
        hot: ['jwt'],
        status: { jwt: ['stop', '✗ firma inválida'] },
        warn: true,
        caption: 'JwtAuthFilter recalcula la firma con el secreto y no coincide con la del token: alguien lo modificó.',
      });
      add({
        hot: ['jwt'],
        gap: ['g1', 'fail', '401 · { "message": "Token inválido" }'],
        warn: true,
        caption: 'El filtro responde 401 y no llama a filterChain.doFilter: el request se detiene aquí.',
      });
      add({
        hot: ['client'],
        response: ['fail', '401 Unauthorized · Token inválido'],
        warn: true,
        caption: 'El cliente recibe el 401. Ni los filtros siguientes ni ningún controller se ejecutaron.',
      });
      return steps;
    } else {
      add({
        hot: ['jwt'],
        status: { jwt: ['pass', '✓ token válido'] },
        caption: 'JwtAuthFilter verifica la firma con el secreto y revisa que no haya vencido. El token es auténtico.',
      });
      add({
        hot: ['jwt'],
        gap: ['gx', 'side', 'setAuthentication'],
        caption: 'Con los claims del token, el filtro guarda la autenticación en el SecurityContext. Sin consultar la base de datos.',
      });
      add({
        hot: ['ctx'],
        context: [USER.username, USER.authority],
        caption: 'El SecurityContext ahora dice quién hace este request y con qué authorities. Lo leen los filtros siguientes y el controller.',
      });
    }

    add({
      hot: ['upaf'],
      status: { upaf: ['info', 'sin formLogin: no actúa'] },
      caption: 'UsernamePasswordAuthenticationFilter procesa el login con formulario. La API no usa formLogin, así que no hace nada. JwtAuthFilter se registró antes que él con addFilterBefore.',
    });
  }

  if (!login && !token) {
    add({
      hot: ['authz', 'ctx'],
      status: { authz: ['stop', '✗ anónimo'] },
      rule: ['auth', 'stop'],
      warn: true,
      caption: 'AuthorizationFilter revisa sus reglas: /api/v1/posts cae en anyRequest().authenticated(). Consulta el SecurityContext y no hay nadie autenticado.',
    });
    add({
      hot: ['authz'],
      gap: ['g1', 'fail', '401 · { "error": "Unauthorized" }'],
      warn: true,
      caption: 'La cadena responde 401. El controller nunca se enteró de este request.',
    });
    add({
      hot: ['client'],
      response: ['fail', '401 Unauthorized'],
      warn: true,
      caption: 'Sin token no hay posts. Haga login primero y vuelva a pedirlos.',
    });
    return steps;
  }

  add({
    hot: login ? ['authz'] : ['authz', 'ctx'],
    status: { authz: ['pass', login ? '✓ permitAll' : '✓ autenticado'] },
    rule: [login ? 'permit' : 'auth', 'pass'],
    caption: login
      ? 'AuthorizationFilter revisa sus reglas: /api/v1/auth/login cae en permitAll(). Pasa sin que nadie esté autenticado; nadie tiene token antes del login.'
      : `AuthorizationFilter revisa sus reglas: /api/v1/posts cae en anyRequest().authenticated(). En el SecurityContext está ${USER.username}, así que pasa.`,
  });

  if (!login) {
    add({ hot: ['authz'], gap: ['g2', 'down', 'getPosts()', 'r'], caption: 'El request por fin llega al controller.' });
    add({
      hot: ['posts'],
      gap: ['g3', 'down', 'findAll()', 'r'],
      caption: 'PostController atiende la solicitud como cualquier endpoint y le pide los posts al servicio. El controller no sabe nada de tokens.',
    });
    add({ hot: ['postService'], gap: ['g4', 'down', 'findAll()', 'r'], caption: 'PostService le pide los posts al repositorio.' });
    add({ hot: ['postRepo'], gap: ['g5', 'down', 'SELECT * FROM posts', 'r'], caption: 'PostRepository consulta la base de datos.' });
    add({ hot: ['db'], read: 'posts', caption: 'La base de datos encuentra las filas de la tabla posts.' });
    add({ hot: ['db'], gap: ['g5', 'up', '2 filas', 'r'], caption: 'Las filas suben al repositorio.' });
    add({ hot: ['postRepo'], gap: ['g4', 'up', 'List<Post>', 'r'], caption: 'El repositorio las convierte en entidades Post.' });
    add({ hot: ['postService'], gap: ['g3', 'up', 'List<PostDTO>', 'r'], caption: 'El servicio entrega DTOs al controller.' });
    add({ hot: ['posts'], gap: ['g2', 'up', '200 OK · [ {…}, {…} ]', 'r'], caption: 'El controller responde. La respuesta sube de vuelta por la cadena.' });
    add({ hot: ['authz'], gap: ['g1', 'up', '200 OK · [ {…}, {…} ]'], caption: 'Sale de la SecurityFilterChain hacia el cliente.' });
    add({
      hot: ['client'],
      response: ['ok', '200 OK · 2 posts'],
      caption: 'El cliente recibe los posts. El servidor no guardó ninguna sesión: el próximo request tendrá que traer el token otra vez.',
    });
    return steps;
  }

  const good = password === USER.password;
  add({ hot: ['authz'], gap: ['g2', 'down', 'login(request)', 'l'], caption: 'El request llega a RestAuthController.' });
  add({
    hot: ['auth'],
    gap: ['g3', 'down', 'authenticate(email, password)', 'l'],
    caption: 'El controller le pide al AuthenticationManager que valide las credenciales.',
  });
  add({
    hot: ['manager', 'userService'],
    status: { manager: ['info', 'busca al usuario'] },
    caption: 'El AuthenticationManager (con su DaoAuthenticationProvider) pide el usuario a su UserDetailsService, que usa UserService.',
  });
  add({ hot: ['userService'], gap: ['g4', 'down', `findByEmail("${USER.username}")`, 'l'], caption: 'UserService le pide el usuario al repositorio.' });
  add({ hot: ['userRepo'], gap: ['g5', 'down', 'SELECT … WHERE email = ?', 'l'], caption: 'UserRepository consulta la base de datos.' });
  add({ hot: ['db'], read: 'users', caption: 'La base de datos encuentra la fila del usuario, con su contraseña cifrada.' });
  add({ hot: ['db'], gap: ['g5', 'up', '1 fila', 'l'], caption: 'La fila sube al repositorio.' });
  add({ hot: ['userRepo'], gap: ['g4', 'up', 'Optional<User>', 'l'], caption: 'El repositorio devuelve la entidad User.' });
  add({
    hot: ['userService', 'manager'],
    status: { userService: ['pass', 'UserDetails'] },
    caption: 'Con la entidad se arma un UserDetails (username, contraseña cifrada y authorities) y vuelve al AuthenticationManager.',
  });
  if (!good) {
    add({
      hot: ['manager'],
      status: { manager: ['stop', '✗ contraseña incorrecta'] },
      warn: true,
      caption: 'El AuthenticationManager compara la contraseña recibida con la cifrada usando el PasswordEncoder: no coincide.',
    });
    add({
      hot: ['manager'],
      gap: ['g3', 'fail', 'BadCredentialsException', 'l'],
      warn: true,
      caption: 'Lanza BadCredentialsException. El controller no sigue: nunca se genera un token para credenciales malas.',
    });
    add({
      hot: ['auth'],
      gap: ['g2', 'fail', 'BadCredentialsException', 'l'],
      warn: true,
      caption: 'La excepción sale del controller y sube a la cadena de filtros.',
    });
    add({
      hot: ['authz'],
      gap: ['g1', 'fail', '401 · { "error": "Unauthorized" }'],
      warn: true,
      caption: 'Spring Security convierte la excepción en un 401 hacia el cliente.',
    });
    add({
      hot: ['client'],
      response: ['fail', '401 Unauthorized'],
      warn: true,
      caption: `Credenciales incorrectas: no hay token. Pruebe con la contraseña ${USER.password}.`,
    });
    return steps;
  }
  add({
    hot: ['manager'],
    status: { manager: ['pass', '✓ credenciales válidas'] },
    caption: 'El AuthenticationManager compara la contraseña recibida con la cifrada usando el PasswordEncoder: coinciden.',
  });
  add({ hot: ['manager'], gap: ['g3', 'up', 'Authentication · principal: UserDetails', 'l'], caption: 'Devuelve un Authentication cuyo principal es el UserDetails.' });
  add({ hot: ['auth'], gap: ['g3', 'down', 'generateToken(userDetails)', 'l'], caption: 'Con el UserDetails, el controller le pide el token al JwtService.' });
  add({
    hot: ['jwtService'],
    status: { jwtService: ['pass', '✓ token firmado'] },
    caption: 'JwtService arma el payload (sub, authorities, iat, exp) y lo firma con el secreto, que nunca sale del servidor.',
  });
  add({ hot: ['jwtService'], gap: ['g3', 'up', 'eyJhbGciOiJIUzM4NCJ9…', 'l'], caption: 'Devuelve el token al controller.' });
  add({ hot: ['auth'], gap: ['g2', 'up', '200 OK · { "accessToken": "eyJ…" }', 'l'], caption: 'El controller responde con el token. La respuesta sube por la cadena.' });
  add({ hot: ['authz'], gap: ['g1', 'up', '200 OK · { "accessToken": "eyJ…" }'], caption: 'Sale de la SecurityFilterChain hacia el cliente.' });
  add({
    hot: ['client'],
    response: ['ok', '200 OK · accessToken'],
    saveToken: true,
    caption: 'El cliente guarda el token. Ahora pida GET /api/v1/posts: esta vez el token viaja en el request.',
  });
  return steps;
};

const mountJwtFlow = (root) => {
  ensureStyle();
  const container = el('div', { class: 'jsim', 'data-testid': 'jwt-flow' });
  root.replaceChildren(container);

  const timers = [];
  let token = null;
  let steps = [];
  let stepIndex = 0;
  let running = false;
  let manual = false;

  const nodes = {};
  const statuses = {};
  const bands = {};
  const gaps = {};

  const camel = (name) => name.split(/(?=[A-Z][a-z])/).flatMap((part, index) => (index ? [el('wbr'), part] : [part]));
  const node = (key, name, role, extra = '') => {
    const status = el('span', { class: 'js-st', 'data-testid': `status-${key}` });
    statuses[key] = status;
    const item = el('div', { class: `js-node${extra ? ` ${extra}` : ''}`, 'data-node': key },
      el('span', {}, el('b', {}, ...camel(name)), role ? el('small', { text: ` · ${role}` }) : null), status);
    nodes[key] = item;
    return item;
  };
  const band = (key, kind, name, role, ...body) => {
    const item = el('div', { class: `js-band js-${kind}` },
      el('div', { class: 'js-head' }, el('span', { class: 'js-name', text: name }), el('span', { class: 'js-role', text: role })),
      ...body);
    bands[key] = item;
    return item;
  };
  const gap = (key, columns, extra = '') => {
    const slots = Array.from({ length: columns }, () => el('div', { class: 'js-slot' }));
    gaps[key] = slots;
    return el('div', { class: `js-gap${extra}`, 'data-gap': key }, ...slots);
  };

  const loginButton = el('button', { class: 'js-call', type: 'button', 'data-testid': 'call-login', onclick: () => start('login') },
    el('span', { class: 'js-verb', text: 'POST' }), '/api/v1/auth/login');
  const postsButton = el('button', { class: 'js-call', type: 'button', 'data-testid': 'call-posts', onclick: () => start('posts') },
    el('span', { class: 'js-verb js-get', text: 'GET' }), '/api/v1/posts');
  const passwordInput = el('input', { type: 'text', value: USER.password, 'aria-label': 'Contraseña', autocomplete: 'off' });
  const tokenBox = el('span', { class: 'js-token', 'data-testid': 'client-token' });
  const tamperButton = el('button', { class: 'js-mini', type: 'button', text: 'Alterar el token', onclick: () => { token = 'bad'; renderToken(); } });
  const clearButton = el('button', { class: 'js-mini', type: 'button', text: 'Borrar el token', onclick: () => { token = null; renderToken(); } });
  const responseBox = el('span', { class: 'js-resp', 'data-testid': 'client-response', text: 'ninguna todavía' });

  const ctxWho = el('div', { 'data-testid': 'security-context' });
  const ctxBox = el('div', { class: 'js-ctx' }, el('b', { text: 'Authentication' }), ctxWho);
  nodes.ctx = ctxBox;

  const rows = {
    users: el('div', { class: 'js-rowdb', text: `${USER.username} · $2a$10$Qe…` }),
    posts: [el('div', { class: 'js-rowdb', text: '1 · Hola mundo' }), el('div', { class: 'js-rowdb', text: '2 · JWT en Spring' })],
  };
  const tables = {
    users: el('div', { class: 'js-table' }, el('b', { text: 'users' }), rows.users),
    posts: el('div', { class: 'js-table' }, el('b', { text: 'posts' }), ...rows.posts),
  };

  const links = {};
  const link = (key) => {
    links[key] = el('div', { class: 'js-link' });
    return links[key];
  };
  const rules = {
    permit: el('div', { class: 'js-rule', text: 'requestMatchers("/api/v1/auth/**").permitAll()' }),
    auth: el('div', { class: 'js-rule', text: 'anyRequest().authenticated()' }),
  };
  const client = band('client', 'client', 'CLIENTE', 'pulse un endpoint',
    el('div', { class: 'js-req' }, loginButton, postsButton),
    el('div', { class: 'js-creds' }, el('span', { class: 'js-mono', text: `username: ${USER.username}` }),
      el('label', {}, 'password: ', passwordInput)),
    el('div', { class: 'js-row' }, 'Token guardado:', tokenBox, tamperButton, clearButton),
    el('div', { class: 'js-row' }, 'Última respuesta:', responseBox));
  const chain = band('chain', 'chain', 'SECURITYFILTERCHAIN · /api/v1/**', 'cada request pasa por sus filtros, en orden',
    el('div', { class: 'js-stack' },
      node('others', 'CorsFilter · LogoutFilter · …', '', 'js-dim'), link('jwt'),
      node('jwt', 'JwtAuthFilter', 'valida el token', 'js-jwt'), link('upaf'),
      node('upaf', 'UsernamePasswordAuthenticationFilter', 'login con formulario'), link('authz'),
      node('authz', 'AuthorizationFilter', 'revisa las reglas de acceso')));
  nodes.authz.append(el('div', { class: 'js-rules' }, rules.permit, rules.auth));
  const hgap = el('div', { class: 'js-hgap', 'data-gap': 'gx' });
  gaps.gx = [hgap];
  const context = band('context', 'context', 'SECURITYCONTEXT', 'del request actual',
    ctxBox, el('div', { class: 'js-ctx-note', text: 'No es un filtro: es donde los filtros dejan quién está autenticado.' }));
  // Below the chain: one row per request, one column per layer, messages in a strip under each row.
  const SPAN = { g2: '1 / 4', g3: '1 / 4', g4: '3 / 6', g5: '5 / 8' };
  const CONN = { g3: 0, g4: 1, g5: 2 };
  const cell = (kind, ...children) => el('div', { class: `js-cell js-${kind}` }, ...children);
  const conn = () => el('div', { class: 'js-conn', text: '⇢' });
  const strip = () => el('div', { class: 'js-strip' });
  const cells = {
    l: [cell('ctrl', node('auth', 'RestAuthController')),
      cell('svc', node('manager', 'AuthenticationManager'), node('jwtService', 'JwtService'), node('userService', 'UserService')),
      cell('repo', node('userRepo', 'UserRepository')), cell('db', tables.users)],
    r: [cell('ctrl', node('posts', 'PostController')), cell('svc', node('postService', 'PostService')),
      cell('repo', node('postRepo', 'PostRepository')), cell('db', tables.posts)],
  };
  const conns = { l: [conn(), conn(), conn()], r: [conn(), conn(), conn()] };
  const strips = { g2: strip(), l: strip(), r: strip() };
  const layerRow = (side) => cells[side].flatMap((item, index) => (index ? [conns[side][index - 1], item] : [item]));
  const head = (kind, text) => el('div', { class: `js-ghead js-${kind}`, text });
  const g2Arrow = el('div', { class: 'js-slot js-varrow' });
  const layers = el('div', { class: 'js-gridwrap' }, el('div', { class: 'js-grid' },
    g2Arrow, strips.g2,
    head('ctrl', 'CONTROLLERS'), el('div'), head('svc', 'SERVICIOS'), el('div'), head('repo', 'REPOSITORIOS'), el('div'), head('db', 'BASE DE DATOS'),
    ...layerRow('l'), strips.l, ...layerRow('r'), strips.r));
  const cellOf = {
    auth: ['l', 0], manager: ['l', 1], jwtService: ['l', 1], userService: ['l', 1], userRepo: ['l', 2],
    posts: ['r', 0], postService: ['r', 1], postRepo: ['r', 2],
  };
  let currentRow = 'l';

  const note = el('div', { class: 'js-note', 'aria-live': 'polite' });
  const noteStep = el('small');
  const noteText = el('span');
  note.append(noteStep, noteText);
  const nextButton = el('button', { class: 'js-btn', type: 'button', text: 'Siguiente paso', onclick: () => advance() });
  const manualInput = el('input', {
    type: 'checkbox',
    'aria-label': 'Paso a paso',
    onchange: (event) => {
      manual = event.target.checked;
      syncControls();
      if (!manual && running) schedule();
    },
  });

  container.append(
    el('div', { class: 'js-title', text: 'Autenticación stateless con JWT' }),
    el('div', { class: 'js-sub', text: 'Pulse un endpoint y siga el request. Empiece por /posts sin token, luego haga login y vuelva a pedir /posts.' }),
    client, gap('g1', 1),
    el('div', { class: 'js-midrow' }, chain, hgap, context),
    layers,
    el('div', { class: 'js-foot' }, note,
      el('div', { class: 'js-ctrls' }, el('label', { class: 'js-switch' }, manualInput, 'Paso a paso'), nextButton)));

  const bandOf = {
    client: 'client', others: 'chain', jwt: 'chain', upaf: 'chain', authz: 'chain', ctx: 'context',
  };

  const renderToken = () => {
    tokenBox.className = `js-token${token ? (token === 'bad' ? ' js-bad' : ' js-has') : ''}`;
    tokenBox.textContent = token ? (token === 'bad' ? TAMPERED : TOKEN) : 'ninguno';
    tamperButton.disabled = running || token !== 'ok';
    clearButton.disabled = running || !token;
  };
  const renderContext = (who) => {
    ctxWho.replaceChildren(...(who
      ? [el('div', { class: 'js-who', text: who[0] }), el('div', { text: `[${who[1]}]` })]
      : [el('div', { text: 'vacío: nadie autenticado' })]));
  };
  const setStatus = (key, [kind, text] = ['', '']) => {
    statuses[key].className = `js-st${kind ? ` js-${kind}` : ''}`;
    statuses[key].textContent = text;
  };
  const showGap = (spec) => {
    Object.values(gaps).forEach((slots) => slots.forEach((slot) => slot.replaceChildren()));
    Object.values(strips).forEach((item) => item.replaceChildren());
    [...conns.l, ...conns.r].forEach((item) => item.classList.remove('js-act'));
    if (!spec) return;
    const [where, dir, text, side] = spec;
    const kind = { up: ' js-up', fail: ' js-fail', side: ' js-side' }[dir] || '';
    if (SPAN[where]) {
      const deeper = where !== 'g2';
      const arrow = dir === 'down' ? (deeper ? '→' : '↓') : (deeper ? '←' : '↑');
      const message = el('span', { class: `js-msg${kind}`, text: `${arrow} ${text}` });
      const row = side === 'r' ? 'r' : 'l';
      (deeper ? strips[row] : strips.g2).appendChild(el('div', { style: `grid-column:${SPAN[where]}` }, message));
      if (deeper) conns[row][CONN[where]].classList.add('js-act');
      return;
    }
    const slots = gaps[where];
    const slot = slots[side === 'r' ? slots.length - 1 : 0];
    const arrow = { down: '↓', up: '↑', fail: '↑', side: '→' }[dir];
    slot.appendChild(el('span', { class: `js-msg${kind}`, text: `${arrow} ${text}` }));
  };
  const highlight = (keys = []) => {
    Object.entries(nodes).forEach(([key, item]) => item.classList.toggle('js-hot', keys.includes(key)));
    Object.entries(tables).forEach(([, item]) => item.classList.remove('js-hot'));
    const on = new Set(keys.map((key) => bandOf[key]));
    Object.entries(bands).forEach(([key, item]) => item.classList.toggle('js-on', on.has(key) && key !== 'client'));
    const lit = keys.map((key) => (key === 'db' ? [currentRow, 3] : cellOf[key])).filter(Boolean);
    ['l', 'r'].forEach((side) => cells[side].forEach((item, index) =>
      item.classList.toggle('js-on', lit.some(([row, col]) => row === side && col === index))));
  };
  const markRead = (table) => {
    [rows.users, ...rows.posts].forEach((row) => row.classList.remove('js-read'));
    if (!table) return;
    tables[table].classList.add('js-hot');
    [table === 'users' ? rows.users : rows.posts].flat().forEach((row) => {
      row.classList.add('js-read');
      flash(row);
    });
  };

  const TRAIL = ['js-down', 'js-back', 'js-bad', 'js-side'];
  const trailItems = () => [gaps.g1[0], hgap, g2Arrow, ...Object.values(links), ...conns.l, ...conns.r];
  const mark = (item, state) => {
    const wentDown = item.classList.contains('js-down') || item.dataset.went === 'down';
    item.classList.remove(...TRAIL);
    item.classList.add(`js-${state}`);
    if (!item.classList.contains('js-conn')) return;
    if (state === 'down') item.dataset.went = 'down';
    item.textContent = state === 'down' ? '→' : wentDown ? '⇄' : '←';
  };
  const clearTrail = () => trailItems().forEach((item) => {
    item.classList.remove(...TRAIL);
    if (item.classList.contains('js-conn')) item.textContent = '⇢';
    delete item.dataset.went;
  });
  const connectorFor = ([where, , , side]) => {
    if (where === 'g1') return gaps.g1[0];
    if (where === 'gx') return hgap;
    if (where === 'g2') return g2Arrow;
    return conns[side === 'r' ? 'r' : 'l'][CONN[where]];
  };
  const leaveTrail = (step) => {
    ['jwt', 'upaf', 'authz'].filter((key) => step.hot.includes(key)).forEach((key) => mark(links[key], 'down'));
    if (step.gap) mark(connectorFor(step.gap), { down: 'down', up: 'back', fail: 'bad', side: 'side' }[step.gap[1]]);
  };

  const runStep = (step) => {
    highlight(step.hot);
    showGap(step.gap);
    leaveTrail(step);
    if (step.rule) rules[step.rule[0]].classList.add(`js-${step.rule[1]}`);
    Object.entries(step.status || {}).forEach(([key, value]) => setStatus(key, value));
    if (step.read) markRead(step.read);
    if (step.context) {
      renderContext(step.context);
      flash(ctxBox);
    }
    if (step.response) {
      responseBox.className = `js-resp js-${step.response[0]}`;
      responseBox.textContent = step.response[1];
      flash(responseBox);
    }
    if (step.saveToken) {
      token = 'ok';
      renderToken();
      flash(tokenBox);
    }
    noteStep.textContent = `Paso ${stepIndex + 1} de ${steps.length}`;
    noteText.textContent = step.caption;
    note.classList.toggle('js-warn', Boolean(step.warn));
  };

  const syncControls = () => {
    nextButton.style.display = manual && running ? '' : 'none';
    loginButton.disabled = running;
    postsButton.disabled = running;
    passwordInput.disabled = running;
    renderToken();
  };
  const finish = () => {
    running = false;
    syncControls();
  };
  const advance = () => {
    if (!running) return;
    runStep(steps[stepIndex]);
    stepIndex += 1;
    if (stepIndex >= steps.length) finish();
    else if (!manual) schedule();
  };
  const schedule = () => {
    timers.forEach(clearTimeout);
    timers.length = 0;
    timers.push(setTimeout(advance, STEP_MS));
  };

  const idleFor = {
    login: ['posts', 'postService', 'postRepo'],
    posts: ['auth', 'manager', 'jwtService', 'userService', 'userRepo'],
  };
  const reset = (endpoint) => {
    Object.keys(statuses).forEach((key) => setStatus(key));
    Object.entries(nodes).forEach(([key, item]) => item.classList.toggle('js-idle', idleFor[endpoint].includes(key)));
    tables.users.classList.toggle('js-idle', endpoint === 'posts');
    tables.posts.classList.toggle('js-idle', endpoint === 'login');
    markRead(null);
    clearTrail();
    Object.values(rules).forEach((item) => item.classList.remove('js-pass', 'js-stop'));
    renderContext(null);
    responseBox.className = 'js-resp';
    responseBox.textContent = 'esperando…';
  };

  function start(endpoint) {
    if (running) return;
    reset(endpoint);
    currentRow = endpoint === 'login' ? 'l' : 'r';
    steps = jwtSteps({ endpoint, token, password: passwordInput.value });
    stepIndex = 0;
    running = true;
    syncControls();
    advance();
  }

  renderToken();
  renderContext(null);
  highlight();
  syncControls();
  noteStep.textContent = 'Listo';
  noteText.textContent = 'Pulse GET /api/v1/posts para ver qué pasa sin token, o POST /api/v1/auth/login para obtener uno.';

  return () => {
    timers.forEach(clearTimeout);
    root.replaceChildren();
  };
};

export const SIMS = Object.freeze({
  'jwt-flow': mountJwtFlow,
});

export const parseSpec = (spec) => {
  const [name = '', ...args] = String(spec || '').trim().split(/\s+/);
  return { name, args };
};
