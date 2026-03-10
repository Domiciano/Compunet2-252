# Resumen y Análisis — Modelo de Datos
**Curso:** Computación en Red II
**Fecha de revisión:** 2026-03-05

---

## Proyecto Seleccionado

**Aplicación de actividad física – Universidad Icesi**

La totalidad de los grupos que presentaron el proyecto correcto modelaron esta propuesta. La plataforma busca centralizar la gestión de rutinas de entrenamiento, el seguimiento del progreso de usuarios (estudiantes y colaboradores), la asignación de entrenadores, y la publicación de eventos y espacios deportivos dentro del campus universitario.

---

## Estudiantes no encontrados en las entregas

Los siguientes estudiantes del listado oficial no fueron identificados en ninguna de las carpetas de entrega, ni como participante individual ni como integrante de un grupo:

- David Alejandro Troya Fajardo (@DavidIsGod)
- David Chicue Romero (@Davinerto9)
- Ismael David Barrionuevo Ramírez (@DavidRamirez206)
- Manuela Marín Millán (@Manuela-Marin)
- Miguel Pérez Ojeda (@miguelperezdev)
- Nicolás Góngora Rincón (@itsnigori98)
- Nicolás Quiñones Ríos (usuario no vinculado)
- Santiago Morales Cerón (@SantiagoMorales1511)

---

## Análisis por entrega

---

### Entrega 1 — Alejandro Rendón Garzón (@AlejoRendon095)

**Integrantes:** Alejandro Rendón Garzón (individual)
**Archivo:** `Aplicacion de actividad fisica.pdf`

#### Coherencia del modelo

El modelo está completamente alineado con el proyecto de actividad física. Las entidades cubren todas las funcionalidades clave del sistema: gestión de usuarios con roles y permisos, ejercicios con su tipo, rutinas compuestas de ejercicios, registro de progreso, asignación de entrenadores, recomendaciones, notificaciones, mensajería entre usuarios, eventos y espacios físicos. La cobertura funcional es completa y la nomenclatura es clara y consistente.

#### Relaciones con sentido

Las relaciones están bien planteadas. La tabla `USER_ROL` como puente entre `USER` y `ROL`, y `ROL_PERMISSION` entre `ROL` y `PERMISSION`, implementan correctamente el patrón RBAC (control de acceso basado en roles) recomendado. La tabla `WORKOUT_ROUTINE` como intersección entre `EXERCISE` y `ROUTINE` con atributos propios (`repetitions`, `sets`, `time_goal`) es un diseño correcto para una relación muchos-a-muchos con datos adicionales. La tabla `ASIGNATION` con clave primaria compuesta referenciando dos veces a `USER` (el usuario y el entrenador) es una forma válida de modelar la relación entrenador-usuario. `RECOMENDATION` referencia `ASIGNATION` mediante FK compuesta, lo que garantiza integridad referencial y mantiene el contexto de quién recomendó a quién.

#### Atributos con sentido

Los atributos son pertinentes y reflejan bien el dominio. `EXERCISE` incluye descripción, duración, nivel de dificultad y URL del video, que son exactamente los campos necesarios. `PROGRESS` captura repeticiones, tiempo real y nivel de esfuerzo. Sin embargo, varios campos `VARCHAR2(50)` son demasiado cortos: las URLs de video pueden superar fácilmente los 50 caracteres, y se recomienda usar `VARCHAR2(500)` para campos de tipo URL. El tipo `NUMBER(2)` para `dificulty_level` es adecuado si se usa en escala de 1 a 10.

#### Agrupamiento de variables en tablas

El agrupamiento es correcto. `PLACE` está bien separado de `EVENT`, permitiendo que un espacio físico aloje múltiples eventos. `EXERCISE_TYPE` está normalizado como tabla de referencia independiente. `MESSAGE` y `NOTIFICATION` tienen responsabilidades distintas y correctamente separadas. `ASIGNATION` está separada de `RECOMENDATION`, lo cual es un buen diseño porque una asignación puede tener varias recomendaciones a lo largo del tiempo.

#### Primera Forma Normal (1NF)

El modelo cumple con 1NF. No se observan columnas multivaluadas ni grupos repetitivos dentro de ninguna tabla.

#### Segunda Forma Normal (2NF)

El modelo cumple con 2NF. Los atributos de `WORKOUT_ROUTINE` (`repetitions`, `sets`, `time_goal`) dependen del par compuesto `(EXERCISE_id, ROUTINE_id)`, que es la clave primaria compuesta de esa tabla. No existen dependencias parciales.

#### Tercera Forma Normal (3NF)

El modelo cumple con 3NF. No se observan dependencias transitivas entre atributos no clave. Cada atributo depende únicamente de la clave primaria de su tabla.

#### Consejo sobre roles y permisos

El patrón de Users, Roles y Permissions está implementado correctamente con las tablas de unión `USER_ROL` y `ROL_PERMISSION`. Este es exactamente el enfoque recomendado. Se puede considerar agregar un campo `active` o `enabled` a las tablas de unión para permitir desactivar un rol o permiso sin eliminarlo.

---

### Entrega 2 — Andrés Felipe Fajardo Gaviria (@AndresFaGa)

**Integrantes:** Andrés Felipe Fajardo Gaviria (individual)
**Archivo:** `Mapa proyecto.pdf`

#### Coherencia del modelo

El modelo cubre los módulos principales de la aplicación: usuarios, entrenadores, rutinas, ejercicios, progreso, notificaciones y eventos. Sin embargo, tiene ausencias importantes: no hay manejo de roles y permisos, no hay espacios físicos relacionados con los eventos, y no hay registro de inscripción de usuarios a eventos.

