# Proceso de validación de token

Debemos hacer un `OncePerRequestFilter` para que en cada solicitud se verifique el token.

De modo que nuestro `WebSecurityConfig` deberia registrar el filtro de modo que vaya antes que el UsernamePasswordAuthenticationFilter, que es el encargado de procesar las solicitudes de inicio de sesión en Spring Security, extrayendo el nombre de usuario y la contraseña del request y delegando la autenticación al AuthenticationManager.

Al filtro que llamaremos `JwtAuthenticationFilter` lo debemos referenciar y posteriormente registrar la secuencia por medio de `addFilterBefore`.

```java
//@EnableWebSecurity
//@Configuration
//public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        return http
//            .csrf(csrf -> csrf.disable())
//            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//            .authorizeHttpRequests(auth -> auth
//                .requestMatchers("/auth/**").permitAll()
//                .anyRequest().authenticated()
//            )
              .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
//            .build();
//   }
//}
```

De esta manera encadenamos el filtro. 

Ahora debemos crear la lógica necesaria para validar este token.

Lo primero es saber que el método `doFilterInternal` de `OncePerRequestFilter` tiene como entradas el mismo filter chain al que hace parte, y objetos para request y response.

```java
@Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
    ...
}
```

Luego, el request tiene el header de Authorization. Sabemos que el header vendrá como `Bearer <token>` de modo que se corta el string para que solo quede el token.

```java
String authHeader = request.getHeader("Authorization");
if (authHeader != null && authHeader.startsWith("Bearer ")) {
    String jwt = authHeader.substring(7);
    ...
}
```

Debemos validar el token, para esto usaremos el método de extractAllClaims(). Sólo se pueden extraer los claims presentando el `secret`, de modo que si no corresponde emite excepción. Adicionalmente, si está expirado, también produce excepción.


```java
try{
    Claims claims = jwtService.extractAllClaims(jwt);
    ...
}catch (JwtException | IllegalArgumentException e) {
    e.printStackTrace();
}
```

El método extactAllClaims() es
```java
public Claims extractAllClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
        .build()
        .parseClaimsJws(token)
        .getBody();
}
```


Ahora debemos cargar el subject que contiene el email y verificar que sí lo tenga. Si no enviamos un response de forma directa por medio de `sendError`


```java
//try{
//    Claims claims = jwtService.extractAllClaims(jwt);
      String email = claims.getSubject();
      if (email == null) {
        sendError(response, 400, "El token no tiene subject válido");
        return;
      }
//}catch (JwtException | IllegalArgumentException e) {
//    e.printStackTrace();
//}
```


El método `sendError` es

```java
private void sendError(HttpServletResponse response, int status, String message) throws IOException {
    response.setStatus(status);
    response.setContentType("application/json");
    response.getWriter().write("{\"error\": \"" + message + "\"}");
    response.getWriter().flush();
}
```


Una vez que hemos verificado que tiene todo correcto vamos a verificar que esa request no haya sido autenticada antes (por ejemplo por otro filtro)

```java
if (SecurityContextHolder.getContext().getAuthentication() == null) {
    ...
}
```

Una vez con esto, cargamos el UserDetails a partir del `email`.

```java
UserDetails userDetails = userDetailsService.loadUserByUsername(email);
```

Luego armamos un objeto de `UsernamePasswordAuthenticationToken`. En credentials `null` porque ya se presentó token y no contraseña.

```java
UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
    userDetails, null, userDetails.getAuthorities()
);
```

Y finalmente para el resto de la vida del request se indica que ya fue autenticada

```java
SecurityContextHolder.getContext().setAuthentication(authToken);
```



# IMPORTANTE

El bloque de código de autenticación haría que en cada request tengamos que hacer una consulta a la base de datos. Esto no es conveniente además que el token ya tiene toda la información necesaria para generar un `UsernamePasswordAuthenticationToken`.

```java
if (SecurityContextHolder.getContext().getAuthentication() == null) {
    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
        userDetails, null, userDetails.getAuthorities()
    );
    SecurityContextHolder.getContext().setAuthentication(authToken);
}
```

Así que podemos crear un bloque de código con el mismo resultado, pero que no pase por base de datos

```java
if (SecurityContextHolder.getContext().getAuthentication() == null) {
    List<String> roles = claims.get("roles", List.class);
    List<SimpleGrantedAuthority> authorities = roles.stream()
        .map(role -> new SimpleGrantedAuthority(role))
        .toList();
    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
        email, null, authorities
    );
    SecurityContextHolder.getContext().setAuthentication(authToken);
}
```


Finalmente, para emitir respuestas adecuadas en caso de fallo

```java
//try{
//    Claims claims = jwtService.extractAllClaims(jwt);
//    ...
//}catch (JwtException | IllegalArgumentException e) {
//    e.printStackTrace();
      sendError(response, 401, e.getMessage());
//}
```


# Ejemplo completo

```java
...

import co.edu.icesi.introspringboot2.util.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //Proceso de verificación
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            try {
                Claims claims = jwtService.extractAllClaims(jwt);
                String email = claims.getSubject();
                if (email == null) {
                    sendError(response, 400, "El token no tiene subject válido");
                    return;
                }

                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    List<String> roles = claims.get("roles", List.class);
                    List<SimpleGrantedAuthority> authorities = roles.stream()
                        .map(role -> new SimpleGrantedAuthority(role))
                        .toList();
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        email, null, authorities
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }

            } catch (JwtException | IllegalArgumentException e) {
                sendError(response, 401, e.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }

    private void sendError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
        response.getWriter().flush();
    }


}
```



# Postman

```js
let randomEmail = `user_${Math.floor(Math.random() * 10000)}@mail.com`;
pm.environment.set("randomEmail", randomEmail);
```

```js
pm.sendRequest({
    url: 'https://api.example.com/login',
    method: 'POST',
    header: 'Content-Type:application/json',
    body: {
        mode: 'raw',
        raw: JSON.stringify({ username: 'user', password: 'pass' })
    }
}, function (err, res) {
    pm.environment.set("authToken", res.json().token);
});
```