
[t] Servidor de Aplicaciones
En esta lección aprenderás a trabajar con el servidor de aplicaciones Tomcat, configurarlo manualmente y desplegar aplicaciones Java usando Maven y servlets. Verás las diferencias clave entre un servidor web y un servidor de aplicaciones.
[icon] image5.png|Diagrama de servidor de aplicaciones Tomcat
[st] Descarga y configuración de Tomcat
Descarga Tomcat 10 desde:
[code:plain]
https://tomcat.apache.org/download-10.cgi
[endcode]
Descomprime el `ZIP`. Si usas Mac o Linux, da permisos de ejecución a los scripts:
[code:bash]
chmod +x bin/*.sh
[endcode]

[st] Crear un proyecto Maven y dependencias
Crea un proyecto Maven y agrega la dependencia de Jakarta Servlet API en tu `pom.xml`:
[code:xml]
<dependencies>
  <dependency>
    <groupId>jakarta.servlet</groupId>
    <artifactId>jakarta.servlet-api</artifactId>
    <version>6.1.0</version>
    <scope>provided</scope>
  </dependency>
</dependencies>
[endcode]
[st] Empaquetado como WAR
Configura el empaquetado como `war` en el `pom.xml`:
[code:xml]
<packaging>war</packaging>
[endcode]
[st] Verificar versión de Java
Asegúrate de que la versión de Java en tu sistema y en tu IDE coincidan. Puedes verificarlo con:
[code:sh]
java -version
[endcode]
En el `pom.xml` puedes especificar la versión:
[code:xml]
<properties>
  <maven.compiler.source>18</maven.compiler.source>
  <maven.compiler.target>18</maven.compiler.target>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
[endcode]

[st] Estructura de carpetas del proyecto
La estructura típica de un proyecto web con Maven y Tomcat es:
[code:plain]
📦 project
 ┣ 📂 src
 ┃ ┗ 📂 main
 ┃   ┣ 📂 java
 ┃   ┃  ┗ 📂 com.icesi.webappexample
 ┃   ┃    ┗ 📂 servlet
 ┃   ┃       ┗ 📜 ServletExample.java
 ┃   ┣ 📂 resources              
 ┃   ┗ 📂 webapp
 ┃      ┗ 📜 index.jsp
 ┗ 📜 pom.xml 
[endcode]
[st] Crear un Servlet básico
[code:java]
package com.icesi.webappexample.servlet;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/hello")
public class ServletExample extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/html");
        resp.getWriter().println("<h1>Este es un servlet<h1>");
    }
}
[endcode]

[st] Crear un JSP básico
[code:xml]
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
      <title>Title</title>
  </head>
  <body>
    <h1>Beta Gamma Alfa Delta</h1>
  </body>
</html>
[endcode]
[st] Empaquetar y desplegar el WAR
Para empaquetar el proyecto ejecuta:
[code:sh]
mvn clean package
[endcode]
Esto generará el archivo `.war` en la carpeta `target`. Copia el `.war` a la carpeta `webapps` de Tomcat y arráncalo con:
[code:sh]
./startup.sh
[endcode]
Accede a la aplicación en:
[code:plain]
http://localhost:8080/<nombre>
[endcode]
Y al servlet en:
[code:plain]
http://localhost:8080/<nombre>/hello
[endcode]
[st] Automatizar el despliegue desde el IDE
Puedes automatizar el despliegue configurando Tomcat en tu IDE (por ejemplo, IntelliJ IDEA) y asociando el artefacto WAR al servidor.

¡Ahora sabes cómo desplegar aplicaciones Java en Tomcat y la diferencia entre un servidor web y uno de aplicaciones!


