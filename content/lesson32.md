# Repasito de JS

<!-- tags: let y const, var, desestructuración, funciones flecha, map y filter, spread operator, template strings, async await, import y export, Assignment to constant variable, is not defined -->

React es JavaScript. Antes de empezar, un repaso de lo que más vamos a usar. Cada bloque es código de verdad: léelo, piensa qué va a imprimir y pulsa **Ejecutar**. Puedes cambiar lo que quieras y volver a ejecutar; **Restaurar** lo deja como estaba.

## let y const

`const` para lo que no se reasigna, `let` para lo que sí. En React casi todo es `const`.

```interactive
js-run variables
```

Quita el comentario de la última línea y ejecuta: reasignar un `const` es un error.

## Por qué no usar var

`var` ignora los bloques `{ }`: la variable se escapa del `if`. `let` y `const` no.

```interactive
js-run var
```

## Tipos y template strings

Los primitivos son `string`, `number`, `boolean`, `null` y `undefined`. Con comillas invertidas (`` ` ``) se arma texto con `${expresión}` adentro.

```interactive
js-run types
```

## Objetos

Un objeto agrupa datos con nombre. `const` impide reasignar la variable, no cambiar lo que tiene adentro.

```interactive
js-run objects
```

## Arreglos

```interactive
js-run arrays
```

## Desestructuración

Saca propiedades de un objeto, o posiciones de un arreglo, en variables. La de arreglos la vas a ver en cada `useState`: `const [count, setCount] = useState(0)`.

```interactive
js-run destructuring
```

## Funciones y funciones flecha

Las dos formas hacen lo mismo. Si la flecha tiene una sola expresión, no lleva `return` ni llaves.

```interactive
js-run functions
```

## Funciones como valores

Una función se puede pasar a otra como si fuera un dato. Así funcionan los eventos en React: `onClick={incrementar}` le entrega la función al botón para que la llame después.

```interactive
js-run callbacks
```

## Desestructurar parámetros

Si una función recibe un objeto, puede sacar lo que necesita en la misma firma. Así reciben sus datos los componentes de React.

```interactive
js-run params
```

## map y filter

`map` transforma cada elemento y `filter` se queda con los que cumplen la condición. Los dos devuelven un **arreglo nuevo**: el original no cambia.

```interactive
js-run map-filter
```

## Spread

`...` copia el contenido de un arreglo u objeto dentro de uno nuevo. Es la forma de "cambiar" datos sin tocar el original, que es justo lo que pide el estado de React.

```interactive
js-run spread
```

## Condiciones cortas

El ternario `condición ? a : b` y el `&&` se usan mucho dentro de JSX para mostrar una cosa u otra.

```interactive
js-run conditionals
```

## async y await

`await` espera una promesa sin bloquear el resto del programa. Mira el orden en que salen los mensajes.

```interactive
js-run async
```

## Módulos

Cada archivo es un módulo: comparte lo que exporta y usa lo que importa. Esto no se puede ejecutar aquí porque son dos archivos.

```svg
<svg id="jsModulos" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 330" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="jsModulos-ttl jsModulos-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="jsModulos-ttl">Módulos: un archivo exporta, otro importa</title>
  <desc id="jsModulos-dsc">A la izquierda utils.js exporta la función doble con export y la función saludar con export default. A la derecha main.js las importa con import saludar, { doble } from ./utils.js y las usa con console.log.</desc>
  <defs>
    <style>
      #jsModulos .title{fill:#161A26;font-size:22px;font-weight:700}
      #jsModulos .sub{fill:#79809A;font-size:13.5px}
      #jsModulos .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #jsModulos .foot{fill:#79809A;font-size:12px}
      #jsModulos .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #jsModulos .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#jsModulos-ar-violet)}
    </style>
    <marker id="jsModulos-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
  </defs>
  <rect width="960" height="330" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Módulos: un archivo exporta, otro importa</text>
  <text class="sub" x="48" y="80" data-fit="860">Cada archivo es un módulo. Lo que no se exporta queda privado dentro de su archivo.</text>
  <rect x="48" y="112" width="400" height="160" rx="10" fill="#1F2430"/>
  <path d="M48,122 A10,10 0 0 1 58,112 H438 A10,10 0 0 1 448,122 V138 H48 Z" fill="#2A3040"/>
  <text class="mono" x="60" y="125" dy="0.35em" font-size="11.5" fill="#9AA3B5">utils.js</text><rect x="57.0" y="146" width="47.4" height="21" rx="5" fill="#C9A6EE" fill-opacity=".3" stroke="#C9A6EE" stroke-width="1.5"/><rect x="57.0" y="184" width="102.6" height="21" rx="5" fill="#C9A6EE" fill-opacity=".3" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="60.0" y="160" font-size="11.5" fill="#E6EAF2" textLength="234.6" lengthAdjust="spacingAndGlyphs">export const doble = (n) =&gt; n * 2;</text><text class="mono" x="60.0" y="198" font-size="11.5" fill="#E6EAF2" textLength="282.9" lengthAdjust="spacingAndGlyphs">export default function saludar(nombre) {</text><text class="mono" x="73.8" y="217" font-size="11.5" fill="#E6EAF2" textLength="172.5" lengthAdjust="spacingAndGlyphs">return `Hola, ${nombre}`;</text><text class="mono" x="60.0" y="236" font-size="11.5" fill="#E6EAF2" textLength="6.9" lengthAdjust="spacingAndGlyphs">}</text>
  <rect x="512" y="112" width="400" height="160" rx="10" fill="#1F2430"/>
  <path d="M512,122 A10,10 0 0 1 522,112 H902 A10,10 0 0 1 912,122 V138 H512 Z" fill="#2A3040"/>
  <text class="mono" x="524" y="125" dy="0.35em" font-size="11.5" fill="#9AA3B5">main.js</text><rect x="521.0" y="146" width="47.4" height="21" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="524.0" y="160" font-size="11.5" fill="#E6EAF2" textLength="303.6" lengthAdjust="spacingAndGlyphs">import saludar, { doble } from './utils.js';</text><text class="mono" x="524.0" y="198" font-size="11.5" fill="#E6EAF2" textLength="193.2" lengthAdjust="spacingAndGlyphs">console.log(saludar(&quot;Ana&quot;));</text><text class="mono" x="524.0" y="217" font-size="11.5" fill="#E6EAF2" textLength="151.8" lengthAdjust="spacingAndGlyphs">console.log(doble(4));</text>
  <path class="ar-violet" d="M452,192 H506"/>
  <rect x="453.1" y="162" width="53.8" height="20" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="480" y="172" dy="0.35em" text-anchor="middle" font-size="10.5" font-weight="700" fill="#7439B8">export</text>
  <text class="foot" x="48" y="302" data-fit="860">En React cada componente es un módulo: Header.jsx lo exporta y App.jsx lo importa.</text>
</svg>
```
