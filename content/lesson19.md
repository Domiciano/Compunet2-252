[t] MVC en Spring Boot  

En lecciones anteriores, hemos estado construyendo nuestras aplicaciones siguiendo una arquitectura de 3 capas bien definida:

`Capa de Repositorio` 
Responsable del acceso a los datos. Se comunica directamente con la base de datos. (Ej: `StudentRepository`)  

`Capa de Servicio`
Contiene la lógica de negocio principal. Orquesta las operaciones, llama a los repositorios y puede aplicar reglas de negocio complejas. (Ej: `StudentService`)  

`Capa de Controlador`
Expone la funcionalidad de la aplicación al mundo exterior, generalmente a través de endpoints HTTP. Recibe las peticiones, las delega a la capa de servicio y devuelve una respuesta.  

[st] ¿Cómo se relacionan MVC y la Arquitectura de 3 Capas?  

Es muy común confundir estos dos patrones, pero en realidad, se complementan.  
La arquitectura de 3 capas (Repository, Service, Controller) es una forma de implementar la parte backend del patrón MVC.  

Diferencias clave
[list]
La arquitectura en 3 capas organiza la aplicación según responsabilidades técnicas: acceso a datos, lógica de negocio y exposición al exterior.  

El patrón MVC organiza la aplicación según responsabilidades de interacción: Modelo, Vista y Controlador.  
[endlist]
[st] Así encajan las piezas en Spring Boot  
`Model`
En Spring, el `Modelo` no es solo una clase, sino todo el conjunto que gestiona datos y lógica de negocio
[list]
Entidades (`Student`, `Course`) que definen la estructura de los datos.  
Repositorios, que permiten acceder y persistir los datos.  
Servicios, que aplican las reglas de negocio y transforman los datos.  
[endlist]

`View`
La Vista depende de la tecnología de presentación que uses
[list]
Con Thymeleaf o JSP, la vista forma parte del mismo proyecto y se ajusta al MVC tradicional.  
Con React, Angular o Vue, la vista vive fuera del backend. En ese caso, Spring Boot actúa como proveedor de datos (API REST), y la Vista se renderiza en el cliente.  
[endlist]

`Controller`
El Controlador conecta la Vista con el Modelo. En Spring Boot puede tener dos enfoques:  
[list]
Con `@Controller`: devuelve vistas (HTML renderizado en servidor).  
Con `@RestController`: expone datos en formato JSON o XML para que un frontend u otra aplicación los consuma.  
[endlist]