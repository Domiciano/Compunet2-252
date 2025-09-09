[t] Pruebas de Integración con Spring Boot
[st] ¿Qué es una Prueba de Integración?
A diferencia de las pruebas unitarias, que verifican un componente (una clase) de forma aislada, las pruebas de integración validan la colaboración entre múltiples componentes. En una aplicación Spring Boot, esto típicamente significa probar que la capa de controladores, la capa de servicio y la capa de persistencia (repositorios y base de datos) funcionan juntas correctamente.

El objetivo es asegurar que las "tuberías" entre las diferentes capas de nuestra aplicación estén bien conectadas. Para esto, Spring Boot nos ofrece un potente módulo de pruebas.

[st] Configuración de la Prueba de Integración
Vamos a crear una prueba de integración para nuestro `CourseService`. La clase de prueba se verá así. Analicemos sus partes clave.

[code:java]
package com.example.myapp.services;

import com.example.myapp.model.Course;
import com.example.myapp.model.Professor;
import com.example.myapp.repository.CourseRepository;
import com.example.myapp.repository.ProfessorRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class CourseServiceIntegrationTest {

    @Autowired
    private CourseService courseService;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    private Professor professor;
    
    // ... métodos de prueba y configuración
}
[endcode]

`@SpringBootTest`: Esta es la anotación central. Le dice a Spring que cargue el contexto completo de la aplicación, incluyendo la configuración, los controladores, los servicios, los repositorios y la conexión a la base de datos.
`@Autowired`: Como el contexto de la aplicación está cargado, podemos inyectar cualquier bean que necesitemos, igual que lo haríamos en el código de la aplicación.

[st] Gestionando el Estado: `@BeforeEach` y `@AfterEach`
Una regla de oro de las pruebas es que deben ser independientes. Para lograrlo, preparamos un estado conocido antes de cada prueba y lo limpiamos después.

[code:java]
//... dentro de CourseServiceIntegrationTest

@BeforeEach
void setup() {
    professor = new Professor();
    professor.setName("Alice Andrew");
    professor = professorRepository.save(professor);
}

@AfterEach
void cleanup() {
    courseRepository.deleteAll();
    professorRepository.deleteAll();
}
[endcode]

`@BeforeEach`: Este método se ejecuta antes de cada método de prueba (`@Test`). Lo usamos para crear y guardar un profesor. Esto nos asegura que cada prueba comienza con un profesor limpio en la base de datos con el que podemos trabajar.

`@AfterEach`: Este método se ejecuta después de cada método de prueba. Lo usamos para borrar todos los datos de las tablas involucradas. Esto garantiza que el estado de una prueba no "ensucie" la siguiente.

[st] Escribiendo el Caso de Prueba Positivo (Happy Path)
Este test verifica que el flujo principal funciona como se espera, siguiendo el patrón AAA (Arrange-Act-Assert)

[code:java]
//... dentro de CourseServiceIntegrationTest

@Test
void createCourse_WhenValid_ReturnsSavedCourse() {
    // Arrange: Preparar los datos de entrada
    Course course = new Course();
    course.setName("Computación en Internet II");
    course.setProfessor(professor); // Usamos el profesor creado en setup()

    // Act: Ejecutar la lógica que queremos probar
    Course savedCourse = courseService.createCourse(course);

    // Assert: Verificar que el resultado es el esperado
    assertNotNull(savedCourse.getId());
    assertEquals("Computación en Internet II", savedCourse.getName());
    assertEquals(professor.getId(), savedCourse.getProfessor().getId());

    // Verificación final en la BD: La verdadera prueba de integración
    Course foundCourse = courseRepository.findById(savedCourse.getId()).orElse(null);
    assertNotNull(foundCourse);
    assertEquals("Computación en Internet II", foundCourse.getName());
}
[endcode]

El paso crucial aquí es la verificación final. Usamos el `courseRepository` para buscar directamente en la base de datos, confirmando que la integración entre el servicio y la capa de persistencia funcionó.

[st] Añadiendo una Prueba Negativa
Una prueba negativa verifica que nuestra aplicación maneja correctamente los datos incorrectos o las situaciones de error.

[code:java]
//... dentro de CourseServiceIntegrationTest

@Test
void createCourse_WhenNameIsNull_ThrowsException() {
    // Arrange: Preparar datos inválidos
    Course course = new Course();
    course.setName(null); // Nombre nulo
    course.setProfessor(professor);

    // Act & Assert: Verificar que se lanza la excepción esperada
    assertThrows(IllegalArgumentException.class, () -> {
        courseService.createCourse(course);
    });
}
[endcode]

Aquí, el método `assertThrows()` de JUnit 5 se encarga de la magia. Ejecuta el código que le pasamos y el test pasa solo si se lanza una excepción del tipo que esperamos (`IllegalArgumentException.class`). Esto asume que hemos codificado nuestro `CourseService` para que valide sus entradas.

[st] Retos
Realice los siguientes tests

`saveCourse_WhenCourseAlreadyExists_ShouldThrowException` test negativo en el que se debe lanzar excepción si se intenta guardar un curso que ya existe. La regla es que no pueden haber dos cursos con el mismo nombre

`enrollStudent_WhenValid_ReturnsSavedEnrollment` test positivo en el que usted debe poder matricular un estudiante en un curso

`enrollStudent_WhenStudentDoesNotExist_ThrowsException` test negativo cuando el enrollment se intenta hacer con un estudiante que no existe

`enrollStudent_WhenCourseDoesNotExist_ThrowsException` test negativo cuando el enrollment se intenta hacer con un curso que no existe

`enrollStudent_WhenAlreadyEnrolled_ThrowsException` test negativo cuando el estudiante ya se encuentra matriculado en el curso

Se dará cuenta que no cuenta con la lógica necesaria. Puede usar TDD, de modo que escriba primero los test, luego programe la lógica que necesita para pasar el test y refactorice.