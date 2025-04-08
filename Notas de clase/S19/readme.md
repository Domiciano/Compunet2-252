# ¿Qué es REST?

REST (Representational State Transfer) es un estilo de arquitectura para diseñar servicios web. Sus principios más importantes son:

Recursos: Todo se representa como un recurso (ej. usuarios, cursos, productos).

Verbos HTTP: Se usan para definir la acción sobre el recurso.

Stateless (sin estado) significa que cada solicitud HTTP enviada al servidor debe contener toda la información necesaria para ser procesada. El servidor no guarda ningún estado o memoria entre peticiones, por lo que no recuerda si un cliente ya hizo una solicitud antes. Esto hace que los servicios REST sean más escalables y fáciles de mantener, ya que cada petición es independiente y se puede manejar por cualquier instancia del servidor.

Uso de URLs limpias y semánticas.


# Semántica REST y nombres de endpoints

Al diseñar tus endpoints, es esencial seguir una **convención semántica clara y predecible**:

| Operación     | Verbo HTTP | Ejemplo de Endpoint     | Significado                      |
|---------------|------------|--------------------------|----------------------------------|
| Obtener todo  | GET        | `/usuarios`              | Trae todos los usuarios          |
| Obtener uno   | GET        | `/usuarios/{id}`         | Trae un usuario específico       |
| Crear nuevo   | POST       | `/usuarios`              | Crea un nuevo usuario            |
| Actualizar    | PUT/PATCH  | `/usuarios/{id}`         | Actualiza un usuario existente   |
| Eliminar      | DELETE     | `/usuarios/{id}`         | Elimina un usuario específico    |

🔸 **Usa sustantivos en plural** para representar recursos (`/productos`, `/ordenes`, etc.).

🔸 **No uses verbos en los nombres de los endpoints**. El verbo ya lo determina el método HTTP.



# Anotaciones importantes de Spring para REST

| Anotación                 | Descripción                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| `@RestController`         | Marca la clase como un controlador REST.                                   |
| `@RequestMapping`         | Define la ruta base del controlador.                                       |
| `@GetMapping`             | Asocia un método a una petición GET.                                       |
| `@PostMapping`            | Asocia un método a una petición POST.                                      |
| `@PutMapping` / `@PatchMapping` | Asocian un método a una petición PUT o PATCH.                        |
| `@DeleteMapping`          | Asocia un método a una petición DELETE.                                    |
| `@RequestBody`            | Indica que el contenido del cuerpo debe ser deserializado (ej. JSON → obj).|
| `@PathVariable`           | Extrae valores de la ruta.                                                 |
| `@RequestParam`           | Extrae parámetros de la URL (ej. filtros o paginación).                    |


# Buenas prácticas

❌ Incorrecto

```http
GET /getUsuarios
POST /createProducto
DELETE /deleteUsuarioById
```

✅ Correcto

```http
GET /usuarios
POST /productos
DELETE /usuarios/{id}
```

# Data Transfer Object

DTO es un objeto que se utiliza para transportar datos entre diferentes capas de una aplicación, especialmente entre el backend y el frontend o entre controladores y servicios. 

*Su propósito principal es encapsular y estructurar la información que se va a enviar o recibir, evitando exponer directamente las entidades del modelo de base de datos.*

Usar DTOs mejora la seguridad, la claridad del código y la flexibilidad, ya que puedes controlar exactamente qué datos se intercambian y adaptar la forma en que se presentan sin afectar tu modelo interno.