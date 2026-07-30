# Firestore — reglas e índices

Proyecto: **computacion-fcc47** (`courseId: compunet2`).

Estos dos archivos son la única cosa del sensado que **no** se despliega con la app:
viven en el proyecto de Firebase, no en GitHub Pages. Mientras no se desplieguen, la
analítica no funciona — y lo que es peor, si el proyecto quedó en modo de prueba,
cualquier estudiante autenticado puede leer los datos de sus compañeros.

## Desplegar

```bash
npx firebase-tools login
npx firebase-tools use computacion-fcc47
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

Se ejecuta desde `classnotesapp/`, que es donde está `firebase.json`.

## Marcar al profesor

El acceso de lectura total se concede por *custom claim*, no por una lista de correos
dentro de las reglas: una lista en las reglas se vuelve historial público en el repo.
Se asigna una sola vez, desde un entorno con el Admin SDK (Cloud Shell sirve):

```js
const admin = require('firebase-admin');
admin.initializeApp();
admin.auth().getUserByEmail('TU_CORREO').then(u =>
  admin.auth().setCustomUserClaims(u.uid, { profesor: true })
);
```

El claim entra en el token al renovarlo: hay que cerrar sesión y volver a entrar.

Es la única llave de la **vista de administrador** (`/admin`, `src/admin/`): sin él,
Firestore rechaza tanto el barrido de `students` como la lista de clase de `rosters/`,
y la pantalla lo dice explícitamente en vez de fallar en silencio.

## La lista de clase vive en Firestore, no en el repo

`rosters/{courseId}` guarda la lista que entrega la universidad (`students/262.md`:
código + nombre de cada estudiante). La sube el profesor desde `/admin` con **Cargar
lista (.md)**, y es lo único que el profesor escribe en toda la base.

Está ahí, y no en el bundle ni en el repo de contenido, porque **el sitio es público**:
un `import` del `.md` lo serviría dentro del JS de GitHub Pages, y un `raw.github...`
lo dejaría abierto a cualquiera. En `rosters/` solo lo lee quien tiene el claim.

## Comprobar que quedó bien

En la consola de Firebase → Firestore → Rules → *Playground*:

| Simulación | Resultado esperado |
|---|---|
| `get` en `/students/{otroUid}` autenticado como estudiante | **Denegado** |
| `create` en `/eventBatches/x` con `uid` distinto al autenticado | **Denegado** |
| `update` en `/examAttempts/x` siendo el dueño | **Denegado** (solo creación) |
| `create` en `/eventBatches/x` con el propio `uid` y `count: 20` | Permitido |
| `get` en `/rosters/compunet2` autenticado como estudiante | **Denegado** |

Si la primera sale permitida, el proyecto sigue en modo de prueba y el despliegue no
se aplicó.
