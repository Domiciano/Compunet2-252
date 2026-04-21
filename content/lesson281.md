[t] Lombok
Lombok es una librería de Java que genera automáticamente en tiempo de compilación el código repetitivo de las clases: getters, setters, constructores, `equals`, `hashCode` y `toString`. Elimina el boilerplate sin cambiar el comportamiento del programa.

[st] ¿Por qué Lombok?
Sin Lombok, cada clase de datos requiere mucho código repetitivo que no aporta lógica:
[code:java]
public class CursoDTO {
    private Long id;
    private String nombre;

    public CursoDTO() {}

    public CursoDTO(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    // equals, hashCode, toString...
}
[endcode]

Con Lombok, toda esa clase queda en tres líneas:
[code:java]
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CursoDTO {
    private Long id;
    private String nombre;
}
[endcode]

[st] Instalación
Agregue la dependencia al `pom.xml` con scope `provided` — Lombok solo se necesita en tiempo de compilación, no en el JAR final:
[code:xml]
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.42</version>
    <scope>provided</scope>
</dependency>
[endcode]

Si su proyecto ya usa el plugin `maven-compiler-plugin` con `annotationProcessorPaths` (por ejemplo para MapStruct), agregue Lombok también en ese bloque para que ambos procesadores convivan:
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
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>1.18.42</version>
            </path>
            <path>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>${mapstruct.version}</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
[endcode]

El orden importa: Lombok debe declararse antes que MapStruct para que los getters y setters generados por Lombok estén disponibles cuando MapStruct construye los mappers.

Compile para verificar que no hay errores:
[code:bash]
mvn compile
[endcode]

[st] Anotaciones principales
`@Data`
Genera getters para todos los campos, setters para los no-finales, `equals`, `hashCode` y `toString`. Es la anotación más usada en DTOs y clases de datos.
[code:java]
@Data
public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String email;
}
[endcode]

`@NoArgsConstructor` y `@AllArgsConstructor`
Generan el constructor sin argumentos y el constructor con todos los argumentos respectivamente.
[code:java]
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CursoDTO {
    private Long id;
    private String nombre;
    private ProfesorDTO profesor;
}
[endcode]

`@Builder`
Genera el patrón builder para construir objetos de forma fluida y legible:
[code:java]
@Data
@Builder
public class ProfesorDTO {
    private Long id;
    private String nombre;
    private String email;
}
[endcode]

[code:java]
// Uso del builder
ProfesorDTO dto = ProfesorDTO.builder()
    .id(1L)
    .nombre("Carlos")
    .email("carlos@uni.edu")
    .build();
[endcode]

`@RequiredArgsConstructor`
Genera un constructor solo con los campos marcados como `final` o con `@NonNull`. Útil para inyección de dependencias sin `@Autowired`:
[code:java]
@Service
@RequiredArgsConstructor
public class CursoServiceImpl implements CursoService {

    private final CursoRepository cursoRepository;
    private final CursoMapper cursoMapper;

    // Spring inyecta los campos final por constructor automáticamente
}
[endcode]

[st] Resumen de anotaciones
[svg]
<svg xmlns="http://www.w3.org/2000/svg" width="520" height="250" font-family="Roboto, Arial, sans-serif" font-size="13">
  <rect x="10" y="10" width="500" height="230" rx="8" fill="#1a1f2e"/>
  <text x="30" y="38" fill="#aaa" font-size="12">ANOTACIÓN</text>
  <text x="220" y="38" fill="#aaa" font-size="12">QUÉ GENERA</text>
  <line x1="20" y1="45" x2="500" y2="45" stroke="#333" stroke-width="1"/>
  <text x="30" y="70" fill="#42A5F5" font-weight="bold">@Data</text>
  <text x="220" y="70" fill="#ddd">Getters + Setters + equals + hashCode + toString</text>
  <text x="30" y="100" fill="#42A5F5" font-weight="bold">@NoArgsConstructor</text>
  <text x="220" y="100" fill="#ddd">Constructor sin argumentos</text>
  <text x="30" y="130" fill="#42A5F5" font-weight="bold">@AllArgsConstructor</text>
  <text x="220" y="130" fill="#ddd">Constructor con todos los campos</text>
  <text x="30" y="160" fill="#42A5F5" font-weight="bold">@RequiredArgsConstructor</text>
  <text x="220" y="160" fill="#ddd">Constructor con campos final y @NonNull</text>
  <text x="30" y="190" fill="#42A5F5" font-weight="bold">@Builder</text>
  <text x="220" y="190" fill="#ddd">Patrón builder fluido</text>
  <text x="30" y="220" fill="#42A5F5" font-weight="bold">@Slf4j</text>
  <text x="220" y="220" fill="#ddd">Campo log listo para usar con SLF4J</text>
</svg>
[endsvg]

[st] Lombok con Entidades JPA
En entidades JPA, evite `@Data` porque genera `equals` y `hashCode` basados en todos los campos, lo que puede causar problemas con relaciones lazy y ciclos infinitos. Use en su lugar:
[code:java]
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY)
    private Profesor profesor;
}
[endcode]

[list]
Use `@Getter` + `@Setter` en entidades en lugar de `@Data`.
Nunca ponga `@ToString` en entidades con relaciones — puede disparar carga lazy inesperada.
Los DTOs sí pueden usar `@Data` libremente porque no tienen relaciones JPA.
[endlist]
