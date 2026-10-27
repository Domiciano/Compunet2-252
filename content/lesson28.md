# MapStruct

<!-- tags: MapStruct, @Mapper, @Mapping, source y target, componentModel spring, uses, aplanar objeto anidado, DTO anidado, @MappingTarget, Unmapped target property, mapper no se genera, annotation processor -->

MapStruct genera, al compilar, el código que copia los campos de un objeto a otro: de una entidad a su DTO y de vuelta. Usted solo declara una interfaz.

## Source y target

```svg
<svg id="restMsSourceTarget" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 372" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restMsSourceTarget-ttl restMsSourceTarget-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restMsSourceTarget-ttl">Source es lo que entra, target es lo que sale</title>
  <desc id="restMsSourceTarget-dsc">Un panel de código con dos líneas. En CursoDTO toDTO(Curso curso), el parámetro Curso curso está resaltado en ámbar como source y el tipo de retorno CursoDTO en verde como target. En @Mapping(source = "profesor.id", target = "profesorId"), el valor de source es una ruta dentro del parámetro y el de target una ruta dentro del objeto que se devuelve. Abajo dos tarjetas explican cada rol.</desc>
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
  <text class="mono" x="60" y="117" dy="0.35em" font-size="11.5" fill="#9AA3B5">CursoMapper.java</text><rect x="240.6" y="139" width="138.6" height="38" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><rect x="485.4" y="139" width="128.4" height="38" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/><rect x="57.0" y="175" width="87.6" height="38" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/><rect x="210.0" y="175" width="118.2" height="38" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="60.0" y="166" font-size="17" fill="#E6EAF2" textLength="561.0" lengthAdjust="spacingAndGlyphs">@Mapping(source = &quot;profesor.id&quot;, target = &quot;profesorId&quot;)</text><text class="mono" x="60.0" y="202" font-size="17" fill="#E6EAF2" textLength="285.6" lengthAdjust="spacingAndGlyphs">CursoDTO toDTO(Curso curso);</text>
  <rect x="48" y="244" width="424" height="76" rx="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="68" y="270" font-size="13" font-weight="700" letter-spacing=".08em" fill="#A96C05">SOURCE</text><text x="148" y="270" font-size="14" font-weight="700" fill="#161A26">El parámetro del método</text><text x="68" y="292" font-size="12.5" fill="#454C61" data-fit="384">El objeto del que se leen los datos. En @Mapping,</text><text x="68" y="310" font-size="12.5" fill="#454C61" data-fit="384">source es una ruta dentro de él: profesor.id.</text>
  <rect x="488" y="244" width="424" height="76" rx="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="508" y="270" font-size="13" font-weight="700" letter-spacing=".08em" fill="#3A8235">TARGET</text><text x="588" y="270" font-size="14" font-weight="700" fill="#161A26">El tipo de retorno</text><text x="508" y="292" font-size="12.5" fill="#454C61" data-fit="384">El objeto que MapStruct crea y llena. En @Mapping,</text><text x="508" y="310" font-size="12.5" fill="#454C61" data-fit="384">target es una ruta dentro de él: profesorId.</text>
  <text class="foot" x="48" y="344" data-fit="860">Sin @Mapping, MapStruct empareja por nombre: cada campo del target recibe el campo homónimo del source.</text>
</svg>
```

Cada método del mapper tiene un **source** (el parámetro, de donde se lee) y un **target** (el tipo de retorno, el objeto que se crea). Los atributos `source` y `target` de `@Mapping` son rutas dentro de esos dos objetos.

## Instalación

Agregue la librería al `pom.xml`:

```xml
<properties>
    <mapstruct.version>1.6.3</mapstruct.version>
</properties>

<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>${mapstruct.version}</version>
</dependency>
```

Y registre el procesador en el plugin de compilación:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
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

Si usa Lombok, su procesador va en la misma lista `annotationProcessorPaths`, **antes** del de MapStruct; si no, MapStruct no ve los getters y setters.

## Objetos simples

