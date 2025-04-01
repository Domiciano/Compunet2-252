
# Registro de usuarios

Para dar de alta a un usuario, debemos insertar el registro en la tabla `User`.

Para lograrlo, elabore una plantilla `signup.html`con Thymeleaf para dar de alta al usuario.

Defina la ruta `/signup` para permitir a un usuario registrarse.

En Service desarrolle un método de almacenamiento del usario donde **guarde la constraseña hasheada**. No la contraseña legible.

Tenga en cuenta que debería tener entonces `BCryptPasswordEncoder` como `PasswordEncoder`.

```java
@Configuration
public class WebSecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
}
```

`BCrypt` es un algoritmo de hashing. 

Entonces en el service use el bean de PasswordEncoder.


# SecurityFilterChain

Cuando usamos Spring Boot Security, por defecto todas la rutas de la **applicación web** estarán protegidas de modo que solo clientes autenticado podrán hacer request.

Esto lo podemos cambiar por medio de un `SecurityFilterChain`.

```java
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
```

Observe que usamos el método `authorizeHttpRequest` que recibe un lambda. Este nos permite definir qué rutas son públicas (por medio de `permitAll()`) y qué rutas requieren autenticación (por medio de `authenticated()`).

Podemos definir `signup` como ruta publica con `requestMatchers("/signup")`


# Login personalizado

«*No me gusta el login por defecto que me da Spring Security*». Para solucionarlo, cree un plantilla de `login.html`.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .formLogin(login -> login
                .loginPage("/login")
                .defaultSuccessUrl("/home", true)
                .permitAll()
            );
        return http.build();
    }
}
```

En este caso se utiliza `formLogin` que recibe un lambda. Este permite definir la `loginPage`, la `defaultSuccessUrl` y definir si es público por medio de `permitAll`.

En el caso de `defaultSuccessUrl` la bandera en true permite que siempre redirija a `/home` sin importar la ruta a la que inicialmente se dirigía el usuario.

Su login debe tener al menos este form

```html
<form th:action="@{/login}" method="post">
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
```

Note que se nombran las variables `username` y `password`. Además se accede a variables de Request Param como `error` y `logout` en caso de username o password incorrectos y cierre de sesión respectivamente.

# Manejar el logout

El logout se maneja por defecto desde Spring Security. 

```java
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            );
        return http.build();
    }
}
```


Note que una vez que hacemos logout, enviamos al usuario a `login?logout`. En este caso `logout` es una Query Param llamada `logout` cuyo valor es `true`, es una variable boolean.


# Permisos

Para usar los permisos, primero hagámos usemos los roles del usuario.


Nuestro objetivo será resolver el método `getAuthorities()` de nuestra implementación de `CustomUserDetail`.

Recordemos que de momento se ve así

```java
@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of();
}
```


De modo que debemos trabajar en obtener los roles del usuario


A nuestro usuario agreguemos la relación *muchos a muchos* usando `@ManyToMany` ya que no la hemos usado tanto.

```java
@Entity
public class User {
    
    ...

    @ManyToMany(fetch = FetchType.EAGER) 
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles; 

    // Getters y setters
}
```

Luego definamos la tabla `Role`

```java
@Entity
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;

    // Getters y setters
}
```

Note que usamos un `fetch = FetchType.EAGER` para que al momento de obtener el usuario también obtengamos el rol y viceversa.


# Información de prueba

Vamos a insertar 2 usuarios con contraseña `123456` usando `BCrypt`.

```sql
-- Insertar usuarios
INSERT INTO users (id, email, password)
VALUES (1, 'estudiante@gmail.com', '$2a$12$LE5wWF2zJKLfE98E4KgJPO.buVfS0xHlSg2F2ciQMnk5kdgEBx506'),
       (2, 'profesor@gmail.com', '$2a$12$LE5wWF2zJKLfE98E4KgJPO.buVfS0xHlSg2F2ciQMnk5kdgEBx506');;

-- Insertar roles
INSERT INTO roles (id, name)
VALUES (1, 'ROLE_STUDENT'),
       (2, 'ROLE_PROFESSOR');

-- Definir relaciones
INSERT INTO user_roles (user_id, role_id)
VALUES (1, 1),
       (2, 2);


-- Configurar secuencia
SELECT setval('users_seq', (SELECT MAX(id) FROM users));
SELECT setval('roles_seq', (SELECT MAX(id) FROM roles));
```

Luego asignamos los al usuario estudiante@gmail.com el rol estudiante y a profesor@gmail.com el rol de profesor.



# Resolviendo el GrantedAuthorities

Una vez con todo, ya estamos listos para crear los Auhtorities de acuerdo al `role`.

```java
@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    return user.getRoles().stream()
        .map(role -> new SimpleGrantedAuthority(role.getName()))
        .collect(Collectors.toList());
}
```


# Usando el rol

Usaremos el `SecurityFilterChain` para permitir a ciertos usuarios usar su rol para poder ver una página o la otra.

```java
    .authorizeHttpRequests(auth -> auth
        .requestMatchers("/course").hasAnyRole("STUDENT") 
        .requestMatchers("/student").hasAnyRole("PROFESSOR") 
        .anyRequest().authenticated()
)
```


# Reto

Modifique registro para que también pueda asignar un rol al momento del registro.
