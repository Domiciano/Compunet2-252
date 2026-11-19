# Tomcat · desplegar el backend

<!-- tags: Tomcat 11, ssh, scp, base path, finalName, 404 en /WebApp6, PC de la sala, context-path, startup.sh, ssh timed out, Address already in use, webapps -->

Antes de meter React en el WAR (guía 1), el backend tiene que correr solo en un **Tomcat 11** en uno de los PC de la sala. Vas a usar dos terminales: una conectada al PC por SSH, donde corre Tomcat, y otra en tu computador, desde donde le mandas el WAR. Las dos funcionan igual en macOS, Linux y en PowerShell de Windows, y tu computador tiene que estar en la red de la sala.

## 1. Escoger un PC y entrar por SSH

Cada grupo usa **un PC distinto**: en cada PC corre un solo Tomcat en el puerto 8080, y todos los WAR se llaman igual.

```text
PC11  192.168.131.31
PC12  192.168.131.32
PC13  192.168.131.33
PC14  192.168.131.34
PC15  192.168.131.35
PC16  192.168.131.36
PC17  192.168.131.37
```

En la **terminal 1**:

```bash
ssh computacion@<IP>
```

La primera vez pregunta si confías en el equipo: escribe `yes`. Luego pide la contraseña del usuario `computacion`, que da el profesor; mientras la escribes no se ve nada. Si el prompt cambia a `computacion@...`, ya estás en el PC.

Antes de instalar, revisa que no haya un Tomcat de otra clase ocupando el 8080:

```bash
ss -ltnp | grep 8080
```

Si no imprime nada, el puerto está libre. Si imprime una línea, apágalo con el `shutdown.sh` de su carpeta (por ejemplo `~/apache-tomcat-11.0.18/bin/shutdown.sh`) o con `kill <PID>`, usando el número que sale en `pid=`.

## 2. Instalar Tomcat

Sigue en la terminal 1. Si `ls ~` ya muestra una carpeta `apache-tomcat-11.0.29`, salta al arranque. Si no, descarga Tomcat, descomprímelo y dale permiso de ejecución a sus scripts:

```bash
V=11.0.29
wget https://archive.apache.org/dist/tomcat/tomcat-11/v$V/bin/apache-tomcat-$V.zip
unzip apache-tomcat-$V.zip
rm apache-tomcat-$V.zip
chmod +x apache-tomcat-$V/bin/*.sh
```

Arráncalo desde `bin/`. Necesita Java 17 o superior, y en los PC de la sala hay que decirle cuál:

```bash
cd apache-tomcat-11.0.29/bin
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 ./startup.sh
```

Desde el navegador de tu computador abre `http://<IP>:8080`: si sale la página de Tomcat, quedó.

## 3. El base path del backend

```svg
<svg id="tomcatBase" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 400" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="tomcatBase-ttl tomcatBase-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="tomcatBase-ttl">En Tomcat, el base path es el nombre del WAR</title>
  <desc id="tomcatBase-dsc">La URL http://IP:8080/WebApp6/api/v1/health se parte en tres: el servidor Tomcat en el puerto 8080, el base path WebApp6 y la ruta del controller /api/v1/health. Con mvnw spring-boot:run el base path sale de server.servlet.context-path en application.properties. En Tomcat esa propiedad se ignora y el base path es el nombre del archivo WAR: IntroSpringBoot-0.0.1-SNAPSHOT.war da /IntroSpringBoot-0.0.1-SNAPSHOT y el front recibe 404; con finalName WebApp6 el archivo es WebApp6.war y el base path vuelve a ser /WebApp6.</desc>
  <defs>
    <style>
      #tomcatBase .title{fill:#161A26;font-size:22px;font-weight:700}
      #tomcatBase .sub{fill:#79809A;font-size:13.5px}
      #tomcatBase .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #tomcatBase .foot{fill:#79809A;font-size:12px}
      #tomcatBase .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
    </style>
  </defs>
  <rect width="960" height="400" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56" data-fit="860">En Tomcat, el base path es el nombre del WAR</text>
  <text class="sub" x="48" y="80" data-fit="860">server.servlet.context-path solo vale con ./mvnw spring-boot:run. Tomcat lo ignora.</text>

  <rect x="48" y="108" width="300" height="48" rx="10" fill="#EEF1FF" stroke="#A9B3F2" stroke-width="1.75"/>
  <text class="mono" x="198" y="132" dy="0.35em" text-anchor="middle" font-size="15" fill="#4453C9" data-fit="280">http://&lt;IP&gt;:8080</text>
  <rect x="356" y="108" width="190" height="48" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/>
  <text class="mono" x="451" y="132" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#A96C05" data-fit="170">/WebApp6</text>
  <rect x="554" y="108" width="358" height="48" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.75"/>
  <text class="mono" x="733" y="132" dy="0.35em" text-anchor="middle" font-size="15" fill="#3A8235" data-fit="330">/api/v1/health</text>
  <text x="198" y="176" dy="0.35em" text-anchor="middle" font-size="12" fill="#556074" data-fit="290">Tomcat</text>
  <text x="451" y="176" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05" data-fit="180">base path</text>
  <text x="733" y="176" dy="0.35em" text-anchor="middle" font-size="12" fill="#556074" data-fit="340">tu @RestController</text>

  <text class="h" x="48" y="222">SIN finalName</text>
  <rect x="48" y="234" width="420" height="96" rx="12" fill="#FDECEA" stroke="#EBA59F" stroke-width="1.75"/>
  <text class="mono" x="66" y="258" dy="0.35em" font-size="12.5" fill="#454C61" data-fit="384">IntroSpringBoot-0.0.1-SNAPSHOT.war</text>
  <text class="mono" x="66" y="282" dy="0.35em" font-size="12" fill="#C2413A" data-fit="384">→ /IntroSpringBoot-0.0.1-SNAPSHOT/api/...</text>
  <text x="66" y="308" dy="0.35em" font-size="12" fill="#556074" data-fit="384">El front pide /WebApp6/api/... y recibe 404</text>

  <text class="h" x="492" y="222">CON &lt;finalName&gt;WebApp6&lt;/finalName&gt;</text>
  <rect x="492" y="234" width="420" height="96" rx="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.75"/>
  <text class="mono" x="510" y="258" dy="0.35em" font-size="12.5" fill="#454C61" data-fit="384">WebApp6.war</text>
  <text class="mono" x="510" y="282" dy="0.35em" font-size="12" fill="#3A8235" data-fit="384">→ /WebApp6/api/...</text>
  <text x="510" y="308" dy="0.35em" font-size="12" fill="#556074" data-fit="384">Las mismas URLs que con spring-boot:run</text>

  <text class="foot" x="48" y="366" data-fit="860">Tomcat descomprime cada .war de webapps/ en una carpeta con su nombre, y ese nombre es el primer tramo de la URL.</text>
</svg>
```

