# Customizar el login

<!-- tags: formLogin, loginPage, loginProcessingUrl, login personalizado, username y password, usernameParameter, th:action, _csrf, param.error, param.logout, logoutSuccessUrl, el login se queda en bucle, 405 Method Not Allowed, 403 Forbidden al hacer login -->

Cuando agrega Spring Security, el servidor genera por usted una página de login. Funciona, pero es la misma para todas las aplicaciones del mundo. En esta lección cambiamos esa página por la nuestra y vemos qué debe tener la plantilla para que Spring Security la acepte como suya.

## Qué hace el login por defecto

Con `formLogin(Customizer.withDefaults())` Spring Security registra tres cosas a la vez:

- Un `GET /login` que devuelve una página HTML escrita por el propio framework.
- Un `POST /login` que recibe las credenciales y las verifica.
- Un `GET /logout` en forma de confirmación y un `POST /logout` que cierra la sesión.

Personalizar el login significa reemplazar **solo la primera**: la página que se dibuja. El `POST` que verifica las credenciales lo sigue haciendo Spring Security, y por eso nuestra plantilla tiene que hablarle en el idioma que él espera.

```svg
<svg id="clContrato" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 400" width="960" height="400" style="max-width:100%;height:auto;display:block;margin:0 auto" role="img" aria-labelledby="clContrato-ttl clContrato-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="clContrato-ttl">El contrato entre la plantilla y Spring Security</title>
  <desc id="clContrato-dsc">A la izquierda, la plantilla login.html con un formulario que envía por POST los campos username, password y un token csrf oculto. A la derecha, el filtro de Spring Security que lee esos nombres y decide: si las credenciales son válidas redirige a la página de éxito, y si no, vuelve al login con el parámetro error.</desc>
  <defs>
    <style>
      #clContrato .title{fill:#161A26;font-size:22px;font-weight:700}
      #clContrato .sub{fill:#79809A;font-size:13.5px}
      #clContrato .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #clContrato .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #clContrato .ar{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#clContrato-ar)}
      #clContrato .ar-g{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#clContrato-arg)}
      #clContrato .ar-r{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#clContrato-arr)}
    </style>
    <marker id="clContrato-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
    <marker id="clContrato-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
    <marker id="clContrato-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
  </defs>
  <rect width="960" height="400" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="52">El contrato entre la plantilla y Spring Security</text>
  <text class="sub" x="48" y="76">La página es suya; los nombres de los campos y la URL del POST los dicta el framework.</text>
  <rect x="48" y="104" width="360" height="256" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128">LOGIN.HTML · SU PLANTILLA</text>
  <rect x="64" y="144" width="328" height="40" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/>
  <text class="mono" x="78" y="164" dy="0.35em" font-size="12.5" fill="#161A26">&lt;form th:action="@{/auth/login}" method="post"&gt;</text>
  <rect x="64" y="196" width="328" height="34" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="78" y="213" dy="0.35em" font-size="12.5" fill="#161A26">name="username"</text>
  <rect x="64" y="240" width="328" height="34" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="78" y="257" dy="0.35em" font-size="12.5" fill="#161A26">name="password"</text>
  <rect x="64" y="284" width="328" height="34" rx="8" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
  <text class="mono" x="78" y="301" dy="0.35em" font-size="12.5" fill="#161A26">name="_csrf" (lo agrega Thymeleaf)</text>
  <text class="sub" x="64" y="342">POST con las tres cosas a la vez</text>
  <rect x="552" y="104" width="360" height="256" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="568" y="128">SPRING SECURITY · FILTRO DE LOGIN</text>
  <rect x="568" y="144" width="328" height="56" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>
  <text x="732" y="164" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9">Lee username, password y _csrf</text>
  <text x="732" y="184" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61">y compara con el UserDetailsService</text>
  <rect x="568" y="238" width="328" height="44" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/>
  <text class="mono" x="732" y="260" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">válido: redirige a defaultSuccessUrl</text>
  <rect x="568" y="298" width="328" height="44" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/>
  <text class="mono" x="732" y="320" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">inválido: vuelve a /auth/login?error</text>
  <path class="ar" d="M410,172 H550"/>
  <text class="mono" x="480" y="162" text-anchor="middle" font-size="12" fill="#0F8478">POST</text>
</svg>
```

## Paso 1: decirle a Spring dónde está su login

En el `SecurityFilterChain` se reemplaza `Customizer.withDefaults()` por una configuración explícita:

```java
@Bean
@Order(2)
public SecurityFilterChain appSecurityFilterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/public/**", "/signup", "/css/**", "/js/**").permitAll()
            .anyRequest().authenticated()
        )
        .formLogin(login -> login
            .loginPage("/auth/login")
            .defaultSuccessUrl("/home", true)
            .failureUrl("/auth/login?error")
            .permitAll()
        )
        .logout(logout -> logout
            .logoutUrl("/auth/logout")
            .logoutSuccessUrl("/auth/login?logout")
            .permitAll()
        );
    return http.build();
}
```

Qué hace cada línea:

