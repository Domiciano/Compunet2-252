# Anatomía de un JWT

<!-- tags: JWT, header payload signature, Base64URL, claims, sub iat exp, firma HMAC, HS384, el payload no está cifrado, token manipulado, jwt.io, secret key -->

Un JWT (JSON Web Token) es un texto con tres partes separadas por puntos: `header.payload.signature`. Este es un token real que genera el código del curso, partido en sus tres partes para que quepa:

```plain
HEADER
eyJhbGciOiJIUzM4NCJ9

PAYLOAD
eyJhdXRob3JpdGllcyI6WyJST0xFX1BST0ZFU09SIl0sInN1YiI6InByb2Zlc29y
QGdtYWlsLmNvbSIsImlhdCI6MTc0NDI5ODQxNSwiZXhwIjoxNzQ0MzAwMjE1fQ

SIGNATURE
ETLoFXS33XS084H-fSV3diLRcqh0Njjh3Ib1cDpqve0H518mYYAAqZjKqkofAHa0
```

En el encabezado HTTP viaja todo junto, en una sola línea y unido por puntos.

Cada parte es un JSON codificado en **Base64URL**, que es una forma de escribir bytes con letras, números, `-` y `_`, para que el token viaje sin problemas en un encabezado HTTP.

## Estructura

Pulse cada parte del token para ver qué tiene adentro. Después cambie el payload, por ejemplo `authorities` a `ROLE_PROFESOR`, y mire qué hace el servidor. Si quiere, intente volver a firmarlo con un secreto inventado.

```interactive
jwt-anatomy
```

## Header

Dice con qué algoritmo se firmó el token. `eyJhbGciOiJIUzM4NCJ9` decodificado es:

```json
{
  "alg": "HS384"
}
```

`HS384` es HMAC con SHA-384: una firma con **clave secreta** que solo conoce el servidor.

## Payload

Lleva los datos del usuario. Cada dato se llama **claim**. Este es el payload del token de arriba, decodificado:

```json
{
  "authorities": ["ROLE_PROFESOR"],
  "sub": "profesor@gmail.com",
  "iat": 1744298415,
  "exp": 1744300215
}
```

Algunos claims tienen nombre estándar:

- `sub` (subject): de quién es el token. Normalmente el username o el email.
- `iat` (issued at): cuándo se emitió, en segundos desde 1970.
- `exp` (expiration): cuándo vence. Un token vencido se rechaza aunque la firma sea válida.

Los demás claims los define uno. Aquí `authorities` lleva los permisos del usuario, para que el servidor no tenga que consultarlos en la base de datos en cada solicitud.

**El payload no está cifrado.** Base64URL es una codificación, no un cifrado: cualquiera que tenga el token puede leerlo. Nunca ponga en el payload contraseñas, números de tarjeta ni nada que no pueda ver el propio usuario.

## Signature

La firma es lo que impide falsificar el token. Se calcula así:

```plain
HMACSHA384(
    base64url(header) + "." + base64url(payload),
    secret
)
```

El resultado se codifica también en Base64URL y es la tercera parte del token. La firma **no** es el header y el payload pegados: es un código calculado a partir de ellos **y del secreto**.

## Cómo se verifica

Cuando llega un token, el servidor:

1. Separa el token en sus tres partes.
2. Vuelve a calcular la firma con el header, el payload y **su** secreto.
3. Compara la firma calculada con la que trae el token.

Si alguien cambia el payload, por ejemplo `"ROLE_ESTUDIANTE"` por `"ROLE_PROFESOR"`, la firma calculada ya no coincide y el token se rechaza. Para fabricar una firma válida haría falta el secreto, que nunca sale del servidor.

Por eso el secreto es lo más importante de todo el mecanismo: quien lo tenga puede emitir tokens a nombre de cualquier usuario.

## Pruébelo

Pegue un token en [jwt.io](https://jwt.io) y verá el header y el payload decodificados. Si cambia una letra del payload, el sitio le muestra que la firma deja de ser válida.
