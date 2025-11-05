[t] React Router
React Router es una librería de JavaScript que permite a las aplicaciones hechas con React tener navegación entre páginas sin necesidad de recargar el navegador.
En otras palabras, nos ayuda a construir aplicaciones de una sola página (SPA) donde podemos tener múltiples "pantallas" (como Inicio, Acerca de, Contacto), cada una con su propia URL, pero sin salir de la misma aplicación.
Para instalarlo:
[code:bash]
npm install react-router-dom
[endcode]
[st] Páginas
Crea una carpeta llamada `screens` dentro de `src/` para agregar nuestras páginas o screens.
Las screen son componentes que representan toda la pantalla que ve el usuario. Regularmente son componentes que son compuestos por componentes más pequeños.

[code:jsx]
export default function Login() {
  return (
    <h1>Login</h1>
  );
}
[endcode]

[code:jsx]
export default function About() {
  return (
    <h1>Acerca de mi super aplicación</h1>
  );
}
[endcode]

[code:jsx]
export default function Home() {
  return (
    <h1>Home</h1>
  );
}
[endcode]

[st] Definición de rutas

Una vez tenemos algunos componentes, podemos definir las rutas:

[code:jsx]
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Inicio</Link> | 
        <Link to="/about">Acerca de</Link> | 
        <Link to="/contact">Contacto</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
[endcode]

¿Qué pasa si se intenta acceder a una ruta inexistente? Para eso, podemos agregar una ruta "catch-all":

[code:jsx]
<Route path="*" element={<NotFound />} />
[endcode]

[st] Navegación programática

Podemos usar `Link` si queremos que nuestro usuario pueda viajar a un click. Sin embargo también puede navegar programáticamente asi:

[code:jsx]
import {useNavigate} from "react-router-dom";

export function MyComponent() {
  const navigate = useNavigate();
  // ...
  navigate('/home');
  // ...
}
[endcode]

[st] Navegación con paso de states

En el origen:
[code:jsx]
navigate('/home', { state: { state1, state2 }});
[endcode]

En el destino, para recuperar los estados:
[code:jsx]
import { useLocation } from "react-router-dom";

// ...

const location = useLocation();
const { email, token } = location.state || {};
[endcode]

[st] Navegación con parámetros

En la definición de la ruta:
[code:jsx]
<Route path="/perfil/:userId" element={<Perfil />} />
[endcode]

En el origen:
[code:jsx]
navigate(`/perfil/24`);
[endcode]

En el destino, para recuperar el valor `24`:
[code:jsx]
import { useParams } from "react-router-dom";

// ...

const { userId } = useParams();
[endcode]
