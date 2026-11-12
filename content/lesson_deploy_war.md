# Despliegue 1 · WAR en Tomcat

<!-- tags: desplegar React en Tomcat, WAR, static/app, SpaController, forward index.html, base de Vite, basename, finalName, 404 al recargar, página en blanco, permitAll /app, webapps -->

Hay tres guías de despliegue y basta con aplicar **una**. Esta es la recomendada: el build de React se mete en el proyecto de Spring Boot y sale en el mismo **WAR** que la API. Tomcat sirve las dos cosas desde el mismo origen, así que no hace falta CORS ni otro servidor.

```svg
<svg id="deployWar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 470" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="deployWar-ttl deployWar-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="deployWar-ttl">Una sola app en Tomcat</title>
  <desc id="deployWar-dsc">A la izquierda, el navegador hace dos tipos de petición al mismo servidor: /WebApp6/app/home y /WebApp6/api/v1/courses. A la derecha, Tomcat en el puerto 8080 con webapps/WebApp6.war. Dentro del WAR hay dos partes. La primera atiende /app/**: la carpeta static/app con index.html y assets, más SpaController, que reenvía rutas como /app/home a index.html. La segunda atiende /api/**: los RestControllers detrás del JwtAuthFilter, que responden JSON. Abajo: como todo sale del mismo origen, no hace falta CORS.</desc>
  <defs>
    <style>
      #deployWar .title{fill:#161A26;font-size:22px;font-weight:700}
      #deployWar .sub{fill:#79809A;font-size:13.5px}
      #deployWar .foot{fill:#79809A;font-size:12px}
      #deployWar .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #deployWar .ar-purple{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#deployWar-ar-purple)}
      #deployWar .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#deployWar-ar-indigo)}
    </style>
    <marker id="deployWar-ar-purple" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
    <marker id="deployWar-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
  </defs>
  <rect width="960" height="470" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Una sola app en Tomcat</text>
  <text class="sub" x="48" y="80" data-fit="860">El WAR trae la API y los archivos de React. Todo sale del mismo servidor y del mismo puerto.</text>

  <rect x="48" y="128" width="232" height="256" rx="12" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.75"/>
  <text x="68" y="152" dy="0.35em" font-size="14" font-weight="700" fill="#454C61">Navegador</text>
  <text x="68" y="174" dy="0.35em" font-size="12" fill="#79809A" data-fit="200">localhost:8080</text>
  <rect x="64" y="200" width="200" height="40" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="164" y="220" dy="0.35em" text-anchor="middle" font-size="11" fill="#7439B8" data-fit="188">/WebApp6/app/home</text>
  <rect x="64" y="300" width="200" height="40" rx="8" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>
  <text class="mono" x="164" y="320" dy="0.35em" text-anchor="middle" font-size="11" fill="#4453C9" data-fit="188">/WebApp6/api/v1/courses</text>

  <rect x="336" y="112" width="576" height="288" rx="14" fill="#F3F5F9" stroke="#8A93A8" stroke-width="1.75"/>
  <text x="356" y="136" dy="0.35em" font-size="14" font-weight="700" fill="#454C61">Tomcat :8080</text>
  <text class="mono" x="472" y="136" dy="0.35em" font-size="12" fill="#556074" data-fit="300">webapps/WebApp6.war</text>

  <rect x="360" y="164" width="264" height="212" rx="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="2.5"/>
  <text class="mono" x="380" y="188" dy="0.35em" font-size="13" font-weight="700" fill="#7439B8">/app/**</text>
  <text x="456" y="188" dy="0.35em" font-size="12" fill="#7439B8" data-fit="150">la app de React</text>
  <text class="mono" x="380" y="222" font-size="11.5" fill="#454C61" data-fit="228">static/app/index.html</text>
  <text class="mono" x="380" y="242" font-size="11.5" fill="#454C61" data-fit="228">static/app/assets/…</text>
  <rect x="376" y="268" width="232" height="88" rx="8" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="392" y="290" dy="0.35em" font-size="12" font-weight="700" fill="#7439B8">SpaController</text>
  <text x="392" y="314" dy="0.35em" font-size="12" fill="#556074" data-fit="200">/app/home no es un archivo:</text>
  <text x="392" y="334" dy="0.35em" font-size="12" fill="#556074" data-fit="200">lo reenvía a index.html</text>

  <rect x="648" y="164" width="240" height="212" rx="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.75"/>
  <text class="mono" x="668" y="188" dy="0.35em" font-size="13" font-weight="700" fill="#4453C9">/api/**</text>
  <text x="740" y="188" dy="0.35em" font-size="12" fill="#4453C9" data-fit="130">la API</text>
  <text class="mono" x="668" y="222" font-size="11.5" fill="#454C61" data-fit="200">JwtAuthFilter</text>
  <text class="mono" x="668" y="242" font-size="11.5" fill="#454C61" data-fit="200">RestControllers</text>
  <text x="668" y="270" font-size="12" fill="#556074" data-fit="200">responde JSON</text>

  <path class="ar-purple" d="M266,220 H354"/>
  <path class="ar-indigo" d="M266,320 C300,320 300,388 336,388 H768 V382"/>

  <text class="foot" x="48" y="436" data-fit="860">La página y la API tienen el mismo origen, así que no hace falta CORS. Los dos caminos están en el mismo WAR.</text>
</svg>
```

