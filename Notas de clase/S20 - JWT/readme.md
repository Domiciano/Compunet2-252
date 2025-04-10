# Diferencia entre REST y RESTFull


La diferencia entre *REST* y *RESTful* radica principalmente en el uso del término: REST (Representational State Transfer) es un conjunto de principios arquitectónicos definidos por Roy Fielding para diseñar servicios web escalables y mantenibles, mientras que RESTful se refiere a aquellos servicios web que siguen correctamente los principios REST. Es decir, un servicio puede llamarse RESTful solo si implementa de forma adecuada aspectos como el uso de métodos HTTP correctos (GET, POST, PUT, DELETE), URIs bien estructurados, comunicación sin estado (stateless) y respuestas basadas en recursos. En resumen, REST es la teoría, y RESTful es la práctica bien aplicada de esa teoría.


Vamos ahora a hacer una autenticación RESTful. Para este caso los endpoints, al ser especiales, no sigue la convención de sustantivos. Por ejemplo el endpoint de login será `/login`.

El mecanismo es como se ilustra a continuación

<p align="center">
    <img src="https://cdn.prod.website-files.com/5ff66329429d880392f6cba2/674f5a91d2947ab18514bc45_62738d92e923e73c4ceaad08_Token-based%2520Authentication%2520in%2520action.jpeg" width="512">
</p>

# JSON Web Tokens

El uso de tokens sigue los principios REST porque mantiene la comunicación entre el cliente y el servidor sin estado (stateless), uno de los pilares fundamentales de REST. 

En lugar de almacenar información de sesión en el servidor, el token (como un JWT) contiene toda la información necesaria para autenticar una solicitud y se envía en cada petición, generalmente en el encabezado Authorization. 

Esto permite que cada solicitud sea autocontenida, sin necesidad de que el servidor recuerde el estado de conexiones anteriores, cumpliendo así con la naturaleza independiente y escalable de las APIs RESTful.

Instale las dependencias

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

# Utilidad para crear JWT


Requiere mínimo 32 caracteres. Puede crearlo en el `aplicacition.properties` para llamarlo mediante SpEl.

```ini
app.security.secretkey=universidadicesiuniversidadicesiuniversidadicesi
app.security.expirationMinutes=30
```


```java
package co.edu.icesi.introspringboot2.service.impl;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JwtService {

    @Value("${app.security.secretkey}")
    private String secret;

    @Value("${app.security.expirationMinutes}")
    private int expirationMinutes;

    ...

}
```


El token debe ser firmado utilizando una clave secreta (secret key), lo que permite garantizar su integridad. Al usuario autenticado se le entrega un token que contiene ciertos datos, y si un atacante intenta presentar un token falso, este no superará la validación de firma, ya que no posee la clave secreta necesaria para generarlo correctamente.

Con esto en mente ya podemos crear un un método para generar el token. Los JWT tienen esta estrcutura


<p align="center">
    <img src="https://fusionauth.io/img/shared/json-web-token.png" width="512">
</p>

El método para crearlo puede ser

```java
public String generateToken(UserDetails userDetails) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + 1000L * 60L * expirationMinutes);

    return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .compact();
}
```

Donde note que se crea a partir de los userDetails. En general el subject de un JWT tiene el username/email del usuario propietario del token.

¿Qué pasa si queremos darle más datos al token?. Lo podemos hacer para incluir el rol del usuario, así como sus authorities.

Incluso esto nos ayudaría a saber cuál es el `UserDetails` a partir de la información del token. Esta información se denomina `claims`. Podemos crearlos a partir del UserDetails.


```java
public Map<String, Object> createClaims(UserDetails userDetails){
    Map<String, Object> claims = new HashMap<>();
    claims.put("email", userDetails.getUsername());
    claims.put("roles", userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));
    return claims;
}
```

Con esto, lo podemos incluir los claims en el token
```java
//return Jwts.builder()
            .setClaims( createClaims(userDetails) )
//          .compact();
```




# Endpoint de login

Vamos a hacer un endpoint entonces para permitir login de nuestros usuarios.

Tenemos que tener dos DTO. Uno para el Request que incluya email/username y password. Otro para el Response donde podamos enviar el token producido.


```java
public class AuthRequest {
    private String username;
    private String password;
    ...
}
```


```java
public class AuthResponse {
    private String accessToken;
    ...
}
```


Nuestro primer protipo de login es

```java
@Autowired
private JwtService jwtService;

@Autowired
private CustomUserDetailsService customUserDetailsService;

@PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        
        //Proceso de autenticación


        //Creación de token
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(request.getUsername());
        String jwt = jwtService.generateToken(userDetails);

        var response = new AuthResponse(jwt);
        return ResponseEntity.ok(response);
}
```

Si utiliza el método, este es capaz de crear el token. Sin embargo, aún no tenemos implementado el proceso de autenticación.

De acuerdo con la cadena de autenticación Stateful es que el request pasa por `UsernamePasswordAuthenticationFilter > AuthenticationManager > DaoAuthenticationProvider > UserDetailService`. Vea el <a href="https://github.com/Domiciano/Compunet2-251/blob/main/Images/image15.png">gráfico de referencia<a>

Debemos modificar la cadena y para esto debemos configurar el `SecurityFilterChain`. Debemos lograr que los procesos de authentication como por ejemplo `/login`, `/signup`, `/refresh` sean de acceso público.

Además configuremos que el CSRF Token quede deshabilitado y además que las sesiones sean estilo *stateless* de modo que no se guarde HTTP Session.

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        auth -> auth
                                .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()
                                .requestMatchers("/api/auth/**").permitAll()
                                .anyRequest().authenticated()
                );
        
        return http.build();
}
```

Adicionalmente necesitamos poder usar el `AuthenticationManager`, para eso podemos definir el bean en nuestro `WebSecurityConfig`

```java
@Bean
public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}
```


Una vez con el objeto, podemos autenticar los datos que nos llegan al endpoint.


```java
//@Autowired
//private JwtService jwtService;

//@Autowired
//private CustomUserDetailsService customUserDetailsService;

  @Autowired
  private AuthenticationManager authenticationManager;

//@PostMapping("/login")
//public ResponseEntity<?> login(@RequestBody AuthRequest request) {
      
      authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
      );
        
//    UserDetails userDetails = customUserDetailsService.loadUserByUsername(request.getUsername());
//    String jwt = jwtService.generateToken(userDetails);

//    var response = new AuthResponse(jwt);
//    return ResponseEntity.ok(response);
//}
```



# En el próximo capítulo...

# Creación del filtro de JWT para el filter chain


```java
import co.edu.icesi.introspringboot2.util.JwtUtil;
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
    private JwtUtil jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            String username = jwtService.extractUsername(jwt);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtService.isTokenValid(jwt)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }
        chain.doFilter(request, response);
    }
}
```


# Security Config

```java
@EnableWebSecurity
@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```



