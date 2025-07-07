[t] Integración con Bases de Datos y JPA

[st] Introducción
[p]
Vamos a trabajar con una base de datos en memoria llamada H2 y veremos cómo integrar Spring Boot con JPA y un ORM para persistencia de datos.

[st] Dependencias necesarias
[c:xml]
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
[end]

[st] Modelo de datos
[c:java]
public class Student {
    private int id;
    private String code; // Ejemplo: A00123456
    private String name;
    private String program;
    // Getters y setters
}
[end]

[st] Entidad JPA
[c:java]
@Entity
@Table(name = "student")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String code;
    private String name;
    private String program;
    // Getters y setters
}
[end]

[st] Conceptos clave: Connection Pool y ORM
[p]
HikariCP es un pool de conexiones eficiente para bases de datos en Java. Permite reutilizar conexiones y mejorar el rendimiento en aplicaciones con múltiples accesos concurrentes.

JPA (Jakarta Persistence API) es una especificación para trabajar con bases de datos relacionales mediante mapeo objeto-relacional (ORM). Un ORM mapea tablas a clases y filas a instancias de esas clases, facilitando la manipulación de datos con código orientado a objetos.

[i]image14.png|ORM y JPA

Hibernate es un framework ORM para Java que facilita la persistencia de datos en bases de datos relacionales.

[st] Configuración de base de datos H2
[c:plain]
spring.application.name=IntroSpring
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
spring.h2.console.path=/h2
[end]

[st] Capa Repository con Spring Data JPA
[c:java]
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
}
[end]

[st] Configuración para base de datos PostgreSQL
[c:plain]
spring.jpa.hibernate.ddl-auto=update
spring.datasource.username=USERNAME
spring.datasource.password=PASSWORD
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.url=jdbc:postgresql://localhost:5432/DB
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
[end]

[st] Relaciones entre tablas con JPA
[c:java]
import jakarta.persistence.*;

@Entity
@Table(name = "profesor")
public class Profesor {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private long id;
    private String name;
    @OneToMany(mappedBy = "profesor")
    private List<Curso> cursos;
    // Getters y Setters
}
[end]

[c:java]
import jakarta.persistence.*;

@Entity
@Table(name = "curso")
public class Curso {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private long id;
    private String name;
    private String program;
    @ManyToOne
    @JoinColumn(name = "profeID")
    Profesor profesor;
    // Getters y Setters
}
[end]

[st] Reduciendo código repetitivo con Lombok
[c:xml]
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>
[end]

[c:java]
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "student")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String code;
    private String name;
    private String program;
}
[end]

[st] Usando Docker para la base de datos
[c:yml]
services:
  db:
    image: postgres:17
    restart: always
    environment:
      POSTGRES_DB: 'db'
      POSTGRES_USER: 'user'
      POSTGRES_PASSWORD: 'password'
    ports:
      - '5432:5432'
    expose:
      - '5432'
    volumes:
      - my-volume:/var/lib/postgresql/data

volumes:
  my-volume:
[end]

[p]
Para crear el contenedor ejecuta:
[c:sh]
docker-compose up -d
[end] 