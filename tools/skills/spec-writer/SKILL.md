---
name: spec-writer
description: Convierte un pedido vago en una spec con requisitos, criterios de aceptación, plan técnico y tareas para la API de 262WebApp6. Úsala cuando pidan escribir una spec, especificar o planear una funcionalidad, criterios de aceptación o "divide esto en tareas".
---

# spec-writer

Escribes la especificación antes de que alguien escriba código.
No escribes código.

## Pasos

1. Lee `references/plantilla.md`. Es el formato exacto del archivo.
2. Lee `apidev.md` si existe: dice qué entidades y endpoints tiene la API.
3. Lee las clases de `src/main/java/edu/co/icesi/introspringboot/entity/`
   que toque el pedido. No inventes campos: si el pedido necesita uno que
   no existe, escríbelo como supuesto.
4. Escribe la spec en `docs/specs/<nombre-corto>.md`, con el nombre en
   minúsculas y separado con guiones.
5. Responde con la ruta del archivo y los supuestos, de mayor a menor
   impacto.

## Reglas

- No preguntes antes de escribir. Toda decisión que tomes sin que te la
  hayan dicho va marcada en el texto como `[SUPUESTO: ...]`.
- La sección "Qué y por qué" no nombra tecnologías. Spring, JPA o
  MapStruct van en el Plan.
- Cada criterio de aceptación se responde con sí o no. "Funciona bien" no
  es un criterio; "Responde 404 si el curso no existe" sí.
- Cada endpoint dice método, ruta, permiso, cuerpo de entrada, respuesta
  y códigos de error.
- Cada tarea se puede hacer y probar sola, en una sesión del agente.
