# Servidor de Aplicaciones

<p align="center">
        <img src="https://github.com/Domiciano/Compunet2-251/blob/main/Images/image5.png" width="512">
</p>

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

```xml
...
<dependency>
  <groupId>jakarta.servlet</groupId>
  <artifactId>jakarta.servlet-api</artifactId>
  <version>6.1.0</version>
  <scope>provided</scope>
</dependency>
...
```

# 4. Definir packing

Vamos a requerir crear un artefacto distribuible del proyecto. Eso se hace por medio de Maven. Por defecto hace el packing en el formato `.jar`. Sin embargo, vamos a hacerlo con `.war` ya que Tomcat es capaz de usar este formato.

```xml
<project ...>
  ...
  <packaging>war</packaging>
  ...
</project>
```

# 5. Verificar versión de Java
Debe verificar que esté usando la misma versión de Java tanto en su sistema como en IntelliJ. Esto es porque quien compila el proyecto es IntelliJ, pero Tomcat usará el Java JDK o JRE de su sistema.

Para verificar la versión de Java de su sistema, en consola escriba
```sh
java -version
```

Debería concordar o ser inferior la versión de compilación. Esto lo puede cambiar en IntelliJ. Vaya a `File > Project Structure`. En la sección de `Project` podrá elegir el SDK. 

Finalmente, si debe cambiar el SDK, edite el `pom.xml`

```xml
<properties>
  <maven.compiler.source>18</maven.compiler.source>
  <maven.compiler.target>18</maven.compiler.target>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
```

# 6. Verificar estructura de carpetas

Debe crear un carpeta llamada webapp en la carpeta main. Dentro, puede crear su index.jsp

```
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
```

# 7. Cree su primer Servlet

Cree el primer servlet. De momento con el método `doGet`

```java
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
```

# 8. Cree su primer JSP

```xml
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
      <title>Title</title>
  </head>
  <body>
    <h1>Beta Gamma Alfa Delta</h1>
  </body>
</html>
```

# 9. Empaquetar el proyecto

Para empaquetar el proyecto, vaya a `Maven > Excecute Maven Goal` y ejecute
```sh
mvn clean package
```

Esto generará su `.war` en el folder `./target`

# 10. Usar el WAR

Ya con el `.war`, vaya a la carpeta donde descomprimió Tomcat y ponga el `.war` en el folder `webapps`

# 11. Ejecutar el servidor
Vaya a la carpeta `bin` de Tomcat y ejecute

```sh
./startup.sh
```

Puede detener el server usando
```sh
./shutdown.sh
```


# Automatizar el proceso

Vaya a `Run > Run... > Edit Configurations`. Use `+`. Busque `Tomcat Server/Local`.

En la pestaña `Server`, en Application Server vaya a Configure y añada el servidor de Tomcat

Vaya a la pestaña de Deployment y use `+ > Artifact` y seleccione `App:war exploded`. Donde App es el nombre de su proyecto.

Verifique que el Application Context quedó como `/App_war_exploded`. Puede libremente alterar el contexto.

Dele al Run y disfrute 😎

# Enlaces

[Presentación sobre Aplicaciones](https://docs.google.com/presentation/d/1i5aWGAKXkE5JuCLipIYfmWFbq11-xHZY/edit?usp=sharing&ouid=117897710133227559254&rtpof=true&sd=true)
