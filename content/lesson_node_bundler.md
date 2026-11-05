# Qué cambia con Node

<!-- tags: Node.js, npm, bundler, Vite, npm run build, carpeta dist, node_modules, package.json, runtime, document is not defined, módulos ES -->

Con un HTML y un JS se llega lejos, pero una aplicación grande necesita más: dividir el código en muchos archivos, usar librerías de otros, escribir en sintaxis que el navegador no entiende (como JSX) y aun así entregarle al usuario algo que su navegador pueda abrir. Para eso aparece **Node**.

## Desarrollo y producción

Trabajamos en dos mundos. En **desarrollo** el proyecto está bien organizado: muchos módulos, un componente por archivo, librerías en `node_modules`. En **producción** el usuario recibe otra cosa: tres archivos estáticos. El que pasa de uno al otro es el **bundler**.

```svg
<svg id="nodeDevDist" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 560" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="nodeDevDist-ttl nodeDevDist-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="nodeDevDist-ttl">Lo que escribes no es lo que se publica</title>
  <desc id="nodeDevDist-dsc">A la izquierda el proyecto de desarrollo: src con main.jsx, App.jsx, App.css y components/Header.jsx, node_modules con react, react-dom y cientos de paquetes más, package.json, index.html y vite.config.js. En el centro Vite, que corre con npm run build. A la derecha la carpeta dist con index.html y, en assets, un solo archivo JavaScript y un solo archivo CSS.</desc>
  <defs>
    <style>
      #nodeDevDist .title{fill:#161A26;font-size:22px;font-weight:700}
      #nodeDevDist .sub{fill:#79809A;font-size:13.5px}
      #nodeDevDist .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #nodeDevDist .foot{fill:#79809A;font-size:12px}
      #nodeDevDist .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #nodeDevDist .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#nodeDevDist-ar-violet)}
    </style>
    <marker id="nodeDevDist-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
  </defs>
  <rect width="960" height="560" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Lo que escribes no es lo que se publica</text>
  <text class="sub" x="48" y="80" data-fit="860">El proyecto de desarrollo es grande y ordenado. El bundler lo reduce a tres archivos que el navegador entiende.</text>
  <rect x="48" y="112" width="360" height="380" rx="14" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.75"/><text class="h" x="68" y="140" fill="#4453C9">DESARROLLO · LO QUE ESCRIBES</text>
  <path d="M72,165 h7 l3,3 h10 v12 h-20 Z" fill="#EFF1F5" stroke="#556074" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="100" y="172" dy="0.35em" font-size="13" font-weight="700" fill="#161A26">mi-app/</text>
  <path d="M82,181 V196 H90" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M94,189 h7 l3,3 h10 v12 h-20 Z" fill="#EEF1FF" stroke="#4453C9" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="122" y="196" dy="0.35em" font-size="13" font-weight="700" fill="#4453C9">src/</text>
  <path d="M104,205 V220 H112" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M118,212 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="144" y="220" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">main.jsx</text>
  <path d="M104,205 V244 H112" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M118,236 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="144" y="244" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">App.jsx</text>
  <path d="M104,205 V268 H112" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M118,260 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="144" y="268" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">App.css</text>
  <path d="M104,205 V292 H112" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M116,285 h7 l3,3 h10 v12 h-20 Z" fill="#EEF1FF" stroke="#4453C9" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="144" y="292" dy="0.35em" font-size="13" font-weight="700" fill="#4453C9">components/</text>
  <path d="M126,301 V316 H134" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M140,308 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="166" y="316" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">Header.jsx</text>
  <path d="M82,181 V340 H90" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M94,333 h7 l3,3 h10 v12 h-20 Z" fill="#FFF3DC" stroke="#A96C05" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="122" y="340" dy="0.35em" font-size="13" font-weight="700" fill="#A96C05">node_modules/</text>
  <path d="M104,349 V364 H112" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M116,357 h7 l3,3 h10 v12 h-20 Z" fill="#FFF3DC" stroke="#A96C05" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="144" y="364" dy="0.35em" font-size="13" font-weight="700" fill="#A96C05">react/</text>
  <path d="M104,349 V388 H112" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M116,381 h7 l3,3 h10 v12 h-20 Z" fill="#FFF3DC" stroke="#A96C05" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="144" y="388" dy="0.35em" font-size="13" font-weight="700" fill="#A96C05">react-dom/</text>
  <path d="M104,349 V412 H112" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M118,404 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="144" y="412" dy="0.35em" font-size="13" font-weight="400" fill="#9AA3B5">… cientos más</text>
  <path d="M82,181 V436 H90" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M96,428 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="122" y="436" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">package.json</text>
  <text x="68" y="474" font-size="12" fill="#454C61" data-fit="320">JSX, módulos, librerías: el navegador no lo entiende así</text>
  <rect x="436" y="232" width="120" height="104" rx="14" fill="#7439B8"/><text x="496" y="268" dy="0.35em" text-anchor="middle" font-size="18" font-weight="700" fill="#FFFFFF">Vite</text><text x="496" y="290" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#F4EBFF">bundler</text><text class="mono" x="496" y="356" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#7439B8" font-weight="700">npm run build</text>
  <path class="ar-violet" d="M410,284 H430"/><path class="ar-violet" d="M558,284 H578"/>
  <rect x="584" y="112" width="328" height="380" rx="14" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.75"/><text class="h" x="604" y="140" fill="#3A8235">PRODUCCIÓN · DIST/</text>
  <path d="M608,165 h7 l3,3 h10 v12 h-20 Z" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="636" y="172" dy="0.35em" font-size="13" font-weight="700" fill="#3A8235">dist/</text>
  <path d="M618,181 V196 H626" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M632,188 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="658" y="196" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">index.html</text>
  <path d="M618,181 V220 H626" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M630,213 h7 l3,3 h10 v12 h-20 Z" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="658" y="220" dy="0.35em" font-size="13" font-weight="700" fill="#3A8235">assets/</text>
  <path d="M640,229 V244 H648" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M654,236 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="680" y="244" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">index-B7xQ2k.js</text>
  <path d="M640,229 V268 H648" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M654,260 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="680" y="268" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">index-D4e5F6.css</text>
  <rect x="612" y="328" width="84" height="56" rx="10" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.75"/><text x="654" y="356" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="#556074">HTML</text>
  <rect x="708" y="328" width="84" height="56" rx="10" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.75"/><text x="750" y="356" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="#4453C9">JS</text>
  <rect x="804" y="328" width="84" height="56" rx="10" fill="#FFFFFF" stroke="#F3A3B2" stroke-width="1.75"/><text x="846" y="356" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="#C2354F">CSS</text>
  <text x="604" y="410" font-size="12" fill="#454C61" data-fit="290">Archivos estáticos: cualquier navegador</text>
  <text x="604" y="428" font-size="12" fill="#454C61" data-fit="290">los ejecuta tal cual, sin Node.</text>
  <text class="foot" x="48" y="532" data-fit="860">Node y Vite solo existen en tu máquina. El usuario recibe dist/: nunca ve tu JSX ni node_modules.</text>
</svg>
```

