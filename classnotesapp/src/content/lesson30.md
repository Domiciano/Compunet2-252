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