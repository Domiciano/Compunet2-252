[t] Manejo de Fechas 
[st] Introducción
En las aplicaciones del mundo real, es muy común trabajar con fechas y horas. En esta lección, usaremos los tipos de datos modernos de Java (`LocalDate`, `LocalDateTime`) para manejar información temporal. También exploraremos anotaciones de mapeo útiles como `@Column` para tener un control más fino sobre cómo nuestras entidades se mapean a la base de datos.

[st] Modelo de `Task`
Usemos el siguiente modelo
[code:java]
package com.example.myapp.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "task_code", unique = true, nullable = false)
    private String taskCode;

    // Se mapea a un tipo TIMESTAMP en la BD
    @Column(name = "execution_time")
    private LocalDateTime executionTime;

    // Se mapea a un tipo DATE en la BD
    @Column(name = "creation_date")
    private LocalDate creationDate;

    @Column(nullable = true, length = 500)
    private String description;
    
    // Getters, setters y constructores
}
[endcode]
Una vez con el modelo, vamos a inicializar algunos datos
[st] Inicializando Datos con Fechas en `data.sql`
El formato para insertar los datos en `data.sql` no cambia. La base de datos sigue esperando una cadena de texto con un formato estándar que JPA puede procesar.

[code:sql]
-- El formato YYYY-MM-DD HH:MI:SS es compatible con LocalDateTime
-- El formato YYYY-MM-DD es compatible con LocalDate
INSERT INTO tasks (task_code, execution_time, creation_date, description) VALUES 
('TASK-001', '2025-10-20 09:00:00', '2025-09-10', 'Realizar backup diario de la base de datos.');

INSERT INTO tasks (task_code, execution_time, creation_date, description) VALUES 
('TASK-002', '2025-10-21 18:30:00', '2025-09-10', 'Enviar reporte de ventas semanal.');

INSERT INTO tasks (task_code, execution_time, creation_date, description) VALUES 
('TASK-003', '2025-09-15 12:00:00', '2025-09-11', NULL);
[endcode]
[st] Query Methods con `java.time`
El `TaskRepository` también se actualiza para usar los nuevos tipos. Los nombres de los métodos no cambian, solo sus parámetros.

[code:java]
package com.example.myapp.repository;

import com.example.myapp.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // Encuentra tareas que deben ejecutarse después de una fecha y hora específicas
    List<Task> findByExecutionTimeAfter(LocalDateTime startTime);

    // Encuentra tareas creadas en un rango de fechas
    List<Task> findByCreationDateBetween(LocalDate startDate, LocalDate endDate);

    // Encuentra tareas cuya descripción es nula
    List<Task> findByDescriptionIsNull();
}
[endcode]

[st] Datos no menores
`LocalDate` de Java se mapea con `DATE` de SQL

`LocalDateTime` de Java se mapea con `TIMESTAMP` de SQL

`LocalTime` de Java se mapea con `TIME` o `TIME WITHOUT TIME ZONE` de SQL