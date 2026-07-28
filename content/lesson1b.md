# Un servidor de una sola petición

<!-- tags: ServerSocket, Socket, accept, BufferedReader, DataOutputStream, readLine, CRLF, Content-Length, Address already in use, connection refused, la página se queda cargando, localhost 6789 -->

Vamos a construir el servidor web más pequeño que puede existir: un programa que atiende **una** petición, responde, y termina. No es útil, pero es completo — hace el ciclo entero de HTTP — y cabe en una pantalla.

Empezamos por aquí porque un servidor de verdad tiene dos complicaciones encima de esto: el bucle infinito y los hilos. Si las metemos desde el principio, cuando algo falle no sabrás si el problema es HTTP o es concurrencia. Aquí no hay concurrencia que valga: hay un cliente, una petición, una respuesta.

**Todo el código está completo.** Cópialo, ejecútalo, y lee la explicación de cada bloque.

## Paso 1 · Crea el archivo

Un único archivo, `SimpleWebServer.java`, con todo dentro de `main`:

```java
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;

public class SimpleWebServer {

    public static void main(String[] args) throws Exception {
        // Todo lo que sigue va aquí
    }
}
```

Fíjate en el `throws Exception` del `main`. Casi todo lo que toca la red puede fallar, y en este primer servidor no vamos a manejar esos errores: si algo sale mal, el programa muere con el stack trace, que para aprender es más informativo que un `catch` que se traga la excepción.

## Paso 2 · Abre el socket de escucha

```java
int port = 6789;

ServerSocket serverSocket = new ServerSocket(port);
System.out.println("Server listening on port " + port);
```

`ServerSocket` es el socket de **escucha**: le pide al sistema operativo el puerto 6789 y se queda con él. No transporta datos, solo recibe conexiones.

Elegimos 6789 porque los puertos por debajo de 1024 están reservados y suelen requerir permisos de administrador. Cualquier número libre por encima de 1024 sirve, pero tiene que ser el mismo que pongas en la URL del browser.

**Comprobación:** ejecuta. Debe imprimir `Server listening on port 6789` y quedarse ahí, sin terminar.

## Paso 3 · Espera a que llegue alguien

```java
Socket connectionSocket = serverSocket.accept();
System.out.println("Client connected");
```

`accept()` **bloquea**: la ejecución se detiene en esa línea hasta que un cliente se conecte. Cuando llega, devuelve un `Socket` distinto — el socket de **conexión** — y es por ese por donde viajan los bytes.

Esta es la distinción que más confunde al empezar, y conviene fijarla ahora:

| Socket | Cuántos | Para qué |
|---|---|---|
| `serverSocket` (escucha) | Uno, toda la ejecución | Aceptar conexiones |
| `connectionSocket` (conexión) | Uno por cliente | Leer y escribir datos |

**Comprobación:** ejecuta y abre `http://localhost:6789/` en el browser. Debe aparecer `Client connected`. La página quedará cargando — todavía no respondemos.

## Paso 4 · Abre los streams

```java
BufferedReader in = new BufferedReader(
        new InputStreamReader(connectionSocket.getInputStream()));

DataOutputStream out = new DataOutputStream(connectionSocket.getOutputStream());
```

Un socket da dos streams, uno de entrada y otro de salida, y los envolvemos de forma distinta a propósito:

- **La entrada** va envuelta en `InputStreamReader` (convierte bytes en caracteres) y luego en `BufferedReader` (agrupa caracteres en líneas). Lo hacemos porque una petición HTTP es texto y se lee **línea a línea**.
- **La salida** queda en `DataOutputStream`, sin ningún filtro de texto. Aquí escribiremos texto ahora, pero en un par de lecciones escribiremos imágenes, y una imagen no son caracteres.

## Paso 5 · Lee la petición

```java
// Primera línea: método, recurso y versión. Ej: GET /index.html HTTP/1.1
String requestLine = in.readLine();
System.out.println(requestLine);

// Después vienen los headers, uno por línea, hasta una línea en blanco
String headerLine;
while ((headerLine = in.readLine()) != null && !headerLine.isEmpty()) {
    System.out.println(headerLine);
}
```

`readLine()` devuelve la línea **sin** el `\r\n` del final, así que la línea en blanco que cierra los headers llega como cadena vacía. Esa es la condición de parada.

Las dos condiciones del `while` cubren dos finales distintos:

- `!headerLine.isEmpty()` — el final normal, la línea en blanco.
- `headerLine != null` — el cliente cerró la conexión antes de tiempo. `readLine()` devuelve `null` cuando el stream se acaba, y sin esta comprobación el `isEmpty()` explotaría con `NullPointerException`.

Y hay que leer los headers hasta el final aunque no nos interesen: si no vaciamos lo que el cliente mandó, el socket se queda con datos pendientes y algunos clientes se atascan.

**Comprobación:** recarga el browser. Debe salir la petición completa en la consola:

```http
GET / HTTP/1.1
Host: localhost:6789
User-Agent: Mozilla/5.0 ...
Accept: text/html,application/xhtml+xml,...
Connection: keep-alive
```

## Paso 6 · Responde

Aquí está el corazón de la lección. Una respuesta HTTP son cuatro piezas en este orden: status line, headers, **línea en blanco**, cuerpo.

