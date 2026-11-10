# CORS

<!-- tags: CORS, blocked by CORS policy, pre-flight, OPTIONS, @CrossOrigin, No Access-Control-Allow-Origin header, Access-Control-Allow-Origin, addCorsMappings, http.cors, origen, en Postman sí funciona -->

La app de React corre en `http://localhost:5173` y el backend en `http://localhost:8080`. El login funcionaba en Postman, pero desde React la consola del navegador muestra esto y el request falla:

```text
Access to XMLHttpRequest at 'http://localhost:8080/api/v1/posts'
from origin 'http://localhost:5173' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the
requested resource.
```

No es un error del código de React ni de Axios: es el navegador protegiendo al usuario, y se arregla en el **backend**.

## Qué es un origen

```svg
<svg id="corsOrigen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 500" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="corsOrigen-ttl corsOrigen-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="corsOrigen-ttl">Dos orígenes distintos</title>
  <desc id="corsOrigen-dsc">A la izquierda el navegador con la app React servida desde http://localhost:5173; a la derecha el backend Spring Boot en http://localhost:8080. El navegador envía GET /api/v1/posts y el backend responde 200 con la lista, pero como la respuesta no trae el header Access-Control-Allow-Origin, el navegador la bloquea. Abajo se comparan los dos orígenes por partes: mismo esquema http, mismo host localhost y distinto puerto, 5173 contra 8080. Basta una parte distinta para que sea otro origen.</desc>
  <defs>
    <style>
      #corsOrigen .title{fill:#161A26;font-size:22px;font-weight:700}
      #corsOrigen .sub{fill:#79809A;font-size:13.5px}
      #corsOrigen .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #corsOrigen .foot{fill:#79809A;font-size:12px}
      #corsOrigen .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #corsOrigen .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#corsOrigen-ar-indigo)}
      #corsOrigen .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#corsOrigen-ar-green)}
    </style>
    <marker id="corsOrigen-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
    <marker id="corsOrigen-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
  </defs>
  <rect width="960" height="500" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Dos orígenes distintos</text>
  <text class="sub" x="48" y="80" data-fit="860">El request llega y el backend responde, pero el navegador no deja que el JavaScript lea la respuesta.</text>
  <rect x="48" y="108" width="360" height="190" rx="12" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.75"/><text x="66" y="130" dy="0.35em" text-anchor="start" font-size="14" fill="#7439B8" font-weight="700">Navegador</text><text x="66" y="152" dy="0.35em" text-anchor="start" font-size="12" fill="#79809A">App React · servida por Vite</text>
  <rect x="552" y="108" width="360" height="190" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.75"/><text x="570" y="130" dy="0.35em" text-anchor="start" font-size="14" fill="#4453C9" font-weight="700">Backend</text><text x="570" y="152" dy="0.35em" text-anchor="start" font-size="12" fill="#79809A">Spring Boot · los RestControllers</text>
  <rect x="66" y="176" width="324" height="40" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="228" y="196" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="308">http://localhost:5173</text>
  <rect x="570" y="176" width="324" height="40" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="732" y="196" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="308">http://localhost:8080</text>
  <path class="ar-indigo" d="M410,186 H546"/><text class="mono" x="478" y="172" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#4453C9">GET /api/v1/posts</text>
  <path class="ar-green" d="M550,230 H414"/><text class="mono" x="482" y="244" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#3A8235">200 · [ … ]</text>
  <rect x="66" y="232" width="324" height="50" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="228" y="249" dy="0.35em" text-anchor="middle" font-size="12.5" fill="#C2354F" font-weight="700">Bloqueado por el navegador</text><text class="mono" x="228" y="267" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#C2354F">falta Access-Control-Allow-Origin</text>
<text x="48" y="330" dy="0.35em" text-anchor="start" font-size="12" fill="#556074" font-weight="700">ORIGEN = ESQUEMA + HOST + PUERTO</text>
  <text x="140" y="356" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#79809A">esquema</text>
  <text x="300" y="356" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#79809A">host</text>
  <text x="450" y="356" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#79809A">puerto</text>
  <rect x="106.8" y="376" width="66.4" height="20" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="140" y="386" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#556074">http://</text><rect x="259.6" y="376" width="80.8" height="20" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="300" y="386" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#556074">localhost</text><rect x="424.0" y="376" width="52.0" height="20" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="450" y="386" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#3A8235">:5173</text><text x="510" y="386" dy="0.35em" text-anchor="start" font-size="12" fill="#454C61">la app React</text>
  <rect x="106.8" y="414" width="66.4" height="20" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="140" y="424" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#556074">http://</text><rect x="259.6" y="414" width="80.8" height="20" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="300" y="424" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#556074">localhost</text><rect x="424.0" y="414" width="52.0" height="20" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text class="mono" x="450" y="424" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#C2354F">:8080</text><text x="510" y="424" dy="0.35em" text-anchor="start" font-size="12" fill="#454C61">el backend</text>
  <text x="640" y="386" dy="0.35em" text-anchor="start" font-size="12.5" fill="#454C61">Mismo esquema y mismo host,</text><text x="640" y="406" dy="0.35em" text-anchor="start" font-size="12.5" fill="#C2354F" font-weight="700">otro puerto: otro origen.</text>
  <text class="foot" x="48" y="472" data-fit="860">Postman y curl no son navegadores: no revisan CORS. Por eso allá el mismo request sí funcionaba.</text>
</svg>
```

