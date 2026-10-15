# RestControllers y HTTP Mappings

## @RestController

`@RestController` marca una clase como controlador REST. Combina `@Controller` + `@ResponseBody`, lo que significa que cada método retorna datos directamente serializados como JSON, sin pasar por una vista.

```java
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    // todos los métodos aquí responden con JSON
}
```

## @RequestMapping

`@RequestMapping` define el prefijo de URL base para todos los endpoints del controlador.

```java
@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Usuario getById(@PathVariable Long id) {
        return usuarioService.findById(id);
    }
}
```

En la práctica, en lugar de `method = RequestMethod.GET` se usan las anotaciones específicas por verbo HTTP.

## Mappings por verbo HTTP

Spring provee una anotación específica para cada verbo HTTP:

- `@GetMapping` — Consultar recursos (lectura, no modifica estado).
- `@PostMapping` — Crear un nuevo recurso.
- `@PutMapping` — Reemplazar un recurso completo.
- `@PatchMapping` — Actualizar parcialmente un recurso.
- `@DeleteMapping` — Eliminar un recurso.

```java
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @GetMapping
    public List<UsuarioDTO> getAll() {
        return usuarioService.findAll();
    }

    @GetMapping("/{id}")
    public UsuarioDTO getById(@PathVariable Long id) {
        return usuarioService.findById(id);
    }

    @PostMapping
    public UsuarioDTO create(@RequestBody UsuarioDTO dto) {
        return usuarioService.save(dto);
    }

    @PutMapping("/{id}")
    public UsuarioDTO update(@PathVariable Long id, @RequestBody UsuarioDTO dto) {
        return usuarioService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        usuarioService.delete(id);
    }
}
```

## ResponseEntity

`ResponseEntity<T>` permite controlar completamente la respuesta HTTP: el cuerpo, el código de estado y los headers. Es la forma recomendada de responder en un controlador REST.

```svg
<svg id="restResponseEntity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 400" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restResponseEntity-ttl restResponseEntity-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restResponseEntity-ttl">ResponseEntity arma la respuesta completa</title>
  <desc id="restResponseEntity-dsc">A la izquierda, el return de un controller que encadena status de HttpStatus.CREATED, un header Location y body con el DTO. A la derecha, la respuesta HTTP que produce: la línea de estado 201 Created, los headers y el body en JSON. Cada llamada está unida con su parte por el mismo color.</desc>
  <defs>
    <style>
      #restResponseEntity .title{fill:#161A26;font-size:22px;font-weight:700}
      #restResponseEntity .sub{fill:#79809A;font-size:13.5px}
      #restResponseEntity .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restResponseEntity .foot{fill:#79809A;font-size:12px}
      #restResponseEntity .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #restResponseEntity .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#restResponseEntity-ar-green)}
      #restResponseEntity .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#restResponseEntity-ar-amber)}
      #restResponseEntity .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#restResponseEntity-ar-violet)}
    </style>
    <marker id="restResponseEntity-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
    <marker id="restResponseEntity-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
    <marker id="restResponseEntity-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
  </defs>
  <rect width="960" height="400" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">ResponseEntity arma la respuesta completa</text>
  <text class="sub" x="48" y="80" data-fit="860">Cada llamada del builder llena una parte del mensaje HTTP que recibe el cliente.</text>
  <rect x="48" y="112" width="416" height="232" rx="10" fill="#1F2430"/>
  <path d="M48,122 A10,10 0 0 1 58,112 H454 A10,10 0 0 1 464,122 V138 H48 Z" fill="#2A3040"/>
  <text class="mono" x="60" y="125" dy="0.35em" font-size="11.5" fill="#9AA3B5">UsuarioController.java</text><rect x="87.0" y="208" width="208.5" height="32" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/><rect x="87.0" y="238" width="261.0" height="32" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><rect x="87.0" y="268" width="88.5" height="32" rx="5" fill="#C9A6EE" fill-opacity=".3" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="60.0" y="200" font-size="12.5" fill="#E6EAF2" textLength="157.5" lengthAdjust="spacingAndGlyphs">return ResponseEntity</text><text class="mono" x="90.0" y="230" font-size="12.5" fill="#E6EAF2" textLength="202.5" lengthAdjust="spacingAndGlyphs">.status(HttpStatus.CREATED)</text><text class="mono" x="90.0" y="260" font-size="12.5" fill="#E6EAF2" textLength="255.0" lengthAdjust="spacingAndGlyphs">.header(&quot;Location&quot;, &quot;/usuarios/7&quot;)</text><text class="mono" x="90.0" y="290" font-size="12.5" fill="#E6EAF2" textLength="82.5" lengthAdjust="spacingAndGlyphs">.body(dto);</text>
  <rect x="512" y="104" width="400" height="244" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="528" y="128" data-fit="368">LA RESPUESTA HTTP QUE SALE</text>
  <rect x="528" y="136" width="368" height="44" rx="8" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/>
  <text x="884" y="152" text-anchor="end" font-size="10.5" font-weight="700" letter-spacing=".08em" fill="#3A8235">STATUS</text>
  <text class="mono" x="544" y="158" dy="0.35em" font-size="12.5" fill="#161A26" data-fit="330">HTTP/1.1 201 Created</text>
  <rect x="528" y="188" width="368" height="52" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text x="884" y="204" text-anchor="end" font-size="10.5" font-weight="700" letter-spacing=".08em" fill="#A96C05">HEADERS</text>
  <text class="mono" x="544" y="204" dy="0.35em" font-size="12.5" fill="#161A26" data-fit="330">Location: /usuarios/7</text>
  <text class="mono" x="544" y="224" dy="0.35em" font-size="12.5" fill="#161A26" data-fit="330">Content-Type: application/json</text>
  <rect x="528" y="248" width="368" height="84" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text x="884" y="264" text-anchor="end" font-size="10.5" font-weight="700" letter-spacing=".08em" fill="#7439B8">BODY</text>
  <text class="mono" x="544" y="270" dy="0.35em" font-size="12.5" fill="#161A26" data-fit="330">{ &quot;id&quot;: 7,</text>
  <text class="mono" x="544" y="290" dy="0.35em" font-size="12.5" fill="#161A26" data-fit="330">  &quot;nombre&quot;: &quot;Ana Gómez&quot;,</text>
  <text class="mono" x="544" y="310" dy="0.35em" font-size="12.5" fill="#161A26" data-fit="330">  &quot;email&quot;: &quot;ana@icesi.edu&quot; }</text>
  <path class="ar-green" d="M470,226 C492,226 498,158 520,158"/><circle cx="470" cy="226" r="3.5" fill="#3A8235"/>
  <path class="ar-amber" d="M470,256 C492,256 498,214 520,214"/><circle cx="470" cy="256" r="3.5" fill="#A96C05"/>
  <path class="ar-violet" d="M470,286 C492,286 498,290 520,290"/><circle cx="470" cy="286" r="3.5" fill="#7439B8"/>
  <text class="foot" x="48" y="372" data-fit="860">Con .build() en lugar de .body(…) la respuesta sale sin body, como en 204 No Content.</text>
</svg>
```

