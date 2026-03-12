[t] Mockito
Las pruebas de integracion validan el sistema completo, pero tienen un costo: levantar el contexto de Spring tarda varios segundos por ejecucion.

Mockito ofrece una alternativa: probar la capa de servicio de forma completamente aislada, sin base de datos ni contexto de Spring. En lugar de usar repositorios reales, simulamos sus respuestas con datos controlados. Las pruebas corren en milisegundos y se enfocan exclusivamente en la logica de negocio.

El objetivo de `Mockito` es simular dependencias devolviendo datos controlados por quien escribe la prueba, para verificar como reacciona la logica ante distintos escenarios.

[st] Dependencias
El modulo `spring-boot-starter-test` ya incluye Mockito. Si necesitas agregarlo manualmente:

[code:xml]
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <scope>test</scope>
</dependency>
[endcode]

[st] Paso 1 â€” Activar Mockito
El punto de partida es una clase de test con la anotacion `@ExtendWith(MockitoExtension.class)`. Esta anotacion activa el motor de Mockito para la clase sin necesitar levantar ningun contexto de Spring.

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

A diferencia de `@SpringBootTest`, aqui no se levanta ningun contexto. Solo existe la clase de test y Mockito escuchando.

[st] Paso 2 â€” Crear el Mock
Un `@Mock` es una implementacion falsa de una clase o interfaz. Mockito la genera automaticamente y por defecto todos sus metodos no hacen nada: devuelven `null`, `0`, listas vacias, etc. Nosotros decidimos exactamente que devolvera en cada test.

Agregamos el mock del repositorio:

[code:java]
@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

}
[endcode]

`courseRepository` ahora es una version simulada. Cuando el servicio le llame a `findAll()` o `findById(...)`, nosotros controlamos que responde.

[st] Paso 3 â€” Inyectar el Mock en el Servicio
`@InjectMocks` crea una instancia real de `CourseService` e inyecta automaticamente los mocks que declaramos como sus dependencias. Equivale a hacer `new CourseService(courseRepository)` pero sin escribirlo.

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

[st] Paso 4 â€” Preparar los datos con `@BeforeEach`
En lugar de repetir la construccion de objetos en cada test, usamos `@BeforeEach` para crear los datos de prueba una sola vez antes de cada metodo. Esto mantiene los tests limpios y enfocados.

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
        course1.setName("Computacion en Internet II");

        course2 = new Course();
        course2.setId(2L);
        course2.setProfessor(professor);
        course2.setName("Ingenieria de Software IV");
    }
}
[endcode]

A diferencia de las pruebas de integracion, aqui no hay `@AfterEach` de limpieza porque no hay base de datos que limpiar.

[st] Simulando retornos de listas
Con la clase configurada, ya podemos escribir tests. Usa el patron AAA y la convencion `MethodName_WhenCondition_ExpectedBehavior`.

[code:java]
@Test
void getAllCourses_WhenCalled_ReturnsCourseList() {
    // Arrange: definimos que devolvera el repositorio cuando se le llame
    when(courseRepository.findAll()).thenReturn(Arrays.asList(course1, course2));

    // Act
    List<Course> courses = courseService.getAllCourses();

    // Assert
    assertEquals(2, courses.size());
    assertEquals("Computacion en Internet II", courses.get(0).getName());
    assertEquals("Ingenieria de Software IV", courses.get(1).getName());
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
    assertEquals("Computacion en Internet II", result.getName());
}
[endcode]

`Optional.of(object)` simula que el repositorio encontro el registro. `Optional.empty()` simula que no lo encontro.

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

[st] Simulando metodos void
Para metodos que no devuelven valor la estructura cambia: `doNothing().when(mock).metodo()`.

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

`verify()` es la unica forma de "afirmar" algo en tests de metodos void: confirma que el mock fue invocado el numero de veces esperado.

[st] Simulando excepciones en metodos void
`doThrow` simula que el repositorio lanza una excepcion, permitiendo probar como reacciona el servicio ante fallos.

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
`when(repo.method()).thenReturn(value)` -- simula un metodo que devuelve un valor
`when(repo.method()).thenReturn(Optional.of(obj))` -- simula que se encontro un registro
`when(repo.method()).thenReturn(Optional.empty())` -- simula que no se encontro nada
`doNothing().when(repo).method()` -- simula un metodo void sin efecto
`doThrow(new Ex()).when(repo).method()` -- simula un metodo void que lanza excepcion
`verify(repo, times(1)).method()` -- verifica que el metodo fue llamado N veces
[endlist]

[st] Retos
Implementa los mismos seis tests que hiciste con pruebas de integracion, ahora usando Mockito. No necesitas base de datos ni `@AfterEach` de limpieza. Compara el tiempo de ejecucion de ambas suites y reflexiona: cuando conviene cada enfoque?

`findStudentByCode_WhenStudentExist_ShouldReturnOptionalStudent`

`findStudentByCode_WhenStudentDoesNotExist_ShouldThrowRuntimeException`


`getStudentsByCourseName_WhenCalled_ShouldReturnStudentList`

`getStudentsByCourseName_WhenCourseDoesNotExist_ShouldThrowRuntimeException`


`deleteStudentByCode_WhenStudentExists_ShouldCompleteWithoutThrowingException`

`deleteStudentByCode_WhenStudentDoesNotExists_ShouldThrowRuntimeException`