```java
final String CRLF = "\r\n";

String body = "<html><body><h1>It works!</h1></body></html>";
byte[] bodyBytes = body.getBytes(StandardCharsets.UTF_8);

String head =
        "HTTP/1.0 200 OK" + CRLF +
        "Content-Type: text/html; charset=utf-8" + CRLF +
        "Content-Length: " + bodyBytes.length + CRLF +
        CRLF;                                   // <- la línea en blanco

out.write(head.getBytes(StandardCharsets.UTF_8));
out.write(bodyBytes);
out.flush();
```

Merece la pena mirar pieza por pieza:

- **`CRLF`.** La especificación exige que cada línea termine en `\r\n`, no en `\n`. Es la causa número uno de servidores que "no responden": algunos clientes toleran `\n` y otros descartan el mensaje sin decir nada.
- **`HTTP/1.0 200 OK`.** La status line. El `200` es **el único** campo que el browser mira para saber si le fue bien.
- **`Content-Type`.** Le dice al browser que interprete los bytes como HTML. Sin él no sabe si renderizar o descargar.
- **`Content-Length`.** Cuántos bytes tiene el cuerpo. Calculado sobre `bodyBytes.length`, **no** sobre `body.length()`: en UTF-8 una `ó` o una `ñ` ocupan dos bytes pero un solo carácter, así que contar caracteres daría un número corto y el browser se quedaría esperando el resto.
- **El `CRLF` suelto al final del head.** La línea en blanco que separa headers de cuerpo. Si falta, el browser sigue leyendo headers indefinidamente y la página se queda cargando para siempre, sin ningún error que te oriente.
- **`flush()`.** El stream acumula lo escrito en un buffer; `flush()` es lo que lo empuja de verdad por el socket.

Fíjate también en que el head se escribe como texto y el cuerpo como bytes, por separado. Ahora parece innecesario —el cuerpo también es texto— pero es exactamente la estructura que necesitaremos cuando el cuerpo sea un JPEG.

## Paso 7 · Cierra todo

```java
in.close();
out.close();
connectionSocket.close();
serverSocket.close();
```

En HTTP/1.0 el cierre de la conexión **es parte del protocolo**: así es como el servidor dice "terminé de hablar". Cerramos también el `serverSocket`, con lo que el programa libera el puerto y termina.

## El código completo

```java
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;

public class SimpleWebServer {

    public static void main(String[] args) throws Exception {

        final String CRLF = "\r\n";
        int port = 6789;

        // 1. Socket de escucha
        ServerSocket serverSocket = new ServerSocket(port);
        System.out.println("Server listening on port " + port);

        // 2. Espera bloqueante hasta que llegue un cliente
        Socket connectionSocket = serverSocket.accept();
        System.out.println("Client connected");

        // 3. Streams de la conexión
        BufferedReader in = new BufferedReader(
                new InputStreamReader(connectionSocket.getInputStream()));
        DataOutputStream out = new DataOutputStream(connectionSocket.getOutputStream());

        // 4. Lee la petición
        String requestLine = in.readLine();
        System.out.println(requestLine);

        String headerLine;
        while ((headerLine = in.readLine()) != null && !headerLine.isEmpty()) {
            System.out.println(headerLine);
        }

        // 5. Construye y envía la respuesta
        String body = "<html><body><h1>It works!</h1></body></html>";
        byte[] bodyBytes = body.getBytes(StandardCharsets.UTF_8);

        String head =
                "HTTP/1.0 200 OK" + CRLF +
                "Content-Type: text/html; charset=utf-8" + CRLF +
                "Content-Length: " + bodyBytes.length + CRLF +
                CRLF;

        out.write(head.getBytes(StandardCharsets.UTF_8));
        out.write(bodyBytes);
        out.flush();

        // 6. Cierra
        in.close();
        out.close();
        connectionSocket.close();
        serverSocket.close();

        System.out.println("Done");
    }
}
```

## Pruébalo

Ejecuta y abre `http://localhost:6789/` en el browser. **Debe verse "It works!"** — y el programa termina inmediatamente después, imprimiendo `Done`.

Si recargas, el browser dirá que no puede conectar: el servidor ya no existe. Eso no es un error, es literalmente lo que programaste.

Para ver el mensaje HTTP crudo, sin que el browser lo interprete:

```bash
curl -v http://localhost:6789/
```

Las líneas con `>` son lo que curl envía y las que empiezan con `<` son tu respuesta. Ahí puedes verificar que la status line, los headers y la línea en blanco salen exactamente como esperabas.

## Cuando algo no funciona

| Síntoma | Causa |
|---|---|
| `java.net.BindException: Address already in use` | Quedó una ejecución anterior viva, o el puerto está ocupado. Deténla o cambia de puerto |
| `Connection refused` en el browser | El servidor no está corriendo, o pusiste otro puerto en la URL |
| La página se queda cargando y nunca termina | Falta el `CRLF` que cierra los headers, o falta el `flush()` |
| Se ve el HTML como texto plano, con etiquetas | El `Content-Type` no dice `text/html` |
| Solo funciona una vez | Correcto. Es un servidor de una sola petición |
| El browser pide dos veces (verás `/favicon.ico`) | Normal: el browser pide el ícono aparte. Este servidor muere antes de atenderlo |

## El límite de este servidor

Tienes un servidor web funcionando, y eso ya es mucho. Pero tiene dos problemas obvios:

1. **Atiende una petición y se muere.** Un servidor debería atender para siempre.
2. **Siempre responde lo mismo.** Da igual qué recurso pidas: manda "It works!".

El primero se arregla en la próxima lección, y no basta con meter todo en un `while`: hay que atender a varios clientes **a la vez**, y ahí aparecen los hilos.
