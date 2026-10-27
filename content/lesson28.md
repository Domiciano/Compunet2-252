# MapStruct

<!-- tags: MapStruct, @Mapper, @Mapping, source y target, CourseMapper, mapeo manual a MapStruct, uses, aplanar objeto anidado, DTO anidado, Unmapped target property, mapper no se genera, lombok-mapstruct-binding -->

MapStruct genera, al compilar, el código que copia los campos de una entidad a su DTO. Usted solo declara una interfaz. Todo lo de esta lección se hace sobre el proyecto del curso, [262WebApp6](https://github.com/Domiciano/262WebApp6).

## Source y target

```svg
<svg id="restMsSourceTarget" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 372" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restMsSourceTarget-ttl restMsSourceTarget-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restMsSourceTarget-ttl">Source es lo que entra, target es lo que sale</title>
  <desc id="restMsSourceTarget-dsc">Un panel de código con dos líneas. En CourseDTO toDTO(Course course), el parámetro Course course está resaltado en ámbar como source y el tipo de retorno CourseDTO en verde como target. En @Mapping(source = "professor.name", target = "professorName"), el valor de source es una ruta dentro del parámetro y el de target una ruta dentro del objeto que se devuelve. Abajo dos tarjetas explican cada rol.</desc>
  <defs>
    <style>
      #restMsSourceTarget .title{fill:#161A26;font-size:22px;font-weight:700}
      #restMsSourceTarget .sub{fill:#79809A;font-size:13.5px}
      #restMsSourceTarget .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restMsSourceTarget .foot{fill:#79809A;font-size:12px}
      #restMsSourceTarget .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #restMsSourceTarget .ar-slate{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#restMsSourceTarget-ar-slate)}
    </style>
    <marker id="restMsSourceTarget-ar-slate" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/></marker>
  </defs>
  <rect width="960" height="372" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Source es lo que entra, target es lo que sale</text>
  <text class="sub" x="48" y="80" data-fit="860">Cada método del mapper lee un objeto source y llena un objeto target nuevo. @Mapping nombra campos de uno y del otro.</text>
  <rect x="48" y="104" width="864" height="120" rx="10" fill="#1F2430"/>
  <path d="M48,114 A10,10 0 0 1 58,104 H902 A10,10 0 0 1 912,114 V130 H48 Z" fill="#2A3040"/>
  <text class="mono" x="60" y="117" dy="0.35em" font-size="11.5" fill="#9AA3B5">CourseMapper.java</text><rect x="229.8" y="139" width="159.6" height="38" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><rect x="489.0" y="139" width="150.0" height="38" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/><rect x="57.0" y="175" width="92.4" height="38" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/><rect x="210.6" y="175" width="130.8" height="38" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="60.0" y="166" font-size="16" fill="#E6EAF2" textLength="585.6" lengthAdjust="spacingAndGlyphs">@Mapping(source = &quot;professor.name&quot;, target = &quot;professorName&quot;)</text><text class="mono" x="60.0" y="202" font-size="16" fill="#E6EAF2" textLength="297.6" lengthAdjust="spacingAndGlyphs">CourseDTO toDTO(Course course);</text>
  <rect x="48" y="244" width="424" height="76" rx="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="68" y="270" font-size="13" font-weight="700" letter-spacing=".08em" fill="#A96C05">SOURCE</text><text x="148" y="270" font-size="14" font-weight="700" fill="#161A26">El parámetro del método</text><text x="68" y="292" font-size="12.5" fill="#454C61" data-fit="384">El objeto del que se leen los datos. En @Mapping,</text><text x="68" y="310" font-size="12.5" fill="#454C61" data-fit="384">source es una ruta dentro de él: professor.name.</text>
  <rect x="488" y="244" width="424" height="76" rx="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="508" y="270" font-size="13" font-weight="700" letter-spacing=".08em" fill="#3A8235">TARGET</text><text x="588" y="270" font-size="14" font-weight="700" fill="#161A26">El tipo de retorno</text><text x="508" y="292" font-size="12.5" fill="#454C61" data-fit="384">El objeto que MapStruct crea y llena. En @Mapping,</text><text x="508" y="310" font-size="12.5" fill="#454C61" data-fit="384">target es una ruta dentro de él: professorName.</text>
  <text class="foot" x="48" y="344" data-fit="860">Sin @Mapping, MapStruct empareja por nombre: cada campo del target recibe el campo homónimo del source.</text>
</svg>
```

Cada método del mapper tiene un **source** (el parámetro, de donde se lee) y un **target** (el tipo de retorno, el objeto que se crea). Los atributos `source` y `target` de `@Mapping` son rutas dentro de esos dos objetos.

## Instalación

En 262WebApp6 ya está instalado. La dependencia va en `<dependencies>`:

```xml
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>${mapstruct.version}</version>
</dependency>
```

Y los procesadores, en el `maven-compiler-plugin`:

```xml
<annotationProcessorPaths>
    <path>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>${lombok.version}</version>
    </path>
    <path>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct-processor</artifactId>
        <version>${mapstruct.version}</version>
    </path>
    <path>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok-mapstruct-binding</artifactId>
        <version>0.2.0</version>
    </path>
</annotationProcessorPaths>
<compilerArgs>
    <arg>-Amapstruct.defaultComponentModel=spring</arg>
</compilerArgs>
```

Lombok va primero y `lombok-mapstruct-binding` los coordina: sin eso, MapStruct no ve los getters y setters que genera Lombok. `defaultComponentModel=spring` hace que todo mapper sea un bean; igual lo escribimos en cada `@Mapper` para que se lea.

## Ejemplo 1 · Del mapeo manual a MapStruct

Así convierte hoy `CourseServiceImpl` cada `Course` en `CourseDTO`, a mano:

```java
public List<CourseDTO> getAllRest() {
    List<Course> courses = courseRepository.findAll();
    List<CourseDTO> coursesDTO = courses.stream().map(
            entity -> new CourseDTO(
                    entity.getPublicId(),
                    entity.getName(),
                    entity.getProfessor().getName(),
                    entity.getCredits()
            )
    ).toList();
    return coursesDTO;
}
```

```svg
<svg id="restMsAplanar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 538" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restMsAplanar-ttl restMsAplanar-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restMsAplanar-ttl">Ejemplo 1 · Course: del objeto compuesto al plano</title>
  <desc id="restMsAplanar-dsc">A la izquierda el source Course con id, publicId, name, credits y un objeto professor de tipo Professor con id y name. A la derecha el target CourseDTO plano con publicId, name, credits y professorName. publicId, name y credits se copian solos. professor.name va a professorName con @Mapping. El id no tiene pareja en el DTO y no sale.</desc>
  <defs>
    <style>
      #restMsAplanar .title{fill:#161A26;font-size:22px;font-weight:700}
      #restMsAplanar .sub{fill:#79809A;font-size:13.5px}
      #restMsAplanar .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restMsAplanar .foot{fill:#79809A;font-size:12px}
      #restMsAplanar .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #restMsAplanar .ar-slate{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#restMsAplanar-ar-slate)}
      #restMsAplanar .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#restMsAplanar-ar-indigo)}
    </style>
    <marker id="restMsAplanar-ar-slate" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/></marker>
    <marker id="restMsAplanar-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
  </defs>
  <rect width="960" height="538" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Ejemplo 1 · Course: del objeto compuesto al plano</text>
  <text class="sub" x="48" y="80" data-fit="860">Course trae un Professor adentro; CourseDTO solo quiere su nombre. source = "professor.name" baja un nivel.</text>
  <rect x="48" y="104" width="300" height="370" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128" data-fit="268">SOURCE · Course</text>
  <rect x="64" y="140" width="268" height="40" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="198" y="160" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="252">Course</text>
  <rect x="64" y="196" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="211" dy="0.35em" font-size="13" fill="#161A26">publicId</text><text class="mono" x="318" y="211" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;1e24…&quot;</text>
  <rect x="64" y="234" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="249" dy="0.35em" font-size="13" fill="#161A26">name</text><text class="mono" x="318" y="249" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Estructuras…&quot;</text>
  <rect x="64" y="272" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="287" dy="0.35em" font-size="13" fill="#161A26">credits</text><text class="mono" x="318" y="287" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">4</text>
  <rect x="64" y="310" width="268" height="110" rx="9" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="78" y="327" dy="0.35em" font-size="12.5" font-weight="700" fill="#0F8478">professor</text><text class="mono" x="318" y="327" dy="0.35em" text-anchor="end" font-size="12" fill="#0F8478">Professor</text>
  <rect x="76" y="344" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#86D3CA" stroke-width="1.25"/><text class="mono" x="90" y="359" dy="0.35em" font-size="13" fill="#161A26">id</text><text class="mono" x="306" y="359" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">1</text>
  <rect x="76" y="382" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#86D3CA" stroke-width="1.25"/><text class="mono" x="90" y="397" dy="0.35em" font-size="13" fill="#161A26">name</text><text class="mono" x="306" y="397" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Juan Perez&quot;</text>
  <rect x="64" y="428" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F3A3B2" stroke-width="1.25" stroke-dasharray="4 4"/><text class="mono" x="78" y="443" dy="0.35em" font-size="13" fill="#9AA3B5">id</text><text class="mono" x="318" y="443" dy="0.35em" text-anchor="end" font-size="12" fill="#9AA3B5">2</text>
  <rect x="612" y="104" width="300" height="252" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="628" y="128" data-fit="268">TARGET · CourseDTO</text>
  <rect x="628" y="140" width="268" height="40" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="762" y="160" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="252">CourseDTO</text>
  <rect x="628" y="196" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="211" dy="0.35em" font-size="13" fill="#161A26">publicId</text><text class="mono" x="882" y="211" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;1e24…&quot;</text>
  <rect x="628" y="234" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="249" dy="0.35em" font-size="13" fill="#161A26">name</text><text class="mono" x="882" y="249" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Estructuras…&quot;</text>
  <rect x="628" y="272" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="287" dy="0.35em" font-size="13" fill="#161A26">credits</text><text class="mono" x="882" y="287" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">4</text>
  <rect x="628" y="310" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="325" dy="0.35em" font-size="13" fill="#161A26">professorName</text><text class="mono" x="882" y="325" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Juan Perez&quot;</text>
  <path class="ar-slate" d="M336,211 C479,211 479,211 622,211"/>
  <path class="ar-slate" d="M336,249 C479,249 479,249 622,249"/>
  <rect x="431.4" y="239.0" width="95.2" height="20" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="479.0" y="249.0" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#556074">mismo nombre</text>
  <path class="ar-slate" d="M336,287 C479,287 479,287 622,287"/>
  <path class="ar-indigo" d="M324,397 C473,397 473,325 622,325"/>
  <rect x="412.2" y="351.0" width="121.6" height="20" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="473.0" y="361.0" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#4453C9">&quot;professor.name&quot;</text>
  <path d="M336,443 H420" fill="none" stroke="#C2354F" stroke-width="1.75" stroke-dasharray="5 4"/>
  <rect x="429.3" y="433" width="141.4" height="20" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text class="mono" x="500" y="443" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#C2354F">sin pareja: no sale</text>
  <text class="foot" x="48" y="510" data-fit="860">Es lo mismo que hacía el mapeo manual con entity.getProfessor().getName(), pero sin escribirlo.</text>
</svg>
```

`publicId`, `name` y `credits` se llaman igual en los dos lados y se copian solos. Solo hay que decir de dónde sale `professorName`. Cree `api/mapper/CourseMapper.java`:

```java
@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Mapping(source = "professor.name", target = "professorName")
    CourseDTO toDTO(Course course);
}
```

Y en `CourseServiceImpl` el mapeo manual pasa a ser una línea:

```java
@Autowired
private CourseMapper courseMapper;

public List<CourseDTO> getAllRest() {
    return courseRepository.findAll().stream()
            .map(courseMapper::toDTO)
            .toList();
}
```

`GET /api/v1/courses` responde exactamente lo mismo que antes.

### De vuelta: crear un curso

Para crear, el cliente no manda un `CourseDTO`: no conoce el `publicId` y no debería escribir el nombre del profesor, sino decir cuál es. Por eso la entrada es otro DTO, `api/dto/CourseRequestDTO.java`:

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseRequestDTO {
    private String name;
    private int credits;
    private Integer professorId;
}
```

```svg
<svg id="restMsCourseToEntity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 496" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restMsCourseToEntity-ttl restMsCourseToEntity-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restMsCourseToEntity-ttl">Ejemplo 1 · De vuelta: toEntity para crear un curso</title>
  <desc id="restMsCourseToEntity-dsc">A la izquierda el source CourseRequestDTO con name, credits y professorId. A la derecha el target Course. name y credits se copian solos. professor, publicId, id y enrollments se ignoran en el mapper: el service busca el Professor con professorId y genera el publicId con UUID; el id lo genera la base de datos al guardar y enrollments empieza vacío.</desc>
  <defs>
    <style>
      #restMsCourseToEntity .title{fill:#161A26;font-size:22px;font-weight:700}
      #restMsCourseToEntity .sub{fill:#79809A;font-size:13.5px}
      #restMsCourseToEntity .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restMsCourseToEntity .foot{fill:#79809A;font-size:12px}
      #restMsCourseToEntity .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #restMsCourseToEntity .ar-slate{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#restMsCourseToEntity-ar-slate)}
      #restMsCourseToEntity .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#restMsCourseToEntity-ar-indigo)}
    </style>
    <marker id="restMsCourseToEntity-ar-slate" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/></marker>
    <marker id="restMsCourseToEntity-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
  </defs>
  <rect width="960" height="496" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Ejemplo 1 · De vuelta: toEntity para crear un curso</text>
  <text class="sub" x="48" y="80" data-fit="860">El mapper copia los datos; lo que sale de la base de datos o de una regla lo pone el service.</text>
  <rect x="48" y="104" width="300" height="214" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128" data-fit="268">SOURCE · CourseRequestDTO</text>
  <rect x="64" y="140" width="268" height="40" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="198" y="160" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="252">CourseRequestDTO</text>
  <rect x="64" y="196" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="78" y="211" dy="0.35em" font-size="13" fill="#161A26">name</text><text class="mono" x="318" y="211" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Compu 2&quot;</text>
  <rect x="64" y="234" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="78" y="249" dy="0.35em" font-size="13" fill="#161A26">credits</text><text class="mono" x="318" y="249" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">3</text>
  <rect x="64" y="272" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="78" y="287" dy="0.35em" font-size="13" fill="#161A26">professorId</text><text class="mono" x="318" y="287" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">2</text>
  <rect x="612" y="104" width="300" height="328" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="628" y="128" data-fit="268">TARGET · Course</text>
  <rect x="628" y="140" width="268" height="40" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="762" y="160" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="252">Course</text>
  <rect x="628" y="196" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="642" y="211" dy="0.35em" font-size="13" fill="#161A26">name</text><text class="mono" x="882" y="211" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Compu 2&quot;</text>
  <rect x="628" y="234" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="642" y="249" dy="0.35em" font-size="13" fill="#161A26">credits</text><text class="mono" x="882" y="249" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">3</text>
  <rect x="628" y="272" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="642" y="287" dy="0.35em" font-size="13" fill="#161A26">professor</text><text class="mono" x="882" y="287" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">Maria Rodriguez</text>
  <rect x="628" y="310" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="642" y="325" dy="0.35em" font-size="13" fill="#161A26">publicId</text><text class="mono" x="882" y="325" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">UUID</text>
  <rect x="628" y="348" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F3A3B2" stroke-width="1.25" stroke-dasharray="4 4"/><text class="mono" x="642" y="363" dy="0.35em" font-size="13" fill="#9AA3B5">id</text><text class="mono" x="882" y="363" dy="0.35em" text-anchor="end" font-size="12" fill="#9AA3B5">null</text>
  <rect x="628" y="386" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F3A3B2" stroke-width="1.25" stroke-dasharray="4 4"/><text class="mono" x="642" y="401" dy="0.35em" font-size="13" fill="#9AA3B5">enrollments</text><text class="mono" x="882" y="401" dy="0.35em" text-anchor="end" font-size="12" fill="#9AA3B5">null</text>
  <path class="ar-slate" d="M336,211 C479,211 479,211 622,211"/>
  <rect x="431.4" y="201.0" width="95.2" height="20" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="479.0" y="211.0" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#556074">mismo nombre</text>
  <path class="ar-slate" d="M336,249 C479,249 479,249 622,249"/>
  <rect x="431.4" y="239.0" width="95.2" height="20" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="479.0" y="249.0" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#556074">mismo nombre</text>
  <path d="M336,287 H622" fill="none" stroke="#4453C9" stroke-width="1.75" stroke-dasharray="5 4" marker-end="url(#restMsCourseToEntity-ar-indigo)"/>
  <rect x="377.5" y="277" width="205.0" height="20" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="480" y="287" dy="0.35em" text-anchor="middle" font-size="10.5" font-weight="700" fill="#4453C9">service: findById(professorId)</text>
  <path d="M478,325 H622" fill="none" stroke="#A9B4F2" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="388.1" y="315" width="179.8" height="20" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="478" y="325" dy="0.35em" text-anchor="middle" font-size="10.5" font-weight="700" fill="#4453C9">service: UUID.randomUUID()</text>
  <path d="M478,363 H622" fill="none" stroke="#F3A3B2" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="394.4" y="353" width="167.2" height="20" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text class="mono" x="478" y="363" dy="0.35em" text-anchor="middle" font-size="10.5" font-weight="700" fill="#C2354F">ignore · lo genera la BD</text>
  <path d="M478,401 H622" fill="none" stroke="#F3A3B2" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="400.7" y="391" width="154.6" height="20" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text class="mono" x="478" y="401" dy="0.35em" text-anchor="middle" font-size="10.5" font-weight="700" fill="#C2354F">ignore · empieza vacío</text>
  <text class="foot" x="48" y="468" data-fit="860">En el mapper los cuatro campos de la derecha van con ignore = true: MapStruct no sabe de dónde sacarlos.</text>
</svg>
```

En `CourseMapper` se agrega el camino de vuelta. Todo campo de `Course` que no sale del DTO se declara con `ignore = true`; si no, MapStruct avisa al compilar:

```java
@Mapping(target = "id", ignore = true)
@Mapping(target = "publicId", ignore = true)
@Mapping(target = "professor", ignore = true)
@Mapping(target = "enrollments", ignore = true)
Course toEntity(CourseRequestDTO dto);
```

El service completa lo que el mapper no puede saber: busca el profesor y genera el `publicId`.

```java
@Transactional
@PreAuthorize("hasAuthority('CREATE_COURSE')")
public CourseDTO createRest(CourseRequestDTO dto) {
    Professor professor = professorRepository
            .findById(dto.getProfessorId())
            .orElseThrow(() -> new IllegalStateException(
                    "Professor " + dto.getProfessorId() + " does not exist"));
    Course course = courseMapper.toEntity(dto);
    course.setProfessor(professor);
    course.setPublicId(UUID.randomUUID().toString());
    return courseMapper.toDTO(courseRepository.save(course));
}
```

Y en `CourseRestController`:

```java
@PostMapping
public ResponseEntity<CourseDTO> createCourse(@RequestBody CourseRequestDTO dto) {
    return ResponseEntity.status(201).body(courseService.createRest(dto));
}
```

Entra un `CourseRequestDTO` y sale un `CourseDTO`: el cliente nunca toca la entidad, ni para leer ni para escribir.

## Ejemplo 2 · Student, un objeto simple

```svg
<svg id="restMsSimple" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 458" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restMsSimple-ttl restMsSimple-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restMsSimple-ttl">Ejemplo 2 · Student: un objeto simple</title>
  <desc id="restMsSimple-dsc">A la izquierda el source Student con id, code, name, program y la lista studentCourses. A la derecha el target StudentDTO con code, name y academicProgram. code y name se copian solos. program va a academicProgram con @Mapping. id y studentCourses no tienen pareja en el DTO y no salen.</desc>
  <defs>
    <style>
      #restMsSimple .title{fill:#161A26;font-size:22px;font-weight:700}
      #restMsSimple .sub{fill:#79809A;font-size:13.5px}
      #restMsSimple .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restMsSimple .foot{fill:#79809A;font-size:12px}
      #restMsSimple .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #restMsSimple .ar-slate{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#restMsSimple-ar-slate)}
      #restMsSimple .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#restMsSimple-ar-indigo)}
      #restMsSimple .ar-rose{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#restMsSimple-ar-rose)}
    </style>
    <marker id="restMsSimple-ar-slate" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/></marker>
    <marker id="restMsSimple-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
    <marker id="restMsSimple-ar-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
  </defs>
  <rect width="960" height="458" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Ejemplo 2 · Student: un objeto simple</text>
  <text class="sub" x="48" y="80" data-fit="860">Con el mismo nombre se copia solo; con otro nombre se declara con @Mapping; lo que el DTO no tiene, no sale.</text>
  <rect x="48" y="104" width="300" height="290" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128" data-fit="268">SOURCE · Student</text>
  <rect x="64" y="140" width="268" height="40" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="198" y="160" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="252">Student</text>
  <rect x="64" y="196" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="211" dy="0.35em" font-size="13" fill="#161A26">code</text><text class="mono" x="318" y="211" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;2021102001&quot;</text>
  <rect x="64" y="234" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="249" dy="0.35em" font-size="13" fill="#161A26">name</text><text class="mono" x="318" y="249" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Laura Garcia&quot;</text>
  <rect x="64" y="272" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="287" dy="0.35em" font-size="13" fill="#161A26">program</text><text class="mono" x="318" y="287" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Ing. Sistemas&quot;</text>
  <rect x="64" y="310" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F3A3B2" stroke-width="1.25" stroke-dasharray="4 4"/><text class="mono" x="78" y="325" dy="0.35em" font-size="13" fill="#9AA3B5">id</text><text class="mono" x="318" y="325" dy="0.35em" text-anchor="end" font-size="12" fill="#9AA3B5">1</text>
  <rect x="64" y="348" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F3A3B2" stroke-width="1.25" stroke-dasharray="4 4"/><text class="mono" x="78" y="363" dy="0.35em" font-size="13" fill="#9AA3B5">studentCourses</text><text class="mono" x="318" y="363" dy="0.35em" text-anchor="end" font-size="12" fill="#9AA3B5">List&lt;…&gt;</text>
  <rect x="612" y="104" width="300" height="214" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="628" y="128" data-fit="268">TARGET · StudentDTO</text>
  <rect x="628" y="140" width="268" height="40" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="762" y="160" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="252">StudentDTO</text>
  <rect x="628" y="196" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="211" dy="0.35em" font-size="13" fill="#161A26">code</text><text class="mono" x="882" y="211" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;2021102001&quot;</text>
  <rect x="628" y="234" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="249" dy="0.35em" font-size="13" fill="#161A26">name</text><text class="mono" x="882" y="249" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Laura Garcia&quot;</text>
  <rect x="628" y="272" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="287" dy="0.35em" font-size="13" fill="#161A26">academicProgram</text><text class="mono" x="882" y="287" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Ing. Sistemas&quot;</text>
  <path class="ar-slate" d="M336,211 C479,211 479,211 622,211"/>
  <rect x="431.4" y="201.0" width="95.2" height="20" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="479.0" y="211.0" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#556074">mismo nombre</text>
  <path class="ar-slate" d="M336,249 C479,249 479,249 622,249"/>
  <rect x="431.4" y="239.0" width="95.2" height="20" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="479.0" y="249.0" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#556074">mismo nombre</text>
  <path class="ar-indigo" d="M336,287 C479,287 479,287 622,287"/>
  <rect x="444.6" y="277.0" width="68.8" height="20" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="479.0" y="287.0" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#4453C9">@Mapping</text>
  <path d="M336,325 H420" fill="none" stroke="#C2354F" stroke-width="1.75" stroke-dasharray="5 4"/>
  <rect x="429.3" y="315" width="141.4" height="20" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text class="mono" x="500" y="325" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#C2354F">sin pareja: no sale</text>
  <path d="M336,363 H420" fill="none" stroke="#C2354F" stroke-width="1.75" stroke-dasharray="5 4"/>
  <rect x="429.3" y="353" width="141.4" height="20" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text class="mono" x="500" y="363" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#C2354F">sin pareja: no sale</text>
  <text class="foot" x="48" y="430" data-fit="860">De vuelta (toEntity) id y studentCourses no tienen de dónde salir: se marcan con ignore = true.</text>
</svg>
```

El DTO, en `api/dto/StudentDTO.java`:

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private String code;
    private String name;
    private String academicProgram;
}
```

El mapper va en los dos sentidos. De vuelta, `id` y `studentCourses` no tienen de dónde salir: `ignore = true` dice que se quedan vacíos a propósito.

```java
@Mapper(componentModel = "spring")
public interface StudentMapper {

    @Mapping(source = "program", target = "academicProgram")
    StudentDTO toDTO(Student student);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "studentCourses", ignore = true)
    @Mapping(source = "academicProgram", target = "program")
    Student toEntity(StudentDTO dto);
}
```

En `StudentServiceImpl`:

```java
@PreAuthorize("hasAuthority('READ_STUDENT')")
public List<StudentDTO> getAllRest() {
    return studentRepository.findAll().stream()
            .map(studentMapper::toDTO)
            .toList();
}

@Transactional
@PreAuthorize("hasAuthority('CREATE_STUDENT')")
public StudentDTO createRest(StudentDTO dto) {
    Student saved = studentRepository.save(studentMapper.toEntity(dto));
    return studentMapper.toDTO(saved);
}
```

Con un `StudentRestController` que exponga `GET` y `POST` en `/api/v1/students`, el cliente nunca ve el `id` ni las matrículas.

## Ejemplo 3 · Professor, de compuesto a compuesto

```svg
<svg id="restMsAnidado" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 500" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restMsAnidado-ttl restMsAnidado-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restMsAnidado-ttl">Ejemplo 3 · Professor: de compuesto a compuesto</title>
  <desc id="restMsAnidado-dsc">A la izquierda el source Professor con id, name y una lista courses de tipo List de Course con tres cursos. A la derecha el target ProfessorDTO con id, name y una lista de CourseDTO con los mismos tres cursos. En el centro, CourseMapper convierte la lista, un elemento a la vez.</desc>
  <defs>
    <style>
      #restMsAnidado .title{fill:#161A26;font-size:22px;font-weight:700}
      #restMsAnidado .sub{fill:#79809A;font-size:13.5px}
      #restMsAnidado .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restMsAnidado .foot{fill:#79809A;font-size:12px}
      #restMsAnidado .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #restMsAnidado .ar-slate{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#restMsAnidado-ar-slate)}
      #restMsAnidado .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#restMsAnidado-ar-indigo)}
    </style>
    <marker id="restMsAnidado-ar-slate" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/></marker>
    <marker id="restMsAnidado-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
  </defs>
  <rect width="960" height="500" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Ejemplo 3 · Professor: de compuesto a compuesto</text>
  <text class="sub" x="48" y="80" data-fit="860">Cada Course de la lista pasa por CourseMapper, el del ejemplo 1. ProfessorMapper solo lo declara en uses.</text>
  <rect x="48" y="104" width="300" height="332" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128" data-fit="268">SOURCE · Professor</text>
  <rect x="64" y="140" width="268" height="40" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="198" y="160" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="252">Professor</text>
  <rect x="64" y="196" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="211" dy="0.35em" font-size="13" fill="#161A26">id</text><text class="mono" x="318" y="211" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">1</text>
  <rect x="64" y="234" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="249" dy="0.35em" font-size="13" fill="#161A26">name</text><text class="mono" x="318" y="249" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Juan Perez&quot;</text>
  <rect x="64" y="272" width="268" height="148" rx="9" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="78" y="289" dy="0.35em" font-size="12.5" font-weight="700" fill="#7439B8">courses</text><text class="mono" x="318" y="289" dy="0.35em" text-anchor="end" font-size="12" fill="#7439B8">List&lt;Course&gt;</text>
  <rect x="76" y="306" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.25"/><text class="mono" x="90" y="321" dy="0.35em" font-size="13" fill="#161A26">[0]</text><text class="mono" x="306" y="321" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">Estructuras…</text>
  <rect x="76" y="344" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.25"/><text class="mono" x="90" y="359" dy="0.35em" font-size="13" fill="#161A26">[1]</text><text class="mono" x="306" y="359" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">Algoritmos…</text>
  <rect x="76" y="382" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.25"/><text class="mono" x="90" y="397" dy="0.35em" font-size="13" fill="#161A26">[2]</text><text class="mono" x="306" y="397" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">Base de Datos</text>
  <rect x="612" y="104" width="300" height="332" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="628" y="128" data-fit="268">TARGET · ProfessorDTO</text>
  <rect x="628" y="140" width="268" height="40" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="762" y="160" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="252">ProfessorDTO</text>
  <rect x="628" y="196" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="211" dy="0.35em" font-size="13" fill="#161A26">id</text><text class="mono" x="882" y="211" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">1</text>
  <rect x="628" y="234" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="249" dy="0.35em" font-size="13" fill="#161A26">name</text><text class="mono" x="882" y="249" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Juan Perez&quot;</text>
  <rect x="628" y="272" width="268" height="148" rx="9" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="642" y="289" dy="0.35em" font-size="12.5" font-weight="700" fill="#7439B8">courses</text><text class="mono" x="882" y="289" dy="0.35em" text-anchor="end" font-size="12" fill="#7439B8">List&lt;CourseDTO&gt;</text>
  <rect x="640" y="306" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.25"/><text class="mono" x="654" y="321" dy="0.35em" font-size="13" fill="#161A26">[0]</text><text class="mono" x="870" y="321" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">Estructuras…</text>
  <rect x="640" y="344" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.25"/><text class="mono" x="654" y="359" dy="0.35em" font-size="13" fill="#161A26">[1]</text><text class="mono" x="870" y="359" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">Algoritmos…</text>
  <rect x="640" y="382" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.25"/><text class="mono" x="654" y="397" dy="0.35em" font-size="13" fill="#161A26">[2]</text><text class="mono" x="870" y="397" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">Base de Datos</text>
  <path class="ar-slate" d="M336,211 C479,211 479,211 622,211"/>
  <rect x="431.4" y="201.0" width="95.2" height="20" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="479.0" y="211.0" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#556074">mismo nombre</text>
  <path class="ar-slate" d="M336,249 C479,249 479,249 622,249"/>
  <rect x="431.4" y="239.0" width="95.2" height="20" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="479.0" y="249.0" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#556074">mismo nombre</text>
  <path class="ar-indigo" d="M336,346 C372,346 372,346 384,346"/>
  <path class="ar-indigo" d="M576,346 C588,346 588,346 622,346"/>
  <rect x="384" y="320.0" width="192" height="52" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="480" y="337" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#4453C9" data-fit="176">CourseMapper</text><text x="480" y="356" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="176">toDTO(…) por elemento</text>
  <text class="foot" x="48" y="472" data-fit="860">Cada CourseDTO sale con su professorName: las reglas del ejemplo 1 se reusan sin repetirlas.</text>
</svg>
```

El DTO lleva una lista de otro DTO:

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorDTO {
    private Integer id;
    private String name;
    private List<CourseDTO> courses;
}
```

`uses` le dice a MapStruct que, para convertir cada `Course` de la lista, use el `CourseMapper` del ejemplo 1:

```java
@Mapper(componentModel = "spring", uses = CourseMapper.class)
public interface ProfessorMapper {

    ProfessorDTO toDTO(Professor professor);
}
```

En `ProfessorServiceImpl`, el método va con `@Transactional`: la lista de cursos de un profesor se carga de la base de datos solo cuando el mapper la recorre, y eso necesita una transacción abierta.

```java
@Transactional(readOnly = true)
@PreAuthorize("hasAuthority('READ_PROFESSOR')")
public List<ProfessorDTO> getAllRest() {
    return professorRepository.findAll().stream()
            .map(professorMapper::toDTO)
            .toList();
}
```

## Lo que MapStruct escribe por usted

```svg
<svg id="restMapstruct" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 572" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restMapstruct-ttl restMapstruct-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restMapstruct-ttl">Usted declara la interfaz; MapStruct escribe la clase</title>
  <desc id="restMapstruct-dsc">A la izquierda, la interfaz CourseMapper con @Mapper y un método toDTO con @Mapping de professor.name a professorName. Al compilar con Maven, MapStruct genera CourseMapperImpl, una clase @Component que crea el CourseDTO, copia publicId, name y credits, y saca el nombre del profesor revisando que no sea null. Abajo, en ejecución, el bean CourseMapper convierte cada Course en CourseDTO dentro de CourseServiceImpl.</desc>
  <defs>
    <style>
      #restMapstruct .title{fill:#161A26;font-size:22px;font-weight:700}
      #restMapstruct .sub{fill:#79809A;font-size:13.5px}
      #restMapstruct .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restMapstruct .foot{fill:#79809A;font-size:12px}
      #restMapstruct .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #restMapstruct .ar-slate{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#restMapstruct-ar-slate)}
      #restMapstruct .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#restMapstruct-ar-green)}
    </style>
    <marker id="restMapstruct-ar-slate" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/></marker>
    <marker id="restMapstruct-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
  </defs>
  <rect width="960" height="572" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Usted declara la interfaz; MapStruct escribe la clase</text>
  <text class="sub" x="48" y="80" data-fit="860">Al compilar, MapStruct lee la firma y los @Mapping y genera el código de copia campo por campo.</text>
  <text class="h" x="48" y="116">USTED ESCRIBE</text><text class="h" x="520" y="116">MAPSTRUCT GENERA</text>
  <rect x="48" y="128" width="392" height="308" rx="10" fill="#1F2430"/>
  <path d="M48,138 A10,10 0 0 1 58,128 H430 A10,10 0 0 1 440,138 V154 H48 Z" fill="#2A3040"/>
  <text class="mono" x="60" y="141" dy="0.35em" font-size="11.5" fill="#9AA3B5">CourseMapper.java</text><rect x="52.0" y="219" width="384.0" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><rect x="52.0" y="238" width="384.0" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="60.0" y="176" font-size="11.5" fill="#E6EAF2" textLength="234.6" lengthAdjust="spacingAndGlyphs">@Mapper(componentModel = &quot;spring&quot;)</text><text class="mono" x="60.0" y="195" font-size="11.5" fill="#E6EAF2" textLength="213.9" lengthAdjust="spacingAndGlyphs">public interface CourseMapper {</text><text class="mono" x="73.8" y="233" font-size="11.5" fill="#E6EAF2" textLength="241.5" lengthAdjust="spacingAndGlyphs">@Mapping(source = &quot;professor.name&quot;,</text><text class="mono" x="135.9" y="252" font-size="11.5" fill="#E6EAF2" textLength="172.5" lengthAdjust="spacingAndGlyphs">target = &quot;professorName&quot;)</text><text class="mono" x="73.8" y="271" font-size="11.5" fill="#E6EAF2" textLength="213.9" lengthAdjust="spacingAndGlyphs">CourseDTO toDTO(Course course);</text><text class="mono" x="60.0" y="290" font-size="11.5" fill="#E6EAF2" textLength="6.9" lengthAdjust="spacingAndGlyphs">}</text>
  <rect x="520" y="128" width="392" height="308" rx="10" fill="#1F2430"/>
  <path d="M520,138 A10,10 0 0 1 530,128 H902 A10,10 0 0 1 912,138 V154 H520 Z" fill="#2A3040"/>
  <text class="mono" x="532" y="141" dy="0.35em" font-size="11.5" fill="#9AA3B5">target/…/CourseMapperImpl.java</text><rect x="524.0" y="295" width="384.0" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><rect x="524.0" y="314" width="384.0" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="532.0" y="176" font-size="11" fill="#E6EAF2" textLength="66.0" lengthAdjust="spacingAndGlyphs">@Component</text><text class="mono" x="532.0" y="195" font-size="11" fill="#E6EAF2" textLength="191.4" lengthAdjust="spacingAndGlyphs">public class CourseMapperImpl</text><text class="mono" x="558.4" y="214" font-size="11" fill="#E6EAF2" textLength="165.0" lengthAdjust="spacingAndGlyphs">implements CourseMapper {</text><text class="mono" x="545.2" y="252" font-size="11" fill="#E6EAF2" textLength="257.4" lengthAdjust="spacingAndGlyphs">public CourseDTO toDTO(Course course) {</text><text class="mono" x="558.4" y="271" font-size="11" fill="#E6EAF2" textLength="211.2" lengthAdjust="spacingAndGlyphs">if (course == null) return null;</text><text class="mono" x="558.4" y="290" font-size="11" fill="#E6EAF2" textLength="211.2" lengthAdjust="spacingAndGlyphs">CourseDTO dto = new CourseDTO();</text><text class="mono" x="558.4" y="309" font-size="11" fill="#E6EAF2" textLength="138.6" lengthAdjust="spacingAndGlyphs">dto.setProfessorName(</text><text class="mono" x="584.8" y="328" font-size="11" fill="#E6EAF2" textLength="191.4" lengthAdjust="spacingAndGlyphs">courseProfessorName(course));</text><text class="mono" x="558.4" y="347" font-size="11" fill="#E6EAF2" textLength="250.8" lengthAdjust="spacingAndGlyphs">dto.setPublicId(course.getPublicId());</text><text class="mono" x="558.4" y="366" font-size="11" fill="#E6EAF2" textLength="198.0" lengthAdjust="spacingAndGlyphs">dto.setName(course.getName());</text><text class="mono" x="558.4" y="385" font-size="11" fill="#E6EAF2" textLength="237.6" lengthAdjust="spacingAndGlyphs">dto.setCredits(course.getCredits());</text><text class="mono" x="558.4" y="404" font-size="11" fill="#E6EAF2" textLength="72.6" lengthAdjust="spacingAndGlyphs">return dto;</text><text class="mono" x="545.2" y="423" font-size="11" fill="#E6EAF2" textLength="244.2" lengthAdjust="spacingAndGlyphs">}  // courseProfessorName revisa null</text>
  <path class="ar-slate" d="M446,264 H514"/>
  <rect x="437.4" y="230" width="85.3" height="20" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="480" y="240" dy="0.35em" text-anchor="middle" font-size="10.5" font-weight="700" fill="#556074">mvn compile</text>
  <text x="480" y="290" text-anchor="middle" font-size="11" fill="#79809A">annotation</text><text x="480" y="304" text-anchor="middle" font-size="11" fill="#79809A">processor</text>
  <rect x="48" y="452" width="864" height="60" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="72" y="462" width="200" height="40" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="172" y="482" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#A96C05" data-fit="184">Course</text>
  <rect x="380" y="462" width="200" height="40" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2.5"/><text class="mono" x="480" y="482" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#4453C9" data-fit="184">CourseMapper</text>
  <rect x="688" y="462" width="200" height="40" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="788" y="482" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#3A8235" data-fit="184">CourseDTO</text>
  <path class="ar-green" d="M276,482 H376"/><path class="ar-green" d="M584,482 H684"/>
  <text class="mono" x="326" y="474" text-anchor="middle" font-size="11" fill="#3A8235">toDTO</text>
  <text class="foot" x="48" y="544" data-fit="860">En ejecución es un bean más: CourseServiceImpl lo recibe con @Autowired y lo llama en cada curso.</text>
</svg>
```

Después de `./mvnw compile`, las clases generadas quedan en `target/generated-sources/annotations/`. Si un campo del target no tiene de dónde salir, la compilación avisa con `Unmapped target property`: el error aparece al compilar, no en producción.
