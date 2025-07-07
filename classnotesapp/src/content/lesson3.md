[t] Servidor de Aplicaciones

[i] image5.png|Diagrama de servidor de aplicaciones

[p]
En esta clase trabajaremos con el servidor de Aplicaciones Tomcat y lo configuraremos manualmente para verificar su funcionamiento usando como base nuestros conocimientos previos de Servidores Web.

[p]
El propósito es observar las principales características de un servidor de aplicaciones y qué provee que el servidor web no.

[st] Descargar el servidor de aplicaciones

[p]
Vamos a descargar Tomcat 10 de la URL:
[link] Tomcat 10 https://tomcat.apache.org/download-10.cgi

[p]
Descargue el ZIP y descomprímalo. Si está en Mac o Linux, debe darle permisos a la carpeta de ejecutar los scripts de tipo `.sh`.

[c:sh]
chmod +x bin/*.sh
[end]

[st] Cree un proyecto Maven

[p]
Con el nombre que desee.

[st] Instalar dependencias

[p]
Debemos instalar el Jakarta Servlet API. Esta API permite crear servlets para procesar solicitudes HTTP y generar respuestas dinámicas en aplicaciones web Java.

[c:xml]
<dependency>
  <groupId>jakarta.servlet</groupId>
  <artifactId>jakarta.servlet-api</artifactId>
  <version>6.1.0</version>
  <scope>provided</scope>
</dependency>
[end]

[st] Definir packing

[p]
Vamos a requerir crear un artefacto distribuible del proyecto. Eso se hace por medio de Maven. Por defecto hace el packing en el formato `.jar`. Sin embargo, vamos a hacerlo con `.war` ya que Tomcat es capaz de usar este formato.

[c:xml]
<project ...>
  ...
  <packaging>war</packaging>
  ...
</project>
[end]

[st] Verificar versión de Java

[p]
Debe verificar que esté usando la misma versión de Java tanto en su sistema como en IntelliJ. Esto es porque quien compila el proyecto es IntelliJ, pero Tomcat usará el Java JDK o JRE de su sistema.

[c:sh]
java -version
[end]

[p]
Debería concordar o ser inferior la versión de compilación. Esto lo puede cambiar en IntelliJ. Vaya a `File > Project Structure`. En la sección de `Project` podrá elegir el SDK. Finalmente, si debe cambiar el SDK, edite el `pom.xml`:

[c:xml]
<properties>
  <maven.compiler.source>18</maven.compiler.source>
  <maven.compiler.target>18</maven.compiler.target>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
[end]

[st] Verificar estructura de carpetas

[p]
Debe crear una carpeta llamada webapp en la carpeta main. Dentro, puede crear su index.jsp

[c:tree]
📦 project
 ┣ 📂 src
 ┃ ┗ 📂 main
 ┃   ┣ 📂 java
 ┃   ┃  ┗ 📂 com.icesi.webappexample
 ┃   ┃    ┗ 📂 servlet
 ┃   ┃       ┗ 📄 ServletExample.java
 ┃   ┣ 📂 resources              
 ┃   ┗ 📂 webapp
 ┃      ┗ 📄 index.jsp
 ┗ 📄 pom.xml 
[end]

[st] Cree su primer Servlet

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

[st] Cree su primer JSP

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

[st] Empaquetar el proyecto

[p]
Para empaquetar el proyecto, vaya a `Maven > Execute Maven Goal` y ejecute:

[c:sh]
mvn clean package
[end]

[p]
Esto generará su `.war` en el folder `./target`

[st] Usar el WAR

[p]
Ya con el `.war`, vaya a la carpeta donde descomprimió Tomcat y ponga el `.war` en el folder `webapps`. Renómbrelo para que sea un nombre sencillo.

[st] Ejecutar el servidor

[p]
Vaya a la carpeta `bin` de Tomcat y ejecute:

[c:sh]
./startup.sh
[end]

[p]
En Windows:

[c:bat]
./startup.bat
[end]

[p]
Puede detener el server usando:

[c:sh]
./shutdown.sh
[end]

[p]
En Windows:

[c:bat]
./shutdown.bat
[end]

[st] Ingresar al sitio

[p]
La URL de ingreso es:
[inline-code]http://localhost:8080/<nombre>[inline-code]

[p]
Esto carga el index.jsp.
[inline-code]http://localhost:8080/<nombre>/hello[inline-code]

[p]
Esto carga la respuesta desde el Servlet.
Donde <nombre> es el nombre del war.

[st] Automatizar el proceso

[p]
Vaya a `Run > Run... > Edit Configurations`. Use `+`. Busque `Tomcat Server/Local`.

[p]
En la pestaña `Server`, en Application Server vaya a Configure y añada el servidor de Tomcat.

[p]
Vaya a la pestaña de Deployment y use `+ > Artifact` y seleccione `App:war exploded`. Donde App es el nombre de su proyecto.

[p]
Verifique que el Application Context quedó como `/App_war_exploded`. Puede libremente alterar el contexto.


