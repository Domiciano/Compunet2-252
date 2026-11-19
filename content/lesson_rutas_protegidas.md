# Rutas protegidas

<!-- tags: rutas protegidas, Outlet, ProtectedRoute, entrar a /home sin login, Navigate, children en createBrowserRouter, pantalla en blanco sin Outlet, redirección infinita, layout compartido, token vencido 401, ruta sin path, proteger la ruta no es seguridad -->

Cualquiera puede escribir `localhost:5173/home` en la barra sin haber iniciado sesión. En React Router se resolvió poniendo un `if` dentro de `HomePage`, pero con cinco pantallas privadas serían cinco copias del mismo `if`. Una **ruta protegida** pone esa revisión en un solo lugar: un componente que va **antes** de las pantallas privadas y decide si las deja pasar.

```svg
<svg id="rutaProt" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 460" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="rutaProt-ttl rutaProt-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="rutaProt-ttl">Un guardia delante de las pantallas privadas</title>
  <desc id="rutaProt-dsc">A la izquierda, el router creado con createBrowserRouter. La ruta / apunta a LoginPage y es pública. Debajo, una ruta sin path cuyo elemento es ProtectedRoute; sus children son /home con HomePage y /profile con ProfilePage. A la derecha, qué pasa al abrir localhost:5173/home: ProtectedRoute pregunta si hay accessToken en localStorage. Si lo hay, devuelve Outlet y en ese hueco se dibuja HomePage. Si no lo hay, devuelve Navigate hacia / y la persona vuelve al login. Abajo: un solo if protege todas las rutas que cuelgan de ProtectedRoute.</desc>
  <defs>
    <style>
      #rutaProt .title{fill:#161A26;font-size:22px;font-weight:700}
      #rutaProt .sub{fill:#79809A;font-size:13.5px}
      #rutaProt .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #rutaProt .foot{fill:#79809A;font-size:12px}
      #rutaProt .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #rutaProt .ar-grey{fill:none;stroke:#8A93A8;stroke-width:1.5;marker-end:url(#rutaProt-ar-grey)}
      #rutaProt .ar-amber{fill:none;stroke:#C98A0E;stroke-width:1.75;marker-end:url(#rutaProt-ar-amber)}
    </style>
    <marker id="rutaProt-ar-grey" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#8A93A8"/></marker>
    <marker id="rutaProt-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C98A0E"/></marker>
  </defs>
  <rect width="960" height="460" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Un guardia delante de las pantallas privadas</text>
  <text class="sub" x="48" y="80" data-fit="860">ProtectedRoute no dibuja nada propio: deja pasar a la ruta hija o manda al login.</text>

  <text class="h" x="48" y="118">EL ROUTER</text>
  <text class="h" x="520" y="118">SE ABRE /home</text>

  <rect x="48" y="132" width="420" height="262" rx="12" fill="#F4EBFF" fill-opacity=".55" stroke="#C9A6EE" stroke-width="1.75"/>
  <text class="mono" x="258" y="154" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8" data-fit="380">createBrowserRouter</text>

  <rect x="68" y="174" width="380" height="40" rx="8" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="86" y="194" dy="0.35em" font-size="12" fill="#454C61" data-fit="250">'/' → LoginPage</text>
  <rect x="362" y="184" width="70" height="20" rx="10" fill="#EEF1FF"/>
  <text x="397" y="194" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#4453C9" data-fit="62">pública</text>

  <rect x="68" y="230" width="380" height="148" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/>
  <text class="mono" x="86" y="252" dy="0.35em" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="200">&lt;ProtectedRoute /&gt;</text>
  <text x="430" y="252" dy="0.35em" text-anchor="end" font-size="11" fill="#A96C05" data-fit="150">sin path · children</text>
  <rect x="92" y="274" width="332" height="38" rx="8" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="110" y="293" dy="0.35em" font-size="12" fill="#454C61" data-fit="300">'/home' → HomePage</text>
  <rect x="92" y="322" width="332" height="38" rx="8" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="110" y="341" dy="0.35em" font-size="12" fill="#454C61" data-fit="300">'/profile' → ProfilePage</text>

  <rect x="520" y="132" width="392" height="40" rx="20" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/>
  <circle cx="542" cy="152" r="5" fill="#C4CBD8"/>
  <text class="mono" x="558" y="152" dy="0.35em" font-size="13" fill="#454C61" data-fit="330">localhost:5173/home</text>
  <path class="ar-grey" d="M716,174 V206"/>

  <rect x="520" y="212" width="392" height="58" rx="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/>
  <text x="716" y="234" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#A96C05" data-fit="370">¿Hay accessToken en localStorage?</text>
  <text class="mono" x="716" y="254" dy="0.35em" text-anchor="middle" font-size="11" fill="#556074" data-fit="370">localStorage.getItem('accessToken')</text>
  <path class="ar-amber" d="M450,252 H514"/>

  <path class="ar-grey" d="M612,272 V306"/>
  <path class="ar-grey" d="M820,272 V306"/>

  <rect x="520" y="312" width="184" height="82" rx="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.75"/>
  <text x="536" y="332" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="150">Sí</text>
  <text class="mono" x="536" y="354" dy="0.35em" font-size="12" fill="#454C61" data-fit="152">&lt;Outlet /&gt;</text>
  <text x="536" y="376" dy="0.35em" font-size="11.5" fill="#556074" data-fit="152">ahí se dibuja HomePage</text>

  <rect x="728" y="312" width="184" height="82" rx="12" fill="#FDECEA" stroke="#EBA59F" stroke-width="1.75"/>
  <text x="744" y="332" dy="0.35em" font-size="12.5" font-weight="700" fill="#C2413A" data-fit="150">No</text>
  <text class="mono" x="744" y="354" dy="0.35em" font-size="11" fill="#454C61" data-fit="152">&lt;Navigate to="/" /&gt;</text>
  <text x="744" y="376" dy="0.35em" font-size="11.5" fill="#556074" data-fit="152">vuelve al login</text>

  <text class="foot" x="48" y="430" data-fit="860">Un solo if protege todas las rutas que cuelgan de ProtectedRoute. Para proteger otra pantalla, se agrega a sus children.</text>
</svg>
```

