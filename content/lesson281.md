# Lombok

Lombok es una librería de Java que genera automáticamente en tiempo de compilación el código repetitivo de las clases: getters, setters, constructores, `equals`, `hashCode` y `toString`. Elimina el boilerplate sin cambiar el comportamiento del programa.

## ¿Por qué Lombok?

Sin Lombok, cada clase de datos requiere mucho código repetitivo que no aporta lógica:

```java
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
```

Con Lombok, toda esa clase queda en tres líneas:

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CursoDTO {
    private Long id;
    private String nombre;
}
```

## Instalación

Agregue la dependencia al `pom.xml` con scope `provided` — Lombok solo se necesita en tiempo de compilación, no en el JAR final:

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.42</version>
    <scope>provided</scope>
</dependency>
```

Si su proyecto ya usa el plugin `maven-compiler-plugin` con `annotationProcessorPaths` (por ejemplo para MapStruct), agregue Lombok también en ese bloque para que ambos procesadores convivan:

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
```

El orden importa: Lombok debe declararse antes que MapStruct para que los getters y setters generados por Lombok estén disponibles cuando MapStruct construye los mappers.

Compile para verificar que no hay errores:

```bash
mvn compile
```

## Anotaciones principales

`@Data`
Genera getters para todos los campos, setters para los no-finales, `equals`, `hashCode` y `toString`. Es la anotación más usada en DTOs y clases de datos.

```java
@Data
public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String email;
}
```

`@NoArgsConstructor` y `@AllArgsConstructor`
Generan el constructor sin argumentos y el constructor con todos los argumentos respectivamente.

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CursoDTO {
    private Long id;
    private String nombre;
    private ProfesorDTO profesor;
}
```

`@Builder`
Genera el patrón builder para construir objetos de forma fluida y legible:

```java
@Data
@Builder
public class ProfesorDTO {
    private Long id;
    private String nombre;
    private String email;
}
```

```java
// Uso del builder
ProfesorDTO dto = ProfesorDTO.builder()
    .id(1L)
    .nombre("Carlos")
    .email("carlos@uni.edu")
    .build();
```

`@RequiredArgsConstructor`
Genera un constructor solo con los campos marcados como `final` o con `@NonNull`. Útil para inyección de dependencias sin `@Autowired`:

```java
@Service
@RequiredArgsConstructor
public class CursoServiceImpl implements CursoService {

    private final CursoRepository cursoRepository;
    private final CursoMapper cursoMapper;

    // Spring inyecta los campos final por constructor automáticamente
}
```

## Resumen de anotaciones

