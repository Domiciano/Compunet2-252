# Query Methods: Navegación Avanzada

<!-- tags: Distinct, filas duplicadas, @Query, JPQL, GROUP BY, HAVING, navegación inversa, Between, fan-out de un join, agregaciones -->

En la lección anterior viste que `_` te deja saltar de una entidad a otra dentro del nombre de un método. Con el mismo modelo y el mismo [repositorio base](https://github.com/Domiciano/QueryMethodsTareaTemplate), toca ver qué pasa cuando esa navegación se pone más interesante: consultas que van "hacia atrás", que combinan una condición superficial con una profunda, o que ya no caben en un nombre de método por más `_` que le pongas.

## Navegando en sentido inverso

Hasta ahora siempre partiste de la entidad "uno" (`Student`, `Professor`) hacia la relación. Pero nada te obliga a hacerlo en esa dirección: también puedes partir de `Course` y preguntar por el estudiante inscrito, aunque `Course` no tenga un campo `student` directo — solo lo alcanza a través de su colección `enrollments`.

```java
public interface CourseRepository extends JpaRepository<Course, Integer> {

    // Navega: Course → enrollments → student → name
    // Cursos en los que está inscrito un estudiante, dado su nombre (ignorando mayúsculas)
    List<Course> findByEnrollments_Student_NameContainingIgnoreCase(String studentName);
}
```

Es la misma ruta que ya usaste en `StudentRepository` (`findByStudentCourses_Course_Name`), recorrida en sentido contrario. Spring no privilegia ninguna dirección: el punto de partida siempre es la entidad dueña del repositorio, y desde ahí sigue el grafo por donde el nombre del método se lo indique. Fíjate que el nombre del campo cambia según desde dónde mires la misma tabla intermedia: en `Student` se llama `studentCourses`, en `Course` se llama `enrollments` — son colecciones distintas apuntando a la misma entidad `Enrollment`, así que el nombre del método tiene que usar el campo real de la clase desde la que arrancas.

## Combinar una condición superficial con una profunda — y el problema de las filas duplicadas

Puedes unir con `And` una condición de un solo salto con otra de varios saltos en el mismo método. Por ejemplo, cursos de un profesor específico donde además haya un estudiante inscrito de un programa dado:

```java
public interface CourseRepository extends JpaRepository<Course, Integer> {

    // Condición superficial (1 salto) + condición profunda (2 saltos), unidas con And
    List<Course> findDistinctByProfessor_NameAndEnrollments_Student_Program(
            String professorName, String program);
}
```

Con los datos de prueba de la lección anterior, "Juan Perez" dicta *Introducción a la Programación* (con Laura **y** Pedro, ambos de Ingeniería de Sistemas inscritos) y *Estructuras de Datos* (solo con Laura). Al navegar `enrollments`, Spring genera un `JOIN` contra esa colección — y por cada estudiante que haga match, la fila del curso se repite. Sin `Distinct`, `findByProfessor_NameAndEnrollments_Student_Program("Juan Perez", "Ingeniería de Sistemas")` devolvería **tres** filas (*Introducción a la Programación* dos veces: una por Laura, otra por Pedro) en vez de las dos que en realidad son. `Distinct` no filtra estudiantes ni cursos: colapsa las filas repetidas que produce el `JOIN` una vez que la base de datos ya hizo el cruce.

Regla práctica: **si tu condición navega una colección (`OneToMany`/`ManyToMany`) y tu método debe devolver la entidad raíz, agrega `Distinct`** — salvo que sepas con certeza que esa relación nunca produce más de un match por fila (como la del ejemplo anterior, donde un estudiante solo puede tener una fila de inscripción por curso).

## `Between` más allá de números

`Between` no es exclusivo de fechas o cantidades: funciona con cualquier tipo comparable, incluyendo `String` (comparación lexicográfica). Combinado con una navegación profunda:

```java
public interface StudentRepository extends JpaRepository<Student, Integer> {

    // Estudiantes con código entre dos valores, inscritos en algún curso
    // de un profesor específico. Navega: Student → studentCourses → course → professor → name
    List<Student> findDistinctByCodeBetweenAndStudentCourses_Course_Professor_Name(
            String startCode, String endCode, String professorName);
}
```

Aquí también aplica la regla anterior: como `studentCourses` es una colección, un estudiante inscrito en dos cursos del mismo profesor generaría dos filas para la misma persona — de ahí el `Distinct`.

## Cuando ni con `_` alcanza: agregaciones con `@Query`

Los Query Methods traducen el nombre del método a JPQL siguiendo la forma de una fila: filtran, comparan, ordenan. Lo que **no** pueden expresar por convención de nombres es una condición sobre un *grupo* de filas — un `GROUP BY` con `HAVING`, como "profesores cuyos cursos sumen más de N créditos" o "estudiantes inscritos en más de un curso". No existe ningún sufijo tipo `MoreThanOneCourse` que Spring sepa traducir; ahí es donde toca escribir la consulta en JPQL con `@Query`.

```java
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StudentRepository extends JpaRepository<Student, Integer> {

    @Query("""
        SELECT s FROM Student s
        JOIN s.studentCourses sc
        GROUP BY s
        HAVING COUNT(sc) > :minCourses
        """)
    List<Student> findStudentsEnrolledInMoreThanNCourses(@Param("minCourses") long minCourses);
}
```

Con `minCourses = 1`, sobre los datos de prueba, devuelve a Laura, Andrés y Sofía (cada uno inscrito en dos cursos) y deja por fuera a Pedro y Camila (inscritos en solo uno).

El mismo patrón sirve para una agregación numérica, como sumar los créditos de todos los cursos de un profesor:

```java
public interface ProfessorRepository extends JpaRepository<Professor, Integer> {

    @Query("""
        SELECT p FROM Professor p
        JOIN p.courses c
        GROUP BY p
        HAVING SUM(c.credits) > :minCredits
        """)
    List<Professor> findProfessorsWithTotalCreditsGreaterThan(@Param("minCredits") int minCredits);
}
```

Con `minCredits = 8`, solo Maria Rodríguez califica (5 + 5 = 10); Juan Pérez se queda justo en 8 (4 + 4), que no es *mayor* a 8, y Carlos Gómez en 6.

`@Query` recibe JPQL: escribe nombres de **entidades y campos de Java** (`Student`, `s.studentCourses`), no de tablas ni columnas de la base de datos — a diferencia del `@Query(nativeQuery = true)` que ya viste, que sí usa SQL real. Los parámetros con nombre (`:minCourses`) se ligan con `@Param`; también puedes usar `?1`, `?2`... por posición.

## Verifica lo que realmente se ejecuta

Con `spring.jpa.show-sql=true` (y `hibernate.format_sql=true`) puedes confirmar en consola el `JOIN` que genera cada ejemplo de esta lección — y ver con tus propios ojos las filas duplicadas que produce el primero antes de agregarle `Distinct`.
