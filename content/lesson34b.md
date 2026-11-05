# Children y Listas

<!-- tags: children, prop children, map en JSX, key, Each child in a list should have a unique key, listas en React, componente contenedor -->

Ya sabes pasar datos con props. Aquí dos usos más: pasar **JSX** como contenido de un componente, y dibujar una lista a partir de un arreglo.

## La prop especial: children

`children` es una prop que React pasa automáticamente con el contenido que escribes entre las etiquetas de apertura y cierre de un componente. Sirve para crear componentes "contenedor" que envuelven a otros.

```jsx
function Tarjeta({ titulo, children }) {
  return (
    <div className="tarjeta">
      <h2>{titulo}</h2>
      {children}
    </div>
  )
}
```

Para usarlo, en lugar de escribir el componente como etiqueta autocerrada (`<Tarjeta />`), escríbelo con apertura y cierre, y coloca el contenido adentro:

```jsx
function App() {
  return (
    <Tarjeta titulo="Sensor A">
      <p>Temperatura: 22°C</p>
      <p>Estado: activo</p>
    </Tarjeta>
  )
}
```

Todo lo que esté entre `<Tarjeta>` y `</Tarjeta>` llega al componente como `children`. Puede ser texto, otros componentes, o cualquier JSX válido.

## Cuándo usar children

`children` es útil cuando el componente define la estructura (bordes, sombra, espaciado) pero el contenido interno varía según el contexto. Por ejemplo: tarjetas, modales, paneles, layouts.

```jsx
function Panel({ titulo, children }) {
  return (
    <section style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
      <h3>{titulo}</h3>
      {children}
    </section>
  )
}

function App() {
  return (
    <div>
      <Panel titulo="Dispositivos activos">
        <p>Sensor A — Temperatura</p>
        <p>Sensor B — Humedad</p>
      </Panel>

      <Panel titulo="Alertas">
        <p>Sin alertas recientes.</p>
      </Panel>
    </div>
  )
}
```

## Renderizar listas con .map()

Cuando tenemos un arreglo de datos, usamos `.map()` para convertir cada elemento en un componente. React requiere que cada elemento tenga una prop `key` única.

Supón un componente que recibe dos props:

```jsx
function Dispositivo({ nombre, tipo }) {
  return <p>{nombre} — {tipo}</p>;
}
```

```jsx
const dispositivos = [
  { id: 1, nombre: "Sensor A", tipo: "Temperatura" },
  { id: 2, nombre: "Sensor B", tipo: "Humedad" },
  { id: 3, nombre: "Sensor C", tipo: "Presión" },
]

function App() {
  return (
    <div>
      {dispositivos.map((dispositivo) => (
        <Dispositivo
          key={dispositivo.id}
          nombre={dispositivo.nombre}
          tipo={dispositivo.tipo}
        />
      ))}
    </div>
  )
}
```

La prop `key` no se muestra en pantalla. React la usa internamente para saber qué elementos actualizar cuando los datos cambian. Debe ser un valor único y estable —preferentemente el `id` del dato, no el índice del arreglo.

## Resumen

- `children` es el contenido escrito entre las etiquetas del componente
- `.map()` convierte un arreglo de datos en un arreglo de componentes
- Cada elemento renderizado con `.map()` necesita una prop `key` única
