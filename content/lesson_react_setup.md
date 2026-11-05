# Tu primer proyecto React

<!-- tags: instalar Node, npm create vite, npm install, npm run dev, localhost:5173, main.jsx, div id root, npm no se reconoce como comando, nvm -->

De cero a una app de React corriendo en tu navegador, en cinco pasos.

## 1. Instala Node

Descarga la versión **LTS** desde [nodejs.org](https://nodejs.org) e instálala con las opciones por defecto. Si prefieres manejar varias versiones, usa `nvm` (en Windows, `nvm-windows`). La instalación trae `node` y `npm`.

## 2. Verifica la instalación

Abre una terminal **nueva** (la que ya estaba abierta no ve el programa recién instalado) y comprueba las versiones:

```bash
node -v
npm -v
```

Si dice que `npm` no se reconoce como comando, cierra y vuelve a abrir la terminal; si sigue igual, reinstala marcando la opción de agregar Node al `PATH`.

## 3. Crea el proyecto

```bash
npm create vite@latest mi-app -- --template react
```

`mi-app` es el nombre de la carpeta que se crea. Si Vite te hace preguntas (por ejemplo, si quieres instalar y arrancar ya), responde que no y sigue con los pasos de abajo, para ver qué hace cada uno.

## 4. Instala las dependencias

```bash
cd mi-app
npm install
```

`npm install` lee `package.json` y descarga React y todo lo demás en `node_modules`.

## 5. Arranca el servidor de desarrollo

```bash
npm run dev
```

Abre `http://localhost:5173` en el navegador. Deja esa terminal abierta: mientras corre, cada vez que guardas un archivo la página se actualiza sola. Para detenerlo, `Ctrl + C`.

```svg
<svg id="setupConsola" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 644" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="setupConsola-ttl setupConsola-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="setupConsola-ttl">Del cero a la app corriendo</title>
  <desc id="setupConsola-dsc">Terminal con la secuencia completa. node -v y npm -v muestran las versiones instaladas. npm create vite@latest mi-app con la plantilla react crea el proyecto. cd mi-app entra a la carpeta, npm install descarga las dependencias y npm run dev arranca el servidor en http://localhost:5173.</desc>
  <defs>
    <style>
      #setupConsola .title{fill:#161A26;font-size:22px;font-weight:700}
      #setupConsola .sub{fill:#79809A;font-size:13.5px}
      #setupConsola .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #setupConsola .tl{font-size:13px;fill:#C9CFDA;white-space:pre}
      #setupConsola .pf{fill:#7F8AA3} #setupConsola .cmd{fill:#FFFFFF;font-weight:600}
      #setupConsola .dim{fill:#8A93A6} #setupConsola .okk{fill:#6BCB77;font-weight:600}
      #setupConsola .ring{fill:none;stroke:#F2C069;stroke-width:2}
      #setupConsola .chipc{fill:#F2C069} #setupConsola .chipt{fill:#1F2430;font-size:11.5px;font-weight:700}
      #setupConsola .ct{fill:#161A26;font-size:14px;font-weight:700}
      #setupConsola .cb{fill:#454C61;font-size:13px}
      #setupConsola .foot{fill:#79809A;font-size:12px}
    </style>
  </defs>
  <rect width="960" height="644" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Del cero a la app corriendo</text>
  <text class="sub" x="48" y="80" data-fit="860">Cuatro pasos: verificar Node, crear el proyecto, instalar dependencias y arrancar.</text>
  <rect x="48" y="112" width="864" height="476" rx="12" fill="#1F2430"/>
  <path d="M48,124 A12,12 0 0 1 60,112 H900 A12,12 0 0 1 912,124 V144 H48 Z" fill="#2A3040"/>
  <circle cx="68" cy="128" r="5" fill="#F14C4C"/><circle cx="84" cy="128" r="5" fill="#E5C07B"/><circle cx="100" cy="128" r="5" fill="#6BCB77"/>
  <text x="480" y="128" dy="0.35em" text-anchor="middle" fill="#9AA3B5" font-size="12">Terminal</text>
  <text class="tl mono" font-size="13" x="72" y="174" data-fit="816"><tspan class="pf">~&gt; </tspan><tspan class="cmd">node -v</tspan></text>
  <text class="tl mono" font-size="13" x="72" y="200" data-fit="816">v24.11.1</text>
  <text class="tl mono" font-size="13" x="72" y="226" data-fit="816"><tspan class="pf">~&gt; </tspan><tspan class="cmd">npm -v</tspan></text>
  <text class="tl mono" font-size="13" x="72" y="252" data-fit="816">11.6.2</text>
  <text class="tl mono" font-size="13" x="72" y="304" data-fit="816"><tspan class="pf">~&gt; </tspan><tspan class="cmd">npm create vite@latest mi-app <tspan letter-spacing="2">-</tspan>- <tspan letter-spacing="2">-</tspan>-template react</tspan></text>
  <text class="tl mono dim" font-size="13" x="72" y="330" data-fit="816">Scaffolding project in ~/mi-app...</text>
  <text class="tl mono okk" font-size="13" x="72" y="356" data-fit="816">Done.</text>
  <text class="tl mono" font-size="13" x="72" y="408" data-fit="816"><tspan class="pf">~&gt; </tspan><tspan class="cmd">cd mi-app</tspan></text>
  <text class="tl mono" font-size="13" x="72" y="434" data-fit="816"><tspan class="pf">mi-app&gt; </tspan><tspan class="cmd">npm install</tspan></text>
  <text class="tl mono dim" font-size="13" x="72" y="460" data-fit="816">added 152 packages in 9s</text>
  <text class="tl mono" font-size="13" x="72" y="512" data-fit="816"><tspan class="pf">mi-app&gt; </tspan><tspan class="cmd">npm run dev</tspan></text>
  <text class="tl mono" font-size="13" x="72" y="538" data-fit="816">  VITE v7.2.2  ready in 312 ms</text>
  <text class="tl mono okk" font-size="13" x="72" y="564" data-fit="816">  ➜  Local:   http://localhost:5173/</text>
  <rect class="ring" x="91.4" y="158" width="62.6" height="22" rx="5"/>
  <circle class="chipc" cx="154.0" cy="159" r="8"/>
  <text class="chipt" x="154.0" y="159" dy="0.35em" text-anchor="middle" font-size="10.5">1</text>
  <rect class="ring" x="91.4" y="288" width="398.0" height="22" rx="5"/>
  <circle class="chipc" cx="489.4" cy="289" r="8"/>
  <text class="chipt" x="489.4" y="289" dy="0.35em" text-anchor="middle" font-size="10.5">2</text>
  <rect class="ring" x="130.4" y="418" width="93.8" height="22" rx="5"/>
  <circle class="chipc" cx="224.2" cy="419" r="8"/>
  <text class="chipt" x="224.2" y="419" dy="0.35em" text-anchor="middle" font-size="10.5">3</text>
  <rect class="ring" x="130.4" y="496" width="93.8" height="22" rx="5"/>
  <circle class="chipc" cx="224.2" cy="497" r="8"/>
  <text class="chipt" x="224.2" y="497" dy="0.35em" text-anchor="middle" font-size="10.5">4</text>
  <text class="foot" x="48" y="616" data-fit="860">El servidor sigue corriendo mientras programas: cada vez que guardas, la página se actualiza sola.</text>
</svg>
```

## Qué se creó

```svg
<svg id="setupEstructura" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 554" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="setupEstructura-ttl setupEstructura-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="setupEstructura-ttl">Lo que crea Vite</title>
  <desc id="setupEstructura-dsc">Árbol de carpetas de mi-app: node_modules con las librerías, public con archivos estáticos, src con assets, App.css, App.jsx que es el componente raíz, index.css y main.jsx que conecta React con el HTML. En la raíz index.html, que tiene el div con id root, package.json con dependencias y scripts, vite.config.js y .gitignore.</desc>
  <defs>
    <style>
      #setupEstructura .title{fill:#161A26;font-size:22px;font-weight:700}
      #setupEstructura .sub{fill:#79809A;font-size:13.5px}
      #setupEstructura .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #setupEstructura .foot{fill:#79809A;font-size:12px}
      #setupEstructura .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
    </style>
  </defs>
  <rect width="960" height="554" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Lo que crea Vite</text>
  <text class="sub" x="48" y="80" data-fit="860">Una carpeta por proyecto. Lo tuyo va en src/; lo demás es configuración.</text>
  <path d="M64,117 h7 l3,3 h10 v12 h-20 Z" fill="#EFF1F5" stroke="#556074" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="92" y="124" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26">mi-app/</text>
  <path d="M74,133 V154 H86" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M90,147 h7 l3,3 h10 v12 h-20 Z" fill="#FFF3DC" stroke="#A96C05" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="118" y="154" dy="0.35em" font-size="13.5" font-weight="700" fill="#A96C05">node_modules/</text>
  <path d="M233.3,154 H520" fill="none" stroke="#F0C572" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="520" y="140" width="392" height="28" rx="9" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="536" y="154" dy="0.35em" font-size="13" fill="#454C61" data-fit="360"><tspan font-weight="700" fill="#A96C05">Las librerías.</tspan> No se tocan ni se suben a git.</text>
  <path d="M74,133 V184 H86" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M90,177 h7 l3,3 h10 v12 h-20 Z" fill="#EFF1F5" stroke="#556074" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="118" y="184" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26">public/</text>
  <path d="M184.7,184 H520" fill="none" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="520" y="170" width="392" height="28" rx="9" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="536" y="184" dy="0.35em" font-size="13" fill="#454C61" data-fit="360"><tspan font-weight="700" fill="#556074">Estáticos.</tspan> Se copian tal cual a dist/.</text>
  <path d="M74,133 V214 H86" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M90,207 h7 l3,3 h10 v12 h-20 Z" fill="#EEF1FF" stroke="#4453C9" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="118" y="214" dy="0.35em" font-size="13.5" font-weight="700" fill="#4453C9">src/</text>
  <path d="M160.4,214 H520" fill="none" stroke="#A9B4F2" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="520" y="200" width="392" height="28" rx="9" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="536" y="214" dy="0.35em" font-size="13" fill="#454C61" data-fit="360"><tspan font-weight="700" fill="#4453C9">Tu código.</tspan> Aquí trabajas casi siempre.</text>
  <path d="M100,223 V244 H112" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M116,237 h7 l3,3 h10 v12 h-20 Z" fill="#EEF1FF" stroke="#4453C9" stroke-width="1.4" stroke-linejoin="round"/><text class="mono" x="144" y="244" dy="0.35em" font-size="13.5" font-weight="700" fill="#4453C9">assets/</text>
  <path d="M100,223 V274 H112" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M118,266 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="144" y="274" dy="0.35em" font-size="13.5" font-weight="400" fill="#161A26">App.css</text>
  <path d="M100,223 V304 H112" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M118,296 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="144" y="304" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26">App.jsx</text>
  <path d="M210.7,304 H520" fill="none" stroke="#C9A6EE" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="520" y="290" width="392" height="28" rx="9" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="536" y="304" dy="0.35em" font-size="13" fill="#454C61" data-fit="360"><tspan font-weight="700" fill="#7439B8">App.jsx:</tspan> el componente raíz.</text>
  <path d="M100,223 V334 H112" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M118,326 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="144" y="334" dy="0.35em" font-size="13.5" font-weight="400" fill="#161A26">index.css</text>
  <path d="M100,223 V364 H112" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M118,356 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="144" y="364" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26">main.jsx</text>
  <path d="M218.8,364 H520" fill="none" stroke="#C9A6EE" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="520" y="350" width="392" height="28" rx="9" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="536" y="364" dy="0.35em" font-size="13" fill="#454C61" data-fit="360"><tspan font-weight="700" fill="#7439B8">main.jsx:</tspan> conecta React con el HTML.</text>
  <path d="M74,133 V394 H86" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M92,386 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="118" y="394" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26">index.html</text>
  <path d="M209.0,394 H520" fill="none" stroke="#86D3CA" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="520" y="380" width="392" height="28" rx="9" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="536" y="394" dy="0.35em" font-size="13" fill="#454C61" data-fit="360"><tspan font-weight="700" fill="#0F8478">index.html:</tspan> tiene &lt;div id=&quot;root&quot;&gt;.</text>
  <path d="M74,133 V424 H86" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M92,416 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="118" y="424" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26">package.json</text>
  <path d="M225.2,424 H520" fill="none" stroke="#F0C572" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="520" y="410" width="392" height="28" rx="9" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="536" y="424" dy="0.35em" font-size="13" fill="#454C61" data-fit="360"><tspan font-weight="700" fill="#A96C05">package.json:</tspan> dependencias y scripts.</text>
  <path d="M74,133 V454 H86" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M92,446 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="118" y="454" dy="0.35em" font-size="13.5" font-weight="400" fill="#161A26">vite.config.js</text>
  <path d="M74,133 V484 H86" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>
  <path d="M92,476 h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" stroke-linejoin="round"/><text class="mono" x="118" y="484" dy="0.35em" font-size="13.5" font-weight="400" fill="#161A26">.gitignore</text>
  <text class="foot" x="48" y="526" data-fit="860">Al hacer npm run build aparece una carpeta más, dist/: la app empaquetada.</text>
</svg>
```

## Por dónde arranca

Abre `index.html`: casi está vacío, solo tiene `<div id="root">`. `main.jsx` busca ese div y le pide a React que dibuje `App` adentro. Desde ahí, todo lo que escribas vive dentro de `App`.

```svg
<svg id="setupArranque" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 370" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="setupArranque-ttl setupArranque-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="setupArranque-ttl">Por dónde arranca una app de React</title>
  <desc id="setupArranque-dsc">Tres archivos en fila. index.html tiene un div vacío con id root y un script que carga /src/main.jsx. main.jsx busca ese div con document.getElementById y le dice a React que dibuje App ahí con createRoot y render. App.jsx define la función App, que devuelve el JSX que se ve en pantalla.</desc>
  <defs>
    <style>
      #setupArranque .title{fill:#161A26;font-size:22px;font-weight:700}
      #setupArranque .sub{fill:#79809A;font-size:13.5px}
      #setupArranque .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #setupArranque .foot{fill:#79809A;font-size:12px}
      #setupArranque .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #setupArranque .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#setupArranque-ar-violet)}
    </style>
    <marker id="setupArranque-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
  </defs>
  <rect width="960" height="370" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Por dónde arranca una app de React</text>
  <text class="sub" x="48" y="80" data-fit="860">index.html carga main.jsx; main.jsx monta App dentro del div con id root.</text>
  <rect x="48" y="112" width="264" height="195" rx="10" fill="#1F2430"/>
  <path d="M48,122 A10,10 0 0 1 58,112 H302 A10,10 0 0 1 312,122 V138 H48 Z" fill="#2A3040"/>
  <text class="mono" x="60" y="125" dy="0.35em" font-size="11.5" fill="#9AA3B5">index.html</text><rect x="70.8" y="165" width="150.9" height="21" rx="5" fill="#86D3CA" fill-opacity=".3" stroke="#86D3CA" stroke-width="1.5"/><rect x="84.6" y="203" width="144.0" height="21" rx="5" fill="#C9A6EE" fill-opacity=".3" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="60.0" y="160" font-size="11.5" fill="#E6EAF2" textLength="41.4" lengthAdjust="spacingAndGlyphs">&lt;body&gt;</text><text class="mono" x="73.8" y="179" font-size="11.5" fill="#E6EAF2" textLength="144.9" lengthAdjust="spacingAndGlyphs">&lt;div id=&quot;root&quot;&gt;&lt;/div&gt;</text><text class="mono" x="73.8" y="198" font-size="11.5" fill="#E6EAF2" textLength="144.9" lengthAdjust="spacingAndGlyphs">&lt;script type=&quot;module&quot;</text><text class="mono" x="87.6" y="217" font-size="11.5" fill="#E6EAF2" textLength="138.0" lengthAdjust="spacingAndGlyphs">src=&quot;/src/main.jsx&quot;&gt;</text><text class="mono" x="73.8" y="236" font-size="11.5" fill="#E6EAF2" textLength="62.1" lengthAdjust="spacingAndGlyphs">&lt;/script&gt;</text><text class="mono" x="60.0" y="255" font-size="11.5" fill="#E6EAF2" textLength="48.3" lengthAdjust="spacingAndGlyphs">&lt;/body&gt;</text>
  <rect x="348" y="112" width="264" height="195" rx="10" fill="#1F2430"/>
  <path d="M348,122 A10,10 0 0 1 358,112 H602 A10,10 0 0 1 612,122 V138 H348 Z" fill="#2A3040"/>
  <text class="mono" x="360" y="125" dy="0.35em" font-size="11.5" fill="#9AA3B5">src/main.jsx</text><rect x="370.8" y="241" width="219.9" height="21" rx="5" fill="#86D3CA" fill-opacity=".3" stroke="#86D3CA" stroke-width="1.5"/><rect x="419.1" y="260" width="54.3" height="21" rx="5" fill="#C9A6EE" fill-opacity=".3" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="360.0" y="160" font-size="11.5" fill="#E6EAF2" textLength="144.9" lengthAdjust="spacingAndGlyphs">import { createRoot }</text><text class="mono" x="373.8" y="179" font-size="11.5" fill="#E6EAF2" textLength="165.6" lengthAdjust="spacingAndGlyphs">from 'react-dom/client';</text><text class="mono" x="360.0" y="198" font-size="11.5" fill="#E6EAF2" textLength="193.2" lengthAdjust="spacingAndGlyphs">import App from './App.jsx';</text><text class="mono" x="360.0" y="236" font-size="11.5" fill="#E6EAF2" textLength="75.9" lengthAdjust="spacingAndGlyphs">createRoot(</text><text class="mono" x="373.8" y="255" font-size="11.5" fill="#E6EAF2" textLength="213.9" lengthAdjust="spacingAndGlyphs">document.getElementById('root')</text><text class="mono" x="360.0" y="274" font-size="11.5" fill="#E6EAF2" textLength="124.2" lengthAdjust="spacingAndGlyphs">).render(&lt;App /&gt;);</text>
  <rect x="648" y="112" width="264" height="195" rx="10" fill="#1F2430"/>
  <path d="M648,122 A10,10 0 0 1 658,112 H902 A10,10 0 0 1 912,122 V138 H648 Z" fill="#2A3040"/>
  <text class="mono" x="660" y="125" dy="0.35em" font-size="11.5" fill="#9AA3B5">src/App.jsx</text><rect x="657.0" y="146" width="102.6" height="21" rx="5" fill="#C9A6EE" fill-opacity=".3" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="660.0" y="160" font-size="11.5" fill="#E6EAF2" textLength="110.4" lengthAdjust="spacingAndGlyphs">function App() {</text><text class="mono" x="673.8" y="179" font-size="11.5" fill="#E6EAF2" textLength="55.2" lengthAdjust="spacingAndGlyphs">return (</text><text class="mono" x="687.6" y="198" font-size="11.5" fill="#E6EAF2" textLength="138.0" lengthAdjust="spacingAndGlyphs">&lt;h1&gt;Hola, React&lt;/h1&gt;</text><text class="mono" x="673.8" y="217" font-size="11.5" fill="#E6EAF2" textLength="13.8" lengthAdjust="spacingAndGlyphs">);</text><text class="mono" x="660.0" y="236" font-size="11.5" fill="#E6EAF2" textLength="6.9" lengthAdjust="spacingAndGlyphs">}</text><text class="mono" x="660.0" y="274" font-size="11.5" fill="#E6EAF2" textLength="131.1" lengthAdjust="spacingAndGlyphs">export default App;</text>
  <path class="ar-violet" d="M314,190 H344"/><path class="ar-violet" d="M614,190 H644"/>
  <text class="foot" x="48" y="342" data-fit="860">Todo lo que construyas vive dentro de &lt;App /&gt;, y App vive dentro de &lt;div id="root"&gt;.</text>
</svg>
```

Para probar, cambia el contenido de `App.jsx` por esto y guarda:

```jsx
function App() {
  return <h1>Hola, React</h1>;
}

export default App;
```

## Empaquetar

Cuando la app esté lista para publicarse:

```bash
npm run build
```

Aparece la carpeta `dist/` con el HTML, el JS y el CSS que vimos en la lección anterior. Eso es lo que se sube a un servidor.
