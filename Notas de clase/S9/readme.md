# Subamos a la capa de Repository

Vamos a ir con un ejemplo simple. Usaremos una base de datos en memoria llamada H2.

Para hacerlo necesitamos 2 dependencias

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

Primero debemos preparar nuestra clase de modelo

```java
public class Student {

    private int id;
    
    private String code;
    //Example: A00123456
    
    private String name;

    private String program;

    // Getters y setters

}
```

Para crear una tabla en base de datos a partir de la tabla Studentes hagamos

```java
@Entity
@Table(name = "student")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String code;
    //Example: A00123456

    private String name;

    private String program;

    // Getters y setters

}
```

`@Entity` establece la clase como una representación de tabla en base de datos. Por medio de `@Table` podemos elegir nombre para la tabla en base de datos.

`@Id` establece cuál va a ser la llave primaria y `@GeneratedValue` permite establecer que el campo se autoincremente en la medida en la que se insertan datos



# <a href="https://www.canva.com/design/DAGf2-v-kRc/2YqXLd9kaKBs7zMc3R_3UQ/edit?utm_content=DAGf2-v-kRc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton">Conceptos clave</a>

### Connection pool

HikariCP es un pool de conexiones altamente eficiente y ligero para bases de datos en Java. Su propósito es administrar un conjunto de conexiones reutilizables en lugar de abrir y cerrar conexiones cada vez que se realiza una consulta, lo que mejora el rendimiento y reduce la sobrecarga en la base de datos. Usar un pool de conexiones es crucial en aplicaciones con múltiples accesos concurrentes, ya que evita la latencia de crear conexiones repetidamente y reduce el consumo de recursos del servidor. 

> [!IMPORTANT]  
> HikariCP es conocido por su baja latencia, su administración inteligente de
> conexiones y su compatibilidad con JDBC, lo que lo convierte en una opción ideal
> para aplicaciones de alto rendimiento en entornos productivos.


### JPA

JPA (Jakarta Persistence API) es una especificación de Java que define una forma estándar de trabajar con bases de datos relacionales mediante el mapeo objeto-relacional (ORM). No es una implementación, sino un conjunto de reglas que deben seguir las librerías que lo implementan.

<p align="center">
<img src="https://raw.githubusercontent.com/Domiciano/Compunet2-251/refs/heads/main/Images/image13.png" width="512">
</p>


### ¿Qué es un ORM?

Un ORM (Object-Relational Mapping) es una técnica que permite interactuar con bases de datos relacionales usando objetos en lugar de consultas SQL directas. 

> [!IMPORTANT]  
> Un ORM mapea tablas a clases y filas a instancias de esas clases, facilitando la 
> manipulación de datos con código orientado a objetos. 

Esto mejora la legibilidad, reduce el código repetitivo y permite trabajar con diferentes bases de datos sin modificar la lógica de acceso a datos. Ejemplos populares de ORM en Java incluyen Hibernate.


### Hibernate

Hibernate es un framework de mapeo objeto-relacional (ORM) para Java que facilita la persistencia de datos en bases de datos relacionales. Proporciona una abstracción sobre JDBC y permite trabajar con bases de datos utilizando objetos de Java sin escribir SQL manualmente.


# Configuración de base de datos

Si está con H2 use
```properties
spring.application.name=IntroSpring

spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

spring.h2.console.enabled=true
spring.h2.console.path=/h2
```

Esta es una base de datos en memoria y aqui se almacenará la información

# Capa Repository
Ahora los repositorios lucirán así
```java
import co.edu.icesi.introspring.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {

}
```
En <A,B> A corresponde a la `Entity`y B corresponde al tipo de la llave primaria, en este caso `Integer`




# Integrando una base de datos relacional

Debe usar estos parámetros para la conexión con su base de datos postgres

```properties
spring.jpa.hibernate.ddl-auto=update
spring.datasource.username=USERNAME
spring.datasource.password=PASSWORD
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.url=jdbc:postgresql://ep-tight-violet-a5wloerb-pooler.us-east-2.aws.neon.tech/midb
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

`spring.jpa.hibernate.ddl-auto=update` permite que Hibernate actualice automáticamente la estructura de la base de datos (tablas, columnas) según los cambios en las entidades JPA sin perder datos existentes.


`spring.datasource.tomcat.max-active` define el número máximo de conexiones activas permitidas en el pool de conexiones de Tomcat para la base de datos.



# Relaciones entre tablas

Suponga que tiene una relación entre las entidades Curso y Profesor. Para configurar la relación usando JPA, las clases se verán así:

```java
import jakarta.persistence.*;

@Entity
@Table(name = "profesor")
public class Profesor {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private long id;

    private String name;

    @OneToMany(mappedBy = "profesor") //Nombre de la propiedad en la otra clase
    private List<Curso> cursos;
    
    //ToDo: Hacer Getters y Setters
}

```
Note que @OneToMany representa el 1 en el diagrama y @ManyToOne representa el *. Además @OneToMany en mappedBy se especifica el nombre del objeto de la clase relacionada, en @ManyToOne en su propiedad name se especifica el nombre del campo de la tabla donde se aloja la llave foránea.
```java
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

    //ToDo: Hacer Getters y Setters
}
```





# Reduciendo código repeitivo en Entities con Lombok

Usando esta dependencia, podemos escribir nuestras Entity más fácilmente

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>
```

Luego de la importación de la dependencia, nuestras entities pueden quedar así

```java
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
```

Donde `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor` y `@ToString` hacen parte de Lombok

# Docker

```yml
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
```