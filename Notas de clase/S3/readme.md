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

4. Definir packing

Vamos a requerir crear un artefacto distribuible del proyecto. Eso se hace por medio de Maven. Por defecto hace el packing en el formato `.jar`. Sin embargo, vamos a hacerlo con `.war` ya que Tomcat es capaz de usar este formato.

```xml
<project ...>
  ...
  <packaging>war</packaging>
  ...
</project>
```

3. Verificar versión de Java
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




5. mvn clear package para generar el WAR

6. Mover el war al servidor de aplicaciones

7. Ejecutar el ./startup.sh


# Automatizar el proceso

