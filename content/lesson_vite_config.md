# Configuración de Vite: alias y proxy

<!-- tags: vite.config.js, alias @, proxy de Vite, imports con ../../, baseURL relativo, CORS en desarrollo, Failed to resolve import, 404 en /WebApp6/api, el proxy no funciona en producción, IP del backend en Api.js -->

En `262WebApp7` hay dos cosas que estorban. Los imports se escriben con `../` según dónde esté el archivo, y `services/Api.js` tiene la dirección del backend escrita a mano (`http://192.168.131.151:8080/...`), que cada uno cambia por la suya y que obliga a configurar CORS. `vite.config.js` resuelve las dos: un **alias** para los imports y un **proxy** para la API.

## Alias @

Con un alias, `@` significa `src/` en cualquier archivo. En `vite.config.js`:

```js
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

`fileURLToPath(...)` convierte `./src` en la ruta completa de la carpeta en tu disco, que es lo que Vite necesita.

Ahora los imports no dependen de dónde está el archivo. En `HomePage.jsx` y en `App.jsx`:

```jsx
import { getCourses } from '@/services/CourseServices';
import ProtectedRoute from '@/components/ProtectedRoute';
```

Si mueves `HomePage.jsx` a otra carpeta, sus imports siguen funcionando.

## Proxy para la API

```svg
<svg id="viteProxy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 400" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="viteProxy-ttl viteProxy-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="viteProxy-ttl">El proxy de Vite reenvía la API a Spring Boot</title>
  <desc id="viteProxy-dsc">El navegador abre localhost:5173 y le pide todo al servidor de Vite. Las rutas de la app y los archivos de React los responde Vite. Las peticiones que empiezan por /WebApp6/api, como GET /WebApp6/api/v1/courses, Vite las reenvía a Spring Boot en localhost:8080 y devuelve la respuesta. Para el navegador todo viene del mismo origen, así que no hay CORS.</desc>
  <defs>
    <style>
      #viteProxy .title{fill:#161A26;font-size:22px;font-weight:700}
      #viteProxy .sub{fill:#79809A;font-size:13.5px}
      #viteProxy .foot{fill:#79809A;font-size:12px}
      #viteProxy .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #viteProxy .ar-grey{fill:none;stroke:#8A93A8;stroke-width:1.75;marker-end:url(#viteProxy-ar-grey)}
      #viteProxy .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#viteProxy-ar-indigo)}
    </style>
    <marker id="viteProxy-ar-grey" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#8A93A8"/></marker>
    <marker id="viteProxy-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
  </defs>
  <rect width="960" height="400" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">El proxy de Vite reenvía la API a Spring Boot</text>
  <text class="sub" x="48" y="80" data-fit="860">El navegador solo habla con localhost:5173. Lo que empieza por /WebApp6/api, Vite se lo pasa al backend.</text>

  <rect x="48" y="128" width="220" height="188" rx="12" fill="#EEF1FF" stroke="#A9B3F2" stroke-width="1.75"/>
  <text x="158" y="156" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#4453C9">Navegador</text>
  <rect x="66" y="180" width="184" height="34" rx="17" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="158" y="197" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="170">localhost:5173/home</text>
  <text x="158" y="250" dy="0.35em" text-anchor="middle" font-size="12" fill="#556074" data-fit="190">axios con baseURL</text>
  <text class="mono" x="158" y="272" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="190">'/WebApp6/api/v1'</text>

  <rect x="370" y="128" width="240" height="188" rx="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/>
  <text x="490" y="156" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#7439B8">Vite · npm run dev</text>
  <text class="mono" x="490" y="178" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#7439B8">:5173</text>
  <rect x="388" y="200" width="204" height="40" rx="8" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text x="490" y="220" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="190">/home, .js, .css → los sirve él</text>
  <rect x="388" y="254" width="204" height="44" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="490" y="268" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#A96C05" data-fit="190">/WebApp6/api/...</text>
  <text x="490" y="286" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#A96C05" data-fit="190">→ proxy</text>

  <rect x="712" y="128" width="200" height="188" rx="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.75"/>
  <text x="812" y="156" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#3A8235">Spring Boot</text>
  <text class="mono" x="812" y="178" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#3A8235">:8080</text>
  <text class="mono" x="812" y="232" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#454C61" data-fit="180">GET /WebApp6/api</text>
  <text class="mono" x="812" y="252" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#454C61" data-fit="180">/v1/courses</text>

  <path class="ar-indigo" d="M270,206 H364"/>
  <path class="ar-indigo" d="M594,276 H706"/>
  <path class="ar-grey" d="M706,296 H600"/>
  <path class="ar-grey" d="M364,296 H274"/>
  <text x="650" y="318" dy="0.35em" text-anchor="middle" font-size="11" fill="#79809A">JSON</text>

  <text class="foot" x="48" y="364" data-fit="860">Para el navegador todo sale de localhost:5173: mismo origen, sin CORS. Si el backend está en otro PC, solo cambia el destino del proxy.</text>
</svg>
```

En el mismo `vite.config.js`, dentro de `defineConfig`:

```js
server: {
  proxy: {
    '/WebApp6/api': 'http://localhost:8080',
  },
},
```

Y en `services/Api.js` la dirección deja de llevar IP y puerto:

```js
const api = axios.create({
  baseURL: '/WebApp6/api/v1',
});
```

Ahora `getCourses` le pide `/WebApp6/api/v1/courses` a `localhost:5173`. Vite ve que empieza por `/WebApp6/api` y la reenvía a `http://localhost:8080/WebApp6/api/v1/courses`. Si el backend corre en otro computador, se cambia solo el destino del proxy (`'http://192.168.131.151:8080'`); `Api.js` ya no se toca.

## Solo en desarrollo

El proxy existe mientras corre `npm run dev`. `npm run build` deja archivos estáticos, y ahí la ruta `/WebApp6/api` la tiene que atender el servidor que los publique. Para eso son las guías que siguen: en la [guía 1](https://domicianorincon.github.io/Computacion2/lesson/0105) React va dentro del WAR y comparte servidor con la API; en la [guía 2](https://domicianorincon.github.io/Computacion2/lesson/0066) Nginx hace el mismo trabajo que este proxy. El `baseURL` relativo de `Api.js` sirve igual en los tres casos.

## Si algo falla

- **`Failed to resolve import "@/..."`**: falta el alias en `vite.config.js`, o el import dice `@services/...` sin la barra.
- **404 en `/WebApp6/api/...`** con el backend encendido: la llave del proxy no es el comienzo del `baseURL`. Tiene que ser `/WebApp6/api`.
- **Error de red** en la consola: el backend está apagado, o el destino del proxy tiene otra IP o puerto.
