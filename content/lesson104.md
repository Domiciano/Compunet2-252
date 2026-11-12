# Axios

<!-- tags: axios, axios.post, axios.get, response.data, login desde React, Authorization Bearer, axios.create baseURL, error 401 en el login, error.response.status, CORS, getPosts, interceptores -->

Axios es la librería con la que React habla con el backend. Aquí la usamos para las dos cosas que hace cualquier app con login: un **POST** que manda las credenciales y recibe el token, y un **GET** que trae una lista protegida para mostrarla en pantalla. El backend es el de las semanas anteriores: `POST /api/v1/auth/login` y `GET /api/v1/posts`.

La figura es el hilo de esta semana: aquí hacemos el login (pasos 1 y 2); en **Local Storage** guardamos el token, en **React Router** pasamos a la pantalla de posts y en **useEffect** traemos la lista.

```svg
<svg id="axiosFlujo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="axiosFlujo-ttl axiosFlujo-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="axiosFlujo-ttl">Del login a la lista</title>
  <desc id="axiosFlujo-dsc">Diagrama de secuencia con tres participantes: la app React, localStorage y el backend. Uno: LoginForm envía POST /api/v1/auth/login con username y password. Dos: el backend responde 200 con accessToken. Tres: la app guarda el token con setItem. Cuatro: al abrir PostsPage, su useEffect lee el token con getItem. Cinco: envía GET /api/v1/posts con el header Authorization Bearer y el token. Seis: el backend responde 200 con la lista de posts. Siete: setPosts guarda la lista en el estado y React la dibuja.</desc>
  <defs>
    <style>
      #axiosFlujo .title{fill:#161A26;font-size:22px;font-weight:700}
      #axiosFlujo .sub{fill:#79809A;font-size:13.5px}
      #axiosFlujo .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #axiosFlujo .foot{fill:#79809A;font-size:12px}
      #axiosFlujo .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #axiosFlujo .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#axiosFlujo-ar-indigo)}
      #axiosFlujo .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#axiosFlujo-ar-green)}
      #axiosFlujo .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#axiosFlujo-ar-amber)}
    </style>
    <marker id="axiosFlujo-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
    <marker id="axiosFlujo-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
    <marker id="axiosFlujo-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
  </defs>
  <rect width="960" height="600" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Del login a la lista</text>
  <text class="sub" x="48" y="80" data-fit="860">El POST trae el token, localStorage lo guarda y el GET lo manda en el header para traer la lista.</text>
  <rect x="66" y="108" width="220" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="176" y="130" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#7439B8" data-fit="204">App React</text>
  <path d="M176,152 V530" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 5"/>
  <rect x="370" y="108" width="220" height="44" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="480" y="130" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#A96C05" data-fit="204">localStorage</text>
  <path d="M480,152 V530" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 5"/>
  <rect x="674" y="108" width="220" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="784" y="130" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#4453C9" data-fit="204">Backend</text>
  <path d="M784,152 V530" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 5"/>
  <rect x="96" y="170" width="160" height="120" rx="10" fill="#F4EBFF" fill-opacity=".55" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="106" y="186" font-size="11.5" font-weight="700" fill="#7439B8">LoginForm</text>
  <rect x="96" y="336" width="160" height="196" rx="10" fill="#F4EBFF" fill-opacity=".55" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="106" y="352" font-size="11.5" font-weight="700" fill="#7439B8">PostsPage</text>
  <path class="ar-indigo" d="M260,200 H778"/>
  <text class="mono" x="354" y="191" font-size="11.5" fill="#454C61" data-fit="448">POST /api/v1/auth/login · { username, password }</text>
  <circle cx="334" cy="187" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="334" y="187" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">1</text>

  <path class="ar-green" d="M780,236 H262"/>
  <text class="mono" x="448" y="227" font-size="11.5" fill="#454C61" data-fit="448">200 · { accessToken }</text>
  <circle cx="428" cy="223" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="428" y="223" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">2</text>

  <path class="ar-amber" d="M260,272 H474"/>
  <text class="mono" x="302" y="263" font-size="11.5" fill="#454C61" data-fit="144">setItem('accessToken', token)</text>
  <circle cx="282" cy="259" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="282" y="259" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>

  <path class="ar-amber" d="M476,372 H262"/>
  <text class="mono" x="302" y="363" font-size="11.5" fill="#454C61" data-fit="144">getItem('accessToken')</text>
  <circle cx="282" cy="359" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="282" y="359" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">4</text>

  <path class="ar-indigo" d="M260,420 H778"/>
  <text class="mono" x="358" y="411" font-size="11.5" fill="#454C61" data-fit="448">GET /api/v1/posts · Authorization: Bearer token</text>
  <circle cx="338" cy="407" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="338" y="407" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">5</text>

  <path class="ar-green" d="M780,456 H262"/>
  <text class="mono" x="430" y="447" font-size="11.5" fill="#454C61" data-fit="448">200 · [ { id, title }, … ]</text>
  <circle cx="410" cy="443" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="410" y="443" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">6</text>

  <rect x="112" y="486" width="128" height="34" rx="8" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="176" y="503" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8">setPosts(data)</text>
  <circle cx="92" cy="503" r="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="92" y="503" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8">7</text>

  <text x="368" y="392" text-anchor="middle" font-size="12" fill="#79809A" data-fit="200">dentro del useEffect</text>
  <text x="276" y="508" font-size="12" fill="#79809A" data-fit="300">el estado cambia y React dibuja la lista</text>
  <text class="foot" x="48" y="572" data-fit="860">El backend entrega el token una sola vez, en el login. Desde ahí la app lo manda en cada request protegido.</text>
</svg>
```

