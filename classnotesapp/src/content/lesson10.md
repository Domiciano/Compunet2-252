[t] Desacoplamiento en la Capa de Servicio

[st] ¿Por qué usar interfaces en la capa de servicio?

Usar interfaces en la capa de servicio es una práctica recomendada que promueve el desacoplamiento entre la lógica de negocio y la capa de presentación (controladores). Esto significa que los cambios en la implementación de la lógica de negocio no afectarán a los controladores, siempre y cuando la interfaz no cambie.

[st] Ejemplo: Servicio de Estudiantes

Vamos a crear un servicio para gestionar estudiantes. Primero, definimos la interfaz `StudentService`:

[code:java]
package com.example.myapp.services;

import com.example.myapp.model.Student;
import java.util.List;

public interface StudentService {
    List<Student> getAllStudents();
    Student getStudentById(String id);
    void saveStudent(Student student);
}
[endcode]

Esta interfaz define los métodos que cualquier implementación de `StudentService` debe proporcionar.

[st] Implementación del Servicio

Ahora, creamos una clase que implemente la interfaz `StudentService`. Esta clase contendrá la lógica de negocio real.

[code:java]
package com.example.myapp.services;

import com.example.myapp.model.Student;
import com.example.myapp.repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student getStudentById(String id) {
        return studentRepository.findById(id).orElse(null);
    }

    @Override
    public void saveStudent(Student student) {
        studentRepository.save(student);
    }
}
[endcode]

En esta implementación, inyectamos `StudentRepository` para interactuar con la base de datos. La anotación `@Service` le dice a Spring que esta clase es un bean de servicio.

[st] Uso en el Controlador

Finalmente, en el controlador, inyectamos la interfaz `StudentService`, no la implementación:

[code:java]
package com.example.myapp.controllers;

import com.example.myapp.model.Student;
import com.example.myapp.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/students/{id}")
    public Student getStudentById(@PathVariable String id) {
        return studentService.getStudentById(id);
    }
}
[endcode]

Al inyectar la interfaz, el controlador no depende de la implementación concreta. Esto nos permite cambiar la implementación de `StudentService` en el futuro (por ejemplo, para usar una base de datos diferente o para añadir caching) sin tener que modificar el controlador.

[st] Seleccionando una implementación con @Qualifier

¿Qué pasa si tenemos más de una implementación de la misma interfaz? Spring no sabrá cuál inyectar y lanzará un error. Para resolver esto, podemos usar la anotación `@Qualifier`.

Supongamos que tenemos otra implementación de `StudentService` que obtiene los datos de un archivo CSV:

[code:java]
package com.example.myapp.services;

import com.example.myapp.model.Student;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("studentServiceCsv")
public class StudentServiceCsvImpl implements StudentService {

    @Override
    public List<Student> getAllStudents() {
        // Lógica para leer estudiantes de un archivo CSV
        return null;
    }

    @Override
    public Student getStudentById(String id) {
        // Lógica para obtener un estudiante de un archivo CSV
        return null;
    }

    @Override
    public void saveStudent(Student student) {
        // Lógica para guardar un estudiante en un archivo CSV
    }
}
[endcode]

Note que hemos dado un nombre al bean `@Service("studentServiceCsv")`. Por defecto, el nombre del bean es el nombre de la clase con la primera letra en minúscula (`studentServiceImpl`).

Ahora, en el controlador, podemos usar `@Qualifier` para especificar qué implementación queremos inyectar:

[code:java]
package com.example.myapp.controllers;

import com.example.myapp.model.Student;
import com.example.myapp.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class StudentController {

    @Autowired
    @Qualifier("studentServiceImpl")
    private StudentService studentService;

    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/students/{id}")
    public Student getStudentById(@PathVariable String id) {
        return studentService.getStudentById(id);
    }
}
[endcode]

De esta manera, podemos tener múltiples implementaciones de la misma interfaz y seleccionar la que necesitemos en cada caso.