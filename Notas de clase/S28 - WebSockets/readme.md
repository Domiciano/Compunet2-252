# WebSocket con Spring Boot y React

Este repositorio contiene una integración básica entre **Spring Boot (WebSocket)** y **React**. Aquí encontrarás los pasos para construir la conexión WebSocket y manejar mensajes en tiempo real entre el cliente (React) y el servidor (Spring Boot).


## Agregar dependencia en el backend

En el archivo `pom.xml` de tu proyecto Spring Boot, agrega:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```



## Configurar WebSocket en Spring Boot

Crea un archivo llamado `WebSocketConfig.java` en el paquete `websocket`.

```java
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final CustomWebSocketHandler customWebSocketHandler;

    public WebSocketConfig(CustomWebSocketHandler handler) {
        this.customWebSocketHandler = handler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(customWebSocketHandler, "/ws/chat")
                .setAllowedOrigins("http://?:?");
    }
}
```

### Puedes luego:

- Activar un interceptor para autenticar conexiones con JWT.
- Cambiar la ruta `/ws/chat` si deseas otra funcionalidad.


## Crear un manejador personalizado de mensajes

Crea `CustomWebSocketHandler.java`. `TextWebSocketHandler` nos permite elegir cómo realizar las operaciones básicas: conexión, recepción de mensajes y desconexión

```java
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class CustomWebSocketHandler extends TextWebSocketHandler {
    ...
}
```


Necesitará una colección thread-safe para inscribir cada sesión entrante

```java
private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
```

Al hacer la conexión podría agregar la sesión al mapa

```java
@Override
public void afterConnectionEstablished(WebSocketSession session) throws Exception {
   System.out.println("Nueva conexión WebSocket: " + session.getId());
   ...
}
```

Al finalizar la conexión, puede remover la conexión de la colección

```java
@Override
public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
   System.out.println("Conexión cerrada: " + session.getId());
   ...
}
```

Y durante los mensajes, el objetivo es hacer un broadcast de los mensajes a todos los participantes

```java
@Override
protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
   System.out.println("Mensaje recibido: " + message.getPayload());
   System.out.println("Mensaje recibido: " + session.isOpen());
   // Ejemplo: enviar solo a quien envió el mensaje
   // session.sendMessage(new TextMessage("Tu mensaje fue recibido"));        
}
```



# WebSocket como patrón delegado

Cree el archivo `WebSocketConnection.js`

```js
const WebSocketConnection = (onMessage) => {
    let ws = new WebSocket("ws://localhost:8080/ws/chat");

    ws.onopen = () => {
        console.log("Conectado al WebSocket");
    };

    ws.onmessage = (event) => {
        onMessage(event.data);
    };

    ws.onclose = () => {
        console.log("Conexión cerrada");
    };

    return ws;
};

export default WebSocketConnection;
```

Como ve, se genera un `WebSocket` nuevo. Esta clase es nativa de Javascript. Hay eventos similares al backend en el cliente como `ws.onopen`, `ws.onmessage` y `ws.onclose`.

# Cliente React

Crea un archivo `ChatScreen.jsx`. Haga que sea su ruta principal.

```jsx
import { useEffect, useRef, useState } from "react";
import { Container, Button, TextField, Typography } from "@mui/material";
import WebSocketConnection from "...";

const ChatScreen = () => {
  const ws = useRef(null);

  useEffect(() => {
    ws.current = WebSocketConnection((data) => {
      ...
    });

    //Función de clean-up
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    }
  };

  return (
    <Container>
      <TextField
        type="text"
        label="Mensaje"
      />
      <Button onClick={sendMessage}>Enviar</Button>

      <Container sx={{ height: "100vh"}}>
        {messages.map((msg, i) => (
          <Typography key={i}>{msg}</Typography>
        ))}
      </Container>
    </Container>
  );
};

export default ChatScreen;
```



# Advance mode

¿Se puede mejorar la escritura del websocket a algo más React-friendly? 

¿Cómo evitar que el chat sea público sino que sea sólo para usuarios autenticados?

# Custom Hook para nuestro WebSocket

Podemos crear un hook de React. Este enfoque es ideal porque limpia automáticamente la conexión.

```js
import { useEffect, useRef } from "react";

const useWebSocket = (url, onMessage) => {
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("Conectado al WebSocket");
    };

    ws.current.onmessage = (event) => {
      if (onMessage) onMessage(event.data);
    };

    ws.current.onclose = () => {
      console.log("Conexión cerrada");
    };

    ws.current.onerror = (error) => {
      console.error("Error en WebSocket:", error);
    };

    return () => {
      ws.current.close();
    };
  }, [url, onMessage]);

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
      console.warn("WebSocket no está listo para enviar mensajes");
    }
  };

  return { sendMessage };
};

export default useWebSocket;
```

Esto se usa por ejemplo asi en la capa de la vista

```
const { sendMessage } = useWebSocket("ws://localhost:8080/ws/chat", (msg) => {
   ...
});
```

# JWT para websockets

Para usar el token en el WebSocket, debes usar un `HandshakeInterceptor`. Este se ejecuta durante la fase de handshake (negociación) del WebSocket y no hace parte del IoC Container, por lo cual no es un `@Component` ni se inyecta automáticamente. Debe crearse manualmente dentro del `WebSocketConfig`.

No obstante, usted puede inyectar manualmente un bean que le permita hacer la validación del token usando el constructor de la clase

```java
import co.edu.icesi.introspringboot2.util.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import java.util.Map;

public class JwtHandshakeInterceptor implements HandshakeInterceptor {


    public JwtHandshakeInterceptor(...) {
        ...
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpRequest = servletRequest.getServletRequest();
            String token = httpRequest ???
            // Retorne true si quiere que la solicitud cruce desde los servlet hasta el IoC Container
            // Retorne false si quiere impedir la conexión
        }
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) {}
}
```

Una vez hecho, registre el `HandshakeInterceptor` en el `WebSocketConfig`

```java
@Override
public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
   registry.addHandler(customWebSocketHandler, "/ws/chat")
           //.addInterceptors(new JwtHandshakeInterceptor(...))
             .setAllowedOrigins("http://?:?");
}
```
