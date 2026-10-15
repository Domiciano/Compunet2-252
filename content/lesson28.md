# MapStruct

MapStruct es una librería de Java que genera automáticamente el código de conversión entre objetos, como entidades y DTOs. Elimina el código repetitivo de mapeo manual.

```svg
<svg id="restMapstruct" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 568" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restMapstruct-ttl restMapstruct-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restMapstruct-ttl">Usted declara la interfaz; MapStruct escribe la clase</title>
  <desc id="restMapstruct-dsc">A la izquierda, la interfaz CursoMapper con @Mapper y un método toDTO con @Mapping de profesor.id a profesorId. Al compilar con Maven, MapStruct genera CursoMapperImpl, una clase @Component que crea el CursoDTO y copia id, nombre y el id del profesor. Abajo, en ejecución, el bean CursoMapper convierte un Curso en CursoDTO con toDTO y de vuelta con toEntity.</desc>
  <defs>
    <style>
      #restMapstruct .title{fill:#161A26;font-size:22px;font-weight:700}
      #restMapstruct .sub{fill:#79809A;font-size:13.5px}
      #restMapstruct .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restMapstruct .foot{fill:#79809A;font-size:12px}
      #restMapstruct .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #restMapstruct .ar-slate{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#restMapstruct-ar-slate)}
      #restMapstruct .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#restMapstruct-ar-amber)}
      #restMapstruct .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#restMapstruct-ar-green)}
    </style>
    <marker id="restMapstruct-ar-slate" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/></marker>
    <marker id="restMapstruct-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
    <marker id="restMapstruct-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
  </defs>
  <rect width="960" height="568" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Usted declara la interfaz; MapStruct escribe la clase</text>
  <text class="sub" x="48" y="80" data-fit="860">Al compilar, MapStruct lee las firmas y los @Mapping y genera el código de copia campo por campo.</text>
  <text class="h" x="48" y="116">USTED ESCRIBE</text><text class="h" x="520" y="116">MAPSTRUCT GENERA</text>
  <rect x="48" y="128" width="392" height="272" rx="10" fill="#1F2430"/>
  <path d="M48,138 A10,10 0 0 1 58,128 H430 A10,10 0 0 1 440,138 V154 H48 Z" fill="#2A3040"/>
  <text class="mono" x="60" y="141" dy="0.35em" font-size="11.5" fill="#9AA3B5">CursoMapper.java</text><rect x="52.0" y="219" width="384.0" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><rect x="52.0" y="238" width="384.0" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="60.0" y="176" font-size="11.5" fill="#E6EAF2" textLength="234.6" lengthAdjust="spacingAndGlyphs">@Mapper(componentModel = &quot;spring&quot;)</text><text class="mono" x="60.0" y="195" font-size="11.5" fill="#E6EAF2" textLength="207.0" lengthAdjust="spacingAndGlyphs">public interface CursoMapper {</text><text class="mono" x="73.8" y="233" font-size="11.5" fill="#E6EAF2" textLength="220.8" lengthAdjust="spacingAndGlyphs">@Mapping(source = &quot;profesor.id&quot;,</text><text class="mono" x="135.9" y="252" font-size="11.5" fill="#E6EAF2" textLength="151.8" lengthAdjust="spacingAndGlyphs">target = &quot;profesorId&quot;)</text><text class="mono" x="73.8" y="271" font-size="11.5" fill="#E6EAF2" textLength="193.2" lengthAdjust="spacingAndGlyphs">CursoDTO toDTO(Curso curso);</text><text class="mono" x="73.8" y="309" font-size="11.5" fill="#E6EAF2" textLength="200.1" lengthAdjust="spacingAndGlyphs">Curso toEntity(CursoDTO dto);</text><text class="mono" x="60.0" y="328" font-size="11.5" fill="#E6EAF2" textLength="6.9" lengthAdjust="spacingAndGlyphs">}</text>
  <rect x="520" y="128" width="392" height="272" rx="10" fill="#1F2430"/>
  <path d="M520,138 A10,10 0 0 1 530,128 H902 A10,10 0 0 1 912,138 V154 H520 Z" fill="#2A3040"/>
  <text class="mono" x="532" y="141" dy="0.35em" font-size="11.5" fill="#9AA3B5">target/…/CursoMapperImpl.java</text><rect x="524.0" y="314" width="384.0" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><rect x="524.0" y="333" width="384.0" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="532.0" y="176" font-size="11.5" fill="#E6EAF2" textLength="69.0" lengthAdjust="spacingAndGlyphs">@Component</text><text class="mono" x="532.0" y="195" font-size="11.5" fill="#E6EAF2" textLength="193.2" lengthAdjust="spacingAndGlyphs">public class CursoMapperImpl</text><text class="mono" x="559.6" y="214" font-size="11.5" fill="#E6EAF2" textLength="165.6" lengthAdjust="spacingAndGlyphs">implements CursoMapper {</text><text class="mono" x="545.8" y="252" font-size="11.5" fill="#E6EAF2" textLength="248.4" lengthAdjust="spacingAndGlyphs">public CursoDTO toDTO(Curso curso) {</text><text class="mono" x="559.6" y="271" font-size="11.5" fill="#E6EAF2" textLength="207.0" lengthAdjust="spacingAndGlyphs">CursoDTO dto = new CursoDTO();</text><text class="mono" x="559.6" y="290" font-size="11.5" fill="#E6EAF2" textLength="172.5" lengthAdjust="spacingAndGlyphs">dto.setId(curso.getId());</text><text class="mono" x="559.6" y="309" font-size="11.5" fill="#E6EAF2" textLength="227.7" lengthAdjust="spacingAndGlyphs">dto.setNombre(curso.getNombre());</text><text class="mono" x="559.6" y="328" font-size="11.5" fill="#E6EAF2" textLength="124.2" lengthAdjust="spacingAndGlyphs">dto.setProfesorId(</text><text class="mono" x="587.2" y="347" font-size="11.5" fill="#E6EAF2" textLength="200.1" lengthAdjust="spacingAndGlyphs">curso.getProfesor().getId());</text><text class="mono" x="559.6" y="366" font-size="11.5" fill="#E6EAF2" textLength="75.9" lengthAdjust="spacingAndGlyphs">return dto;</text><text class="mono" x="545.8" y="385" font-size="11.5" fill="#E6EAF2" textLength="124.2" lengthAdjust="spacingAndGlyphs">}  // … y toEntity</text>
  <path class="ar-slate" d="M446,264 H514"/>
  <rect x="437.4" y="230" width="85.3" height="20" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="480" y="240" dy="0.35em" text-anchor="middle" font-size="10.5" font-weight="700" fill="#556074">mvn compile</text>
  <text x="480" y="290" text-anchor="middle" font-size="11" fill="#79809A">annotation</text><text x="480" y="304" text-anchor="middle" font-size="11" fill="#79809A">processor</text>
  <rect x="48" y="416" width="864" height="96" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="440" data-fit="832">EN EJECUCIÓN</text>
  <rect x="72" y="444" width="200" height="52" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="172" y="461" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="184">Curso</text><text x="172" y="480" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="184">@Entity</text>
  <rect x="380" y="444" width="200" height="52" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2.5"/><text class="mono" x="480" y="461" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="184">CursoMapper</text><text x="480" y="480" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="184">bean inyectado en el Service</text>
  <rect x="688" y="444" width="200" height="52" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="788" y="461" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="184">CursoDTO</text><text x="788" y="480" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="184">lo que ve el cliente</text>
  <path class="ar-green" d="M276,458 H376"/><path class="ar-amber" d="M376,482 H276"/>
  <path class="ar-green" d="M584,458 H684"/><path class="ar-amber" d="M684,482 H584"/>
  <text class="mono" x="326" y="452" text-anchor="middle" font-size="11" fill="#3A8235">toDTO</text><text class="mono" x="326" y="500" text-anchor="middle" font-size="11" fill="#A96C05">toEntity</text>
  <text class="mono" x="634" y="452" text-anchor="middle" font-size="11" fill="#3A8235">toDTO</text><text class="mono" x="634" y="500" text-anchor="middle" font-size="11" fill="#A96C05">toEntity</text>
  <text class="foot" x="48" y="540" data-fit="860">Si cambia un campo de la entidad y el mapper no lo cubre, el error aparece al compilar, no en producción.</text>
</svg>
```