```svg
<svg id="restMsSimple" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 458" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restMsSimple-ttl restMsSimple-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restMsSimple-ttl">Objetos simples: cuatro casos campo por campo</title>
  <desc id="restMsSimple-dsc">A la izquierda el source Usuario con id 7, nombre Ana, email, fechaNacimiento 2004-03-14 y password. A la derecha el target UsuarioDTO con id, nombre, correo y fechaNacimiento como texto 14/03/2004. id y nombre se copian solos por tener el mismo nombre. email va a correo con @Mapping. fechaNacimiento cambia de LocalDate a String con dateFormat. password no existe en el DTO y no se copia.</desc>
  <defs>
    <style>
      #restMsSimple .title{fill:#161A26;font-size:22px;font-weight:700}
      #restMsSimple .sub{fill:#79809A;font-size:13.5px}
      #restMsSimple .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restMsSimple .foot{fill:#79809A;font-size:12px}
      #restMsSimple .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #restMsSimple .ar-slate{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#restMsSimple-ar-slate)}
      #restMsSimple .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#restMsSimple-ar-indigo)}
      #restMsSimple .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#restMsSimple-ar-violet)}
      #restMsSimple .ar-rose{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#restMsSimple-ar-rose)}
    </style>
    <marker id="restMsSimple-ar-slate" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/></marker>
    <marker id="restMsSimple-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
    <marker id="restMsSimple-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
    <marker id="restMsSimple-ar-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
  </defs>
  <rect width="960" height="458" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Objetos simples: cuatro casos campo por campo</text>
  <text class="sub" x="48" y="80" data-fit="860">Usuario → UsuarioDTO. Con el mismo nombre se copia solo; lo demás se declara con @Mapping.</text>
  <rect x="48" y="104" width="300" height="290" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128" data-fit="268">SOURCE · parámetro</text>
  <rect x="64" y="140" width="268" height="40" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="198" y="160" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="252">Usuario</text>
  <rect x="64" y="196" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="211" dy="0.35em" font-size="13" fill="#161A26">id</text><text class="mono" x="318" y="211" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">7</text>
  <rect x="64" y="234" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="249" dy="0.35em" font-size="13" fill="#161A26">nombre</text><text class="mono" x="318" y="249" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Ana&quot;</text>
  <rect x="64" y="272" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="287" dy="0.35em" font-size="13" fill="#161A26">email</text><text class="mono" x="318" y="287" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;ana@icesi.co&quot;</text>
  <rect x="64" y="310" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="325" dy="0.35em" font-size="13" fill="#161A26">fechaNacimiento</text><text class="mono" x="318" y="325" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">2004-03-14</text>
  <rect x="64" y="348" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="363" dy="0.35em" font-size="13" fill="#161A26">password</text><text class="mono" x="318" y="363" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;s3cr3t&quot;</text>
  <rect x="612" y="104" width="300" height="252" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="628" y="128" data-fit="268">TARGET · retorno</text>
  <rect x="628" y="140" width="268" height="40" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="762" y="160" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="252">UsuarioDTO</text>
  <rect x="628" y="196" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="211" dy="0.35em" font-size="13" fill="#161A26">id</text><text class="mono" x="882" y="211" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">7</text>
  <rect x="628" y="234" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="249" dy="0.35em" font-size="13" fill="#161A26">nombre</text><text class="mono" x="882" y="249" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Ana&quot;</text>
  <rect x="628" y="272" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="287" dy="0.35em" font-size="13" fill="#161A26">correo</text><text class="mono" x="882" y="287" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;ana@icesi.co&quot;</text>
  <rect x="628" y="310" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="325" dy="0.35em" font-size="13" fill="#161A26">fechaNacimiento</text><text class="mono" x="882" y="325" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;14/03/2004&quot;</text>
  <path class="ar-slate" d="M336,211 C479,211 479,211 622,211"/>
  <rect x="431.4" y="201.0" width="95.2" height="20" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="479.0" y="211.0" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#556074">mismo nombre</text>
  <path class="ar-slate" d="M336,249 C479,249 479,249 622,249"/>
  <rect x="431.4" y="239.0" width="95.2" height="20" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="479.0" y="249.0" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#556074">mismo nombre</text>
  <path class="ar-indigo" d="M336,287 C479,287 479,287 622,287"/>
  <rect x="444.6" y="277.0" width="68.8" height="20" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="479.0" y="287.0" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#4453C9">@Mapping</text>
  <path class="ar-violet" d="M336,325 C479,325 479,325 622,325"/>
  <rect x="438.0" y="315.0" width="82.0" height="20" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="479.0" y="325.0" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#7439B8">dateFormat</text>
  <path d="M336,363 H420" fill="none" stroke="#C2354F" stroke-width="1.75" stroke-dasharray="5 4"/>
  <rect x="422.7" y="353" width="154.6" height="20" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text class="mono" x="500" y="363" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#C2354F">no hay campo: no sale</text>
  <text class="foot" x="48" y="430" data-fit="860">Un campo del target que nadie llena produce el aviso "Unmapped target property" al compilar.</text>
</svg>
```