Un **origen** es esquema + host + puerto. Por seguridad, el navegador no deja que el JavaScript de una página lea respuestas de **otro** origen, salvo que ese otro servidor lo autorice con headers `Access-Control-Allow-*`. Esa autorización es **CORS** (*Cross-Origin Resource Sharing*).

Lo hace cumplir el navegador, nadie más. Postman, `curl` u otro backend no revisan CORS, y por eso allá el mismo request sí funcionaba.

## El pre-flight

```svg
<svg id="corsPreflight" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="corsPreflight-ttl corsPreflight-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="corsPreflight-ttl">El pre-flight: primero se pregunta</title>
  <desc id="corsPreflight-dsc">Diagrama de secuencia entre el navegador en localhost:5173 y el backend en localhost:8080. Banda de pre-flight: uno, el navegador envía OPTIONS /api/v1/posts con Origin, Access-Control-Request-Method GET y Access-Control-Request-Headers authorization; dos, el backend responde 200 con Access-Control-Allow-Origin, Allow-Methods, Allow-Headers y Max-Age. Banda de request real: tres, el navegador envía GET /api/v1/posts con Authorization Bearer y Origin; cuatro, el backend responde 200 con la lista y Access-Control-Allow-Origin.</desc>
  <defs>
    <style>
      #corsPreflight .title{fill:#161A26;font-size:22px;font-weight:700}
      #corsPreflight .sub{fill:#79809A;font-size:13.5px}
      #corsPreflight .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #corsPreflight .foot{fill:#79809A;font-size:12px}
      #corsPreflight .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #corsPreflight .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#corsPreflight-ar-indigo)}
      #corsPreflight .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#corsPreflight-ar-green)}
      #corsPreflight .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#corsPreflight-ar-amber)}
    </style>
    <marker id="corsPreflight-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
    <marker id="corsPreflight-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
    <marker id="corsPreflight-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
  </defs>
  <rect width="960" height="640" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">El pre-flight: primero se pregunta</text>
  <text class="sub" x="48" y="80" data-fit="860">Antes del GET con token, el navegador manda solo un OPTIONS. Si la respuesta no da permiso, el GET nunca sale.</text>
  <rect x="48" y="160" width="864" height="236" rx="12" fill="#FFF3DC" fill-opacity=".45" stroke="#F0C572" stroke-dasharray="6 4" stroke-width="1.25"/><text x="64" y="176" dy="0.35em" text-anchor="start" font-size="11" fill="#A96C05" font-weight="700">PRE-FLIGHT</text>
  <rect x="48" y="408" width="864" height="176" rx="12" fill="#EEF1FF" fill-opacity=".45" stroke="#A9B4F2" stroke-dasharray="6 4" stroke-width="1.25"/><text x="64" y="424" dy="0.35em" text-anchor="start" font-size="11" fill="#4453C9" font-weight="700">REQUEST REAL</text>
  <rect x="80" y="104" width="240" height="40" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="200" y="124" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="224">Navegador · :5173</text>
  <rect x="640" y="104" width="240" height="40" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="760" y="124" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="224">Backend · :8080</text>
  <path d="M200,144 V578" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 5"/>
  <path d="M760,144 V578" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 5"/>
  <path class="ar-amber" d="M204,200 H754"/>
  <circle cx="282" cy="184" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="282" y="184" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <text class="mono" x="302" y="184" dy="0.35em" text-anchor="start" font-size="12.5" fill="#A96C05" font-weight="700">OPTIONS /api/v1/posts</text>
  <text class="mono" x="232" y="216" dy="0.35em" text-anchor="start" font-size="11.5" fill="#556074" data-fit="520">Origin: http://localhost:5173</text>
  <text class="mono" x="232" y="233" dy="0.35em" text-anchor="start" font-size="11.5" fill="#556074" data-fit="520">Access-Control-Request-Method: GET</text>
  <text class="mono" x="232" y="250" dy="0.35em" text-anchor="start" font-size="11.5" fill="#556074" data-fit="520">Access-Control-Request-Headers: authorization</text>
  <path class="ar-green" d="M756,294 H206"/>
  <circle cx="282" cy="278" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="282" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">2</text>
  <text class="mono" x="302" y="278" dy="0.35em" text-anchor="start" font-size="12.5" fill="#3A8235" font-weight="700">200 OK · sin cuerpo</text>
  <text class="mono" x="232" y="310" dy="0.35em" text-anchor="start" font-size="11.5" fill="#556074" data-fit="520">Access-Control-Allow-Origin: http://localhost:5173</text>
  <text class="mono" x="232" y="327" dy="0.35em" text-anchor="start" font-size="11.5" fill="#556074" data-fit="520">Access-Control-Allow-Methods: GET,POST,PUT,DELETE</text>
  <text class="mono" x="232" y="344" dy="0.35em" text-anchor="start" font-size="11.5" fill="#556074" data-fit="520">Access-Control-Allow-Headers: authorization, content-type</text>
  <text class="mono" x="232" y="361" dy="0.35em" text-anchor="start" font-size="11.5" fill="#556074" data-fit="520">Access-Control-Max-Age: 3600</text>
  <path class="ar-indigo" d="M204,448 H754"/>
  <circle cx="282" cy="432" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="282" y="432" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">3</text>
  <text class="mono" x="302" y="432" dy="0.35em" text-anchor="start" font-size="12.5" fill="#4453C9" font-weight="700">GET /api/v1/posts</text>
  <text class="mono" x="232" y="464" dy="0.35em" text-anchor="start" font-size="11.5" fill="#556074" data-fit="520">Authorization: Bearer eyJhbGciOiJIUzM4NCJ9…</text>
  <text class="mono" x="232" y="481" dy="0.35em" text-anchor="start" font-size="11.5" fill="#556074" data-fit="520">Origin: http://localhost:5173</text>
  <path class="ar-green" d="M756,524 H206"/>
  <circle cx="282" cy="508" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="282" y="508" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">4</text>
  <text class="mono" x="302" y="508" dy="0.35em" text-anchor="start" font-size="12.5" fill="#3A8235" font-weight="700">200 OK · [ { id, title }, … ]</text>
  <text class="mono" x="232" y="540" dy="0.35em" text-anchor="start" font-size="11.5" fill="#556074" data-fit="520">Access-Control-Allow-Origin: http://localhost:5173</text>
  <text class="foot" x="48" y="612" data-fit="860">Con Access-Control-Max-Age el navegador recuerda la respuesta una hora y no repite el OPTIONS en cada request.</text>
</svg>
```

