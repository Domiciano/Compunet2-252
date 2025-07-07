[t] Construcción de un servidor web multi-hilos (Parte 2)

[i] image2.png|Diagrama de flujo de respuesta de recursos

[p]
En esta segunda parte, afinaremos el servidor web, permitiendo que sea capaz de responder a la petición de diversos recursos: HTML ([inline-code]text/html[inline-code]) y archivos como imágenes ([inline-code]image/jpeg[inline-code] y [inline-code]image/gif[inline-code]).

[p]
En lugar de terminar el hilo después de mostrar en pantalla el mensaje de solicitud HTTP enviado por el browser, se analizará el mensaje de solicitud HTTP y se enviará una respuesta HTTP apropiada al browser. Se ignorará la información de las líneas de header y se utilizará sólo el nombre del archivo que viene en la línea de solicitud. 

[st] Procesar el Request

[p]
El nombre del archivo de la línea de solicitud HTTP se extraerá con la ayuda de la clase java [inline-code]StringTokenizer[inline-code]. Primero se creará un objeto StringTokenizer que contendrá la cadena de caracteres de la línea de solicitud. Después no se tendrá en cuenta qué método se especificó en la solicitud HTTP, pues se asumirá que sólo puede ser el método GET. Finalmente se extraerá el nombre del archivo.

[c:java]
// Extrae el nombre del archivo de la línea de solicitud.
StringTokenizer partesLinea = new StringTokenizer(linea);
// El primer token es el método
String method = partesLinea.nextToken();
// El segundo token es el recurso requerido
String nombreArchivo = partesLinea.nextToken();
// Anexa un ".", de tal forma que el archivo solicitado debe estar en el directorio actual.
nombreArchivo = "." + nombreArchivo;
[end]

[p]
Ya que el browser precede el nombre del archivo con un slash, "/", se colocará antes un punto de tal forma que el nombre de path indicará que el archivo se encuentra dentro del directorio actual.

[p]
Ahora que se tiene el nombre del archivo, éste se puede abrir para enviarlo al cliente. Si el archivo solicitado no existe debe verificar que exista. Use los métodos de File.

[c:java]
InputStream inputStream = ClassLoader.getSystemResourceAsStream(nombreArchivo);
File file = new File(ClassLoader.getSystemResource(nombreArchivo).toURI());
long filesize = file.length();
[end]

[p]
Sólo abra el [inline-code]inputStream[inline-code] cuando vaya a hacer el envío al cliente.

[st] Procesar el Response

[p]
Para la respuesta, dado que enviará tanto archivos de texto como bytes, deberá usar un [inline-code]BufferedOutputStream[inline-code]:

[c:java]
BufferedOutputStream out = new BufferedOutputStream(socket.getOutputStream());
[end]

[p]
Para enviar [inline-code]Strings[inline-code]:

[c:java]
private static void enviarString(String line, OutputStream os) throws Exception {
        os.write(line.getBytes(StandardCharsets.UTF_8));
}
[end]

[p]
Para enviar [inline-code]Bytes[inline-code]:

[c:java]
private static void enviarBytes(InputStream fis, OutputStream os) throws Exception {
        // Construye un buffer de 1KB para guardar los bytes cuando van hacia el socket.
        byte[] buffer = new byte[1024];
        int bytes = 0;

        // Copia el archivo solicitado hacia el output stream del socket.
        while ((bytes = fis.read(buffer)) != -1) {
            os.write(buffer, 0, bytes);
        }
}
[end]

[p]
El mensaje de respuesta HTTP tiene tres partes: la línea de estado, los headers de respuesta y el cuerpo o datos que lleva el mensaje. La línea de estado y los headers de respuesta terminan con la secuencia de caracteres CRLF. 

[p]
Se responderá con una línea de estado, que se colocará en la variable [inline-code]lineaDeEstado[inline-code], y un único header de respuesta, que se guardará en la variable [inline-code]lineaDeTipoContenido[inline-code]. 

[p]
En el caso de que se solicite un archivo que no existe, se retornará la línea "404 Not Found" en la línea de estado del mensaje de respuesta HTTP y se incluirá, en el cuerpo del mensaje, un error descrito en un documento HTML.

[c:java]
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
        lineaDeEstado = "HTTP/1.0 404 Not Found\r\n";
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
[end]

[p]
Cuando el archivo existe, se debe determinar el tipo de archivo MIME y enviar el especificador de tipo MIME apropiado. Esta determinación de tipo se realiza a través de un método privado y separado llamado [inline-code]contentType()[inline-code], que retorna una cadena que puede incluirse en la línea de tipo de contenido (content type) que se está construyendo.

[c:java]
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
[end]

[p]
Cuando termine de generar el mensaje, no olvide usar [inline-code]flush()[inline-code]:

[c:java]
out.flush();
[end]

[st] Ejemplo de Request y Response

[i] image3.png|Ejemplo de Request
[i] image4.png|Ejemplo de Response





