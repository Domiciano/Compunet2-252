[t] ¿Qué es REST?
[st] Arquitectura REST
REST (Representational State Transfer) es un estilo de arquitectura para servicios web. Define cómo los sistemas se comunican a través de HTTP usando recursos identificados por URLs y verbos estándar.

[mermaid]
flowchart TD
  C([Cliente]) -->|HTTP Request| S([Servidor REST])
  S -->|HTTP Response + JSON| C
  S --> R1[Recurso: /usuarios]
  S --> R2[Recurso: /cursos]
  S --> R3[Recurso: /productos]
[endmermaid]

[st] Principios fundamentales de REST
[list]
`Recursos` — Todo se representa como un recurso identificado por una URL. Ejemplos: `/usuarios`, `/cursos/{id}`.
`Verbos HTTP` — La acción se define por el método HTTP (GET, POST, PUT, DELETE).
`Stateless` — El servidor no guarda estado entre peticiones. Cada request debe ser autocontenido.
`Representación uniforme` — Los recursos se representan en un formato estándar, generalmente JSON.
`Idempotencia` — GET, PUT y DELETE son idempotentes: ejecutarlos varias veces produce el mismo resultado. POST no lo es.
[endlist]

[st] REST vs RESTful
`REST` es el conjunto de principios arquitectónicos.
`RESTful` es un servicio que implementa esos principios correctamente.

[svg]
<svg xmlns="http://www.w3.org/2000/svg" width="520" height="110" font-family="Roboto, Arial, sans-serif" font-size="13">
  <rect x="10" y="20" width="220" height="70" rx="8" fill="#1e2a3a" stroke="#42A5F5" stroke-width="1.5"/>
  <text x="120" y="48" text-anchor="middle" fill="#42A5F5" font-size="14" font-weight="bold">REST</text>
  <text x="120" y="68" text-anchor="middle" fill="#ccc">Estilo arquitectónico</text>
  <text x="120" y="84" text-anchor="middle" fill="#aaa">Conjunto de principios</text>

  <rect x="290" y="20" width="220" height="70" rx="8" fill="#1e2a3a" stroke="#66BB6A" stroke-width="1.5"/>
  <text x="400" y="48" text-anchor="middle" fill="#66BB6A" font-size="14" font-weight="bold">RESTful</text>
  <text x="400" y="68" text-anchor="middle" fill="#ccc">Implementación práctica</text>
  <text x="400" y="84" text-anchor="middle" fill="#aaa">Servicio que cumple REST</text>
</svg>
[endsvg]

[st] Semántica REST: diseño de endpoints
Al diseñar endpoints siga estas convenciones:
[list]
Use sustantivos en plural para los recursos: `/usuarios`, `/cursos`, `/productos`.
Nunca use verbos en la URL. El verbo ya lo define el método HTTP.
Anide recursos cuando tenga sentido: `/cursos/{id}/estudiantes`.
[endlist]

[svg]
<svg xmlns="http://www.w3.org/2000/svg" width="520" height="260" font-family="Roboto, monospace" font-size="13">
  <rect x="10" y="10" width="500" height="240" rx="8" fill="#1a1f2e"/>

  <text x="30" y="38" fill="#aaa" font-size="12">MÉTODO</text>
  <text x="140" y="38" fill="#aaa" font-size="12">URL</text>
  <text x="330" y="38" fill="#aaa" font-size="12">ACCIÓN</text>
  <line x1="20" y1="45" x2="500" y2="45" stroke="#333" stroke-width="1"/>

  <text x="30" y="68" fill="#66BB6A" font-weight="bold">GET</text>
  <text x="140" y="68" fill="#42A5F5">/usuarios</text>
  <text x="330" y="68" fill="#ddd">Obtener todos</text>

  <text x="30" y="98" fill="#66BB6A" font-weight="bold">GET</text>
  <text x="140" y="98" fill="#42A5F5">/usuarios/{id}</text>
  <text x="330" y="98" fill="#ddd">Obtener uno</text>

  <text x="30" y="128" fill="#FFA726" font-weight="bold">POST</text>
  <text x="140" y="128" fill="#42A5F5">/usuarios</text>
  <text x="330" y="128" fill="#ddd">Crear nuevo</text>

  <text x="30" y="158" fill="#AB47BC" font-weight="bold">PUT</text>
  <text x="140" y="158" fill="#42A5F5">/usuarios/{id}</text>
  <text x="330" y="158" fill="#ddd">Reemplazar completo</text>

  <text x="30" y="188" fill="#AB47BC" font-weight="bold">PATCH</text>
  <text x="140" y="188" fill="#42A5F5">/usuarios/{id}</text>
  <text x="330" y="188" fill="#ddd">Actualizar parcial</text>

  <text x="30" y="218" fill="#ef5350" font-weight="bold">DELETE</text>
  <text x="140" y="218" fill="#42A5F5">/usuarios/{id}</text>
  <text x="330" y="218" fill="#ddd">Eliminar</text>
