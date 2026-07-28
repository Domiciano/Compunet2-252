# Completa el servidor: la respuesta HTTP

<!-- tags: StringTokenizer, request line, File, FileInputStream, Content-Type, MIME, 404 Not Found, status line, flush, la página se queda cargando, la imagen no se ve, FileNotFoundException, application/octet-stream -->

Tu servidor ya lee lo que le manda el browser, pero no le contesta nada. Aquí lo terminas: entender **qué recurso** están pidiendo, buscarlo, y devolverlo con una respuesta HTTP en forma.

![Diagrama de respuesta de recursos](image2.png "icon")

Seguimos **exactamente donde quedamos**: todo lo que sigue va dentro de `processRequest()`, en `HttpRequest.java`, justo después del bucle que lee los headers y **antes** de las tres líneas que cierran los streams. Los pasos y los `// TODO` siguen la numeración de la lección anterior.

## Paso 9 · Extrae el recurso pedido

La request line que ya imprimiste tiene tres campos separados por espacios: `GET /index.html HTTP/1.1`. El del medio es lo que necesitas. `StringTokenizer` los separa en orden.

```java
// Extrae el nombre del archivo de la request line
StringTokenizer tokens = new StringTokenizer(line);
String method = tokens.nextToken();     // GET
String fileName = tokens.nextToken();   // /index.html

// El browser manda la ruta con "/" delante; el punto la vuelve relativa
// al directorio desde el que ejecutas el servidor
fileName = "." + fileName;
```

Asumimos que el método siempre es `GET`. Un servidor real miraría `method` y respondería `501 Not Implemented` a lo que no sabe hacer; aquí lo leemos solo para consumir el token.

**Comprobación:** imprime `fileName` y recarga el browser. Debe salir `./index.html` — o `./` a secas si pediste la raíz.

## Paso 10 · Busca el archivo

Crea un archivo `index.html` cualquiera **en la carpeta desde la que ejecutas el servidor** (la raíz del proyecto, no dentro de `src/`). Luego pregunta si existe:

```java
// TODO 7: abre el archivo pedido
File file = new File(fileName);
boolean fileExists = file.exists();

FileInputStream fis = null;
if (fileExists) {
    fis = ?;
}
```

> `FileInputStream` recibe el `File` en su constructor. Ábrelo **solo si existe**: hacerlo cuando no está lanza `FileNotFoundException` y te quedas sin poder responder el 404, que es justo el caso que quieres cubrir.

**Comprobación:** imprime `fileExists` pidiendo `/index.html` y luego `/noexiste.html`. Deben salir `true` y `false`. Si siempre sale `false`, el archivo no está donde tu programa cree que está el directorio actual — imprime `file.getAbsolutePath()` y compruébalo.

## Paso 11 · Dos formas de escribir en el socket

La respuesta lleva dos cosas de naturaleza distinta: los headers son **texto**, y el cuerpo pueden ser **bytes crudos** (una imagen). Por eso hacen falta dos ayudantes. Añádelos como métodos de `HttpRequest`, junto con un import más de los que tenías en el Paso 0:

```java
import java.nio.charset.StandardCharsets;
```

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

`sendBytes` copia de a 1024 bytes en vez de cargar el archivo entero en memoria: con una imagen grande la diferencia se nota, y con un video sería la diferencia entre funcionar y no.

Esto explica por qué en el Paso 6 **no** envolvimos la salida en un `BufferedWriter`: un writer piensa en caracteres, y una imagen no son caracteres. El `DataOutputStream` que ya tienes sirve para las dos cosas.

## Paso 12 · Arma la respuesta

Una respuesta HTTP son cuatro piezas **en este orden**, y las cuatro son obligatorias:

```mermaid
flowchart LR
    A["HTTP/1.0 200 OK"] --> B["Content-Type: text/html"]
    B --> C["(línea en blanco)"]
    C --> D["bytes del archivo"]
```

Ahora escríbelas, en ese orden:

```java
if (fileExists) {
    // TODO 8: status line de éxito, terminada en CRLF
    String statusLine = ?;
    String contentTypeLine = "Content-Type: " + contentType(fileName) + CRLF;

    sendString(statusLine, out);
    sendString(contentTypeLine, out);
    sendString(CRLF, out);   // la línea en blanco: aquí terminan los headers
    sendBytes(fis, out);     // y aquí empieza el cuerpo
    fis.close();
} else {
    // TODO 9: lo mismo, pero con 404 (Paso 14)
}

out.flush();
```

> La status line de éxito es `"HTTP/1.0 200 OK" + CRLF`.

