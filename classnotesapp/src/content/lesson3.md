[t] Servidor de Aplicaciones

[i] image5.png|Diagrama de servidor de aplicaciones Tomcat

[p]
En esta lección aprenderás a trabajar con el servidor de aplicaciones Tomcat, configurarlo manualmente y desplegar aplicaciones Java usando Maven y servlets. Verás las diferencias clave entre un servidor web y un servidor de aplicaciones.

[st] Descarga y configuración de Tomcat

[p]
Descarga Tomcat 10 desde:

[c:plain]
https://tomcat.apache.org/download-10.cgi
[end]

[p]
Descomprime el ZIP. Si usas Mac o Linux, da permisos de ejecución a los scripts:

[c:sh]
chmod +x bin/*.sh
[end]

[st] Crear un proyecto Maven y dependencias

[p]
Crea un proyecto Maven y agrega la dependencia de Jakarta Servlet API en tu `pom.xml`:

[c:xml]
<dependencies>
  <dependency>
    <groupId>jakarta.servlet</groupId>
    <artifactId>jakarta.servlet-api</artifactId>
    <version>6.1.0</version>
    <scope>provided</scope>
  </dependency>
</dependencies>
[end]

[st] Empaquetado como WAR

[p]
Configura el empaquetado como `war` en el `pom.xml`:

[c:xml]
<packaging>war</packaging>
[end]

[st] Verificar versión de Java

[p]
Asegúrate de que la versión de Java en tu sistema y en tu IDE coincidan. Puedes verificarlo con:

[c:sh]
java -version
[end]

[p]
En el `pom.xml` puedes especificar la versión:

[c:xml]
<properties>
  <maven.compiler.source>18</maven.compiler.source>
  <maven.compiler.target>18</maven.compiler.target>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
[end]

[st] Estructura de carpetas del proyecto

[p]
La estructura típica de un proyecto web con Maven y Tomcat es:

[c:plain]
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
[end]

[st] Crear un Servlet básico

[c:java]
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
[end]

[st] Crear un JSP básico

[c:xml]
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
      <title>Title</title>
  </head>
  <body>
    <h1>Beta Gamma Alfa Delta</h1>
  </body>
</html>
[end]

[st] Empaquetar y desplegar el WAR

[p]
Para empaquetar el proyecto ejecuta:

[c:sh]
mvn clean package
[end]

[p]
Esto generará el archivo `.war` en la carpeta `target`. Copia el `.war` a la carpeta `webapps` de Tomcat y arráncalo con:

[c:sh]
./startup.sh
[end]

[p]
Accede a la aplicación en:

[c:plain]
http://localhost:8080/<nombre>
[end]

[p]
Y al servlet en:

[c:plain]
http://localhost:8080/<nombre>/hello
[end]

[st] Automatizar el despliegue desde el IDE

[p]
Puedes automatizar el despliegue configurando Tomcat en tu IDE (por ejemplo, IntelliJ IDEA) y asociando el artefacto WAR al servidor.

[p]
¡Ahora sabes cómo desplegar aplicaciones Java en Tomcat y la diferencia entre un servidor web y uno de aplicaciones!


