# Spring Framework

Luego de tener una configuración simple con el servidor de aplicaciones Tomcat, vamos a integrar el Spring Framework al proyecto.

Antes, vamos a poner los puntos sobre las íes, conceptualmente


# Ciclo de vida de un Servlet

Todo servidor de aplicaciones Java contiene un Servlet Container, que es el componente encargado de gestionar el ciclo de vida de los servlets, manejar las solicitudes HTTP y facilitar la comunicación entre el cliente y la aplicación web. En el caso de Tomcat, su Servlet Container se llama Catalina.

Catalina crea una única instancia de cada Servlet y la reutiliza. Para cada solicitud del cliente, el Servlet Container genera un nuevo hilo que ejecuta el método service(), el cual redirige a doGet(), doPost(), u otro método según el tipo de petición.

La instancia del servlet es inicializada una sola vez mediante el método init().

<p align="center">
        <img src="https://github.com/Domiciano/Compunet2-251/blob/main/Images/image6.png" width="512">
</p>

Finalmente, `destroy()` se ejecuta una sola vez, justo antes de que el servlet sea eliminado, lo que ocurre cuando el servidor se apaga o el servlet es descargado.

Asimismo, un archivo JSP es convertido en un servlet en tiempo de ejecución por el Servlet Container. Cuando se solicita un JSP, este se traduce a una clase Java que extiende HttpServlet, se compila y luego se ejecuta para generar y entregar la respuesta al cliente.


# Spring IoC Container

El IoC Container es un componente de Spring que gestiona instancias de objetos llamados beans. Un bean es cualquier clase de la aplicación que se registra en el contenedor, ya sea de forma explícita o automática. El IoC Container se encarga de crear, configurar y administrar estos beans, permitiendo su uso en diferentes partes de la aplicación sin necesidad de instanciarlos manualmente.

Inicialmente vamos a registrarlos de forma explícta. Para eso necesitamos primero el IoC Container.

# Instalación del IoC Container

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>6.2.2</version>
</dependency>
```

# Ejemplo de Bean
La aplicación tendrá una lista de mensajes que se llenará en la medida que clientes envien los mensajes. Tenga en cuenta que no tenemos persistencia. Por lo cual una vez el servidor haya terminado su ejecución, la información se perderá

```java
import java.util.ArrayList;
import java.util.List;

public class MessageService {
    private List<String> messages = new ArrayList<>();

    public void addMessage(String message) {
        messages.add(message);
    }

    public List<String> getMessages() {
        return messages;
    }
}
```

# Registro del Bean en el IoC Container

En resurces, cree un archivo llamado `applicationContext.xml`, cuyo contenido es el siguiente

```xml
<beans xmlns="http://www.springframework.org/schema/beans">
    <bean id="messageService" class="com.example.service.MessageService" scope="singleton" />
</beans>
```