## Instalación y cliente

```bash
npm install axios
```

En lugar de escribir la URL completa en cada llamada, se crea **un cliente** con la dirección base del backend y se importa donde haga falta.

```js
// src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

export default api;
```

## POST: el login

El formulario guarda lo que escribe el usuario en el estado. Al enviarlo, `api.post` recibe la ruta y el **cuerpo** del request, que Axios convierte a JSON. La respuesta llega en `response.data`, que aquí es `{ accessToken: '...' }`, y el token se guarda en **localStorage**, un almacén del navegador que sobrevive a las recargas (lo vemos en la lección **Local Storage**).

```jsx
import { useState } from 'react';
import api from './api/client';

function LoginForm() {
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
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Usuario o contraseña incorrectos');
      } else {
        setError('No se pudo conectar con el servidor');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

- `await` espera la respuesta; si el status no es 2xx, Axios **lanza un error** y el código salta al `catch`.
- En el `catch`, `err.response` trae la respuesta del servidor: `err.response.status` es `401` cuando las credenciales no sirven (lección **Errores 401 y 403**). Si no hay `err.response`, el request ni llegó: el backend está apagado o hay un problema de **CORS** (lección **CORS**).

## GET: la lista

Para pedir la lista basta una función que haga el `GET`. Como `/posts` está protegido, hay que mandar el token en el header `Authorization`.

```js
// src/api/posts.js
import api from './client';

export const getPosts = async () => {
  const token = localStorage.getItem('accessToken');
  const response = await api.get('/posts', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
```

`getPosts` devuelve una promesa con la lista. Quién la llama, y en qué momento, lo vemos al llegar a la segunda pantalla, en la lección **useEffect**: no se puede llamar suelta en el cuerpo de un componente.

## Interceptores: el token en todos los requests

Cuando hay muchos endpoints protegidos, repetir el header en cada uno cansa. Un **interceptor de request** corre antes de que salga cada petición del cliente y puede ponerle el token.

```js
// src/api/client.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Con eso, `getPosts` queda en una línea: `api.get('/posts')`.
