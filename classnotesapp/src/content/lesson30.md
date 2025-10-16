[t] Filtros por Request
Una vez tenemos los filtros deberíamos poder verificar el token antes de que el request siga su camino normal. Debemos pensarnos en estos filtros por request o `OncePerRequestFilter` como interceptores que podemos ubicar dentro de la ejecución de un `SecurityFilterChain`

[code:plain]
Request
  ↓
[CorsFilter]                            // Maneja CORS (si está habilitado)
  ↓
[CsrfFilter]                            // Verifica token CSRF (para formularios o sesiones)
  ↓
[LogoutFilter]                          // Maneja logout antes que cualquier autenticación
  ↓
[UsernamePasswordAuthenticationFilter]  // Procesa login form (solo si usas formLogin)
  ↓
[AnonymousAuthenticationFilter]         // Asigna Authentication anónimo si no hay uno
  ↓
[ExceptionTranslationFilter]            // Maneja excepciones de seguridad (403, etc.)
  ↓
[FilterSecurityInterceptor]             // Aplica reglas de acceso (.authorizeHttpRequests)
  ↓
[Controller]                            // Si todo está ok, llega al endpoint
[endcode]

`CorsFilter`
Maneja las solicitudes de orígenes cruzados agregando los encabezados Access-Control-Allow-* antes de que se realice cualquier validación de seguridad.

`CsrfFilter` protege contra ataques de tipo CSRF, aunque solo aplica si la aplicación usa cookies y sesiones.

`LogoutFilter` detecta las solicitudes al endpoint /logout y se encarga de limpiar la sesión o el contexto de autenticación.

`UsernamePasswordAuthenticationFilter` 
Valida sesiones iniciadas a través de `username` y `password`

`AnonymousAuthenticationFilter`
Si ningún filtro anterior autenticó la solicitud, asigna automáticamente un usuario “anónimo” para que el flujo de seguridad continúe sin romperse.

`ExceptionTranslationFilter` 
Captura excepciones de seguridad, como AccessDeniedException o AuthenticationException, y responde con un código 403 (Forbidden) o redirige a la página de login.

`FilterSecurityInterceptor`
Es el filtro final del SecurityFilterChain; evalúa las reglas configuradas con .authorizeHttpRequests() o las restricciones establecidas mediante anotaciones como @PreAuthorize.

[st] Verificador de auth headers
Vamos a analizar este filtro
[code:java]
@Component
public class HeaderLoggingFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null) {
            System.out.println("Authorization Header: " + authHeader);
        } else {
            System.out.println("No Authorization header present for " + request.getRequestURI());
        }

        // Esta línea permite seguir al siguiente eslabón de la cadena
        filterChain.doFilter(request, response);
    }
}
[endcode]
Una vez con esto, ponga el filtro antes del UsernamePasswordAuthenticationFilter
[code:java]
//@Bean
//@Order(2)
//public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
//    http
//        .securityMatcher("/api/v1/**")
//        .authorizeHttpRequests(auth -> auth
//            .requestMatchers("/api/v1/**").permitAll()
//            .anyRequest().authenticated()
//        )
        .addFilterBefore(headerLoggingFilter, UsernamePasswordAuthenticationFilter.class) //<-- Así
//      .csrf(csrf -> csrf.disable())
//        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
//    return http.build();
}
[endcode]
Verifique qué pasa 
[st] Extracción de información y verificación
Ya entendiendo como interceptamos request http, vamos a hacer el siguiente flujo: interceptamos el request, verificamos que el header llamado `Authorization` tenga la siguiente sencuencia: `Bearer <access_token>` donde `<access_token>` es el token que el cliente envia al servidor. Si el token es válido, lo dejamos pasar y si no es válido contestamos con 403.

Lo primero es saber cómo extraer la información del token, que debería esta en el `JwtService`
[code:java]
public Claims extractAllClaims(String token) {
  try{
    Claims claims = Jwts.parserBuilder()
            .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
            .build()
            .parseClaimsJws(token)
            .getBody();
    return claims;
  } catch (ExpiredJwtException e) {
    System.out.println("Token expirado: " + e.getMessage());
    throw e;
  } catch (UnsupportedJwtException e) {
    System.out.println("Token no soportado: " + e.getMessage());
    throw e;
  } catch (MalformedJwtException e) {
    System.out.println("Token mal formado: " + e.getMessage());
    throw e;
  } catch (SignatureException e) {
    System.out.println("Firma JWT inválida: " + e.getMessage());
    throw e;
  } catch (IllegalArgumentException e) {
    System.out.println("Token vacío o nulo: " + e.getMessage());
    throw e;
  }
}
[endcode]
Este método devuelve un objeto `Claims`. Que principalmente tiene el subject que es el `username` y los `authorities`.
[code:java]
Claims claims = jwtService.extractAllClaims(jwt);
String username = claims.getSubject();
List<String> authorities = claims.get("authorities", List.class);
[endcode]
[st] Autenticación con Token
Ya una vez con esto y antes de dejar que el request vaya al siguiente filtro, debemos finalmente autenticarnos.
[code:java]
UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
  email, null, authorities
);
[endcode]
Y finalmente ...
[code:java]
SecurityContextHolder.getContext().setAuthentication(authToken);
[endcode]
Esta última linea nos permite autenticarnos, asi que podemos enviar la request al siguiente eslabón de la cadena
[code:java]
filterChain.doFilter(request, response);
[endcode]
[st] Manejo de errores
En el OncePerRequestFilter permite devolver la solicitud
[code:java]
@Autowired
private ObjectMapper objectMapper;

...

response.setStatus(status);
response.setContentType("application/json");

ApiResponse errorResponse = new ApiResponse("Error de autenticación", message);
String json = objectMapper.writeValueAsString(errorResponse);

response.getWriter().write(json);
response.getWriter().flush();
[endcode]