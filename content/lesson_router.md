# React Router

<!-- tags: React Router, useNavigate, createBrowserRouter, navegar después del login, Link vs a href, useNavigate fuera del Router, RouterProvider, Navigate, cerrar sesión, la página se recarga al navegar, react-router-dom, rutas -->

El login ya trae el token y lo deja en localStorage. Falta que al pulsar **Iniciar sesión** la app cambie de pantalla. Una app de React es una sola página HTML: **React Router** mira la URL y decide qué componente dibujar. Cambiar de pantalla es cambiar la URL, sin recargar nada.

```svg
<svg id="routerMapa" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 520" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="routerMapa-ttl routerMapa-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="routerMapa-ttl">Una sola página, dos pantallas</title>
  <desc id="routerMapa-dsc">A la izquierda, dos barras de direcciones del navegador: localhost:5173/ y localhost:5173/home, unidas por una flecha que dice navigate('/home'), que cambia la URL sin recargar. En el centro, el router creado con createBrowserRouter, con dos rutas: la ruta / apunta a LoginPage y la ruta /home apunta a HomePage. A la derecha, la pantalla que se dibuja en cada caso: el formulario de inicio de sesión con usuario, contraseña y botón Iniciar sesión, y la pantalla de inicio con el aviso Sesión iniciada y el botón Cerrar sesión. Abajo: el navegador pidió index.html una sola vez; al cambiar la URL, el router cambia el componente que se dibuja.</desc>
  <defs>
    <style>
      #routerMapa .title{fill:#161A26;font-size:22px;font-weight:700}
      #routerMapa .sub{fill:#79809A;font-size:13.5px}
      #routerMapa .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #routerMapa .foot{fill:#79809A;font-size:12px}
      #routerMapa .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #routerMapa .ar-purple{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#routerMapa-ar-purple)}
      #routerMapa .ar-grey{fill:none;stroke:#8A93A8;stroke-width:1.5;marker-end:url(#routerMapa-ar-grey)}
    </style>
    <marker id="routerMapa-ar-purple" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
    <marker id="routerMapa-ar-grey" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#8A93A8"/></marker>
  </defs>
  <rect width="960" height="520" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Una sola página, dos pantallas</text>
  <text class="sub" x="48" y="80" data-fit="860">La URL decide qué componente se dibuja. Cambiarla con navigate no recarga la página.</text>

  <text class="h" x="48" y="118">URL DEL NAVEGADOR</text>
  <text class="h" x="392" y="118">EL ROUTER</text>
  <text class="h" x="664" y="118">LO QUE SE DIBUJA</text>

  <rect x="48" y="170" width="280" height="40" rx="20" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/>
  <circle cx="70" cy="190" r="5" fill="#C4CBD8"/>
  <text class="mono" x="86" y="190" dy="0.35em" font-size="13" fill="#454C61" data-fit="230">localhost:5173/</text>

  <rect x="48" y="340" width="280" height="40" rx="20" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/>
  <circle cx="70" cy="360" r="5" fill="#C4CBD8"/>
  <text class="mono" x="86" y="360" dy="0.35em" font-size="13" fill="#454C61" data-fit="230">localhost:5173/home</text>

  <path class="ar-purple" d="M120,214 V334"/>
  <text class="mono" x="136" y="266" font-size="12" font-weight="700" fill="#7439B8" data-fit="190">navigate('/home')</text>
  <text x="136" y="286" font-size="12" fill="#79809A" data-fit="190">cambia la URL sin recargar</text>

  <rect x="392" y="136" width="208" height="298" rx="12" fill="#F4EBFF" fill-opacity=".55" stroke="#C9A6EE" stroke-width="1.75"/>
  <text class="mono" x="496" y="160" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8" data-fit="190">createBrowserRouter</text>

  <rect x="408" y="170" width="176" height="40" rx="8" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="496" y="190" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="160">'/' → LoginPage</text>

  <rect x="408" y="340" width="176" height="40" rx="8" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="496" y="360" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="160">'/home' → HomePage</text>

  <path class="ar-grey" d="M330,190 H402"/>
  <path class="ar-grey" d="M330,360 H402"/>
  <path class="ar-grey" d="M586,190 H658"/>
  <path class="ar-grey" d="M586,360 H658"/>

  <rect x="664" y="128" width="248" height="124" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.75"/>
  <text x="684" y="150" dy="0.35em" font-size="13" font-weight="700" fill="#4453C9" data-fit="200">Iniciar sesión</text>
  <rect x="684" y="168" width="208" height="20" rx="5" fill="#F3F5F9" stroke="#D5DAE3"/>
  <text x="692" y="178" dy="0.35em" font-size="11" fill="#8A93A8" data-fit="190">usuario</text>
  <rect x="684" y="194" width="208" height="20" rx="5" fill="#F3F5F9" stroke="#D5DAE3"/>
  <text x="692" y="204" dy="0.35em" font-size="11" fill="#8A93A8" data-fit="190">contraseña</text>
  <rect x="684" y="222" width="104" height="22" rx="6" fill="#4453C9"/>
  <text x="736" y="233" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#FFFFFF" data-fit="96">Iniciar sesión</text>

  <rect x="664" y="298" width="248" height="124" rx="12" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.75"/>
  <text x="684" y="320" dy="0.35em" font-size="13" font-weight="700" fill="#3A8235" data-fit="200">Cursos</text>
  <rect x="684" y="338" width="208" height="30" rx="6" fill="#E8F6E3"/>
  <text x="696" y="353" dy="0.35em" font-size="11.5" fill="#3A8235" data-fit="190">Sesión iniciada</text>
  <rect x="684" y="384" width="108" height="22" rx="6" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.5"/>
  <text x="738" y="395" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#3A8235" data-fit="100">Cerrar sesión</text>

  <text class="foot" x="48" y="482" data-fit="860">El navegador pidió index.html una sola vez. Al cambiar la URL, el router cambia el componente que se dibuja.</text>
</svg>
```

