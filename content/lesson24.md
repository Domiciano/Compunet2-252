# Registro de usuarios

<!-- tags: signup, registro de usuarios, BCryptPasswordEncoder, PasswordEncoder, contraseña hasheada, requestMatchers, permitAll, consola H2, Authentication, @AuthenticationPrincipal, SecurityContextHolder, ruta de registro bloqueada, redirige al login al registrarse -->

La autenticación es el proceso mediante el cual el sistema verifica la identidad de un usuario, servicio o dispositivo, normalmente a través de credenciales como contraseñas, tokens, certificados o datos biométricos, asegurándose de que quien intenta acceder es realmente quien dice ser. 

La autorización, en cambio, ocurre después de la autenticación y consiste en determinar qué acciones, recursos o información tiene permitido usar ese usuario dentro del sistema, según los roles, permisos o políticas asignadas. En conjunto, autenticación responde a la pregunta “¿quién sos?”, mientras que autorización responde a “¿qué podés hacer?”.

## El controller del registro

Registrar a alguien son dos requests: un `GET` que muestra el formulario y un `POST` que lo recibe y guarda al usuario. Se agregan al `AuthController` que ya sirve el login:

```java
@Controller
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/signup")
    public String signup() {
        return "auth/signup";
    }

    @PostMapping("/register")
    public String register(@RequestParam String email, @RequestParam String password) {
        userService.register(email, password);
        return "redirect:/auth/login";
    }
}
```

Tras guardar, `redirect:/auth/login` lleva al usuario al login para que entre con su cuenta nueva.

## La plantilla

`templates/auth/signup.html` solo necesita un formulario cuyos campos se llamen igual que los parámetros del controller:

```html
<form th:action="@{/auth/register}" method="post">
    <input type="text" name="email">
    <input type="password" name="password">
    <button type="submit">Registrarse</button>
</form>
```

Como en el login, `th:action` agrega el token CSRF; sin él, el `POST` responde `403`.

## El servicio guarda la contraseña hasheada

El método `register` nunca guarda la contraseña legible: la pasa por el `PasswordEncoder` antes de persistir.

```java
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(String email, String password) {
        User user = new User();
        user.setEmail(email);
        user.setPass(passwordEncoder.encode(password));
        userRepository.save(user);
    }
}
```

## Permitiendo el registro público

Nadie puede iniciar sesión para registrarse si todavía no tiene cuenta, así que las dos rutas deben ser públicas. Agregue la regla **antes** de `anyRequest()`:

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/css/**", "/js/**").permitAll()
    .requestMatchers("/auth/signup", "/auth/register").permitAll()
    .anyRequest().authenticated()
)
```

Si olvida `/auth/register`, el formulario se muestra pero al enviarlo Spring redirige al login.

## Varias cadenas

Recuerde que la consola de H2 tiene su propio `SecurityFilterChain` con `@Order(1)`, visto en la lección de configuración de la seguridad. La cadena de la aplicación, con las reglas de registro y su `formLogin` personalizado, es la `@Order(2)`.

## Información de prueba

Vamos a actualizar los 2 usuarios con contraseña `123456` usando `BCrypt`.

```sql
-- Insertar usuarios
INSERT INTO users (id, email, password)
VALUES (estudiante@gmail.com', '$2a$12$LE5wWF2zJKLfE98E4KgJPO.buVfS0xHlSg2F2ciQMnk5kdgEBx506'),
       ('profesor@gmail.com', '$2a$12$LE5wWF2zJKLfE98E4KgJPO.buVfS0xHlSg2F2ciQMnk5kdgEBx506');
```

## Acceder a mis propios detalles

Podemos acceder a los detalles del usuario autenticado a través del objeto autentication.

```java
@GetMapping("/profile")
public String profile(Model model, Authentication authentication) {
    // authentication viene inyectado por Spring
    CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
    model.addAttribute("username", user.getUsername());
    model.addAttribute("authorities", user.getAuthorities());
    return "auth/profile";
}
```

A partir de esto, usted puede usar el nombre o authorities para rederizarlo en la aplicación

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Perfil</title>
</head>
<body>
<h1>Perfil del Usuario</h1>
<p>Username: <span th:text="${username}"></span></p>
<p>Authorities:</p>
<ul>
    <li th:each="auth : ${authorities}"
        th:text="${auth.authority}"></li>
</ul>
</body>
</html>
```

Tambien podemos interactuar con los elementos de autenticación por medio de acceso estático

```java
@GetMapping("/profile")
public String profile() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
}
```

O si solo necesito el UserDetails

```java
@GetMapping("/profile")
public String profile(@AuthenticationPrincipal CustomUserDetails user) {
    String username = user.getUsername();
}
```

.
