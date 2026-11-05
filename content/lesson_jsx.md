# JSX

<!-- tags: JSX, className, fragmento, llaves en JSX, React.createElement, Adjacent JSX elements must be wrapped, class vs className, etiqueta sin cerrar, componente en minúscula -->

JSX es **JavaScript que parece HTML**. No es HTML ni es texto: el bundler lo convierte en llamadas a funciones de JavaScript que describen qué dibujar. Por eso el navegador nunca ve JSX.

## Pruébalo

Edita el código de la izquierda. A la derecha ves lo que se dibuja, el árbol de elementos que describe ese JSX y, abajo, el JavaScript en que se convierte. Recorre las pestañas: cada una muestra una regla.

```interactive
jsx-live
```

## Las reglas

**Un solo elemento raíz.** Un componente devuelve **un** árbol. Dos etiquetas sueltas en el `return` dan el error *Adjacent JSX elements must be wrapped in an enclosing tag* (pestaña *Dos raíces*). Se envuelven en un `<div>` o en un fragmento `<>…</>`, que agrupa sin agregar nada al DOM.

**Llaves para JavaScript.** Entre `{ }` va cualquier **expresión**: una variable, una cuenta, un ternario, un `map`. No caben sentencias como `if` o `for`; para eso están el ternario y `map` (pestañas *Expresiones* y *Lista con map*).

**`className`, no `class`.** JSX es JavaScript y `class` es palabra reservada. Lo mismo con `for` en un `<label>`, que se escribe `htmlFor`.

**Todo se cierra.** `<input />`, `<br />`, `<img />` llevan la barra, aunque en HTML no la necesiten.

**Atributos en camelCase.** `onClick`, `tabIndex`, y `style` recibe un objeto: `style={{ color: "teal" }}` (las llaves de afuera son de JSX, las de adentro son del objeto).

**Mayúscula para componentes.** `<header>` es una etiqueta HTML; `<Header>` es tu componente. Es lo que veremos en la siguiente lección.