Los campos con el mismo nombre se copian solos. Solo se escribe `@Mapping` para lo que cambia:

```java
@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    @Mapping(source = "email", target = "correo")
    @Mapping(source = "fechaNacimiento", target = "fechaNacimiento",
             dateFormat = "dd/MM/yyyy")
    UsuarioDTO toDTO(Usuario usuario);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "correo", target = "email")
    Usuario toEntity(UsuarioRequestDTO dto);
}
```

En `toEntity` el `id` lo genera la base de datos: `ignore = true` le dice a MapStruct que ese campo del target se queda vacío a propósito.

## Objetos compuestos

### De compuesto a plano

```svg
<svg id="restMsAplanar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 462" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restMsAplanar-ttl restMsAplanar-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restMsAplanar-ttl">Objeto compuesto a plano: el punto entra al objeto</title>
  <desc id="restMsAplanar-dsc">A la izquierda el source Curso con id 12, nombre Computación 2 y un objeto profesor de tipo Profesor con id 3 y nombre Carlos Ruiz. A la derecha el target CursoDTO plano con id, nombre, profesorId y profesorNombre. id y nombre se copian solos. profesor.id va a profesorId y profesor.nombre a profesorNombre con @Mapping.</desc>
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
  <rect width="960" height="462" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Objeto compuesto a plano: el punto entra al objeto</text>
  <text class="sub" x="48" y="80" data-fit="860">Curso trae un Profesor adentro; CursoDTO solo quiere dos datos suyos. source = "profesor.id" baja un nivel.</text>
  <rect x="48" y="104" width="300" height="294" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128" data-fit="268">SOURCE · Curso</text>
  <rect x="64" y="140" width="268" height="40" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="198" y="160" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="252">Curso</text>
  <rect x="64" y="196" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="211" dy="0.35em" font-size="13" fill="#161A26">id</text><text class="mono" x="318" y="211" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">12</text>
  <rect x="64" y="234" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="249" dy="0.35em" font-size="13" fill="#161A26">nombre</text><text class="mono" x="318" y="249" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Compu 2&quot;</text>
  <rect x="64" y="272" width="268" height="110" rx="9" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="78" y="289" dy="0.35em" font-size="12.5" font-weight="700" fill="#0F8478">profesor</text><text class="mono" x="318" y="289" dy="0.35em" text-anchor="end" font-size="12" fill="#0F8478">Profesor</text>
  <rect x="76" y="306" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#86D3CA" stroke-width="1.25"/><text class="mono" x="90" y="321" dy="0.35em" font-size="13" fill="#161A26">id</text><text class="mono" x="306" y="321" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">3</text>
  <rect x="76" y="344" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#86D3CA" stroke-width="1.25"/><text class="mono" x="90" y="359" dy="0.35em" font-size="13" fill="#161A26">nombre</text><text class="mono" x="306" y="359" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Carlos&quot;</text>
  <rect x="612" y="104" width="300" height="252" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="628" y="128" data-fit="268">TARGET · CursoDTO</text>
  <rect x="628" y="140" width="268" height="40" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="762" y="160" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="252">CursoDTO</text>
  <rect x="628" y="196" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="211" dy="0.35em" font-size="13" fill="#161A26">id</text><text class="mono" x="882" y="211" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">12</text>
  <rect x="628" y="234" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="249" dy="0.35em" font-size="13" fill="#161A26">nombre</text><text class="mono" x="882" y="249" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Compu 2&quot;</text>
  <rect x="628" y="272" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="287" dy="0.35em" font-size="13" fill="#161A26">profesorId</text><text class="mono" x="882" y="287" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">3</text>
  <rect x="628" y="310" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="325" dy="0.35em" font-size="13" fill="#161A26">profesorNombre</text><text class="mono" x="882" y="325" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Carlos&quot;</text>
  <path class="ar-slate" d="M336,211 C479,211 479,211 622,211"/>
  <rect x="431.4" y="201.0" width="95.2" height="20" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="479.0" y="211.0" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#556074">mismo nombre</text>
  <path class="ar-slate" d="M336,249 C479,249 479,249 622,249"/>
  <rect x="431.4" y="239.0" width="95.2" height="20" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="479.0" y="249.0" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#556074">mismo nombre</text>
  <path class="ar-indigo" d="M324,321 C473,321 473,287 622,287"/>
  <rect x="422.1" y="294.0" width="101.8" height="20" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="473.0" y="304.0" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#4453C9">&quot;profesor.id&quot;</text>
  <path class="ar-indigo" d="M324,359 C473,359 473,325 622,325"/>
  <rect x="408.9" y="332.0" width="128.2" height="20" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="473.0" y="342.0" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#4453C9">&quot;profesor.nombre&quot;</text>
  <text class="foot" x="48" y="434" data-fit="860">De vuelta (toEntity) se invierte: source = "profesorId", target = "profesor.id" crea el Profesor y le pone el id.</text>
</svg>
```

