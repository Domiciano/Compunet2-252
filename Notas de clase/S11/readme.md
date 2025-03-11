# Query Methods

Los Query Methods en Spring Data JPA son una forma de generar consultas de manera automática mediante la convención de nombres en los métodos de los repositorios. En lugar de escribir consultas SQL o JPQL manualmente, se pueden definir métodos en una interfaz siguiendo una estructura basada en palabras clave como findBy, countBy, existsBy, combinadas con operadores como And, Or, Like, Between, entre otros. Esto permite realizar consultas complejas de forma declarativa y optimizada, reduciendo la cantidad de código y mejorando la mantenibilidad de la aplicación.

Veamos algunos ejemplos

```java
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByCode(String code);

    List<Student> findByNameContaining(String name);

    boolean existsByCode(String code);

    long countByProgram(String program);
}
```



```java
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByNameContaining(String name);

    long countByProfessorId(Long professorId);

    List<Course> findByProfessorId(Long professorId);

    boolean existsByName(String name);
}
```

```java
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByStudentId(Long studentId);

    long countByCourseId(Long courseId);

    Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);
}
```

Si quiere ver en la consola, la consulta que se está haciendo, puede incluir la siguiente propiedad en el `application.properties`

```
spring.jpa.show-sql=true
```

Escoja 3 de los siguiente 6 objetivos e impleméntelos usando Query Methods

🎯 Cree un Query Method que le permita listar estudiantes por programa

🎯 Cree un Query Method que le permita obtener los cursos que está viendo un estudiante

🎯 Cree un Query Method que le permita ver los estudiantes de un curso

🎯 Buscar un profesor por nombre (ignorando mayúsculas y minúsculas)

🎯 Buscar los cursos dictados por un profesor

🎯 Contar cuántos estudiantes están en un programa específico


### Posible preguntas
¿Un service puede tener dos o más repository como dependencias? 

Sí, si puede

Me sale un JSON largo y sospechosamente erróneo, ¿Qué es?
Como estamos respondiendo Entities y no DTO, las composiciones entre entidades es el problema. Por ejemplo, Student tiene una lista de Enrollment. Pero a su vez Enrollment tiene un Student y el desearilizador caerá en bucle. Puede hacer esto:

```java
@Entity
@Table(name = "students")
public class Student {
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Enrollment> enrollments;
}
```

Usando @JsonIgnore, puede no incluir enrollments como parte de la respuesta. Sin embargo, más adelante NO contestaremos con Entity, contestaremos con DTO

# Poblemos la tabla de Enrollments

```sql
-- Insertar matriculas
INSERT INTO enrollments (id, student_id, course_id)
VALUES
    -- Ingeniería de Software IV
    (1, 1, 1), (2, 2, 1), (3, 6, 1), (4, 8, 1), (5, 13, 1),

    -- Computación y estructuras discretas III
    (6, 1, 2), (7, 2, 2), (8, 3, 2), (9, 6, 2), (10, 14, 2),

    -- Computación y estructuras discretas II
    (11, 3, 3), (12, 5, 3), (13, 10, 3), (14, 12, 3), (15, 18, 3),

    -- Ingeniería de Software III
    (16, 1, 4), (17, 4, 4), (18, 6, 4), (19, 9, 4), (20, 13, 4),

    -- Proyecto Integrador I
    (21, 7, 5), (22, 8, 5), (23, 11, 5), (24, 15, 5), (25, 20, 5);
```

# Pagination

La paginación es una estrategia eficiente basada en lazy loading para manejar grandes volúmenes de datos en una base de datos.

En lugar de recuperar todos los registros de una consulta que podría devolver miles o millones de filas, la paginación permite solicitar solo una fracción de los datos a la vez, optimizando el rendimiento y el uso de recursos.

Cada fracción de datos tiene un número fijo de registros y se denomina `page`. Esto facilita la navegación y mejora la eficiencia de las consultas en bases de datos masivas.


```java
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Page<Student> findByProgram(String program, Pageable pageable);

}
```

Y pasar el parámetro de Pageable puede crear un objeto asi

```java
Pageable pageable = PageRequest.of(page, size);
```

# <a href="https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html">Query Methods</a>

1️⃣ Comparaciones básicas
Is, Equals → findByNameIs(String name)
Not → findByNameNot(String name)
Like → findByNameLike(String pattern)
StartingWith / EndingWith / Containing → findByNameStartingWith("J")

2️⃣ Comparaciones numéricas
GreaterThan → findByAgeGreaterThan(int age)
GreaterThanEqual → findByAgeGreaterThanEqual(int age)
LessThan → findByAgeLessThan(int age)
LessThanEqual → findByAgeLessThanEqual(int age)
Between → findBySalaryBetween(BigDecimal min, BigDecimal max)

3️⃣ Operadores lógicos
And → findByFirstNameAndLastName(String first, String last)
Or → findByCityOrCountry(String city, String country)

4️⃣ Valores nulos
IsNull → findByEmailIsNull()
IsNotNull → findByEmailIsNotNull()

5️⃣ Booleanos
True → findByActiveTrue()
False → findByActiveFalse()

6️⃣ Relaciones y colecciones
In → findByCategoryIn(List<String> categories)
NotIn → findByCategoryNotIn(List<String> categories)
Exists → findByOrdersExists() (cuando hay relaciones)
Size → findByItemsSize(int size) (para colecciones dentro de una entidad)

7️⃣ Ordenación y límites
OrderBy → findByLastNameOrderByFirstNameAsc()
Top / First → findTop3ByOrderBySalaryDesc()
