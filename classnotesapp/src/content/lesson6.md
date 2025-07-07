[t] Three Layered architecture

[st] Introducción
[p]
En este punto, ya sabemos crear beans y conectarlos entre sí para construir una aplicación. Ahora vamos a reestructurar el proyecto para aplicar los conceptos de las capas Service y Repository, poniendo cada función en su lugar.

[st] Reestructuración del proyecto
[p]
Construye este esquema para organizar las capas:
[icon]image10.png|Esquema de capas Service y Repository

[p]
Nos falta aún la clase `CourseService`:
[c:java]
public class CourseService {
    private CourseRepository courseRepository;
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }
}
[end]

[st] Capas Repository y Service
[p]
Capa Repository
[p]
Asegúrate de que tu clase Repository tenga acceso bruto a los datos, tanto para almacenar como para obtener. Evita hacer validaciones aquí. Métodos típicos: `findAll()`, `findById()`, `save()`.

[p]
Capa Service
[p]
En las clases Service, haz las validaciones necesarias antes de usar las funciones de acceso a datos. Aquí se implementan reglas de negocio, como impedir operaciones no autorizadas. Métodos típicos: `getAll()`, `getById(id)`, `create(entity)`, `update(id, entity)`, `delete(id)`.

[st] Servlets para las entidades
[c:java]
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;

@WebServlet("/course")
public class CourseServlet extends HttpServlet {
    
}
[end]

[c:java]
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;

@WebServlet("/student")
public class StudentServlet extends HttpServlet {
    
}
[end]

[st] Definición de Beans con @Configuration
[p]
Puedes generar los beans y el wiring usando la anotación `@Configuration` en una clase donde se listan y conectan los beans.

[c:java]
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    ...
}
[end]

[st] Definición de Beans con @Bean
[c:java]
@Configuration
public class AppConfig {
    @Bean("miBean")
    @Scope("singleton") 
    public MiClase miObjeto() {
        return new MiClase();
    }
}
[end]

[st] Wiring de Beans en métodos @Bean
[c:java]
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
[end]

[st] Cambiar el contexto de la aplicación
[c:java]
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Application {
    private static final ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
    public static ApplicationContext getContext() {
        return context;
    }
}
[end]

[st] Inicialización de Beans con initMethod
[c:java]
@Bean(initMethod="intialize")
public StudentRepository studentRepository() {
    return new StudentRepository();
}
[end]

[st] Definición de Beans con Anotaciones
[p]
Puedes usar la anotación `@Component` sobre la clase para definir un bean. Existen alias como `@Service` y `@Repository` para mayor semántica.

[c:java]
@Component
public class MiClaseA {
    ...
}
[end]

[c:java]
@Repository
public class CourseRepository {
    ...
}
[end]

[c:java]
@Service
public class CourseService {
    ...
}
[end]

[st] Wiring automático con anotaciones
[c:java]
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
[end]

[st] Inicialización con @PostConstruct
[c:java]
@PostConstruct
public void initializeData(){
    // Código de inicialización
}
[end]

[c:xml]
<dependency>
    <groupId>jakarta.annotation</groupId>
    <artifactId>jakarta.annotation-api</artifactId>
    <version>2.1.1</version>
</dependency>
[end]

[st] Funcionalidades desde el Servlet
[p]
Como estudiante quiero registrarme en el sistema proporcionando mi información personal, para poder utilizar la plataforma de matrícula.

Como estudiante quiero agregarme a un curso proporcionando su información para gestionar mi matrícula.

Como estudiante quiero ver todos mis cursos matriculados buscando por mi código para verificar mi inscripción y hacer seguimiento a mis materias.

Desde un Servlet podemos acceder al `ApplicationContext` de forma estática. 