```java
@Mapping(source = "profesor.id", target = "profesorId")
@Mapping(source = "profesor.nombre", target = "profesorNombre")
CursoDTO toDTO(Curso curso);

@Mapping(source = "profesorId", target = "profesor.id")
Curso toEntity(CursoDTO dto);
```

### De compuesto a compuesto

```svg
<svg id="restMsAnidado" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 580" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restMsAnidado-ttl restMsAnidado-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restMsAnidado-ttl">Objeto compuesto a compuesto: cada tipo con su mapper</title>
  <desc id="restMsAnidado-dsc">A la izquierda el source Curso con id, nombre, un profesor de tipo Profesor con id y nombre, y una lista estudiantes de tipo List de Estudiante con Ana y Luis. A la derecha el target CursoDTO con id, nombre, un profesor de tipo ProfesorDTO con id y nombre, y una lista de EstudianteDTO con Ana y Luis. En el centro, ProfesorMapper convierte el profesor y EstudianteMapper convierte la lista, un elemento a la vez.</desc>
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
  <rect width="960" height="580" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Objeto compuesto a compuesto: cada tipo con su mapper</text>
  <text class="sub" x="48" y="80" data-fit="860">Para Profesor → ProfesorDTO y para cada Estudiante de la lista, CursoMapper delega en el mapper de ese tipo.</text>
  <rect x="48" y="104" width="300" height="412" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128" data-fit="268">SOURCE · Curso</text>
  <rect x="64" y="140" width="268" height="40" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="198" y="160" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="252">Curso</text>
  <rect x="64" y="196" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="211" dy="0.35em" font-size="13" fill="#161A26">id</text><text class="mono" x="318" y="211" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">12</text>
  <rect x="64" y="234" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="249" dy="0.35em" font-size="13" fill="#161A26">nombre</text><text class="mono" x="318" y="249" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Compu 2&quot;</text>
  <rect x="64" y="272" width="268" height="110" rx="9" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="78" y="289" dy="0.35em" font-size="12.5" font-weight="700" fill="#0F8478">profesor</text><text class="mono" x="318" y="289" dy="0.35em" text-anchor="end" font-size="12" fill="#0F8478">Profesor</text>
  <rect x="76" y="306" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#86D3CA" stroke-width="1.25"/><text class="mono" x="90" y="321" dy="0.35em" font-size="13" fill="#161A26">id</text><text class="mono" x="306" y="321" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">3</text>
  <rect x="76" y="344" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#86D3CA" stroke-width="1.25"/><text class="mono" x="90" y="359" dy="0.35em" font-size="13" fill="#161A26">nombre</text><text class="mono" x="306" y="359" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Carlos&quot;</text>
  <rect x="64" y="390" width="268" height="110" rx="9" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="78" y="407" dy="0.35em" font-size="12.5" font-weight="700" fill="#7439B8">estudiantes</text><text class="mono" x="318" y="407" dy="0.35em" text-anchor="end" font-size="12" fill="#7439B8">List&lt;Estudiante&gt;</text>
  <rect x="76" y="424" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.25"/><text class="mono" x="90" y="439" dy="0.35em" font-size="13" fill="#161A26">[0]</text><text class="mono" x="306" y="439" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">Ana</text>
  <rect x="76" y="462" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.25"/><text class="mono" x="90" y="477" dy="0.35em" font-size="13" fill="#161A26">[1]</text><text class="mono" x="306" y="477" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">Luis</text>
  <rect x="612" y="104" width="300" height="412" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="628" y="128" data-fit="268">TARGET · CursoDTO</text>
  <rect x="628" y="140" width="268" height="40" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="762" y="160" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="252">CursoDTO</text>
  <rect x="628" y="196" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="211" dy="0.35em" font-size="13" fill="#161A26">id</text><text class="mono" x="882" y="211" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">12</text>
  <rect x="628" y="234" width="268" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="642" y="249" dy="0.35em" font-size="13" fill="#161A26">nombre</text><text class="mono" x="882" y="249" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Compu 2&quot;</text>
  <rect x="628" y="272" width="268" height="110" rx="9" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="642" y="289" dy="0.35em" font-size="12.5" font-weight="700" fill="#0F8478">profesor</text><text class="mono" x="882" y="289" dy="0.35em" text-anchor="end" font-size="12" fill="#0F8478">ProfesorDTO</text>
  <rect x="640" y="306" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#86D3CA" stroke-width="1.25"/><text class="mono" x="654" y="321" dy="0.35em" font-size="13" fill="#161A26">id</text><text class="mono" x="870" y="321" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">3</text>
  <rect x="640" y="344" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#86D3CA" stroke-width="1.25"/><text class="mono" x="654" y="359" dy="0.35em" font-size="13" fill="#161A26">nombre</text><text class="mono" x="870" y="359" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">&quot;Carlos&quot;</text>
  <rect x="628" y="390" width="268" height="110" rx="9" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="642" y="407" dy="0.35em" font-size="12.5" font-weight="700" fill="#7439B8">estudiantes</text><text class="mono" x="882" y="407" dy="0.35em" text-anchor="end" font-size="12" fill="#7439B8">List&lt;EstudianteDTO&gt;</text>
  <rect x="640" y="424" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.25"/><text class="mono" x="654" y="439" dy="0.35em" font-size="13" fill="#161A26">[0]</text><text class="mono" x="870" y="439" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">Ana</text>
  <rect x="640" y="462" width="244" height="30" rx="7" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.25"/><text class="mono" x="654" y="477" dy="0.35em" font-size="13" fill="#161A26">[1]</text><text class="mono" x="870" y="477" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">Luis</text>
  <path class="ar-slate" d="M336,211 C479,211 479,211 622,211"/>
  <path class="ar-slate" d="M336,249 C479,249 479,249 622,249"/>
  <path class="ar-indigo" d="M336,327 C372,327 372,327 384,327"/>
  <path class="ar-indigo" d="M576,327 C588,327 588,327 622,327"/>
  <rect x="384" y="301.0" width="192" height="52" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="480" y="318" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#4453C9" data-fit="176">ProfesorMapper</text><text x="480" y="337" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="176">toDTO(profesor)</text>
  <path class="ar-indigo" d="M336,445 C372,445 372,445 384,445"/>
  <path class="ar-indigo" d="M576,445 C588,445 588,445 622,445"/>
  <rect x="384" y="419.0" width="192" height="52" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="480" y="436" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#4453C9" data-fit="176">EstudianteMapper</text><text x="480" y="455" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="176">toDTO(…) por elemento</text>
  <text class="foot" x="48" y="552" data-fit="860">Las reglas de cada tipo viven en su propio mapper; CursoMapper solo lo declara en uses.</text>
</svg>
```