#### Relaciones con sentido

Las relaciones entre `ROUTINE`, `USER` y `COACH` son razonables: una rutina puede pertenecer a un usuario y ser diseñada por un entrenador. Sin embargo, tener `COACH` como una tabla completamente independiente de `USER` es un problema estructural. Un entrenador también es un usuario del sistema y debería heredar sus características, no duplicarlas. `PROGRESS` relaciona al usuario con ejercicios específicos (no con rutinas), lo que limita el análisis del progreso en el contexto de una rutina completa. `EVENT` existe como tabla aislada sin ninguna FK hacia `USER`, `SPACE` o `PLACE`, lo que impide registrar quién crea los eventos o qué usuarios se inscriben.

#### Atributos con sentido

Los atributos son adecuados para las tablas presentes. `EXERCISE` incluye `type` y `difficulty`, aunque como columnas `VARCHAR2` directas en lugar de referencias a tablas de catálogo, lo cual puede generar inconsistencias en los valores. `NOTIFICATION.status` y `NOTIFICATION.was_send` son útiles para el seguimiento del estado de las notificaciones.

#### Agrupamiento de variables en tablas

El mayor problema de agrupamiento es que `COACH` está separado de `USER`. Esto genera duplicación de atributos (email, name, status) y rompe el principio de generalización: tanto un usuario regular como un entrenador son personas del sistema con credenciales de acceso. El modelo correcto sería tener una única tabla `USER` con un rol que defina si es entrenador o no.

#### Primera Forma Normal (1NF)

El modelo cumple con 1NF.

#### Segunda Forma Normal (2NF)

El modelo cumple con 2NF. En `ROUTINE_EXERCISE`, los atributos `repeats` y `series` dependen del par compuesto `(ROUTINE_id, EXERCISE_id)`.

#### Tercera Forma Normal (3NF)

El modelo cumple parcialmente. El campo `user_type` en `USER` podría generar una dependencia transitiva si en el futuro se quiere asociar comportamientos o permisos a ese tipo. Es mejor gestionar los tipos/roles en tablas separadas.

#### Consejo sobre roles y permisos

Este modelo no tiene ningún mecanismo de control de acceso por roles ni permisos. El campo `user_type` en `USER` es un antipatrón si el sistema requiere múltiples roles por usuario o permisos granulares. Se recomienda implementar el patrón con tres entidades: `USER`, `ROLE` y `PERMISSION`, con tablas de unión `USER_ROLE` y `ROLE_PERMISSION`, tal como se enseñó en clase. Adicionalmente, separar `COACH` como tabla independiente en lugar de modelarlo como un rol de usuario es precisamente el antipatrón que se busca evitar: si en el futuro se agregan roles como "administrador de espacios" o "nutricionista", se correría el riesgo de crear una nueva tabla por cada rol. El patrón EAV (Entity-Attribute-Value) o el patrón de roles genéricos evita esta proliferación de tablas.

---

### Entrega 3 — Diana María Garzón Toro (@Pauli-alt) / Nathalie Sánchez Trujillo (@Nathast22) / Paula Andrea Ferreira Ladino

**Integrantes:** Diana María Garzón Toro, Nathalie Sánchez Trujillo, Paula Andrea Ferreira Ladino
**Archivos:** `Relational_1.pdf` (Diana Garzón) / `MR_Paula Ferreira, Diana Garzon, Nathalie Sanchez.pdf` (Paula Ferreira) — ambos son el mismo diagrama entregado por separado.

#### Coherencia del modelo

El modelo es completo y coherente con el proyecto de actividad física. Abarca usuarios, roles, permisos, ejercicios, rutinas, progreso, asignaciones de entrenador, recomendaciones, eventos y espacios. La nomenclatura en español es consistente y apropiada. La cobertura funcional cubre la mayoría de los requisitos del proyecto.

#### Relaciones con sentido

Las relaciones están bien planteadas. `RUTINAS_EJERCICIOS` como tabla de intersección con atributos propios (`orden`, `repeticiones`, `tiempo`) es correcto para una relación muchos-a-muchos con datos adicionales. `ASIGNACIONES` relaciona al entrenador con el usuario correctamente. `RECOMENDACIONES` referencia al entrenador (id_entrenador) pero no tiene FK formal al usuario que recibe la recomendación, lo cual es una omisión que dificulta saber a quién va dirigida cada recomendación. `EVENTOS` referencia `ESPACIOS` correctamente.

#### Atributos con sentido

Los atributos son pertinentes. Sin embargo, `video_url BLOB` en `EJERCICIOS` es un error de diseño significativo: un campo `BLOB` almacenaría el video directamente en la base de datos, lo cual es una mala práctica. Las URLs de video deben almacenarse como `VARCHAR2(500)`, guardando la referencia al recurso externo, no el binario en sí. La tabla `RUTINAS` tiene `tipo` como `VARCHAR2(30)` libre; normalizar este campo en una tabla de catálogo mejoraría la consistencia de datos.

#### Agrupamiento de variables en tablas

El agrupamiento es correcto en general. `ESPACIOS` separado de `EVENTOS` es una buena decisión. `ASIGNACIONES` y `RECOMENDACIONES` están correctamente separadas. La tabla `ROLES_PERMISOS` tiene un campo `ID` propio (PK sintética) además de las FKs `ROLES_Id` y `PERMISOS_Id`, lo cual es innecesario: la PK compuesta de los dos campos foráneos es suficiente para una tabla de intersección y el ID adicional genera confusión.

#### Primera Forma Normal (1NF)

El modelo cumple con 1NF. No hay grupos repetitivos ni columnas multivaluadas.

