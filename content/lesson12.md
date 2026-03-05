[t] Postgres y docker
Tiene la opción de instalar postgres en su máquina o crear una instancia de la base de datos usando Docker.

[st] Usando Docker para la base de datos
[code:yml]
services:
  db:
    image: postgres:17
    restart: always
    environment:
      POSTGRES_DB: 'db'
      POSTGRES_USER: 'user'
      POSTGRES_PASSWORD: 'password'
    ports:
      - '5432:5432'
    expose:
      - '5432'
    volumes:
      - my-volume:/var/lib/postgresql/data

volumes:
  my-volume:
[endcode]

Para crear el contenedor ejecuta:
[code:sh]
docker-compose up -d
[endcode] 