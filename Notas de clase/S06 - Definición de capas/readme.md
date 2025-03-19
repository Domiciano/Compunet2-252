# Separación de responsabilidades

Para este punto, sabemos crear beans y conectarlos entre sí con la finalidad de hacer una aplicación. Vamos a reestructurar el proyecto, de modo que ahora podamos aplicar los conceptos de las capas **Service** y  **Repository**

Vamos a poner cada función en su lugar.

# Reestructuración del proyecto

Construye este esquema

<p align="center">
    <img src="https://raw.githubusercontent.com/Domiciano/Compunet2-251/refs/heads/main/Images/image10.png" width="512">
</p>

Nos falta aún la clase `CourseService`

```java
public class CourseService {
    
    private CourseRepository courseRepository;
    
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }
    
}
```

### CAPA REPOSITORY
> Asegúrese de que su clase de tipo Repository tenga acceso bruto a los datos, tanto para funciones de almacenar como para funciones de obtener.

En esta capa, vamos a evitar hacer validaciones. Métodos típicos que podemos encontrar en esta capa `findAll()`, `findById()`, `save()`

### CAPA SERVICE
> En sus clases de tipo Service, haga las validaciones necesarias antes de usar las funciones brutas de acceso a datos

En esta capa, vamos a hacer validaciones de negocio, previas a modificar u obtener datos de la capa de Repository. Por ejemplo, si llega una petición de eliminación de alguna entidad NO AUTORIZADA, entonces la capa de service contiene el intento y emite un error.

Métodos típicos que podemos encontrar en esta capa `getAll()`, `getById(id)`, `create(entity)`, `update(id, entity)`, `delete(id)`.


### SERVLET/JSP

Construya el Servlet de Course

```java
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;

@WebServlet("/course")
public class CourseServlet extends HttpServlet {
    
}
```

Construya el Servlet de Student

```java
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;

@WebServlet("/student")
public class StudentServlet extends HttpServlet {
    
}
```



# @Configuration

Vamos a explorar las forma en las que se pueden generar los beans y el wiring. Esta primera forma es por medio de `@Configuration`.

Básicamente es una clase marcada con esta anotación en donde vamos a listar todos los Beans y a conectarlos.

```java
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    ...
}
```


### Definición de Beans

Usar `@Bean` dentro de `AppConfig`

```java
@Configuration
public class AppConfig {
    
    @Bean("miBean")
    @Scope("singleton") 
    public MiClase miObjeto() {
        return new MiClase();
    }

}
```
Donde `miBean` es el nombre del bean. Si no especificamos nombre, el bean quedaría llamado `miObjeto` que corresponde al nombre el método

### Wiring

Podemos hacer un Wiring de los beans por medio de entradas en el método de declaración de Bean

```java
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
```


Debemos también cambiar la forma en la que definimos el contexto

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Application {

    private static final ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

    public static ApplicationContext getContext() {
        return context;
    }
}
```

### Inicialización
Si requiere algún método de inicialización de un bean, puede usar la propiedad `initMethod` de la etiquieta `@Bean`

```java
@Bean(initMethod="intialize")
public StudentRepository studentRepository() {
    return new StudentRepository();
}
```

# Anotaciones
Vamos a volver a factorizar el código de modo que usemos ahora `@Component`. `@Service` y `@Repository` son sólo nombres o alias que recibe @Component, para ser más específico en la semántica

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Application {
    private static final ApplicationContext context = new AnnotationConfigApplicationContext("org.example"); //Paquete raiz

    public static ApplicationContext getContext() {
        return context;
    }
}
```

Luego de esto puede definiri cualquier bean, por medio de la anotación `@Component` sobre la clase

```java
@Component
public class MiClaseA {
    ...
}
```

Hay `@Component` con alias específicos para las capas como `@Repository` y `@Service`

```java
@Repository
public class CourseRepository {
    ...
}
```

```java
@Service
public class CourseService {
    ...
}
```

### Wiring
Automáticamente con las anotaciones se hará wiring siempre y cuando tenga definida la inyección de dependencias por medio de constructor

```java
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
```
En este caso, como courseRepository es un `Bean` que está siendo inyectado, automáticamente el spring context lo creará y lo inyectará


### Inicialización
El equivalente a init-method en esta forma de declaración de beans es por medio de un método marcado con @PostConstruct
```java
@PostConstruct
public void initializeData(){

}
```
Necesitará la dependencia

```xml
<dependency>
    <groupId>jakarta.annotation</groupId>
    <artifactId>jakarta.annotation-api</artifactId>
    <version>2.1.1</version>
</dependency>
```


# Funcionalidades

En la capa de servlets, desarrollemos:

> Como estudiante quiero registrarme en el sistema proporcionando mi información personal, para poder utilizar la plataforma de matrícula.

> Como estudiante quiero agregarme a un curso proporcionando su información para gestionar mi matrícula.

> Como estudiante quiero ver todos mis cursos matriculados buscando por mi código para verificar mi inscripción y hacer seguimiento a mis materias.


Desde un **Servlet** podemos acceder al `ApplicationContext` de forma estática

