# Taller en clase · Del login a la lista de cursos

<!-- tags: taller, login con token, localStorage, React Router, HomePage, useEffect, GET courses, CORS, setState con la respuesta, lista de cursos -->

Une todo lo de la semana en una sola app: la persona inicia sesión, la app guarda el token, pasa a la pantalla de inicio y muestra los cursos que trae el backend. Cada goal termina con la lección que lo explica.

## Antes de empezar

Clona los dos repositorios de arranque:

- Backend: [262WebApp6](https://github.com/Domiciano/262WebApp6). Arráncalo y deja corriendo `http://localhost:8080/WebApp6`.
- Frontend: [262WebApp7](https://github.com/Domiciano/262WebApp7). Corre `npm install` y `npm run dev`.

En `src/services/Api.js`, cambia la IP del `baseURL` por `localhost`. Para entrar puedes usar `nicolas` / `123456`.

## Goals

- [ ] El login manda el usuario y la contraseña que escribe la persona, no unos fijos. [Manejo de errores](https://domicianorincon.github.io/Computacion2/lesson/0104)
- [ ] Si el login falla, la pantalla dice por qué. [Manejo de errores](https://domicianorincon.github.io/Computacion2/lesson/0104)
- [ ] Al iniciar sesión, el token queda en localStorage y sigue ahí después de recargar. [Local Storage](https://domicianorincon.github.io/Computacion2/lesson/0062)
- [ ] La app tiene dos páginas: `LoginPage` en `/` y `HomePage` en `/home`. [React Router](https://domicianorincon.github.io/Computacion2/lesson/0103)
- [ ] Con un login correcto, la app pasa sola a `HomePage`. [React Router](https://domicianorincon.github.io/Computacion2/lesson/0103)
- [ ] El backend acepta peticiones que vienen de `http://localhost:5173`. [CORS](https://domicianorincon.github.io/Computacion2/lesson/0102)
- [ ] Al abrir `HomePage`, la app pide los cursos con un `GET` que lleva el token. [useEffect](https://domicianorincon.github.io/Computacion2/lesson/0054)
- [ ] Los cursos que llegan quedan en el estado de `HomePage` y se ven en una lista. [useEffect](https://domicianorincon.github.io/Computacion2/lesson/0054)

El token se manda a mano en el header `Authorization` de la petición, sin interceptores. [Axios](https://domicianorincon.github.io/Computacion2/lesson/0056)

## Si te sobra tiempo

- [ ] Un botón de cerrar sesión borra el token y vuelve al login. [React Router](https://domicianorincon.github.io/Computacion2/lesson/0103)
- [ ] Si alguien abre `/home` sin token, la app lo devuelve al login. [React Router](https://domicianorincon.github.io/Computacion2/lesson/0103)
