# Separación de responsabilidades

Para este punto, sabemos las definiciones de cada capa.

Vamos a poner cada función en su lugar.

> Asegúrese de que su clase de tipo Repository tenga acceso bruto a los datos, tanto para funciones de almacenar como para funciones de obtener.

> En sus clases de tipo Service, haga las validaciones necesarias antes de usar las funciones brutas de acceso a datos


Nos falta aún la clase `CourseService`

```
public class CourseService {

    ...

}
```

Desde un **Servlet** podemos acceder al `ApplicationContext`

