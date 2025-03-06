# Construcción de base de datos

Vamos a crear una relación muchos a muchos de Estudiantes a Cursos.

Podemos adaptar esta estructura a **Estudiantes** *1 a muchos* **Estudiantes_Cursos** *muchos a 1* **Cursos**

Observemos que la clase intermedia **Estudiantes_Cursos** puede ser nombrada de acuerdo al negocio, como **Matrícula**.

De modo que podemos crear los Entities

```java
@Entity
public class Course {
    
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private long id;
    private String name;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Profesor professor;

    // Nueva relación
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Enrollment> enrollments;

}
```


```java
@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;
    private String code;
    private String program;


    // Nueva relación
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Enrollment> enrollments;
}
```


```java
@Entity
public class Enrollment {
    
    @Id 
    @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

}
```

# Construyendo las demás capas

Manos a la obra construyendo diferentes clases de `@Controller` y `@Service`.

🎯 Cree las clases `@Controller` para `Student`, `Course` y `Matricula`

🎯 Cree los endpoints necesarios para registrar estudiantes y cursos

🎯 Cree la clase `@Service` para `Enrollment`.

🎯 Cree un método `enrollStudent(long studentId, long coursId)` en la clase `@Service` para `Enrollment` que permita registrar a un estudiante en un curso.

🎯 Verifique que los ID de los JPA estan en long

🎯 Sigamos como convención que el nombre de las entidades quede en plural y en inglés

🕔 20 minutos


# Inserción en inicialización

Podemos requerir insertar información inicial. Para eso usaremos un archivo llamado `data.sql` dentro de la carpeta `resources`

```sql
-- Insertar estudiantes
INSERT INTO students (id, code, name, program) VALUES
    (1, 'A00001', 'Juan Pérez', 'SIS'),
    (2, 'A00002', 'María Gómez', 'SIS'),
    (3, 'A00003', 'Miguel Rodríguez', 'TEL'),
    (4, 'A00004', 'Lucía Fernández', 'DMI'),
    (5, 'A00005', 'Daniela Ramírez', 'TEL'),
    (6, 'A00006', 'Santiago Morales', 'SIS'),
    (7, 'A00007', 'Valentina Castro', 'DMI'),
    (8, 'A00008', 'Carlos Méndez', 'SIS'),
    (9, 'A00009', 'Javier Ortega', 'IBQ'),
    (10, 'A00010', 'Camila Rojas', 'MED'),
    (11, 'A00011', 'Andrés Herrera', 'ENI'),
    (12, 'A00012', 'Natalia Vargas', 'IBQ'),
    (13, 'A00013', 'Emiliano Suárez', 'SIS'),
    (14, 'A00014', 'Sofía León', 'TEL'),
    (15, 'A00015', 'Alejandro Pineda', 'IND'),
    (16, 'A00016', 'Isabela Cárdenas', 'PSI'),
    (17, 'A00017', 'Mateo Torres', 'DIS'),
    (18, 'A00018', 'Gabriela Mendoza', 'TEL'),
    (19, 'A00019', 'Luis Álvarez', 'DIS'),
    (20, 'A00020', 'Fernanda Espinosa', 'ENI');

-- Insertar profesores
INSERT INTO professors (id, name) VALUES
    (1, 'Gabriel Tamura'),
    (2, 'Ángela Villota'),
    (3, 'Andrés Aristizábal'),
    (4, 'Rocío Segovia'),
    (5, 'Claudia Castiblanco');

-- Insertar cursos
INSERT INTO courses (id, name, professor_id) VALUES
    (1, 'Ingeniería de Software IV', 1),
    (2, 'Computación y estructuras discretas III', 2),
    (3, 'Computación y estructuras discretas II', 3),
    (4, 'Ingeniería de Software III', 4),
    (5, 'Proyecto Integrador I', 5);
```

Adicionalmente use estas propiedades en el `application.properties`

```
spring.sql.init.mode=always
spring.jpa.defer-datasource-initialization=true
```