#### Segunda Forma Normal (2NF)

El modelo cumple con 2NF en la mayoría de las tablas. En `ROLES_PERMISOS`, al tener un `ID` sintético como PK, los demás atributos dependen de ese ID y no del par compuesto `(ROLES_Id, PERMISOS_Id)`, lo cual puede generar confusión sobre la naturaleza de la dependencia funcional. Se recomienda usar una PK compuesta directamente.

#### Tercera Forma Normal (3NF)

El modelo cumple con 3NF. No se observan dependencias transitivas significativas entre atributos no clave.

#### Consejo sobre roles y permisos

El patrón de `USUARIOS`, `ROLES`, `PERMISOS`, `USERS_ROLES` y `ROLES_PERMISOS` está implementado correctamente siguiendo el patrón many-to-many recomendado. Se sugiere revisar que `ROLES_PERMISOS` use PK compuesta en lugar de un ID sintético propio.

---

### Entrega 4 — Edwar Andrés Estacio Raigosa (@EstacioEA) / Juan Diego Balanta Molina (@JuanDb20) / Valeria Piza Saavedra (@ValeriaPiza)

**Integrantes:** Edwar Andrés Estacio Raigosa, Juan Diego Balanta Molina, Valeria Piza Saavedra
**Archivos:** `ImagenModelo.pdf` (Edwar Estacio) / `MR.pdf` (Valeria Piza) — son dos versiones del mismo modelo, con diferencias importantes entre sí.

> **Observacion importante:** Este grupo modeló una **plataforma de Marketplace/emprendimiento universitario**, no la aplicación de actividad física seleccionada. El modelo es de un sistema de compra-venta de productos entre usuarios, con categorías, ofertas, mensajes, reseñas y favoritos.

> **Inconsistencia entre versiones:** La versión entregada por Edwar (`ImagenModelo.pdf`) incluye RBAC completo con tablas de unión `USER_ROLES`, `ROLES` y `ROLE_PERMISSIONS`. La versión entregada por Valeria (`MR.pdf`) tiene el rol almacenado directamente como columna `role VARCHAR2(20)` en `USERS`, sin tablas de roles ni permisos. Esta inconsistencia indica que el grupo presentó dos versiones en estado evolutivo diferente sin consolidar una versión final.

#### Coherencia del modelo

El modelo de marketplace es internamente coherente: `PRODUCTS`, `CATEGORIES`, `OFFERS`, `MESSAGES`, `REVIEWS`, `NOTIFICATIONS` y `FAVORITES` representan correctamente el dominio de una plataforma de compra-venta. Sin embargo, no corresponde al proyecto asignado.

#### Relaciones con sentido

Las relaciones del marketplace son correctas y bien pensadas. `PRODUCTS → USERS` (seller) y `OFFERS → USERS` (buyer) distinguen correctamente los roles comerciales sin necesitar tablas de rol separadas para ese dominio. `REVIEWS` referencia dos veces a `USERS` (reviewer y reviewed), lo que permite evaluar tanto a compradores como a vendedores. `FAVORITES` tiene un constraint `UNIQUE(user_id, product_id)` que correctamente evita duplicados de favoritos.

#### Atributos con sentido

Los atributos son completos y bien tipados. `PRODUCTS` incluye `condition` (estado del producto: nuevo/usado), `location` y `status`, todos relevantes para un marketplace. `REVIEWS.rating NUMBER(1)` es limitado: solo permite valores del 0 al 9, y si la escala es de 1 a 5 estrellas puede funcionar, pero se recomienda agregar un constraint `CHECK(rating BETWEEN 1 AND 5)` para dejar explícito el rango.

#### Agrupamiento de variables en tablas

El agrupamiento es correcto. `PRODUCTS_IMAGES` separado de `PRODUCTS` es un buen diseño para manejar múltiples imágenes por producto. `CATEGORIES` está bien separada como catálogo independiente. Sin embargo, en `NOTIFICATIONS`, el campo `reference_id` sin FK formal es un antipatrón: su significado cambia según el campo `type`, apuntando a diferentes tablas sin integridad referencial garantizada. Este es un patrón polimórfico que debe usarse con cuidado o evitarse en favor de FKs específicas por tipo de notificación.

#### Primera Forma Normal (1NF)

El modelo cumple con 1NF.

#### Segunda Forma Normal (2NF)

El modelo cumple con 2NF.

#### Tercera Forma Normal (3NF)

El modelo cumple con 3NF en la mayoría de las tablas. El campo `reference_id` en `NOTIFICATIONS` combinado con `type` crea una dependencia semántica que no puede validarse con constraints de base de datos, lo cual es una debilidad de integridad referencial.

#### Consejo sobre roles y permisos

La versión consolidada (Edwar) implementa correctamente el patrón con `USER_ROLES`, `ROLES` y `ROLE_PERMISSIONS`. La versión de Valeria, en cambio, tiene el rol como columna directa en `USERS`, lo que no permite múltiples roles por usuario ni permisos granulares. Esta diferencia entre versiones debe resolverse adoptando la versión con tablas de unión. El patrón que el equipo debe unificar es: `USERS` muchos-a-muchos `ROLES` (vía `USER_ROLES`), y `ROLES` muchos-a-muchos `PERMISSIONS` (vía `ROLE_PERMISSIONS`).

---

### Entrega 5 — Johan Stiven Suárez Perdomo (@Jo-Ssua)

**Integrantes:** Johan Stiven Suárez Perdomo (individual)
**Archivo:** `App_Actividad_Fisica_Relacional.pdf`

#### Coherencia del modelo