## Qué es Outlet

`Outlet` es un **hueco**. Lo pone una ruta padre en su JSX, y React Router dibuja ahí la ruta hija que coincide con la URL. Si la URL es `/home`, en el `Outlet` aparece `HomePage`; si es `/profile`, aparece `ProfilePage`. El padre no sabe cuál de las dos va a ser: solo reserva el lugar.

Con eso, una ruta protegida es un padre que, antes de abrir el hueco, revisa si hay sesión.

## El componente ProtectedRoute

Crea `src/components/ProtectedRoute.jsx`:

```jsx
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
```

Es el mismo `if` de la lección de React Router, sacado de `HomePage`. Con `replace`, la URL `/home` no queda en el historial y el botón *Atrás* no vuelve a intentarla.

## Colgar las rutas privadas

En `App.jsx`, `ProtectedRoute` entra al router como una ruta **sin `path`**. No aporta URL propia: solo envuelve a sus `children`.

```jsx
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/home', element: <HomePage /> },
    ],
  },
]);
```

`LoginPage` queda afuera: es la única pantalla que se tiene que ver sin token. Ahora `HomePage` ya no necesita su propio `if (!token) return <Navigate ... />`: bórralo, junto con el import de `Navigate`. Cada pantalla privada nueva se agrega a esos `children` y queda protegida sin escribir nada más.

Para probarlo, borra el token en *DevTools → Application → Local Storage* y escribe `localhost:5173/home`: la app te devuelve al login.

Dos errores típicos:

- **Pantalla en blanco en `/home`.** `ProtectedRoute` devuelve otra cosa (un `<div>`, `null`) en vez de `<Outlet />`. El router encontró la ruta hija, pero no hay hueco donde dibujarla.
- **La página no carga y la consola se llena.** Metiste `/` dentro de los `children` de `ProtectedRoute`. Sin token, el guardia manda a `/`, que también está protegida, que manda a `/`… y así sin fin. El login siempre va afuera.

## Un layout para todas las pantallas privadas

`Outlet` también sirve para lo que se repite en varias pantallas, como una barra arriba con el botón de cerrar sesión. Un `AppLayout`, en `src/components/AppLayout.jsx`, dibuja la barra y deja el hueco debajo:

```jsx
import { Outlet, useNavigate } from 'react-router-dom';

function AppLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('accessToken');
    navigate('/', { replace: true });
  }

  return (
    <>
      <header>
        <span>Cursos</span>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </header>
      <Outlet />
    </>
  );
}

export default AppLayout;
```

Se importa en `App.jsx` igual que `ProtectedRoute` y se cuelga dentro de él. Las pantallas van dentro del layout:

```jsx
{
  element: <ProtectedRoute />,
  children: [
    {
      element: <AppLayout />,
      children: [
        { path: '/home', element: <HomePage /> },
      ],
    },
  ],
},
```

Al abrir `/home` se arman tres capas, cada una dentro del `Outlet` de la anterior: `ProtectedRoute` → `AppLayout` → `HomePage`. Si no hay token, la cadena se corta en la primera.

## Proteger la ruta no es seguridad

`ProtectedRoute` solo mira si **existe** algo en localStorage. Cualquiera puede escribir `accessToken = hola` en DevTools y la app lo deja pasar a `/home`. No pasa nada grave: el `GET` de los cursos llega al backend con un token que no sirve, y Spring Security responde **401**. La que protege los datos es la API; la ruta protegida solo evita mostrar una pantalla que no va a funcionar.

Lo mismo pasa con un token **vencido**: está en localStorage, el guardia lo deja pasar y el backend lo rechaza. Por eso `HomePage`, al atrapar el error del `GET`, revisa el 401 y cierra la sesión. Con `useNavigate` importado y `const navigate = useNavigate();` arriba, el `useEffect` queda:

```jsx
useEffect(() => {
  const token = localStorage.getItem('accessToken');
  getCourses({ token: token })
    .then((cursos) => setCursos(cursos))
    .catch((err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem('accessToken');
        navigate('/', { replace: true });
      }
    });
}, [navigate]);
```

El token se lee dentro del efecto: como `ProtectedRoute` ya revisó que exista, aquí no hace falta el `if (!token) return;`.

Con eso las dos piezas se reparten el trabajo: el guardia saca a quien no tiene token, y el 401 saca a quien tiene uno que ya no sirve.
