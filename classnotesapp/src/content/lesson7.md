[t] Introducción
[st] ¿Qué es Spring Boot?
Spring Boot es una extensión de Spring Framework que simplifica la creación de aplicaciones Spring al eliminar la configuración manual extensa. Proporciona configuraciones automáticas, un servidor embebido y convenciones predeterminadas para acelerar el desarrollo, manteniendo la flexibilidad y potencia de Spring.

[st] Creación del primer proyecto

En IntelliJ, cree un nuevo proyecto:
[icon]image11.png|Creación de proyecto Spring Boot en IntelliJ


Use Maven en la sección de type:
[icon]image12.png|Selección de Maven para el proyecto


Agregue las dependencias manualmente en el `pom.xml` y haga clic en **Create**.

[st] Clase principal y anotaciones

En la clase principal puede ver la anotación `@SpringBootApplication`, que combina `@SpringBootConfiguration`, `@EnableAutoConfiguration` y `@ComponentScan`.

- `@SpringBootConfiguration`: Indica que la clase es una fuente de configuración para la aplicación (similar a @Configuration en Spring).
- `@EnableAutoConfiguration`: Activa la configuración automática basada en las dependencias presentes en el classpath.
- `@ComponentScan`: Escanea los beans presentes en el paquete principal y los crea.

[code:java]
@SpringBootApplication
public class IntroSpringApplication {
    public static void main(String[] args) {
        SpringApplication.run(IntroSpringApplication.class, args);
    }
}
[endcode]


Puede usar `@PostConstruct` en esta clase para inicializar la aplicación:
[code:java]
@SpringBootApplication
public class IntroSpringApplication {
    public static void main(String[] args) {
        SpringApplication.run(IntroSpringApplication.class, args);
    }
    @PostConstruct
    public void init() {
        // Código de inicialización
    }
}
[endcode]

[st] Agregar la dependencia web
[code:xml]
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
[endcode]

[st] Creación de un Controller

Con la dependencia web, puede crear endpoints usando anotaciones de `spring-boot-starter-web`.
[code:java]
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
[endcode]


Con `@RequestMapping` configura la ruta del controller como prefijo para los endpoints. Con `@GetMapping` configura la ruta y el verbo HTTP. El endpoint será accesible en:

`http://localhost:8080/students/all`

[st] Desacoplando las capas con interfaces

Para desacoplar las capas Controller, Service y Repository, es buena práctica que el Controller acceda a una interfaz y el programador elija la implementación.

[code:java]
public interface StudentService {
    void createStudent(Student student);
    List<Student> getAllStudents();
}
[endcode]

[code:java]
@Service
public class StudentServiceImpl implements StudentService {
    @Override
    public void createStudent(Student student) {
        // Implementación
    }
    @Override
    public List<Student> getAllStudents() {
        // Implementación
        return null;
    }
}
[endcode]

[st] Wiring de beans con interfaces y @Qualifier

El Controller puede recibir la implementación del Service por constructor o por campo usando `@Autowired` y `@Qualifier`.

[code:java]
private StudentService studentService;

StudentController(@Qualifier("studentServiceImpl") StudentService studentService){
    this.studentService = studentService;
}
[endcode]

[code:java]
@Autowired
@Qualifier("studentServiceImpl")
private StudentService studentService;
[endcode]


Ejemplo de uso en el Controller:
[code:java]
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
[endcode]