El modelo es muy completo y coherente con el proyecto de actividad física. Cubre usuarios, roles, políticas de acceso, ejercicios, rutinas, progreso, asignaciones de entrenador, recomendaciones, notificaciones, actividades y espacios. La tabla `SCHEDULES` separada para los horarios de actividades es un diseño avanzado que permite manejar actividades con múltiples horarios a lo largo de la semana.

#### Relaciones con sentido

Las relaciones están muy bien planteadas. El uso de `POLICIES` en lugar de `PERMISSIONS` introduce una granularidad mayor al incluir los campos `resource` y `action`, acercándose a un modelo de control de acceso basado en atributos (ABAC) además del RBAC básico. `ASSIGNMENTS` con clave primaria compuesta `(id_trainer, id_user)` es una forma correcta de modelar la relación entrenador-usuario evitando duplicados. `ENROLLMENTS` como tabla de unión entre `USERS` y `ACTIVITIES` está bien diseñada con `enrollment_date` como atributo propio de la relación.

#### Atributos con sentido

Los atributos son excelentes. `PROGRESS` incluye `weight_kg`, un atributo relevante para el seguimiento físico que la mayoría de otros modelos omite. `EXERCISES.is_predesigned NUMBER(1)` distingue ejercicios del catálogo predefinido de los personalizados. `NOTIFICATIONS` tiene `type`, `is_read` y referencias tanto al usuario origen como al destino, lo que permite notificaciones dirigidas con contexto.

#### Agrupamiento de variables en tablas

El agrupamiento es excelente. `SCHEDULES` separado de `ACTIVITIES` es una decisión de diseño madura que permite normalizar los horarios y evitar repetición si una actividad ocurre en múltiples días. `SPACES` correctamente separado de `ACTIVITIES`. La separación entre `EXERCISES` (catálogo) y `ROUTINE_EXERCISES` (instancia en una rutina) es coherente y bien ejecutada.

#### Primera Forma Normal (1NF)

El modelo cumple con 1NF. No hay columnas multivaluadas ni grupos repetitivos.

#### Segunda Forma Normal (2NF)

El modelo cumple con 2NF. Los atributos de `ROUTINE_EXERCISES` (`sets`, `target_reps`, `exercise_order`) dependen completamente del par compuesto `(id_routine, id_exercise)`.

#### Tercera Forma Normal (3NF)

El modelo cumple con 3NF. Es uno de los modelos mejor normalizados de la entrega. No se observan dependencias transitivas.

#### Consejo sobre roles y permisos

El patrón está correctamente implementado con `USER_ROLES` y `ROLE_POLICIES`. El uso de `POLICIES` con campos `resource` y `action` es incluso más robusto que el patrón básico de permisos. Es una implementación avanzada que demuestra comprensión profunda del control de acceso.

---

### Entrega 6 — Juan David Calderón Otero (@Juancal1728) / Sebastián Castillo Penilla (@scastillop05)

**Integrantes:** Juan David Calderón Otero, Sebastián Castillo Penilla
**Archivo:** `IcesiAppFit.pdf`

#### Coherencia del modelo

El modelo más completo y detallado de toda la entrega. Cubre todos los requisitos del proyecto y añade funcionalidades adicionales como `PDF_REPORT` para auditoría de reportes generados, `SPACE_SLOT` para gestionar la disponibilidad de espacios, `EXERCISE_MEDIA` para múltiples recursos multimedia por ejercicio, y el subtipo `TRAINER` como extensión especializada de `APP_USER`. La coherencia entre tablas y el dominio del problema es sobresaliente.

#### Relaciones con sentido

Las relaciones son excelentes. El patrón de subtipo `TRAINER` con PK compartida (`user_id` como PK y FK a `APP_USER`) es el mecanismo correcto para modelar herencia/especialización en bases de datos relacionales, evitando duplicar atributos comunes. `RECOMMENDATION` referencia tanto `ROUTINE` como `PROGRESS_LOG` de forma opcional, lo que permite recomendaciones contextualizadas basadas en el progreso específico de un usuario. `EVENT_REGISTRATION` tiene un constraint `UNIQUE(event_id, user_id)` que previene inscripciones duplicadas. `TRAINER_ASSIGNMENT` incluye `assigned_by`, lo que permite auditar quién realizó cada asignación.

#### Atributos con sentido

Los atributos son los más detallados de todas las entregas. `ROUTINE_EXERCISE` incluye `time_rest_seconds` y `notes`, campos que la mayoría de los modelos omite pero que son valiosos para describir una rutina de entrenamiento real. `TRAINER_ASSIGNMENT` tiene `initial_date`, `final_date` y `state_assignment`, permitiendo gestionar el ciclo de vida completo de la asignación. `NOTIFICATION` diferencia entre `type_notification`, `created_at` y `read_at`, permitiendo calcular el tiempo hasta la lectura.

#### Agrupamiento de variables en tablas

El agrupamiento es el más sofisticado. `SPACE_SLOT` como tabla independiente para gestionar franjas horarias de los espacios es un diseño innovador que permite la reserva de espacios por evento. `PDF_REPORT` como tabla de auditoría registra cada reporte generado con su rango de fechas y URL del archivo. `EXERCISE_MEDIA` separado de `EXERCISE` permite múltiples videos/imágenes por ejercicio con su propia clave primaria.

#### Primera Forma Normal (1NF)

El modelo cumple con 1NF.

#### Segunda Forma Normal (2NF)

El modelo cumple con 2NF. En `ROUTINE_EXERCISE`, que tiene su propia PK sintética `routine_exercise_id` además del par `(routine_id, exercise_id)` como UNIQUE, los atributos dependen del ID sintético. Esto es una opción válida de diseño cuando se quiere referenciar la tabla desde otros lugares (como `PROGRESS_LOG.routine_exercise_id`).

