# React Router

<!-- tags: React Router, useNavigate, createBrowserRouter, navegar después del login, Link vs a href, useNavigate fuera del Router, RouterProvider, Navigate, cerrar sesión, la página se recarga al navegar, react-router-dom, rutas -->

El login ya trae el token y lo deja en localStorage. Falta lo que cualquier usuario espera: que al pulsar **Entrar** la app cambie de pantalla. Una app de React es una sola página HTML; **React Router** mira la URL y decide qué componente dibujar, así que cambiar de pantalla es cambiar la URL, sin recargar nada.

```svg
<svg id="routerMapa" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 520" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="routerMapa-ttl routerMapa-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="routerMapa-ttl">Una sola página, dos pantallas</title>
  <desc id="routerMapa-dsc">A la izquierda, dos barras de direcciones del navegador: localhost:5173/ y localhost:5173/posts, unidas por una flecha que dice navigate('/posts'), que cambia la URL sin recargar. En el centro, el router creado con createBrowserRouter, con dos rutas: la ruta / apunta a LoginPage y la ruta /posts apunta a PostsPage. A la derecha, la pantalla que se dibuja en cada caso: el formulario de inicio de sesión con usuario, contraseña y botón Entrar, y la pantalla de posts con el aviso Sesión iniciada y el botón Cerrar sesión. Abajo: el navegador pidió index.html una sola vez; al cambiar la URL, el router cambia el componente que se dibuja.</desc>
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
  <text class="mono" x="86" y="360" dy="0.35em" font-size="13" fill="#454C61" data-fit="230">localhost:5173/posts</text>

  <path class="ar-purple" d="M120,214 V334"/>
  <text class="mono" x="136" y="266" font-size="12" font-weight="700" fill="#7439B8" data-fit="190">navigate('/posts')</text>
  <text x="136" y="286" font-size="12" fill="#79809A" data-fit="190">cambia la URL sin recargar</text>

  <rect x="392" y="136" width="208" height="298" rx="12" fill="#F4EBFF" fill-opacity=".55" stroke="#C9A6EE" stroke-width="1.75"/>
  <text class="mono" x="496" y="160" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8" data-fit="190">createBrowserRouter</text>

  <rect x="408" y="170" width="176" height="40" rx="8" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="496" y="190" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="160">'/' → LoginPage</text>

  <rect x="408" y="340" width="176" height="40" rx="8" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="496" y="360" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="160">'/posts' → PostsPage</text>

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
  <rect x="684" y="222" width="72" height="22" rx="6" fill="#4453C9"/>
  <text x="720" y="233" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#FFFFFF" data-fit="64">Entrar</text>

  <rect x="664" y="298" width="248" height="124" rx="12" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.75"/>
  <text x="684" y="320" dy="0.35em" font-size="13" font-weight="700" fill="#3A8235" data-fit="200">Posts</text>
  <rect x="684" y="338" width="208" height="30" rx="6" fill="#E8F6E3"/>
  <text x="696" y="353" dy="0.35em" font-size="11.5" fill="#3A8235" data-fit="190">Sesión iniciada</text>
  <rect x="684" y="384" width="108" height="22" rx="6" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.5"/>
  <text x="738" y="395" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#3A8235" data-fit="100">Cerrar sesión</text>

  <text class="foot" x="48" y="482" data-fit="860">El navegador pidió index.html una sola vez. Al cambiar la URL, el router cambia el componente que se dibuja.</text>
</svg>
```

## Instalación y las dos páginas

```bash
npm install react-router-dom
```

Cada pantalla es un componente normal en `src/pages/`. `LoginPage` es el `LoginForm` de la lección **Axios**, movido a su propio archivo. `PostsPage`, por ahora, solo confirma que hay sesión.

```jsx
// src/pages/PostsPage.jsx
export default function PostsPage() {
  return <h1>Sesión iniciada</h1>;
}
```

## Definir las rutas

El router es una lista de objetos: `path` es la URL y `element` el componente que se dibuja ahí. `RouterProvider` lo conecta con la app.

