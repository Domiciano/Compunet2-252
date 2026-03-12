[t] Mockito
Las pruebas de integraciÃ³n validan el sistema completo, pero tienen un costo: levantar el contexto de Spring tarda varios segundos por ejecuciÃ³n.

Mockito ofrece una alternativa: probar la capa de servicio de forma completamente aislada, sin base de datos ni contexto de Spring. En lugar de usar repositorios reales, simulamos sus respuestas con datos controlados. Las pruebas corren en milisegundos y se enfocan exclusivamente en la lÃ³gica de negocio.

El objetivo de `Mockito` es simular dependencias devolviendo datos controlados por quien escribe la prueba, para verificar cÃ³mo reacciona la lÃ³gica ante distintos escenarios.

[st] Dependencias
El mÃ³dulo `spring-boot-starter-test` ya incluye Mockito. Si necesitas agregarlo manualmente:

[code:xml]
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <scope>test</scope>
</dependency>
[endcode]

[st] Activar Mockito
El punto de partida es una clase de test con la anotaciÃ³n `@ExtendWith(MockitoExtension.class)`. Esta anotaciÃ³n activa el motor de Mockito para la clase sin necesitar levantar ningÃºn contexto de Spring.

[code:java]
package com.example.myapp.services;

import com.example.myapp.model.Course;
import com.example.myapp.model.Professor;
import com.example.myapp.repository.CourseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {
}
[endcode]

A diferencia de `@SpringBootTest`, aquÃ­ no se levanta ningÃºn contexto. Solo existe la clase de test y Mockito escuchando.

[st] Crear el Mock
Un `@Mock` es una implementaciÃ³n falsa de una clase o interfaz. Mockito la genera automÃ¡ticamente y por defecto todos sus mÃ©todos no hacen nada: devuelven `null`, `0`, listas vacÃ­as, etc. Nosotros decidimos exactamente quÃ© devolverÃ¡ en cada test.

[code:java]
@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

}
[endcode]

`courseRepository` ahora es una versiÃ³n simulada. Cuando el servicio le llame a `findAll()` o `findById(...)`, nosotros controlamos quÃ© responde.

[st] Inyectar el Mock en el Servicio
`@InjectMocks` crea una instancia real de `CourseService` e inyecta automÃ¡ticamente los mocks que declaramos como sus dependencias. Equivale a hacer `new CourseService(courseRepository)` pero sin escribirlo.

[code:java]
@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

}
[endcode]

`courseService` es el objeto real que vamos a probar. `courseRepository` es el objeto falso que le inyectamos como dependencia.

[st] Preparar los datos con `@BeforeEach`
En lugar de repetir la construcciÃ³n de objetos en cada test, usamos `@BeforeEach` para crear los datos de prueba una sola vez antes de cada mÃ©todo. Esto mantiene los tests limpios y enfocados.

[code:java]
@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    private Professor professor;
    private Course course1;
    private Course course2;

    @BeforeEach
    void setup() {
        professor = new Professor();
        professor.setId(1L);
        professor.setName("Alice Andrew");

        course1 = new Course();
        course1.setId(1L);
        course1.setProfessor(professor);
        course1.setName("ComputaciÃ³n en Internet II");

        course2 = new Course();
        course2.setId(2L);
        course2.setProfessor(professor);
        course2.setName("IngenierÃ­a de Software IV");
    }
}
[endcode]

A diferencia de las pruebas de integraciÃ³n, aquÃ­ no hay `@AfterEach` de limpieza porque no hay base de datos que limpiar.

[st] Simulando retornos de listas
Con la clase configurada, ya podemos escribir tests. Usa el patrÃ³n AAA y la convenciÃ³n `MethodName_WhenCondition_ExpectedBehavior`.

[code:java]
@Test
void getAllCourses_WhenCalled_ReturnsCourseList() {
    // Arrange: definimos quÃ© devolverÃ¡ el repositorio cuando se le llame
    when(courseRepository.findAll()).thenReturn(Arrays.asList(course1, course2));

    // Act
    List<Course> courses = courseService.getAllCourses();

    // Assert
    assertEquals(2, courses.size());
    assertEquals("ComputaciÃ³n en Internet II", courses.get(0).getName());
    assertEquals("IngenierÃ­a de Software IV", courses.get(1).getName());
}
[endcode]

