[t] Construcción de un servidor web multi-hilos

[i] image1.png|Diagrama de arquitectura de servidor web

[p]
En esta práctica usted debe completar el código, en lenguaje Java, para construir un servidor web. Al final se tendrá un servidor web multi-hilos (multi-threaded) con la capacidad de procesar solicitudes simultáneas en paralelo. Se considerará que la práctica ha sido concluida con éxito cuando su servidor web pueda atender las solicitudes de un browser para web. Puede utilizar como referencia el [link] Código de ejemplo https://github.com/Domiciano/Compunet2-251/blob/main/Notas%20de%20clase/S1/example.md

[p]
Para este servidor se implementará parcialmente la versión 1.0 de HTTP, como está definida en el RFC 1945, donde las solicitudes (request) HTTP son enviadas separadas para cada componente de la página web. El servidor debe ser capaz de manipular solicitudes de servicio simultáneas en paralelo. Esto significa que el servidor es multi-hilos (multi-threaded). En el hilo principal, el servidor escuchará por un puerto fijo. Cuando reciba una solicitud de conexión TCP, establecerá una conexión TCP a través de otro socket (socket de conexión) y atenderá la solicitud en un hilo separado. Para simplificar el proceso de programación, el código debe ser desarrollado en dos etapas. En la primera se escribirá un servidor multi-hilos que simplemente mostrará en la pantalla el contenido de la solicitud (request) HTTP que recibe. Cuando este código esté funcionando de manera correcta, usted podrá agregar, en la segunda etapa, el código requerido para generar una respuesta HTTP apropiada al browser.

[st] Servidor HTTP Simple

[p]
Servidor web multi-hilos que mostrará el contenido de la solicitud (request) HTTP que recibe. A continuación se hará un recorrido a través del código para la primera parte de la implementación de un servidor Web. En los lugares donde usted encuentre un signo de interrogación, ?, usted debe completar el código que hace falta.

[p]
La primera parte de la implementación del servidor web será multi-hilos, ya que el procesamiento de cada solicitud HTTP que llegue será atendida dentro de un hilo de ejecución separado. Esto permitirá al servidor:
- Atender múltiples clientes en paralelo
- Realizar transferencias de archivos múltiples en paralelo al mismo cliente.

[p]
Cuando se crea un nuevo hilo de ejecución, se debe pasar al constructor de hilos una instancia de alguna clase que implemente la interface Runnable. Esta es la razón por la cual se debe definir una clase separada llamada SolicitudHttp. La estructura del servidor web será la siguiente:

[c:java]
import java.io.* ;
import java.net.* ;
import java.util.* ;

public final class ServidorWeb {
        public static void main(String argv[]) throws Exception {
                . . .
        }
}

final class SolicitudHttp implements Runnable {
        . . .
}
[end]

[p]
Normalmente, los servidores web atienden las solicitudes que ellos reciben a través del puerto 80. Para este práctica usted puede escoger cualquier número de puerto superior a 1024 (pero recuerde utilizar este mismo número cuando haga la solicitud desde el browser). En el siguiente trozo de código se utiliza el número 6789 para el puerto.

[c:java]
public static void main(String argv[]) throws Exception {
        // Establece el número de puerto.
        int puerto = 6789;

        . . .
}
[end]

[p]
Luego, se abre un socket y se espera a que se solicite una conexión TCP. Debido a que el servidor estará recibiendo solicitudes indefinidamente, se colocará la operación de escucha (listen) dentro de un ciclo infinito.

[c:java]
// Estableciendo el socket de escucha.
?

// Procesando las solicitudes HTTP en un ciclo infinito.
while (true) {
        // Escuchando las solicitudes de conexión TCP.
        ?
        . . .
}
[end]

[p]
Cuando se reciba una solicitud de conexión se debe crear un objeto SolicitudHttp, pasando al método constructor una referencia al objeto Socket que representa la conexión establecida con el cliente.

[c:java]
// Construye un objeto para procesar el mensaje de solicitud HTTP.
SolicitudHttp solicitud = new SolicitudHttp( ? );

// Crea un nuevo hilo para procesar la solicitud.
Thread hilo = new Thread(solicitud);

// Inicia el hilo.
hilo.start();
[end]

[p]
Para que el objeto SolicitudHttp maneje la solicitud de servicio HTTP que llega en un hilo separado, primero se debe crear una nueva instancia del objeto Thread, pasando a su método constructor una referencia al objeto SolicitudHttp, y luego se invoca el método start() del hilo recien creado.
Después que el nuevo hilo ha sido creado e iniciado, la ejecución en el hilo principal regresa al inicio del ciclo de procesamiento del mensaje. Entonces el hilo principal podrá seguir escuchando, esperando otras solicitudes de conexión TCP, mientras el nuevo hilo continua corriendo. Cuando se reciba otra solicitud de conexión TCP, el hilo principal realizará el mismo proceso de creación de un nuevo hilo sin importar si el hilo previo ha terminado o aún continua su ejecución.

