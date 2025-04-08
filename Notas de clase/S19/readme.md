# ¿Qué es REST?

REST (Representational State Transfer) es un estilo de arquitectura para diseñar servicios web. Sus principios más importantes son:

Recursos: Todo se representa como un recurso (ej. usuarios, cursos, productos).

Verbos HTTP: Se usan para definir la acción sobre el recurso.

Stateless (sin estado) significa que cada solicitud HTTP enviada al servidor debe contener toda la información necesaria para ser procesada. El servidor no guarda ningún estado o memoria entre peticiones, por lo que no recuerda si un cliente ya hizo una solicitud antes. Esto hace que los servicios REST sean más escalables y fáciles de mantener, ya que cada petición es independiente y se puede manejar por cualquier instancia del servidor.

Uso de URLs limpias y semánticas.


# 🔤 Semántica REST y nombres de endpoints

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

