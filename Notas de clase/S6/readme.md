# Separación de responsabilidades

Para este punto, sabemos las definiciones de cada capa. Usamos en la sesión pasada el Service como punto de entrada para generar los datos iniciales.



Ahora vamos a generar los datos desde un `Servlet` que use el ApplicationContext

Vamos a poner cada función en su lugar.


### CAPA REPOSITORY
> Asegúrese de que su clase de tipo Repository tenga acceso bruto a los datos, tanto para funciones de almacenar como para funciones de obtener.

En esta capa, vamos a evitar hacer validaciones. Métodos típicos que podemos encontrar en esta capa `findAll()`, `findById()`, `save()`

### CAPA SERVICE
> En sus clases de tipo Service, haga las validaciones necesarias antes de usar las funciones brutas de acceso a datos

En esta capa, vamos a hacer validaciones de negocio, previas a modificar u obtener datos de la capa de Repository. Por ejemplo, si llega una petición de eliminación de alguna entidad NO AUTORIZADA, entonces la capa de service contiene el intento y emite un error.

Métodos típicos que podemos encontrar en esta capa `getAll()`, `getById(id)`, `create(entity)`, `update(id, entity)`, `delete(id)`.



# Reestructuración del proyecto

Nos falta aún la clase `CourseService`

```java
public class CourseService {

    private CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

}
```
Una vez la tenga construya este esquema

<p align="center">
    <img src="https://raw.githubusercontent.com/Domiciano/Compunet2-251/refs/heads/main/Images/image10.png" width="512">
</p>


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


En la capa de servlets, desarrollemos:

> Como estudiante quiero registrarme en el sistema proporcionando mi información personal, para poder utilizar la plataforma de matrícula.

> Como estudiante quiero agregarme a un curso proporcionando su información para gestionar mi matrícula.

> Como estudiante quiero ver todos mis cursos matriculados buscando por mi código para verificar mi inscripción y hacer seguimiento a mis materias.


Desde un **Servlet** podemos acceder al `ApplicationContext` de forma estática


# Por medio de @Configuration

Vamos a refactorizar (o bien puede clonar su base de código) de modo que trabajemos con las anotaciones @Configuration y @Bean

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

```java
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = "paquete.de.mi.proyecto")
public class AppConfig {
    ...
}
```

Usar `@Bean` dentro de `AppConfig`

```java
@Bean("miBean")
@Scope("singleton") 
public MiClase miObjeto() {
    return new MiClase();
}
```
Donde `miBean` es el nombre del bean. Si no especificamos nombre, el bean quedaría llamado `miObjeto` que corresponde al nombre el método

# Anotaciones
Vamos a volver a factorizar el código de modo que usemos ahora `@Component`. `@Service` y `@Repository` son sólo nombres o alias que recibe @Component, para ser más específico en la semántica

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

@ComponentScan(basePackages = "paquete.de.mi.proyecto")
public class Application {
    private static final ApplicationContext context = new AnnotationConfigApplicationContext("org.example.app");

    public static ApplicationContext getContext() {
        return context;
    }
}
```

