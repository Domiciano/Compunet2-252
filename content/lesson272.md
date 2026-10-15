# Parámetros HTTP en Spring

## Anatomía del HTTP Request

Los datos que el cliente envía al servidor pueden llegar por tres vías distintas en el mensaje HTTP.

```svg
<svg id="restAnatomia" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 572" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restAnatomia-ttl restAnatomia-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restAnatomia-ttl">Cada parte del request llega a un parámetro</title>
  <desc id="restAnatomia-dsc">Arriba, un request POST /cursos/42/estudiantes?notify=true con headers y un body JSON. El segmento 42 está marcado como @PathVariable, notify=true como @RequestParam y el body como @RequestBody. Abajo, el método del controller recibe esos mismos tres datos en los parámetros cursoId, notify y dto, con los mismos colores.</desc>
  <defs>
    <style>
      #restAnatomia .title{fill:#161A26;font-size:22px;font-weight:700}
      #restAnatomia .sub{fill:#79809A;font-size:13.5px}
      #restAnatomia .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restAnatomia .foot{fill:#79809A;font-size:12px}
      #restAnatomia .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #restAnatomia .ar-slate{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#restAnatomia-ar-slate)}
    </style>
    <marker id="restAnatomia-ar-slate" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/></marker>
  </defs>
  <rect width="960" height="572" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Cada parte del request llega a un parámetro</text>
  <text class="sub" x="48" y="80" data-fit="860">Spring lee el mensaje HTTP y entrega cada dato al parámetro con la anotación que lo pide.</text>
  <rect x="48" y="104" width="864" height="188" rx="10" fill="#1F2430"/>
  <path d="M48,114 A10,10 0 0 1 58,104 H902 A10,10 0 0 1 912,114 V130 H48 Z" fill="#2A3040"/>
  <text class="mono" x="60" y="117" dy="0.35em" font-size="11.5" fill="#9AA3B5">HTTP request</text><rect x="166.2" y="142" width="22.8" height="21" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/><rect x="292.2" y="142" width="98.4" height="21" rx="5" fill="#86D3CA" fill-opacity=".3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="60.0" y="156" font-size="14" fill="#E6EAF2" textLength="403.2" lengthAdjust="spacingAndGlyphs">POST /cursos/42/estudiantes?notify=true HTTP/1.1</text>
  <text class="mono" x="60" y="117" dy="0.35em" font-size="11.5" fill="#9AA3B5"></text><rect x="57.0" y="262" width="375.6" height="24" rx="5" fill="#C9A6EE" fill-opacity=".3" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="60.0" y="212" font-size="14" fill="#E6EAF2" textLength="252.0" lengthAdjust="spacingAndGlyphs">Authorization: Bearer eyJhbGc…</text><text class="mono" x="60.0" y="234" font-size="14" fill="#E6EAF2" textLength="252.0" lengthAdjust="spacingAndGlyphs">Content-Type: application/json</text><text class="mono" x="60.0" y="278" font-size="14" fill="#E6EAF2" textLength="361.2" lengthAdjust="spacingAndGlyphs">{&quot;nombre&quot;: &quot;Juan&quot;, &quot;email&quot;: &quot;juan@uni.edu&quot;}</text>
  <text x="896" y="156" text-anchor="end" font-size="10.5" font-weight="700" letter-spacing=".08em" fill="#8C95AA">REQUEST LINE</text>
  <text x="896" y="212" text-anchor="end" font-size="10.5" font-weight="700" letter-spacing=".08em" fill="#8C95AA">HEADERS</text>
  <text x="896" y="274" text-anchor="end" font-size="10.5" font-weight="700" letter-spacing=".08em" fill="#8C95AA">BODY</text>
  <rect x="130.9" y="168" width="101.8" height="20" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="181.8" y="178" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#3A8235">@PathVariable</text><rect x="290.5" y="168" width="101.8" height="20" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="341.40000000000003" y="178" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#0F8478">@RequestParam</text>
  <rect x="458.0" y="263" width="95.2" height="20" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="505.6" y="273" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#7439B8">@RequestBody</text>
  <path class="ar-slate" d="M480,300 V334"/>
  <text x="496" y="321" font-size="13" fill="#454C61">Spring convierte cada parte y la inyecta en el método</text>
  <rect x="48" y="340" width="864" height="188" rx="10" fill="#1F2430"/>
  <path d="M48,350 A10,10 0 0 1 58,340 H902 A10,10 0 0 1 912,350 V366 H48 Z" fill="#2A3040"/>
  <text class="mono" x="60" y="353" dy="0.35em" font-size="11.5" fill="#9AA3B5">CursoController.java</text><rect x="88.2" y="413" width="208.8" height="22" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/><rect x="88.2" y="433" width="224.4" height="22" rx="5" fill="#86D3CA" fill-opacity=".3" stroke="#86D3CA" stroke-width="1.5"/><rect x="88.2" y="453" width="240.0" height="22" rx="5" fill="#C9A6EE" fill-opacity=".3" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="60.0" y="388" font-size="13" fill="#E6EAF2" textLength="296.4" lengthAdjust="spacingAndGlyphs">@PostMapping(&quot;/{cursoId}/estudiantes&quot;)</text><text class="mono" x="60.0" y="408" font-size="13" fill="#E6EAF2" textLength="366.6" lengthAdjust="spacingAndGlyphs">public ResponseEntity&lt;EstudianteDTO&gt; inscribir(</text><text class="mono" x="91.2" y="428" font-size="13" fill="#E6EAF2" textLength="210.6" lengthAdjust="spacingAndGlyphs">@PathVariable Long cursoId,</text><text class="mono" x="91.2" y="448" font-size="13" fill="#E6EAF2" textLength="226.2" lengthAdjust="spacingAndGlyphs">@RequestParam boolean notify,</text><text class="mono" x="91.2" y="468" font-size="13" fill="#E6EAF2" textLength="257.4" lengthAdjust="spacingAndGlyphs">@RequestBody EstudianteDTO dto) {</text><text class="mono" x="91.2" y="488" font-size="13" fill="#E6EAF2" textLength="7.8" lengthAdjust="spacingAndGlyphs">…</text><text class="mono" x="60.0" y="508" font-size="13" fill="#E6EAF2" textLength="7.8" lengthAdjust="spacingAndGlyphs">}</text>
  <text class="mono" x="560" y="424" dy="0.35em" font-size="12.5" fill="#9FD68D">← cursoId = 42</text>
  <text class="mono" x="560" y="444" dy="0.35em" font-size="12.5" fill="#86D3CA">← notify = true</text>
  <text class="mono" x="560" y="464" dy="0.35em" font-size="12.5" fill="#C9A6EE">← dto.getNombre() = "Juan"</text>
  <text class="foot" x="48" y="544" data-fit="860">Los headers también llegan, pero Authorization lo procesa Spring Security antes de entrar al controller.</text>
</svg>
```

