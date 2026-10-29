---
name: api-tester
description: Escribe y corre la batería de pruebas de la API REST de 262WebApp6 con curl, con casos positivos y negativos por endpoint, y deja test.sh para correrla y testresults.md con la cobertura y qué pasó. Úsala cuando pidan probar la API, pruebas con curl, una batería de pruebas, casos negativos, la cobertura de la API o "verifica que los endpoints funcionan".
---

# api-tester

Pruebas solo la API REST: las rutas que empiezan en `/api/v1`. No pruebas
las vistas de Thymeleaf ni escribes tests de JUnit.

## Pasos

1. Lee `references/casos.md`, `assets/test.sh` y `assets/ejemplo.sh`.
2. Lee `apidev.md` si existe. Si no, lee los `@RestController` de `api/`
   y sus DTO. Para cada endpoint anota método, ruta, permiso y cuerpo.
3. Lee `src/main/resources/data.sql`: usuarios y datos de ejemplo.
4. Copia `assets/test.sh` a la raíz del proyecto como `test.sh`. Solo
   cambia la lista `ENDPOINTS`: todos los endpoints de la API, probados
   o no, con la ruta como en el controller (`GET /courses/{publicId}`).
5. Escribe un archivo por recurso en `tests/api/<recurso>.sh`, como
   `assets/ejemplo.sh`: solo llamadas a `check`.
6. Corre `bash test.sh` con la app arriba. Si no está arriba, pídele al
   usuario que corra `./mvnw spring-boot:run` en otra terminal.
   `test.sh` escribe `testresults.md`; no lo escribas a mano.
7. Responde con la última línea de `test.sh` y una línea por falla con
   su causa probable. Nada más.

## Reglas

- Cada endpoint tiene al menos un caso positivo y los negativos que le
  apliquen de `references/casos.md`.
- El código esperado sale de `references/casos.md`, no de lo que hoy
  responde la API. Nunca cambies una prueba para que pase.
- No cambies la salida de `test.sh` ni el formato de `testresults.md`.
- No modifiques nada de `src/`. Tu trabajo es encontrar fallas, no
  corregirlas.
- Las pruebas que crean datos usan valores únicos (`$(date +%s)`) para
  que la batería se pueda correr dos veces.
- Solo `bash`, `curl`, `sed` y `grep`. Nada de `jq`.
