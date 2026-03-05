[t] Query Methods en Spring Data JPA

[link] (Spring Data JPA — Query Methods) https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html

[st] ¿Qué son los Query Methods?
Spring Data JPA ofrece una funcionalidad llamada **Query Methods**. Permite crear consultas a la base de datos de forma automática simplemente declarando métodos en las interfaces de repositorio.

Spring analiza el nombre del método, lo divide en partes y lo traduce a JPQL automáticamente. La convención sigue el formato `findBy...`, `countBy...`, `existsBy...`, seguido de las propiedades de la entidad y los operadores `And`, `Or`, `GreaterThan`, `Containing`, etc.

[st] Preparando el Modelo

El modelo de ejemplo tiene tres entidades: `Professor`, `Course` y `Student`. Un profesor puede dictar muchos cursos (uno a muchos). Un estudiante puede inscribirse en muchos cursos y un curso puede tener muchos estudiantes (muchos a muchos). La tabla intermedia `StudentCourse` se modela como entidad con clave embebida.

[mermaid]
erDiagram
    PROFESSOR {
        int id PK
        varchar name
    }
    COURSE {
        int id PK
        varchar name
        int credits
        int professor_id FK
    }
    STUDENT {
        int id PK
        varchar name
        varchar code
        varchar program
    }
    STUDENT_COURSE {
        int student_id PK,FK
        int course_id PK,FK
    }
    PROFESSOR ||--o{ COURSE : "dicta"
    STUDENT ||--o{ STUDENT_COURSE : "inscrito en"
    COURSE ||--o{ STUDENT_COURSE : "tiene"
[endmermaid]

[code:java]
package com.example.myapp.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class StudentCourseId implements Serializable {
    private Integer studentId;
    private Integer courseId;
    // constructores, getters y setters
}
[endcode]

[code:java]
package com.example.myapp.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "professor")
public class Professor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;

    @OneToMany(mappedBy = "professor")
    private List<Course> courses;
    // constructores, getters y setters
}
[endcode]

[code:java]
package com.example.myapp.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "course")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private int credits;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor professor;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudentCourse> studentCourses;
    // constructores, getters y setters
}
[endcode]

[code:java]
package com.example.myapp.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "student")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String code;
    private String program;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudentCourse> studentCourses;
    // constructores, getters y setters
}
[endcode]

[code:java]
package com.example.myapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "student_course")
public class StudentCourse {
    @EmbeddedId
    private StudentCourseId id;

    @ManyToOne
    @MapsId("studentId")
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @MapsId("courseId")
    @JoinColumn(name = "course_id")
    private Course course;
    // constructores, getters y setters
}
[endcode]

[st] Ejemplos Básicos
Estos métodos se declaran en las interfaces de repositorio. Spring genera la implementación en tiempo de ejecución.

[code:java]
public interface CourseRepository extends JpaRepository<Course, Integer> {

    // Cursos con un nombre exacto
    List<Course> findByName(String name);

    // Cursos cuyo nombre contenga una cadena (case-insensitive)
    List<Course> findByNameContainingIgnoreCase(String keyword);

    // Cursos con más créditos que el valor dado
    List<Course> findByCreditsGreaterThan(int credits);

    // Cursos con exactamente N créditos, ordenados por nombre
    List<Course> findByCreditOrderByNameAsc(int credits);
}
[endcode]

[code:java]
public interface StudentRepository extends JpaRepository<Student, Integer> {

    // Estudiante por código único
    Optional<Student> findByCode(String code);

    // Estudiantes de un programa académico
    List<Student> findByProgram(String program);

    // Estudiantes cuyo nombre contenga una cadena
    List<Student> findByNameContainingIgnoreCase(String name);
}
[endcode]

[st] Consultas en varias tablas
Spring Data JPA permite navegar por las relaciones entre entidades usando el carácter `_` (guión bajo) como separador en el nombre del método. Cada segmento es el nombre del campo en la clase Java (no la columna de la base de datos).

La estructura es: `findBy` + `NombreDeCampo` + `_` + `PropiedadAnidada`.

Ejemplo: para buscar cursos por el nombre del profesor, se navega desde `Course` → campo `professor` → campo `name`:

[code:java]
// En CourseRepository — navega Course → professor → name
List<Course> findByProfessorName(String professorName);

// En CourseRepository — navega Course → professor → name, cuenta
long countByProfessorName(String professorName);
[endcode]

Para relaciones más profundas que cruzan la tabla intermedia, se usa `_` explícito. Desde `Student` → `studentCourses` (lista de `StudentCourse`) → `course` → `name`:

