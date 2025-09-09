[t] Spring Data JPA: Paginación, Orden y Más
[st] Introducción
En la lección anterior, exploramos cómo crear consultas complejas basadas en los nombres de los métodos. Ahora, vamos a profundizar en funcionalidades más avanzadas que nos permitirán controlar la cantidad de resultados, el orden y cómo obtenerlos en "páginas".
[st] Limitando Resultados con `First` y `Top`
A veces, no necesitas todos los resultados que coinciden con una consulta, sino solo el primero o un número específico de ellos. Spring Data JPA lo hace muy fácil con las palabras clave `First` y `Top`.
[code:java]
package com.example.myapp.repository;

import com.example.myapp.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    // Obtiene el primer curso que encuentra ordenado por nombre ascendente
    Optional<Course> findFirstByOrderByNameAsc();

    // Obtiene los 2 cursos con más créditos
    List<Course> findTop2ByOrderByCreditsDesc();

    // Obtiene los 3 cursos del profesor "Juan Perez"
    List<Course> findFirst1ByProfessor_Name(String professorName);
}
[endcode]
*   `findFirst...`: Devuelve un solo objeto, idealmente envuelto en un `Optional`.
*   `findTopN...`: Devuelve una `List` con un máximo de `N` resultados.
Basado en nuestro `data.sql`, `findTop2ByOrderByCreditsDesc()` devolvería "Anatomia Humana" y "Fisiologia", ambos con 5 créditos.
[st] Consultas de Rango con `Between`
Ya lo vimos brevemente en los ejercicios, pero `Between` es muy útil para buscar dentro de un rango, aplicable a números, fechas y cadenas.

[code:java]
// En CourseRepository
// Encuentra cursos cuyos créditos estén entre 3 y 4
List<Course> findByCreditsBetween(int minCredits, int maxCredits);
[endcode]
Al llamar a `courseRepository.findByCreditsBetween(3, 4)`, obtendríamos una lista de cursos que incluye "Derecho Penal", "Derecho Civil", "Historia del Arte", "Introducción a la Programación" y "Estructuras de Datos".
[st] Ordenamiento Explícito con `OrderBy`
Aunque `First` y `Top` a menudo se combinan con `OrderBy`, esta última se puede usar de forma independiente para garantizar que los resultados de cualquier consulta vengan en un orden predecible.

[code:java]
// En CourseRepository

// Encuentra todos los cursos de un profesor, ordenados por nombre del curso de forma descendente
List<Course> findByProfesorNameOrderByNameDesc(String professorName);

// Encuentra todos los cursos con 4 créditos, ordenados por nombre ascendente
List<Course> findByCreditsOrderByNameAsc(int credits);
[endcode]

[st] Paginación con `Pageable`
Para aplicaciones reales, devolver cientos o miles de resultados en una sola consulta es ineficiente y poco práctico. La solución es la paginación: devolver un subconjunto de resultados (una "página") a la vez. Spring Data JPA lo integra de manera brillante a través de la interfaz `Pageable`.

[st] 1. Modificar el Repositorio
Para habilitar la paginación, simplemente añade un parámetro de tipo `Pageable` al final de tu método de consulta. El tipo de retorno debe cambiar de `List<T>` a `Page<T>`.

[code:java]
package com.example.myapp.repository;

import com.example.myapp.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    // Encuentra todos los cursos de un programa y devuelve los resultados paginados
    Page<Course> findByProfesorName(String professorName, Pageable pageable);
}
[endcode]

El objeto `Page` no solo contiene la lista de cursos para la página solicitada, sino también información total sobre la consulta: número total de elementos, número total de páginas, si es la primera o la última página, etc.

[st] 2. Solicitar una Página
En tu servicio o controlador, ahora puedes solicitar una página específica de datos. Para ello, se crea una instancia de `Pageable` usando `PageRequest.of()`.

[code:java]
package com.example.myapp.services;

import com.example.myapp.model.Course;
import com.example.myapp.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public Page<Course> getCoursesByProfessor(String professorName, int page, int size) {
        // Crea un objeto Pageable para solicitar una página específica.
        // page: número de la página (base 0)
        // size: tamaño de la página
        // Sort: opcional, para ordenar los resultados
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());

        return courseRepository.findByProfesorName(professorName, pageable);
    }
}
[endcode]

[st] 3. Exponerlo en un Controlador
Un controlador podría recibir los parámetros de página y tamaño desde la URL.

[code:java]
package com.example.myapp.controllers;

import com.example.myapp.model.Course;
import com.example.myapp.services.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/courses/by-professor")
    public Page<Course> getCourses() {
        return courseService.getCoursesByProfessor("Juan Perez", 0, 3);
    }
}
[endcode]


