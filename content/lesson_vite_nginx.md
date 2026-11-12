# Despliegue 2 · Docker y Nginx (local)

<!-- tags: Docker, Nginx, docker compose, Dockerfile multi-stage, nginx.conf, proxy_pass, try_files, tomcat:11, 404 al recargar, port is already allocated, 502 Bad Gateway, la imagen no se actualiza -->

Segunda forma de desplegar: React y la API en **dos contenedores**. Nginx sirve los archivos de React y le pasa a Tomcat lo que va para la API. Todo corre en tu máquina con un solo comando, y es justo lo que se lleva a AWS en la guía 3.

```svg
<svg id="deployDocker" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 440" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="deployDocker-ttl deployDocker-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="deployDocker-ttl">Dos contenedores en tu máquina</title>
  <desc id="deployDocker-dsc">A la izquierda, el navegador abre localhost/posts. Entra por el puerto 80 al contenedor frontend, que es nginx: sirve los archivos de React desde dist y, para cualquier ruta que no sea un archivo, devuelve index.html. Lo que empieza por /WebApp6/api/ lo reenvía con proxy_pass al contenedor backend, que es Tomcat 11 con WebApp6.war y escucha en el puerto 8080 solo dentro de la red de Docker. Los dos contenedores los levanta docker compose up.</desc>
  <defs>
    <style>
      #deployDocker .title{fill:#161A26;font-size:22px;font-weight:700}
      #deployDocker .sub{fill:#79809A;font-size:13.5px}
      #deployDocker .foot{fill:#79809A;font-size:12px}
      #deployDocker .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #deployDocker .ar-grey{fill:none;stroke:#8A93A8;stroke-width:1.75;marker-end:url(#deployDocker-ar-grey)}
      #deployDocker .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#deployDocker-ar-indigo)}
    </style>
    <marker id="deployDocker-ar-grey" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#8A93A8"/></marker>
    <marker id="deployDocker-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
  </defs>
  <rect width="960" height="440" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Dos contenedores en tu máquina</text>
  <text class="sub" x="48" y="80" data-fit="860">nginx sirve React y le pasa a Tomcat todo lo que es de la API.</text>

  <rect x="48" y="176" width="176" height="96" rx="12" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.75"/>
  <text x="68" y="200" dy="0.35em" font-size="14" font-weight="700" fill="#454C61">Navegador</text>
  <text class="mono" x="68" y="236" dy="0.35em" font-size="12" fill="#454C61" data-fit="140">localhost/posts</text>

  <rect x="272" y="112" width="640" height="248" rx="14" fill="none" stroke="#8A93A8" stroke-width="1.5" stroke-dasharray="6 5"/>
  <text class="mono" x="292" y="134" dy="0.35em" font-size="12" font-weight="700" fill="#556074">docker compose up</text>

  <rect x="296" y="160" width="280" height="176" rx="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="2.5"/>
  <text x="316" y="184" dy="0.35em" font-size="14" font-weight="700" fill="#3A8235">frontend</text>
  <text class="mono" x="398" y="184" dy="0.35em" font-size="12" fill="#3A8235">nginx</text>
  <text class="mono" x="316" y="220" font-size="11.5" fill="#454C61" data-fit="244">/  →  dist/ (React)</text>
  <text x="316" y="242" font-size="12" fill="#556074" data-fit="244">si no es archivo: index.html</text>
  <rect x="312" y="264" width="248" height="52" rx="8" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.5"/>
  <text class="mono" x="328" y="282" dy="0.35em" font-size="11.5" fill="#454C61" data-fit="220">/WebApp6/api/</text>
  <text class="mono" x="328" y="300" dy="0.35em" font-size="11.5" fill="#4453C9" data-fit="220">proxy_pass → backend</text>

  <rect x="648" y="160" width="240" height="176" rx="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.75"/>
  <text x="668" y="184" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9">backend</text>
  <text class="mono" x="744" y="184" dy="0.35em" font-size="12" fill="#4453C9">tomcat:11</text>
  <text class="mono" x="668" y="220" font-size="11.5" fill="#454C61" data-fit="200">webapps/WebApp6.war</text>
  <text x="668" y="242" font-size="12" fill="#556074" data-fit="200">puerto 8080, solo adentro</text>
  <text x="668" y="262" font-size="12" fill="#556074" data-fit="200">de la red de Docker</text>

  <path class="ar-grey" d="M226,224 H290"/>
  <text class="mono" x="258" y="214" text-anchor="middle" font-size="11" fill="#556074">:80</text>
  <path class="ar-indigo" d="M562,290 H642"/>

  <text class="foot" x="48" y="400" data-fit="860">Solo nginx publica un puerto. El navegador nunca habla directo con Tomcat, así que tampoco hace falta CORS.</text>
</svg>
```

Necesitas **Docker Desktop** y el `WebApp6.war` del backend. Para generarlo, sigue el paso 5 de la guía 1 (`finalName` + `./mvnw clean package`). Aquí React **no** va dentro del WAR.

## 1. React

Nginx sirve la app desde la raíz, así que `vite.config.js` no necesita `base` y el router no lleva `basename`. Lo único es que la API vaya por ruta relativa, en `services/Api.js`:

```js
baseURL: '/WebApp6/api/v1',
```

## 2. Los archivos

Todo va en la raíz del proyecto de React, junto a `package.json`. Copia ahí también `WebApp6.war`.

`nginx.conf` sirve React y reenvía la API al contenedor `backend`:

```nginx
server {
    listen 80;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /WebApp6/api/ {
        proxy_pass http://backend:8080;
    }
}
```

`try_files` hace lo que en la guía 1 hacía `SpaController`: si `/posts` no es un archivo, devuelve `index.html`.

`Dockerfile` construye React con Node y deja solo el resultado en una imagen de Nginx:

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

`.dockerignore`, para no meter en la imagen lo que no hace falta:

```text
node_modules
dist
*.war
```

`docker-compose.yml` levanta los dos contenedores. El backend es la imagen oficial de Tomcat 11 con tu WAR adentro:

```yaml
services:
  backend:
    image: tomcat:11.0-jdk17
    volumes:
      - ./WebApp6.war:/usr/local/tomcat/webapps/WebApp6.war

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend
```

Solo `frontend` publica un puerto. `backend` es un nombre dentro de la red de Docker: por eso `proxy_pass` lo usa como si fuera un host.

## 3. Levantar

```bash
docker compose up --build -d
```

Abre `http://localhost`, entra y recarga en `/posts`. Para ver qué pasa adentro y para apagar todo:

```bash
docker compose logs backend
docker compose down
```

## Si algo falla

- **`port is already allocated`**: otro programa usa el 80. Cambia `"80:80"` por `"8081:80"` y abre `http://localhost:8081`.
- **502 Bad Gateway** en la API: Tomcat todavía está arrancando. Espera unos segundos o mira `docker compose logs backend`.
- **No ves tus cambios de React**: la imagen se construyó con el código viejo. Vuelve a correr `docker compose up --build -d`.
- **Cambiaste el backend**: genera el WAR otra vez, cópialo encima y corre `docker compose up -d --force-recreate backend`.
