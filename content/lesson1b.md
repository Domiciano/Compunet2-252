# Construye tu servidor web paso a paso

<!-- tags: ServerSocket, Socket, accept, Runnable, Thread, BufferedReader, DataOutputStream, readLine, CRLF, puerto ocupado, Address already in use, la página se queda cargando, telnet localhost -->

Aquí construyes, en Java puro, el servidor web que describimos en la lección anterior. Son **ocho pasos**, cada uno con un objetivo concreto y una forma de comprobar que va bien. Al terminar tendrás un servidor multi-hilos que imprime en pantalla las peticiones que le manda el browser.

> **Cómo usar esta guía.** Donde veas `// TODO` te toca a ti escribir esa línea. Todo lo demás está completo: cópialo tal cual. No avances de paso sin haber comprobado el anterior.

## Paso 0 · Prepara el proyecto

Crea un proyecto Java vacío con dos archivos:

```
src/
  WebServer.java
  HttpRequest.java
```

Y estos tres imports en ambos archivos:

```java
import java.io.*;
import java.net.*;
import java.util.*;
```

**Comprobación:** el proyecto compila (aunque no haga nada todavía).

## Paso 1 · El esqueleto de las dos clases

El servidor son dos clases con responsabilidades separadas, y merece la pena entender por qué antes de escribirlas:

| Clase | Responsabilidad |
|---|---|
| `WebServer` | Escucha en el puerto y acepta conexiones. Nunca lee ni escribe datos |
| `HttpRequest` | Atiende **una** conexión: lee la petición y responde. Corre en su propio hilo |

`HttpRequest` implementa `Runnable` porque es lo que exige el constructor de `Thread`: para poder ejecutar algo en un hilo aparte hay que entregarle un objeto con un método `run()`.

```java
public final class WebServer {
    public static void main(String[] args) throws Exception {
        // ...
    }
}
```

```java
final class HttpRequest implements Runnable {
    // ...
}
```

## Paso 2 · Abre el socket de escucha

Elige un puerto por encima de `1024` y crea el `ServerSocket`. Esto es lo único que hace `WebServer` antes de entrar en el bucle.

```java
public static void main(String[] args) throws Exception {
    int port = 6789;

    // TODO 1: crea el socket de escucha en ese puerto
    ServerSocket serverSocket = ?;

    System.out.println("Server listening on port " + port);
}
```

> `ServerSocket` recibe el puerto en su constructor. Si el puerto ya está en uso, esta línea lanza excepción — no es tu código, es que dejaste otro servidor corriendo.

**Comprobación:** ejecuta. Debe imprimir `Server listening on port 6789` y quedarse ahí sin terminar.

## Paso 3 · Acepta conexiones en un bucle infinito

Un servidor no atiende una petición y se muere: atiende para siempre. Por eso el `accept()` va dentro de un `while (true)`.

```java
while (true) {
    // TODO 2: espera y acepta la siguiente conexión entrante
    Socket connectionSocket = ?;

    System.out.println("Client connected");
}
```

El método `accept()` **bloquea**: la ejecución se detiene ahí hasta que llegue un cliente. Cuando llega, devuelve un `Socket` nuevo —el socket de conexión— y el bucle vuelve a empezar.

**Comprobación:** ejecuta el servidor y abre `http://localhost:6789/` en el browser. La página no cargará (todavía no respondemos nada), pero en la consola debe aparecer `Client connected`, probablemente varias veces.

## Paso 4 · Un hilo por conexión

Si atendieras la petición aquí mismo, el servidor quedaría ocupado y no podría aceptar a nadie más mientras tanto. La solución es entregarle el socket a un `HttpRequest` y ejecutarlo en un hilo aparte, para que el hilo principal vuelva de inmediato al `accept()`.

```java
while (true) {
    Socket connectionSocket = serverSocket.accept();

    // Objeto que sabe atender esta conexión
    HttpRequest request = new HttpRequest(connectionSocket);

    // TODO 3: crea un hilo para ese objeto y arráncalo
    Thread thread = ?;
    ?
}
```

> Se crea el `Thread` pasándole el `Runnable` al constructor, y se arranca con `start()`. Llamar a `run()` directamente **no crea ningún hilo**: ejecutaría el método en el hilo principal y perderías todo el paralelismo.

Con esto `WebServer` está terminado. Lo que queda es `HttpRequest`.

## Paso 5 · El constructor y las dos variables

`HttpRequest` necesita guardar el socket que le pasaron, y tener a mano la constante `CRLF` con la que HTTP termina cada línea.

```java
final class HttpRequest implements Runnable {

    final static String CRLF = "\r\n";
    Socket socket;

    public HttpRequest(Socket socket) throws Exception {
        this.socket = socket;
    }

    public void run() {
        // ...
    }

    private void processRequest() throws Exception {
        // ...
    }
}
```

