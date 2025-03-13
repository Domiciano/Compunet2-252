# Intro a testing en Spring Boot

Haremos dos tipos de pruebas. Tests sobre la capa de `Service` aislada y tests sobre la capa de `Service` en conjunto con `Repository`.

Para aislar la capa de `Service` podemos simular el funcionamiento de la capa `Repository` usando `Mockito`.

Para testear la capa de `Service` + `Repository` tendremos que aprender a cargar el `Application Context` en el proyecto de test.

Primero vamos con las dependencias

# Dependencias

Requerimos  `JUnit`, `Mockito` y `SpringBootTest`

```xml
<dependencies>
    <!-- JUnit 5 -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-api</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- Mockito -->
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- Spring Boot Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

# Test de capa Service con Información Mockeada

```java
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
```

# Simulando retornos de listas

Luego puede crear algunos test positivos usando el patrón de pruebas AAA (Arrange, Act y Assert).

```java
@Test
void getAllCoursesThenReturnsCourseList() {
    // Arrange
    // Creamos la información que simularemos que nos devolverá la capa de Repository
    Professor professor = new Professor();
        
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
```

# Simulando retornos de Optionals
```java
    @Test
void getExistingCourseByIdThenReturnCourse() {
    // Arrange
    Course course = new Course();
    course.setId(1L);
    course.setName("Computación en internet II");

    when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

    // Act
    Course result = courseService.getCourseById(1L);

    // Assert
    assertNotNull(result);
    assertEquals(1L, result.getId());
    assertEquals("Computación en internet II", result.getName());
}
```

Aquí se simula un optinal por medio de `Optional.of(object)`

# Probando test negativos

¿Qué pasa si requerimos probar una excepción? Lo podemos hacer así

```java
@Test
void getNotExistingCourseByIdThThrowsException() {
    // Arrange
    when(courseRepository.findById(1L)).thenReturn(Optional.empty());

    // Act y Assert
    assertThrows(RuntimeException.class, () -> courseService.getCourseById(1L));
}
```

# Simulando método Void

¿Qué pasa si quiero mockear un método que no devuelve nada? La estructura de mock cambia a

doNothing() -> when(objectoMockeado) -> método del objeto mockeado;

Por ejemplo

```java
 @Test
void deleteCourse_Success() {
    // Arrange
    long courseId = 1L;
    doNothing().when(courseRepository).deleteById(courseId);

    // Act
    courseService.deleteCourse(courseId);

    // Assert
    verify(courseRepository, times(1)).deleteById(courseId);
}
```
Aquí usamos verify para verificar que el llamado al repositorio sólo se hace una vez




```java
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
```


# Pruebas de integración
```
@SpringBootTest 
class CourseServiceIntegrationTest {

    @Autowired 
    private CourseService courseService;

    @Autowired
    private CourseRepository courseRepository;

    @BeforeEach
    void setUp() {
        courseRepository.deleteAll(); 
    }

    @Test
    void testCreateCourse() {
        // Arrange
        Course course = new Course();
        course.setName("Spring Boot");

        // Act
        Course savedCourse = courseService.createCourse(course);

        // Assert
        assertNotNull(savedCourse.getId());
        assertEquals("Spring Boot", savedCourse.getName());
    }
}
```

Disponga de `application.properties` en la ruta `test/`
