# Despliegue 3 · AWS EC2 y Nginx

<!-- tags: AWS, EC2, Amazon Linux, ssh, scp, security group, puerto 80, docker compose en EC2, IP pública, permission denied docker, docker compose no existe, la página no carga desde afuera -->

Tercera forma: los mismos dos contenedores de la guía 2, pero en una máquina de **AWS** con IP pública. Haz primero la guía 2 en tu computador: si allá funciona, aquí solo cambia dónde corre.

```svg
<svg id="deployAws" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 470" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="deployAws-ttl deployAws-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="deployAws-ttl">Los mismos contenedores, en una EC2</title>
  <desc id="deployAws-dsc">Los dos contenedores de la guía local, frontend con nginx y backend con Tomcat y WebApp6.war, ahora corren dentro de una instancia EC2 con Amazon Linux. El security group de la instancia deja entrar el puerto 80. El navegador entra con la IP pública de la instancia. Desde tu computador subes el WAR con scp, y el código del frontend llega con git clone.</desc>
  <defs>
    <style>
      #deployAws .title{fill:#161A26;font-size:22px;font-weight:700}
      #deployAws .sub{fill:#79809A;font-size:13.5px}
      #deployAws .foot{fill:#79809A;font-size:12px}
      #deployAws .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #deployAws .ar-grey{fill:none;stroke:#8A93A8;stroke-width:1.75;marker-end:url(#deployAws-ar-grey)}
      #deployAws .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;stroke-dasharray:5 4;marker-end:url(#deployAws-ar-amber)}
      #deployAws .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#deployAws-ar-indigo)}
    </style>
    <marker id="deployAws-ar-grey" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#8A93A8"/></marker>
    <marker id="deployAws-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
    <marker id="deployAws-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
  </defs>
  <rect width="960" height="470" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Los mismos contenedores, en una EC2</text>
  <text class="sub" x="48" y="80" data-fit="860">Lo de la guía local, pero en una máquina de AWS con IP pública.</text>

  <rect x="48" y="152" width="184" height="96" rx="12" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.75"/>
  <text x="68" y="176" dy="0.35em" font-size="14" font-weight="700" fill="#454C61">Navegador</text>
  <text class="mono" x="68" y="212" dy="0.35em" font-size="11.5" fill="#454C61" data-fit="150">IP-pública/home</text>

  <rect x="48" y="288" width="184" height="104" rx="12" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.75"/>
  <text x="68" y="312" dy="0.35em" font-size="14" font-weight="700" fill="#A96C05">Tu computador</text>
  <text class="mono" x="68" y="344" dy="0.35em" font-size="11.5" fill="#454C61" data-fit="150">scp WebApp6.war</text>
  <text class="mono" x="68" y="366" dy="0.35em" font-size="11.5" fill="#454C61" data-fit="150">ssh ec2-user@…</text>

  <rect x="272" y="112" width="640" height="296" rx="14" fill="#FFF8EC" stroke="#F0C572" stroke-width="1.75"/>
  <text x="292" y="136" dy="0.35em" font-size="14" font-weight="700" fill="#A96C05">EC2 · Amazon Linux</text>
  <rect x="724" y="122" width="172" height="28" rx="14" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.5"/>
  <text x="810" y="136" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05" data-fit="156">security group: 80</text>

  <rect x="296" y="168" width="280" height="176" rx="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.75"/>
  <text x="316" y="192" dy="0.35em" font-size="14" font-weight="700" fill="#3A8235">frontend</text>
  <text class="mono" x="398" y="192" dy="0.35em" font-size="12" fill="#3A8235">nginx</text>
  <text class="mono" x="316" y="228" font-size="11.5" fill="#454C61" data-fit="244">/  →  dist/ (React)</text>
  <rect x="312" y="272" width="248" height="52" rx="8" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.5"/>
  <text class="mono" x="328" y="290" dy="0.35em" font-size="11.5" fill="#454C61" data-fit="220">/WebApp6/api/</text>
  <text class="mono" x="328" y="308" dy="0.35em" font-size="11.5" fill="#4453C9" data-fit="220">proxy_pass → backend</text>

  <rect x="648" y="168" width="240" height="176" rx="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.75"/>
  <text x="668" y="192" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9">backend</text>
  <text class="mono" x="744" y="192" dy="0.35em" font-size="12" fill="#4453C9">tomcat:11</text>
  <text class="mono" x="668" y="228" font-size="11.5" fill="#454C61" data-fit="200">webapps/WebApp6.war</text>

  <text class="mono" x="296" y="380" dy="0.35em" font-size="12" fill="#556074">git clone · docker compose up --build -d</text>

  <path class="ar-grey" d="M234,200 H290"/>
  <path class="ar-amber" d="M234,340 H266"/>
  <path class="ar-indigo" d="M562,298 H642"/>

  <text class="foot" x="48" y="440" data-fit="860">Solo el puerto 80 queda abierto a internet. Tomcat sigue escondido detrás de nginx, igual que en tu máquina.</text>
</svg>
```

