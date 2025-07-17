[t] Wiring de Beans e Inyección de Dependencias en Spring

[st] Introducción

En Spring Boot, la inyección de dependencias es el mecanismo mediante el cual el framework administra y proporciona instancias de objetos (beans) a otras clases sin que estas tengan que crearlas manualmente. Este proceso, conocido como wiring de beans, permite definir cómo se relacionan y comunican los componentes dentro de la aplicación, asegurando un código más modular, reutilizable y fácil de mantener al reducir el acoplamiento entre las dependencias.

[icon]image8.png|Wiring de Beans

[st] Capas Repository y Service

La capa Repository es la encargada de acceder a los datos. Es la que se comunica con la base de datos, archivos o cualquier otro sistema de almacenamiento. En este ejemplo, usaremos una lista en memoria en lugar de una base de datos real. Más adelante, podríamos reemplazarla por JDBC, JPA o cualquier otro mecanismo sin cambiar la lógica de negocio.

Es el "almacén" de la aplicación, donde se guardan y recuperan datos.

La capa Service es la encargada de la lógica de negocio. Actúa como un intermediario entre el controlador (Controller, Servlet) y la capa Repository. Puede aplicar reglas de negocio antes de enviar los datos al Repository, como validaciones, transformaciones, lógica de negocio, gestión de transacciones o integración con otros servicios.

Es como el cerebro de la aplicación, que decide qué hacer antes de interactuar con los datos.

[icon]image9.png|Capas Service y Repository

[st] Ejemplo: Registro de Estudiantes y Cursos

Vamos a aplicar el wiring de beans para trabajar en una aplicación que gestione el registro de Estudiantes y sus Cursos.

[st] Clases principales
[c:java]
import java.util.List;

public class Student {
    private String code; // Ejemplo: A00123456
    private String name;
    private String program;
    private List<Course> courses;
    //Constructores, getters y setters
}
[end]

[c:java]
public class Course {
    private int id; // Ejemplo: 35
    private String name;
    private String professorName;
    private String schedule; // Ejemplo: "MI 07:00 08:59, VI 15:00 16:59"
    //Constructores, getters y setters
}
[end]

[st] Capa Repository
[c:java]
import java.util.ArrayList;
import java.util.List;

public class StudentRepository {
    private List<Student> students = new ArrayList<>();

    public List<Student> findAll() {
        return students;
    }

    public void save(Student student) {
        // Aquí vamos a requerir el uso de CourseRepository.
    }
}
[end]

[c:java]
import java.util.ArrayList;
import java.util.List;

public class CourseRepository {
    private List<Course> courses = new ArrayList<>();

    public List<Course> findAll() {
        return courses;
    }

    public void save(Course course) {
        courses.add(course);
    }
}
[end]

[st] Capa Service
[c:java]
import java.util.List;

public class StudentService {
    // ...
}
[end]

[st] Definición de Beans en el contexto Spring
[c:xml]
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--Repositorios-->
    <bean id="studentRepository" class="paquete.de.tu.proyecto.repositories.StudentRepository"/>
    <bean id="courseRepository" class="paquete.de.tu.proyecto.repositories.CourseRepository"/>

    <!--Service-->
    <bean id="studentService" class="paquete.de.tu.proyecto.services.StudentService"/>

</beans>
[end]

[icon]image7.png|Relación entre beans y capas

[st] Inyección de dependencias

Para lograr la relación entre beans, debe hacer inyección de dependencias. Puede hacerse mediante constructor o mediante método (setter).

[st] Inyección por constructor
[c:java]
public class ClaseA{
    // ...
}

public class ClaseB{
    private ClaseA objetoA;
    public ClaseB(ClaseA objetoA){
        this.objetoA = objetoA;
    }
}
[end]

[c:xml]
<bean id="objetoA" class="ClaseA"/>
<bean id="objetoB" class="ClaseB">
    <constructor-arg ref="objetoA"/>
</bean>
[end]

[st] Inyección por método (setter)
[c:java]
public class ClaseA {
    // ...
}

public class ClaseB {
    private ClaseA objetoA;
    public void setObjetoA(ClaseA objetoA){
        this.objetoA = objetoA;
    }
}
[end]

[c:xml]
<bean id="objetoA" class="ClaseA"/>
<bean id="objetoB" class="ClaseB">
    <property name="objetoA" ref="objetoA"/>
</bean>
[end]

[st] Inicialización y prueba

Puede usar métodos de inicialización en los beans. Por ejemplo:

[c:xml]
<bean id="objetoA" class="MiClaseA" init-method="initializeBean">
    <constructor-arg ref="objetoB"/>
</bean>
[end]

Aquí se ejecuta el método `initializeBean()` luego de que Spring Framework instancia los beans y hace el wiring.


Ejemplo de datos de prueba para inicializar:

[c:plain]
Estudiante 1
    A00111111 
    Andrea Rodriguez
    Ingeniería de Sistemas
    Cursos:
        Curso 1:
            59
            Computación en Internet 2
            Alejandro Muñoz
            MA 14:00 15:59, JU 14:00 15:59
        Curso 2:
            23
            Comunicación oral y escrita 2
            Andres García
            MI 14:00 15:59
        Curso 3:
            17
            Ingeniería de Software 4
            Gabriel Tamura
            MA 07:00 08:59, JU 07:00 08:59

Estudiante 2
    A00222222
    Blanca Gutiérrez
    Ingeniería de Sistemas
    Cursos:
        Curso 1:
            23
            Comunicación oral y escrita 2
            Andres García
            MI 14:00 15:59
        Curso 2:
            59
            Computación en Internet 2
            Alejandro Muñoz
            MA 14:00 15:59, JU 14:00 15:59

Estudiante 3
    A00333333
    Carlos Zapata
    Psicología
    Cursos:
        Curso 1:
            12
            Psicología Organizacional
            Saryth Valencia
            VI 11:00 13:00
        Curso 2:
            23
            Comunicación oral y escrita 2
            Andres García
            MI 14:00 15:59
[end]