# Configurando la seguridad con SecurityFilterChain

<!-- tags: SecurityFilterChain, @Configuration, @EnableWebSecurity, @Bean, HttpSecurity, authorizeHttpRequests, requestMatchers, permitAll, authenticated, anyRequest, CSS sin estilos en el login, consola H2, h2-console, securityMatcher, @Order, frameOptions sameOrigin, ignoringRequestMatchers, el orden de las reglas importa, todas las rutas piden login -->

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

Varios ya los ha visto trabajar: `AuthorizationFilter` en el recorrido de un request autorizado y `CsrfFilter` en la lección del token CSRF. Usted no escribe esos filtros; Spring Security los arma por defecto. Lo que sí escribe es la **configuración** de la cadena.

## Un bean en una clase de configuración

El `SecurityFilterChain` es un **bean**: lo declara un método anotado con `@Bean` dentro de una clase `@Configuration`. Va en la misma `WebSecurityConfig` donde ya declaró el `UserDetailsService` y el `PasswordEncoder`: es un tercer bean de esa clase.

```java
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```

- `HttpSecurity` es el constructor de la cadena. Spring se lo inyecta; usted le encadena reglas y al final llama `http.build()`.
- Al declarar este bean, **su** cadena reemplaza a la de por defecto.

## permitAll y authenticated

Dentro de `authorizeHttpRequests` usted decide, ruta por ruta, quién puede entrar:

- `requestMatchers(...)` elige un grupo de rutas.
- `permitAll()` deja pasar a cualquiera, con o sin sesión.
- `authenticated()` exige que el usuario haya iniciado sesión.
- `anyRequest()` es "todo lo demás".

Con `anyRequest().authenticated()` también quedan protegidos los archivos de `static/`: el navegador pide el CSS sin sesión, recibe una redirección al login y la página se ve sin estilos. Basta con liberarlos:

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/css/**", "/js/**").permitAll()
    .anyRequest().authenticated()
)
```

Lea el ejemplo como una frase: *el CSS y el JavaScript los puede pedir cualquiera; todo lo demás requiere sesión.* El `**` significa "esta ruta y todo lo que cuelgue de ella".

## El orden de las reglas importa

Spring evalúa las reglas **de arriba hacia abajo y se queda con la primera que coincide**. Por eso `anyRequest()` va siempre al final: si lo pone primero, atrapa todo y las reglas siguientes nunca se evalúan. Spring incluso lo rechaza al arrancar con un error de configuración.

## Una segunda cadena para la consola de H2

La consola de H2 (`/h2-console`) no se lleva bien con la cadena de la aplicación: tiene su propio login, sus formularios no llevan token CSRF y se dibuja dentro de `frames`, que Spring Security bloquea por defecto. En vez de aflojar la seguridad de toda la aplicación, se declara **otro `SecurityFilterChain`** que solo atienda esas rutas:

```java
@Bean
@Order(1)
public SecurityFilterChain h2SecurityFilterChain(HttpSecurity http) throws Exception {
    http
        .securityMatcher("/h2-console/**")
        .authorizeHttpRequests(auth -> auth
            .anyRequest().permitAll()
        )
        .csrf(csrf -> csrf
            .ignoringRequestMatchers("/h2-console/**")
        )
        .headers(headers -> headers
            .frameOptions(frameOptions -> frameOptions.sameOrigin())
        );
    return http.build();
}
```

- `securityMatcher("/h2-console/**")` limita esta cadena a las rutas de la consola.
- `permitAll()` deja entrar sin el login de la aplicación; H2 pide el suyo.
- `csrf(... ignoringRequestMatchers ...)` apaga el token solo para esas rutas.
- `frameOptions(... sameOrigin())` permite los frames, pero solo desde la misma aplicación.

La cadena de la aplicación es la de antes, con `@Order(2)`:

```java
@Bean
@Order(2)
public SecurityFilterChain appSecurityFilterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/css/**", "/js/**").permitAll()
            .anyRequest().authenticated()
        );
    return http.build();
}
```

`@Order` fija en qué orden se consultan las cadenas: gana **la primera cuyo `securityMatcher` coincide** con el request. La de H2 solo coincide con `/h2-console/**`; la de la aplicación no tiene `securityMatcher`, coincide con todo y por eso va última.

La consola debe estar activa en `application.properties` y solo debe usarse en desarrollo:

```properties
spring.h2.console.enabled=true
```
