# Despliegue de front usando Tomcat

<!-- tags: desplegar React en Tomcat, npm run build, webapps, WEB-INF/web.xml, base de Vite, basename, scp -r, código de estudiante, 404 al recargar, página en blanco, dos apps en Tomcat, dist -->

En la lección anterior desplegaste el backend como `A00123456-back`. Ahora va el front como **una segunda app** en el mismo Tomcat. No se copia dentro del proyecto de Spring Boot: con `npm run build` sacas los archivos, armas con ellos la carpeta que Tomcat entiende como app y la mandas por `scp`. Igual que antes, todo lleva tu código de estudiante; `A00123456` es el ejemplo.

```svg
<svg id="deployFront" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 470" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="deployFront-ttl deployFront-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="deployFront-ttl">Dos apps en el mismo Tomcat</title>
  <desc id="deployFront-dsc">A la izquierda, en tu computador, la carpeta A00123456-front armada a mano: index.html, assets y los íconos salen de dist después de npm run build; la carpeta WEB-INF con web.xml la creas tú y le dice a Tomcat que responda index.html cuando no encuentre un archivo. Con scp -r la carpeta pasa a la derecha, al PC de la sala, dentro de webapps de Tomcat. Ahí quedan A00123456-back.war, que atiende /A00123456-back/api/v1, y A00123456-front, que atiende /A00123456-front/. También hay apps de compañeros con su propio código, que no se tocan. El nombre de cada carpeta o WAR en webapps es el primer tramo de su URL.</desc>
  <defs>
    <style>
      #deployFront .title{fill:#161A26;font-size:22px;font-weight:700}
      #deployFront .sub{fill:#79809A;font-size:13.5px}
      #deployFront .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #deployFront .foot{fill:#79809A;font-size:12px}
      #deployFront .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #deployFront .note{fill:#79809A;font-size:11.5px}
      #deployFront .ar-amber{fill:none;stroke:#C98A0E;stroke-width:1.75;marker-end:url(#deployFront-ar-amber)}
    </style>
    <marker id="deployFront-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C98A0E"/></marker>
  </defs>
  <rect width="960" height="470" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Dos apps en el mismo Tomcat</text>
  <text class="sub" x="48" y="80" data-fit="860">El front no va dentro del WAR: es su propia carpeta en webapps, con su propia URL.</text>

  <text class="h" x="48" y="122">TU COMPUTADOR · RAÍZ DEL FRONT</text>
  <rect x="48" y="136" width="380" height="252" rx="12" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.75"/>
  <text class="mono" x="68" y="166" dy="0.35em" font-size="13" font-weight="700" fill="#A96C05">A00123456-front/</text>
  <text class="mono" x="92" y="198" dy="0.35em" font-size="12.5" fill="#454C61">index.html</text>
  <text class="note" x="408" y="198" dy="0.35em" text-anchor="end">de dist/</text>
  <text class="mono" x="92" y="226" dy="0.35em" font-size="12.5" fill="#454C61">assets/</text>
  <text class="note" x="408" y="226" dy="0.35em" text-anchor="end">de dist/</text>
  <text class="mono" x="92" y="254" dy="0.35em" font-size="12.5" fill="#454C61" data-fit="220">favicon.svg, icons.svg</text>
  <text class="note" x="408" y="254" dy="0.35em" text-anchor="end">de dist/</text>
  <rect x="80" y="282" width="332" height="82" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="92" y="302" dy="0.35em" font-size="12.5" font-weight="700" fill="#7439B8">WEB-INF/</text>
  <text class="note" x="400" y="302" dy="0.35em" text-anchor="end" fill="#7439B8">lo creas tú</text>
  <text class="mono" x="116" y="328" dy="0.35em" font-size="12.5" fill="#454C61">web.xml</text>
  <text class="note" x="400" y="348" dy="0.35em" text-anchor="end" data-fit="310">si no hay archivo, responde index.html</text>

  <path class="ar-amber" d="M432,262 H506"/>
  <text class="mono" x="469" y="246" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05">scp -r</text>

  <text class="h" x="512" y="122">PC DE LA SALA · TOMCAT :8080</text>
  <rect x="512" y="136" width="400" height="252" rx="12" fill="#F3F5F9" stroke="#8A93A8" stroke-width="1.75"/>
  <text class="mono" x="532" y="160" dy="0.35em" font-size="11.5" fill="#556074">~/apache-tomcat-11.0.29/webapps/</text>
  <rect x="532" y="182" width="360" height="56" rx="8" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>
  <text class="mono" x="548" y="200" dy="0.35em" font-size="12.5" font-weight="700" fill="#4453C9">A00123456-back.war</text>
  <text class="mono" x="548" y="222" dy="0.35em" font-size="11" fill="#556074" data-fit="330">→ /A00123456-back/api/v1 · lección anterior</text>
  <rect x="532" y="250" width="360" height="56" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/>
  <text class="mono" x="548" y="268" dy="0.35em" font-size="12.5" font-weight="700" fill="#A96C05">A00123456-front/</text>
  <text class="mono" x="548" y="290" dy="0.35em" font-size="11" fill="#556074" data-fit="330">→ /A00123456-front/ · la app de React</text>
  <rect x="532" y="318" width="360" height="52" rx="8" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 4"/>
  <text class="mono" x="548" y="335" dy="0.35em" font-size="11.5" fill="#79809A" data-fit="330">A00654321-back.war, A00654321-front/</text>
  <text x="548" y="355" dy="0.35em" font-size="11.5" fill="#79809A" data-fit="330">de un compañero: no se tocan</text>

  <text class="foot" x="48" y="428" data-fit="860">El nombre de cada carpeta o WAR dentro de webapps es el primer tramo de su URL. Por eso todo lleva tu código.</text>
</svg>
```

