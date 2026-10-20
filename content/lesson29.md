# Auth en REST

<!-- tags: autenticación stateless, token, JWT, Authorization: Bearer, sesión contra token, JSESSIONID en REST, por qué no usar sesión en una API, /api/v1/auth/login -->

En Spring Security usamos autenticación **basada en estado**: al iniciar sesión, el servidor crea una sesión HTTP y le entrega al navegador una cookie `JSESSIONID`. Desde ese momento el servidor *recuerda* quién es cada usuario.

Una API REST no puede trabajar así. Uno de sus principios es la comunicación **sin estado** (stateless): cada solicitud tiene que traer todo lo necesario para atenderla, sin que el servidor recuerde nada de las anteriores. Por eso en REST la autenticación se hace con un **token**.

## El mecanismo

Pulse los dos endpoints y siga el request. Primero `GET /api/v1/posts` sin token, después el login, y otra vez `/posts`. Active *Paso a paso* para avanzar a su ritmo.

```interactive
jwt-flow
```

Todo request a la API pasa por la `SecurityFilterChain`. Uno de sus filtros, `JwtAuthFilter`, busca el token en el encabezado `Authorization` y verifica su firma. Si el token es válido, autentica el request y lo deja seguir. Si no hay token, el request sigue como anónimo y `AuthorizationFilter` lo detiene antes del controller. Si el token fue alterado, el propio filtro lo rechaza.

El login es la única puerta abierta sin token: valida las credenciales y entrega uno firmado.

## Sesión contra token

Con **sesión**, el servidor guarda quién es el usuario y el cliente solo lleva un identificador (`JSESSIONID`). El navegador envía la cookie solo, sin que el código haga nada.

Con **token**, el servidor no guarda nada: el token mismo dice quién es el usuario y qué permisos tiene, y viene firmado para que nadie lo pueda falsificar. El cliente tiene que enviarlo explícitamente en cada solicitud:

```http
GET /api/v1/recurso
Authorization: Bearer eyJhbGciOiJIUzM4NCJ9...
```

Como cada solicitud es autocontenida, cualquier instancia del servidor puede atenderla, sin compartir sesiones entre ellas. Eso es lo que hace escalable a una API RESTful.

El formato de token que vamos a usar es **JWT** (JSON Web Token).

## Los endpoints de autenticación

Los endpoints de autenticación son especiales y no siguen la convención de sustantivos de REST: son acciones. Los vamos a agrupar bajo `/api/v1/auth/`:

- `POST /api/v1/auth/login` recibe credenciales y entrega el token.
- `POST /api/v1/auth/signup` registra un usuario nuevo.

Estos endpoints tienen que ser públicos: nadie tiene token antes de iniciar sesión.
