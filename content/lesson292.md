# JwtService: generar el token

<!-- tags: JwtService, jjwt, Jwts.builder, generateToken, claims, setClaims borra el subject, secret de 32 caracteres, WeakKeyException, Keys.hmacShaKeyFor, expiración del token, @Value -->

El `JwtService` es el servicio que fabrica los tokens. Más adelante también los va a leer y validar.

## Instalación

Usaremos la librería **jjwt**. Agregue las tres dependencias al `pom.xml`:

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

`jjwt-api` es lo que usa su código; `jjwt-impl` y `jjwt-jackson` solo hacen falta al ejecutar (la implementación y la conversión a JSON).

## El secreto

El token se firma con una clave secreta. Guárdela en el `application.properties` junto con la duración del token:

```ini
app.security.secretkey=universidadicesiuniversidadicesiuniversidadicesi
app.security.expirationMinutes=30
```

La clave tiene que tener **mínimo 32 caracteres** (256 bits); con menos, jjwt lanza `WeakKeyException`. Además, jjwt elige el algoritmo según el largo de la clave: con 32 caracteres usa `HS256`, con 48 `HS384` y con 64 `HS512`. La de arriba tiene 48, por eso el token sale con `"alg": "HS384"`.

En un proyecto real el secreto no se escribe en el repositorio: se lee de una variable de entorno. En el curso lo dejamos en el archivo para simplificar.

## La clase

```java
package co.edu.icesi.introspringboot2.service.impl;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${app.security.secretkey}")
    private String secret;

    @Value("${app.security.expirationMinutes}")
    private int expirationMinutes;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

}
```

`@Value` inyecta los valores del `application.properties` con SpEL. `getSigningKey()` convierte el texto del secreto en la clave con la que se firma y, más adelante, se verifica.

## Los claims

Además del `sub`, queremos que el token lleve los permisos del usuario. Así, cuando el token vuelva, sabremos qué puede hacer sin ir a la base de datos. Los armamos a partir del `UserDetails`:

```java
public Map<String, Object> createClaims(UserDetails userDetails) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("authorities",
            userDetails.getAuthorities()
                    .stream()
                    .map(authority -> authority.getAuthority())
                    .toList());
    return claims;
}
```

## Generar el token

```java
public String generateToken(UserDetails userDetails) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + 1000L * 60L * expirationMinutes);

    return Jwts.builder()
            .setClaims(createClaims(userDetails))
            .setSubject(userDetails.getUsername())
            .setIssuedAt(now)
            .setExpiration(expiry)
            .signWith(getSigningKey())
            .compact();
}
```

Paso a paso:

- `setClaims(...)` pone los claims propios (`authorities`).
- `setSubject(...)` pone el `sub`: el username del dueño del token.
- `setIssuedAt` y `setExpiration` ponen `iat` y `exp`. El token vence a los 30 minutos.
- `signWith(...)` calcula la firma con el secreto.
- `compact()` arma el texto final `header.payload.signature`.

**El orden importa.** `setClaims` **reemplaza** todos los claims del token. Si lo llama después de `setSubject`, borra el `sub` y el token queda sin dueño: el filtro que lo valide no sabrá de quién es. Siempre `setClaims` primero, y después los claims estándar.

El resultado es un payload como este:

```json
{
  "authorities": ["ROLE_PROFESOR"],
  "sub": "profesor@gmail.com",
  "iat": 1744298415,
  "exp": 1744300215
}
```

En la siguiente lección usamos este servicio en el endpoint de login.
