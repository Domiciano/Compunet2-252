# Uso de Endpoints Autorizados

Para acceder a ciertos recursos protegidos, es necesario utilizar un **token de autorización**. Este token se almacena normalmente en el `localStorage` del navegador y se envía en las cabeceras de las peticiones a los endpoints que lo requieran.

También es importante saber **cómo cargar datos desde el inicio del ciclo de vida del componente**, lo cual se logra utilizando el hook `useEffect`.

---

# `useEffect` en React

`useEffect` es un hook de React que permite ejecutar **efectos secundarios** en componentes funcionales. Se ejecuta después del renderizado y es útil para:

- Llamadas a APIs
- Subscripciones a eventos
- Manipulación directa del DOM
- Sincronización con sistemas externos

## Ejemplo básico

```js
import { useEffect } from 'react';

useEffect(() => {
  console.log("El componente se montó");
}, []);
```

- Si se pasa un array vacío `[]` como segundo argumento, el efecto se ejecuta **solo una vez**, justo después del montaje del componente (equivalente a `componentDidMount`).
- Si se pasan dependencias, el efecto se ejecutará cada vez que cambie alguna de ellas.

## Ejemplo con llamada a API y token

```js
import { useEffect } from 'react';

useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch("https://api.example.com/data", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log(data);
  };
  fetchData();
}, []);
```

---

# Uso de `localStorage`

El `localStorage` permite guardar datos persistentes en el navegador.

## Guardar un token

```js
localStorage.setItem('token', token);
```

## Recuperar un token

```js
const token = localStorage.getItem('token');
```

## Eliminar un token

```js
localStorage.removeItem('token');
```

---

# Buenas prácticas

- **Limpieza de efectos:** Si el efecto genera una suscripción o un temporizador, recuerda limpiarlo para evitar efectos secundarios no deseados.

```js
useEffect(() => {
  const id = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(id);
}, []);
```

- **Evita efectos innecesarios:** Asegúrate de no incluir en el array de dependencias valores que cambian en cada render, como funciones o valores calculados internamente.


## Ejemplo con dependencias

Puedes incluir variables en el array del segundo parámetro para que el efecto se ejecute cada vez que esas variables cambien:

```js
import { useEffect, useState } from 'react';

function MiComponente() {
  const [usuarioId, setUsuarioId] = useState(1);

  useEffect(() => {
    console.log(`Se cargaron datos del usuario ${usuarioId}`);
  }, [usuarioId]); // Se ejecuta cada vez que usuarioId cambie

  return <button onClick={() => setUsuarioId(usuarioId + 1)}>Cambiar usuario</button>;
}
```