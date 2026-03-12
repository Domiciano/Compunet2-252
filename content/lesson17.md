[t] Pruebas de Integración con Spring Boot

[st] ¿Qué es una Prueba de Integración?
A diferencia de las pruebas unitarias, que verifican un componente (una clase) de forma aislada, las pruebas de integración validan la colaboración entre múltiples componentes. En una aplicación Spring Boot, esto típicamente significa probar que la capa de servicio y la capa de persistencia (repositorios y base de datos) funcionan juntas correctamente.

El objetivo es asegurar que las "tuberías" entre las diferentes capas de nuestra aplicación estén bien conectadas.


[st] Configuración de la Prueba de Integración
La clase de prueba se configura así:

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
}
[endcode]

`@SpringBootTest` le dice a Spring que cargue el contexto completo de la aplicación, incluyendo la configuración, los servicios, los repositorios y la conexión a la base de datos H2.

`@Autowired` funciona igual que en el código de producción: como el contexto de Spring está activo, podemos inyectar cualquier bean.

Una desventaja importante: `@SpringBootTest` levanta todo el contexto de Spring, lo que tarda varios segundos. En la siguiente lección veremos una alternativa que corre en milisegundos.

[st] Gestionando el Estado: `@BeforeEach` y `@AfterEach`
Una regla de oro de las pruebas es que deben ser independientes entre sí. Para lograrlo, preparamos un estado conocido antes de cada prueba y lo limpiamos después.

[code:java]
@BeforeEach
void setup() {
    professor = new Professor();
    professor.setName("Alice Andrew");
    professor = professorRepository.save(professor);
}

@AfterEach
void cleanup() {
    // Primero los cursos (tienen FK a professor), luego los profesores.
    // Invertir el orden causaría un error de restricción de clave foránea.
    courseRepository.deleteAll();
    professorRepository.deleteAll();
}
[endcode]

`@BeforeEach` se ejecuta antes de cada `@Test`. Guarda un profesor limpio en H2 para que cada prueba tenga un punto de partida idéntico.

`@AfterEach` se ejecuta después de cada `@Test`. El orden de eliminación importa: primero los cursos (que dependen de professor por FK) y luego los profesores.

[st] Caso de Prueba Positivo (Happy Path)
Verifica que el flujo principal funciona correctamente, siguiendo el patrón AAA (Arrange-Act-Assert).

[code:java]
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
    assertEquals(professor.getId(), savedCourse.getProfessor().getId());

    // Verificación directa en la BD — la verdadera prueba de integración
    Course foundCourse = courseRepository.findById(savedCourse.getId()).orElse(null);
    assertNotNull(foundCourse);
    assertEquals("Computación en Internet II", foundCourse.getName());
}
[endcode]

La verificación final es el corazón de la prueba de integración: usamos `courseRepository` para leer directamente desde H2 y confirmar que la integración entre el servicio y la persistencia funcionó de principio a fin.

[st] Prueba Negativa
Verifica que la aplicación maneja correctamente entradas inválidas.

[code:java]
@Test
void createCourse_WhenNameIsNull_ThrowsException() {
    // Arrange
    Course course = new Course();
    course.setName(null);
    course.setProfessor(professor);

    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> {
        courseService.createCourse(course);
    });
}
[endcode]

`assertThrows()` ejecuta el lambda y el test pasa solo si se lanza la excepción del tipo esperado. Esto asume que `CourseService` valida que el nombre no sea nulo.

[st] Retos
Realice los siguientes tests de integración. Se dará cuenta de que no cuenta con la lógica necesaria en el servicio. Puede usar TDD: escriba primero el test, luego programe la lógica que lo haga pasar y refactorice.

`findStudentByCode_WhenStudentExist_ShouldReturnOptionalStudent`

`findStudentByCode_WhenStudentDoesNotExist_ShouldThrowRuntimeException`


`getStudentsByCourseName_WhenCalled_ShouldReturnStudentList`

`getStudentsByCourseName_WhenCourseDoesNotExist_ShouldThrowRuntimeException`


`deleteStudentByCode_WhenStudentExists_ShouldCompleteWithoutThrowingException`

`deleteStudentByCode_WhenStudentDoesNotExists_ShouldThrowRuntimeException`

En la siguiente lección implementarás estos mismos seis tests con una técnica diferente que no requiere base de datos ni contexto de Spring. Compara cuánto tarda cada suite.

