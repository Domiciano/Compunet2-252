[t] Introducción

[st] ¿Qué es Spring Boot?
[p]
Spring Boot es una extensión de Spring Framework que simplifica la creación de aplicaciones Spring al eliminar la configuración manual extensa. Proporciona configuraciones automáticas, un servidor embebido y convenciones predeterminadas para acelerar el desarrollo, manteniendo la flexibilidad y potencia de Spring.

[st] Creación del primer proyecto
[p]
En IntelliJ, cree un nuevo proyecto:
[icon]image11.png|Creación de proyecto Spring Boot en IntelliJ

[p]
Use Maven en la sección de type:
[icon]image12.png|Selección de Maven para el proyecto

[p]
Agregue las dependencias manualmente en el `pom.xml` y haga clic en **Create**.

[st] Clase principal y anotaciones
[p]
En la clase principal puede ver la anotación `@SpringBootApplication`, que combina `@SpringBootConfiguration`, `@EnableAutoConfiguration` y `@ComponentScan`.

- `@SpringBootConfiguration`: Indica que la clase es una fuente de configuración para la aplicación (similar a @Configuration en Spring).
- `@EnableAutoConfiguration`: Activa la configuración automática basada en las dependencias presentes en el classpath.
- `@ComponentScan`: Escanea los beans presentes en el paquete principal y los crea.

[c:java]
@SpringBootApplication
public class IntroSpringApplication {
    public static void main(String[] args) {
        SpringApplication.run(IntroSpringApplication.class, args);
    }
}
[end]

[p]
Puede usar `@PostConstruct` en esta clase para inicializar la aplicación:
[c:java]
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
[end]

[st] Agregar la dependencia web
[c:xml]
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
[end]

[st] Creación de un Controller
[p]
Con la dependencia web, puede crear endpoints usando anotaciones de `spring-boot-starter-web`.
[c:java]
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
[end]

[p]
Con `@RequestMapping` configura la ruta del controller como prefijo para los endpoints. Con `@GetMapping` configura la ruta y el verbo HTTP. El endpoint será accesible en:

`http://localhost:8080/students/all`

[st] Desacoplando las capas con interfaces
[p]
Para desacoplar las capas Controller, Service y Repository, es buena práctica que el Controller acceda a una interfaz y el programador elija la implementación.

[c:java]
public interface StudentService {
    void createStudent(Student student);
    List<Student> getAllStudents();
}
[end]

[c:java]
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
[end]

[st] Wiring de beans con interfaces y @Qualifier
[p]
El Controller puede recibir la implementación del Service por constructor o por campo usando `@Autowired` y `@Qualifier`.

[c:java]
private StudentService studentService;

StudentController(@Qualifier("studentServiceImpl") StudentService studentService){
    this.studentService = studentService;
}
[end]

[c:java]
@Autowired
@Qualifier("studentServiceImpl")
private StudentService studentService;
[end]

[p]
Ejemplo de uso en el Controller:
[c:java]
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
[end] 