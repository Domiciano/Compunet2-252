# <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/CSRF_prevention">CSRF</a>

El CSRF Token (Cross-Site Request Forgery Token) es un mecanismo de seguridad que previene ataques donde un usuario autenticado es inducido a realizar acciones maliciosas en un sitio web sin su consentimiento. Spring Security lo implementa generando un token único por sesión y exigiéndolo en cada solicitud POST, PUT, DELETE o PATCH, asegurando que la petición proviene de una fuente legítima. Sin este token, un atacante podría engañar a un usuario autenticado para enviar solicitudes no deseadas desde otro sitio web.

Puede desactivar este comportamiento por medio de este código

```java
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable());
        return http.build();
    }
```

# Public resources

Para sus rutas públicas también requerirá que sus recursos CSS, JS puedan ser accesibles sin permisos de autenticación.

Por ejemplo si usted tiene sus css de sus rutas públicas en `/static/css`, debe usar

```java
auth -> auth.requestMatchers("/css/**").permitAll()
```


# Preauthorize

Puede habilitar las rutas a nivel de método usando

```java
...
@EnableMethodSecurity
public class WebSecurityConfig {

}
```


Su filtro del SecurityFilterChain puede ser

```java
http.authorizeHttpRequests(
    auth -> auth
        .requestMatchers("/signup").permitAll()
        .anyRequest().authenticated());
```

Algo más libre como ve. Pero usted puede usar en cada método que quiera restrigir tanto en `controller` como en `service` y hasta `repository`.

```java
@GetMapping
    @PreAuthorize("hasAnyRole('ROLE_STUDENT')")
    public String index(Model model) {
        model.addAttribute("course", new Course());
        model.addAttribute("professors", professorService.getAllProfessor());
        return "course";
    }
```

De esta manera queda configurado para este endpoint de ejemplo que sólo podrá hacer GET aquel usuario autenticado que tenga `ROLE_STUDENT`


# Instalación de tomcat en server

Vamos a configurar un tomcat en uno de los PC de la sala. Tenga en cuenta que el PC al que nos conectamos tiene dos direcciones IP. Su IP en la VPN `10.147.19.22` y su IP en la red local `192.168.131.22`.


```sh
ssh computacion@10.147.19.22
```
o
```sh
ssh computacion@192.168.131.22
```

Descarguemos TOMCAT

```sh
wget https://dlcdn.apache.org/tomcat/tomcat-11/v11.0.5/bin/apache-tomcat-11.0.5.zip
```


Descomprimamos el archivo

```sh
unzip apache-tomcat-11.0.5.zip
```

Eliminemos el zip

```sh
rm apache-tomcat-11.0.5.zip
```

Obtengamos permisos de ejecución, debemos pararnos en la carpeta `bin`

```sh
chmod +x *.sh
```

Ejecutemos el tomcat

```sh
JAVA_HOME=/usr/lib/jvm/jdk-23.0.1 ./startup.sh
```


# Despliegue

Creemos nuestro war, para eso primero cambie el packing en su `pom.xml`

```xml
<packaging>war</packaging>
```

Debe hacer que la aplicación arranque desde tomcat y no usando tomcat embebido haciendo que la clase extienda a `SpringBootServletInitializer`.

```java
@SpringBootApplication
public class MiApp extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(MiApp.class, args);
    }

}
```


Debe crear el `.war`

```sh
mvn clean package -DskipTests
```


Copiemos el archivo war de nuestro PC al server

```sh
 scp ./miApp.war computacion@192.168.131.22:/home/computacion/tomcat11/webapps/
```


