# useEffect

<!-- tags: useEffect, efecto, array de dependencias, useEffect con [], el efecto se ejecuta dos veces, bucle infinito de renders, función de limpieza, cargar datos de una API, setState dentro de useEffect, AbortController -->

Un componente es una función que React llama para dibujar. Pero a veces hay que hacer algo que **no es dibujar**: pedir datos al backend, poner un temporizador, cambiar el título de la pestaña. Eso es un **efecto**, y `useEffect` le dice a React que lo corra **después de pintar** la pantalla.

## Cargar una lista al abrir la página

El caso de siempre: al abrir la app hay que traer los posts del backend y mostrarlos. Pulsa **Cargar la página** y sigue los pasos; con *Paso a paso* avanzas tú y en *Código* ves qué línea corre en cada momento.

```interactive
react-effect
```

Fíjate en el orden. Primero React llama a `App()` con `posts = []`, monta el DOM y la pantalla muestra *Cargando...*; **solo entonces** corre el efecto y sale el `GET`. Cuando llega la respuesta, `setPosts(data)` cambia el estado y hay un segundo render, ahora con la lista. Ese es el patrón para cargar datos: **lo que trae el efecto se guarda en el estado, y el estado dibuja la pantalla**.

`getPosts()` es una función que pide la lista al backend y devuelve una promesa. En la lección de **Axios** la escribimos de verdad.

## Anatomía de useEffect

```jsx
import { useEffect } from 'react';

useEffect(() => {
  // lo que hay que hacer después de pintar
}, [dependencias]);
```

Recibe dos cosas: la **función del efecto** y el **arreglo de dependencias**. Después de cada render, React compara las dependencias con las del render anterior y solo vuelve a correr el efecto si alguna cambió. En el primer render corre siempre.

- `[]`: no hay nada que pueda cambiar, así que corre **una sola vez**, al montar.
- `[page]`: corre al montar y cada vez que `page` cambie.
- Sin arreglo: corre después de **todos** los renders. Casi nunca es lo que quieres.

## Con una dependencia

Pasa a la pestaña **Con dependencia · [page]**. Carga la página y pulsa **Siguiente** en la app: `setPage` provoca un render, React ve que `[page]` pasó de `[1]` a `[2]` y vuelve a correr el efecto con la página nueva.

```jsx
useEffect(() => {
  getPosts(page).then((data) => setPosts(data));
}, [page]);
```

La regla práctica: **toda variable del componente que uses dentro del efecto va en las dependencias**. Si usas `page` y no la pones, el efecto se queda con la página 1 para siempre.

## El error típico: llamar a la API en el cuerpo

Ahora la pestaña **Sin useEffect**. Es el mismo componente, pero con `getPosts()` suelta en el cuerpo de la función. Como el cuerpo corre en cada render, cada render pide la lista; cada respuesta llama a `setPosts` con un arreglo nuevo, que provoca otro render, que vuelve a pedir la lista. Mira el contador de peticiones: es un **bucle infinito**, y el backend lo nota.

La llamada va dentro de un `useEffect`, con sus dependencias.

## La función de limpieza

Si el efecto **devuelve una función**, React la llama antes de volver a correr el efecto y cuando el componente desaparece. Sirve para deshacer lo que el efecto dejó andando: un temporizador, un listener o una petición que ya no hace falta.

```jsx
useEffect(() => {
  const controller = new AbortController();

  getPosts(page, controller.signal)
    .then((data) => setPosts(data))
    .catch(() => {});

  return () => controller.abort();
}, [page]);
```

Si el usuario pulsa **Siguiente** dos veces seguidas, la limpieza cancela la petición de la página 2 antes de pedir la 3. Sin ella, la respuesta vieja podría llegar de última y pisar la nueva.

## ¿Por qué corre dos veces?

En desarrollo, con `<StrictMode>` en `main.jsx`, React monta el componente, lo desmonta y lo vuelve a montar, a propósito: así se nota si a un efecto le falta su limpieza. Por eso ves el `console.log` del efecto dos veces y dos peticiones en la pestaña *Network*. En el build de producción pasa una sola vez.
