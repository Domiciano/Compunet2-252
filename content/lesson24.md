# Registro de usuarios

<!-- tags: signup, registro de usuarios, BCryptPasswordEncoder, PasswordEncoder, contraseña hasheada, requestMatchers, permitAll, consola H2, Authentication, @AuthenticationPrincipal, SecurityContextHolder, ruta de registro bloqueada, redirige al login al registrarse -->

La autenticación es el proceso mediante el cual el sistema verifica la identidad de un usuario, servicio o dispositivo, normalmente a través de credenciales como contraseñas, tokens, certificados o datos biométricos, asegurándose de que quien intenta acceder es realmente quien dice ser. 

La autorización, en cambio, ocurre después de la autenticación y consiste en determinar qué acciones, recursos o información tiene permitido usar ese usuario dentro del sistema, según los roles, permisos o políticas asignadas. En conjunto, autenticación responde a la pregunta “¿quién sos?”, mientras que autorización responde a “¿qué podés hacer?”.

## Permitiendo el registro público

Con lo que ya sabe del `SecurityFilterChain`, la ruta de registro debe ser pública: nadie puede iniciar sesión para registrarse si todavía no tiene cuenta. Agregue la regla **antes** de `anyRequest()`.

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/public/**", "/signup").permitAll()
    .anyRequest().authenticated()
)
```

Una vez conseguido, almacene el usuario, pero con contraseña hasheada.

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