```jsx
// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PostsPage from './pages/PostsPage';

const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/posts', element: <PostsPage /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

Escribe `localhost:5173/posts` en la barra de direcciones y verás `PostsPage`; con `localhost:5173/`, el login.

## Navegar después del login

```svg
<svg id="routerLogin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 430" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="routerLogin-ttl routerLogin-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="routerLogin-ttl">Qué pasa al pulsar Entrar</title>
  <desc id="routerLogin-dsc">Cuatro pasos en fila. Uno, login: api.post('/auth/login') y el backend responde con el accessToken. Dos, guardar: localStorage.setItem('accessToken'), el token sobrevive a recargar. Tres, navegar: navigate('/posts') cambia la URL sin recargar. Cuatro, segunda pantalla: el router monta PostsPage, que lee el token. Debajo del cuarto paso, una nota: aquí entra useEffect, para traer la lista de posts al abrir la pantalla.</desc>
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
  <text class="title" x="48" y="56">Qué pasa al pulsar Entrar</text>
  <text class="sub" x="48" y="80" data-fit="860">El handleSubmit del login hace tres cosas seguidas. La cuarta la hace el router.</text>

  <rect x="60" y="112" width="192" height="152" rx="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.75"/>
  <circle cx="88" cy="140" r="13" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.5"/><text x="88" y="140" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#4453C9">1</text>
  <text x="110" y="140" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9" data-fit="130">Login</text>
  <rect x="76" y="166" width="160" height="28" rx="6" fill="#FFFFFF"/>
  <text class="mono" x="156" y="180" dy="0.35em" text-anchor="middle" font-size="10.5" fill="#454C61" data-fit="152">api.post('/auth/login')</text>
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
  <text class="mono" x="588" y="180" dy="0.35em" text-anchor="middle" font-size="10.5" fill="#454C61" data-fit="152">navigate('/posts')</text>
  <text x="508" y="222" font-size="12" fill="#556074" data-fit="160">cambia la URL</text>
  <text x="508" y="240" font-size="12" fill="#556074" data-fit="160">sin recargar</text>

  <rect x="708" y="112" width="192" height="152" rx="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.75"/>
  <circle cx="736" cy="140" r="13" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.5"/><text x="736" y="140" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#3A8235">4</text>
  <text x="758" y="140" dy="0.35em" font-size="14" font-weight="700" fill="#3A8235" data-fit="130">Otra pantalla</text>
  <rect x="724" y="166" width="160" height="28" rx="6" fill="#FFFFFF"/>
  <text class="mono" x="804" y="180" dy="0.35em" text-anchor="middle" font-size="10.5" fill="#454C61" data-fit="152">&lt;PostsPage /&gt;</text>
  <text x="724" y="222" font-size="12" fill="#556074" data-fit="160">el router la monta</text>
  <text x="724" y="240" font-size="12" fill="#556074" data-fit="160">y ella lee el token</text>

  <path class="ar-grey" d="M254,188 H270"/>
  <path class="ar-grey" d="M470,188 H486"/>
  <path class="ar-grey" d="M686,188 H702"/>

  <path d="M804,266 V304" stroke="#9FD68D" stroke-width="1.5" stroke-dasharray="4 4" fill="none"/>
  <rect x="588" y="304" width="312" height="56" rx="10" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.5"/>
  <text x="604" y="324" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="280">Aquí entra useEffect</text>
  <text x="604" y="343" dy="0.35em" font-size="12" fill="#556074" data-fit="280">para traer los posts al abrir la pantalla</text>

  <text class="foot" x="48" y="398" data-fit="860">Los pasos 1 a 3 corren dentro de handleSubmit. El 4 ocurre solo, porque la URL cambió.</text>
</svg>
```

`useNavigate` devuelve una función que cambia la URL desde el código. Se llama cuando el login salió bien, justo después de guardar el token.

```jsx
// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });
      localStorage.setItem('accessToken', response.data.accessToken);
      navigate('/posts');
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  // el return con el <form> es el mismo de la lección Axios
}
```

Si el login falla, Axios salta al `catch` y `navigate` nunca corre: el usuario se queda en el login viendo el error.

Un error típico: `useNavigate() may be used only in the context of a <Router> component`. Sale cuando se llama `useNavigate` en un componente que no está dentro del `RouterProvider`, por ejemplo en el propio `App`. Solo funciona en las páginas que el router dibuja y en sus hijos.

## Cerrar sesión

En `PostsPage`, cerrar sesión es lo contrario: borrar el token y volver al login. Con `replace: true` la URL nueva reemplaza a `/posts` en el historial, así el botón *Atrás* no devuelve a una pantalla sin sesión.

```jsx
// src/pages/PostsPage.jsx
import { Navigate, useNavigate } from 'react-router-dom';

export default function PostsPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const logout = () => {
    localStorage.removeItem('accessToken');
    navigate('/', { replace: true });
  };

  return (
    <div>
      <h1>Sesión iniciada</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

`<Navigate>` es la versión en JSX de `navigate`: si alguien escribe `/posts` a mano sin haber entrado, no hay token y la página lo devuelve al login apenas se dibuja.

## Link en vez de a

Para un enlace que el usuario pulsa se usa `<Link to="/posts">`, no `<a href="/posts">`. Un `<a>` le pide al servidor una página nueva: se recarga todo y se pierde el estado de React. `Link` cambia la URL igual que `navigate`, sin recargar.

```jsx
import { Link } from 'react-router-dom';

<Link to="/posts">Ver posts</Link>
```

Ya estamos en la segunda pantalla con el token en la mano. Lo que falta es pedir la lista al backend en cuanto `PostsPage` aparece, y para eso está la siguiente lección: **useEffect**.
