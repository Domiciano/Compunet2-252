<p><img src="https://logos-download.com/wp-content/uploads/2016/09/React_logo_wordmark-3000x1007.png" width="384"></p>

Cree aplicaciones de react por medio de este comando

```sh
npm create vite@latest misuperapp -- --template react
```


<p><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Tailwind_CSS_logo.svg/2560px-Tailwind_CSS_logo.svg.png" width="512"></p>


Es un framework de CSS que te deja estilizar tus páginas web usando clases ya hechas, sin tener que escribir montones de reglas en un archivo aparte. En vez de escribir `background-color: red`, solo se pone `bg-red-500` y listo, rápido y al grano, como nos gusta. 

Sirve tener agilidad cuando estás montando una interfaz, y como es utilitario, todo lo hacés desde el HTML mismo.

```sh
npm install tailwindcss @tailwindcss/vite
```

En el archivo `vite.config.ts` introduzca

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  <- Introducimos esta línea

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), <- Introducimos esta línea
  ],
})
```

En el `index.css` 
```css
@import "tailwindcss";
...
```

Y listo disfrute de Tailwind.

Puede comprobarlo usando en algun componentes de la aplicación

```html
<h1 class="text-3xl font-bold underline">
  Hello world!
</h1>
```

Debería ver el texto subrayado


# Diccionario de eventos de React

Aquí los eventos más comunes que puedes usar en componentes React, con ejemplos simples.

---

## Eventos de Mouse

### `onClick`
Se dispara cuando se hace clic en un elemento.
```jsx
<button onClick={() => alert('¡Hiciste clic!')}>Click aquí</button>
```

### `onDoubleClick`
Se ejecuta cuando se hace doble clic sobre un elemento.
```jsx
<div onDoubleClick={() => alert('Doble clic')}>Haz doble clic</div>
```

### `onMouseEnter`
Se activa cuando el cursor entra al área del elemento.
```jsx
<div onMouseEnter={() => console.log('Entraste al área')}>Pasa el mouse</div>
```

### `onMouseLeave`
Se activa cuando el cursor sale del área del elemento.
```jsx
<div onMouseLeave={() => console.log('Saliste del área')}>Pasa el mouse</div>
```

### `onMouseMove`
Detecta el movimiento del cursor sobre un elemento.
```jsx
<div onMouseMove={(e) => console.log(`X: ${e.clientX}, Y: ${e.clientY}`)}>Mueve el mouse</div>
```

### `onMouseDown`
Se activa al presionar el botón del mouse.
```jsx
<div onMouseDown={() => console.log('Mouse presionado')}>Presiona mouse</div>
```

### `onMouseUp`
Se ejecuta al soltar el botón del mouse.
```jsx
<div onMouseUp={() => console.log('Mouse soltado')}>Suelta el mouse</div>
```

### `onContextMenu`
Se ejecuta al hacer clic derecho.
```jsx
<div onContextMenu={(e) => { e.preventDefault(); alert('Menú contextual bloqueado'); }}>
  Clic derecho aquí
</div>
```

---

## Eventos de Teclado

### `onKeyDown`
Detecta cuando una tecla es presionada.
```jsx
<input onKeyDown={(e) => console.log(`Tecla abajo: ${e.key}`)} />
```

### `onKeyUp`
Se activa al soltar una tecla.
```jsx
<input onKeyUp={(e) => console.log(`Tecla arriba: ${e.key}`)} />
```

---

## Eventos de Formulario

### `onChange`
Se dispara cuando cambia el valor de un input o select.
```jsx
<input onChange={(e) => console.log(e.target.value)} />
```

### `onInput`
Similar a `onChange`, pero se dispara en cada entrada (más inmediato).
```jsx
<input onInput={(e) => console.log(e.target.value)} />
```

### `onSubmit`
Se activa al enviar un formulario.
```jsx
<form onSubmit={(e) => { e.preventDefault(); alert('Formulario enviado'); }}>
  <button type="submit">Enviar</button>
</form>
```

### `onFocus`
Se activa cuando un elemento recibe el foco.
```jsx
<input onFocus={() => console.log('Enfocado')} />
```

### `onBlur`
Se dispara cuando un elemento pierde el foco.
```jsx
<input onBlur={() => console.log('Desenfocado')} />
```

### `onReset`
Se ejecuta al reiniciar un formulario.
```jsx
<form onReset={() => console.log('Formulario reiniciado')}>
  <button type="reset">Reset</button>
</form>
```

### `onSelect`
Se activa cuando el usuario selecciona texto.
```jsx
<input onSelect={(e) => console.log('Texto seleccionado')} />
```

### `onInvalid`
Se activa cuando un input inválido intenta enviarse.
```jsx
<form onSubmit={(e) => e.preventDefault()}>
  <input required onInvalid={() => alert('Campo requerido')} />
  <button type="submit">Enviar</button>
</form>
```

---

## Eventos de Scroll

### `onScroll`
Se dispara cuando el usuario hace scroll.
```jsx
<div onScroll={() => console.log('Scroll detectado')} style={{ height: 100, overflow: 'auto' }}>
  <div style={{ height: 300 }}>Contenido largo</div>
</div>
```

---

## Eventos Misceláneos

### `onError`
Se ejecuta cuando ocurre un error de carga, por ejemplo en imágenes.
```jsx
<img src="imagen-inexistente.jpg" onError={() => alert('Error al cargar imagen')} />
```

### `onLoad`
Se activa cuando el recurso se carga completamente.
```jsx
<img src="https://via.placeholder.com/150" onLoad={() => console.log('Imagen cargada')} />
```
