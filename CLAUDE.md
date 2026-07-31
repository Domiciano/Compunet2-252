# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a course repository for **Computación en Red 2 (Compunet2)**. It contains:
- `classnotesapp/` — A React + Vite SPA that renders the course notes as a navigable lesson viewer
- `Notas de clase/` — Raw markdown notes organized by session (S01–S32)
- `Images/` — Images referenced in notes

## classnotesapp Commands

All commands run from `classnotesapp/`:

```bash
npm run dev       # Start dev server (Vite, hot reload)
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # ESLint
npm run test      # Vitest (run all tests)
npx vitest run <file>  # Run a single test file
```

## Git Remotes

This repo has **two** remotes pointing at two different GitHub repos, both tracking the same `main` branch/history:

- `origin` → `https://github.com/Domiciano/Compunet2-252`
- `second` → `https://github.com/DomicianoRincon/Computacion2`

They matter because `classnotesapp/src/content/config.js` fetches lesson content at runtime from `raw.githubusercontent.com/DomicianoRincon/Computacion2/...` — i.e. from **`second`**, not `origin`. Pushing only to `origin` does NOT update what the running app fetches; `second` must also be pushed for content or app changes to actually take effect live.

`origin` already has cached push credentials (works with a plain `git push origin main`). `second` needs a Personal Access Token passed explicitly — it is **not** stored anywhere in this repo. It lives as the `$PAT_GITHUB_DOMICIANO_RINCON` environment variable in the local shell profile (`~/.zshrc`, not synced/committed anywhere). To push to `second`:

```bash
git push "https://domicianorincon:$PAT_GITHUB_DOMICIANO_RINCON@github.com/domicianorincon/Computacion2" main
```

Never write the literal token value into this file, any commit, or any other file that gets pushed — reference it only via the `$PAT_GITHUB_DOMICIANO_RINCON` env var.

## Architecture

### Content Pipeline

Lessons are authored in **conventional Markdown** (CommonMark + GFM), parsed with `react-markdown` + `remark-gfm` by `LessonParser.jsx`. A handful of constructs with no standard Markdown equivalent (video embeds, DartPad, the Bean Visualizer, "try it live" tabs) are expressed as fenced code blocks with a special language or meta string — see `specs/02-dsl.md` for the full mapping. (Before 2026-07, lessons used a proprietary bracket-tag DSL; that was migrated away from lesson-by-lesson, see `specs/02-dsl.md` for what changed.)

Lesson content itself is **not** inside `classnotesapp/` — it lives at the **repo root**, sibling to `classnotesapp/`: `./toc.md` and `./content/*.md`. It's fetched by the running app at runtime from GitHub raw URLs (SPEC-09/10/11), not bundled at build time — `classnotesapp/src/content/` only holds `config.js`.

**Flow:**
1. `classnotesapp/src/content/config.js` points `tocUrl` at a raw `toc.md` URL (currently `raw.githubusercontent.com/DomicianoRincon/Computacion2/...` — see "Git Remotes" below for why that specific remote)
2. `App.jsx` fetches that URL at runtime; `TableOfContentsParser` (`src/utils/tableOfContentsParser.js`) parses it into a `sections` array — entries are `[t]` (title), `[d]` (divider), `[lesson:url] <url>` (lesson, fetched on demand)
3. `LessonPage.jsx` resolves the section by route ID and fetches its Markdown (via `LessonContentCache`)
4. `LessonParser.jsx` converts the Markdown into React components, returning `{ elements, subtitles, lessonTitle }`

See `specs/02-dsl.md` for the full Markdown → component mapping (headings, images, links, code fences, and the special fenced-block languages like `mermaid`/`beansim`/`dartpad`/`youtube`/`trycode=`).

### Cómo se escribe una lección

Una lección es un archivo Markdown en `content/` **en la raíz del repo** (hermano de
`classnotesapp/`, no dentro). La app lo descarga en tiempo de ejecución, así que
editarlo y pushear lo actualiza en el sitio ya desplegado, sin rebuild.

#### Esqueleto obligatorio

