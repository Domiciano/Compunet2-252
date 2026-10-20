# Filtros por Request

<!-- tags: OncePerRequestFilter, SecurityFilterChain, cadena de filtros, addFilterBefore, filterChain.doFilter, UsernamePasswordAuthenticationFilter, AuthorizationFilter, header Authorization, el request no llega al controller, doFilterInternal -->

Para validar el token tenemos que revisarlo **antes** de que el request llegue al controller. Spring Security ya funciona así: cada request pasa por una cadena de filtros, la `SecurityFilterChain`, y nosotros podemos insertar los nuestros en ella.

## La cadena de filtros

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="680" height="460" font-family="Roboto, Arial, sans-serif">
  <defs>
    <marker id="ad-chain3" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
      <polygon points="0 0,6 2.5,0 5" fill="#546E7A"/>
    </marker>
    <marker id="ado-chain3" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
      <polygon points="0 0,6 2.5,0 5" fill="#FFA726"/>
    </marker>
  </defs>
  <rect width="680" height="460" fill="#12121f" rx="12"/>
  <text x="340" y="28" text-anchor="middle" fill="#e0e0e0" font-size="15" font-weight="bold">Security Filter Chain — Insercion del JwtAuthFilter</text>
  <rect x="270" y="40" width="140" height="28" rx="14" fill="#263238"/>
  <text x="340" y="58" text-anchor="middle" fill="#90A4AE" font-size="12">Request HTTP</text>
  <line x1="340" y1="68" x2="340" y2="76" stroke="#546E7A" stroke-width="1.5" marker-end="url(#ad-chain3)"/>
  <rect x="140" y="78" width="400" height="28" rx="5" fill="#1e2d3a" stroke="#37474F" stroke-width="1"/>
  <text x="340" y="96" text-anchor="middle" fill="#78909C" font-size="12">CorsFilter</text>
  <line x1="340" y1="106" x2="340" y2="114" stroke="#546E7A" stroke-width="1.5" marker-end="url(#ad-chain3)"/>
  <rect x="140" y="116" width="400" height="28" rx="5" fill="#1a2020" stroke="#2a3a2a" stroke-width="1"/>
  <text x="340" y="134" text-anchor="middle" fill="#455A64" font-size="12">CsrfFilter  (deshabilitado para REST)</text>
  <line x1="340" y1="144" x2="340" y2="152" stroke="#546E7A" stroke-width="1.5" marker-end="url(#ad-chain3)"/>
  <rect x="140" y="154" width="400" height="28" rx="5" fill="#1e2d3a" stroke="#37474F" stroke-width="1"/>
  <text x="340" y="172" text-anchor="middle" fill="#78909C" font-size="12">LogoutFilter</text>
  <line x1="340" y1="182" x2="340" y2="190" stroke="#FFA726" stroke-width="1.5" marker-end="url(#ado-chain3)"/>
  <rect x="110" y="192" width="460" height="36" rx="6" fill="#1a1500" stroke="#FFA726" stroke-width="2"/>
  <text x="310" y="213" text-anchor="middle" fill="#FFA726" font-size="13" font-weight="bold">JwtAuthFilter</text>
  <text x="500" y="213" text-anchor="middle" fill="#FFA726" font-size="11">NUEVO</text>
  <line x1="340" y1="228" x2="340" y2="236" stroke="#546E7A" stroke-width="1.5" marker-end="url(#ad-chain3)"/>
  <rect x="140" y="238" width="400" height="28" rx="5" fill="#1e2d3a" stroke="#37474F" stroke-width="1"/>
  <text x="340" y="256" text-anchor="middle" fill="#78909C" font-size="11">UsernamePasswordAuthenticationFilter</text>
  <line x1="340" y1="266" x2="340" y2="274" stroke="#546E7A" stroke-width="1.5" marker-end="url(#ad-chain3)"/>
  <rect x="140" y="276" width="400" height="28" rx="5" fill="#1e2d3a" stroke="#37474F" stroke-width="1"/>
  <text x="340" y="294" text-anchor="middle" fill="#78909C" font-size="12">AnonymousAuthenticationFilter</text>
  <line x1="340" y1="304" x2="340" y2="312" stroke="#546E7A" stroke-width="1.5" marker-end="url(#ad-chain3)"/>
  <rect x="140" y="314" width="400" height="28" rx="5" fill="#1e2d3a" stroke="#37474F" stroke-width="1"/>
  <text x="340" y="332" text-anchor="middle" fill="#78909C" font-size="12">ExceptionTranslationFilter</text>
  <line x1="340" y1="342" x2="340" y2="350" stroke="#546E7A" stroke-width="1.5" marker-end="url(#ad-chain3)"/>
  <rect x="140" y="352" width="400" height="28" rx="5" fill="#1e2d3a" stroke="#37474F" stroke-width="1"/>
  <text x="340" y="370" text-anchor="middle" fill="#78909C" font-size="12">AuthorizationFilter</text>
  <line x1="340" y1="380" x2="340" y2="388" stroke="#546E7A" stroke-width="1.5" marker-end="url(#ad-chain3)"/>
  <rect x="240" y="390" width="200" height="32" rx="8" fill="#1B5E20" stroke="#2E7D32" stroke-width="1.5"/>
  <text x="340" y="410" text-anchor="middle" fill="#66BB6A" font-size="13" font-weight="bold">Controller (Endpoint)</text>
  <text x="340" y="445" text-anchor="middle" fill="#546E7A" font-size="11">El JwtAuthFilter valida el token antes de que el request llegue al resto de la cadena</text>
</svg>
```

`CorsFilter`
Maneja las solicitudes de orígenes cruzados agregando los encabezados `Access-Control-Allow-*` antes de cualquier validación de seguridad.

`CsrfFilter`
Protege contra ataques CSRF. Solo tiene sentido si la aplicación usa cookies y sesiones; en la API lo deshabilitamos.

`LogoutFilter`
Detecta las solicitudes a `/logout` y limpia la sesión o el contexto de autenticación.

`UsernamePasswordAuthenticationFilter`
Procesa el login con formulario (`username` y `password`). Solo actúa si la cadena usa `formLogin`.

`AnonymousAuthenticationFilter`
Si ningún filtro anterior autenticó la solicitud, le asigna un usuario "anónimo" para que la cadena continúe.

`ExceptionTranslationFilter`
Captura las excepciones de seguridad (`AuthenticationException`, `AccessDeniedException`) y las convierte en una respuesta: 401, 403 o una redirección al login.

`AuthorizationFilter`
Es el último filtro. Evalúa las reglas de `.authorizeHttpRequests()`: decide si el usuario, autenticado o anónimo, puede llegar al endpoint. En versiones anteriores de Spring Security se llamaba `FilterSecurityInterceptor`.

El filtro que valide el token, `JwtAuthFilter`, va **antes** de `UsernamePasswordAuthenticationFilter`: tiene que autenticar al usuario antes de que los filtros siguientes decidan si puede pasar.

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
