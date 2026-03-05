[t] Query Methods en Spring Data JPA

[link] (Spring Data JPA — Query Methods) https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html

[st] ¿Qué son los Query Methods?
Spring Data JPA ofrece una funcionalidad llamada **Query Methods**. Permite crear consultas a la base de datos de forma automática simplemente declarando métodos en las interfaces de repositorio.

Spring analiza el nombre del método, lo divide en partes y lo traduce a JPQL automáticamente. La convención sigue el formato `findBy...`, `countBy...`, `existsBy...`, seguido de las propiedades de la entidad y los operadores `And`, `Or`, `GreaterThan`, `Containing`, etc.

[st] Preparando el Modelo

El modelo completo tiene 9 tablas. Las tres primeras entidades son académicas: `Professor`, `Course` y `Student`. Las otras tres son de seguridad: `User`, `Role` y `Permission`. Cada relación muchos a muchos se modela con una entidad intermedia y clave embebida (`StudentCourse`, `UserRole`, `RolePermission`).

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
    USER {
        int id PK
        varchar username
        varchar password
    }
    ROLE {
        int id PK
        varchar name
    }
    PERMISSION {
        int id PK
        varchar name
    }
    USER_ROLE {
        int user_id PK,FK
        int role_id PK,FK
    }
    ROLE_PERMISSION {
        int role_id PK,FK
        int permission_id PK,FK
    }
    PROFESSOR ||--o{ COURSE : "dicta"
    STUDENT ||--o{ STUDENT_COURSE : "inscrito en"
    COURSE ||--o{ STUDENT_COURSE : "tiene"
    USER ||--o{ USER_ROLE : "tiene"
    ROLE ||--o{ USER_ROLE : "asignado a"
    ROLE ||--o{ ROLE_PERMISSION : "tiene"
    PERMISSION ||--o{ ROLE_PERMISSION : "asignado a"
[endmermaid]

[code:java]
package com.example.myapp.model.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class StudentCourseId implements Serializable {

    @Column(name = "student_id")
    private Integer studentId;

    @Column(name = "course_id")
    private Integer courseId;

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }
    public Integer getCourseId() { return courseId; }
    public void setCourseId(Integer courseId) { this.courseId = courseId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o instanceof StudentCourseId) {
            StudentCourseId that = (StudentCourseId) o;
            return Objects.equals(studentId, that.studentId) && Objects.equals(courseId, that.courseId);
        } else return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentId, courseId);
    }
}
[endcode]

[code:java]
package com.example.myapp.model.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UserRoleId implements Serializable {

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "role_id")
    private Integer roleId;

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public Integer getRoleId() { return roleId; }
    public void setRoleId(Integer roleId) { this.roleId = roleId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o instanceof UserRoleId) {
            UserRoleId that = (UserRoleId) o;
            return Objects.equals(userId, that.userId) && Objects.equals(roleId, that.roleId);
        } else return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, roleId);
    }
}
[endcode]

[code:java]
package com.example.myapp.model.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class RolePermissionId implements Serializable {

    @Column(name = "role_id")
    private Integer roleId;

    @Column(name = "permission_id")
    private Integer permissionId;

    public Integer getRoleId() { return roleId; }
    public void setRoleId(Integer roleId) { this.roleId = roleId; }
    public Integer getPermissionId() { return permissionId; }
    public void setPermissionId(Integer permissionId) { this.permissionId = permissionId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o instanceof RolePermissionId) {
            RolePermissionId that = (RolePermissionId) o;
            return Objects.equals(roleId, that.roleId) && Objects.equals(permissionId, that.permissionId);
        } else return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(roleId, permissionId);
    }
}
[endcode]

[code:java]
package com.example.myapp.model;

import com.example.myapp.model.keys.StudentCourseId;
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

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<Course> getCourses() { return courses; }
    public void setCourses(List<Course> courses) { this.courses = courses; }
}
[endcode]

[code:java]
package com.example.myapp.model;

import com.example.myapp.model.keys.StudentCourseId;
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

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getCredits() { return credits; }
    public void setCredits(int credits) { this.credits = credits; }
    public Professor getProfessor() { return professor; }
    public void setProfessor(Professor professor) { this.professor = professor; }
    public List<StudentCourse> getStudentCourses() { return studentCourses; }
    public void setStudentCourses(List<StudentCourse> studentCourses) { this.studentCourses = studentCourses; }
}
[endcode]

[code:java]
package com.example.myapp.model;

import com.example.myapp.model.keys.StudentCourseId;
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

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getProgram() { return program; }
    public void setProgram(String program) { this.program = program; }
    public List<StudentCourse> getStudentCourses() { return studentCourses; }
    public void setStudentCourses(List<StudentCourse> studentCourses) { this.studentCourses = studentCourses; }
}
[endcode]

[code:java]
package com.example.myapp.model;

import com.example.myapp.model.keys.StudentCourseId;
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

    public StudentCourseId getId() { return id; }
    public void setId(StudentCourseId id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
}
[endcode]

[code:java]
package com.example.myapp.model;

import com.example.myapp.model.keys.UserRoleId;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "app_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private String password;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserRole> userRoles;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public List<UserRole> getUserRoles() { return userRoles; }
    public void setUserRoles(List<UserRole> userRoles) { this.userRoles = userRoles; }
}
[endcode]

[code:java]
package com.example.myapp.model;

import com.example.myapp.model.keys.UserRoleId;
import com.example.myapp.model.keys.RolePermissionId;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "role")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;

    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserRole> userRoles;

    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RolePermission> rolePermissions;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<UserRole> getUserRoles() { return userRoles; }
    public void setUserRoles(List<UserRole> userRoles) { this.userRoles = userRoles; }
    public List<RolePermission> getRolePermissions() { return rolePermissions; }
    public void setRolePermissions(List<RolePermission> rolePermissions) { this.rolePermissions = rolePermissions; }
}
[endcode]

[code:java]
package com.example.myapp.model;

import com.example.myapp.model.keys.RolePermissionId;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "permission")
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;

    @OneToMany(mappedBy = "permission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RolePermission> rolePermissions;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<RolePermission> getRolePermissions() { return rolePermissions; }
    public void setRolePermissions(List<RolePermission> rolePermissions) { this.rolePermissions = rolePermissions; }
}
[endcode]

[code:java]
package com.example.myapp.model;

import com.example.myapp.model.keys.UserRoleId;
import jakarta.persistence.*;

@Entity
@Table(name = "user_role")
public class UserRole {
    @EmbeddedId
    private UserRoleId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("roleId")
    @JoinColumn(name = "role_id")
    private Role role;

    public UserRoleId getId() { return id; }
    public void setId(UserRoleId id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
[endcode]

[code:java]
package com.example.myapp.model;

import com.example.myapp.model.keys.RolePermissionId;
import jakarta.persistence.*;

@Entity
@Table(name = "role_permission")
public class RolePermission {
    @EmbeddedId
    private RolePermissionId id;

    @ManyToOne
    @MapsId("roleId")
    @JoinColumn(name = "role_id")
    private Role role;

    @ManyToOne
    @MapsId("permissionId")
    @JoinColumn(name = "permission_id")
    private Permission permission;

    public RolePermissionId getId() { return id; }
    public void setId(RolePermissionId id) { this.id = id; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public Permission getPermission() { return permission; }
    public void setPermission(Permission permission) { this.permission = permission; }
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
