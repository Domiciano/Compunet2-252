# Separación de responsabilidades

Para este punto, sabemos las definiciones de cada capa. Usamos en la sesión pasada el Service como punto de entrada para generar los datos iniciales.

<img src="https://raw.githubusercontent.com/Domiciano/Compunet2-251/refs/heads/main/Images/image10.png">

Ahora vamos a generar los datos desde un `Servlet` que use el ApplicationContext

Vamos a poner cada función en su lugar.


### CAPA REPOSITORY
> Asegúrese de que su clase de tipo Repository tenga acceso bruto a los datos, tanto para funciones de almacenar como para funciones de obtener.

### CAPA SERVICE
> En sus clases de tipo Service, haga las validaciones necesarias antes de usar las funciones brutas de acceso a datos


Nos falta aún la clase `CourseService`

```
public class CourseService {

    ...

}
```

Desde un **Servlet** podemos acceder al `ApplicationContext`

