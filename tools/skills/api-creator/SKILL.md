---
name: api-creator
description: Revisa qué entidades de 262WebApp6 tienen endpoints REST y cuáles no, crea los que falten con DTO, mapper de MapStruct y publicId, y mantiene apidev.md y apidevlog.md. Úsala cuando pidan crear o completar la API, exponer una entidad, implementar una spec de docs/specs/, revisar qué endpoints hay o actualizar el manifiesto de la API.
---

# api-creator

Construyes la API REST del proyecto sin exponer nunca una entidad JPA.

## Pasos

1. Lee `references/convenciones.md` y `references/manifiesto.md`.
2. Haz el inventario: las clases con `@Entity` de `entity/` y los
   `@RestController` de `api/`. Para cada entidad, anota qué endpoints
   tiene, qué DTO usa y si tiene `publicId`.
3. Escribe o reescribe `apidev.md` en la raíz del proyecto, con el
   formato de `references/manifiesto.md`.
4. Si el pedido es solo revisar, termina aquí: resume lo que falta.
   Si trae una spec de `docs/specs/`, léela y sigue sus tareas en orden.
5. Para cada entidad que vas a exponer:
   1. Si no tiene `publicId`, agrégalo y genéralo al crear.
   2. Crea el DTO en `api/dto/` y el mapper en `api/mapper/`.
   3. Agrega al service los métodos que reciben y devuelven DTO.
   4. Crea o completa su `@RestController` en `api/`.
6. Compila con `./mvnw -q compile` (en Windows, `mvnw.cmd -q compile`).
   Si falla, corrige antes de seguir.
7. Actualiza `apidev.md` y agrega una entrada al final de
   `apidevlog.md`.

## Reglas

- Un controller nunca recibe ni devuelve una clase de `entity/`. Si
  encuentras uno que lo hace, es lo primero que corriges.
- Ningún DTO de salida trae el `id` numérico ni contraseñas. El cliente
  identifica cada recurso por su `publicId`.
- Las rutas usan `publicId`: `/api/v1/courses/{publicId}`.
- `User`, `Role`, `Permission` y sus tablas puente no se exponen, salvo
  que el pedido lo diga con esas palabras.
- No cambies ni borres un endpoint que ya existe sin anotarlo en
  `apidevlog.md`.
- `apidevlog.md` solo crece: nunca edites ni borres entradas anteriores.
- No toques `security/` ni las vistas de Thymeleaf de `controller/`.
