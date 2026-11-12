# Manejo de errores

<!-- tags: try catch, propagar errores, capa de services, err.response.status, mostrar mensaje de error, error 401 en el login, async await, Network Error, el error no llega a la vista, throw new Error -->

Cuando el login falla, el usuario tiene que verlo en pantalla. La regla es simple: **el service no atrapa el error, la vista sí**. El service hace la petición; la vista decide qué mensaje mostrar.

```svg
<svg id="errProp" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 400" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="errProp-ttl errProp-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="errProp-ttl">El error sube hasta la vista</title>
  <desc id="errProp-dsc">Cuatro pasos en fila. Uno, el backend responde 401 porque las credenciales no sirven. Dos, Axios lanza un error en el await api.post. Tres, login() en la capa de services no lo atrapa, así que el error sigue subiendo. Cuatro, handleLogin en la vista lo atrapa con try catch y llama a setError. Debajo del cuarto paso, la pantalla muestra el mensaje Usuario o contraseña incorrectos.</desc>
  <defs>
    <style>
      #errProp .title{fill:#161A26;font-size:22px;font-weight:700}
      #errProp .sub{fill:#79809A;font-size:13.5px}
      #errProp .foot{fill:#79809A;font-size:12px}
      #errProp .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #errProp .ar-red{fill:none;stroke:#C2413A;stroke-width:1.75;marker-end:url(#errProp-ar-red)}
    </style>
    <marker id="errProp-ar-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2413A"/></marker>
  </defs>
  <rect width="960" height="400" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">El error sube hasta la vista</text>
  <text class="sub" x="48" y="80" data-fit="860">El service no atrapa nada. El primer try/catch que encuentra el error es el de la vista.</text>

  <rect x="60" y="112" width="192" height="140" rx="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.75"/>
  <circle cx="88" cy="140" r="13" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.5"/><text x="88" y="140" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#4453C9">1</text>
  <text x="110" y="140" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9" data-fit="130">Backend</text>
  <rect x="76" y="166" width="160" height="28" rx="6" fill="#FFFFFF"/>
  <text class="mono" x="156" y="180" dy="0.35em" text-anchor="middle" font-size="11" fill="#454C61" data-fit="152">401 Unauthorized</text>
  <text x="76" y="222" font-size="12" fill="#556074" data-fit="160">credenciales malas</text>

  <rect x="276" y="112" width="192" height="140" rx="12" fill="#FDECEA" stroke="#EBA59F" stroke-width="1.75"/>
  <circle cx="304" cy="140" r="13" fill="#FFFFFF" stroke="#EBA59F" stroke-width="1.5"/><text x="304" y="140" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#C2413A">2</text>
  <text x="326" y="140" dy="0.35em" font-size="14" font-weight="700" fill="#C2413A" data-fit="130">Axios lanza</text>
  <rect x="292" y="166" width="160" height="28" rx="6" fill="#FFFFFF"/>
  <text class="mono" x="372" y="180" dy="0.35em" text-anchor="middle" font-size="11" fill="#454C61" data-fit="152">await api.post(…)</text>
  <text x="292" y="222" font-size="12" fill="#556074" data-fit="160">status que no es 2xx</text>

  <rect x="492" y="112" width="192" height="140" rx="12" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.75" stroke-dasharray="6 4"/>
  <circle cx="520" cy="140" r="13" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/><text x="520" y="140" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#556074">3</text>
  <text x="542" y="140" dy="0.35em" font-size="14" font-weight="700" fill="#556074" data-fit="130">Service</text>
  <rect x="508" y="166" width="160" height="28" rx="6" fill="#F3F5F9"/>
  <text class="mono" x="588" y="180" dy="0.35em" text-anchor="middle" font-size="11" fill="#454C61" data-fit="152">login()</text>
  <text x="508" y="222" font-size="12" fill="#556074" data-fit="160">sin catch: lo deja pasar</text>

  <rect x="708" y="112" width="192" height="140" rx="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="2.5"/>
  <circle cx="736" cy="140" r="13" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.5"/><text x="736" y="140" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#3A8235">4</text>
  <text x="758" y="140" dy="0.35em" font-size="14" font-weight="700" fill="#3A8235" data-fit="130">Vista</text>
  <rect x="724" y="166" width="160" height="28" rx="6" fill="#FFFFFF"/>
  <text class="mono" x="804" y="180" dy="0.35em" text-anchor="middle" font-size="11" fill="#454C61" data-fit="152">catch → setError</text>
  <text x="724" y="222" font-size="12" fill="#556074" data-fit="160">en handleLogin</text>

  <path class="ar-red" d="M254,182 H270"/>
  <path class="ar-red" d="M470,182 H486"/>
  <path class="ar-red" d="M686,182 H702"/>

  <path d="M804,254 V288" stroke="#9FD68D" stroke-width="1.5" stroke-dasharray="4 4" fill="none"/>
  <rect x="644" y="288" width="256" height="48" rx="10" fill="#FFFFFF" stroke="#EBA59F" stroke-width="1.5"/>
  <text x="772" y="312" dy="0.35em" text-anchor="middle" font-size="12.5" fill="#C2413A" data-fit="236">Usuario o contraseña incorrectos</text>

  <text class="foot" x="48" y="372" data-fit="860">Si el service hiciera su propio try/catch, el error moriría ahí y la vista creería que todo salió bien.</text>
</svg>
```

## El service deja pasar el error

`login()` en `services/AuthServices.js` se queda **sin** `try/catch`. De paso, deja de usar un usuario fijo: recibe el usuario y la contraseña que escribió la persona. Si el backend responde con un error, `await api.post(...)` lanza, y como `login` es `async`, el error sale de la función hacia quien la llamó.

```js
async function login(username, password) {
  const response = await api.post('/auth/login', { username, password });
  console.log(response.data.accessToken);
}
```

## La vista lo atrapa

En la vista (hoy `App.jsx`) hace falta un estado para el mensaje:

```jsx
const [error, setError] = useState('');
```

En `handleLogin`, la llamada va dentro de un `try`. Para que el error llegue al `catch`, `handleLogin` tiene que ser `async` y esperar a `login` con `await`:

```jsx
try {
  await login(username, password);
} catch (err) {
  setError('Usuario o contraseña incorrectos');
}
```

Y en el JSX, el mensaje solo aparece si hay uno:

```jsx
{error && <p>{error}</p>}
```

## Distinguir el error

`err.response` es la respuesta del backend. Si no existe, la petición ni llegó: el backend está apagado o hay un problema de **CORS**.

```jsx
if (err.response?.status === 401) {
  setError('Usuario o contraseña incorrectos');
} else {
  setError('No se pudo conectar con el servidor');
}
```

## El error típico

Poner el `try/catch` en el service con un `console.log` adentro. El error muere ahí, `login()` termina "bien" y la vista sigue como si el usuario hubiera entrado. Si el service necesita hacer algo con el error, al final lo vuelve a lanzar con `throw err` para que siga subiendo.
