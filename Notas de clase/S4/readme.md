# Spring Framework

Luego de tener una configuración simple con el servidor de aplicaciones Tomcat, vamos a integrar el Spring Framework al proyecto.

Antes, vamos a poner los puntos sobre las ies, conceptualmente


# Ciclo de vida de un Servlet

Todo servidor de aplicaciones Java contiene un Servlet Container, que es el componente encargado de gestionar el ciclo de vida de los servlets, manejar las solicitudes HTTP y facilitar la comunicación entre el cliente y la aplicación web. En el caso de Tomcat, su Servlet Container se llama Catalina.

Catalina crea una única instancia de cada Servlet y la reutiliza. Para cada solicitud del cliente, el Servlet Container genera un nuevo hilo que ejecuta el método service(), el cual redirige a doGet(), doPost(), u otro método según el tipo de petición.

La instancia del servlet es inicializada una sola vez mediante el método init().

<p align="center">
        <img src="https://github.com/Domiciano/Compunet2-251/blob/main/Images/image6.png" width="512">
</p>

Finalmente, `destroy()` se ejecuta una sola vez, justo antes de que el servlet sea eliminado, lo que ocurre cuando el servidor se apaga o el servlet es descargado.

Asimismo, un archivo JSP es convertido en un servlet en tiempo de ejecución por el Servlet Container. Cuando se solicita un JSP, este se traduce a una clase Java que extiende HttpServlet, se compila y luego se ejecuta para generar y entregar la respuesta al cliente.
