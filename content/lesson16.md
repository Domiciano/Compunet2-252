[t] Manejo de Fechas

[st] Introducción
En esta lección extendemos el modelo académico ya construido (Professor → Course → StudentCourse → Student) añadiendo la entidad `Submission`. Un estudiante puede tener muchas entregas; cada entrega registra el tema del trabajo, la fecha del examen, la fecha y hora exacta de entrega y la nota obtenida.

Esta extensión nos permite explorar los tipos de fechas modernos de Java (`LocalDate`, `LocalDateTime`) en un contexto real y ver cómo se traducen a columnas SQL (`DATE`, `TIMESTAMP`).

[st] Diagrama ER actualizado
El modelo ahora incluye `SUBMISSION` con relación muchos-a-uno hacia `STUDENT`.

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
`LocalDate` se usa para `examDay` (solo día) y `LocalDateTime` para `submittedAt` (día + hora exacta). La relación `@ManyToOne` apunta al estudiante dueño de la entrega.

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

    // Se mapea a DATE en SQL — solo almacena año, mes y día
    @Column(name = "exam_day", nullable = false)
    private LocalDate examDay;

    // Se mapea a TIMESTAMP en SQL — almacena fecha y hora exacta
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
Agrega la lista de submissions en la entidad `Student` para completar la relación bidireccional. El atributo `mappedBy` indica que `Submission` es el lado dueño de la relación (tiene la FK).

[code:java]
@OneToMany(mappedBy = "student")
private List<Submission> submissions;
[endcode]

[st] Inicializando datos en `data.sql`
Los inserts usan los mismos estudiantes definidos en lecciones anteriores: Laura (id=1), Pedro (id=2), Andres (id=3), Sofia (id=4) y Camila (id=5). Las fechas siguen el formato estándar compatible con H2 y PostgreSQL.

[code:sql]
-- Formato YYYY-MM-DD para LocalDate (exam_day → DATE)
-- Formato YYYY-MM-DD HH:MM:SS para LocalDateTime (submitted_at → TIMESTAMP)

-- Laura: dos entregas, una con nota alta y otra media
INSERT INTO submission (topic, exam_day, submitted_at, grade, student_id) VALUES
('Parcial de Programacion', '2025-04-10', '2025-04-09 22:15:00', 4.5, 1);

INSERT INTO submission (topic, exam_day, submitted_at, grade, student_id) VALUES
('Proyecto Final de Estructuras', '2025-06-05', '2025-06-04 18:00:00', 3.8, 1);

-- Pedro: entrega tardía (submitted_at después del exam_day) con nota baja
INSERT INTO submission (topic, exam_day, submitted_at, grade, student_id) VALUES
('Parcial de Programacion', '2025-04-10', '2025-04-11 08:30:00', 2.9, 2);

-- Andres: entrega de Anatomía con nota perfecta
INSERT INTO submission (topic, exam_day, submitted_at, grade, student_id) VALUES
('Corte de Anatomia Humana', '2025-03-20', '2025-03-19 20:00:00', 5.0, 3);

INSERT INTO submission (topic, exam_day, submitted_at, grade, student_id) VALUES
('Parcial de Fisiologia', '2025-05-15', '2025-05-14 23:45:00', 4.1, 3);

-- Sofia: dos materias de Derecho
INSERT INTO submission (topic, exam_day, submitted_at, grade, student_id) VALUES
('Examen de Derecho Penal', '2025-04-25', '2025-04-24 17:30:00', 3.5, 4);

INSERT INTO submission (topic, exam_day, submitted_at, grade, student_id) VALUES
('Trabajo de Historia del Arte', '2025-06-20', '2025-06-18 10:00:00', 4.8, 4);

-- Camila: entrega de Anatomía con nota aprobatoria
INSERT INTO submission (topic, exam_day, submitted_at, grade, student_id) VALUES
('Corte de Anatomia Humana', '2025-03-20', '2025-03-20 07:55:00', 3.2, 5);
[endcode]

[st] `SubmissionRepository` Query Methods con fechas
Spring Data JPA genera las consultas automáticamente a partir del nombre del método. Los tipos `LocalDate` y `LocalDateTime` se usan directamente como parámetros.

[code:java]
package com.example.myapp.repository;

import com.example.myapp.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    // Entregas enviadas después de una fecha y hora exacta (LocalDateTime)
    List<Submission> findBySubmittedAtAfter(LocalDateTime dateTime);

    // Entregas cuyo examen fue antes de una fecha (LocalDate)
    List<Submission> findByExamDayBefore(LocalDate date);

    // Entregas cuyo examen cae dentro de un rango de fechas
    List<Submission> findByExamDayBetween(LocalDate start, LocalDate end);

    // Entregas con nota mayor a un valor dado
    List<Submission> findByGradeGreaterThan(Double grade);

    // Nota mayor que X Y examen después de una fecha (condición compuesta)
    List<Submission> findByGradeGreaterThanAndExamDayAfter(Double grade, LocalDate date);

    // Entregas de un estudiante específico, navegando la relación por código
    List<Submission> findByStudent_Code(String studentCode);

    // Entregas de un estudiante cuyo examen aún no ha pasado
    List<Submission> findByStudent_CodeAndExamDayAfter(String studentCode, LocalDate date);
}
[endcode]

[st] Datos no menores

[list]
`LocalDate` de Java se mapea con `DATE` en SQL — almacena solo año, mes y día (ej. `2025-04-10`)
`LocalDateTime` de Java se mapea con `TIMESTAMP` en SQL — almacena fecha y hora exacta (ej. `2025-04-09 22:15:00`)
`LocalTime` de Java se mapea con `TIME` en SQL — almacena solo la hora (ej. `22:15:00`)

[endlist]
