# Skills en Antigravity CLI

<!-- tags: skill, SKILL.md, .agents/skills, Antigravity CLI, agy, spec-writer, api-creator, api-tester, la skill no se carga, apidev.md, pruebas con curl, references y assets -->

Una skill le enseña al agente a hacer bien una tarea que se repite: los pasos, las reglas y los archivos de apoyo. En esta lección instalas tres en el proyecto del curso, **262WebApp6**, y las usas con Antigravity CLI para escribir una spec, construir la API y probarla.

## Antes de empezar

- Antigravity CLI instalado: `agy --version` responde.
- El proyecto clonado y abierto:

```shell
git clone https://github.com/Domiciano/262WebApp6
cd 262WebApp6
```

## La estructura de carpetas

```svg
<svg id="iaSkillsCarpetas" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 794" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="iaSkillsCarpetas-ttl iaSkillsCarpetas-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="iaSkillsCarpetas-ttl">Las skills viven dentro del proyecto</title>
  <desc id="iaSkillsCarpetas-dsc">Árbol de carpetas de 262WebApp6. Dentro de .agents/skills hay tres carpetas. spec-writer tiene SKILL.md y references/plantilla.md. api-creator tiene SKILL.md y references con convenciones.md y manifiesto.md. api-tester tiene SKILL.md, assets con ejemplo.sh y test.sh, y references/casos.md. Al lado de .agents siguen src y pom.xml.</desc>
  <defs>
    <style>
      #iaSkillsCarpetas .title{fill:#161A26;font-size:22px;font-weight:700}
      #iaSkillsCarpetas .sub{fill:#79809A;font-size:13.5px}
      #iaSkillsCarpetas .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #iaSkillsCarpetas .foot{fill:#79809A;font-size:12px}
      #iaSkillsCarpetas .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
    </style>
  </defs>
  <rect width="960" height="794" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Las skills viven dentro del proyecto</text>
  <text class="sub" x="48" y="80" data-fit="860">Una carpeta por skill en .agents/skills/. El nombre de la carpeta es el nombre de la skill.</text>
  <path d="M64,117 h7 l3,3 h10 v12 h-20 Z" fill="#EFF1F5" stroke="#556074" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="92" y="124" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26">262WebApp6/</text>
  <path d="M74,133 V154 H86" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M90,147 h7 l3,3 h10 v12 h-20 Z" fill="#EFF1F5" stroke="#556074" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="118" y="154" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26">.agents/</text>
  <path d="M100,163 V184 H112" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M116,177 h7 l3,3 h10 v12 h-20 Z" fill="#EFF1F5" stroke="#556074" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="144" y="184" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26">skills/</text>
  <path d="M126,193 V214 H138" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M142,207 h7 l3,3 h10 v12 h-20 Z" fill="#F4EBFF" stroke="#7439B8" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="170" y="214" dy="0.35em" font-size="13.5" font-weight="700" fill="#7439B8">spec-writer/</text>
  <path d="M277.2,214 H560" fill="none" stroke="#C9A6EE" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="560" y="197" width="352" height="34" rx="9" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="576" y="214" dy="0.35em" font-size="13" fill="#454C61" data-fit="320"><tspan font-weight="700" fill="#7439B8">spec-writer.</tspan> Escribe la spec antes del código.</text>
  <path d="M152,223 V244 H164" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M170,236 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="196" y="244" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26">SKILL.md</text>
  <path d="M152,223 V274 H164" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M168,267 h7 l3,3 h10 v12 h-20 Z" fill="#F4EBFF" stroke="#7439B8" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="196" y="274" dy="0.35em" font-size="13.5" font-weight="700" fill="#7439B8">references/</text>
  <path d="M178,283 V304 H190" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M196,296 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="222" y="304" dy="0.35em" font-size="13.5" font-weight="400" fill="#161A26">plantilla.md</text>
  <path d="M126,193 V334 H138" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M142,327 h7 l3,3 h10 v12 h-20 Z" fill="#E3F6F3" stroke="#0F8478" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="170" y="334" dy="0.35em" font-size="13.5" font-weight="700" fill="#0F8478">api-creator/</text>
  <path d="M277.2,334 H560" fill="none" stroke="#86D3CA" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="560" y="317" width="352" height="34" rx="9" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="576" y="334" dy="0.35em" font-size="13" fill="#454C61" data-fit="320"><tspan font-weight="700" fill="#0F8478">api-creator.</tspan> Crea endpoints con DTO y publicId.</text>
  <path d="M152,343 V364 H164" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M170,356 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="196" y="364" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26">SKILL.md</text>
  <path d="M152,343 V394 H164" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M168,387 h7 l3,3 h10 v12 h-20 Z" fill="#E3F6F3" stroke="#0F8478" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="196" y="394" dy="0.35em" font-size="13.5" font-weight="700" fill="#0F8478">references/</text>
  <path d="M178,403 V424 H190" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M196,416 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="222" y="424" dy="0.35em" font-size="13.5" font-weight="400" fill="#161A26">convenciones.md</text>
  <path d="M178,403 V454 H190" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M196,446 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="222" y="454" dy="0.35em" font-size="13.5" font-weight="400" fill="#161A26">manifiesto.md</text>
  <path d="M126,193 V484 H138" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M142,477 h7 l3,3 h10 v12 h-20 Z" fill="#FFF3DC" stroke="#A96C05" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="170" y="484" dy="0.35em" font-size="13.5" font-weight="700" fill="#A96C05">api-tester/</text>
  <path d="M269.1,484 H560" fill="none" stroke="#F0C572" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="560" y="467" width="352" height="34" rx="9" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="576" y="484" dy="0.35em" font-size="13" fill="#454C61" data-fit="320"><tspan font-weight="700" fill="#A96C05">api-tester.</tspan> Prueba la API con scripts de curl.</text>
  <path d="M152,493 V514 H164" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M170,506 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="196" y="514" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26">SKILL.md</text>
  <path d="M152,493 V544 H164" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M168,537 h7 l3,3 h10 v12 h-20 Z" fill="#FFF3DC" stroke="#A96C05" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="196" y="544" dy="0.35em" font-size="13.5" font-weight="700" fill="#A96C05">assets/</text>
  <path d="M178,553 V574 H190" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M196,566 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="222" y="574" dy="0.35em" font-size="13.5" font-weight="400" fill="#161A26">ejemplo.sh</text>
  <path d="M178,553 V604 H190" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M196,596 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="222" y="604" dy="0.35em" font-size="13.5" font-weight="400" fill="#161A26">test.sh</text>
  <path d="M152,493 V634 H164" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M168,627 h7 l3,3 h10 v12 h-20 Z" fill="#FFF3DC" stroke="#A96C05" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="196" y="634" dy="0.35em" font-size="13.5" font-weight="700" fill="#A96C05">references/</text>
  <path d="M178,643 V664 H190" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M196,656 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="222" y="664" dy="0.35em" font-size="13.5" font-weight="400" fill="#161A26">casos.md</text>
  <path d="M74,133 V694 H86" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M90,687 h7 l3,3 h10 v12 h-20 Z" fill="#EFF1F5" stroke="#556074" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="118" y="694" dy="0.35em" font-size="13.5" font-weight="700" fill="#9AA3B5">src/</text>
  <path d="M74,133 V724 H86" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M92,716 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="118" y="724" dy="0.35em" font-size="13.5" font-weight="400" fill="#9AA3B5">pom.xml</text>
  <text class="foot" x="48" y="766" data-fit="860">Solo archivos de texto: se crean a mano y se pega su contenido. La skill no instala nada.</text>
</svg>
```

