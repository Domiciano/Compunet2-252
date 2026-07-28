# Servidor web multi-hilos

<!-- tags: StringTokenizer, request line, GET, Content-Type, MIME, 404 Not Found, status line, header, DataOutputStream, flush, archivo no encontrado, la imagen no se ve, application/octet-stream -->

En esta lección afinarás tu servidor web para que pueda responder a la petición de diversos recursos: archivos HTML (`text/html`) e imágenes (`image/jpeg`, `image/gif`). El servidor analizará la solicitud HTTP y enviará una respuesta apropiada al browser.

![Diagrama de respuesta de recursos](image2.png "icon")

Todo lo que sigue va dentro de `processRequest()`, justo después de haber leído la request line en la lección anterior.

## Extracción del recurso solicitado

El nombre del archivo solicitado se extrae de la request line usando `StringTokenizer`. Se asume que el método es siempre `GET`.

```java
// Extrae el nombre del archivo de la request line
StringTokenizer tokens = new StringTokenizer(line);
String method = tokens.nextToken();
String fileName = tokens.nextToken();
fileName = "." + fileName;
```

El browser precede el nombre del archivo con `/`, por eso se antepone un punto para indicar el directorio actual.

## Envío de archivos y manejo de errores

El servidor debe buscar el archivo solicitado y enviarlo al cliente. Si el archivo no existe, debe responder con un mensaje HTTP 404 y un archivo de error.

```java
InputStream inputStream = ClassLoader.getSystemResourceAsStream(fileName);
File file = new File(ClassLoader.getSystemResource(fileName).toURI());
long fileSize = file.length();
```

Para escribir la respuesta usamos el mismo `DataOutputStream` que abriste en la lección anterior. No lo envolvemos en ningún filtro de texto, precisamente porque por aquí van a viajar también imágenes.

```java
DataOutputStream out = new DataOutputStream(socket.getOutputStream());
```

Para enviar texto

```java
private static void sendString(String line, OutputStream os) throws Exception {
    os.write(line.getBytes(StandardCharsets.UTF_8));
}
```

Para enviar bytes

```java
private static void sendBytes(InputStream fis, OutputStream os) throws Exception {
    byte[] buffer = new byte[1024];
    int bytes = 0;
    while ((bytes = fis.read(buffer)) != -1) {
        os.write(buffer, 0, bytes);
    }
}
```

## Construcción de la respuesta HTTP

La respuesta HTTP tiene tres partes: status line, headers y cuerpo. Si el archivo existe, se determina el tipo MIME y se envía el archivo. Si no, se responde con 404 y un HTML de error.

```java
String statusLine = null;
String headerLine = null;

if ( /* el archivo existe */ ) {
    statusLine = /* 200 OK */;
    headerLine = "Content-Type: " + contentType(fileName) + CRLF;
    // Enviar status line
    // Enviar header
    // Enviar archivo
} else {
    statusLine = "HTTP/1.0 404 Not Found" + CRLF;
    headerLine = /* header del error */;
    // Enviar status line
    // Enviar header
    // Enviar archivo 404.html
}
out.flush();
```

Recuerda la línea en blanco entre los headers y el cuerpo: sin ese `CRLF` extra el browser sigue leyendo headers y nunca encuentra el contenido.

## Detección del tipo de archivo (MIME)

El tipo de archivo se determina con un método auxiliar

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

Si devuelves el tipo equivocado, el browser hace lo que le dijiste, no lo que querías: una imagen anunciada como `text/html` sale en pantalla como un chorro de caracteres ilegibles.

## Ejemplo de Request

![Ejemplo de solicitud HTTP](image3.png "icon")

## Ejemplo de Response

![Ejemplo de respuesta HTTP](image4.png "icon")

¡Ahora tu servidor puede servir archivos y recursos estáticos como un servidor web real!