[p]
Esto completa el código del método main(). Para el resto de la primera parte de la práctica, sólo resta desarrollar el código de la clase SolicitudHttp.

[p]
Se declararán dos variables para la clase SolicitudHttp: CRLF y socket. De acuerdo con la especificación del protocolo HTTP, debemos terminar cada línea de los mensajes de respuesta del servidor con un carriage return (CR) y un line feed (LF), por esto es conveniente definir CRLF. La variable socket será utilizada para guardar una referencia al socket de conexión, con el cual se invocó el constructor de esta clase. La estructura de la clase SolicitudHttp es mostrada a continuación:

[c:java]
final class SolicitudHttp implements Runnable {
        final static String CRLF = "\r\n";
        Socket socket;

        // Constructor
        public SolicitudHttp(Socket socket) throws Exception 
        {
                this.socket = socket;
        }

        // Implementa el método run() de la interface Runnable.
        public void run()
        {
                . . .
        }

        private void proceseSolicitud() throws Exception
        {
                . . .
        }
}
[end]

[p]
Para poder pasar una instancia de la clase SolicitudHttp al constructor de hilos, SolicitudHttp debe implementar la interface Runnable, que simplemente significa que se debe definir un método público llamado run() que retorna void. La mayor parte del procesamiento se realizará dentro del método proceseSolicitud(), que es invocado desde run().

[p]
Hasta este punto se ha venido permitiendo lanzar excepciones, sin manejarlas. Sin embargo, no se pueden lanzar excepciones desde run(), ya que se debe respetar estrictamente la declaración de run() en la interface Runnable, que no lanza ninguna excepción. Todo el código para procesamiento será colocado en proceseSolicitud(), y desde allí, lanzar las excepciones para run(). Dentro de run(), de forma explícita se capturarán y se manejarán las excepciones con un bloque try/catch.

[c:java]
// Implementa el método run() de la interface Runnable.
public void run() {
        try {
                proceseSolicitud();
        } catch (Exception e) {
                System.out.println(e);
        }
}
[end]

[p]
El siguiente paso es desarrollar el código interno de proceseSolicitud(). Primero se obtiene una referencia al stream de salida del socket. Luego se obtiene una referencia al stream de entrada del socket y se envuelven los filtros InputStreamReader y BufferedReader alrededor del stream de entrada ( no se debe envolver ningún filtro alrededor del stream de salida, ya que se escribirá directamente en el stream de salida).

[c:java]
private void proceseSolicitud() throws Exception {
        // Referencia al stream de salida del socket.
        BufferedWriter out = ?;

        // Referencia y filtros (InputStreamReader y BufferedReader) para el stream de entrada.
        BufferedReader in = ?;
        . . .
}
[end]

[p]
Ahora se puede recoger el mensaje de solicitud HTTP del cliente, esto se hace leyendo el stream de entrada del socket. El método readLine() de la clase BufferedReader extrae caracteres del stream de entrada hasta que encuentre un caracter end-of-line, o en este caso, la secuencia CRLF.
El primer elemento disponible en el stream de entrada será la línea del mensaje de solicitud HTTP.

[c:java]
// Recoge la línea de solicitud HTTP del mensaje.
String linea = ?;
// Muestra la línea de solicitud en la pantalla.
System.out.println(linea);
[end]

[p]
Después de obtener la línea de solicitud del mensaje, se deben recoger las líneas del header. Ya que no se sabe con anticipación cuántas líneas de header enviará el cliente, estas se deben recoger mediante un ciclo.

[c:java]
// recoge y muestra las líneas de header.
String linea = "";
while ((linea = in.readLine()) != null && !linea.isEmpty()) {
  System.out.println(linea);
}
[end]

[p]
Faltaría colocar las siguientes líneas de código para cerrar los streams y el socket de conexión.

[c:java]
// Cierra los streams y el socket.
out.close();
in.close();
socket.close();
[end]

[st] HTTP

[p]
En el [link] RFC 1945 https://datatracker.ietf.org/doc/html/rfc1945 está el esquema de response de un servidor HTTP.

[c:java]
HTTP/1.0 200 OK\r\n
Content-Type: text/html\r\n
Content-Length: 34\r\n
Connection: close\r\n
\r\n
<html><body>Hola Mundo</body></html>
[end]

[p]
Donde CRLF es `\r\n`