La estructura es: `when(llamado al repositorio).thenReturn(dato simulado)`. El servicio llama al repositorio, el repositorio devuelve lo que nosotros definimos, y probamos que el servicio lo procesa correctamente.

[st] Simulando retornos de Optionals
[code:java]
@Test
void getCourseById_WhenExists_ReturnsCourse() {
    // Arrange
    when(courseRepository.findById(1L)).thenReturn(Optional.of(course1));

    // Act
    Course result = courseService.getCourseById(1L);

    // Assert
    assertNotNull(result);
    assertEquals(1L, result.getId());
    assertEquals("ComputaciÃ³n en Internet II", result.getName());
}
[endcode]

`Optional.of(object)` simula que el repositorio encontrÃ³ el registro. `Optional.empty()` simula que no lo encontrÃ³.

[st] Probando test negativos
[code:java]
@Test
void getCourseById_WhenNotExists_ThrowsException() {
    // Arrange: el repositorio no encuentra nada
    when(courseRepository.findById(1L)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> courseService.getCourseById(1L));
}
[endcode]

[st] Simulando mÃ©todos void
Para mÃ©todos que no devuelven valor la estructura cambia: `doNothing().when(mock).mÃ©todo()`.

[code:java]
@Test
void deleteCourse_WhenExists_DeletesSuccessfully() {
    // Arrange
    doNothing().when(courseRepository).deleteById(1L);

    // Act
    courseService.deleteCourse(1L);

    // Assert: verificamos que el repositorio fue llamado exactamente una vez
    verify(courseRepository, times(1)).deleteById(1L);
}
[endcode]

`verify()` es la Ãºnica forma de "afirmar" algo en tests de mÃ©todos void: confirma que el mock fue invocado el nÃºmero de veces esperado.

[st] Simulando excepciones en mÃ©todos void
`doThrow` simula que el repositorio lanza una excepciÃ³n, permitiendo probar cÃ³mo reacciona el servicio ante fallos.

[code:java]
@Test
void deleteCourse_WhenRepositoryFails_ThrowsException() {
    // Arrange
    doThrow(new RuntimeException("DB error")).when(courseRepository).deleteById(1L);

    // Act & Assert
    assertThrows(RuntimeException.class, () -> courseService.deleteCourse(1L));
}
[endcode]

[st] Resumen de la API de Mockito

[list]
`when(repo.method()).thenReturn(value)` â€” simula un mÃ©todo que devuelve un valor
`when(repo.method()).thenReturn(Optional.of(obj))` â€” simula que se encontrÃ³ un registro
`when(repo.method()).thenReturn(Optional.empty())` â€” simula que no se encontrÃ³ nada
`doNothing().when(repo).method()` â€” simula un mÃ©todo void sin efecto
`doThrow(new Ex()).when(repo).method()` â€” simula un mÃ©todo void que lanza excepciÃ³n
`verify(repo, times(1)).method()` â€” verifica que el mÃ©todo fue llamado N veces
[endlist]

[st] Retos
Implementa los mismos seis tests que hiciste con pruebas de integraciÃ³n, ahora usando Mockito. No necesitas base de datos ni `@AfterEach` de limpieza. Compara el tiempo de ejecuciÃ³n de ambas suites y reflexiona: Â¿cuÃ¡ndo conviene cada enfoque?

`findStudentByCode_WhenStudentExist_ShouldReturnOptionalStudent`

`findStudentByCode_WhenStudentDoesNotExist_ShouldThrowRuntimeException`


`getStudentsByCourseName_WhenCalled_ShouldReturnStudentList`

`getStudentsByCourseName_WhenCourseDoesNotExist_ShouldThrowRuntimeException`


`deleteStudentByCode_WhenStudentExists_ShouldCompleteWithoutThrowingException`

`deleteStudentByCode_WhenStudentDoesNotExists_ShouldThrowRuntimeException`