Dos detalles que cuestan horas si se pasan por alto:

- **El `sendString(CRLF, out)` suelto.** Es la línea en blanco que separa headers de cuerpo. Sin ella el browser sigue leyendo headers para siempre y la página se queda cargando, sin ningún error que te oriente.
- **El `out.flush()` final.** El stream guarda lo escrito en un buffer; `flush()` es lo que lo empuja de verdad por el socket. Si no lo llamas, buena parte de tu respuesta se va con el `close()` o se pierde.

**Comprobación:** recarga `http://localhost:6789/index.html`. **Debe verse tu página en el browser.** Ese es el momento en que tienes un servidor web de verdad.

## Paso 13 · Dile al browser qué le estás mandando

El header `Content-Type` lleva el **tipo MIME**, y sin él el browser no sabe qué hacer con los bytes que le llegan. Añade este método auxiliar:

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

El browser hace lo que le dices, no lo que querías: una imagen anunciada como `text/html` sale en pantalla como un chorro de caracteres ilegibles. Y `application/octet-stream` es el "no sé qué es esto" — el browser normalmente lo descarga en vez de mostrarlo.

**Comprobación:** pon una imagen `.jpg` junto al `index.html`, referénciala con un `<img src="foto.jpg">` y recarga. Debe verse. Fíjate en la consola: son **dos peticiones**, una por el HTML y otra por la imagen, cada una en su hilo. Ahí está sirviendo para algo el Paso 4.

## Paso 14 · El caso que falta: 404

Falta cerrar la rama `else`. Crea un `404.html` con un mensaje de error junto al `index.html`, y devuélvelo con la status line correcta:

```java
} else {
    // TODO 9: completa esta rama
    String statusLine = "HTTP/1.0 404 Not Found" + CRLF;
    String contentTypeLine = "Content-Type: text/html" + CRLF;

    sendString(statusLine, out);
    sendString(contentTypeLine, out);
    sendString(CRLF, out);

    // Envía el contenido de 404.html como cuerpo
    ?
}
```

> Es el mismo patrón del Paso 12: abre un `FileInputStream` sobre `404.html` y pásalo a `sendBytes`.

El código de estado no es decoración: es **el único** campo que el browser mira para decidir si le fue bien. Devolver la página de error con un `200 OK` es un error clásico — el usuario ve "no encontrado" mientras el browser, los buscadores y cualquier programa que consuma tu servidor creen que todo salió perfecto.

**Comprobación:** pide `http://localhost:6789/noexiste.html`. Debe verse tu página de error. En las herramientas de desarrollo del browser (pestaña Red) la petición debe aparecer en **rojo, con 404**.

## Ejemplo de Request

![Ejemplo de solicitud HTTP](image3.png "icon")

## Ejemplo de Response

![Ejemplo de respuesta HTTP](image4.png "icon")

## Cuando algo no funciona

| Síntoma | Causa habitual |
|---|---|
| La página se queda cargando y nunca termina | Falta el `sendString(CRLF, out)` que cierra los headers |
| Llega la respuesta cortada, o no llega nada | Falta el `out.flush()` antes de cerrar |
| `FileNotFoundException` al pedir algo que no existe | Abriste el `FileInputStream` fuera del `if (fileExists)` |
| Siempre responde 404 aunque el archivo esté | El directorio de trabajo no es el que crees. Imprime `file.getAbsolutePath()` |
| La imagen sale como caracteres raros | `Content-Type` equivocado, o usaste `sendString` en vez de `sendBytes` |
| El HTML se ve como texto plano, con las etiquetas visibles | Mandaste `text/plain` en vez de `text/html` |
| `NoSuchElementException` en `nextToken()` | Llegó una petición vacía; el browser a veces abre conexiones que no usa |

## Checklist

- [ ] Sirve un `index.html` y se ve en el browser.
- [ ] Sirve una imagen referenciada desde ese HTML.
- [ ] Responde `404` con su página de error cuando el recurso no existe.
- [ ] El `Content-Type` cambia según la extensión.
- [ ] Cierra el `FileInputStream`, los streams y el socket.

## Lo que acabas de construir

Un servidor web completo de contenido estático, en unas cien líneas y sin una sola librería externa. Sabe escuchar, aceptar en paralelo, interpretar HTTP, buscar en disco y responder con el estado correcto.

Y ahí está su límite: **solo sabe devolver archivos que ya existen**. No puede consultar una base de datos, ni personalizar la página según quién pregunta, ni procesar un formulario. Para eso hace falta que la respuesta se **calcule** en vez de leerse, y ese es el trabajo de un servidor de aplicaciones — la siguiente lección.