Necesitas una cuenta de AWS, el proyecto de React en un repositorio de GitHub con los archivos de la guía 2 (`nginx.conf`, `Dockerfile`, `.dockerignore`, `docker-compose.yml`) y el `WebApp6.war` en tu computador. El WAR no va en el repositorio.

## 1. Crear la instancia

En la consola de AWS, **EC2 → Instances → Launch instances**:

- **AMI**: Amazon Linux 2023.
- **Instance type**: `t3.small`. Con `t2.micro` el build de React se puede quedar sin memoria.
- **Key pair**: crea una (RSA, `.pem`) y guárdala bien. Sin ella no entras.
- **Network settings**: crea un security group con **SSH** desde *My IP* y **HTTP** (puerto 80) desde *Anywhere*.

Pulsa **Launch instance** y espera a que el estado sea `Running`. Copia la **Public IPv4 address**.

## 2. Entrar por SSH

```bash
chmod 400 mi-clave.pem
ssh -i mi-clave.pem ec2-user@<IP>
```

En Windows, desde PowerShell, el mismo `ssh` sin el `chmod`.

## 3. Instalar Docker y Git

```bash
sudo dnf install -y docker git
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
```

Sal con `exit` y vuelve a entrar para que el último comando tenga efecto.

Amazon Linux no trae `docker compose`. Se instala como plugin, con `buildx`, que Compose usa para construir:

```bash
P=/usr/local/lib/docker/cli-plugins
GH=https://github.com/docker
sudo mkdir -p $P
sudo curl -SL -o $P/docker-compose \
  $GH/compose/releases/latest/download/docker-compose-linux-x86_64
sudo curl -SL -o $P/docker-buildx \
  $GH/buildx/releases/download/v0.25.0/buildx-v0.25.0.linux-amd64
sudo chmod +x $P/docker-compose $P/docker-buildx
docker compose version
```

## 4. Subir el proyecto y el WAR

En la EC2, clona el repositorio de React:

```bash
git clone https://github.com/<usuario>/<repo>.git
```

Desde **tu computador**, en otra terminal, sube el WAR a esa carpeta:

```bash
scp -i mi-clave.pem WebApp6.war ec2-user@<IP>:~/<repo>/
```

## 5. Levantar

En la EC2, dentro de la carpeta del repositorio:

```bash
docker compose up --build -d
```

La primera vez tarda unos minutos. Abre `http://<IP>` en tu navegador, entra y recarga en `/home`.

## Si algo falla

- **`permission denied` al usar docker**: no saliste y volviste a entrar después del `usermod`.
- **`docker compose` no existe**: revisa el paso 3; `docker compose version` tiene que responder.
- **Desde la EC2 funciona (`curl localhost`) pero desde tu navegador no**: falta la regla HTTP del puerto 80 en el security group.
- **El build se congela o muere**: la instancia es muy pequeña. Cámbiala a `t3.small`.
- **Cuando termines**, detén la instancia en la consola: mientras corre, cuesta.