```markdown
# Spring IoC Container

<!-- tags: IoC Container, inversión de control, bean, @Component, @Autowired,
     ApplicationContext, inyección por constructor, ciclo de vida del bean -->

Párrafo de entrada que dice de qué va la lección.

## Qué es el IoC Container

Texto del apartado.

## Cómo se declara un bean

Texto del apartado.
```

| Elemento | Regla |
|---|---|
| `#` (un solo h1) | Título de la lección. Es lo que se muestra arriba y lo que el asistente cita |
| `<!-- tags: … -->` | **Obligatorio.** Ver abajo |
| `##` | Apartados. Alimentan el índice lateral, el `subsection_dwell` de la analítica y el contexto que se le manda a la IA |
| `###` en adelante | Estructura interna del apartado; no salen en el índice ni cortan la subsección |

#### La sección de tags

Va en un **comentario HTML** justo bajo el `#`. GitHub no lo muestra, el visor tampoco:
solo lo leen el asistente y los chips.

```markdown
<!-- tags: IoC Container, @Autowired, ApplicationContext -->
```

Sirve para dos cosas a la vez, y por eso importa:

1. **Contexto de la IA.** Entran en la instrucción del sistema como "Temas de esta
   lección: …". El modelo ya recibe el markdown completo, pero el texto entero no le
   dice *qué es lo importante*; los tags sí. Es la diferencia entre que entienda
   "esta lección va de `@Autowired` y del ciclo de vida del bean" y que tenga que
   deducirlo de 6 KB de prosa.
2. **Los chips** que el estudiante ve bajo el chat. Se muestran los **primeros 6**;
   el resto (hasta 12) sigue yendo al modelo. Escribe primero los que más te interese
   que un estudiante pulse.

**Cómo escribir tags que sirvan.** El criterio es: *¿con qué palabras preguntaría un
estudiante que se atascó en esta lección?* Eso lleva a incluir tres tipos:

| Tipo | Ejemplos (Compunet2) |
|---|---|
| El nombre técnico exacto | `@Autowired`, `ApplicationContext`, `@RestController`, `JpaRepository` |
| El concepto en español, como lo diría el estudiante | `inyección de dependencias`, `inversión de control`, `mapeo objeto-relacional` |
| El error o la confusión típica de ese tema | `bean no encontrado`, `dependencia circular`, `LazyInitializationException` |

Los del tercer tipo son los que más rinden: son las palabras que aparecen cuando alguien
llega con un problema, no con curiosidad.

**Qué NO poner.** Nada genérico (`programación`, `Java`, `backend`): no distingue esta
lección de las otras 67 y desperdicia un chip. Tampoco frases largas — más de 42
caracteres se descarta, porque desborda el chip.

**Si no pones tags, la lección sigue funcionando**: se usan los títulos de los `##` como
respaldo. Pero los títulos describen la *estructura* del texto, no el *vocabulario* del
tema, así que el asistente queda peor contextualizado. Anotar es opcional para que nada
se rompa, no porque dé igual.

#### Bloques especiales

Markdown estándar (CommonMark + GFM) para todo, más estos bloques cercados. Detalle en
`specs/02-dsl.md`:

| Bloque | Para qué |
|---|---|
| ` ```mermaid ` | Diagrama Mermaid |
| ` ```svg ` | SVG en crudo |
| ` ```youtube ` | `<videoId> \| <título>` |
| ` ```dartpad ` | Editor DartPad; el cuerpo es el id del Gist |
| ` ```beansim ` | BeanVisualizer (solo Compunet2) |
| ` ```java trycode=<gistId> ` | Bloque con pestañas *Código* / *Fire it up!* |

Toda valla cercada **debe declarar lenguaje** (` ```java `, nunca ` ``` ` a secas): sin
él, el renderizador la confunde con código en línea.

#### Darla de alta en `toc.md`

```
[t] SEMANA 3 · Spring Framework
[lesson:url] https://raw.githubusercontent.com/<repo>/main/content/lessonXX.md | Spring IoC Container | lessonSpringIoC
```

