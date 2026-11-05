# Estado con useState

<!-- tags: useState, estado, setState, re-render, Virtual DOM, diff, onClick, onChange, componente controlado, la pantalla no se actualiza, inmutabilidad, actualización funcional -->

Las props vienen de afuera. El **estado** es lo que un componente recuerda por su cuenta y puede cambiar: un contador, lo que hay escrito en un input, una lista de mensajes. Cuando el estado cambia, React vuelve a dibujar el componente.

## El contador

El ejemplo de siempre, visto por dentro. Pulsa **▶ Primer render** para ver cómo el JSX se convierte en un árbol y ese árbol en pantalla. Luego pulsa **+** varias veces. Con *Paso a paso* avanzas tú.

```interactive
react-counter
```

Las cuatro columnas son las piezas del proceso:

- **Componente.** La función `App` y su estado. `useState(0)` le pide a React que guarde `count` **fuera** de la función, para que no se pierda entre una llamada y otra.
- **Virtual DOM.** Lo que devuelve el JSX: un árbol de objetos JavaScript que describe la pantalla. Es barato de crear, así que React lo vuelve a crear entero en cada render.
- **DOM real.** Los nodos que el navegador pinta. Tocarlos es caro, así que React compara el árbol nuevo con el anterior (*diff*) y cambia solo lo que difiere.
- **Pantalla.** Lo que ve el usuario.

## Con una variable normal

Ahora `count` es un `let` común. Pulsa **+** varias veces y mira el bloque del componente.

```interactive
react-counter forget
```

El valor cambia, pero la pantalla no. Una variable normal no le avisa a nadie: React solo vuelve a dibujar cuando se llama a la función `set` de un estado. Es el error más común al empezar: *"cambio la variable y la pantalla no se actualiza"*.

## Anatomía de useState

```jsx
const [count, setCount] = useState(0);
```

`useState` recibe el valor inicial y devuelve un arreglo de dos posiciones, que se desestructura: el **valor actual** y la **función para cambiarlo**. El nombre es libre, la convención es `algo` y `setAlgo`. Se importa de React: `import { useState } from 'react';`.

Nunca se cambia el valor directamente (`count = 5` o `count++`): siempre con `setCount(5)`.

## Eventos

Los eventos se escriben como atributos en camelCase y reciben **una función**, no una llamada. `onClick={incrementar}` le entrega la función al botón; `onClick={incrementar()}` la ejecutaría al dibujar.

```jsx
<button onClick={() => setCount(count + 1)}>+</button>

<input onChange={(e) => setTexto(e.target.value)} />

<form onSubmit={(e) => { e.preventDefault(); enviar(); }}>
```

Los más usados son `onClick`, `onChange` (cada vez que cambia un input), `onSubmit` (al enviar un formulario; `preventDefault` evita que la página se recargue) y `onKeyDown`.

## Estado con un input

El input muestra el estado y cada tecla lo actualiza. Este patrón se llama **componente controlado**.

```jsx
function Saludo() {
  const [nombre, setNombre] = useState('');

  return (
    <div>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <p>Hola, {nombre}</p>
    </div>
  );
}
```

## Objetos y arreglos: siempre una copia nueva

Para que React note el cambio hay que entregarle **otro** objeto u otro arreglo, no el mismo modificado. Se copia con spread y se cambia lo necesario.

```jsx
const [usuario, setUsuario] = useState({ nombre: 'Juan', edad: 30 });
setUsuario({ ...usuario, edad: usuario.edad + 1 });

const [tareas, setTareas] = useState(['Aprender React']);
setTareas([...tareas, 'Construir una app']);
```

`tareas.push(...)` seguido de `setTareas(tareas)` no funciona: es el mismo arreglo, y para React nada cambió.

## Cuando el nuevo valor depende del anterior

Si actualizas varias veces seguidas, pasa una función a `set`: recibe el valor más reciente.

```jsx
setCount((anterior) => anterior + 1);
```

## Mini-proyecto: Chat

Un input y un botón. Cada mensaje enviado se acumula en pantalla.

```jsx
import { useState } from 'react';

function App() {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');

  const enviar = () => {
    if (texto === '') return;
    setMensajes([...mensajes, texto]);
    setTexto('');
  };

  return (
    <div>
      {mensajes.map((msg, i) => <p key={i}>{msg}</p>)}
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe un mensaje"
      />
      <button onClick={enviar}>Enviar</button>
    </div>
  );
}

export default App;
```
