[t] Introducción

Luego de tener una configuración simple con el servidor de aplicaciones Tomcat, vamos a integrar el Spring Framework al proyecto.

Si no completaste la sesión S3, puedes clonar este repositorio:
[link url="https://github.com/Domiciano/Compu2EjemploServlet"]Repositorio de ejemplo[/link]

Antes, vamos a poner los puntos sobre las íes, conceptualmente.

[st] Ciclo de vida de un Servlet

Todo servidor de aplicaciones Java contiene un Servlet Container, que es el componente encargado de gestionar el ciclo de vida de los servlets, manejar las solicitudes HTTP y facilitar la comunicación entre el cliente y la aplicación web. En el caso de Tomcat, su Servlet Container se llama Catalina.

Catalina crea una única instancia de cada Servlet y la reutiliza. Para cada solicitud del cliente, el Servlet Container genera un nuevo hilo que ejecuta el método `service()`, el cual redirige a `doGet()`, `doPost()`, u otro método según el tipo de petición. La instancia del servlet es inicializada una sola vez mediante el método `init()`.

[i]image6.png|Ciclo de vida de un Servlet

Finalmente, `destroy()` se ejecuta una sola vez, justo antes de que el servlet sea eliminado, lo que ocurre cuando el servidor se apaga o el servlet es descargado.

Asimismo, un archivo JSP es convertido en un servlet en tiempo de ejecución por el Servlet Container. Cuando se solicita un JSP, este se traduce a una clase Java que extiende `HttpServlet`, se compila y luego se ejecuta para generar y entregar la respuesta al cliente.

[st] Spring IoC Container

El IoC Container es un componente de Spring que gestiona instancias de objetos llamados beans. Un bean es cualquier clase de la aplicación que se registra en el contenedor, ya sea de forma explícita o automática. El IoC Container se encarga de crear, configurar y administrar sus instancias, permitiendo su uso en diferentes partes de la aplicación sin necesidad de instanciarlos manualmente.

Inicialmente vamos a registrarlos de forma explícita. Para eso necesitamos primero el IoC Container.

[st] Instalación del IoC Container
[c:xml]
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>6.2.2</version>
</dependency>
[end]

[st] Ejemplo de Bean

La aplicación tendrá una lista de mensajes que se llenará en la medida que clientes envíen los mensajes. Tenga en cuenta que no tenemos persistencia. Por lo cual una vez el servidor haya terminado su ejecución, la información se perderá.

[c:java]
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
[end]

[st] Registro del Bean en el IoC Container

En resources, cree un archivo llamado `applicationContext.xml`, cuyo contenido es el siguiente:

[c:xml]
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <bean id="messageService" class="org.example.yourproject.service.MessageService" />
    
</beans>
[end]

[st] Creación del IoC Container

Aquí lo que va a hacer es crear un contexto para la aplicación de modo que el IoC Container podrá ser accedido en cualquier parte de la aplicación. El IoC Container contendrá los beans dentro del XML.

[c:java]
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Application {

    private static final ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");

    public static ApplicationContext getContext() {
        return context;
    }

}
[end]

[st] Uso del bean

Cree un Servlet que permita el uso del bean. Tendrá un método POST que recibirá un parámetro llamado `message` que se agregará al arreglo del Bean.

[c:java]
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
[end]

[st] Renderizado y envío de mensajes
[c:java]
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
[end]