#### Tercera Forma Normal (3NF)

El modelo cumple con 3NF. Es el modelo con mejor normalización de toda la entrega.

#### Consejo sobre roles y permisos

El patrón está correctamente implementado con `USER_ROLE`, `ROLE` y `ROLE_PERMISSION`. La decisión de modelar `TRAINER` como subtipo especializado de `APP_USER` es exactamente el enfoque correcto para evitar duplicar atributos comunes de usuario y evitar crear una tabla separada por cada tipo de actor del sistema. Excelente aplicación del principio enseñado en clase.

---

### Entrega 7 — Juan Camilo Criollo Cifuentes (@juannk) / Samuel David Cifuentes Álvarez (@samuelcifuentes) / Juan Sebastián Romero Torres (@sebasGeto)

**Integrantes:** Juan Camilo Criollo Cifuentes, Samuel David Cifuentes Álvarez, Juan Sebastián Romero Torres
**Archivo:** `diseño de propuesta.pdf`

> **Observacion importante:** Este grupo modeló la plataforma de **Pensamiento Computacional (gamificación académica)**, no la aplicación de actividad física seleccionada.

#### Coherencia del modelo

El modelo es coherente con el proyecto de gamificación académica que eligieron modelar. Las entidades `ACTIVIDAD`, `EJERCICIO`, `RESOLUCION`, `CODIGO_PUNTOS`, `HISTORIAL_PUNTOS`, `PODIUM` y `EVENTO_SCOREBOARD` representan bien el dominio de un sistema de ejercicios de programación con puntajes y clasificaciones. Sin embargo, `GRUPO` tiene varias FKs redundantes hacia tablas de intersección (`PROFESOR_GRUPO`, `ESTUDIANTE_GRUPO`) que crean referencias circulares innecesarias y dificultan la lectura del diagrama.

#### Relaciones con sentido

La separación de `ACTIVIDAD` y `EJERCICIO` es correcta: una actividad contiene varios ejercicios. Sin embargo, `EJERCICIO` tiene FK directa a `ACTIVIDAD`, y además existe `ACTIVIDAD_EJERCICIO` como tabla de unión entre ambas. Esta duplicidad es una inconsistencia: si `EJERCICIO.ACTIVIDAD_id` ya establece la relación, la tabla `ACTIVIDAD_EJERCICIO` es redundante, y viceversa. El modelo debe escoger uno de los dos enfoques. `CODIGO_PUNTOS` como mecanismo de puntuación mediante código alfanumérico es una implementación creativa y pertinente para el dominio.

#### Atributos con sentido

Los atributos son adecuados para el dominio. `ACTIVIDAD` tiene `fecha_inicio` y `fecha_fin` que definen la ventana de tiempo activa. `EJERCICIO.nivel_dificultad INTEGER` es correcto. `EVENTO_SCOREBOARD` como tabla de historial de eventos del scoreboard en tiempo real es una decisión de diseño creativa para persistir los cambios del marcador.

#### Agrupamiento de variables en tablas

`GRUPO` concentra demasiadas FKs y parece intentar modelar relaciones que deberían estar en las tablas de intersección. Los campos `id_semestre VARCHAR2` y `SEMESTRE_id_semestre INTEGER` son aparentemente duplicados dentro de la misma tabla, lo que indica un error de modelado. `PERFIL_ESTUDIANTE` y `PERFIL_PROFESOR` como tablas de subtipo de `USUARIO` son un enfoque válido de especialización, pero generan complejidad si los atributos diferenciadores son pocos.

#### Primera Forma Normal (1NF)

El modelo cumple con 1NF en general. Sin embargo, `GRUPO` tiene `id_semestre VARCHAR2` e `id_semestre INTEGER` que parecen ser el mismo dato en dos columnas de tipos distintos, lo que viola el principio de atomicidad.

#### Segunda Forma Normal (2NF)

En `GRUPO`, si `id_semestre VARCHAR2` y `SEMESTRE_id_semestre INTEGER` son columnas duplicadas, esto viola 2NF ya que uno de los dos atributos no depende directamente de la clave primaria sino del otro. Se debe eliminar la columna redundante.

#### Tercera Forma Normal (3NF)

El campo `rol VARCHAR2(20)` directamente en `USUARIO` puede generar dependencias transitivas si en el futuro se asocian comportamientos, permisos o perfiles al tipo de rol. Por ejemplo, el tipo de usuario determina si existe `PERFIL_ESTUDIANTE` o `PERFIL_PROFESOR`, creando una dependencia transitiva entre `rol` y el tipo de perfil.

#### Consejo sobre roles y permisos

El rol se maneja como una columna `VARCHAR2(20)` directamente en `USUARIO`, sin tabla de roles separada ni tabla de permisos. Este antipatrón limita la flexibilidad del sistema. Se recomienda implementar el patrón `USUARIO - ROLES - PERMISOS` con tablas de unión. Además, el uso de `PERFIL_ESTUDIANTE` y `PERFIL_PROFESOR` como tablas separadas por tipo de usuario es precisamente el antipatrón que se busca evitar: si se agregan nuevos tipos de usuario en el futuro (monitor, ayudante de laboratorio, visitante externo), se necesitaría crear una nueva tabla de perfil por cada tipo. El patrón EAV (Entity-Attribute-Value) o el patrón de roles genéricos con una tabla de extensión de perfil unificada (`USER_PROFILE`) evita esta proliferación de tablas.

---

### Entrega 8 — Juan Esteban Gómez Higidio (@JEGH18)

