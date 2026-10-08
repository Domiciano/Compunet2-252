# Configurando la seguridad con SecurityFilterChain

<!-- tags: SecurityFilterChain, @Configuration, @EnableWebSecurity, @Bean, HttpSecurity, authorizeHttpRequests, requestMatchers, permitAll, authenticated, anyRequest, PathRequest.toStaticResources, CSS sin estilos en el login, consola H2, h2-console, securityMatcher, @Order, X-Frame-Options, frameOptions sameOrigin, ignoringRequestMatchers, cadena de filtros, el orden de las reglas importa, todas las rutas piden login, 403 en ruta pública -->

Al agregar Spring Security, todas las rutas quedan protegidas y el login lo pone el framework. Para cambiar ese comportamiento hay que decirle a Spring qué reglas queremos. Esas reglas viven en un objeto llamado `SecurityFilterChain`.

## Qué es una cadena de filtros

Cada request que llega a su aplicación pasa primero por una **cadena de filtros** y solo después llega a su controller. Cada filtro hace una tarea de seguridad y deja pasar o corta la petición.

```svg
<svg id="sfcCadena" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 300" width="960" height="300" style="max-width:100%;height:auto;display:block;margin:0 auto" role="img" aria-labelledby="sfcCadena-ttl sfcCadena-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="sfcCadena-ttl">La cadena de filtros de Spring Security</title>
  <desc id="sfcCadena-dsc">Un request entra desde el navegador, atraviesa en orden los filtros CsrfFilter, LogoutFilter, UsernamePasswordAuthenticationFilter, AnonymousAuthenticationFilter y AuthorizationFilter, y solo si el último lo permite llega al controller.</desc>
  <defs>
    <style>
      #sfcCadena .title{fill:#161A26;font-size:22px;font-weight:700}
      #sfcCadena .sub{fill:#79809A;font-size:13.5px}
      #sfcCadena .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #sfcCadena .ar{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#sfcCadena-ar)}
    </style>
    <marker id="sfcCadena-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
  </defs>
  <rect width="960" height="300" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="52">Cada request atraviesa la cadena antes del controller</text>
  <text class="sub" x="48" y="76">El último filtro es el que aplica sus reglas permitAll y authenticated.</text>
  <rect x="24" y="130" width="96" height="64" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text x="72" y="162" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074">Request</text>
  <rect x="148" y="110" width="116" height="104" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>
  <text class="mono" x="206" y="150" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9">CsrfFilter</text>
  <text x="206" y="174" text-anchor="middle" font-size="11.5" fill="#454C61">valida el token</text>
  <rect x="288" y="110" width="116" height="104" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>
  <text class="mono" x="346" y="150" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9">LogoutFilter</text>
  <text x="346" y="174" text-anchor="middle" font-size="11.5" fill="#454C61">atiende /logout</text>
  <rect x="428" y="110" width="132" height="104" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="494" y="140" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">UsernamePassword</text>
  <text class="mono" x="494" y="156" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">AuthenticationFilter</text>
  <text x="494" y="182" text-anchor="middle" font-size="11.5" fill="#454C61">procesa POST /login</text>
  <rect x="584" y="110" width="132" height="104" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>
  <text class="mono" x="650" y="140" text-anchor="middle" font-size="11" font-weight="700" fill="#4453C9">Anonymous</text>
  <text class="mono" x="650" y="156" text-anchor="middle" font-size="11" font-weight="700" fill="#4453C9">AuthenticationFilter</text>
  <text x="650" y="182" text-anchor="middle" font-size="11.5" fill="#454C61">sin sesión = anónimo</text>
  <rect x="740" y="110" width="116" height="104" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/>
  <text class="mono" x="798" y="140" text-anchor="middle" font-size="11" font-weight="700" fill="#C2354F">Authorization</text>
  <text class="mono" x="798" y="156" text-anchor="middle" font-size="11" font-weight="700" fill="#C2354F">Filter</text>
  <text x="798" y="182" text-anchor="middle" font-size="11.5" fill="#454C61">¿puede pasar?</text>
  <rect x="880" y="130" width="64" height="64" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text x="912" y="162" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#7439B8">Controller</text>
  <path class="ar" d="M122,162 H146"/><path class="ar" d="M266,162 H286"/><path class="ar" d="M406,162 H426"/><path class="ar" d="M562,162 H582"/><path class="ar" d="M718,162 H738"/><path class="ar" d="M858,162 H878"/>
  <text class="sub" x="480" y="256" text-anchor="middle">Hay más filtros en la cadena real; estos son los que necesita conocer ahora.</text>
</svg>
```

Varios ya los ha visto trabajar: `AuthorizationFilter` en el recorrido de un request autorizado y `CsrfFilter` en la lección del token CSRF. Usted no escribe esos filtros; Spring Security los arma por defecto. Lo que sí escribe es la **configuración** de la cadena, y eso es un `SecurityFilterChain`.

## Un bean en una clase de configuración

El `SecurityFilterChain` es un **bean**: lo declara un método anotado con `@Bean` dentro de una clase `@Configuration`, igual que cualquier otro bean que ya conoce del IoC Container. Va en la misma `WebSecurityConfig` donde ya declaró el `UserDetailsService` y el `PasswordEncoder`: es un tercer bean de esa clase.

```java
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                .requestMatchers("/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(Customizer.withDefaults());
        return http.build();
    }
}
```

- `@Configuration` marca la clase como fuente de beans.
- `@EnableWebSecurity` declara que esta clase configura la seguridad web. Con Spring Boot la seguridad ya se activa sola, pero es costumbre dejarla para que se lea de un vistazo.
- `HttpSecurity` es el constructor de la cadena. Spring se lo inyecta como parámetro; usted le encadena reglas y al final llama `http.build()` para obtener el `SecurityFilterChain`.
- Mientras no declare este bean, Spring usa una cadena por defecto: todo autenticado y login automático. Al declararlo, **su** cadena reemplaza a la de por defecto **completa**.

