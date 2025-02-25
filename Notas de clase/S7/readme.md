# Springboot

Spring Boot es una extensión de Spring Framework que simplifica la creación de aplicaciones Spring al eliminar la configuración manual extensa. Proporciona configuraciones automáticas, un servidor embebido y convenciones predeterminadas para acelerar el desarrollo, manteniendo la flexibilidad y potencia de Spring.

# Creación del primer proyecto

En IntelliJ, cree un nuevo proyecto

<p align="center">
<img src="https://raw.githubusercontent.com/Domiciano/Compunet2-251/refs/heads/main/Images/image11.png" width="512">
</p>

Usemos Maven en la sección de type.

<p align="center">
<img src="https://raw.githubusercontent.com/Domiciano/Compunet2-251/refs/heads/main/Images/image12.png" width="512">
</p>

Vamos a agregar las dependencias por nuestra cuenta usando el `pom.xml`, así que le damos a **Create**

# Verificación de la clase principal

En la clase principal puede ver la anotación `@SpringBootApplication`, que combina `@SpringBootConfiguration`, `@EnableAutoConfiguration` y `@ComponentScan`. 

`@SpringBootConfiguration` Indica que la clase es una fuente de configuración para la aplicación (similar a @Configuration en Spring).

`@EnableAutoConfiguration` Activa la configuración automática basada en las dependencias presentes en el classpath. Crea los beans necesarios que de otro modo habría que configurar manualmente como el servidor web, el acceso a bases de datos, el manejo de seguridad, etc.

`@ComponentScan` escanea los beans presentes en el paquete principal y los crea

El código de inicio es

```java
@SpringBootApplication
public class IntroSpringApplication {

    public static void main(String[] args) {
        SpringApplication.run(IntroSpringApplication.class, args);
    }
    
}
```

Usted puede también usar `@PostConstruct` en esta clase para generar un método inicial de toda la aplicación

```java
@SpringBootApplication
public class IntroSpringApplication {

    public static void main(String[] args) {
        SpringApplication.run(IntroSpringApplication.class, args);
    }
    
    @PostConstruct
    public void init() {
        
    }

}
```

# Dependencia de Web

Vamos a agregar la dependencia web en el `pom.xml`

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

Con esto podemos incluir nuestra capa de **controller**

# Creación de su primer controller

Finalmente ya podemos construir nuestros **endpoints** por medio de las anotaciones de `spring-boot-starter-web`.

```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/students")
public class StudentController {

    @GetMapping("/all")
    @ResponseBody
    public String index() {
        return "Aqui hay unos estudiantes";
    }

}
```

En este caso observemos que podemos crear un grupo de endpoints cuyo bloque de código se ejecutará en el momento en el que un cliente HTTP vaya a la ruta configurada.

Con `@RequestMapping` configuramos la ruta del controller que será prefijo para cada endpoint que contenga `StudentController`. 

Luego, por medio de `@GetMapping` se configura tanto la ruta al endpoint como el `HTTP Verb` con el que se podrá acceder.

Este endpoint se podrá acceder por medio de

```
http://localhost:8080/students/all
```

# Desacoplando las capas

Para desacoplar las capas `Controller`, `Service` y `Repository` hará falta el uso de interfaces.

Por ejemplo entre Controller y Service, será una buena práctica que Controller acceda únicamente a la definición (una interfaz) y el programador elija la implementación (clase que implementa la interfaz).

### Definición de StudentService
```java
public interface StudentService {
    void createStudent(Student student);
    void getAllStudents();
}
```
### Implementación de StudentService
```java
@Service
public class StudentServiceImpl implements StudentService {

    @Override
    public void createStudent(Student student) {

    }

    @Override
    public void getAllStudents() {

    }

}
```

De esta manera entonces 

¿Cómo hacemos wiring de los beans?


# Wiring de beans cuando tenemos desacoplamiento

En este caso nuestro `Controller` tiene una dependencia con `Service`. Así que nuestro controller puede recibirlo en su constructor

> [!IMPORTANT]  
> Note que se usa `@Qualifer` para especificar cuál es el bean de implementación del servicio

```java
private StudentService studentService

StudentController(@Qualifier("studentServiceImpl") StudentService studentService){
    this.studentService = studentService
}
```

Si no quiere usar el constructor, también puede hacer el wiring de los beans usando `@Autowired` e igualmente con `@Qualifier`


```java
@Autowired
@Qualifier("studentServiceImpl")
private StudentService studentService;
```

Con la segunda por ejemplo, la capa controller quedaría

```java

@Controller
@RequestMapping("/students")
public class StudentController {

    @Autowired
    @Qualifier("studentServiceImpl")
    private StudentService studentService;


    @GetMapping("/all")
    @ResponseBody
    public String index() {
        return "Aqui hay unos estudiantes";
    }

}
```

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
