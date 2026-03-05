[t] ¿Qué es REST?
[st] Principios de REST
REST es un estilo de arquitectura para servicios web que se basa en el intercambio de datos mediante recursos identificados por URLs, utilizando los métodos estándar de HTTP (GET, POST, PUT, DELETE, etc.) y respetando principios como la ausencia de estado (stateless), la representación uniforme de los recursos y la comunicación cliente-servidor.

`Recursos`
Todo se representa como un recurso (ej. usuarios, cursos, productos).

`Verbos HTTP`
Se usan para definir la acción sobre el recurso.

`Stateless`
Cada solicitud HTTP enviada al servidor debe contener toda la información necesaria para ser procesada. El servidor no guarda ningún estado o memoria entre peticiones, por lo que no recuerda si un cliente ya hizo una solicitud antes. Esto hace que los servicios REST sean más escalables y fáciles de mantener, ya que cada petición es independiente y se puede manejar por cualquier instancia del servidor.

`Idempotencia`
Hace referencia a que ciertos métodos HTTP pueden ejecutarse múltiples veces sin alterar el resultado final del recurso. Por ejemplo, GET, PUT y DELETE son idempotentes porque repetir la misma solicitud no cambia el estado del sistema, mientras que POST normalmente no lo es, ya que cada ejecución puede crear un nuevo recurso.

`Uso de URLs limpias y semánticas`

`RESTful` se refiere a un servicio web que sigue estrictamente los principios de la arquitectura REST, utilizando los métodos HTTP (`GET`, `POST`, `PUT`, `DELETE`) de forma coherente con los recursos que expone.

Mientras que REST es la arquitectura o conjunto de principios, mientras que RESTful es la implementación práctica de esos principios en un servicio web.
[st] Semántica REST y nombres de endpoints
Al diseñar sus endpoints, es esencial seguir una convención semántica clara y predecible
[list]
Use sustantivos en plural para representar recursos (`/productos`, `/ordenes`, etc.).
No use verbos en los nombres de los endpoints. El verbo ya lo determina el método HTTP.
[endlist]
Por ejemplo los método típicos de CRUD se pueden escribir así

[list]
Obtener todo
[endlist]
`GET` `/usuarios` 
Trae todos los usuarios 

[list]
Obtener un elemento
[endlist]
`GET` `/usuarios/{id}`
Trae un usuario específico

[list]
Crear nuevo
[endlist]
`POST` `/usuarios`
Crea un nuevo usuario

[list]
Actualizar
[endlist]
`PUT/PATCH` `/usuarios/{id}`
Actualiza un usuario existente

[list]
Eliminar
[endlist]
`DELETE` `/usuarios/{id}` 
Elimina un usuario específico
[st] Buenas prácticas
❌ Incorrecto
[code:http]
GET /getUsuarios
POST /createProducto
DELETE /deleteUsuarioById
[endcode]

✅ Correcto
[code:http]
GET /usuarios
POST /productos
DELETE /usuarios/{id}
[endcode]
[st] Anotaciones importantes de Spring para REST
Para marcar una clase como controlador que emite datos puros (sin View)
`@RestController`

Para usar prefijos para el controller venimos usando
`@RequestMapping`

Para los diferentes verbos HTTP
`@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping` y `@DeleteMapping`.

Para recibir variables que provienen del mensaje de HTTP Request, debe recordar que acorde a la anatomía del mensaje de Request 
[icon] image3.png
Se pueden recibir datos por
[list]
URL
[endlist]
`@PathVariable` para URL del tipo `/books/12`
`@RequestParam` para URL del tipo `/books?id=12`

[list]
Header
[endlist]
Puede recibir datos por medio del header usando `@RequestHeader`
[code:java]
@GetMapping("/hola")
public String saludar(@RequestHeader("nombre") String nombre) {
    return "Hola, " + nombre + "!";
}
[endcode]
En este caso se recibe un header llamado `nombre`

[list]
Body
[endlist]
Finalemente se pueden recibir datos por medio del body usando `@RequestBody`
[code:java]
@PostMapping("/hola")
public String saludar(@RequestBody Persona persona) {
    return "Hola, " + persona.getNombre() + "! Tienes " + persona.getEdad() + " años.";
}
[endcode]
Aquí la clase `Persona` de ser una clase de datos, específicamente un `DTO`
[st] Data Transfer Object
DTO es un objeto que se utiliza para transportar datos entre diferentes capas de una aplicación, especialmente entre el backend y el frontend o entre controladores y servicios.
[list]
Su propósito principal es encapsular y estructurar la información que se va a enviar o recibir, evitando exponer directamente las entidades del modelo de base de datos.
[endlist]
Usar DTOs mejora la seguridad, la claridad del código y la flexibilidad, ya que puedes controlar exactamente qué datos se intercambian y adaptar la forma en que se presentan sin afectar tu modelo interno.
Acójase a las siguientes reglas
[list]
No exponga directamente sus entidades. Usa DTOs para evitar filtrar estructuras internas o relaciones sensibles.
Incluya solo los campos necesarios. Un DTO claro es más fácil de mantener y probar.
Separe DTOs de entrada (Request) y de salida (Response). Así puedes validar entradas y controlar lo que devuelves.
Evite lógica de negocio en los DTOs. Solo deben tener atributos.
Puede usar composición: un DTO puede contener otros DTOs. Úsalo para respuestas con contexto, pero evita ciclos infinitos.
No incluyas listas grandes o relaciones profundas por defecto. Controla el tamaño o crea DTOs específicos para ello.
Nombre los DTOs claramente con sufijos como Request, Response o DTO.
Use herramientas como MapStruct para convertir automáticamente entre entidades y DTOs.
Organice los DTOs en un paquete separado como `dto` para mantener una estructura limpia del proyecto.
[endlist]