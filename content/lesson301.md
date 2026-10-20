# Validar el token en un filtro

<!-- tags: JwtAuthFilter, Bearer token, extractAllClaims, parseClaimsJws, SecurityContextHolder, SimpleGrantedAuthority, ExpiredJwtException, SignatureException, JwtException, setAuthentication, header.substring(7), @PreAuthorize con JWT -->

Ya sabemos insertar un filtro en la cadena. Ahora hacemos el filtro de verdad, `JwtAuthFilter`, que en cada request:

1. Busca el encabezado `Authorization: Bearer <token>`.
2. Verifica la firma y la expiración del token.
3. Lee del token quién es el usuario y qué authorities tiene.
4. Le dice a Spring Security que ese request está autenticado.

## Leer el token en el JwtService

Agregue al `JwtService` el método que valida el token y devuelve sus claims:

```java
public Claims extractAllClaims(String token) {
    return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
}
```

`parseClaimsJws` hace la verificación completa que vimos en **Anatomía de un JWT**: recalcula la firma con el secreto, la compara con la del token y revisa el `exp`. Si algo falla, lanza una excepción, y todas extienden de `JwtException`:

- `ExpiredJwtException`: el token ya venció.
- `SignatureException`: la firma no coincide, el token fue modificado.
- `MalformedJwtException`: el texto no tiene la forma de un JWT.
- `UnsupportedJwtException`: es un JWT, pero no firmado de la forma que se espera.

Además lanza `IllegalArgumentException` si el token llega vacío.

Si no lanza nada, el token es auténtico y podemos confiar en sus claims:

```java
Claims claims = jwtService.extractAllClaims(token);
String username = claims.getSubject();
List<?> names = claims.get("authorities", List.class);
```

## El filtro

```java
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        try {
            Claims claims = jwtService.extractAllClaims(token);
            String username = claims.getSubject();
            List<?> names = claims.get("authorities", List.class);
            List<SimpleGrantedAuthority> authorities = names.stream()
                    .map(name -> new SimpleGrantedAuthority(name.toString()))
                    .toList();

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            username, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authToken);
        } catch (JwtException | IllegalArgumentException e) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
```

Las partes importantes:

- **Sin token, el filtro no decide nada.** Si no hay `Bearer`, deja pasar el request sin autenticar. Así `/api/v1/auth/login` sigue funcionando, y para los endpoints protegidos es `AuthorizationFilter`, al final de la cadena, quien lo rechaza.
- `header.substring(7)` quita el prefijo `"Bearer "` (siete caracteres) y deja solo el token.
- En el token las authorities vienen como texto (`"ROLE_PROFESOR"`). Spring Security necesita objetos `GrantedAuthority`, por eso se convierten a `SimpleGrantedAuthority`. Si le pasa la lista de `String` directamente, el código no compila.
- `UsernamePasswordAuthenticationToken(username, null, authorities)` es un `Authentication` **ya autenticado**: con authorities y sin contraseña, porque la contraseña no viaja en el token.
- `SecurityContextHolder.getContext().setAuthentication(...)` es la línea que autentica el request. Desde aquí, para el resto de la cadena y para el controller, el usuario está autenticado.
- Si el token es inválido o venció, se limpia el contexto y el request sigue como anónimo, así que lo rechazan los filtros siguientes.

Fíjese en que el filtro **no consulta la base de datos**: todo lo que necesita viene en el token. Eso es lo que hace stateless a la API.

## Registrarlo en la cadena

Reemplace el `HeaderLoggingFilter` de la lección anterior por el nuevo filtro:

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
        );
    return http.build();
}
```

Como las authorities quedan en el `SecurityContext`, las reglas que ya conoce funcionan igual que con sesión: `.hasAuthority(...)` en la cadena y `@PreAuthorize` en los métodos.

## Pruébelo

1. Haga login en `/api/v1/auth/login` y copie el `accessToken`.
2. Llame a un endpoint protegido con `Authorization: Bearer <token>`: tiene que responder `200`.
3. Llámelo sin el encabezado: lo rechaza.
4. Cambie una letra del token y vuelva a llamarlo: también lo rechaza, porque la firma ya no coincide.

En los dos últimos casos la respuesta es un `403` vacío. En la siguiente lección hacemos que el servidor diga exactamente qué pasó.