## Las reglas: permitAll y authenticated

Dentro de `authorizeHttpRequests` usted decide, ruta por ruta, quién puede entrar. Esas reglas las aplica el último filtro de la cadena, `AuthorizationFilter`.

- `requestMatchers("/public/**")` elige un grupo de rutas. `**` significa "esta ruta y todo lo que cuelgue de ella".
- `permitAll()` deja pasar a cualquiera, con o sin sesión.
- `authenticated()` exige que el usuario haya iniciado sesión.
- `anyRequest()` es "todo lo demás".

Lea el ejemplo como una frase: *los recursos estáticos y las rutas bajo `/public` las puede ver cualquiera; todo lo demás requiere sesión.*

## Liberar el CSS y el JavaScript

Con `anyRequest().authenticated()`, también los archivos de `static/` quedan protegidos. Una página pública, como el login, se vería sin estilos porque el navegador pide el CSS sin sesión y recibe una redirección.

Una salida es mover los archivos a una carpeta `public/` y liberarla con `/public/**`, pero eso obliga a organizar el proyecto según la seguridad. Spring Boot ofrece algo mejor: `PathRequest.toStaticResources().atCommonLocations()`, que ya conoce las carpetas estándar de recursos y las libera todas de una vez.

```java
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;

.requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
```

Libera `/css/**`, `/js/**`, `/images/**`, `/webjars/**` y `favicon.ico`, es decir, lo que está en `src/main/resources/static/` bajo esos nombres. Sus archivos quedan donde estaban y no depende de una ruta inventada. Si alguna de esas carpetas no debe ser pública, se excluye:

```java
PathRequest.toStaticResources().atCommonLocations()
    .excluding(StaticResourceLocation.IMAGES)
```

Esta regla va **antes** de `anyRequest()`, como cualquier otra.

## Por qué aparece formLogin

Como su cadena reemplaza a la de por defecto completa, el formulario de login también desaparece a menos que lo pida. `formLogin(Customizer.withDefaults())` vuelve a activar la página de login que Spring genera sola. Sin esa línea, quien no tenga sesión recibe un `403 Forbidden` en vez de una redirección al login. En la siguiente lección cambiamos esa página por una propia.

## El orden de las reglas importa

Spring evalúa las reglas **de arriba hacia abajo y se queda con la primera que coincide**. Por eso `anyRequest()` va siempre al final: si lo pone primero, atrapa todo y las reglas siguientes nunca se evalúan.

```java
.authorizeHttpRequests(auth -> auth
    .anyRequest().authenticated()
    .requestMatchers("/public/**").permitAll()
)
```

Esta versión parece igual a la anterior pero no lo es: `/public/**` seguiría pidiendo login. Spring incluso lo rechaza al arrancar con un error de configuración.

## Una segunda cadena para la consola de H2

Hasta aquí, una sola cadena protege toda la aplicación y libera el CSS y el JavaScript con `permitAll`. La consola de H2 (`/h2-console`) no se lleva bien con esa cadena, por tres razones:

- Tiene su propio login, así que la regla `anyRequest().authenticated()` la manda al login de su aplicación, que no es el de H2.
- Sus formularios no llevan token CSRF, y `CsrfFilter` los rechaza con `403`.
- Se dibuja dentro de `frames`, y Spring Security manda por defecto la cabecera `X-Frame-Options: DENY`, que impide que el navegador los muestre.

No conviene aflojar estas reglas para toda la aplicación solo por la consola. La solución es declarar **otro `SecurityFilterChain`**, que solo atienda las rutas de H2:

```java
@Bean
@Order(1)
public SecurityFilterChain h2SecurityFilterChain(HttpSecurity http) throws Exception {
    http
        .securityMatcher(PathRequest.toH2Console())
        .authorizeHttpRequests(auth -> auth
            .anyRequest().permitAll()
        )
        .csrf(csrf -> csrf
            .ignoringRequestMatchers(PathRequest.toH2Console())
        )
        .headers(headers -> headers
            .frameOptions(frameOptions -> frameOptions.sameOrigin())
        );
    return http.build();
}
```

Cada línea resuelve una de las tres razones:

- `securityMatcher(PathRequest.toH2Console())` limita esta cadena a las rutas de la consola. Cualquier otro request ignora esta cadena.
- `permitAll()` deja entrar sin la autenticación de la aplicación; H2 pide su propio usuario y contraseña.
- `csrf(... ignoringRequestMatchers ...)` apaga la verificación del token solo para esas rutas.
- `frameOptions(... sameOrigin())` permite los frames, pero solo desde la misma aplicación.

La cadena de la aplicación se queda como estaba, solo que ahora debe ir **después**:

```java
@Bean
@Order(2)
public SecurityFilterChain appSecurityFilterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
            .requestMatchers("/public/**").permitAll()
            .anyRequest().authenticated()
        )
        .formLogin(Customizer.withDefaults());
    return http.build();
}
```

`@Order` fija en qué orden se consultan las cadenas: gana **la primera cuyo `securityMatcher` coincide** con el request. La cadena de H2 tiene `@Order(1)` y solo coincide con `/h2-console/**`. La de la aplicación no tiene `securityMatcher`, o sea que coincide con todo, y por eso va siempre última. Si invierte los números, la cadena de la aplicación atrapa también las rutas de H2 y la consola vuelve a pedir login.

La consola debe estar activa en `application.properties`:

```properties
spring.h2.console.enabled=true
```

Use esta cadena solo en desarrollo. Una consola de base de datos sin autenticación de la aplicación no debe llegar a producción.
