# Endpoint de login

<!-- tags: endpoint de login, AuthenticationManager, UsernamePasswordAuthenticationToken, SecurityFilterChain stateless, csrf disable, securityMatcher, @Order, permitAll /api/v1/auth, BadCredentialsException, AuthRequest AuthResponse -->

Con el `JwtService` listo, falta el endpoint que recibe las credenciales, las valida y entrega el token.

## Los DTOs

Necesitamos dos: uno para lo que llega (las credenciales) y otro para lo que sale (el token).

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {
    private String username;
    private String password;
}
```

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
}
```

## La cadena de filtros de la API

La API necesita su propia `SecurityFilterChain`, distinta de la del MVC con Thymeleaf. Tiene que cumplir tres cosas:

- Los endpoints de `/api/v1/auth/**` son públicos: nadie tiene token antes de iniciar sesión.
- Sin CSRF: el token CSRF protege formularios que usan cookies de sesión, y aquí no hay ni lo uno ni lo otro.
- Sesiones `STATELESS`: Spring no crea `HttpSession` ni cookie `JSESSIONID`.

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
        .csrf(csrf -> csrf.disable())
        .sessionManagement(sm -> sm
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );
    return http.build();
}
```

`securityMatcher("/api/v1/**")` hace que esta cadena solo atienda las rutas de la API. La cadena del MVC, que no tiene `securityMatcher` y atiende todo lo demás, tiene que tener un `@Order` **mayor**: Spring prueba las cadenas en orden y usa la primera que coincide.

Por ahora el resto de la API queda cerrada: nadie puede autenticarse con un token todavía, porque falta el filtro que lo lee. Eso viene en las siguientes lecciones.

## El AuthenticationManager

Para validar credenciales usamos el mismo mecanismo de Spring Security que ya conoce. Exponga el `AuthenticationManager` como bean en su `WebSecurityConfig`:

```java
@Bean
public AuthenticationManager authenticationManager(
        AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}
```

Cuando se le pide que autentique, el `AuthenticationManager` recorre el mismo camino que el login con formulario: `DaoAuthenticationProvider` > `UserDetailsService` > repositorio > base de datos, y compara la contraseña con el `PasswordEncoder`.

## El controller

```java
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class RestAuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody AuthRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwt));
    }
}
```

- `UsernamePasswordAuthenticationToken` empaqueta las credenciales que llegaron.
- `authenticate(...)` las valida. Si son correctas devuelve un `Authentication` cuyo *principal* es el `UserDetails` del usuario, así que no hay que volver a buscarlo en la base de datos.
- Si son incorrectas, lanza `BadCredentialsException` y el método no sigue: nunca se genera un token para credenciales malas.

## Pruébelo

```http
POST http://localhost:8080/api/v1/auth/login
Content-Type: application/json

{
  "username": "profesor@gmail.com",
  "password": "123456"
}
```

La respuesta esperada es:

```json
{
  "accessToken": "eyJhbGciOiJIUzM4NCJ9.eyJhdXRob3JpdGllcyI6..."
}
```

Pegue el token en [jwt.io](https://jwt.io) y revise que el payload tenga `sub`, `authorities`, `iat` y `exp`.

Con una contraseña incorrecta, por ahora la respuesta es un `403` vacío. En la lección **Errores 401 y 403** lo cambiamos por un `401` con un mensaje claro.
