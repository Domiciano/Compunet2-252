# Sirve archivos reales

<!-- tags: StringTokenizer, request line, File, FileInputStream, Content-Type, MIME, 404 Not Found, status line, flush, la imagen no se ve, FileNotFoundException, siempre responde 404, application/octet-stream -->

Tu servidor ya escucha para siempre y atiende en paralelo, pero responde lo mismo a todo. Aquí aprende a leer **qué** recurso le están pidiendo, buscarlo en disco y devolverlo con el tipo correcto — o responder `404` si no existe.

![Diagrama de respuesta de recursos](image2.png "icon")

Al terminar tendrás un servidor web de contenido estático completo: sirve páginas HTML e imágenes, igual que uno real.

**Todo el código está completo.** Solo se toca `HttpRequest.java`; `WebServer.java` se queda como está.

## Paso 1 · Prepara los archivos que vas a servir

En la carpeta **desde la que ejecutas el servidor** (la raíz del proyecto, no dentro de `src/`) crea tres archivos:

```plain
index.html
404.html
photo.jpg      (cualquier imagen)
```

Que el `index.html` referencie la imagen, para poder comprobar más adelante que se sirven las dos:

```html
<html>
  <body>
    <h1>Mi servidor</h1>
    <img src="photo.jpg">
  </body>
</html>
```

## Paso 2 · Extrae el recurso pedido

La request line que ya estás imprimiendo tiene tres campos separados por espacios: `GET /index.html HTTP/1.1`. El del medio es lo que necesitas, y `StringTokenizer` los separa en orden.

```java
StringTokenizer tokens = new StringTokenizer(requestLine);
String method = tokens.nextToken();     // GET
String fileName = tokens.nextToken();   // /index.html

// El browser manda la ruta con "/" delante. El punto la vuelve relativa
// al directorio desde el que ejecutas el servidor.
fileName = "." + fileName;
```

Asumimos que el método siempre es `GET`; leemos `method` solo para consumir ese token. Un servidor completo miraría su valor y respondería `501 Not Implemented` a lo que no sabe hacer.

**Comprobación:** imprime `fileName` y recarga. Debe salir `./index.html`, o `./` si pediste la raíz.

## Paso 3 · Busca el archivo

```java
File file = new File(fileName);
boolean fileExists = file.exists();

FileInputStream fis = null;
if (fileExists) {
    fis = new FileInputStream(file);
}
```

El `FileInputStream` se abre **solo si el archivo existe**. Hacerlo antes de comprobarlo lanza `FileNotFoundException` y te deja sin poder responder el 404 — que es justo el caso que quieres cubrir.

Si `fileExists` siempre te da `false`, el directorio de trabajo no es el que crees. Imprime `file.getAbsolutePath()` y compáralo con dónde pusiste el archivo: es el problema más común de este paso, y no tiene nada que ver con HTTP.

## Paso 4 · Dos formas de escribir en el socket

Hasta ahora el cuerpo de la respuesta era texto. A partir de aquí puede ser una imagen, así que hacen falta dos ayudantes distintos. Añádelos como métodos de `HttpRequest`:

```java
private static void sendString(String text, OutputStream os) throws Exception {
    os.write(text.getBytes(StandardCharsets.UTF_8));
}

private static void sendBytes(InputStream fis, OutputStream os) throws Exception {
    byte[] buffer = new byte[1024];
    int bytes = 0;
    while ((bytes = fis.read(buffer)) != -1) {
        os.write(buffer, 0, bytes);
    }
}
```

`sendBytes` copia de a 1024 bytes en vez de cargar el archivo entero en memoria. Con un HTML da igual; con un video sería la diferencia entre funcionar y quedarse sin memoria.

Aquí se ve por qué desde la primera lección la salida quedó en `DataOutputStream` y no en un `BufferedWriter`: un writer piensa en caracteres, y una imagen no son caracteres.

## Paso 5 · El tipo MIME

El header `Content-Type` le dice al browser **qué** son los bytes que le llegan. Se deduce de la extensión:

```java
private static String contentType(String fileName) {
    if (fileName.endsWith(".htm") || fileName.endsWith(".html")) {
        return "text/html";
    }
    if (fileName.endsWith(".jpg")) {
        return "image/jpeg";
    }
    if (fileName.endsWith(".gif")) {
        return "image/gif";
    }
    return "application/octet-stream";
}
```

El browser hace lo que le dices, no lo que querías: una imagen anunciada como `text/html` sale en pantalla como un chorro de caracteres ilegibles. Y `application/octet-stream` es el "no sé qué es esto" — normalmente el browser lo descarga en vez de mostrarlo.

## Paso 6 · Arma la respuesta

Las mismas cuatro piezas de siempre —status line, headers, línea en blanco, cuerpo— pero ahora con dos ramas:

```java
if (fileExists) {
    sendString("HTTP/1.0 200 OK" + CRLF, out);
    sendString("Content-Type: " + contentType(fileName) + CRLF, out);
    sendString(CRLF, out);          // aquí terminan los headers
    sendBytes(fis, out);            // y aquí empieza el cuerpo
    fis.close();
} else {
    FileInputStream notFound = new FileInputStream(new File("./404.html"));
    sendString("HTTP/1.0 404 Not Found" + CRLF, out);
    sendString("Content-Type: text/html" + CRLF, out);
    sendString(CRLF, out);
    sendBytes(notFound, out);
    notFound.close();
}

out.flush();
```

El código de estado no es decoración: es **el único** campo que el browser mira para decidir si le fue bien. Devolver la página de error con un `200 OK` es un error clásico — el usuario ve "no encontrado" mientras el browser, los buscadores y cualquier programa que consuma tu servidor creen que todo salió perfecto.