**Integrantes:** Juan Esteban Gómez Higidio (individual)
**Archivo:** `modelodedatos.png`

> **Observacion importante:** Este estudiante entregó un **modelo lógico/conceptual** (diagrama UML/ERD con notación de entidades y atributos) en lugar de un modelo relacional físico con PKs, FKs y tipos de datos explícitos. El modelo no incluye claves primarias ni foráneas en formato relacional.

#### Coherencia del modelo

El modelo conceptual es el más completo y sofisticado a nivel de diseño lógico. La separación entre `WORKOUT_SESSION` (sesión de entrenamiento completa) y `SESSION_ENTRY` (cada ejercicio realizado dentro de la sesión) es una abstracción muy bien pensada que permite granularidad en el registro del progreso. `EVENT_OCCURRENCE` para eventos recurrentes es un diseño avanzado que permite manejar la programación de eventos con múltiples ocurrencias sin duplicar la entidad evento.

#### Relaciones con sentido

Las relaciones están muy bien planteadas. `RECOMMENDATION` referencia a `TRAINER_ASSIGNMENT` para mantener el contexto de la asignación activa, y opcionalmente a `ROUTINE` para recomendaciones contextualizadas. `NOTIFICATION` tiene campo `channel` (WEBSOCKET, INAPP, EMAIL) que anticipa la implementación técnica de los distintos canales. `REPORT_REQUEST` sin referencia a `USER` es una omisión: no se puede saber qué usuario solicitó el reporte.

#### Atributos con sentido

Los atributos son excelentes. El uso de `uuid` como tipo de clave primaria es una buena práctica para sistemas distribuidos. `EXERCISE.video_url : boolean` es un error tipográfico evidente: debería ser `varchar` o `string` para almacenar la URL. `EVENT_ENROLLMENT.status` con valores `ENROLLED|CANCELLED|ATTENDED|NO_SHOW` es muy completo para el ciclo de vida de una inscripción.

#### Agrupamiento de variables en tablas

El agrupamiento es el más sofisticado de la entrega. `WORKOUT_SESSION` como contenedor de una sesión completa y `SESSION_ENTRY` para cada ejercicio individual dentro de ella es un diseño elegante que evita mezclar datos de sesión con datos de ejercicio individual. `SPACE` y `EVENT` correctamente separados. `EVENT_OCCURRENCE` como tabla de ocurrencias permite programar un evento que se repite en el tiempo sin duplicar los datos del evento base.

#### Primera Forma Normal (1NF)

Al ser un modelo lógico/conceptual, la evaluación de formas normales formales no aplica directamente. Sin embargo, el diseño no presenta grupos repetitivos ni atributos multivaluados visibles.

#### Segunda Forma Normal (2NF)

El diseño conceptual muestra que los atributos en las tablas de intersección (`ROUTINE_ITEM`, `SESSION_ENTRY`) dependen completamente de sus claves compuestas, cumpliendo con los principios de 2NF.

#### Tercera Forma Normal (3NF)

El diseño muestra buena separación de responsabilidades, sin dependencias transitivas evidentes.

#### Consejo sobre roles y permisos

El modelo tiene `USER_ROLE` como tabla de unión entre `USER` y `ROLE`, lo cual es correcto. Sin embargo, **no existe tabla de `PERMISSION` ni mecanismo de permisos granulares**. Los permisos están implícitos en el código del rol (`USER|TRAINER|ADMIN`), lo que no permite configuración dinámica de permisos sin modificar el código. Se recomienda agregar la entidad `PERMISSION` y la tabla de unión `ROLE_PERMISSION` para implementar el patrón RBAC completo recomendado en clase.

---

### Entrega 9 — Juan Manuel Ramírez Gómez (@Juanma0929) / Juan Sebastián Poveda Medina (@Sebastian-Poveda-dev) / Santiago Alejandro Estrada Martínez (@salejostrada)

**Integrantes:** Juan Manuel Ramírez Gómez, Juan Sebastián Poveda Medina, Santiago Alejandro Estrada Martínez
**Archivos:** `MR_Poveda-Estrada-Ramirez.pdf` (relacional) / `MER_Poveda-Estrada-Ramirez.pdf` (lógico), entregados en ZIP.

#### Coherencia del modelo

El modelo cubre los módulos esenciales del proyecto: usuarios con rol único, entrenadores como subtipo, rutinas, ejercicios por tipo, progreso, asignaciones, recomendaciones, eventos con registro de asistencia, notificaciones y espacios de eventos. La presentación en formato lógico y relacional muestra una comprensión del proceso de diseño. Sin embargo, el módulo de eventos es básico: `EVENT` no está vinculado a ningún espacio físico mediante FK (solo tiene `location VARCHAR2` como cadena de texto libre).

#### Relaciones con sentido

`TRAINERS` como subtipo de `USERS` (con FK compartida) es la implementación correcta de especialización. `RECOMMENDATIONS` apunta a `ROUTINES` y a `TRAINERS`, pero no tiene FK al usuario que recibe la recomendación, lo cual es una omisión importante para poder consultar las recomendaciones de un usuario específico. `USERS_NOTIFICATIONS` como tabla de unión entre usuarios y notificaciones es una opción que permite que una notificación llegue a múltiples usuarios, aunque si cada notificación tiene un único destinatario, bastaría con una FK directa en `NOTIFICATIONS`.

#### Atributos con sentido

`EXERCISES.stimated_duration DATE` es un error de tipo de dato: la duración de un ejercicio debería ser `NUMBER` o `INTEGER` (minutos o segundos), no una fecha. `NOTIFICATIONS` tiene solo `message` y `sent_date`, sin tipo, sin estado de lectura (`read`), y sin referencia al tipo de evento que generó la notificación, lo que lo hace un modelo muy básico comparado con lo que el sistema requiere. `ROLES` es una tabla de catálogo simple con `role_name` y `description`, correctamente separada de `USERS`.

