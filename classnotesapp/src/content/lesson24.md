[t] Autenticación y Autorización
La autenticación es el proceso mediante el cual el sistema verifica la identidad de un usuario, servicio o dispositivo, normalmente a través de credenciales como contraseñas, tokens, certificados o datos biométricos, asegurándose de que quien intenta acceder es realmente quien dice ser. 

La autorización, en cambio, ocurre después de la autenticación y consiste en determinar qué acciones, recursos o información tiene permitido usar ese usuario dentro del sistema, según los roles, permisos o políticas asignadas. En conjunto, autenticación responde a la pregunta “¿quién sos?”, mientras que autorización responde a “¿qué podés hacer?”.

[st] Registro de usuarios
Para dar de alta a un usuario, debemos insertar el registro en la tabla `User`. Para lograrlo, grosso modo, hay que elaborar una plantilla `signup.html`con Thymeleaf para dar de alta al usuario. Luego, definir la ruta `/signup` como pública para permitir a un usuario registrarse.

En Service desarrolle un método de almacenamiento del usario donde guarde la constraseña hasheada. No la contraseña legible. Vamos entonces a definir un `BCryptPasswordEncoder` como `PasswordEncoder`.
[code:java]
@Configuration
public class WebSecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
}
[endcode]
`BCrypt` es un algoritmo de hashing. 
[st] SecurityFilterChain
Como sabe, cuando usamos Spring Boot Security, por defecto todas la rutas de la applicación web estarán protegidas de modo que solo clientes autenticado podrán hacer request.

Esto lo podemos cambiar por medio de un `SecurityFilterChain`.
[code:java]
@Configuration 
@EnableWebSecurity
public class WebSecurityConfig {
    ...

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(
                auth -> auth
                    .requestMatchers("/public/**").permitAll() 
                    .anyRequest().authenticated() 
            );
            return http.build();
    }
    ...
}
[endcode]

Observe que usamos el método `authorizeHttpRequest` que recibe un lambda. Este nos permite definir qué rutas son públicas (por medio de `permitAll()`) y qué rutas requieren autenticación (por medio de `authenticated()`).

Podemos definir `signup` como ruta publica con `requestMatchers("/signup")`

Adicionalmente si requiere varios securityFilterChain, por ejemplo, uno para la consola H2 y otro para el resto de la aplicación, use los órdenes

[code:java]
@Configuration @EnableWebSecurity
public class WebSecurityConfig {
    @Bean
    @Order(1)
    public SecurityFilterChain h2SecurityFilterChain(HttpSecurity http) throws Exception {
        ...
    }

    @Bean
    @Order(2)
    public SecurityFilterChain appSecurityFilterChain(HttpSecurity http) throws Exception {
        ...
    }
}
[endcode]
En este caso requerimos que todas las rutas que dependen de h2 tengan acceso sin la autenticación propia de la aplicación. Cuando queremos referenciar a un conjunto de request y no a toda la aplicación, podemos usar `requestMatchers`
[code:java]
@Bean
@Order(1)
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .securityMatcher(toH2Console())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(toH2Console()).permitAll()
        )
        .csrf(csrf -> csrf
            .ignoringRequestMatchers(toH2Console())
        )
        .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.sameOrigin())
        );
        return http.build();
}
[endcode]
En este caso `toH2Console()` devuelve la ruta configurada hacia la consola de h2

Finalmente, usted puede ofrecer al usuario un login por defecto usando en la últmo filterchain usando el método .withDefaults().
[code:java]
@Bean
@Order(2)
public SecurityFilterChain appSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(
                    auth -> auth
                                .requestMatchers("/public/**").permitAll()
                                .anyRequest().authenticated()
            ).formLogin(Customizer.withDefaults()); //<--- Quítelo y observe qué pasa
        return http.build();
}
[endcode]

[st] Permitiendo registro público
Ya que conoce lo escencial de las reglas de seguridad, aplique una regla que de acceso libre a su ruta de registro.

Una vez conseguido, almacene el usuario, pero con contraseña hasheada

