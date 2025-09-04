[t] Transacciones en Spring Boot
[st] ¿Qué es una Transacción?
En el mundo de las bases de datos, una transacción es una secuencia de una o más operaciones que se ejecutan como una única unidad de trabajo. O todas las operaciones se completan con éxito, o ninguna de ellas se aplica. Esto garantiza la integridad y consistencia de los datos.

Las transacciones se rigen por los principios ACID:

Atomicidad (Atomicity) 
La transacción es "todo o nada". Si una parte de la transacción falla, toda la transacción falla y la base de datos vuelve al estado en que se encontraba antes de que comenzara la transacción.

Consistencia (Consistency)
La transacción lleva a la base de datos de un estado válido a otro.

Aislamiento (Isolation)
Las transacciones concurrentes se ejecutan de forma aislada unas de otras. Los resultados de una transacción no son visibles para otras hasta que se completa.

Durabilidad (Durability)
Una vez que una transacción se ha completado con éxito (commit), sus cambios son permanentes y sobreviven a cualquier fallo del sistema.
[st] La Magia de @Transactional
Spring Boot simplifica enormemente la gestión de transacciones con la anotación `@Transactional`. Cuando anotas un método (o una clase entera) con `@Transactional`, Spring lo envuelve en un proxy que se encarga de iniciar, confirmar (commit) o revertir (rollback) la transacción por ti.

Un proxy es como un intermediario: en lugar de llamar directamente a tu método, se llama primero a un objeto "falso" (proxy) que decide qué hacer antes y después de ejecutar el método real. En este caso, el proxy se encarga de abrir la transacción antes de ejecutar tu código y cerrarla (con commit o rollback) cuando termina.

Por defecto, Spring iniciará una transacción cuando se llame al método y la confirmará cuando el método termine sin lanzar una excepción. Si el método lanza una `RuntimeException` o un `Error`, Spring revertirá la transacción automáticamente.

[st] Ejemplo Práctico: Transferencia Bancaria
Vamos a crear un ejemplo clásico: transferir dinero de una cuenta bancaria a otra. Esta operación implica dos pasos:
1.  Restar el monto de la cuenta de origen.
2.  Sumar el monto a la cuenta de destino.

Ambos pasos deben tener éxito. Si el segundo paso falla, el primero debe deshacerse.

[st] 1. La Entidad y el Repositorio
Primero, definimos una entidad `Account` y su repositorio.

[code:java]
package com.example.myapp.model;

import jakarta.persistence.*;

@Entity
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String owner;
    private Double balance;

    // Getters y Setters
}
[endcode]

[code:java]
package com.example.myapp.repository;

import com.example.myapp.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
}
[endcode]

Para este ejemplo, es útil tener datos iniciales. En su archivo `data.sql` debe tener
[code:sql]
INSERT INTO account (owner, balance) VALUES ('Alice', 1000.0);
INSERT INTO account (owner, balance) VALUES ('Bob', 500.0);
[endcode]

[st] 2. El Servicio de Transferencia · Caso Exitoso
Ahora, creamos un servicio con un método para transferir dinero. Anotamos el método con `@Transactional`.

[code:java]
package com.example.myapp.service;

import com.example.myapp.model.Account;
import com.example.myapp.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransferService {

    @Autowired
    private AccountRepository accountRepository;

    @Transactional
    public void transferMoney(Long fromAccountId, Long toAccountId, Double amount) {
        Account fromAccount = accountRepository.findById(fromAccountId).orElseThrow(() -> new RuntimeException("Cuenta de origen no encontrada"));
        Account toAccount = accountRepository.findById(toAccountId).orElseThrow(() -> new RuntimeException("Cuenta de destino no encontrada"));

        fromAccount.setBalance(fromAccount.getBalance() - amount);
        accountRepository.save(fromAccount);

        toAccount.setBalance(toAccount.getBalance() + amount);
        accountRepository.save(toAccount);
    }
}
[endcode]

Si este método se ejecuta sin problemas, los cambios en ambas cuentas se guardarán permanentemente en la base de datos.

[st] 3. Simulando un Fallo: El Rollback en Acción
Para ver `@Transactional` en acción, vamos a simular un fallo. Crearemos un nuevo método que lanza una excepción después de la primera operación de guardado.

[code:java]
package com.example.myapp.service;

// imports

@Service
public class TransferService {

    // ... 

    @Transactional
    public void transferMoneyWithFailure(Long fromAccountId, Long toAccountId, Double amount) {
        Account fromAccount = accountRepository.findById(fromAccountId).orElseThrow(() -> new RuntimeException("Cuenta de origen no encontrada"));
        Account toAccount = accountRepository.findById(toAccountId).orElseThrow(() -> new RuntimeException("Cuenta de destino no encontrada"));

        fromAccount.setBalance(fromAccount.getBalance() - amount);
        accountRepository.save(fromAccount);

        // Simulamos un error inesperado antes pasar la plata
        if (true) {
            throw new RuntimeException("Nequi lo ha hecho de nuevo!");
        }

        // Esta parte del código nunca se alcanzará
        toAccount.setBalance(toAccount.getBalance() + amount);
        accountRepository.save(toAccount);
    }
}
[endcode]

[st] 4. Probando el Rollback
Podemos ejecutar el método de service desde un `@RestController` y evidenciar qué pasó.
