# Construcción de un servidor web multi-hilos

<img src="https://github.com/Domiciano/Compunet2-251/blob/main/Images/image2.png">

En esta seguna parte, afinaremos el servidor web, permitiendo que sea capaz de responder a la petición de diversos recursos: HTML (`text/html`) y archivos como imágenes (`image/jpeg` y `image/gif`)

En lugar de terminar el hilo después de mostrar en pantalla el mensaje de solicitud HTTP enviado por el browser, se analizará el mensaje de solicitud HTTP y se enviará una respuesta HTTP apropiada al browser. Se ignorará la información de las líneas de header y se se utilizará sólo el nombre del archivo que viene en la línea de solicitud. 

De hecho, se asume que el mensaje de solicitud HTTP siempre utilizará el método GET, e ignorará que el cliente puede enviar otros métodos HTTP, como HEAD ó POST. En los lugares donde usted encuentre un signo de interrogación, ?, usted debe completar el código que hace falta.

🎯 Desarrolle el web server para que sea capaz de enviar recursos al cliente. El cliente pedirá el recurso por medio del HTTP Request. Por ejemplo, si el cliente solicita `http://localhost:8080/index.html`, el servidor será capaz de buscar en sus recursos el archivo `index.html` y lo enviará en el HTTP Response.

🎯 El server debería poder enviar también `image/jpeg` y `image/gif`. Esto lo podrá especificar con el header `Content-Type`.

🎯 Si el cliente pide un recurso, que el servidor no tenga, enviará un mensaje apropiado de respuesta para el HTTP 404


# Request
El nombre del archivo de la línea de solicitud HTTP se extraerá con la ayuda de la clase java `StringTokenizer`. Primero se creará un objeto StringTokenizer que contendrá la cadena de caracteres de la línea de solicitud. Después no se tendrá en cuenta qué metodo se especificó en la solicitud HTTP, pues se asumirá que sólo puede ser el método GET. Finalmente se extraerá el nombre del archivo.

```java
// Extrae el nombre del archivo de la línea de solicitud.
StringTokenizer partesLinea = new StringTokenizer(linea);
// El primer token es el método
String method = partesLinea.nextToken();
// El segundo token es el recurso requerido
String nombreArchivo = partesLinea.nextToken();
// Anexa un ".", de tal forma que el archivo solicitado debe estar en el directorio actual.
nombreArchivo = "." + nombreArchivo;
```

Ya que el browser precede el nombre del archivo con un slash, "/", se colocará antes un punto de tal forma que el nombre de path indicará que el archivo se encuentra dentro del directorio actual.

Ahora que se tiene el nombre del archivo, éste se puede abrir para enviarlo al cliente. Si el archivo solicitado no existe debe verificar que exista. Use los métodos de File.

```java
InputStream inputStream = ClassLoader.getSystemResourceAsStream(nombreArchivo);
File file = new File(ClassLoader.getSystemResource(nombreArchivo).toURI());
long filesize = file.length();
```
Sólo abra el `inputStream` cuando vaya a hacer el envío al cliente

# Response
Para la respuesta, dado que enviará tanto archivos de texto como bytes, deberá usar un `BufferedOutputStream`

```
BufferedOutputStream out = new BufferedOutputStream(socket.getOutputStream());
```

Para enviar `Strings`

```java
private static void enviarString(String line, OutputStream os) throws Exception {
        os.write(line.getBytes(StandardCharsets.UTF_8));
}
```

Para enviar `Bytes`

```java
private static void enviarBytes(InputStream fis, OutputStream os) throws Exception {
        // Construye un buffer de 1KB para guardar los bytes cuando van hacia el socket.
        byte[] buffer = new byte[1024];
        int bytes = 0;

        // Copia el archivo solicitado hacia el output stream del socket.
        while ((bytes = fis.read(buffer)) != -1) {
            os.write(buffer, 0, bytes);
        }
}
```


El mensaje de respuesta HTTP tiene tres partes: la línea de estado, los headers de respuesta y el cuerpo o datos que lleva el mensaje. La línea de estado y los headers de respuesta terminan con la secuencia de caracteres CRLF. 

Se responderá con una línea de estado, que se colocará en la variable lineaDeEstado, y un único header de respuesta, que se guardará en la variable lineaDeTipoContenido. 

En el caso de que se solicite un archivo que no existe, se retornará la línea "404 Not Found" en la línea de estado del mensaje de respuesta HTTP y se incluirá, en el cuerpo del mensaje, un error descrito en un documento HTML.

```java
// Construye el mensaje de respuesta.
String lineaDeEstado = null;
String lineaHeader = null;
String cuerpoMensaje = null;

// Si existe archivo
if ( ? ) {
        lineaDeEstado = ?; 
        lineaHeader = "Content-type: " + contentType( nombreArchivo ) + CRLF;
        //Enviar linea de estado
        ?
        //Enviar linea de header
        ?
        //Enviar el archivo
        ?
}
// Si no existe el archivo
else {
        lineaDeEstado = ?;
        lineaHeader = ?;
        //Enviar linea de estado
        ?
        //Enviar linea de header
        ?
        //Enviar archivo 404.html
        ?        
}
//Hacer flush
?
```

Cuando el archivo existe, se debe determinar el tipo de archivo MIME y enviar el especificador de tipo MIME apropiado. Esta determinación de tipo se realiza a través de un método privado y separado llamado `contentType()`, que retorna una cadena que puede incluirse en la línea de tipo de contenido (content type) que se está construyendo.

```java
private static String contentType(String nombreArchivo) {
        if(nombreArchivo.endsWith(".htm") || nombreArchivo.endsWith(".html")) {
                return "text/html";
        }
        if(?) {
                ?;
        }
        if(?) {
                ?;
        }
        return "application/octet-stream";
}
```


Cuando termine de generar el mensaje, no olvide usar `flush()`
```java
out.flush();
```


La pieza final de código que se necesita para completar el servidor Web es un método que examinará la extensión del nombre del archivo y retornará una cadena que representa su tipo MIME. Si la extensión del archivo es desconocida, se retornará el tipo `application/octet-stream`.


