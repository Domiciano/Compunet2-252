# Axios

<!-- tags: axios, axios.create, baseURL, api.post, response.data, accessToken, login desde React, Authorization Bearer, api.get, interceptores, Network Error -->

Axios es la librería con la que React habla con el backend. Esta lección es lo que hicimos en clase sobre [262WebApp7](https://github.com/Domiciano/262WebApp7): un cliente con la dirección del backend y un **POST** de login que recibe el token. El backend es [262WebApp6](https://github.com/Domiciano/262WebApp6).

La figura es el hilo de esta semana. Aquí van los pasos 1 y 2; en **Local Storage** se guarda el token (3), y en **React Router** y **useEffect** se llega a la segunda pantalla y se trae la lista (4 a 7). Entre medio, **CORS** y **Manejo de errores** resuelven lo que falla en el camino.

```svg
<svg id="axiosFlujo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="axiosFlujo-ttl axiosFlujo-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="axiosFlujo-ttl">Del login a la lista</title>
  <desc id="axiosFlujo-dsc">Diagrama de secuencia con tres participantes: la app React, localStorage y el backend. Uno: LoginPage envía POST /api/v1/auth/login con username y password. Dos: el backend responde 200 con accessToken. Tres: la app guarda el token con setItem. Cuatro: al abrir HomePage, su useEffect lee el token con getItem. Cinco: envía GET /api/v1/courses con el header Authorization Bearer y el token. Seis: el backend responde 200 con la lista de cursos. Siete: setCourses guarda la lista en el estado y React la dibuja.</desc>
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
  <rect x="96" y="170" width="160" height="120" rx="10" fill="#F4EBFF" fill-opacity=".55" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="106" y="186" font-size="11.5" font-weight="700" fill="#7439B8">LoginPage</text>
  <rect x="96" y="336" width="160" height="196" rx="10" fill="#F4EBFF" fill-opacity=".55" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="106" y="352" font-size="11.5" font-weight="700" fill="#7439B8">HomePage</text>
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
  <text class="mono" x="358" y="411" font-size="11.5" fill="#454C61" data-fit="448">GET /api/v1/courses · Authorization: Bearer token</text>
  <circle cx="338" cy="407" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="338" y="407" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">5</text>

  <path class="ar-green" d="M780,456 H262"/>
  <text class="mono" x="430" y="447" font-size="11.5" fill="#454C61" data-fit="448">200 · [ { publicId, name }, … ]</text>
  <circle cx="410" cy="443" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="410" y="443" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">6</text>

  <rect x="112" y="486" width="128" height="34" rx="8" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="176" y="503" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8">setCourses(data)</text>
  <circle cx="92" cy="503" r="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="92" y="503" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8">7</text>

  <text x="368" y="392" text-anchor="middle" font-size="12" fill="#79809A" data-fit="200">dentro del useEffect</text>
  <text x="276" y="508" font-size="12" fill="#79809A" data-fit="300">el estado cambia y React dibuja la lista</text>
  <text class="foot" x="48" y="572" data-fit="860">El backend entrega el token una sola vez, en el login. Desde ahí la app lo manda en cada request protegido.</text>
</svg>
```

## El cliente

```bash
npm install axios
```

En vez de escribir la URL completa en cada llamada, se crea **un cliente** con la dirección base del backend y se importa donde haga falta. En el proyecto vive en `src/services/Api.js`:

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/WebApp6/api/v1',
});

export default api;
```

Si el backend corre en otro computador, va su IP en lugar de `localhost`.

## POST: el login

Las llamadas al backend van en la capa de **services**, no en los componentes. `login()` en `src/services/AuthServices.js`:

```js
import api from './Api.js';

async function login() {
  const response = await api.post('/auth/login', {
    username: 'nicolas',
    password: '123456',
  });
  console.log(response.data.accessToken);
}

export { login };
```

`api.post` recibe la ruta y el **cuerpo**, que Axios convierte a JSON. `await` espera la respuesta, y `response.data` es el JSON que devolvió el backend: `{ accessToken: '...' }`.

La vista solo llama al service. En `App.jsx`, dentro de `handleLogin`:

```jsx
login();
```

Tres cosas quedan pendientes y cada una tiene su lección: qué pasa cuando el login falla (**Manejo de errores**), dónde guardar el token para no perderlo (**Local Storage**) y cómo pasar a otra pantalla (**React Router**).

## GET con el token

Las rutas protegidas piden el token en el header `Authorization`. Un `GET` a los cursos tiene esta forma:

```js
api.get('/courses', {
  headers: { Authorization: `Bearer ${token}` },
});
```

En qué momento se hace este `GET`, y a qué estado va la respuesta, lo vemos al llegar a la segunda pantalla, en **useEffect**.

## Interceptores: el token en todos los requests

Cuando hay muchos endpoints protegidos, repetir el header cansa. Un **interceptor de request** corre antes de que salga cada petición del cliente y le pone el token. Va en `services/Api.js`, después del `axios.create`:

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Con eso, el `GET` queda en `api.get('/courses')`.

Esto es para que sepas que existe. En el curso mandamos el header a mano en cada petición, como en el apartado anterior: así se ve qué lleva cada una.
