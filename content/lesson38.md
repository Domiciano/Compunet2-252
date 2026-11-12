# Local Storage

<!-- tags: localStorage, setItem, getItem, removeItem, guardar el token, accessToken, getItem devuelve null, se pierde al recargar, cerrar sesión, XSS -->

Todo lo que vive en una variable de JavaScript, incluido el estado de React, desaparece al recargar la página. `localStorage` es un pequeño almacén del navegador, **clave → valor**, que sobrevive a las recargas y a cerrar el navegador. Es donde se guarda el token del login, para no tener que entrar de nuevo cada vez que se recarga.

## Pruébalo

Pulsa **setItem**, luego **Recargar la página** y después **getItem**. La variable `token` se borra al recargar; lo que está en localStorage no.

```interactive
local-storage
```

## Las tres funciones

```js
localStorage.setItem('accessToken', token);

const token = localStorage.getItem('accessToken');

localStorage.removeItem('accessToken');
```

- `setItem(clave, valor)` guarda. Si la clave ya existía, la reemplaza.
- `getItem(clave)` lee. Si no hay nada con esa clave devuelve `null`, así que antes de usar el valor hay que revisarlo.
- `removeItem(clave)` borra. Es lo que se hace al **cerrar sesión**.

Los valores siempre se guardan como **texto**: `setItem('n', 5)` guarda `'5'`. Para un objeto hay que pasarlo por `JSON.stringify` al guardar y por `JSON.parse` al leer.

Puedes ver lo que tiene guardado cualquier página en las herramientas del navegador: *DevTools → Application → Local Storage*.

## En el proyecto

Hasta ahora `login()` en `services/AuthServices.js` solo imprime el token. Cambia ese `console.log` por:

```js
localStorage.setItem('accessToken', response.data.accessToken);
```

Inicia sesión y revisa *DevTools → Application → Local Storage*: ahí debe estar `accessToken`. Recarga y sigue ahí.

## Un cuidado

Cualquier JavaScript que corra en la página puede leer localStorage. Si la app tuviera una vulnerabilidad de **XSS**, un script ajeno podría llevarse el token. Por eso ahí no se guardan contraseñas ni datos sensibles: solo el token, que además vence.

## Y ahora

Con el token guardado, el login ya cumplió. Lo siguiente es sacar al usuario de esa pantalla y llevarlo a la pantalla principal: eso es la lección **React Router**.