[st] Información de prueba
Vamos a actualizar los 2 usuarios con contraseña `123456` usando `BCrypt`.
[code:sql]
-- Insertar usuarios
INSERT INTO users (id, email, password)
VALUES (estudiante@gmail.com', '$2a$12$LE5wWF2zJKLfE98E4KgJPO.buVfS0xHlSg2F2ciQMnk5kdgEBx506'),
       ('profesor@gmail.com', '$2a$12$LE5wWF2zJKLfE98E4KgJPO.buVfS0xHlSg2F2ciQMnk5kdgEBx506');
[endcode]

[st] Usando el rol
Usted puede devolver la lista de autorities basado en el rol del usuario
[code:java]
@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    return user.getUserRoles().stream()
        .map(userRole -> new SimpleGrantedAuthority(userRole.getRole().getName()))
        .collect(Collectors.toList());
}
[endcode]
Luego, puede usar una regla especifica de acceso
[code:java]
@Bean
@Order(2)
public SecurityFilterChain appSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(
                        auth -> auth
                                .requestMatchers("/auth/signup", "/auth/register").permitAll()
                                .requestMatchers("/students/**").hasRole("PROFESSOR") //<-- Aqui uso el rol
                                .anyRequest().authenticated()
                ).formLogin(Customizer.withDefaults());
        return http.build();
}
[endcode]
Note que usamos `PROFESSOR` y no `ROLE_PROFESSOR`.
[st] Usando el permiso
Además de los roles, podemos afinar aún más la seguridad usando permisos. Un permiso representa una acción específica (por ejemplo, VIEW_COURSES o EDIT_COURSES) que puede ser asignada a un rol y, por ende, a un usuario.

Para integrarlo en Spring Security, debes mapear los permisos como GrantedAuthority en tu UserDetails personalizado:
[code:java]
@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    return user.getUserRoles().stream()
        .flatMap(userRole -> userRole.getRole().getRolePermissions().stream())
        .map(rolePermission -> new SimpleGrantedAuthority(rolePermission.getPermission().getName()))
        .collect(Collectors.toList());
}
[endcode]
De esta forma, si un profesor tiene el permiso EDIT_COURSES, su GrantedAuthority incluirá "EDIT_COURSES".

Luego puedes usarlo en tu SecurityFilterChain con hasAuthority:
[code:java]
@Bean
@Order(2)
public SecurityFilterChain appSecurityFilterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(
            auth -> auth
                .requestMatchers("/auth/signup", "/auth/register").permitAll()
                .requestMatchers("/courses/").hasAuthority("VIEW_COURSES") //<-- Aquí uso el permiso
                .requestMatchers("/courses/edit/").hasAuthority("EDIT_COURSES")
                .anyRequest().authenticated()
        ).formLogin(Customizer.withDefaults());
    return http.build();
}
[endcode]
Con esto, el acceso ya no depende únicamente del rol general (ej. ROLE_PROFESSOR), sino de las acciones concretas (VIEW_COURSES, EDIT_COURSES, etc.), lo que da un control más granular.
[st] Login personalizado
Si usted piensa "Qué login tan feo el que da springboot", este apartado es para usted. Cree un plantilla de `login.html`.
[code:java]
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain appSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .formLogin(login -> login
                .loginPage("/auth/login")
                .defaultSuccessUrl("/home", true)
                .permitAll()
            );
        return http.build();
    }
}
[endcode]
En este caso se utiliza `formLogin` que recibe un lambda. Este permite definir la `loginPage`, la `defaultSuccessUrl` y definir si es público por medio de `permitAll`.

En el caso de `defaultSuccessUrl` la bandera en true permite que siempre redirija a `/home` sin importar la ruta a la que inicialmente se dirigía el usuario.

Su login debe tener al menos este form
[code:html]
<form th:action="@{/auth/login}" method="post">
    <input type="text" id="username" name="username" required>
    <input type="password" id="password" name="password" required>
    <button type="submit">Ingresar</button>

    <div th:if="${param.error}">
        <p style="color: red;">Usuario o contraseña incorrectos</p>
    </div>

    <div th:if="${param.logout}">
        <p style="color: green;">Has cerrado sesión correctamente</p>
    </div>
</form>
[endcode]

Note que se nombran las variables `username` y `password`. Además se accede a variables de Request Param como `error` y `logout` en caso de username o password incorrectos y cierre de sesión respectivamente.
[st] Manejar el logout
Para hacer el logout podemos hacer un POST request a `/logout`. Podemos configurar que elimine la HTTP Session y la cookie.
[code:java]
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/auth/login?logout")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            );
        return http.build();
    }
}
[endcode]
Note que una vez que hacemos logout, enviamos al usuario a `login?logout`. En este caso `logout` es una Query Param llamada `logout` cuyo valor es `true`, es una variable boolean.