</svg>
[endsvg]

Ejemplos de URLs incorrectas vs correctas:
[code:http]
❌ GET /getUsuarios
❌ POST /createProducto
❌ DELETE /deleteUsuarioById
✅ GET /usuarios
✅ POST /productos
✅ DELETE /usuarios/{id}
[endcode]

[st] @RestController
`@RestController` marca una clase como controlador REST. Combina `@Controller` + `@ResponseBody`, lo que significa que cada método retorna datos directamente (no vistas).
[code:java]
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    // todos los métodos aquí responden con JSON
}
[endcode]

[st] @RequestMapping
`@RequestMapping` define el prefijo de URL para todos los endpoints del controlador. Puede usarse también en métodos individuales.
[code:java]
@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Usuario getById(@PathVariable Long id) {
        return usuarioService.findById(id);
    }
}
[endcode]

En la práctica, se prefieren las anotaciones específicas por verbo HTTP.

[st] Mappings por verbo HTTP
Spring provee anotaciones específicas para cada verbo HTTP:
[list]
`@GetMapping` — Consultar recursos (lectura).
`@PostMapping` — Crear un nuevo recurso.
`@PutMapping` — Reemplazar un recurso completo.
`@PatchMapping` — Actualizar parcialmente un recurso.
`@DeleteMapping` — Eliminar un recurso.
[endlist]

[code:java]
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
[endcode]

[st] ResponseEntity y HTTPStatus
`ResponseEntity<T>` permite controlar completamente la respuesta HTTP: el cuerpo, el código de estado y los headers.

[mermaid]
flowchart TD
  M[Método del Controller] --> RE[ResponseEntity]
  RE --> SC[Status Code]
  RE --> BD[Body / Cuerpo]
  RE --> HD[Headers]
  SC --> S200[200 OK]
  SC --> S201[201 Created]
  SC --> S404[404 Not Found]
  SC --> S400[400 Bad Request]
  SC --> S204[204 No Content]
[endmermaid]

Formas de construir una `ResponseEntity`:
[code:java]
// Forma 1: usando el builder (recomendada)
ResponseEntity.ok(body);                          // 200 OK
ResponseEntity.status(HttpStatus.CREATED).body(dto); // 201 Created
ResponseEntity.noContent().build();               // 204 No Content
ResponseEntity.notFound().build();                // 404 Not Found
ResponseEntity.badRequest().build();              // 400 Bad Request

// Forma 2: indicando el código numérico
ResponseEntity.status(201).body(dto);
ResponseEntity.status(404).build();
[endcode]

Ejemplo completo aplicado a un CRUD:
[code:java]
@GetMapping("/{id}")
public ResponseEntity<UsuarioDTO> getById(@PathVariable Long id) {
    UsuarioDTO dto = usuarioService.findById(id);
    if (dto == null) {
        return ResponseEntity.notFound().build();       // 404
    }
    return ResponseEntity.ok(dto);                     // 200
}