## Instalación

```bash
npm install react-router-dom
```

## Las dos pantallas

Hoy el formulario vive en `App.jsx`. Muévelo a su propio componente, `src/pages/LoginPage.jsx`, y crea `src/pages/HomePage.jsx` con un título cualquiera. Cada pantalla es un componente normal; lo único especial es que el router decide cuándo se dibuja.

## Definir las rutas

`App.jsx` queda con una sola tarea: crear el router y entregárselo a la app. Lo que necesitas:

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
```

El router es una lista de objetos: `path` es la URL y `element` el componente que se dibuja ahí.

```jsx
const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/home', element: <HomePage /> },
]);
```

Y lo que devuelve `App`:

```jsx
return <RouterProvider router={router} />;
```

Para comprobarlo, escribe `localhost:5173/home` en la barra de direcciones: debe aparecer `HomePage`.

## Navegar después del login

```svg
<svg id="routerLogin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 430" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="routerLogin-ttl routerLogin-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="routerLogin-ttl">Qué pasa al pulsar Iniciar sesión</title>
  <desc id="routerLogin-dsc">Cuatro pasos en fila. Uno, login: await login(), que hace el POST a /auth/login y el backend responde con el accessToken. Dos, guardar: localStorage.setItem('accessToken'), el token sobrevive a recargar. Tres, navegar: navigate('/home') cambia la URL sin recargar. Cuatro, segunda pantalla: el router monta HomePage, que lee el token. Debajo del cuarto paso, una nota: aquí entra useEffect, para traer la lista de posts al abrir la pantalla.</desc>
  <defs>
    <style>
      #routerLogin .title{fill:#161A26;font-size:22px;font-weight:700}
      #routerLogin .sub{fill:#79809A;font-size:13.5px}
      #routerLogin .foot{fill:#79809A;font-size:12px}
      #routerLogin .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #routerLogin .ar-grey{fill:none;stroke:#8A93A8;stroke-width:1.75;marker-end:url(#routerLogin-ar-grey)}
    </style>
    <marker id="routerLogin-ar-grey" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#8A93A8"/></marker>
  </defs>
  <rect width="960" height="430" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Qué pasa al pulsar Iniciar sesión</text>
  <text class="sub" x="48" y="80" data-fit="860">Tres pasos los escribes tú. El cuarto lo hace el router.</text>

  <rect x="60" y="112" width="192" height="152" rx="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.75"/>
  <circle cx="88" cy="140" r="13" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.5"/><text x="88" y="140" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#4453C9">1</text>
  <text x="110" y="140" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9" data-fit="130">Login</text>
  <rect x="76" y="166" width="160" height="28" rx="6" fill="#FFFFFF"/>
  <text class="mono" x="156" y="180" dy="0.35em" text-anchor="middle" font-size="10.5" fill="#454C61" data-fit="152">await login()</text>
  <text x="76" y="222" font-size="12" fill="#556074" data-fit="160">el backend responde</text>
  <text x="76" y="240" font-size="12" fill="#556074" data-fit="160">con el accessToken</text>

  <rect x="276" y="112" width="192" height="152" rx="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/>
  <circle cx="304" cy="140" r="13" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.5"/><text x="304" y="140" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#A96C05">2</text>
  <text x="326" y="140" dy="0.35em" font-size="14" font-weight="700" fill="#A96C05" data-fit="130">Guardar</text>
  <rect x="292" y="166" width="160" height="28" rx="6" fill="#FFFFFF"/>
  <text class="mono" x="372" y="180" dy="0.35em" text-anchor="middle" font-size="10.5" fill="#454C61" data-fit="152">setItem('accessToken')</text>
  <text x="292" y="222" font-size="12" fill="#556074" data-fit="160">el token sobrevive</text>
  <text x="292" y="240" font-size="12" fill="#556074" data-fit="160">a recargar la página</text>

  <rect x="492" y="112" width="192" height="152" rx="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="2.5"/>
  <circle cx="520" cy="140" r="13" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="520" y="140" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8">3</text>
  <text x="542" y="140" dy="0.35em" font-size="14" font-weight="700" fill="#7439B8" data-fit="130">Navegar</text>
  <rect x="508" y="166" width="160" height="28" rx="6" fill="#FFFFFF"/>
  <text class="mono" x="588" y="180" dy="0.35em" text-anchor="middle" font-size="10.5" fill="#454C61" data-fit="152">navigate('/home')</text>
  <text x="508" y="222" font-size="12" fill="#556074" data-fit="160">cambia la URL</text>
  <text x="508" y="240" font-size="12" fill="#556074" data-fit="160">sin recargar</text>

  <rect x="708" y="112" width="192" height="152" rx="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.75"/>
  <circle cx="736" cy="140" r="13" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.5"/><text x="736" y="140" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#3A8235">4</text>
  <text x="758" y="140" dy="0.35em" font-size="14" font-weight="700" fill="#3A8235" data-fit="130">Otra pantalla</text>
  <rect x="724" y="166" width="160" height="28" rx="6" fill="#FFFFFF"/>
  <text class="mono" x="804" y="180" dy="0.35em" text-anchor="middle" font-size="10.5" fill="#454C61" data-fit="152">&lt;HomePage /&gt;</text>
  <text x="724" y="222" font-size="12" fill="#556074" data-fit="160">el router la monta</text>
  <text x="724" y="240" font-size="12" fill="#556074" data-fit="160">y ella lee el token</text>

  <path class="ar-grey" d="M254,188 H270"/>
  <path class="ar-grey" d="M470,188 H486"/>
  <path class="ar-grey" d="M686,188 H702"/>

  <path d="M804,266 V304" stroke="#9FD68D" stroke-width="1.5" stroke-dasharray="4 4" fill="none"/>
  <rect x="588" y="304" width="312" height="56" rx="10" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.5"/>
  <text x="604" y="324" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="280">Aquí entra useEffect</text>
  <text x="604" y="343" dy="0.35em" font-size="12" fill="#556074" data-fit="280">para traer los cursos al abrir la pantalla</text>

  <text class="foot" x="48" y="398" data-fit="860">Los pasos 1 y 2 ocurren dentro de login(). El 3, en handleLogin cuando login() terminó. El 4 ocurre solo.</text>
