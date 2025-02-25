# Springboot

Spring Boot es una extensión de Spring Framework que simplifica la creación de aplicaciones Spring al eliminar la configuración manual extensa. Proporciona configuraciones automáticas, un servidor embebido y convenciones predeterminadas para acelerar el desarrollo, manteniendo la flexibilidad y potencia de Spring.

# Creación del primer proyecto

En IntelliJ, cree un nuevo proyecto

<p align="center">
<img src="https://raw.githubusercontent.com/Domiciano/Compunet2-251/refs/heads/main/Images/image11.png" width="512">
</p>

Usemos Maven en la sección de type.

<p align="center">
<img src="https://raw.githubusercontent.com/Domiciano/Compunet2-251/refs/heads/main/Images/image12.png" width="512">
</p>

Vamos a agregar las dependencias por nuestra cuenta usando el `pom.xml`, así que le damos a **Create**

# Dependencia de Web

Vamos a agregar la dependencia web en el `pom.xml`

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```
