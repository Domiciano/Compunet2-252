# Componentes y props

<!-- tags: componente, props, desestructurar props, export default, componente reutilizable, props is undefined, Cannot read properties of undefined, componente en minúscula -->

Un **componente** es una función que devuelve JSX. Es la pieza con que se arma toda la interfaz: una app de React es un árbol de componentes. Vamos a construir uno, `Header`, con un título y un subtítulo.

## Primero, con los textos quemados

El archivo `src/components/Header.jsx`:

```jsx
function Header() {
  return (
    <header>
      <h1>Computación 2</h1>
      <p>Introducción a React</p>
    </header>
  );
}

export default Header;
```

Y se usa en `App.jsx` como si fuera una etiqueta más:

```jsx
import Header from './components/Header.jsx';

function App() {
  return (
    <div>
      <Header />
      <Header />
    </div>
  );
}

export default App;
```

Cada `<Header />` llama a la función y pone su resultado en ese lugar. El problema se ve enseguida: los dos dicen lo mismo, porque los textos están escritos dentro de `Header`.

## Ahora con props

Las **props** son los datos que el padre le pasa al hijo, escritos como atributos. React los junta en un objeto y se lo entrega a la función como primer parámetro. Desestructurándolo en la firma, `Header` recibe `title` y `subtitle` y los pone en su JSX con llaves:

```jsx
function Header({ title, subtitle }) {
  return (
    <header>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}

export default Header;
```

```jsx
function App() {
  return (
    <div>
      <Header title="Computación 2" subtitle="Introducción a React" />
      <Header title="Semana 14" subtitle="Componentes y props" />
    </div>
  );
}
```

