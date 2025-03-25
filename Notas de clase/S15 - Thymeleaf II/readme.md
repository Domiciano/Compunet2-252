
# Thymeleaf

Entendiendos las etiquetas de directivas, nuestro objetivo ahora es más cosmético. 

¿Cómo le ponemos CSS a nuestras páginas?, ¿Y si quiero un JS?

Almacene los recursos en la carpeta

```
src/main/resources/static/
```

Dentro de esta carpeta puede construir una carpeta `css` y una carpeta `js`.


# Stylesheets

Para invocar el **CSS** use la etiqueta `th:href`

```html
<head>
    <link rel="stylesheet" th:href="@{/css/styles.css}">
</head>
```


# Javascript

Para invocar un script de **Javascript** debe usar

```html
<body>
    <h1>Hola Thymeleaf</h1>

    <script th:src="@{/js/script.js}"></script>
</body>
```

# Parametrizando valores en URL

En Spring Boot, @PathVariable y @RequestParam se utilizan para manejar datos enviados en las peticiones HTTP.

@PathVariable se usa para extraer valores de la URL.

@RequestParam se usa para capturar los parámetros enviados en la consulta (query parameters).

### Path Variable

```java
@RestController
@RequestMapping("/products")
public class ProductController {
    
    @GetMapping("/detail/{id}")
    public String obtenerProducto(@PathVariable("id") int productId) {
        return "Producto con ID: " + productoId;
    }
}
```

Donde `{id}` en la URL representa un valor dinámico.

`@PathVariable("id")` extrae el valor y lo asigna a `productId`.

Un ejemplo de URL

```
GET /products/detail/10
```

Donde el valor `10` se inyecta en la variable `productId`


### Request Param

```java
@RestController
@RequestMapping("/products")
public class ProductController {
    
    @GetMapping("/search")
    public String searchProduct(@RequestParam("name") String name) {
        return "Buscando producto: " + name;
    }
}
```

Un ejemplo de URL es

```
GET /products/search?name=telefono
```

En este caso el valor `telefono` se inyecta en la variable `name`

# Competencia

Vamos a batirnos en un duelo de implementación. Recibirán tareas y deberán realizar la implementación.

Por tarea, se escogerán los 3 primeros estudiantes que levanten la mano. Se evaluará el desarrollo de cada tarea y posteriormente se otorgarán los puntos: 3 a la mejor implementación, 2 al siguiente y 1 al siguiente.

Se evulará que cumpla con la tarea y sumará cada detalle que le haya puesto. Sea gráfico o no. 


### Instrucciones de participación

1. Levanta la mano solo cuando estés listo para la revisión.
2. Los primeros 3 en alzar la mano serán revisados en vivo.
3. Si pides revisión, asegúrate de que tu aplicación es accesible desde LAN.

```
http://<IP>:8080/url/a/revisar
```


🎯 Una pantalla donde se vea la lista del estudiantes. Los elementos de lista son clickeables y al dar click puedo acceder al detalle del estudiante donde puedo ver todos los datos del estudiante (nombre, código, programa) al que se le da click.

🎯 Agregue a la pantalla anterior la lista de materias de ese estudiante.

🎯 Una pantalla con la lista de materias. Los elementos son clickeables y al acceder a la materia, veo los estudiantes matriculados en esa materia y el profesor que la dicta.

🎯 Agregue a la pantalla anterior un enlace en donde se muestra al profesor que al darle click, acceda a una pantalla de detalle del profesor donde muestra los cursos que tiene a su cargo.

🎯 Una pantalla de matrícula, donde el usuario pueda elegir el estudiante y la materia para crear la matrícula.








