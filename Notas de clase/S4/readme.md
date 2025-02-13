# Spring Framework

Luego de tener una configuración simple con el servidor de aplicaciones Tomcat, vamos a integrar el Spring Framework al proyecto.

Si por azares del destino, no completó la sesión S3, puede clonar este repositorio

```
https://github.com/Domiciano/Compu2EjemploServlet
```

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

# Sigamos con el ejercicio
Vamos a retomar desde la sesión anterior. Allí configuramos el servidor de aplicaciones Tomcat y creamos una aplicación con un Servlet y un archivo JSP que podemos acceder desde el navegador por medio de URL.

Vamos a hacer los siguiente

# 1. Spring IoC Container

El IoC Container es un componente de Spring que gestiona instancias de objetos llamados beans. Un bean es cualquier clase de la aplicación que se registra en el contenedor, ya sea de forma explícita o automática. El IoC Container se encarga de crear, configurar y administrar sus instancias, permitiendo su uso en diferentes partes de la aplicación sin necesidad de instanciarlos manualmente.

Inicialmente vamos a registrarlos de forma explícta. Para eso necesitamos primero el IoC Container.

# 2. Instalación del IoC Container

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>6.2.2</version>
</dependency>
```

# 3. Ejemplo de Bean
La aplicación tendrá una lista de mensajes que se llenará en la medida que clientes envien los mensajes. Tenga en cuenta que no tenemos persistencia. Por lo cual una vez el servidor haya terminado su ejecución, la información se perderá

```java
import java.util.ArrayList;
import java.util.List;

public class MessageService {
    private final List<String> messages = new ArrayList<>();

    public void addMessage(String message) {
        messages.add(message);
    }

    public List<String> getMessages() {
        return messages;
    }
}
```

Observer que es una clase común y corriente

# 4. Registro del Bean en el IoC Container

En resurces, cree un archivo llamado `applicationContext.xml`, cuyo contenido es el siguiente

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <bean id="messageService" class="org.example.yourproject.service.MessageService" />
    
</beans>
```

# 5. Creación del IoC Container

Aquí lo que va a hacer es crear un contexto para la aplicación de modo que el IoC Container podrá ser accedido en cualquier parte de la aplicación. El IoC Container contendrá los beans dentro del XML

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Application {

    private static final ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");

    public static ApplicationContext getContext() {
        return context;
    }

}
```

Note que él creará el IoC Container con los beans que estén declarados en el xml

# 6. Uso del bean

Cree un Servlet que permita el uso del bean. Tendrá un método POST que recibirá un parámetro llamado `message` que se agregará al arreglo del Bean

```java
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/messageServlet")
public class MessageServlet extends HttpServlet {

    private MessageService messageService;

    @Override
    public void init() {
        messageService = (MessageService) Application.getContext().getBean("messageService");
    }


    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String newMessage = req.getParameter("message");
        if (newMessage != null && !newMessage.trim().isEmpty()) {
            messageService.addMessage(newMessage);
        }
        resp.sendRedirect("./");
    }
    
}
```

# 7. Rederizado y envío de mensajes

```xml
<%@ page import="org.springframework.context.support.ClassPathXmlApplicationContext" %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>JSP - Hello World</title>
</head>
<body>
    <%
        MessageService messageService = (MessageService) Application.getContext().getBean("messageService");
        for(String message : messageService.getMessages()){
            out.println(message);
        }
    %>

    <form action="messageServlet" method="post">
        <input type="text" name="message">
        <input type="submit">
    </form>

</body>
</html>
```
