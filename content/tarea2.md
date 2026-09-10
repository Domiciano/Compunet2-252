# Laboratorio de QueryMethods

Ahora es tu turno. Añade los siguientes métodos a los repositorios correspondientes y pruébalos con los datos de prueba.

1. En `StudentRepository`: Encuentra un estudiante por su código único.

2. En `ProfessorRepository`: Encuentra profesores cuyo nombre contenga una cadena (ignorando mayúsculas y minúsculas).

3. En `CourseRepository`: Encuentra todos los cursos con un número específico de créditos.

4. En `StudentRepository`: Encuentra todos los estudiantes de un programa académico.

5. En `CourseRepository`: Encuentra un curso por nombre exacto, ignorando mayúsculas y minúsculas.

6. En `CourseRepository`: Encuentra todos los cursos de un profesor (por nombre) ordenados alfabéticamente.

7. En `StudentRepository`: Encuentra estudiantes de un programa cuyo código empiece por un prefijo dado.

8. En `CourseRepository`: Encuentra cursos con créditos entre dos valores (usa `Between`).

9. En `StudentRepository`: Encuentra todos los estudiantes que cursan materias con un profesor específico. Navega `Student` → `studentCourses` → `course` → `professor` → `name`.

10. En `ProfessorRepository`: Encuentra todos los profesores (sin duplicados) que le enseñan a estudiantes de un programa específico. Navega `Professor` → `courses` → `enrollments` → `student` → `program`.

11. En `UserRepository`: Encuentra un usuario por su nombre de usuario.

12. En `UserRepository`: Encuentra todos los usuarios que tengan un rol específico (por nombre).

13. En `RoleRepository`: Encuentra roles cuyo nombre contenga una cadena, ignorando mayúsculas/minúsculas.

14. En `UserRepository`: Encuentra todos los usuarios que tengan un permiso específico.

15. En `PermissionRepository`: Encuentra todos los permisos asignados a un usuario por username

## Reto: navegación avanzada

Estos tres son tan retadores como `findDistinctByStadium_NameAndHomeCountry_Players_FifaScoreGreaterThan` de clase: combinan una condición sobre una relación con otra más profunda, sobre una colección, y necesitan `Distinct` para no devolver filas repetidas.

16. En `ProfessorRepository`: Encuentra los profesores que dictan un curso cuyo nombre contenga cierto texto (ignorando mayúsculas), y que en ese mismo curso haya al menos un estudiante con un código mayor a un valor dado. Navega `Professor` → `courses` → `name` y, por separado, `Professor` → `courses` → `enrollments` → `student` → `code`.

17. En `StudentRepository`: Encuentra los estudiantes inscritos en un curso con créditos entre dos valores, dictado por un profesor cuyo nombre contenga cierto texto (ignorando mayúsculas). Las dos condiciones tienen que cumplirse sobre la **misma** inscripción — navega el mismo camino dos veces: `studentCourses` → `course` → `credits` y `studentCourses` → `course` → `professor` → `name`.

18. En `UserRepository`: Encuentra los usuarios que tengan un rol con un nombre específico, y que ese mismo rol tenga asignado al menos un permiso cuyo nombre contenga cierto texto. Navega `User` → `userRoles` → `role` → `name` y `User` → `userRoles` → `role` → `rolePermissions` → `permission` → `name`.

