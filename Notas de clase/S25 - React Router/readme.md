
# React Router

React Router es una librería de JavaScript que permite a las aplicaciones hechas con React tener navegación entre páginas sin necesidad de recargar el navegador.

En otras palabras, nos ayuda a construir aplicaciones de una sola página (SPA) donde podemos tener múltiples "pantallas" (como Inicio, Acerca de, Contacto), cada una con su propia URL, pero sin salir de la misma aplicación.

Para instalarlo

```bash
npm install react-router-dom
```

# Páginas

Crea una carpeta llamada `pages` dentro de `src/` para agregar nuestras páginas o screens.

Las screen son componentes que representan toda la pantalla que ve el usuario. Regularmente son componentes que son compuestos por componentes más pequeños


```jsx
export default function Login() {
  return (
    <h1>Login</h1>
  );
}
```

```jsx
export default function About() {
  return (
    <h1>Acerca de mi super aplicación</h1>
  );
}
```

```jsx
export default function Home() {
  return (
    <h1>Home</h1>
  );
}
```

# Definición de rutas

Una vez tenemos algunos 

```jsx
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
```


¿Qué pasa si se intenta acceder a una ruta inexistente?

```jsx
<Route path="*" element={<NotFound />} />
```


# Navegación programática

Podemos usar `Link` si queremos que nuestro usuario pueda viajar a un click. Sin embargo también puede navegar programáticamente asi:

```jsx
import {useNavigate} from "react-router-dom";

export function MyComponent() {
  const navigate = useNavigate();
  ...
  navigate('/home')
  ...
}
```


# Navegación con paso de states

En el origen

```jsx
navigate('/home', { state: { state1, state2 }});

```

En el destino, para recuperar los estados

```jsx
import { useLocation } from "react-router-dom";

...

const location = useLocation();
const { email, token } = location.state || {};
```


# Navegación con parámetros

En la ruta

```jsx
<Route path="/perfil/:userId" element={<Perfil />} />
````

En el origen

```jsx
navigate(`/perfil/24`);

```

En el destino, para recuperar el valor `24`

```jsx
import { useParams } from "react-router-dom";

...

const { userId } = useParams();

```


# `useEffect`

Es un hook de React que permite ejecutar efectos secundarios (side effects) en un componente funcional, como llamadas a APIs, suscripciones, o manipulación del DOM, después de que el componente se monta, actualiza o desmonta, dependiendo de las dependencias que se le pasen.

```jsx
useEffect(async ()=>{
      let alfa = await axios.get("http://localhost:8080/api/v1/courses", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(alfa);
},[]);
```

# CORS

CORS (Cross-Origin Resource Sharing) es una política de seguridad que aplica el navegador web para restringir las peticiones HTTP hechas desde un origen diferente al del servidor.
En otras palabras, CORS define qué aplicaciones web (de otros dominios) pueden comunicarse con tu API.



```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        ...
        .cors(Customizer.withDefaults())
        ...

    return http.build();
}

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:5173"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/v1/**", configuration);
    return source;
}
```







