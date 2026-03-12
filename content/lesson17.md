[t] Pruebas de Integración con Spring Boot

[st] ¿Qué es una Prueba de Integración?
A diferencia de las pruebas unitarias, que verifican un componente (una clase) de forma aislada, las pruebas de integración validan la colaboración entre múltiples componentes. En una aplicación Spring Boot, esto típicamente significa probar que la capa de servicio y la capa de persistencia (repositorios y base de datos) funcionan juntas correctamente.

El objetivo es asegurar que las "tuberías" entre las diferentes capas de nuestra aplicación estén bien conectadas.

[st] Base de datos para pruebas
Las pruebas de integración necesitan una base de datos, pero no debemos usar la de producción. La solución estándar es H2, una base de datos en memoria que solo existe durante la ejecución de los tests.

Agrega H2 como dependencia de test en tu `pom.xml`. El scope `test` garantiza que H2 nunca llegue al artefacto de producción:

[code:xml]
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
[endcode]

Luego crea el archivo `src/test/resources/application.properties`. Spring Boot lo detecta automáticamente durante los tests y lo usa en lugar del `application.properties` principal, sin que tengas que agregar ninguna anotación extra:

[code:ini]
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.sql.init.mode=never
[endcode]

Con `create-drop`, Hibernate crea el esquema al iniciar el contexto y lo elimina al terminar. Cada ejecución parte de una base de datos vacía y limpia.

[st] El problema con `data.sql`
Si tu proyecto tiene un archivo `src/main/resources/data.sql` con datos iniciales, Spring Boot también lo ejecutará durante los tests. Esto rompe la independencia de las pruebas: cuando tu `@BeforeEach` guarda un profesor, ya existen los datos del `data.sql` en la base de datos, y tus asserts sobre cantidades o estados específicos fallarán de forma impredecible.

La solución es agregar esta propiedad al `src/test/resources/application.properties`:

[code:ini]
spring.sql.init.mode=never
[endcode]

Con esto, Spring Boot ignora completamente el `data.sql` durante los tests. Toda la información que necesita cada prueba se crea en `@BeforeEach` y se elimina en `@AfterEach`, garantizando que cada test parte de un estado limpio y conocido.

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

`@SpringBootTest` le dice a Spring que cargue el contexto completo de la aplicación. Como estamos en el classpath de tests, tomará automáticamente el `application.properties` de `src/test/resources` y usará H2 en lugar de la base de datos de producción.

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
Para cada método de servicio que se muestra a continuación, escribe los tests de integración indicados. Implementa primero el método en tu capa de servicio y luego escribe los tests, o usa TDD: escribe el test primero y deja que el compilador y los fallos te guíen hacia la implementación correcta.

Regla de negocio: buscar un estudiante por código. Si el código es nulo o vacío lanza `IllegalArgumentException`. Si no se encuentra ningún estudiante lanza `RuntimeException`.

[code:java]
public Student findStudentByCode(String code) {
    if (code == null || code.isBlank()) {
        throw new IllegalArgumentException("El código no puede ser nulo o vacío");
    }
    return studentRepository.findByCode(code)
            .orElseThrow(() -> new RuntimeException("Estudiante no encontrado: " + code));
}
[endcode]

[list]
`findStudentByCode_WhenCodeIsValid_ShouldReturnStudent`
`findStudentByCode_WhenCodeDoesNotExist_ShouldThrowRuntimeException`
`findStudentByCode_WhenCodeIsNull_ShouldThrowIllegalArgumentException`
[endlist]

Regla de negocio: obtener los estudiantes inscritos en un curso por nombre. Si el curso no existe lanza `RuntimeException`. Si existe devuelve la lista de estudiantes inscritos, que puede estar vacía.

[code:java]
public List<Student> getStudentsByCourseName(String courseName) {
    if (!courseRepository.existsByName(courseName)) {
        throw new RuntimeException("Curso no encontrado: " + courseName);
    }
    return studentRepository.findByStudentCourses_Course_Name(courseName);
}
[endcode]

