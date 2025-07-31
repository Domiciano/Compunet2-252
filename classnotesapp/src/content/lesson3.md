
[t] Servidor de Aplicaciones
En esta lección aprenderás a trabajar con el servidor de aplicaciones Tomcat, configurarlo manualmente y desplegar aplicaciones Java usando Maven y servlets. Verás las diferencias clave entre un servidor web y un servidor de aplicaciones.
[icon] image5.png|Diagrama de servidor de aplicaciones Tomcat
[st] Descarga y configuración de Tomcat
Descarga Tomcat 11 desde:
[code:plain]
https://tomcat.apache.org/download-11.cgi
[endcode]
Descomprime el `ZIP`. Si usas Mac o Linux, da permisos de ejecución a los scripts:
[code:bash]
chmod +x bin/*.sh
[endcode]

[st] Variable de entorno `JAVA_HOME`
Debes crear una variable de entorno que apunte a la ruta donde está instalado java.
Ruta típica en Windows
[code:bash]
C:\Program Files\Java\jdk-21
[endcode]
Ruta típica en Linux
[code:bash]
/usr/lib/jvm/java-21-openjdk-amd64
[endcode]
Ruta típica en Mac
[code:bash]
/opt/homebrew/opt/openjdk@21
[endcode]
Si no la encuentras prueba en Windows
[code:bash]
where java
[endcode]
En Mac/Linux
[code:bash]
which java
[endcode]
[st] Instala el comando `mvn`
Debes tener el comando `mvn` en tu shell, para eso, descarga Maven en
[code:bash]
https://maven.apache.org/download.cgi
[endcode]
Descarga el `.zip`, descomprímelo y agrega a tu variable `PATH` la ruta de la carpeta `bin` de maven.

Si estás en Windows, debes entrar a 
[code:bash]
Configuración avanzada del sistema > Variables de Entorno > Variables del Sistema
[endcode]
Busca la variable `PATH` para editarla y agregarle la ruta de maven.

En Linux o Mac debes editar tu archivo `.bashrc` o `.zshrc` de acuerdo al shell que manejas. Para saber cuál es tu shell usa
[code:bash]
echo $SHELL
[endcode]
Una vez que haya agregado la ruta de maven a `PATH`, cierra el shell y vuélvelo a abrir. Usa el comando
[code:bash]
mvn
[endcode]
Si reconoce el comando ya tienen maven en tu sistema.

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
  <maven.compiler.source>21</maven.compiler.source>
  <maven.compiler.target>21</maven.compiler.target>
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