Al final tendrás dos URLs en el PC de la sala: la API en `http://<IP>:8080/A00123456-back/api/v1` y la app en `http://<IP>:8080/A00123456-front/`.

## 1. Configurar el front con tu código

En `vite.config.js`, la ruta desde la que Tomcat va a servir los archivos, con barra al principio y al final:

```js
export default defineConfig({
  plugins: [react()],
  base: '/A00123456-front/',
})
```

En `App.jsx`, la misma ruta como segundo argumento de `createBrowserRouter`, después del arreglo de rutas y sin la barra final:

```jsx
const router = createBrowserRouter([
  // ... las rutas, con ProtectedRoute y sus children
], { basename: '/A00123456-front' });
```

En `services/Api.js`, la IP del PC de la sala y el base path de tu backend:

```js
const api = axios.create({
  baseURL: 'http://<IP>:8080/A00123456-back/api/v1',
});
```

## 2. Build

En la **terminal 2**, en la raíz del front:

```bash
npm run build
```

Queda una carpeta `dist/` con `index.html`, la carpeta `assets/` (el JavaScript y el CSS ya compilados) y los íconos. Es todo lo que necesita el navegador; Tomcat no sabe nada de React ni de Node.

## 3. Armar la carpeta que entiende Tomcat

Para Tomcat, cada carpeta dentro de `webapps/` es una app, y su nombre es el base path. Los archivos que estén en su raíz se sirven tal cual, y la subcarpeta `WEB-INF/` es especial: guarda la configuración y nunca se sirve al navegador.

Esta carpeta se arma **a mano**, con el explorador de archivos o desde VS Code, junto a `dist/` en la raíz del front:

