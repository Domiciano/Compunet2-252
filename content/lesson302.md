# Errores 401 y 403

<!-- tags: 401 Unauthorized, 403 Forbidden, authenticationEntryPoint, accessDeniedHandler, exceptionHandling, token expirado, respuesta de error en JSON, Http403ForbiddenEntryPoint, credenciales incorrectas, ObjectMapper en un filtro -->

Hasta ahora, cuando algo falla, la API responde un `403` vacío, sin importar si falta el token, si venció o si el usuario no tiene permisos. Un cliente necesita saber cuál de esas cosas pasó.

## 401 contra 403

- **401 Unauthorized**: no sabemos quién es usted. Falta el token, es inválido o venció, o las credenciales del login son incorrectas. El cliente tiene que (volver a) iniciar sesión.
- **403 Forbidden**: sabemos quién es usted, pero no tiene permiso. El token es válido, pero sus authorities no alcanzan. Volver a iniciar sesión no lo arregla.

A pesar del nombre, el `401` es el de **autenticación** y el `403` el de **autorización**.

## Por qué hoy todo es 403

Cuando `ExceptionTranslationFilter` captura una `AuthenticationException`, llama a un **authentication entry point** para responder. Con formulario, ese entry point redirige a `/login`. Nuestra cadena de la API no tiene formulario, así que Spring usa uno que solo responde `403`.

## Configurar las respuestas

Con `exceptionHandling` definimos qué responde la cadena en cada caso:

```java
@Bean
@Order(2)
public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http)
        throws Exception {
    http
        .securityMatcher("/api/v1/**")
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/v1/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class)
        .csrf(csrf -> csrf.disable())
        .sessionManagement(sm -> sm
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        .exceptionHandling(ex -> ex
            .authenticationEntryPoint((request, response, authException) -> {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Unauthorized\"}");
            })
            .accessDeniedHandler((request, response, deniedException) -> {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Forbidden\"}");
            })
        );
    return http.build();
}
```

- `authenticationEntryPoint` se ejecuta cuando el request no está autenticado: no trae token, el token es inválido, o el login falló con `BadCredentialsException`. Responde `401`.
- `accessDeniedHandler` se ejecuta cuando el usuario está autenticado pero no tiene la authority que pide la regla o el `@PreAuthorize`. Responde `403`.

## Decir por qué falló el token

El entry point no sabe si el token venció o si fue modificado: solo sabe que el request llegó sin autenticar. Si quiere que el cliente lo sepa, por ejemplo para que renueve el token cuando vence, responda desde el propio `JwtAuthFilter`.

Primero, un método en el filtro que escribe el error en JSON con el `ObjectMapper` de Spring:

```java
private void writeError(HttpServletResponse response, String message)
        throws IOException {
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.setContentType("application/json");
    Map<String, String> body = Map.of(
            "error", "Unauthorized",
            "message", message);
    objectMapper.writeValue(response.getWriter(), body);
}
```

Agregue `private final ObjectMapper objectMapper;` a los campos del filtro: con `@RequiredArgsConstructor`, Spring lo inyecta.

Después, en el `try` del filtro, capture la expiración por separado:

```java
try {
    // ... igual que antes
} catch (ExpiredJwtException e) {
    writeError(response, "El token expiró");
    return;
} catch (JwtException | IllegalArgumentException e) {
    writeError(response, "Token inválido");
    return;
}
```

Fíjese en el `return`: el filtro escribe la respuesta y **no** llama a `filterChain.doFilter(...)`, así que el request se detiene ahí y nunca llega al controller.

El orden de los `catch` importa: `ExpiredJwtException` extiende de `JwtException`, así que tiene que ir primero o nunca se ejecutaría.

## Pruébelo

- Login con contraseña incorrecta: `401` con `{"error": "Unauthorized"}`.
- Endpoint protegido sin token: `401`.
- Token con una letra cambiada: `401` con `"message": "Token inválido"`.
- Token vencido (ponga `app.security.expirationMinutes=1` y espere un minuto): `401` con `"message": "El token expiró"`.
- Token válido de un usuario sin la authority que pide el endpoint: `403` con `{"error": "Forbidden"}`.
