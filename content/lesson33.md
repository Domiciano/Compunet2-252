# JavaScript en el navegador

<!-- tags: DOM, VanillaJS, getElementById, addEventListener, textContent, createElement, script src, null is not an object, Cannot read properties of null -->

Así es como ya saben hacer páginas: un HTML que carga un archivo JS, y ese JS que controla lo que hay en pantalla.

## El HTML carga el JS

El navegador lee `index.html` de arriba abajo. Al llegar a `<script src="app.js">` descarga y ejecuta ese archivo. Desde ahí, el JS puede tocar el **DOM**: el árbol de nodos que el navegador arma con el HTML y que pinta en pantalla.

```svg
<svg id="vanillaFlujo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 360" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="vanillaFlujo-ttl vanillaFlujo-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="vanillaFlujo-ttl">Cómo funciona una página con JavaScript puro</title>
  <desc id="vanillaFlujo-dsc">Cuatro bloques en fila. index.html carga app.js con una etiqueta script. app.js lee y modifica el DOM con getElementById, textContent y appendChild. El DOM es el árbol de nodos en memoria y el navegador lo pinta en la pantalla. Una flecha de vuelta va de la pantalla a app.js: cuando el usuario hace clic o escribe, el navegador dispara un evento y corre la función registrada con addEventListener.</desc>
  <defs>
    <style>
      #vanillaFlujo .title{fill:#161A26;font-size:22px;font-weight:700}
      #vanillaFlujo .sub{fill:#79809A;font-size:13.5px}
      #vanillaFlujo .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #vanillaFlujo .foot{fill:#79809A;font-size:12px}
      #vanillaFlujo .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #vanillaFlujo .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#vanillaFlujo-ar-indigo)}
      #vanillaFlujo .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#vanillaFlujo-ar-amber)}
    </style>
    <marker id="vanillaFlujo-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
    <marker id="vanillaFlujo-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
  </defs>
  <rect width="960" height="360" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Cómo funciona una página con JavaScript puro</text>
  <text class="sub" x="48" y="80" data-fit="860">El HTML carga el JS. El JS lee y cambia el DOM, y el navegador pinta lo que cambió.</text>
  <rect x="48" y="136" width="168" height="100" rx="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.75"/><text class="mono" x="132" y="164" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#556074">index.html</text><text x="132" y="194" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="152">la estructura</text><text class="mono" x="132" y="214" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="152">&lt;script src=&quot;app.js&quot;&gt;</text>
  <rect x="280" y="136" width="168" height="100" rx="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.75"/><text class="mono" x="364" y="164" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#4453C9">app.js</text><text class="mono" x="364" y="194" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="152">getElementById</text><text class="mono" x="364" y="214" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="152">addEventListener</text>
  <rect x="512" y="136" width="168" height="100" rx="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.75"/><text class="mono" x="596" y="164" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#0F8478">DOM</text><text x="596" y="194" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="152">árbol de nodos</text><text x="596" y="214" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="152">en memoria</text>
  <rect x="744" y="136" width="168" height="100" rx="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.75"/><text class="mono" x="828" y="164" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#3A8235">Pantalla</text><text x="828" y="194" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="152">lo que ve</text><text x="828" y="214" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="152">el usuario</text>
  <path class="ar-indigo" d="M220,186.0 H276"/>
  <text x="248" y="174.0" text-anchor="middle" font-size="11.5" fill="#4453C9" font-weight="600">carga</text>
  <path class="ar-indigo" d="M452,186.0 H508"/>
  <text x="480" y="174.0" text-anchor="middle" font-size="11.5" fill="#4453C9" font-weight="600">cambia</text>
  <path class="ar-indigo" d="M684,186.0 H740"/>
  <text x="712" y="174.0" text-anchor="middle" font-size="11.5" fill="#4453C9" font-weight="600">pinta</text>
  <path class="ar-amber" d="M828.0,240 V280 H364.0 V244"/>
  <rect x="446" y="268" width="300" height="24" rx="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="596" y="280" dy="0.35em" text-anchor="middle" font-size="12" fill="#A96C05" font-weight="700">evento: click, input… y corre tu función</text>
  <text class="foot" x="48" y="332" data-fit="860">Mostrar datos y recibir al usuario pasa por el mismo lugar: tu JS tocando el DOM, nodo por nodo.</text>
</svg>
```

## Recibir al usuario

`getElementById` busca un nodo del DOM y `addEventListener` le cuelga una función que corre cuando pasa algo. Escribe tu nombre en la vista previa y pulsa *Saludar*. Luego cambia `app.js` y pulsa **Recargar**.

```interactive
vanilla-dom greet
```

Prueba también a borrar la línea `<script src="app.js"></script>` de `index.html`: la página se ve igual, pero el botón ya no hace nada.

## Mostrar información

Ahora al revés: el JS tiene los datos (un arreglo) y crea un `<li>` por cada uno. Agrega unas tareas.

```interactive
vanilla-dom list
```

## Lo que se vuelve difícil

Funciona, pero fíjate en `pintar()`: cada vez que cambian los datos **tú** tienes que acordarte de borrar y volver a crear los nodos. Con dos o tres pantallas que dependen de los mismos datos, ese código manual se vuelve el problema. React se encarga justo de eso: tú dices cómo se ve la pantalla para unos datos, y él actualiza el DOM.
