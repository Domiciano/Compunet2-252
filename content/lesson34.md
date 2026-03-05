[t] Primera App de React
[icon] https://logos-download.com/wp-content/uploads/2016/09/React_logo_wordmark-3000x1007.png
React es una librería de JavaScript desarrollada por Meta para construir interfaces de usuario de manera declarativa y eficiente, especialmente en aplicaciones web de una sola página (SPA). 
Permite crear componentes reutilizables que gestionan su propio estado, facilitando la construcción de interfaces dinámicas y reactivas. 
React utiliza un `Virtual DOM` para minimizar las manipulaciones reales del DOM, lo que mejora el rendimiento. Además, su enfoque basado en componentes y su integración con herramientas modernas lo han convertido en una de las tecnologías más populares para el desarrollo frontend.
Cree aplicaciones de react por medio de este comando

[code:sh]
npm create vite@latest nombre-de-tu-app -- --template react
[endcode]

[st] Material UI
Vamos a utilizar componentes de material para aligerar la construcción gráfica de las páginas
[code:sh]
npm install @mui/material @emotion/react @emotion/styled
[endcode]

[code:sh]
npm install @mui/icons-material
[endcode]
[st] Diccionario de eventos de React
Aquí los eventos más comunes que puedes usar en componentes React, con ejemplos simples.
[st]Eventos de Mouse
 `onClick`
Se dispara cuando se hace clic en un elemento.
[code:jsx]
<button onClick={() => alert('¡Hiciste clic!')}>Click aquí</button>
[endcode]

 `onDoubleClick`
Se ejecuta cuando se hace doble clic sobre un elemento.
[code:jsx]
<div onDoubleClick={() => alert('Doble clic')}>Haz doble clic</div>
[endcode]

 `onMouseEnter`
Se activa cuando el cursor entra al área del elemento.
[code:jsx]
<div onMouseEnter={() => console.log('Entraste al área')}>Pasa el mouse</div>
[endcode]

 `onMouseLeave`
Se activa cuando el cursor sale del área del elemento.
[code:jsx]
<div onMouseLeave={() => console.log('Saliste del área')}>Pasa el mouse</div>
[endcode]

 `onMouseMove`
Detecta el movimiento del cursor sobre un elemento.
[code:jsx]
<div onMouseMove={(e) => console.log(`X: ${e.clientX}, Y: ${e.clientY}`)}>Mueve el mouse</div>
[endcode]

 `onMouseDown`
Se activa al presionar el botón del mouse.
[code:jsx]
<div onMouseDown={() => console.log('Mouse presionado')}>Presiona mouse</div>
[endcode]

 `onMouseUp`
Se ejecuta al soltar el botón del mouse.
[code:jsx]
<div onMouseUp={() => console.log('Mouse soltado')}>Suelta el mouse</div>
[endcode]

 `onContextMenu`
Se ejecuta al hacer clic derecho.
[code:jsx]
<div onContextMenu={(e) => { e.preventDefault(); alert('Menú contextual bloqueado'); }}>
  Clic derecho aquí
</div>
[endcode]
[st]Eventos de Teclado
 `onKeyDown`
Detecta cuando una tecla es presionada.
[code:jsx]
<input onKeyDown={(e) => console.log(`Tecla abajo: ${e.key}`)} />
[endcode]

 `onKeyUp`
Se activa al soltar una tecla.
[code:jsx]
<input onKeyUp={(e) => console.log(`Tecla arriba: ${e.key}`)} />
[endcode]
[st]Eventos de Formulario
 `onChange`
Se dispara cuando cambia el valor de un input o select.
[code:jsx]
<input onChange={(e) => console.log(e.target.value)} />
[endcode]

 `onInput`
Similar a `onChange`, pero se dispara en cada entrada (más inmediato).
[code:jsx]
<input onInput={(e) => console.log(e.target.value)} />
[endcode]

 `onSubmit`
Se activa al enviar un formulario.
[code:jsx]
<form onSubmit={(e) => { e.preventDefault(); alert('Formulario enviado'); }}>
  <button type="submit">Enviar</button>
</form>
[endcode]

 `onFocus`
Se activa cuando un elemento recibe el foco.
[code:jsx]
<input onFocus={() => console.log('Enfocado')} />
[endcode]

 `onBlur`
Se dispara cuando un elemento pierde el foco.
[code:jsx]
<input onBlur={() => console.log('Desenfocado')} />
[endcode]

 `onReset`
Se ejecuta al reiniciar un formulario.
[code:jsx]
<form onReset={() => console.log('Formulario reiniciado')}>
  <button type="reset">Reset</button>
</form>
[endcode]

 `onSelect`
Se activa cuando el usuario selecciona texto.
[code:jsx]
<input onSelect={(e) => console.log('Texto seleccionado')} />
[endcode]

 `onInvalid`
Se activa cuando un input inválido intenta enviarse.
[code:jsx]
<form onSubmit={(e) => e.preventDefault()}>
  <input required onInvalid={() => alert('Campo requerido')} />
  <button type="submit">Enviar</button>
</form>
[endcode]
[st]Eventos de Scroll
 `onScroll`
Se dispara cuando el usuario hace scroll.
[code:jsx]
<div onScroll={() => console.log('Scroll detectado')} style={{ height: 100, overflow: 'auto' }}>
  <div style={{ height: 300 }}>Contenido largo</div>
</div>
[endcode]
[st]Eventos Misceláneos
 `onError`
Se ejecuta cuando ocurre un error de carga, por ejemplo en imágenes.
[code:jsx]
<img src="imagen-inexistente.jpg" onError={() => alert('Error al cargar imagen')} />
[endcode]
 `onLoad`
Se activa cuando el recurso se carga completamente.
[code:jsx]
<img src="https://via.placeholder.com/150" onLoad={() => console.log('Imagen cargada')} />
[endcode]