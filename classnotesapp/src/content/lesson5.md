[t] Wiring de Beans e Inyección de Dependencias en Spring
[st] Inyección de dependencias
En Spring Boot, la inyección de dependencias es el mecanismo mediante el cual el framework administra y proporciona instancias de objetos (beans) a otras clases sin que estas tengan que crearlas manualmente. Este proceso, conocido como wiring de beans, permite definir cómo se relacionan y comunican los componentes dentro de la aplicación, asegurando un código más modular, reutilizable y fácil de mantener al reducir el acoplamiento entre las dependencias.
[icon]image8.png|Wiring de Beans
[st] Capa Repository 
La capa Repository es la encargada de acceder a los datos. Es la que se comunica con la base de datos, archivos o cualquier otro sistema de almacenamiento.
En este ejemplo, usaremos una lista en memoria en lugar de una base de datos real.
Más adelante, podríamos reemplazarla por JDBC, JPA o cualquier otro mecanismo sin cambiar la lógica de negocio.

💡 Es el `almacén` de la aplicación, donde se guardan y recuperan datos.
[st] Capa Service
La capa Service es la encargada de la lógica de negocio.
Actúa como un intermediario entre el controlador (Controller, Servlet) y la capa Repository.
Puede aplicar reglas de negocio antes de enviar los datos al Repository, como:
Validaciones de datos: Verificar que los datos cumplan ciertos criterios antes de guardarlos (por ejemplo, que un correo sea válido o que una cantidad no sea negativa). Transformación y normalización: Convertir datos a un formato adecuado antes de almacenarlos (por ejemplo, convertir textos a minúsculas o eliminar espacios en blanco).
[list]
Lógica de negocio: Implementar reglas específicas del dominio, como restricciones de compra o cálculos de impuestos.
Gestión de transacciones: Asegurar la consistencia de los datos mediante el manejo de transacciones.
Llamadas a otros servicios: Integrar información de otras fuentes o microservicios antes de interactuar con la base de datos.
[endlist]
💡 Es el cerebro de la aplicación, que decide qué hacer antes de interactuar con los datos.
[icon]image9.png|Capas Service y Repository
[st] Construyamos un ejemplo
Vamos a aplicar el wiring de beans para trabajar en una aplicación que gestione el registro de Estudiantes y sus Cursos.
[code:java]
import java.util.List;

public class Student {

    private String code;
    //Example: A00123456

    private String name;

    private String program;

    private List<Course> courses;

    //Constructors

    //Getters y setters
    
}
[endcode]
[code:java]
public class Course {
    
    private int id;
    //Example: 35

    private String name;
    
    private String professorName;
    
    private String schedule; 
    //Example: "MI 07:00 08:59, VI 15:00 16:59"

    //Constructors

    //Getters y setters

}
[endcode]
[st] 1. Creemos la capa de Repsository
Recordemos que la definición de las clases de la capa Repository hacen referencia a aquellas que nos dan acceso a datos. De momento no hemos visto persistencia de modo que simularemos el repository como un arreglo de elementos
[code:java]
import java.util.ArrayList;
import java.util.List;

public class StudentRepository {
    private List<Student> students = new ArrayList<>();

    public List<Student> findAll() {
        return students;
    }

    public void save(Student student) {
        // Queremos que se guarde el estudiante en su repositorio y todos sus cursos en otro repositorio
        // Separe los elementos a la entrada y guarde casa objeto en su lugar
        // Aquí vamos a requerir el uso de CourseRepository.
    }
}
[endcode]
Podemos tener un Repository por entidad, faltaría el repository de cursos
[code:java]
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
[endcode]
Debemos tener un Repository por entidad, faltaría el repository de cursos
[code:java]
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
[endcode]
[st] 2. Creemos un Service
Vamos a generar adicionalmente un bean de service que nos ayude a orquestar esto.
[code:java]
import java.util.List;

public class StudentService {

    ...

}
[endcode]
[st] 3. Hagamos el mise en place
[code:java]
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
[endcode]
[st] 4. Debemos configurar esta disposición
La idea es generar los beans y posteriormente conectarlos
[icon] image7.png
En la imagen aparece el bean courseRepository. Este bean no está contemplado para desarrollo. Sólo se pone allí para mostrar que cada Repositorio es usado por un Service aludiendo a la misma entidad.
[list]
Para lograrlo, debe hacer Inyección de dependencias
Puede hacerlo mediante Constructor
[endlist]
Se deben generar las clases y las dependencias. En este caso usamos la Agregación. En el ejemplo, supongamos que MiClaseB quiere usar los métodos de MiClaseA
[code:java]
public class ClaseA{
    ...
}

public class ClaseB{
    private ClaseA objetoA;

    public ClaseB(ClaseA objetoA){
        this.objetoA = objetoA;
    }
}
[endcode]
En el XML puede crear los objeto y definir las dependencias
[code:java]
<bean id="objetoA" class="ClaseA"/>

<bean id="objetoB" class="ClaseB">
    <constructor-arg ref="objetoA"/>
</bean>
[endcode]
[st] 4A. Alternativa: por medio de métodos
Es algo similar en donde también se usa la Agregación
[code:java]
public class ClaseA {
    ...
}

public class ClaseB {
    private ClaseA objetoA;

    public void setObjetoA(ClaseA objetoA){
        this.objetoA = objetoA;
    }
}
[endcode]
En el XML ahora se inyecta por medio de `property`
[code:java]
<bean id="objetoA" class="ClaseA"/>

<bean id="objetoB" class="ClaseB">
    <property name="objetoA" ref="objetoA"/>
</bean>
[endcode]
[st] 5. Inicializar y probar
Vamos a hacer uso de métodos de inicialización
[code:java]
<bean id="objetoA" class="MiClaseA" init-method="initializeBean">
    ...
</bean>
[endcode]
Aquí se ejecuta el método `initializeBean()` luego de que Spring Framework instancia los beans y hace el wiring
[icon] https://camo.githubusercontent.com/77831f0036320216811c0ec03de3254070ea11b293ea6e9260dd538ca6841c13/68747470733a2f2f6d69726f2e6d656469756d2e636f6d2f76322f726573697a653a6669743a313430302f302a5f44307959556464526c2d424f4c6971
[st] 6. Información a construir
[code:plain]
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
[endcode]
Al final de las inserciones, deben quedar 3 estudiantes y 4 materias