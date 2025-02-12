# Spring Framework

Luego de tener una configuración simple con el servidor de aplicaciones Tomcat, vamos a integrar el Spring Framework al proyecto.

Antes, vamos a explorar el uso de páginas en JSP.


# Ciclo de vida de un Servlet

Todo servidor de aplicaciones de Java tiene por dentro un Servlet Container, que es el componente del servidor de aplicaciones (como Tomcat) que gestiona el ciclo de vida de los servlets y maneja las solicitudes HTTP, facilitando la comunicación entre el cliente y la aplicación web. El servlet container de Tomcat se llama Catalina.

Catalina genera una única instancia de cada Servlet, reutilizándolo. Por cada request del cliente, se genera un nuevo hilo a partir del servlet. 

<p align="center">
        <img src="https://github.com/Domiciano/Compunet2-251/blob/main/Images/image6.png" width="512">
</p>

Esta única instancia es inicializada por medio del método `init()` 