Esta forma de inicializar los datos hace que siempre intente cargar el `data.sql`. Por lo tanto, la segunda ejecución tendrá problemas porque los identificadores quedarán iguales y habrán duplicados.

Puede solucionarlo dentro del `application.properties`

```
spring.jpa.hibernate.ddl-auto=create
```

Esta propiedad destruye la base de datos anterior y vuelve a comenzar creando las tablas y cargando `data.sql`

También puede usar `data.sql` la instrucción `ON CONFLICT (id) DO NOTHING` en los `INSERT`

# Transacciones

Una transacción es una secuencia de operaciones sobre la base de datos que se ejecutan como una unidad indivisible, asegurando que todas las acciones se completen correctamente o, en caso de error, se reviertan para mantener la consistencia de los datos. Spring maneja transacciones con la anotación `@Transactional`, permitiendo que múltiples operaciones (`save`, `update`, `delete`) se agrupen en una sola transacción. Si ocurre una excepción en medio de la ejecución, el rollback deshace todos los cambios realizados en la base de datos dentro de esa transacción, evitando datos inconsistentes.


> Provoquemos un fallo en una transacción para evidenciar el rollback


```java
@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Transactional
    public void enrollStudent(Long courseId, Long studentId) {
        Enrollment enrollment = new Enrollment();
        enrollment.setCourse(new Course(courseId));
        enrollment.setStudent(new Student(studentId));

        enrollmentRepository.save(enrollment);

        // Fallo
        if (true) {
            throw new RuntimeException("Intentional failure for rollback");
        }

    }
}

```

Podemos notar que si sucede algún error durante la operación de transacción, todas las suboperaciones de la transacción se deshacen.


# Modificaciones durante transacción

Una vez almacenados los datos, `@Transactional` permite modificar los objetos por medio de los `setters`.

```java
@Transactional
public void updateStudentName(long id, String newName) {
    Student student = studentRepository.findById(id).orElseThrow();
    student.setName(newName); 
    // No es necesario llamar a save(student), JPA detecta el cambio y lo guarda al final de la transacción
}
```


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



# Extra

Esta información es adicional, por si quiere profundizar en algunos aspectos tratados en esta clase

# Tipos de cascada

### NONE
Si no especifica `CascadeType`, las operaciones no se propagan a las entidades relacionadas.

> Si eliminas un Profesor, los Cursos no se eliminan automáticamente.

> Si guardas un Profesor, sus Cursos no se guardan automáticamente.


### `CascadeType.PERSIST`

Si se guarda un `Professor`, también se guardan sus `Courses`, pero si eliminas el `Professor`, los `Courses` no se eliminan

```java
@OneToMany(mappedBy = "professor", cascade = CascadeType.PERSIST)
private List<Course> courses;
```


### `CascadeType.MERGE`

```java
@OneToMany(mappedBy = "professor", cascade = CascadeType.MERGE)
private List<Course> courses;
```

Si actualizas un `Professor`, también se actualizan sus `Courses`, pero si creas un nuevo `Course`, este no se guardará automáticamente

### `CascadeType.REMOVE`

```java
@OneToMany(mappedBy = "professor", cascade = CascadeType.REMOVE)
private List<Course> courses;
```

Si eliminas un Professor, se eliminan sus Courses, pero si guardas o actualizas un Professor, sus Courses no se verán afectados.

### `CascadeType.REFRESH`

```java
@OneToMany(mappedBy = "professor", cascade = CascadeType.REFRESH)
private List<Course> courses;
```

Si ejecutas `entityManager.refresh(profesor)`, también se actualizan sus Cursos con los valores actuales de la base de datos

### `CascadeType.DETACH`

```java
@OneToMany(mappedBy = "professor", cascade = CascadeType.DETACH)
private List<Course> courses;
```

Si ejecutas `entityManager.detach(profesor)`, también se desasocian sus Cursos, pero no se eliminan de la base de datos.

### `CascadeType.ALL`

Es la combinación de todos los modos anteriores

# Query Methods

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
