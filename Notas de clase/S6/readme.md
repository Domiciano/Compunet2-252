# Separación de responsabilidades

Para este punto, sabemos las definiciones de cada capa. Usamos en la sesión pasada el Service como punto de entrada para generar los datos iniciales.



Ahora vamos a generar los datos desde un `Servlet` que use el ApplicationContext

Vamos a poner cada función en su lugar.


### CAPA REPOSITORY
> Asegúrese de que su clase de tipo Repository tenga acceso bruto a los datos, tanto para funciones de almacenar como para funciones de obtener.

### CAPA SERVICE
> En sus clases de tipo Service, haga las validaciones necesarias antes de usar las funciones brutas de acceso a datos

# Reestructuración del proyecto

Nos falta aún la clase `CourseService`

```
public class CourseService {

    ...

}
```
Una vez la tenga construya este esquema

<p align="center">
    <img src="https://raw.githubusercontent.com/Domiciano/Compunet2-251/refs/heads/main/Images/image10.png" width="512">
</p>


### SERVLET/JSP

En la capa de servlets, desarrollemos:

> Como estudiante quiero registrarme en el sistema proporcionando mi información personal, para poder utilizar la plataforma de matrícula.

> Como estudiante quiero agregarme a un curso proporcionando su información para gestionar mi matrícula.

> Como estudiante quiero ver todos mis cursos matriculados buscando por mi código para verificar mi inscripción y hacer seguimiento a mis materias.


Desde un **Servlet** podemos acceder al `ApplicationContext` de forma estática

# Anotaciones

# Archivo de configuración
