# Servidor de Aplicaciones

En esta clase trabajaremos con el servidor de Aplicaciones Tomcat y lo configuraremos manualmente para verificar su funcionamiento usando como base nuestros conocimientos previos de Servidores Web.

El propósito observar las principales características de un servidor de aplicaciones y qué provee que el servidor web no.

Para lograrlo vamos a 

# 1. Descargar el servidor de aplicaciones 

Vamos a descargar Tomcat 10 de la URL

```
https://tomcat.apache.org/download-10.cgi
```

Descarguemos el ZIP y lo descomprimimos. Si está en Mac o Linux, debe darle permisos a la carpeta de ejecutar los scripts de tipo `.sh`.

Lo puede hacer por medio del comando
```sh
chmod +x bin/*.sh
```

# 2. Cree un proyecto Maven
Con el nombre que deseee

# 3. Instalar dependencias
Debemos instalar el Jakarta Servlet API. Esta API permite crear servlets para procesar solicitudes HTTP y generar respuestas dinámicas en aplicaciones web Java.

En el `pom.xml`

```
...
<dependency>
  <groupId>jakarta.servlet</groupId>
  <artifactId>jakarta.servlet-api</artifactId>
  <version>6.1.0</version>
  <scope>provided</scope>
</dependency>
...
```







3. Cambiar la packing por war

3. Verificar versión del compilador en IntelliJ

4. mvn clear package para generar el WAR

5. Mover el war al servidor de aplicaciones

6. Ejecutar el ./startup.sh


# Automatizar el proceso