La app va a quedar en `http://localhost:8080/WebApp6/app/` y la API sigue en `/WebApp6/api/v1`.

## 1. React con rutas relativas

En `vite.config.js`, la ruta desde la que se van a servir los archivos:

```js
base: '/WebApp6/app/',
```

En el router, la misma ruta como segundo argumento de `createBrowserRouter`:

```jsx
{ basename: '/WebApp6/app' }
```

En `services/Api.js`, la API ya no lleva IP ni puerto: está en el mismo servidor.

```js
baseURL: '/WebApp6/api/v1',
```

Para que `npm run dev` siga funcionando con esa URL relativa, Vite reenvía la API al backend (lección **Configuración de Vite: Alias y Proxy**):

```js
server: {
  proxy: { '/WebApp6/api': 'http://localhost:8080' },
},
```

## 2. Build y copia

```bash
npm run build
```

Copia el **contenido** de `dist/` (el `index.html` y la carpeta `assets/`) a `src/main/resources/static/app/` del proyecto de Spring Boot. Si la carpeta `app/` no existe, créala.

```bash
mkdir -p ../262WebApp6/src/main/resources/static/app
cp -r dist/* ../262WebApp6/src/main/resources/static/app/
```

Cada vez que cambies algo en React, se repite este paso.

## 3. SpaController

`/app/home` es una ruta de React, no un archivo. Si el usuario recarga ahí, Spring busca `static/app/home`, no lo encuentra y da 404. Este controller le contesta con `index.html` y React Router se encarga del resto:

```java
@Controller
public class SpaController {

    @GetMapping({"/app", "/app/", "/app/{path:[^\\.]*}"})
    public String forward() {
        return "forward:/app/index.html";
    }
}
```

El patrón `[^\\.]*` deja por fuera lo que tiene punto, como `index-a1b2.js`: esos sí son archivos y Spring los sirve directo.

## 4. Seguridad

La cadena de Thymeleaf de `WebSecurityConfig` exige sesión para todo lo que no sea `/api/**`. Sin una regla para la app, abrirla redirige al login de Thymeleaf. En esa cadena, junto a la de `/css/**`:

```java
.requestMatchers("/app/**").permitAll()
```

Los datos siguen protegidos: los pide React a `/api/**` con el token.

## 5. Empaquetar el WAR

En Tomcat, el nombre del WAR es la ruta de la app. Para que el archivo salga como `WebApp6.war`, dentro de `<build>` en el `pom.xml`:

```xml
<finalName>WebApp6</finalName>
```

```bash
./mvnw clean package
```

Queda en `target/WebApp6.war`.

## 6. Desplegar

Copia `WebApp6.war` a la carpeta `webapps` de Tomcat 11, como en la lección **Despliegue**. Tomcat lo descomprime solo. Abre:

```text
http://localhost:8080/WebApp6/app/
```

Prueba entrar, llegar a `/home` y **recargar** ahí: si la lista vuelve a aparecer, quedó.

## Si algo falla

- **Página en blanco** y en *Network* los `.js` dan 404: `base` en `vite.config.js` no coincide con la carpeta. Tiene que ser `/WebApp6/app/`, con las dos barras.
- **Abre el login de Thymeleaf** en vez de la app: falta el `permitAll()` de `/app/**`.
- **404 al recargar** en `/home`: falta `SpaController`, o el `basename` del router no es `/WebApp6/app`.
- **La API da 404**: el WAR no se llama `WebApp6.war`, o `baseURL` no es `/WebApp6/api/v1`.
