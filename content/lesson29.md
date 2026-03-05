[t] Auth en REST
Ya sabemos que la diferencia entre REST y RESTful radica principalmente en el uso del término: REST (Representational State Transfer) es un conjunto de principios arquitectónicos definidos por Roy Fielding para diseñar servicios web escalables y mantenibles, mientras que RESTful se refiere a aquellos servicios web que siguen correctamente los principios REST. Es decir, un servicio puede llamarse RESTful solo si implementa de forma adecuada aspectos como el uso de métodos HTTP correctos (GET, POST, PUT, DELETE), URIs bien estructurados, comunicación sin estado (stateless) y respuestas basadas en recursos. En resumen, REST es la teoría, y RESTful es la práctica bien aplicada de esa teoría.

Vamos ahora a hacer una autenticación RESTful. Para este caso los endpoints, al ser especiales, no sigue la convención de sustantivos. Por ejemplo el endpoint de login será `/login`

El mecanismo es como se ilustra a continuación
[i] https://camo.githubusercontent.com/d24a37b20563cf504f90805b909b22a364ff04084c591dcf4693715e578916e5/68747470733a2f2f63646e2e70726f642e776562736974652d66696c65732e636f6d2f3566663636333239343239643838303339326636636261322f3637346635613931643239343761623138353134626334355f3632373338643932653932336537336334636561616430385f546f6b656e2d6261736564253235323041757468656e7469636174696f6e2532353230696e2532353230616374696f6e2e6a706567

[st] JWT
El uso de tokens sigue los principios REST porque mantiene la comunicación entre el cliente y el servidor sin estado (stateless), uno de los pilares fundamentales de REST.

En lugar de almacenar información de sesión en el servidor, el token (como un JWT) contiene toda la información necesaria para autenticar una solicitud y se envía en cada petición, generalmente en el encabezado Authorization.

Esto permite que cada solicitud sea autocontenida, sin necesidad de que el servidor recuerde el estado de conexiones anteriores, cumpliendo así con la naturaleza independiente y escalable de las APIs RESTful.

[st] Instalación
Instale las dependencias
[code:xml]
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
[endcode]
Para poder firmar nuestros tokens, se requiere mínimo 32 caracteres. Puede crearlo en el aplicacition.properties para llamarlo mediante SpEl.
[code:ini]
app.security.secretkey=universidadicesiuniversidadicesiuniversidadicesi
app.security.expirationMinutes=30
[endcode]
Ahora ya podemos crear `JwtService` que es el proveedor de token
[code:java]
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
[endcode]
El token debe ser firmado utilizando una clave secreta (secret key), lo que permite garantizar su integridad. Al usuario autenticado se le entrega un token que contiene ciertos datos, y si un atacante intenta presentar un token falso, este no superará la validación de firma, ya que no posee la clave secreta necesaria para generarlo correctamente.
[st] Estructura
Con esto en mente ya podemos crear un un método para generar el token. Los JWT tienen esta estrcutura
[i] https://camo.githubusercontent.com/e4b3637cf7f7817226ca691bc246d9fd45c3002bf86eb142b4a69be8e8c26925/68747470733a2f2f667573696f6e617574682e696f2f696d672f7368617265642f6a736f6e2d7765622d746f6b656e2e706e67
El método para crearlo puede ser
[code:java]
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
[endcode]
Donde note que se crea a partir de los userDetails. En general el subject de un JWT tiene el username/email del usuario propietario del token.

¿Qué pasa si queremos darle más datos al token?. Lo podemos hacer para incluir el rol del usuario, así como sus authorities.

Incluso esto nos ayudaría a saber cuál es el UserDetails a partir de la información del token. Esta información se denomina claims. Podemos crearlos a partir del UserDetails.
[code:java]
public Map<String, Object> createClaims(UserDetails userDetails){
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", userDetails.getUsername());
        claims.put("authorities",
                userDetails.getAuthorities()
                .stream()
                .map(authority -> authority.getAuthority())
                .toList());
        return claims;
    }
[endcode]
Con esto, lo podemos incluir los claims en el token
[code:java]
//return Jwts.builder()
            .setClaims( createClaims(userDetails) )
