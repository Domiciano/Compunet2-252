
# Thymeleaf

Thymeleaf es un motor de plantillas para Java que se integra fácilmente con Spring Boot. Es una excelente alternativa a JSP, permitiendo generar vistas dinámicas en aplicaciones web de Spring MVC.


```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

# Plantillas

Almacene las plantillas de Thymeleaf en

```
src/main/resources/templates/
```

Un ejemplo de plantilla de Thymeleaf

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Inicio</title>
</head>
<body>
    <h1 th:text="${message}">Texto de prueba</h1>
</body>
</html>
```

Puede usar la plantilla en la respuesta de un endpoint

```java
package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("message", "Hello desde Computación en Internet 2");
        return "home"; // Aquí renderizamos el archivo home.html en templates
    }
}
```


En el ejemplo, el enpoint tiene una entrada `Model model`. Este objeto, proporcionado por Spring MVC, se usa para enviar datos desde el controlador hacia la vista.



# Server Side Rendering (SRR)

Server-Side Rendering (SSR) es una técnica donde el servidor genera y envía al cliente páginas HTML completamente renderizadas, en lugar de solo datos en formato JSON. En Spring Boot con Thymeleaf, esto significa que las vistas se procesan en el servidor, insertando dinámicamente los datos antes de enviarlos al navegador, lo que mejora la carga inicial y la compatibilidad con navegadores sin JavaScript.

Vamos a verificar cómo cargar datos en las plantillas en Thymeleaf.




# Asignar objeto a plantilla

```java
@GetMapping("/detail")
public String detalleEstudiante(Model model) {
    Student student = new Student();
    student.setName("Juan Pérez");
    student.setCode("20231234");
    student.setProgram("Ingeniería de Sistemas");

    model.addAttribute("student", student);
    return "detail";
}
```


```html
<h2>Información del Estudiante</h2>
<p>Nombre: <span th:text="${estudiante.name}"></span></p>
<p>Código: <span th:text="${estudiante.code}"></span></p>
<p>Programa: <span th:text="${estudiante.program}"></span></p>
```

# Asignar lista a plantilla

```java
@GetMapping("/students")
public String listarEstudiantes(Model model) {
    List<Student> students = new ArrayList<>();
    
    students.add(new Student("Juan Pérez", "20231234", "Ingeniería de Sistemas"));
    students.add(new Student("Ana Gómez", "20231235", "Matemáticas"));
    students.add(new Student("Carlos López", "20231236", "Física"));

    model.addAttribute("studentsList", students); 
    return "studentlist"; // Renderiza lista.html
}
```


```html
<h2>Lista de Estudiantes</h2>
<ul>
    <li th:each="student : ${studentsList}">
        <strong th:text="${student.name}"></strong> - 
        <span th:text="${student.program}"></span>
    </li>
</ul>
```


# Asignar mapa a plantilla


```java
@GetMapping("/students")
public String showStudents(Model model) {
    
    Map<String, Student> studentMap = new HashMap<>();
    studentMap.put("A001", new Student("Juan Pérez", "A001", "Ingeniería de Sistemas"));
    studentMap.put("A002", new Student("Ana Gómez", "A002", "Matemáticas"));
    studentMap.put("A003", new Student("Carlos López", "A003", "Física"));

    model.addAttribute("students", studentMap);

    return "students";
}
```

Podemos renderizarlo así

```html
<tr th:each="entry : ${students}">
    <td th:text="${entry.key}"></td>
    <td th:text="${entry.value.name}"></td>
    <td th:text="${entry.value.program}"></td>
</tr>
```


# Envio de información


> [!WARNING]  
>Si tiene ha agregado datos, no olvide actualizar las secuencias de base de datos en su `data.sql`

```sql
SELECT setval('professors_seq', (SELECT MAX(id) FROM professors));
SELECT setval('students_seq', (SELECT MAX(id) FROM students));
SELECT setval('courses_seq', (SELECT MAX(id) FROM courses));
SELECT setval('enrollments_seq', (SELECT MAX(id) FROM enrollments));
```


Al estar con Thymeleaf, requeriremos hacer inserciones de datos a través de `forms` de HTML.

Por supuesto, debe estar marcado el formulario con las etiquetas especiales de Thymeleaf para poder hacer el envío.

Lo primer que necesita es que su página que renderiza su `form` tenga un objeto del modelo *sin datos*.

```java
@Controller
public class ExampleController {
    
    @PostMapping("/all")
    public String save(@Model ExampleEntity exampleEntity) {
        //Insertamos un modelo vacío
        model.addAttribute("exampleEntity", new Course());
        return "entityList";
    }

}
```


En el `form` de `entityList.html` tiene que usar ese objeto vacío

```html
<form th:action="@{/save}" th:object="${exampleEntity}" method="post">
    
    <label>Nombre:</label>
    <input type="text" th:field="*{attribute1}" required>
    
    <label>Edad:</label>
    <input type="text" th:field="*{attribute2}" required>

    <button type="submit">Enviar</button>

</form>
```


Luego necesitará es un controller para recibir los datos

```java
@Controller
public class ExampleController {
    
    @PostMapping("/save")
    public String guardar(@ModelAttribute ExampleEntity exampleEntity) {
        //Tareas de almacenamiento
        return "result";
    }

}

```


Note que se llama al endpoint por medio de `@{/save}`.

Adicionalmente se debe especificar el objeto con el mismo nombre con el que se recibe en el endpoint. En este caso `exampleEntity`

Posteriomente se especifican los atributos de esa entidad por medio de `*{attr}`


# Etiquetas Thymeleaf

### th:text – Mostrar texto dinámico

```html
<p th:text="${mensaje}">Texto por defecto</p>
```

### th:each – Iterar listas

```html
<ul>
    <li th:each="estudiante : ${estudiantes}" th:text="${estudiante.nombre}"></li>
</ul>
```

### th:if / th:unless – Condiciones

```html
<p th:if="${esAdmin}">Eres administrador</p>
<p th:unless="${esAdmin}">No tienes acceso</p>
```

### th:switch, th:case – Estructura `switch`

```html
<div th:switch="${rol}">
    <p th:case="'admin'">Eres Administrador</p>
    <p th:case="'user'">Eres Usuario</p>
    <p th:case="*">Rol desconocido</p>
</div>

```