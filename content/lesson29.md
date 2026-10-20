# Auth en REST

<!-- tags: autenticación stateless, token, JWT, Authorization: Bearer, sesión contra token, JSESSIONID en REST, por qué no usar sesión en una API, /api/v1/auth/login -->

En Spring Security usamos autenticación **basada en estado**: al iniciar sesión, el servidor crea una sesión HTTP y le entrega al navegador una cookie `JSESSIONID`. Desde ese momento el servidor *recuerda* quién es cada usuario.

Una API REST no puede trabajar así. Uno de sus principios es la comunicación **sin estado** (stateless): cada solicitud tiene que traer todo lo necesario para atenderla, sin que el servidor recuerde nada de las anteriores. Por eso en REST la autenticación se hace con un **token**.

## El mecanismo

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="680" height="415" font-family="Roboto, Arial, sans-serif">
  <defs>
    <marker id="ao-jwt1" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0,8 3,0 6" fill="#FFA726"/>
    </marker>
    <marker id="ag-jwt1" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0,8 3,0 6" fill="#66BB6A"/>
    </marker>
  </defs>
  <rect width="680" height="415" fill="#12121f" rx="12"/>
  <text x="340" y="30" text-anchor="middle" fill="#e0e0e0" font-size="15" font-weight="bold">Flujo de Autenticacion con Token JWT</text>
  <rect x="20" y="50" width="120" height="38" rx="8" fill="#1565C0"/>
  <text x="80" y="73" text-anchor="middle" fill="white" font-weight="bold" font-size="13">Cliente</text>
  <rect x="540" y="50" width="120" height="38" rx="8" fill="#2E7D32"/>
  <text x="600" y="73" text-anchor="middle" fill="white" font-weight="bold" font-size="13">Servidor</text>
  <line x1="80" y1="88" x2="80" y2="400" stroke="#42A5F5" stroke-dasharray="5,4" stroke-width="1" opacity="0.35"/>
  <line x1="600" y1="88" x2="600" y2="400" stroke="#66BB6A" stroke-dasharray="5,4" stroke-width="1" opacity="0.35"/>
  <line x1="85" y1="135" x2="592" y2="135" stroke="#FFA726" stroke-width="1.5" marker-end="url(#ao-jwt1)"/>
  <text x="340" y="122" text-anchor="middle" fill="#FFA726" font-size="12" font-weight="bold">1. POST /api/v1/auth/login</text>
  <text x="340" y="136" text-anchor="middle" fill="#9e9e9e" font-size="11">{ username: "...", password: "..." }</text>
  <rect x="530" y="148" width="140" height="24" rx="4" fill="#1e2a20"/>
  <text x="600" y="164" text-anchor="middle" fill="#66BB6A" font-size="11">2. Validar credenciales</text>
  <line x1="594" y1="192" x2="93" y2="192" stroke="#66BB6A" stroke-width="1.5" marker-end="url(#ag-jwt1)"/>
  <text x="340" y="179" text-anchor="middle" fill="#66BB6A" font-size="12" font-weight="bold">3. 200 OK - Entregar token</text>
  <text x="340" y="195" text-anchor="middle" fill="#9e9e9e" font-size="11">{ accessToken: "eyJhbGciOi..." }</text>
  <rect x="10" y="207" width="140" height="24" rx="4" fill="#1a1e2a"/>
  <text x="80" y="223" text-anchor="middle" fill="#42A5F5" font-size="11">4. Almacenar token</text>
  <line x1="85" y1="268" x2="592" y2="268" stroke="#FFA726" stroke-width="1.5" marker-end="url(#ao-jwt1)"/>
  <text x="340" y="254" text-anchor="middle" fill="#FFA726" font-size="12" font-weight="bold">5. GET /api/v1/recurso</text>
  <text x="340" y="270" text-anchor="middle" fill="#CE93D8" font-size="11">Authorization: Bearer eyJhbGci...</text>
  <rect x="530" y="283" width="140" height="24" rx="4" fill="#1e2a20"/>
  <text x="600" y="299" text-anchor="middle" fill="#66BB6A" font-size="11">6. Verificar firma del token</text>
  <line x1="594" y1="333" x2="93" y2="333" stroke="#66BB6A" stroke-width="1.5" marker-end="url(#ag-jwt1)"/>
  <text x="340" y="321" text-anchor="middle" fill="#66BB6A" font-size="12" font-weight="bold">7. 200 OK - Datos del recurso</text>
  <text x="340" y="335" text-anchor="middle" fill="#9e9e9e" font-size="11">{ data: [...] }</text>
  <text x="340" y="390" text-anchor="middle" fill="#546E7A" font-size="11">Stateless: el servidor no guarda sesion — el token lleva toda la informacion</text>
</svg>
```

1. El cliente envía sus credenciales una sola vez, al endpoint de login.
2. El servidor las valida contra la base de datos.
3. Si son correctas, responde con un **token** firmado.
4. El cliente guarda el token.
5. En cada solicitud siguiente, el cliente envía el token en el encabezado `Authorization`.
6. El servidor verifica la firma del token: no consulta ninguna sesión.
7. Si el token es válido, atiende la solicitud.

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

## El camino de las siguientes lecciones

1. **Anatomía de un JWT**: qué hay dentro del token y por qué no se puede falsificar.
2. **JwtService**: el servicio que genera el token.
3. **Endpoint de login**: el endpoint que valida credenciales y entrega el token.
4. **Filtros por Request**: cómo interceptar cada solicitud antes del controller.
5. **Validar el token en un filtro**: el filtro que lee el token y autentica la solicitud.
6. **Errores 401 y 403**: qué responder cuando falta el token o no alcanzan los permisos.
