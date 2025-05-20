# Uso de `<Outlet />` en React Router

`<Outlet />` es un componente de React Router que actúa como un "espacio" donde se renderizan los componentes hijos de una ruta anidada.

Esto es útil cuando tienes una estructura de rutas anidadas y deseas que los componentes hijos se muestren dentro del componente principal (padre) de la ruta.

---

## Ejemplo básico

Supongamos que tienes la siguiente estructura de rutas:

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Perfil from "./Perfil";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### Componente `Layout`

```jsx
import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">Inicio</Link> | <Link to="/perfil">Perfil</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

export default Layout;
```

En este ejemplo:
- El componente `Layout` se muestra siempre que estés en una ruta que empieza por `/`.
- Dentro de `Layout`, el componente `<Outlet />` renderiza el contenido de la ruta hija correspondiente: `Home` si estás en `/`, o `Perfil` si estás en `/perfil`.

---

## Cuándo usar `<Outlet />`

- Cuando quieres que una sección de tu UI se mantenga constante (por ejemplo, el menú o encabezado) mientras el contenido cambia según la ruta.
- Para mantener el diseño y navegación comunes entre múltiples rutas.



# Rutas Protegidas con `<Outlet />` en React Router

React Router permite proteger rutas de forma elegante usando rutas anidadas y el componente `<Outlet />`. Esta es la forma recomendada desde React Router 6+.

---

## Layout Protegido

Crea un componente que actúe como layout para rutas privadas. Usará `<Outlet />` para renderizar las rutas hijas solo si el usuario está autenticado.

```jsx
import { Outlet, Navigate } from "react-router-dom";

function LayoutProtegido() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

---

## Configuración de Rutas

Organiza tus rutas usando el `LayoutProtegido` como envoltorio para las rutas privadas.

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Panel from "./Panel";
import LayoutProtegido from "./LayoutProtegido";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<LayoutProtegido />}>
          <Route path="/panel" element={<Panel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Simulación de Login

```jsx
function Login() {
  const handleLogin = () => {
    localStorage.setItem("token", "mi_token_seguro");
    window.location.href = "/panel";
  };

  return (
    <div>
      <h2>Página de Login</h2>
      <button onClick={handleLogin}>Iniciar sesión</button>
    </div>
  );
}
```

---

## Página protegida

```jsx
function Panel() {
  return <h2>Bienvenido al panel privado</h2>;
}
```


