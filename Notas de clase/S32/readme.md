# Despliegue de una Aplicación React (Vite + React Router) en Apache Tomcat

Este readme es para que pueda desplegar su aplicación de react en un servidor tomcat

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
npm run build
```

Esto generará una carpeta dist/ con los archivos estáticos listos para producción.

# Paso 2: Configurar el path base en `vite.config.js`

Abra el archivo vite.config.js y agrega (o modifica) la propiedad base con el nombre del path base que usarás en Tomcat. En este ejemplo, lo llamaremos misuperapp:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/misuperapp/'
});
```

Guarde los cambios y vuelve a ejecutar:

```bash
npm run build
```

# Paso 3: Crear una carpeta con el nombre del path base

Diríjase al directorio `webapps` de Tomcat y crea una carpeta llamada `misuperapp` o como le haya puesto a su path `base`. Esta carpeta determina la ruta de acceso en el servidor. Por ejemplo si la carpeta se llama `misuperapp`, la URL queda:

http://localhost:8080/misuperapp

Tiene que concordar con su ruta `base`

> Puede usar el nombre de su equipo como base


# Paso 4: Copiar los archivos construidos a la carpeta

Copie el contenido de dist/ dentro de la carpeta recién creada

La estructura de archivos quedará como

```
$TOMCAT/
└── webapps/
    └── misuperapp/
        ├── assets/
        │   ├── index-sd89231.js
        │   └── style-8d1acb1.css
        ├── index.html
        ├── favicon.svg (o favicon.ico, si lo usas)
        └── WEB-INF/
            └── web.xml
```

# Paso 5: Crear el archivo `web.xml` para manejar rutas

Cree la carpeta WEB-INF dentro de misuperapp, y dentro de ella un archivo llamado web.xml:

Cree el archivo `web.xml` con el siguiente contenido:

```xml
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         version="3.1">
  <error-page>
    <error-code>404</error-code>
    <location>/index.html</location>
  </error-page>
</web-app>
```

Este paso es fundamental para que React Router funcione correctamente incluso cuando el usuario recarga rutas internas.

La estructura final debe quedar así
```
$TOMCAT/
└── webapps/
    └── misuperapp/
        ├── assets/
        │   ├── index-sd89231.js
        │   └── style-8d1acb1.css
        ├── index.html
        ├── favicon.svg (o favicon.ico, si lo usas)
        └── WEB-INF/
            └── web.xml
```


# Paso 6: Probar la aplicación en el navegador

Abre tu navegador con la URL

http://localhost:8080/misuperapp

Tu aplicación React debería cargarse sin problemas. Puedes probar también rutas internas para asegurarte de que el web.xml está funcionando correctamente.

¡Listo! Ahora tienes tu aplicación React servida desde Tomcat