//          .compact();
[endcode]
[st] Cadena de filtros
[i] https://raw.githubusercontent.com/Domiciano/Compunet2-251/main/Images/image17.png
Vamos a hacer entonces el Controller RestAuthenticationController con un endpoint para permitir login de nuestros usuarios.
[st] DTO
Tenemos que tener dos DTO. Uno para el Request que incluya email/username y password. Otro para el Response donde podamos enviar el token producido.
[code:java]
public class AuthRequest {
    private String username;
    private String password;
    ...
}

public class AuthResponse {
    private String accessToken;
    ...
}
[endcode]
[st] Primer endpoint de login
Nuestro primer protipo de login es
[code:java]
@Autowired
private JwtService jwtService;

@Autowired
private CustomUserDetailService customUserDetailService;

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody AuthRequest request) {
    //Proceso de autenticación


    //Creación de token
    UserDetails userDetails = customUserDetailService.loadUserByUsername(request.getUsername());
    String jwt = jwtService.generateToken(userDetails);

    var response = new AuthResponse(jwt);
    return ResponseEntity.ok(response);
}
[endcode]
Si utiliza el método, este es capaz de crear el token. Sin embargo, aún no tenemos implementado el proceso de autenticación.

De acuerdo con la cadena de autenticación Stateful es que el request pasa por `UsernamePasswordAuthenticationFilter` > `AuthenticationManager` > `DaoAuthenticationProvider` > `UserDetailService`
[st] Filter chain para JWT
Debemos modificar la cadena y para esto debemos configurar el SecurityFilterChain. Debemos lograr que los procesos de authentication como por ejemplo `/login`, `/signup`, `/refresh` sean de acceso público.

Además configuremos que el CSRF Token quede deshabilitado y además que las sesiones sean estilo stateless de modo que no se guarde HTTP Session.
[code:java]
@Bean
@Order(2)
public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
    http
        .securityMatcher("/api/v1/**")
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/v1/**").permitAll()
            .anyRequest().authenticated()
        )
        .csrf(csrf -> csrf.disable())
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
    return http.build();
}
[endcode]
[st] Proceso de autenticación
Adicionalmente necesitamos poder usar el AuthenticationManager, para eso podemos definir el bean en nuestro WebSecurityConfig
[code:java]
@Bean
public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}
[endcode]
Una vez con el objeto, podemos autenticar los datos que nos llegan al endpoint.
[code:java]
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
[endcode]
El AuthenticationManager llamará a DaoAuthenticationProvider > UserDetailService > UserService > UserRepository > DB. Con esto hacemos la comparación con base de datos

Al final de todo el proceso, la respuesta esperada es algo asi
[code:js]
{
    "accessToken": "eyJhbGciOiJIUzM4NCJ9.eyJyb2xlcyI6WyJST0xFX1BST0ZFU1NPUiJdLCJlbWFpbCI6InByb2Zlc29yQGdtYWlsLmNvbSIsInN1YiI6InByb2Zlc29yQGdtYWlsLmNvbSIsImlhdCI6MTc0NDI5ODQxNSwiZXhwIjoxNzQ0MzAwMjE1fQ.3LugKiiy629iV5wWKwnGAmXsX42lH-t2UFwUKF2bMqzLTOHAxUzVFPpiVe3qbzVu"
}
[endcode]

Aquí, `eyJhbGciOiJIUzM4NCJ9` es igual a
[code:plain]
eyJhbGciOiJIUzM4NCJ9

es igual a

Base64URL(
    {
        "alg": "HS384"
    }
)
[endcode]

`eyJyb2xlcyI6WyJST0x`... es igual a
[code:plain]
Base64URL(
    {
      "roles": ["ROLE_PROFESOR"],
      "email": "profesor@gmail.com",
      "sub": "profesor@gmail.com",
      "iat": 1744298415,
      "exp": 1744300215
    }
)
[endcode]

`3LugKiiy629iV5wWKwnGAmXsX42lH-t2UFwUKF2bMqzLTOHAxUzVFPpiVe3qbzVu` es igual a
[code:plain]
base64(header) + "." + base64(payload)
[endcode]