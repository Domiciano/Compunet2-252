# Integrando CSS y JavaScript

<!-- tags: th:href, @{...}, archivos estáticos, static/css, hoja de estilos, CSS no carga, 404 en styles.css, src/main/resources/static -->

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
