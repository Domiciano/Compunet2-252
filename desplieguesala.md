# 1. Conectarse a la VPN 
# 2. Hacer ping con el PC con el que se va a conectar
```sh
ping 10.147.19.21
```

# 3. Conectar SSH al host
```sh
ssh computacion@10.147.19.21
```
ó
```sh
ssh computacion@x206m01
```

# Instalar Tomcat

```sh
wget https://dlcdn.apache.org/tomcat/tomcat-11/v11.0.4/bin/apache-tomcat-11.0.4.zip
```

# Descomprimir el servicio
```sh
unzip apache-tomcat-11.0.4.zip
```

# Eliminar zip
```sh
Rm apache-tomcat-11.0.4.zip
```

# Obtener permisos de ejecución 
```sh

```

# Ejercutar el servicio de tomcat
Entre a la carpeta bin y corra startup.sh
```sh
JAVA_HOME=/usr/lib/jvm/jdk-23.0.1 ./startup.sh
```

```sh
JAVA_HOME=/usr/lib/jvm/jdk-23.0.1 ./shutdown.sh
```

Para finalizar la sesión en SSH, use
```sh
exit
```

# Subir archivos a la carpeta webapps online

Folder origen
El que contenga el `.war`. 

Forlder destino
/home/computacion/apache-tomcat-11.0.4/webapps

```sh
 scp ./TestS4-1.0-SNAPSHOT.war computacion@10.147.19.21:/home/computacion/apache-tomcat-11.0.4/webapps/
```
