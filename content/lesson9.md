[t] Despliegue
Entre todos vamos a conectarnos a uno de los PC de la sala por SSH. Lo primero es escoger uno de los siguientes PC. 
[code:plain]
PC11
192.168.131.31

PC12
192.168.131.32

PC13
192.168.131.33

PC14
192.168.131.34

PC15
192.168.131.35

PC16
192.168.131.36

PC17
192.168.131.37

PC18
192.168.131.38

PC19
192.168.131.39

PC20
192.168.131.40 
[endcode]

Entremos con SSH
[code:plain]
ssh computacion@<IP>
[endcode]

Una vez dentro, descarguemos el tomcat
[code:plain]
wget https://dlcdn.apache.org/tomcat/tomcat-11/v11.0.18/bin/apache-tomcat-11.0.18.zip
[endcode]

Descomprimamos
[code:plain]
unzip apache-tomcat-11.0.18.zip
[endcode]

Limpiemos el reguero eliminando el zip
[code:plain]
rm apache-tomcat-11.0.18.zip
[endcode]

Parémosnos en la carpeta bin de tomcat y le damos permiso a la carpeta para ejecutar sh.
[code:plain]
chmod +x *.sh
[endcode]

Ahora podemos ejecutar el startup de tomcat
[code:plain]
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 ./startup.sh
[endcode]

Ya una vez todo ok. Vamos a enviar un war de prueba por medio de SCP.
[code:plain]
scp ./miapp.war computacion@<IP>:/home/computacion/apache-tomcat-11.0.9/webapps/
[endcode]

[st] Monitor de puerto

Ver todos los puertos abiertos
[code:bash]
ss -tulnp
[endcode]
Luego si quiere verificar los procesos que estan en el 8080 puede usar
[code:bash]
lsof -i :8080
[endcode]
Saldrá algo como
[code:plain]
COMMAND   PID         USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
java     15432 computacion   50u  IPv6  67890      0t0  TCP *:http-alt (LISTEN)
[endcode]
Y finalmente puede matar el proceso usando su PID
[code:bash]
kill -9 12345
[endcode]