Con `./mvnw spring-boot:run`, el backend vive en `/WebApp6` porque `application.properties` dice `server.servlet.context-path=/WebApp6`. En Tomcat **esa línea se ignora**: el base path es el nombre del archivo WAR. Por defecto Maven lo llama `IntroSpringBoot-0.0.1-SNAPSHOT.war`, y la API queda en `/IntroSpringBoot-0.0.1-SNAPSHOT/api/v1`, donde el front no la busca.

Para que el WAR salga como `WebApp6.war`, en el `pom.xml`, dentro de `<build>`:

```xml
<finalName>WebApp6</finalName>
```

## 4. Empaquetar

Abre la **terminal 2**, en tu computador, en la raíz del backend (donde está `pom.xml`):

```bash
./mvnw clean package
```

En Windows es `mvnw.cmd clean package`. Queda en `target/WebApp6.war`.

## 5. Mandar el WAR al PC

En la misma terminal 2, con la IP de tu PC:

```bash
scp target/WebApp6.war computacion@<IP>:~/apache-tomcat-11.0.29/webapps/
```

Pide la misma contraseña. Tomcat descomprime el WAR solo en unos segundos. Para ver que lo tomó, en la terminal 1:

```bash
ls ~/apache-tomcat-11.0.29/webapps
tail -n 20 ~/apache-tomcat-11.0.29/logs/catalina.out
```

Tiene que aparecer una carpeta `WebApp6` junto al `.war`. Prueba desde tu navegador:

```text
http://<IP>:8080/WebApp6/api/v1/health
```

Para actualizarlo, empaqueta otra vez y repite el `scp`: Tomcat reemplaza la app. Al terminar la clase, apaga Tomcat en la terminal 1 con `~/apache-tomcat-11.0.29/bin/shutdown.sh`, y sal del PC con `exit`.

## Si algo falla

- **404 en `/WebApp6/...`**: el WAR no se llama `WebApp6.war`. Revisa `finalName` y que en `webapps` no haya quedado solo el de nombre largo.
- **`ssh` o `scp` se quedan esperando y dan `timed out`**: tu computador no está en la red de la sala, o la IP es de otro PC.
- **`Permission denied`** al entrar: la contraseña está mal. Se escribe a ciegas.
- **`scp` dice `No such file or directory`**: o no estás en la raíz del backend (falta `target/WebApp6.war`), o en el PC la carpeta de Tomcat tiene otra versión. Revísala con `ls ~` en la terminal 1.
- **No arranca y `logs/catalina.out` dice `Address already in use`**: otro Tomcat ya tiene el 8080. Revisa el paso 1.
- **`JAVA_HOME` o versión de Java**: Tomcat 11 y Spring Boot 3 piden Java 17 o superior. Revisa con `java -version`.
- **La API responde pero no ves tu cambio**: el WAR copiado es el viejo. Corre otra vez `./mvnw clean package`.
