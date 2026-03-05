[t] MapStruct
MapStruct es una herramienta de Java que genera automáticamente el código para convertir objetos entre distintos tipos, como entidades y DTOs, de forma eficiente y segura.
[st] Instalación
Vamos a instalar la librería
[code:xml]
<!--Agreguemos la variable de versión-->
<properties>
    ...
    <mapstruct.version>1.6.3</mapstruct.version>
    ...
</properties>

<!--Mapstruct-->
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>${mapstruct.version}</version>
</dependency>

<!--Processor-->
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
    <version>${mapstruct.version}</version>
     <scope>provided</scope>
</dependency>
[endcode]
Y necesitaremos el plugin de `MapStruct`
[code:xml]
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.8.1</version>
    <configuration>
        <source>${java.version}</source>
        <target>${java.version}</target>
        <annotationProcessorPaths>
            <path>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>${mapstruct.version}</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
[endcode]
[st] Mapping simple
Ya finalizada la instalación, podemos considerar lo que necesitamos mapear.
La idea es tener una clase para modelar objetos que transportan la información (DTO) y otra clase que permita modelar la información que se almacena en base de datos (Entities).

Por ejemplo, el DTO de curso podría ser
[code:java]
public class CourseDTO {
    private long id;
    private String name;
    private Long professorId; // solo el ID del profesor

    //Getters y Setters
}
[endcode]
Finalmente debemos tener un mapper que permite la transformación de `Entity` > `DTO` y de `DTO` > `Entity`
[code:java]
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Mapping(source = "professor.id", target = "professorId")
    CourseDTO toDTO(Course course);

    @Mapping(source = "professorId", target = "professor.id")
    Course toEntity(CourseDTO dto);

    //Actualiza los campos del entity sin crear un objeto nuevo
    @Mapping(source = "professorId", target = "professor.id")
    void updateEntityFromDTO(CourseDTO dto, @MappingTarget Course entity);
}
[endcode]
Aquí podemos usar el `@Mapping` el número de veces necesarias para mapear los atributos. Siempre teniendo en cuenta que `source` se hace con base en la entrada y `target` se usa para la salida

Por ejemplo `professor.id` corresponde a `Course course` y `professorId` corresponde a CourseDTO.
[st] DTO Anidado
Si quiero tener mappers anidados, por ejemplo tengo los DTO
[code:java]
public class CourseDTO {
    private long id;
    private String name;
    private ProfessorDTO professor; // ahora tiene todo el DTO del profesor
}

public class ProfessorDTO {
    private Long id;
    private String name;
    private String email;
}
[endcode]
Ahora, debo hacer primero un DTO de professor
[code:java]
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfessorMapper {
    ProfessorDTO toDTO(Professor professor);
    Professor toEntity(ProfessorDTO dto);
    void updateEntityFromDTO(ProfessorDTO dto, @MappingTarget Professor entity);
}
[endcode]
Para luego, hacer el mapper de curso
[code:java]
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = ProfessorMapper.class)
public interface CourseMapper {

    @Mapping(source = "professor", target = "professor") // usa automáticamente ProfessorMapper
    CourseDTO toDTO(Course course);

    @Mapping(source = "professor", target = "professor")
    Course toEntity(CourseDTO dto);

    @Mapping(source = "professor", target = "professor")
    void updateEntityFromDTO(CourseDTO dto, @MappingTarget Course entity);
}
[endcode]
Note que usamos `uses` para indicar a MapStruct que cuando se encuentre con la necesidad de hacer un Professor -> ProfessorDTO o ProfessorDTO -> Profesor, él utilizará ese mapper.

[st] Controller usando DTO
Ya con todo el tema de DTO, sus endpoints podrían responder DTO
[code:java]
@GetMapping
public ResponseEntity<List<CourseDTO>> getAllCourses() {
    return ResponseEntity.status(200).body(courseService.getAllCourses());
}
[endcode]

[st] Service usando mapper
Dentro de service la forma correcta de usar el mapper es
[code:java]
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
[endcode]
En donde se usa el método `toDTO` para mapear de Entity a DTO

[st] GYM de Rest
Vamos a poner en práctica lo que hemos visto.
Tenga en cuenta que el prefijo con el que debe nombrar sus endpoints debe ser con semántica REST. Debe preguntarse cuál es el recurso principal que está devolviendo. Puede pensar en el sujeto de la oración.
[list]
Obtener todos los cursos con su respectivo profesor. Paginados: defina cuántos registros por página
Obtener un curso por `id` con su respectivo profesor y la lista de estudiantes
Búsqueda de curso (sin profesor y sin estudiantes) por coindidencias en `nombre`. Paginados: defina cuántos registros por página
Obtener todos los estudiantes inscritos en un curso específico
Consultar todos los cursos en los que está matriculado un estudiante por código de estudiante
Buscar estudiantes por programa académico. Ordenados por `código`. Paginados: defina cuántos registros por página
Listar todos los cursos con la cantidad de estudiantes inscritos
Crear un nuevo curso y asignarle un profesor existente
Registrar un nuevo estudiante
Matricular un estudiante en un curso
Actualizar el nombre código o programa de un estudiante 
Eliminar una matrícula específica por `id`
[endlist]
[code:plain]
https://classroom.github.com/a/tFfCV0KZ
[endcode]
Entregue esta tarea a más tardar el jueves de semana 13.
[st] Lombok
Vamos a instalar loombok en el proyecto

`1` Instalemos la dependencia de Loombok
[code:xml]
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.42</version>
    <scope>provided</scope>
</dependency>
[endcode]

`2` Configuremos el IDE
Como vamos a querer que IntelliJ siga mostrándonos el proyecto adecuadamente vamos a 
File → Settings → Build, Execution, Deployment → Compiler → Annotation Processors
Y activemos el cuadro `Enable annotation processing`