</svg>
```

Para cambiar de pantalla desde el código hacen falta tres líneas en `LoginPage`. El import:

```jsx
import { useNavigate } from 'react-router-dom';
```

Dentro del componente, junto a los `useState`:

```jsx
const navigate = useNavigate();
```

Y en `handleLogin`, cuando el login ya salió bien:

```jsx
navigate('/home');
```

`login()` es asíncrona, así que `handleLogin` tiene que esperarla con `await` antes de navegar. Si no, la app cambia de pantalla antes de que llegue el token. Y si el login falla, el error salta antes del `navigate` y el usuario se queda en el formulario.

Un error típico: `useNavigate() may be used only in the context of a <Router> component`. Sale si llamas `useNavigate` en un componente que el router no dibuja, por ejemplo en el propio `App`. Funciona en las páginas de las rutas y en sus hijos.

## Cerrar sesión

En `HomePage`, un botón de **Cerrar sesión** hace lo contrario: borra el token y vuelve al login.

```jsx
localStorage.removeItem('accessToken');
navigate('/', { replace: true });
```

Con `replace: true` la URL nueva reemplaza a `/home` en el historial, y el botón *Atrás* del navegador no devuelve a una pantalla sin sesión.

## Si no hay token

Cualquiera puede escribir `/home` en la barra sin haber entrado. Para eso está `<Navigate>`, la versión en JSX de `navigate`: si `HomePage` no encuentra el token, devuelve esto en lugar de la pantalla.

```jsx
return <Navigate to="/" replace />;
```

Se importa igual que `useNavigate`, desde `react-router-dom`.

## Link en vez de a

Para un enlace que lleva a otra pantalla de la app no se usa `<a href>`. Un `<a>` le pide al servidor una página nueva: se recarga todo y se pierde el estado de React. Se usa `Link`, que cambia la URL igual que `navigate`:

```jsx
<Link to="/home">Ir al inicio</Link>
```

Ya estamos en la segunda pantalla con el token guardado. Falta pedir los cursos al backend en cuanto `HomePage` aparece, y para eso está la siguiente lección: **useEffect**.