Para ciertos requests el navegador no se arriesga a mandarlos directamente: antes envía un **pre-flight**, un `OPTIONS` a la misma URL que pregunta "¿me dejas mandarte un `GET` con el header `authorization` desde `http://localhost:5173`?". Si la respuesta trae los `Access-Control-Allow-*` que coinciden, sale el request real. Si no, el navegador muestra el error de arriba y **el request real nunca sale**.

Hay pre-flight cuando el request no es "simple", es decir, si cumple alguna de estas:

- Usa un método distinto de `GET`, `HEAD` o `POST` (por ejemplo `PUT` o `DELETE`).
- Manda un `Content-Type` distinto de los de formulario. `application/json` ya cuenta.
- Lleva headers propios, como `Authorization`.

Por eso en nuestra app **todos** los requests tienen pre-flight: el login manda JSON y los demás llevan el token. En *DevTools → Network* los vas a ver en parejas: uno de tipo `preflight` y luego el real.

## Habilitar CORS en los RestControllers

### En un controller: @CrossOrigin

La forma más directa es anotar el `@RestController`. Vale para todos sus endpoints; también se puede poner sobre un solo método.

```java
@RestController
@RequestMapping("/api/v1/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class PostRestController {

    @GetMapping
    public List<PostDTO> findAll() {
        // ...
    }
}
```

