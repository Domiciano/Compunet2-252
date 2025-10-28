[t]Estados en React: useState

En React, el "estado" (state) es un objeto JavaScript que almacena datos que son relevantes para un componente y que pueden cambiar con el tiempo. Cuando el estado de un componente cambia, React re-renderiza automáticamente el componente para reflejar esos cambios en la interfaz de usuario.

[st]¿Por qué necesitamos el estado?

Las aplicaciones web son dinámicas. Los datos cambian constantemente: un contador que aumenta, un campo de texto que el usuario edita, una lista de elementos que se carga desde una API. El estado nos permite gestionar estos datos cambiantes dentro de nuestros componentes y asegurar que la interfaz de usuario se mantenga sincronizada con la lógica de la aplicación.

[st]Introducción al Hook `useState`

Antes de los Hooks, la gestión del estado en componentes funcionales era limitada. El Hook `useState` nos permite añadir estado a los componentes funcionales de React. Es la forma más común y fundamental de gestionar el estado local en un componente.

[st]Declarando e Inicializando el Estado

Para usar `useState`, lo importamos de React y lo llamamos dentro de nuestro componente funcional. `useState` devuelve un array con dos elementos:
1.  El valor actual del estado.
2.  Una función para actualizar ese valor.

[code:jsx]
import React, { useState } from 'react';

function Contador() {
  // Declara una nueva variable de estado, que llamaremos "count"
  // y una función para actualizarla, que llamaremos "setCount"
  const [count, setCount] = useState(0); // 0 es el valor inicial del estado

  return (
    <div>
      <p>Has hecho clic {count} veces</p>
      <button onClick={() => setCount(count + 1)}>
        Haz clic aquí
      </button>
    </div>
  );
}

export default Contador;
[endcode]

En el ejemplo anterior:
*   `count` es la variable de estado que contiene el valor actual (inicialmente `0`).
*   `setCount` es la función que usaremos para actualizar `count`.

[st]Actualizando el Estado

Para actualizar el estado, siempre debes usar la función `set` que `useState` te proporciona (ej. `setCount`). Nunca modifiques el estado directamente (ej. `count = count + 1`), ya que React no detectará el cambio y tu componente no se re-renderizará.

Cuando llamas a `setCount`, React:
1.  Actualiza el valor de `count`.
2.  Re-renderiza el componente `Contador`.

[st]Inmutabilidad del Estado

Es una práctica fundamental en React tratar el estado como inmutable. Esto significa que, en lugar de modificar un objeto o array existente en el estado, siempre debes crear una nueva copia con los cambios deseados y luego usar la función `set` para actualizar el estado con esa nueva copia.

[st]Ejemplos con Diferentes Tipos de Datos

[st]Estado con Strings

[code:jsx]
import React, { useState } from 'react';

function Saludo() {
  const [nombre, setNombre] = useState('Mundo');

  const handleChange = (event) => {
    setNombre(event.target.value);
  };

  return (
    <div>
      <input type="text" value={nombre} onChange={handleChange} />
      <p>Hola, {nombre}!</p>
    </div>
  );
}

export default Saludo;
[endcode]

[st]Estado con Booleans

[code:jsx]
import React, { useState } from 'react';

function Toggle() {
  const [estaEncendido, setEstaEncendido] = useState(false);

  return (
    <div>
      <button onClick={() => setEstaEncendido(!estaEncendido)}>
        {estaEncendido ? 'Apagar' : 'Encender'}
      </button>
      <p>{estaEncendido ? 'La luz está encendida' : 'La luz está apagada'}</p>
    </div>
  );
}

export default Toggle;
[endcode]

[st]Estado con Objetos

Cuando actualizas un objeto en el estado, asegúrate de copiar las propiedades existentes y solo modificar las que necesites.

[code:jsx]
import React, { useState } from 'react';

function UsuarioPerfil() {
  const [usuario, setUsuario] = useState({
    nombre: 'Juan',
    apellido: 'Pérez',
    edad: 30
  });

  const actualizarEdad = () => {
    setUsuario({ ...usuario, edad: usuario.edad + 1 });
  };

  return (
    <div>
      <p>Nombre: {usuario.nombre}</p>
      <p>Apellido: {usuario.apellido}</p>
      <p>Edad: {usuario.edad}</p>
      <button onClick={actualizarEdad}>Cumplir años</button>
    </div>
  );
}

export default UsuarioPerfil;
[endcode]

[st]Estado con Arrays

Similar a los objetos, cuando actualizas un array, crea una nueva copia del array.

[code:jsx]
import React, { useState } from 'react';

function ListaTareas() {
  const [tareas, setTareas] = useState(['Aprender React', 'Construir una app']);
  const [nuevaTarea, setNuevaTarea] = useState('');

  const agregarTarea = () => {
    if (nuevaTarea.trim() !== '') {
      setTareas([...tareas, nuevaTarea]); // Crea un nuevo array
      setNuevaTarea('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={nuevaTarea}
        onChange={(e) => setNuevaTarea(e.target.value)}
        placeholder="Nueva tarea"
      />
      <button onClick={agregarTarea}>Agregar Tarea</button>
      <ul>
        {tareas.map((tarea, index) => (
          <li key={index}>{tarea}</li>
        ))}
      </ul>
    </div>
  );
}

export default ListaTareas;
[endcode]

[st]Actualizaciones de Estado Funcionales (Functional Updates)

Cuando el nuevo estado depende del estado anterior, es recomendable pasar una función a la función `set` del estado. Esto asegura que siempre estés trabajando con el estado más reciente.

[code:jsx]
import React, { useState } from 'react';

function ContadorFuncional() {
  const [count, setCount] = useState(0);

  const incrementar = () => {
    // Usando una función para actualizar el estado
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div>
      <p>Conteo: {count}</p>
      <button onClick={incrementar}>Incrementar</button>
    </div>
  );
}

export default ContadorFuncional;
[endcode]

[st]Conclusión y Buenas Prácticas

*   No modifiques el estado directamente. Siempre usa la función `set` proporcionada por `useState`.
*   Trata el estado como inmutable. Para objetos y arrays, crea nuevas copias al actualizar.
*   Usa actualizaciones funcionales cuando el nuevo estado dependa del estado anterior para evitar problemas de concurrencia.
*   Divide el estado. Si un objeto de estado se vuelve muy grande o complejo, considera dividirlo en múltiples variables de estado para una mejor organización y rendimiento.

El Hook `useState` es una herramienta poderosa y esencial para construir interfaces de usuario interactivas y dinámicas en React.