## Qué hace el bundler

Usaremos **Vite**. Con `npm run build` parte de `index.html`, sigue cada `import`, transforma el JSX en JavaScript y junta todo. Avanza paso a paso:

```interactive
bundler
```

Durante el desarrollo no hace falta el build: `npm run dev` levanta un servidor que hace esa transformación al vuelo y recarga la página cada vez que guardas.

## Librerías con npm

Node trae **npm**, el gestor de paquetes. En `package.json` se declara qué librerías usa el proyecto, y `npm install` las descarga. Así llega **React**: es una librería más, la más usada de la industria para construir interfaces, y sin Node y npm no tendríamos cómo instalarla ni empaquetarla.

```svg
<svg id="nodeNpm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 500" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="nodeNpm-ttl nodeNpm-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="nodeNpm-ttl">npm: las librerías se declaran y se descargan</title>
  <desc id="nodeNpm-dsc">A la izquierda package.json con sus dependencias: react, react-dom, @mui/material y axios. Una flecha con el comando npm install lleva a node_modules, que tiene una carpeta por librería más las dependencias de cada una. Abajo, App.jsx importa useState desde react.</desc>
  <defs>
    <style>
      #nodeNpm .title{fill:#161A26;font-size:22px;font-weight:700}
      #nodeNpm .sub{fill:#79809A;font-size:13.5px}
      #nodeNpm .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #nodeNpm .foot{fill:#79809A;font-size:12px}
      #nodeNpm .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #nodeNpm .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#nodeNpm-ar-amber)}
    </style>
    <marker id="nodeNpm-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
  </defs>
  <rect width="960" height="500" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">npm: las librerías se declaran y se descargan</text>
  <text class="sub" x="48" y="80" data-fit="860">package.json dice qué necesita el proyecto. npm install lo trae a node_modules.</text>
  <rect x="48" y="112" width="360" height="292" rx="10" fill="#1F2430"/>
  <path d="M48,122 A10,10 0 0 1 58,112 H398 A10,10 0 0 1 408,122 V138 H48 Z" fill="#2A3040"/>
  <text class="mono" x="60" y="125" dy="0.35em" font-size="11.5" fill="#9AA3B5">package.json</text><rect x="52.0" y="279" width="352.0" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><rect x="52.0" y="298" width="352.0" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><rect x="52.0" y="317" width="352.0" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><rect x="52.0" y="336" width="352.0" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="60.0" y="160" font-size="11.5" fill="#E6EAF2" textLength="6.9" lengthAdjust="spacingAndGlyphs">{</text><text class="mono" x="73.8" y="179" font-size="11.5" fill="#E6EAF2" textLength="117.3" lengthAdjust="spacingAndGlyphs">&quot;name&quot;: &quot;mi-app&quot;,</text><text class="mono" x="73.8" y="198" font-size="11.5" fill="#E6EAF2" textLength="82.8" lengthAdjust="spacingAndGlyphs">&quot;scripts&quot;: {</text><text class="mono" x="87.6" y="217" font-size="11.5" fill="#E6EAF2" textLength="96.6" lengthAdjust="spacingAndGlyphs">&quot;dev&quot;: &quot;vite&quot;,</text><text class="mono" x="87.6" y="236" font-size="11.5" fill="#E6EAF2" textLength="144.9" lengthAdjust="spacingAndGlyphs">&quot;build&quot;: &quot;vite build&quot;</text><text class="mono" x="73.8" y="255" font-size="11.5" fill="#E6EAF2" textLength="13.8" lengthAdjust="spacingAndGlyphs">},</text><text class="mono" x="73.8" y="274" font-size="11.5" fill="#E6EAF2" textLength="117.3" lengthAdjust="spacingAndGlyphs">&quot;dependencies&quot;: {</text><text class="mono" x="87.6" y="293" font-size="11.5" fill="#E6EAF2" textLength="131.1" lengthAdjust="spacingAndGlyphs">&quot;react&quot;: &quot;^19.2.0&quot;,</text><text class="mono" x="87.6" y="312" font-size="11.5" fill="#E6EAF2" textLength="158.7" lengthAdjust="spacingAndGlyphs">&quot;react-dom&quot;: &quot;^19.2.0&quot;,</text><text class="mono" x="87.6" y="331" font-size="11.5" fill="#E6EAF2" textLength="179.4" lengthAdjust="spacingAndGlyphs">&quot;@mui/material&quot;: &quot;^7.3.0&quot;,</text><text class="mono" x="87.6" y="350" font-size="11.5" fill="#E6EAF2" textLength="124.2" lengthAdjust="spacingAndGlyphs">&quot;axios&quot;: &quot;^1.13.0&quot;</text><text class="mono" x="73.8" y="369" font-size="11.5" fill="#E6EAF2" textLength="6.9" lengthAdjust="spacingAndGlyphs">}</text><text class="mono" x="60.0" y="388" font-size="11.5" fill="#E6EAF2" textLength="6.9" lengthAdjust="spacingAndGlyphs">}</text>
  <path class="ar-amber" d="M412,230 H548"/>
  <rect x="434.1" y="202" width="91.9" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="480" y="212" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">npm install</text>
  <rect x="560" y="112" width="352" height="200" rx="14" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/><text class="h" x="580" y="140" fill="#A96C05">NODE_MODULES/</text>
  <rect x="580" y="158" width="152" height="40" rx="9" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.5"/><path d="M594,171 h7 l3,3 h10 v12 h-20 Z" fill="#FFF3DC" stroke="#A96C05" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="622" y="178" dy="0.35em" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="104">react</text>
  <rect x="744" y="158" width="152" height="40" rx="9" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.5"/><path d="M758,171 h7 l3,3 h10 v12 h-20 Z" fill="#FFF3DC" stroke="#A96C05" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="786" y="178" dy="0.35em" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="104">react-dom</text>
  <rect x="580" y="210" width="152" height="40" rx="9" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.5"/><path d="M594,223 h7 l3,3 h10 v12 h-20 Z" fill="#FFF3DC" stroke="#A96C05" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="622" y="230" dy="0.35em" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="104">@mui/material</text>
  <rect x="744" y="210" width="152" height="40" rx="9" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.5"/><path d="M758,223 h7 l3,3 h10 v12 h-20 Z" fill="#FFF3DC" stroke="#A96C05" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="786" y="230" dy="0.35em" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="104">axios</text>
  <text x="580" y="290" font-size="12" fill="#454C61" data-fit="320">+ las librerías de las que dependen ellas</text>
  <text x="48" y="440" font-size="13" fill="#454C61">Y en tu código:</text><text class="mono" x="156" y="440" font-size="13" fill="#161A26" font-weight="700">import { useState } from 'react';</text>
  <text class="foot" x="48" y="472" data-fit="860">node_modules no se sube a git: se vuelve a crear con npm install a partir de package.json.</text>
</svg>
```