[list]
`getStudentsByCourseName_WhenCourseExists_ShouldReturnEnrolledStudents`
`getStudentsByCourseName_WhenCourseHasNoStudents_ShouldReturnEmptyList`
`getStudentsByCourseName_WhenCourseDoesNotExist_ShouldThrowRuntimeException`
[endlist]

Regla de negocio: eliminar un estudiante por código. Si el estudiante no existe lanza `RuntimeException`. Si existe lo elimina y ya no debe poder encontrarse en la base de datos.

[code:java]
public void deleteStudentByCode(String code) {
    Student student = studentRepository.findByCode(code)
            .orElseThrow(() -> new RuntimeException("Estudiante no encontrado: " + code));
    studentRepository.delete(student);
}
[endcode]

[list]
`deleteStudentByCode_WhenStudentExists_ShouldRemoveFromDatabase`
`deleteStudentByCode_WhenStudentDoesNotExist_ShouldThrowRuntimeException`
[endlist]

Regla de negocio: inscribir un estudiante en un curso. Si el estudiante no existe lanza `RuntimeException`. Si el curso no existe lanza `RuntimeException`. Si el estudiante ya está inscrito en ese curso lanza `IllegalStateException`. Si todo es válido crea y devuelve la inscripción.

[code:java]
public StudentCourse enrollStudentInCourse(String studentCode, String courseName) {
    Student student = studentRepository.findByCode(studentCode)
            .orElseThrow(() -> new RuntimeException("Estudiante no encontrado: " + studentCode));
    Course course = courseRepository.findByName(courseName)
            .orElseThrow(() -> new RuntimeException("Curso no encontrado: " + courseName));
    if (studentCourseRepository.existsByStudentAndCourse(student, course)) {
        throw new IllegalStateException("El estudiante ya está inscrito en este curso");
    }
    StudentCourse enrollment = new StudentCourse();
    enrollment.setStudent(student);
    enrollment.setCourse(course);
    return studentCourseRepository.save(enrollment);
}
[endcode]

[list]
`enrollStudentInCourse_WhenValid_ShouldReturnNewEnrollment`
`enrollStudentInCourse_WhenAlreadyEnrolled_ShouldThrowIllegalStateException`
`enrollStudentInCourse_WhenStudentNotFound_ShouldThrowRuntimeException`
`enrollStudentInCourse_WhenCourseNotFound_ShouldThrowRuntimeException`
[endlist]

Regla de negocio: calcular la nota promedio de un estudiante a partir de sus entregas. Si el código es nulo o vacío lanza `IllegalArgumentException`. Si el estudiante no existe lanza `RuntimeException`. Si el estudiante no tiene entregas devuelve `0.0`. En caso contrario devuelve el promedio de las notas de todas sus entregas.

[code:java]
public double getAverageGradeByStudentCode(String code) {
    if (code == null || code.isBlank()) {
        throw new IllegalArgumentException("El código no puede ser nulo o vacío");
    }
    Student student = studentRepository.findByCode(code)
            .orElseThrow(() -> new RuntimeException("Estudiante no encontrado: " + code));
    List<Submission> submissions = submissionRepository.findByStudent(student);
    if (submissions.isEmpty()) {
        return 0.0;
    }
    return submissions.stream()
            .mapToDouble(Submission::getGrade)
            .average()
            .orElse(0.0);
}
[endcode]

[list]
`getAverageGradeByStudentCode_WhenStudentHasSubmissions_ShouldReturnCorrectAverage`
`getAverageGradeByStudentCode_WhenStudentHasNoSubmissions_ShouldReturnZero`
`getAverageGradeByStudentCode_WhenStudentNotFound_ShouldThrowRuntimeException`
`getAverageGradeByStudentCode_WhenCodeIsBlank_ShouldThrowIllegalArgumentException`
[endlist]

En la siguiente lección implementarás estos mismos tests con una técnica diferente que no requiere base de datos ni contexto de Spring. Compara cuánto tarda cada suite.
