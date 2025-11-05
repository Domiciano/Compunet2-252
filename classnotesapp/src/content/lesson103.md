[t] Rutas Anidadas y Layouts con Outlet
En aplicaciones complejas, es común tener interfaces donde una parte de la página es estática (como una barra lateral de navegación, un encabezado o un pie de página) y solo una sección del contenido cambia. React Router maneja esto de forma elegante a través de las "rutas anidadas" y el componente `<Outlet>`.
[st] ¿Qué es un Outlet?
Un `<Outlet>` es un componente proporcionado por `react-router-dom` que actúa como un marcador de posición. Cuando tienes rutas anidadas, el componente de la ruta padre (conocido como "layout") decide dónde se deben renderizar los componentes de las rutas hijas. Ese lugar es precisamente donde colocas el `<Outlet />`.
[st] El Patrón de Componente Layout
El componente de la ruta padre se convierte en un "Layout". Su responsabilidad es dibujar la interfaz de usuario compartida y delegar el renderizado del contenido específico de la ruta hija al componente `<Outlet>`.
Por ejemplo, un componente `Dashboard.jsx` que sirve como layout para sus rutas hijas se vería así:
[code:jsx]
// src/pages/Dashboard.jsx
import { Outlet, Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div>
      <h1>Panel de Control (Dashboard)</h1>
      <nav>
        {/* Nota que los links a las rutas hijas no necesitan la ruta completa */}
        <Link to="/dashboard">Inicio del Dashboard</Link> |{' '}
        <Link to="settings">Configuración</Link>
      </nav>
      <hr />

      <main>
        <h3>Contenido Específico:</h3>
        {/* El contenido de las rutas hijas se renderizará aquí */}
        <Outlet />
      </main>
    </div>
  );
}
[endcode]

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