## Runtimes

Un **runtime** es el programa que ejecuta tu JavaScript. El navegador es uno: tiene `document` y `window`, pero no puede leer archivos de tu disco. **Node es otro**: corre en una máquina, sin navegador, y puede leer archivos, abrir puertos y responder peticiones HTTP.

```svg
<svg id="nodeRuntimes" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 500" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="nodeRuntimes-ttl nodeRuntimes-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="nodeRuntimes-ttl">Dos runtimes para el mismo JavaScript</title>
  <desc id="nodeRuntimes-dsc">Dos filas. Arriba, en el navegador: el proyecto React pasa por Vite con npm run build, sale la carpeta dist, se publica en un servidor web y el navegador del usuario la ejecuta con su motor V8; ahí existen document, window y localStorage. Abajo, en Node: el archivo server.js se ejecuta directo con node server.js, sin bundler, en el motor V8 de Node, que escucha en el puerto 3000 y responde peticiones HTTP; ahí existen fs, http y process, pero no document.</desc>
  <defs>
    <style>
      #nodeRuntimes .title{fill:#161A26;font-size:22px;font-weight:700}
      #nodeRuntimes .sub{fill:#79809A;font-size:13.5px}
      #nodeRuntimes .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #nodeRuntimes .foot{fill:#79809A;font-size:12px}
      #nodeRuntimes .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #nodeRuntimes .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#nodeRuntimes-ar-indigo)}
      #nodeRuntimes .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#nodeRuntimes-ar-teal)}
    </style>
    <marker id="nodeRuntimes-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
    <marker id="nodeRuntimes-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
  </defs>
  <rect width="960" height="500" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Dos runtimes para el mismo JavaScript</text>
  <text class="sub" x="48" y="80" data-fit="860">Un runtime es el programa que ejecuta tu JS. El navegador es uno; Node es otro.</text>
  <text class="h" x="48" y="132" fill="#4453C9">EN EL NAVEGADOR · EL FRONTEND</text>
  <rect x="48" y="148" width="180" height="72" rx="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.75"/><text x="138" y="174" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#4453C9" data-fit="164">Proyecto React</text><text class="mono" x="138" y="198" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#454C61" data-fit="164">src/ · JSX</text>
  <rect x="276" y="148" width="180" height="72" rx="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/><text x="366" y="174" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#7439B8" data-fit="164">Vite</text><text class="mono" x="366" y="198" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#454C61" data-fit="164">npm run build</text>
  <rect x="504" y="148" width="180" height="72" rx="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.75"/><text x="594" y="174" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#3A8235" data-fit="164">dist/</text><text class="mono" x="594" y="198" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#454C61" data-fit="164">HTML · JS · CSS</text>
  <rect x="732" y="148" width="180" height="72" rx="12" fill="#4453C9" stroke="#A9B4F2" stroke-width="1.75"/><text x="822" y="174" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF" data-fit="164">Navegador</text><text class="mono" x="822" y="198" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#FFFFFF" data-fit="164">motor V8 de Chrome</text>
  <path class="ar-indigo" d="M232,184.0 H272"/>
  <path class="ar-indigo" d="M460,184.0 H500"/>
  <path class="ar-indigo" d="M688,184.0 H728"/>
  <text x="732" y="244" font-size="12" fill="#454C61">Tiene:</text>
  <rect x="776" y="232" width="78" height="22" rx="11" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/><text class="mono" x="815" y="243" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#4453C9" font-weight="700">document</text>
  <rect x="862" y="232" width="63" height="22" rx="11" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/><text class="mono" x="893" y="243" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#4453C9" font-weight="700">window</text>
  <text class="h" x="48" y="308" fill="#0F8478">EN NODE · EL BACKEND · SIN BUNDLER</text>
  <rect x="48" y="324" width="180" height="72" rx="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.75"/><text x="138" y="350" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#0F8478" data-fit="164">server.js</text><text class="mono" x="138" y="374" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#454C61" data-fit="164">JavaScript</text>
  <rect x="276" y="324" width="180" height="72" rx="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.75"/><text x="366" y="350" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#556074" data-fit="164">Terminal</text><text class="mono" x="366" y="374" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#454C61" data-fit="164">node server.js</text>
  <rect x="504" y="324" width="180" height="72" rx="12" fill="#0F8478" stroke="#86D3CA" stroke-width="1.75"/><text x="594" y="350" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF" data-fit="164">Node.js</text><text class="mono" x="594" y="374" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#FFFFFF" data-fit="164">motor V8, sin navegador</text>
  <rect x="732" y="324" width="180" height="72" rx="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/><text x="822" y="350" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#A96C05" data-fit="164">Responde HTTP</text><text class="mono" x="822" y="374" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#454C61" data-fit="164">localhost:3000</text>
  <path class="ar-teal" d="M232,360.0 H272"/>
  <path class="ar-teal" d="M460,360.0 H500"/>
  <path class="ar-teal" d="M688,360.0 H728"/>
  <text x="504" y="420" font-size="12" fill="#454C61">Tiene:</text>
  <rect x="548" y="408" width="34" height="22" rx="11" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/><text class="mono" x="565" y="419" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#0F8478" font-weight="700">fs</text>
  <rect x="590" y="408" width="49" height="22" rx="11" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/><text class="mono" x="615" y="419" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#0F8478" font-weight="700">http</text>
  <rect x="647" y="408" width="70" height="22" rx="11" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/><text class="mono" x="682" y="419" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#0F8478" font-weight="700">process</text>
  <rect x="726" y="408" width="78" height="22" rx="11" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/><text class="mono" x="764" y="419" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#9AA3B5" font-weight="700" text-decoration="line-through">document</text>
  <text class="foot" x="48" y="472" data-fit="860">Con Node, JavaScript también sirve para backends: lo mismo que hicieron con Spring, en otro lenguaje.</text>
</svg>
```

De ahí salen las dos rutas. Una app de React tiene que pasar por el bundler, porque quien la ejecuta al final es el navegador del usuario. Un servidor escrito en JS no: Node lo ejecuta tal cual con `node server.js`. Por eso con JavaScript también se hacen backends, igual que los que hicieron con Spring.

```js
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.end(JSON.stringify({ mensaje: 'Hola desde Node' }));
});

server.listen(3000);
```

Si en un archivo de Node escribes `document.getElementById(...)`, el error es `ReferenceError: document is not defined`: en ese runtime no hay página.
