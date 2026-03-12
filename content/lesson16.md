[t] Manejo de Fechas

[st] IntroducciÃ³n
En esta lecciÃ³n extendemos el modelo acadÃ©mico ya construido (Professor â†’ Course â†’ StudentCourse â†’ Student) aÃ±adiendo la entidad `Submission`. Un estudiante puede tener muchas entregas; cada entrega registra el tema del trabajo, la fecha del examen, la fecha y hora exacta de entrega y la nota obtenida.

Esta extensiÃ³n nos permite explorar los tipos de fechas modernos de Java (`LocalDate`, `LocalDateTime`) en un contexto real y ver cÃ³mo se traducen a columnas SQL (`DATE`, `TIMESTAMP`).

[st] Diagrama ER actualizado
El modelo ahora incluye `SUBMISSION` con relaciÃ³n muchos-a-uno hacia `STUDENT`.

[mermaid]
erDiagram
    PROFESSOR {
        int id PK
        varchar name
    }
    COURSE {
        int id PK
        varchar name
        int credits
        int professor_id FK
    }
    STUDENT {
        int id PK
        varchar name
        varchar code
        varchar program
    }
    STUDENT_COURSE {
        int student_id PK,FK
        int course_id PK,FK
    }
    SUBMISSION {
        bigint id PK
        varchar topic
        date exam_day
        timestamp submitted_at
        double grade
        int student_id FK
    }
    PROFESSOR ||--o{ COURSE : "dicta"
    STUDENT ||--o{ STUDENT_COURSE : "inscrito en"
    COURSE ||--o{ STUDENT_COURSE : "tiene"
    STUDENT ||--o{ SUBMISSION : "entrega"
[endmermaid]

[st] Entidad `Submission`
`LocalDate` se usa para `examDay` (solo dÃ­a) y `LocalDateTime` para `submittedAt` (dÃ­a + hora exacta). La relaciÃ³n `@ManyToOne` apunta al estudiante dueÃ±o de la entrega.

[code:java]
package com.example.myapp.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "submission")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String topic;

    // Se mapea a DATE en SQL â€” solo almacena aÃ±o, mes y dÃ­a
    @Column(name = "exam_day", nullable = false)
    private LocalDate examDay;

    // Se mapea a TIMESTAMP en SQL â€” almacena fecha y hora exacta
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column(nullable = false)
    private Double grade;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    // Getters, setters y constructores
}
[endcode]

[st] Actualizar `Student`
Agrega la lista de submissions en la entidad `Student` para completar la relaciÃ³n bidireccional. El atributo `mappedBy` indica que `Submission` es el lado dueÃ±o de la relaciÃ³n (tiene la FK).

[code:java]
@OneToMany(mappedBy = "student")
private List<Submission> submissions;
[endcode]

[st] Inicializando datos en `data.sql`
Los inserts usan los mismos estudiantes definidos en lecciones anteriores: Laura (id=1), Pedro (id=2), Andres (id=3), Sofia (id=4) y Camila (id=5). Las fechas siguen el formato estÃ¡ndar compatible con H2 y PostgreSQL.

[code:sql]
-- Formato YYYY-MM-DD para LocalDate (exam_day â†’ DATE)
-- Formato YYYY-MM-DD HH:MM:SS para LocalDateTime (submitted_at â†’ TIMESTAMP)

-- Laura: dos entregas, una con nota alta y otra media
INSERT INTO submission (topic, exam_day, submitted_at, grade, student_id) VALUES
('Parcial de Programacion', '2025-04-10', '2025-04-09 22:15:00', 4.5, 1);

INSERT INTO submission (topic, exam_day, submitted_at, grade, student_id) VALUES
('Proyecto Final de Estructuras', '2025-06-05', '2025-06-04 18:00:00', 3.8, 1);

-- Pedro: entrega tardÃ­a (submitted_at despuÃ©s del exam_day) con nota baja
INSERT INTO submission (topic, exam_day, submitted_at, grade, student_id) VALUES
('Parcial de Programacion', '2025-04-10', '2025-04-11 08:30:00', 2.9, 2);

-- Andres: entrega de AnatomÃ­a con nota perfecta
INSERT INTO submission (topic, exam_day, submitted_at, grade, student_id) VALUES
('Corte de Anatomia Humana', '2025-03-20', '2025-03-19 20:00:00', 5.0, 3);

INSERT INTO submission (topic, exam_day, submitted_at, grade, student_id) VALUES
('Parcial de Fisiologia', '2025-05-15', '2025-05-14 23:45:00', 4.1, 3);

-- Sofia: dos materias de Derecho
INSERT INTO submission (topic, exam_day, submitted_at, grade, student_id) VALUES
('Examen de Derecho Penal', '2025-04-25', '2025-04-24 17:30:00', 3.5, 4);

INSERT INTO submission (topic, exam_day, submitted_at, grade, student_id) VALUES
('Trabajo de Historia del Arte', '2025-06-20', '2025-06-18 10:00:00', 4.8, 4);

-- Camila: entrega de AnatomÃ­a con nota aprobatoria
INSERT INTO submission (topic, exam_day, submitted_at, grade, student_id) VALUES
('Corte de Anatomia Humana', '2025-03-20', '2025-03-20 07:55:00', 3.2, 5);
[endcode]

[st] `SubmissionRepository` â€” Query Methods con fechas
Spring Data JPA genera las consultas automÃ¡ticamente a partir del nombre del mÃ©todo. Los tipos `LocalDate` y `LocalDateTime` se usan directamente como parÃ¡metros.

[code:java]
package com.example.myapp.repository;

import com.example.myapp.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    // Entregas enviadas despuÃ©s de una fecha y hora exacta (LocalDateTime)
    List<Submission> findBySubmittedAtAfter(LocalDateTime dateTime);

    // Entregas cuyo examen fue antes de una fecha (LocalDate)
    List<Submission> findByExamDayBefore(LocalDate date);

    // Entregas cuyo examen cae dentro de un rango de fechas
    List<Submission> findByExamDayBetween(LocalDate start, LocalDate end);

    // Entregas con nota mayor a un valor dado
    List<Submission> findByGradeGreaterThan(Double grade);

    // Nota mayor que X Y examen despuÃ©s de una fecha (condiciÃ³n compuesta)
    List<Submission> findByGradeGreaterThanAndExamDayAfter(Double grade, LocalDate date);

    // Entregas de un estudiante especÃ­fico, navegando la relaciÃ³n por cÃ³digo
    List<Submission> findByStudent_Code(String studentCode);

    // Entregas de un estudiante cuyo examen aÃºn no ha pasado
    List<Submission> findByStudent_CodeAndExamDayAfter(String studentCode, LocalDate date);
}
[endcode]

[st] Datos no menores

| Tipo Java       | Tipo SQL                          | Ejemplo de valor      |
|-----------------|-----------------------------------|-----------------------|
| `LocalDate`     | `DATE`                            | `2025-04-10`          |
| `LocalDateTime` | `TIMESTAMP`                       | `2025-04-09 22:15:00` |
| `LocalTime`     | `TIME` / `TIME WITHOUT TIME ZONE` | `22:15:00`            |

`LocalDate` almacena solo aÃ±o, mes y dÃ­a â€” ideal para fechas de examen, fechas de nacimiento o plazos.

`LocalDateTime` almacena fecha y hora exacta â€” ideal para registrar el instante de una acciÃ³n, como la fecha y hora de entrega.