- El **tercer campo es el id estable** (SPEC-12) y es la clave contra la que se guarda
  toda la analítica y todo el corpus de preguntas. **Nunca lo cambies** al reorganizar
  el temario: mover, renombrar o reescribir una lección está bien; cambiarle el id parte
  sus datos en dos y no hay forma de reunirlos.
- El `[t]` que la precede aporta dos cosas automáticamente: la **sección del temario**
  (`tocSection`, que ancla cada pregunta al bloque) y, si el título nombra una semana
  (`SEMANA 3`), la **fecha planeada** de la lección (SPEC-13/14).

#### Antes de dar por hecha la lección

1. Imágenes locales: tienen que existir en `classnotesapp/src/assets/` y se referencian
   **solo por nombre de archivo**, sin ruta. No se descargan, van en el bundle.
2. Push a **los dos remotos**. `raw.githubusercontent.com` sirve desde `second`: pushear
   solo a `origin` no cambia nada de lo que ve un estudiante.
3. Si cambiaste algo a mitad de semestre —moviste la lección de semana, la reescribiste,
   añadiste una nueva—, anótalo en `analitics/schedule.md` § 4.3. Sin eso, el análisis
   ve el temario final y supone que siempre fue así.

### BeanVisualizer

Located in `src/components/BeanVisualizer/`. It is an interactive canvas tool that parses Java Spring bean annotations or XML bean definitions and renders a dependency graph. It uses `src/components/BeanVisualizer/regex/` modules for detection and `src/components/BeanVisualizer/model/buildBeanGraph.js` to produce the graph model.

### Routing

Routes are `/{base}/lesson/:lessonId`. Since SPEC-12, `lessonId` is the stable id authored as the third field of each `[lesson:url]` entry in `toc.md`, not a positional counter — `TableOfContentsParser` still falls back to the ordinal for entries that lack one, and `LessonPage` resolves old ordinal links so shared URLs keep working.

**Base path — don't trust `vite.config.js`.** Its `/compu2/` default only applies to `npm run dev`. In production the base comes from `.github/workflows/deploy-pages.yml`, which derives it from the repo name (`/${{ github.event.repository.name }}/`) and then patches `dist/404.html` with a `sed` so deep links resolve against it.

Because both remotes run that same workflow, each publishes its own site under its own name, and both work:

- **https://domicianorincon.github.io/Computacion2/** — the one to use. It matches the repo the app fetches content from.
- https://domiciano.github.io/Compunet2-252/ — a working mirror, but stale content: the app still fetches `toc.md` and lessons from `DomicianoRincon/Computacion2`.

Until 2026-07-26 the workflow hardcoded `/Computacion2/`, which made the `origin` copy serve HTML pointing at asset paths that don't exist on `domiciano.github.io` — 200 on the page, 404 on every asset, blank screen. If you ever hardcode the base again, that breakage comes back.

Deep-link support for GitHub Pages is handled via `public/404.html` and a `?p=` query parameter redirect in `App.jsx`.

### Vista de administrador (`/admin`)

`src/admin/` cruza la **lista de clase** que entrega la universidad (`students/262.md`:
una línea por estudiante, `código nombre completo`, sin encabezado — el parser también
acepta la tabla GFM de dos columnas que se usaba antes) con los perfiles de Firestore,
para responder quién ya entró al visor,
con qué correo y con qué usuario de GitHub, y **quién falta**. Un botón exporta todo a
un `.md`. Se llega desde el menú de cuenta → *Estudiantes*.

La llave es el custom claim `profesor: true` — el mismo que ya exigían las reglas de
Firestore, no `profile.role`, que lo escribe el propio usuario en el formulario. Sin el
claim la pantalla lo dice en vez de fallar en silencio (`firestore/README.md`), y la
opción del menú ni siquiera aparece. **Ya está asignado** (2026-07-30) a la cuenta del
profesor, y solo a ella: es la única cuenta del proyecto con custom claims.