## @PathVariable

`@PathVariable` extrae un segmento de la URL. Se usa cuando el identificador forma parte de la ruta del recurso.

```java
@GetMapping("/{id}")
public ResponseEntity<UsuarioDTO> getById(@PathVariable Long id) {
    return ResponseEntity.ok(usuarioService.findById(id));
}
// GET /usuarios/42  →  id = 42
```

Puede tener múltiples variables en la misma ruta:

```java
@GetMapping("/{cursoId}/estudiantes/{estudianteId}")
public ResponseEntity<EstudianteDTO> getEstudiante(
    @PathVariable Long cursoId,
    @PathVariable Long estudianteId
) {
    return ResponseEntity.ok(cursoService.getEstudiante(cursoId, estudianteId));
}
// GET /cursos/5/estudiantes/12
```

## @RequestParam

`@RequestParam` extrae parámetros del query string (`?clave=valor`). Se usa para filtros, búsquedas y paginación — datos opcionales que no identifican el recurso.

```java
@GetMapping
public ResponseEntity<List<UsuarioDTO>> getAll(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(required = false) String nombre
) {
    return ResponseEntity.ok(usuarioService.findAll(page, size, nombre));
}
// GET /usuarios?page=0&size=5&nombre=Juan
```

- `defaultValue` — valor por defecto si el parámetro no viene en la URL.
- `required = false` — el parámetro es opcional; si no viene, llega como `null`.
- Sin opciones, el parámetro es obligatorio y lanza error si falta.

## @RequestBody

`@RequestBody` deserializa el cuerpo JSON del request a un objeto Java. Se usa en `POST`, `PUT` y `PATCH` para recibir los datos del recurso.

```java
@PostMapping
public ResponseEntity<UsuarioDTO> create(@RequestBody UsuarioDTO dto) {
    UsuarioDTO created = usuarioService.save(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
}
```

El JSON que envía el cliente:

```json
{
  "nombre": "Juan",
  "email": "juan@universidad.edu"
}
```

Spring usa Jackson para convertir automáticamente el JSON a la clase `UsuarioDTO`. Los nombres de los campos JSON deben coincidir con los atributos de la clase.

## Comparativa: cuándo usar cada uno

