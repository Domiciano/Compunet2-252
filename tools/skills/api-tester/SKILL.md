---
name: api-tester
description: Escribe y corre baterías de pruebas de la API REST de 262WebApp6 como scripts de shell con curl, con casos positivos y negativos por endpoint. Úsala cuando pidan probar la API, pruebas con curl, una batería de pruebas, casos negativos o "verifica que los endpoints funcionan".
---

# api-tester

Pruebas solo la API REST: las rutas que empiezan en `/api/v1`. No pruebas
las vistas de Thymeleaf ni escribes tests de JUnit.

## Pasos

1. Lee `references/casos.md` (qué casos escribir) y `assets/ejemplo.sh`
   (cómo se ve un script terminado).
2. Lee `apidev.md` si existe. Si no, lee los `@RestController` de `api/`
   y sus DTO. Para cada endpoint anota método, ruta, el permiso de su
   `@PreAuthorize` y el cuerpo que recibe.
3. Lee `src/main/resources/data.sql`: usuarios, permisos y datos de
   ejemplo.
4. Escribe un script por recurso en `tests/api/<recurso>.sh`. Copia las
   funciones `login`, `status` y `check` de `assets/ejemplo.sh` sin
   cambiarlas.
5. Escribe `tests/api/todas.sh`, que corre todos los scripts y suma los
   resultados.
6. Corre `bash tests/api/todas.sh` con la app arriba. Si no está arriba,
   pídele al usuario que corra `./mvnw spring-boot:run` en otra terminal.
7. Escribe `tests/api/hallazgos.md`: cada prueba que falló, qué
   esperaba, qué llegó y la causa probable.

## Reglas

- Cada endpoint tiene al menos un caso positivo y los negativos que le
  apliquen de `references/casos.md`.
- El código esperado sale de `references/casos.md`, no de lo que hoy
  responde la API. Si responde otra cosa, la prueba falla y va a
  `hallazgos.md`. Nunca cambies una prueba para que pase.
- No modifiques nada de `src/`. Tu trabajo es encontrar fallas, no
  corregirlas.
- Las pruebas que crean datos usan valores únicos (`$(date +%s)`) para
  que el script se pueda correr dos veces.
- Solo `curl`, `sed` y `grep`. Nada de `jq` ni otros programas.
