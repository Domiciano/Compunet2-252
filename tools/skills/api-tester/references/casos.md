# Casos de prueba por endpoint

## Usuarios de data.sql

Todos con la contraseña `123456`.

- `nicolas`: ROLE_ADMIN, con todos los permisos.
- `barragan`: ROLE_DIRECTOR. Solo `READ_STUDENT`, `READ_PROFESSOR`,
  `READ_COURSE` y los cuatro permisos de `ENROLLMENT`.

## Positivos

- Leer con un usuario que tiene el permiso: 200, y el cuerpo trae los
  campos del DTO.
- Crear con datos válidos: 201, y el cuerpo trae el recurso con su
  `publicId`.
- Borrar algo que existe: 204.
- Ningún cuerpo de respuesta trae `"id":` ni `"password"`.

## Negativos

- Sin el encabezado `Authorization`: 401.
- Token alterado (una letra cambiada en el payload): 401.
- Usuario sin el permiso, por ejemplo `barragan` creando un estudiante:
  403.
- `publicId` que no existe: 404.
- JSON mal formado o sin un campo obligatorio: 400.
- Crear algo que repite un campo único (dos estudiantes con el mismo
  `code`): 409.
- Login con contraseña equivocada: 401.

## Si llega un 302

La API redirigió el error a la página de login de Thymeleaf en vez de
responder con un código de error. La prueba falla y va a `hallazgos.md`
con esa causa probable.

## Cómo se nombra un caso

`<MÉTODO> <ruta> · <situación>`. Ejemplo: `POST /students · sin permiso`.