## ¿Por qué MapStruct?

Sin MapStruct, el mapeo manual es tedioso y propenso a errores:

```java
// Sin MapStruct — manual y repetitivo
public UsuarioDTO toDTO(Usuario entity) {
    UsuarioDTO dto = new UsuarioDTO();
    dto.setId(entity.getId());
    dto.setNombre(entity.getNombre());
    dto.setEmail(entity.getEmail());
    // ...un campo más y hay que recordar agregarlo aquí
    return dto;
}
```

Con MapStruct, el compilador genera ese código automáticamente a partir de una interfaz.

## Instalación

Agregue las dependencias y el plugin al `pom.xml`:

```xml
<!-- Variable de versión -->
<properties>
    <mapstruct.version>1.6.3</mapstruct.version>
</properties>

<!-- Dependencias -->
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>${mapstruct.version}</version>
</dependency>

<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
    <version>${mapstruct.version}</version>
    <scope>provided</scope>
</dependency>
```

Agregue el plugin de compilación para que el procesador de anotaciones funcione correctamente:

```xml
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
```

Verifique que el procesador genera el código correctamente:

```bash
mvn compile
```

Después de compilar, el código generado aparece en `target/generated-sources/annotations/`. Si algo falla, ese directorio muestra exactamente qué mapper no pudo generarse.

## Mapping simple

Suponga que tiene una entidad `Curso` y quiere un DTO que exponga solo algunos campos:

```java
// Entidad de base de datos
@Entity
public class Curso {
    @Id
    private Long id;
    private String nombre;

    @ManyToOne
    private Profesor profesor;
    // getters y setters
}

// DTO que expone al cliente
public class CursoDTO {
    private Long id;
    private String nombre;
    private Long profesorId; // solo el ID del profesor
    // getters y setters
}
```

