# Pruebas de integración

En estas pruebas buscamos ahora sí no simular la capa de repository. Vamos a probar las capas de `Service` + `Repository` verificando siempre información de la base de datos.



# Propiedades para test

Cree un `application.properties` en `/src/test/resources`. Aquí usted define las propiedades para apuntar a su base de datos de pruebas.

```ini
# Base de datos de purebas
spring.jpa.hibernate.ddl-auto=create
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.url=jdbc:postgresql://localhost:5432/db
spring.datasource.username=user
spring.datasource.password=password
spring.datasource.hikari.maximum-pool-size=20
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

# Implementación de prueba de integración

```java
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class CourseServiceIntegrationTest {

    @Autowired
    private CourseService courseService;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    private Professor professor;

    @BeforeEach
    void setup() {
        professor = new Professor();
        professor.setName("Alice Andrew");
        professor = professorRepository.save(professor);
    }

    @Test
    void createCourse_WhenValid_ReturnsSavedCourse() {
        // Arrange
        Course course = new Course();
        course.setName("Computación en Internet II");
        course.setProfessor(professor);

        // Act
        Course savedCourse = courseService.createCourse(course);

        // Assert
        assertNotNull(savedCourse.getId());
        assertEquals("Computación en Internet II", savedCourse.getName());
        assertNotNull(savedCourse.getProfessor());
        assertEquals(professor.getId(), savedCourse.getProfessor().getId());

        // Verificar que realmente está en la BD
        Course foundCourse = courseRepository.findById(savedCourse.getId()).orElse(null);
        assertNotNull(foundCourse);
        assertEquals("Computación en Internet II", foundCourse.getName());
    }

    @AfterEach
    void cleanup() {
        courseRepository.deleteAll();
        professorRepository.deleteAll();
    }

}
```

Puede marcar con @Transactional alguna prueba para que, si sucede un fallo, se haga RollBack.

> [!WARNING]  
> Es importante que al momento de crear las entidades para pruebas, NO use el método `setId()` ya que puede sobreescribir el comportamiento autogenerativo de hibernate

El error esperado es

> [!CAUTION]  
> org.springframework.orm.ObjectOptimisticLockingFailureException: Row was updated or deleted by another transaction (or unsaved-value mapping was incorrect): [your.project.package.entity.ExampleEntity#1]



> [!WARNING]  
> Si en su test, usted requiere almacenar datos, no olvide guardarlos. Si por alguna razón, sea porque lo olvidó o sea porque el método de almacenamiento de service nunca invoca al método `save()` del `Repository`, le saldrá un error.

El error esperado es
> [!CAUTION]  
> org.springframework.dao.InvalidDataAccessApiUsageException: org.hibernate.TransientObjectException: persistent instance references an unsaved transient instance of 'co.edu.icesi.introspringboot2.entity.Professor' (save the transient instance before flushing)



# Tests para entrenar

Vamos a entrenarnos en hacer algunos test donde probaremos el funcionamiento en conjunto de la capa `Service` + `Repository`.

Para cada uno de los siguientes test, nombre apropiadamente el método de test y haga que pase, desarrollando la funcionalidad.



### A. Crear un curso repetido

Crear 2 cursos iguales. Intentar almacenarlos y asegurarse de que falle la segunda inserción.

```
saveCourse_WhenCourseAlreadyExists_ShouldThrowException
```

### B. Obtener la lista de estudiantes inscritos en un curso

Crear un curso y varios estudiantes.

Inscribir los estudiantes en el curso.

Recuperar la lista de estudiantes inscritos y validar los datos.

```
getEnrolledStudents_WhenCourseHasStudents_ShouldReturnStudentList
```


### C. Inscribir un estudiante en un curso

Crear un Student, un Course y una Enrollment.

Debe testear un método de service que reciba los objetos de estudiante y el curso, para producir el enrollment.

Si no existe el estudiante, se crea.

Si no existe el curso, se crea

Guardar los datos y verificar que la inscripción se refleje correctamente en la base de datos.

```
enrollStudent_WhenStudentAndCourseExist_ShouldSaveEnrollment
```

### C'. Verificar que un estudiante no pueda inscribirse dos veces en el mismo curso

Crear un estudiante y un curso.

Intentar inscribirlo dos veces y validar que se lanza una excepción.


```
enrollStudent_WhenStudentAlreadyEnrolled_ShouldNotDuplicateEnrollment
```

### D. Eliminar un curso y verificar que las inscripciones también se eliminan

Crear un curso con inscripciones.

Eliminar el curso y verificar que las inscripciones asociadas se eliminaron automáticamente (cascada).

```
deleteCourse_WhenCourseHasEnrollments_ShouldCascadeDeleteEnrollments
```


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