Antigravity CLI busca las skills del proyecto en `.agents/skills/`. Cada skill es una carpeta, y el nombre de la carpeta tiene que ser **exactamente** el `name` de su `SKILL.md`; si no coinciden, la skill no aparece. `references/` guarda lo que el agente consulta y `assets/` lo que imita.

Crea las carpetas desde la raíz del proyecto. En macOS, Linux o Git Bash:

```shell
mkdir -p .agents/skills/spec-writer/references
mkdir -p .agents/skills/api-creator/references
mkdir -p .agents/skills/api-tester/references
mkdir -p .agents/skills/api-tester/assets
```

En PowerShell, `mkdir` también crea las carpetas intermedias: usa las mismas cuatro líneas sin `-p`.

## Las tres skills

```interactive
skill-files
```

Elige una pestaña y recorre sus archivos. Por cada uno, crea un archivo con ese nombre en esa carpeta, pulsa **Copiar** y pega el contenido. Empieza siempre por `SKILL.md`.

De cada `SKILL.md`, el agente lee al arrancar solo el `name` y la `description`. Carga el resto cuando tu pedido coincide con la description, y abre los archivos de `references/` y `assets/` cuando un paso se lo pide.

## Úsalas en orden

Cierra Antigravity CLI si estaba abierto y ábrelo de nuevo en la raíz del proyecto, para que encuentre las skills:

```shell
agy
```

Pide las cosas sin nombrar la skill: si la description está bien escrita, el agente elige la correcta.

1. **Revisa la API.** «Revisa la API y dime qué entidades no tienen endpoints». `api-creator` escribe `apidev.md` con cada entidad, sus endpoints y lo que incumple las convenciones.
2. **Especifica.** «Escribe la spec para matricular un estudiante en un curso desde la API». `spec-writer` deja la spec en `docs/specs/`, con los endpoints, sus errores y las tareas.
3. **Construye.** «Implementa la spec de la matrícula». `api-creator` crea los DTO, los mappers, el `publicId` y los endpoints, compila y anota lo que hizo en `apidevlog.md`.
4. **Prueba.** Arranca la app en otra terminal con `./mvnw spring-boot:run` y pide «Escribe y corre las pruebas de la API». `api-tester` deja un script por recurso en `tests/api/`, los corre todos con `bash test.sh` y anota en `testresults.md` la cobertura y qué pruebas pasaron y cuáles fallaron. Desde ahí, `bash test.sh` vuelve a correr la batería cuando quieras.

Los scripts de prueba son de bash. En Windows se corren desde Git Bash.

La primera batería va a fallar en los casos sin token: la API responde `302`, una redirección a la página de login, donde debería responder `401`. La prueba está bien; lo que falla es la API. Arreglarlo es justo lo que viste en «Errores 401 y 403».

## Si el agente no usa la skill

- **El nombre no coincide.** La carpeta y el `name` del `SKILL.md` deben ser iguales, en minúsculas y con guiones.
- **No reiniciaste el agente.** Las skills se buscan al abrir `agy`.
- **La description no tiene tus palabras.** Si pides «haz pruebas con curl» y la description no habla de pruebas ni de curl, el agente no la relaciona. Agrégale las palabras con las que la pides.