```svg
<svg id="restLombok" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 448" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restLombok-ttl restLombok-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restLombok-ttl">Una anotación, el código que ya no escribe</title>
  <desc id="restLombok-dsc">Seis tarjetas. @Data genera getters, setters, equals, hashCode y toString. @NoArgsConstructor genera new Usuario(). @AllArgsConstructor genera el constructor con todos los campos. @RequiredArgsConstructor genera el constructor con los campos final, que Spring usa para inyectar. @Builder permite construir con ProfesorDTO.builder(). @Slf4j agrega un campo log listo para usar.</desc>
  <defs>
    <style>
      #restLombok .title{fill:#161A26;font-size:22px;font-weight:700}
      #restLombok .sub{fill:#79809A;font-size:13.5px}
      #restLombok .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restLombok .foot{fill:#79809A;font-size:12px}
      #restLombok .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
    </style>
  </defs>
  <rect width="960" height="448" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Una anotación, el código que ya no escribe</text>
  <text class="sub" x="48" y="80" data-fit="860">Lombok genera ese código al compilar: no aparece en su archivo, pero sí en la clase que usa Spring.</text>
  <rect x="48" y="104" width="272" height="136" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="2.5"/>
  <text class="mono" x="64" y="132" font-size="15" font-weight="700" fill="#4453C9" data-fit="240">@Data</text>
  <text class="h" x="64" y="154">GENERA</text>
  <rect x="64" y="164" width="240" height="62" rx="8" fill="#EEF1FF"/>
  <text class="mono" x="76.0" y="177" dy="0.35em" font-size="12" fill="#161A26" textLength="180.0" lengthAdjust="spacingAndGlyphs">getNombre()  setNombre(…)</text>
  <text class="mono" x="76.0" y="195" dy="0.35em" font-size="12" fill="#161A26" textLength="144.0" lengthAdjust="spacingAndGlyphs">equals()  hashCode()</text>
  <text class="mono" x="76.0" y="213" dy="0.35em" font-size="12" fill="#161A26" textLength="72.0" lengthAdjust="spacingAndGlyphs">toString()</text>
  <rect x="344" y="104" width="272" height="136" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="mono" x="360" y="132" font-size="15" font-weight="700" fill="#4453C9" data-fit="240">@NoArgsConstructor</text>
  <text class="h" x="360" y="154">GENERA</text>
  <rect x="360" y="164" width="240" height="62" rx="8" fill="#EEF1FF"/>
  <text class="mono" x="372.0" y="195" dy="0.35em" font-size="12" fill="#161A26" textLength="100.8" lengthAdjust="spacingAndGlyphs">new CursoDTO()</text>
  <rect x="640" y="104" width="272" height="136" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="mono" x="656" y="132" font-size="15" font-weight="700" fill="#4453C9" data-fit="240">@AllArgsConstructor</text>
  <text class="h" x="656" y="154">GENERA</text>
  <rect x="656" y="164" width="240" height="62" rx="8" fill="#EEF1FF"/>
  <text class="mono" x="668.0" y="186" dy="0.35em" font-size="12" fill="#161A26" textLength="172.8" lengthAdjust="spacingAndGlyphs">new CursoDTO(id, nombre,</text>
  <text class="mono" x="754.4" y="204" dy="0.35em" font-size="12" fill="#161A26" textLength="64.8" lengthAdjust="spacingAndGlyphs">profesor)</text>
  <rect x="48" y="256" width="272" height="136" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="mono" x="64" y="284" font-size="15" font-weight="700" fill="#4453C9" data-fit="240">@RequiredArgsConstructor</text>
  <text class="h" x="64" y="306">GENERA</text>
  <rect x="64" y="316" width="240" height="62" rx="8" fill="#EEF1FF"/>
  <text class="mono" x="76.0" y="329" dy="0.35em" font-size="12" fill="#161A26" textLength="122.4" lengthAdjust="spacingAndGlyphs">CursoServiceImpl(</text>
  <text class="mono" x="104.8" y="347" dy="0.35em" font-size="12" fill="#161A26" textLength="151.2" lengthAdjust="spacingAndGlyphs">CursoRepository repo,</text>
  <text class="mono" x="104.8" y="365" dy="0.35em" font-size="12" fill="#161A26" textLength="136.8" lengthAdjust="spacingAndGlyphs">CursoMapper mapper)</text>
  <rect x="344" y="256" width="272" height="136" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="mono" x="360" y="284" font-size="15" font-weight="700" fill="#4453C9" data-fit="240">@Builder</text>
  <text class="h" x="360" y="306">GENERA</text>
  <rect x="360" y="316" width="240" height="62" rx="8" fill="#EEF1FF"/>
  <text class="mono" x="372.0" y="329" dy="0.35em" font-size="12" fill="#161A26" textLength="151.2" lengthAdjust="spacingAndGlyphs">ProfesorDTO.builder()</text>
  <text class="mono" x="400.8" y="347" dy="0.35em" font-size="12" fill="#161A26" textLength="122.4" lengthAdjust="spacingAndGlyphs">.nombre(&quot;Carlos&quot;)</text>
  <text class="mono" x="400.8" y="365" dy="0.35em" font-size="12" fill="#161A26" textLength="57.6" lengthAdjust="spacingAndGlyphs">.build()</text>
  <rect x="640" y="256" width="272" height="136" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="mono" x="656" y="284" font-size="15" font-weight="700" fill="#4453C9" data-fit="240">@Slf4j</text>
  <text class="h" x="656" y="306">GENERA</text>
  <rect x="656" y="316" width="240" height="62" rx="8" fill="#EEF1FF"/>
  <text class="mono" x="668.0" y="347" dy="0.35em" font-size="12" fill="#161A26" textLength="172.8" lengthAdjust="spacingAndGlyphs">log.info(&quot;Curso creado&quot;)</text>
  <text class="foot" x="48" y="420" data-fit="860">En entidades JPA evite @Data: su equals y hashCode recorren las relaciones y pueden entrar en ciclo.</text>
</svg>
```

## Lombok con Entidades JPA

En entidades JPA, evite `@Data` porque genera `equals` y `hashCode` basados en todos los campos, lo que puede causar problemas con relaciones lazy y ciclos infinitos. Use en su lugar:

```java
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
```

- Use `@Getter` + `@Setter` en entidades en lugar de `@Data`.
- Nunca ponga `@ToString` en entidades con relaciones — puede disparar carga lazy inesperada.
- Los DTOs sí pueden usar `@Data` libremente porque no tienen relaciones JPA.
