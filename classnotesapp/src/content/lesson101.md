[t] Navegación en React
React Router es la biblioteca más utilizada para manejar la navegación entre pantallas en aplicaciones React. Desde la versión 6.4, introdujo una nueva forma de definir rutas llamada Data Router API, que utiliza la función createBrowserRouter. Esta forma es más moderna, flexible y recomendada para proyectos actuales, ya que permite integrar carga de datos (loaders), acciones de formularios (actions) y manejo de errores de forma nativa.
[st] ¿Qué es un Router?
Un router se encarga de determinar qué componente mostrar según la URL actual del navegador. En React, esto permite crear aplicaciones de una sola página (SPA, Single Page Application), donde el usuario navega sin recargar la página completa.

[st] Instalación
Para usar React Router, primero instálalo con npm o yarn:
[code:bash]
npm install react-router-dom
[endcode]

[st] Creando un Router Programático
En lugar de usar las etiquetas `<BrowserRouter>` y `<Routes>`, la versión moderna nos propone construir un objeto de rutas y pasarlo al componente `<RouterProvider>`.
Así se crea un router programáticamente:

[code:jsx]
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
{
    path: "/",
    element: <Home />,
},
{
    path: "/about",
    element: <About />,
},
{
    path: "*",
    element: <NotFound />,
},
]);

function App() {
return <RouterProvider router={router} />;
}

export default App;
[endcode]
En este ejemplo, createBrowserRouter recibe un arreglo de objetos, donde cada objeto define una ruta.
Cada ruta tiene al menos dos propiedades: path (la URL) y element (el componente que debe renderizarse).
`RouterProvider` es el componente que “activa” el router en tu aplicación.

[st] Ejemplo con rutas anidadas
[code:jsx]
import { createBrowserRouter, RouterProvider, Outlet, Link } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function Layout() {
return (
<div>
<nav>
<Link to="/">Inicio</Link> |{" "}
<Link to="/profile">Perfil</Link> |{" "}
<Link to="/settings">Configuración</Link>
</nav>
<Outlet /> {/* Aquí se renderizan las rutas hijas */}
</div>
);
}

const router = createBrowserRouter([
{
path: "/",
element: <Layout />,
children: [
{ index: true, element: <Home /> },
{ path: "profile", element: <Profile /> },
{ path: "settings", element: <Settings /> },
],
},
]);

function App() {
return <RouterProvider router={router} />;
}

export default App;
[endcode]

En este caso, Layout es un componente padre que contiene un menú y un <Outlet>.
El <Outlet> es el espacio donde se renderizan los componentes hijos según la URL.

[st] Conclusión

El enfoque con createBrowserRouter representa la evolución de React Router hacia un modelo más declarativo y escalable.
En proyectos modernos, esta es la forma recomendada, especialmente si tu aplicación necesita manejar datos, rutas anidadas o formularios complejos.
Si tu proyecto es pequeño, el enfoque clásico con <BrowserRouter> sigue siendo válido, pero la API programática te prepara mejor para arquitecturas profesionales.