**La lista de clase se guarda en `rosters/{courseId}-{semestre}` de Firestore, no en el
repo ni en el bundle**, y es lo único que el profesor escribe en toda la base. La razón
es que el sitio es público: un `import` del `.md` serviría 27 nombres y códigos dentro
del JS de GitHub Pages, y un `raw.githubusercontent...` los dejaría abiertos a
cualquiera. La sube el profesor una vez desde la propia vista (*Cargar lista (.md)*).

**Una lista por semestre.** El curso se repite cada periodo con otra gente, así que el
documento lleva el semestre en el id (`rosters/compunet2-262`) y las listas viejas se
conservan. El semestre **sale del nombre del archivo** que se carga (`262.md` → `262`,
`parseTermFromFileName`): sin él la carga se rechaza, porque adivinarlo pisaría la lista
de otro periodo. La vista abre el semestre más reciente y trae un selector para los
anteriores; el título dice cuál se está mirando.

Por lo mismo, **`students/` no debe commitearse** a ninguno de los dos remotos: los dos
son repos públicos.

**Panel de actividad por estudiante.** Pulsar un renglón —o el botón de la última
columna, que es el camino por teclado— abre un `Drawer` con lo que ha hecho esa persona,
día a día: los **últimos 7 días** arriba y **todo el semestre** debajo, con una barra de
minutos activos por día en cada bloque. Cuatro grupos: constancia (minutos, días activos,
racha, `regularityEntropy` de H1), al día con el temario (`scheduleLagDays` y su
cobertura), profundidad de lectura (lecciones, scroll, marcadas) y práctica + asistente.

Tres cosas que no se pueden romper al tocarlo:

- **El tiempo sale solo de `lesson_dwell`.** `session_end` trae el acumulado de la sesión
  entera, que ya incluye el de las lecciones: sumar los dos duplica, y además su `ts`
  puede caer en otro día.
- **`null` no se pinta como `0`.** Sin un solo evento el panel dice "no dio consentimiento
  o no ha entrado" en vez de dibujar ceros, que al lado del nombre de una persona serían
  una acusación falsa.
- **Retraso medio y cobertura van juntos.** El primero solo promedia lo que abrió: quien
  abrió únicamente la lección 1 el día que tocaba tiene retraso 0 y ha visto el 4 %.

Solo abre para el semestre en curso (`courseTerm` de `content/config.js`), porque la
ventana "desde el inicio" se mide contra `courseStartDate`, que es el de ese semestre.

Los módulos son puros y están probados aparte: `rosterParser.js` (archivo →
entradas), `matchRoster.js` (el cruce), `rosterExport.js` (el `.md` de salida),
`activityCalendar.js` (días, husos y fechas planeadas) y `studentActivity.js` (todos los
indicadores, en una pasada). `adminData.js` aísla las lecturas de Firestore y
`courseSchedule.js` el único `fetch`.

**El cruce son cuatro pasadas**, de la señal más fuerte a la más débil, y cada una
solo mira lo que dejó libre la anterior: `codigo` (idéntico), `nombre` (completo),
`codigo-typo` (el código del perfil está a un carácter del de la lista) y
`nombre-parcial` (el nombre del perfil es parte del de la lista). Las dos últimas
existen porque el formulario lo llena el estudiante y se equivoca de dos formas muy
repetidas: teclea mal un dígito, o escribe su nombre corto donde la universidad lo
tiene completo — y entonces aparece a la vez como ausente arriba y como desconocido en
*Fuera de la lista*. Al ser heurísticas, **solo se aplican cuando la respuesta es única
en los dos sentidos** (esa fila no admite otro perfil libre y ese perfil no admite otra
fila); con un "Juan Pablo" suelto —hay dos en la lista— no se adivina. Toda fila que no
casó por código exacto se marca *Revisar código*, y el tooltip dice por cuál de las
cuatro pasadas entró.

### Theme

`ThemeContext.jsx` provides a dark/light theme toggle. Custom color tokens are in `src/theme/colors.js`. The default mode is `dark`.

### Path Alias

`@/` maps to `src/` (configured in `vite.config.js`).