#### Agrupamiento de variables en tablas

La tabla `USERS` tiene FK directa a `ROLES`, implementando la relación un-usuario-un-rol. Este enfoque simplifica el modelo pero no permite asignar múltiples roles a un mismo usuario. `EVENT` no tiene FK a ninguna tabla de espacios: el campo `location VARCHAR2` almacena la ubicación como texto libre, lo que puede generar inconsistencias. Se recomienda crear una tabla `SPACES` o `PLACES` y referenciarla desde `EVENT`.

#### Primera Forma Normal (1NF)

El modelo cumple con 1NF.

#### Segunda Forma Normal (2NF)

El modelo cumple con 2NF. En `ROUTINE_EXERCISE`, los atributos `order`, `repetitions`, `sets` y `goal_time` dependen completamente del par compuesto `(EXERCISES_exercise_id, ROUTINES_ROUTINES_ID)`.

#### Tercera Forma Normal (3NF)

El campo `location VARCHAR2` en `EVENT` podría normalizarse en una tabla de espacios para evitar duplicación cuando el mismo lugar aloja múltiples eventos. Si se deja como `VARCHAR2`, no se puede garantizar la consistencia del nombre del espacio entre diferentes registros de eventos.

#### Consejo sobre roles y permisos

`USERS` tiene FK directa a `ROLES` (un rol por usuario), lo que es un enfoque simple y funcional para sistemas con roles fijos. Sin embargo, no existe tabla de `PERMISSIONS` ni mecanismo de permisos granulares. Se recomienda migrar al patrón many-to-many con tablas de unión `USER_ROLES` y `ROLE_PERMISSIONS` para permitir múltiples roles por usuario y control granular de permisos, tal como se enseñó en clase.

---

### Entrega 10 — Samuel José Rengifo Morales (@s-rengifo) / Anderson Francisco Romero Enríquez (@Andersonjp12)

**Integrantes:** Samuel José Rengifo Morales, Anderson Francisco Romero Enríquez
**Archivos:** `RomeroRengifo_LogicalModel.pdf` (modelo lógico) / `RomeroRengifo_RelationalModel.pdf` (modelo relacional)

> **Nota destacada:** Este grupo entregó tanto el modelo lógico (entidad-relación conceptual) como el modelo relacional físico, siendo los únicos en mostrar explícitamente el proceso de transformación de un modelo a otro. Esto demuestra una comprensión profunda del proceso de diseño de bases de datos.

#### Coherencia del modelo

El modelo es muy completo y coherente con el proyecto de actividad física. Cubre todas las funcionalidades requeridas: usuarios, roles, permisos, ejercicios, rutinas con detalle por ejercicio, progreso, asignaciones de entrenador, recomendaciones, mensajes, notificaciones, eventos con registro, y reportes. La coherencia entre el modelo lógico y el relacional es sólida.

#### Relaciones con sentido

Las relaciones están bien planteadas. `ROUTINE` tiene tanto `owner_user_id` como `created_by_user_id`, lo que permite distinguir entre el usuario que utiliza la rutina y el entrenador que la diseñó. `ROUTINE_DETAIL` como tabla de intersección con PK propia (en lugar de PK compuesta) permite ser referenciada desde otras tablas si fuera necesario. `RECOMMENDATION` vincula entrenador y usuario destinatario, lo que garantiza trazabilidad completa. Sin embargo, `USER.userType` es un campo redundante si los roles ya se gestionan mediante la tabla de roles: un usuario puede tener tipo "trainer" en la columna y también el rol de entrenador en `USER_ROLE`, generando posibles inconsistencias.

#### Atributos con sentido

Los atributos son bien elegidos. `PERMISSION.id VARCHAR2` (en lugar de `INTEGER`) sugiere el uso de identificadores semánticos como `"CREATE_ROUTINE"` o `"VIEW_PROGRESS"`, lo cual es una práctica válida y expresiva. `NOTIFICATION` tiene `priority`, `referenceId`, `referenceType` y separación entre `sendDate` y `readDate`, siendo el modelo de notificaciones más completo de la entrega. `REPORT` tiene `type` y `format`, indicando flexibilidad en los tipos de reportes generados.

#### Agrupamiento de variables en tablas

El agrupamiento es excelente. `ROUTINE_DETAIL` separado de `ROUTINE` y de `EXERCISE` con sus propios atributos (`repetitions`, `sets`, `weekDay`, `notes`) es un diseño muy completo. La separación entre `EXERCISE` (catálogo) y `ROUTINE_DETAIL` (instancia de uso en una rutina) está bien ejecutada. El modelo tiene la misma estructura en el lógico y en el relacional, lo que indica consistencia de diseño.

#### Primera Forma Normal (1NF)

El modelo cumple con 1NF.

#### Segunda Forma Normal (2NF)

El modelo cumple con 2NF.

#### Tercera Forma Normal (3NF)

El campo `userType VARCHAR2(20)` en `USER` puede ser una dependencia transitiva: si el tipo de usuario se puede derivar de los roles asignados en `USER_ROLE`, entonces `userType` es redundante. Se recomienda eliminar `userType` y determinar el tipo de usuario a partir de sus roles, manteniendo una única fuente de verdad.

#### Consejo sobre roles y permisos

El patrón está correctamente implementado con `USER_ROLE`, `ROLE`, `ROLE_PERMISSION` y `PERMISSION`. La única observación es la redundancia de `USER.userType` mencionada en 3NF. El modelo podría beneficiarse de eliminar esa columna para evitar inconsistencias.

