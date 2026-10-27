// Interactive skill browser for "Skills en Antigravity CLI" (Computación en Internet II).
// Plain DOM, no React and no imports, same contract as the other simulators:
// every simulator is `mount(element, args) => destroy`.
// The file contents come from tools/skills/ — regenerate with `python3 tools/skills_data.py`.

const STYLE_ID = 'ksim-style';

const CSS = `
.ksim{background:#FBFBFD;color:#161A26;border:1px solid #D9DEE8;border-radius:16px;padding:16px;box-sizing:border-box;
  font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:1.4;max-width:960px;margin:0 auto;container-type:inline-size}
.ksim *{box-sizing:border-box}
.ksim .ks-title{font-size:17px;font-weight:700;margin:0 0 2px}
.ksim .ks-sub{font-size:12.5px;color:#79809A;margin:0 0 12px}
.ksim .ks-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
.ksim .ks-tab{border:1.5px solid #C4CBD8;background:#fff;color:#556074;border-radius:18px;padding:6px 16px;cursor:pointer;
  font:700 13px 'JetBrains Mono',Menlo,Consolas,monospace}
.ksim .ks-tab:hover{box-shadow:0 0 0 3px #E3E7EF}
.ksim .ks-tab.ks-sel{background:var(--c);border-color:var(--c);color:#fff}
.ksim .ks-summary{background:#fff;border:1.5px solid #D9DEE8;border-left:5px solid var(--c);border-radius:12px;padding:10px 14px;
  margin-bottom:12px;font-size:13.5px;line-height:1.5}
.ksim .ks-body{display:flex;gap:12px;align-items:stretch}
.ksim .ks-tree{flex:0 0 230px;min-width:0;background:#fff;border:1.5px solid #D9DEE8;border-radius:12px;padding:10px;
  display:flex;flex-direction:column;gap:4px}
.ksim .ks-head{font-size:11.5px;font-weight:700;letter-spacing:.08em;color:#556074;margin-bottom:4px}
.ksim .ks-dir,.ksim .ks-file{font:12.5px 'JetBrains Mono',Menlo,Consolas,monospace;overflow-wrap:anywhere;text-align:left}
.ksim .ks-dir{color:#A96C05;font-weight:700;padding:3px 0}
.ksim .ks-dir::before{content:'▸ ';color:#C4CBD8}
.ksim .ks-file{border:1.5px solid transparent;background:none;border-radius:8px;padding:4px 8px;cursor:pointer;color:#161A26}
.ksim .ks-file:hover{background:#F3F5F9}
.ksim .ks-file.ks-sel{border-color:var(--c);background:var(--soft);font-weight:700}
.ksim .ks-file.ks-main{font-weight:700}
.ksim .ks-viewer{flex:1 1 0;min-width:0;background:#1F2430;border-radius:12px;display:flex;flex-direction:column;overflow:hidden}
.ksim .ks-bar{display:flex;justify-content:space-between;align-items:center;gap:8px;background:#2A3040;padding:6px 10px}
.ksim .ks-path{font:12px 'JetBrains Mono',Menlo,Consolas,monospace;color:#9AA3B5;overflow-wrap:anywhere;min-width:0}
.ksim .ks-copy{border:1px solid #556074;background:#1F2430;color:#E6EAF2;border-radius:8px;padding:3px 12px;cursor:pointer;
  font:600 12px Roboto,Arial,sans-serif;white-space:nowrap}
.ksim .ks-copy.ks-done{border-color:#3FB37F;color:#7FD9A8}
.ksim .ks-code{margin:0;padding:12px 14px;font:12px/1.55 'JetBrains Mono',Menlo,Consolas,monospace;color:#E6EAF2;
  white-space:pre-wrap;overflow-wrap:anywhere;overflow-y:auto;max-height:440px}
.ksim .ks-use{display:flex;flex-direction:column;gap:6px;margin-top:12px;font-size:13px}
.ksim .ks-use b{font-size:11.5px;letter-spacing:.06em;color:#556074;margin-right:6px}
.ksim .ks-prompt{display:inline-block;background:#F4EBFF;border:1.5px solid #C9A6EE;border-radius:10px;padding:3px 10px;margin:2px 4px 2px 0}
.ksim .ks-out{display:inline-block;font:12px 'JetBrains Mono',Menlo,Consolas,monospace;background:#EFF1F5;border-radius:6px;
  padding:1px 6px;margin:2px 4px 2px 0}
@container (max-width:640px){
  .ksim .ks-body{flex-direction:column}
  .ksim .ks-tree{flex-basis:auto}
  .ksim .ks-viewer{flex:0 0 auto}
  .ksim .ks-code{max-height:360px}
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

// <skills-data>
export const SKILLS = [
  {
    "name": "spec-writer",
    "color": "#7439B8",
    "soft": "#F4EBFF",
    "summary": "Convierte un pedido vago en una spec: requisitos, criterios de aceptación que se responden con sí o no, endpoints con sus errores y tareas. No escribe código.",
    "prompts": [
      "Escribe la spec para matricular un estudiante en un curso desde la API"
    ],
    "writes": [
      "docs/specs/<nombre>.md"
    ],
    "files": [
      {
        "path": "SKILL.md",
        "content": "---\nname: spec-writer\ndescription: Convierte un pedido vago en una spec con requisitos, criterios de aceptación, plan técnico y tareas para la API de 262WebApp6. Úsala cuando pidan escribir una spec, especificar o planear una funcionalidad, criterios de aceptación o \"divide esto en tareas\".\n---\n\n# spec-writer\n\nEscribes la especificación antes de que alguien escriba código.\nNo escribes código.\n\n## Pasos\n\n1. Lee `references/plantilla.md`. Es el formato exacto del archivo.\n2. Lee `apidev.md` si existe: dice qué entidades y endpoints tiene la API.\n3. Lee las clases de `src/main/java/edu/co/icesi/introspringboot/entity/`\n   que toque el pedido. No inventes campos: si el pedido necesita uno que\n   no existe, escríbelo como supuesto.\n4. Escribe la spec en `docs/specs/<nombre-corto>.md`, con el nombre en\n   minúsculas y separado con guiones.\n5. Responde con la ruta del archivo y los supuestos, de mayor a menor\n   impacto.\n\n## Reglas\n\n- No preguntes antes de escribir. Toda decisión que tomes sin que te la\n  hayan dicho va marcada en el texto como `[SUPUESTO: ...]`.\n- La sección \"Qué y por qué\" no nombra tecnologías. Spring, JPA o\n  MapStruct van en el Plan.\n- Cada criterio de aceptación se responde con sí o no. \"Funciona bien\" no\n  es un criterio; \"Responde 404 si el curso no existe\" sí.\n- Cada endpoint dice método, ruta, permiso, cuerpo de entrada, respuesta\n  y códigos de error.\n- Cada tarea se puede hacer y probar sola, en una sesión del agente.\n"
      },
      {
        "path": "references/plantilla.md",
        "content": "# Spec: <título corto>\n\n## Qué y por qué\n\nUna o dos frases: qué hace la funcionalidad y para quién.\n\n## Requisitos\n\n1. El sistema permite ...\n2. ...\n\n## Casos borde\n\n- Qué pasa si el recurso no existe.\n- Qué pasa si quien lo pide no tiene permiso.\n- Qué pasa con datos repetidos o incompletos.\n\n## Criterios de aceptación\n\n- Dado <situación>, cuando <acción>, entonces <resultado observable>.\n- ...\n\n## Plan\n\n### Endpoints\n\n- `GET /api/v1/courses/{publicId}` · permiso `READ_COURSE`\n  - Entrada: ninguna\n  - 200: `CourseDTO`\n  - Errores: 401 sin token, 403 sin permiso, 404 si no existe\n\n### Datos\n\nEntidades y campos nuevos o modificados. DTO de entrada y de salida,\ncon sus campos.\n\n### Capas\n\nQué cambia en `entity/`, `repo/`, `service/`, `service/impl/`,\n`api/dto/`, `api/mapper/` y `api/`.\n\n## Tareas\n\n### Tarea 1: <título>\n\n- Depende de: ninguna\n- Qué construir: ...\n- Criterios: ...\n\n## Supuestos\n\n1. [ALTO] <decisión tomada> · Corregir si: <cuándo es falsa>\n2. [MEDIO] ...\n"
      }
    ]
  },
  {
    "name": "api-creator",
    "color": "#0F8478",
    "soft": "#E3F6F3",
    "summary": "Revisa qué entidades tienen endpoints y cuáles no, y crea los que faltan con DTO, mapper de MapStruct y publicId. Deja el manifiesto de la API y un histórico de lo que hizo.",
    "prompts": [
      "Revisa la API y dime qué entidades no tienen endpoints",
      "Expón Student con lectura y creación"
    ],
    "writes": [
      "apidev.md",
      "apidevlog.md",
      "api/dto/",
      "api/mapper/",
      "api/"
    ],
    "files": [
      {
        "path": "SKILL.md",
        "content": "---\nname: api-creator\ndescription: Revisa qué entidades de 262WebApp6 tienen endpoints REST y cuáles no, crea los que falten con DTO, mapper de MapStruct y publicId, y mantiene apidev.md y apidevlog.md. Úsala cuando pidan crear o completar la API, exponer una entidad, implementar una spec de docs/specs/, revisar qué endpoints hay o actualizar el manifiesto de la API.\n---\n\n# api-creator\n\nConstruyes la API REST del proyecto sin exponer nunca una entidad JPA.\n\n## Pasos\n\n1. Lee `references/convenciones.md` y `references/manifiesto.md`.\n2. Haz el inventario: las clases con `@Entity` de `entity/` y los\n   `@RestController` de `api/`. Para cada entidad, anota qué endpoints\n   tiene, qué DTO usa y si tiene `publicId`.\n3. Escribe o reescribe `apidev.md` en la raíz del proyecto, con el\n   formato de `references/manifiesto.md`.\n4. Si el pedido es solo revisar, termina aquí: resume lo que falta.\n   Si trae una spec de `docs/specs/`, léela y sigue sus tareas en orden.\n5. Para cada entidad que vas a exponer:\n   1. Si no tiene `publicId`, agrégalo y genéralo al crear.\n   2. Crea el DTO en `api/dto/` y el mapper en `api/mapper/`.\n   3. Agrega al service los métodos que reciben y devuelven DTO.\n   4. Crea o completa su `@RestController` en `api/`.\n6. Compila con `./mvnw -q compile` (en Windows, `mvnw.cmd -q compile`).\n   Si falla, corrige antes de seguir.\n7. Actualiza `apidev.md` y agrega una entrada al final de\n   `apidevlog.md`.\n\n## Reglas\n\n- Un controller nunca recibe ni devuelve una clase de `entity/`. Si\n  encuentras uno que lo hace, es lo primero que corriges.\n- Ningún DTO de salida trae el `id` numérico ni contraseñas. El cliente\n  identifica cada recurso por su `publicId`.\n- Las rutas usan `publicId`: `/api/v1/courses/{publicId}`.\n- `User`, `Role`, `Permission` y sus tablas puente no se exponen, salvo\n  que el pedido lo diga con esas palabras.\n- No cambies ni borres un endpoint que ya existe sin anotarlo en\n  `apidevlog.md`.\n- `apidevlog.md` solo crece: nunca edites ni borres entradas anteriores.\n- No toques `security/` ni las vistas de Thymeleaf de `controller/`.\n"
      },
      {
        "path": "references/convenciones.md",
        "content": "# Convenciones de la API de 262WebApp6\n\n## Paquetes\n\nTodo vive en `src/main/java/edu/co/icesi/introspringboot/`:\n\n- `entity/`: entidades JPA.\n- `repo/`: repositorios de Spring Data.\n- `service/`: interfaces. `service/impl/`: las clases `XxxServiceImpl`.\n- `api/`: los `@RestController`.\n- `api/dto/`: los DTO. `api/mapper/`: los mappers de MapStruct.\n- `controller/`: vistas de Thymeleaf. No se tocan.\n\n## Rutas\n\n- Base: `/api/v1`. Con el context path, la URL completa empieza en\n  `http://localhost:8080/WebApp6/api/v1`.\n- Recursos en plural y en inglés: `/courses`, `/students`.\n- Un recurso se identifica por `publicId`: `GET /courses/{publicId}`.\n- 200 al leer, 201 al crear (con el recurso creado en el cuerpo) y 204\n  al borrar.\n\n## publicId\n\nIgual que en `Course`:\n\n```java\n@Column(name = \"public_id\", unique = true, nullable = false,\n        updatable = false, length = 36)\nprivate String publicId;\n```\n\nSe asigna en el service al crear:\n\n```java\nentity.setPublicId(UUID.randomUUID().toString());\n```\n\nSi la entidad tiene filas en `src/main/resources/data.sql`, agrega la\ncolumna `public_id` a esos `INSERT`, con un UUID fijo por fila. Si no,\nla app no arranca: la columna es `nullable = false`.\n\n## DTO\n\n- Lombok: `@Data`, `@NoArgsConstructor` y `@AllArgsConstructor`.\n- `XxxDTO` para la respuesta. Si la entrada pide otros campos,\n  `XxxRequestDTO`.\n- Una relación sale plana (`professorName`) o como otro DTO, nunca como\n  entidad.\n\n## Mappers\n\n- Una interfaz por entidad, con `@Mapper(componentModel = \"spring\")`.\n- `toDTO(Entidad)` y, si hay escritura, `toEntity(RequestDTO)` con\n  `@Mapping(target = \"id\", ignore = true)` y\n  `@Mapping(target = \"publicId\", ignore = true)`.\n- Si un DTO contiene otro DTO, el mapper declara `uses = OtroMapper.class`.\n- Nada de mapeo manual con `new XxxDTO(...)` en el service.\n\n## Seguridad\n\n- Cada método nuevo del service lleva `@PreAuthorize` con un permiso de\n  `data.sql`: `CREATE_`, `READ_`, `UPDATE_` o `DELETE_` seguido del\n  nombre de la entidad en mayúsculas. Ejemplo:\n  `@PreAuthorize(\"hasAuthority('READ_STUDENT')\")`.\n- Si una entidad no tiene esos permisos en `data.sql`, agrégalos y\n  asígnalos al rol ADMIN.\n"
      },
      {
        "path": "references/manifiesto.md",
        "content": "# Formato de apidev.md y apidevlog.md\n\n## apidev.md\n\nEs la foto actual de la API. Se reescribe completo cada vez. Lleva una\nsección por cada clase con `@Entity`, en orden alfabético, y al final\nlos pendientes: todo lo que incumple `references/convenciones.md`.\n\n```markdown\n# Manifiesto de la API · 262WebApp6\n\nActualizado: AAAA-MM-DD\n\n## Course\n\n- Expuesta: sí · DTO: `CourseDTO` · Mapper: `CourseMapper`\n- publicId: sí\n- `GET /api/v1/courses` · `READ_COURSE` · 200: lista de `CourseDTO`\n\n## Student\n\n- Expuesta: no · publicId: no\n- Falta: DTO, mapper y endpoints\n\n## Pendientes\n\n- Student no tiene publicId.\n- `ProfessorDTO` trae el `id` numérico.\n```\n\n## apidevlog.md\n\nEs el histórico. Cada vez que trabajas agregas una entrada al final.\nLas anteriores no se tocan.\n\n```markdown\n## AAAA-MM-DD HH:MM · <el pedido, en una línea>\n\n- Hice: <qué cambió, en una o dos frases>\n- Archivos: `api/dto/StudentDTO.java` (nuevo),\n  `service/impl/StudentServiceImpl.java` (editado)\n- Decisiones: <lo que elegiste y por qué>\n- Verificación: `./mvnw -q compile` sin errores\n- Pendiente: <lo que quedó sin hacer>\n```\n"
      }
    ]
  },
  {
    "name": "api-tester",
    "color": "#A96C05",
    "soft": "#FFF3DC",
    "summary": "Escribe una batería de pruebas con curl por cada recurso de la API, con casos positivos y negativos, la corre y anota cada falla. Nunca corrige el código: solo la encuentra.",
    "prompts": [
      "Escribe y corre las pruebas de la API"
    ],
    "writes": [
      "tests/api/<recurso>.sh",
      "tests/api/todas.sh",
      "tests/api/hallazgos.md"
    ],
    "files": [
      {
        "path": "SKILL.md",
        "content": "---\nname: api-tester\ndescription: Escribe y corre baterías de pruebas de la API REST de 262WebApp6 como scripts de shell con curl, con casos positivos y negativos por endpoint. Úsala cuando pidan probar la API, pruebas con curl, una batería de pruebas, casos negativos o \"verifica que los endpoints funcionan\".\n---\n\n# api-tester\n\nPruebas solo la API REST: las rutas que empiezan en `/api/v1`. No pruebas\nlas vistas de Thymeleaf ni escribes tests de JUnit.\n\n## Pasos\n\n1. Lee `references/casos.md` (qué casos escribir) y `assets/ejemplo.sh`\n   (cómo se ve un script terminado).\n2. Lee `apidev.md` si existe. Si no, lee los `@RestController` de `api/`\n   y sus DTO. Para cada endpoint anota método, ruta, el permiso de su\n   `@PreAuthorize` y el cuerpo que recibe.\n3. Lee `src/main/resources/data.sql`: usuarios, permisos y datos de\n   ejemplo.\n4. Escribe un script por recurso en `tests/api/<recurso>.sh`. Copia las\n   funciones `login`, `status` y `check` de `assets/ejemplo.sh` sin\n   cambiarlas.\n5. Escribe `tests/api/todas.sh`, que corre todos los scripts y suma los\n   resultados.\n6. Corre `bash tests/api/todas.sh` con la app arriba. Si no está arriba,\n   pídele al usuario que corra `./mvnw spring-boot:run` en otra terminal.\n7. Escribe `tests/api/hallazgos.md`: cada prueba que falló, qué\n   esperaba, qué llegó y la causa probable.\n\n## Reglas\n\n- Cada endpoint tiene al menos un caso positivo y los negativos que le\n  apliquen de `references/casos.md`.\n- El código esperado sale de `references/casos.md`, no de lo que hoy\n  responde la API. Si responde otra cosa, la prueba falla y va a\n  `hallazgos.md`. Nunca cambies una prueba para que pase.\n- No modifiques nada de `src/`. Tu trabajo es encontrar fallas, no\n  corregirlas.\n- Las pruebas que crean datos usan valores únicos (`$(date +%s)`) para\n  que el script se pueda correr dos veces.\n- Solo `curl`, `sed` y `grep`. Nada de `jq` ni otros programas.\n"
      },
      {
        "path": "assets/ejemplo.sh",
        "content": "#!/usr/bin/env bash\n# Pruebas de /courses. Antes: ./mvnw spring-boot:run\nBASE=\"${BASE:-http://localhost:8080/WebApp6/api/v1}\"\nPASS=0\nFAIL=0\n\nlogin() {\n  curl -s -X POST \"$BASE/auth/login\" \\\n    -H \"Content-Type: application/json\" \\\n    -d \"{\\\"username\\\":\\\"$1\\\",\\\"password\\\":\\\"$2\\\"}\" \\\n    | sed -E 's/.*\"accessToken\":\"([^\"]+)\".*/\\1/'\n}\n\nstatus() {\n  local args=(-s -o /dev/null -w \"%{http_code}\" -X \"$1\" \"$BASE$2\")\n  [ -n \"$3\" ] && args+=(-H \"Authorization: Bearer $3\")\n  [ -n \"$4\" ] && args+=(-H \"Content-Type: application/json\" -d \"$4\")\n  curl \"${args[@]}\"\n}\n\ncheck() {\n  if [ \"$2\" = \"$3\" ]; then\n    PASS=$((PASS + 1)); echo \"  OK     $1\"\n  else\n    FAIL=$((FAIL + 1)); echo \"  FALLA  $1 · esperaba $2, llegó $3\"\n  fi\n}\n\nADMIN=$(login nicolas 123456)\nDIRECTOR=$(login barragan 123456)\nALTERADO=$(echo \"$ADMIN\" | sed 's/\\./.e/')\n\necho \"GET /courses\"\ncheck \"GET /courses · admin\" 200 \"$(status GET /courses \"$ADMIN\")\"\ncheck \"GET /courses · director\" 200 \"$(status GET /courses \"$DIRECTOR\")\"\ncheck \"GET /courses · sin token\" 401 \"$(status GET /courses)\"\ncheck \"GET /courses · token alterado\" 401 \\\n  \"$(status GET /courses \"$ALTERADO\")\"\n\nBODY=$(curl -s \"$BASE/courses\" -H \"Authorization: Bearer $ADMIN\")\ncheck \"GET /courses · trae publicId\" si \\\n  \"$(echo \"$BODY\" | grep -q '\"publicId\"' && echo si || echo no)\"\ncheck \"GET /courses · no trae el id\" no \\\n  \"$(echo \"$BODY\" | grep -q '\"id\":' && echo si || echo no)\"\n\necho\necho \"$PASS pasaron · $FAIL fallaron\"\n[ \"$FAIL\" -eq 0 ]\n"
      },
      {
        "path": "references/casos.md",
        "content": "# Casos de prueba por endpoint\n\n## Usuarios de data.sql\n\nTodos con la contraseña `123456`.\n\n- `nicolas`: ROLE_ADMIN, con todos los permisos.\n- `barragan`: ROLE_DIRECTOR. Solo `READ_STUDENT`, `READ_PROFESSOR`,\n  `READ_COURSE` y los cuatro permisos de `ENROLLMENT`.\n\n## Positivos\n\n- Leer con un usuario que tiene el permiso: 200, y el cuerpo trae los\n  campos del DTO.\n- Crear con datos válidos: 201, y el cuerpo trae el recurso con su\n  `publicId`.\n- Borrar algo que existe: 204.\n- Ningún cuerpo de respuesta trae `\"id\":` ni `\"password\"`.\n\n## Negativos\n\n- Sin el encabezado `Authorization`: 401.\n- Token alterado (una letra cambiada en el payload): 401.\n- Usuario sin el permiso, por ejemplo `barragan` creando un estudiante:\n  403.\n- `publicId` que no existe: 404.\n- JSON mal formado o sin un campo obligatorio: 400.\n- Crear algo que repite un campo único (dos estudiantes con el mismo\n  `code`): 409.\n- Login con contraseña equivocada: 401.\n\n## Si llega un 302\n\nLa API redirigió el error a la página de login de Thymeleaf en vez de\nresponder con un código de error. La prueba falla y va a `hallazgos.md`\ncon esa causa probable.\n\n## Cómo se nombra un caso\n\n`<MÉTODO> <ruta> · <situación>`. Ejemplo: `POST /students · sin permiso`.\n"
      }
    ]
  }
];
// </skills-data>