La lógica real va en `processRequest()`, no en `run()`. El motivo es concreto: `run()` está declarado en `Runnable` sin `throws`, así que **no puede propagar excepciones**. Poniendo el trabajo en un método aparte que sí las lanza, `run()` queda como un simple envoltorio que las captura.

```java
public void run() {
    try {
        processRequest();
    } catch (Exception e) {
        System.out.println(e);
    }
}
```

**Comprobación:** el proyecto compila y sigue imprimiendo `Client connected` al abrir el browser.

## Paso 6 · Abre los streams del socket

Un socket da dos streams: uno para leer lo que manda el cliente y otro para escribirle. Se abren al principio de `processRequest()`.

```java
private void processRequest() throws Exception {

    // TODO 4: stream de salida — para escribirle al cliente
    DataOutputStream out = new DataOutputStream( ? );

    // TODO 5: stream de entrada — envuelto para poder leer línea a línea
    BufferedReader in = new BufferedReader(new InputStreamReader( ? ));

    // ...
}
```

> Los dos streams salen del mismo objeto `socket`, con `getOutputStream()` y `getInputStream()`.

Fíjate en la asimetría: la entrada la envolvemos en `BufferedReader` porque queremos leer **líneas de texto**, y el `InputStreamReader` intermedio es el que convierte bytes en caracteres. La salida no la envolvemos en nada de texto, porque más adelante escribiremos también imágenes, y una imagen son bytes crudos.

## Paso 7 · Lee la request line

La primera línea que manda el cliente es la importante: trae el método y el recurso pedido. Se lee con `readLine()`, que devuelve la línea sin el `CRLF` final.

```java
// TODO 6: lee la primera línea de la petición
String line = ?;

System.out.println(line);
```

**Comprobación:** recarga el browser. En consola debe salir algo como `GET / HTTP/1.1`. **Este es el momento en que tu servidor entiende HTTP por primera vez.**

## Paso 8 · Lee los headers y cierra

Después de la request line vienen los headers. No sabemos cuántos son, así que se leen en bucle hasta encontrar la línea en blanco que marca el final.

```java
// Lee y muestra las líneas de header
while ((line = in.readLine()) != null && !line.isEmpty()) {
    System.out.println(line);
}

// Cierra los streams y el socket
out.close();
in.close();
socket.close();
```

Las dos condiciones del `while` cubren dos finales distintos: `!line.isEmpty()` es el final normal —la línea en blanco— y `line != null` es el cliente que cerró la conexión antes de tiempo. Sin la comprobación de `null` el bucle petaría con `NullPointerException` cada vez que alguien cierra la pestaña a medias.

**Comprobación final:** recarga el browser. Deberías ver la petición completa:

```http
GET / HTTP/1.1
Host: localhost:6789
User-Agent: Mozilla/5.0 ...
Accept: text/html,application/xhtml+xml,...
Accept-Language: es-ES,es;q=0.9
Connection: keep-alive
```

La página del browser seguirá en blanco o con error, y **está bien**: todavía no enviamos respuesta. Eso es lo primero de la siguiente lección.

## Probar sin browser

El browser manda muchos headers y a veces varias peticiones seguidas, lo que ensucia la consola. Para una prueba limpia, `telnet` te deja escribir la petición a mano:

```bash
telnet localhost 6789
```

Escribe `GET /index.html HTTP/1.0`, pulsa Enter **dos veces** (la segunda es la línea en blanco) y observa la consola del servidor.

## Cuando algo no funciona

| Síntoma | Causa habitual |
|---|---|
| `java.net.BindException: Address already in use` | Quedó una ejecución anterior viva. Deténla, o cambia de puerto |
| `Connection refused` en el browser | El servidor no está corriendo, o pusiste otro puerto en la URL |
| La consola no imprime nada al conectar | El `accept()` no está dentro del `while`, o falta el `start()` del hilo |
| La página se queda cargando indefinidamente | Normal en esta lección: aún no enviamos respuesta |
| `NullPointerException` al leer headers | Falta la condición `line != null` en el `while` |
| El servidor atiende a un cliente y se cuelga con el segundo | Llamaste a `run()` en vez de `start()` |

## Checklist

Antes de pasar a la siguiente lección, comprueba que:

- [ ] El servidor arranca e imprime que está escuchando.
- [ ] Acepta varias conexiones seguidas sin morirse.
- [ ] Cada conexión se atiende en un hilo distinto.
- [ ] Imprime la request line y todos los headers.
- [ ] Cierra streams y socket al terminar.

En la próxima lección le añadimos lo que falta: leer qué archivo pidieron, buscarlo y devolverlo con una respuesta HTTP en forma.