```svg
<svg id="propsFlujo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 470" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="propsFlujo-ttl propsFlujo-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="propsFlujo-ttl">Las props bajan del padre al hijo</title>
  <desc id="propsFlujo-dsc">A la izquierda App.jsx usa Header con dos atributos, title y subtitle. Debajo, React los junta en un objeto props con title igual a Computación 2 y subtitle igual a Introducción a React. A la derecha Header.jsx recibe ese objeto, lo desestructura en sus parámetros y pone cada valor en su JSX.</desc>
  <defs>
    <style>
      #propsFlujo .title{fill:#161A26;font-size:22px;font-weight:700}
      #propsFlujo .sub{fill:#79809A;font-size:13.5px}
      #propsFlujo .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #propsFlujo .foot{fill:#79809A;font-size:12px}
      #propsFlujo .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #propsFlujo .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#propsFlujo-ar-amber)}
    </style>
    <marker id="propsFlujo-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
  </defs>
  <rect width="960" height="470" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Las props bajan del padre al hijo</text>
  <text class="sub" x="48" y="80" data-fit="860">App decide qué mostrar y se lo pasa a Header como atributos. Header solo los lee.</text>
  <rect x="48" y="112" width="400" height="208" rx="10" fill="#1F2430"/>
  <path d="M48,122 A10,10 0 0 1 58,112 H438 A10,10 0 0 1 448,122 V138 H48 Z" fill="#2A3040"/>
  <text class="mono" x="60" y="125" dy="0.35em" font-size="11.5" fill="#9AA3B5">App.jsx · el padre</text><rect x="98.4" y="203" width="150.9" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><rect x="98.4" y="222" width="219.9" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="60.0" y="160" font-size="11.5" fill="#E6EAF2" textLength="110.4" lengthAdjust="spacingAndGlyphs">function App() {</text><text class="mono" x="73.8" y="179" font-size="11.5" fill="#E6EAF2" textLength="55.2" lengthAdjust="spacingAndGlyphs">return (</text><text class="mono" x="87.6" y="198" font-size="11.5" fill="#E6EAF2" textLength="48.3" lengthAdjust="spacingAndGlyphs">&lt;Header</text><text class="mono" x="101.4" y="217" font-size="11.5" fill="#E6EAF2" textLength="144.9" lengthAdjust="spacingAndGlyphs">title=&quot;Computación 2&quot;</text><text class="mono" x="101.4" y="236" font-size="11.5" fill="#E6EAF2" textLength="213.9" lengthAdjust="spacingAndGlyphs">subtitle=&quot;Introducción a React&quot;</text><text class="mono" x="87.6" y="255" font-size="11.5" fill="#E6EAF2" textLength="13.8" lengthAdjust="spacingAndGlyphs">/&gt;</text><text class="mono" x="73.8" y="274" font-size="11.5" fill="#E6EAF2" textLength="13.8" lengthAdjust="spacingAndGlyphs">);</text><text class="mono" x="60.0" y="293" font-size="11.5" fill="#E6EAF2" textLength="6.9" lengthAdjust="spacingAndGlyphs">}</text>
  <rect x="512" y="112" width="400" height="208" rx="10" fill="#1F2430"/>
  <path d="M512,122 A10,10 0 0 1 522,112 H902 A10,10 0 0 1 912,122 V138 H512 Z" fill="#2A3040"/>
  <text class="mono" x="524" y="125" dy="0.35em" font-size="11.5" fill="#9AA3B5">Header.jsx · el hijo</text><rect x="631.4" y="146" width="150.9" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><rect x="590.0" y="203" width="54.3" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><rect x="583.1" y="222" width="75.0" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="524.0" y="160" font-size="11.5" fill="#E6EAF2" textLength="262.2" lengthAdjust="spacingAndGlyphs">function Header({ title, subtitle }) {</text><text class="mono" x="537.8" y="179" font-size="11.5" fill="#E6EAF2" textLength="55.2" lengthAdjust="spacingAndGlyphs">return (</text><text class="mono" x="551.6" y="198" font-size="11.5" fill="#E6EAF2" textLength="55.2" lengthAdjust="spacingAndGlyphs">&lt;header&gt;</text><text class="mono" x="565.4" y="217" font-size="11.5" fill="#E6EAF2" textLength="110.4" lengthAdjust="spacingAndGlyphs">&lt;h1&gt;{title}&lt;/h1&gt;</text><text class="mono" x="565.4" y="236" font-size="11.5" fill="#E6EAF2" textLength="117.3" lengthAdjust="spacingAndGlyphs">&lt;p&gt;{subtitle}&lt;/p&gt;</text><text class="mono" x="551.6" y="255" font-size="11.5" fill="#E6EAF2" textLength="62.1" lengthAdjust="spacingAndGlyphs">&lt;/header&gt;</text><text class="mono" x="537.8" y="274" font-size="11.5" fill="#E6EAF2" textLength="13.8" lengthAdjust="spacingAndGlyphs">);</text><text class="mono" x="524.0" y="293" font-size="11.5" fill="#E6EAF2" textLength="6.9" lengthAdjust="spacingAndGlyphs">}</text>
  <rect x="160" y="356" width="640" height="44" rx="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/><text class="mono" x="480" y="378" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#A96C05" data-fit="620">props = { title: &quot;Computación 2&quot;, subtitle: &quot;Introducción a React&quot; }</text>
  <path class="ar-amber" d="M248,324 V352"/><path class="ar-amber" d="M712,354 V326"/>
  <text class="foot" x="48" y="442" data-fit="860">Mismo componente, datos distintos: &lt;Header title="Semana 14" … /&gt; dibuja otro encabezado sin tocar Header.</text>
</svg>
```

## Compáralos

Las dos versiones, en vivo. En la pestaña *Con props* cambia los textos de `App` y mira cómo cada `Header` del árbol recibe los suyos.

```interactive
props-header
```

Dos cosas que conviene notar en el árbol: las props **bajan** (de `App` a `Header`, nunca al revés), y `Header` solo las **lee**. Si una prop no llega, su valor es `undefined` y simplemente no se muestra nada; prueba a borrar `subtitle` de uno de los dos.