@PostMapping
public ResponseEntity<UsuarioDTO> create(@RequestBody UsuarioDTO dto) {
    UsuarioDTO created = usuarioService.save(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(created); // 201
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id) {
    usuarioService.delete(id);
    return ResponseEntity.noContent().build();         // 204
}
[endcode]

[st] Códigos HTTP más usados
[svg]
<svg xmlns="http://www.w3.org/2000/svg" width="520" height="290" font-family="Roboto, Arial, sans-serif" font-size="13">
  <rect x="10" y="10" width="500" height="270" rx="8" fill="#1a1f2e"/>

  <text x="30" y="38" fill="#aaa" font-size="12">CÓDIGO</text>
  <text x="130" y="38" fill="#aaa" font-size="12">NOMBRE</text>
  <text x="300" y="38" fill="#aaa" font-size="12">USO</text>
  <line x1="20" y1="45" x2="500" y2="45" stroke="#333" stroke-width="1"/>

  <text x="30" y="70" fill="#66BB6A" font-weight="bold">200</text>
  <text x="130" y="70" fill="#ddd">OK</text>
  <text x="300" y="70" fill="#aaa">GET, PUT, PATCH exitosos</text>

  <text x="30" y="100" fill="#66BB6A" font-weight="bold">201</text>
  <text x="130" y="100" fill="#ddd">Created</text>
  <text x="300" y="100" fill="#aaa">POST que crea un recurso</text>

  <text x="30" y="130" fill="#66BB6A" font-weight="bold">204</text>
  <text x="130" y="130" fill="#ddd">No Content</text>
  <text x="300" y="130" fill="#aaa">DELETE exitoso, sin cuerpo</text>

  <text x="30" y="160" fill="#FFA726" font-weight="bold">400</text>
  <text x="130" y="160" fill="#ddd">Bad Request</text>
  <text x="300" y="160" fill="#aaa">Datos inválidos del cliente</text>

  <text x="30" y="190" fill="#FFA726" font-weight="bold">401</text>
  <text x="130" y="190" fill="#ddd">Unauthorized</text>
  <text x="300" y="190" fill="#aaa">No autenticado</text>

  <text x="30" y="220" fill="#ef5350" font-weight="bold">403</text>
  <text x="130" y="220" fill="#ddd">Forbidden</text>
  <text x="300" y="220" fill="#aaa">Sin permisos</text>

  <text x="30" y="250" fill="#ef5350" font-weight="bold">404</text>
  <text x="130" y="250" fill="#ddd">Not Found</text>
  <text x="300" y="250" fill="#aaa">Recurso no existe</text>
</svg>
[endsvg]

[st] Recibiendo datos: PathVariable, RequestParam y RequestBody
Los datos del request HTTP pueden llegar por tres vías distintas según la anatomía del mensaje HTTP.

[svg]
<svg xmlns="http://www.w3.org/2000/svg" width="520" height="180" font-family="Roboto, monospace" font-size="12">
  <rect x="10" y="10" width="500" height="160" rx="8" fill="#1a1f2e" stroke="#333" stroke-width="1"/>
  <text x="30" y="35" fill="#FFA726" font-weight="bold">GET /usuarios/42?activo=true HTTP/1.1</text>
  <text x="30" y="55" fill="#aaa">Host: api.miapp.com</text>
  <text x="30" y="72" fill="#aaa">Authorization: Bearer eyJhbGc...</text>
  <line x1="20" y1="82" x2="500" y2="82" stroke="#333" stroke-width="1" stroke-dasharray="5,3"/>
  <text x="30" y="100" fill="#aaa" font-style="italic">(cuerpo vacío en GET)</text>
  <text x="30" y="130" fill="#66BB6A" font-size="11">↑ PathVariable: /42</text>
  <text x="200" y="130" fill="#42A5F5" font-size="11">↑ RequestParam: ?activo=true</text>
  <text x="30" y="150" fill="#AB47BC" font-size="11">↑ RequestHeader: Authorization</text>
</svg>
[endsvg]

`@PathVariable` extrae un segmento de la URL:
[code:java]
@GetMapping("/{id}")
public ResponseEntity<UsuarioDTO> getById(@PathVariable Long id) {
    return ResponseEntity.ok(usuarioService.findById(id));
}

// URL: GET /usuarios/42
// id = 42
[endcode]

`@RequestParam` extrae parámetros del query string (`?clave=valor`):
[code:java]
@GetMapping
public ResponseEntity<List<UsuarioDTO>> getAll(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(required = false) String nombre
) {
    return ResponseEntity.ok(usuarioService.findAll(page, size, nombre));
}

// URL: GET /usuarios?page=0&size=5&nombre=Juan
[endcode]

`@RequestBody` deserializa el cuerpo JSON del request a un objeto Java:
[code:java]
@PostMapping
public ResponseEntity<UsuarioDTO> create(@RequestBody UsuarioDTO dto) {
    UsuarioDTO created = usuarioService.save(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
}

// Body JSON:
// {
//   "nombre": "Juan",
//   "email": "juan@email.com"
// }
[endcode]

[st] Data Transfer Object (DTO)
Un DTO es un objeto que encapsula los datos que se transportan entre el cliente y el servidor. Separa la representación externa de la entidad interna de base de datos.
[list]
No exponga directamente sus entidades. Use DTOs para controlar qué datos se intercambian.
Separe DTOs de entrada (`Request`) y de salida (`Response`) cuando la estructura difiera.
Incluya solo los campos necesarios para cada operación.
Evite lógica de negocio en los DTOs — solo atributos y constructores.
Nombre los DTOs claramente: `UsuarioRequestDTO`, `UsuarioResponseDTO` o simplemente `UsuarioDTO`.
Organice los DTOs en un paquete `dto` separado.
[endlist]

[code:java]
// DTO de entrada (lo que recibe el servidor)
public class UsuarioRequestDTO {
    private String nombre;
    private String email;
    private String password;
    // getters y setters
}

// DTO de salida (lo que retorna el servidor)
public class UsuarioResponseDTO {
    private Long id;
    private String nombre;
    private String email;
    // no incluye password
    // getters y setters
}
[endcode]

[st] Buenas prácticas REST
[list]
Siempre retorne `ResponseEntity` para tener control total del código HTTP.
Use el código de estado correcto: `201` al crear, `204` al eliminar, `404` cuando no existe.
Nunca exponga sus entidades directamente — use DTOs.
Versione su API desde el inicio: `/api/v1/recursos`.
Use sustantivos en plural y evite verbos en las URLs.
Maneje errores con respuestas consistentes que incluyan mensaje y código.
[endlist]
