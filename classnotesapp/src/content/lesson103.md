[t] Rutas Anidadas y Layouts con Outlet
En aplicaciones complejas, es común tener interfaces donde una parte de la página es estática (como una barra lateral de navegación, un encabezado o un pie de página) y solo una sección del contenido cambia. React Router maneja esto de forma elegante a través de las "rutas anidadas" y el componente `<Outlet>`.
[st] ¿Qué es un Outlet?
Un `<Outlet>` es un componente proporcionado por `react-router-dom` que actúa como un marcador de posición. Cuando tienes rutas anidadas, el componente de la ruta padre (conocido como "layout") decide dónde se deben renderizar los componentes de las rutas hijas. Ese lugar es precisamente donde colocas el `<Outlet />`.

[st] Configurando Rutas Anidadas
Para que el layout funcione, necesitas anidar las rutas en tu configuración de `createBrowserRouter`. Esto se hace a través de la propiedad `children` en el objeto de la ruta padre.
[code:jsx]
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardSettings from "./pages/dashboard/DashboardSettings";
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
    path: "/dashboard",
    element: <Dashboard />, // Este es el componente Layout
    children: [ // Aquí comienzan las rutas anidadas
      {
        index: true, // Esta es la ruta por defecto para /dashboard
        element: <DashboardHome />,
      },
      {
        path: "settings", // Se resuelve como /dashboard/settings
        element: <DashboardSettings />,
      },
    ],
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

[st] Analizando la Configuración

1.  Ruta Padre (`/dashboard`): Cuando el usuario navega a `/dashboard`, React Router renderiza el componente `<Dashboard />`.
2.  Propiedad `children`: Este array define las rutas que solo son accesibles *dentro* del layout de `<Dashboard />`.
3.  Ruta Índice (`index: true`): El componente `<DashboardHome />` se renderizará en el `<Outlet />` del Dashboard cuando la URL sea exactamente `/dashboard`.
4.  Ruta Hija (`path: "settings"`): El componente `<DashboardSettings />` se renderizará en el `<Outlet />` cuando la URL sea `/dashboard/settings`. React Router concatena automáticamente la ruta del padre con la de la hija.

Usar este patrón es fundamental para crear aplicaciones escalables y bien organizadas, ya que te permite reutilizar la interfaz de usuario y mantener una estructura de rutas lógica y anidada.
[t] Construyendo un Layout simple
Primero tenemos el layuout general
[code:jsx]
import { Outlet, Link } from "react-router-dom";
import { Box, Stack, Typography, Button } from "@mui/material";

const HomeScreen = () => {
  return (
    <Stack direction="row" sx={{ height: "100vh" }}>
        <Stack sx={{ width: 300, bgcolor: "#f4f4f4", p: 2 }}>
            <Button>Inicio</Button>
            <Button>Estudiantes</Button>
            <Button>Configuración</Button>
        </Stack>
        <Box sx={{ flexGrow: 1, bgcolor: "background.paper", p: 3 }}>
            <Outlet />
        </Box>
    </Stack>
  );
}
export default HomeScreen;
[endcode]
Para que se vea bien necesitará modificar `index.css` y `App.css`.
[st]


[st] Creando los componentes de las rutas anidadas
[code:jsx]
import { Typography } from "@mui/material";

export const Home = () => {
  return <Typography variant="h4">Bienvenido al Dashboard</Typography>;
};

export const Students = () => {
  return <Typography variant="h4">Lista de Estudiantes</Typography>;
};

export const Settings = () => {
  return <Typography variant="h4">Configuración</Typography>;
};
[endcode]

[st] Configurando el enrutador
[code:jsx]
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import { Home, Students, Settings } from "./components/DashboardComponents";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeScreen />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "students",
        element: <Students />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
[endcode]
Con esta configuración, `HomeScreen` actúa como un layout que siempre está presente, y el contenido principal (representado por `<Outlet />`) cambia entre `Home`, `Students` y `Settings` según la ruta.
[st] Usando `Link` para la navegación
Para que los botones de la barra lateral funcionen, usamos el componente `<Link>` de React Router en lugar de etiquetas `<a>`.
[code:jsx]
import { Outlet, Link } from "react-router-dom";
import { Box, Stack, Typography, Button } from "@mui/material";

const HomeScreen = () => {
  return (
    <Stack direction="row" sx={{ height: "100vh" }}>
      <Stack sx={{ width: 300, bgcolor: "#f4f4f4", p: 2 }}>
        <Button component={Link} to="/">Inicio</Button>
        <Button component={Link} to="/students">Estudiantes</Button>
        <Button component={Link} to="/settings">Configuración</Button>
      </Stack>
      <Box sx={{ flexGrow: 1, bgcolor: "background.paper", p: 3 }}>
        <Outlet />
      </Box>
    </Stack>
  );
};
export default HomeScreen;
[endcode]
Al usar `<Link>`, React Router intercepta la navegación y actualiza la URL y el contenido renderizado sin recargar la página, lo que proporciona una experiencia de usuario fluida y rápida.
[st] Modificaciones a `index.css` y `App.css`
Para que el layout ocupe toda la pantalla, es necesario realizar algunas modificaciones en los archivos CSS.
[code:css]
/* En App.css */
.root {
  height: 100vh;
  width: 100vw;
}
[endcode]
[code:css]
/* En index.css */
html, body, #root {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden; /* Opcional, para evitar barras de desplazamiento no deseadas */
}
[endcode]
Estos cambios aseguran que el contenedor principal (`#root`) y sus elementos padres (`html`, `body`) ocupen el 100% de la altura y el ancho de la ventana del navegador, permitiendo que el layout de `HomeScreen` se expanda correctamente.

[st] Resumen
- Rutas Anidadas: Permiten construir layouts complejos donde una parte de la UI es persistente.
- `<Outlet>`: Es el marcador de posición donde se renderizan los componentes de las rutas hijas.
- Configuración: Se definen anidando rutas con la propiedad `children`.
- `<Link>`: Se usa para la navegación interna sin recargar la página.
- CSS: Es importante ajustar el CSS para que el layout ocupe el espacio deseado.

Este enfoque es la base para construir aplicaciones de una sola página (SPA) robustas y mantenibles con React.