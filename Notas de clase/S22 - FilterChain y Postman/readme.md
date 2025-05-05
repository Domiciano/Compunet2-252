# Proceso de filtrado avanzado

Suponga que usted tiene un misma aplicación de Springboot que soporta cierto segmento de rutas usando @Controller y otro segmento de rutas usando @RestController. Es decir una parte Stateful y otra Stateless.

### ¿Le suena conocida esta situación?

Lo que debemos hacer es generar un par de FilterChain, ordenarlos y posteriormente ajustar las reglas para evitar solapamientos.


En primer lugar, usando `Order(1)` secuenciamos el FilterChain para que sea el primero que actúe en una solicitud

```java
    @Bean
    @Order(1)
    public SecurityFilterChain jwtSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/**")
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        auth -> auth
                                .requestMatchers("/api/v1/auth/**").permitAll()
                                .requestMatchers("/api/v1/**").authenticated()
                );
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
```

En segundo lugar, usando `Order(2)` secuenciamos el segundo FilterChain para atender a las solicitudes Stateful.

```java
    @Bean
    @Order(2)
    public SecurityFilterChain mvcSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/**")
                .authorizeHttpRequests(
                        auth -> auth
                                .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()
                                .requestMatchers("/signup").permitAll()
                                .requestMatchers("/course", "/home", "/student").authenticated()
                ).formLogin(login -> login
                        .loginPage("/login")
                        .defaultSuccessUrl("/home", true)
                        .permitAll()
                ).logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll()
                );
        return http.build();
    }
```


*Con esto haría falta manejar el 404 Not Found*

### Observemos ciertos elementos importantes


```java
.securityMatcher("/api/**")
```

Nos permite escoger el segmento de URL para el cual nuestro SecurityFilterChain hará las validaciones

En el caso de la raíz (que es atendida de forma stateful) lo hacemos asi

```java
.securityMatcher("/**")
```

### Manejo de excepciones

También puede por ejemplo manejar excepciones en el API de modo que responda antes

- 401 Unauthorized. En caso de hacer una solicitud sin presentar de forma correcta el header de Authentication
- 403 Forbidden. En caso intentar querer obtener un recurso y no tener los auhtorities necesarios.

```java
.exceptionHandling(eh -> eh
    .authenticationEntryPoint((request, response, authException) -> {
        response.setStatus(401);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Authentication is required to access this resource\"}");
    })
    .accessDeniedHandler((request, response, accessDeniedException) -> {
        response.setStatus(403);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"You don't have permission to access this resource\"}");
    })
);
```


Por la parte de Stateful también podemos crear `exceptionHandling`

```java
.exceptionHandling(eh -> eh
    .authenticationEntryPoint((request, response, authException) -> {
        // Redirige al login si no está autenticado
        response.sendRedirect("/login");
    })
    .accessDeniedHandler((request, response, accessDeniedException) -> {
        // Redirige a una página de acceso denegado
        response.sendRedirect("/denied");
    })
);
```




# Postman Collection Runner


Usted puede verificar el status HTTP de una response

```js
pm.test("200 OK", function () {
    pm.response.to.have.status(200);
});

```


También puede verificar la presencia de cualquier variable

```js
pm.test("Has access token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
});

```

Puede también verificar si recibe un arreglo

```js
pm.test("Got an array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("array").that.is.not.empty;
});
```


Verificar que una propiedad no venga ni nula ni vacía

```js
pm.test("'name' is valid", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.name).to.not.be.null;
    pm.expect(jsonData.name).to.not.eql("");
});
```

O verificar si es un objeto la respuesta

```java
pm.test("Got an object", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
});
```
