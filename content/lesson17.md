[t] Pruebas de IntegraciÃ³n con Spring Boot

[st] Â¿QuÃ© es una Prueba de IntegraciÃ³n?
A diferencia de las pruebas unitarias, que verifican un componente (una clase) de forma aislada, las pruebas de integraciÃ³n validan la colaboraciÃ³n entre mÃºltiples componentes. En una aplicaciÃ³n Spring Boot, esto tÃ­picamente significa probar que la capa de servicio y la capa de persistencia (repositorios y base de datos) funcionan juntas correctamente.

El objetivo es asegurar que las "tuberÃ­as" entre las diferentes capas de nuestra aplicaciÃ³n estÃ©n bien conectadas.

[st] Base de datos para pruebas
Las pruebas de integraciÃ³n necesitan una base de datos, pero no debemos usar la de producciÃ³n. La soluciÃ³n estÃ¡ndar es H2, una base de datos en memoria que solo existe durante la ejecuciÃ³n de los tests.

Agrega H2 como dependencia de test en tu `pom.xml`. El scope `test` garantiza que H2 nunca llegue al artefacto de producciÃ³n:

[code:xml]
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
[endcode]

Luego crea el archivo `src/test/resources/application.properties`. Spring Boot lo detecta automÃ¡ticamente durante los tests y lo usa en lugar del `application.properties` principal, sin que tengas que agregar ninguna anotaciÃ³n extra:

[code:ini]
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
[endcode]

Con `create-drop`, Hibernate crea el esquema al iniciar el contexto y lo elimina al terminar. Cada ejecuciÃ³n parte de una base de datos vacÃ­a y limpia.

[st] ConfiguraciÃ³n de la Prueba de IntegraciÃ³n
La clase de prueba se configura asÃ­:

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

`@SpringBootTest` le dice a Spring que cargue el contexto completo de la aplicaciÃ³n. Como estamos en el classpath de tests, tomarÃ¡ automÃ¡ticamente el `application.properties` de `src/test/resources` y usarÃ¡ H2 en lugar de la base de datos de producciÃ³n.

`@Autowired` funciona igual que en el cÃ³digo de producciÃ³n: como el contexto de Spring estÃ¡ activo, podemos inyectar cualquier bean.

Una desventaja importante: `@SpringBootTest` levanta todo el contexto de Spring, lo que tarda varios segundos. En la siguiente lecciÃ³n veremos una alternativa que corre en milisegundos.

[st] Gestionando el Estado: `@BeforeEach` y `@AfterEach`
Una regla de oro de las pruebas es que deben ser independientes entre sÃ­. Para lograrlo, preparamos un estado conocido antes de cada prueba y lo limpiamos despuÃ©s.

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
    // Invertir el orden causarÃ­a un error de restricciÃ³n de clave forÃ¡nea.
    courseRepository.deleteAll();
    professorRepository.deleteAll();
}
[endcode]

`@BeforeEach` se ejecuta antes de cada `@Test`. Guarda un profesor limpio en H2 para que cada prueba tenga un punto de partida idÃ©ntico.

`@AfterEach` se ejecuta despuÃ©s de cada `@Test`. El orden de eliminaciÃ³n importa: primero los cursos (que dependen de professor por FK) y luego los profesores.

[st] Caso de Prueba Positivo (Happy Path)
Verifica que el flujo principal funciona correctamente, siguiendo el patrÃ³n AAA (Arrange-Act-Assert).

[code:java]
@Test
void createCourse_WhenValid_ReturnsSavedCourse() {
    // Arrange
    Course course = new Course();
    course.setName("ComputaciÃ³n en Internet II");
    course.setProfessor(professor);

    // Act
    Course savedCourse = courseService.createCourse(course);

    // Assert
    assertNotNull(savedCourse.getId());
    assertEquals("ComputaciÃ³n en Internet II", savedCourse.getName());
    assertEquals(professor.getId(), savedCourse.getProfessor().getId());

    // VerificaciÃ³n directa en la BD â€” la verdadera prueba de integraciÃ³n
    Course foundCourse = courseRepository.findById(savedCourse.getId()).orElse(null);
    assertNotNull(foundCourse);
    assertEquals("ComputaciÃ³n en Internet II", foundCourse.getName());
}
[endcode]

La verificaciÃ³n final es el corazÃ³n de la prueba de integraciÃ³n: usamos `courseRepository` para leer directamente desde H2 y confirmar que la integraciÃ³n entre el servicio y la persistencia funcionÃ³ de principio a fin.

[st] Prueba Negativa
Verifica que la aplicaciÃ³n maneja correctamente entradas invÃ¡lidas.

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

`assertThrows()` ejecuta el lambda y el test pasa solo si se lanza la excepciÃ³n del tipo esperado. Esto asume que `CourseService` valida que el nombre no sea nulo.

[st] Retos
Realice los siguientes tests de integraciÃ³n. Se darÃ¡ cuenta de que no cuenta con la lÃ³gica necesaria en el servicio. Puede usar TDD: escriba primero el test, luego programe la lÃ³gica que lo haga pasar y refactorice.

`findStudentByCode_WhenStudentExist_ShouldReturnOptionalStudent`

`findStudentByCode_WhenStudentDoesNotExist_ShouldThrowRuntimeException`


`getStudentsByCourseName_WhenCalled_ShouldReturnStudentList`

`getStudentsByCourseName_WhenCourseDoesNotExist_ShouldThrowRuntimeException`


`deleteStudentByCode_WhenStudentExists_ShouldCompleteWithoutThrowingException`

`deleteStudentByCode_WhenStudentDoesNotExists_ShouldThrowRuntimeException`

En la siguiente lecciÃ³n implementarÃ¡s estos mismos seis tests con una tÃ©cnica diferente que no requiere base de datos ni contexto de Spring. Compara cuÃ¡nto tarda cada suite.
