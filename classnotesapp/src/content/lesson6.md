[t] Three Layered architecture

[st] Introducción

En este punto, ya sabemos crear beans y conectarlos entre sí para construir una aplicación. Ahora vamos a reestructurar el proyecto para aplicar los conceptos de las capas Service y Repository, poniendo cada función en su lugar.

[st] Reestructuración del proyecto

Construye este esquema para organizar las capas:
[icon]image10.png|Esquema de capas Service y Repository


Nos falta aún la clase `CourseService`:
[code:java]
public class CourseService {
    private CourseRepository courseRepository;
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }
}
[endcode]

[st] Capas Repository y Service

Capa Repository

Asegúrate de que tu clase Repository tenga acceso bruto a los datos, tanto para almacenar como para obtener. Evita hacer validaciones aquí. Métodos típicos: `findAll()`, `findById()`, `save()`.


Capa Service

En las clases Service, haz las validaciones necesarias antes de usar las funciones de acceso a datos. Aquí se implementan reglas de negocio, como impedir operaciones no autorizadas. Métodos típicos: `getAll()`, `getById(id)`, `create(entity)`, `update(id, entity)`, `delete(id)`.

[st] Servlets para las entidades
[code:java]
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;

@WebServlet("/course")
public class CourseServlet extends HttpServlet {
    
}
[endcode]

[code:java]
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;

@WebServlet("/student")
public class StudentServlet extends HttpServlet {
    
}
[endcode]

[st] Definición de Beans con @Configuration

Puedes generar los beans y el wiring usando la anotación `@Configuration` en una clase donde se listan y conectan los beans.

[code:java]
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    ...
}
[endcode]

[st] Definición de Beans con @Bean
[code:java]
@Configuration
public class AppConfig {
    @Bean("miBean")
    @Scope("singleton") 
    public MiClase miObjeto() {
        return new MiClase();
    }
}
[endcode]

[st] Wiring de Beans en métodos @Bean
[code:java]
@Configuration
public class AppConfig {
    @Bean
    public StudentRepository studentRepository() {
        return new StudentRepository();
    }
    @Bean
    public StudentService studentService(StudentRepository studentRepository) {
        return new StudentService(studentRepository);
    }
}
[endcode]

[st] Cambiar el contexto de la aplicación
[code:java]
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Application {
    private static final ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
    public static ApplicationContext getContext() {
        return context;
    }
}
[endcode]

[st] Inicialización de Beans con initMethod
[code:java]
@Bean(initMethod="intialize")
public StudentRepository studentRepository() {
    return new StudentRepository();
}
[endcode]

[st] Definición de Beans con Anotaciones

Puedes usar la anotación `@Component` sobre la clase para definir un bean. Existen alias como `@Service` y `@Repository` para mayor semántica.

[code:java]
@Component
public class MiClaseA {
    ...
}
[endcode]

[code:java]
@Repository
public class CourseRepository {
    ...
}
[endcode]

[code:java]
@Service
public class CourseService {
    ...
}
[endcode]

[st] Wiring automático con anotaciones
[code:java]
@Repository
public class CourseRepository {
    ...
}

@Service
public class CourseService{
    private final CourseRepository courseRepository;
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }
}
[endcode]

[st] Inicialización con @PostConstruct
[code:java]
@PostConstruct
public void initializeData(){
    // Código de inicialización
}
[endcode]

[code:xml]
<dependency>
    <groupId>jakarta.annotation</groupId>
    <artifactId>jakarta.annotation-api</artifactId>
    <version>2.1.1</version>
</dependency>
[endcode]

[st] Funcionalidades desde el Servlet

Como estudiante quiero registrarme en el sistema proporcionando mi información personal, para poder utilizar la plataforma de matrícula.

Como estudiante quiero agregarme a un curso proporcionando su información para gestionar mi matrícula.

Como estudiante quiero ver todos mis cursos matriculados buscando por mi código para verificar mi inscripción y hacer seguimiento a mis materias.

Desde un Servlet podemos acceder al `ApplicationContext` de forma estática. 