Formas de construir una `ResponseEntity`:

```java
// Con el builder (recomendado)
ResponseEntity.ok(body);                              // 200 OK con cuerpo
ResponseEntity.status(HttpStatus.CREATED).body(dto);  // 201 Created con cuerpo
ResponseEntity.noContent().build();                   // 204 No Content sin cuerpo
ResponseEntity.notFound().build();                    // 404 Not Found sin cuerpo
ResponseEntity.badRequest().build();                  // 400 Bad Request sin cuerpo

// Con código numérico
ResponseEntity.status(201).body(dto);
ResponseEntity.status(404).build();
```

## HTTPStatus

Spring provee la clase `HttpStatus` con constantes para todos los códigos HTTP estándar.

```svg
<svg id="restStatus" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 500" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restStatus-ttl restStatus-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restStatus-ttl">Los códigos de estado se leen por familia</title>
  <desc id="restStatus-dsc">Tres familias. 2xx, todo salió bien: 200 OK para GET, PUT y PATCH exitosos, 201 CREATED para un POST que crea, 204 NO_CONTENT para un DELETE sin body. 4xx, el cliente se equivocó: 400 BAD_REQUEST datos inválidos, 401 UNAUTHORIZED no autenticado, 403 FORBIDDEN sin permisos, 404 NOT_FOUND el recurso no existe. 5xx, falló el servidor: 500 INTERNAL_SERVER_ERROR por una excepción no controlada.</desc>
  <defs>
    <style>
      #restStatus .title{fill:#161A26;font-size:22px;font-weight:700}
      #restStatus .sub{fill:#79809A;font-size:13.5px}
      #restStatus .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restStatus .foot{fill:#79809A;font-size:12px}
      #restStatus .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
    </style>
  </defs>
  <rect width="960" height="500" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Los códigos de estado se leen por familia</text>
  <text class="sub" x="48" y="80" data-fit="860">El primer dígito ya dice quién tuvo el problema; HttpStatus trae una constante para cada código.</text>
  <rect x="48" y="104" width="420" height="336" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="492" y="104" width="420" height="336" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text x="64" y="132" font-size="12" font-weight="700" letter-spacing=".08em" fill="#3A8235">2XX · TODO SALIÓ BIEN</text>
  <rect x="64" y="144" width="388" height="52" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="82" y="170" dy="0.35em" font-size="24" font-weight="800" fill="#3A8235">200</text><text class="mono" x="150" y="163" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" data-fit="290">OK</text><text x="150" y="181" dy="0.35em" font-size="12.5" fill="#454C61" data-fit="290">GET, PUT o PATCH exitosos</text>
  <rect x="64" y="208" width="388" height="52" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="82" y="234" dy="0.35em" font-size="24" font-weight="800" fill="#3A8235">201</text><text class="mono" x="150" y="227" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" data-fit="290">CREATED</text><text x="150" y="245" dy="0.35em" font-size="12.5" fill="#454C61" data-fit="290">POST que crea un recurso</text>
  <rect x="64" y="272" width="388" height="52" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="82" y="298" dy="0.35em" font-size="24" font-weight="800" fill="#3A8235">204</text><text class="mono" x="150" y="291" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" data-fit="290">NO_CONTENT</text><text x="150" y="309" dy="0.35em" font-size="12.5" fill="#454C61" data-fit="290">DELETE exitoso, sin body</text>
  <text x="64" y="356" font-size="12" font-weight="700" letter-spacing=".08em" fill="#556074">5XX · FALLÓ EL SERVIDOR</text>
  <rect x="64" y="368" width="388" height="52" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="82" y="394" dy="0.35em" font-size="24" font-weight="800" fill="#556074">500</text><text class="mono" x="150" y="387" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" data-fit="290">INTERNAL_SERVER_ERROR</text><text x="150" y="405" dy="0.35em" font-size="12.5" fill="#454C61" data-fit="290">Una excepción que nadie controló</text>
  <text x="508" y="132" font-size="12" font-weight="700" letter-spacing=".08em" fill="#C2354F">4XX · EL CLIENTE SE EQUIVOCÓ</text>
  <rect x="508" y="144" width="388" height="52" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="526" y="170" dy="0.35em" font-size="24" font-weight="800" fill="#A96C05">400</text><text class="mono" x="594" y="163" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" data-fit="290">BAD_REQUEST</text><text x="594" y="181" dy="0.35em" font-size="12.5" fill="#454C61" data-fit="290">Datos inválidos en el request</text>
  <rect x="508" y="208" width="388" height="52" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="526" y="234" dy="0.35em" font-size="24" font-weight="800" fill="#A96C05">401</text><text class="mono" x="594" y="227" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" data-fit="290">UNAUTHORIZED</text><text x="594" y="245" dy="0.35em" font-size="12.5" fill="#454C61" data-fit="290">No se autenticó</text>
  <rect x="508" y="272" width="388" height="52" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="526" y="298" dy="0.35em" font-size="24" font-weight="800" fill="#C2354F">403</text><text class="mono" x="594" y="291" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" data-fit="290">FORBIDDEN</text><text x="594" y="309" dy="0.35em" font-size="12.5" fill="#454C61" data-fit="290">Autenticado, pero sin permisos</text>
  <rect x="508" y="336" width="388" height="52" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="526" y="362" dy="0.35em" font-size="24" font-weight="800" fill="#C2354F">404</text><text class="mono" x="594" y="355" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" data-fit="290">NOT_FOUND</text><text x="594" y="373" dy="0.35em" font-size="12.5" fill="#454C61" data-fit="290">El recurso no existe</text>
  <text class="foot" x="48" y="472" data-fit="860">401 pregunta «¿quién es usted?»; 403 dice «sé quién es, pero no puede». Se usan como HttpStatus.NOT_FOUND.</text>
</svg>
```

## CRUD completo con ResponseEntity

Así queda un controller completo usando `ResponseEntity` con los códigos correctos en cada operación:

```java
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getAll() {
        return ResponseEntity.ok(usuarioService.findAll());         // 200
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> getById(@PathVariable Long id) {
        UsuarioDTO dto = usuarioService.findById(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();               // 404
        }
        return ResponseEntity.ok(dto);                             // 200
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> create(@RequestBody UsuarioDTO dto) {
        UsuarioDTO created = usuarioService.save(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created); // 201
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> update(
        @PathVariable Long id,
        @RequestBody UsuarioDTO dto
    ) {
        return ResponseEntity.ok(usuarioService.update(id, dto));  // 200
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();                 // 204
    }
}
```
