# Spec: <título corto>

## Qué y por qué

Una o dos frases: qué hace la funcionalidad y para quién.

## Requisitos

1. El sistema permite ...
2. ...

## Casos borde

- Qué pasa si el recurso no existe.
- Qué pasa si quien lo pide no tiene permiso.
- Qué pasa con datos repetidos o incompletos.

## Criterios de aceptación

- Dado <situación>, cuando <acción>, entonces <resultado observable>.
- ...

## Plan

### Endpoints

- `GET /api/v1/courses/{publicId}` · permiso `READ_COURSE`
  - Entrada: ninguna
  - 200: `CourseDTO`
  - Errores: 401 sin token, 403 sin permiso, 404 si no existe

### Datos

Entidades y campos nuevos o modificados. DTO de entrada y de salida,
con sus campos.

### Capas

Qué cambia en `entity/`, `repo/`, `service/`, `service/impl/`,
`api/dto/`, `api/mapper/` y `api/`.

## Tareas

### Tarea 1: <título>

- Depende de: ninguna
- Qué construir: ...
- Criterios: ...

## Supuestos

1. [ALTO] <decisión tomada> · Corregir si: <cuándo es falsa>
2. [MEDIO] ...