const copyText = (text) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  const area = el('textarea', { style: 'position:fixed;opacity:0' });
  area.value = text;
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  area.remove();
  return Promise.resolve();
};

// Folder rows and file rows in the order they appear on disk: SKILL.md first, then each folder.
export const skillTree = (skill) => {
  const rows = [];
  const seen = new Set();
  skill.files.forEach((file) => {
    const parts = file.path.split('/');
    parts.slice(0, -1).forEach((dir, index) => {
      const key = parts.slice(0, index + 1).join('/');
      if (!seen.has(key)) {
        seen.add(key);
        rows.push({ kind: 'dir', name: `${dir}/`, depth: index + 1 });
      }
    });
    rows.push({ kind: 'file', name: parts[parts.length - 1], path: file.path, depth: parts.length });
  });
  return rows;
};

const mountSkillFiles = (root, args = []) => {
  ensureStyle();
  const container = el('div', { class: 'ksim', 'data-testid': 'skill-files' });
  root.replaceChildren(container);

  let skill = SKILLS.find((item) => item.name === args[0]) || SKILLS[0];
  let path = skill ? skill.files[0].path : null;

  const tabs = el('div', { class: 'ks-tabs', role: 'tablist' });
  const summary = el('div', { class: 'ks-summary' });
  const tree = el('div', { class: 'ks-tree' });
  const pathLabel = el('span', { class: 'ks-path' });
  const copy = el('button', { class: 'ks-copy', type: 'button', text: 'Copiar' });
  const code = el('pre', { class: 'ks-code', 'data-testid': 'skill-content' });
  const use = el('div', { class: 'ks-use' });

  copy.addEventListener('click', () => {
    const file = skill.files.find((item) => item.path === path);
    copyText(file.content).then(() => {
      copy.textContent = 'Copiado';
      copy.classList.add('ks-done');
    }, () => { copy.textContent = 'No se pudo copiar'; });
  });

  const render = () => {
    container.style.setProperty('--c', skill.color);
    container.style.setProperty('--soft', skill.soft);
    [...tabs.children].forEach((tab) => {
      const on = tab.dataset.skill === skill.name;
      tab.classList.toggle('ks-sel', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    summary.textContent = skill.summary;
    tree.replaceChildren(el('div', { class: 'ks-head', text: 'CARPETA' }),
      el('div', { class: 'ks-dir', text: `.agents/skills/${skill.name}/` }),
      ...skillTree(skill).map((row) => (row.kind === 'dir'
        ? el('div', { class: 'ks-dir', style: `margin-left:${row.depth * 12}px`, text: row.name })
        : el('button', {
          class: `ks-file${row.path === path ? ' ks-sel' : ''}${row.path === 'SKILL.md' ? ' ks-main' : ''}`,
          style: `margin-left:${row.depth * 12}px`,
          type: 'button',
          'data-path': row.path,
          onclick: () => { path = row.path; render(); },
        }, row.name))));
    const file = skill.files.find((item) => item.path === path);
    pathLabel.textContent = `.agents/skills/${skill.name}/${file.path}`;
    code.textContent = file.content;
    copy.textContent = 'Copiar';
    copy.classList.remove('ks-done');
    use.replaceChildren(
      el('div', {}, el('b', { text: 'PÍDELE' }), skill.prompts.map((text) => el('span', { class: 'ks-prompt', text: `«${text}»` }))),
      el('div', {}, el('b', { text: 'ESCRIBE' }), skill.writes.map((text) => el('span', { class: 'ks-out', text }))));
  };

  SKILLS.forEach((item) => tabs.append(el('button', {
    class: 'ks-tab',
    type: 'button',
    role: 'tab',
    'data-skill': item.name,
    style: `--c:${item.color}`,
    onclick: () => { skill = item; path = item.files[0].path; render(); },
  }, item.name)));

  container.append(
    el('div', { class: 'ks-title', text: 'Las tres skills, archivo por archivo' }),
    el('div', { class: 'ks-sub', text: 'Elija una skill y un archivo. Créelo con ese nombre en esa carpeta y pegue el contenido.' }),
    tabs, summary,
    el('div', { class: 'ks-body' }, tree, el('div', { class: 'ks-viewer' }, el('div', { class: 'ks-bar' }, pathLabel, copy), code)),
    use);
  if (skill) render();
  return () => root.replaceChildren();
};

export const SIMS = Object.freeze({
  'skill-files': mountSkillFiles,
});