[code:java]
// En StudentRepository
// Navega: Student → studentCourses → course → name
List<Student> findByStudentCourses_Course_Name(String courseName);

// Navega: Student → studentCourses → course → professor → name
List<Student> findByStudentCourses_Course_ProfessorName(String professorName);
[endcode]

Desde `Professor` en dirección inversa:

[code:java]
// En ProfessorRepository
// Navega: Professor → courses → studentCourses → student → program
List<Professor> findDistinctByCourses_StudentCourses_Student_Program(String program);
[endcode]

El `_` fuerza a Spring a tratar el segmento como un salto de relación y no como parte de un nombre de campo compuesto (por ejemplo, `studentCourses` vs `student_Courses`). Sin `_`, Spring intenta resolver `studentCoursesCourse` como un único nombre de propiedad y falla.

[st] Datos de prueba

[code:sql]
-- Profesores
INSERT INTO professor (name) VALUES ('Juan Perez');
INSERT INTO professor (name) VALUES ('Maria Rodriguez');
INSERT INTO professor (name) VALUES ('Carlos Gomez');

-- Cursos
INSERT INTO course (name, credits, professor_id) VALUES ('Introduccion a la Programacion', 4, 1);
INSERT INTO course (name, credits, professor_id) VALUES ('Estructuras de Datos', 4, 1);
INSERT INTO course (name, credits, professor_id) VALUES ('Anatomia Humana', 5, 2);
INSERT INTO course (name, credits, professor_id) VALUES ('Fisiologia', 5, 2);
INSERT INTO course (name, credits, professor_id) VALUES ('Derecho Penal', 3, 3);
INSERT INTO course (name, credits, professor_id) VALUES ('Historia del Arte', 3, 3);

-- Estudiantes
INSERT INTO student (name, code, program) VALUES ('Laura Garcia', '2021102001', 'Ingenieria de Sistemas');
INSERT INTO student (name, code, program) VALUES ('Pedro Pascal', '2021102002', 'Ingenieria de Sistemas');
INSERT INTO student (name, code, program) VALUES ('Andres Lopez', '2021102003', 'Medicina');
INSERT INTO student (name, code, program) VALUES ('Sofia Torres', '2021102004', 'Derecho');
INSERT INTO student (name, code, program) VALUES ('Camila Velez', '2021102005', 'Medicina');

-- Inscripciones (student_course)
INSERT INTO student_course (student_id, course_id) VALUES (1, 1);  -- Laura en Intro Prog
INSERT INTO student_course (student_id, course_id) VALUES (1, 2);  -- Laura en Estructuras
INSERT INTO student_course (student_id, course_id) VALUES (2, 1);  -- Pedro en Intro Prog
INSERT INTO student_course (student_id, course_id) VALUES (3, 3);  -- Andres en Anatomia
INSERT INTO student_course (student_id, course_id) VALUES (3, 4);  -- Andres en Fisiologia
INSERT INTO student_course (student_id, course_id) VALUES (4, 5);  -- Sofia en Derecho Penal
INSERT INTO student_course (student_id, course_id) VALUES (4, 6);  -- Sofia en Historia del Arte
INSERT INTO student_course (student_id, course_id) VALUES (5, 3);  -- Camila en Anatomia
[endcode]

Habilita esta propiedad para ver la operación SQL subyacente que genera cada query method:

[code:ini]
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
[endcode]

[t] Tarea 2
Ahora es tu turno. Añade los siguientes métodos a los repositorios correspondientes y pruébalos con los datos de prueba.

1. En `StudentRepository`: Encuentra un estudiante por su código único.

2. En `ProfessorRepository`: Encuentra profesores cuyo nombre contenga una cadena (ignorando mayúsculas y minúsculas).

3. En `CourseRepository`: Encuentra todos los cursos con un número específico de créditos.

4. En `StudentRepository`: Encuentra todos los estudiantes de un programa académico.

5. En `CourseRepository`: Encuentra un curso por nombre exacto, ignorando mayúsculas y minúsculas.

6. En `CourseRepository`: Encuentra todos los cursos de un profesor (por nombre) ordenados alfabéticamente.

7. En `StudentRepository`: Encuentra estudiantes de un programa cuyo código empiece por un prefijo dado.

8. En `CourseRepository`: Encuentra cursos con créditos entre dos valores (usa `Between`).

9. En `StudentRepository`: Encuentra todos los estudiantes que cursan materias con un profesor específico. Navega `Student` → `studentCourses` → `course` → `professor` → `name`.

10. En `ProfessorRepository`: Encuentra todos los profesores (sin duplicados) que le enseñan a estudiantes de un programa específico. Navega `Professor` → `courses` → `studentCourses` → `student` → `program`.