```svg
<svg id="restParametros" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 380" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restParametros-ttl restParametros-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restParametros-ttl">¿De dónde viene el dato?</title>
  <desc id="restParametros-dsc">Tres tarjetas. @PathVariable toma un segmento de la ruta, como 42 en /cursos/42, y sirve para identificar un recurso. @RequestParam toma la query string, como page=0&amp;size=10, y sirve para filtrar, paginar u ordenar. @RequestBody toma el cuerpo JSON y sirve para crear o actualizar con POST, PUT o PATCH.</desc>
  <defs>
    <style>
      #restParametros .title{fill:#161A26;font-size:22px;font-weight:700}
      #restParametros .sub{fill:#79809A;font-size:13.5px}
      #restParametros .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restParametros .foot{fill:#79809A;font-size:12px}
      #restParametros .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
    </style>
  </defs>
  <rect width="960" height="380" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">¿De dónde viene el dato?</text>
  <text class="sub" x="48" y="80" data-fit="860">La pregunta que decide la anotación: ¿el dato identifica el recurso, lo filtra o es el recurso mismo?</text>
  <rect x="48" y="104" width="272" height="220" rx="12" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.5"/>
  <path d="M48,116 A12,12 0 0 1 60,104 H308 A12,12 0 0 1 320,116 V148 H48 Z" fill="#E8F6E3"/><path d="M48,148 H320" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="184" y="126" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="#3A8235">@PathVariable</text>
  <text class="h" x="64" y="174">VIENE DE</text><text x="64" y="194" font-size="14" font-weight="600" fill="#161A26" data-fit="240">un segmento de la ruta</text>
  <rect x="64" y="206" width="240" height="32" rx="7" fill="#1F2430"/><rect x="132.0" y="212" width="19.0" height="20" rx="4" fill="#9FD68D" fill-opacity=".35" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="74" y="222" dy="0.35em" font-size="12.5" fill="#E6EAF2" textLength="75.0" lengthAdjust="spacingAndGlyphs">/cursos/42</text>
  <text class="h" x="64" y="266">ÚSELO PARA</text><text x="64" y="286" font-size="14" font-weight="600" fill="#3A8235" data-fit="240">identificar UN recurso</text>
  <text x="64" y="308" font-size="12.5" fill="#79809A" data-fit="240">Obligatorio: sin él la URL es otra.</text>
  <rect x="344" y="104" width="272" height="220" rx="12" fill="#FFFFFF" stroke="#86D3CA" stroke-width="1.5"/>
  <path d="M344,116 A12,12 0 0 1 356,104 H604 A12,12 0 0 1 616,116 V148 H344 Z" fill="#E3F6F3"/><path d="M344,148 H616" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="480" y="126" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="#0F8478">@RequestParam</text>
  <text class="h" x="360" y="174">VIENE DE</text><text x="360" y="194" font-size="14" font-weight="600" fill="#161A26" data-fit="240">la query string</text>
  <rect x="360" y="206" width="240" height="32" rx="7" fill="#1F2430"/><rect x="428.0" y="212" width="109.0" height="20" rx="4" fill="#86D3CA" fill-opacity=".35" stroke="#86D3CA" stroke-width="1.25"/><text class="mono" x="370" y="222" dy="0.35em" font-size="12.5" fill="#E6EAF2" textLength="165.0" lengthAdjust="spacingAndGlyphs">/cursos?page=0&amp;size=10</text>
  <text class="h" x="360" y="266">ÚSELO PARA</text><text x="360" y="286" font-size="14" font-weight="600" fill="#0F8478" data-fit="240">filtrar, paginar, ordenar</text>
  <text x="360" y="308" font-size="12.5" fill="#79809A" data-fit="240">Opcional con required = false.</text>
  <rect x="640" y="104" width="272" height="220" rx="12" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <path d="M640,116 A12,12 0 0 1 652,104 H900 A12,12 0 0 1 912,116 V148 H640 Z" fill="#F4EBFF"/><path d="M640,148 H912" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="776" y="126" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="#7439B8">@RequestBody</text>
  <text class="h" x="656" y="174">VIENE DE</text><text x="656" y="194" font-size="14" font-weight="600" fill="#161A26" data-fit="240">el body en JSON</text>
  <rect x="656" y="206" width="240" height="32" rx="7" fill="#1F2430"/><rect x="664.0" y="212" width="131.5" height="20" rx="4" fill="#C9A6EE" fill-opacity=".35" stroke="#C9A6EE" stroke-width="1.25"/><text class="mono" x="666" y="222" dy="0.35em" font-size="12.5" fill="#E6EAF2" textLength="127.5" lengthAdjust="spacingAndGlyphs">{&quot;nombre&quot;: &quot;Ana&quot;}</text>
  <text class="h" x="656" y="266">ÚSELO PARA</text><text x="656" y="286" font-size="14" font-weight="600" fill="#7439B8" data-fit="240">crear o actualizar</text>
  <text x="656" y="308" font-size="12.5" fill="#79809A" data-fit="240">POST, PUT, PATCH · Jackson → DTO.</text>
  <text class="foot" x="48" y="352" data-fit="860">Se pueden combinar en un mismo método: el id en la ruta, los filtros en la query y los datos en el body.</text>
</svg>
```

## Buenas prácticas

- Siempre retorne `ResponseEntity` para tener control total del código HTTP.
- Use el código de estado correcto: `201` al crear, `204` al eliminar, `404` cuando no existe.
- Versione su API desde el inicio: `/api/v1/recursos`.
- Use `@PathVariable` para identificadores de recursos y `@RequestParam` para filtros opcionales.