Cuando el DTO también lleva objetos adentro, cada tipo tiene su propio mapper y el principal los declara en `uses`. Las listas no necesitan nada más: MapStruct recorre la lista y llama al método del elemento.

```java
@Mapper(componentModel = "spring")
public interface ProfesorMapper {
    ProfesorDTO toDTO(Profesor profesor);
}

@Mapper(componentModel = "spring",
        uses = {ProfesorMapper.class, EstudianteMapper.class})
public interface CursoMapper {
    CursoDTO toDTO(Curso curso);
}
```

## Lo que MapStruct escribe por usted

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

Después de `mvn compile`, la clase generada queda en `target/generated-sources/annotations/`. Si un mapper no se puede generar, `mvn compile` falla y dice cuál: el error sale al compilar, no en producción.

## Usar el mapper en el Service

Con `componentModel = "spring"` el mapper es un bean y se inyecta como cualquier otro:

```java
@Service
@RequiredArgsConstructor
public class CursoServiceImpl implements CursoService {

    private final CursoRepository cursoRepository;
    private final CursoMapper cursoMapper;

    public List<CursoDTO> findAll() {
        return cursoRepository.findAll().stream()
            .map(cursoMapper::toDTO)
            .toList();
    }

    public CursoDTO save(CursoDTO dto) {
        Curso saved = cursoRepository.save(cursoMapper.toEntity(dto));
        return cursoMapper.toDTO(saved);
    }
}
```

Para actualizar una entidad que ya existe sin crear otra, el target se pasa como parámetro con `@MappingTarget`:

```java
void updateEntity(CursoDTO dto, @MappingTarget Curso entity);
```
