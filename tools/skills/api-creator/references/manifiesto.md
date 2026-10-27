# Formato de apidev.md y apidevlog.md

## apidev.md

Es la foto actual de la API. Se reescribe completo cada vez. Lleva una
sección por cada clase con `@Entity`, en orden alfabético, y al final
los pendientes: todo lo que incumple `references/convenciones.md`.

```markdown
# Manifiesto de la API · 262WebApp6

Actualizado: AAAA-MM-DD

## Course

- Expuesta: sí · DTO: `CourseDTO` · Mapper: `CourseMapper`
- publicId: sí
- `GET /api/v1/courses` · `READ_COURSE` · 200: lista de `CourseDTO`

## Student

- Expuesta: no · publicId: no
- Falta: DTO, mapper y endpoints

## Pendientes

- Student no tiene publicId.
- `ProfessorDTO` trae el `id` numérico.
```

## apidevlog.md

Es el histórico. Cada vez que trabajas agregas una entrada al final.
Las anteriores no se tocan.

```markdown
## AAAA-MM-DD HH:MM · <el pedido, en una línea>

- Hice: <qué cambió, en una o dos frases>
- Archivos: `api/dto/StudentDTO.java` (nuevo),
  `service/impl/StudentServiceImpl.java` (editado)
- Decisiones: <lo que elegiste y por qué>
- Verificación: `./mvnw -q compile` sin errores
- Pendiente: <lo que quedó sin hacer>
```
