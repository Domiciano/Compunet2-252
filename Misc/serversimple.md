```java
package org.example;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;

public class Main {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(8081);
        System.out.println("Waiting for connection...");
        Socket socket = serverSocket.accept(); //Modo de espera de conexiones // I O
        System.out.println("Conection established");

        //Vamos a leer lo que nos envia el browser
        BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));

        String line = "";
        while ((line = in.readLine()) != null && !line.isEmpty()) {
            System.out.println(line);
        }

        BufferedOutputStream out = new BufferedOutputStream(socket.getOutputStream());
        
        //Status
        out.write(("HTTP/1.1 200 OK\r\n".getBytes("UTF-8")));
        //Content type
        out.write(("Content-Type: text/html\r\n".getBytes("UTF-8")));
        out.write(("\r\n".getBytes("UTF-8")));
        //Body
        out.write(("<html><head></head><body><h1>Hola mundo</h1></body></html>".getBytes("UTF-8")));
        out.flush(); //Envio

        out.close();
        socket.close();
    }
}
```