El mapper declara los métodos de conversión. MapStruct genera la implementación en tiempo de compilación:

```java
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CursoMapper {

    // Entity → DTO
    @Mapping(source = "profesor.id", target = "profesorId")
    CursoDTO toDTO(Curso curso);

    // DTO → Entity
    @Mapping(source = "profesorId", target = "profesor.id")
    Curso toEntity(CursoDTO dto);

    // Actualiza los campos de un entity existente sin crear uno nuevo
    @Mapping(source = "profesorId", target = "profesor.id")
    void updateEntityFromDTO(CursoDTO dto, @MappingTarget Curso entity);
}
```

El atributo `componentModel = "spring"` hace que el mapper sea un bean de Spring, lo que permite inyectarlo con `@Autowired`.

En `@Mapping`, `source` es la ruta del objeto de entrada y `target` la del objeto de salida. La notación con punto (`profesor.id`) permite acceder a atributos anidados.

## Usar el Mapper en el Service

Inyecte el mapper en el servicio y úselo para convertir entre entidad y DTO:

```java
@Service
public class CursoServiceImpl implements CursoService {

    @Autowired
    private CursoMapper cursoMapper;

    @Autowired
    private CursoRepository cursoRepository;

    @Override
    public List<CursoDTO> findAll() {
        return cursoRepository.findAll()
            .stream()
            .map(cursoMapper::toDTO)
            .toList();
    }

    @Override
    public CursoDTO findById(Long id) {
        Curso curso = cursoRepository.findById(id).orElse(null);
        if (curso == null) return null;
        return cursoMapper.toDTO(curso);
    }

    @Override
    public CursoDTO save(CursoDTO dto) {
        Curso entity = cursoMapper.toEntity(dto);
        Curso saved = cursoRepository.save(entity);
        return cursoMapper.toDTO(saved);
    }

    @Override
    public CursoDTO update(Long id, CursoDTO dto) {
        Curso entity = cursoRepository.findById(id).orElseThrow();
        cursoMapper.updateEntityFromDTO(dto, entity);
        return cursoMapper.toDTO(cursoRepository.save(entity));
    }
}
```

## DTOs anidados

Si en lugar de solo el ID del profesor quiere el DTO completo del profesor dentro del DTO de curso, necesita un mapper por cada tipo involucrado:

```java
// DTOs
public class CursoDTO {
    private Long id;
    private String nombre;
    private ProfesorDTO profesor; // DTO anidado
}

public class ProfesorDTO {
    private Long id;
    private String nombre;
    private String email;
}
```

Primero cree el mapper del tipo anidado:

```java
@Mapper(componentModel = "spring")
public interface ProfesorMapper {
    ProfesorDTO toDTO(Profesor profesor);
    Profesor toEntity(ProfesorDTO dto);
    void updateEntityFromDTO(ProfesorDTO dto, @MappingTarget Profesor entity);
}
```

Luego referencie ese mapper desde el mapper principal con `uses`:

```java
@Mapper(componentModel = "spring", uses = ProfesorMapper.class)
public interface CursoMapper {

    // MapStruct detecta automáticamente que Profesor → ProfesorDTO
    // y usa ProfesorMapper para esa conversión
    CursoDTO toDTO(Curso curso);

    Curso toEntity(CursoDTO dto);

    void updateEntityFromDTO(CursoDTO dto, @MappingTarget Curso entity);
}
```

Con `uses = ProfesorMapper.class`, MapStruct sabe que cuando necesite convertir `Profesor` ↔ `ProfesorDTO` debe delegar al `ProfesorMapper`.

## Controller con DTOs y ResponseEntity

Con DTOs y el mapper configurados, el controller queda limpio y solo se ocupa del HTTP:

```java
@RestController
@RequestMapping("/cursos")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    @GetMapping
    public ResponseEntity<List<CursoDTO>> getAll() {
        return ResponseEntity.ok(cursoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CursoDTO> getById(@PathVariable Long id) {
        CursoDTO dto = cursoService.findById(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<CursoDTO> create(@RequestBody CursoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cursoService.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CursoDTO> update(@PathVariable Long id, @RequestBody CursoDTO dto) {
        return ResponseEntity.ok(cursoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        cursoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

## GYM de REST

Implemente los siguientes endpoints para el proyecto del curso. Recuerde usar semántica REST correcta.

- Obtener todos los cursos con su respectivo profesor. Paginados.
- Obtener un curso por `id` con su profesor y su lista de estudiantes.
- Buscar cursos por coincidencias en el nombre. Paginados.
- Obtener todos los estudiantes inscritos en un curso específico.
- Consultar todos los cursos de un estudiante por su código.
- Buscar estudiantes por programa académico, ordenados por código. Paginados.
- Listar todos los cursos con la cantidad de estudiantes inscritos.
- Crear un nuevo curso y asignarle un profesor existente.
- Registrar un nuevo estudiante.
- Matricular un estudiante en un curso.
- Actualizar nombre, código o programa de un estudiante.
- Eliminar una matrícula por `id`.

```plain
https://classroom.github.com/a/tFfCV0KZ
```

Entregue esta tarea a más tardar el jueves de semana 13.
