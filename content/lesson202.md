# Integrando CSS y JavaScript

<!-- tags: th:href, th:src, @{...}, archivos estáticos, static/css, static/js, script defer, CSS no carga, JavaScript no hace nada, 404 en styles.css, src/main/resources/static -->

Para que tus plantillas no solo sean dinámicas sino también atractivas, necesitas aplicar estilos CSS y, opcionalmente, añadir interactividad con JavaScript.

## Paso 1 · Organizar los archivos estáticos

Por convención, Spring Boot sirve archivos estáticos desde el directorio `src/main/resources/static`. Es una buena práctica crear subdirectorios para organizar tus recursos:

- `src/main/resources/static/css` para tus hojas de estilo.
- `src/main/resources/static/js` para tus archivos de JavaScript.
- `src/main/resources/static/images` para imágenes.

## Paso 2 · Enlazar el CSS en la plantilla HTML

Para enlazar tu hoja de estilo (por ejemplo, `styles.css`) en tu plantilla de Thymeleaf, usa la etiqueta `<link>` en el `<head>` del HTML. Es crucial usar `th:href` con la sintaxis `@{...}` para que Spring resuelva la URL correctamente.

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Mi App</title>
    
    <!-- Sintaxis para enlazar un archivo CSS -->
    <link rel="stylesheet" type="text/css" th:href="@{/css/styles.css}">
</head>
<body>
    <!-- El contenido de tu página va aquí -->
</body>
</html>
```

Asegúrate de que el archivo `styles.css` exista en `src/main/resources/static/css/styles.css`. Thymeleaf y Spring Boot se encargarán de que la ruta `/css/styles.css` sea accesible para el navegador.

## Paso 3 · Enlazar JavaScript en la plantilla HTML

JavaScript sigue la misma lógica que el CSS: el archivo vive en `src/main/resources/static/js/` y se enlaza con `th:src` y la sintaxis `@{...}`.

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Mi App</title>
    <link rel="stylesheet" type="text/css" th:href="@{/css/styles.css}">

    <!-- Sintaxis para enlazar un archivo JavaScript -->
    <script th:src="@{/js/app.js}" defer></script>
</head>
<body>
    <h2>Cursos</h2>
    <form th:action="@{/courses/delete}" method="post" class="delete-form">
        <button type="submit">Eliminar curso</button>
    </form>
</body>
</html>
```

Y este sería `src/main/resources/static/js/app.js`, que pide confirmación antes de enviar cualquier formulario de eliminación:

```javascript
document.querySelectorAll(".delete-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
        if (!confirm("¿Seguro que quieres eliminar este registro?")) {
            event.preventDefault();
        }
    });
});
```

El atributo `defer` es importante. Sin él, el navegador ejecuta el script en cuanto lo encuentra en el `<head>`, **antes** de que exista el `<body>`: `querySelectorAll` no encuentra ningún formulario y el script no hace nada, sin mostrar error. Con `defer`, el script se descarga en paralelo y se ejecuta cuando la página ya está construida. La alternativa clásica es poner el `<script>` justo antes de cerrar `</body>`.

Si el script no parece hacer nada, abre las herramientas del navegador (F12). En la pestaña *Network*, un `404` en `app.js` significa que el archivo no está en `static/js/` o que la ruta de `th:src` no coincide. En la pestaña *Console* aparecen los errores del propio JavaScript.