Por defecto `@CrossOrigin` permite los métodos que ya tiene mapeados el controller y cualquier header. El origen se escribe exacto: `http://localhost:5173` no es lo mismo que `http://127.0.0.1:5173`.

### En toda la API: addCorsMappings

Anotar controller por controller se olvida fácil. Mejor una sola configuración para toda la ruta `/api/**`:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("Authorization", "Content-Type")
                .maxAge(3600);
    }
}
```

Cada línea se convierte en un header de la respuesta del pre-flight: `allowedOrigins` en `Access-Control-Allow-Origin`, `allowedMethods` en `Allow-Methods`, `allowedHeaders` en `Allow-Headers` y `maxAge` en `Max-Age`. Cuando se despliegue el front, su dominio se agrega a `allowedOrigins`.

## Con Spring Security: .cors()

```svg
<svg id="corsSecurity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 440" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="corsSecurity-ttl corsSecurity-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="corsSecurity-ttl">Spring Security y el pre-flight</title>
  <desc id="corsSecurity-dsc">Dos filas. Arriba, sin cors en la SecurityFilterChain: el OPTIONS pasa por JwtAuthFilter sin token y llega a AuthorizationFilter, que exige autenticación y responde 401; el navegador bloquea y el GET nunca sale. Abajo, con cors Customizer.withDefaults: el CorsFilter, que va antes, reconoce el pre-flight, responde 200 con los headers Access-Control-Allow y corta la cadena; JwtAuthFilter y AuthorizationFilter no se ejecutan.</desc>
  <defs>
    <style>
      #corsSecurity .title{fill:#161A26;font-size:22px;font-weight:700}
      #corsSecurity .sub{fill:#79809A;font-size:13.5px}
      #corsSecurity .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #corsSecurity .foot{fill:#79809A;font-size:12px}
      #corsSecurity .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #corsSecurity .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#corsSecurity-ar-indigo)}
      #corsSecurity .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#corsSecurity-ar-green)}
      #corsSecurity .ar-rose{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#corsSecurity-ar-rose)}
    </style>
    <marker id="corsSecurity-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
    <marker id="corsSecurity-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
    <marker id="corsSecurity-ar-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
  </defs>
  <rect width="960" height="440" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Spring Security y el pre-flight</text>
  <text class="sub" x="48" y="80" data-fit="860">El OPTIONS nunca trae el token. Sin .cors(), la cadena lo trata como un request anónimo y lo rechaza.</text>
  <text class="mono" x="48" y="114" dy="0.35em" text-anchor="start" font-size="12.5" fill="#161A26" font-weight="700">Sin .cors()</text>
  <rect x="48" y="130" width="150" height="56" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="123" y="149" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8" data-fit="134">OPTIONS</text><text x="123" y="168" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="134">sin token</text>
  <rect x="250" y="130" width="170" height="56" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="335" y="149" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#556074" data-fit="154">JwtAuthFilter</text><text x="335" y="168" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="154">no hay token, sigue</text>
  <rect x="470" y="130" width="220" height="56" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="580" y="149" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#556074" data-fit="204">AuthorizationFilter</text><text x="580" y="168" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="204">anyRequest().authenticated()</text>
  <rect x="742" y="130" width="170" height="56" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="2.5"/><text class="mono" x="827" y="149" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#C2354F" data-fit="154">401</text><text x="827" y="168" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="154">el GET nunca sale</text>
  <path class="ar-indigo" d="M200,158 H244"/><path class="ar-indigo" d="M420,158 H464"/><path class="ar-rose" d="M690,158 H736"/>
  <text class="mono" x="48" y="246" dy="0.35em" text-anchor="start" font-size="12.5" fill="#161A26" font-weight="700">Con .cors(Customizer.withDefaults())</text>
  <rect x="48" y="262" width="150" height="56" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="123" y="281" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8" data-fit="134">OPTIONS</text><text x="123" y="300" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="134">sin token</text>
  <rect x="250" y="262" width="170" height="56" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="2.5"/><text class="mono" x="335" y="281" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#0F8478" data-fit="154">CorsFilter</text><text x="335" y="300" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="154">es un pre-flight</text>
  <path class="ar-indigo" d="M200,290 H244"/>
  <g opacity=".38"><rect x="470" y="262" width="170" height="56" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="555" y="281" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#556074" data-fit="154">JwtAuthFilter</text><text x="555" y="300" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="154">no se ejecuta</text>
