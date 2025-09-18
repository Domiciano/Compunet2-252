[t] Navegación Dinámica: De una Lista a una Vista de Detalle
[st] El Escenario Común: Lista y Detalle
Una de las funcionalidades más comunes en aplicaciones web es mostrar una lista de elementos (como productos, usuarios o, en nuestro caso, estudiantes) y permitir al usuario hacer clic en uno de ellos para ver una página con información detallada.

Vamos a construir esto paso a paso con Spring Boot y Thymeleaf.

El flujo es el siguiente:
1.  Página de Lista: Un usuario visita `/students`. El controlador busca todos los estudiantes y los muestra en una plantilla.
2.  Navegación: En la lista, cada nombre de estudiante es un enlace que apunta a una URL única, como `/students/1`, `/students/2`, etc.
3.  Página de Detalle: Al hacer clic en un enlace, el controlador intercepta la URL, extrae el ID del estudiante, busca la información de *ese* estudiante en específico y la muestra en una nueva plantilla de detalle.

[st] Paso 1: El Controlador para la Lista
Primero, modificamos el controlador que muestra la lista. La clave es generar un enlace (`<a>`) para cada estudiante en el bucle `th:each`.

Usaremos `th:href` junto con la expresión `@{...}` para construir una URL dinámica que incluya el ID del estudiante.

Plantilla de Lista (`student-list.html`)
[code:html]
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Lista de Estudiantes</title>
</head>
<body>
    <h2>Lista de Estudiantes</h2>
    <table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Programa</th>
            </tr>
        </thead>
        <tbody>
            <!-- Iteramos sobre la lista de estudiantes -->
            <tr th:each="student : ${studentsList}">
                <td>
                    <!-- Creamos un enlace dinámico a la página de detalle -->
                    <a th:href="@{/students/{id}(id=${student.id})}" th:text="${student.name}">
                        Nombre del Estudiante
                    </a>
                </td>
                <td th:text="${student.program}">Programa</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
[endcode]

Análisis de `th:href`:
- `@{/students/{id}(id=${student.id})}`: Esta es la sintaxis de Thymeleaf para construir URLs.
- `/students/{id}`: Es la plantilla de la URL que queremos crear.
- `(id=${student.id})`: Aquí es donde Thymeleaf reemplaza el placeholder `{id}` con el valor real de `student.id` para cada estudiante en la iteración. El resultado será, por ejemplo, `/students/1`, `/students/2`, etc.

[st] Paso 2: El Controlador para la Vista de Detalle
Ahora, necesitamos un método en nuestro controlador que pueda manejar estas nuevas URLs (`/students/{id}`). Usamos la anotación `@PathVariable` para capturar el valor del ID desde la URL.

Controlador (`StudentController.java`)
[code:java]
@Controller
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentService studentService; // Suponemos que tenemos un servicio

    // Método para mostrar la lista completa
    @GetMapping
    public String listStudents(Model model) {
        // studentService.findAll() devolvería la lista de todos los estudiantes
        model.addAttribute("studentsList", studentService.findAll());
        return "student-list"; // Renderiza student-list.html
    }

    // ¡NUEVO! Método para mostrar el detalle de un estudiante
    @GetMapping("/{id}")
    public String studentDetail(@PathVariable("id") Long studentId, Model model) {
        // 1. Capturamos el ID de la URL con @PathVariable.
        // 2. Usamos el ID para buscar un único estudiante en el servicio.
        Student student = studentService.findById(studentId);
        
        // 3. Agregamos el estudiante encontrado al modelo.
        model.addAttribute("student", student);
        
        // 4. Renderizamos una nueva plantilla para los detalles.
        return "student-detail"; // Renderiza student-detail.html
    }
}
[endcode]

[st] Paso 3: La Plantilla para la Vista de Detalle
Finalmente, creamos la plantilla `student-detail.html`. Esta plantilla recibirá un *único* objeto `student` del modelo y mostrará todos sus atributos.

Plantilla de Detalle (`src/main/resources/templates/student-detail.html`)
[code:html]
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Detalle del Estudiante</title>
</head>
<body>
    <!-- Verificamos si el estudiante existe para evitar errores -->
    <div th:if="${student}">
        <h2 th:text="${student.name}">Nombre del Estudiante</h2>
        <p>
            <strong>Código:</strong>
            <span th:text="${student.code}">A00123456</span>
        </p>
        <p>
            <strong>Programa:</strong>
            <span th:text="${student.program}">Ingeniería de Sistemas</span>
        </p>
        <p>
            <strong>Email:</strong>
            <span th:text="${student.email}">correo@ejemplo.com</span>
        </p>
        <!-- Puedes agregar más campos aquí -->
        
        <hr>
        <a th:href="@{/students}">Volver a la lista</a>
    </div>

    <!-- Opcional: Mensaje si el estudiante no se encuentra -->
    <div th:unless="${student}">
        <h2>Estudiante no encontrado</h2>
        <p>El estudiante que buscas no existe.</p>
        <a th:href="@{/students}">Volver a la lista</a>
    </div>
</body>
</html>
[endcode]

[st] Resumen del Flujo
Con estas tres piezas (lista, controlador de detalle y plantilla de detalle), has creado un patrón de navegación completo:
1.  La lista genera enlaces únicos para cada elemento.
2.  El controlador usa `@PathVariable` para "escuchar" en esas URLs únicas y buscar los datos correspondientes.
3.  La plantilla de detalle recibe el objeto único y muestra su información.
