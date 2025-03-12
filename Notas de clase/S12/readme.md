Dependencias

Test de unidad con información mockeada.

Aquí los test de unidad se harán a la capa service y se simulará la información para sólo probar la capa de service. 


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

```java
package co.edu.icesi.introspringboot2.service;

import co.edu.icesi.introspringboot2.entity.Course;
import co.edu.icesi.introspringboot2.repository.CourseRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) 
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    @Test
    void getAllCourses_ReturnsCourseList() {
        // Arrange
        Course course1 = new Course();
        course1.setId(1L);
        course1.setName("Spring Boot");

        Course course2 = new Course();
        course2.setId(2L);
        course2.setName("Java Avanzado");

        when(courseRepository.findAll()).thenReturn(Arrays.asList(course1, course2));

        // Act
        List<Course> courses = courseService.getAllCourses();

        // Assert
        assertEquals(2, courses.size());
        assertEquals("Spring Boot", courses.get(0).getName());
        assertEquals("Java Avanzado", courses.get(1).getName());
    }

    @Test
    void getCourseById_CourseExists_ReturnsCourse() {
        // Arrange
        Course course = new Course();
        course.setId(1L);
        course.setName("Spring Boot");

        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        // Act
        Course result = courseService.getCourseById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Spring Boot", result.getName());
    }

    @Test
    void getCourseById_CourseDoesNotExist_ThrowsException() {
        // Arrange
        when(courseRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> courseService.getCourseById(1L));
    }

    @Test
    void saveCourse_Success() {
        // Arrange
        Course course = new Course();
        course.setName("Spring Boot");

        when(courseRepository.save(course)).thenReturn(course);

        // Act
        Course savedCourse = courseService.saveCourse(course);

        // Assert
        assertNotNull(savedCourse);
        assertEquals("Spring Boot", savedCourse.getName());
    }

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
}

```


```
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
