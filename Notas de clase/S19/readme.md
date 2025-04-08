# ¿Qué es REST?

REST (Representational State Transfer) es un estilo de arquitectura para diseñar servicios web. Sus principios más importantes son:

Recursos: Todo se representa como un recurso (ej. usuarios, cursos, productos).

Verbos HTTP: Se usan para definir la acción sobre el recurso.

Stateless (sin estado) significa que cada solicitud HTTP enviada al servidor debe contener toda la información necesaria para ser procesada. El servidor no guarda ningún estado o memoria entre peticiones, por lo que no recuerda si un cliente ya hizo una solicitud antes. Esto hace que los servicios REST sean más escalables y fáciles de mantener, ya que cada petición es independiente y se puede manejar por cualquier instancia del servidor.

Uso de URLs limpias y semánticas.


# Semántica REST y nombres de endpoints

Al diseñar tus endpoints, es esencial seguir una **convención semántica clara y predecible**:

| Operación     | Verbo HTTP | Ejemplo de Endpoint     | Significado                      |
|---------------|------------|--------------------------|----------------------------------|
| Obtener todo  | GET        | `/usuarios`              | Trae todos los usuarios          |
| Obtener uno   | GET        | `/usuarios/{id}`         | Trae un usuario específico       |
| Crear nuevo   | POST       | `/usuarios`              | Crea un nuevo usuario            |
| Actualizar    | PUT/PATCH  | `/usuarios/{id}`         | Actualiza un usuario existente   |
| Eliminar      | DELETE     | `/usuarios/{id}`         | Elimina un usuario específico    |

🔸 **Usa sustantivos en plural** para representar recursos (`/productos`, `/ordenes`, etc.).

🔸 **No uses verbos en los nombres de los endpoints**. El verbo ya lo determina el método HTTP.



# Anotaciones importantes de Spring para REST

| Anotación                 | Descripción                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| `@RestController`         | Marca la clase como un controlador REST.                                   |
| `@RequestMapping`         | Define la ruta base del controlador.                                       |
| `@GetMapping`             | Asocia un método a una petición GET.                                       |
| `@PostMapping`            | Asocia un método a una petición POST.                                      |
| `@PutMapping` / `@PatchMapping` | Asocian un método a una petición PUT o PATCH.                        |
| `@DeleteMapping`          | Asocia un método a una petición DELETE.                                    |
| `@RequestBody`            | Indica que el contenido del cuerpo debe ser deserializado (ej. JSON → obj).|
| `@PathVariable`           | Extrae valores de la ruta.                                                 |
| `@RequestParam`           | Extrae parámetros de la URL (ej. filtros o paginación).                    |


# Buenas prácticas

❌ Incorrecto

```http
GET /getUsuarios
POST /createProducto
DELETE /deleteUsuarioById
```

✅ Correcto

```http
GET /usuarios
POST /productos
DELETE /usuarios/{id}
```

# Data Transfer Object

DTO es un objeto que se utiliza para transportar datos entre diferentes capas de una aplicación, especialmente entre el backend y el frontend o entre controladores y servicios. 

*Su propósito principal es encapsular y estructurar la información que se va a enviar o recibir, evitando exponer directamente las entidades del modelo de base de datos.*

Usar DTOs mejora la seguridad, la claridad del código y la flexibilidad, ya que puedes controlar exactamente qué datos se intercambian y adaptar la forma en que se presentan sin afectar tu modelo interno.

Acójase a las siguientes reglas:

- No expongas directamente tus entidades. Usa DTOs para evitar filtrar estructuras internas o relaciones sensibles.

- Incluye solo los campos necesarios. Un DTO claro es más fácil de mantener y probar.

- Separa DTOs de entrada (Request) y de salida (Response). Así puedes validar entradas y controlar lo que devuelves.

- Evita lógica de negocio en los DTOs. Solo deben tener atributos.

- Puedes usar composición: un DTO puede contener otros DTOs. Úsalo para respuestas con contexto, pero evita ciclos infinitos.

- No incluyas listas grandes o relaciones profundas por defecto. Controla el tamaño o crea DTOs específicos para ello.

- Nombra los DTOs claramente con sufijos como Request, Response o DTO.

- Usa herramientas como **MapStruct** para convertir automáticamente entre entidades y DTOs.

- Organiza los DTOs en un paquete separado como `dto` para mantener una estructura limpia del proyecto.


# MapStruct

El próximo paso será entonces establecer un DTO

```xml
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>

<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
    <version>1.5.5.Final</version>
    <scope>provided</scope>
</dependency>
```

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.8.1</version>
    <configuration>
        <source>17</source>
        <target>17</target>
        <annotationProcessorPaths>
            <path>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>1.5.5.Final</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

El DTO de curso podría ser

```java
public class CourseDTO {
    private long id;
    private String name;
    private Long professorId; // solo el ID del profesor

    //Getters y Setters
}
```


Finalmente debemos tener un **mapper** que *permite la transformación de Entity > DTO y de DTO > Entity*

```java
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Mapping(source = "professor.id", target = "professorId")
    CourseDTO toDTO(Course course);

    @Mapping(source = "professorId", target = "professor.id")
    Course toEntity(CourseDTO dto);
    
    @Mapping(source = "professorId", target = "professor.id")
    void updateEntityFromDTO(CourseDTO dto, @MappingTarget Course course);
}
```


Aquí podemos usar el `@Mapping` el número de veces necesarias para mapear los atributos. Siempre teniendo en cuenta que `source` se hace con base en la entrada y `target` se usa para la salida

Por ejemplo `professor.id` corresponde a `Course course` y `professorId` corresponde a CourseDTO.


# Controller usando DTO

Ya con todo el tema de DTO, sus endpoints podrían responder DTO

```java
@GetMapping
public ResponseEntity<List<CourseDTO>> getAllCourses() {
    return ResponseEntity.status(200).body(courseService.getAllCourses());
}
```


# Service usando mapper

Dentro de service la forma correcta de usar el mapper es

```java
@Service
public class CourseServiceImpl implements CourseService {
    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream().map(entity -> courseMapper.toDTO(entity)).toList();
    }
}
```

En donde se usa el método `toDTO` para mapear de Entity a DTO

# GYM de Rest

Vamos a poner en práctica lo que hemos visto.

Tenga en cuenta que el prefijo con el que debe nombrar sus endpoints debe ser con semántica REST. Debe preguntarse cuál es el recurso principal que está devolviendo. Puede pensar en el **sujeto** de la oración.

---

🎯 Obtener todos los cursos con su respectivo profesor. **Hecho en este readme**

---

🎯 Obtener todos los estudiantes inscritos en un curso específico

---

🎯 Registrar un nuevo estudiante

---

🎯 Matricular un estudiante en un curso

---

🎯 Consultar todos los cursos en los que está matriculado un estudiante

---

🎯 Actualizar el nombre o programa de un estudiante

---

🎯 Eliminar una matrícula específica por `id`

---

🎯 Buscar estudiantes por programa académico

---

🎯 Crear un nuevo curso y asignarle un profesor

---

🎯 Listar todos los cursos con la cantidad de estudiantes inscritos