Fíjate en que ya no mandamos `Content-Length`. En HTTP/1.0 el cierre de la conexión marca el final del cuerpo, así que sin ese header el browser lee hasta que el socket se cierra. Funciona, pero es la razón por la que HTTP/1.0 no puede reutilizar conexiones: sin saber dónde termina una respuesta, no hay forma de saber dónde empieza la siguiente.

## El código completo

`HttpRequest.java` entero, con lo de la lección anterior ya integrado:

```java
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

final class HttpRequest implements Runnable {

    final static String CRLF = "\r\n";
    Socket socket;

    public HttpRequest(Socket socket) throws Exception {
        this.socket = socket;
    }

    public void run() {
        try {
            processRequest();
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    private void processRequest() throws Exception {

        BufferedReader in = new BufferedReader(
                new InputStreamReader(socket.getInputStream()));
        DataOutputStream out = new DataOutputStream(socket.getOutputStream());

        // --- Lee la petición ---
        String requestLine = in.readLine();
        System.out.println(Thread.currentThread().getName() + " -> " + requestLine);

        String headerLine;
        while ((headerLine = in.readLine()) != null && !headerLine.isEmpty()) {
            System.out.println(headerLine);
        }

        // --- Averigua qué recurso piden ---
        StringTokenizer tokens = new StringTokenizer(requestLine);
        String method = tokens.nextToken();
        String fileName = "." + tokens.nextToken();

        File file = new File(fileName);
        boolean fileExists = file.exists();

        FileInputStream fis = null;
        if (fileExists) {
            fis = new FileInputStream(file);
        }

        // --- Responde ---
        if (fileExists) {
            sendString("HTTP/1.0 200 OK" + CRLF, out);
            sendString("Content-Type: " + contentType(fileName) + CRLF, out);
            sendString(CRLF, out);
            sendBytes(fis, out);
            fis.close();
        } else {
            FileInputStream notFound = new FileInputStream(new File("./404.html"));
            sendString("HTTP/1.0 404 Not Found" + CRLF, out);
            sendString("Content-Type: text/html" + CRLF, out);
            sendString(CRLF, out);
            sendBytes(notFound, out);
            notFound.close();
        }

        out.flush();

        out.close();
        in.close();
        socket.close();
    }

    private static void sendString(String text, OutputStream os) throws Exception {
        os.write(text.getBytes(StandardCharsets.UTF_8));
    }

    private static void sendBytes(InputStream fis, OutputStream os) throws Exception {
        byte[] buffer = new byte[1024];
        int bytes = 0;
        while ((bytes = fis.read(buffer)) != -1) {
            os.write(buffer, 0, bytes);
        }
    }

    private static String contentType(String fileName) {
        if (fileName.endsWith(".htm") || fileName.endsWith(".html")) {
            return "text/html";
        }
        if (fileName.endsWith(".jpg")) {
            return "image/jpeg";
        }
        if (fileName.endsWith(".gif")) {
            return "image/gif";
        }
        return "application/octet-stream";
    }
}
```

## Pruébalo

**1. Una página.** Abre `http://localhost:6789/index.html`. Debe verse tu HTML **con la imagen dentro**. Mira la consola: son **dos peticiones**, una por el HTML y otra por la imagen, y cada una con su nombre de hilo. Ahí está sirviendo para algo el trabajo de la lección anterior.

**2. Un recurso que no existe.** Abre `http://localhost:6789/nada.html`. Debe verse tu página de error. En las herramientas de desarrollo del browser, pestaña **Red**, la petición debe aparecer en rojo con **404** — si sale en verde con 200, la status line está mal aunque la página se vea bien.

**3. El mensaje crudo.**

```bash
curl -v http://localhost:6789/index.html
curl -v http://localhost:6789/nada.html
```

## Ejemplo de Request

![Ejemplo de solicitud HTTP](image3.png "icon")

## Ejemplo de Response

![Ejemplo de respuesta HTTP](image4.png "icon")

## Cuando algo no funciona

| Síntoma | Causa |
|---|---|
| Siempre responde 404 aunque el archivo esté | El directorio de trabajo no es el que crees. Imprime `file.getAbsolutePath()` |
| `FileNotFoundException` al pedir algo que no existe | Abriste el `FileInputStream` fuera del `if (fileExists)`, o te falta el `404.html` |
| La imagen sale como caracteres raros | `Content-Type` equivocado, o usaste `sendString` en vez de `sendBytes` |
| El HTML se ve con las etiquetas visibles | Mandaste `text/plain` en vez de `text/html` |
| La página se queda cargando | Falta el `sendString(CRLF, out)` que cierra los headers |
| Llega la respuesta cortada | Falta el `out.flush()` |
| `NoSuchElementException` en `nextToken()` | Llegó una petición vacía; el browser abre conexiones que a veces no usa |
| Pedir `/` da 404 | `./` es un directorio, no un archivo. Sirve `/index.html` explícitamente |

## Checklist

- [ ] Sirve un `index.html` y se ve en el browser.
- [ ] Sirve la imagen referenciada desde ese HTML.
- [ ] Responde `404` **con status line 404** cuando el recurso no existe.
- [ ] El `Content-Type` cambia según la extensión.
- [ ] Cierra el `FileInputStream`, los streams y el socket.

## Lo que acabas de construir

Un servidor web completo de contenido estático, en unas cien líneas y sin una sola librería externa. Sabe escuchar, aceptar en paralelo, interpretar HTTP, buscar en disco y responder con el estado y el tipo correctos.

Y ahí está su límite: **solo sabe devolver archivos que ya existen**. No puede consultar una base de datos, ni personalizar la página según quién pregunta, ni procesar un formulario. Para eso la respuesta tiene que **calcularse** en vez de leerse, y ese es el trabajo de un servidor de aplicaciones — la siguiente lección.