- `loginPage("/auth/login")`: cuando alguien sin sesión pide una ruta protegida, Spring lo redirige aquí en vez de a `/login`.
- `defaultSuccessUrl("/home", true)`: a dónde va después de autenticarse. Con `true` siempre va a `/home`; sin él, vuelve a la ruta que originalmente quería visitar.
- `failureUrl("/auth/login?error")`: a dónde vuelve si las credenciales son incorrectas. Ese `?error` es el que lee la plantilla.
- `permitAll()`: sin esto, la página de login quedaría protegida por la misma regla `anyRequest().authenticated()`, y el usuario nunca podría verla para autenticarse.
- `logoutSuccessUrl("/auth/login?logout")`: tras cerrar sesión, vuelve al login con el parámetro `logout`.

Fíjese también en `/css/**` y `/js/**` dentro de `permitAll`. Si su login usa una hoja de estilos y esa ruta está protegida, el navegador la pedirá sin sesión, recibirá una redirección al login y la página se verá sin estilos.

## Paso 2: un controller que sirva la plantilla

`loginPage` solo declara la URL; **no crea la página**. Spring Security no sabe qué plantilla quiere usted, así que hace falta un controller que responda ese `GET`:

```java
@Controller
@RequestMapping("/auth")
public class AuthController {

    @GetMapping("/login")
    public String login() {
        return "auth/login";
    }
}
```

Si olvida este controller, al abrir `/auth/login` obtiene un 404 aunque la configuración de seguridad esté perfecta.

## Paso 3: la plantilla

Estos son los mínimos que Spring Security exige a la plantilla `templates/auth/login.html`:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Ingresar</title>
    <link rel="stylesheet" th:href="@{/css/login.css}">
</head>
<body>
<form th:action="@{/auth/login}" method="post">
    <h1>Ingresar</h1>

    <label for="username">Correo</label>
    <input type="text" id="username" name="username" required autofocus>

    <label for="password">Contraseña</label>
    <input type="password" id="password" name="password" required>

    <button type="submit">Ingresar</button>

    <div th:if="${param.error}">
        <p style="color: red;">Usuario o contraseña incorrectos</p>
    </div>

    <div th:if="${param.logout}">
        <p style="color: green;">Has cerrado sesión correctamente</p>
    </div>
</form>
</body>
</html>
```

Lo que **no es negociable**:

- **`method="post"`**. El login por GET dejaría la contraseña en la URL y en el historial; Spring Security solo procesa el POST.
- **Una acción que apunte a la misma URL de `loginPage`**. Por defecto, la URL que procesa el login (`loginProcessingUrl`) es la misma que `loginPage`. Si su formulario envía a otra ruta, el POST cae en un controller que no existe: obtiene un 404 o un 405.
- **Los campos se llaman exactamente `username` y `password`**. Aunque en su dominio el usuario se identifique por correo, el `name` del input sigue siendo `username`. Si usa `name="email"`, Spring recibirá el usuario vacío y todo intento fallará con `?error`.
- **El token CSRF**. Con `th:action`, Thymeleaf agrega solo un `<input type="hidden" name="_csrf" ...>`. Si usa `action="..."` a secas, el token no viaja y el servidor responde `403 Forbidden`. Es el error más frecuente al copiar un HTML de una plantilla de internet.

Lo que **sí es opcional**: el CSS, el diseño, el texto de los mensajes y la forma de mostrar `param.error` y `param.logout`. Esos dos parámetros aparecen en la URL gracias a `failureUrl` y `logoutSuccessUrl`; si usted cambia esas URL, cambie también lo que lee la plantilla.

## Si quiere otros nombres de campo

Si por alguna razón su formulario ya existe con `email` y `clave`, no hay que reescribirlo: se le dice a Spring cómo se llaman.

```java
.formLogin(login -> login
    .loginPage("/auth/login")
    .usernameParameter("email")
    .passwordParameter("clave")
    .permitAll()
)
```

Aun así, recuerde que el valor que llegue como "username" es lo que `UserDetailsService.loadUserByUsername(...)` recibirá; si buscaba por correo, ese método debe consultar por correo.

## Cerrar sesión desde la plantilla

Con CSRF activo, cerrar sesión también es un `POST`. Un enlace `<a href="/auth/logout">` no sirve: debe ser un formulario.

```html
<form th:action="@{/auth/logout}" method="post">
    <button type="submit">Cerrar sesión</button>
</form>
```

## Errores típicos y cómo leerlos

- **El login se queda en bucle** (vuelve siempre al login, sin mensaje): falta `permitAll()` en `formLogin`, o la URL de `loginPage` está bloqueada por `anyRequest().authenticated()`.
- **404 al abrir `/auth/login`**: falta el controller del paso 2 o el nombre de la plantilla no coincide.
- **403 Forbidden al enviar el formulario**: falta el token CSRF; revise que use `th:action`.
- **405 Method Not Allowed**: el formulario envía a una URL distinta de `loginPage` o el método no es `post`.
- **Siempre aparece `?error` con credenciales correctas**: los `name` de los inputs no son `username` y `password`, o la contraseña de la base de datos no está hasheada con el `PasswordEncoder` configurado.

## Ejercicio

1. Reemplace el login por defecto por el suyo, con su propio CSS.
2. Muestre el mensaje de error y el de cierre de sesión.
3. Provoque a propósito cada uno de los errores de la lista anterior (cambie un `name`, quite `th:action`, quite `permitAll()`) y compruebe que obtiene lo que describe la lección.