---

### Entrega 11 — Ximena Gómez Gómez (@Ximenagg234) / Natalia Delgado Arenas (@ndelgadoar)

**Integrantes:** Ximena Gómez Gómez, Natalia Delgado Arenas
**Archivos:** `Proyecto-CompunetII.pdf` (documento de requisitos, sin diagrama) / `Proyecto_Compunet.pdfII.pdf` (modelo relacional)

> **Observacion importante:** Este grupo modeló una **Plataforma de Gestión de Emprendimientos Universitarios**, no la aplicación de actividad física seleccionada. El primer archivo entregado contiene únicamente el documento de requisitos del proyecto sin ningún diagrama de modelo de datos.

#### Coherencia del modelo

El modelo del marketplace universitario es internamente coherente: `USUARIO`, `EMPRENDIMIENTO`, `CATEGORIA`, `PRODUCTO`, `IMAGEN_PRODUCTO`, `PEDIDO`, `DETALLE_PEDIDO` y `CALIFICACION` representan bien un sistema de comercio entre emprendimientos universitarios y compradores. La tabla `ESTADO` como catálogo reutilizable para múltiples entidades (`EMPRENDIMIENTO`, `PRODUCTO`, `PEDIDO`, `SEMESTRE`) es una decisión de diseño interesante pero que puede generar confusión al mezclar estados de dominio muy diferentes en la misma tabla.

#### Relaciones con sentido

Las relaciones son correctas. `DETALLE_PEDIDO` como tabla de ítems de pedido con `cantidad`, `precio_unitario` y `subtotal` es el diseño estándar para un sistema de órdenes de compra. `EMPRENDIMIENTO` referenciando `SEMESTRE` ata cada emprendimiento a un periodo académico específico. `IMAGEN_PRODUCTO` como tabla separada permite múltiples imágenes por producto, lo cual es correcto.

#### Atributos con sentido

Los atributos son pertinentes para el dominio. `SEMESTRE.periodo VARCHAR2(7)` es adecuado para códigos como "2025-1". Sin embargo, `ESTADO` como tabla única para estados de múltiples entidades muy diferentes (un "Activo" de semestre no es lo mismo que un "Activo" de emprendimiento) puede llevar a confusión. Se recomienda usar tablas de estado separadas por entidad o enumeraciones (CHECK constraints).

#### Agrupamiento de variables en tablas

El agrupamiento es generalmente correcto. La decisión de usar `ESTADO` como tabla compartida entre múltiples entidades reduce duplicación pero puede dificultar la comprensión del dominio. `USUARIO` con FK directa a `ROL` implementa la relación un-usuario-un-rol.

#### Primera Forma Normal (1NF)

El modelo cumple con 1NF.

#### Segunda Forma Normal (2NF)

El modelo cumple con 2NF.

#### Tercera Forma Normal (3NF)

En `DETALLE_PEDIDO`, el campo `subtotal` es derivable matemáticamente de `cantidad * precio_unitario`, lo que en estricto cumplimiento de 3NF sería un atributo derivado que viola la forma normal. Sin embargo, en sistemas de comercio es una práctica común y aceptada registrar el subtotal calculado para preservar el historial de precios ante posibles cambios futuros en el precio del producto. Se recomienda documentar esta decisión de diseño.

#### Consejo sobre roles y permisos

`USUARIO` tiene FK directa a `ROL` (un único rol por usuario), sin tabla de permisos. Este enfoque es funcional para sistemas simples con roles fijos, pero limita la flexibilidad. Se recomienda implementar el patrón many-to-many con tablas `USUARIO_ROL` y `ROL_PERMISO` para mayor granularidad. Adicionalmente, el hecho de que `ESTADO` sea una tabla compartida por múltiples entidades podría considerarse un caso tangencial del patrón EAV (Entity-Attribute-Value), que si bien puede simplificar el catálogo inicial, complica la integridad referencial cuando diferentes entidades requieren estados incompatibles entre sí.

---

## Resumen general de cumplimiento del patrón de Roles y Permisos

| Grupo / Estudiante | Patrón RBAC correcto | Observaciones |
|---|---|---|
| Alejandro Rendón | Si | USER_ROL + ROL_PERMISSION correctamente implementado |
| Andrés Fajardo | No | Sin tablas de roles ni permisos; COACH como tabla separada (antipatrón) |
| Diana Garzón / Nathalie Sanchez / Paula Ferreira | Si | USERS_ROLES + ROLES_PERMISOS correcto; PK compuesta en ROLES_PERMISOS recomendada |
| Edwar Estacio / Juan Balanta / Valeria Piza | Parcial | Versión Edwar: RBAC completo correcto. Versión Valeria: rol como columna directa (antipatrón) |
| Johan Suárez | Si | Implementación avanzada con POLICIES (resource + action) |
| Juan Calderón / Sebastián Castillo | Si | RBAC completo + subtipo TRAINER correcto |
| Juan Criollo / Samuel Cifuentes / Sebastián Romero | No | Rol como columna VARCHAR2 en USUARIO; subtipado por tabla (antipatrón) |
| Juan Esteban Gómez | Parcial | USER_ROLE correcto, pero sin tabla de PERMISSION |
| Juan Ramírez / Poveda / Estrada | Parcial | FK directa USER→ROLE (un rol por usuario); sin PERMISSIONS |
| Samuel Rengifo / Anderson Romero | Si | RBAC completo correcto; campo userType redundante recomendado eliminar |
| Ximena Gómez / Natalia Delgado | Parcial | FK directa USUARIO→ROL; sin PERMISSIONS |