```svg
<svg id="armarFront" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 450" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="armarFront-ttl armarFront-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="armarFront-ttl">Armar la carpeta a mano</title>
  <desc id="armarFront-dsc">A la izquierda, la carpeta dist que genera npm run build, con index.html, assets, favicon.svg e icons.svg. A la derecha, la carpeta A00123456-front que creas tú con tu código. Paso 1: crear esa carpeta. Paso 2: copiar en ella lo que hay dentro de dist, no la carpeta dist. Paso 3: crear dentro la carpeta WEB-INF y en ella el archivo web.xml con el XML de la lección.</desc>
  <defs>
    <style>
      #armarFront .title{fill:#161A26;font-size:22px;font-weight:700}
      #armarFront .sub{fill:#79809A;font-size:13.5px}
      #armarFront .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #armarFront .foot{fill:#79809A;font-size:12px}
      #armarFront .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #armarFront .note{fill:#79809A;font-size:11.5px}
      #armarFront .ar-grey{fill:none;stroke:#8A93A8;stroke-width:1.5;marker-end:url(#armarFront-ar-grey)}
    </style>
    <marker id="armarFront-ar-grey" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#8A93A8"/></marker>
  </defs>
  <rect width="960" height="450" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Armar la carpeta a mano</text>
  <text class="sub" x="48" y="80" data-fit="860">Tres pasos, sin comandos: crear la carpeta, copiar lo de dist/ y agregar WEB-INF/web.xml.</text>

  <text class="h" x="48" y="118" data-fit="300">LO QUE SALE DEL BUILD</text>
  <rect x="48" y="132" width="300" height="196" rx="12" fill="#F3F5F9" stroke="#8A93A8" stroke-width="1.75"/>
  <text class="mono" x="68" y="156" dy="0.35em" font-size="13" font-weight="700" fill="#454C61">dist/</text>
  <text class="note" x="328" y="156" dy="0.35em" text-anchor="end" data-fit="200">la genera npm run build</text>
  <text class="mono" x="88" y="198" dy="0.35em" font-size="12.5" fill="#454C61">index.html</text>
  <text class="mono" x="88" y="228" dy="0.35em" font-size="12.5" fill="#454C61">assets/</text>
  <text class="mono" x="88" y="258" dy="0.35em" font-size="12.5" fill="#454C61">favicon.svg</text>
  <text class="mono" x="88" y="288" dy="0.35em" font-size="12.5" fill="#454C61">icons.svg</text>

  <path class="ar-grey" d="M352,198 H558"/>
  <path class="ar-grey" d="M352,228 H558"/>
  <path class="ar-grey" d="M352,258 H558"/>
  <path class="ar-grey" d="M352,288 H558"/>
  <circle cx="380" cy="334" r="12" fill="#4453C9"/>
  <text x="380" y="334" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">2</text>
  <text x="400" y="326" dy="0.35em" font-size="12" font-weight="700" fill="#4453C9" data-fit="150">Copia lo de adentro,</text>
  <text x="400" y="344" dy="0.35em" font-size="12" fill="#556074" data-fit="150">no la carpeta dist/</text>

  <circle cx="574" cy="114" r="12" fill="#C98A0E"/>
  <text x="574" y="114" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">1</text>
  <text class="h" x="594" y="118" data-fit="310">CREA LA CARPETA CON TU CÓDIGO</text>
  <rect x="562" y="132" width="350" height="264" rx="12" fill="#FFF3DC" fill-opacity=".6" stroke="#F0C572" stroke-width="1.75"/>
  <text class="mono" x="582" y="156" dy="0.35em" font-size="13" font-weight="700" fill="#A96C05">A00123456-front/</text>
  <text class="mono" x="602" y="198" dy="0.35em" font-size="12.5" fill="#454C61">index.html</text>
  <text class="mono" x="602" y="228" dy="0.35em" font-size="12.5" fill="#454C61">assets/</text>
  <text class="mono" x="602" y="258" dy="0.35em" font-size="12.5" fill="#454C61">favicon.svg</text>
  <text class="mono" x="602" y="288" dy="0.35em" font-size="12.5" fill="#454C61">icons.svg</text>
  <rect x="582" y="310" width="314" height="70" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="598" y="332" dy="0.35em" font-size="12.5" font-weight="700" fill="#7439B8">WEB-INF/</text>
  <text class="mono" x="622" y="358" dy="0.35em" font-size="12.5" fill="#454C61">web.xml</text>
  <circle cx="796" cy="332" r="12" fill="#7439B8"/>
  <text x="796" y="332" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">3</text>
  <text x="880" y="332" dy="0.35em" text-anchor="end" font-size="12" font-weight="700" fill="#7439B8" data-fit="66">créalas</text>
  <text x="880" y="358" dy="0.35em" text-anchor="end" font-size="11.5" fill="#556074" data-fit="200">con el XML de abajo</text>

  <text class="foot" x="48" y="426" data-fit="860">El nombre de la carpeta es el base path de la app: lleva tu código y es el mismo que pusiste en base y basename.</text>
</svg>
```

1. Crea una carpeta con tu código: `A00123456-front`.
2. Abre `dist/`, selecciona **todo lo que hay adentro** y cópialo en `A00123456-front`. No copies la carpeta `dist` entera.
3. Dentro de `A00123456-front`, crea la carpeta `WEB-INF` (en mayúsculas) y dentro de ella un archivo nuevo llamado `web.xml`. Créalo desde VS Code: en el explorador de Windows, con las extensiones ocultas, queda como `web.xml.txt` y Tomcat no lo lee.

¿Para qué es `web.xml`? `/A00123456-front/home` es una ruta de React, no un archivo: si recargas ahí, Tomcat busca `home`, no lo encuentra y responde 404. Con este contenido, Tomcat responde `index.html` en ese caso, y React Router dibuja `/home`. Pégalo en `web.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee" version="6.0">
  <error-page>
    <error-code>404</error-code>
    <location>/index.html</location>
  </error-page>
</web-app>
```

La carpeta tiene que quedar como en la figura: `index.html` y `assets/` en la raíz, y `web.xml` dentro de `WEB-INF/`.

## 4. Mandarla al PC

En la terminal 2, con `-r` porque es una carpeta:

```bash
scp -r A00123456-front \
  computacion@<IP>:~/apache-tomcat-11.0.29/webapps/
```

En PowerShell va en una sola línea, sin la `\`. En la terminal 1, revisa que esté junto a tu backend:

```bash
ls ~/apache-tomcat-11.0.29/webapps
```

Abre en el navegador:

```text
http://<IP>:8080/A00123456-front/
```

Entra con un usuario, llega a `/home` y **recarga** ahí: si la lista vuelve a aparecer, quedó.

Para actualizarla, repite los pasos 2 y 3, borra tu carpeta vieja en el PC (terminal 1) y vuelve a hacer el `scp`:

```bash
rm -r ~/apache-tomcat-11.0.29/webapps/A00123456-front
```

Revisa dos veces el nombre antes de dar Enter: borra solo la carpeta que lleva tu código.
