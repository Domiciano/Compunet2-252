[t] Persistencia
Vamos a entrar en uno de los mejores capítulos del curso y es el de persistencia. Usaremos el framework Spring Boot para almacenar datos de una aplicación en bases de datos.
[st] Agregar dependencias de base de datos
Vamos a trabajar con una base de datos en memoria llamada H2 y veremos cómo integrar Spring Boot con JPA y un ORM para persistencia de datos.
[code:xml]
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
[endcode]
Vamos a partir de un modelo de datos convecional y lo transformaremos en una tabla
[code:java]
public class Student {
    private Integer id;
    private String code; // Ejemplo: A00123456
    private String name;
    private String program;
    // Getters y setters
}
[endcode]
Usaremos las anotaciones a continuación para volverlo una tabla de base de datos
[code:java]
@Entity
@Table(name = "student")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String code;
    private String name;
    private String program;
    // Constructor vacío
    // Getters y setters
}
[endcode]
Note `@Entity`, `@Table`, `@Id`, `@GeneratedValue`
[st] Conceptos clave: Connection Pool y ORM
HikariCP es un pool de conexiones eficiente para bases de datos en Java. Permite reutilizar conexiones y mejorar el rendimiento en aplicaciones con múltiples accesos concurrentes.
[i] https://miro.medium.com/v2/resize:fit:1168/1*zR8NPu1FEV4ndiRSY05YDA.png
JPA (Jakarta Persistence API) es una especificación para trabajar con bases de datos relacionales mediante mapeo objeto-relacional (ORM). Un ORM mapea tablas a clases y filas a instancias de esas clases, facilitando la manipulación de datos con código orientado a objetos.

Hibernate es un framework ORM para Java que facilita la persistencia de datos en bases de datos relacionales.

[st] Configuración de base de datos H2
[code:ini]
spring.application.name=IntroSpring
spring.jpa.hibernate.ddl-auto=update
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
spring.h2.console.path=/h2
spring.jpa.defer-datasource-initialization=true
server.port=8080
[endcode]
Este bean ya viene con métodos de CRUD
[st] Inicialización de datos
Spring Boot detecta automáticamente archivos llamados `schema.sql` y `data.sql` en el directorio `src/main/resources` y los ejecuta al inicio de la aplicación.
En este caso, como ya tenemos la tabla creada con JPA/Hibernate, solo necesitamos el archivo `data.sql` para insertar registros iniciales de estudiantes
[code:sql]
INSERT INTO student (code, name, program) VALUES ('A00123456', 'Juan Pérez', 'Ingeniería de Sistemas');
INSERT INTO student (code, name, program) VALUES ('A00123457', 'María Gómez', 'Administración de Empresas');
INSERT INTO student (code, name, program) VALUES ('A00123458', 'Carlos Ramírez', 'Diseño de Medios Interactivos');
[endcode]
Debe esperar a que Spring Boot cree las tablas asi que debe agregar esta linea a su aplication.properties
[code:ini]
spring.jpa.defer-datasource-initialization=true
[endcode]
[st] Capa Repository con Spring Data JPA
Hibernate le permitirá acceso a consultas de sus bases de datos a través de `Repository`.
[code:java]
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {}
[endcode]