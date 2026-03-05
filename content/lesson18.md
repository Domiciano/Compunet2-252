[t] Mockito
Probar unitariamente la capa de servicios con Mockito permite enfocarnos en las reglas de negocio de forma aislada, sin depender de la base de datos ni de levantar el contexto completo de Spring. Al simular las respuestas de los repositorios o componentes externos, validamos exclusivamente la lógica propia del servicio (como validaciones, transformaciones o flujos de decisión), lo que hace que las pruebas sean más rápidas, confiables y fáciles de mantener, al mismo tiempo que garantizan que los errores de negocio se detecten temprano sin ruido de infraestructura.

El objetivo de `Mockito` es simular dependencias devolviendo datos controlados por quien escribe la prueba, para verificar cómo reacciona la lógica ante distintos escenarios.

[st] Intro a testing en Spring Boot
Haremos dos tipos de pruebas. Tests sobre la capa de `Service` aislada y tests sobre la capa de `Service` en conjunto con `Repository`.

Para aislar la capa de `Service` podemos simular el funcionamiento de la capa `Repository` usando `Mockito`.
[st] Dependencias
Requerimos  `JUnit`, `Mockito` y `SpringBootTest`
[code:xml]
<dependencies>
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
[endcode]
[st] Test de capa Service con Información Mockeada

[code:java]
import co.edu.icesi.introspringboot2.repository.CourseRepository;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

 @ExtendWith(MockitoExtension.class)
public class CourseServiceTest {

    //Cargamos una simulación de la capa repository
    @Mock
    private CourseRepository courseRepository;

    //Inyectamos el mock a CourseService teniendo en cuenta la dependencia que tiene
    @InjectMocks
    private CourseService courseService;   

}
[endcode]

[st] Simulando retornos de listas
Luego puede crear algunos test positivos usando el patrón de pruebas AAA (Arrange, Act y Assert).
Para escribir los test use esta convención
`MethodName_WhenCondition_ExpectedBehavior`
[code:java]
    @Test
    void getAllCourses_WhenCalled_ReturnsCourseList() {
        // Arrange
        // Creamos la información que simularemos que nos devolverá la capa de Repository
        Professor professor = new Professor();
        professor.setId(1L);
        professor.setName("Alice Andrew");

        Course course1 = new Course();
        course1.setId(1L);
        course1.setProfessor(professor);
        course1.setName("Computación en Internet II");

        Course course2 = new Course();
        course2.setId(2L);
        course2.setProfessor(professor);
        course2.setName("Ingeniería de Software IV");

        // Aquí en donde simulamos con Mockito el retorno del elemento de repositoy
        // La estructura es when( llamado a repository ) -> thenReturn( se devuelve la información simulada )
        when(courseRepository.findAll()).thenReturn(Arrays.asList(course1, course2));

        // Act
        // Aquí probamos ahora sí el método que deseamos testear
        List<Course> courses = courseService.getAllCourses();

        // Assert
        // Finalmente verificamos que todo esté ok
        assertEquals(2, courses.size());
        assertEquals("Computación en Internet II", courses.get(0).getName());
                assertEquals("Ingeniería de Software IV", courses.get(1).getName());
    }
[endcode]
[st] Simulando retornos de Optionals
[code:java]
    @Test
    void getCourseById_WhenExists_ReturnsCourse() {
        // Arrange
        Professor professor = new Professor();
        professor.setId(1L);
        professor.setName("Alice Andrew");

        Course course = new Course();
        course.setId(1L);
        course.setProfessor(professor);
        course.setName("Computación en internet II");

        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        // Act
        Course result = courseService.getCourseById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Computación en internet II", result.getName());
    }
[endcode]
Aquí se simula un optinal por medio de `Optional.of(object)`
[st] Probando test negativos
¿Qué pasa si requerimos probar una excepción? Lo podemos hacer así
[code:java]
    @Test
    void getCourseById_WhenNotExists_ThrowsException() {
        // Arrange
        when(courseRepository.findById(1L)).thenReturn(Optional.empty());
        // Act y Assert
        assertThrows(RuntimeException.class, () -> courseService.getCourseById(1L));
    }
[endcode]
[st] Simulando método Void
¿Qué pasa si quiero mockear un método que no devuelve nada? La estructura de mock cambia a
doNothing() -> when(objectoMockeado) -> método del objeto mockeado;

Por ejemplo
[code:java]
    @Test
    void deleteCourse_WhenCalled_DeletesSuccessfully() {
        // Arrange
        long courseId = 1L;
        doNothing().when(courseRepository).deleteById(courseId);
        // Act
        courseService.deleteCourse(courseId);
        // Assert
        verify(courseRepository, times(1)).deleteById(courseId);
    }
[endcode]
Aquí usamos verify para verificar que el llamado al repositorio sólo se hace una vez

[code:java]
when(...).thenReturn(...)
Simula un método que devuelve un valor.
when(repo.findById(1L)).thenReturn(Optional.of(course))

doNothing().when(...)
Simula un método void.
doNothing().when(repo).deleteById(1L);

doThrow(...).when(...)
Simula una excepción.
doThrow(new RuntimeException()).when(repo).deleteById(1L);

verify(...)
Verifica si un método se llamó.
verify(repo, times(1)).findAll();
[endcode]

[st] Retos
Realice los siguientes tests unitarios con `Mockito`

`findStudentByCode_WhenStudentExist_ShouldReturnOptionalStudent`

`findStudentByCode_WhenStudentDoesNotExist_ShouldThrowRuntimeException`


`getStudentsByCourseName_WhenCalled_ShouldReturnStudentList`

`getStudentsByCourseName_WhenCourseDoesNotExist_ShouldThrowRuntimeException`


`deleteStudentByCode_WhenStudentExists_ShouldCompleteWithoutThrowingException`

`deleteStudentByCode_WhenStudentDoesNotExists_ShouldThrowRuntimeException`