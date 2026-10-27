# Convenciones de la API de 262WebApp6

## Paquetes

Todo vive en `src/main/java/edu/co/icesi/introspringboot/`:

- `entity/`: entidades JPA.
- `repo/`: repositorios de Spring Data.
- `service/`: interfaces. `service/impl/`: las clases `XxxServiceImpl`.
- `api/`: los `@RestController`.
- `api/dto/`: los DTO. `api/mapper/`: los mappers de MapStruct.
- `controller/`: vistas de Thymeleaf. No se tocan.

## Rutas

- Base: `/api/v1`. Con el context path, la URL completa empieza en
  `http://localhost:8080/WebApp6/api/v1`.
- Recursos en plural y en inglés: `/courses`, `/students`.
- Un recurso se identifica por `publicId`: `GET /courses/{publicId}`.
- 200 al leer, 201 al crear (con el recurso creado en el cuerpo) y 204
  al borrar.

## publicId

Igual que en `Course`:

```java
@Column(name = "public_id", unique = true, nullable = false,
        updatable = false, length = 36)
private String publicId;
```

Se asigna en el service al crear:

```java
entity.setPublicId(UUID.randomUUID().toString());
```

Si la entidad tiene filas en `src/main/resources/data.sql`, agrega la
columna `public_id` a esos `INSERT`, con un UUID fijo por fila. Si no,
la app no arranca: la columna es `nullable = false`.

## DTO

- Lombok: `@Data`, `@NoArgsConstructor` y `@AllArgsConstructor`.
- `XxxDTO` para la respuesta. Si la entrada pide otros campos,
  `XxxRequestDTO`.
- Una relación sale plana (`professorName`) o como otro DTO, nunca como
  entidad.

## Mappers

- Una interfaz por entidad, con `@Mapper(componentModel = "spring")`.
- `toDTO(Entidad)` y, si hay escritura, `toEntity(RequestDTO)` con
  `@Mapping(target = "id", ignore = true)` y
  `@Mapping(target = "publicId", ignore = true)`.
- Si un DTO contiene otro DTO, el mapper declara `uses = OtroMapper.class`.
- Nada de mapeo manual con `new XxxDTO(...)` en el service.

## Seguridad

- Cada método nuevo del service lleva `@PreAuthorize` con un permiso de
  `data.sql`: `CREATE_`, `READ_`, `UPDATE_` o `DELETE_` seguido del
  nombre de la entidad en mayúsculas. Ejemplo:
  `@PreAuthorize("hasAuthority('READ_STUDENT')")`.
- Si una entidad no tiene esos permisos en `data.sql`, agrégalos y
  asígnalos al rol ADMIN.
