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

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="680" height="320" font-family="Roboto, Arial, sans-serif">
  <rect width="680" height="320" fill="#12121f" rx="12"/>
  <text x="340" y="28" text-anchor="middle" fill="#e0e0e0" font-size="15" font-weight="bold">Estructura de un JSON Web Token (JWT)</text>
  <rect x="14" y="44" width="198" height="34" rx="6" fill="#B71C1C"/>
  <text x="113" y="65" text-anchor="middle" fill="white" font-size="11" font-family="Courier New, monospace">eyJhbGciOiJIUzM4NCJ9</text>
  <text x="215" y="65" text-anchor="middle" fill="#ccc" font-size="20">.</text>
  <rect x="224" y="44" width="234" height="34" rx="6" fill="#6A1B9A"/>
  <text x="341" y="65" text-anchor="middle" fill="white" font-size="11" font-family="Courier New, monospace">eyJhdXRob3JpdGllcyI6WyJS...</text>
  <text x="461" y="65" text-anchor="middle" fill="#ccc" font-size="20">.</text>
  <rect x="470" y="44" width="196" height="34" rx="6" fill="#1565C0"/>
  <text x="568" y="65" text-anchor="middle" fill="white" font-size="11" font-family="Courier New, monospace">ETLoFXS33XS084H-fSV...</text>
  <text x="113" y="93" text-anchor="middle" fill="#EF5350" font-size="12" font-weight="bold">HEADER</text>
  <text x="341" y="93" text-anchor="middle" fill="#CE93D8" font-size="12" font-weight="bold">PAYLOAD</text>
  <text x="568" y="93" text-anchor="middle" fill="#42A5F5" font-size="12" font-weight="bold">SIGNATURE</text>
  <rect x="14" y="103" width="198" height="80" rx="6" fill="#1a1a2e" stroke="#EF5350" stroke-width="1"/>
  <text x="113" y="120" text-anchor="middle" fill="#EF5350" font-size="10" font-weight="bold">Base64URL decode:</text>
  <text x="113" y="137" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="Courier New, monospace">{</text>
  <text x="113" y="152" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="Courier New, monospace">  "alg": "HS384"</text>
  <text x="113" y="167" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="Courier New, monospace">}</text>
  <rect x="224" y="103" width="234" height="120" rx="6" fill="#1a1a2e" stroke="#CE93D8" stroke-width="1"/>
  <text x="341" y="120" text-anchor="middle" fill="#CE93D8" font-size="10" font-weight="bold">Base64URL decode:</text>
  <text x="341" y="137" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="Courier New, monospace">{</text>
  <text x="341" y="152" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="Courier New, monospace">  "sub": "profesor@gmail.com",</text>
  <text x="341" y="167" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="Courier New, monospace">  "iat": 1744298415,</text>
  <text x="341" y="182" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="Courier New, monospace">  "exp": 1744300215</text>
  <text x="341" y="197" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="Courier New, monospace">}</text>
  <rect x="470" y="103" width="196" height="120" rx="6" fill="#1a1a2e" stroke="#42A5F5" stroke-width="1"/>
  <text x="568" y="120" text-anchor="middle" fill="#42A5F5" font-size="10" font-weight="bold">HMACSHA384(</text>
  <text x="568" y="140" text-anchor="middle" fill="#e0e0e0" font-size="10" font-family="Courier New, monospace">base64(header)</text>
  <text x="568" y="157" text-anchor="middle" fill="#9e9e9e" font-size="10">+ "." +</text>
  <text x="568" y="174" text-anchor="middle" fill="#e0e0e0" font-size="10" font-family="Courier New, monospace">base64(payload),</text>
  <text x="568" y="191" text-anchor="middle" fill="#9e9e9e" font-size="10">secret</text>
  <text x="568" y="208" text-anchor="middle" fill="#42A5F5" font-size="10">)</text>
  <text x="340" y="255" text-anchor="middle" fill="#FFA726" font-size="12" font-weight="bold">Header y Payload son legibles — la Signature los protege</text>
  <text x="340" y="275" text-anchor="middle" fill="#546E7A" font-size="11">Nunca guardes datos sensibles (contrasenas, tarjetas) en el Payload</text>
  <text x="340" y="295" text-anchor="middle" fill="#546E7A" font-size="11">Sin el secret, un atacante no puede generar una firma valida</text>
</svg>
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
