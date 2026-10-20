# Filtros por Request

<!-- tags: OncePerRequestFilter, SecurityFilterChain, cadena de filtros, addFilterBefore, filterChain.doFilter, AuthorizationFilter, SecurityContextHolderFilter, AnonymousAuthenticationFilter, csrf disable, el request no llega al controller, doFilterInternal -->

Para validar el token tenemos que revisarlo **antes** de que el request llegue al controller. Spring Security ya funciona así: cada request pasa por una cadena de filtros, la `SecurityFilterChain`, y nosotros podemos insertar los nuestros en ella.

## La cadena de filtros

Pulse cada filtro para ver qué hace y qué papel cumple en nuestra API.

```interactive
filter-chain
```

El orden importa. `JwtAuthFilter` va antes que los filtros que deciden si el request puede pasar: primero hay que saber quién es el usuario, y después se revisa qué puede hacer.

## OncePerRequestFilter

Un filtro propio se escribe extendiendo `OncePerRequestFilter`, que garantiza que se ejecuta una sola vez por request. Empecemos con uno que solo muestra el encabezado `Authorization`:

```java
@Component
public class HeaderLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null) {
            System.out.println("Authorization: " + authHeader);
        } else {
            System.out.println("Sin Authorization en "
                    + request.getRequestURI());
        }

        filterChain.doFilter(request, response);
    }
}
```

`filterChain.doFilter(request, response)` le pasa el request al siguiente filtro de la cadena. Si un filtro **no** lo llama, el request se detiene ahí y nunca llega al controller: así es como un filtro puede rechazar una solicitud.

## Insertarlo en la cadena

Inyecte el filtro en su `WebSecurityConfig` y agréguelo con `addFilterBefore`:

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
        .addFilterBefore(headerLoggingFilter,
                UsernamePasswordAuthenticationFilter.class)
        .csrf(csrf -> csrf.disable())
        .sessionManagement(sm -> sm
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );
    return http.build();
}
```

## Pruébelo

1. Haga una solicitud a cualquier endpoint de `/api/v1/` sin encabezado `Authorization`.
2. Repítala con `Authorization: Bearer <el token del login>`.
3. Compare lo que imprime la consola en los dos casos.

En la siguiente lección cambiamos este filtro de prueba por uno que valida el token de verdad.
