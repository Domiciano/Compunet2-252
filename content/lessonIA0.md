# LLMs, Agentes y MCP Servers

<!-- tags: LLM, agente en consola, tool system, skills, MCP, Model Context Protocol, SKILL.md, loop del agente, Playwright MCP, Stitch MCP, el agente no ve mis archivos, mcp.json -->

Un LLM es un modelo entrenado con muchísimo texto que predice, palabra a palabra, lo que sigue. Por sí solo no lee tus archivos ni ejecuta nada. Un agente como Claude Code, Gemini CLI u OpenCode lo envuelve con un **tool system**, y eso es lo que le permite trabajar en tu proyecto.

## El agente en consola

```svg
<svg id="iaAgente" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 400" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="iaAgente-ttl iaAgente-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="iaAgente-ttl">Un agente en consola es un LLM con un tool system</title>
  <desc id="iaAgente-dsc">A la izquierda el LLM, que predice texto. En el centro, en un recuadro punteado, el tool system con cuatro tools: read para leer archivos, grep para buscar en el código, edit para editar archivos y bash para ejecutar comandos. A la derecha tu proyecto, con sus archivos y su terminal. El LLM pide una tool, el tool system la ejecuta sobre el proyecto y le devuelve el resultado; el ciclo se repite hasta que el LLM responde.</desc>
  <defs>
    <style>
      #iaAgente .title{fill:#161A26;font-size:22px;font-weight:700}
      #iaAgente .sub{fill:#79809A;font-size:13.5px}
      #iaAgente .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #iaAgente .foot{fill:#79809A;font-size:12px}
      #iaAgente .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #iaAgente .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#iaAgente-ar-violet)}
      #iaAgente .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#iaAgente-ar-green)}
      #iaAgente .ar-slate{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#iaAgente-ar-slate)}
    </style>
    <marker id="iaAgente-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
    <marker id="iaAgente-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
    <marker id="iaAgente-ar-slate" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/></marker>
  </defs>
  <rect width="960" height="400" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Un agente en consola es un LLM con un tool system</text>
  <text class="sub" x="48" y="80" data-fit="860">El LLM solo produce texto. El tool system es el que lee, busca, edita y ejecuta en tu proyecto.</text>
  <rect x="48" y="160" width="208" height="112" rx="14" fill="#7439B8"/><text x="152" y="204" dy="0.35em" text-anchor="middle" font-size="24" font-weight="700" fill="#FFFFFF">LLM</text><text x="152" y="236" dy="0.35em" text-anchor="middle" font-size="12.5" fill="#F4EBFF">predice el siguiente texto</text>
  <rect x="356" y="112" width="248" height="232" rx="14" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.75" stroke-dasharray="6 5"/><text class="h" x="480" y="138" text-anchor="middle" fill="#4453C9">TOOL SYSTEM</text>
  <rect x="376" y="154" width="208" height="36" rx="9" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="172" dy="0.35em" font-size="13.5" font-weight="700" fill="#4453C9">read</text><text x="568" y="172" dy="0.35em" text-anchor="end" font-size="12.5" fill="#454C61">Leer archivos</text>
  <rect x="376" y="200" width="208" height="36" rx="9" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="218" dy="0.35em" font-size="13.5" font-weight="700" fill="#4453C9">grep</text><text x="568" y="218" dy="0.35em" text-anchor="end" font-size="12.5" fill="#454C61">Buscar en el código</text>
  <rect x="376" y="246" width="208" height="36" rx="9" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="264" dy="0.35em" font-size="13.5" font-weight="700" fill="#4453C9">edit</text><text x="568" y="264" dy="0.35em" text-anchor="end" font-size="12.5" fill="#454C61">Editar archivos</text>
  <rect x="376" y="292" width="208" height="36" rx="9" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="310" dy="0.35em" font-size="13.5" font-weight="700" fill="#4453C9">bash</text><text x="568" y="310" dy="0.35em" text-anchor="end" font-size="12.5" fill="#454C61">Ejecutar comandos</text>
  <path d="M712,176 a8,8 0 0 1 8,-8 h52 l12,14 h112 a8,8 0 0 1 8,8 v86 a8,8 0 0 1 -8,8 h-176 a8,8 0 0 1 -8,-8 Z" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.75"/><text x="808" y="218" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="#0F8478">Tu proyecto</text><text x="808" y="242" dy="0.35em" text-anchor="middle" font-size="12.5" fill="#454C61">archivos y terminal</text>
  <path class="ar-violet" d="M260,196 H350"/><path class="ar-green" d="M350,240 H260"/>
  <rect x="259.2" y="168" width="91.6" height="20" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="305" y="178" dy="0.35em" text-anchor="middle" font-size="10.5" font-weight="700" fill="#7439B8">pide read(…)</text>
  <text x="305" y="262" text-anchor="middle" font-size="12" font-weight="600" fill="#3A8235">resultado</text>
  <path class="ar-slate" d="M608,212 H704"/><path class="ar-slate" d="M704,236 H608"/>
  <text x="656" y="200" text-anchor="middle" font-size="12" fill="#79809A">ejecuta</text>
  <text class="foot" x="48" y="372" data-fit="860">Pedir una tool y recibir el resultado se repite las veces que haga falta. Cuando ya sabe lo suficiente, el LLM responde.</text>
</svg>
```

El agente le describe cada tool al LLM con un nombre, una descripción y sus parámetros:

```json
{
  "name": "read",
  "description": "Lee un archivo del proyecto",
  "parameters": {
    "file_path": { "type": "string" }
  }
}
```

El LLM contesta con texto o con una llamada a una tool. El tool system la ejecuta y le devuelve el resultado, y el ciclo sigue hasta que el LLM puede responder. Ese ciclo es el **loop del agente**.

## Skills y servidores MCP

```interactive
agent-stack
```

Los dos extienden al agente, pero cada uno de una forma distinta.

### Skills

Una skill es una **descripción metodológica**: los pasos para hacer bien una tarea que se repite, como escribir una spec o diseñar una base de datos. Vive en una carpeta con un `SKILL.md`, y puede traer `references/` con lo que el agente consulta y `scripts/` con lo que ejecuta.

De entrada, el agente solo lee el `name` y la `description` de cada skill. Carga el `SKILL.md` completo cuando tu pedido coincide con ella. La skill no agrega tools: el agente la sigue con las mismas tools de siempre. En las lecciones siguientes se construye una, `spec-writer`.

### Servidores MCP

MCP (*Model Context Protocol*) es un estándar abierto para conectar un agente con sistemas externos. Un **servidor MCP** publica una lista de tools, y el agente las suma a su catálogo. El LLM las llama igual que a las nativas, y el servidor hace el trabajo afuera:

- **Stitch** es un servidor remoto: corre en la nube y el agente le habla por HTTP. Genera diseños de pantallas.
- **Playwright** es un servidor local: el agente lo arranca en tu equipo y le habla por stdio. Controla un navegador Chromium.

En Claude Code se declaran en el archivo `.mcp.json`, en la raíz del proyecto:

```json
{
  "mcpServers": {
    "stitch": {
      "type": "http",
      "url": "https://stitch.googleapis.com/mcp",
      "headers": { "X-Goog-Api-Key": "TU_API_KEY" }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

La clave de Stitch es tuya: no subas ese archivo con la clave escrita.