<rect x="690" y="262" width="222" height="56" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="801" y="281" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#556074" data-fit="206">AuthorizationFilter</text><text x="801" y="300" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="206">no se ejecuta</text>
</g>
  <path class="ar-green" d="M335,322 V346 H100 V324"/>
  <text x="345" y="358" dy="0.35em" text-anchor="start" font-size="12" fill="#3A8235" font-weight="700">200 + Access-Control-Allow-* · la cadena se corta aquí</text>
  <text class="foot" x="48" y="412" data-fit="860">El CorsFilter usa la configuración de @CrossOrigin o de addCorsMappings: no hay que escribirla dos veces.</text>
</svg>
```

Con lo anterior todavía falla, porque el pre-flight **nunca trae el token**: el navegador no manda `Authorization` en el `OPTIONS`. La `SecurityFilterChain` de la API lo ve como un request anónimo a una ruta protegida y lo rechaza con `401` antes de que llegue a ningún controller, así que el `@CrossOrigin` nunca se aplica.

La solución es una línea en la cadena de la API:

```java
@Bean
@Order(2)
public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http)
        throws Exception {
    http
        .securityMatcher("/api/v1/**")
        .cors(Customizer.withDefaults())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/v1/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class)
        .csrf(csrf -> csrf.disable())
        .sessionManagement(sm -> sm
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );
    return http.build();
}
```

`.cors(...)` mete un `CorsFilter` al principio de la cadena. Ese filtro reconoce el pre-flight, lo responde con los headers y corta la cadena ahí. Con `Customizer.withDefaults()` usa la configuración que ya escribiste con `@CrossOrigin` o con `addCorsMappings`, así que no hay que repetirla.

## Pruébalo

Puedes simular el pre-flight con `curl`, mandando los mismos headers que mandaría el navegador:

```bash
curl -i -X OPTIONS http://localhost:8080/api/v1/posts \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization"
```

La respuesta tiene que ser `200` con `Access-Control-Allow-Origin: http://localhost:5173`. Con otro `Origin` responde `403 Invalid CORS request`, y si sale `401` es que falta el `.cors()` en la cadena.
